import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RegisterUserDto } from './dto/register-user.dto';
import * as bcrypt from 'bcrypt';
import { UserPayload } from './interfaces/user-payload.interface';
import { GroceriesService } from 'src/groceries/groceries.service';
import { User } from 'src/users/schemas/user.schema';
import { HydratedDocument } from 'mongoose';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private groceriesService: GroceriesService,
  ) {}

  async validateUser(username: string, pass: string): Promise<UserPayload> {
    const user = await this.usersService.findOneByUsername(username);
    if (user && (await bcrypt.compare(pass, user.password))) {
      return user as UserPayload;
    }
    throw new UnauthorizedException('Invalid credentials');
  }

  login(user: { username: string; _id: string }) {
    const payload = { username: user.username, sub: user._id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(registerDto: RegisterUserDto) {
    const existingUser = await this.usersService.findOneByUsername(
      registerDto.username,
    );
    if (existingUser) {
      throw new BadRequestException('Username already exists');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const user: HydratedDocument<User> = await this.usersService.create({
      username: registerDto.username,
      password: hashedPassword,
    });

    await this.groceriesService.generateInitialGroceries(user.id);

    const { ...result } = user;

    return result;
  }
}
