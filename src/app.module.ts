import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './entities/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost', // Replace with your DB host if not local
      port: 5432, // Default PostgreSQL port
      username: 'rahucode', // Your PostgreSQL username
      password: 'Rimmi@051995', // Your PostgreSQL password
      database: 'my_data', // Replace with your database name
      autoLoadEntities: true, // Automatically load entities
      synchronize: true, // Set to false in production
    }),
    TypeOrmModule.forFeature([User]),
    AuthModule, 
  ],
  controllers: [AppController, UserController],
  providers: [AppService, UserService],
})
export class AppModule {}
