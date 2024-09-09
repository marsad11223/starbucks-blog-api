// nest imports
import { Injectable, NotFoundException } from '@nestjs/common';
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
    const newBlogPost = new this.blogModel(createBlogDto);
    return await newBlogPost.save();
  }

  async findAll(): Promise<BlogPost[]> {
    return await this.blogModel.find().exec();
  }

  async findOne(id: string): Promise<BlogPost> {
    const blogPost = await this.blogModel.findById(id).exec();
    if (!blogPost) {
      throw new NotFoundException(`BlogPost with ID ${id} not found`);
    }
    return blogPost;
  }

  async update(id: string, updateBlogDto: UpdateBlogDto): Promise<BlogPost> {
    const updatedBlogPost = await this.blogModel
      .findByIdAndUpdate(id, updateBlogDto, { new: true })
      .exec();
    if (!updatedBlogPost) {
      throw new NotFoundException(`BlogPost with ID ${id} not found`);
    }
    return updatedBlogPost;
  }

  async delete(id: string): Promise<{ deleted: boolean }> {
    const result = await this.blogModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`BlogPost with ID ${id} not found`);
    }
    return { deleted: true };
  }
}
