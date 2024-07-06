import { ApiProperty, PickType } from '@nestjs/swagger';
import { Comment } from '../../entities/comment.entity';
import { UserPrimaryResponseDto } from 'src/APIs/users/dtos/response/user-primary-response.dto';

export class CommentChildrenDto extends PickType(Comment, [
  'id',
  'userId',
  'content',
  'dateCreated',
  'dateUpdated',
  'dateDeleted',
  'reportCount',
  'parentId',
  'articleId',
]) {
  @ApiProperty({ description: '작성자의 정보', type: UserPrimaryResponseDto })
  user: UserPrimaryResponseDto;
}
