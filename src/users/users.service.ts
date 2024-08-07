import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './user.dto';
import { User } from './user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}
  async getAllUsers() {
    return this.userModel.find().exec();
  }
  async getUserById(id: string) {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }
  async registerUser(createUserDto: CreateUserDto): Promise<User> {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

    const createdUser = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
    });
    return createdUser.save();
  }

  async addFavoriteMovies(userId: string, movieIds: number[]): Promise<User> {
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('Invalid User ID format');
    }
    const user = await this.userModel.findById(userId).exec();
    const uniqueMovieIds = Array.from(
      new Set([...user.favoritiesMovies, ...movieIds]),
    );
    user.favoritiesMovies = uniqueMovieIds;
    return user.save();
  }

  async removeFavoriteMovie(userId: string, movieId: number): Promise<User> {
    const user = await this.userModel.findById(userId).exec();

    user.favoritiesMovies = user.favoritiesMovies.filter(
      (id) => id !== movieId,
    );

    return user.save();
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }
}
