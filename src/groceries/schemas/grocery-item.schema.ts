import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class GroceryItem extends Document {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  quantity: number;

  @Prop({ default: true })
  inStock: boolean;

  @Prop()
  expireDate: Date;

  @Prop({ default: Date.now })
  addDate: Date;
}

export const GroceryItemSchema = SchemaFactory.createForClass(GroceryItem);
