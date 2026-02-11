import { TaggedQuestion } from './types';

/**
 * Initial Verification Overview + Safe Isolation Question Bank
 * Aligned with lesson 204-15A learning outcomes
 * Generated: 2026-02-11
 */

export const initialVerificationOverviewSafeIsolationQuestions: TaggedQuestion[] = [
  {
    "id": 4016,
    "question": "What is the primary purpose of carrying out 'Initial Verification' on a new electrical installation?",
    "options": [
      "To confirm the installation is safe and meets the requirements of BS 7671",
      "To calculate the monthly electricity bill for the customer",
      "To check if the electricity supplier is providing the correct frequency",
      "To ensure the customer has paid for all the materials used"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_FREQUENCY_WITH_VOLTAGE",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Initial Verification Overview",
    "tags": [
      "terminology",
      "explanation",
      "legislation"
    ],
    "learningOutcomeId": "204-15A-LO5",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Initial Verification is the process of inspecting and testing a new installation (or alteration) to ensure it is safe for service and complies with the Wiring Regulations (BS 7671)."
  },
  {
    "id": 4017,
    "question": "According to the safe isolation procedure, what is the very first step an electrician should take before working on a circuit?",
    "options": [
      "Identify the circuit to be worked on and seek permission to isolate",
      "Test for the continuity of the protective conductors",
      "Carry out a global insulation resistance test",
      "Remove the main fuse from the service head"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "OTHER",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Safe Isolation",
    "tags": [
      "health-safety",
      "conceptual",
      "terminology"
    ],
    "learningOutcomeId": "204-15A-LO6",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Before any physical isolation occurs, you must correctly identify the circuit and obtain permission from the user/client to turn the power off."
  },
  {
    "id": 4018,
    "question": "Which of the following is a mandatory 'dead test' performed during the initial verification sequence?",
    "options": [
      "Continuity of protective conductors",
      "Earth fault loop impedance (Zs)",
      "Prospective fault current (Ipf)",
      "RCD effectiveness (trip time)"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_AC_DC_SOURCES",
      "2": "CONFUSED_AC_DC_SOURCES",
      "3": "CONFUSED_AC_DC_SOURCES"
    },
    "section": "Electrical Installations Technology",
    "category": "Initial Verification Overview",
    "tags": [
      "discrimination",
      "terminology"
    ],
    "learningOutcomeId": "204-15A-LO6",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Continuity of protective conductors is a dead test. Zs, Ipf, and RCD testing are live tests conducted after the installation is energized."
  },
  {
    "id": 4019,
    "question": "An electrician is about to start testing but notices a socket outlet is physically cracked and the internal brass parts are visible. What is the correct action?",
    "options": [
      "Stop the process and replace the damaged item before testing",
      "Continue with the insulation resistance test to see if it fails",
      "Ignore the damage as it will be caught during the live tests",
      "Apply electrical tape over the crack and proceed with the sequence"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "OTHER",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Initial Verification Overview",
    "tags": [
      "application",
      "health-safety"
    ],
    "learningOutcomeId": "204-15A-LO5",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Obvious defects found during the initial inspection (the 'stop-and-fix' stage) must be rectified before electrical testing begins to ensure safety."
  },
  {
    "id": 4020,
    "question": "What is the correct equipment to use when 'proving' a circuit is dead for safe isolation?",
    "options": [
      "An approved voltage indicator and a proving unit",
      "A digital multimeter set to the AC voltage range",
      "A non-contact voltage detector (voltage stick)",
      "A clamp meter set to measure current"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_I_V_R",
      "2": "OTHER",
      "3": "CONFUSED_I_V_R"
    },
    "section": "Electrical Installations Technology",
    "category": "Safe Isolation",
    "tags": [
      "discrimination",
      "health-safety"
    ],
    "learningOutcomeId": "204-15A-LO6",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Safe isolation requires an GS38 approved voltage indicator and a matching proving unit. Multimeters and voltage sticks are not recommended for proving dead due to reliability issues."
  },
  {
    "id": 4021,
    "question": "In the standard sequence of dead testing, at what stage should the 'Inspection' occur?",
    "options": [
      "Before any electrical testing takes place",
      "After the insulation resistance test is finished",
      "Only after the circuit has been energized",
      "Between the continuity test and the polarity test"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "OTHER",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "Initial Verification Overview",
    "tags": [
      "conceptual",
      "terminology"
    ],
    "learningOutcomeId": "204-15A-LO5",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Inspection is always the first part of Initial Verification. You must look for visible defects before applying any test voltages or currents."
  },
  {
    "id": 4022,
    "question": "Why is it critical to lock off a circuit breaker and keep the key on your person during safe isolation?",
    "options": [
      "To prevent someone else from accidentally re-energizing the circuit while you work",
      "To ensure the circuit breaker does not trip due to a thermal fault",
      "To prove to the customer that you have the correct tools for the job",
      "To comply with the electricity supplier's billing requirements"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "OTHER",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "Safe Isolation",
    "tags": [
      "conceptual",
      "health-safety"
    ],
    "learningOutcomeId": "204-15A-LO6",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Locking off and retaining the key ensures that only the person working on the circuit can restore power, preventing accidental electrocution."
  },
  {
    "id": 4023,
    "question": "Which document is used to record the results of the initial verification for a brand new domestic installation?",
    "options": [
      "Electrical Installation Certificate (EIC)",
      "Minor Electrical Installation Works Certificate (MEIWC)",
      "Electrical Installation Condition Report (EICR)",
      "Portable Appliance Testing (PAT) Register"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Initial Verification Overview",
    "tags": [
      "discrimination",
      "legislation"
    ],
    "learningOutcomeId": "204-15A-LO6",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "An EIC is issued for new installations, whereas an EICR is for periodic inspections of existing ones and an MEIWC is for small changes like adding a single socket."
  },
  {
    "id": 4024,
    "question": "When performing safe isolation, what is the correct sequence for using the voltage indicator?",
    "options": [
      "Test indicator on proving unit, test circuit, re-test indicator on proving unit",
      "Test circuit, test indicator on proving unit, re-test circuit",
      "Test indicator on proving unit, test circuit, lock the circuit breaker",
      "Test circuit, lock the circuit breaker, test indicator on proving unit"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "TOPOLOGY_CONFUSION",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Safe Isolation",
    "tags": [
      "application",
      "health-safety"
    ],
    "learningOutcomeId": "204-15A-LO6",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "The 'sandwich' method ensures the indicator is working before the test, and proves it is still working after the test, confirming the 'dead' reading was accurate."
  },
  {
    "id": 4025,
    "question": "What does the term 'Dead Testing' refer to in the context of Initial Verification?",
    "options": [
      "Tests carried out while the electrical supply is completely disconnected",
      "Tests carried out on circuits that have failed and are 'dead'",
      "Tests carried out using a battery-powered drill",
      "Tests carried out only on the earthing conductor"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "OTHER",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "Initial Verification Overview",
    "tags": [
      "conceptual",
      "terminology"
    ],
    "learningOutcomeId": "204-15A-LO5",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Dead testing refers to the group of tests (Continuity, Insulation Resistance, Polarity) performed while the installation is safely isolated from the mains supply."
  },
  {
    "id": 4026,
    "question": "What is the primary purpose of carrying out an 'Initial Verification' on a new electrical installation?",
    "options": [
      "To confirm the installation is safe for use and complies with BS 7671",
      "To ensure the electricity supplier can bill the customer correctly",
      "To repair any faults while the installation is fully energised",
      "To check if the customer likes the positions of the sockets"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_AC_DC_SOURCES",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Initial Verification Overview",
    "tags": [
      "legislation",
      "explanation",
      "conceptual"
    ],
    "learningOutcomeId": "204-15A-LO5",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Initial verification is performed to ensure that the installation is safe, high quality, and meets the requirements of the Wiring Regulations (BS 7671)."
  },
  {
    "id": 4027,
    "question": "According to the safe isolation procedure, what must be done immediately after turning off the main switch and locking it?",
    "options": [
      "Verify the circuit is dead using a confirmed working voltage indicator",
      "Begin the continuity of protective conductors (CPC) test",
      "Turn on all the circuit breakers to check for any lights",
      "Fill out the Electrical Installation Certificate immediately"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "OTHER",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "Safe Isolation",
    "tags": [
      "health-safety",
      "discrimination",
      "terminology"
    ],
    "learningOutcomeId": "204-15A-LO5",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "After isolation and locking off, you must 'prove dead' using a voltage indicator and a proving unit before touching any parts of the installation."
  },
  {
    "id": 4028,
    "question": "In the standard sequence of dead testing for a new installation, which test is typically carried out first?",
    "options": [
      "Continuity of protective conductors",
      "Insulation resistance",
      "Polarity (Live testing)",
      "Earth fault loop impedance"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_AC_DC_SOURCES",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Dead Testing Rules",
    "tags": [
      "discrimination",
      "calculation",
      "terminology"
    ],
    "learningOutcomeId": "204-15A-LO6",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "Continuity of protective conductors is the first test in the sequence to ensure the earthing path is intact before other tests are performed."
  },
  {
    "id": 4029,
    "question": "An electrician is about to begin dead testing but notices that a socket outlet has a visible crack in the faceplate. What is the correct action to take?",
    "options": [
      "Stop and replace the damaged component before proceeding",
      "Carry out the tests and make a note of the crack at the end",
      "Ignore it as dead testing does not involve high voltages",
      "Wrap the socket in insulation tape and continue testing"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "HEALTH_SAFETY_ERROR"
    },
    "section": "Electrical Installations Technology",
    "category": "Initial Verification Overview",
    "tags": [
      "application",
      "health-safety",
      "conceptual"
    ],
    "learningOutcomeId": "204-15A-LO5",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "If obvious damage or unsafe conditions are found during the initial inspection phase, you must stop and fix the issue before proceeding to electrical testing."
  },
  {
    "id": 4030,
    "question": "Why is it essential to use a 'proving unit' when performing the safe isolation procedure?",
    "options": [
      "To check that the voltage indicator is working correctly before and after use",
      "To provide a temporary power supply to the circuit being tested",
      "To measure the resistance of the main earthing conductor",
      "To recharge the batteries inside the digital multimeter"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_AC_DC_SOURCES",
      "2": "CONFUSED_I_V_R",
      "3": "WRONG_UNITS"
    },
    "section": "Electrical Installations Technology",
    "category": "Safe Isolation",
    "tags": [
      "conceptual",
      "health-safety",
      "terminology"
    ],
    "learningOutcomeId": "204-15A-LO5",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "A proving unit is used to verify that the voltage indicator actually works. If the indicator fails silently, you might wrongly assume a live circuit is dead."
  },
  {
    "id": 4031,
    "question": "When performing safe isolation, what is the correct sequence for using a voltage indicator and a proving unit?",
    "options": [
      "Test indicator on proving unit, test for dead at source, re-test indicator on proving unit",
      "Test for dead at source, test indicator on proving unit, re-test indicator on proving unit",
      "Test indicator on proving unit, test for dead at source, proceed to work",
      "Test for dead at source, verify with a non-contact voltage pen, then lock off"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "OTHER",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "Initial Verification Overview + Safe Isolation",
    "tags": [
      "health-safety",
      "application",
      "terminology"
    ],
    "learningOutcomeId": "204-15A-LO5",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "To ensure the voltage indicator is working correctly, it must be verified against a known source (proving unit) both before and after checking the circuit is dead."
  },
  {
    "id": 4032,
    "question": "Which of the following is the primary purpose of carrying out the 'Initial Verification' of a new electrical installation?",
    "options": [
      "To confirm the installation is safe for service and complies with BS 7671",
      "To ensure the electricity supplier can connect the meter correctly",
      "To determine the maximum energy efficiency of the connected loads",
      "To provide a quote for future maintenance work required on the site"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "OTHER",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Initial Verification Overview + Safe Isolation",
    "tags": [
      "explanation",
      "conceptual",
      "legislation"
    ],
    "learningOutcomeId": "204-15A-LO5",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "Initial verification is the process of inspection and testing to ensure the installation is safe and meets the requirements of the Wiring Regulations (BS 7671)."
  },
  {
    "id": 4033,
    "question": "During the inspection phase of initial verification, an electrician notices a large crack in the casing of the main consumer unit. What is the correct course of action?",
    "options": [
      "Stop the process and report the defect for repair before any testing begins",
      "Proceed with dead testing and record the damage on the final certificate",
      "Cover the crack with insulating tape and continue with the test sequence",
      "Complete the insulation resistance test first to see if the crack affects the readings"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "OTHER",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Initial Verification Overview + Safe Isolation",
    "tags": [
      "application",
      "health-safety",
      "conceptual"
    ],
    "learningOutcomeId": "204-15A-LO5",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "If a 'stop-and-fix' situation is identified, such as damage that compromises safety or the integrity of the installation, it must be rectified before testing starts."
  },
  {
    "id": 4034,
    "question": "According to the standard sequence of dead tests, which test must be performed immediately after the continuity of protective conductors?",
    "options": [
      "Continuity of ring final circuit conductors",
      "Insulation resistance",
      "Polarity",
      "Earth fault loop impedance"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "OTHER",
      "3": "CONFUSED_AC_DC_SOURCES"
    },
    "section": "Electrical Installations Technology",
    "category": "Initial Verification Overview + Safe Isolation",
    "tags": [
      "calculation",
      "conceptual",
      "application"
    ],
    "learningOutcomeId": "204-15A-LO6",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 60,
    "explanation": "The standard sequence starts with continuity of protective conductors, followed specifically by ring final circuit continuity (if applicable) before moving to insulation resistance."
  },
  {
    "id": 4035,
    "question": "When isolating a circuit for dead testing, what must be done with the key to the unique locking device?",
    "options": [
      "It must be kept on the person carrying out the work at all times",
      "It should be left in the lock to show which circuit is isolated",
      "It should be given to the site manager for safekeeping",
      "It must be taped to the side of the distribution board"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "OTHER",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Initial Verification Overview + Safe Isolation",
    "tags": [
      "health-safety",
      "application",
      "terminology"
    ],
    "learningOutcomeId": "204-15A-LO5",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "To prevent accidental re-energisation by another person, the person working on the circuit must maintain exclusive control of the key."
  },
  {
    "id": 4036,
    "question": "Which piece of equipment is specifically required by GS38 for the purpose of proving an installation is dead?",
    "options": [
      "A two-pole voltage indicator",
      "A digital multimeter set to AC Volts",
      "A non-contact voltage detector pen",
      "A neon-indicator screwdriver"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "Initial Verification Overview + Safe Isolation",
    "tags": [
      "discrimination",
      "health-safety",
      "units"
    ],
    "learningOutcomeId": "204-15A-LO5",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "GS38 requires the use of a proper two-pole voltage indicator. Multimeters and non-contact pens are not recommended for proving dead due to various failure modes."
  },
  {
    "id": 4037,
    "question": "What is the main reason for following a specific sequence of tests during dead testing?",
    "options": [
      "To ensure safety and prevent damage to the installation or test equipment",
      "To allow the electrician to finish the work faster",
      "Because the test instruments only work in that specific order",
      "To ensure the battery life of the multi-function tester is preserved"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Initial Verification Overview + Safe Isolation",
    "tags": [
      "conceptual",
      "explanation",
      "health-safety"
    ],
    "learningOutcomeId": "204-15A-LO6",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "The sequence is designed so that basic safety (like earthing continuity) is verified before performing tests that could be hazardous or misleading if the earthing is missing."
  },
  {
    "id": 4038,
    "question": "An electrician is about to start dead testing on a circuit. They have isolated the circuit and locked it off. What is the very next step they must take?",
    "options": [
      "Verify the circuit is dead using a proven voltage indicator",
      "Begin the continuity of protective conductors test",
      "Disconnect all sensitive electronic equipment",
      "Fill out the circuit details on the schedule of test results"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "OTHER",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Initial Verification Overview + Safe Isolation",
    "tags": [
      "application",
      "health-safety",
      "conceptual"
    ],
    "learningOutcomeId": "204-15A-LO5",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "Isolation is not complete until the circuit has been 'proven dead' with a voltage indicator. You cannot assume the lock-off was successful without verifying."
  },
  {
    "id": 4039,
    "question": "Which of the following would be classified as a 'dead test' during the initial verification process?",
    "options": [
      "Insulation Resistance",
      "Earth Fault Loop Impedance (Zs)",
      "Prospective Short Circuit Current (Ipf)",
      "RCD Trip Time test"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_AC_DC_SOURCES",
      "2": "CONFUSED_AC_DC_SOURCES",
      "3": "CONFUSED_AC_DC_SOURCES"
    },
    "section": "Electrical Installations Technology",
    "category": "Initial Verification Overview + Safe Isolation",
    "tags": [
      "discrimination",
      "terminology",
      "conceptual"
    ],
    "learningOutcomeId": "204-15A-LO6",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "Insulation resistance is performed with the power disconnected (dead). Zs, Ipf, and RCD tests all require the installation to be energized (live)."
  },
  {
    "id": 4040,
    "question": "Why is it necessary to record the results of dead testing on a formal Schedule of Test Results?",
    "options": [
      "To provide a baseline for comparison during future periodic inspections",
      "To prove to the customer that the electrician has a calibrated meter",
      "To calculate the total cost of the materials used in the installation",
      "To satisfy the requirements of the local water authority"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "OTHER",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Initial Verification Overview + Safe Isolation",
    "tags": [
      "conceptual",
      "legislation",
      "terminology"
    ],
    "learningOutcomeId": "204-15A-LO6",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Recorded results allow future inspectors to see if the installation's condition has degraded over time compared to its original 'as-new' state."
  },
  {
    "id": 4041,
    "question": "What is the primary purpose of using a proving unit during the safe isolation procedure?",
    "options": [
      "To verify that the voltage indicator is functioning correctly both before and after checking the circuit",
      "To provide a temporary power source to the circuit being tested",
      "To measure the exact potential difference between the line and neutral conductors",
      "To calibrate the insulation resistance tester before starting dead tests"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_I_V_R",
      "3": "CONFUSED_TRANSFORMER_WITH_AC_DC"
    },
    "section": "Electrical Installations Technology",
    "category": "Safe Isolation",
    "tags": [
      "health-safety",
      "application",
      "terminology"
    ],
    "learningOutcomeId": "204-15A-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "A proving unit is used to ensure the voltage indicator is working correctly before testing for dead, and again after testing to confirm the indicator hasn't failed during the process (Prove-Test-Prove)."
  },
  {
    "id": 4042,
    "question": "In the standard sequence of Initial Verification, when should the formal inspection of the installation be carried out?",
    "options": [
      "Before any electrical testing begins",
      "Immediately after the continuity of CPC test is completed",
      "Only after the installation has been energized and functional tests are done",
      "Between the insulation resistance test and the polarity test"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "OTHER",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "Initial Verification Overview",
    "tags": [
      "conceptual",
      "legislation"
    ],
    "learningOutcomeId": "204-15A-LO5",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "Inspection must always precede testing to identify any obvious defects, damage, or safety issues that could make testing dangerous or inaccurate."
  },
  {
    "id": 4043,
    "question": "An electrician has identified the correct circuit breaker, switched it off, and applied a padlock. What is the next step in the safe isolation procedure?",
    "options": [
      "Test the circuit with a voltage indicator to prove it is dead",
      "Begin the continuity of protective conductors test",
      "Issue an Electrical Installation Certificate to the client",
      "Remove the neutral conductor from the busbar to ensure total isolation"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "OTHER",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "Safe Isolation",
    "tags": [
      "application",
      "health-safety"
    ],
    "learningOutcomeId": "204-15A-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "After locking off, you must 'prove dead' using a suitable voltage indicator to confirm the correct circuit was isolated and that no voltage is present."
  },
  {
    "id": 4044,
    "question": "Which of the following is a primary objective of 'Initial Verification' for a new electrical installation?",
    "options": [
      "To confirm the installation is safe and meets the design intent before being put into service",
      "To determine the maximum load the installation can handle before the main fuse blows",
      "To ensure the customer is being billed correctly by the energy supplier",
      "To check if the installation requires a Periodic Inspection Report immediately"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "OTHER",
      "3": "CONFUSED_I_V_R"
    },
    "section": "Electrical Installations Technology",
    "category": "Initial Verification Overview",
    "tags": [
      "conceptual",
      "legislation"
    ],
    "learningOutcomeId": "204-15A-LO5",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Initial verification ensures the installation is safe for use and complies with BS 7671 before it is energized."
  },
  {
    "id": 4045,
    "question": "During the dead testing phase, what is the correct order for the first three tests in the sequence?",
    "options": [
      "Continuity of CPC, Ring Final Circuit Continuity, Insulation Resistance",
      "Insulation Resistance, Polarity, Continuity of CPC",
      "Polarity, Continuity of CPC, Ring Final Circuit Continuity",
      "Continuity of CPC, Polarity, Insulation Resistance"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "OTHER",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "Initial Verification Overview",
    "tags": [
      "discrimination",
      "calculation"
    ],
    "learningOutcomeId": "204-15A-LO6",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "The sequence is designed so that basic safety (earthing) is confirmed first. Continuity of CPC is followed by Ring Final Continuity, then Insulation Resistance."
  },
  {
    "id": 4046,
    "question": "While inspecting a new installation, an electrician discovers a loose connection on a main earthing terminal. What is the correct course of action?",
    "options": [
      "Stop the process and tighten the connection before proceeding to testing",
      "Complete all dead tests first and record the loose connection as a fault later",
      "Ignore it, as the continuity test will likely still show a low resistance",
      "Apply electrical tape around the terminal to secure the wire temporarily"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "SIGN_ERROR"
    },
    "section": "Electrical Installations Technology",
    "category": "Initial Verification Overview",
    "tags": [
      "application",
      "health-safety"
    ],
    "learningOutcomeId": "204-15A-LO5",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 60,
    "explanation": "This is a 'stop-and-fix' situation. Obvious safety defects found during inspection must be corrected before testing begins to ensure safety and accurate results."
  },
  {
    "id": 4047,
    "question": "Why is it mandatory to use a physical 'lock-out' device rather than just turning off the switch during safe isolation?",
    "options": [
      "To prevent accidental re-energisation by another person while work is in progress",
      "To ensure the switch mechanism does not spring back into the ON position",
      "Because the lock-out device contains a sensor that detects if current starts flowing",
      "To comply with the manufacturer's warranty requirements for the consumer unit"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "Safe Isolation",
    "tags": [
      "conceptual",
      "health-safety"
    ],
    "learningOutcomeId": "204-15A-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "Locking off provides a physical barrier and clear warning (caution notice) to prevent anyone else from turning the power back on while the electrician is working."
  },
  {
    "id": 4048,
    "question": "Which document is specifically required to record the results of the initial verification of a brand new installation?",
    "options": [
      "Electrical Installation Certificate (EIC)",
      "Electrical Installation Condition Report (EICR)",
      "Minor Electrical Installation Works Certificate (MEIWC)",
      "Schedule of Periodic Inspections"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "OTHER",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "Initial Verification Overview",
    "tags": [
      "discrimination",
      "terminology"
    ],
    "learningOutcomeId": "204-15A-LO6",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "An EIC is used for new installations, whereas an EICR is for existing installations (periodic inspection)."
  },
  {
    "id": 4049,
    "question": "When following the 'Prove-Test-Prove' method, what does the final 'Prove' step involve?",
    "options": [
      "Re-checking the voltage indicator against the proving unit to ensure it is still working",
      "Proving to the client that the circuit is now safe to use",
      "Testing the circuit again with a different multimeter to confirm the zero reading",
      "Using a screwdriver to short the terminals to see if a spark occurs"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "Safe Isolation",
    "tags": [
      "application",
      "health-safety"
    ],
    "learningOutcomeId": "204-15A-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "The final prove step confirms the indicator did not fail during the actual test, ensuring the 'zero' reading was genuine and not due to a broken tester."
  },
  {
    "id": 4050,
    "question": "Why is it standard practice to perform dead testing before any live testing during Initial Verification?",
    "options": [
      "It minimizes the risk of electric shock and prevents damage to the system from existing faults",
      "Dead testing is the only way to measure the external earth fault loop impedance (Ze)",
      "Instruments used for dead testing do not require annual calibration",
      "Dead testing is faster because the electrician does not need to wear any PPE"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "CONFUSED_AC_DC_SOURCES"
    },
    "section": "Electrical Installations Technology",
    "category": "Initial Verification Overview",
    "tags": [
      "conceptual",
      "health-safety"
    ],
    "learningOutcomeId": "204-15A-LO6",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Testing while dead is safer and allows faults like short circuits to be found without causing dangerous arcs or blowing fuses."
  },
  {
    "id": 4051,
    "question": "Which of the following describes the correct procedure for using a voltage indicator to prove a circuit is dead during safe isolation?",
    "options": [
      "Check the indicator against a known source, test the circuit, then re-check the indicator against the known source",
      "Test the circuit for voltage, then check the indicator against a known source to see if it works",
      "Check the indicator against a known source, then test the circuit to confirm it is dead",
      "Test the circuit with a multi-meter set to the highest AC voltage range"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "OTHER",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "Safe Isolation",
    "tags": [
      "health-safety",
      "application",
      "terminology"
    ],
    "learningOutcomeId": "204-15A-LO5",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "To ensure the safety of the person working on the circuit, the voltage indicator must be proved against a known source (like a proving unit) both before and after testing the circuit to ensure the indicator did not fail during the test."
  },
  {
    "id": 4052,
    "question": "What is the primary purpose of the 'Initial Verification' process for a new electrical installation?",
    "options": [
      "To confirm that the installation is safe and complies with BS 7671 before it is put into service",
      "To provide a warranty for the electrical components installed by the contractor",
      "To ensure that the electricity supplier is billing the customer for the correct amount of energy",
      "To perform live functional tests to see if the protective devices trip under fault conditions"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Initial Verification Overview",
    "tags": [
      "conceptual",
      "legislation",
      "terminology"
    ],
    "learningOutcomeId": "204-15A-LO5",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Initial verification is a legal and safety requirement to ensure that a new installation is safe for use and meets the standards of BS 7671 before power is permanently applied."
  },
  {
    "id": 4053,
    "question": "According to the standard sequence of dead tests, which test must be carried out immediately after the visual inspection and before insulation resistance?",
    "options": [
      "Continuity of protective conductors (including main and supplementary bonding)",
      "Polarity (dead test)",
      "Functional testing of all switchgear and RCDs",
      "Verification of voltage drop across the furthest point"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "OTHER",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "Initial Verification Overview",
    "tags": [
      "discrimination",
      "calculation",
      "terminology"
    ],
    "learningOutcomeId": "204-15A-LO6",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "The continuity of protective conductors (CPC) is the first dead test in the sequence to ensure that the earth path is intact before performing other tests like insulation resistance."
  },
  {
    "id": 4054,
    "question": "While performing an initial inspection on a domestic consumer unit, an electrician identifies that a circuit breaker is incorrectly rated for the cable it is protecting. What is the correct procedure?",
    "options": [
      "Stop the process, report the defect, and rectify the issue before proceeding with dead testing",
      "Continue with the dead tests and note the incorrect rating on the final certificate",
      "Ignore the rating issue as it will be picked up during the live functional tests",
      "Complete all dead tests first, then change the circuit breaker before energising"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "OTHER",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Initial Verification Overview",
    "tags": [
      "application",
      "health-safety",
      "discrimination"
    ],
    "learningOutcomeId": "204-15A-LO5",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "If a safety-critical defect is found during inspection (like a 'stop-and-fix' trigger), it must be reported and rectified before the testing sequence continues to ensure the installation is safe to test."
  },
  {
    "id": 4055,
    "question": "Which of these items is essential for a safe isolation procedure to prevent the accidental re-energisation of a circuit?",
    "options": [
      "A unique lock and a 'Caution: Work in Progress' warning notice",
      "A roll of PVC insulation tape to cover the circuit breaker toggle",
      "A digital multimeter set to the continuity range to monitor the busbar",
      "A temporary link placed between the line and neutral terminals"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Safe Isolation",
    "tags": [
      "conceptual",
      "health-safety",
      "application"
    ],
    "learningOutcomeId": "204-15A-LO5",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Safe isolation requires a physical lock (to which the electrician holds the only key) and a warning sign to ensure no one else can turn the power back on while work is being carried out."
  },
  {
    "id": 4056,
    "question": "During the safe isolation procedure, an electrician uses a proving unit to check their two-pole voltage indicator before testing a circuit. After finding the circuit is dead, what is the mandatory next step to comply with the 'prove-dead' rule?",
    "options": [
      "Re-test the voltage indicator against the proving unit to ensure it is still functioning correctly",
      "Proceed immediately to the continuity of protective conductors test",
      "Lock the circuit breaker in the 'off' position and keep the key on their person",
      "Sign the Electrical Installation Certificate to confirm the circuit is isolated"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Safe Isolation",
    "tags": [
      "health-safety",
      "application",
      "legislation"
    ],
    "learningOutcomeId": "204-15A-LO1",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 120,
    "explanation": "The 'test-lamp-test' or 'prove-dead' procedure requires the voltage indicator to be verified against a known source both before AND after checking the circuit to ensure the instrument didn't fail during the measurement."
  },
  {
    "id": 4057,
    "question": "In the prescribed sequence of dead testing for a new domestic installation, why must the 'Continuity of Protective Conductors' test be performed before the 'Insulation Resistance' test?",
    "options": [
      "To ensure a continuous path to earth exists so that the insulation test is valid and safe",
      "Because insulation resistance testers require a confirmed earth to power the internal battery",
      "To prevent the high voltage of the insulation tester from damaging the circuit breakers",
      "Because the continuity test identifies if the main switch is in the 'on' or 'off' position"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_I_V_R",
      "2": "FORMULA_NOT_REARRANGED",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "Initial Verification Overview",
    "tags": [
      "conceptual",
      "resistance-rule",
      "calculation"
    ],
    "learningOutcomeId": "204-15A-LO6",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 120,
    "explanation": "Confirming the continuity of the CPC ensures that there is a reliable path to earth. Without this, an insulation resistance test might give a false 'pass' because the leakage path to earth is broken."
  },
  {
    "id": 4058,
    "question": "An electrician is preparing to conduct an initial verification on a complex industrial distribution board. After isolating the main incomer, they notice a secondary 'UPS' (Uninterruptible Power Supply) feed entering the board. What action must be taken to ensure safe isolation?",
    "options": [
      "Identify and isolate all sources of supply, including the UPS, and prove dead at the board",
      "Isolate only the main incomer as the UPS is considered a secondary safety system",
      "Proceed with testing but use insulated gloves to handle the UPS terminals",
      "Assume the UPS is automatically disconnected when the main supply is cut"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_AC_DC_SOURCES",
      "2": "TOPOLOGY_CONFUSION",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Safe Isolation",
    "tags": [
      "application",
      "health-safety",
      "ac-dc"
    ],
    "learningOutcomeId": "204-15A-LO1",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 120,
    "explanation": "Safe isolation requires the identification and isolation of ALL sources of supply. A UPS can back-feed a board even if the main grid supply is isolated."
  },
  {
    "id": 4059,
    "question": "Which of the following scenarios constitutes a 'stop-and-fix' trigger during the inspection phase of initial verification, before any dead testing begins?",
    "options": [
      "The discovery of a significant hole in a fire-rated barrier where cables pass through",
      "Finding that the circuit labels are written in pencil rather than permanent ink",
      "Noticing that the consumer unit is mounted 50mm higher than the recommended height",
      "Observing that the CPC is sleeved in green-and-yellow rather than solid green"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "OTHER",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "Initial Verification Overview",
    "tags": [
      "discrimination",
      "health-safety",
      "legislation"
    ],
    "learningOutcomeId": "204-15A-LO5",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "A breach in fire-rated barriers is a fundamental safety defect. Inspection must be completed first, and serious defects that compromise safety must be rectified before proceeding to electrical testing."
  },
  {
    "id": 4060,
    "question": "When selecting a voltage detector for safe isolation, which GS38 requirement is critical for ensuring the user is not exposed to live parts if a fault occurs within the instrument?",
    "options": [
      "The leads must be equipped with high-rupturing capacity (HRC) fuses",
      "The display must be digital rather than an analogue moving-coil meter",
      "The instrument must be capable of measuring both AC and DC voltages",
      "The probes must have at least 15mm of exposed metal at the tips"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_I_V_R",
      "2": "WRONG_UNITS",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Safe Isolation",
    "tags": [
      "discrimination",
      "health-safety",
      "units"
    ],
    "learningOutcomeId": "204-15A-LO1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "GS38 requires test leads to be fused (or current-limited) to protect the user from arcing or explosion if the probes are shorted across a high-energy source."
  },
  {
    "id": 4061,
    "question": "Which statement best describes the relationship between 'Initial Verification' and 'Dead Testing' in the context of a new electrical installation?",
    "options": [
      "Initial verification includes both visual inspection and a specific sequence of dead tests before the supply is connected",
      "Dead testing is the only requirement for initial verification as live testing is for periodic reports",
      "Initial verification is performed only after the circuit has been energized for 24 hours",
      "Dead testing is an optional part of initial verification used only when faults are suspected"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "TOPOLOGY_CONFUSION",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Initial Verification Overview",
    "tags": [
      "conceptual",
      "terminology",
      "application"
    ],
    "learningOutcomeId": "204-15A-LO5",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "Initial verification is the overall process (Inspect -> Dead Test -> Live Test -> Record) to ensure a new installation is safe. Dead testing is the critical first electrical phase of this process."
  },
  {
    "id": 4062,
    "question": "During the inspection of a new ring final circuit, an electrician finds that the insulation of one conductor has been nicked, exposing 1mm of copper. What is the correct procedure according to the 'stop-and-fix' rule?",
    "options": [
      "Repair the damage immediately and record the fix before starting any dead tests",
      "Proceed with the continuity test and only fix the nick if the insulation resistance test fails",
      "Wrap the nicked wire in PVC tape and note it as a 'minor deviation' on the certificate",
      "Ignore the damage as 1mm of exposed copper will not affect the ring continuity"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "Initial Verification Overview",
    "tags": [
      "application",
      "health-safety",
      "discrimination"
    ],
    "learningOutcomeId": "204-15A-LO5",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 120,
    "explanation": "Visible damage to conductors is a safety failure identified during inspection. It must be rectified before electrical testing begins to ensure the testing process itself is safe and valid."
  },
  {
    "id": 4063,
    "question": "What is the primary reason for strictly following the 'Dead Test Sequence' (CPC Continuity, Ring Final, IR, Polarity) rather than choosing a random order?",
    "options": [
      "Each test relies on the safety or integrity confirmed by the previous test in the sequence",
      "The sequence is alphabetical according to the original IEE wiring regulations",
      "Following the sequence allows the battery in the multi-function tester to last longer",
      "The sequence is designed to match the layout of the Electrical Installation Certificate"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "Initial Verification Overview",
    "tags": [
      "conceptual",
      "terminology"
    ],
    "learningOutcomeId": "204-15A-LO6",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 120,
    "explanation": "The sequence is logical; for example, you cannot check polarity or insulation resistance effectively if you haven't first confirmed that the conductors (CPC/Ring) are actually continuous."
  },
  {
    "id": 4064,
    "question": "A student is asked to identify which document is used to record the results of the initial verification for a single new circuit added to an existing installation. Which is the correct choice?",
    "options": [
      "Minor Electrical Installation Works Certificate",
      "Schedule of Periodic Inspection and Testing",
      "Electrical Installation Condition Report",
      "Dangerous Occurrence Notification Form"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "OTHER",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "Initial Verification Overview",
    "tags": [
      "discrimination",
      "terminology",
      "legislation"
    ],
    "learningOutcomeId": "204-15A-LO6",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "For additions or alterations that do not include a new circuit from the consumer unit, a Minor Works certificate is used. For a brand new circuit, an EIC is used, but in the context of LO6, understanding the certification type is key."
  },
  {
    "id": 4065,
    "question": "Why is 'Proving Dead' considered a more critical safety step than simply switching off the main isolator and checking a circuit diagram?",
    "options": [
      "Diagrams and labels may be incorrect, and isolators can fail internally in the 'closed' position",
      "Proving dead discharges the capacitive energy stored in the cables from the transformer",
      "The electricity board requires a digital log of the 'prove-dead' event for their records",
      "It ensures the electrician has the correct range selected on their multimeter"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_AC_DC_SOURCES",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Safe Isolation",
    "tags": [
      "conceptual",
      "health-safety",
      "application"
    ],
    "learningOutcomeId": "204-15A-LO1",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 120,
    "explanation": "Safety depends on physical verification. Labels are often wrong, and mechanical switches can weld shut, meaning the circuit is still live even if the handle is in the 'off' position."
  }
];
