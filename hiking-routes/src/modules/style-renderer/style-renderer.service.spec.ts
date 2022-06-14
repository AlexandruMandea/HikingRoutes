import { Test, TestingModule } from '@nestjs/testing';
import { StyleRendererService } from './style-renderer.service';

describe('StyleRendererService', () => {
  let service: StyleRendererService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StyleRendererService],
    }).compile();

    service = module.get<StyleRendererService>(StyleRendererService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
