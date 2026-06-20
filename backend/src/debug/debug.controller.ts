import {
  Controller,
  Post,
  Body,
  Get,
  Request,
  UseGuards,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { DebugService } from './debug.service';
import { OptionalJwtAuthGuard } from '../auth/optional-jwt-auth.guard';

@Controller('debug')
export class DebugController {
  constructor(private debugService: DebugService) {}

  @UseGuards(OptionalJwtAuthGuard)
  @Post()
  async debugError(@Request() req: any, @Body() body: any) {
    if (!body.error) {
      throw new HttpException('error field required', HttpStatus.BAD_REQUEST);
    }

    const userId = req.user ? (req.user.userId || req.user._id || req.user.email) : null;
    const result = await this.debugService.analyzeError(body.error, userId);

    return result;
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Get('history')
  async getDebugHistory(@Request() req: any) {
    const userId = req.user ? (req.user.userId || req.user._id || req.user.email) : null;
    return this.debugService.getHistory(userId);
  }
}
