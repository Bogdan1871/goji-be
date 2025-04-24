import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { GroceryItem } from './schemas/grocery-item.schema';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { groceryNames } from '../constants';

@Injectable()
export class GroceriesService {
  constructor(
    @InjectModel(GroceryItem.name) private groceryModel: Model<GroceryItem>,
  ) {}

  create(userId: string, dto: CreateItemDto) {
    return this.groceryModel.create({ ...dto, userId });
  }

  findOne(id: string) {
    return this.groceryModel.findById(id);
  }

  async findMany(userId: string, page = 1, limit = 10, search?: string) {
    const filter: FilterQuery<GroceryItem> = { userId };

    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }

    const items = await this.groceryModel
      .find(filter)
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await this.groceryModel.countDocuments(filter);

    return { items, total };
  }

  updateOne(userId: string, id: string, dto: UpdateItemDto) {
    return this.groceryModel.findOneAndUpdate({ id, userId }, dto, {
      new: true,
    });
  }

  updateMany(
    userId: string,
    filter: FilterQuery<GroceryItem>,
    update: UpdateItemDto,
  ) {
    return this.groceryModel.updateMany({ ...filter, userId }, update);
  }

  async generateInitialGroceries(userId: string) {
    const items: Partial<GroceryItem>[] = Array.from({ length: 100 }).map(
      () => {
        const name =
          groceryNames[Math.floor(Math.random() * groceryNames.length)];
        return {
          name,
          quantity: Math.floor(Math.random() * 5) + 1,
          inStock: Math.random() > 0.5,
          expireDate: new Date(Date.now() + Math.random() * 30 * 86400000),
          addDate: new Date(),
          userId,
        };
      },
    );

    return this.groceryModel.insertMany(items);
  }
}
