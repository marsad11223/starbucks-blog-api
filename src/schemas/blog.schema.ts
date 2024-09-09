// nest imports
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// third-party imports
import { IsString, IsUrl } from 'class-validator';

@Schema({ timestamps: true }) // Automatically adds createdAt and updatedAt fields
export class BlogPost extends Document {
  @Prop({ required: true })
  @IsString()
  title: string;

  @Prop({ required: true })
  @IsString()
  content: string; // HTML content

  @Prop({ required: true })
  @IsUrl()
  coverImage: string; // URL for the cover image

  @Prop({ required: true })
  @IsString()
  briefContent: string; // Brief content displayed in lists

  @Prop({ required: true })
  @IsString()
  author: string; // Name of the author

  @Prop({ required: true })
  @IsString()
  category: string; // Category of the blog post
}

export const BlogPostSchema = SchemaFactory.createForClass(BlogPost);

// Optional: Add indexing for faster search
BlogPostSchema.index({
  title: 'text',
  briefContent: 'text',
  author: 'text',
  category: 'text',
});
