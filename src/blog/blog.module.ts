// nest imports
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

// project imports
import { BlogService } from './blog.service';
import { BlogController } from './blog.controller';
import { BlogPost, BlogPostSchema } from 'src/schemas/blog.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: BlogPost.name, schema: BlogPostSchema },
    ]),
  ],
  providers: [BlogService],
  controllers: [BlogController],
})
export class BlogModule {}
