import { Module } from '@nestjs/common';
import { StyleRendererController } from './style-renderer.controller';
import { StyleRendererService } from './style-renderer.service';

@Module({
  controllers: [StyleRendererController],
  providers: [StyleRendererService]
})
export class StyleRendererModule {}
