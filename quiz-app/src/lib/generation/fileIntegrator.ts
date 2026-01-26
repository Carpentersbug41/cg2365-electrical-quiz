/**
 * File Integrator Service
 * Automatically updates 7 critical integration files
 */

import { GenerationRequest, FileIntegrationResult } from './types';
import { generateLessonId, generateVariableName, generateQuizFilename } from './utils';
import fs from 'fs';
import path from 'path';

export class FileIntegrator {
  private basePath: string;

  constructor() {
    this.basePath = process.cwd();
  }

  /**
   * Integrate all files for new lesson
   */
  async integrateAllFiles(
    request: GenerationRequest,
    lessonFilename: string,
    quizFilename: string
  ): Promise<FileIntegrationResult> {
    const filesUpdated: string[] = [];
    const errors: string[] = [];

    try {
      // 1. Update questions/index.ts
      const questionsIndexPath = path.join(this.basePath, 'src', 'data', 'questions', 'index.ts');
      this.updateQuestionsIndex(questionsIndexPath, request, quizFilename);
      filesUpdated.push(questionsIndexPath);

      // 2. Update questions.ts (main array)
      const questionsPath = path.join(this.basePath, 'src', 'data', 'questions.ts');
      this.updateQuestionsMain(questionsPath, request, quizFilename);
      filesUpdated.push(questionsPath);

      // 3. Update lessonIndex.ts
      const lessonIndexPath = path.join(this.basePath, 'src', 'data', 'lessons', 'lessonIndex.ts');
      this.updateLessonIndex(lessonIndexPath, request);
      filesUpdated.push(lessonIndexPath);

      // 4. Update learn/[lessonId]/page.tsx
      const lessonPagePath = path.join(this.basePath, 'src', 'app', 'learn', '[lessonId]', 'page.tsx');
      this.updateLessonPage(lessonPagePath, request, lessonFilename);
      filesUpdated.push(lessonPagePath);

      // 5. Update learn/page.tsx
      const learnPagePath = path.join(this.basePath, 'src', 'app', 'learn', 'page.tsx');
      this.updateLearnPage(learnPagePath, request, lessonFilename);
      filesUpdated.push(learnPagePath);

      return {
        success: true,
        filesUpdated,
        errors: [],
      };
    } catch (error) {
      errors.push(error instanceof Error ? error.message : 'Unknown integration error');
      return {
        success: false,
        filesUpdated,
        errors,
      };
    }
  }

  /**
   * Update questions/index.ts with new import and export
   */
  private updateQuestionsIndex(filePath: string, request: GenerationRequest, quizFilename: string): void {
    let content = fs.readFileSync(filePath, 'utf-8');

    const variableName = quizFilename.replace('.ts', '');
    const importStatement = `import { ${variableName} } from './${quizFilename.replace('.ts', '')}';`;
    const exportStatement = `export { ${variableName} } from './${quizFilename.replace('.ts', '')}';`;

    // Check if variable name already exists in ANY import (using regex for robust detection)
    const importRegex = new RegExp(`import\\s*\\{[^}]*\\b${variableName}\\b[^}]*\\}`, 'g');
    const variableAlreadyImported = importRegex.test(content);

    if (!variableAlreadyImported && !content.includes(importStatement)) {
      // Add import after existing imports (find last import line)
      const importLines = content.split('\n').filter(line => line.startsWith('import '));
      if (importLines.length > 0) {
        const lastImport = importLines[importLines.length - 1];
        const lastImportIndex = content.indexOf(lastImport) + lastImport.length;
        content = content.slice(0, lastImportIndex) + '\n' + importStatement + content.slice(lastImportIndex);
      }
    }

    // Check if variable already in array (using matches to count occurrences)
    const arraySpreadRegex = new RegExp(`\\.\\.\\.${variableName}\\b`, 'g');
    const existingMatches = content.match(arraySpreadRegex) || [];

    if (existingMatches.length === 0) {
      // Add to allTaggedQuestions array
      const arrayMarker = 'export const allTaggedQuestions: TaggedQuestion[] = [';
      const arrayIndex = content.indexOf(arrayMarker);
      if (arrayIndex !== -1) {
        const insertIndex = arrayIndex + arrayMarker.length;
        content = content.slice(0, insertIndex) + `\n  ...${variableName},` + content.slice(insertIndex);
      }
    }

    // Check if variable already exported (using regex for robust detection)
    const exportRegex = new RegExp(`export\\s*\\{[^}]*\\b${variableName}\\b[^}]*\\}`, 'g');
    const variableAlreadyExported = exportRegex.test(content);

    if (!variableAlreadyExported && !content.includes(exportStatement)) {
      // Add export after existing exports
      const exportLines = content.split('\n').filter(line => line.startsWith('export {'));
      if (exportLines.length > 0) {
        const lastExport = exportLines[exportLines.length - 1];
        const lastExportIndex = content.indexOf(lastExport) + lastExport.length;
        content = content.slice(0, lastExportIndex) + '\n' + exportStatement + content.slice(lastExportIndex);
      }
    }

    fs.writeFileSync(filePath, content, 'utf-8');
  }

