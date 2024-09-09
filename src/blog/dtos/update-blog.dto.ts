// nest imports
import { PartialType } from '@nestjs/mapped-types';

// project imports
import { CreateBlogDto } from './create-blog.dto';

export class UpdateBlogDto extends PartialType(CreateBlogDto) {}
