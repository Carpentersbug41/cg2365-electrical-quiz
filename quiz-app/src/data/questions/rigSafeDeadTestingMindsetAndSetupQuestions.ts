import { TaggedQuestion } from './types';

/**
 * Rig-safe dead-testing mindset and setup Question Bank
 * Aligned with lesson 204-11A learning outcomes
 * Generated: 2026-01-27
 */

export const rigSafeDeadTestingMindsetAndSetupQuestions: TaggedQuestion[] = [
  {
    "id": 4051,
    "question": "In the context of a training rig, what does the term 'dead testing' specifically refer to?",
    "options": [
      "Testing a circuit that has been fully isolated from the electrical supply",
      "Testing a circuit while it is connected to a low-voltage battery",
      "Testing a circuit that has failed and blown a fuse",
      "Testing a live circuit using insulated rubber gloves"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_AC_DC_SOURCES",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "CONFUSED_AC_WITH_DC"
    },
    "section": "Electrical Installations Technology",
    "category": "Rig-safe dead-testing mindset and setup",
    "tags": [
      "terminology",
      "health-safety",
      "conceptual"
    ],
    "learningOutcomeId": "204-11A-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Dead testing is performed on circuits that are completely isolated from any electrical supply to ensure safety and prevent damage to test instruments."
  },
  {
    "id": 4052,
    "question": "Which instrument should be selected to measure the continuity of a circuit's protective conductor?",
    "options": [
      "A low-resistance ohmmeter",
      "An insulation resistance tester set to 500 V",
      "A high-sensitivity voltmeter",
      "A clip-on ammeter"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_I_V_R",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Rig-safe dead-testing mindset and setup",
    "tags": [
      "resistance-rule",
      "discrimination",
      "units"
    ],
    "learningOutcomeId": "204-11A-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "A low-resistance ohmmeter is used for continuity testing to measure the very small resistance values of conductors."
  },
  {
    "id": 4053,
    "question": "An apprentice is about to start dead testing on a training rig. What is the most important 'before you test' routine step?",
    "options": [
      "Confirming the circuit is safely isolated and the rig state is secure",
      "Calculating the expected resistance using Ohm's Law",
      "Writing down the results on a blank certificate",
      "Cleaning the copper conductors with a wire brush"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "FORMULA_NOT_REARRANGED",
      "2": "OTHER",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Rig-safe dead-testing mindset and setup",
    "tags": [
      "health-safety",
      "application",
      "conceptual"
    ],
    "learningOutcomeId": "204-11A-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Safety is the priority; the rig must be confirmed as isolated before any testing begins to prevent accidents."
  },
  {
    "id": 4054,
    "question": "What is the primary reason for 'nulling' or 'zeroing' the test leads on a low-resistance ohmmeter?",
    "options": [
      "To subtract the resistance of the test leads from the final reading",
      "To ensure the battery in the meter is fully charged",
      "To reset the meter's internal clock for calibration",
      "To increase the voltage output of the test instrument"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "CONFUSED_I_V_R"
    },
    "section": "Electrical Installations Technology",
    "category": "Rig-safe dead-testing mindset and setup",
    "tags": [
      "calculation",
      "resistance-rule",
      "units"
    ],
    "learningOutcomeId": "204-11A-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Nulling removes the resistance of the leads themselves, ensuring the meter only shows the resistance of the circuit being tested."
  },
  {
    "id": 4055,
    "question": "Which unit of measurement is typically used when recording the results of an Insulation Resistance (IR) test?",
    "options": [
      "Megohms (MΩ)",
      "Milliohms (mΩ)",
      "Microfarads (µF)",
      "Milliamps (mA)"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "WRONG_UNITS",
      "2": "UNITS_MISSING",
      "3": "CONFUSED_I_V_R"
    },
    "section": "Electrical Installations Technology",
    "category": "Rig-safe dead-testing mindset and setup",
    "tags": [
      "units",
      "discrimination",
      "terminology"
    ],
    "learningOutcomeId": "204-11A-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Insulation resistance should be very high, so it is measured in Megohms (millions of ohms)."
  },
  {
    "id": 4056,
    "question": "Why is rushing the setup of test equipment considered an unsafe practice?",
    "options": [
      "It leads to unsafe assumptions and unreliable test results",
      "It causes the test leads to overheat and melt",
      "It makes the test meter run out of battery faster",
      "It is only unsafe if the circuit is connected to a motor"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "OTHER",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "Rig-safe dead-testing mindset and setup",
    "tags": [
      "conceptual",
      "health-safety",
      "explanation"
    ],
    "learningOutcomeId": "204-11A-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Rushing often leads to missed safety checks or incorrect meter settings, which compromises both safety and accuracy."
  },
  {
    "id": 4057,
    "question": "A student needs to verify that a switch is correctly installed in the Line conductor. Which test should they perform?",
    "options": [
      "Polarity check",
      "Insulation resistance test",
      "Earth fault loop impedance test",
      "Voltage drop calculation"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "FORMULA_NOT_REARRANGED"
    },
    "section": "Electrical Installations Technology",
    "category": "Rig-safe dead-testing mindset and setup",
    "tags": [
      "discrimination",
      "application",
      "terminology"
    ],
    "learningOutcomeId": "204-11A-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "A polarity check ensures that switches and fuses are connected in the Line (live) conductor and not the Neutral."
  },
  {
    "id": 4058,
    "question": "When inspecting test leads before use, what is a student looking for?",
    "options": [
      "Damage to insulation, secure probes, and correct color coding",
      "The price tag to ensure they are high-quality leads",
      "If the leads are long enough to wrap around the rig twice",
      "Whether the leads are made of solid silver or copper"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "OTHER",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Rig-safe dead-testing mindset and setup",
    "tags": [
      "application",
      "health-safety",
      "discrimination"
    ],
    "learningOutcomeId": "204-11A-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Visual inspection of leads is critical to ensure there is no exposed copper and that the probes are safe to handle."
  },
  {
    "id": 4059,
    "question": "What is the risk of using the 'continuity beep' function instead of reading the actual Ohms value for a protective conductor?",
    "options": [
      "The beep may sound even if the resistance is too high for safety",
      "The beep will drain the battery within a few seconds",
      "The beep will cause the circuit breaker to trip",
      "The beep only works on live circuits"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "CONFUSED_AC_DC_SOURCES"
    },
    "section": "Electrical Installations Technology",
    "category": "Rig-safe dead-testing mindset and setup",
    "tags": [
      "conceptual",
      "resistance-rule",
      "application"
    ],
    "learningOutcomeId": "204-11A-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Continuity 'beepers' often activate at resistances up to 50-100 Ohms, which is far too high for a safe protective conductor connection."
  },
  {
    "id": 4060,
    "question": "Before starting a dead test, why should a student identify the specific circuit they are testing?",
    "options": [
      "To ensure they are testing the correct conductors and not an adjacent circuit",
      "To calculate the total electricity bill for that circuit",
      "To determine the color of the paint on the consumer unit",
      "To see if the circuit needs a larger fuse before testing"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "OTHER",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "Rig-safe dead-testing mindset and setup",
    "tags": [
      "conceptual",
      "application",
      "health-safety"
    ],
    "learningOutcomeId": "204-11A-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Identifying the circuit ensures that test results are valid for the intended wiring and prevents accidental testing of live or unrelated parts."
  },
  {
    "id": 4061,
    "question": "In the context of a training rig, what does the term 'dead testing' specifically refer to?",
    "options": [
      "Testing a circuit that has been safely isolated and confirmed to have no supply voltage",
      "Testing a circuit while the main switch is on but no appliances are plugged in",
      "Testing a circuit using a low voltage AC supply instead of the mains",
      "Testing a circuit that has failed and blown a fuse"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_AC_DC_SOURCES",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Rig-safe dead-testing mindset and setup",
    "tags": [
      "terminology",
      "health-safety",
      "conceptual"
    ],
    "learningOutcomeId": "204-11A-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Dead testing is performed only after the circuit is fully isolated from the supply and proven dead to ensure the safety of the person testing."
  },
  {
    "id": 4062,
    "question": "Which instrument function should be selected to check the continuity of a protective conductor?",
    "options": [
      "Low-resistance ohmmeter (Ω)",
      "Insulation resistance tester (MΩ)",
      "Voltage indicator",
      "Frequency meter (Hz)"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "CONFUSED_FREQUENCY_WITH_VOLTAGE"
    },
    "section": "Electrical Installations Technology",
    "category": "Rig-safe dead-testing mindset and setup",
    "tags": [
      "discrimination",
      "units",
      "terminology"
    ],
    "learningOutcomeId": "204-11A-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Continuity tests check for low resistance in conductors, which requires a low-resistance ohmmeter setting (Ω), not high-resistance (MΩ)."
  },
  {
    "id": 4063,
    "question": "Why is it essential to follow a consistent 'before you test' routine on a training rig?",
    "options": [
      "To ensure all safety checks are completed and results are reliable",
      "To allow the test instrument time to warm up before use",
      "To make sure the battery in the tester is drained evenly",
      "To meet the minimum time requirement for the practical assessment"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "OTHER",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Rig-safe dead-testing mindset and setup",
    "tags": [
      "conceptual",
      "health-safety",
      "explanation"
    ],
    "learningOutcomeId": "204-11A-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "A repeatable routine prevents the electrician from missing vital safety steps, such as checking lead integrity or ensuring correct isolation."
  },
  {
    "id": 4064,
    "question": "When setting up a Multi-Function Tester (MFT) for an Insulation Resistance test, which unit of measurement is expected for a 'healthy' circuit?",
    "options": [
      "MΩ (Megaohms)",
      "Ω (Ohms)",
      "mV (Millivolts)",
      "mA (Milliamps)"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "UNITS_MISSING",
      "2": "WRONG_UNITS",
      "3": "CONFUSED_I_V_R"
    },
    "section": "Electrical Installations Technology",
    "category": "Rig-safe dead-testing mindset and setup",
    "tags": [
      "discrimination",
      "units",
      "resistance-rule"
    ],
    "learningOutcomeId": "204-11A-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "Insulation resistance should be very high to prevent current leakage, so it is measured in Megaohms (MΩ)."
  },
  {
    "id": 4065,
    "question": "An apprentice is preparing to test a lighting circuit on a rig. What should be their first action regarding their test leads?",
    "options": [
      "Visually inspect the leads and probes for any damage or exposed copper",
      "Plug them into the circuit to see if the meter turns on",
      "Wrap them tightly around the meter to keep them organized",
      "Clean the probes with water to ensure a good connection"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "OTHER",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Rig-safe dead-testing mindset and setup",
    "tags": [
      "application",
      "health-safety",
      "terminology"
    ],
    "learningOutcomeId": "204-11A-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Safety equipment must be inspected for damage before every use to ensure the user is protected and the readings are accurate."
  },
  {
    "id": 4066,
    "question": "In a training environment, what is the primary requirement for a circuit to be considered 'dead' before starting a test?",
    "options": [
      "The circuit is physically isolated and confirmed dead by a supervisor or safe isolation procedure",
      "The main switch is turned off but the padlock is not yet applied",
      "The circuit breaker is switched off but the supply is still connected to the busbar",
      "The student assumes the rig is dead because the lights in the room are off"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "OTHER",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Rig-safe dead-testing mindset and setup",
    "tags": [
      "health-safety",
      "terminology",
      "conceptual"
    ],
    "learningOutcomeId": "204-11A-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Dead testing requires a formal state of isolation where the circuit is proven dead and secured to prevent accidental re-energisation."
  },
  {
    "id": 4067,
    "question": "An apprentice is preparing to test the continuity of a protective conductor. Which instrument and setting should be selected for this task?",
    "options": [
      "A low-resistance ohmmeter set to the Ohms (Ω) range",
      "An insulation resistance tester set to the 500V MΩ range",
      "A digital multimeter set to the AC Voltage (V~) range",
      "A high-resistance ohmmeter set to the Megaohms (MΩ) range"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "WRONG_UNITS",
      "2": "CONFUSED_I_V_R",
      "3": "WRONG_UNITS"
    },
    "section": "Electrical Installations Technology",
    "category": "Rig-safe dead-testing mindset and setup",
    "tags": [
      "units",
      "terminology",
      "discrimination"
    ],
    "learningOutcomeId": "204-11A-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Continuity tests check for low resistance in conductors using an ohmmeter (Ω), whereas insulation resistance checks for high resistance (MΩ)."
  },
  {
    "id": 4068,
    "question": "Before connecting an instrument to a training rig for dead testing, what is the first step in the 'before you test' routine?",
    "options": [
      "Visually inspect the instrument and test leads for damage",
      "Connect the probes to the circuit terminals",
      "Switch the meter to the highest possible voltage range",
      "Short the probes together to check the battery"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "OTHER",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Rig-safe dead-testing mindset and setup",
    "tags": [
      "health-safety",
      "application"
    ],
    "learningOutcomeId": "204-11A-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "Safety begins with ensuring the equipment itself is fit for purpose; damaged leads can lead to false readings or safety risks."
  },
  {
    "id": 4069,
    "question": "Why is it essential to 'null' or 'zero' the test leads before performing a low-resistance continuity test?",
    "options": [
      "To subtract the resistance of the test leads from the final circuit measurement",
      "To ensure the internal fuse of the meter has not blown",
      "To discharge any capacitive energy stored in the cables",
      "To calibrate the meter against the local supply frequency"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "CONFUSED_AC_DC_SOURCES",
      "3": "CONFUSED_FREQUENCY_WITH_VOLTAGE"
    },
    "section": "Electrical Installations Technology",
    "category": "Rig-safe dead-testing mindset and setup",
    "tags": [
      "calculation",
      "conceptual"
    ],
    "learningOutcomeId": "204-11A-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "Test leads have a small amount of resistance. Nulling ensures the meter only displays the resistance of the circuit being tested."
  },
  {
    "id": 4070,
    "question": "A student needs to verify the insulation between live conductors. Which combination of units and expected result indicates a healthy circuit?",
    "options": [
      "Megaohms (MΩ) with a very high numerical value",
      "Ohms (Ω) with a very low numerical value",
      "Milliohms (mΩ) with a value close to zero",
      "Kilohms (kΩ) with a value exactly at 1.0"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "WRONG_UNITS",
      "2": "WRONG_UNITS",
      "3": "UNITS_MISSING"
    },
    "section": "Electrical Installations Technology",
    "category": "Rig-safe dead-testing mindset and setup",
    "tags": [
      "units",
      "discrimination",
      "conceptual"
    ],
    "learningOutcomeId": "204-11A-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Insulation should prevent current flow, meaning it must have a very high resistance, measured in Megaohms."
  },
  {
    "id": 4071,
    "question": "Which scenario describes a safety error when setting up for a dead test on a training rig?",
    "options": [
      "Starting the test immediately after switching off the main switch without verifying isolation",
      "Checking the battery levels of the multi-function tester before use",
      "Ensuring the test leads are inserted into the correct ports on the meter",
      "Confirming with the supervisor that the rig is safe to work on"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "OTHER",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Rig-safe dead-testing mindset and setup",
    "tags": [
      "health-safety",
      "application"
    ],
    "learningOutcomeId": "204-11A-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "Assuming a circuit is dead just because a switch is off is a common and dangerous misconception; isolation must be verified."
  },
  {
    "id": 4072,
    "question": "What is the most likely result of rushing the setup and failing to properly identify the circuit conductors before dead testing?",
    "options": [
      "Recording unreliable results and potentially missing a serious fault",
      "Increasing the accuracy of the low-resistance readings",
      "Reducing the wear and tear on the test instrument probes",
      "Ensuring the insulation resistance test voltage is more stable"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "OTHER",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Rig-safe dead-testing mindset and setup",
    "tags": [
      "conceptual",
      "health-safety"
    ],
    "learningOutcomeId": "204-11A-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "A repeatable routine ensures all checks are performed. Rushing leads to human error and invalid safety data."
  },
  {
    "id": 4073,
    "question": "When performing a continuity test on a ring final circuit, the meter displays 'OL' or 'Infinity'. What does this indicate to the electrician?",
    "options": [
      "There is a break in the conductor (open circuit)",
      "The circuit is perfectly connected with zero resistance",
      "The test leads have been nulled correctly",
      "The meter is set to the wrong range for continuity"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "OTHER",
      "3": "FORMULA_NOT_REARRANGED"
    },
    "section": "Electrical Installations Technology",
    "category": "Rig-safe dead-testing mindset and setup",
    "tags": [
      "discrimination",
      "terminology"
    ],
    "learningOutcomeId": "204-11A-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "OL (Over Limit) or Infinity on a continuity setting indicates that the resistance is too high to measure, usually meaning the wire is broken."
  },
  {
    "id": 4074,
    "question": "Which of the following is a multi-step sequence that follows the 'rig-safe' mindset for a dead test?",
    "options": [
      "Identify circuit, check leads, null meter, then perform the test",
      "Connect leads, turn on power, null meter, then record result",
      "Null meter, perform test, then check if the circuit is isolated",
      "Check leads, perform test, then identify which circuit was tested"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "OTHER",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Rig-safe dead-testing mindset and setup",
    "tags": [
      "application",
      "health-safety"
    ],
    "learningOutcomeId": "204-11A-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "The correct routine ensures isolation and meter accuracy are confirmed before any data is collected."
  },
  {
    "id": 4075,
    "question": "A student uses a continuity tester that 'beeps' to check insulation resistance between Line and Earth. Why is this an incorrect setup?",
    "options": [
      "The continuity tester does not apply the high voltage needed to stress the insulation",
      "The beep indicates that the insulation is at a dangerously high resistance",
      "The continuity tester uses AC current which will damage the DC insulation",
      "Continuity testers can only be used on circuits with a load connected"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "CONFUSED_AC_WITH_DC",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Rig-safe dead-testing mindset and setup",
    "tags": [
      "conceptual",
      "discrimination"
    ],
    "learningOutcomeId": "204-11A-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "Insulation resistance testing requires a high voltage (e.g., 500V) to detect leaks; a standard continuity 'beeper' only uses a tiny battery voltage."
  },
  {
    "id": 4076,
    "question": "In a training environment, what is the fundamental requirement for a circuit to be considered ready for 'dead testing'?",
    "options": [
      "The circuit must be fully isolated and confirmed as having no electrical energy present",
      "The circuit breaker must be switched to the 'off' position only",
      "The main switch must be off, even if the supply is still connected to the busbar",
      "The student must assume the rig is dead because the tutor said so"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Rig-safe dead-testing mindset and setup",
    "tags": [
      "health-safety",
      "terminology",
      "conceptual"
    ],
    "learningOutcomeId": "204-11A-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Dead testing requires the circuit to be completely isolated from all sources of supply and proven to have no voltage present before any resistance-based tests are carried out."
  },
  {
    "id": 4077,
    "question": "An electrician is about to perform a continuity test on a ring final circuit. Which sequence represents the most professional 'before you test' routine?",
    "options": [
      "Identify the circuit, select the correct meter function, inspect the leads for damage, and null the instrument",
      "Switch the meter on, connect the leads to the circuit, and record the first reading displayed",
      "Select the insulation resistance setting, check the battery, and touch the probes together",
      "Zero the meter, identify the circuit, and immediately perform the test without checking the leads"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "Rig-safe dead-testing mindset and setup",
    "tags": [
      "application",
      "terminology",
      "resistance-rule"
    ],
    "learningOutcomeId": "204-11A-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "A repeatable routine ensures safety and accuracy; identifying the circuit, choosing the right function, checking lead integrity, and nulling are essential steps."
  },
  {
    "id": 4078,
    "question": "While setting up for a test, you notice the insulation on one of your test probes is slightly nicked, exposing a small amount of copper. What is the correct course of action?",
    "options": [
      "Do not use the leads; remove them from service and obtain a safe replacement",
      "Wrap the nicked area in PVC electrical tape and continue with the dead test",
      "Use them anyway, as dead testing involves no live voltage and is therefore safe",
      "Only use the leads for continuity testing, as high voltage is only used for IR tests"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "CONFUSED_AC_DC_SOURCES",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Rig-safe dead-testing mindset and setup",
    "tags": [
      "health-safety",
      "application",
      "units"
    ],
    "learningOutcomeId": "204-11A-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Damaged test equipment must never be used. Even for dead testing, equipment must be in good condition to ensure reliable results and maintain safety standards."
  },
  {
    "id": 4079,
    "question": "Why is the process of 'nulling' or 'zeroing' test leads considered critical before performing a low-resistance continuity test?",
    "options": [
      "To ensure the resistance of the test leads themselves is not added to the final circuit reading",
      "To calibrate the internal battery of the multi-function tester",
      "To prevent the meter from blowing a fuse when touching the copper conductors",
      "To increase the voltage output of the meter for a more accurate reading"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_I_V_R",
      "2": "OTHER",
      "3": "FORMULA_NOT_REARRANGED"
    },
    "section": "Electrical Installations Technology",
    "category": "Rig-safe dead-testing mindset and setup",
    "tags": [
      "resistance-rule",
      "calculation",
      "conceptual"
    ],
    "learningOutcomeId": "204-11A-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "Test leads have a small amount of resistance (usually 0.05Ω to 0.20Ω). Nulling ensures this resistance is subtracted so the meter only shows the resistance of the circuit being tested."
  },
  {
    "id": 4080,
    "question": "A student decides to use the 'continuity' setting (beeper) to verify the insulation resistance between Live and Earth. Why is this a mistake in a dead-testing mindset?",
    "options": [
      "The continuity setting uses a very low voltage that cannot detect insulation breakdown",
      "The continuity setting is too sensitive and will always show a fault",
      "The beeper only works if the circuit is connected to the mains supply",
      "The insulation resistance must always be measured in Ohms (Ω), not Megaohms (MΩ)"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "CONFUSED_AC_DC_SOURCES",
      "3": "WRONG_UNITS"
    },
    "section": "Electrical Installations Technology",
    "category": "Rig-safe dead-testing mindset and setup",
    "tags": [
      "discrimination",
      "conceptual",
      "units"
    ],
    "learningOutcomeId": "204-11A-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 80,
    "explanation": "Continuity testers use low voltages (approx 4-9V). Insulation Resistance (IR) tests require high voltages (typically 250V or 500V) to stress the insulation and find leaks."
  },
  {
    "id": 4081,
    "question": "Which instrument function should be selected to confirm that the CPC (circuit protective conductor) is correctly connected to the earth terminal of a socket outlet?",
    "options": [
      "Low-resistance ohmmeter (Continuity)",
      "High-resistance ohmmeter (Insulation Resistance)",
      "Digital voltmeter set to AC",
      "Frequency meter"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "CONFUSED_I_V_R",
      "3": "CONFUSED_FREQUENCY_WITH_VOLTAGE"
    },
    "section": "Electrical Installations Technology",
    "category": "Rig-safe dead-testing mindset and setup",
    "tags": [
      "discrimination",
      "resistance-rule",
      "application"
    ],
    "learningOutcomeId": "204-11A-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Checking the connection of a conductor (continuity) requires a low-resistance ohmmeter setting to ensure a good, solid electrical path exists."
  },
  {
    "id": 4082,
    "question": "What is the most likely outcome of rushing the setup and failing to check the meter's battery level before starting a series of dead tests?",
    "options": [
      "The meter may provide inconsistent or wildly inaccurate readings",
      "The circuit under test will become energized by the meter",
      "The test leads will overheat and melt the insulation",
      "The results will be more accurate because the meter is working harder"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "OTHER",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Rig-safe dead-testing mindset and setup",
    "tags": [
      "conceptual",
      "health-safety",
      "application"
    ],
    "learningOutcomeId": "204-11A-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Low battery levels in digital meters often lead to incorrect data processing, resulting in false readings that could hide a fault or suggest one where none exists."
  },
  {
    "id": 4083,
    "question": "When performing a polarity check on a dead circuit, which specific condition are you trying to verify?",
    "options": [
      "That the various switches and fuses are connected in the line conductor only",
      "That the resistance of the neutral conductor is exactly 0.00Ω",
      "That the insulation between Live and Neutral is above 1.0 MΩ",
      "That the circuit is capable of handling the maximum design current"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "ROUNDING_ERROR",
      "2": "WRONG_UNITS",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Rig-safe dead-testing mindset and setup",
    "tags": [
      "discrimination",
      "terminology",
      "conceptual"
    ],
    "learningOutcomeId": "204-11A-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "Polarity testing ensures that all single-pole devices (switches, breakers, fuses) are installed in the line conductor, not the neutral, for safety."
  },
  {
    "id": 4084,
    "question": "In the context of a training rig, why must you remove all lamps and disconnect sensitive electronic equipment before an Insulation Resistance test?",
    "options": [
      "The high test voltage (e.g., 500V) can damage electronic components or give false low readings through lamps",
      "Lamps will blow because the meter provides too much current",
      "Leaving them connected will cause the circuit breaker to trip during the test",
      "The resistance of a lamp is too high for the meter to measure"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "MULTIPLIED_INSTEAD",
      "2": "TOPOLOGY_CONFUSION",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Rig-safe dead-testing mindset and setup",
    "tags": [
      "application",
      "resistance-rule",
      "health-safety"
    ],
    "learningOutcomeId": "204-11A-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "Insulation resistance testing uses high voltages. These can break down sensitive electronics or be 'shunted' through the filaments of lamps, leading to inaccurate results."
  },
  {
    "id": 4085,
    "question": "Which unit of measurement is expected for a 'good' result during a Continuity test compared to an Insulation Resistance test?",
    "options": [
      "Continuity: Low Ohms (Ω); Insulation Resistance: High Megaohms (MΩ)",
      "Continuity: High Megaohms (MΩ); Insulation Resistance: Low Ohms (Ω)",
      "Both tests should result in readings above 2.0 Ohms (Ω)",
      "Continuity: Volts (V); Insulation Resistance: Amps (A)"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "WRONG_UNITS",
      "2": "OTHER",
      "3": "CONFUSED_I_V_R"
    },
    "section": "Electrical Installations Technology",
    "category": "Rig-safe dead-testing mindset and setup",
    "tags": [
      "discrimination",
      "units",
      "terminology"
    ],
    "learningOutcomeId": "204-11A-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Continuity checks for a good connection (very low resistance in Ω), while Insulation Resistance checks for no leaks between conductors (very high resistance in MΩ)."
  },
  {
    "id": 4086,
    "question": "In the context of a training rig, which of the following best describes the 'dead testing' mindset required for safety?",
    "options": [
      "Ensuring the circuit is physically isolated and verified dead before any instrument is connected",
      "Assuming the rig is safe to test because the main isolator handle is in the 'off' position",
      "Checking for the presence of voltage using a multimeter while simultaneously performing a continuity test",
      "Only performing tests on circuits that have had their protective devices (fuses) removed"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "CONFUSED_I_V_R",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "Rig-safe dead-testing mindset and setup",
    "tags": [
      "health-safety",
      "terminology",
      "conceptual"
    ],
    "learningOutcomeId": "204-11A-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Dead testing requires a mindset where the 'dead' state is confirmed through rigorous isolation procedures, not just assumed by looking at a switch."
  },
  {
    "id": 4087,
    "question": "An apprentice needs to check for a potential short circuit or breakdown in insulation between the Line and Neutral conductors on a training rig. Which instrument and setting must be used?",
    "options": [
      "Insulation Resistance tester set to the MΩ range",
      "Continuity tester using the audible 'buzzer' function",
      "Digital multimeter set to the 600V AC Voltage range",
      "Low-resistance ohmmeter set to the 200Ω range"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_I_V_R",
      "3": "WRONG_UNITS"
    },
    "section": "Electrical Installations Technology",
    "category": "Rig-safe dead-testing mindset and setup",
    "tags": [
      "terminology",
      "units",
      "discrimination"
    ],
    "learningOutcomeId": "204-11A-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "Insulation resistance is measured in Megohms (MΩ) to detect very small leakages between conductors; a standard continuity 'buzzer' is not sensitive enough for this safety check."
  },
  {
    "id": 4088,
    "question": "Before performing a low-resistance continuity test on a circuit, a student connects the two test probes together and presses the 'null' or 'zero' button. What is the purpose of this step?",
    "options": [
      "To subtract the resistance of the test leads from the final circuit measurement",
      "To ensure the internal battery of the tester has enough voltage to perform the test",
      "To discharge any capacitive energy stored in the circuit conductors",
      "To reset the meter's fuse after a previous high-current measurement"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "CONFUSED_AC_DC_SOURCES",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Rig-safe dead-testing mindset and setup",
    "tags": [
      "resistance-rule",
      "conceptual",
      "units"
    ],
    "learningOutcomeId": "204-11A-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Nulling the leads ensures that the resistance of the cables belonging to the meter itself does not inflate the reading of the installation's conductors."
  },
  {
    "id": 4089,
    "question": "Which of the following represents the most professional and safe 'before you test' routine for an electrician using a training rig?",
    "options": [
      "Verify isolation, identify the circuit, check leads for damage, select function, null leads",
      "Select function, null leads, perform the test, then verify isolation to be sure",
      "Identify the circuit, perform the test, and then check the leads if the result is higher than expected",
      "Verify isolation, select function, perform the test, and null the leads only if the meter shows an error"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "OTHER",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Rig-safe dead-testing mindset and setup",
    "tags": [
      "health-safety",
      "application",
      "discrimination"
    ],
    "learningOutcomeId": "204-11A-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "A repeatable routine ensures safety (isolation) and accuracy (lead checks and nulling) are addressed before any data is recorded."
  },
  {
    "id": 4090,
    "question": "A student is measuring the continuity of a CPC. They forget to null their test leads, which have a known resistance of 0.35Ω. The meter display shows a total resistance of 1.15Ω. What is the actual resistance of the conductor?",
    "options": [
      "0.80Ω",
      "1.50Ω",
      "1.15Ω",
      "0.35Ω"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_SERIES_RULE",
      "2": "OTHER",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Rig-safe dead-testing mindset and setup",
    "tags": [
      "calculation",
      "resistance-rule",
      "application"
    ],
    "learningOutcomeId": "204-11A-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "The meter displays the sum of the lead resistance and the conductor resistance. To find the conductor resistance, subtract the lead resistance: 1.15Ω - 0.35Ω = 0.80Ω."
  },
  {
    "id": 4091,
    "question": "In the context of a training rig, which statement best defines the 'Dead Testing' mindset required before applying a test instrument?",
    "options": [
      "The circuit is physically disconnected from all sources, verified as de-energised, and the rig is in a controlled state of isolation.",
      "The main switch is turned off, and the student assumes the rig is dead because the power lights are no longer illuminated.",
      "The circuit is tested while the supply is connected to ensure the test instrument can detect potential faults under load.",
      "The test leads are applied to the circuit immediately after switching off to capture any residual capacitive voltage."
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "CONFUSED_AC_DC_SOURCES",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "Rig-safe dead-testing mindset and setup",
    "tags": [
      "terminology",
      "health-safety",
      "conceptual"
    ],
    "learningOutcomeId": "204-11A-LO1",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 120,
    "explanation": "Dead testing requires a verified state of isolation where the circuit is proven de-energised and physically disconnected from sources to ensure both student safety and instrument protection."
  },
  {
    "id": 4092,
    "question": "A student is using a Multi-Function Tester (MFT) to check the continuity of a protective conductor. They select the 'Continuity' setting and hear a beep, but the screen displays 14.5 Ω. Why is relying solely on the 'beep' a failure in setup mindset?",
    "options": [
      "The beep indicates a path exists but does not verify if the resistance is low enough for safety; 14.5 Ω is too high for a standard CPC.",
      "The beep only occurs when the resistance is exactly 0.00 Ω, suggesting the instrument is faulty.",
      "Continuity testers only beep when they detect a voltage, which means the circuit is actually live.",
      "The 'beep' function is reserved for Insulation Resistance tests and should not be used for continuity."
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_I_V_R",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "Rig-safe dead-testing mindset and setup",
    "tags": [
      "continuity-rule",
      "application",
      "terminology"
    ],
    "learningOutcomeId": "204-11A-LO1",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 120,
    "explanation": "Audible indicators (beeps) usually trigger at resistances up to 30-50 Ω. For continuity of a CPC, we need precise low-ohm values; a beep alone might mask a high-resistance joint."
  },
  {
    "id": 4093,
    "question": "While setting up for a low-resistance measurement on a training rig, a student fails to 'null' or 'zero' their test leads. If the lead resistance is 0.28 Ω and the meter reading is 0.52 Ω, what is the actual resistance of the circuit under test?",
    "options": [
      "0.24 Ω",
      "0.80 Ω",
      "0.52 Ω",
      "0.28 Ω"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_SERIES_RULE",
      "2": "OTHER",
      "3": "WRONG_UNITS"
    },
    "section": "Electrical Installations Technology",
    "category": "Rig-safe dead-testing mindset and setup",
    "tags": [
      "calculation",
      "units",
      "application"
    ],
    "learningOutcomeId": "204-11A-LO1",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 120,
    "explanation": "If leads are not nulled, the meter displays the sum of the leads and the circuit. Subtracting lead resistance (0.52 - 0.28) gives the actual circuit resistance of 0.24 Ω."
  },
  {
    "id": 4094,
    "question": "Which of the following describes the most professional repeatable routine to perform immediately before connecting an Insulation Resistance tester to a rig circuit?",
    "options": [
      "Prepare the area, identify the specific circuit, select the IR function, check leads for damage, and set the correct test voltage.",
      "Switch the meter to Continuity, short the probes, check for a beep, and then immediately apply the probes to the live busbar.",
      "Identify the circuit, connect the leads, turn the rig power on to verify the circuit works, then turn it off and press 'Test'.",
      "Select the highest Ω range, connect leads to the Neutral and Earth, and wait for the reading to stabilize before checking the leads."
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "CONFUSED_AC_DC_SOURCES",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "Rig-safe dead-testing mindset and setup",
    "tags": [
      "conceptual",
      "health-safety",
      "application"
    ],
    "learningOutcomeId": "204-11A-LO1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "A repeatable routine ensures no steps are missed. Preparing the area and verifying lead integrity/settings are critical for safety and accuracy before an IR test."
  },
  {
    "id": 4095,
    "question": "A student is performing an Insulation Resistance test between Live and Earth on a training rig. They receive a reading of 0.02 MΩ. Which setup error is the most likely cause for this 'novel' low reading in a training environment?",
    "options": [
      "A load, such as a lamp or indicator neon, has been left connected within the circuit being tested.",
      "The student forgot to null the leads before starting the high-voltage insulation test.",
      "The test leads were crossed, creating a series circuit with the tester's internal battery.",
      "The student selected the 250V range instead of the 500V range, causing the resistance to drop."
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "RECIPROCAL_ERROR",
      "2": "TOPOLOGY_CONFUSION",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Rig-safe dead-testing mindset and setup",
    "tags": [
      "application",
      "conceptual",
      "discrimination"
    ],
    "learningOutcomeId": "204-11A-LO1",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 120,
    "explanation": "Connected loads provide a parallel path for the test current, resulting in a very low IR reading (near 0 MΩ) which is a common setup error on training rigs."
  },
  {
    "id": 4096,
    "question": "When distinguishing between the setup for a Continuity test and an Insulation Resistance (IR) test, which statement is true regarding the instrument's behaviour?",
    "options": [
      "Continuity uses a low voltage to measure low resistance, whereas IR uses a high voltage to measure high resistance.",
      "Continuity uses a high voltage to find breaks in cable, whereas IR uses a low voltage to check for leaks.",
      "Both tests use 500V DC but calculate the resistance differently based on the lead selection.",
      "Continuity measures current in Milliamps (mA), while IR measures current in Kiloamps (kA)."
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_I_V_R",
      "2": "WRONG_UNITS",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "Rig-safe dead-testing mindset and setup",
    "tags": [
      "discrimination",
      "terminology",
      "conceptual"
    ],
    "learningOutcomeId": "204-11A-LO1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "Continuity tests check for low-resistance paths using low voltage (safety), while IR tests check for high-resistance insulation integrity using high voltage (stressing the insulation)."
  },
  {
    "id": 4097,
    "question": "Why is 'assuming' a rig is dead based on a previous student's work considered a critical safety violation in a workshop environment?",
    "options": [
      "The isolation state may have changed, and 'dead' must always be confirmed by your own setup and verification.",
      "The previous student might have used a different meter which requires a different type of grounding.",
      "Training rigs automatically re-energise every 30 minutes for safety synchronization.",
      "Assumed dead states cause the test instrument to recalibrate its zero point incorrectly."
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "TOPOLOGY_CONFUSION",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "Rig-safe dead-testing mindset and setup",
    "tags": [
      "conceptual",
      "health-safety",
      "discrimination"
    ],
    "learningOutcomeId": "204-11A-LO1",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 120,
    "explanation": "Safety in testing is based on personal verification. You cannot rely on the 'assumed' state of a rig because another person could have altered the isolation."
  },
  {
    "id": 4098,
    "question": "During a routine lead check before testing, a student notices the insulation on the probe is slightly nicked, exposing a tiny amount of copper. What is the correct 'rig-safe' action?",
    "options": [
      "Discard the leads immediately and obtain a known-good, undamaged set before proceeding.",
      "Wrap the nicked area in electrical tape and continue with the dead test as the voltage is low.",
      "Use the leads anyway, but ensure you do not touch the exposed copper during the test.",
      "Perform the test and subtract 0.5 ohms from the final result to compensate for the damage."
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "FORMULA_NOT_REARRANGED",
      "3": "ROUNDING_ERROR"
    },
    "section": "Electrical Installations Technology",
    "category": "Rig-safe dead-testing mindset and setup",
    "tags": [
      "health-safety",
      "application",
      "terminology"
    ],
    "learningOutcomeId": "204-11A-LO1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "Damaged test leads are a safety hazard and can cause unreliable readings. They must be replaced with a verified safe set before any testing occurs."
  },
  {
    "id": 4099,
    "question": "A student needs to verify that the Line and Neutral conductors are not short-circuited together on a new rig installation. Which instrument setup is required?",
    "options": [
      "Insulation Resistance tester set to 500V DC, probes connected between Line and Neutral.",
      "Continuity tester set to Ω, probes connected between Line and Earth busbar.",
      "Voltage tester set to AC, probes connected between Line and Neutral with the power on.",
      "A clamp meter set to Amps, placed around both Line and Neutral conductors simultaneously."
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_AC_DC_SOURCES",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Rig-safe dead-testing mindset and setup",
    "tags": [
      "discrimination",
      "application",
      "units"
    ],
    "learningOutcomeId": "204-11A-LO1",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 120,
    "explanation": "To check for short circuits between conductors (insulation integrity), an IR tester is used between those conductors while the circuit is dead."
  },
  {
    "id": 4100,
    "question": "Synthesis: Which combination of factors results in the most reliable dead-test reading on a training rig?",
    "options": [
      "Verified isolation, inspected leads, nulled instrument, and correct function selection.",
      "Correct function selection, high-quality leads, and testing while the rig is energized.",
      "Nulled instrument, the 'beep' function enabled, and assuming the circuit is isolated.",
      "Fast testing routine, using a multimeter on the auto-range setting, and ignoring lead resistance."
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "Rig-safe dead-testing mindset and setup",
    "tags": [
      "conceptual",
      "health-safety",
      "application"
    ],
    "learningOutcomeId": "204-11A-LO1",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 120,
    "explanation": "Reliability comes from a combination of confirmed safety (isolation), equipment integrity (leads), precision (nulling), and procedural correctness (function)."
  }
];
