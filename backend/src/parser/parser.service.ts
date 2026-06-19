import { Injectable, Logger } from '@nestjs/common';
import { parse } from '@babel/parser';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ParserService {
  private readonly logger = new Logger(ParserService.name);

  parseCode(code: string) {
    const ast = parse(code, {
      sourceType: 'module',
      plugins: ['typescript']
    });

    return ast;
  }

  analyzeRepository(repoPath: string) {
    this.logger.log(`Analyzing repository at ${repoPath}`);
    const metadata = {
      framework: 'Unknown',
      language: 'Unknown',
      database: 'Unknown',
      orm: 'Unknown',
      packageManager: 'Unknown',
      architecture: 'Layered',
      hasEnvExample: false,
      hasDockerCompose: false,
    };

    try {
      // Recursively find all package.json files
      const getAllPackageJsons = (dir: string, fileList: string[] = []) => {
        try {
          const files = fs.readdirSync(dir);
          for (const file of files) {
            if (file === 'node_modules' || file === '.git' || file === 'dist' || file === 'build') continue;
            const filePath = path.join(dir, file);
            try {
              if (fs.statSync(filePath).isDirectory()) {
                getAllPackageJsons(filePath, fileList);
              } else if (file === 'package.json') {
                fileList.push(filePath);
              }
            } catch (err) {
              // ignore stat errors for individual files
            }
          }
        } catch (e) {
          // ignore readdir errors
        }
        return fileList;
      };

      const packageJsonPaths = getAllPackageJsons(repoPath);
      console.log("Found package.json paths:", packageJsonPaths);
      
      if (packageJsonPaths.length > 0) {
        metadata.packageManager = 'npm/yarn';
        const allDeps: Record<string, string> = {};

        for (const pkgPath of packageJsonPaths) {
          try {
            const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
            Object.assign(allDeps, pkg.dependencies || {});
            Object.assign(allDeps, pkg.devDependencies || {});
          } catch (e) {}
        }
        console.log("All deps keys:", Object.keys(allDeps));

        // Framework Detection
        if (allDeps['@nestjs/core']) metadata.framework = 'NestJS';
        else if (allDeps['next']) metadata.framework = 'Next.js';
        else if (allDeps['react']) metadata.framework = 'React';
        else if (allDeps['vue']) metadata.framework = 'Vue';
        else if (allDeps['@angular/core']) metadata.framework = 'Angular';
        else if (allDeps['express']) metadata.framework = 'Express';
        else if (allDeps['fastify']) metadata.framework = 'Fastify';

        // Language Detection
        if (allDeps['typescript']) metadata.language = 'TypeScript';
        else metadata.language = 'JavaScript';

        // Database Detection
        if (allDeps['pg'] || allDeps['postgres']) metadata.database = 'PostgreSQL';
        else if (allDeps['mongoose'] || allDeps['mongodb']) metadata.database = 'MongoDB';
        else if (allDeps['mysql'] || allDeps['mysql2']) metadata.database = 'MySQL';
        else if (allDeps['sqlite3']) metadata.database = 'SQLite';
        else if (allDeps['@clickhouse/client']) metadata.database = 'ClickHouse';
        else if (allDeps['ioredis'] || allDeps['redis']) metadata.database = 'Redis';
        else if (allDeps['@prisma/client']) metadata.database = 'SQL (via Prisma)';

        // ORM Detection
        if (allDeps['@prisma/client'] || allDeps['prisma']) metadata.orm = 'Prisma';
        else if (allDeps['typeorm']) metadata.orm = 'TypeORM';
        else if (allDeps['mongoose']) metadata.orm = 'Mongoose';
        else if (allDeps['sequelize']) metadata.orm = 'Sequelize';
      }

      // Check specific files
      if (fs.existsSync(path.join(repoPath, '.env.example'))) {
        metadata.hasEnvExample = true;
      }
      if (fs.existsSync(path.join(repoPath, 'docker-compose.yml')) || fs.existsSync(path.join(repoPath, 'docker-compose.yaml'))) {
        metadata.hasDockerCompose = true;
      }

    } catch (error) {
      this.logger.error(`Error analyzing repository: ${error.message}`);
    }

    return metadata;
  }
}