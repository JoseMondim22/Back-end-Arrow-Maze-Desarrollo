# Arrow Maze — Backend

Backend de **Arrow Maze — Escape Puzzle**: NestJS + TypeScript + PostgreSQL, implementado con
Clean Architecture (4 capas), DDD táctico, CQS y AOP vía Decorator.

> El backend **no contiene lógica de juego**. Solo crea, valida estructuralmente y sirve niveles,
> usuarios, progreso y leaderboard. Movimiento, rotación, colisión y puntuación viven en el
> cliente (repositorio hermano).

## Tech Stack

| Área | Decisión |
| --- | --- |
| Framework | NestJS |
| Lenguaje | TypeScript (`strict: true`) |
| Base de datos | PostgreSQL + TypeORM |
| Auth | Passport + JWT (`@nestjs/jwt`) |
| Hashing | bcryptjs |
| Docs | Swagger / OpenAPI (`@nestjs/swagger`) |
| Testing | Jest + Supertest + `sql.js` (SQLite en memoria para integración) |

## Setup

```bash
npm install
npm run start:dev      # desarrollo con watch
npm run build           # compila a dist/
npm run start:prod      # corre dist/main.js
npm run typecheck        # tsc --noEmit
npm test                 # unit + integración + contrato
```

## Arquitectura — Clean Architecture (4 capas)

```
Frameworks / Infrastructure → Interface Adapters → Application (Use Cases) → Domain
```

- **Domain** no importa nada de las capas externas.
- **Application** importa solo clases de dominio e interfaces de puerto.
- **Interface Adapters** implementa los puertos y traduce entre capas (DTOs ↔ dominio ↔ entidades ORM).
- **Infrastructure** cablea todo: el Composition Root **es** el sistema de módulos de NestJS
  (`src/infrastructure/modules/`), inicializado una sola vez desde `src/main.ts`.

### Diagrama de capas

Las flechas indican la única dirección permitida de dependencia (**Dependency Rule**): una capa
más externa puede importar una más interna, nunca al revés. `Domain` no conoce ninguna otra capa.

```mermaid
flowchart TB
    subgraph L4["Layer 4 — Frameworks &amp; Infrastructure"]
        direction LR
        Modules["NestJS Modules<br/>(Composition Root)"]
        Concrete["Bcrypt / Jwt / TypeORM DataSource<br/>Console Logger / System Time"]
    end

    subgraph L3["Layer 3 — Interface Adapters"]
        direction LR
        Controllers["Controllers"]
        Decorators["AOP Decorators<br/>(Logging*, Secure*)"]
        Repos["TypeOrm*Repository"]
        Mappers["Mappers"]
        DTOs["DTOs"]
    end

    subgraph L2["Layer 2 — Application (Use Cases)"]
        direction LR
        UseCases["Use Cases<br/>(ICommandService / IQueryService)"]
        Ports["Technical Ports<br/>(IIdGenerator, IPasswordHasher, ...)"]
    end

    subgraph L1["Layer 1 — Domain"]
        direction LR
        Aggregates["Aggregates<br/>User · Level · Progress"]
        RepoPorts["Repository Ports<br/>(I*Repository)"]
    end

    L4 --> L3 --> L2 --> L1

    style L1 fill:#2d6a4f,color:#fff
    style L2 fill:#40916c,color:#fff
    style L3 fill:#74c69d,color:#000
    style L4 fill:#b7e4c7,color:#000
```

### Agregados de dominio

- **`User`** (root) — `UserId`, `Email`, `Password`, `Username`. Puerto: `IUserRepository`.
- **`Level`** (root) — `Board`, `LevelRules`, `LevelOrder`, `LevelId`. Puerto: `ILevelRepository`.
  - `Board` es un **grafo**, no una matriz: `CellNode[]` + `Edge[]` + `Chain[]`.
  - `CellType` es polimórfico: `GridArrowCell` (implementa `ArrowCell extends CellType`),
    `WallCell`, `EmptyCell`, `ExitCell`.
