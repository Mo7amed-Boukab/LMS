import { Controller } from '@nestjs/common';
import { ProgressModuleService } from './progress-module.service';

@Controller('progress-module')
export class ProgressModuleController {
  constructor(private readonly progressModuleService: ProgressModuleService) {}
}
