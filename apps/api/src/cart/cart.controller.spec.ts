import { Test, TestingModule } from '@nestjs/testing';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { BetterAuthGuard } from '../auth/better-auth.guard';
import { ExecutionContext } from '@nestjs/common';
import { Role, User } from '@prisma/client';

describe('CartController Unit Tests', () => {
  let controller: CartController;
  let service: CartService;

  const mockUser: User = {
    id: 'user-123',
    name: 'Cart Tester',
    email: 'tester@example.com',
    emailVerified: true,
    image: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    role: Role.CLIENT,
  };

  const mockCartService = {
    getCart: jest.fn(),
    clearCart: jest.fn(),
    addToCart: jest.fn(),
    removeFromCart: jest.fn(),
    checkout: jest.fn(),
  };

  const mockBetterAuthGuard = {
    canActivate: jest.fn((context: ExecutionContext) => true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CartController],
      providers: [
        {
          provide: CartService,
          useValue: mockCartService,
        },
      ],
    })
      .overrideGuard(BetterAuthGuard)
      .useValue(mockBetterAuthGuard)
      .compile();

    controller = module.get<CartController>(CartController);
    service = module.get<CartService>(CartService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should get current cart', async () => {
    const cart = { id: 'cart-1', items: [] };
    mockCartService.getCart.mockResolvedValue(cart);

    const result = await controller.getCart(mockUser);
    expect(result).toEqual(cart);
    expect(service.getCart).toHaveBeenCalledWith(mockUser);
  });

  it('should clear cart', async () => {
    mockCartService.clearCart.mockResolvedValue({ success: true });

    const result = await controller.clearCart(mockUser);
    expect(result).toEqual({ success: true });
    expect(service.clearCart).toHaveBeenCalledWith(mockUser);
  });

  it('should add item to cart', async () => {
    const payload = { productId: 'prod-1', quantity: 2 };
    mockCartService.addToCart.mockResolvedValue({ success: true });

    const result = await controller.addToCart(mockUser, payload);
    expect(result).toEqual({ success: true });
    expect(service.addToCart).toHaveBeenCalledWith(mockUser, payload);
  });

  it('should remove item from cart', async () => {
    const payload = { productId: 'prod-1' };
    mockCartService.removeFromCart.mockResolvedValue({ success: true });

    const result = await controller.removeFromCart(mockUser, payload);
    expect(result).toEqual({ success: true });
    expect(service.removeFromCart).toHaveBeenCalledWith(mockUser, payload);
  });

  it('should checkout cart', async () => {
    const order = { id: 'order-123', totalPrice: 40 };
    mockCartService.checkout.mockResolvedValue(order);

    const result = await controller.checkout(mockUser);
    expect(result).toEqual(order);
    expect(service.checkout).toHaveBeenCalledWith(mockUser);
  });
});
