import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { DebugService } from '../debug/debug.service';

@Controller('debug')
export class DebugController {
  constructor(private debugService: DebugService) {}

  @Post()
  async debugError(@Body() body: any) {
    if (!body.error) {
      throw new HttpException('error field required', HttpStatus.BAD_REQUEST);
    }

    const result = await this.debugService.analyzeError(body.error);

    return result;
  }
}
