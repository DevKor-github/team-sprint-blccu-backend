import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentsModule } from './APIs/comments/comments.module';
import { PostsModule } from './APIs/posts/posts.module';
import { UsersModule } from './APIs/users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './APIs/auth/auth.module';
import { FollowsModule } from './APIs/follows/follows.module';
import { PostBackgroundsModule } from './APIs/postBackgrounds/postBackgrounds.module';
import { PostCategoriesModule } from './APIs/postCategories/PostCategories.module';
import { LikesModule } from './APIs/likes/likes.module';
import { StickersModule } from './APIs/stickers/stickers.module';
import { StickerCategoriesModule } from './APIs/stickerCategories/stickerCategories.module';
import { StickerBlocksModule } from './APIs/stickerBlocks/stickerBlocks.module';
import { NotificationsModule } from './APIs/notifications/notifications.module';
import { AnnouncementsModule } from './APIs/announcements/announcements.module';
import { ReportsModule } from './APIs/reports/reports.module';
import { AuthTokenMiddleware } from './common/middlewares/auth-token.middleware';
import { JwtModule } from '@nestjs/jwt';
import { AgreementsModule } from './APIs/agreements/agreements.module';
import { FeedbacksModule } from './APIs/feedbacks/feedbacks.module';
import { parseBoolean } from './common/validators/isBoolean';
import { RedisClientOptions } from 'redis';
import { CacheModule } from '@nestjs/cache-manager';
// import * as redisStore from 'cache-manager-redis-store';
import { BullModule } from '@nestjs/bull';
import { redisStore } from 'cache-manager-redis-yet';
import { TerminusModule } from '@nestjs/terminus';
import { HttpModule } from '@nestjs/axios';
import { MetricsModule } from './modules/metrics/metrics.module';
import { DevtoolsModule } from '@nestjs/devtools-integration';

@Module({
  imports: [
    MetricsModule,
    AnnouncementsModule,
    AgreementsModule,
    FeedbacksModule,
    StickersModule,
    StickerCategoriesModule,
    StickerBlocksModule,
    PostsModule,
    CommentsModule,
    LikesModule,
    UsersModule,
    PostCategoriesModule,
    AuthModule,
    FollowsModule,
    NotificationsModule,
    PostBackgroundsModule,
    ReportsModule,
    TerminusModule,
    HttpModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DevtoolsModule.register({
      http: true,
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: configService.get<string>('JWT_EXPIRES_IN') },
      }),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        bigNumberStrings: false,
        type: configService.get<string>('DATABASE_TYPE') as 'mysql',
        host: configService.get<string>('DATABASE_HOST'),
        port: parseInt(configService.get<string>('DATABASE_PORT')),
        username: configService.get<string>('DATABASE_USERNAME'),
        password: configService.get<string>('DATABASE_PASSWORD'),
        database: configService.get<string>('DATABASE_DATABASE'),
        entities: [__dirname + '/APIs/**/*.entity.*'],
        migrations: ['dist/migrations/*{.ts,.js}'], // migration 수행할 파일
        cli: {
          migrationsDir: 'src/migrations', // migration 파일을 생성할 디렉토리
        },
        migrationsTableName: 'migrations', // migration 내용이 기록될 테이블명(default = migration),
        synchronize: parseBoolean(
          configService.get<string>('DATABASE_SYNCHRO'),
        ),
        logging: true,
      }),
    }),

    CacheModule.registerAsync<RedisClientOptions>({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        store: await redisStore({
          database: parseInt(configService.get<string>('REDIS_CACHE_DB')),
          ttl: parseInt(configService.get<string>('REDIS_TTL')),
          socket: {
            host: configService.get<string>('REDIS_HOST'),
            port: parseInt(configService.get<string>('REDIS_PORT')),
          },
        }),
      }),
      isGlobal: true,
    }),

    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get<string>('REDIS_HOST'),
          port: parseInt(configService.get<string>('REDIS_PORT')),
          db: parseInt(configService.get<string>('REDIS_QUEUE_DB')),
        },
        isGlobal: true,
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthTokenMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
