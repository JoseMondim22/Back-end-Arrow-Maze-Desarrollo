import { ICommandService } from '../ports/command-service';
import { IIdGenerator } from '../ports/id-generator';
import { CreateLevelCommand } from '../commands/create-level.command';
import { ILevelRepository } from '../../domain/level/i-level-repository';
import { Level } from '../../domain/level/level.aggregate';
import { Board } from '../../domain/level/value-objects/board';
import { CellNode } from '../../domain/level/value-objects/cell-node';
import { Chain } from '../../domain/level/value-objects/chain';
import { ChainId } from '../../domain/level/value-objects/chain-id';
import { Edge } from '../../domain/level/value-objects/edge';
import { LevelId } from '../../domain/level/value-objects/level-id';
import { LevelOrder } from '../../domain/level/value-objects/level-order';
import { LevelRules } from '../../domain/level/value-objects/level-rules';
import { NodeId } from '../../domain/level/value-objects/node-id';
import { CellFactory } from '../../domain/level/factories/cell.factory';
import { PositionFactory } from '../../domain/level/factories/position.factory';

export class CreateLevelUseCase implements ICommandService<CreateLevelCommand> {
  constructor(
    private readonly levelRepository: ILevelRepository,
    private readonly idGenerator: IIdGenerator,
  ) {}

  async execute(command: CreateLevelCommand): Promise<void> {
    const nodes = command.nodes.map((node) =>
      CellNode.create(
        NodeId.create(node.id),
        PositionFactory.create({
          row: node.row,
          column: node.column,
          layer: node.layer,
          positionType: node.positionType,
        }),
        CellFactory.create({ type: node.type, direction: node.direction, positionType: node.positionType }),
      ),
    );

    const edges = command.edges.map((edge) =>
      Edge.create(NodeId.create(edge.from), NodeId.create(edge.to)),
    );

    const chains = command.chains.map((chain) =>
      Chain.create(
        ChainId.create(chain.id),
        chain.nodeIds.map((nodeId) => NodeId.create(nodeId)),
      ),
    );

    const board = Board.create(nodes, edges, chains);
    const rules = LevelRules.create(
      command.timeLimit,
      command.maxMoves,
      command.maxPossibleScore,
      command.difficulty,
    );
    const order = LevelOrder.create(command.order);
    const levelId = LevelId.create(this.idGenerator.generate());

    const level = Level.create(levelId, board, rules, order);
    await this.levelRepository.save(level);
  }
}
