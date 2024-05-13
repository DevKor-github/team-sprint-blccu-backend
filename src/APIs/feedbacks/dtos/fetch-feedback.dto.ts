import { OmitType } from '@nestjs/swagger';
import { Feedback } from '../entities/feedback.entity';

export class FetchFeedbackDto extends OmitType(Feedback, ['user']) {}
