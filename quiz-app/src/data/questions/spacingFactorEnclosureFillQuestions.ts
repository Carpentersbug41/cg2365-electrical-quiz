import { TaggedQuestion } from './types';

/**
 * Spacing Factor / Enclosure Fill Question Bank
 * Aligned with lesson 203-3F learning outcomes
 * Generated: 2026-02-04
 */

export const spacingFactorEnclosureFillQuestions: TaggedQuestion[] = [
  {
    "id": 4016,
    "question": "What is the standard space factor percentage used for cables installed in a conduit?",
    "options": [
      "40%",
      "45%",
      "50%",
      "100%"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "OTHER",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor",
    "tags": [
      "units",
      "terminology",
      "calculation"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "The standard space factor for conduit is 40%, meaning 60% of the internal space must remain empty to allow for heat dissipation and easy withdrawal of cables."
  },
  {
    "id": 4017,
    "question": "What is the standard space factor percentage used for cables installed in trunking?",
    "options": [
      "45%",
      "40%",
      "30%",
      "75%"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "OTHER",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor",
    "tags": [
      "units",
      "terminology",
      "calculation"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Trunking has a slightly higher allowable space factor than conduit, set at 45%."
  },
  {
    "id": 4018,
    "question": "Which of the following is a primary reason for maintaining a space factor within a cable enclosure?",
    "options": [
      "To allow heat to dissipate from the cables",
      "To increase the resistance of the conductors",
      "To ensure the cables can reach a higher peak voltage",
      "To prevent the use of circuit breakers"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_I_V_R",
      "2": "CONFUSED_RMS_WITH_PEAK",
      "3": "CONCEPTUAL"
    },
    "section": "Electrical Installations Technology",
    "category": "Enclosure Fill",
    "tags": [
      "conceptual",
      "resistance-rule"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Limiting the number of cables ensures there is enough air space to prevent overheating, which could damage insulation."
  },
  {
    "id": 4019,
    "question": "In the UK, what is the standard frequency of the AC mains supply?",
    "options": [
      "50 Hz",
      "60 Hz",
      "230 Hz",
      "100 Hz"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "CONFUSED_FREQUENCY_WITH_VOLTAGE",
      "3": "MULTIPLIED_INSTEAD"
    },
    "section": "Electrical Installations Technology",
    "category": "AC-DC",
    "tags": [
      "ac-dc",
      "frequency",
      "units"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 30,
    "explanation": "The standard frequency for the UK electricity supply is 50 Hertz (Hz)."
  },
  {
    "id": 4020,
    "question": "Which type of supply is required for a transformer to operate using mutual induction?",
    "options": [
      "Alternating Current (AC)",
      "Direct Current (DC)",
      "Steady Magnetic Field",
      "Battery Supply"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_AC_WITH_DC",
      "2": "CONCEPTUAL",
      "3": "CONFUSED_AC_DC_SOURCES"
    },
    "section": "Electrical Installations Technology",
    "category": "Transformers",
    "tags": [
      "transformers",
      "ac-dc",
      "conceptual"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Transformers require a constantly changing magnetic field to induce voltage, which is provided by Alternating Current (AC)."
  },
  {
    "id": 4021,
    "question": "What does the term 'RMS' stand for when referring to AC values?",
    "options": [
      "Root Mean Square",
      "Rated Main Supply",
      "Real Maximum Signal",
      "Resistance Measure Standard"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_RMS_WITH_PEAK",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "Waveforms",
    "tags": [
      "rms-peak",
      "sine-wave",
      "terminology"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "RMS stands for Root Mean Square, which is the effective value of an AC supply, equivalent to a DC value that produces the same heating effect."
  },
  {
    "id": 4022,
    "question": "If an electrician finds it impossible to pull an additional cable into an existing conduit, which factor has likely been exceeded?",
    "options": [
      "Space factor",
      "Diversity factor",
      "Power factor",
      "Load factor"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONCEPTUAL",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor",
    "tags": [
      "application",
      "terminology"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "The space factor limits the number of cables to ensure they can be drawn in or withdrawn without damage."
  },
  {
    "id": 4023,
    "question": "Which of these is a characteristic of a Direct Current (DC) supply?",
    "options": [
      "It flows in one direction only",
      "It constantly changes direction",
      "It is used in national grid transmission",
      "It has a sine wave frequency of 50Hz"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_AC_WITH_DC",
      "2": "CONCEPTUAL",
      "3": "CONFUSED_AC_WITH_DC"
    },
    "section": "Electrical Installations Technology",
    "category": "AC-DC",
    "tags": [
      "ac-dc",
      "discrimination"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Direct Current (DC) flows in a single direction, unlike Alternating Current (AC) which reverses direction periodically."
  },
  {
    "id": 4024,
    "question": "When calculating conduit capacity using the On-Site Guide, what is the 'Cable Factor'?",
    "options": [
      "A value based on the cable's cross-sectional area and type",
      "The length of the cable in metres",
      "The maximum current the cable can carry",
      "The resistance of the cable per metre"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "UNITS_MISSING",
      "2": "CONFUSED_I_V_R",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor",
    "tags": [
      "terminology",
      "calculation"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Cable factors are predetermined values provided in tables (like those in the On-Site Guide) to simplify the calculation of enclosure fill."
  },
  {
    "id": 4025,
    "question": "What is the peak voltage of a standard UK 230V RMS mains supply?",
    "options": [
      "Approximately 325V",
      "Exactly 230V",
      "Exactly 400V",
      "Approximately 110V"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_RMS_WITH_PEAK",
      "2": "OTHER",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "RMS-Peak",
    "tags": [
      "rms-peak",
      "calculation",
      "sine-wave"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Peak voltage is calculated as RMS x 1.414. For 230V, this is approximately 325V."
  },
  {
    "id": 4026,
    "question": "What is the primary reason for limiting the number of cables within a conduit or trunking system?",
    "options": [
      "To allow heat to dissipate and prevent the cables from overheating",
      "To ensure the magnetic field around the cables is increased",
      "To reduce the voltage drop across the length of the circuit",
      "To make the installation heavier and more stable"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "CONFUSED_I_V_R",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor",
    "tags": [
      "conceptual",
      "terminology",
      "health-safety"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "The space factor ensures there is enough air gap around cables for heat dissipation, preventing insulation damage due to overheating."
  },
  {
    "id": 4027,
    "question": "In electrical installation terms, what is the standard general space factor percentage used for cables in conduit and trunking?",
    "options": [
      "45%",
      "25%",
      "75%",
      "90%"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "OTHER",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor",
    "tags": [
      "discrimination",
      "terminology"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "The general rule for space factor in the UK is 45%, meaning the cables should occupy no more than 45% of the internal space of the enclosure."
  },
  {
    "id": 4028,
    "question": "If a section of trunking has an internal area of 2000mm² and the cables inside have a total combined cross-sectional area of 900mm², what is the percentage fill?",
    "options": [
      "45%",
      "55%",
      "22%",
      "200%"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "DIVIDED_INSTEAD",
      "3": "MULTIPLIED_INSTEAD"
    },
    "section": "Electrical Installations Technology",
    "category": "Enclosure Fill",
    "tags": [
      "calculation",
      "units"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Percentage fill is calculated by (Total Cable Area / Enclosure Area) x 100. Here: (900 / 2000) x 100 = 45%."
  },
  {
    "id": 4029,
    "question": "Which of the following factors would require an electrician to use a lower number of cables than the maximum calculated capacity for a conduit?",
    "options": [
      "The conduit run contains several 90-degree bends",
      "The conduit run is very short and straight",
      "The cables being used have very thin insulation",
      "The conduit is made of plastic instead of steel"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "OTHER",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Enclosure Fill",
    "tags": [
      "conceptual",
      "application"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "Bends increase the friction and difficulty of pulling cables through. More bends usually require more free space to prevent cable damage during installation."
  },
  {
    "id": 4030,
    "question": "When calculating cable capacity for conduit using the On-Site Guide, what do 'Cable Factors' and 'Conduit Factors' represent?",
    "options": [
      "A numerical value used to determine how many cables will fit in a specific size of conduit",
      "The weight of the cable in kilograms per meter",
      "The amount of AC voltage the conduit can safely withstand",
      "The frequency of the current flowing through the conductors"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "UNITS_MISSING",
      "2": "CONFUSED_AC_WITH_DC",
      "3": "CONFUSED_FREQUENCY_WITH_VOLTAGE"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor",
    "tags": [
      "discrimination",
      "terminology"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Cable and conduit factors are simplified numerical values provided in regulations to help electricians ensure they do not exceed the 45% space factor."
  },
  {
    "id": 4031,
    "question": "Why is it essential to maintain the correct space factor when installing cables in a conduit or trunking system?",
    "options": [
      "To allow for heat dissipation and prevent damage to cable insulation during drawing-in",
      "To ensure the cables are packed tightly enough to prevent vibration at 50Hz",
      "To increase the resistance of the circuit and reduce voltage drop",
      "To ensure that the peak voltage does not exceed the RMS rating of the conduit"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_FREQUENCY_WITH_VOLTAGE",
      "2": "CONFUSED_I_V_R",
      "3": "CONFUSED_RMS_WITH_PEAK"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor / Enclosure Fill",
    "tags": [
      "calculation",
      "explanation",
      "units"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Space factor ensures there is enough air for heat to escape and enough physical space to pull cables through without snagging or stripping the insulation."
  },
  {
    "id": 4032,
    "question": "According to the IET On-Site Guide, what is the maximum recommended space factor for cables installed in a trunking system?",
    "options": [
      "45%",
      "40%",
      "50%",
      "35%"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_SERIES_RULE",
      "2": "ROUNDING_ERROR",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor / Enclosure Fill",
    "tags": [
      "terminology",
      "legislation"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "The general rule for trunking is a 45% space factor, whereas conduit typically uses a 40% factor or a specific unit-based system."
  },
  {
    "id": 4033,
    "question": "An electrician is calculating the capacity of a conduit. If the total factor for the cables is 280 and the conduit factor for a specific 3m run is 460, what does this conclude?",
    "options": [
      "The installation is compliant as the cable factor is less than the conduit factor",
      "The conduit is overfilled and a larger diameter must be selected",
      "The run requires an additional draw-in box to reduce the AC frequency",
      "The cable factor must be multiplied by the RMS voltage to find the fill"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "DIVIDED_INSTEAD",
      "2": "CONFUSED_FREQUENCY_WITH_VOLTAGE",
      "3": "CONFUSED_RMS_WITH_PEAK"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor / Enclosure Fill",
    "tags": [
      "calculation",
      "application"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "In the unit system, compliance is achieved if the sum of the cable factors is equal to or less than the factor provided for the specific conduit size and run length."
  },
  {
    "id": 4034,
    "question": "When calculating enclosure fill, why are 'factors' used instead of simply adding the cross-sectional areas of the cables?",
    "options": [
      "Factors account for the air gaps between circular cables and the ease of pulling",
      "Factors convert the DC resistance of the cable into AC impedance",
      "Factors are used to calculate the peak-to-peak amplitude of the current",
      "Factors are only necessary when using non-magnetic trunking materials"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_AC_WITH_DC",
      "2": "CONFUSED_RMS_WITH_PEAK",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor / Enclosure Fill",
    "tags": [
      "conceptual",
      "explanation"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 75,
    "explanation": "Cables are circular; when grouped, they do not fill 100% of the space. Factors represent the 'effective' space taken up, including the air gaps between them."
  },
  {
    "id": 4035,
    "question": "A section of trunking has an internal cross-sectional area of 3000mm². Using the 45% space factor rule, what is the maximum total area available for cables?",
    "options": [
      "1350mm²",
      "1200mm²",
      "3000mm²",
      "6666mm²"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_PARALLEL_RULE",
      "2": "FORMULA_NOT_REARRANGED",
      "3": "DIVIDED_INSTEAD"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor / Enclosure Fill",
    "tags": [
      "calculation",
      "units"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "To find the usable area, multiply the total area by the space factor: 3000 x 0.45 = 1350mm²."
  },
  {
    "id": 4036,
    "question": "What is the primary risk of ignoring the space factor and overfilling a conduit run with many bends?",
    "options": [
      "Excessive mechanical stress and insulation damage during installation",
      "The magnetic field will cause the conduit to vibrate at 50Hz",
      "The RMS voltage will drop significantly across the overfilled section",
      "The cables will behave as a transformer and induce DC current"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_RMS_WITH_PEAK",
      "3": "CONFUSED_TRANSFORMER_WITH_AC_DC"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor / Enclosure Fill",
    "tags": [
      "conceptual",
      "application"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Overfilling makes pulling cables difficult, leading to potential stretching or tearing of the insulation, especially around bends where friction is highest."
  },
  {
    "id": 4037,
    "question": "How does the 'Conduit Factor' change in the sizing tables as the length of the run or the number of bends increases?",
    "options": [
      "The factor decreases to allow for fewer cables due to increased friction",
      "The factor increases because longer runs dissipate heat more efficiently",
      "The factor stays the same but the AC frequency must be adjusted",
      "The factor is multiplied by the number of bends to find the total resistance"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "MULTIPLIED_INSTEAD",
      "2": "CONFUSED_FREQUENCY_WITH_VOLTAGE",
      "3": "CONFUSED_I_V_R"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor / Enclosure Fill",
    "tags": [
      "discrimination",
      "explanation"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "As a run becomes more complex (longer or more bends), the 'Conduit Factor' in the tables decreases, meaning you can fit fewer cables in that same size pipe safely."
  },
  {
    "id": 4038,
    "question": "An electrician needs to install eight 4mm² stranded cables (factor 43 each) into a conduit. What is the total cable factor that must be used to select the conduit size?",
    "options": [
      "344",
      "5.37",
      "51",
      "43"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "DIVIDED_INSTEAD",
      "2": "USED_SERIES_RULE",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor / Enclosure Fill",
    "tags": [
      "calculation",
      "application"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Total cable factor is the number of cables multiplied by the factor for that specific cable size: 8 x 43 = 344."
  },
  {
    "id": 4039,
    "question": "Which term describes the ratio of the total cross-sectional area of cables to the internal cross-sectional area of the enclosure?",
    "options": [
      "Space Factor",
      "Diversity Factor",
      "RMS Factor",
      "Mutual Induction Ratio"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_RMS_WITH_PEAK",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor / Enclosure Fill",
    "tags": [
      "terminology",
      "discrimination"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "Space factor is the specific term used in electrical installation to define how much of a conduit or trunking is filled with cables."
  },
  {
    "id": 4040,
    "question": "When using the 'Unit System' for conduit sizing, which of the following statements is correct regarding the selection of the conduit?",
    "options": [
      "The conduit factor must be equal to or greater than the total cable factor",
      "The cable factor must be exactly double the conduit factor for AC circuits",
      "The conduit factor is calculated by dividing the RMS current by the length",
      "The cable factor is only used if the supply frequency is above 60Hz"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "MULTIPLIED_INSTEAD",
      "2": "CONFUSED_RMS_WITH_PEAK",
      "3": "CONFUSED_FREQUENCY_WITH_VOLTAGE"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor / Enclosure Fill",
    "tags": [
      "discrimination",
      "conceptual"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "To ensure compliance and ease of installation, the conduit you choose must have a 'capacity factor' that is at least as large as the sum of all the individual cable factors."
  },
  {
    "id": 4041,
    "question": "Why is it essential to maintain a maximum space factor of 45% when installing electrical cables within a trunking system?",
    "options": [
      "To allow for sufficient air circulation to dissipate heat from the cables",
      "To ensure there is enough room for future circuit additions only",
      "To prevent the cables from tangling during the drawing-in process",
      "To reduce the total weight of the containment system for fixings"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor / Enclosure Fill",
    "tags": [
      "explanation",
      "conceptual",
      "units"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "The 45% space factor in trunking is primarily to allow air to circulate around the cables, ensuring that heat generated by the current flow is dissipated to prevent insulation damage."
  },
  {
    "id": 4042,
    "question": "When using the 'unit system' for sizing conduit, which specific factor must be adjusted if the length of the run increases or more bends are added?",
    "options": [
      "The conduit factor",
      "The cable factor",
      "The percentage fill factor",
      "The voltage drop factor"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "WRONG_UNITS"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor / Enclosure Fill",
    "tags": [
      "discrimination",
      "terminology",
      "calculation"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "In the unit system found in the On-Site Guide, the cable factor remains constant for a specific cable size, but the conduit factor changes based on the length of the run and the number of bends."
  },
  {
    "id": 4043,
    "question": "An electrician is installing 6 x 2.5mm² stranded cables in a short, straight run of conduit. If the cable factor for 2.5mm² stranded is 30, what is the minimum conduit factor required for this installation?",
    "options": [
      "180",
      "5",
      "36",
      "150"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "DIVIDED_INSTEAD",
      "2": "MULTIPLIED_INSTEAD",
      "3": "ROUNDING_ERROR"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor / Enclosure Fill",
    "tags": [
      "calculation",
      "application",
      "units"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "To find the minimum conduit factor, multiply the number of cables by the cable factor: 6 cables * 30 factor = 180."
  },
  {
    "id": 4044,
    "question": "What is the standard maximum space factor percentage allowed for cables installed in a conduit system?",
    "options": [
      "35%",
      "45%",
      "50%",
      "25%"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_PARALLEL_RULE",
      "2": "OTHER",
      "3": "ROUNDING_ERROR"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor / Enclosure Fill",
    "tags": [
      "conceptual",
      "terminology"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "The space factor for conduit is 35%, whereas for trunking it is 45%. This is due to the increased difficulty of pulling cables through conduit compared to laying them in trunking."
  },
  {
    "id": 4045,
    "question": "Which of the following documents provides the standardized tables for cable and conduit factors used to calculate enclosure fill in the UK?",
    "options": [
      "The On-Site Guide (BS 7671)",
      "The Health and Safety at Work Act",
      "The Electricity at Work Regulations",
      "The Building Regulations Part P"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "OTHER",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor / Enclosure Fill",
    "tags": [
      "discrimination",
      "legislation"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "The On-Site Guide contains the specific tables (Appendix E) used for determining conduit and trunking capacities based on cable and enclosure factors."
  },
  {
    "id": 4046,
    "question": "A metal trunking has an internal cross-sectional area of 2000mm². Following the 45% space factor rule, what is the maximum total cross-sectional area that the installed cables can occupy?",
    "options": [
      "900mm²",
      "700mm²",
      "1000mm²",
      "1100mm²"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_SERIES_RULE",
      "2": "OTHER",
      "3": "RECIPROCAL_ERROR"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor / Enclosure Fill",
    "tags": [
      "calculation",
      "application"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "Using the 45% rule: 2000mm² * 0.45 = 900mm². Option 1 uses the 35% conduit rule (700mm²)."
  },
  {
    "id": 4047,
    "question": "What is the primary risk of exceeding the recommended space factor in a conduit run?",
    "options": [
      "The insulation may be damaged due to excessive heat and mechanical stress",
      "The circuit breaker will trip immediately upon energizing",
      "The magnetic field of the cables will cause the conduit to vibrate",
      "The voltage drop in the cable will decrease significantly"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_AC_DC_SOURCES",
      "3": "CONFUSED_I_V_R"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor / Enclosure Fill",
    "tags": [
      "conceptual",
      "explanation"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Exceeding space factor limits heat dissipation and increases mechanical stress during drawing-in, both of which can lead to premature failure of the cable insulation."
  },
  {
    "id": 4048,
    "question": "An installation requires 10 cables with a cable factor of 22 and 5 cables with a cable factor of 35. What is the total cable factor sum for this circuit?",
    "options": [
      "395",
      "57",
      "345",
      "1100"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "FORMULA_NOT_REARRANGED",
      "2": "ROUNDING_ERROR",
      "3": "MULTIPLIED_INSTEAD"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor / Enclosure Fill",
    "tags": [
      "calculation",
      "application"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "Total factor = (10 * 22) + (5 * 35) = 220 + 175 = 395."
  },
  {
    "id": 4049,
    "question": "Which statement correctly describes the difference between the calculation methods for conduit and trunking fill?",
    "options": [
      "Trunking fill uses a simple percentage of total area, while conduit fill uses pre-calculated factors",
      "Conduit fill uses a 45% limit while trunking fill uses a 35% limit",
      "Trunking fill calculations are only required for AC circuits",
      "Conduit fill does not take the length of the run into account"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_SERIES_RULE",
      "2": "CONFUSED_AC_DC_SOURCES",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor / Enclosure Fill",
    "tags": [
      "discrimination",
      "conceptual"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "Trunking capacity is usually calculated as 45% of the internal area. Conduit uses a system of unit factors that account for bends and length."
  },
  {
    "id": 4050,
    "question": "If a calculation shows that the total cable factor is exactly equal to the conduit factor for a specific run, what does this indicate to the installer?",
    "options": [
      "The conduit is at its maximum permitted capacity for that specific configuration",
      "The conduit is physically 100% full of copper and insulation",
      "The installer must increase the conduit size by at least one standard diameter",
      "The space factor has been exceeded by exactly 5%"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "OTHER",
      "3": "CALCULATION_ERROR"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor / Enclosure Fill",
    "tags": [
      "conceptual",
      "application"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "When the cable factor sum equals the conduit factor, it means the 35% space factor limit has been reached. It is compliant but cannot accept any more cables."
  },
  {
    "id": 4051,
    "question": "What is the primary reason for limiting the number of cables in a conduit or trunking system to a specific space factor?",
    "options": [
      "To allow for heat dissipation and prevent damage to cable insulation during drawing-in",
      "To ensure the cables remain in a straight line inside the enclosure to prevent eddy currents",
      "To allow for at least 50% future expansion of the electrical installation as per BS 7671",
      "To reduce the magnetic coupling between the phase and neutral conductors"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "OTHER",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor / Enclosure Fill",
    "tags": [
      "calculation",
      "conceptual",
      "units"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Space factors are designed to ensure cables aren't damaged by friction when being pulled in and to provide enough air space to prevent overheating during operation."
  },
  {
    "id": 4052,
    "question": "According to the On-Site Guide and general industry standards, what is the maximum recommended space factor percentage for cables installed in a trunking system?",
    "options": [
      "45%",
      "35%",
      "55%",
      "25%"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "ROUNDING_ERROR",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor / Enclosure Fill",
    "tags": [
      "terminology",
      "discrimination",
      "application"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "The standard space factor for trunking is 45%, whereas for conduit, it is typically 35% due to the increased difficulty of drawing cables through conduit."
  },
  {
    "id": 4053,
    "question": "When using the 'Unit System' (Factor Tables) to select a conduit size for a variety of different cable sizes, which rule must be followed?",
    "options": [
      "The sum of the cable factors must not exceed the conduit factor",
      "The conduit factor must be exactly double the sum of the cable factors",
      "The cable factors must be multiplied by the length of the run before comparison",
      "The conduit factor must be lower than the sum of the cable factors to ensure a tight fit"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "MULTIPLIED_INSTEAD",
      "2": "FORMULA_NOT_REARRANGED",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor / Enclosure Fill",
    "tags": [
      "calculation",
      "application",
      "units"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "In the unit system, each cable size and conduit size is assigned a factor. For a safe installation, the total sum of the cable factors must be less than or equal to the factor of the chosen conduit."
  },
  {
    "id": 4054,
    "question": "An electrician is installing several 2.5mm² thermoplastic (PVC) insulated cables into a 20mm conduit. If the run is long and contains multiple 90-degree bends, why might the effective space factor need to be treated more strictly?",
    "options": [
      "To reduce physical stress and friction on the cable insulation during the drawing-in process",
      "Because the voltage drop increases significantly when cables are bunched in conduit bends",
      "To prevent the cables from vibrating against the conduit walls due to 50Hz frequency",
      "Because the resistance of the conduit material increases as more bends are added"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_FREQUENCY_WITH_VOLTAGE",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor / Enclosure Fill",
    "tags": [
      "application",
      "conceptual",
      "discrimination"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "Bends increase the friction and mechanical tension on cables during installation. A stricter adherence to space factors (or using larger conduit) prevents insulation damage."
  },
  {
    "id": 4055,
    "question": "What does a 'Space Factor' of 45% in a trunking installation specifically refer to?",
    "options": [
      "The ratio of the total cross-sectional area of the cables to the internal cross-sectional area of the trunking",
      "The ratio of the total cable diameter to the total width of the trunking base",
      "The percentage of the trunking length that can be filled with cable joints and terminations",
      "The amount of air space required to be left at the top of the trunking for thermal ventilation"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor / Enclosure Fill",
    "tags": [
      "conceptual",
      "terminology",
      "units"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Space factor is a comparison of areas (cross-sectional), not diameters or lengths. It ensures that 55% of the internal area remains as air space."
  },
  {
    "id": 4056,
    "question": "When calculating the number of single-core cables permitted in a conduit, why is the 'unit system' of cable factors used instead of simply comparing the cross-sectional area of the cables to the internal area of the conduit?",
    "options": [
      "To account for the air gaps between cables and the friction during the drawing-in process",
      "Because the external diameter of a cable is always exactly double its cross-sectional area",
      "To ensure that the total weight of the cables does not exceed the mechanical strength of the conduit",
      "Because the unit system automatically compensates for voltage drop over long distances"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "FORMULA_NOT_REARRANGED",
      "3": "CONFUSED_I_V_R"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor",
    "tags": [
      "conceptual",
      "calculation",
      "terminology"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "The cable factor (unit system) accounts for the physical space cables take up, including the air gaps between circular cables and the mechanical ease of pulling them through without damage."
  },
  {
    "id": 4057,
    "question": "An electrician is installing 2.5mm² stranded PVC cables into a 25mm heavy-gauge plastic conduit. If the run is 6 metres long and contains two 90-degree bends, what is the primary regulatory concern regarding the 45% space factor limit?",
    "options": [
      "Preventing excessive heat build-up due to restricted airflow around the conductors",
      "Ensuring the magnetic fields of the AC current do not cause the conduit to vibrate",
      "Allowing enough room for the cables to expand linearly as the ambient temperature changes",
      "Ensuring the cables can be easily removed and replaced without dismantling the conduit"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_AC_DC_SOURCES",
      "2": "TOPOLOGY_CONFUSION",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor",
    "tags": [
      "conceptual",
      "application",
      "units"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 120,
    "explanation": "While ease of pull-in is a factor, the fundamental safety reason for space factor limits in enclosures is to prevent heat build-up (thermal insulation) which can degrade cable insulation."
  },
  {
    "id": 4058,
    "question": "A run of trunking contains several circuits. If the total sum of the cable factors is 4200 and the trunking factor for a specific size is 8000, what is the approximate percentage fill, and is it compliant with the general 45% rule?",
    "options": [
      "52.5% fill; it is non-compliant as it exceeds the 45% limit",
      "45.0% fill; it is exactly compliant with the maximum limit",
      "1.9% fill; it is compliant as it is well below the 45% limit",
      "52.5% fill; it is compliant because trunking allows for 55% fill"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "ROUNDING_ERROR",
      "2": "DIVIDED_INSTEAD",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "Enclosure Fill",
    "tags": [
      "calculation",
      "application",
      "units"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 150,
    "explanation": "Calculation: (4200 / 8000) * 100 = 52.5%. Since 52.5% is greater than the 45% standard limit for trunking, it is non-compliant."
  },
  {
    "id": 4059,
    "question": "Which of the following factors significantly changes the required conduit size for a fixed number of cables when moving from a straight 3-metre run to a 3-metre run with two sets of offsets?",
    "options": [
      "The conduit factor decreases because bends increase the difficulty of the cable draw-in",
      "The cable factor increases because the cables become longer when bent",
      "The conduit factor increases to allow more air for cooling at the bend points",
      "The space factor limit increases from 45% to 55% to accommodate the bends"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "MULTIPLIED_INSTEAD",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "USED_PARALLEL_RULE"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor",
    "tags": [
      "conceptual",
      "application",
      "discrimination"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 120,
    "explanation": "In the standard tables, the conduit factor (capacity) is reduced as more bends are added to a run to account for the increased friction and mechanical stress during installation."
  },
  {
    "id": 4060,
    "question": "When installing multiple AC circuits within the same steel trunking, what is the primary reason for ensuring that all conductors of a circuit (line and neutral) are contained within the same enclosure?",
    "options": [
      "To prevent electromagnetic induction from heating the steel trunking via eddy currents",
      "To ensure that the space factor is calculated based on a single circuit group",
      "To prevent the cables from vibrating at the 50Hz frequency of the UK mains",
      "To allow the RMS voltage to remain constant across all conductors in the enclosure"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_AC_DC_SOURCES",
      "2": "CONFUSED_FREQUENCY_WITH_VOLTAGE",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "Enclosure Fill",
    "tags": [
      "ac-dc",
      "conceptual",
      "explanation"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 150,
    "explanation": "If line and neutral are separated in a ferromagnetic enclosure (steel), the alternating magnetic field is not cancelled out, inducing eddy currents in the steel which causes significant heating."
  },
  {
    "id": 4061,
    "question": "In the context of BS 7671, what is the standard space factor percentage used for cables installed in a trunking system?",
    "options": [
      "45%",
      "35%",
      "55%",
      "25%"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "ROUNDING_ERROR",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Enclosure Fill",
    "tags": [
      "discrimination",
      "terminology"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 60,
    "explanation": "The general rule for trunking is that the total cross-sectional area of the cables should not exceed 45% of the internal cross-sectional area of the trunking."
  },
  {
    "id": 4062,
    "question": "A complex installation requires mixing 1.5mm² (factor 27), 2.5mm² (factor 39), and 4.0mm² (factor 58) cables in a straight 5m conduit run. If the total unit factor is 480, which conduit factor is the MINIMUM required for compliance?",
    "options": [
      "A conduit factor of at least 480",
      "A conduit factor of exactly 216 (45% of 480)",
      "A conduit factor of 1066 (480 divided by 0.45)",
      "A conduit factor that matches the 4.0mm² cable size only"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "DIVIDED_INSTEAD",
      "2": "MULTIPLIED_INSTEAD",
      "3": "RECIPROCAL_ERROR"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor",
    "tags": [
      "calculation",
      "units",
      "application"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 180,
    "explanation": "In the unit system, you sum the cable factors and then select a conduit with a factor equal to or greater than that sum. The 45% is already 'baked into' the factor tables."
  },
  {
    "id": 4063,
    "question": "How does the use of a 100Hz frequency supply (instead of the standard UK 50Hz) theoretically affect the heat dissipation requirements within a steel enclosure with a high space factor?",
    "options": [
      "It would increase the heating effect due to higher eddy current losses in the enclosure",
      "It would decrease the heating effect because the RMS voltage would be higher",
      "It would have no effect as space factor is only concerned with DC resistance",
      "It would allow for a higher space factor because the current alternates faster"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_FREQUENCY_WITH_VOLTAGE",
      "2": "CONFUSED_AC_WITH_DC",
      "3": "CONFUSED_RMS_WITH_PEAK"
    },
    "section": "Electrical Installations Technology",
    "category": "Enclosure Fill",
    "tags": [
      "ac-dc",
      "conceptual",
      "frequency"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 150,
    "explanation": "Higher frequencies increase eddy current and hysteresis losses in ferromagnetic materials like steel trunking, leading to more heat and potentially requiring a lower space factor or derating."
  },
  {
    "id": 4064,
    "question": "Which table in the On-Site Guide would an electrician typically consult to find the 'Cable Factors' for short straight runs of conduit up to 3 metres?",
    "options": [
      "Appendix E, Table E1",
      "Appendix A, Table A1",
      "The voltage drop tables in Part 4",
      "The IP rating classification tables"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "OTHER",
      "3": "WRONG_UNITS"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor",
    "tags": [
      "discrimination",
      "legislation"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 90,
    "explanation": "In the IET On-Site Guide, Appendix E contains the tables for cable and conduit factors used to calculate enclosure fill."
  },
  {
    "id": 4065,
    "question": "If a trunking system is found to have a 70% space factor during an inspection, what is the most likely long-term risk to the installation?",
    "options": [
      "Premature failure of the cable insulation due to thermal grouping effects",
      "The circuit breakers will trip immediately due to excessive magnetic flux",
      "The frequency of the AC supply will drop due to increased resistance",
      "The cables will fuse together due to the high RMS voltage of the UK mains"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_FREQUENCY_WITH_CURRENT",
      "2": "CONFUSED_RMS_WITH_PEAK",
      "3": "CONFUSED_I_V_R"
    },
    "section": "Electrical Installations Technology",
    "category": "Enclosure Fill",
    "tags": [
      "conceptual",
      "application",
      "health-safety"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "Overfilling an enclosure prevents air from circulating, trapping heat. This 'grouping effect' causes cables to run hotter than designed, leading to insulation degradation and potential fire."
  }
];
