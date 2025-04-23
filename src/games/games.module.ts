import { Module } from '@nestjs/common';
import { GamesService } from './games.service';
import { GamesController } from './games.controller';
import { CommentsController } from './comments.controller';

@Module({
  controllers: [GamesController, CommentsController],
  providers: [GamesService],
  exports: [GamesService],
})
export class GamesModule {}
