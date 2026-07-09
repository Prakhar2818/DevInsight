import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { TracerService } from './tracer.service';
import { OptionalJwtAuthGuard } from '../auth/optional-jwt-auth.guard';

@Controller('tracer')
export class TracerController {
  constructor(private readonly tracerService: TracerService) {}

  @UseGuards(OptionalJwtAuthGuard)
  @Post('flow')
  async traceFlow(@Body() body: { query: string; context: string }) {
    if (!body.query || !body.context) {
      throw new HttpException(
        'Query and context are required',
        HttpStatus.BAD_REQUEST,
      );
    }

    const flowData = await this.tracerService.trace(body.query, body.context);
    return { data: flowData };
  }
}
