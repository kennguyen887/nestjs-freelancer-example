import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  UseInterceptors,
  Request,
  HttpException,
  HttpStatus,
  Put,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthService } from './services/auth/auth.service';
import { LoginDto } from './dto/login.dto';
import { UserService } from './services/user/user.service';
import { JwtAuthGuard } from './guards/jwt-auth/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { GetUserMeResDto } from './services/auth/dto';
import { plainToClass } from 'class-transformer';
import { UpdateUserRequestDto } from './dto';
import { UpdateUserCommand } from './commands';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('register')
  async register(@Body() user: CreateUserDto) {
    const newUser = await this.authService.register(user);

    return {
      message: 'User created',
      user: {
        id: newUser.id,
        token: newUser.token,
      },
    };
  }

  @Post('login')
  async login(@Body() login: LoginDto) {
    const token = await this.authService.login(login);

    return {
      message: 'Login successful',
      token,
    };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async me(@Request() req: any): Promise<GetUserMeResDto> {
    const { user } = req;
    if (!user.id) {
      throw new HttpException('User is not found', HttpStatus.BAD_REQUEST);
    }

    return plainToClass(
      GetUserMeResDto,
      await this.authService.getUserById(user.id),
    );
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  async updateUser(
    @Request() req: any,
    @Body() data: UpdateUserRequestDto,
  ): Promise<void> {
    const { user } = req;
    return this.commandBus.execute(new UpdateUserCommand(user.id, data));
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(CacheInterceptor)
  @Get()
  async getUsers() {
    const users = await this.userService.getAll();

    return {
      message: 'Users retrieved successfully',
      users,
    };
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(CacheInterceptor)
  @Get()
  async changePassword() {
    const users = await this.userService.getAll();

    return {
      message: 'Users retrieved successfully',
      users,
    };
  }
}