// third-party imports
import { IsString, IsDate, IsUrl } from 'class-validator';

export class CreateBlogDto {
  @IsString()
  title: string;

  @IsString()
  content: string; // HTML content

  @IsDate()
  published_at: Date;

  @IsUrl()
  coverImage: string; // URL for the cover image

  @IsString()
  briefContent: string; // Brief content displayed in lists

  @IsString()
  author: string; // Name of the author

  @IsString()
  category: string; // Category of the blog post
}
