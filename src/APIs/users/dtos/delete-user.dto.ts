import { PickType } from '@nestjs/swagger';

import { Feedback } from 'src/APIs/feedbacks/entities/feedback.entity';

export class DeleteUserInput extends PickType(Feedback, ['content', 'type']) {}
