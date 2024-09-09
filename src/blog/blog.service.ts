// nest imports
import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

// third-party imports
import { Model } from 'mongoose';

// project imports
import { CreateBlogDto } from './dtos/create-blog.dto';
import { UpdateBlogDto } from './dtos/update-blog.dto';
import { BlogPost } from 'src/schemas/blog.schema';

@Injectable()
export class BlogService {
  constructor(
    @InjectModel(BlogPost.name) private readonly blogModel: Model<BlogPost>,
  ) {}

  async create(createBlogDto: CreateBlogDto): Promise<BlogPost> {
    try {
      const newBlogPost = new this.blogModel(createBlogDto);
      return await newBlogPost.save();
    } catch (error) {
      this.handleDatabaseExceptions(error);
    }
  }

  async findAll(): Promise<BlogPost[]> {
    try {
      return await this.blogModel.find().exec();
    } catch (error) {
      throw new InternalServerErrorException('Error fetching blog posts');
    }
  }

  async findOne(id: string): Promise<BlogPost> {
    try {
      const blogPost = await this.blogModel.findById(id).exec();
      if (!blogPost) {
        throw new NotFoundException(`BlogPost with ID ${id} not found`);
      }
      return blogPost;
    } catch (error) {
      this.handleDatabaseExceptions(
        error,
        `Error finding blog post with ID ${id}`,
      );
    }
  }

  async update(id: string, updateBlogDto: UpdateBlogDto): Promise<BlogPost> {
    try {
      const updatedBlogPost = await this.blogModel
        .findByIdAndUpdate(id, updateBlogDto, { new: true })
        .exec();
      if (!updatedBlogPost) {
        throw new NotFoundException(`BlogPost with ID ${id} not found`);
      }
      return updatedBlogPost;
    } catch (error) {
      this.handleDatabaseExceptions(
        error,
        `Error updating blog post with ID ${id}`,
      );
    }
  }

  async delete(id: string): Promise<{ deleted: boolean }> {
    try {
      const result = await this.blogModel.findByIdAndDelete(id).exec();
      if (!result) {
        throw new NotFoundException(`BlogPost with ID ${id} not found`);
      }
      return { deleted: true };
    } catch (error) {
      this.handleDatabaseExceptions(
        error,
        `Error deleting blog post with ID ${id}`,
      );
    }
  }

  /**
   * Handles database-related exceptions and throws the appropriate NestJS exceptions
   */
  private handleDatabaseExceptions(error: any, customMessage?: string): void {
    console.error('Error:', error); // Log the full error for better debugging

    switch (error.name) {
      case 'CastError':
        if (error.kind === 'ObjectId') {
          throw new BadRequestException('Invalid ID format');
        }
        break;

      case 'ValidationError':
        throw new BadRequestException(`Validation error: ${error.message}`);

      case 'BadRequestException': // If a BadRequestException was thrown, propagate it
        throw error;

      case 'NotFoundException': // If a NotFoundException was thrown, propagate it
        throw error;

      default:
        // For any other type of error, we use the custom message if provided or a generic error message
        throw new InternalServerErrorException(
          customMessage
            ? `${customMessage}: ${error.message}`
            : `An unexpected error occurred: ${error.message}`,
        );
    }
  }
}
