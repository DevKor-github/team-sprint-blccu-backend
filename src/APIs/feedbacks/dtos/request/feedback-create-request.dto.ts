import { PickType } from '@nestjs/swagger';
import { FeedbackDto } from '../common/feedback.dto';

export class FeedbackCreateRequestDto extends PickType(FeedbackDto, [
  'content',
]) {}
