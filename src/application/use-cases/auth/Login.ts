import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IUserRepository } from '@domain/interfaces/IUserRepository';

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async execute(email: string, password: string): Promise<{token: string, user: any}> {
    const isValid = await this.userRepository.validateCredentials(email, password);
    
    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
  
    const user = await this.userRepository.findByEmail(email);
  
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    
    const token = this.jwtService.sign({ 
      sub: user.id,
      email: user.email,
      username: user.username,
    });
  
    return {
      token,
      user: {
        email: user.email,
        username: user.username
      }
    };
  }
}