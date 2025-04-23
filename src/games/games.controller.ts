import { Controller, Get, Param, Query, ParseIntPipe } from '@nestjs/common';
import { GamesService } from './games.service';

@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @Get()
  findAll(@Query() query) {
    return this.gamesService.findAll(query);
  }

  @Get('search')
  searchGames(@Query('term') term: string) {
    return this.gamesService.searchGames(term);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.gamesService.findOne(id);
  }
}
