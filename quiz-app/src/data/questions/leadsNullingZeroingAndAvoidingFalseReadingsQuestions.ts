import { TaggedQuestion } from './types';

/**
 * Leads, nulling/zeroing, and avoiding false readings Question Bank
 * Aligned with lesson 204-11C learning outcomes
 * Generated: 2026-01-28
 */

export const leadsNullingZeroingAndAvoidingFalseReadingsQuestions: TaggedQuestion[] = [
  {
    "id": 4051,
    "question": "What is the primary purpose of 'nulling' or 'zeroing' a low-resistance ohmmeter before testing?",
    "options": [
      "To subtract the resistance of the test leads from the final measurement",
      "To ensure the battery has enough power to perform the test",
      "To discharge any static electricity stored in the circuit",
      "To increase the voltage output of the tester for better accuracy"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "CONFUSED_AC_DC_SOURCES",
      "3": "CONFUSED_I_V_R"
    },
    "section": "Electrical Installations Technology",
    "category": "Leads, nulling/zeroing, and avoiding false readings",
    "tags": [
      "resistance-rule",
      "units",
      "terminology"
    ],
    "learningOutcomeId": "204-11C-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Nulling or zeroing is the process of compensating for the resistance of the test leads themselves, ensuring that only the circuit's resistance is recorded."
  },
  {
    "id": 4052,
    "question": "Which instrument function is most significantly affected by the resistance of the test leads?",
    "options": [
      "Low-resistance continuity (Ω)",
      "Insulation resistance (MΩ)",
      "Voltage (V)",
      "Frequency (Hz)"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "WRONG_UNITS",
      "2": "CONFUSED_I_V_R",
      "3": "CONFUSED_FREQUENCY_WITH_VOLTAGE"
    },
    "section": "Electrical Installations Technology",
    "category": "Leads, nulling/zeroing, and avoiding false readings",
    "tags": [
      "discrimination",
      "units",
      "terminology"
    ],
    "learningOutcomeId": "204-11C-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Lead resistance is typically very low (e.g., 0.2 ohms). This is significant when measuring low-resistance continuity but negligible when measuring insulation resistance in millions of ohms."
  },
  {
    "id": 4053,
    "question": "During a continuity test, the digital display is 'jumping' between 0.4Ω and 8.5Ω. What is the most likely cause?",
    "options": [
      "Poor contact between the probe tips and the test points",
      "The circuit conductors are too thick for the tester",
      "The battery in the tester is brand new",
      "The insulation resistance is too high"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "OTHER",
      "3": "WRONG_UNITS"
    },
    "section": "Electrical Installations Technology",
    "category": "Leads, nulling/zeroing, and avoiding false readings",
    "tags": [
      "application",
      "resistance-rule",
      "conceptual"
    ],
    "learningOutcomeId": "204-11C-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "Unstable or 'jumpy' readings are usually caused by poor electrical contact, such as loose probes, dirt, or paint on the test points."
  },
  {
    "id": 4054,
    "question": "Why should an electrician avoid touching the metal tips of the probes while carrying out a resistance test?",
    "options": [
      "To prevent their body resistance from being included in the measurement",
      "To prevent the probes from getting dirty and increasing resistance",
      "To avoid getting an electric shock from the tester's battery",
      "To stop the test leads from becoming tangled during the test"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "OTHER",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Leads, nulling/zeroing, and avoiding false readings",
    "tags": [
      "conceptual",
      "resistance-rule",
      "application"
    ],
    "learningOutcomeId": "204-11C-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "The human body has resistance. If you touch the metal tips, your body creates a parallel path for the current, which can lower the resistance reading on the meter."
  },
  {
    "id": 4055,
    "question": "What is the best action to take if a continuity reading seems much higher than expected for a short piece of cable?",
    "options": [
      "Stop and check the leads, probe connections, and tester settings",
      "Assume the cable is faulty and replace the entire circuit",
      "Record the result and move on to the next test",
      "Subtract 10 ohms from the result to make it look correct"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "OTHER",
      "3": "SIGN_ERROR"
    },
    "section": "Electrical Installations Technology",
    "category": "Leads, nulling/zeroing, and avoiding false readings",
    "tags": [
      "application",
      "terminology",
      "conceptual"
    ],
    "learningOutcomeId": "204-11C-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "If a reading looks wrong, the first step is always to verify the test setup, including the integrity of the leads and the quality of the probe contact."
  },
  {
    "id": 4056,
    "question": "If an electrician forgets to null their test leads, how will this affect the final continuity reading of a circuit?",
    "options": [
      "The reading will be higher than the actual circuit resistance",
      "The reading will be lower than the actual circuit resistance",
      "The reading will be exactly zero regardless of the circuit",
      "The reading will automatically switch to insulation resistance"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "OTHER",
      "3": "WRONG_UNITS"
    },
    "section": "Electrical Installations Technology",
    "category": "Leads, nulling/zeroing, and avoiding false readings",
    "tags": [
      "conceptual",
      "resistance-rule",
      "units"
    ],
    "learningOutcomeId": "204-11C-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "If not nulled, the tester displays the sum of the lead resistance and the circuit resistance, leading to a 'false high' result."
  },
  {
    "id": 4057,
    "question": "Which of the following is a common cause of a 'false high' resistance reading during testing?",
    "options": [
      "Oxidation or corrosion on the copper terminals being tested",
      "Using a tester with a fully charged battery",
      "Firmly pressing the probes against the conductors",
      "Short-circuiting the leads together before the test"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "OTHER",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Leads, nulling/zeroing, and avoiding false readings",
    "tags": [
      "discrimination",
      "resistance-rule",
      "conceptual"
    ],
    "learningOutcomeId": "204-11C-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "Oxidation or corrosion creates a layer of high resistance between the probe and the conductor, leading to an inaccurate, high reading."
  },
  {
    "id": 4058,
    "question": "When using a continuity tester, what does a 'beep' sound usually indicate?",
    "options": [
      "A low-resistance path is detected, but the Ω value must still be checked",
      "The circuit is definitely safe to energise immediately",
      "The battery is dying and needs to be replaced",
      "The insulation resistance is greater than 200MΩ"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "OTHER",
      "3": "WRONG_UNITS"
    },
    "section": "Electrical Installations Technology",
    "category": "Leads, nulling/zeroing, and avoiding false readings",
    "tags": [
      "discrimination",
      "terminology",
      "application"
    ],
    "learningOutcomeId": "204-11C-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "The 'beep' is a quick indicator of continuity, but for certification, the actual numerical resistance value must be recorded and verified."
  },
  {
    "id": 4059,
    "question": "An electrician connects their test leads together and the meter reads 0.15Ω. They press the 'NULL' button and the meter reads 0.00Ω. What has happened?",
    "options": [
      "The meter has stored the lead resistance to subtract it from future tests",
      "The meter has blown an internal fuse",
      "The leads have been disconnected from the meter",
      "The battery has been bypassed to save energy"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "OTHER",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Leads, nulling/zeroing, and avoiding false readings",
    "tags": [
      "application",
      "resistance-rule",
      "terminology"
    ],
    "learningOutcomeId": "204-11C-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Pressing the 'NULL' button tells the meter to ignore the current resistance (the leads) and treat it as the new zero point."
  },
  {
    "id": 4060,
    "question": "Which part of the test lead set is most likely to cause an intermittent or 'jumpy' reading if damaged?",
    "options": [
      "The internal copper conductor inside the flexible cable",
      "The plastic finger guard on the probe handle",
      "The color-coded insulation on the outside of the lead",
      "The serial number sticker on the lead"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "OTHER",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Leads, nulling/zeroing, and avoiding false readings",
    "tags": [
      "discrimination",
      "conceptual",
      "application"
    ],
    "learningOutcomeId": "204-11C-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "If the internal copper conductor is partially broken (fractured), it may make and break contact as the lead is moved, causing unstable readings."
  },
  {
    "id": 4061,
    "question": "What is the primary purpose of 'nulling' or 'zeroing' test leads before carrying out a continuity test?",
    "options": [
      "To subtract the resistance of the test leads from the final measurement",
      "To ensure the battery in the tester is fully charged",
      "To switch the instrument from AC mode to DC mode",
      "To increase the sensitivity of the continuity beeper"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "CONFUSED_AC_WITH_DC",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "Leads and Nulling",
    "tags": [
      "resistance-rule",
      "units",
      "conceptual"
    ],
    "learningOutcomeId": "204-11C-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Nulling or zeroing removes the resistance of the test leads themselves (usually 0.1 to 0.3 ohms) so that the displayed result only shows the resistance of the circuit being tested."
  },
  {
    "id": 4062,
    "question": "Which of the following is a common cause of 'jumpy' or unstable resistance readings on a digital display?",
    "options": [
      "Poor or intermittent contact between the probe tips and the test points",
      "The test leads being too short for the circuit",
      "The circuit under test having too many copper conductors",
      "Using a tester that has been recently calibrated"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "TOPOLOGY_CONFUSION",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "False Readings",
    "tags": [
      "discrimination",
      "terminology"
    ],
    "learningOutcomeId": "204-11C-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Unstable readings are often caused by poor mechanical contact, such as dirt, corrosion, or the user failing to hold the probes steady against the terminals."
  },
  {
    "id": 4063,
    "question": "If an electrician forgets to null their test leads (which have a resistance of 0.20 Ω) before testing a circuit, how will the final reading be affected?",
    "options": [
      "The reading will be 0.20 Ω higher than the actual circuit resistance",
      "The reading will be 0.20 Ω lower than the actual circuit resistance",
      "The reading will automatically correct itself after 10 seconds",
      "The meter will display an 'Error' message and refuse to test"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "SIGN_ERROR",
      "2": "OTHER",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Leads and Nulling",
    "tags": [
      "calculation",
      "resistance-rule",
      "conceptual"
    ],
    "learningOutcomeId": "204-11C-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "Lead resistance is in series with the circuit resistance. If not nulled, the meter adds the lead resistance to the circuit resistance, making the result appear higher."
  },
  {
    "id": 4064,
    "question": "While performing a low-resistance test, why should you avoid touching the metal tips of the probes with your bare fingers?",
    "options": [
      "Your body can provide a parallel path that changes the resistance reading",
      "The probes will become magnetized and give false readings",
      "It will cause the tester's internal fuse to blow immediately",
      "The static electricity from your skin will change the AC frequency"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "OTHER",
      "3": "CONFUSED_FREQUENCY_WITH_VOLTAGE"
    },
    "section": "Electrical Installations Technology",
    "category": "False Readings",
    "tags": [
      "discrimination",
      "conceptual",
      "topology-confusion"
    ],
    "learningOutcomeId": "204-11C-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "The human body has resistance. By touching the metal tips, you create a parallel circuit path through yourself, which can significantly lower the resistance reading on high-resistance tests or fluctuate low-resistance ones."
  },
  {
    "id": 4065,
    "question": "An electrician is testing continuity and receives a reading that seems much higher than expected for a short piece of wire. What is the best first action to take?",
    "options": [
      "Stop, check the lead connections, and re-null the instrument",
      "Record the high reading immediately as a fail",
      "Replace the wire with a larger cross-sectional area",
      "Change the batteries in the tester without checking the leads"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "OTHER",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "False Readings",
    "tags": [
      "application",
      "discrimination"
    ],
    "learningOutcomeId": "204-11C-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "If a reading looks wrong in principle, you should first verify your setup by checking for loose leads, dirty probes, or a loss of the null/zero setting before assuming there is a fault in the installation."
  },
  {
    "id": 4066,
    "question": "Why is lead resistance a critical factor when performing low-resistance continuity tests, but usually ignored during insulation resistance (IR) tests?",
    "options": [
      "IR readings are in Megohms, making the small resistance of the leads mathematically negligible",
      "Insulation resistance leads are manufactured from special zero-resistance materials",
      "IR testers use high-frequency AC which cancels out the resistance of the test leads",
      "The lead resistance is only added to the circuit when the tester is set to the ohms range"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "CONFUSED_AC_DC_SOURCES",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "Leads, nulling/zeroing, and avoiding false readings",
    "tags": [
      "resistance-rule",
      "conceptual",
      "units"
    ],
    "learningOutcomeId": "204-11C-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 60,
    "explanation": "In continuity testing, we measure very small values (e.g., 0.2Ω). Lead resistance (e.g., 0.1Ω) would represent a 50% error. In IR testing, we measure millions of ohms, so 0.1Ω is irrelevant."
  },
  {
    "id": 4067,
    "question": "An electrician performs a continuity test on a ring final circuit and the meter displays 0.48Ω. After nulling the test leads, the reading for the same circuit is 0.18Ω. What was the resistance of the test leads?",
    "options": [
      "0.30Ω",
      "0.66Ω",
      "0.08Ω",
      "0.48Ω"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "ROUNDING_ERROR",
      "3": "FORMULA_NOT_REARRANGED"
    },
    "section": "Electrical Installations Technology",
    "category": "Leads, nulling/zeroing, and avoiding false readings",
    "tags": [
      "calculation",
      "resistance-rule",
      "application"
    ],
    "learningOutcomeId": "204-11C-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "The lead resistance is the difference between the un-nulled reading and the nulled reading: 0.48Ω - 0.18Ω = 0.30Ω."
  },
  {
    "id": 4068,
    "question": "While testing continuity, the digital display on the multi-function tester is 'jumping' between 0.2Ω and 1.5Ω. What is the most likely cause of this unstable reading?",
    "options": [
      "Poor contact between the probe tips and the conductor due to oxidation or dirt",
      "The test leads are too long for the range selected on the instrument",
      "The circuit under test has too many parallel paths connected",
      "The tester is running on a low battery which increases lead resistance"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "TOPOLOGY_CONFUSION",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Leads, nulling/zeroing, and avoiding false readings",
    "tags": [
      "discrimination",
      "conceptual",
      "resistance-rule"
    ],
    "learningOutcomeId": "204-11C-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "Unstable or 'jumpy' readings are almost always caused by poor mechanical contact, such as pressing probes against dirty, oxidized, or painted surfaces."
  },
  {
    "id": 4069,
    "question": "What is the primary technical purpose of 'nulling' or 'zeroing' a low-resistance ohmmeter before starting a continuity test?",
    "options": [
      "To subtract the resistance of the test leads from the final measured result",
      "To ensure the internal battery of the tester has sufficient voltage to complete the test",
      "To discharge any capacitive energy stored within the circuit's insulation",
      "To calibrate the meter against the local supply frequency"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "CONFUSED_FREQUENCY_WITH_VOLTAGE"
    },
    "section": "Electrical Installations Technology",
    "category": "Leads, nulling/zeroing, and avoiding false readings",
    "tags": [
      "conceptual",
      "terminology",
      "resistance-rule"
    ],
    "learningOutcomeId": "204-11C-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Nulling tells the meter to ignore the resistance of the leads themselves, so only the resistance of the circuit under test is displayed."
  },
  {
    "id": 4070,
    "question": "A student is testing a continuity link. The meter shows a steady 0.05Ω, but whenever the leads are moved or flexed near the instrument's plug-in sockets, the reading fluctuates to 'OL'. What should the student investigate?",
    "options": [
      "An intermittent break or loose connection inside the test lead or at the plug",
      "The circuit conductor is too thin for the current being injected by the meter",
      "The test leads are picking up electromagnetic interference from nearby cables",
      "The meter is automatically switching ranges due to the high resistance of the link"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "CONFUSED_AC_DC_SOURCES",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "Leads, nulling/zeroing, and avoiding false readings",
    "tags": [
      "application",
      "resistance-rule",
      "discrimination"
    ],
    "learningOutcomeId": "204-11C-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "Fluctuations caused by moving the leads usually indicate a 'partial break' or loose connection within the lead assembly itself."
  },
  {
    "id": 4071,
    "question": "Which of the following would NOT result in a falsely high resistance reading during a continuity test?",
    "options": [
      "Accidentally touching the metal probe tips with your fingers during the test",
      "Loose or poorly tightened terminals at the consumer unit",
      "Corrosion on the copper conductors being tested",
      "Failing to null the test leads before measurement"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "OTHER",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Leads, nulling/zeroing, and avoiding false readings",
    "tags": [
      "discrimination",
      "conceptual",
      "resistance-rule"
    ],
    "learningOutcomeId": "204-11C-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "Touching the probe tips with fingers usually creates a parallel path, which would lower the resistance reading (especially in IR tests), not increase it."
  },
  {
    "id": 4072,
    "question": "Why is it important to avoid touching the metal tips of the probes with your hands while performing an Insulation Resistance (IR) test?",
    "options": [
      "Your body provides a parallel path which will significantly lower the reading",
      "The high resistance of your skin will be added to the circuit in series",
      "The moisture on your hands will damage the sensitive digital display",
      "The tester will enter 'nulling mode' if it detects human skin contact"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_SERIES_RULE",
      "2": "OTHER",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "Leads, nulling/zeroing, and avoiding false readings",
    "tags": [
      "conceptual",
      "health-safety",
      "resistance-rule"
    ],
    "learningOutcomeId": "204-11C-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 60,
    "explanation": "Body resistance is much lower than the insulation being tested. Touching the probes creates a parallel path, causing a 'fail' reading on a good circuit."
  },
  {
    "id": 4073,
    "question": "An electrician is measuring a long protective bonding conductor. The meter reads 0.95Ω. The electrician remembers the leads were not nulled and have a resistance of 0.25Ω. What value should be recorded?",
    "options": [
      "0.70Ω",
      "1.20Ω",
      "0.95Ω",
      "0.25Ω"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "FORMULA_NOT_REARRANGED",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Leads, nulling/zeroing, and avoiding false readings",
    "tags": [
      "application",
      "calculation",
      "resistance-rule"
    ],
    "learningOutcomeId": "204-11C-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "To find the true resistance, subtract the lead resistance from the total reading: 0.95Ω - 0.25Ω = 0.70Ω."
  },
  {
    "id": 4074,
    "question": "When using a multi-function tester, what is the main risk of relying solely on the 'continuity beep' without looking at the digital display?",
    "options": [
      "The beep may sound at resistances up to 10Ω or more, masking a poor connection",
      "The beep consumes too much battery power and causes false low readings",
      "The beep only works if the test leads have been nulled correctly",
      "The beep is only designed for testing live circuits"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "OTHER",
      "3": "CONFUSED_AC_DC_SOURCES"
    },
    "section": "Electrical Installations Technology",
    "category": "Leads, nulling/zeroing, and avoiding false readings",
    "tags": [
      "discrimination",
      "conceptual",
      "terminology"
    ],
    "learningOutcomeId": "204-11C-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 60,
    "explanation": "Most testers 'beep' at any resistance below a certain threshold (e.g., 30Ω). This could hide a high-resistance fault that should be closer to 0.1Ω."
  },
  {
    "id": 4075,
    "question": "If a multi-function tester displays '>1999Ω' or 'OL' during a continuity test of a circuit that is known to be complete, what is the first action that should be taken?",
    "options": [
      "Check the lead connections to the instrument and the probe contact points",
      "Immediately record the circuit as having an open-circuit fault",
      "Change the batteries in the tester as they are clearly exhausted",
      "Switch the tester to the Insulation Resistance range to force a reading"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "OTHER",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "Leads, nulling/zeroing, and avoiding false readings",
    "tags": [
      "conceptual",
      "application",
      "terminology"
    ],
    "learningOutcomeId": "204-11C-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Before assuming a circuit fault, always check the simplest potential failure: the test equipment setup and the physical connection of the probes."
  },
  {
    "id": 4076,
    "question": "What is the primary purpose of 'nulling' or 'zeroing' test leads before performing a low-resistance continuity test?",
    "options": [
      "To subtract the resistance of the test leads from the final measurement",
      "To ensure the battery has enough power to complete the test",
      "To increase the sensitivity of the tester for high-resistance readings",
      "To discharge any residual capacitance in the circuit being tested"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_I_V_R",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Leads, nulling/zeroing, and avoiding false readings",
    "tags": [
      "continuity",
      "terminology",
      "calculation"
    ],
    "learningOutcomeId": "204-11C-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Nulling or zeroing ensures that the resistance inherent in the test leads themselves is not added to the circuit resistance reading, providing a more accurate result for low-ohm measurements."
  },
  {
    "id": 4077,
    "question": "An electrician is testing a circuit and the display is 'jumping' rapidly between 0.05 Ω and 2.10 Ω. What is the most likely cause of this unreliable reading?",
    "options": [
      "Poor or contaminated contact between the probe tips and the test points",
      "The circuit resistance is naturally fluctuating due to cable length",
      "The test leads are too long for the instrument to handle",
      "The instrument is set to the wrong units (MΩ instead of Ω)"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "OTHER",
      "3": "WRONG_UNITS"
    },
    "section": "Electrical Installations Technology",
    "category": "Leads, nulling/zeroing, and avoiding false readings",
    "tags": [
      "continuity",
      "application",
      "terminology"
    ],
    "learningOutcomeId": "204-11C-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "Unstable or 'jumpy' readings are almost always caused by poor mechanical contact, such as dirt, oxidation, or loose probes at the point of measurement."
  },
  {
    "id": 4078,
    "question": "A tester has not been nulled. The test leads have a resistance of 0.22 Ω. If the actual circuit resistance is 0.35 Ω, what value will be displayed on the instrument?",
    "options": [
      "0.57 Ω",
      "0.13 Ω",
      "0.35 Ω",
      "0.07 Ω"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "SIGN_ERROR",
      "2": "OTHER",
      "3": "MULTIPLIED_INSTEAD"
    },
    "section": "Electrical Installations Technology",
    "category": "Leads, nulling/zeroing, and avoiding false readings",
    "tags": [
      "calculation",
      "resistance-rule",
      "series"
    ],
    "learningOutcomeId": "204-11C-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "Without nulling, the instrument measures the total resistance of the leads and the circuit in series (0.22 + 0.35 = 0.57 Ω)."
  },
  {
    "id": 4079,
    "question": "Why is it considered poor practice to touch the metal probe tips with your fingers while performing an Insulation Resistance (IR) test?",
    "options": [
      "Your body creates a parallel path which significantly lowers the resistance reading",
      "The moisture on your skin will increase the resistance of the test leads",
      "It will cause the tester to blow an internal fuse due to high current",
      "It changes the frequency of the DC test voltage being applied"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_SERIES_RULE",
      "2": "CONFUSED_I_V_R",
      "3": "CONFUSED_AC_WITH_DC"
    },
    "section": "Electrical Installations Technology",
    "category": "Leads, nulling/zeroing, and avoiding false readings",
    "tags": [
      "conceptual",
      "parallel",
      "resistance-rule"
    ],
    "learningOutcomeId": "204-11C-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "Touching the probes places your body in parallel with the insulation being tested. Since the body has lower resistance than the expected MΩ values, the tester will show a much lower (false) reading."
  },
  {
    "id": 4080,
    "question": "Which of the following would be the best action to take if a continuity reading appears much higher than expected for a short length of cable?",
    "options": [
      "Stop, check lead connections, re-null the instrument, and re-test",
      "Record the result as a fail and report a cable fault immediately",
      "Switch the tester to the 'beep' function to confirm the path",
      "Subtract 1.0 Ω from the result to account for potential errors"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Leads, nulling/zeroing, and avoiding false readings",
    "tags": [
      "application",
      "discrimination",
      "continuity"
    ],
    "learningOutcomeId": "204-11C-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "If a reading looks wrong in principle, the first step is to verify the test setup, leads, and nulling before assuming the installation is at fault."
  },
  {
    "id": 4081,
    "question": "An electrician performs a continuity test and the instrument displays 0.02 Ω. However, when they short the probes together afterwards, the display shows 0.18 Ω. What does this indicate?",
    "options": [
      "The initial reading was false because the leads were not nulled",
      "The circuit has a negative resistance value",
      "The tester battery is too low to perform the calculation",
      "The circuit is perfectly healthy and the reading is valid"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "SIGN_ERROR",
      "2": "OTHER",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Leads, nulling/zeroing, and avoiding false readings",
    "tags": [
      "application",
      "calculation",
      "conceptual"
    ],
    "learningOutcomeId": "204-11C-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "A reading (0.02 Ω) cannot be lower than the resistance of the leads themselves (0.18 Ω). This indicates a setup error or a false reading that must be investigated."
  },
  {
    "id": 4082,
    "question": "When using a Digital Multi-Meter (DMM) for continuity, which button is commonly used to perform the 'nulling' function?",
    "options": [
      "REL (Relative)",
      "HOLD",
      "RANGE",
      "MAX/MIN"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "Leads, nulling/zeroing, and avoiding false readings",
    "tags": [
      "discrimination",
      "terminology",
      "units"
    ],
    "learningOutcomeId": "204-11C-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "The REL (Relative) button on many DMMs sets the current reading (the lead resistance) as a zero reference point for subsequent measurements."
  },
  {
    "id": 4083,
    "question": "Which lead-related problem is most likely to result in a reading that is consistently higher than the true value, but remains stable?",
    "options": [
      "Forgetting to null the resistance of long test leads",
      "A broken conductor inside the lead insulation",
      "Moving the probes while the measurement is being taken",
      "The probe tips touching a painted surface"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "OTHER",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Leads, nulling/zeroing, and avoiding false readings",
    "tags": [
      "conceptual",
      "resistance-rule",
      "continuity"
    ],
    "learningOutcomeId": "204-11C-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Forgetting to null adds the fixed resistance of the leads to the result, causing a stable but inaccurate 'high' reading."
  },
  {
    "id": 4084,
    "question": "If an electrician is using a 'croc-clip' (crocodile clip) for a continuity test, why should they ensure it is clipped onto clean metal rather than the cable insulation?",
    "options": [
      "Insulation is a non-conductor and will result in an 'Open Circuit' reading",
      "Clipping to insulation will damage the lead's internal conductor",
      "The clip will cause a short circuit if it touches the insulation",
      "The tester will automatically switch to Insulation Resistance mode"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "TOPOLOGY_CONFUSION",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "Leads, nulling/zeroing, and avoiding false readings",
    "tags": [
      "conceptual",
      "application",
      "terminology"
    ],
    "learningOutcomeId": "204-11C-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "Continuity testing requires a low-resistance metallic path; insulation prevents current flow, leading to a false 'Greater than max' or 'Open Circuit' result."
  },
  {
    "id": 4085,
    "question": "An electrician finds that their tester will not 'null' and shows an error message. Upon inspection, the test leads are tangled and have tight knots. What is the most likely cause?",
    "options": [
      "The internal copper cores of the leads are fractured or broken",
      "The knots have increased the magnetic inductance of the leads",
      "The tester is detecting a parallel path through the knots",
      "The leads have become too hot due to the restricted cable shape"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "TOPOLOGY_CONFUSION",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Leads, nulling/zeroing, and avoiding false readings",
    "tags": [
      "discrimination",
      "application",
      "continuity"
    ],
    "learningOutcomeId": "204-11C-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "Tangled or knotted leads often suffer from mechanical stress that fractures the internal copper strands, leading to a broken circuit that the instrument cannot null."
  },
  {
    "id": 4086,
    "question": "An electrician is about to carry out a continuity test on a ring final circuit. Why is it essential to 'null' or 'zero' the test leads before taking measurements?",
    "options": [
      "To subtract the resistance of the test leads from the final circuit reading",
      "To ensure the internal battery of the tester has enough voltage for the test",
      "To reset the meter so it displays an 'Infinity' ( >299MΩ) reading",
      "To discharge any capacitive energy stored within the circuit conductors"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "TOPOLOGY_CONFUSION",
      "3": "CONFUSED_AC_DC_SOURCES"
    },
    "section": "Electrical Installations Technology",
    "category": "Leads, nulling/zeroing, and avoiding false readings",
    "tags": [
      "resistance-rule",
      "calculation",
      "terminology"
    ],
    "learningOutcomeId": "204-11C-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 60,
    "explanation": "Nulling or zeroing the leads ensures that the small resistance inherent in the test leads themselves is not added to the circuit resistance, which would result in an inaccurately high reading."
  },
  {
    "id": 4087,
    "question": "A student forgets to null their test leads, which have a known resistance of 0.18 Ω. When testing a circuit with an actual resistance of 0.42 Ω, what value will the continuity tester display?",
    "options": [
      "0.60 Ω",
      "0.24 Ω",
      "0.42 Ω",
      "0.18 Ω"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "OTHER",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "Leads, nulling/zeroing, and avoiding false readings",
    "tags": [
      "resistance-rule",
      "calculation",
      "series"
    ],
    "learningOutcomeId": "204-11C-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "If not nulled, the tester acts as if the leads and the circuit are in series. Therefore, it adds the lead resistance to the circuit resistance (0.18 + 0.42 = 0.60 Ω)."
  },
  {
    "id": 4088,
    "question": "While performing a low-resistance continuity test, the digital display fluctuates rapidly between 1.5 Ω and 12.0 Ω. What is the most appropriate first action to take?",
    "options": [
      "Stop and check the probe tips for dirt or poor contact with the terminals",
      "Record the average value of the fluctuations to ensure progress",
      "Assume the circuit has a loose connection and report a wiring fault",
      "Switch the meter to the Insulation Resistance (MΩ) range to stabilize it"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "OTHER",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "Leads, nulling/zeroing, and avoiding false readings",
    "tags": [
      "calculation",
      "terminology",
      "application"
    ],
    "learningOutcomeId": "204-11C-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "Unstable or 'jumpy' readings are often caused by poor physical contact, oxidation on the test points, or damaged test lead conductors. The setup should be verified before assuming a circuit fault exists."
  },
  {
    "id": 4089,
    "question": "During an Insulation Resistance (IR) test, an electrician accidentally touches the metal tips of both probes with their fingers. How will this most likely affect the test result?",
    "options": [
      "It will provide a false low reading because the body provides a parallel path",
      "It will provide a false high reading by adding body resistance in series",
      "It will have no effect because the human body is a perfect insulator",
      "It will cause the tester's internal fuse to blow due to an over-current"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_SERIES_RULE",
      "2": "OTHER",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Leads, nulling/zeroing, and avoiding false readings",
    "tags": [
      "resistance-rule",
      "conceptual",
      "terminology"
    ],
    "learningOutcomeId": "204-11C-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "Touching the probes creates a parallel path through the person's body. In high-resistance IR testing, this parallel path significantly lowers the total resistance measured by the meter, leading to a false 'fail' result."
  },
  {
    "id": 4090,
    "question": "Which of the following scenarios is most likely to cause a 'false' high resistance reading during a continuity test of a copper conductor?",
    "options": [
      "Applying light pressure to probes on a heavily oxidized brass terminal",
      "Using test leads that have been properly nulled/zeroed",
      "Accidentally measuring two conductors connected in parallel",
      "Testing a conductor that is shorter than the standard test lead length"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "USED_PARALLEL_RULE",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Leads, nulling/zeroing, and avoiding false readings",
    "tags": [
      "calculation",
      "terminology",
      "conceptual"
    ],
    "learningOutcomeId": "204-11C-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 60,
    "explanation": "Oxidation or dirt on terminals acts as an insulator. If the probes do not make firm, clean contact, the meter will measure the resistance of the oxide layer, resulting in a false high reading."
  },
  {
    "id": 4091,
    "question": "When performing a continuity test on a ring final circuit, an electrician notices the tester displays 0.25 Ω when the leads are shorted together. If they proceed to measure the end-to-end resistance (r1) without nulling the instrument, how will this affect the recorded value?",
    "options": [
      "The recorded value will be 0.25 Ω higher than the actual resistance of the copper conductor.",
      "The recorded value will be 0.25 Ω lower than the actual resistance of the copper conductor.",
      "The error is negligible because the tester automatically compensates for lead resistance during the measurement.",
      "The reading will be unstable and flicker between the lead resistance and the conductor resistance."
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "FORMULA_NOT_REARRANGED",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "Leads, nulling/zeroing, and avoiding false readings",
    "tags": [
      "calculation",
      "resistance-rule",
      "units"
    ],
    "learningOutcomeId": "204-11C-LO1",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 120,
    "explanation": "Lead resistance is additive. If you do not 'null' or subtract the resistance of the leads (0.25 Ω), that value remains part of the total displayed resistance, leading to an over-estimation of the conductor's resistance."
  },
  {
    "id": 4092,
    "question": "Which of the following observations during a low-resistance continuity test most strongly suggests a broken internal conductor within a test lead rather than poor contact at the probe tip?",
    "options": [
      "The resistance reading fluctuates wildly specifically when the test lead cable is flexed or moved.",
      "The reading is consistently 0.50 Ω higher than the expected design value for the circuit length.",
      "The instrument display shows '>1999 Ω' regardless of how hard the probes are pressed.",
      "The continuity 'beep' sounds immediately, but the digital display takes several seconds to stabilize."
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "TOPOLOGY_CONFUSION",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "Leads, nulling/zeroing, and avoiding false readings",
    "tags": [
      "discrimination",
      "explanation",
      "calculation"
    ],
    "learningOutcomeId": "204-11C-LO1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "A 'jumpy' or fluctuating reading that corresponds to the physical movement of the lead itself usually indicates that the internal copper strands are fractured, making and breaking contact as the cable bends."
  },
  {
    "id": 4093,
    "question": "While testing a long radial circuit, an electrician finds the resistance reading is 1.45 Ω but it keeps flickering between 1.45 Ω and 2.10 Ω. What is the most appropriate immediate action according to best practice?",
    "options": [
      "Stop the test, clean the test points of any oxidation/debris, and apply firmer, stable pressure to the probes.",
      "Record the lowest stable reading (1.45 Ω) as it represents the most optimistic result for the circuit.",
      "Take the average of the two readings (1.78 Ω) and record this to account for the instability.",
      "Assume the circuit has a loose terminal and begin dismantling all accessories to find the fault."
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "ROUNDING_ERROR",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Leads, nulling/zeroing, and avoiding false readings",
    "tags": [
      "application",
      "resistance-rule",
      "conceptual"
    ],
    "learningOutcomeId": "204-11C-LO1",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 120,
    "explanation": "Unstable readings are often caused by poor contact. The first step is to ensure the setup is correct by cleaning the contact area and ensuring the probes are held firmly and still."
  },
  {
    "id": 4094,
    "question": "Why is the process of nulling (zeroing) test leads critical for low-resistance continuity testing (e.g., R1+R2) but rarely required for Insulation Resistance (IR) testing?",
    "options": [
      "Lead resistance is significant relative to milliohms in continuity but negligible compared to Megohms in IR.",
      "Insulation Resistance testers use high-frequency AC which naturally cancels out lead resistance.",
      "The high voltage used in IR testing (500V) automatically breaks through any lead resistance.",
      "Lead resistance only exists when the tester is set to the 'Ω' range, not the 'MΩ' range."
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_AC_WITH_DC",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "CONFUSED_I_V_R"
    },
    "section": "Electrical Installations Technology",
    "category": "Leads, nulling/zeroing, and avoiding false readings",
    "tags": [
      "conceptual",
      "resistance-rule",
      "units"
    ],
    "learningOutcomeId": "204-11C-LO1",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 120,
    "explanation": "In continuity testing, we measure very small values where 0.2 Ω is a huge percentage of the total. In IR testing, we measure millions of ohms, so a 0.2 Ω lead resistance is statistically irrelevant."
  },
  {
    "id": 4095,
    "question": "An electrician is using a continuity tester that 'beeps' at 30 Ω or less. During a test of a main bonding conductor, the meter beeps, but the screen shows 12.5 Ω. What does this result indicate?",
    "options": [
      "The connection is continuous but has an unacceptably high resistance for a bonding conductor.",
      "The tester is faulty because it should only beep if the resistance is below 0.05 Ω.",
      "The leads have not been nulled, and the entire 12.5 Ω reading is likely just lead resistance.",
      "The circuit is perfectly healthy because the audible 'beep' is the primary indicator of a pass."
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "USED_PARALLEL_RULE",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "Leads, nulling/zeroing, and avoiding false readings",
    "tags": [
      "application",
      "discrimination",
      "resistance-rule"
    ],
    "learningOutcomeId": "204-11C-LO1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "The 'beep' only confirms a basic path exists. For bonding, the resistance must be very low (typically <0.05 Ω). A reading of 12.5 Ω is far too high, even if the meter beeps."
  },
  {
    "id": 4096,
    "question": "A student nulls their leads and obtains a 0.00 Ω reading. After moving to a different part of the building, they check the leads again by shorting them, and the display now shows 0.12 Ω. What is the most likely cause?",
    "options": [
      "Mechanical stress or temperature changes have slightly altered the resistance of the lead connections.",
      "The tester's internal battery voltage has increased, causing a higher resistance calculation.",
      "The student has moved closer to the distribution board, increasing the magnetic interference.",
      "The tester has automatically switched to a high-accuracy mode which adds more resistance."
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "OTHER",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "Leads, nulling/zeroing, and avoiding false readings",
    "tags": [
      "discrimination",
      "conceptual",
      "resistance-rule"
    ],
    "learningOutcomeId": "204-11C-LO1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "Lead resistance is not perfectly static. Flexing the cables or changes in temperature can cause small fluctuations. This is why leads should be checked and re-nulled periodically."
  },
  {
    "id": 4097,
    "question": "During an Insulation Resistance test at 500V, an electrician accidentally touches the metal tips of the probes with their bare fingers while holding them against the conductors. How will this affect the result?",
    "options": [
      "The reading will decrease because the electrician's body provides a parallel high-resistance path.",
      "The reading will increase because the body acts as an additional layer of insulation.",
      "The reading will stay exactly the same because the tester only measures the resistance between the probe tips.",
      "The tester will display an error because 500V cannot pass through human skin."
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "OTHER",
      "3": "CONFUSED_I_V_R"
    },
    "section": "Electrical Installations Technology",
    "category": "Leads, nulling/zeroing, and avoiding false readings",
    "tags": [
      "conceptual",
      "parallel",
      "health-safety"
    ],
    "learningOutcomeId": "204-11C-LO1",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 120,
    "explanation": "Touching the probes creates a parallel path through the body. In a parallel circuit, the total resistance is always less than the smallest individual resistance, resulting in a lower (and false) IR reading."
  },
  {
    "id": 4098,
    "question": "You attempt to null your test leads on a multi-function tester, but the instrument displays a 'FAIL' message. The leads appear visually intact. What is the most logical next step?",
    "options": [
      "Ensure the lead jacks are fully pushed into the instrument and clean the probe tips with a lint-free cloth.",
      "Discard the leads immediately as a 'FAIL' during nulling indicates a permanent internal short-circuit.",
      "Proceed with the test and manually subtract the last known lead resistance from your results.",
      "Change the batteries in the tester as low voltage always prevents the nulling function from operating."
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "FORMULA_NOT_REARRANGED",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Leads, nulling/zeroing, and avoiding false readings",
    "tags": [
      "application",
      "explanation",
      "resistance-rule"
    ],
    "learningOutcomeId": "204-11C-LO1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "A nulling failure is often caused by a poor connection between the leads and the tester or dirt on the probe tips increasing the resistance beyond the tester's 'null' limit."
  },
  {
    "id": 4099,
    "question": "Which scenario describes a 'false positive' continuity reading caused by poor testing technique?",
    "options": [
      "Measuring continuity between two conductors while your fingers are touching both metal probe tips simultaneously.",
      "Forgetting to null the leads, resulting in a 0.50 Ω reading for a circuit that is actually 0.20 Ω.",
      "Using a tester with a low battery that causes the backlight to dim during the measurement.",
      "Applying the probes to a painted earth terminal without first scraping away the paint to reach the metal."
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "UNITS_MISSING",
      "2": "OTHER",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Leads, nulling/zeroing, and avoiding false readings",
    "tags": [
      "discrimination",
      "application",
      "conceptual"
    ],
    "learningOutcomeId": "204-11C-LO1",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 120,
    "explanation": "By touching both probe tips, the tester measures the resistance of your body in parallel with the circuit. This can make a broken circuit appear to have continuity (a false positive)."
  },
  {
    "id": 4100,
    "question": "When using a 50-meter wander lead for a protective bonding test, why is the nulling procedure significantly more critical than when using standard 1.2-meter leads?",
    "options": [
      "The inherent resistance of the 50m copper lead is high enough to exceed the typical 0.05 Ω pass limit on its own.",
      "Long leads act as an antenna and will pick up stray AC voltages that the nulling function filters out.",
      "The voltage drop across a 50m lead is so great that the tester cannot generate a 200mA test current.",
      "Wander leads use a different type of insulation that requires 'charging' through the zeroing process."
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_AC_WITH_DC",
      "2": "DIVIDED_INSTEAD",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "Leads, nulling/zeroing, and avoiding false readings",
    "tags": [
      "conceptual",
      "resistance-rule",
      "calculation"
    ],
    "learningOutcomeId": "204-11C-LO1",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 120,
    "explanation": "A 50m lead might have a resistance of 0.5 Ω to 1.0 Ω. Since bonding conductors must be very low resistance (approx 0.05 Ω), failing to null a wander lead would make every healthy circuit look like a fail."
  }
];