  /**
   * Update main questions.ts array
   */
  private updateQuestionsMain(filePath: string, request: GenerationRequest, quizFilename: string): void {
    if (!fs.existsSync(filePath)) return; // Optional file

    let content = fs.readFileSync(filePath, 'utf-8');

    const variableName = quizFilename.replace('.ts', '');
    const importStatement = `import { ${variableName} } from './questions/${quizFilename.replace('.ts', '')}';`;

    // Check if variable name already exists in ANY import (using regex for robust detection)
    const importRegex = new RegExp(`import\\s*\\{[^}]*\\b${variableName}\\b[^}]*\\}`, 'g');
    const variableAlreadyImported = importRegex.test(content);

    if (!variableAlreadyImported && !content.includes(importStatement)) {
      // Add import
      const importLines = content.split('\n').filter(line => line.startsWith('import '));
      if (importLines.length > 0) {
        const lastImport = importLines[importLines.length - 1];
        const lastImportIndex = content.indexOf(lastImport) + lastImport.length;
        content = content.slice(0, lastImportIndex) + '\n' + importStatement + content.slice(lastImportIndex);
      }

      fs.writeFileSync(filePath, content, 'utf-8');
    }
  }

  /**
   * Update lessonIndex.ts with new lesson entry
   */
  private updateLessonIndex(filePath: string, request: GenerationRequest): void {
    let content = fs.readFileSync(filePath, 'utf-8');

    const fullLessonId = generateLessonId(request.unit, request.lessonId);
    
    // Determine order (find last lesson in this unit + 0.1)
    const unitLessons = content.match(new RegExp(`unitNumber: '${request.unit}',[\\s\\S]*?order: ([\\d.]+)`, 'g'));
    let order = 1;
    if (unitLessons && unitLessons.length > 0) {
      const orders = unitLessons.map(match => {
        const orderMatch = match.match(/order: ([\d.]+)/);
        return orderMatch ? parseFloat(orderMatch[1]) : 0;
      });
      order = Math.max(...orders) + 1;
    }

    const entry = `  {
    id: '${fullLessonId}',
    title: '${request.topic}',
    unit: 'Unit ${request.unit}',
    unitNumber: '${request.unit}',
    topic: '${request.topic}',
    description: '[Generated lesson]',
    questionCount: getLessonQuestionCount('${fullLessonId}'),
    available: true,
    order: ${order},
  },`;

    // Find the lessonIndex array and add entry
    const arrayMarker = 'export const lessonIndex: LessonIndexEntry[] = [';
    const arrayIndex = content.indexOf(arrayMarker);
    if (arrayIndex !== -1) {
      // Find the appropriate section (by unit)
      const unitComment = `// Unit ${request.unit}`;
      const unitIndex = content.indexOf(unitComment);
      
      if (unitIndex !== -1 && unitIndex > arrayIndex) {
        // Find next unit or end of array
        const nextUnitMatch = content.slice(unitIndex + 1).match(/\/\/ Unit \d+/);
        const insertPos = nextUnitMatch 
          ? unitIndex + 1 + content.slice(unitIndex + 1).indexOf(nextUnitMatch[0])
          : content.indexOf('];', unitIndex);
        
        content = content.slice(0, insertPos) + '\n' + entry + content.slice(insertPos);
      } else {
        // Add at end of array
        const endArrayIndex = content.indexOf('];', arrayIndex);
        content = content.slice(0, endArrayIndex) + entry + '\n' + content.slice(endArrayIndex);
      }
    }

    fs.writeFileSync(filePath, content, 'utf-8');
  }

