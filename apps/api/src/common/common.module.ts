import { Global, Module } from '@nestjs/common';
import { ObjectIdService } from './services/objectId.service';

@Global()
@Module({
  providers: [ObjectIdService],
  exports: [ObjectIdService],
})
export class CommonModule {}
