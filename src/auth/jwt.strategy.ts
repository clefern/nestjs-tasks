import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from 'src/db/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { JwtPayload } from './dto/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private userService: UserService,
    private configService: ConfigService,
  ) {
    super({
      secretOrKey: configService.get('JWT_SECRET'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate({ username }: JwtPayload): Promise<User> {
    const user: User = await this.userService.getUserByUsername(username);
    return user;
  }
}
