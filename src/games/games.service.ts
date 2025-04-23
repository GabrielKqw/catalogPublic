import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class GamesService {
  private readonly apiBaseUrl = 'https://www.freetogame.com/api';

  async findAll(query?: any) {
    try {
      let endpoint = `${this.apiBaseUrl}/games`;
      
      // Adicionar parâmetros de consulta se fornecidos
      if (query) {
        const queryParams = new URLSearchParams();
        
        if (query.platform) queryParams.append('platform', query.platform);
        if (query.category) queryParams.append('category', query.category);
        if (query.sortBy) queryParams.append('sort-by', query.sortBy);
        
        if (queryParams.toString()) {
          endpoint += `?${queryParams.toString()}`;
        }
      }
      
      const response = await axios.get(endpoint);
      return response.data;
    } catch (error) {
      throw new HttpException(
        'Erro ao buscar jogos da API externa',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: number) {
    try {
      // Primeiro, verificar se o jogo já existe no banco de dados
      const existingGame = await prisma.game.findUnique({
        where: { apiId: id.toString() },
      });

      if (existingGame) {
        // Se o jogo já existe, retornar do banco de dados com comentários
        return {
          ...existingGame,
          comments: await prisma.comment.findMany({
            where: { gameId: existingGame.id },
            include: { user: { select: { id: true, username: true } } },
          }),
        };
      }

      // Se não existe, buscar da API externa
      const response = await axios.get(`${this.apiBaseUrl}/game?id=${id}`);
      const gameData = response.data;

      // Salvar no banco de dados para futuras consultas
      const newGame = await prisma.game.create({
        data: {
          title: gameData.title,
          description: gameData.description,
          imageUrl: gameData.thumbnail,
          releaseDate: gameData.release_date ? new Date(gameData.release_date) : null,
          developer: gameData.developer,
          publisher: gameData.publisher,
          genres: gameData.genre ? [gameData.genre] : [],
          apiId: id.toString(),
        },
      });

      return {
        ...newGame,
        comments: [],
      };
    } catch (error) {
      throw new HttpException(
        'Erro ao buscar detalhes do jogo',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async searchGames(searchTerm: string) {
    try {
      // Buscar todos os jogos da API
      const allGames = await this.findAll();
      
      // Filtrar jogos que correspondem ao termo de pesquisa
      const filteredGames = allGames.filter(game => 
        game.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (game.description && game.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      
      return filteredGames;
    } catch (error) {
      throw new HttpException(
        'Erro ao pesquisar jogos',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
