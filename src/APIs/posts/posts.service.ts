import { Injectable } from '@nestjs/common';
import { AwsService } from 'src/aws/aws.service';
import { UtilsService } from 'src/utils/utils.service';
import { DataSource, Repository } from 'typeorm';
import { Posts } from './entities/posts.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Page } from '../../utils/page';
import { FETCH_POST_OPTION, FetchPostsDto } from './dto/fetch-posts.dto';
import { PublishPostDto } from './dto/publish-post.dto';
import { PagePostResponseDto } from './dto/page-post-response.dto';
import { Neighbor } from '../neighbors/entities/neighbor.entity';
import { FetchFriendsPostsDto } from './dto/fetch-friends-posts.dto';
import { CreatePostDto } from './dto/create-post.dto';

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

  async save({
    id,
    userKakaoId,
    postCategoryId,
    postBackgroundId,
    allow_comment,
    scope,
    title,
    isPublished,
    content,
    image_url,
    main_image_url,
  }: CreatePostDto): Promise<PublishPostDto> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    let post = {};
    console.log(userKakaoId);
    try {
      if (id) {
        post = await queryRunner.manager.findOne(Posts, {
          where: {
            id,
          },
        });
      }
      const data = {
        ...post,
        title,
        allow_comment,
        scope,
        postBackground: { id: postBackgroundId },
        postCategory: { id: postCategoryId },
        user: { kakaoId: userKakaoId },
        isPublished,
        content,
        image_url,
        main_image_url,
      };
      const updatedPost = await queryRunner.manager.save(Posts, data);
      await queryRunner.commitTransaction();
      return updatedPost;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
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
      .where(`p.userKakaoId = any(${subQuery})`)
      .andWhere('p.isPublished = true')
      .orderBy('p.id', 'DESC')
      .take(page.getLimit())
      .skip(page.getOffset())
      .getManyAndCount();
    console.log(postsAndCounts);
    return new Page<Posts>(postsAndCounts[1], page.pageSize, postsAndCounts[0]);
  }

  async fetchTempPosts({ kakaoId }): Promise<Posts[]> {
    return await this.postsRepository.find({
      select: FETCH_POST_OPTION,
      relations: { user: true, postBackground: true, postCategory: true },
      where: { isPublished: false, user: { kakaoId } },
    });
  }

  async softDelete({ kakaoId, id }) {
    return await this.postsRepository.softDelete({ user: { kakaoId }, id });
  }

  async hardDelete({ kakaoId, id }) {
    return await this.postsRepository.delete({ user: { kakaoId }, id });
  }
}
