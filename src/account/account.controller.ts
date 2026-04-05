import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { AccountService } from './account.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { GetUser } from '../decorators/get-user.decorator';

@Controller('accounts')
@UseGuards(JwtAuthGuard)
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post()
  async create(@GetUser() user, @Body() createAccountDto: CreateAccountDto) {
    return this.accountService.create(user.id, createAccountDto);
  }

  @Get()
  async findAll(@GetUser() user) {
    const isAdmin = user.role === 'admin';
    return this.accountService.findAll(user.id, isAdmin);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @GetUser() user) {
    const isAdmin = user.role === 'admin';
    return this.accountService.findOne(id, user.id, isAdmin);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @GetUser() user,
    @Body() updateAccountDto: UpdateAccountDto,
  ) {
    const isAdmin = user.role === 'admin';
    return this.accountService.update(id, user.id, updateAccountDto, isAdmin);
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @GetUser() user) {
    const isAdmin = user.role === 'admin';
    return this.accountService.delete(id, user.id, isAdmin);
  }
}