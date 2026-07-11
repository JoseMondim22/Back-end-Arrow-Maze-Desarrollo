import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { Server } from 'http';
import { AppModule } from '../../src/infrastructure/modules/app.module';
import { PersistenceModule } from '../../src/infrastructure/modules/persistence.module';
import { TestPersistenceModule } from './test-persistence.module';

export interface TestApp {
  app: INestApplication;
  httpServer: Server;
}

// Boots the REAL, unmodified AppModule (real Controllers, real AOP decorators,
// real Use Cases, real TypeORM repositories) and swaps PersistenceModule for
// TestPersistenceModule wherever it appears in the graph via Nest's own
// overrideModule API — no source file under src/ is touched for testing purposes.
// Call once per test file (in beforeAll) so no state leaks between test files and
// test order never matters.
export async function bootstrapTestApp(): Promise<TestApp> {
  const moduleRef = await Test.createTestingModule({
    imports: [AppModule],
  })
    .overrideModule(PersistenceModule)
    .useModule(TestPersistenceModule)
    .compile();

  const app = moduleRef.createNestApplication();
  await app.init();

  return { app, httpServer: app.getHttpServer() };
}
