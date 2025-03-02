import { User } from './user.entity';

describe('User Entity', () => {
  it('should create a user instance with provided values', () => {
    const userData = {
      email: 'test@example.com',
      username: 'testuser',
      passwordHash: 'hashedpassword',
    };

    const user = new User(userData);

    expect(user).toBeDefined();
    expect(user.email).toEqual(userData.email);
    expect(user.username).toEqual(userData.username);
    expect(user.passwordHash).toEqual(userData.passwordHash);
  });

  it('should throw an error if required properties are missing', () => {
    const invalidUserData = [
      { email: 'test@example.com', username: 'testuser' },
      { email: 'test@example.com', passwordHash: 'hashedpassword' },
      { username: 'testuser', passwordHash: 'hashedpassword' },
      {},
    ];

    invalidUserData.forEach((userData) => {
      expect(() => new User(userData as any)).toThrow();
    });
  });
});