- **`Progress`** (root) — referencia `UserId`/`LevelId` **por id**, nunca por objeto.
  Puerto: `IProgressRepository`.

### CQS (Command-Query Separation)

Cada caso de uso implementa exactamente uno de estos dos puertos de método único:

```ts
interface ICommandService<TCommand> { execute(command: TCommand): Promise<void> }
interface IQueryService<TQuery, TResult> { execute(query: TQuery): Promise<TResult> }
```

### AOP vía Decorator

En vez de una librería de AOP, los *cross-cutting concerns* (logging, autenticación) son
decoradores que envuelven el mismo puerto CQS que el caso de uso real:

```
SecureXDecorator( LoggingXDecorator( UseCaseReal ) )
```

#### Los 4 decoradores

Hay un par por cada lado de CQS — uno para `ICommandService<TCommand>`, otro para
`IQueryService<TQuery, TResult>` — porque un decorador solo puede envolver el puerto que
implementa; mezclar ambos en una interfaz rompería CQS también en la capa de adapters.

| Decorador | Envuelve | Qué hace |
| --- | --- | --- |
| `LoggingCommandDecorator<TCommand>` | `ICommandService<TCommand>` | Loguea inicio/fin/duración/error vía `runWithLogging` (helper compartido) |
| `LoggingQueryDecorator<TQuery, TResult>` | `IQueryService<TQuery, TResult>` | Igual que el anterior, para el lado de lectura |
| `SecureCommandDecorator<TCommand>` | `ICommandService<TCommand>` | Llama `currentUser.ensureAuthenticated()` antes de delegar — si el JWT es inválido/expiró, lanza `UnauthorizedError` sin ejecutar el caso de uso |
| `SecureQueryDecorator<TQuery, TResult>` | `IQueryService<TQuery, TResult>` | Igual que el anterior, para queries |

```ts
// src/interface-adapters/decorators/command/secure-command.decorator.ts
export class SecureCommandDecorator<TCommand> implements ICommandService<TCommand> {
  constructor(
    private readonly decoratee: ICommandService<TCommand>,
    private readonly currentUser: CurrentUserProvider,
  ) {}

  async execute(command: TCommand): Promise<void> {
    this.currentUser.ensureAuthenticated();
    return this.decoratee.execute(command);
  }
}
```

`CurrentUserProvider` (`decorators/shared/current-user.provider.ts`) es **una instancia por
request**: envuelve el JWT crudo y memoiza el resultado de `ITokenGenerator.verify()`, para que
tanto el decorator (que solo necesita saber "¿está autenticado?") como el controller (que además
necesita `getUserId()`) decodifiquen el token una sola vez.

El wiring real (`src/infrastructure/modules/*.module.ts`) arma la cadena por `useFactory`:

```ts
// progress.module.ts
useFactory: (levelRepo, progressRepo, idGen, logger, timeProvider) =>
  (currentUser: CurrentUserProvider) =>
    new SecureCommandDecorator(
      new LoggingCommandDecorator(new SyncProgressUseCase(levelRepo, progressRepo, idGen), logger, timeProvider),
      currentUser,
    ),
```

`AuthController` es la única excepción: sus dos casos de uso (`register`, `login`) solo pasan
por `LoggingXDecorator`, sin `SecureXDecorator`, porque son los únicos endpoints públicos —
exigir un JWT para poder loguearse sería circular.

#### Cómo esto aplica SOLID

- **SRP (responsabilidad única).** El caso de uso real solo conoce su regla de negocio.
  `LoggingCommandDecorator` solo sabe medir tiempo y loguear. `SecureCommandDecorator` solo sabe
  verificar sesión. Cada clase cambia por una única razón.
- **OCP (abierto/cerrado).** Agregar un aspecto nuevo (ej. caching, rate limiting) es crear un
  decorador nuevo que implemente el mismo puerto — **cero** cambios en los casos de uso existentes
  ni en los decoradores ya escritos.
