import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksModule } from './tasks/tasks.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import databaseConfig from './config/database.config';
import { ConfigModule } from '@nestjs/config';
import { configValidationSchema } from './config/config.schema';
@Module({
  imports: [
    // Config
    ConfigModule.forRoot({
      envFilePath: [`./env/${process.env.NODE_ENV}.env`],
      validationSchema: configValidationSchema,
    }),
    TypeOrmModule.forRoot(databaseConfig),
    AuthModule,
    // Feature
    TasksModule,
    UserModule,
  ],
})
export class AppModule {}
