import { OmitType } from "@nestjs/swagger";
import { Feedback } from "../../entities/feedback.entity";

export class FeedbackDto extends OmitType(Feedback, ['user'])