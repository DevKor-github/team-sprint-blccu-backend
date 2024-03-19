import { Injectable } from '@nestjs/common';
import { AwsService } from 'src/aws/aws.service';
import { UtilsService } from 'src/utils/utils.service';
import { DataSource, Repository } from 'typeorm';
import { Posts } from './entities/posts.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { Page } from '../../utils/page';
import { FETCH_POST_OPTION, FetchPostsDto } from './dto/fetch-posts.dto';
import { CreatePostResponseDto } from './dto/create-post-response.dto';
import { PublishPostDto } from './dto/publish-post.dto';
import { PagePostResponseDto } from './dto/page-post-response.dto';
import { Neighbor } from '../neighbors/entities/neighbor.entity';
import { FetchFriendsPostsDto } from './dto/fetch-friends-posts.dto';

@Injectable()
export class PostsService {
  constructor(
    private readonly awsService: AwsService,
    private readonly utilsService: UtilsService,
    private readonly dataSource: DataSource,
    @InjectRepository(Posts)
    private readonly postsRepository: Repository<Posts>,
    @InjectRepository(Neighbor)
    private readonly neighborsRepository: Repository<Neighbor>,
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

  async create({ kakaoId }): Promise<CreatePostResponseDto> {
    return await this.postsRepository.save({ user: kakaoId });
  }

  async publish({
    id,
    user,
    postCategory,
    postBackground,
    allow_comment,
    scope,
    title,
  }: CreatePostDto): Promise<PublishPostDto> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const post = await queryRunner.manager.findOne(Posts, {
        where: {
          id,
        },
      });
      const updatedPost = await queryRunner.manager.save(Posts, {
        ...post,
        title,
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
  async fetchPosts(page: FetchPostsDto): Promise<PagePostResponseDto> {
    const total = await this.postsRepository.count({
      where: { isPublished: true },
    });
    const posts = await this.postsRepository.find({
      select: FETCH_POST_OPTION,
      relations: { user: true, postBackground: true, postCategory: true },
      where: { isPublished: true },
      order: { id: 'DESC' },
      take: page.getLimit(),
      skip: page.getOffset(),
    });
    return new Page<Posts>(total, page.pageSize, posts);
  }
  async fetchFriendsPosts({
    kakaoId,
    page,
  }: FetchFriendsPostsDto): Promise<PagePostResponseDto> {
    const subQuery = await this.neighborsRepository
      .createQueryBuilder('n')
      .select('n.toUserKakaoId')
      .where(`n.fromUserKakaoId = ${kakaoId}`)
      .getQuery();
    const postsAndCounts = await this.postsRepository
      .createQueryBuilder('p')
      .innerJoin('p.user', 'user')
      .innerJoinAndSelect('p.postBackground', 'postBackground')
      .innerJoinAndSelect('p.postCategory', 'postCategory')
      .addSelect([
        'user.kakaoId',
        'user.description',
        'user.profile_image',
        'user.username',
      ])
      .where(`p.user_id = any(${subQuery})`)
      .andWhere('p.isPublished = true')
      .orderBy('p.id', 'DESC')
      .take(page.getTake())~``
      .skip(page.getSkip())
      .getManyAndCount();
    console.log(postsAndCounts);
    return new Page<Posts>(postsAndCounts[1], page.pageSize, postsAndCounts[0]);
  }

  async fetchTempPosts({ kakaoId }): Promise<Posts[]> {
    return await this.postsRepository.find({
      select: FETCH_POST_OPTION,
      relations: { user: true, postBackground: true, postCategory: true },
      where: { user: { kakaoId }, isPublished: false },
    });
  }

  async softDelete({ kakaoId, id }) {
    return await this.postsRepository.softDelete({ user: { kakaoId }, id });
  }

  async hardDelete({ kakaoId, id }) {
    return await this.postsRepository.delete({ user: { kakaoId }, id });
  }
}
