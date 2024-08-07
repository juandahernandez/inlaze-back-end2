import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './user.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}
  @Get()
  async getAllUsers() {
    const users = await this.usersService.getAllUsers();
    return {
      statusCode: HttpStatus.CREATED,
      message: 'successfully',
      data: users,
    };
  }
  @Get(':id')
  async getUser(@Param('id') id: string) {
    return await this.usersService.getUserById(id);
  }
  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    try {
      const newUser = await this.usersService.registerUser(createUserDto);
      return {
        statusCode: HttpStatus.CREATED,
        message: 'User registered successfully',
        data: newUser,
      };
    } catch (err) {
      console.log(err);
    }
  }

  @Patch(':id/favoritiesMovies')
  async addFavoriteMovies(
    @Param('id') userId: string,
    @Body() body: { movieIds: number[] },
  ) {
    try {
      const { movieIds } = body;
      return this.usersService.addFavoriteMovies(userId, movieIds);
    } catch (err) {
      console.log(err);
    }
  }

  @Delete(':id/favoritiesMovies')
  async removeFavoriteMovie(
    @Param('id') userId: string,
    @Query('movieId') movieId: number,
  ) {
    try {
      return await this.usersService.removeFavoriteMovie(userId, movieId);
    } catch (error) {
      console.log(error);
    }
  }
}