  /**
   * Update learn/[lessonId]/page.tsx
   */
  private updateLessonPage(filePath: string, request: GenerationRequest, lessonFilename: string): void {
    let content = fs.readFileSync(filePath, 'utf-8');

    const fullLessonId = generateLessonId(request.unit, request.lessonId);
    const variableName = generateVariableName(request.unit, request.lessonId);
    
    const importStatement = `import ${variableName} from '@/data/lessons/${lessonFilename.replace('.json', '')}';`;
    const registryEntry = `  '${fullLessonId}': ${variableName} as Lesson,`;

    // Check if variable name already exists in ANY import (using regex for robust detection)
    const importRegex = new RegExp(`import\\s+${variableName}\\b\\s+from`, 'g');
    const variableAlreadyImported = importRegex.test(content);

    if (!variableAlreadyImported && !content.includes(importStatement)) {
      // Add import after existing lesson imports
      const importLines = content.split('\n').filter(line => line.includes('@/data/lessons/'));
      if (importLines.length > 0) {
        const lastImport = importLines[importLines.length - 1];
        const lastImportIndex = content.indexOf(lastImport) + lastImport.length;
        content = content.slice(0, lastImportIndex) + '\n' + importStatement + content.slice(lastImportIndex);
      }
    }

    // Check if variable already in LESSONS registry
    const registryRegex = new RegExp(`['"]${fullLessonId}['"]\\s*:\\s*${variableName}\\b`, 'g');
    const variableAlreadyInRegistry = registryRegex.test(content);

    if (!variableAlreadyInRegistry) {
      // Add to LESSONS registry
      const registryMarker = 'const LESSONS: Record<string, Lesson> = {';
      const registryIndex = content.indexOf(registryMarker);
      if (registryIndex !== -1) {
        const insertIndex = registryIndex + registryMarker.length;
        content = content.slice(0, insertIndex) + '\n' + registryEntry + content.slice(insertIndex);
      }
    }

    fs.writeFileSync(filePath, content, 'utf-8');
  }

  /**
   * Update learn/page.tsx
   */
  private updateLearnPage(filePath: string, request: GenerationRequest, lessonFilename: string): void {
    let content = fs.readFileSync(filePath, 'utf-8');

    const fullLessonId = generateLessonId(request.unit, request.lessonId);
    const variableName = generateVariableName(request.unit, request.lessonId);
    
    const importStatement = `import ${variableName} from '@/data/lessons/${lessonFilename.replace('.json', '')}';`;
    const arrayEntry = `  ${variableName},`;

    // Check if variable name already exists in ANY import (using regex for robust detection)
    const importRegex = new RegExp(`import\\s+${variableName}\\b\\s+from`, 'g');
    const variableAlreadyImported = importRegex.test(content);

    if (!variableAlreadyImported && !content.includes(importStatement)) {
      // Add import after existing lesson imports
      const importLines = content.split('\n').filter(line => line.includes('@/data/lessons/'));
      if (importLines.length > 0) {
        const lastImport = importLines[importLines.length - 1];
        const lastImportIndex = content.indexOf(lastImport) + lastImport.length;
        content = content.slice(0, lastImportIndex) + '\n' + importStatement + content.slice(lastImportIndex);
      }
    }

    // Check if variable already in LESSONS array
    const arrayEntryRegex = new RegExp(`^\\s*${variableName},\\s*$`, 'gm');
    const variableAlreadyInArray = arrayEntryRegex.test(content);

    if (!variableAlreadyInArray) {
      // Add to LESSONS array
      const arrayMarker = 'const LESSONS = [';
      const arrayIndex = content.indexOf(arrayMarker);
      if (arrayIndex !== -1) {
        const insertIndex = arrayIndex + arrayMarker.length;
        content = content.slice(0, insertIndex) + '\n' + arrayEntry + content.slice(insertIndex);
      }
    }

    fs.writeFileSync(filePath, content, 'utf-8');
  }

  /**
   * Rollback all file changes
   */
  async rollback(filesUpdated: string[]): Promise<void> {
    // In a real implementation, we'd restore from backups
    // For now, we'll just log the files that need manual review
    console.warn('ROLLBACK REQUIRED for files:', filesUpdated);
    console.warn('Please manually review and revert these files if needed');
  }
}
