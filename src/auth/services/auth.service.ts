import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { UserRepository } from 'src/users/repositories/users.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userRepository: UserRepository,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userRepository.getUserByEmail(email);

    const comparedPassword = await compare(password, user.password);

    if (user && comparedPassword) {
      return user;
    }
    return null;
  }

  async login(user) {
    const payload = { user: user.user };
    const access_token = this.jwtService.sign(payload);
    return access_token;
  }

  async kakaoLogin(user) {
    const existUser = await this.userRepository.getUserByEmail(user.email);
    if (!existUser) {
      // await this.userService.createUser();
    }
    const access_token = this.jwtService.sign(user);
    return access_token;
  }
}