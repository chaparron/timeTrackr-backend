import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  username: string;

  @Column()
  passwordHash: string;

  constructor(userData?: { email: string; username: string; passwordHash: string }) {
    if (userData) {
      if (!userData.email || !userData.username || !userData.passwordHash) {
        throw new Error('Email, username, and passwordHash are required to create a User.');
      }

      this.email = userData.email;
      this.username = userData.username;
      this.passwordHash = userData.passwordHash;
    }
  }
}