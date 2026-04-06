import { Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto) {
    const hashedPassword = await bcrypt.hash(registerDto.password, 12);
    
    const user = await this.prisma.user.create({
      data: {
        email: registerDto.email,
        password: hashedPassword,
        name: registerDto.name,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });
    
    return user;
  }

  async login(loginDto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: loginDto.email },
    });
    
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if account is locked
    if (user.lockedUntil && user.lockedUntil > new Date()) {
      throw new ForbiddenException(`Account locked until ${user.lockedUntil}`);
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
    
    if (!isPasswordValid) {
      const attempts = user.failedLoginAttempts + 1;
      const maxAttempts = this.configService.get('MAX_LOGIN_ATTEMPTS', 5);
      
      await this.prisma.user.update({
        where: { id: user.id },
        data: { failedLoginAttempts: attempts },
      });
      
      if (attempts >= maxAttempts) {
        const lockDuration = this.configService.get('LOCKOUT_DURATION', 15);
        await this.prisma.user.update({
          where: { id: user.id },
          data: { 
            lockedUntil: new Date(Date.now() + lockDuration * 60 * 1000),
          },
        });
        throw new ForbiddenException(`Account locked for ${lockDuration} minutes`);
      }
      
      throw new UnauthorizedException('Invalid credentials');
    }

    // Reset failed attempts on successful login
    await this.prisma.user.update({
      where: { id: user.id },
      data: { 
        failedLoginAttempts: 0,
        lockedUntil: null,
      },
    });

    const payload = { email: user.email, sub: user.id, role: user.role };
    
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: this.configService.get('JWT_EXPIRATION', '15m'),
    });
    
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: this.configService.get('REFRESH_TOKEN_EXPIRATION', '7d'),
    });

    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: hashedRefreshToken },
    });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      user: { 
        id: user.id, 
        email: user.email, 
        name: user.name, 
        role: user.role 
      },
    };
  }

  async refreshTokens(refreshTokenDto: RefreshTokenDto) {
    try {
      const payload = this.jwtService.verify(refreshTokenDto.refreshToken);
      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });
      
      if (!user || !user.refreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }
      
      const isValid = await bcrypt.compare(refreshTokenDto.refreshToken, user.refreshToken);
      if (!isValid) {
        throw new UnauthorizedException('Invalid refresh token');
      }
      
      const newPayload = { email: user.email, sub: user.id, role: user.role };
      
      const newAccessToken = this.jwtService.sign(newPayload, {
        expiresIn: this.configService.get('JWT_EXPIRATION', '15m'),
      });
      
      const newRefreshToken = this.jwtService.sign(newPayload, {
        expiresIn: this.configService.get('REFRESH_TOKEN_EXPIRATION', '7d'),
      });
      
      const hashedNewRefreshToken = await bcrypt.hash(newRefreshToken, 10);
      await this.prisma.user.update({
        where: { id: user.id },
        data: { refreshToken: hashedNewRefreshToken },
      });
      
      return {
        access_token: newAccessToken,
        refresh_token: newRefreshToken,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });
    return { message: 'Logged out successfully' };
  }
}