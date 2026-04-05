import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async findById(id: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  async create(userData: { email: string; password: string; name: string; role?: 'user' | 'admin' }): Promise<User> {
    const existingUser = await this.findByEmail(userData.email);
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = this.userRepository.create({
      email: userData.email,
      password: hashedPassword,
      name: userData.name,
      role: userData.role || 'user',
    });
    
    return this.userRepository.save(user);
  }

  async update(id: string, updateData: UpdateUserDto): Promise<User> {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    Object.assign(user, updateData);
    user.updatedAt = new Date();
    
    return this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async delete(id: string): Promise<void> {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('User not found');
    }
  }
}

// import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
// import { User } from './user.entity';
// import { UpdateUserDto } from './dto/update-user.dto';
// import * as bcrypt from 'bcrypt';

// @Injectable()
// export class UserService {
//   private users: User[] = [];

//   async findByEmail(email: string): Promise<User | undefined> {
//     return this.users.find(user => user.email === email);
//   }

//   async findById(id: string): Promise<User | undefined> {
//     return this.users.find(user => user.id === id);
//   }

//   async create(userData: { email: string; password: string; name: string; role?: 'user' | 'admin' }): Promise<User> {
//     // Validate required fields
//     if (!userData.email) {
//       throw new ConflictException('Email is required');
//     }
//     if (!userData.password) {
//       throw new ConflictException('Password is required');
//     }
//     if (!userData.name) {
//       throw new ConflictException('Name is required');
//     }

//     const existingUser = await this.findByEmail(userData.email);
//     if (existingUser) {
//       throw new ConflictException('Email already exists');
//     }

//     const hashedPassword = await bcrypt.hash(userData.password, 10);
//     const user: User = {
//       id: Date.now().toString(),
//       email: userData.email,
//       password: hashedPassword,
//       name: userData.name,
//       role: userData.role || 'user',
//       createdAt: new Date(),
//       updatedAt: new Date(),
//     };
//     this.users.push(user);
//     return user;
//   }

//   async update(id: string, updateData: UpdateUserDto): Promise<User> {
//     const user = await this.findById(id);
//     if (!user) {
//       throw new NotFoundException('User not found');
//     }

//     // Prepare update data
//     const updatedUserData: Partial<User> = { ...updateData };
    
//     if (updateData.password) {
//       updatedUserData.password = await bcrypt.hash(updateData.password, 10);
//     }

//     const updatedUser: User = {
//       ...user,
//       ...updatedUserData,
//       updatedAt: new Date(),
//     };
    
//     const index = this.users.findIndex(u => u.id === id);
//     if (index === -1) {
//       throw new NotFoundException('User not found');
//     }
//     this.users[index] = updatedUser;
//     return updatedUser;
//   }

//   async findAll(): Promise<User[]> {
//     return this.users;
//   }

//   async delete(id: string): Promise<void> {
//     const index = this.users.findIndex(u => u.id === id);
//     if (index === -1) {
//       throw new NotFoundException('User not found');
//     }
//     this.users.splice(index, 1);
//   }
// }