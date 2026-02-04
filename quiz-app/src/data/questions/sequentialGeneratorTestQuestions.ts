import { TaggedQuestion } from './types';

/**
 * Sequential Generator Test Question Bank
 * Aligned with lesson 203-TEST learning outcomes
 * Generated: 2026-02-04
 */

export const sequentialGeneratorTestQuestions: TaggedQuestion[] = [
  {
    "id": 4016,
    "question": "What is the primary purpose of performing a sequential test on a generator system?",
    "options": [
      "To verify that components operate in the correct order",
      "To measure the total resistance of the earthing system",
      "To convert the AC output into a DC supply",
      "To increase the frequency of the generated voltage"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_AC_DC_SOURCES",
      "3": "CONFUSED_FREQUENCY_WITH_VOLTAGE"
    },
    "section": "Science 2365 Level 2",
    "category": "Sequential Generator Test",
    "tags": [
      "terminology",
      "conceptual",
      "generator-components"
    ],
    "learningOutcomeId": "203-TEST-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "A sequential test ensures that all parts of a system or process trigger in the intended order for safety and functional correctness."
  },
  {
    "id": 4017,
    "question": "Which type of electrical supply is typically produced by a standard commercial generator before any rectification?",
    "options": [
      "Alternating Current (AC)",
      "Direct Current (DC)",
      "Constant Static Charge",
      "High Voltage Pulse Only"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_AC_DC_SOURCES",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "CONFUSED_AC_DC_SOURCES"
    },
    "section": "Science 2365 Level 2",
    "category": "Sequential Generator Test",
    "tags": [
      "ac-dc",
      "conceptual",
      "sine-wave"
    ],
    "learningOutcomeId": "203-TEST-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Standard generators work on the principle of electromagnetic induction, which naturally produces an alternating current (AC) sine wave."
  },
  {
    "id": 4018,
    "question": "In the context of generator principles, what is the name of the stationary part of the machine that houses the coils?",
    "options": [
      "Stator",
      "Armature",
      "Commutator",
      "Rotor"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_AC_DC_GENERATOR_PARTS",
      "2": "CONFUSED_AC_DC_GENERATOR_PARTS",
      "3": "CONFUSED_AC_DC_GENERATOR_PARTS"
    },
    "section": "Science 2365 Level 2",
    "category": "Sequential Generator Test",
    "tags": [
      "generator-components",
      "discrimination",
      "terminology"
    ],
    "learningOutcomeId": "203-TEST-LO2",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "The stator is the stationary part of a generator, while the rotor is the part that rotates."
  },
  {
    "id": 4019,
    "question": "An electrician is checking a generator output. If the peak voltage (Vmax) is 325V, what is the approximate RMS voltage value used for standard calculations?",
    "options": [
      "230V",
      "460V",
      "162V",
      "325V"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "MULTIPLIED_INSTEAD",
      "2": "DIVIDED_INSTEAD",
      "3": "CONFUSED_RMS_WITH_PEAK"
    },
    "section": "Science 2365 Level 2",
    "category": "Sequential Generator Test",
    "tags": [
      "rms-peak",
      "calculation",
      "sine-wave"
    ],
    "learningOutcomeId": "203-TEST-LO2",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "The RMS value is calculated as Peak Voltage x 0.707 (or Peak / √2). 325V x 0.707 is approximately 230V."
  },
  {
    "id": 4020,
    "question": "Which rule should be applied to determine the direction of the induced current in a generator conductor?",
    "options": [
      "Fleming's Right-Hand Rule",
      "Fleming's Left-Hand Rule",
      "Ohm's Law",
      "Lenz's Law"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_I_V_R",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Science 2365 Level 2",
    "category": "Sequential Generator Test",
    "tags": [
      "electromagnetic-induction",
      "discrimination",
      "terminology"
    ],
    "learningOutcomeId": "203-TEST-LO2",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Fleming's Right-Hand Rule is used for generators (Generation = Right), whereas the Left-Hand Rule is used for motors."
  },
  {
    "id": 4021,
    "question": "Why is it vital to follow a step-by-step sequence when commissioning a new generator?",
    "options": [
      "To ensure the safety of personnel and prevent equipment damage",
      "To decrease the total power consumption of the building",
      "To ensure the voltage stays at exactly 0V during operation",
      "To convert the magnetic field into electrical resistance"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_I_V_R",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Science 2365 Level 2",
    "category": "Sequential Generator Test",
    "tags": [
      "health-safety",
      "conceptual",
      "application"
    ],
    "learningOutcomeId": "203-TEST-LO3",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Following a sequence ensures that safety interlocks are tested and that no damage occurs from unexpected electrical surges."
  },
  {
    "id": 4022,
    "question": "If a generator test requires three identical 10Ω resistors to be connected in series, what is the total resistance of the test load?",
    "options": [
      "30Ω",
      "3.33Ω",
      "10Ω",
      "0Ω"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_PARALLEL_RULE",
      "2": "TOPOLOGY_CONFUSION",
      "3": "CALCULATION_ERROR"
    },
    "section": "Science 2365 Level 2",
    "category": "Sequential Generator Test",
    "tags": [
      "series",
      "calculation",
      "resistance-rule"
    ],
    "learningOutcomeId": "203-TEST-LO3",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "In a series circuit, total resistance is the sum of all individual resistances (10 + 10 + 10 = 30)."
  },
  {
    "id": 4023,
    "question": "What unit is used to express the number of cycles per second produced by an AC generator?",
    "options": [
      "Hertz (Hz)",
      "Volts (V)",
      "Amps (A)",
      "Watts (W)"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "WRONG_UNITS",
      "2": "WRONG_UNITS",
      "3": "WRONG_UNITS"
    },
    "section": "Science 2365 Level 2",
    "category": "Sequential Generator Test",
    "tags": [
      "frequency",
      "units",
      "discrimination"
    ],
    "learningOutcomeId": "203-TEST-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 30,
    "explanation": "Frequency is measured in Hertz (Hz), representing the number of complete cycles of the sine wave per second."
  },
  {
    "id": 4024,
    "question": "During a test, if the speed of the generator's rotor is increased, what is the most likely effect on the output voltage?",
    "options": [
      "The induced voltage will increase",
      "The induced voltage will decrease",
      "The voltage will change from AC to DC",
      "The resistance of the coils will decrease"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "DIVIDED_INSTEAD",
      "2": "CONFUSED_AC_DC_SOURCES",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Science 2365 Level 2",
    "category": "Sequential Generator Test",
    "tags": [
      "electromagnetic-induction",
      "conceptual",
      "sine-wave"
    ],
    "learningOutcomeId": "203-TEST-LO2",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "According to Faraday's Law, the magnitude of induced EMF is proportional to the rate of change of magnetic flux; higher speed equals a higher rate of change."
  },
  {
    "id": 4025,
    "question": "When using a multimeter to verify the output sequence of a small generator intended for UK mains equipment, which setting should be used?",
    "options": [
      "AC Volts",
      "DC Volts",
      "Ohms (Resistance)",
      "DC Amps"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_AC_DC_SOURCES",
      "2": "CONFUSED_I_V_R",
      "3": "CONFUSED_AC_DC_SOURCES"
    },
    "section": "Science 2365 Level 2",
    "category": "Sequential Generator Test",
    "tags": [
      "application",
      "ac-dc",
      "discrimination"
    ],
    "learningOutcomeId": "203-TEST-LO3",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "UK mains and standard generators provide Alternating Current (AC), so the AC Volts setting must be used for testing output voltage."
  },
  {
    "id": 4026,
    "question": "Which component is responsible for converting the AC generated in the armature of a DC generator into a DC output at the terminals?",
    "options": [
      "Commutator",
      "Slip rings",
      "Field coils",
      "Stator"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_AC_DC_GENERATOR_PARTS",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "CONFUSED_AC_DC_GENERATOR_PARTS"
    },
    "section": "Science 2365 Level 2",
    "category": "Generator Components",
    "tags": [
      "generator-components",
      "terminology",
      "discrimination"
    ],
    "learningOutcomeId": "203-TEST-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "A commutator acts as a mechanical rectifier, reversing the connections to the external circuit as the armature rotates to ensure the output current flows in only one direction (DC)."
  },
  {
    "id": 4027,
    "question": "According to the principles of electromagnetic induction, what is required for an electromotive force (EMF) to be induced in a conductor?",
    "options": [
      "Relative motion between the conductor and a magnetic field",
      "A constant, unchanging magnetic field around a stationary wire",
      "The conductor must be connected to a DC battery source",
      "The conductor must be made of an insulating material"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_AC_DC_SOURCES",
      "3": "OTHER"
    },
    "section": "Science 2365 Level 2",
    "category": "Electromagnetic Induction",
    "tags": [
      "electromagnetic-induction",
      "conceptual",
      "magnetism"
    ],
    "learningOutcomeId": "203-TEST-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Faraday's Law states that an EMF is induced when there is a change in magnetic flux linkage, which requires relative motion between the magnetic field and the conductor."
  },
  {
    "id": 4028,
    "question": "What type of electrical output is produced by a simple generator that utilizes slip rings?",
    "options": [
      "Alternating Current (AC)",
      "Direct Current (DC)",
      "Pulsating Direct Current",
      "Static Electricity"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_AC_WITH_DC",
      "2": "CONFUSED_AC_DC_GENERATOR_PARTS",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Science 2365 Level 2",
    "category": "AC and DC",
    "tags": [
      "ac-dc",
      "sine-wave",
      "discrimination"
    ],
    "learningOutcomeId": "203-TEST-LO2",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 30,
    "explanation": "Slip rings maintain a continuous connection to the same ends of the rotating coil, allowing the naturally generated alternating current to be passed directly to the load."
  },
  {
    "id": 4029,
    "question": "If the speed of rotation of a generator is increased, what effect does this have on the induced EMF?",
    "options": [
      "The EMF increases",
      "The EMF decreases",
      "The EMF remains the same",
      "The EMF drops to zero"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "DIVIDED_INSTEAD",
      "2": "OTHER",
      "3": "OTHER"
    },
    "section": "Science 2365 Level 2",
    "category": "Electromagnetic Induction",
    "tags": [
      "electromagnetic-induction",
      "conceptual",
      "calculation"
    ],
    "learningOutcomeId": "203-TEST-LO2",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "The magnitude of induced EMF is proportional to the rate at which the magnetic flux is cut; increasing the speed increases this rate, thus increasing the EMF."
  },
  {
    "id": 4030,
    "question": "An electrician notes that a portable generator is producing a frequency of 45Hz instead of the required 50Hz. Which practical action would most likely correct this?",
    "options": [
      "Increase the speed of the engine (RPM)",
      "Increase the number of lamps connected to the circuit",
      "Replace the copper windings with aluminium",
      "Clean the commutator with an abrasive cloth"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_FREQUENCY_WITH_CURRENT",
      "2": "OTHER",
      "3": "CONFUSED_AC_DC_GENERATOR_PARTS"
    },
    "section": "Science 2365 Level 2",
    "category": "Frequency",
    "tags": [
      "frequency",
      "application",
      "generator-components"
    ],
    "learningOutcomeId": "203-TEST-LO3",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "The frequency of an AC generator is directly determined by the speed of rotation (RPM) and the number of magnetic poles. Increasing the engine speed will increase the frequency."
  },
  {
    "id": 4031,
    "question": "Which component is specifically used in a DC generator to ensure the output current flows in only one direction?",
    "options": [
      "A split-ring commutator",
      "Slip rings",
      "Field magnets",
      "An iron core armature"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_AC_DC_GENERATOR_PARTS",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Core testing principles",
    "category": "generator-components",
    "tags": [
      "ac-dc",
      "generator-components",
      "discrimination"
    ],
    "learningOutcomeId": "203-TEST-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "A split-ring commutator acts as a mechanical rectifier, reversing the connections to the external circuit every half-turn to maintain a DC output."
  },
  {
    "id": 4032,
    "question": "According to Faraday's Law of electromagnetic induction, what effect will doubling the speed of a generator's rotor have on the induced EMF?",
    "options": [
      "The induced EMF will double",
      "The induced EMF will remain the same",
      "The induced EMF will be halved",
      "The induced EMF will quadruple"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_FREQUENCY_WITH_VOLTAGE",
      "2": "DIVIDED_INSTEAD",
      "3": "MULTIPLIED_INSTEAD"
    },
    "section": "Introduction to test concepts",
    "category": "electromagnetic-induction",
    "tags": [
      "electromagnetic-induction",
      "calculation",
      "conceptual"
    ],
    "learningOutcomeId": "203-TEST-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "EMF is proportional to the rate of change of flux linkage. Doubling the speed doubles the rate at which the magnetic field lines are cut, thus doubling the voltage."
  },
  {
    "id": 4033,
    "question": "An AC generator produces a peak voltage (Vmax) of 325V. What is the approximate RMS voltage that would be measured by a standard multimeter?",
    "options": [
      "230V",
      "460V",
      "162V",
      "325V"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "MULTIPLIED_INSTEAD",
      "2": "DIVIDED_INSTEAD",
      "3": "CONFUSED_RMS_WITH_PEAK"
    },
    "section": "Practical test applications",
    "category": "rms-peak",
    "tags": [
      "rms-peak",
      "calculation",
      "units"
    ],
    "learningOutcomeId": "203-TEST-LO2",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "RMS voltage is calculated as Peak / √2 (or Peak x 0.707). 325V / 1.414 is approximately 230V."
  },
  {
    "id": 4034,
    "question": "Lenz's Law is a critical concept in generator theory. Which statement best describes its application?",
    "options": [
      "The direction of induced current always opposes the change that created it",
      "The induced current always flows in the same direction as the magnetic flux",
      "The magnitude of the current is independent of the resistance of the circuit",
      "The voltage produced is always proportional to the number of poles"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "SIGN_ERROR",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "FORMULA_NOT_REARRANGED"
    },
    "section": "Core testing principles",
    "category": "electromagnetic-induction",
    "tags": [
      "electromagnetic-induction",
      "conceptual",
      "terminology"
    ],
    "learningOutcomeId": "203-TEST-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Lenz's Law states that the direction of the induced EMF (and resulting current) is such that it creates a magnetic field that opposes the motion or change in flux that induced it."
  },
  {
    "id": 4035,
    "question": "A two-pole AC alternator is rotating at 3,000 revolutions per minute (RPM). What is the frequency of the generated output?",
    "options": [
      "50 Hz",
      "100 Hz",
      "60 Hz",
      "25 Hz"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "MULTIPLIED_INSTEAD",
      "2": "CONFUSED_FREQUENCY_WITH_VOLTAGE",
      "3": "DIVIDED_INSTEAD"
    },
    "section": "Practical test applications",
    "category": "frequency",
    "tags": [
      "frequency",
      "calculation",
      "ac-dc"
    ],
    "learningOutcomeId": "203-TEST-LO3",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "Frequency (f) = (P x N) / 120, where P is poles and N is RPM. (2 x 3000) / 120 = 50 Hz."
  },
  {
    "id": 4036,
    "question": "Which of the following describes the waveform produced by a single-loop generator BEFORE it reaches the commutator or slip rings?",
    "options": [
      "Alternating current (AC) sine wave",
      "Steady direct current (DC)",
      "Pulsating direct current (DC)",
      "Square wave"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_AC_WITH_DC",
      "2": "TOPOLOGY_CONFUSION",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Introduction to test concepts",
    "category": "sine-wave",
    "tags": [
      "sine-wave",
      "conceptual",
      "ac-dc"
    ],
    "learningOutcomeId": "203-TEST-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "The basic action of a loop rotating in a magnetic field naturally induces an alternating EMF. It only becomes DC through the action of a commutator."
  },
  {
    "id": 4037,
    "question": "In a practical generator test, an electrician finds that the output voltage is lower than expected. Which of the following would most likely cause this?",
    "options": [
      "A decrease in the strength of the magnetic field",
      "An increase in the speed of the prime mover",
      "Using more turns of wire on the armature",
      "A decrease in the resistance of the external load"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_I_V_R",
      "2": "DIVIDED_INSTEAD",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Practical test applications",
    "category": "electromagnetic-induction",
    "tags": [
      "application",
      "discrimination",
      "voltage-rule"
    ],
    "learningOutcomeId": "203-TEST-LO3",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "Induced EMF depends on flux density (magnetic field strength), the length of the conductor, and velocity. A weaker magnetic field reduces the induced voltage."
  },
  {
    "id": 4038,
    "question": "What is the primary function of the 'prime mover' in a generator system?",
    "options": [
      "To provide the mechanical energy required to rotate the armature",
      "To regulate the output voltage of the generator",
      "To provide the initial excitation current for the magnets",
      "To convert the generated AC into usable DC"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_TRANSFORMER_WITH_AC_DC",
      "3": "CONFUSED_AC_DC_SOURCES"
    },
    "section": "Introduction to test concepts",
    "category": "generator-components",
    "tags": [
      "conceptual",
      "terminology",
      "application"
    ],
    "learningOutcomeId": "203-TEST-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "The prime mover (such as a diesel engine, wind turbine, or steam turbine) provides the mechanical force needed to turn the rotor against the magnetic field."
  },
  {
    "id": 4039,
    "question": "During a sequential test of an AC alternator, at which point in the rotation cycle is the induced EMF at its absolute zero value?",
    "options": [
      "When the loop is moving parallel to the magnetic flux lines",
      "When the loop is moving at 90 degrees to the magnetic flux lines",
      "When the speed of rotation is at its maximum",
      "When the magnetic field strength is at its maximum"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_RMS_WITH_PEAK",
      "3": "SIGN_ERROR"
    },
    "section": "Core testing principles",
    "category": "sine-wave",
    "tags": [
      "sine-wave",
      "conceptual",
      "discrimination"
    ],
    "learningOutcomeId": "203-TEST-LO2",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "When the conductor moves parallel to the flux lines, it is not 'cutting' any flux, so the rate of change of flux is zero, resulting in zero induced EMF."
  },
  {
    "id": 4040,
    "question": "A technician needs to measure the frequency of a standby generator. Which instrument and setting should be used?",
    "options": [
      "A digital multimeter set to Hz",
      "An insulation resistance tester set to 500V",
      "A low-resistance ohm meter",
      "A clamp meter set to DC Amps"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "WRONG_UNITS",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "CONFUSED_AC_WITH_DC"
    },
    "section": "Practical test applications",
    "category": "units",
    "tags": [
      "application",
      "units",
      "frequency"
    ],
    "learningOutcomeId": "203-TEST-LO3",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Frequency is measured in Hertz (Hz) using a multimeter or frequency meter while the generator is running at its operational speed."
  },
  {
    "id": 4041,
    "question": "A technician measures the output of a small AC generator with a calibrated multimeter. If the meter displays a reading of 230V, what specific value does this represent in terms of the AC waveform?",
    "options": [
      "The Root Mean Square (RMS) value",
      "The Peak voltage value",
      "The Average voltage value",
      "The Peak-to-Peak voltage value"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_RMS_WITH_PEAK",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "CONFUSED_RMS_WITH_PEAK"
    },
    "section": "Science 2365 Level 2",
    "category": "Sequential Generator Test",
    "tags": [
      "ac-dc",
      "rms-peak",
      "sine-wave"
    ],
    "learningOutcomeId": "203-TEST-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Standard multimeters are designed to display the Root Mean Square (RMS) value of an AC waveform, which is the equivalent DC value that would provide the same heating effect."
  },
  {
    "id": 4042,
    "question": "In a double-wound transformer used during a circuit isolation test, what is the primary method of energy transfer between the primary and secondary windings?",
    "options": [
      "Magnetic flux linkage",
      "Direct electrical connection",
      "Electrostatic discharge",
      "Thermal conduction"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "CONFUSED_TRANSFORMER_WITH_AC_DC"
    },
    "section": "Science 2365 Level 2",
    "category": "Sequential Generator Test",
    "tags": [
      "transformers",
      "electromagnetic-induction",
      "conceptual"
    ],
    "learningOutcomeId": "203-TEST-LO2",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Double-wound transformers rely on mutual induction, where energy is transferred via a changing magnetic flux linking the two coils without a direct electrical connection."
  },
  {
    "id": 4043,
    "question": "A 3kW immersion heater is connected to a 230V supply for a functional load test. What is the approximate current flowing through the circuit?",
    "options": [
      "13.04 A",
      "0.07 A",
      "690 A",
      "7.67 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "DIVIDED_INSTEAD",
      "2": "MULTIPLIED_INSTEAD",
      "3": "FORMULA_NOT_REARRANGED"
    },
    "section": "Science 2365 Level 2",
    "category": "Sequential Generator Test",
    "tags": [
      "ohms-law",
      "calculation",
      "power"
    ],
    "learningOutcomeId": "203-TEST-LO3",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "Using the power formula P = V x I, rearranged to I = P / V: 3000W / 230V = 13.04A."
  },
  {
    "id": 4044,
    "question": "If the rotational speed of a simple AC generator is doubled while the magnetic field strength remains constant, how will this affect the output frequency?",
    "options": [
      "The frequency will double",
      "The frequency will halve",
      "The frequency remains unchanged",
      "The frequency will quadruple"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "DIVIDED_INSTEAD",
      "2": "CONFUSED_FREQUENCY_WITH_VOLTAGE",
      "3": "MULTIPLIED_INSTEAD"
    },
    "section": "Science 2365 Level 2",
    "category": "Sequential Generator Test",
    "tags": [
      "frequency",
      "generator-components",
      "conceptual"
    ],
    "learningOutcomeId": "203-TEST-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "Frequency is directly proportional to the speed of rotation (f = np/60). Doubling the speed doubles the number of cycles produced per second."
  },
  {
    "id": 4045,
    "question": "An electrician is conducting a continuity test on two identical 100Ω resistors connected in parallel. What should the total resistance reading be on the ohmmeter?",
    "options": [
      "50 Ω",
      "200 Ω",
      "100 Ω",
      "10 Ω"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_SERIES_RULE",
      "2": "TOPOLOGY_CONFUSION",
      "3": "DIVIDED_INSTEAD"
    },
    "section": "Science 2365 Level 2",
    "category": "Sequential Generator Test",
    "tags": [
      "parallel",
      "resistance-rule",
      "calculation"
    ],
    "learningOutcomeId": "203-TEST-LO2",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "For two identical resistors in parallel, the total resistance is half the value of one resistor (Rt = R / n), so 100 / 2 = 50Ω."
  },
  {
    "id": 4046,
    "question": "A step-down transformer has 400 turns on the primary coil and 20 turns on the secondary coil. If 230V AC is applied to the primary, calculate the secondary voltage.",
    "options": [
      "11.5 V",
      "4600 V",
      "46 V",
      "20 V"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "MULTIPLIED_INSTEAD",
      "2": "FORMULA_NOT_REARRANGED",
      "3": "UNITS_MISSING"
    },
    "section": "Science 2365 Level 2",
    "category": "Sequential Generator Test",
    "tags": [
      "transformers",
      "calculation",
      "application"
    ],
    "learningOutcomeId": "203-TEST-LO3",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "Using the transformer ratio (Vs/Vp = Ns/Np): Vs = 230 x (20 / 400) = 230 x 0.05 = 11.5V."
  },
  {
    "id": 4047,
    "question": "During a generator output analysis, which term describes the maximum displacement of the sine wave from the zero-volt reference line?",
    "options": [
      "Peak value",
      "RMS value",
      "Periodic time",
      "Frequency"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_RMS_WITH_PEAK",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "CONFUSED_FREQUENCY_WITH_VOLTAGE"
    },
    "section": "Science 2365 Level 2",
    "category": "Sequential Generator Test",
    "tags": [
      "sine-wave",
      "terminology",
      "conceptual"
    ],
    "learningOutcomeId": "203-TEST-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "The Peak value (or amplitude) is the maximum voltage reached by the waveform in either the positive or negative direction from the zero line."
  },
  {
    "id": 4048,
    "question": "When testing the magnetic properties of a relay component, what physical reaction occurs if two North poles are brought into close proximity?",
    "options": [
      "They will repel each other",
      "They will attract each other",
      "They will demagnetise each other",
      "No force will be generated"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "SIGN_ERROR",
      "2": "TOPOLOGY_CONFUSION",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Science 2365 Level 2",
    "category": "Sequential Generator Test",
    "tags": [
      "magnetism",
      "magnetic-poles",
      "discrimination"
    ],
    "learningOutcomeId": "203-TEST-LO2",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "A fundamental law of magnetism states that like poles (North-North or South-South) repel, while unlike poles attract."
  },
  {
    "id": 4049,
    "question": "A DC generator provides a constant 12V output to a test circuit with a total resistance of 4Ω. Calculate the power dissipated by this circuit.",
    "options": [
      "36 W",
      "3 W",
      "48 W",
      "16 W"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "FORMULA_NOT_REARRANGED",
      "2": "MULTIPLIED_INSTEAD",
      "3": "CONFUSED_I_V_R"
    },
    "section": "Science 2365 Level 2",
    "category": "Sequential Generator Test",
    "tags": [
      "power",
      "calculation",
      "ohms-law"
    ],
    "learningOutcomeId": "203-TEST-LO3",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "Power can be calculated using P = V² / R. Therefore, (12 x 12) / 4 = 144 / 4 = 36W."
  },
  {
    "id": 4050,
    "question": "Lenz's Law is a critical concept in generator testing. It states that the direction of an induced electromotive force (EMF) will always:",
    "options": [
      "Oppose the change in magnetic flux that produced it",
      "Assist the change in magnetic flux that produced it",
      "Be perpendicular to the direction of the magnetic field",
      "Be parallel to the direction of the conductor's motion"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "SIGN_ERROR",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Science 2365 Level 2",
    "category": "Sequential Generator Test",
    "tags": [
      "electromagnetic-induction",
      "conceptual",
      "discrimination"
    ],
    "learningOutcomeId": "203-TEST-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "Lenz's Law states that the induced EMF creates a current whose magnetic field opposes the change in the original magnetic flux."
  },
  {
    "id": 4051,
    "question": "When performing a sequential test on a simple AC generator, what is the primary reason for verifying the magnetic field strength before checking the output voltage?",
    "options": [
      "The induced EMF is directly proportional to the magnetic flux density",
      "The magnetic field determines the frequency of the AC output",
      "A stronger magnetic field reduces the mechanical resistance of the rotor",
      "The magnetic field must be disconnected to measure the peak-to-peak voltage"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_FREQUENCY_WITH_VOLTAGE",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "OTHER"
    },
    "section": "Science 2365 Level 2",
    "category": "electromagnetic-induction",
    "tags": [
      "electromagnetic-induction",
      "conceptual",
      "calculation"
    ],
    "learningOutcomeId": "203-TEST-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "According to Faraday's Law, the induced EMF is determined by the rate of change of flux linkage. Without a magnetic field (flux), no voltage can be induced, making it the logical first step in a sequential test."
  },
  {
    "id": 4052,
    "question": "During a diagnostic test of a generator, an electrician notices the output is pulsating DC rather than a smooth AC sine wave. Which component is likely being used in this machine?",
    "options": [
      "A commutator",
      "Slip rings",
      "An inverter",
      "A transformer"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_AC_DC_GENERATOR_PARTS",
      "2": "CONFUSED_TRANSFORMER_WITH_AC_DC",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Science 2365 Level 2",
    "category": "generator-components",
    "tags": [
      "ac-dc",
      "generator-components",
      "discrimination"
    ],
    "learningOutcomeId": "203-TEST-LO2",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "A commutator is used in DC generators to rectify the AC produced in the armature into a pulsating DC output. Slip rings are used for AC output."
  },
  {
    "id": 4053,
    "question": "A 2-pole AC generator is being tested for its frequency output. If the rotor is spinning at 3,000 revolutions per minute (RPM), what should the measured frequency be?",
    "options": [
      "50 Hz",
      "60 Hz",
      "100 Hz",
      "3,000 Hz"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "DIVIDED_INSTEAD",
      "2": "MULTIPLIED_INSTEAD",
      "3": "CONFUSED_FREQUENCY_WITH_VOLTAGE"
    },
    "section": "Science 2365 Level 2",
    "category": "frequency",
    "tags": [
      "frequency",
      "calculation",
      "sine-wave"
    ],
    "learningOutcomeId": "203-TEST-LO2",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "Frequency (f) = (P x N) / 120, where P is poles and N is RPM. (2 * 3000) / 120 = 50 Hz. Alternatively, 3000 RPM / 60 seconds = 50 revolutions per second."
  },
  {
    "id": 4054,
    "question": "In a sequential test procedure, why is it critical to distinguish between the 'Peak' voltage and the 'RMS' voltage of a generator's output?",
    "options": [
      "RMS represents the effective heating value used for circuit design",
      "Peak voltage is the only value that can be measured with a multimeter",
      "RMS voltage is always higher than the peak voltage in a sine wave",
      "Peak voltage determines the frequency of the circuit"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_RMS_WITH_PEAK",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "CONFUSED_FREQUENCY_WITH_VOLTAGE"
    },
    "section": "Science 2365 Level 2",
    "category": "rms-peak",
    "tags": [
      "rms-peak",
      "conceptual",
      "units"
    ],
    "learningOutcomeId": "203-TEST-LO3",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "The Root Mean Square (RMS) value is the equivalent DC value that would provide the same power (heating effect). Most electrical equipment is rated by its RMS value."
  },
  {
    "id": 4055,
    "question": "An electrician is testing a generator that produces a peak voltage of 339.4V. If the test requires the Root Mean Square (RMS) value for the documentation, what value should be recorded?",
    "options": [
      "240 V",
      "480 V",
      "230 V",
      "170 V"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "MULTIPLIED_INSTEAD",
      "2": "ROUNDING_ERROR",
      "3": "DIVIDED_INSTEAD"
    },
    "section": "Science 2365 Level 2",
    "category": "rms-peak",
    "tags": [
      "rms-peak",
      "calculation",
      "application"
    ],
    "learningOutcomeId": "203-TEST-LO3",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "To find RMS from Peak: RMS = Peak / √2 (or Peak * 0.707). 339.4 / 1.414 = 240V."
  },
  {
    "id": 4056,
    "question": "In a simple AC generator being tested, if the magnetic flux density (B) is doubled while the speed of rotation and conductor length remain constant, what is the specific effect on the induced EMF?",
    "options": [
      "The induced EMF will double",
      "The induced EMF will remain unchanged as it only depends on speed",
      "The induced EMF will quadruple due to the inverse square law",
      "The induced EMF will be halved to maintain energy balance"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "MULTIPLIED_INSTEAD",
      "3": "DIVIDED_INSTEAD"
    },
    "section": "Science 2365 Level 2",
    "category": "Sequential Generator Test",
    "tags": [
      "electromagnetic-induction",
      "calculation",
      "conceptual"
    ],
    "learningOutcomeId": "203-TEST-LO1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "According to the formula e = Blv, induced EMF is directly proportional to the magnetic flux density (B). Therefore, doubling B will double the induced EMF."
  },
  {
    "id": 4057,
    "question": "When performing a discrimination check on generator components, which component is uniquely required in a DC generator to provide a unidirectional output from an AC-generating armature?",
    "options": [
      "A split-ring commutator",
      "A pair of continuous slip rings",
      "Laminated permanent magnets",
      "Carbon brushes on a solid shaft"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_AC_DC_GENERATOR_PARTS",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Science 2365 Level 2",
    "category": "Sequential Generator Test",
    "tags": [
      "generator-components",
      "discrimination",
      "ac-dc"
    ],
    "learningOutcomeId": "203-TEST-LO2",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 90,
    "explanation": "A split-ring commutator acts as a mechanical rectifier, reversing the connections to the external circuit every half-turn to ensure the current flows in one direction (DC)."
  },
  {
    "id": 4058,
    "question": "During a sequence test, an AC generator's output is measured at 230V RMS. To determine the maximum voltage stress on the insulation, what is the peak voltage (Vp) of this sine wave?",
    "options": [
      "325.3V",
      "162.6V",
      "460.0V",
      "230.0V"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "DIVIDED_INSTEAD",
      "2": "MULTIPLIED_INSTEAD",
      "3": "CONFUSED_RMS_WITH_PEAK"
    },
    "section": "Science 2365 Level 2",
    "category": "Sequential Generator Test",
    "tags": [
      "rms-peak",
      "sine-wave",
      "calculation"
    ],
    "learningOutcomeId": "203-TEST-LO1",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 120,
    "explanation": "The peak voltage is calculated by multiplying the RMS voltage by the square root of 2 (approx 1.414). 230V * 1.414 = 325.22V."
  },
  {
    "id": 4059,
    "question": "If the rotational speed of an AC alternator is tripled during a controlled test, what are the simultaneous effects on the output frequency and the magnitude of the induced EMF?",
    "options": [
      "Both the frequency and the EMF magnitude will triple",
      "The frequency will triple, but the EMF magnitude will remain constant",
      "The EMF magnitude will triple, but the frequency will remain constant",
      "The frequency will triple, but the EMF magnitude will increase nine-fold"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_FREQUENCY_WITH_VOLTAGE",
      "2": "CONFUSED_FREQUENCY_WITH_VOLTAGE",
      "3": "MULTIPLIED_INSTEAD"
    },
    "section": "Science 2365 Level 2",
    "category": "Sequential Generator Test",
    "tags": [
      "frequency",
      "sine-wave",
      "conceptual"
    ],
    "learningOutcomeId": "203-TEST-LO1",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 150,
    "explanation": "Frequency is directly proportional to speed (f = np/60), and EMF is directly proportional to velocity (e=Blv). Tripling the speed triples both variables."
  },
  {
    "id": 4060,
    "question": "A technician is testing a 4-pole AC generator. What rotational speed (RPM) is required to ensure the output frequency meets the UK standard of 50Hz?",
    "options": [
      "1500 RPM",
      "3000 RPM",
      "750 RPM",
      "6000 RPM"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "FORMULA_NOT_REARRANGED",
      "2": "DIVIDED_INSTEAD",
      "3": "MULTIPLIED_INSTEAD"
    },
    "section": "Science 2365 Level 2",
    "category": "Sequential Generator Test",
    "tags": [
      "frequency",
      "calculation",
      "application"
    ],
    "learningOutcomeId": "203-TEST-LO2",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 180,
    "explanation": "Using the formula f = (P * N) / 120 (where P is poles and N is RPM): 50 = (4 * N) / 120. Rearranging gives N = (50 * 120) / 4 = 1500 RPM."
  },
  {
    "id": 4061,
    "question": "In a sequential test of generator theory, which law explains why it becomes harder to turn the prime mover as the electrical load on the generator increases?",
    "options": [
      "Lenz's Law",
      "Faraday's Law",
      "Ohm's Law",
      "Coulomb's Law"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Science 2365 Level 2",
    "category": "Sequential Generator Test",
    "tags": [
      "electromagnetic-induction",
      "conceptual",
      "discrimination"
    ],
    "learningOutcomeId": "203-TEST-LO1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "Lenz's Law states that the induced current creates a magnetic field that opposes the change that created it, resulting in mechanical resistance (back-torque) when current flows."
  },
  {
    "id": 4062,
    "question": "When inspecting a generator armature during a maintenance sequence, why is the iron core constructed from thin, insulated laminations rather than a solid block?",
    "options": [
      "To minimize energy losses caused by eddy currents",
      "To increase the total magnetic flux density of the core",
      "To allow for better cooling of the copper windings",
      "To reduce the weight of the rotor for higher speeds"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Science 2365 Level 2",
    "category": "Sequential Generator Test",
    "tags": [
      "generator-components",
      "energy",
      "conceptual"
    ],
    "learningOutcomeId": "203-TEST-LO2",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "Laminations break up the circular paths that eddy currents take in a conductor, reducing heat loss and improving efficiency."
  },
  {
    "id": 4063,
    "question": "Calculate the induced EMF produced by a single conductor 0.4m long moving at a constant velocity of 25 m/s through a uniform magnetic field with a flux density of 0.8 Tesla.",
    "options": [
      "8.0V",
      "12.5V",
      "4.0V",
      "0.32V"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "FORMULA_NOT_REARRANGED",
      "2": "DIVIDED_INSTEAD",
      "3": "UNITS_MISSING"
    },
    "section": "Science 2365 Level 2",
    "category": "Sequential Generator Test",
    "tags": [
      "calculation",
      "electromagnetic-induction",
      "application"
    ],
    "learningOutcomeId": "203-TEST-LO3",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 150,
    "explanation": "Using e = Blv: e = 0.8 T * 0.4 m * 25 m/s = 8.0V."
  },
  {
    "id": 4064,
    "question": "Which specific type of induction is being tested when a varying current in one coil induces a voltage in a nearby, electrically isolated second coil within a generator system?",
    "options": [
      "Mutual induction",
      "Self-induction",
      "Capacitive induction",
      "Static induction"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "TOPOLOGY_CONFUSION",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Science 2365 Level 2",
    "category": "Sequential Generator Test",
    "tags": [
      "electromagnetic-induction",
      "discrimination",
      "transformers"
    ],
    "learningOutcomeId": "203-TEST-LO1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 90,
    "explanation": "Mutual induction is the principle where a change in current in one coil induces an EMF in another adjacent coil via a shared magnetic field."
  },
  {
    "id": 4065,
    "question": "An electrician notes that a generator's output voltage drops significantly when a large resistive load is connected. Which adjustment would most effectively restore the voltage to 230V without changing the frequency?",
    "options": [
      "Increase the DC excitation current to the field windings",
      "Increase the rotational speed of the prime mover",
      "Decrease the number of poles in the generator",
      "Replace the armature with one having higher resistance"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_FREQUENCY_WITH_VOLTAGE",
      "2": "OTHER",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Science 2365 Level 2",
    "category": "Sequential Generator Test",
    "tags": [
      "application",
      "voltage-rule",
      "generator-components"
    ],
    "learningOutcomeId": "203-TEST-LO3",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 180,
    "explanation": "Increasing the excitation current increases the magnetic flux density (B). Since e = Blv, this increases the EMF without requiring a change in speed (v), thus keeping frequency constant."
  }
];
