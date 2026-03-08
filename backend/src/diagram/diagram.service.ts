import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Repo } from '../schema/repo.schema';

@Injectable()
export class DiagramService {
  constructor(
    @InjectModel(Repo.name)
    private repoModel: Model<Repo>,
  ) {}

  async generateDiagram(repoUrl: string, structure: any) {
    // 1️⃣ Check DB
    const repo = await this.repoModel.findOne({ repoUrl });

    if (repo && repo.diagram) {
      return {
        source: 'database',
        diagram: repo.diagram,
      };
    }

    // 2️⃣ Generate diagram

    const names = structure.map((item) => item.name.toLowerCase());

    let diagram = 'graph TD\n';

    if (names.includes('controller') || names.includes('controllers')) {
      diagram += 'Controller --> Service\n';
    }

    if (names.includes('service') || names.includes('services')) {
      diagram += 'Service --> Repository\n';
    }

    if (names.includes('repository') || names.includes('repositories')) {
      diagram += 'Repository --> Database\n';
    }

    // 3️⃣ Save diagram

    await this.repoModel.updateOne({ repoUrl }, { diagram });

    // 4️⃣ Return

    return {
      source: 'generated',
      diagram,
    };
  }
}
