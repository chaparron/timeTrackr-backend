import { User } from "../entities/user.entity";

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  create(user: User): Promise<void>;
  validateCredentials(email: string, password: string): Promise<boolean>;
}