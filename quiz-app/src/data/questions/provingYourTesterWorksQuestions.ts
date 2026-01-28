import { TaggedQuestion } from './types';

/**
 * Proving your tester works Question Bank
 * Aligned with lesson 204-11B learning outcomes
 * Generated: 2026-01-28
 */

export const provingYourTesterWorksQuestions: TaggedQuestion[] = [
  {
    "id": 4051,
    "question": "What is the primary reason an electrician should 'prove' their test instrument before carrying out dead tests?",
    "options": [
      "To ensure the instrument is responding correctly and providing reliable readings",
      "To check if the circuit being tested is currently connected to the mains supply",
      "To verify that the instrument's calibration certificate has not expired",
      "To discharge any static electricity built up within the test leads"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Proving your tester works",
    "tags": [
      "terminology",
      "health-safety",
      "conceptual"
    ],
    "learningOutcomeId": "204-11B-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Proving an instrument ensures that it is functioning as expected before you rely on its readings to make safety or compliance decisions."
  },
  {
    "id": 4052,
    "question": "Which of the following describes the correct basic routine for using a tester on a training rig?",
    "options": [
      "Prove the tester, perform the test, then re-prove the tester",
      "Test the circuit, then prove the tester if the reading looks wrong",
      "Prove the tester once at the start of the week and record the result",
      "Turn the tester on and wait for the self-test beep before testing"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "OTHER",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Proving your tester works",
    "tags": [
      "terminology",
      "application"
    ],
    "learningOutcomeId": "204-11B-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "The standard safe routine is to prove the tester works before use, carry out the measurement, and re-prove afterwards to ensure the tester didn't fail during the process."
  },
  {
    "id": 4053,
    "question": "When setting up for a continuity test, what should a healthy instrument show when the two test lead tips are held firmly together?",
    "options": [
      "A stable, very low resistance reading near 0.00 Ω",
      "An 'OL' or 'Infinity' reading on the digital display",
      "A high resistance reading usually above 1.00 MΩ",
      "A fluctuating reading that moves between ohms and kilohms"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_I_V_R",
      "2": "WRONG_UNITS",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Proving your tester works",
    "tags": [
      "resistance-rule",
      "discrimination",
      "units"
    ],
    "learningOutcomeId": "204-11B-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "A continuity tester checks for a continuous path; shorting the leads together creates a path of near-zero resistance."
  },
  {
    "id": 4054,
    "question": "Why is it important to 'null' or 'zero' test leads before performing a low-resistance continuity test?",
    "options": [
      "To subtract the resistance of the test leads from the final circuit reading",
      "To ensure the battery inside the tester is fully charged for the day",
      "To prevent the tester from blowing a fuse during the measurement",
      "To reset the circuit breaker on the training rig before testing"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "OTHER",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "Proving your tester works",
    "tags": [
      "resistance-rule",
      "calculation",
      "application"
    ],
    "learningOutcomeId": "204-11B-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "Nulling removes the lead resistance (typically 0.05Ω to 0.20Ω) so that only the installation resistance is measured."
  },
  {
    "id": 4055,
    "question": "While performing insulation resistance (IR) tests, what would a healthy tester show when the leads are held apart in open air?",
    "options": [
      "A very high resistance reading (e.g., >299 MΩ or 'OL')",
      "A low resistance reading (e.g., 0.01 Ω)",
      "A continuous audible beep from the internal sounder",
      "A voltage reading of 230V AC"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_I_V_R",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "CONFUSED_AC_DC_SOURCES"
    },
    "section": "Electrical Installations Technology",
    "category": "Proving your tester works",
    "tags": [
      "resistance-rule",
      "discrimination",
      "units"
    ],
    "learningOutcomeId": "204-11B-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "Insulation resistance tests measure how well the insulation prevents current flow; open air is an excellent insulator and should show a maximum/over-limit reading."
  },
  {
    "id": 4056,
    "question": "At which point should an electrician definitely re-prove their test instrument during a testing session?",
    "options": [
      "After changing the test leads or changing the measurement range",
      "After every single individual measurement taken on the rig",
      "Only if the low battery indicator light begins to flash",
      "At the end of the lunch break before returning to the rig"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "OTHER",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Proving your tester works",
    "tags": [
      "application",
      "health-safety"
    ],
    "learningOutcomeId": "204-11B-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Changing leads or settings can introduce new variables or faults; re-proving ensures the new setup is still accurate."
  },
  {
    "id": 4057,
    "question": "If a tester powers on and the screen lights up, why is this NOT sufficient proof that the instrument is working correctly?",
    "options": [
      "It doesn't verify that the leads are intact or the internal fuse is working",
      "The screen brightness has no impact on the accuracy of the Ohms scale",
      "Digital displays are always less reliable than analogue needle scales",
      "The tester must be plugged into a mains socket to be fully proven"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "CONFUSED_AC_DC_SOURCES"
    },
    "section": "Electrical Installations Technology",
    "category": "Proving your tester works",
    "tags": [
      "conceptual",
      "health-safety"
    ],
    "learningOutcomeId": "204-11B-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "A tester might power on but have broken leads or a blown internal protection fuse, which would result in false 'open circuit' readings."
  },
  {
    "id": 4058,
    "question": "An electrician receives a very unusual and unexpected reading while testing a circuit. What is the first logical step they should take?",
    "options": [
      "Re-prove the tester and leads to ensure the instrument is still functioning",
      "Assume the circuit is faulty and begin dismantling the installation",
      "Write the reading down and move on to the next part of the test",
      "Replace the batteries in the tester immediately"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "OTHER",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Proving your tester works",
    "tags": [
      "application",
      "discrimination"
    ],
    "learningOutcomeId": "204-11B-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "Before concluding the installation is faulty, you must verify that your measurement tool is still providing reliable information."
  },
  {
    "id": 4059,
    "question": "What is the difference between 'proving' an instrument and 'testing' a circuit?",
    "options": [
      "Proving checks the meter's health; testing checks the installation's health",
      "Proving is done with the power on; testing is always done with power off",
      "Proving is only for apprentices; qualified electricians only need to test",
      "Testing is a legal requirement, whereas proving is just a recommendation"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_AC_DC_SOURCES",
      "2": "OTHER",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Proving your tester works",
    "tags": [
      "conceptual",
      "terminology"
    ],
    "learningOutcomeId": "204-11B-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Proving is the act of verifying the tool is fit for purpose; testing is the act of using that tool to verify the electrical installation."
  },
  {
    "id": 4060,
    "question": "Which unit of measurement is most commonly used when proving the 'open circuit' condition of an insulation resistance tester?",
    "options": [
      "Megaohms (MΩ)",
      "Milliamps (mA)",
      "Microfarads (µF)",
      "Millivolts (mV)"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_I_V_R",
      "2": "WRONG_UNITS",
      "3": "WRONG_UNITS"
    },
    "section": "Electrical Installations Technology",
    "category": "Proving your tester works",
    "tags": [
      "units",
      "discrimination"
    ],
    "learningOutcomeId": "204-11B-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Insulation resistance is measured in Megaohms (millions of ohms) because insulation is designed to have very high resistance."
  },
  {
    "id": 4061,
    "question": "Why is it essential for an electrician to prove a test instrument works before using it on a training rig?",
    "options": [
      "To confirm the instrument responds as expected before relying on its readings",
      "To ensure the circuit being tested is connected to the mains supply",
      "To perform a formal calibration of the internal circuitry",
      "To guarantee that the batteries will last for the entire day"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_AC_DC_SOURCES",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Proving your tester works",
    "tags": [
      "terminology",
      "conceptual"
    ],
    "learningOutcomeId": "204-11B-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Proving the tester ensures the instrument is functioning correctly and providing reliable data before it is used to make safety-critical measurements."
  },
  {
    "id": 4062,
    "question": "When proving a continuity tester by shorting the test probes together, what would a healthy instrument typically indicate?",
    "options": [
      "A stable, very low resistance reading and/or an audible beep",
      "A reading of ' >1999 MΩ' on the digital display",
      "A fluctuating high resistance reading above 500 Ω",
      "The display remaining blank until the probes are separated"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "WRONG_UNITS",
      "2": "CONFUSED_I_V_R",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Proving your tester works",
    "tags": [
      "resistance-rule",
      "discrimination"
    ],
    "learningOutcomeId": "204-11B-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "A healthy continuity tester should show a very low resistance (close to 0 Ω) when probes are shorted, often accompanied by a buzzer."
  },
  {
    "id": 4063,
    "question": "At which point during a dead-testing session is it most important to re-prove the test instrument?",
    "options": [
      "After changing the test leads or switching the measurement range",
      "Every time a single individual measurement is recorded",
      "Only if the tester's screen backlight turns off automatically",
      "When the ambient room temperature changes by more than five degrees"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "OTHER",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Proving your tester works",
    "tags": [
      "application",
      "terminology"
    ],
    "learningOutcomeId": "204-11B-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Changing leads or ranges can introduce new points of failure or incorrect settings; re-proving ensures the new setup is still accurate."
  },
  {
    "id": 4064,
    "question": "What is the primary difference between 'proving the tester' and 'testing the circuit'?",
    "options": [
      "Proving checks the instrument's operation; testing checks the circuit's condition",
      "Proving is only done on live circuits; testing is only done on dead circuits",
      "Proving is only for insulation resistance; testing is only for continuity",
      "There is no difference; they are two names for the same procedure"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_AC_DC_SOURCES",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Proving your tester works",
    "tags": [
      "discrimination",
      "terminology"
    ],
    "learningOutcomeId": "204-11B-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Proving is the act of verifying the tool works (using a known source or short circuit), while testing is using that tool to evaluate the installation."
  },
  {
    "id": 4065,
    "question": "An electrician receives an unexpected 'Open Circuit' reading while testing a known healthy link. What should be their first action?",
    "options": [
      "Re-prove the tester and leads to ensure they are still functioning correctly",
      "Assume the link is faulty and immediately replace the wiring",
      "Change the batteries in the tester before taking any other steps",
      "Continue testing the rest of the installation and ignore the result"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "OTHER",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Proving your tester works",
    "tags": [
      "application",
      "conceptual"
    ],
    "learningOutcomeId": "204-11B-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "If a result is unexpected, the first step is to verify that the test equipment hasn't failed (e.g., a broken lead) by re-proving it."
  },
  {
    "id": 4066,
    "question": "Why must an electrician 'prove' their continuity tester before carrying out dead tests on a training rig?",
    "options": [
      "To confirm the instrument and its leads respond correctly to a known condition before relying on them",
      "To ensure the internal batteries have enough voltage to power the circuit under test",
      "To calibrate the instrument's internal clock for time-stamped results",
      "To discharge any capacitive energy stored within the training rig wiring"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "CONFUSED_AC_DC_SOURCES"
    },
    "section": "Electrical Installations Technology",
    "category": "Proving your tester works",
    "tags": [
      "terminology",
      "conceptual",
      "health-safety"
    ],
    "learningOutcomeId": "204-11B-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Proving is the process of verifying that the tester and leads are functioning correctly by checking them against a known condition (like shorting leads for continuity) before trusting the readings on the actual circuit."
  },
  {
    "id": 4067,
    "question": "An electrician is preparing to test for continuity. Which of these actions best describes a valid 'proving' routine?",
    "options": [
      "Firmly touching the lead tips together to ensure a stable, low resistance reading and a beep",
      "Switching the device on and checking if the digital display lights up clearly",
      "Connecting the leads to a known live 230V socket to see if the tester reacts",
      "Touching the leads to a painted metal surface to check for a high resistance reading"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "CONFUSED_AC_DC_SOURCES",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "Proving your tester works",
    "tags": [
      "application",
      "conceptual",
      "health-safety"
    ],
    "learningOutcomeId": "204-11B-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "For continuity, proving involves shorting the leads together. This provides a 'known condition' of near-zero resistance which the meter should display accurately."
  },
  {
    "id": 4068,
    "question": "What is the primary difference between 'proving' a tester and 'testing' a circuit?",
    "options": [
      "Proving verifies the tool is functional; testing measures the condition of the installation",
      "Proving is done only on live circuits; testing is done only on dead circuits",
      "Proving is a legal requirement; testing is an optional safety recommendation",
      "Proving is done at the end of the day; testing is done at the start of the day"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "OTHER",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Proving your tester works",
    "tags": [
      "terminology",
      "discrimination",
      "conceptual"
    ],
    "learningOutcomeId": "204-11B-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "Proving is about the equipment (the tester and leads), whereas testing is about the electrical installation itself."
  },
  {
    "id": 4069,
    "question": "While proving a continuity tester by shorting the leads, the reading fluctuates between 0.05 Ω and 15.4 Ω. What is the most likely cause?",
    "options": [
      "A damaged or broken core inside one of the test leads",
      "The batteries in the tester are too strong for the selected range",
      "The circuit under test has too much parallel resistance",
      "The tester is correctly identifying the resistance of the air"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "USED_PARALLEL_RULE",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "Proving your tester works",
    "tags": [
      "application",
      "discrimination",
      "calculation"
    ],
    "learningOutcomeId": "204-11B-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "Fluctuating readings when leads are held steady usually indicate a 'partial break' or poor connection within the test leads themselves, meaning the tester has failed the proving stage."
  },
  {
    "id": 4070,
    "question": "In which of the following scenarios is it most critical to 're-prove' your tester during a work session?",
    "options": [
      "After replacing a set of test leads or changing the measurement range",
      "Every time you move from one room to another in the same building",
      "Immediately after the tester's auto-power-off function has engaged",
      "Only if the ambient temperature of the room changes by more than 5 degrees"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "OTHER",
      "3": "UNITS_MISSING"
    },
    "section": "Electrical Installations Technology",
    "category": "Proving your tester works",
    "tags": [
      "application",
      "conceptual",
      "health-safety"
    ],
    "learningOutcomeId": "204-11B-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "Changing leads is a major change to the measurement 'system'. You must prove the new leads are functional before continuing with tests."
  },
  {
    "id": 4071,
    "question": "When proving an Insulation Resistance (IR) tester on a training rig, what should the display show when the leads are held apart in the air?",
    "options": [
      "A reading showing over-range or infinity (e.g., >200MΩ or >999MΩ)",
      "A reading of exactly 0.00 MΩ to show there is no resistance",
      "A fluctuating reading between 0.01 Ω and 1.00 Ω",
      "A warning symbol indicating that the circuit is incomplete"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_I_V_R",
      "2": "WRONG_UNITS",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Proving your tester works",
    "tags": [
      "discrimination",
      "conceptual",
      "units"
    ],
    "learningOutcomeId": "204-11B-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Air is an insulator. An IR tester should show a very high resistance (infinity) when leads are apart to prove it can correctly identify an open circuit/good insulation."
  },
  {
    "id": 4072,
    "question": "You obtain an unusually high resistance reading (e.g., 2000 Ω) while testing a short length of copper conductor. What is the correct multi-step response?",
    "options": [
      "Stop, re-prove the tester on a known short-circuit, then re-test the cable",
      "Record the result immediately and report the cable as faulty",
      "Change the batteries and assume the previous reading was correct",
      "Subtract the resistance of the leads from the 2000 Ω and record the result"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "OTHER",
      "3": "FORMULA_NOT_REARRANGED"
    },
    "section": "Electrical Installations Technology",
    "category": "Proving your tester works",
    "tags": [
      "application",
      "conceptual",
      "discrimination"
    ],
    "learningOutcomeId": "204-11B-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "An unexpected result should trigger a 're-prove' step to ensure the fault isn't with the tester or leads before concluding there is a fault in the installation."
  },
  {
    "id": 4073,
    "question": "What is the purpose of 'nulling' or 'zeroing' test leads on a continuity meter?",
    "options": [
      "To remove the resistance of the test leads from the final circuit measurement",
      "To reset the internal fuse of the tester after a high-current surge",
      "To ensure the tester uses the maximum possible battery voltage",
      "To mute the audible buzzer so it doesn't distract other workers"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "OTHER",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "Proving your tester works",
    "tags": [
      "conceptual",
      "calculation",
      "units"
    ],
    "learningOutcomeId": "204-11B-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Nulling subtracts the lead resistance (usually 0.05 - 0.20 Ω) so that the displayed value represents only the resistance of the circuit being tested."
  },
  {
    "id": 4074,
    "question": "A student proves their tester at the start of the day. After lunch, they drop the tester on the floor. What should they do before continuing their dead tests?",
    "options": [
      "Perform a full re-proving routine to check for internal damage or loose lead connections",
      "Shake the tester to see if anything rattles, then continue testing if it sounds okay",
      "Visual check only; if the screen isn't cracked, the tester is safe to use",
      "Wait until the next scheduled calibration date to ensure accuracy"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "OTHER",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Proving your tester works",
    "tags": [
      "application",
      "health-safety",
      "conceptual"
    ],
    "learningOutcomeId": "204-11B-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Any physical shock or interruption to the work requires a re-prove to ensure the instrument's integrity hasn't been compromised."
  },
  {
    "id": 4075,
    "question": "Which sequence correctly follows the 'safe working' mindset for dead testing a training rig?",
    "options": [
      "Prove tester → Test circuit → Re-prove tester",
      "Test circuit → Prove tester → Record results",
      "Prove tester → Record results → Calibrate tester",
      "Check batteries → Test circuit → Prove tester"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Proving your tester works",
    "tags": [
      "conceptual",
      "health-safety",
      "discrimination"
    ],
    "learningOutcomeId": "204-11B-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "The standard routine is to prove the tester works, perform the test, and then re-prove to ensure the tester was still working correctly during the measurement."
  },
  {
    "id": 4076,
    "question": "What is the primary reason an electrician performs a 'proving' routine on a continuity tester before starting a dead-test on a training rig?",
    "options": [
      "To confirm the instrument responds as expected to a known condition before relying on its readings",
      "To ensure the instrument is within its annual calibration date",
      "To discharge any residual capacitance left in the circuit under test",
      "To verify that the circuit is connected to the correct earthing system"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "TOPOLOGY_CONFUSION",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Proving your tester works",
    "tags": [
      "terminology",
      "conceptual",
      "health-safety"
    ],
    "learningOutcomeId": "204-11B-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Proving verifies that the tester and its leads are functioning correctly by checking them against a known state (like a short circuit) before trusting them for real measurements."
  },
  {
    "id": 4077,
    "question": "Which of the following describes the difference between 'proving' a tester and 'testing' a circuit?",
    "options": [
      "Proving verifies the instrument's operation; testing assesses the installation's condition",
      "Proving is done with the power on; testing is done with the power off",
      "Proving checks for voltage; testing checks for resistance",
      "Proving is only required for digital meters; testing is for all meter types"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_AC_DC_SOURCES",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Proving your tester works",
    "tags": [
      "terminology",
      "conceptual",
      "discrimination"
    ],
    "learningOutcomeId": "204-11B-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Proving is the process of checking the tool, while testing is the process of checking the electrical installation itself."
  },
  {
    "id": 4078,
    "question": "While performing a continuity test, an electrician receives a result that is significantly higher than expected. What should be the immediate next step?",
    "options": [
      "Re-prove the tester and leads to ensure the high reading isn't caused by a meter fault",
      "Record the result and move on to the Insulation Resistance test",
      "Replace the circuit breaker as it is likely causing the high resistance",
      "Assume the battery is low and change it without checking the leads"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "OTHER",
      "3": "UNITS_MISSING"
    },
    "section": "Electrical Installations Technology",
    "category": "Proving your tester works",
    "tags": [
      "application",
      "calculation",
      "discrimination"
    ],
    "learningOutcomeId": "204-11B-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "Unexpected results should always trigger a re-prove of the instrument to rule out faulty leads or a malfunctioning tester before diagnosing the circuit."
  },
  {
    "id": 4079,
    "question": "When proving a continuity tester by shorting the leads together, what indicates a 'healthy' response for a low-resistance ohmmeter?",
    "options": [
      "A stable, very low resistance reading close to 0.00 Ω",
      "A reading that fluctuates rapidly between 0 Ω and 100 Ω",
      "An 'OL' or 'Infinity' display on the screen",
      "A single beep that occurs only when the leads first touch"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "RECIPROCAL_ERROR",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "Proving your tester works",
    "tags": [
      "conceptual",
      "units",
      "discrimination"
    ],
    "learningOutcomeId": "204-11B-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "A healthy continuity tester should show a stable, very low resistance when the leads are shorted. Fluctuations suggest poor lead contact or internal faults."
  },
  {
    "id": 4080,
    "question": "An electrician is about to carry out an insulation resistance (IR) test. How should they prove the tester is responding correctly to an open-circuit condition?",
    "options": [
      "Hold the leads apart and ensure the display shows a very high resistance (e.g., >200MΩ)",
      "Touch the leads together and ensure the display shows 0.00MΩ",
      "Switch the tester to the continuity setting and check for a beep",
      "Connect the leads to a known 10Ω resistor and check for a high reading"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "OTHER",
      "3": "WRONG_UNITS"
    },
    "section": "Electrical Installations Technology",
    "category": "Proving your tester works",
    "tags": [
      "conceptual",
      "discrimination",
      "units"
    ],
    "learningOutcomeId": "204-11B-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 75,
    "explanation": "For IR testing, proving includes checking that the meter reads 'infinity' or its maximum value when the leads are not touching (open circuit)."
  },
  {
    "id": 4081,
    "question": "An electrician finishes testing one circuit and needs to change their test leads to a different length for the next circuit. What action must they take?",
    "options": [
      "Null/zero the new leads and re-prove the tester's operation",
      "Continue testing as the meter was already proven at the start of the day",
      "Multiply all future readings by two to account for the longer leads",
      "Only re-prove if the meter powers off automatically"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "MULTIPLIED_INSTEAD",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Proving your tester works",
    "tags": [
      "application",
      "conceptual",
      "resistance-rule"
    ],
    "learningOutcomeId": "204-11B-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "Changing leads changes the resistance of the test circuit. The meter must be nulled (zeroed) and re-proven to ensure accuracy with the new setup."
  },
  {
    "id": 4082,
    "question": "Why is a simple 'beep' from a continuity tester often insufficient to prove the instrument is working correctly for professional certification?",
    "options": [
      "The beep confirms path existence but does not verify the accuracy of the numerical resistance value",
      "The beep only works on AC circuits, not DC dead-testing rigs",
      "The beep function uses too much battery power to be reliable",
      "A beep indicates that the resistance is too high for the circuit to be safe"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_AC_DC_SOURCES",
      "2": "OTHER",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "Proving your tester works",
    "tags": [
      "conceptual",
      "discrimination",
      "terminology"
    ],
    "learningOutcomeId": "204-11B-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "A continuity 'buzzer' usually triggers at any resistance below a certain threshold (e.g., 30Ω). It doesn't prove the meter can accurately distinguish between 0.05Ω and 2.0Ω."
  },
  {
    "id": 4083,
    "question": "A student is following a 'Prove-Test-Prove' routine on a training rig. They prove the meter, take their readings, but then the meter's leads are accidentally pulled out. What should they do?",
    "options": [
      "Plug the leads back in and re-prove the meter before continuing or finishing the routine",
      "Assume the previous readings were correct and finish the documentation",
      "Plug the leads back in and continue testing from where they left off",
      "Check the battery level; if it is full, no re-proving is required"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "OTHER",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Proving your tester works",
    "tags": [
      "application",
      "health-safety",
      "conceptual"
    ],
    "learningOutcomeId": "204-11B-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "Any interruption to the test equipment setup, such as leads being disconnected, requires a re-prove to ensure the setup is still valid and the leads haven't been damaged."
  },
  {
    "id": 4084,
    "question": "Which of the following is a common reason a tester might give a misleading 'high resistance' reading during a proving check even if the battery is full?",
    "options": [
      "Poor contact or oxidation on the tips of the test probes",
      "The circuit under test being too short",
      "The use of a digital meter instead of an analogue one",
      "The tester being set to the Insulation Resistance range instead of Continuity"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "OTHER",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "Proving your tester works",
    "tags": [
      "discrimination",
      "application",
      "resistance-rule"
    ],
    "learningOutcomeId": "204-11B-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 75,
    "explanation": "Dirt, oxidation, or poor contact pressure on the probe tips can add significant resistance, leading to a misleading result during the proving stage."
  },
  {
    "id": 4085,
    "question": "An electrician is testing a long run of conduit for continuity. After obtaining a satisfactory result, they notice one of the test lead's insulation is slightly frayed. What is the correct procedure?",
    "options": [
      "Discard the leads, get a new pair, and re-test the circuit after proving the new set",
      "Apply electrical tape to the fray and record the original result",
      "Ignore the fray as it only affects the insulation, not the copper core",
      "Only replace the leads if the meter fails to beep when shorted"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "OTHER",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Proving your tester works",
    "tags": [
      "application",
      "health-safety",
      "discrimination"
    ],
    "learningOutcomeId": "204-11B-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "Damaged test equipment must not be used. Once replaced, the new equipment must be proven and the previous tests repeated to ensure those results were not influenced by the damaged leads."
  },
  {
    "id": 4086,
    "question": "Why is it essential to prove a continuity tester before carrying out dead tests on a new electrical installation?",
    "options": [
      "To confirm that the instrument and its leads respond correctly to a known condition",
      "To ensure the internal battery has enough voltage to power the digital display",
      "To calibrate the internal circuitry against national measurement standards",
      "To verify that the circuit being tested has been successfully energized"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "Proving your tester works",
    "tags": [
      "terminology",
      "conceptual",
      "health-safety"
    ],
    "learningOutcomeId": "204-11B-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Proving a tester involves checking that the instrument and the leads are functioning as expected by testing them against a known reference (like shorting the leads for continuity) before relying on the readings."
  },
  {
    "id": 4087,
    "question": "An electrician is setting up to perform a continuity test. Which action correctly describes the 'proving' stage of the procedure?",
    "options": [
      "Shorting the lead tips together to ensure a stable, low resistance reading and/or an audible beep",
      "Touching the leads to the metal enclosure of the distribution board to check for a beep",
      "Holding the leads apart and pressing the test button to ensure the display shows 0.00Ω",
      "Checking the calibration sticker to ensure the instrument is within its annual service date"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Proving your tester works",
    "tags": [
      "terminology",
      "discrimination",
      "application"
    ],
    "learningOutcomeId": "204-11B-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "For continuity, proving involves creating a temporary short circuit with the leads to verify the meter detects low resistance. Holding leads apart should show an over-range/infinity result, not 0.00Ω."
  },
  {
    "id": 4088,
    "question": "While testing a ring final circuit, an electrician obtains an unusually high continuity reading that fluctuates. After checking the conductor connections, what should be the immediate next step?",
    "options": [
      "Re-prove the tester and leads using a known low-resistance reference to rule out equipment failure",
      "Record the result as a loose connection fault and proceed to the insulation resistance test",
      "Replace the batteries in the tester to ensure the test current is high enough for the circuit",
      "Switch the instrument to the Insulation Resistance (IR) setting to see if the reading stabilizes"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "OTHER",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "Proving your tester works",
    "tags": [
      "application",
      "health-safety",
      "discrimination"
    ],
    "learningOutcomeId": "204-11B-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "Unexpected or fluctuating results are a primary trigger for re-proving the tester. This ensures the issue lies with the circuit and not a damaged test lead or a faulty instrument."
  },
  {
    "id": 4089,
    "question": "Which of the following is a common reason why a tester might pass a 'proving' check but provide inaccurate readings during the actual circuit test?",
    "options": [
      "An intermittent break in the internal copper core of one of the test leads",
      "The tester being set to the 500V range instead of the 250V range for an IR test",
      "The use of rechargeable batteries instead of standard alkaline batteries in the unit",
      "The instrument having been calibrated six months ago rather than within the last month"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "OTHER",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Proving your tester works",
    "tags": [
      "conceptual",
      "terminology"
    ],
    "learningOutcomeId": "204-11B-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "Test leads are the most vulnerable part of the kit. An intermittent break may allow a 'pass' during a quick proving check but fail or give high resistance when moved or stretched during the actual test."
  },
  {
    "id": 4090,
    "question": "When proving an Insulation Resistance (IR) tester on a training rig, what is the expected healthy response when the test leads are held apart in the air?",
    "options": [
      "A very high resistance reading, often displayed as '>999MΩ' or 'OR' (Over Range)",
      "A reading of 0.00Ω accompanied by a continuous audible buzzer sound",
      "A low resistance reading between 0.01Ω and 0.05Ω to account for the leads",
      "A reading of exactly 1.0MΩ to indicate the scale is functioning at its minimum limit"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "OTHER",
      "3": "WRONG_UNITS"
    },
    "section": "Electrical Installations Technology",
    "category": "Proving your tester works",
    "tags": [
      "discrimination",
      "units",
      "conceptual"
    ],
    "learningOutcomeId": "204-11B-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Insulation resistance measures how well the insulation prevents current flow. With leads in the air (an open circuit), the resistance should be effectively infinite (Over Range)."
  },
  {
    "id": 4091,
    "question": "A student is preparing to perform continuity testing on a training rig. The multi-function tester completes its internal digital self-check and displays no errors. Why is it still necessary to perform a manual 'proving' check before starting the work?",
    "options": [
      "The internal self-check does not verify the integrity of the test leads and probes",
      "Digital testers are legally required to be manually zeroed every time they are powered on",
      "The internal check only monitors battery voltage and not the resistance range",
      "Manual proving is the only way to calibrate the internal microprocessor"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "OTHER",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Proving your tester works",
    "tags": [
      "continuity",
      "conceptual",
      "health-safety"
    ],
    "learningOutcomeId": "204-11B-LO1",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 120,
    "explanation": "A digital self-check confirms the internal circuitry is powered, but it cannot detect physical damage to the external leads or high resistance at the probe tips. Proving ensures the entire 'measurement loop' is functional."
  },
  {
    "id": 4092,
    "question": "While proving a continuity tester by shorting the leads together, an apprentice notices the reading fluctuates between 0.05 Ω and 1.20 Ω as they move their hands. What is the most likely cause of this inconsistent 'proof'?",
    "options": [
      "An intermittent break in the internal copper cores of the test leads",
      "The battery in the tester is low and needs immediate replacement",
      "The tester is automatically switching between different resistance ranges",
      "The test leads are too long and are picking up electromagnetic interference"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "OTHER",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "Proving your tester works",
    "tags": [
      "continuity",
      "application",
      "units"
    ],
    "learningOutcomeId": "204-11B-LO1",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 120,
    "explanation": "Fluctuating readings during the proving stage usually indicate a mechanical failure in the leads, such as a partial break at the strain relief, which changes resistance as the leads are moved."
  },
  {
    "id": 4093,
    "question": "When using an Insulation Resistance (IR) tester on a training rig, which set of 'known reference' conditions best proves the instrument is functioning correctly across its range?",
    "options": [
      "A short-circuit (0 MΩ) and a known open-circuit (>200 MΩ or 'Greater than' symbol)",
      "A short-circuit (0 Ω) and a battery check on the instrument display",
      "A 1.0 Ω resistor and a 100 Ω resistor to check the low-ohm range",
      "Connecting the probes to a live 230V socket to check for voltage detection"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "WRONG_UNITS",
      "3": "HEALTH_SAFETY"
    },
    "section": "Electrical Installations Technology",
    "category": "Proving your tester works",
    "tags": [
      "calculation",
      "discrimination",
      "units"
    ],
    "learningOutcomeId": "204-11B-LO1",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 120,
    "explanation": "To prove an IR tester, you need to verify it can see a 'fail' (0 MΩ / short circuit) and a 'pass' (open circuit / very high resistance). Proving only one state is insufficient."
  },
  {
    "id": 4094,
    "question": "An electrician is carrying out a series of dead tests on a complex training rig. At which point is it CRITICAL to re-prove the tester, even if it was proved at the start of the session?",
    "options": [
      "Immediately after obtaining an unexpected 'open circuit' reading on a known link",
      "Every 15 minutes to ensure the battery hasn't drained during the testing",
      "Only if the tester is dropped or physically damaged during the process",
      "After every single individual measurement taken on the rig"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "OTHER",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Proving your tester works",
    "tags": [
      "conceptual",
      "application",
      "discrimination"
    ],
    "learningOutcomeId": "204-11B-LO1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "Unexpected results (like an open circuit where a connection is expected) should trigger an immediate re-proof to ensure the tester or leads haven't failed, rather than assuming the circuit is at fault."
  },
  {
    "id": 4095,
    "question": "Which of the following scenarios describes a failure to follow the 'Prove-Test-Prove' routine correctly during continuity testing?",
    "options": [
      "Proving the tester, nulling the leads, performing the test, and then packing the tester away",
      "Proving the tester, performing the test, and re-proving after a suspicious 0.00 Ω result",
      "Checking the leads for damage, proving against a short circuit, and then testing the rig",
      "Proving the tester, changing the range from Ω to MΩ, and then re-proving on the new range"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "OTHER",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Proving your tester works",
    "tags": [
      "discrimination",
      "conceptual",
      "application"
    ],
    "learningOutcomeId": "204-11B-LO1",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 120,
    "explanation": "A complete routine requires proving both before and after (or at least re-proving if results are questionable or settings change). Proving only at the start ignores potential failures during the test."
  },
  {
    "id": 4096,
    "question": "What is the primary difference between 'nulling' (zeroing) test leads and 'proving' the instrument?",
    "options": [
      "Nulling subtracts lead resistance from the result; proving confirms the instrument responds to a known state",
      "Nulling checks the battery; proving checks the fuse inside the tester",
      "Nulling is only for Insulation Resistance; proving is only for Continuity",
      "There is no difference; they are two terms for the same procedure"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Proving your tester works",
    "tags": [
      "discrimination",
      "terminology",
      "units"
    ],
    "learningOutcomeId": "204-11B-LO1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "Nulling is a functional adjustment to improve accuracy by removing lead resistance. Proving is a safety/reliability check to ensure the meter is actually working."
  },
  {
    "id": 4097,
    "question": "A student proves their continuity tester by shorting the leads and hears a 'beep'. They then test a circuit and get a reading of 19.99 kΩ. Why might the 'beep' have been a misleading proof for this specific measurement?",
    "options": [
      "The beep only indicates continuity below a certain threshold, not the accuracy of the numerical display",
      "The beep indicates the tester is in 'Voltage' mode rather than 'Resistance' mode",
      "A beep always means the resistance is exactly 0.00 Ω",
      "The tester cannot beep and show a numerical reading at the same time"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "OTHER",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Proving your tester works",
    "tags": [
      "discrimination",
      "conceptual",
      "application"
    ],
    "learningOutcomeId": "204-11B-LO1",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 120,
    "explanation": "Testers often beep at low resistances (e.g., <30 Ω). Relying solely on the beep doesn't prove the digital display is working correctly or that the meter can accurately measure higher resistances."
  },
  {
    "id": 4098,
    "question": "You are about to perform an Insulation Resistance test at 500V on a training rig. Before testing, you short the leads together and press the test button. What result MUST you see to prove the tester is responding correctly for a 'fail' condition?",
    "options": [
      "0.00 MΩ (or a very low reading)",
      "Greater than 299 MΩ (or 'OL')",
      "A reading of exactly 500V on the display",
      "The continuity buzzer sounding continuously"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "CONFUSED_I_V_R",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "Proving your tester works",
    "tags": [
      "application",
      "units",
      "conceptual"
    ],
    "learningOutcomeId": "204-11B-LO1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "Shorting IR leads should produce a 0.00 MΩ reading, proving the meter can detect a dead short (the worst-case insulation failure)."
  },
  {
    "id": 4099,
    "question": "During a dead-testing practical, a student changes the test leads from standard probes to crocodile clips. What action should be taken immediately?",
    "options": [
      "Re-prove and re-null the tester with the new leads attached",
      "Continue testing as the internal calibration is unaffected by lead type",
      "Subtract 0.5 Ω from all future readings to account for the clips",
      "Verify the battery level as crocodile clips draw more current"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "CALCULATION_ERROR",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Proving your tester works",
    "tags": [
      "application",
      "continuity",
      "health-safety"
    ],
    "learningOutcomeId": "204-11B-LO1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "Any change in the test lead configuration (probes to clips or changing lead length) requires the instrument to be re-proved and re-nulled to ensure accuracy and functionality."
  },
  {
    "id": 4100,
    "question": "Why is it considered 'best practice' to re-prove a tester against a known source after completing a set of tests, even if the tester worked at the start?",
    "options": [
      "To confirm the tester did not fail or develop a lead fault during the actual testing process",
      "To discharge any static electricity built up in the tester's internal capacitors",
      "To reset the internal timer required for the calibration certificate validity",
      "To ensure the battery has enough power to save the results to the internal memory"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "OTHER",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Proving your tester works",
    "tags": [
      "conceptual",
      "health-safety",
      "discrimination"
    ],
    "learningOutcomeId": "204-11B-LO1",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 120,
    "explanation": "Re-proving at the end of a session confirms that the results obtained during the session were measured by a functional instrument. If it fails the final proof, all previous results are suspect."
  }
];
