import { PickType } from '@nestjs/swagger';
import { PostCategory } from '../entities/postCategory.entity';

export class PatchPostCategoryDto extends PickType(PostCategory, ['name']) {}
