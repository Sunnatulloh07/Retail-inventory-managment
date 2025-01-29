import { User } from '@app/shared/schemas/user.schema';
import { Module } from '@nestjs/common';
import { Redis } from 'ioredis';

@Module({})
export class RedisModule {
  static redisClient: Redis;

  constructor() {
    const client = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      // password: process.env.REDIS_PASSWORD,
    });
    RedisModule.redisClient = client;
    client.on('error', (error) => {
      console.error('Redis error:', error);
    });
  }
  // get otp from redis
  static async getOtp(phoneNumber: string): Promise<string> {
    const otpKey = `otp:${phoneNumber}`;
    return await RedisModule.redisClient.get(otpKey);
  }

  // store otp in redis
  static async storeOtp(
    phoneNumber: string,
    otp: string,
    ttlSeconds: number,
  ): Promise<void> {
    const otpKey = `otp:${phoneNumber}`;
    await RedisModule.redisClient.set(otpKey, otp, 'EX', ttlSeconds); // OTP expires in 5 minutes
  }

  // delete otp from redis
  static async deleteOtp(phoneNumber: string): Promise<void> {
    const otpKey = `otp:${phoneNumber}`;
    await RedisModule.redisClient.del(otpKey);
  }

  // brute force protection
  static async recordFailure(phoneNumber: string): Promise<void> {
    const key = `fail_count:${phoneNumber}`;
    let count = Number(await RedisModule.redisClient.get(key)) || 0;
    count++;
    if (count === 1) {
      await RedisModule.redisClient.set(key, count, 'EX', 300); // block for 5 minutes
    } else {
      await RedisModule.redisClient.incr(key);
    }
  }

  // check if user is blocked
  static async isBlocked(phoneNumber: string): Promise<boolean> {
    const key = `fail_count:${phoneNumber}`;
    const count = Number(await RedisModule.redisClient.get(key)) || 0;
    return count >= 5;
  }

  // remove failure count
  static async removeFailureCount(phoneNumber: string): Promise<void> {
    const key = `fail_count:${phoneNumber}`;
    await RedisModule.redisClient.del(key);
  }

  // get user from redis
  static async getUser(userId: string): Promise<User> {
    const userKey = `user:${userId}`;
    const user = await RedisModule.redisClient.get(userKey);
    return user ? JSON.parse(user) : null;
  }

  // store user in redis
  static async storeUser(userId: string, user: User): Promise<void> {
    const userKey = `user:${userId}`;
    await RedisModule.redisClient.set(userKey, JSON.stringify(user));
  }

  // delete user from redis
  static async deleteUser(userId: string): Promise<void> {
    const userKey = `user:${userId}`;
    await RedisModule.redisClient.del(userKey);
  }

  // get all users from redis
  static async getAllUsers(): Promise<User[]> {
    const usersKey = `users`;
    const users = await RedisModule.redisClient.keys(usersKey);
    return users.map((user) => JSON.parse(user));
  }

  // Store all users in redis
  static async storeAllUsers(users: User[]): Promise<void> {
    const usersKey = `users`;
    await RedisModule.redisClient.set(usersKey, JSON.stringify(users));
  }

  // delete all users from redis
  static async deleteAllUsers(): Promise<void> {
    const usersKey = `users`;
    await RedisModule.redisClient.del(usersKey);
  }
}
