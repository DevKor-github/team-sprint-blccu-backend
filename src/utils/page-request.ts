//pageRequest.ts
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

//페이지네이션 요청 받을때 사용하는 클래스 양식
export class PageRequest {
  //@IsOptional() 데코레이터는 undefined도 받을 수 있다.
  @ApiProperty({
    description: '요청할 페이지 번호',
    type: Number,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  pageNo?: number | 1;

  @ApiProperty({
    description: '한 페이지 당 아이템 갯수',
    type: Number,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  pageSize?: number | 10;

  getOffset(): number {
    if (this.pageNo < 1 || this.pageNo === null || this.pageNo === undefined) {
      this.pageNo = 1;
    }

    if (
      this.pageSize < 1 ||
      this.pageSize === null ||
      this.pageSize === undefined
    ) {
      this.pageSize = 10;
    }

    return (Number(this.pageNo) - 1) * Number(this.pageSize);
  }

  getLimit(): number {
    if (
      this.pageSize < 1 ||
      this.pageSize === null ||
      this.pageSize === undefined
    ) {
      this.pageSize = 10;
    }
    return Number(this.pageSize);
  }
}
