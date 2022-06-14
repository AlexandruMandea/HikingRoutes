import { Test, TestingModule } from '@nestjs/testing';
import { StyleRendererController } from './style-renderer.controller';

describe('StyleRendererController', () => {
  let controller: StyleRendererController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StyleRendererController],
    }).compile();

    controller = module.get<StyleRendererController>(StyleRendererController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
