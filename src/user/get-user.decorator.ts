import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '../db/entities/user.entity';

export const GetUser = createParamDecorator<User>(
  (data, ctx: ExecutionContext): User => {
    const req = ctx.switchToHttp().getRequest();
    return req.user;
  },
);
