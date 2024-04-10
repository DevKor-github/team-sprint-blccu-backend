import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AwsService } from 'src/utils/aws/aws.service';
import { UtilsService } from 'src/utils/utils.service';
import { DataSource, Repository } from 'typeorm';
import { Posts } from './entities/posts.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Page } from '../../utils/pages/page';
import { FetchPostsDto } from './dtos/fetch-posts.dto';
import { PagePostResponseDto } from './dtos/page-post-response.dto';
import { Neighbor } from '../neighbors/entities/neighbor.entity';
import { FetchFriendsPostsDto } from './dtos/fetch-friends-posts.dto';
import { CreatePostDto } from './dtos/create-post.dto';
import { PostCategory } from '../postCategories/entities/postCategory.entity';
import { PostBackground } from '../postBackgrounds/entities/postBackground.entity';
import { User } from '../users/entities/user.entity';
import { ImageUploadResponseDto } from 'src/commons/dto/image-upload-response.dto';
import { StickerBlocksService } from '../stickerBlocks/stickerBlocks.service';
import { PostsRepository } from './posts.repository';
import { CommentsService } from '../comments/comments.service';

@Injectable()
export class PostsService {
  constructor(
    private readonly awsService: AwsService,
    private readonly utilsService: UtilsService,
    private readonly dataSource: DataSource,
    private readonly stickerBlocksService: StickerBlocksService,
    private readonly commentsService: CommentsService,
    private readonly postsRepository: PostsRepository,
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
    return data;
  }

  async fkValidCheck({ posts, passNonEssentail }) {
    console.log(posts);
    const pc = await this.dataSource
      .getRepository(PostCategory)
      .createQueryBuilder('pc')
      .where('pc.id = :id', { id: posts.postCategoryId })
      .getOne();
    if (!pc && !passNonEssentail)
      throw new BadRequestException('존재하지 않는 post_category입니다.');
    const pg = await this.dataSource
      .getRepository(PostBackground)
      .createQueryBuilder('pg')
      .where('pg.id = :id', { id: posts.postBackgroundId })
      .getOne();
    if (!pg)
      throw new BadRequestException('존재하지 않는 post_background입니다.');
    const us = await this.dataSource
      .getRepository(User)
      .createQueryBuilder('us')
      .where('us.kakaoId = :id', { id: posts.userKakaoId })
      .getOne();
    if (!us) throw new BadRequestException('존재하지 않는 user입니다.');
  }

  async save(createPostDto: CreatePostDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    let post = {};
    try {
      if (createPostDto.id) {
        // 이때 락 걸어야 되나?
        post = await queryRunner.manager.findOne(Posts, {
          where: {
            id: createPostDto.id,
          },
        });
        if (!post) {
          await delete createPostDto.id;
          post = {};
        }
      }
      Object.keys(createPostDto).map((el) => {
        const value = createPostDto[el];
        if (createPostDto[el]) {
          post[el] = value;
        }
      });
      await this.fkValidCheck({
        posts: post,
        passNonEssentail: !createPostDto.isPublished,
      });
      console.log(post);
      // queryRunner 안에서는 커스텀 레포 메서드 사용 불가능. 직접 짤 것.
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
    const postsAndCounts = await this.postsRepository.fetchPosts(page);

    return new Page<Posts>(postsAndCounts[1], page.pageSize, postsAndCounts[0]);
  }

  async fetchPostForUpdate({ id }) {
    // 카카오 아이디로 valid check? 공개설정 안된 게시글 fetch 못하게 하자!!
    const data = await this.existCheck({ id });
    await this.fkValidCheck({ posts: data, passNonEssentail: true });
    const post = await this.postsRepository.fetchPostForUpdate(id);

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
    const postsAndCounts = await this.postsRepository.fetchFriendsPosts(
      subQuery,
      page,
    );

    console.log(postsAndCounts);
    return new Page<Posts>(postsAndCounts[1], page.pageSize, postsAndCounts[0]);
  }

  async fetchTempPosts({ kakaoId }): Promise<Posts[]> {
    return await this.postsRepository.fetchTempPosts(kakaoId);
  }

  async fetchDetail({ id }) {
    const data = await this.existCheck({ id });
    await this.fkValidCheck({ posts: data, passNonEssentail: false });
    const comments = await this.commentsService.fetchComments({ postsId: id });
    const post = await this.postsRepository.fetchPostDetail(id);
    return { comments, post };
  }

  async softDelete({ kakaoId, id }) {
    return await this.postsRepository.softDelete({ user: { kakaoId }, id });
  }

  async hardDelete({ kakaoId, id }) {
    return await this.postsRepository.delete({ user: { kakaoId }, id });
  }
}
