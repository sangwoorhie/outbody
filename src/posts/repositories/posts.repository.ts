import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Post } from '../entities/post.entity';

@Injectable()
export class PostsRepository extends Repository<Post> {
  constructor(private readonly dataSource: DataSource) {
    super(Post, dataSource.createEntityManager());
  }

  // 오운완 인증 게시글 생성
  async createPost(
    description: string,
    imgUrl: string,
    challengeId: number,
    userId: number,
  ): Promise<Post> {
    const newPost = await this.create({
      description,
      imgUrl,
      challengeId,
      userId,
    });
    await this.save(newPost);

    return newPost;
  }

  // 오운완 전체 조회
  async findAll(challengeId): Promise<Post[]> {
    const allPost = await this.find({
      where: { challengeId },
    });
    return allPost;
  }

  // 오운완 상세 조회
  async findOne(postId): Promise<Post> {
    const onePost = await this.findOne({
      where: { id: postId },
    });

    return onePost;
  }

  // 오운완 삭제
  async deletePost(postId: number): Promise<any> {
    const deletePost = await this.delete(postId);

    return deletePost;
  }
}
