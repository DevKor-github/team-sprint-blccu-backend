import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AwsService } from 'src/aws/aws.service';
import { UtilsService } from 'src/utils/utils.service';
import { DataSource, Repository } from 'typeorm';
import { Posts } from './entities/posts.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Page } from '../../utils/page';
import { FetchPostsDto } from './dto/fetch-posts.dto';
import { PagePostResponseDto } from './dto/page-post-response.dto';
import { Neighbor } from '../neighbors/entities/neighbor.entity';
import { FetchFriendsPostsDto } from './dto/fetch-friends-posts.dto';
import { CreatePostDto } from './dto/create-post.dto';
import { PostCategory } from '../postCategories/entities/postCategory.entity';
import { PostBackground } from '../postBackgrounds/entities/postBackground.entity';
import { User } from '../users/entities/user.entity';
import { OpenScope } from 'src/commons/enums/open-scope.enum';
import { ImageUploadResponseDto } from 'src/commons/dto/image-upload-response.dto';
import { StickerBlocksService } from '../stickerBlocks/stickerBlocks.service';

@Injectable()
export class PostsService {
  constructor(
    private readonly awsService: AwsService,
    private readonly utilsService: UtilsService,
    private readonly dataSource: DataSource,
    private readonly stickerBlocksService: StickerBlocksService,
    @InjectRepository(Posts)
    private readonly postsRepository: Repository<Posts>,
    @InjectRepository(Neighbor)
    private readonly neighborsRepository: Repository<Neighbor>,
  ) {}
  async saveImage(file: Express.Multer.File) {
    return await this.imageUpload(file);
  }

  async imageUpload(
    file: Express.Multer.File,
  ): Promise<ImageUploadResponseDto> {
    const imageName = this.utilsService.getUUID();
    const ext = file.originalname.split('.').pop();

    const image_url = await this.awsService.imageUploadToS3(
      `${imageName}.${ext}`,
      file,
      ext,
    );

    return { image_url };
  }
  async findPostsById({ id }) {
    return await this.postsRepository.findOne({ where: { id } });
  }

  async existCheck({ id }) {
    const data = await this.findPostsById({ id });
    if (!data) throw new NotFoundException('게시글을 찾을 수 없습니다.');
  }

  async fkValidCheck(posts) {
    try {
      if (posts.postCategoryId || posts.isPublished) {
        const pc = await this.dataSource
          .getRepository(PostCategory)
          .createQueryBuilder('pc')
          .where('pc.id = :id', { id: posts.postCategoryId })
          .getOne();
        if (!pc)
          throw new BadRequestException('존재하지 않는 post_category입니다.');
      }
      if (posts.postBackgroundId || posts.isPublished) {
        const pg = await this.dataSource
          .getRepository(PostBackground)
          .createQueryBuilder('pg')
          .where('pg.id = :id', { id: posts.postBackgroundId })
          .getOne();
        if (!pg)
          throw new BadRequestException('존재하지 않는 post_background입니다.');
      }
      if (posts.userKakaoId || posts.isPublished) {
        const us = await this.dataSource
          .getRepository(User)
          .createQueryBuilder('us')
          .where('us.kakaoId = :id', { id: posts.userKakaoId })
          .getOne();
        if (!us) throw new BadRequestException('존재하지 않는 user입니다.');
      }
    } catch (e) {
      throw e;
    }
  }

  async save(createPostDto: CreatePostDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    let post = {};
    try {
      if (createPostDto.id) {
        post = await queryRunner.manager.findOne(Posts, {
          where: {
            id: createPostDto.id,
          },
        });
        if (!post) {
          await delete createPostDto.id;
          post = {};
        }
        // if (!post) await delete createPostDto.id;
      }
      Object.keys(createPostDto).map((el) => {
        const value = createPostDto[el];
        if (createPostDto[el]) {
          post[el] = value;
        }
      });
      await this.fkValidCheck(post);
      const data = await queryRunner.manager
        .createQueryBuilder()
        .insert()
        .into(Posts, Object.keys(post))
        .values(post)
        .orUpdate(Object.keys(post), ['id'], {
          skipUpdateIfNoValuesChanged: true,
        })
        .execute();
      await queryRunner.commitTransaction();
      return data;
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
  }
  async fetchPosts(page: FetchPostsDto): Promise<PagePostResponseDto> {
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
      .where('p.isPublished = true')
      .andWhere('p.scope IN (:...scopes)', { scopes: [OpenScope.PUBLIC] })
      .orderBy('p.id', 'DESC')
      .take(page.getLimit())
      .skip(page.getOffset())
      .getManyAndCount();

    return new Page<Posts>(postsAndCounts[1], page.pageSize, postsAndCounts[0]);
  }

  async fetchPostForUpdate({ id }) {
    // 카카오 아이디로 valid check? 공개설정 안된 게시글 fetch 못하게 하자!!
    await this.existCheck({ id });
    await this.fkValidCheck({ id });
    const post = await this.postsRepository
      .createQueryBuilder('p')
      .innerJoin('p.user', 'user')
      // .innerJoinAndSelect('p.postBackground', 'postBackground')
      // .innerJoinAndSelect('p.postCategory', 'postCategory')
      .addSelect([
        'user.kakaoId',
        'user.description',
        'user.profile_image',
        'user.username',
      ])
      .where('p.id = :id', { id })
      .getOne();
    const stickerBlocks = await this.stickerBlocksService.fetchBlocks({
      postsId: id,
    });
    return { post, stickerBlocks };
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
      .andWhere('p.scope IN (:...scopes)', {
        scopes: [OpenScope.PUBLIC, OpenScope.PROTECTED],
      })
      .andWhere('p.isPublished = true')
      .orderBy('p.id', 'DESC')
      .take(page.getLimit())
      .skip(page.getOffset())
      .getManyAndCount();
    console.log(postsAndCounts);
    return new Page<Posts>(postsAndCounts[1], page.pageSize, postsAndCounts[0]);
  }

  async fetchTempPosts({ kakaoId }): Promise<Posts[]> {
    return await this.postsRepository
      .createQueryBuilder('p')
      .where(`p.userKakaoId = ${kakaoId}`)
      .andWhere(`p.isPublished = false`)
      .getMany();
  }

  async softDelete({ kakaoId, id }) {
    return await this.postsRepository.softDelete({ user: { kakaoId }, id });
  }

  async hardDelete({ kakaoId, id }) {
    return await this.postsRepository.delete({ user: { kakaoId }, id });
  }
}
