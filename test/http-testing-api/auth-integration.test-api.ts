import { INestApplication } from '@nestjs/common';
import supertest from 'supertest';
import { bootstrapTestApp } from '../http-setup/bootstrap-test-app';
import { RegisterDTO } from '../../src/interface-adapters/dtos/input/register.dto';
import { LoginDTO } from '../../src/interface-adapters/dtos/input/login.dto';
import { assertShape } from '../contract/shape-matcher';

export class AuthIntegrationTestAPI {
  private app!: INestApplication;
  private httpServer!: import('http').Server;
  private lastResponse!: supertest.Response;

  async setup(): Promise<void> {
    const testApp = await bootstrapTestApp();
    this.app = testApp.app;
    this.httpServer = testApp.httpServer;
  }

  async teardown(): Promise<void> {
    await this.app.close();
  }

  async whenRegistering(dto: RegisterDTO): Promise<void> {
    this.lastResponse = await supertest(this.httpServer).post('/auth/register').send(dto);
  }

  async whenLoggingIn(dto: LoginDTO): Promise<void> {
    this.lastResponse = await supertest(this.httpServer).post('/auth/login').send(dto);
  }

  thenResponseStatusShouldBe(status: number): void {
    expect(this.lastResponse.status).toBe(status);
  }

  thenResponseShouldHaveAccessToken(): void {
    expect(typeof this.lastResponse.body.accessToken).toBe('string');
    expect(this.lastResponse.body.accessToken.length).toBeGreaterThan(0);
  }

  thenResponseShouldHaveUserId(): void {
    expect(typeof this.lastResponse.body.userId).toBe('string');
  }

  thenResponseMessageShouldContain(fragment: string): void {
    expect(this.lastResponse.body.message).toContain(fragment);
  }

  thenResponseShouldMatchTokenDTOShape(): void {
    assertShape(this.lastResponse.body, { accessToken: 'string', userId: 'string' });
  }
}