- **LSP (sustitución de Liskov).** `LoggingCommandDecorator<T>`, `SecureCommandDecorator<T>` y
  `SyncProgressUseCase` son intercambiables en cualquier punto que espere un
  `ICommandService<SyncProgressCommand>` — el controller nunca sabe si está llamando al caso de
  uso real o a 2 decoradores anidados encima.
- **ISP (segregación de interfaces).** `ICommandService`/`IQueryService` son puertos de **un solo
  método** (`execute`). Un decorador no está obligado a implementar nada que no necesite.
- **DIP (inversión de dependencias).** Los decoradores dependen de la abstracción CQS
  (`ICommandService<TCommand>`), nunca de una clase concreta como `SyncProgressUseCase` —
  por eso el mismo `LoggingCommandDecorator` sirve para los 4 comandos del proyecto sin
  duplicar código.

Esto también es el **patrón GoF Decorator** en su forma clásica: cada decorador implementa la
misma interfaz que envuelve (`decoratee: ICommandService<TCommand>`) y delega en ella, agregando
comportamiento antes/después sin herencia ni modificar la clase envuelta.

## Diagrama de clases

> Generado a partir del código fuente real (`src/`), no de una plantilla genérica.
> Renderiza en GitHub/GitLab de forma nativa (Mermaid).

### Domain — `Level` (agregado principal)

```mermaid
classDiagram
    class Level {
        -LevelId id
        -Board board
        -LevelRules rules
        -LevelOrder order
        +create(...)$ Level
        +reconstitute(...)$ Level
        +isScorePlausible(score) boolean
        +getId() LevelId
        +getBoard() Board
        +getRules() LevelRules
        +getOrder() LevelOrder
    }
    class Board {
        -CellNode[] nodes
        -Edge[] edges
        -Chain[] chains
        +create(nodes, edges, chains)$ Board
        +getNodes() CellNode[]
        +getEdges() Edge[]
        +getChains() Chain[]
    }
    class CellNode {
        -NodeId id
        -Position position
        -CellType cellType
        +create(id, position, cellType)$ CellNode
    }
    class Edge {
        -NodeId from
        -NodeId to
        +create(from, to)$ Edge
    }
    class Chain {
        -ChainId id
        -NodeId[] nodeIds
        +create(id, nodeIds)$ Chain
    }
    class LevelRules {
        -number timeLimit
        -number maxMoves
        -number maxPossibleScore
        -number difficulty
        +create(...)$ LevelRules
    }
    class NodeId { -string value }
    class ChainId { -string value }
    class LevelId { -string value }
    class LevelOrder { -number value }

    class Position { <<interface>> +equals(other) boolean }
    class Direction { <<interface>> +equals(other) boolean }
    class CellType { <<interface>> +equals(other) boolean }
    class ArrowCell { <<interface>> +getDirection() Direction }

    class GridPosition {
        -number row
        -number column
        +create(row, column)$ GridPosition
    }
    class GridDirection {
        -string value
        +create(value)$ GridDirection
    }
    class GridArrowCell {
        -Direction direction
        +create(direction)$ GridArrowCell
        +getDirection() Direction
    }
    class WallCell { +create()$ WallCell }
    class EmptyCell { +create()$ EmptyCell }
    class ExitCell { +create()$ ExitCell }

    class CellFactory {
        <<factory>>
        +create(rawData)$ CellType
    }

    class ILevelRepository {
        <<interface>>
        +findById(id) Level
        +findAll() Level[]
        +save(level) void
    }

    Level "1" *-- "1" Board
    Level "1" *-- "1" LevelRules
    Level "1" *-- "1" LevelOrder
    Level "1" *-- "1" LevelId
    Board "1" *-- "1..*" CellNode
    Board "1" *-- "0..*" Edge
    Board "1" *-- "0..*" Chain
    CellNode --> NodeId
    CellNode --> Position
    CellNode --> CellType
    Edge --> "2" NodeId
    Chain "1" *-- "1..*" NodeId
    Chain --> ChainId
    GridPosition ..|> Position
    GridDirection ..|> Direction
    ArrowCell --|> CellType
    GridArrowCell ..|> ArrowCell
    WallCell ..|> CellType
    EmptyCell ..|> CellType
    ExitCell ..|> CellType
    CellFactory ..> GridArrowCell : creates
    CellFactory ..> WallCell : creates
    CellFactory ..> EmptyCell : creates
    CellFactory ..> ExitCell : creates
    ILevelRepository ..> Level
```

