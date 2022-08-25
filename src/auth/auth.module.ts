import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { UserService } from 'src/user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from 'src/user/user.repository';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([UserRepository]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: 360000000,
        },
      }),
    }),
  ],
  providers: [AuthService, JwtStrategy, UserService],
  controllers: [AuthController],
  exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}
