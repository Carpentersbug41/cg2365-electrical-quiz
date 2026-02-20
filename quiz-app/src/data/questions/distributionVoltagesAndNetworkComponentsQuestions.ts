import { TaggedQuestion } from './types';

/**
 * Distribution Voltages and Network Components Question Bank
 * Aligned with lesson 203-5B learning outcomes
 * Generated: 2026-02-20
 */

export const distributionVoltagesAndNetworkComponentsQuestions: TaggedQuestion[] = [
  {
    "id": 4016,
    "question": "What is the standard nominal single-phase supply voltage provided to domestic properties in the UK?",
    "options": [
      "230V",
      "400V",
      "110V",
      "415V"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_AC_DC_SOURCES",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Distribution Voltages",
    "category": "Voltage Levels",
    "tags": [
      "units",
      "terminology",
      "ac-dc"
    ],
    "learningOutcomeId": "203.LO5.AC5.3",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "In the UK, the standard nominal single-phase voltage for domestic premises is 230V (+10% / -6%)."
  },
  {
    "id": 4017,
    "question": "Which component is used at a local substation to reduce the distribution voltage from 11kV to 400V/230V?",
    "options": [
      "Step-down transformer",
      "Step-up transformer",
      "Rectifier",
      "Inverter"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TRANSFORMER_WITH_AC_DC",
      "2": "CONFUSED_AC_WITH_DC",
      "3": "CONFUSED_AC_WITH_DC"
    },
    "section": "Network Components",
    "category": "Transformers",
    "tags": [
      "transformers",
      "terminology",
      "discrimination"
    ],
    "learningOutcomeId": "203.LO5.AC5.4",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "A step-down transformer is used to lower the voltage from the high distribution level (11kV) to the low voltage level (400V/230V) used by consumers."
  },
  {
    "id": 4018,
    "question": "An electrician is measuring the voltage between two different phase conductors in a standard UK three-phase system. What is the nominal reading?",
    "options": [
      "400V",
      "230V",
      "690V",
      "11,000V"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "OTHER",
      "3": "WRONG_UNITS"
    },
    "section": "Distribution Voltages",
    "category": "Voltage Levels",
    "tags": [
      "application",
      "units",
      "terminology"
    ],
    "learningOutcomeId": "203.LO5.AC5.3",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "The nominal voltage between phases (line-to-line) in a standard UK three-phase system is 400V."
  },
  {
    "id": 4019,
    "question": "At what typical voltage is electricity generated in a modern UK power station before it is stepped up for transmission?",
    "options": [
      "25kV",
      "400kV",
      "132kV",
      "230V"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Distribution Voltages",
    "category": "Generation",
    "tags": [
      "conceptual",
      "units",
      "terminology"
    ],
    "learningOutcomeId": "203.LO5.AC5.3",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "Electricity is typically generated at around 25kV at the power station before being increased for long-distance transmission."
  },
  {
    "id": 4020,
    "question": "Which part of the electricity network connects the local distribution substation directly to the consumer's cut-out?",
    "options": [
      "Service cable",
      "Transmission line",
      "Grid busbar",
      "Primary feeder"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "TOPOLOGY_CONFUSION",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Network Components",
    "category": "Components",
    "tags": [
      "discrimination",
      "terminology",
      "application"
    ],
    "learningOutcomeId": "203.LO5.AC5.4",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "The service cable is the final link in the distribution network that delivers power from the local network to the consumer's premises."
  },
  {
    "id": 4021,
    "question": "What is the standard nominal voltage between a single phase conductor and the neutral conductor in a three-phase UK supply?",
    "options": [
      "230V",
      "400V",
      "110V",
      "440V"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_AC_DC_SOURCES",
      "3": "OTHER"
    },
    "section": "Distribution Voltages",
    "category": "Voltage Levels",
    "tags": [
      "application",
      "terminology",
      "units"
    ],
    "learningOutcomeId": "203.LO5.AC5.3",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "The voltage between any single phase and the neutral (line-to-neutral) is 230V in the UK."
  },
  {
    "id": 4022,
    "question": "Why is electricity transmitted at very high voltages, such as 400kV, over the National Grid?",
    "options": [
      "To reduce energy loss through heat",
      "To increase the current flow",
      "To make the cables lighter",
      "To allow the use of smaller insulators"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_I_V_R",
      "2": "OTHER",
      "3": "OTHER"
    },
    "section": "Network Components",
    "category": "Transmission",
    "tags": [
      "conceptual",
      "explanation",
      "power"
    ],
    "learningOutcomeId": "203.LO5.AC5.4",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "High voltage transmission reduces the current required for a given power level, which significantly reduces energy losses caused by heat in the conductors (I²R losses)."
  },
  {
    "id": 4023,
    "question": "Which of these is a common 'High Voltage' (HV) level used in UK secondary distribution to industrial areas?",
    "options": [
      "11kV",
      "400V",
      "230V",
      "50V"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Distribution Voltages",
    "category": "Voltage Levels",
    "tags": [
      "discrimination",
      "units",
      "terminology"
    ],
    "learningOutcomeId": "203.LO5.AC5.3",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "11,000 volts (11kV) is the standard high voltage used for secondary distribution in the UK."
  },
  {
    "id": 4024,
    "question": "Where is the electricity supplier's main fuse (cut-out) located within a standard domestic installation?",
    "options": [
      "Before the electricity meter",
      "After the consumer unit",
      "Inside the immersion heater",
      "At the local substation"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "TOPOLOGY_CONFUSION",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Network Components",
    "category": "Components",
    "tags": [
      "application",
      "terminology",
      "discrimination"
    ],
    "learningOutcomeId": "203.LO5.AC5.4",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "The supplier's cut-out fuse is the point of entry into the property and is located before the electricity meter."
  },
  {
    "id": 4025,
    "question": "What is the primary function of the National Grid in the UK electrical network?",
    "options": [
      "To link power stations and distribute electricity nationally",
      "To generate DC electricity for domestic homes",
      "To store large amounts of electricity in batteries",
      "To increase the frequency of the electrical supply"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_AC_WITH_DC",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "CONFUSED_FREQUENCY_WITH_VOLTAGE"
    },
    "section": "Network Components",
    "category": "Transmission",
    "tags": [
      "conceptual",
      "terminology",
      "ac-dc"
    ],
    "learningOutcomeId": "203.LO5.AC5.4",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "The National Grid is the high-voltage transmission network that connects power stations to the local distribution networks across the country."
  },
  {
    "id": 4026,
    "question": "What is the nominal single-phase voltage supplied to most domestic properties in the UK?",
    "options": [
      "230 V",
      "400 V",
      "110 V",
      "240 V"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "OTHER",
      "3": "OTHER"
    },
    "section": "Installation 2365 Level 2",
    "category": "Distribution Voltages",
    "tags": [
      "units",
      "terminology",
      "discrimination"
    ],
    "learningOutcomeId": "203-5B-LO5",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "The standard nominal single-phase voltage in the UK is 230 V (+10% / -6%). While 240 V was the old standard, 230 V is the current harmonised value."
  },
  {
    "id": 4027,
    "question": "What is the primary function of a step-down transformer located in a local distribution substation?",
    "options": [
      "To reduce the distribution voltage to a level suitable for consumers",
      "To convert the alternating current (AC) supply into a direct current (DC) supply",
      "To increase the frequency of the supply from 50 Hz to 60 Hz",
      "To store electrical energy for use during peak demand periods"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TRANSFORMER_WITH_AC_DC",
      "2": "CONFUSED_FREQUENCY_WITH_VOLTAGE",
      "3": "OTHER"
    },
    "section": "Installation 2365 Level 2",
    "category": "Network Components",
    "tags": [
      "transformers",
      "conceptual",
      "conversion"
    ],
    "learningOutcomeId": "203-5B-LO5",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Step-down transformers are used to lower the high voltages used for distribution (e.g., 11,000 V) to the low voltages required by consumers (e.g., 400/230 V)."
  },
  {
    "id": 4028,
    "question": "Which of the following is the standard nominal three-phase voltage used for commercial and industrial supplies in the UK?",
    "options": [
      "400 V",
      "230 V",
      "1000 V",
      "11,000 V"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "OTHER",
      "3": "OTHER"
    },
    "section": "Installation 2365 Level 2",
    "category": "Distribution Voltages",
    "tags": [
      "units",
      "terminology",
      "discrimination"
    ],
    "learningOutcomeId": "203-5B-LO5",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "In the UK, the nominal three-phase voltage is 400 V, which is typically used for industrial machinery and larger commercial installations."
  },
  {
    "id": 4029,
    "question": "Why does the National Grid use very high voltages (such as 400,000 V) for the long-distance transmission of electricity?",
    "options": [
      "To reduce energy loss by lowering the current flowing through the lines",
      "To allow the electricity to travel faster through the cables",
      "Because high voltage is safer to handle than high current",
      "To ensure that the frequency stays exactly at 50 Hz"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "OTHER",
      "3": "CONFUSED_FREQUENCY_WITH_VOLTAGE"
    },
    "section": "Installation 2365 Level 2",
    "category": "Network Components",
    "tags": [
      "conceptual",
      "power",
      "units"
    ],
    "learningOutcomeId": "203-5B-LO5",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Transmitting power at high voltage allows for a lower current for the same amount of power. Lower current reduces the energy lost as heat (I²R losses) in the transmission lines."
  },
  {
    "id": 4030,
    "question": "An electrician is identifying the components at the intake of a new small business. Which component connects the local underground distribution main to the consumer's cut-out?",
    "options": [
      "The service cable",
      "The transmission pylon",
      "The generation turbine",
      "The primary substation"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "OTHER",
      "3": "OTHER"
    },
    "section": "Installation 2365 Level 2",
    "category": "Network Components",
    "tags": [
      "application",
      "terminology"
    ],
    "learningOutcomeId": "203-5B-LO5",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "The service cable is the final link in the distribution network that brings the electricity from the street main into the specific property."
  },
  {
    "id": 4031,
    "question": "Which voltage is most commonly used for local distribution to smaller industrial units and high-voltage consumers before being transformed down to 400V for general use?",
    "options": [
      "11,000 V",
      "33,000 V",
      "132,000 V",
      "230 V"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Distribution Voltages",
    "category": "Topic",
    "tags": [
      "terminology",
      "units",
      "application"
    ],
    "learningOutcomeId": "203-5B-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "11kV (11,000V) is the standard high-voltage distribution level used by DNOs (Distribution Network Operators) to feed local substations or large industrial customers."
  },
  {
    "id": 4032,
    "question": "Why is electricity transmitted across the National Grid at extremely high voltages, such as 400kV?",
    "options": [
      "To reduce the current and minimize energy loss through heat",
      "To increase the speed at which electrons travel through the cables",
      "To ensure the frequency remains stable at 50Hz",
      "To allow the use of smaller, lighter transformers at the power station"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_FREQUENCY_WITH_VOLTAGE",
      "3": "OTHER"
    },
    "section": "Distribution Voltages",
    "category": "Topic",
    "tags": [
      "conceptual",
      "power",
      "energy"
    ],
    "learningOutcomeId": "203-5B-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "According to P = I²R, reducing the current (by increasing voltage) significantly reduces the power lost as heat in the transmission lines."
  },
  {
    "id": 4033,
    "question": "An electrician is surveying a new housing development. Which component of the distribution network performs the final step-down of voltage to the standard 400V/230V supply for domestic consumers?",
    "options": [
      "Secondary substation",
      "Primary substation",
      "Grid supply point",
      "Step-up transformer"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "CONFUSED_TRANSFORMER_WITH_AC_DC"
    },
    "section": "Network Components",
    "category": "Topic",
    "tags": [
      "application",
      "transformers",
      "terminology"
    ],
    "learningOutcomeId": "203-5B-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 75,
    "explanation": "The secondary substation typically transforms the 11kV distribution voltage down to the 400V (three-phase) and 230V (single-phase) levels used in homes and shops."
  },
  {
    "id": 4034,
    "question": "Which component marks the legal 'point of supply' where the Distribution Network Operator's (DNO) equipment ends and the consumer's installation begins?",
    "options": [
      "The service head (cut-out) and meter",
      "The main consumer unit (fuse box)",
      "The local pole-mounted transformer",
      "The final circuit overcurrent protective device"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "TOPOLOGY_CONFUSION",
      "3": "OTHER"
    },
    "section": "Network Components",
    "category": "Topic",
    "tags": [
      "terminology",
      "application",
      "health-safety"
    ],
    "learningOutcomeId": "203-5B-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "The service head (containing the DNO fuse) and the electricity meter represent the boundary between the distributor's network and the private installation."
  },
  {
    "id": 4035,
    "question": "In the UK, what is the nominal line-to-line voltage for a standard three-phase distribution system supplied to a commercial premises?",
    "options": [
      "400 V",
      "230 V",
      "415 V",
      "11,000 V"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "UNITS_MISSING"
    },
    "section": "Distribution Voltages",
    "category": "Topic",
    "tags": [
      "terminology",
      "units",
      "sine-wave"
    ],
    "learningOutcomeId": "203-5B-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "The current UK nominal voltage for three-phase systems is 400V (formerly 415V), while single-phase is 230V (formerly 240V)."
  },
  {
    "id": 4036,
    "question": "A power station generates electricity at approximately 25kV. To transmit this efficiently to the National Grid at 400kV, what specific type of transformer arrangement is required?",
    "options": [
      "Step-up transformer",
      "Step-down transformer",
      "Isolation transformer",
      "Current transformer"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_TRANSFORMER_WITH_AC_DC",
      "3": "OTHER"
    },
    "section": "Network Components",
    "category": "Topic",
    "tags": [
      "transformers",
      "application",
      "conceptual"
    ],
    "learningOutcomeId": "203-5B-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "A step-up transformer increases the voltage from the generator (25kV) to the transmission level (400kV)."
  },
  {
    "id": 4037,
    "question": "Which of the following voltages is classified as a 'Transmission' voltage in the UK, rather than a 'Distribution' voltage?",
    "options": [
      "275,000 V",
      "33,000 V",
      "11,000 V",
      "400 V"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Distribution Voltages",
    "category": "Topic",
    "tags": [
      "discrimination",
      "terminology"
    ],
    "learningOutcomeId": "203-5B-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "Voltages of 275kV and 400kV are part of the National Grid transmission network. 33kV and 11kV are considered distribution voltages."
  },
  {
    "id": 4038,
    "question": "A distribution transformer has a turns ratio of 47.8:1. If the primary side is connected to the 11,000V distribution line, what is the approximate single-phase output voltage available to the consumer?",
    "options": [
      "230 V",
      "400 V",
      "110 V",
      "480 V"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "DIVIDED_INSTEAD",
      "3": "MULTIPLIED_INSTEAD"
    },
    "section": "Distribution Voltages",
    "category": "Topic",
    "tags": [
      "calculation",
      "transformers",
      "application"
    ],
    "learningOutcomeId": "203-5B-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "Using the transformer equation (Vp/Vs = Np/Ns), 11,000 / 47.8 ≈ 230V. This is the standard single-phase voltage."
  },
  {
    "id": 4039,
    "question": "What is the primary reason the secondary winding of a local distribution transformer is connected in a 'Star' (Wye) configuration?",
    "options": [
      "To provide a neutral point for single-phase circuits",
      "To allow the transformer to operate without an earth connection",
      "To double the available current for industrial users",
      "To prevent the transformer from overheating during peak demand"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "CONCEPTUAL"
    },
    "section": "Network Components",
    "category": "Topic",
    "tags": [
      "conceptual",
      "transformers",
      "voltage-rule"
    ],
    "learningOutcomeId": "203-5B-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "A Star connection provides a common center point which is earthed at the substation to create the Neutral conductor, allowing for both 230V (Phase-Neutral) and 400V (Phase-Phase) supplies."
  },
  {
    "id": 4040,
    "question": "In the UK distribution network, which frequency must be strictly maintained by power stations to ensure the correct operation of motors and synchronized equipment?",
    "options": [
      "50 Hz",
      "60 Hz",
      "100 Hz",
      "230 Hz"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_FREQUENCY_WITH_VOLTAGE",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "UNITS_MISSING"
    },
    "section": "Distribution Voltages",
    "category": "Topic",
    "tags": [
      "discrimination",
      "sine-wave",
      "units"
    ],
    "learningOutcomeId": "203-5B-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "The standard frequency for the UK National Grid and distribution network is 50 Hertz (cycles per second)."
  },
  {
    "id": 4041,
    "question": "The National Grid transmits electricity at very high voltages, such as 400 kV. What is the primary reason for using such high voltages for long-distance transmission?",
    "options": [
      "To reduce current, which minimizes heat loss in the conductors",
      "To increase the speed at which electricity travels through the cables",
      "To allow the use of thinner insulation on the transmission towers",
      "To ensure the frequency remains stable at 50 Hz over long distances"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_FREQUENCY_WITH_VOLTAGE",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "OTHER"
    },
    "section": "Distribution Voltages",
    "category": "Transmission",
    "tags": [
      "calculation",
      "explanation",
      "ac-dc"
    ],
    "learningOutcomeId": "203.LO5.AC5.4",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "By increasing voltage, the current required to transmit the same amount of power is reduced (P=VI). Lower current results in significantly less energy lost as heat (I²R losses)."
  },
  {
    "id": 4042,
    "question": "Which of the following voltages is most commonly used for 'primary distribution' to feed local ground-mounted substations in the UK?",
    "options": [
      "11,000 V",
      "132,000 V",
      "400 V",
      "33,000 V"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "USED_SERIES_RULE",
      "3": "OTHER"
    },
    "section": "Distribution Voltages",
    "category": "Terminology",
    "tags": [
      "discrimination",
      "terminology"
    ],
    "learningOutcomeId": "203.LO5.AC5.4",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "11kV is the standard primary distribution voltage in the UK, which is then stepped down to 400/230V at local substations."
  },
  {
    "id": 4043,
    "question": "A local substation transformer has a turns ratio designed to step down 11,000 V to 400 V. If the primary voltage from the network drops to 10,500 V, what will be the approximate secondary line voltage?",
    "options": [
      "382 V",
      "400 V",
      "419 V",
      "230 V"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "FORMULA_NOT_REARRANGED",
      "2": "MULTIPLIED_INSTEAD",
      "3": "CONFUSED_RMS_WITH_PEAK"
    },
    "section": "Network Components",
    "category": "Transformers",
    "tags": [
      "application",
      "calculation",
      "transformers"
    ],
    "learningOutcomeId": "203.LO5.AC5.4",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "The ratio is 11,000 / 400 = 27.5. Therefore, 10,500 / 27.5 = 381.81 V. Secondary voltage is proportional to primary voltage."
  },
  {
    "id": 4044,
    "question": "In a typical UK distribution substation, the secondary winding of the transformer is 'Star' connected. What is the main purpose of this configuration?",
    "options": [
      "To provide a neutral point for single-phase 230 V supplies",
      "To eliminate the need for an earth connection at the substation",
      "To increase the line voltage to 11,000 V for local consumers",
      "To ensure that the magnetic fields in the transformer cancel out"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "OTHER"
    },
    "section": "Network Components",
    "category": "Transformers",
    "tags": [
      "conceptual",
      "explanation",
      "transformers"
    ],
    "learningOutcomeId": "203.LO5.AC5.4",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "A Star (Y) connection creates a central point which is earthed at the substation to provide the Neutral conductor, allowing for 230V single-phase loads."
  },
  {
    "id": 4045,
    "question": "A large industrial factory requires a 400 V three-phase supply. Which component marks the boundary between the Distribution Network Operator (DNO) equipment and the consumer's installation?",
    "options": [
      "The service head (cut-out)",
      "The main distribution board",
      "The local 11 kV transformer",
      "The consumer's isolation switch"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "TOPOLOGY_CONFUSION",
      "3": "OTHER"
    },
    "section": "Network Components",
    "category": "Equipment",
    "tags": [
      "application",
      "terminology"
    ],
    "learningOutcomeId": "203.LO5.AC5.4",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "The service head (or cut-out) contains the DNO's main fuse and is the point where the utility supply ends and the consumer's meter/installation begins."
  },
  {
    "id": 4046,
    "question": "Electricity is moved from the National Grid (400 kV / 275 kV) to the regional 'Distribution' networks at which specific voltage level?",
    "options": [
      "132 kV",
      "11 kV",
      "230 V",
      "400 V"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "WRONG_UNITS",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "OTHER"
    },
    "section": "Distribution Voltages",
    "category": "Terminology",
    "tags": [
      "discrimination",
      "units"
    ],
    "learningOutcomeId": "203.LO5.AC5.4",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "In the UK, 132kV is generally considered the threshold where transmission ends and regional distribution begins."
  },
  {
    "id": 4047,
    "question": "What is the function of 'Switchgear' within a local distribution substation?",
    "options": [
      "To provide protection and isolation for the network circuits",
      "To convert AC voltage into DC for domestic use",
      "To step down the voltage from 11,000 V to 400 V",
      "To measure the total energy consumed by the local street"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TRANSFORMER_WITH_AC_DC",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "OTHER"
    },
    "section": "Network Components",
    "category": "Equipment",
    "tags": [
      "conceptual",
      "explanation"
    ],
    "learningOutcomeId": "203.LO5.AC5.4",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Switchgear consists of fuses, circuit breakers, and switches used to isolate equipment and protect the network from faults."
  },
  {
    "id": 4048,
    "question": "An electrician is working on a site where the measured voltage between two phases of a four-wire supply is 400 V. What would be the expected voltage between any one phase and the neutral?",
    "options": [
      "230 V",
      "400 V",
      "690 V",
      "0 V"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "MULTIPLIED_INSTEAD",
      "2": "DIVIDED_INSTEAD",
      "3": "CONFUSED_I_V_R"
    },
    "section": "Distribution Voltages",
    "category": "Calculations",
    "tags": [
      "application",
      "voltage-rule",
      "calculation"
    ],
    "learningOutcomeId": "203.LO5.AC5.3",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "In a standard UK three-phase system, the line voltage (phase-to-phase) is 400V, and the phase voltage (phase-to-neutral) is 230V (400 / √3)."
  },
  {
    "id": 4049,
    "question": "Why are single-phase domestic properties in a single street usually connected to different phases (L1, L2, or L3) of the local distribution main?",
    "options": [
      "To balance the total load across the three phases of the transformer",
      "To ensure that if one house has a fault, the whole street loses power",
      "To increase the voltage available to each individual house to 400 V",
      "To allow the houses to share a single common fuse in the substation"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "OTHER"
    },
    "section": "Distribution Voltages",
    "category": "System Design",
    "tags": [
      "conceptual",
      "explanation"
    ],
    "learningOutcomeId": "203.LO5.AC5.3",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "Distributing houses across the three phases helps keep the load balanced, which improves efficiency and prevents the neutral conductor from carrying excessive current."
  },
  {
    "id": 4050,
    "question": "Which component is used to link the underground low-voltage distribution cables to the service cables entering individual properties?",
    "options": [
      "A link box or feeder pillar",
      "A 132 kV pylon",
      "A step-up transformer",
      "A high-voltage circuit breaker"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "WRONG_UNITS",
      "3": "OTHER"
    },
    "section": "Network Components",
    "category": "Equipment",
    "tags": [
      "discrimination",
      "terminology"
    ],
    "learningOutcomeId": "203.LO5.AC5.4",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Link boxes and feeder pillars are used in the low-voltage (400/230V) network to join cables, provide test points, and house fuses."
  },
  {
    "id": 4051,
    "question": "Which of the following voltages is typically used for the high-capacity 'super-grid' transmission of electricity across the UK National Grid?",
    "options": [
      "400 kV",
      "11 kV",
      "33 kV",
      "230 V"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Installation 2365 Level 2",
    "category": "Distribution Voltages",
    "tags": [
      "terminology",
      "units",
      "discrimination"
    ],
    "learningOutcomeId": "203-5B-LO5",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "400 kV and 275 kV are the primary transmission voltages used by the National Grid to move power over long distances with minimal loss."
  },
  {
    "id": 4052,
    "question": "What is the primary function of a local distribution transformer located within a residential area substation?",
    "options": [
      "To step down the voltage from 11 kV to 400 V / 230 V",
      "To step up the voltage to 33 kV for long-distance travel",
      "To convert the AC supply into a DC supply for domestic use",
      "To increase the frequency of the supply to exactly 50 Hz"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_TRANSFORMER_WITH_AC_DC",
      "3": "CONFUSED_FREQUENCY_WITH_VOLTAGE"
    },
    "section": "Installation 2365 Level 2",
    "category": "Network Components",
    "tags": [
      "transformers",
      "conceptual",
      "conversion"
    ],
    "learningOutcomeId": "203-5B-LO5",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 75,
    "explanation": "Local substations step down the 11,000 V (11 kV) distribution voltage to the standard 400 V (three-phase) and 230 V (single-phase) levels used by consumers."
  },
  {
    "id": 4053,
    "question": "A new industrial unit is being supplied directly from the 11 kV network. Which component must be installed on-site to provide a standard 400 V three-phase supply for their machinery?",
    "options": [
      "A step-down transformer",
      "A step-up transformer",
      "An electricity meter",
      "A primary busbar chamber"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Installation 2365 Level 2",
    "category": "Network Components",
    "tags": [
      "transformers",
      "application",
      "terminology"
    ],
    "learningOutcomeId": "203-5B-LO5",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "To transition from a high-voltage (11 kV) distribution line to a low-voltage (400 V) usable supply, a step-down transformer is required."
  },
  {
    "id": 4054,
    "question": "In a domestic electrical installation, which component is owned by the DNO and contains the main service fuse?",
    "options": [
      "The cut-out",
      "The consumer unit",
      "The electricity meter",
      "The isolator switch"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Installation 2365 Level 2",
    "category": "Network Components",
    "tags": [
      "terminology",
      "discrimination",
      "health-safety"
    ],
    "learningOutcomeId": "203-5B-LO5",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "The cut-out is the property of the Distribution Network Operator (DNO) and houses the main service fuse, marking the point where the network enters the property."
  },
  {
    "id": 4055,
    "question": "According to the UK statutory requirements (ESQCR), if the nominal supply voltage is 230 V, what is the minimum allowable voltage at the consumer's intake?",
    "options": [
      "216.2 V",
      "207.0 V",
      "218.5 V",
      "230.0 V"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "SIGN_ERROR",
      "2": "OTHER",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Installation 2365 Level 2",
    "category": "Distribution Voltages",
    "tags": [
      "calculation",
      "units",
      "legislation"
    ],
    "learningOutcomeId": "203-5B-LO5",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "The UK voltage tolerance is +10% / -6%. For a 230 V supply, the minimum voltage is 230 V - 6%, which equals 216.2 V."
  },
  {
    "id": 4056,
    "question": "Why is the voltage significantly increased to 132kV or 400kV for long-distance transmission across the UK National Grid?",
    "options": [
      "To reduce the current, which minimizes power losses due to the heating effect in conductors",
      "To increase the speed of electricity flow to ensure it reaches consumers faster",
      "To allow the use of smaller, less expensive ceramic insulators on the pylon arms",
      "To match the high frequency generated by the steam turbines in the power stations"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "UNITS_MISSING",
      "3": "CONFUSED_FREQUENCY_WITH_VOLTAGE"
    },
    "section": "Installation 2365 Level 2",
    "category": "Distribution Voltages",
    "tags": [
      "power",
      "units",
      "calculation"
    ],
    "learningOutcomeId": "203.LO5.AC5.3",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 120,
    "explanation": "According to P = I²R, reducing the current (by increasing voltage for the same power) exponentially reduces the power lost as heat in the transmission lines."
  },
  {
    "id": 4057,
    "question": "Which of the following voltage levels is typically classified as 'Extra High Voltage' (EHV) within the regional distribution network before it reaches local substations?",
    "options": [
      "33,000V",
      "11,000V",
      "400,000V",
      "1,000V"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "WRONG_UNITS",
      "2": "TOPOLOGY_CONFUSION",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Installation 2365 Level 2",
    "category": "Distribution Voltages",
    "tags": [
      "terminology",
      "units",
      "application"
    ],
    "learningOutcomeId": "203.LO5.AC5.3",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 90,
    "explanation": "In the UK distribution context, 33kV is considered EHV. 11kV is standard HV, 400kV is Transmission, and 1,000V is the upper limit for LV."
  },
  {
    "id": 4058,
    "question": "An industrial site is supplied by a private 11kV/400V transformer. What is the specific purpose of the 'Star' connection on the secondary side of this transformer?",
    "options": [
      "To create a neutral point, allowing for both 230V and 400V supplies and an earth reference",
      "To increase the line voltage to 690V for heavy industrial machinery requirements",
      "To ensure that the phase current and line current remain identical to prevent overheating",
      "To eliminate the need for a high-voltage circuit breaker on the primary side"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "FORMULA_NOT_REARRANGED",
      "2": "CONFUSED_I_V_R",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Installation 2365 Level 2",
    "category": "Network Components",
    "tags": [
      "transformers",
      "voltage-rule",
      "application"
    ],
    "learningOutcomeId": "203.LO5.AC5.4",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 120,
    "explanation": "The star connection provides a common neutral point. This allows for 230V (Phase to Neutral) and 400V (Phase to Phase) and provides a path for fault currents to return to the source."
  },
  {
    "id": 4059,
    "question": "In the UK distribution system, what is the primary function of a 'Step-up' transformer located immediately after the generation stage?",
    "options": [
      "To increase voltage while decreasing current to allow for smaller conductor cross-sections",
      "To increase both voltage and current to maximize the total power available to the grid",
      "To convert the generated DC voltage into AC voltage for the transmission network",
      "To change the frequency from 50Hz to 400Hz to improve transmission efficiency"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "MULTIPLIED_INSTEAD",
      "2": "CONFUSED_AC_WITH_DC",
      "3": "CONFUSED_FREQUENCY_WITH_VOLTAGE"
    },
    "section": "Installation 2365 Level 2",
    "category": "Network Components",
    "tags": [
      "transformers",
      "conceptual",
      "power"
    ],
    "learningOutcomeId": "203.LO5.AC5.4",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "Transformers maintain power (P=VI). By stepping up voltage, the current must decrease, which allows for smaller, lighter, and cheaper conductors to be used on pylons."
  },
  {
    "id": 4060,
    "question": "Which component in a primary substation is designed to maintain a constant output voltage on the 11kV network despite fluctuations in the incoming supply or varying consumer demand?",
    "options": [
      "On-load tap changer",
      "Surge arrester",
      "Isolating link",
      "Current transformer"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "TOPOLOGY_CONFUSION",
      "3": "OTHER"
    },
    "section": "Installation 2365 Level 2",
    "category": "Network Components",
    "tags": [
      "transformers",
      "discrimination",
      "application"
    ],
    "learningOutcomeId": "203.LO5.AC5.4",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 120,
    "explanation": "An on-load tap changer adjusts the number of turns on the transformer windings while the transformer is energized, allowing for fine-tuning of the output voltage."
  },
  {
    "id": 4061,
    "question": "When comparing overhead lines to underground cables for 33kV distribution, what is a significant technical challenge associated with long underground cable runs?",
    "options": [
      "High capacitance of the cable requiring compensation for reactive power",
      "The increased risk of lightning strikes affecting the buried conductors",
      "The inability to use XLPE insulation at voltages higher than 11kV",
      "The requirement to use DC current to prevent the skin effect in the insulation"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "WRONG_UNITS",
      "3": "CONFUSED_AC_WITH_DC"
    },
    "section": "Installation 2365 Level 2",
    "category": "Network Components",
    "tags": [
      "conceptual",
      "application",
      "ac-dc"
    ],
    "learningOutcomeId": "203.LO5.AC5.4",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 150,
    "explanation": "Underground cables act like giant capacitors due to the proximity of the conductor to the earth. This creates 'charging current' which must be managed in long distribution runs."
  },
  {
    "id": 4062,
    "question": "Why is the primary winding of a standard 11kV/400V ground-mounted distribution transformer usually connected in 'Delta'?",
    "options": [
      "To allow the 11kV supply to be delivered using only three conductors without a neutral",
      "To ensure that the secondary phase voltage is always 1.73 times higher than the line voltage",
      "To provide a path for zero-sequence currents to flow directly to the local earth rod",
      "To reduce the physical size of the transformer core by 50%"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_SERIES_RULE",
      "2": "RECIPROCAL_ERROR",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Installation 2365 Level 2",
    "category": "Network Components",
    "tags": [
      "transformers",
      "conceptual",
      "voltage-rule"
    ],
    "learningOutcomeId": "203.LO5.AC5.4",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 120,
    "explanation": "Delta connections do not require a neutral conductor, making them ideal for the 3-wire 11kV distribution network, saving material costs on long cable runs."
  },
  {
    "id": 4063,
    "question": "Identify the correct sequence of typical voltage levels as electricity travels from a UK power station to a residential consumer's intake point.",
    "options": [
      "25kV → 400kV → 132kV → 11kV → 400V",
      "11kV → 33kV → 400kV → 132kV → 230V",
      "400V → 11kV → 132kV → 400kV → 11kV",
      "25kV → 11kV → 33kV → 132kV → 400V"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "WRONG_UNITS",
      "3": "OTHER"
    },
    "section": "Installation 2365 Level 2",
    "category": "Distribution Voltages",
    "tags": [
      "discrimination",
      "units",
      "terminology"
    ],
    "learningOutcomeId": "203.LO5.AC5.3",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 90,
    "explanation": "Generation is typically at 25kV, stepped up to 400kV (Transmission), then down to 132kV (Regional), then 11kV (Local), and finally 400V/230V (Consumer)."
  },
  {
    "id": 4064,
    "question": "A technician is working near a pole-mounted transformer in a rural village. Which of the following is the most likely transformation ratio for this specific piece of equipment?",
    "options": [
      "11,000V to 400V/230V",
      "132,000V to 11,000V",
      "400V to 110V",
      "33,000V to 132,000V"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "WRONG_UNITS",
      "3": "MULTIPLIED_INSTEAD"
    },
    "section": "Installation 2365 Level 2",
    "category": "Network Components",
    "tags": [
      "application",
      "transformers",
      "units"
    ],
    "learningOutcomeId": "203.LO5.AC5.4",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 90,
    "explanation": "Pole-mounted transformers are the final stage of the distribution network in rural areas, converting the 11kV HV supply to the 400V/230V LV supply for consumers."
  },
  {
    "id": 4065,
    "question": "What is the primary technical reason for using 'Bundled Conductors' (multiple cables per phase) on 400kV transmission pylons?",
    "options": [
      "To reduce Corona Discharge and lower the inductive reactance of the line",
      "To provide mechanical redundancy in case one conductor snaps due to wind loading",
      "To allow the transmission of different frequencies on the same pylon structure",
      "To increase the total resistance of the line to limit potential fault currents"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_FREQUENCY_WITH_VOLTAGE",
      "3": "RESISTANCE_RULE"
    },
    "section": "Installation 2365 Level 2",
    "category": "Network Components",
    "tags": [
      "conceptual",
      "discrimination",
      "application"
    ],
    "learningOutcomeId": "203.LO5.AC5.4",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 150,
    "explanation": "Bundling conductors increases the effective radius of the phase, which reduces the electric field strength at the surface, thereby reducing Corona losses and noise."
  }
];
