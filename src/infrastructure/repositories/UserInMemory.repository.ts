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

    async create(user: User): Promise<User> {
        user.id = this.users.length + 1;
        this.users.push(user);
        return user
    }

    async validateCredentials(email: string, password: string): Promise<boolean> {
        const user = await this.findByEmail(email);
        if (!user) return false;

        return bcrypt.compare(password, user.passwordHash);
    }
}