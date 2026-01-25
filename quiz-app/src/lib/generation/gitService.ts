/**
 * Git Automation Service
 * Handles branch creation, commits, and pushes
 */

import { GitResult } from './types';
import { GIT_CONFIG } from './constants';
import { getGitTimestamp } from './utils';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export class GitService {
  /**
   * Create branch, commit, and push generated lesson
   */
  async commitAndPush(
    lessonId: string,
    topic: string,
    filesUpdated: string[]
  ): Promise<GitResult> {
    try {
      const branchName = this.generateBranchName(lessonId);

      // Ensure we're on main and up to date
      await this.ensureMainBranch();

      // Create new branch
      await execAsync(`git checkout -b ${branchName}`);

      // Stage all generated and modified files
      await execAsync('git add .');

      // Commit with descriptive message
      const commitMessage = this.generateCommitMessage(lessonId, topic);
      await execAsync(`git commit -m "${commitMessage}"`);

      // Push to remote
      await execAsync(`git push -u ${GIT_CONFIG.REMOTE} ${branchName}`);

      // Get commit hash
      const { stdout: commitHash } = await execAsync('git rev-parse HEAD');

      // Get repository URL for branch link
      const branchUrl = await this.getBranchUrl(branchName);

      // Return to main branch
      await execAsync('git checkout main');

      return {
        success: true,
        branchName,
        branchUrl,
        commitHash: commitHash.trim(),
      };
    } catch (error) {
      return {
        success: false,
        branchName: '',
        branchUrl: '',
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
   * Generate branch name
   */
  private generateBranchName(lessonId: string): string {
    const timestamp = getGitTimestamp();
    return `${GIT_CONFIG.BRANCH_PREFIX}${lessonId}-${timestamp}`;
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
   * Get branch URL for GitHub/GitLab
   */
  private async getBranchUrl(branchName: string): Promise<string> {
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

      return `${webUrl}/tree/${branchName}`;
    } catch (error) {
      console.warn('Could not generate branch URL:', error);
      return `Branch: ${branchName}`;
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
   * Rollback git changes (delete branch, return to main)
   */
  async rollback(branchName: string): Promise<void> {
    try {
      // Checkout main
      await execAsync('git checkout main');

      // Delete local branch
      await execAsync(`git branch -D ${branchName}`);

      // Try to delete remote branch (may not exist)
      try {
        await execAsync(`git push ${GIT_CONFIG.REMOTE} --delete ${branchName}`);
      } catch {
        // Remote branch might not exist yet
      }
    } catch (error) {
      console.error('Error during git rollback:', error);
      throw error;
    }
  }
}
