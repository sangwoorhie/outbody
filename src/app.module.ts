import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './config/typeorm.config.service';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtConfigService } from './config/jwt.config.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ChallengeModule } from './challenges/challenges.module';
import { PostModule } from './posts/posts.module';
import { RecordsModule } from './records/records.module';
import { AuthMiddleware } from './common/middlewares/auth.middleware';
import { FollowsModule } from './follows/follows.module';
import { ReportsModule } from './reports/reports.module';
import { BlackListModule } from './blacklists/blacklists.module';
import { LikesModule } from './likes/likes.module';
import { CommentsModule } from './comments/comments.module';
import { CommentsRepository } from './comments/repositories/comments.repository';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: TypeOrmConfigService,
      inject: [ConfigService],
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useClass: JwtConfigService,
      inject: [ConfigService],
    }),
    AuthModule,
    UserModule,
    ChallengeModule,
    PostModule,
    RecordsModule,
    FollowsModule,
    ReportsModule,
    BlackListModule,
    LikesModule,
    CommentsModule,
    CommentsRepository,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude(
        { path: 'auth/login', method: RequestMethod.POST },
        { path: 'users/signup', method: RequestMethod.POST },
        { path: 'auth/kakao', method: RequestMethod.GET },
      )
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
