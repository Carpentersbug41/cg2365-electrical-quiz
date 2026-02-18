import { createDefaultQuestionRun, executeQuestionRun } from '../src/lib/questions/generation/orchestrator';
import { listRunSteps } from '../src/lib/questions/bankRepo';

async function main() {
  const run = await createDefaultQuestionRun({
    unit_code: '202',
    level: 2,
    lo_codes: ['LO1'],
    target_count: 6,
  });

  const executed = await executeQuestionRun(run.id);
  const steps = await listRunSteps(run.id);
  const validate = steps.find((step) => step.step_key === 'validate');

  console.log(
    JSON.stringify(
      {
        run_id: run.id,
        status: executed.run.status,
        validate_status: validate?.status ?? null,
        validate_output: validate?.output ?? null,
      },
      null,
      2
    )
  );
}

void main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
