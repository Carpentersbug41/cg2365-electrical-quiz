/**
 * Git Automation Service
 * Handles branch creation, commits, and pushes
 */

import { GitResult } from './types';
import { GIT_CONFIG } from './constants';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export class GitService {
  /**
   * Commit and push generated lesson directly to main branch
   */
  async commitAndPush(
    lessonId: string,
    topic: string,
    filesUpdated: string[]
  ): Promise<GitResult> {
    try {
      // Ensure we're on main and up to date
      await this.ensureMainBranch();

      // Stage all generated and modified files
      await execAsync('git add .');

      // Commit with descriptive message
      const commitMessage = this.generateCommitMessage(lessonId, topic);
      await execAsync(`git commit -m "${commitMessage}"`);

      // Push to remote main
      await execAsync(`git push ${GIT_CONFIG.REMOTE} main`);

      // Get commit hash
      const { stdout: commitHash } = await execAsync('git rev-parse HEAD');

      // Get repository URL for commit link
      const commitUrl = await this.getCommitUrl(commitHash.trim());

      return {
        success: true,
        commitHash: commitHash.trim(),
        commitUrl,
      };
    } catch (error) {
      return {
        success: false,
        commitHash: '',
        commitUrl: '',
        error: error instanceof Error ? error.message : 'Unknown git error',
      };
    }
  }

  /**
   * Ensure we're on main branch and up to date
   */
  private async ensureMainBranch(): Promise<void> {
    try {
      // Check current branch
      const { stdout: currentBranch } = await execAsync('git branch --show-current');
      
      if (currentBranch.trim() !== 'main') {
        // Checkout main
        await execAsync('git checkout main');
      }

      // Pull latest
      await execAsync('git pull');
    } catch (error) {
      console.warn('Could not ensure main branch:', error);
      // Continue anyway - user might not have remote configured
    }
  }

  /**
   * Generate commit message
   */
  private generateCommitMessage(lessonId: string, topic: string): string {
    return `${GIT_CONFIG.COMMIT_PREFIX} ${lessonId} ${topic} lesson and quiz (50 questions)

Generated via lesson-generator automation tool.

- Complete lesson JSON with 8-10 blocks
- 50 quiz questions with misconception mapping
- Automated integration of 7 files
`;
  }

  /**
   * Get commit URL for GitHub/GitLab
   */
  private async getCommitUrl(commitHash: string): Promise<string> {
    try {
      const { stdout: remoteUrl } = await execAsync('git remote get-url origin');
      const url = remoteUrl.trim();

      // Convert git URL to web URL
      let webUrl = url;
      
      // Handle git@github.com:user/repo.git format
      if (url.startsWith('git@github.com:')) {
        webUrl = url
          .replace('git@github.com:', 'https://github.com/')
          .replace('.git', '');
      }
      
      // Handle https://github.com/user/repo.git format
      if (url.startsWith('https://github.com/')) {
        webUrl = url.replace('.git', '');
      }

      return `${webUrl}/commit/${commitHash}`;
    } catch (error) {
      console.warn('Could not generate commit URL:', error);
      return `Commit: ${commitHash.substring(0, 7)}`;
    }
  }

  /**
   * Check if git is initialized and remote is configured
   */
  async isGitConfigured(): Promise<boolean> {
    try {
      await execAsync('git status');
      await execAsync('git remote get-url origin');
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Rollback git changes (revert last commit on main)
   * WARNING: This reverts the last commit on main - use with caution!
   */
  async rollback(): Promise<void> {
    try {
      // Ensure we're on main
      await execAsync('git checkout main');

      // Revert the last commit (create a new commit that undoes it)
      await execAsync('git revert HEAD --no-edit');
      
      // Push the revert
      await execAsync(`git push ${GIT_CONFIG.REMOTE} main`);
      
      console.log('[Git] Reverted last commit on main');
    } catch (error) {
      console.error('Error during git rollback:', error);
      throw error;
    }
  }
}
