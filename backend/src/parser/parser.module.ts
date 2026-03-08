import { Module } from '@nestjs/common';
import { ParserService } from './parser.service';
import { ParserController } from './parse.controller';

@Module({
  providers: [ParserService],
  controllers: [ParserController],
  exports: [ParserService],
})
export class ParserModule {}
