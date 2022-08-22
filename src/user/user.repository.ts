import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { AuthCredentialsDto } from '../auth/dto/auth-credentials.dto';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async createUser(credentials: AuthCredentialsDto): Promise<User> {
    const { password } = credentials;
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);
    const user = this.create({ ...credentials, password: hashPassword });
    console.log({
      salt,
      password,
      hashPassword,
    });

    try {
      return await this.save(user);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException(
          `The user ${user.username} already exists in database`,
        );
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async getUsers(): Promise<User[]> {
    const query = this.createQueryBuilder('user');
    return await query.getMany();
  }
}
