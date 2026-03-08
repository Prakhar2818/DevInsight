import { Injectable } from '@nestjs/common';
import { parse } from '@babel/parser';

@Injectable()
export class ParserService {

  parseCode(code: string) {

    const ast = parse(code, {
      sourceType: 'module',
      plugins: ['typescript']
    });

    return ast;
  }

}