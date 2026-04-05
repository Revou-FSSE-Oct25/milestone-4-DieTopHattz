import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { User } from './user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  private users: User[] = [];

  async findByEmail(email: string): Promise<User | undefined> {
    return this.users.find(user => user.email === email);
  }

  async findById(id: string): Promise<User | undefined> {
    return this.users.find(user => user.id === id);
  }

  async create(userData: { email: string; password: string; name: string; role?: 'user' | 'admin' }): Promise<User> {
    // Validate required fields
    if (!userData.email) {
      throw new ConflictException('Email is required');
    }
    if (!userData.password) {
      throw new ConflictException('Password is required');
    }
    if (!userData.name) {
      throw new ConflictException('Name is required');
    }

    const existingUser = await this.findByEmail(userData.email);
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user: User = {
      id: Date.now().toString(),
      email: userData.email,
      password: hashedPassword,
      name: userData.name,
      role: userData.role || 'user',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.push(user);
    return user;
  }

  async update(id: string, updateData: UpdateUserDto): Promise<User> {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Prepare update data
    const updatedUserData: Partial<User> = { ...updateData };
    
    if (updateData.password) {
      updatedUserData.password = await bcrypt.hash(updateData.password, 10);
    }

    const updatedUser: User = {
      ...user,
      ...updatedUserData,
      updatedAt: new Date(),
    };
    
    const index = this.users.findIndex(u => u.id === id);
    if (index === -1) {
      throw new NotFoundException('User not found');
    }
    this.users[index] = updatedUser;
    return updatedUser;
  }

  async findAll(): Promise<User[]> {
    return this.users;
  }

  async delete(id: string): Promise<void> {
    const index = this.users.findIndex(u => u.id === id);
    if (index === -1) {
      throw new NotFoundException('User not found');
    }
    this.users.splice(index, 1);
  }
}