import { User } from "../entities/user.entity";

export interface IUserRepository {
  findById(id: number): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(user: User): Promise<User>;
  validateCredentials(email: string, password: string): Promise<boolean>;
}