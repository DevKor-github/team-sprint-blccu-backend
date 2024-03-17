import { ApiProperty } from '@nestjs/swagger';

export class Page<T> {
  @ApiProperty({ description: '한 페이지 당 아이템 갯수', type: Number })
  pageSize: number;

  @ApiProperty({ description: '전체 아이템 갯수', type: Number })
  totalCount: number;

  @ApiProperty({ description: '요청할 페이지 번호', type: Number })
  totalPage: number;

  @ApiProperty({ description: '아이템 배열', type: [] })
  items: T[];
  constructor(totalCount: number, pageSize: number, items: T[]) {
    this.pageSize = pageSize;
    this.totalCount = totalCount;
    this.totalPage = Math.ceil(totalCount / pageSize);
    this.items = items;
  }
}