### Domain — `User` y `Progress`

```mermaid
classDiagram
    class User {
        -UserId id
        -Email email
        -Password password
        -Username username
        +register(...)$ User
        +reconstitute(...)$ User
    }
    class UserId { -string value }
    class Email { -string value }
    class Password {
        -string hash
        +ensureIsStrong(plainText)$ void
        +fromHash(hash)$ Password
    }
    class Username { -string value }
    class IUserRepository {
        <<interface>>
        +findById(id) User
        +findByEmail(email) User
        +save(user) void
    }

    class Progress {
        -ProgressId id
        -UserId userId
        -LevelId levelId
        -Score bestScore
        +create(...)$ Progress
        +registerAttempt(score) void
    }
    class ProgressId { -string value }
    class Score {
        -number value
        +isHigherThan(other) boolean
    }
    class IProgressRepository {
        <<interface>>
        +findByUserAndLevel(userId, levelId) Progress
        +findTopScoresByLevel(levelId, limit) Progress[]
        +findAllByUser(userId) Progress[]
        +save(progress) void
    }

    User "1" *-- "1" UserId
    User "1" *-- "1" Email
    User "1" *-- "1" Password
    User "1" *-- "1" Username
    IUserRepository ..> User

    Progress "1" *-- "1" ProgressId
    Progress "1" *-- "1" Score
    Progress --> UserId : references by id
    Progress --> LevelId : references by id
    IProgressRepository ..> Progress
```

### Application — CQS + Use Cases

```mermaid
classDiagram
    class ICommandService~TCommand~ {
        <<interface>>
        +execute(command) Promise~void~
    }
    class IQueryService~TQuery,TResult~ {
        <<interface>>
        +execute(query) Promise~TResult~
    }

    class CreateLevelUseCase { +execute(CreateLevelCommand) Promise~void~ }
    class RegisterUserUseCase { +execute(RegisterUserCommand) Promise~void~ }
    class SyncProgressUseCase { +execute(SyncProgressCommand) Promise~void~ }
    class GetLevelsUseCase { +execute(GetLevelsQuery) Promise~Level[]~ }
    class GetLeaderboardUseCase { +execute(GetLeaderboardQuery) Promise~LeaderboardEntryResult[]~ }
    class GetPlayerProgressUseCase { +execute(GetPlayerProgressQuery) Promise~Progress[]~ }
    class LoginUseCase { +execute(LoginQuery) Promise~LoginResult~ }

    CreateLevelUseCase ..|> ICommandService~CreateLevelCommand~
    RegisterUserUseCase ..|> ICommandService~RegisterUserCommand~
    SyncProgressUseCase ..|> ICommandService~SyncProgressCommand~
    GetLevelsUseCase ..|> IQueryService~GetLevelsQuery,Level[]~
    GetLeaderboardUseCase ..|> IQueryService~GetLeaderboardQuery,LeaderboardEntryResult[]~
    GetPlayerProgressUseCase ..|> IQueryService~GetPlayerProgressQuery,Progress[]~
    LoginUseCase ..|> IQueryService~LoginQuery,LoginResult~

    CreateLevelUseCase --> ILevelRepository
    CreateLevelUseCase --> IIdGenerator
    RegisterUserUseCase --> IUserRepository
    RegisterUserUseCase --> IIdGenerator
    RegisterUserUseCase --> IPasswordHasher
    SyncProgressUseCase --> ILevelRepository
    SyncProgressUseCase --> IProgressRepository
    SyncProgressUseCase --> IIdGenerator
    GetLevelsUseCase --> ILevelRepository
    GetLeaderboardUseCase --> IProgressRepository
    GetLeaderboardUseCase --> IUserRepository
    GetPlayerProgressUseCase --> IProgressRepository
    LoginUseCase --> IUserRepository
    LoginUseCase --> IPasswordHasher
    LoginUseCase --> ITokenGenerator

    class IIdGenerator { <<interface>> +generate() string }
    class IPasswordHasher {
        <<interface>>
        +hash(plainText) Promise~string~
        +verify(plainText, hash) Promise~boolean~
    }
    class ITokenGenerator {
        <<interface>>
        +generate(userId) string
        +verify(token) ITokenPayload
    }
    class ILogger { <<interface>> +log(message) void }
    class ITimeProvider { <<interface>> +now() Date }
```

