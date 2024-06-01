import { PartialType } from '@nestjs/swagger';
import { CreatePostInput } from './create-post.input';

export class PatchPostInput extends PartialType(CreatePostInput) {}
