import { Controller, Post, Body } from '@nestjs/common';
import { DiagramService } from './diagram.service';

@Controller('diagram')
export class DiagramController {
  constructor(private diagramService: DiagramService) {}

  @Post('generate')
  async generate(@Body() body: any) {
    const result = await this.diagramService.generateDiagram(
      body.repoUrl,
      body.structure,
    );

    return result;
  }
}
