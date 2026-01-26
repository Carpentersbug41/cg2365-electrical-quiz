/**
 * Lesson Deleter Service
 * Automatically removes lessons and their integrations from all 7 locations
 */

import fs from 'fs';
import path from 'path';
import { generateVariableName } from './utils';

export interface DeletionResult {
  success: boolean;
  filesModified: string[];
  filesDeleted: string[];
  errors: string[];
  warnings: string[];
}

export interface DeletionRequest {
  lessonId: string; // Full lesson ID (e.g., "202-3AAAA")
  lessonFilename: string; // e.g., "202-3AAAA-series-circuits.json"
  questionsFilename?: string; // e.g., "seriesCircuitsQuestions.ts" (optional)
}

export class LessonDeleter {
  private basePath: string;

  constructor() {
    this.basePath = process.cwd();
  }

  /**
   * Delete lesson and all its integrations
   */
  async deleteLesson(request: DeletionRequest): Promise<DeletionResult> {
    const filesModified: string[] = [];
    const filesDeleted: string[] = [];
    const errors: string[] = [];
    const warnings: string[] = [];

    try {
      const { lessonId, lessonFilename, questionsFilename } = request;
      const variableName = this.getLessonVariableName(lessonId);

      // Phase 1: Search for all references
      console.log(`[Deleter] Phase 1: Searching for references to ${lessonId}...`);
      const references = this.findAllReferences(lessonId);
      console.log(`[Deleter] Found ${references.length} references`);

      // Phase 2: Remove from lessonIndex.ts
      console.log('[Deleter] Phase 2: Removing from lessonIndex.ts...');
      const lessonIndexPath = path.join(this.basePath, 'src', 'data', 'lessons', 'lessonIndex.ts');
      const lessonIndexResult = this.removeFromLessonIndex(lessonIndexPath, lessonId);
      if (lessonIndexResult.modified) {
        filesModified.push(lessonIndexPath);
      }
      if (lessonIndexResult.error) {
        errors.push(lessonIndexResult.error);
      }

      // Phase 3: Remove from learn/[lessonId]/page.tsx
      console.log('[Deleter] Phase 3: Removing from learn/[lessonId]/page.tsx...');
      const lessonPagePath = path.join(this.basePath, 'src', 'app', 'learn', '[lessonId]', 'page.tsx');
      const lessonPageResult = this.removeFromLessonPage(lessonPagePath, lessonId, variableName);
      if (lessonPageResult.modified) {
        filesModified.push(lessonPagePath);
      }
      if (lessonPageResult.error) {
        errors.push(lessonPageResult.error);
      }

      // Phase 4: Remove from learn/page.tsx
      console.log('[Deleter] Phase 4: Removing from learn/page.tsx...');
      const learnPagePath = path.join(this.basePath, 'src', 'app', 'learn', 'page.tsx');
      const learnPageResult = this.removeFromLearnPage(learnPagePath, variableName);
      if (learnPageResult.modified) {
        filesModified.push(learnPagePath);
      }
      if (learnPageResult.error) {
        errors.push(learnPageResult.error);
      }

      // Phase 5 & 6: Remove from questions files (if applicable)
      if (questionsFilename) {
        console.log('[Deleter] Phase 5 & 6: Checking questions integration...');
        const questionsVariableName = questionsFilename.replace('.ts', '');

        // Check if questions are used by other lessons
        const questionsUsedElsewhere = this.isQuestionsUsedElsewhere(questionsVariableName, lessonId);
        
        if (questionsUsedElsewhere) {
          warnings.push(`Questions file ${questionsFilename} is used by other lessons - NOT deleting`);
        } else {
          // Remove from questions/index.ts
          const questionsIndexPath = path.join(this.basePath, 'src', 'data', 'questions', 'index.ts');
          const questionsIndexResult = this.removeFromQuestionsIndex(questionsIndexPath, questionsVariableName);
          if (questionsIndexResult.modified) {
            filesModified.push(questionsIndexPath);
          }
          if (questionsIndexResult.error) {
            errors.push(questionsIndexResult.error);
          }

          // Remove from questions.ts (if exists)
          const questionsMainPath = path.join(this.basePath, 'src', 'data', 'questions.ts');
          if (fs.existsSync(questionsMainPath)) {
            const questionsMainResult = this.removeFromQuestionsMain(questionsMainPath, questionsVariableName);
            if (questionsMainResult.modified) {
              filesModified.push(questionsMainPath);
            }
            if (questionsMainResult.error) {
              errors.push(questionsMainResult.error);
            }
          }

          // Delete questions file (Phase 8)
          console.log('[Deleter] Phase 8: Deleting questions file...');
          const questionsFilePath = path.join(this.basePath, 'src', 'data', 'questions', questionsFilename);
          if (fs.existsSync(questionsFilePath)) {
            fs.unlinkSync(questionsFilePath);
            filesDeleted.push(questionsFilePath);
            console.log(`[Deleter] Deleted ${questionsFilePath}`);
          }
        }
      }

      // Phase 7: Delete lesson JSON file
      console.log('[Deleter] Phase 7: Deleting lesson file...');
      const lessonFilePath = path.join(this.basePath, 'src', 'data', 'lessons', lessonFilename);
      if (fs.existsSync(lessonFilePath)) {
        fs.unlinkSync(lessonFilePath);
        filesDeleted.push(lessonFilePath);
        console.log(`[Deleter] Deleted ${lessonFilePath}`);
      } else {
        warnings.push(`Lesson file not found: ${lessonFilePath}`);
      }

      // Phase 9: Verify no remaining references
      console.log('[Deleter] Phase 9: Verifying deletion...');
      const remainingRefs = this.findAllReferences(lessonId);
      if (remainingRefs.length > 0) {
        warnings.push(`Warning: ${remainingRefs.length} references still exist after deletion`);
      }

      return {
        success: errors.length === 0,
        filesModified,
        filesDeleted,
        errors,
        warnings,
      };

    } catch (error) {
      errors.push(error instanceof Error ? error.message : 'Unknown deletion error');
      return {
        success: false,
        filesModified,
        filesDeleted,
        errors,
        warnings,
      };
    }
  }

