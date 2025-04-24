import { Test, TestingModule } from '@nestjs/testing';
import { GroceriesService } from './groceries.service';
import { getModelToken } from '@nestjs/mongoose';
const mockGroceryModel = {
  create: jest.fn(),
  findById: jest.fn(),
  find: jest
    .fn()
    .mockReturnValue({ skip: jest.fn().mockReturnThis(), limit: jest.fn() }),
  findByIdAndUpdate: jest.fn(),
  updateMany: jest.fn(),
};

describe('GroceriesService', () => {
  let service: GroceriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GroceriesService,
        {
          provide: getModelToken('GroceryItem'),
          useValue: mockGroceryModel,
        },
      ],
    }).compile();

    service = module.get<GroceriesService>(GroceriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
