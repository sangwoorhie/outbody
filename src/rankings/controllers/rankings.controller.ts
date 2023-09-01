import { Controller, Get, Req, Query } from '@nestjs/common';
import { RankingsService } from '../services/rankings.service';

@Controller('rank')
export class RankingsController {
  constructor(private readonly rankingsService: RankingsService) {}

  // 전체 순위 조회
  // GET http://localhost:3000/rank/total
  @Get('/total')
  async getTotalRank(
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
  ) {
    return await this.rankingsService.getTotalRank(page, pageSize);
  }

  // 친구 순위 조회
  // GET http://localhost:3000/rank/followings
  @Get('/followings')
  async getFollowingRank(
    @Req() req: any,
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
  ) {
    return await this.rankingsService.getFollowingRank(
      req.user.id,
      page,
      pageSize,
    );
  }
}
