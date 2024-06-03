import {
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { PostBackgroundsService } from './postBackgrounds.service';
import {
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ImageUploadDto } from '../../common/dto/image-upload.dto';
import { ImageUploadResponseDto } from 'src/common/dto/image-upload-response.dto';
import { PostBackground } from './entities/postBackground.entity';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('')
export class PostBackgroundsController {
  constructor(
    private readonly postBackgroundsService: PostBackgroundsService,
  ) {}

  @ApiTags('어드민 API')
  @ApiOperation({ summary: '내지 업로드' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: '업로드 할 파일',
    type: ImageUploadDto,
  })
  @ApiCreatedResponse({
    description: '이미지 서버에 파일 업로드 완료',
    type: ImageUploadResponseDto,
  })
  @Post('users/admin/posts/background')
  @UseInterceptors(FileInterceptor('file'))
  @HttpCode(201)
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<ImageUploadResponseDto> {
    const url = await this.postBackgroundsService.imageUpload(file);
    return url;
  }

  @ApiTags('게시글 API')
  @ApiOperation({ summary: '내지 모두 불러오기' })
  @ApiOkResponse({
    description: '모든 내지 fetch 완료',
    type: [PostBackground],
  })
  @Get('posts/backgrounds')
  async fetchAll(): Promise<PostBackground[]> {
    return await this.postBackgroundsService.fetchAll();
  }

  @ApiTags('어드민 API')
  @ApiOperation({ summary: '내지 삭제하기' })
  @Delete('users/admin/posts/background/:id')
  async delete(@Param('id') id: string) {
    return await this.postBackgroundsService.delete({ id });
  }
}
