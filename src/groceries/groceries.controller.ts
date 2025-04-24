import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Put,
  UseGuards,
  Req,
} from '@nestjs/common';
import { GroceriesService } from './groceries.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FilterQuery } from 'mongoose';
import { GroceryItem } from './schemas/grocery-item.schema';
import { Request } from 'express';

interface RequestWithUser extends Request {
  user: {
    userId: string;
    username: string;
  };
}

@Controller('groceries')
@UseGuards(JwtAuthGuard)
export class GroceriesController {
  constructor(private readonly groceriesService: GroceriesService) {}

  @Post()
  create(@Req() req: RequestWithUser, @Body() dto: CreateItemDto) {
    return this.groceriesService.create(req.user.userId, dto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.groceriesService.findOne(id);
  }

  @Get()
  findMany(
    @Req() req: RequestWithUser,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('search') search?: string,
  ) {
    return this.groceriesService.findMany(req.user.userId, page, limit, search);
  }

  @Put(':id')
  updateOne(
    @Req() req: RequestWithUser,
    @Param('id') id: string,
    @Body() dto: UpdateItemDto,
  ) {
    return this.groceriesService.updateOne(req.user.userId, id, dto);
  }

  @Put()
  updateMany(
    @Req() req: RequestWithUser,
    @Body() body: { filter: FilterQuery<GroceryItem>; update: UpdateItemDto },
  ) {
    return this.groceriesService.updateMany(
      req.user.userId,
      body.filter,
      body.update,
    );
  }
}
