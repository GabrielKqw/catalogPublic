import { Controller, Post, Body, UseGuards, Request, Delete, Param, ParseIntPipe } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Controller('comments')
export class CommentsController {
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Request() req, @Body() commentData: { gameId: number; content: string; rating?: number }) {
    const userId = req.user.userId;
    
    return prisma.comment.create({
      data: {
        content: commentData.content,
        rating: commentData.rating,
        user: {
          connect: { id: userId }
        },
        game: {
          connect: { id: commentData.gameId }
        }
      },
      include: {
        user: {
          select: {
            id: true,
            username: true
          }
        }
      }
    });
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Request() req, @Param('id', ParseIntPipe) id: number) {
    const userId = req.user.userId;
    
    // Verificar se o comentário pertence ao usuário
    const comment = await prisma.comment.findUnique({
      where: { id },
      include: { user: true }
    });
    
    if (!comment || comment.user.id !== userId) {
      return { success: false, message: 'Não autorizado a excluir este comentário' };
    }
    
    await prisma.comment.delete({
      where: { id }
    });
    
    return { success: true, message: 'Comentário excluído com sucesso' };
  }
}
