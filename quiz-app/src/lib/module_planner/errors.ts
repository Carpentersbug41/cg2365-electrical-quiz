import { ModuleStage, ValidationIssueCode } from './types';

export class ModulePlannerError extends Error {
  code: ValidationIssueCode;
  stage: ModuleStage;
  status: number;
  meta?: Record<string, string | number | boolean | null>;

  constructor(
    stage: ModuleStage,
    code: ValidationIssueCode,
    message: string,
    status: number = 400,
    meta?: Record<string, string | number | boolean | null>
  ) {
    super(message);
    this.name = 'ModulePlannerError';
    this.stage = stage;
    this.code = code;
    this.status = status;
    this.meta = meta;
  }
}

