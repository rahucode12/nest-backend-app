// auth.service.ts

import { Injectable, UnauthorizedException, OnModuleInit } from '@nestjs/common';
import { UserService } from '../user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
//test
@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async onModuleInit() {
    console.log('Running password hashing for existing users...');
    const users = await this.userService.findAll(); // Fetch all users
    for (const user of users) {
      if (user.password === 'default_password') {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        await this.userService.updatePassword(user.id, hashedPassword); // Update password
        console.log(`Password hashed for user: ${user.email}`);
      }
    }
  }

  async signup(name: string, email: string, password: string) {
    const hashed = await bcrypt.hash(password, 10);
    return this.userService.create({ name, email, password: hashed });
  }

  async login(email: string, password: string) {
    console.log('Login attempt:', { email, password });
    const user = await this.userService.findByEmail(email);
    console.log('User found:', user);
    if (!user) throw new UnauthorizedException('User not found');
    console.log('Comparing passwords...', password, user.password);

    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password match:', isMatch);
    if (!isMatch) throw new UnauthorizedException('Wrong password');

    const payload = { sub: user.id, email: user.email };
    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }
}
