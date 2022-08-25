import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/db/entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';

@Controller('user')
@UseGuards(AuthGuard())
export class UserController {
  constructor(private service: UserService) {}

  @Post()
  create(@Body() credentials: CreateUserDto): Promise<User> {
    return this.service.create(credentials);
  }

  @Get()
  getUsers(): Promise<User[]> {
    return this.service.getUsers();
  }

  @Get('/:id')
  getUserByUsername(@Body() credentials: CreateUserDto): Promise<User> {
    return this.service.getUserByUsername(credentials.username);
  }
}
