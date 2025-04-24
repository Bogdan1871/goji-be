import { IsString, MinLength } from 'class-validator';

export class RegisterUserDto {
  @IsString()
  username: string;

  @IsString()
  @MinLength(6)
  password: string;
}
