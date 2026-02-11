import { TaggedQuestion } from './types';

/**
 * Initial Verification Overview + Safe Isolation Question Bank
 * Aligned with lesson 204-15A learning outcomes
 * Generated: 2026-02-11
 */

export const initialVerificationOverviewSafeIsolationQuestions: TaggedQuestion[] = [
  {
    "id": 4016,
    "question": "What is the primary purpose of the 'lock off' procedure during safe isolation?",
    "options": [
      "To prevent the supply from being accidentally re-energized while work is in progress",
      "To ensure that the consumer unit door remains closed during testing",
      "To prevent the theft of circuit breakers from the distribution board",
      "To stop the customer from turning on the lights and wasting energy"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "OTHER",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Safe Isolation",
    "tags": [
      "health-safety",
      "terminology",
      "conceptual"
    ],
    "learningOutcomeId": "204-15A-LO5",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Locking off is a critical safety step that ensures the person working on the installation has sole control over the supply, preventing accidental re-energization."
  },
  {
    "id": 4017,
    "question": "At what stage of the initial verification process should a visual inspection be carried out?",
    "options": [
      "Before any electrical dead testing begins",
      "Only after the supply has been turned on",
      "After the insulation resistance test is completed",
      "Only if the dead test results are found to be failing"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "OTHER",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Initial Verification Overview",
    "tags": [
      "legislation",
      "discrimination"
    ],
    "learningOutcomeId": "204-15A-LO5",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Visual inspection must always be carried out before testing to ensure there are no obvious defects that could make testing dangerous or inaccurate."
  },
  {
    "id": 4018,
    "question": "An electrician is about to prove a circuit is dead. Which specific piece of equipment must be used in conjunction with a matching voltage indicator?",
    "options": [
      "A proving unit",
      "A digital multimeter set to resistance",
      "A battery-operated torch",
      "A non-contact voltage detector (voltage stick)"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_I_V_R",
      "2": "OTHER",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "Safe Isolation",
    "tags": [
      "health-safety",
      "application"
    ],
    "learningOutcomeId": "204-15A-LO5",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "A proving unit is required to verify that the voltage indicator is functioning correctly both before and after checking the circuit."
  },
  {
    "id": 4019,
    "question": "In the standard sequence of dead tests, which test is normally performed first?",
    "options": [
      "Continuity of protective conductors",
      "Insulation resistance",
      "Polarity",
      "Ring final circuit continuity"
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
      "terminology",
      "conceptual"
    ],
    "learningOutcomeId": "204-15A-LO6",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "The continuity of protective conductors (CPC) is tested first to ensure that the safety earthing path is intact before performing other tests."
  },
  {
    "id": 4020,
    "question": "Which of the following is classified strictly as a 'dead test' during initial verification?",
    "options": [
      "Insulation Resistance",
      "Earth Fault Loop Impedance (Zs)",
      "Prospective Fault Current (PFC)",
      "Phase Rotation"
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
    "explanation": "Insulation Resistance is a dead test because it requires the circuit to be isolated from the supply and uses an internal battery from the tester."
  },
  {
    "id": 4021,
    "question": "During an initial inspection, you notice a significant crack in a plastic consumer unit. What is the correct course of action?",
    "options": [
      "Stop and report the damage for repair before proceeding with tests",
      "Continue with the tests and note the crack on the final certificate",
      "Cover the crack with electrical tape and proceed with testing",
      "Ignore the crack as it does not affect the electrical readings"
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
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "Obvious damage that compromises the IP rating or safety of the installation is a 'stop-and-fix' situation that must be addressed before testing."
  },
  {
    "id": 4022,
    "question": "What is the correct three-step sequence for 'proving dead' using a voltage indicator?",
    "options": [
      "Test on proving unit, test the circuit, re-test on proving unit",
      "Test the circuit, test on proving unit, re-test the circuit",
      "Test the circuit, then turn off the main switch",
      "Check the proving unit, then check the circuit only"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "OTHER",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Safe Isolation",
    "tags": [
      "health-safety",
      "conceptual"
    ],
    "learningOutcomeId": "204-15A-LO5",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "You must verify the tester works on a known source, check the circuit, and then verify the tester still works to ensure the 'dead' reading was accurate."
  },
  {
    "id": 4023,
    "question": "What is the primary reason for recording the results of dead tests on an Electrical Installation Certificate?",
    "options": [
      "To provide a safety baseline for future periodic inspections",
      "To calculate the total cost of the materials used",
      "To prove to the customer how many hours were worked",
      "To determine the maximum fuse rating for the local substation"
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
      "legislation",
      "discrimination"
    ],
    "learningOutcomeId": "204-15A-LO6",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "Recording results provides a baseline of the installation's condition at the time of commissioning, which is essential for future safety checks."
  },
  {
    "id": 4024,
    "question": "While performing safe isolation, who should ideally keep the key to the padlock used to secure the point of isolation?",
    "options": [
      "The person who is carrying out the work",
      "The site foreman or supervisor",
      "The homeowner or client",
      "The apprentice assisting with the work"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "OTHER",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Safe Isolation",
    "tags": [
      "health-safety",
      "application"
    ],
    "learningOutcomeId": "204-15A-LO5",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "To ensure absolute safety, the person performing the work must have sole control over the isolation point by keeping the key on their person."
  },
  {
    "id": 4025,
    "question": "Initial Verification is a process used to confirm that a new installation:",
    "options": [
      "Is safe to be put into service and complies with BS 7671",
      "Will never develop an electrical fault in the future",
      "Has been installed using the cheapest possible materials",
      "Is compatible with all brands of household appliances"
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
      "conceptual",
      "legislation"
    ],
    "learningOutcomeId": "204-15A-LO5",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Initial verification confirms that the installation is safe for use and meets the regulatory requirements of the IET Wiring Regulations (BS 7671)."
  },
  {
    "id": 4026,
    "question": "What is the primary reason for performing safe isolation before beginning any work or dead testing on an electrical installation?",
    "options": [
      "To prevent electric shock and ensure the safety of the person working",
      "To prevent the circuit breakers from tripping during the inspection",
      "To ensure that the electricity meter does not record any usage",
      "To allow the cable insulation to cool down before taking measurements"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
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
    "learningOutcomeId": "204-15A-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Safe isolation is a mandatory safety procedure designed to protect the worker from electric shock by ensuring the installation is physically disconnected from the source of supply and cannot be re-energized accidentally."
  },
  {
    "id": 4027,
    "question": "According to the correct workflow for initial verification, when should the visual inspection take place?",
    "options": [
      "Before any electrical testing begins",
      "After the continuity tests are completed",
      "Only after the circuit has been energized",
      "Immediately after recording the final results"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "OTHER",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Initial Verification Overview",
    "tags": [
      "discrimination",
      "explanation"
    ],
    "learningOutcomeId": "204-15A-LO5",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Inspection must always precede testing. This ensures that obvious faults, such as missing enclosures or damaged cables, are identified and rectified before electrical instruments are used."
  },
  {
    "id": 4028,
    "question": "An electrician is preparing to prove a circuit is dead as part of the safe isolation procedure. Which equipment is approved for this task?",
    "options": [
      "A GS38 compliant voltage indicator and a matching proving unit",
      "A standard digital multimeter set to the highest AC Voltage range",
      "A non-contact voltage indicator (volt pen) with a battery check light",
      "A neon-indicator screwdriver with an insulated shank"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_I_V_R",
      "2": "OTHER",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Safe Isolation",
    "tags": [
      "application",
      "health-safety"
    ],
    "learningOutcomeId": "204-15A-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Only a dedicated voltage indicator compliant with GS38, verified against a known source (proving unit), is acceptable for proving a circuit is dead. Multimeters and volt-pens are not recommended for this critical safety step."
  },
  {
    "id": 4029,
    "question": "In the standard sequence of dead testing for a new installation, which test is performed first?",
    "options": [
      "Continuity of protective conductors",
      "Insulation resistance",
      "Polarity",
      "Continuity of ring final circuit conductors"
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
      "discrimination",
      "terminology"
    ],
    "learningOutcomeId": "204-15A-LO6",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "The continuity of protective conductors (CPC) is the first test in the sequence to ensure that the earthing path is intact before any other tests are carried out."
  },
  {
    "id": 4030,
    "question": "What should an electrician do if they discover a major defect, such as exposed live parts, during the initial inspection phase?",
    "options": [
      "Stop work and report or fix the defect before proceeding to testing",
      "Carry out the dead tests anyway and record the fault on the certificate",
      "Wait until the live testing phase to see if the fault causes a trip",
      "Cover the defect with electrical tape and continue with the sequence"
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
      "conceptual",
      "health-safety"
    ],
    "learningOutcomeId": "204-15A-LO5",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "If a 'stop-and-fix' situation is identified during inspection, the electrician must not proceed to testing. The installation must be made safe or the fault repaired first to prevent danger during the testing process."
  },
  {
    "id": 4031,
    "question": "Which of the following best describes the primary purpose of 'Initial Verification' in an electrical installation?",
    "options": [
      "To confirm the installation is safe and complies with BS 7671 before being put into service",
      "To check the installation every five years for signs of wear and tear",
      "To ensure the electricity supplier is charging the correct tariff for the property",
      "To carry out live functional tests on all RCDs before any dead testing occurs"
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
      "terminology",
      "conceptual",
      "legislation"
    ],
    "learningOutcomeId": "204-15A-LO5",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Initial verification is the process of inspecting and testing a new installation (or addition/alteration) to ensure it is safe to energise and meets BS 7671 standards."
  },
  {
    "id": 4032,
    "question": "What is the correct sequence for the first three 'dead' tests according to the standard testing order?",
    "options": [
      "Continuity of protective conductors, Ring final circuit continuity, Insulation resistance",
      "Insulation resistance, Polarity, Continuity of protective conductors",
      "Ring final circuit continuity, Insulation resistance, Earth electrode resistance",
      "Continuity of protective conductors, Polarity, Earth fault loop impedance"
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
      "calculation",
      "conceptual",
      "units"
    ],
    "learningOutcomeId": "204-15A-LO6",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "Dead tests must follow a specific sequence to ensure safety; we must prove the CPC is continuous before testing insulation or polarity."
  },
  {
    "id": 4033,
    "question": "When following the safe isolation procedure, what is the correct method for using a voltage indicator?",
    "options": [
      "Test on a known source, test the circuit, then re-test on the known source",
      "Test the circuit, then check the indicator on a known source to see if it worked",
      "Test on a known source, then test the circuit to confirm it is dead",
      "Test the circuit with a volt-stick to see if the LED glows red"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "CONFUSED_AC_DC_SOURCES"
    },
    "section": "Electrical Installations Technology",
    "category": "Safe Isolation",
    "tags": [
      "health-safety",
      "application",
      "conceptual"
    ],
    "learningOutcomeId": "204-15A-LO6",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "To ensure the indicator hasn't failed during the process, it must be proved against a known source (proving unit) both before and after checking the circuit."
  },
  {
    "id": 4034,
    "question": "An electrician is about to start dead testing a new kitchen circuit but notices a socket outlet has a visible crack in the faceplate. What should be the immediate action?",
    "options": [
      "Stop the process and replace the damaged component before proceeding",
      "Carry out the insulation resistance test to see if the crack affects the reading",
      "Continue with the tests and note the crack on the final certificate",
      "Energise the circuit to see if the socket still functions correctly"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "HEALTH_SAFETY_RISK"
    },
    "section": "Electrical Installations Technology",
    "category": "Initial Verification Overview",
    "tags": [
      "health-safety",
      "application",
      "discrimination"
    ],
    "learningOutcomeId": "204-15A-LO5",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Obvious defects found during the visual inspection (the 'Inspect' phase) must be rectified before 'Testing' begins to ensure safety."
  },
  {
    "id": 4035,
    "question": "Which piece of equipment is considered unsuitable for proving a circuit is dead during the safe isolation procedure?",
    "options": [
      "A non-contact voltage detector (volt-stick)",
      "A GS38 compliant two-pole voltage indicator",
      "A dedicated proving unit",
      "A multi-function tester set to the voltage range"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "OTHER",
      "3": "CONFUSED_AC_DC_SOURCES"
    },
    "section": "Electrical Installations Technology",
    "category": "Safe Isolation",
    "tags": [
      "health-safety",
      "discrimination",
      "terminology"
    ],
    "learningOutcomeId": "204-15A-LO6",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Non-contact voltage detectors are not recommended for proving dead because they can give false readings and do not fail-safe."
  },
  {
    "id": 4036,
    "question": "Why is the 'Continuity of Protective Conductors' test performed before the 'Insulation Resistance' test?",
    "options": [
      "To ensure a path to earth exists so that the insulation test is valid and safe",
      "Because the insulation resistance tester requires a high current to operate",
      "To check if the circuit breakers are correctly rated for the load",
      "Because it is the only test that can be done while the circuit is live"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_SERIES_RULE",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "CONFUSED_AC_DC_SOURCES"
    },
    "section": "Electrical Installations Technology",
    "category": "Initial Verification Overview",
    "tags": [
      "conceptual",
      "application",
      "resistance-rule"
    ],
    "learningOutcomeId": "204-15A-LO6",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "You must prove that the earthing system is intact and continuous before carrying out other tests that rely on the presence of an earth."
  },
  {
    "id": 4037,
    "question": "During safe isolation, what must be done after switching off the relevant circuit breaker and before proving dead?",
    "options": [
      "Lock the breaker in the 'off' position and keep the key with you",
      "Inform the homeowner that the power will be back on in ten minutes",
      "Place a piece of electrical tape over the breaker handle",
      "Remove the circuit wires from the breaker and tape them together"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "HEALTH_SAFETY_RISK",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "Safe Isolation",
    "tags": [
      "health-safety",
      "application",
      "legislation"
    ],
    "learningOutcomeId": "204-15A-LO6",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Securing the isolation with a lock and warning notice ensures that no one else can accidentally re-energise the circuit while you are working on it."
  },
  {
    "id": 4038,
    "question": "Which of these is a 'dead' test and therefore part of the initial sequence before the supply is connected?",
    "options": [
      "Polarity (using a continuity tester)",
      "Earth Fault Loop Impedance (Zs)",
      "Prospective Short Circuit Current (PSCC)",
      "RCD trip time at 1x rated current"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_AC_DC_SOURCES",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "Initial Verification Overview",
    "tags": [
      "discrimination",
      "conceptual",
      "terminology"
    ],
    "learningOutcomeId": "204-15A-LO6",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "Polarity can be checked while dead by using a continuity tester to ensure conductors are connected to the correct terminals."
  },
  {
    "id": 4039,
    "question": "A learner is told to perform 'Dead Testing'. Which of the following describes the state of the installation during this process?",
    "options": [
      "The installation is completely disconnected from the electrical supply",
      "The main switch is ON but all the individual MCBs are turned OFF",
      "The installation is connected to a temporary 110V site transformer",
      "Only the lighting circuits are energised so the electrician can see"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_AC_DC_SOURCES",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Initial Verification Overview",
    "tags": [
      "conceptual",
      "terminology",
      "health-safety"
    ],
    "learningOutcomeId": "204-15A-LO5",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Dead testing means the installation is not connected to any source of electrical energy."
  },
  {
    "id": 4040,
    "question": "If an electrician cannot find a way to lock off a specific type of older miniature circuit breaker (MCB), what is the safest alternative?",
    "options": [
      "Isolate the entire installation at the main switch and lock that off instead",
      "Have an apprentice stand by the consumer unit to watch the switch",
      "Label the switch 'DO NOT TURN ON' and proceed with the work",
      "Disconnect the circuit cable from the MCB and place it in a connector block"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "HEALTH_SAFETY_RISK",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "Safe Isolation",
    "tags": [
      "health-safety",
      "application",
      "conceptual"
    ],
    "learningOutcomeId": "204-15A-LO6",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "If a specific circuit cannot be safely locked off, the whole board or installation must be isolated at a point that can be secured with a lock."
  },
  {
    "id": 4041,
    "question": "What is the primary purpose of carrying out an initial verification on a new electrical installation?",
    "options": [
      "To verify that the installation is safe for service and complies with BS 7671",
      "To ensure the electricity meter is accurately recording the energy used",
      "To confirm that the circuit breakers match the brand of the consumer unit",
      "To calculate the maximum possible load the homeowner might use"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "OTHER",
      "3": "CONFUSED_TERMINOLOGY"
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
    "explanation": "Initial verification is performed to ensure the installation is safe to be put into service and meets the requirements of the IET Wiring Regulations (BS 7671)."
  },
  {
    "id": 4042,
    "question": "In the standard sequence of dead tests, which test must be performed first to ensure the safety of the earthing system?",
    "options": [
      "Continuity of protective conductors",
      "Insulation resistance",
      "Polarity",
      "Ring final circuit continuity"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "TOPOLOGY_CONFUSION",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "Initial Verification Overview",
    "tags": [
      "discrimination",
      "calculation",
      "resistance-rule"
    ],
    "learningOutcomeId": "204-15A-LO6",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "Continuity of protective conductors (CPC) is the first test in the sequence to ensure that all metallic parts are correctly earthed before any other tests are carried out."
  },
  {
    "id": 4043,
    "question": "An electrician is about to isolate a circuit. After turning off the MCB and locking it, what is the next essential step before touching any conductors?",
    "options": [
      "Verify the circuit is dead using an approved voltage indicator and proving unit",
      "Check for current flow using a clamp meter on the line conductor",
      "Use a non-contact voltage stick to check the front of the socket",
      "Start the insulation resistance test to see if the circuit is clear"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "HEALTH_SAFETY",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "Safe Isolation",
    "tags": [
      "application",
      "health-safety",
      "units"
    ],
    "learningOutcomeId": "204-15A-LO5",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "Safe isolation requires proving the circuit is dead using a GS38 compliant voltage indicator and a proving unit. Non-contact sticks are not approved for proving dead."
  },
  {
    "id": 4044,
    "question": "Why is 'Safe Isolation' considered a non-negotiable rule before starting any dead testing on an installation?",
    "options": [
      "To prevent electric shock to the person testing and others in the vicinity",
      "To prevent the multi-function tester from blowing an internal fuse",
      "To ensure the electricity supplier does not charge for wasted energy",
      "To allow the conductors to cool down before measuring their resistance"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_AC_DC_SOURCES",
      "2": "OTHER",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "Safe Isolation",
    "tags": [
      "conceptual",
      "health-safety"
    ],
    "learningOutcomeId": "204-15A-LO5",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "The primary reason for safe isolation is safety; it ensures no one can be harmed by accidental re-energisation of the circuit while work is being carried out."
  },
  {
    "id": 4045,
    "question": "Which of the following tests is classified as a 'dead test' during the initial verification process?",
    "options": [
      "Insulation resistance",
      "Earth fault loop impedance (Zs)",
      "RCD trip time testing",
      "Prospective fault current (Ipf)"
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
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Insulation resistance is carried out with the supply disconnected (dead). Zs, RCD, and Ipf tests all require the supply to be connected (live)."
  },
  {
    "id": 4046,
    "question": "During the visual inspection of a new kitchen installation, you notice a cracked socket outlet. What is the correct course of action according to the 'stop-and-fix' rule?",
    "options": [
      "Replace the socket and record the fix before proceeding to electrical testing",
      "Continue with the insulation resistance test to see if the crack affects the reading",
      "Complete all other tests first and then list the crack as a recommendation",
      "Apply PVC tape over the crack and inform the client after the testing is finished"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "HEALTH_SAFETY"
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
    "estimatedTime": 90,
    "explanation": "Obvious defects found during inspection must be rectified before electrical testing proceeds, as the defect could make testing dangerous or produce false results."
  },
  {
    "id": 4047,
    "question": "What is the correct sequence for proving a voltage indicator is working correctly during the safe isolation procedure?",
    "options": [
      "Test indicator on proving unit, check circuit, re-test indicator on proving unit",
      "Check the circuit, then check the indicator on a known live source",
      "Test indicator on proving unit, then immediately begin work on the circuit",
      "Check the circuit with the indicator, then press the 'test' button on the indicator"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "HEALTH_SAFETY",
      "3": "HEALTH_SAFETY"
    },
    "section": "Electrical Installations Technology",
    "category": "Safe Isolation",
    "tags": [
      "conceptual",
      "health-safety"
    ],
    "learningOutcomeId": "204-15A-LO5",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "You must prove the tester works before use, check the circuit, and then prove the tester still works afterwards to ensure the 'dead' reading wasn't due to a failed tester."
  },
  {
    "id": 4048,
    "question": "Which document is primarily used by an electrician to record the results of the initial verification for a brand new domestic installation?",
    "options": [
      "Electrical Installation Certificate",
      "Minor Electrical Installation Works Certificate",
      "Electrical Installation Condition Report",
      "Schedule of Rates and Variations"
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
      "terminology"
    ],
    "learningOutcomeId": "204-15A-LO6",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "The Electrical Installation Certificate (EIC) is used for new installations. An EICR is for existing installations, and a Minor Works is for small additions like a single socket."
  },
  {
    "id": 4049,
    "question": "You are preparing to carry out dead testing. You have isolated the circuit at the MCB, but you do not have a padlock or a warning notice. What should you do?",
    "options": [
      "Do not proceed until the circuit is securely locked off and a notice is posted",
      "Tape the MCB in the 'off' position and ask the homeowner to watch it",
      "Proceed with the tests quickly while keeping the consumer unit in your sight",
      "Disconnect the circuit cable from the MCB and leave it hanging in the unit"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "HEALTH_SAFETY",
      "2": "HEALTH_SAFETY",
      "3": "HEALTH_SAFETY"
    },
    "section": "Electrical Installations Technology",
    "category": "Safe Isolation",
    "tags": [
      "application",
      "health-safety"
    ],
    "learningOutcomeId": "204-15A-LO5",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "Safe isolation requires a secure lock and a warning notice. Tape is not a secure method of isolation, and you must not rely on others to watch the switch."
  },
  {
    "id": 4050,
    "question": "Why must the 'Continuity of Protective Conductors' test be completed before the 'Insulation Resistance' test?",
    "options": [
      "To ensure a continuous path to earth exists so the IR test accurately checks all parts",
      "Because the insulation resistance tester requires a low resistance to function",
      "To ensure any static electricity is drained from the cables before high voltage is applied",
      "It is simply a convention to save time and has no impact on safety or accuracy"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "FORMULA_NOT_REARRANGED",
      "2": "CONFUSED_AC_DC_SOURCES",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Initial Verification Overview",
    "tags": [
      "conceptual",
      "resistance-rule"
    ],
    "learningOutcomeId": "204-15A-LO6",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "Testing CPC continuity first ensures that the earthing system is intact. If the earth is broken, the Insulation Resistance test to earth might give a false 'pass' reading."
  },
  {
    "id": 4051,
    "question": "During the safe isolation procedure, after verifying that a voltage indicator is functioning correctly on a known source (proving unit), what is the immediate next step?",
    "options": [
      "Test the circuit to be worked on to confirm it is dead",
      "Lock the isolator in the 'off' position and keep the key",
      "Re-verify the voltage indicator on the known source immediately",
      "Check the continuity of the circuit's protective conductor"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "OTHER",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Safe Isolation",
    "tags": [
      "health-safety",
      "terminology",
      "application"
    ],
    "learningOutcomeId": "204-15A-LO5",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "The safe isolation sequence is: Prove the tester on a known source, test the circuit to ensure it is dead, then re-prove the tester on the known source to ensure it hasn't failed during the test."
  },
  {
    "id": 4052,
    "question": "At what stage of the Initial Verification process should an electrician begin the sequence of dead tests?",
    "options": [
      "Only after a successful visual inspection has been completed",
      "Immediately after the safe isolation of the consumer unit",
      "After the supply has been energized to check for correct polarity",
      "Once all the furniture and floor coverings have been installed"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "CONFUSED_AC_DC_SOURCES",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Initial Verification Overview",
    "tags": [
      "legislation",
      "terminology",
      "conceptual"
    ],
    "learningOutcomeId": "204-15A-LO5",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Visual inspection must always precede testing. This ensures that obvious defects (like missing enclosures or damaged cables) are identified before test voltages are applied."
  },
  {
    "id": 4053,
    "question": "An electrician arrives to perform dead testing on a new kitchen circuit and finds that a socket outlet has been mounted but the faceplate is cracked, exposing live terminals. What is the correct procedure?",
    "options": [
      "Stop work and replace the damaged component before starting any tests",
      "Proceed with the dead tests and note the damage on the certificate",
      "Apply electrical tape over the crack and proceed with the IR test",
      "Skip the continuity test and only perform the polarity check"
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
      "health-safety",
      "application"
    ],
    "learningOutcomeId": "204-15A-LO6",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "This is a 'stop-and-fix' situation. If an installation is found to be unsafe or damaged during the inspection phase, testing should not proceed until the fault is rectified."
  },
  {
    "id": 4054,
    "question": "Which of these lists correctly identifies the first three tests in the standard sequence for dead testing a new electrical installation?",
    "options": [
      "Continuity of protective conductors, Ring final circuit continuity, Insulation resistance",
      "Insulation resistance, Polarity, Continuity of protective conductors",
      "Earth fault loop impedance, Polarity, Insulation resistance",
      "Voltage drop, Ring final circuit continuity, Polarity"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "CONFUSED_AC_DC_SOURCES",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Initial Verification Overview",
    "tags": [
      "terminology",
      "conceptual"
    ],
    "learningOutcomeId": "204-15A-LO6",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "The sequence is designed to ensure safety; continuity is checked first to ensure earthing is present before the high-voltage insulation resistance test is performed."
  },
  {
    "id": 4055,
    "question": "What is the primary objective of carrying out 'Initial Verification' on a newly installed circuit?",
    "options": [
      "To verify the installation is safe for service and complies with BS 7671",
      "To ensure the circuit will handle double its rated current without tripping",
      "To allow the homeowner to claim on their building insurance",
      "To confirm the electricity meter is recording energy usage accurately"
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
      "legislation",
      "conceptual"
    ],
    "learningOutcomeId": "204-15A-LO5",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Initial verification is a legal and regulatory requirement to ensure that new work is safe, correctly installed, and meets the requirements of the Wiring Regulations (BS 7671)."
  },
  {
    "id": 4056,
    "question": "An electrician is about to begin the dead testing sequence on a newly installed domestic consumer unit. Why is it critical that the 'Continuity of Protective Conductors' test is performed before the 'Insulation Resistance' test?",
    "options": [
      "To ensure the earthing path is intact so that insulation testing does not leave parts of the system at a high potential",
      "Because insulation resistance testers require a low-resistance earth path to function correctly",
      "To verify that the circuit breakers are in the 'off' position before applying high voltage",
      "Because BS 7671 requires all continuity tests to be completed before any resistance tests"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "TOPOLOGY_CONFUSION",
      "3": "FORMULA_NOT_REARRANGED"
    },
    "section": "Electrical Installations Technology",
    "category": "Initial Verification Overview",
    "tags": [
      "calculation",
      "conceptual",
      "health-safety"
    ],
    "learningOutcomeId": "204-15A-LO6",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 120,
    "explanation": "Continuity of CPCs must be confirmed first to ensure that the earthing system is effective. If insulation resistance testing (which uses high voltage) is performed on a system with a broken CPC, metalwork could remain energized and dangerous."
  },
  {
    "id": 4057,
    "question": "During the safe isolation procedure, after turning off the isolator and locking it, what is the specific purpose of using a proving unit to check the voltage indicator a second time?",
    "options": [
      "To confirm the voltage indicator is still functioning correctly after the 'prove-dead' test",
      "To ensure the batteries in the voltage indicator have not been drained by the live circuit",
      "To calibrate the voltage indicator for the specific voltage range of the installation",
      "To verify that the main isolator has not been bypassed by another electrician"
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
      "health-safety",
      "conceptual",
      "application"
    ],
    "learningOutcomeId": "204-15A-LO5",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "The 'Prove-Test-Prove' cycle ensures the instrument was working before the test, and critically, that it did not fail during the test, which could lead to a false-negative 'dead' reading."
  },
  {
    "id": 4058,
    "question": "A technician arrives at a site to perform initial verification. They notice that several enclosures have visible gaps larger than 12.5mm (IP2X). According to the 'stop-and-fix' principle, what is the correct course of action?",
    "options": [
      "Stop the verification process and report the defect for rectification before any testing begins",
      "Proceed with dead testing but note the IP rating failure on the final certificate",
      "Only perform continuity tests, as insulation resistance testing requires the enclosures to be sealed",
      "Temporarily cover the gaps with electrical tape to allow testing to continue safely"
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
      "health-safety",
      "application",
      "discrimination"
    ],
    "learningOutcomeId": "204-15A-LO5",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "Initial verification includes inspection. If a major safety defect like inadequate IP rating (protection against finger touch) is found, the process must stop until the installation is made safe."
  },
  {
    "id": 4059,
    "question": "When isolating a three-phase and neutral supply for dead testing, which of the following is the correct sequence for proving the supply is dead using an approved voltage indicator?",
    "options": [
      "Between all phases, and each phase to neutral and earth",
      "Between L1 and L2, L2 and L3, and L3 to Earth only",
      "Between the neutral bar and the earth bar only",
      "Between L1 and Neutral, then L1 to L2 only"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_I_V_R",
      "3": "UNITS_MISSING"
    },
    "section": "Electrical Installations Technology",
    "category": "Safe Isolation",
    "tags": [
      "health-safety",
      "application",
      "calculation"
    ],
    "learningOutcomeId": "204-15A-LO5",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 150,
    "explanation": "To ensure full isolation on a three-phase system, you must check between all live conductors (L1-L2, L2-L3, L3-L1) and between each live conductor and both Neutral and Earth."
  },
  {
    "id": 4060,
    "question": "Which of the following describes a scenario where initial verification would be considered 'incomplete' despite all tests being passed?",
    "options": [
      "The inspector failed to carry out a visual inspection before starting the instrument tests",
      "The inspector used a multi-function tester instead of separate single-function meters",
      "The insulation resistance test was performed at 500V instead of 250V on a 230V system",
      "The results were recorded on a digital tablet rather than a paper certificate"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "OTHER",
      "3": "WRONG_UNITS"
    },
    "section": "Electrical Installations Technology",
    "category": "Initial Verification Overview",
    "tags": [
      "conceptual",
      "discrimination",
      "legislation"
    ],
    "learningOutcomeId": "204-15A-LO5",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "Initial Verification is a two-part process: Inspection and Testing. Skipping the visual inspection means the verification does not comply with BS 7671 requirements."
  },
  {
    "id": 4061,
    "question": "What is the primary reason for prohibiting the use of a standard multimeter for proving dead during the safe isolation procedure?",
    "options": [
      "Multimeters can easily be set to the wrong range or function, leading to a false 'zero' reading",
      "Multimeters do not have high enough internal resistance to protect the user from electric shock",
      "Multimeters are only capable of measuring DC voltage, not the AC voltage found in mains",
      "The leads on a standard multimeter do not meet the requirements for 1000V insulation"
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
      "health-safety",
      "conceptual",
      "discrimination"
    ],
    "learningOutcomeId": "204-15A-LO5",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 120,
    "explanation": "Approved voltage indicators (GS38) are designed without fuses or range switches that could fail or be set incorrectly. A multimeter set to 'Resistance' or the wrong 'Voltage' range could show 0V on a live circuit."
  },
  {
    "id": 4062,
    "question": "In the standard sequence of dead tests, why is 'Polarity' tested after 'Insulation Resistance'?",
    "options": [
      "To ensure that the high-voltage insulation test has not damaged the switch polarity",
      "To confirm that conductors are correctly connected before the system is energized",
      "Because polarity can only be verified accurately if the insulation is above 1.0 MOhms",
      "Because the Continuity of Ring Final Conductors test automatically verifies polarity"
    ],
    "correctAnswer": 1,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "Initial Verification Overview",
    "tags": [
      "conceptual",
      "discrimination",
      "voltage-rule"
    ],
    "learningOutcomeId": "204-15A-LO6",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "Dead polarity testing ensures that switches are in the line conductor and that sockets are wired correctly. It is a critical safety check performed before any live tests or energization."
  },
  {
    "id": 4063,
    "question": "An electrician is isolating a circuit at a distribution board. They find that the specific circuit breaker cannot be locked in the 'off' position with their standard locking kit. What is the safest course of action?",
    "options": [
      "Isolate the entire distribution board using the main switch and lock that instead",
      "Tape the breaker in the 'off' position and place a 'Danger' sign over it",
      "Ask a colleague to stand by the board and watch the breaker while testing",
      "Remove the circuit wire from the breaker and terminate it into a connector block"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "TOPOLOGY_CONFUSION",
      "3": "HEALTH-SAFETY"
    },
    "section": "Electrical Installations Technology",
    "category": "Safe Isolation",
    "tags": [
      "health-safety",
      "application",
      "discrimination"
    ],
    "learningOutcomeId": "204-15A-LO5",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 120,
    "explanation": "If a specific circuit cannot be securely locked, the next level of isolation (the main switch) must be used. Safe isolation must be secure; tape or 'watching' is not an acceptable safety method."
  },
  {
    "id": 4064,
    "question": "Which of the following is a 'dead test' that specifically verifies that no cross-connections exist between different circuits?",
    "options": [
      "Insulation Resistance (between circuits)",
      "Continuity of Protective Conductors",
      "Continuity of Ring Final Conductors",
      "Polarity (dead)"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_SERIES_RULE",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "Initial Verification Overview",
    "tags": [
      "conceptual",
      "discrimination",
      "resistance-rule"
    ],
    "learningOutcomeId": "204-15A-LO6",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "Insulation resistance testing is not just between conductors of the same circuit, but also between different circuits to ensure they are electrically isolated from one another."
  },
  {
    "id": 4065,
    "question": "A new ring final circuit has been installed. During the dead test sequence, the electrician finds that the end-to-end resistance of the line loop is significantly higher than the neutral loop. What should be the immediate next step?",
    "options": [
      "Investigate and fix the high resistance connection before proceeding to the next test",
      "Continue to the insulation resistance test and note the reading on the certificate",
      "Multiply the neutral reading by 1.2 to estimate the corrected line resistance",
      "Assume the test leads were not nulled and repeat the test three times"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "MULTIPLIED_INSTEAD",
      "2": "ROUNDING_ERROR",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Initial Verification Overview",
    "tags": [
      "application",
      "calculation",
      "resistance-rule"
    ],
    "learningOutcomeId": "204-15A-LO6",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 150,
    "explanation": "In a ring final circuit, the Line, Neutral, and CPC loops should have consistent readings. A significant discrepancy indicates a loose connection or fault that must be rectified before proceeding with further tests."
  }
];
