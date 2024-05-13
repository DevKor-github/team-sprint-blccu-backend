import { PickType } from '@nestjs/swagger';
import { Feedback } from '../entities/feedback.entity';

export class CreateFeedbackInput extends PickType(Feedback, ['content']) {}