### Interface Adapters — AOP (Decorator) y Repositorios

```mermaid
classDiagram
    class ICommandService~T~ { <<interface>> }
    class IQueryService~T,R~ { <<interface>> }

    class LoggingCommandDecorator~T~ {
        -ICommandService~T~ decoratee
        -ILogger logger
        -ITimeProvider timeProvider
        +execute(command) Promise~void~
    }
    class LoggingQueryDecorator~T,R~ {
        -IQueryService~T,R~ decoratee
        +execute(query) Promise~R~
    }
    class SecureCommandDecorator~T~ {
        -ICommandService~T~ decoratee
        -CurrentUserProvider currentUser
        +execute(command) Promise~void~
    }
    class SecureQueryDecorator~T,R~ {
        -IQueryService~T,R~ decoratee
        -CurrentUserProvider currentUser
        +execute(query) Promise~R~
    }
    class CurrentUserProvider {
        -ITokenGenerator tokenGenerator
        -string token
        +ensureAuthenticated() void
        +getUserId() string
    }

    LoggingCommandDecorator ..|> ICommandService~T~
    LoggingCommandDecorator o-- ICommandService~T~ : decoratee
    LoggingQueryDecorator ..|> IQueryService~T,R~
    LoggingQueryDecorator o-- IQueryService~T,R~ : decoratee
    SecureCommandDecorator ..|> ICommandService~T~
    SecureCommandDecorator o-- ICommandService~T~ : decoratee
    SecureCommandDecorator --> CurrentUserProvider
    SecureQueryDecorator ..|> IQueryService~T,R~
    SecureQueryDecorator o-- IQueryService~T,R~ : decoratee
    SecureQueryDecorator --> CurrentUserProvider

    class TypeOrmUserRepository { +findById(id) User +findByEmail(email) User +save(user) void }
    class TypeOrmLevelRepository { +findById(id) Level +findAll() Level[] +save(level) void }
    class TypeOrmProgressRepository { +findByUserAndLevel(...) Progress +findTopScoresByLevel(...) Progress[] +findAllByUser(userId) Progress[] +save(p) void }
    class UserMapper { +toDomain(entity)$ User +toEntity(user)$ UserEntity }
    class LevelMapper { +toDomain(entity)$ Level +toEntity(level)$ LevelEntity }
    class ProgressMapper { +toDomain(entity)$ Progress +toEntity(p)$ ProgressEntity }
    class BoardMapper { +toDomain(nodes, edges, chains)$ Board +toRaw(board)$ }

    TypeOrmUserRepository ..|> IUserRepository
    TypeOrmUserRepository --> UserMapper
    TypeOrmLevelRepository ..|> ILevelRepository
    TypeOrmLevelRepository --> LevelMapper
    TypeOrmProgressRepository ..|> IProgressRepository
    TypeOrmProgressRepository --> ProgressMapper
    LevelMapper ..> BoardMapper
    BoardMapper ..> CellFactory

    class AuthController { +register(dto) Promise~void~ +login(dto) TokenDTO }
    class LevelController { +getLevels(authHeader) LevelDTO[] +createLevel(dto, authHeader) Promise~void~ }
    class ProgressController { +getPlayerProgress(authHeader) PlayerProgressEntryDTO[] +sync(dto, authHeader) Promise~void~ }
    class LeaderboardController { +getLeaderboard(levelId, authHeader) LeaderboardEntryDTO[] }
    class DomainExceptionFilter { +catch(error, host) void }

    AuthController --> ICommandService~T~
    AuthController --> IQueryService~T,R~
    LevelController --> CurrentUserProvider
    ProgressController --> CurrentUserProvider
    LeaderboardController --> CurrentUserProvider
```

