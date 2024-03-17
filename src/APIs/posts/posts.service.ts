import { Injectable } from '@nestjs/common';
import { AwsService } from 'src/aws/aws.service';
import { UtilsService } from 'src/utils/utils.service';
import { DataSource, Repository } from 'typeorm';
import { Posts } from './entities/posts.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { Page } from '../../utils/page';
import { FetchPostsDto } from './dto/fetch-posts.dto';

@Injectable()
export class PostsService {
  constructor(
    private readonly awsService: AwsService,
    private readonly utilsService: UtilsService,
    private readonly dataSource: DataSource,
    @InjectRepository(Posts)
    private readonly postsRepository: Repository<Posts>,
  ) {}
  async saveImage(file: Express.Multer.File) {
    return await this.imageUpload(file);
  }

  async imageUpload(file: Express.Multer.File) {
    const imageName = this.utilsService.getUUID();
    const ext = file.originalname.split('.').pop();

    const imageUrl = await this.awsService.imageUploadToS3(
      `${imageName}.${ext}`,
      file,
      ext,
    );

    return { imageUrl };
  }

  async create({ kakaoId }): Promise<Posts> {
    return await this.postsRepository.save({ user: kakaoId });
  }

  async publish({
    id,
    user,
    postCategory,
    postBackground,
    allow_comment,
    scope,
  }: CreatePostDto): Promise<Posts> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.query('SELECT * FROM users');
    await queryRunner.startTransaction();
    try {
      const post = await this.postsRepository.findOne({
        where: {
          id,
        },
      });
      const updatedPost = await this.postsRepository.save({
        ...post,
        allow_comment,
        scope,
        postBackground: { id: postBackground },
        postCategory: { id: postCategory },
        user: { kakaoId: user },
        isPublished: true,
      });
      await queryRunner.commitTransaction();
      return updatedPost;
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
  async fetchPosts(page: FetchPostsDto) {
    const total = await this.postsRepository.count({
      where: { isPublished: true },
    });
    console.log(page);
    console.log(page.getLimit());
    console.log(page.getOffset());
    const posts = await this.postsRepository.find({
      where: { isPublished: true },
      order: { id: 'DESC' },
      take: page.getLimit(),
      skip: page.getOffset(),
    });
    return new Page<Posts>(total, page.pageSize, posts);
  }
}
