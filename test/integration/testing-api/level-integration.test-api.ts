import { INestApplication } from '@nestjs/common';
import supertest from 'supertest';
import { bootstrapTestApp } from '../setup/bootstrap-test-app';
import { RegisterDTO } from '../../../src/interface-adapters/dtos/input/register.dto';
import { LoginDTO } from '../../../src/interface-adapters/dtos/input/login.dto';
import { CreateLevelDTO } from '../../../src/interface-adapters/dtos/input/create-level.dto';

const REGISTERED_EMAIL = 'level-tester@example.com';
const REGISTERED_PASSWORD = 'Password1';

export class LevelIntegrationTestAPI {
  private app!: INestApplication;
  private httpServer!: import('http').Server;
  private accessToken = '';
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
      .send(new RegisterDTO(REGISTERED_EMAIL, REGISTERED_PASSWORD, 'levelTester'));

    const loginResponse = await supertest(this.httpServer)
      .post('/auth/login')
      .send(new LoginDTO(REGISTERED_EMAIL, REGISTERED_PASSWORD));

    this.accessToken = loginResponse.body.accessToken;
  }

  async whenCreatingLevel(body: CreateLevelDTO): Promise<void> {
    this.lastResponse = await supertest(this.httpServer)
      .post('/levels')
      .set('Authorization', `Bearer ${this.accessToken}`)
      .send(body);
  }

  async whenCreatingLevelWithoutAuth(body: CreateLevelDTO): Promise<void> {
    this.lastResponse = await supertest(this.httpServer).post('/levels').send(body);
  }

  async whenGettingLevels(): Promise<void> {
    this.lastResponse = await supertest(this.httpServer)
      .get('/levels')
      .set('Authorization', `Bearer ${this.accessToken}`);
  }

  async whenGettingLevelsWithoutAuth(): Promise<void> {
    this.lastResponse = await supertest(this.httpServer).get('/levels');
  }

  thenResponseStatusShouldBe(status: number): void {
    expect(this.lastResponse.status).toBe(status);
  }

  thenLevelListShouldHaveLength(length: number): void {
    expect(this.lastResponse.body).toHaveLength(length);
  }

  thenFirstLevelShouldHaveOrder(order: number): void {
    expect(this.lastResponse.body[0].order).toBe(order);
  }
}
