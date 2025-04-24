import { IsString, IsBoolean, IsDateString, IsInt } from 'class-validator';

export class CreateItemDto {
  @IsString()
  name: string;

  @IsInt()
  quantity: number;

  @IsBoolean()
  inStock: boolean;

  @IsDateString()
  expireDate: string;
}