  /**
   * Find all references to a lesson ID
   */
  private findAllReferences(lessonId: string): string[] {
    const references: string[] = [];
    const searchPaths = [
      path.join(this.basePath, 'src', 'data'),
      path.join(this.basePath, 'src', 'app', 'learn'),
    ];

    for (const searchPath of searchPaths) {
      this.searchDirectory(searchPath, lessonId, references);
    }

    return references;
  }

  /**
   * Recursively search directory for lesson ID
   */
  private searchDirectory(dir: string, lessonId: string, results: string[]): void {
    if (!fs.existsSync(dir)) return;

    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory() && entry.name !== 'node_modules') {
        this.searchDirectory(fullPath, lessonId, results);
      } else if (entry.isFile() && (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx') || entry.name.endsWith('.json'))) {
        try {
          const content = fs.readFileSync(fullPath, 'utf-8');
          if (content.includes(lessonId)) {
            results.push(fullPath);
          }
        } catch {
          // Skip files that can't be read
        }
      }
    }
  }

  /**
   * Check if questions are used by other lessons
   */
  private isQuestionsUsedElsewhere(questionsVariableName: string, excludeLessonId: string): boolean {
    const lessonIndexPath = path.join(this.basePath, 'src', 'data', 'lessons', 'lessonIndex.ts');
    
    if (!fs.existsSync(lessonIndexPath)) return false;

    try {
      const content = fs.readFileSync(lessonIndexPath, 'utf-8');
      const lines = content.split('\n');
      
      // Check if any OTHER lesson references these questions
      let inLessonBlock = false;
      let currentLessonId = '';
      
      for (const line of lines) {
        if (line.includes("id: '")) {
          const match = line.match(/id: '([^']+)'/);
          if (match) {
            currentLessonId = match[1];
            inLessonBlock = true;
          }
        }
        
        if (inLessonBlock && line.includes(questionsVariableName) && currentLessonId !== excludeLessonId) {
          return true; // Used by another lesson
        }
        
        if (line.includes('},')) {
          inLessonBlock = false;
        }
      }
      
      return false;
    } catch {
      return true; // Err on the side of caution - don't delete if unsure
    }
  }

  /**
   * Get variable name from lesson ID
   */
  private getLessonVariableName(lessonId: string): string {
    return generateVariableName(
      parseInt(lessonId.split('-')[0]),
      lessonId.split('-')[1]
    );
  }

  /**
   * Remove from lessonIndex.ts
   */
  private removeFromLessonIndex(filePath: string, lessonId: string): { modified: boolean; error?: string } {
    try {
      if (!fs.existsSync(filePath)) {
        return { modified: false, error: 'lessonIndex.ts not found' };
      }

      let content = fs.readFileSync(filePath, 'utf-8');
      const originalContent = content;

      // Find and remove the lesson entry block
      const entryRegex = new RegExp(`\\{[^}]*id: '${lessonId}'[^}]*\\},?\\n?`, 'gm');
      content = content.replace(entryRegex, '');

      if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf-8');
        return { modified: true };
      }

      return { modified: false };
    } catch (error) {
      return { modified: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  /**
   * Remove from learn/[lessonId]/page.tsx
   */
  private removeFromLessonPage(filePath: string, lessonId: string, variableName: string): { modified: boolean; error?: string } {
    try {
      if (!fs.existsSync(filePath)) {
        return { modified: false, error: 'Lesson page not found' };
      }

      let content = fs.readFileSync(filePath, 'utf-8');
      const originalContent = content;

      // Remove import (try both with and without .json extension)
      const importRegex1 = new RegExp(`import ${variableName} from '@/data/lessons/[^']+\\.json';\\n?`, 'g');
      const importRegex2 = new RegExp(`import ${variableName} from '@/data/lessons/[^']+';\\n?`, 'g');
      content = content.replace(importRegex1, '');
      content = content.replace(importRegex2, '');

      // Remove registry entry
      const registryRegex = new RegExp(`\\s*'${lessonId}': ${variableName} as Lesson,\\n?`, 'g');
      content = content.replace(registryRegex, '');

      if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf-8');
        return { modified: true };
      }

      return { modified: false };
    } catch (error) {
      return { modified: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  /**
   * Remove from learn/page.tsx
   */
  private removeFromLearnPage(filePath: string, variableName: string): { modified: boolean; error?: string } {
    try {
      if (!fs.existsSync(filePath)) {
        return { modified: false, error: 'Learn page not found' };
      }

      let content = fs.readFileSync(filePath, 'utf-8');
      const originalContent = content;

      // Remove import (try both with and without .json extension)
      const importRegex1 = new RegExp(`import ${variableName} from '@/data/lessons/[^']+\\.json';\\n?`, 'g');
      const importRegex2 = new RegExp(`import ${variableName} from '@/data/lessons/[^']+';\\n?`, 'g');
      content = content.replace(importRegex1, '');
      content = content.replace(importRegex2, '');

      // Remove array entry
      const arrayRegex = new RegExp(`\\s*${variableName},\\n?`, 'g');
      content = content.replace(arrayRegex, '');

      if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf-8');
        return { modified: true };
      }

      return { modified: false };
    } catch (error) {
      return { modified: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  /**
   * Remove from questions/index.ts
   */
  private removeFromQuestionsIndex(filePath: string, questionsVariableName: string): { modified: boolean; error?: string } {
    try {
      if (!fs.existsSync(filePath)) {
        return { modified: false };
      }

      let content = fs.readFileSync(filePath, 'utf-8');
      const originalContent = content;

      // Remove import
      const importRegex = new RegExp(`import \\{ ${questionsVariableName} \\} from '\\./[^']+';\\n?`, 'g');
      content = content.replace(importRegex, '');

      // Remove from array
      const arrayRegex = new RegExp(`\\s*\\.\\.\\.${questionsVariableName},\\n?`, 'g');
      content = content.replace(arrayRegex, '');

      // Remove export
      const exportRegex = new RegExp(`export \\{ ${questionsVariableName} \\} from '\\./[^']+';\\n?`, 'g');
      content = content.replace(exportRegex, '');

      if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf-8');
        return { modified: true };
      }

      return { modified: false };
    } catch (error) {
      return { modified: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  /**
   * Remove from questions.ts
   */
  private removeFromQuestionsMain(filePath: string, questionsVariableName: string): { modified: boolean; error?: string } {
    try {
      if (!fs.existsSync(filePath)) {
        return { modified: false };
      }

      let content = fs.readFileSync(filePath, 'utf-8');
      const originalContent = content;

      // Remove import
      const importRegex = new RegExp(`import \\{ ${questionsVariableName} \\} from '\\./questions/[^']+';\\n?`, 'g');
      content = content.replace(importRegex, '');

      // Remove from array
      const arrayRegex = new RegExp(`\\s*\\.\\.\\.${questionsVariableName},\\n?`, 'g');
      content = content.replace(arrayRegex, '');

      if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf-8');
        return { modified: true };
      }

      return { modified: false };
    } catch (error) {
      return { modified: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  /**
   * Auto-detect lesson details from lesson ID
   */
  async detectLessonFiles(lessonId: string): Promise<DeletionRequest | null> {
    try {
      // Find lesson file
      const lessonsDir = path.join(this.basePath, 'src', 'data', 'lessons');
      const files = fs.readdirSync(lessonsDir);
      const lessonFile = files.find(f => f.startsWith(lessonId) && f.endsWith('.json'));

      if (!lessonFile) {
        return null;
      }

      // Try to detect associated questions file by reading lessonIndex.ts
      const lessonIndexPath = path.join(this.basePath, 'src', 'data', 'lessons', 'lessonIndex.ts');
      let questionsFilename: string | undefined;

      if (fs.existsSync(lessonIndexPath)) {
        const content = fs.readFileSync(lessonIndexPath, 'utf-8');
        
        // Find the lesson entry and extract topic
        const entryMatch = content.match(new RegExp(`{[^}]*id: '${lessonId}'[^}]*topic: '([^']+)'[^}]*}`, 's'));
        
        if (entryMatch) {
          const topic = entryMatch[1];
          // Generate expected questions filename
          const expectedQuestionsFile = topic
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '') + 'Questions.ts';
          
          const questionsPath = path.join(this.basePath, 'src', 'data', 'questions', expectedQuestionsFile);
          if (fs.existsSync(questionsPath)) {
            questionsFilename = expectedQuestionsFile;
          }
        }
      }

      return {
        lessonId,
        lessonFilename: lessonFile,
        questionsFilename,
      };
    } catch {
      return null;
    }
  }
}
