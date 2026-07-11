import { INestApplication } from '@nestjs/common';
import supertest from 'supertest';
import { bootstrapTestApp } from '../http-setup/bootstrap-test-app';
import { RegisterDTO } from '../../src/interface-adapters/dtos/input/register.dto';
import { LoginDTO } from '../../src/interface-adapters/dtos/input/login.dto';
import { CreateLevelDTO } from '../../src/interface-adapters/dtos/input/create-level.dto';
import { NodeRawData } from '../../src/interface-adapters/dtos/input/node-raw-data.dto';
import { EdgeRawData } from '../../src/interface-adapters/dtos/input/edge-raw-data.dto';
import { SyncDTO } from '../../src/interface-adapters/dtos/input/sync.dto';
import { assertShape } from '../contract/shape-matcher';

let uniqueSuffix = 0;

export class LeaderboardIntegrationTestAPI {
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

  async givenAuthenticatedUser(username = 'leaderboardTester'): Promise<void> {
    uniqueSuffix += 1;
    const email = `${username}${uniqueSuffix}@example.com`;

    await supertest(this.httpServer).post('/auth/register').send(new RegisterDTO(email, 'Password1', username));

    const loginResponse = await supertest(this.httpServer)
      .post('/auth/login')
      .send(new LoginDTO(email, 'Password1'));

    this.accessToken = loginResponse.body.accessToken;
  }

  async givenExistingLevelWithMaxScore(maxPossibleScore: number): Promise<void> {
    const payload = new CreateLevelDTO(
      [new NodeRawData('1', 'grid_arrow', 0, 0, 'up'), new NodeRawData('2', 'exit', 0, 1)],
      [new EdgeRawData('1', '2')],
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

  async givenSyncedProgress(score: number): Promise<void> {
    await supertest(this.httpServer)
      .post('/progress/sync')
      .set('Authorization', `Bearer ${this.accessToken}`)
      .send(new SyncDTO(this.levelId, score));
  }

  async whenGettingLeaderboard(): Promise<void> {
    this.lastResponse = await supertest(this.httpServer)
      .get(`/leaderboard/${this.levelId}`)
      .set('Authorization', `Bearer ${this.accessToken}`);
  }

  async whenGettingLeaderboardWithoutAuth(): Promise<void> {
    this.lastResponse = await supertest(this.httpServer).get(`/leaderboard/${this.levelId}`);
  }

  thenResponseStatusShouldBe(status: number): void {
    expect(this.lastResponse.status).toBe(status);
  }

  thenLeaderboardShouldHaveLength(length: number): void {
    expect(this.lastResponse.body).toHaveLength(length);
  }

  thenEntryAtPositionShouldHaveScore(index: number, score: number): void {
    expect(this.lastResponse.body[index].score).toBe(score);
  }

  thenResponseShouldMatchLeaderboardEntryDTOShape(): void {
    assertShape(this.lastResponse.body[0], { position: 'number', username: 'string', score: 'number' });
  }
}
