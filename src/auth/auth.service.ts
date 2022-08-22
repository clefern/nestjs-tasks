import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { User } from '../user/user.entity';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './dto/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  signUp(credentials: AuthCredentialsDto): Promise<User> {
    return this.userService.create(credentials);
  }

  async signIn({
    username,
    password,
  }: AuthCredentialsDto): Promise<{ accessToken: string }> {
    const user = await this.userService.getUserByUsername(username);
    if (user && (await bcrypt.compare(password, user.password))) {
      const payload: JwtPayload = { username };
      const accessToken: string = await this.jwtService.sign(payload);
      return { accessToken };
    } else {
      throw new UnauthorizedException(`Please check your login credentials!`);
    }
  }
}
