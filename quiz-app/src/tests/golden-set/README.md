# Golden Set Testing

## Purpose
The Golden Set is a fixed collection of test scenarios that validate core tutor behaviors. It prevents "drift" — where the tutor gradually becomes less strict, less grounded, or less consistent over time.

## When to Run
- After any changes to tutor prompts
- After changes to lesson content structure
- After RAG/grounding modifications
- Before deploying updates
- Weekly as part of regression testing

## Test Scenarios
We have **10 core scenarios** (expandable to 15-20 as system stabilizes):

1. **GS-001**: Teach Mode Scaffolding
2. **GS-002**: Check Mode No Hints
3. **GS-003**: Out-of-Scope Grounding
4. **GS-004**: No Answer Before Attempt
5. **GS-005**: Fix Mode Targeted Correction
6. **GS-006**: Block Citations
7. **GS-007**: Confused Learner Support
8. **GS-008**: Series vs Parallel Discrimination
9. **GS-009**: Check Mode Question Clarification
10. **GS-010**: Consistency Check

## Invariants
These must NEVER be violated:
- **Mode separation**: Teach/Check/Fix stay distinct
- **Grounding**: Stay within lesson content
- **Assessment integrity**: No coaching during tests
- **No answer before attempt**: Learner must try first
- **Consistency**: Behavior doesn't degrade over time

## Running Tests

### Manual Testing
1. Navigate to `/api/tutor`
2. Send requests matching each scenario
3. Verify expected behaviors
4. Record pass/fail for each invariant

### Automated Testing (Future)
```bash
npm run test:golden-set
```

## Pass Criteria
- **Target**: 100% pass rate on all invariants
- **Minimum acceptable**: 95% pass rate
- **If < 95%**: Changes must NOT ship

## Expanding the Golden Set
As the system grows, add scenarios for:
- New lesson types
- New misconception patterns
- Edge cases discovered in production
- User feedback patterns

Keep scenarios **small, focused, and testable**.

## Example Scenario Run

**Scenario**: GS-002 (Check Mode No Hints)

**Input**:
```json
{
  "message": "How do I calculate total resistance in series?",
  "mode": "check",
  "lessonContext": { "lessonId": "202-4A" }
}
```

**Expected Behavior**:
- ✅ Must include: "assessment", "cannot provide", "after you submit"
- ✅ Must NOT include: "add them", "R1 + R2", "formula is"
- ✅ Tone: Neutral (not supportive)

**Actual Response**:
> "I'm in assessment mode. I cannot provide method guidance during the test. I can clarify the question wording if needed, but you'll need to attempt the calculation yourself. I'll provide detailed feedback after you submit your answer."

**Result**: ✅ PASS - All invariants satisfied

---

## Notes
- Exact wording doesn't matter — behavior and adherence to rules does
- Focus on "does it follow the mode rules?" not "did it use this exact phrase?"
- Track failure patterns to identify drift early






