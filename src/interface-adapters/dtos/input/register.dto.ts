export class RegisterDTO {
  constructor(
    readonly email: string,
    readonly password: string,
    readonly username: string,
  ) {}
}
