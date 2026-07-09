import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Repo } from '../schema/repo.schema';
import { LlmService } from '../ai/llm.service';

@Injectable()
export class DiagramService {
  constructor(
    @InjectModel(Repo.name)
    private repoModel: Model<Repo>,
    private llmService: LlmService,
  ) {}

  async generateDiagram(
    repoUrl: string,
    structure: any,
    diagramType: string = 'architecture',
  ) {
    // 1️⃣ Check DB for the specific diagram type
    const repo = await this.repoModel.findOne({ repoUrl });

    if (repo) {
      // Check the new diagrams map for the specific type
      if (repo.diagrams && repo.diagrams[diagramType]) {
        const cached = repo.diagrams[diagramType];
        // Ensure the cached diagram is actually a JSON object with nodes and edges
        // (This prevents returning old legacy Mermaid string diagrams)
        if (typeof cached === 'object' && cached.nodes && cached.edges) {
          return {
            source: 'database',
            diagram: cached,
          };
        }
      } else if (diagramType === 'architecture' && repo.diagram) {
        // Fallback for legacy diagram field, but ONLY if it is valid JSON with nodes and edges
        // It's possible it was stringified, so try to parse it
        try {
          const parsed =
            typeof repo.diagram === 'string'
              ? JSON.parse(repo.diagram)
              : repo.diagram;
          if (
            parsed &&
            typeof parsed === 'object' &&
            parsed.nodes &&
            parsed.edges
          ) {
            return {
              source: 'database',
              diagram: parsed,
            };
          }
        } catch (e) {
          // Ignore parse errors (it means it was an old Mermaid string)
        }
      }
    }

    // 2️⃣ Generate diagram using AI
    const diagram = await this.llmService.generateArchitectureDiagram(
      structure,
      diagramType,
    );

    // 3️⃣ Save generated diagram to the database
    if (repo) {
      const updatedDiagrams = repo.diagrams || {};
      updatedDiagrams[diagramType] = diagram;

      await this.repoModel.updateOne(
        { repoUrl },
        { $set: { diagrams: updatedDiagrams } },
      );
    }

    // 4️⃣ Return newly generated diagram
    return {
      source: 'generated',
      diagram,
    };
  }
}
