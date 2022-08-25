import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { User } from '../db/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private service: AuthService) {}

  @Post('signup')
  signIp(@Body() credentials: AuthCredentialsDto): Promise<User> {
    return this.service.signUp(credentials);
  }

  @Post('signin')
  signIn(
    @Body() credentials: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    return this.service.signIn(credentials);
  }
}
