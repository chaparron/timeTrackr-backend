import { Injectable, ConflictException, Inject } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { IUserRepository } from '@domain/interfaces/IUserRepository';
import { CreateUserDto } from '@application/dto/createuser-dto';
import { User } from '@domain/entities/user.entity';

@Injectable()
export class CreateUserUseCase {
    constructor(
        @Inject('IUserRepository')
        private readonly userRepository: IUserRepository
    ) { }

async execute(createUserDto: CreateUserDto): Promise<{ id: string; email: string; username: string }> {
    const existingUser = await this.userRepository.findByEmail(createUserDto.email);

    if (existingUser) {
        throw new ConflictException('Email already registered.');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = new User({
        email: createUserDto.email,
        username: createUserDto.username,
        passwordHash: hashedPassword,
    });

    await this.userRepository.create(user);
    
    return {
        id: user.id,
        email: user.email,
        username: user.username
    };
}
}