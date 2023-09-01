import {
  Body,
  Controller,
  Post,
  UseInterceptors,
  Get,
  Delete,
  Param,
  Req,
} from '@nestjs/common';
import { ChallengesService } from '../services/challenges.service';
import { CreateChallengeRequestDto } from '../dto/create-challenge.request.dto';
import { InviteChallengeDto } from '../dto/invite-challenge.dto';
import { Position } from '../challengerInfo';
import { ResponseChallengeDto } from '../dto/response-challenge.dto';

@Controller('challenge')
@UseInterceptors(Response)
export class ChallengesController {
  constructor(private readonly challengesService: ChallengesService) {}

  // 도전 생성
  // POST. http://localhost:3000/challenge
  @Post()
  async createChallenge(
    @Body() body: CreateChallengeRequestDto,
    @Req() req: any,
  ) {
    return await this.challengesService.createChallenge(body, req.user.id);
  }

  // 도전 목록조회
  // GET http://localhost:3000/challenge
  @Get()
  async getChallenges() {
    const challenges = await this.challengesService.getChallenges();
    return challenges;
  }

  // 도전 상세조회
  // GET http://localhost:3000/challenge/:id
  @Get('/:challengeId')
  async getChallenge(@Param('challengeId') challengeId: number) {
    const challenge = await this.challengesService.getChallenge(challengeId);
    return challenge;
  }

  // 도전 삭제
  // DELETE http://localhost:3000/challenge/:id
  @Delete('/:challengeId')
  async deleteChallenge(
    @Param('challengeId') challengeId: number,
    @Req() req: any,
  ) {
    await this.challengesService.deleteChallenge(challengeId, req.user.id);
  }

  // 도전 방 입장
  // POST http://localhost:3000/challenge/:id/enter
  @Post('/:challengeId/enter')
  async joinChallenge(
    @Param('challengeId') challengeId: number,
    @Body() type: Position,
    @Req() req: any,
  ) {
    return await this.challengesService.joinChallenge(challengeId, req.user.id);
  }

  // 도전 방 퇴장
  // DELETE http://localhost:3000/challenge/:id/leave
  @Delete('/:challengeId/leave')
  async leaveChallenge(
    @Param('challengeId') challengeId: number,
    @Req() req: any,
  ) {
    return await this.challengesService.leaveChallenge(
      challengeId,
      req.user.id,
    );
  }

  // 도전 친구 초대
  // POST http://localhost:3000/challenge/:id/invite
  @Post('/:challengeId/invite')
  async inviteChallenge(
    @Param('challengeId') challengeId: number,
    @Body() body: InviteChallengeDto,
    @Req() req: any,
  ) {
    return await this.challengesService.inviteChallenge(
      challengeId,
      body,
      req.user,
    );
  }

  // 도전 친구 초대 전체조회
  // GET http://localhost:3000/challenge/invite/list
  @Get('/invite/list')
  async getInvitedChallengies(@Req() req: any) {
    return await this.challengesService.getInvitedChallenges(req.user.id);
  }

  // 도전 초대 수락
  // POST http://localhost:3000/challenge/:id/accept
  @Post('/:userId/accept')
  async acceptChallenge(
    @Param('userId') userId: number,
    @Body() body: ResponseChallengeDto,
    @Req() req: any,
  ) {
    return await this.challengesService.acceptChallenge(
      userId,
      body,
      req.user.id,
    );
  }

  // 유저 도전목록수 + 도전목록조회
  // http://localhost:3000/challenge/user/list
  @Get('/user/list')
  async getUserChallenges(@Req() req: any) {
    const userId = req.user.id;
    const [posts, userChallengeCount] =
      await this.challengesService.getUserChallenges(userId);

    const usersChallenges = posts.map((challenge) => {
      return {
        postId: challenge.id,
        title: challenge.title,
        startDate: challenge.startDate,
        endDate: challenge.endDate,
        challengeWeek: challenge.challengeWeek,
        description: challenge.description,
      };
    });

    return {
      totalChallenges: userChallengeCount,
      usersChallenges: usersChallenges,
    };
  }
}
