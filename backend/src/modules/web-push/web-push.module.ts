import { Module, Global } from '@nestjs/common';
import { WebPushService } from './web-push.service';
import { WebPushController } from './web-push.controller';

@Global()
@Module({
  controllers: [WebPushController],
  providers: [WebPushService],
  exports: [WebPushService],
})
export class WebPushModule {}