## Reglas de dominio (invariantes)

- `Board` valida: nodos no vacíos, **al menos una `ExitCell`**, edges referencian `NodeId`s
  válidos, cada `Chain` referencia nodos existentes, sin duplicados, con cabeza `grid_arrow`
  y cuerpo `empty`.
- `Progress.registerAttempt(score)` — `bestScore` es **monótono**: solo se actualiza si el
  nuevo puntaje es mayor.
- `Level.isScorePlausible(score)` — rechaza puntajes que excedan `maxPossibleScore`.
- El backend **no interpreta** `row`/`column` ni `direction`: son datos para el cliente.

## API Endpoints

| Método | Path | Auth | Caso de uso |
| --- | --- | --- | --- |
| POST | `/auth/register` | público | `RegisterUserUseCase` |
| POST | `/auth/login` | público | `LoginUseCase` |
| GET | `/levels` | JWT | `GetLevelsUseCase` |
| POST | `/levels` | JWT | `CreateLevelUseCase` |
| POST | `/progress/sync` | JWT | `SyncProgressUseCase` |
| GET | `/progress` | JWT | `GetPlayerProgressUseCase` |
| GET | `/leaderboard/:levelId` | JWT | `GetLeaderboardUseCase` |

## Estructura de carpetas

```
src/
├─ domain/                # Capa 1 — sin dependencias externas
│  ├─ user/                # User, VOs, IUserRepository
│  ├─ level/                # Level, Board, CellNode, Edge, Chain, CellType*, ILevelRepository
│  └─ progress/             # Progress, Score, IProgressRepository
├─ application/            # Capa 2 — CQS
│  ├─ ports/                 # ICommandService, IQueryService, IIdGenerator, ILogger, ...
│  ├─ commands/ queries/ results/
│  └─ use-cases/
├─ interface-adapters/     # Capa 3
│  ├─ controllers/           # Auth, Level, Progress, Leaderboard + DomainExceptionFilter
│  ├─ decorators/             # AOP: Logging*, Secure*, CurrentUserProvider
│  ├─ repositories/           # TypeOrm*Repository
│  ├─ entities/                # UserEntity, LevelEntity, ProgressEntity (TypeORM)
│  ├─ mappers/                 # domain <-> entity/raw DTO
│  └─ dtos/                    # input / output
└─ infrastructure/         # Capa 4 — Composition Root (NestJS Modules)
   ├─ modules/                 # AppModule + un módulo por feature
   ├─ auth/ shared/             # implementaciones concretas de los puertos técnicos
   └─ tokens.ts                 # símbolos de inyección de dependencias
```

## Testing

Arquitectura de tests de 3 niveles (Object Mother → Testing API → `it` block). Ver `CLAUDE.md`
para la convención completa. Suites: unit (dominio + casos de uso), integración (HTTP +
`sql.js` en memoria), contrato.

```bash
npm test
```

## Conventional Commits

```
feat(auth): add JWT authentication
fix(level): validate exactly one exit cell in board
test(progress): add unit tests for registerAttempt invariant
refactor(domain): extract CellFactory to domain layer
```
