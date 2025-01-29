import * as bcrypt from 'bcrypt';

export class BcryptUtil {
  static async hashPassword(password: string): Promise<string> {
    if (!password) {
      throw new Error('Password is required');
    }
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }

  static async comparePassword(
    password: string,
    hash: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }
}
