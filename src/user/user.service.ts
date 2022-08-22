import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { UserRepository } from 'src/user/user.repository';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private repository: UserRepository,
  ) {}

  create(credentials: CreateUserDto): Promise<User> {
    return this.repository.createUser(credentials);
  }

  getUsers(): Promise<User[]> {
    return this.repository.getUsers();
  }

  async getUserByUsername(username: string): Promise<User> {
    return await this.repository.findOne({ username });
  }
}
