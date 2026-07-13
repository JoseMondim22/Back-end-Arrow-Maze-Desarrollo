import { INestApplication } from '@nestjs/common';
import supertest from 'supertest';
import { bootstrapTestApp } from '../http-setup/bootstrap-test-app';
import { RegisterDTO } from '../../src/interface-adapters/dtos/input/register.dto';
import { LoginDTO } from '../../src/interface-adapters/dtos/input/login.dto';
import { CreateLevelDTO } from '../../src/interface-adapters/dtos/input/create-level.dto';
import { NodeRawData } from '../../src/interface-adapters/dtos/input/node-raw-data.dto';
import { EdgeRawData } from '../../src/interface-adapters/dtos/input/edge-raw-data.dto';
import { SyncDTO } from '../../src/interface-adapters/dtos/input/sync.dto';

const REGISTERED_EMAIL = 'progress-tester@example.com';
const REGISTERED_PASSWORD = 'Password1';

export class ProgressIntegrationTestAPI {
  private app!: INestApplication;
  private httpServer!: import('http').Server;
  private accessToken = '';
  private levelId = '';
  private lastResponse!: supertest.Response;

  async setup(): Promise<void> {
    const testApp = await bootstrapTestApp();
    this.app = testApp.app;
    this.httpServer = testApp.httpServer;
  }

  async teardown(): Promise<void> {
    await this.app.close();
  }

  async givenAuthenticatedUser(): Promise<void> {
    await supertest(this.httpServer)
      .post('/auth/register')
      .send(new RegisterDTO(REGISTERED_EMAIL, REGISTERED_PASSWORD, 'progressTester'));

    const loginResponse = await supertest(this.httpServer)
      .post('/auth/login')
      .send(new LoginDTO(REGISTERED_EMAIL, REGISTERED_PASSWORD));

    this.accessToken = loginResponse.body.accessToken;
  }

  async givenExistingLevelWithMaxScore(maxPossibleScore: number): Promise<void> {
    const payload = new CreateLevelDTO(
      [new NodeRawData('1', 'grid_arrow', 0, 0, 'up'), new NodeRawData('2', 'exit', 0, 1)],
      [new EdgeRawData('1', '2')],
      [],
      60,
      20,
      maxPossibleScore,
      1,
      1,
    );

    await supertest(this.httpServer)
      .post('/levels')
      .set('Authorization', `Bearer ${this.accessToken}`)
      .send(payload);

    const levelsResponse = await supertest(this.httpServer)
      .get('/levels')
      .set('Authorization', `Bearer ${this.accessToken}`);

    this.levelId = levelsResponse.body[levelsResponse.body.length - 1].id;
  }

  async whenSyncingProgress(score: number): Promise<void> {
    this.lastResponse = await supertest(this.httpServer)
      .post('/progress/sync')
      .set('Authorization', `Bearer ${this.accessToken}`)
      .send(new SyncDTO(this.levelId, score));
  }

  async whenSyncingProgressWithoutAuth(score: number): Promise<void> {
    this.lastResponse = await supertest(this.httpServer)
      .post('/progress/sync')
      .send(new SyncDTO(this.levelId, score));
  }

  async whenGettingPlayerProgress(): Promise<void> {
    this.lastResponse = await supertest(this.httpServer)
      .get('/progress')
      .set('Authorization', `Bearer ${this.accessToken}`);
  }

  async whenGettingPlayerProgressWithoutAuth(): Promise<void> {
    this.lastResponse = await supertest(this.httpServer).get('/progress');
  }

  thenResponseStatusShouldBe(status: number): void {
    expect(this.lastResponse.status).toBe(status);
  }

  thenResponseShouldContainLevelWithScore(score: number): void {
    const entry = this.lastResponse.body.find(
      (progress: { levelId: string; bestScore: number }) => progress.levelId === this.levelId,
    );
    expect(entry).toBeDefined();
    expect(entry.bestScore).toBe(score);
  }
}
