import { Injectable } from '@nestjs/common';
import { IUserRepository } from '@domain/interfaces/IUserRepository';
import { User } from '@domain/entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserInMemoryRepository implements IUserRepository {
    private users: User[] = [];

    async findByEmail(email: string): Promise<User | null> {
        return this.users.find(u => u.email === email) || null;
    }

    async create(user: User): Promise<void> {
        const existingUser = await this.findByEmail(user.email);
        if (existingUser) throw new Error('User already exist.');

        this.users.push(user);
    }

    async validateCredentials(email: string, password: string): Promise<boolean> {
        const user = await this.findByEmail(email);
        if (!user) return false;

        const userWithHash = user as any;
        return bcrypt.compare(password, userWithHash.props.passwordHash);
    }
}