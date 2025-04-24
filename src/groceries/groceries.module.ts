import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GroceryItem, GroceryItemSchema } from './schemas/grocery-item.schema';
import { GroceriesService } from './groceries.service';
import { GroceriesController } from './groceries.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: GroceryItem.name, schema: GroceryItemSchema },
    ]),
  ],
  controllers: [GroceriesController],
  providers: [GroceriesService],
  exports: [GroceriesService],
})
export class GroceriesModule {}
