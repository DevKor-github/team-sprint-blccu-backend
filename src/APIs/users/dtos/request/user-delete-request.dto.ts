import { PickType } from '@nestjs/swagger';
import { Feedback } from 'src/APIs/feedbacks/entities/feedback.entity';

export class UserDeleteRequestDto extends PickType(Feedback, [
  'content',
  'type',
]) {}
