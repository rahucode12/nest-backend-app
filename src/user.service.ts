import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // Fetch all users
  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  // Create new user (used in signup)
  create(user: Partial<User>): Promise<User> {
    return this.userRepository.save(user);
  }

  // 🔍 Find user by email (used in login)
  findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async updatePassword(userId: number, hashedPassword: string): Promise<void> {
    await this.userRepository.update(userId, { password: hashedPassword });
  }
}
