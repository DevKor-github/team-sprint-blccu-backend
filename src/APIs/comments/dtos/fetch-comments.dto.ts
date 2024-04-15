import { ApiProperty, PickType } from '@nestjs/swagger';
import { UserPrimaryResponseDto } from 'src/APIs/users/dtos/user-response.dto';
import { Comment } from '../entities/comment.entity';

export class ChildrenComment extends PickType(Comment, [
  'id',
  'userKakaoId',
  'content',
  'date_created',
  'date_updated',
  'date_deleted',
  'blame_count',
  'parentId',
  'postsId',
]) {
  @ApiProperty({ description: '작성자의 정보', type: UserPrimaryResponseDto })
  user: UserPrimaryResponseDto;
}

export class FetchCommentsDto extends PickType(Comment, [
  'id',
  'userKakaoId',
  'content',
  'date_created',
  'date_updated',
  'date_deleted',
  'blame_count',
  'parentId',
  'postsId',
]) {
  @ApiProperty({ description: '작성자의 정보', type: UserPrimaryResponseDto })
  user: UserPrimaryResponseDto;

  @ApiProperty({ description: '자식 댓글 배열', type: [ChildrenComment] })
  children: ChildrenComment[];
}
