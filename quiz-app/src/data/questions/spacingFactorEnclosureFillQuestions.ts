import { TaggedQuestion } from './types';

/**
 * Spacing Factor / Enclosure Fill Question Bank
 * Aligned with lesson 203-3F learning outcomes
 * Generated: 2026-02-04
 */

export const spacingFactorEnclosureFillQuestions: TaggedQuestion[] = [
  {
    "id": 4016,
    "question": "In electrical installations, what is the definition of the term 'space factor'?",
    "options": [
      "The percentage of an enclosure's internal area occupied by cables",
      "The total weight of the cables inside a conduit",
      "The length of the conduit run between two inspection bends",
      "The thickness of the insulation on a single-core cable"
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
      "terminology",
      "conceptual"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Space factor (or enclosure fill) specifically refers to the ratio of the total cross-sectional area of cables to the internal cross-sectional area of the conduit or trunking, expressed as a percentage."
  },
  {
    "id": 4017,
    "question": "What is a primary safety risk associated with overfilling a conduit with too many cables?",
    "options": [
      "Heat buildup due to restricted airflow",
      "An increase in the supply frequency",
      "The conduit becoming magnetic",
      "The cables becoming too cold"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_FREQUENCY_WITH_VOLTAGE",
      "2": "OTHER",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor / Enclosure Fill",
    "tags": [
      "health-safety",
      "conceptual"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Cables generate heat when carrying current. If a conduit is overfilled, there is less air to circulate and dissipate that heat, which can lead to insulation breakdown and fire risks."
  },
  {
    "id": 4018,
    "question": "Which dimension must be used when calculating the available cross-sectional area of a conduit?",
    "options": [
      "Internal diameter",
      "External diameter",
      "Wall thickness",
      "Outside circumference"
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
      "units"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Cables are installed inside the conduit, so only the internal diameter (ID) determines the space available for the cables."
  },
  {
    "id": "4019",
    "question": "An overfilled trunking system makes it difficult to pull cables through. This most likely leads to which type of problem?",
    "options": [
      "Mechanical damage to the cable insulation",
      "A decrease in the circuit voltage",
      "The trunking changing from AC to DC",
      "An increase in the resistance of the copper conductor"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_I_V_R",
      "2": "CONFUSED_AC_WITH_DC",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor / Enclosure Fill",
    "tags": [
      "application",
      "health-safety"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "High friction and snagging in overfilled enclosures often result in the insulation being scraped or torn, which can cause short circuits or earth faults."
  },
  {
    "id": 4020,
    "question": "What is the correct formula to find the internal cross-sectional area of a rectangular trunking?",
    "options": [
      "Width × Height",
      "Width + Height",
      "π × radius²",
      "Length × Diameter"
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
      "calculation",
      "discrimination"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Trunking is rectangular, so its area is calculated by multiplying the internal width by the internal height."
  },
  {
    "id": 4021,
    "question": "Calculate the internal area of a section of trunking that measures 50 mm by 25 mm.",
    "options": [
      "1250 mm²",
      "75 mm²",
      "150 mm²",
      "314 mm²"
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
      "calculation",
      "units"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Area = Width × Height. Therefore, 50 mm × 25 mm = 1250 mm²."
  },
  {
    "id": 4022,
    "question": "If the total cross-sectional area of all cables in a conduit is 150 mm² and the internal area of the conduit is 600 mm², what is the percentage fill?",
    "options": [
      "25%",
      "4%",
      "400%",
      "15%"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "DIVIDED_INSTEAD",
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
    "explanation": "% Fill = (Total Cable Area / Enclosure Area) × 100. (150 / 600) × 100 = 0.25 × 100 = 25%."
  },
  {
    "id": 4023,
    "question": "When calculating the area of a circular cable (πr²), if the overall diameter is 10 mm, what value should be used for the radius (r)?",
    "options": [
      "5 mm",
      "20 mm",
      "10 mm",
      "100 mm"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "MULTIPLIED_INSTEAD",
      "2": "OTHER",
      "3": "MULTIPLIED_INSTEAD"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor / Enclosure Fill",
    "tags": [
      "discrimination",
      "calculation"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "The radius (r) is exactly half of the diameter (d). If the diameter is 10 mm, the radius is 5 mm."
  },
  {
    "id": 4024,
    "question": "Why is it professional practice to leave spare capacity (headroom) when calculating space factor?",
    "options": [
      "To allow for future additions or maintenance",
      "To increase the resistance of the circuit",
      "To ensure the trunking remains air-tight",
      "To reduce the weight of the building"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_I_V_R",
      "2": "OTHER",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor / Enclosure Fill",
    "tags": [
      "conceptual",
      "terminology"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Leaving spare capacity ensures that if the installation needs to be expanded later, new cables can be added without replacing the existing containment."
  },
  {
    "id": 4025,
    "question": "Which of the following would be the most suitable unit for expressing the total cross-sectional area of a cable?",
    "options": [
      "mm²",
      "mm",
      "m³",
      "kg"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "WRONG_UNITS",
      "2": "WRONG_UNITS",
      "3": "WRONG_UNITS"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor / Enclosure Fill",
    "tags": [
      "units",
      "discrimination"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 30,
    "explanation": "Area is a two-dimensional measurement and in electrical installations is almost always measured in square millimetres (mm²)."
  },
  {
    "id": 4026,
    "question": "Which of the following best defines the term 'space factor' in an electrical installation?",
    "options": [
      "The percentage of the internal area of an enclosure occupied by cables",
      "The total length of cable that can be pulled through a single conduit",
      "The distance between the support clips on a run of trunking",
      "The thickness of the insulation surrounding a copper conductor"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor / Enclosure Fill",
    "tags": [
      "terminology",
      "conceptual"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Space factor is the ratio of the total cross-sectional area of the cables to the internal cross-sectional area of the conduit or trunking, usually expressed as a percentage."
  },
  {
    "id": 4027,
    "question": "What is a primary safety risk associated with overfilling a conduit with too many cables?",
    "options": [
      "Excessive heat buildup leading to insulation breakdown",
      "An increase in the supply frequency of the circuit",
      "The cables becoming too heavy for the wall fixings",
      "A reduction in the resistance of the conductors"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_FREQUENCY_WITH_VOLTAGE",
      "2": "OTHER",
      "3": "CONFUSED_I_V_R"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor / Enclosure Fill",
    "tags": [
      "explanation",
      "health-safety"
    ],
    "learningOutcomeId": "203-3F-LO2",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Cables generate heat when carrying current; if they are packed too tightly, air cannot circulate to cool them, leading to overheating and potential fire hazards."
  },
  {
    "id": 4028,
    "question": "An electrician is calculating the space factor for a length of trunking. If the internal area of the trunking is 2,000 mm² and the total area of the cables is 500 mm², what is the percentage fill?",
    "options": [
      "25%",
      "4%",
      "40%",
      "75%"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "DIVIDED_INSTEAD",
      "2": "ROUNDING_ERROR",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor / Enclosure Fill",
    "tags": [
      "calculation",
      "units"
    ],
    "learningOutcomeId": "203-3F-LO3",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "To find the percentage fill, divide the cable area by the enclosure area and multiply by 100: (500 / 2000) x 100 = 25%."
  },
  {
    "id": 4029,
    "question": "When determining the space factor for a conduit installation, which measurement of the conduit must be used in the calculation?",
    "options": [
      "Internal diameter",
      "External diameter",
      "Wall thickness",
      "Total length"
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
      "discrimination",
      "terminology"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "The space available for cables is determined by the internal diameter of the conduit. Using the external diameter would result in an incorrect calculation of the available area."
  },
  {
    "id": 4030,
    "question": "A high space factor in a conduit run with several bends is likely to cause which mechanical problem during installation?",
    "options": [
      "Scraping or tearing of the cable insulation",
      "An increase in the magnetic pull of the cables",
      "The conduit expanding due to air pressure",
      "The cables becoming impossible to strip"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "OTHER",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor / Enclosure Fill",
    "tags": [
      "application",
      "health-safety"
    ],
    "learningOutcomeId": "203-3F-LO2",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "High friction in overfilled conduits, especially around bends, makes pulling difficult and frequently leads to mechanical damage of the cable's outer sheath or insulation."
  },
  {
    "id": 4031,
    "question": "What is the primary reason for limiting the 'space factor' within a conduit or trunking system?",
    "options": [
      "To prevent heat build-up and avoid mechanical damage to insulation during pulling",
      "To ensure that the resistance of the cables remains as high as possible",
      "To allow the cables to vibrate freely when carrying alternating current",
      "To reduce the overall weight of the installation for structural safety"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_AC_WITH_DC",
      "3": "OTHER"
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
    "explanation": "Space factor limits ensure there is enough air for heat dissipation and enough physical room to pull cables through without tearing the insulation."
  },
  {
    "id": 4032,
    "question": "When calculating the available internal area of a 25mm steel conduit, which measurement is critical for an accurate space factor result?",
    "options": [
      "The internal diameter of the conduit",
      "The external diameter of the conduit",
      "The thickness of the conduit wall",
      "The total length of the conduit run"
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
      "terminology",
      "discrimination",
      "units"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "Space factor is based on the usable space inside the enclosure; therefore, the internal diameter must be used to calculate the area."
  },
  {
    "id": 4033,
    "question": "An electrician is installing four cables, each with an overall diameter of 4mm, into a conduit with an internal diameter of 20mm. What is the approximate percentage fill (space factor)?",
    "options": [
      "16%",
      "80%",
      "64%",
      "4%"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "MULTIPLIED_INSTEAD",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor / Enclosure Fill",
    "tags": [
      "calculation",
      "application",
      "units"
    ],
    "learningOutcomeId": "203-3F-LO3",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 120,
    "explanation": "Cable area = π × 2² = 12.57mm². Total cable area (4 cables) = 50.28mm². Conduit area = π × 10² = 314.16mm². Fill = (50.28 / 314.16) × 100 ≈ 16%."
  },
  {
    "id": 4034,
    "question": "What is the likely consequence of installing AC circuits in a trunking system that exceeds the recommended space factor?",
    "options": [
      "The cables may overheat due to restricted airflow around the conductors",
      "The frequency of the AC supply will decrease due to magnetic interference",
      "The RMS voltage will increase as cables are squeezed closer together",
      "The circuit will automatically convert from AC to DC due to pressure"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_FREQUENCY_WITH_VOLTAGE",
      "2": "CONFUSED_RMS_WITH_PEAK",
      "3": "CONFUSED_AC_WITH_DC"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor / Enclosure Fill",
    "tags": [
      "ac-dc",
      "conceptual",
      "application"
    ],
    "learningOutcomeId": "203-3F-LO2",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "High space factor prevents air from circulating, which is necessary to dissipate the heat generated by the current flowing through the cables."
  },
  {
    "id": 4035,
    "question": "If a trunking has internal dimensions of 100mm x 50mm and contains cables with a total cross-sectional area of 1500mm², what is the space factor?",
    "options": [
      "30%",
      "3.3%",
      "50%",
      "15%"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "DIVIDED_INSTEAD",
      "2": "OTHER",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor / Enclosure Fill",
    "tags": [
      "calculation",
      "units"
    ],
    "learningOutcomeId": "203-3F-LO3",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 75,
    "explanation": "Trunking area = 100 × 50 = 5000mm². % Fill = (1500 / 5000) × 100 = 30%."
  },
  {
    "id": 4036,
    "question": "Which of the following describes the term 'Cross-Sectional Area' (CSA) in the context of cable fill calculations?",
    "options": [
      "The area of the circle formed by the total outside diameter of the cable",
      "The length of the cable multiplied by its diameter",
      "The area of the copper conductor only, excluding insulation",
      "The thickness of the insulation wrapped around the conductor"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "MULTIPLIED_INSTEAD",
      "2": "CONFUSED_TERMINOLOGY",
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
    "estimatedTime": 60,
    "explanation": "For space factor, we use the total area occupied by the cable, which includes the conductor and its insulation/sheath."
  },
  {
    "id": 4037,
    "question": "An installation requires a maximum space factor of 45%. If the trunking area is 2500mm², what is the maximum permissible total cable area?",
    "options": [
      "1125 mm²",
      "2500 mm²",
      "5555 mm²",
      "1250 mm²"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "DIVIDED_INSTEAD",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor / Enclosure Fill",
    "tags": [
      "calculation",
      "application"
    ],
    "learningOutcomeId": "203-3F-LO4",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "Maximum area = (45 / 100) × 2500 = 1125mm²."
  },
  {
    "id": 4038,
    "question": "When using the formula A = πr² to find the area of a conduit, what common error results in a 'Space Factor' that is four times larger than it should be?",
    "options": [
      "Using the diameter instead of the radius in the formula",
      "Using the radius instead of the diameter in the formula",
      "Forgetting to multiply the final result by 100",
      "Dividing the area of the cables by the area of the conduit"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "OTHER",
      "3": "DIVIDED_INSTEAD"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor / Enclosure Fill",
    "tags": [
      "calculation",
      "discrimination"
    ],
    "learningOutcomeId": "203-3F-LO3",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "If the diameter is used instead of the radius, the squared value becomes (2r)², which is 4r², making the calculated area four times larger."
  },
  {
    "id": 4039,
    "question": "A technician is unable to pull the final cable into a conduit run despite the calculations suggesting it should fit. What is the most likely practical cause?",
    "options": [
      "The run contains several sharp bends which increase friction",
      "The AC frequency is causing the cables to expand physically",
      "The conduit has been earthed, reducing the internal space",
      "The cables are being repelled by the magnetic field of the conduit"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_FREQUENCY_WITH_VOLTAGE",
      "2": "OTHER",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor / Enclosure Fill",
    "tags": [
      "application",
      "conceptual"
    ],
    "learningOutcomeId": "203-3F-LO2",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Even if the space factor is technically within limits, physical obstructions like bends increase friction and mechanical resistance during installation."
  },
  {
    "id": 4040,
    "question": "Which factor is most likely to be improved by maintaining a low space factor in a new trunking installation?",
    "options": [
      "Ease of future additions and maintenance",
      "The voltage rating of the cable insulation",
      "The frequency of the alternating current",
      "The resistivity of the copper conductors"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "CONFUSED_FREQUENCY_WITH_VOLTAGE",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor / Enclosure Fill",
    "tags": [
      "conceptual",
      "application"
    ],
    "learningOutcomeId": "203-3F-LO2",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "Leaving spare capacity (low space factor) allows for easier maintenance and the addition of more circuits in the future without replacing the enclosure."
  },
  {
    "id": 4041,
    "question": "Which of the following best defines the term 'space factor' in an electrical installation?",
    "options": [
      "The percentage of the internal cross-sectional area of an enclosure occupied by cables",
      "The total weight of the cables divided by the length of the conduit run",
      "The external diameter of the conduit compared to the wall thickness",
      "The ratio of the cable length to the number of bends in the containment"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor / Enclosure Fill",
    "tags": [
      "terminology",
      "explanation",
      "units"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "Space factor is the ratio of the total cross-sectional area of the cables to the internal cross-sectional area of the conduit or trunking, expressed as a percentage."
  },
  {
    "id": 4042,
    "question": "Why is it critical to use the internal diameter (ID) rather than the external diameter (OD) when calculating the space factor of a conduit?",
    "options": [
      "The internal area is the only space available for cable capacity",
      "The external diameter changes depending on the AC frequency",
      "The internal diameter is used to calculate the RMS voltage drop",
      "The external diameter is only relevant for DC grounding systems"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_FREQUENCY_WITH_VOLTAGE",
      "2": "CONFUSED_RMS_WITH_PEAK",
      "3": "CONFUSED_AC_WITH_DC"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor / Enclosure Fill",
    "tags": [
      "conceptual",
      "calculation",
      "units"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "The external diameter includes the thickness of the conduit wall; only the internal space (ID) can actually house the cables."
  },
  {
    "id": 4043,
    "question": "A conduit has an internal area of 400 mm². It contains cables with a combined cross-sectional area of 120 mm². What is the calculated space factor?",
    "options": [
      "30%",
      "333%",
      "48%",
      "12%"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "RECIPROCAL_ERROR",
      "2": "MULTIPLIED_INSTEAD",
      "3": "DIVIDED_INSTEAD"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor / Enclosure Fill",
    "tags": [
      "calculation",
      "units"
    ],
    "learningOutcomeId": "203-3F-LO3",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "(Total Cable Area / Enclosure Area) x 100 = (120 / 400) x 100 = 30%."
  },
  {
    "id": 4044,
    "question": "What is the primary risk associated with overfilling a trunking that carries AC power cables?",
    "options": [
      "Excessive heat build-up leading to insulation degradation",
      "A significant increase in the supply frequency (Hz)",
      "The conversion of AC current into DC current within the enclosure",
      "The reduction of the peak voltage to the RMS value"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_FREQUENCY_WITH_CURRENT",
      "2": "CONFUSED_AC_DC_SOURCES",
      "3": "CONFUSED_RMS_WITH_PEAK"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor / Enclosure Fill",
    "tags": [
      "conceptual",
      "health-safety",
      "ac-dc"
    ],
    "learningOutcomeId": "203-3F-LO2",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "Overfilling restricts airflow and prevents heat dissipation. In AC circuits, current flow generates heat, and if trapped, it can melt insulation and cause fires."
  },
  {
    "id": 4045,
    "question": "An electrician is calculating the fill for a 50mm x 37.5mm trunking. What is the internal cross-sectional area of this enclosure?",
    "options": [
      "1875 mm²",
      "175 mm²",
      "87.5 mm²",
      "3125 mm²"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "SIGN_ERROR",
      "2": "DIVIDED_INSTEAD",
      "3": "USED_PARALLEL_RULE"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor / Enclosure Fill",
    "tags": [
      "calculation",
      "application"
    ],
    "learningOutcomeId": "203-3F-LO3",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "For rectangular trunking, Area = Width x Height. 50mm x 37.5mm = 1875 mm²."
  },
  {
    "id": 4046,
    "question": "A single cable has an overall diameter of 10mm. If an electrician needs to install three of these cables, what is the total cable area to be used in the space factor calculation? (Use π = 3.14)",
    "options": [
      "235.5 mm²",
      "942.0 mm²",
      "30.0 mm²",
      "78.5 mm²"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_PARALLEL_RULE",
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
    "learningOutcomeId": "203-3F-LO3",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "Radius = 5mm. Area of one cable = πr² = 3.14 x 25 = 78.5 mm². Total for three cables = 78.5 x 3 = 235.5 mm²."
  },
  {
    "id": 4047,
    "question": "Which statement correctly describes the relationship between cable heat and enclosure fill in UK mains installations?",
    "options": [
      "Cables packed tightly together have higher thermal resistance to the surrounding air",
      "Increasing the space factor reduces the RMS current in the circuit",
      "The 50Hz frequency prevents heat build-up in overfilled trunking",
      "Space factor only applies to DC circuits because AC cables do not generate heat"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_I_V_R",
      "2": "CONFUSED_FREQUENCY_WITH_CURRENT",
      "3": "CONFUSED_AC_WITH_DC"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor / Enclosure Fill",
    "tags": [
      "conceptual",
      "ac-dc",
      "explanation"
    ],
    "learningOutcomeId": "203-3F-LO2",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "Tightly packed cables reduce the surface area exposed to air, making it harder for heat to escape, which increases the risk of overheating."
  },
  {
    "id": 4048,
    "question": "An installation requires a space factor of no more than 45%. If the enclosure area is 1000 mm² and the cables occupy 480 mm², is this installation acceptable?",
    "options": [
      "No, because the fill is 48%, which exceeds the limit",
      "Yes, because the fill is 4.8%, which is well below the limit",
      "No, because the area must be calculated using the peak voltage",
      "Yes, because space factor limits only apply to conduit, not trunking"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "ROUNDING_ERROR",
      "2": "CONFUSED_RMS_WITH_PEAK",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor / Enclosure Fill",
    "tags": [
      "application",
      "discrimination",
      "calculation"
    ],
    "learningOutcomeId": "203-3F-LO4",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Fill = (480 / 1000) x 100 = 48%. Since 48% is greater than the 45% limit, it is not acceptable."
  },
  {
    "id": 4049,
    "question": "When comparing conduit and trunking, which is generally true regarding space factor and future-proofing?",
    "options": [
      "Trunking typically allows for easier addition of future cables due to its shape and accessibility",
      "Conduit must always be filled to 100% to maintain the AC sine wave",
      "Space factor is ignored in trunking because it is rectangular",
      "Only DC circuits require a space factor calculation in conduit"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_AC_WITH_DC",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "CONFUSED_AC_DC_SOURCES"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor / Enclosure Fill",
    "tags": [
      "conceptual",
      "discrimination"
    ],
    "learningOutcomeId": "203-3F-LO2",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Good workmanship involves leaving spare capacity in trunking for future maintenance and additions, whereas conduit is harder to pull new cables through if near its limit."
  },
  {
    "id": 4050,
    "question": "A transformer output is wired using conduit. If the output current increases, why might the electrician need to re-evaluate the conduit's space factor?",
    "options": [
      "Increased current leads to more heat, which requires better dissipation space",
      "Increased current changes the internal diameter of the conduit",
      "The frequency of the transformer output will increase with the load",
      "The space factor must be reduced to allow for higher peak voltages"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "FORMULA_NOT_REARRANGED",
      "2": "CONFUSED_FREQUENCY_WITH_CURRENT",
      "3": "CONFUSED_RMS_WITH_PEAK"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor / Enclosure Fill",
    "tags": [
      "application",
      "transformers",
      "ac-dc"
    ],
    "learningOutcomeId": "203-3F-LO2",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "Higher current flow results in more thermal energy (I²R losses). If a conduit is already near its space factor limit, the extra heat might not dissipate, risking damage."
  },
  {
    "id": 4051,
    "question": "What is the primary reason for limiting the space factor (enclosure fill) in an electrical conduit installation?",
    "options": [
      "To prevent heat build-up and avoid damage to cable insulation during installation",
      "To ensure the conduit is heavy enough to be supported by standard clips",
      "To reduce the total resistance of the conductors within the enclosure",
      "To allow the air inside the conduit to act as a primary insulator"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_I_V_R",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor / Enclosure Fill",
    "tags": [
      "calculation",
      "conceptual",
      "health-safety"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Limiting the space factor ensures there is enough air to dissipate heat and prevents high friction, which could tear cable insulation when pulling cables through."
  },
  {
    "id": 4052,
    "question": "How is the 'space factor' of a cable enclosure correctly defined in electrical installation work?",
    "options": [
      "The percentage of the internal cross-sectional area of the enclosure occupied by cables",
      "The ratio of the external diameter of the conduit to the total number of cables",
      "The total length of the cable run divided by the internal volume of the trunking",
      "The distance between the support saddles used to secure the conduit"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "OTHER",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor / Enclosure Fill",
    "tags": [
      "terminology",
      "units",
      "discrimination"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "Space factor is the ratio of the total cross-sectional area of the cables to the internal cross-sectional area of the enclosure, expressed as a percentage."
  },
  {
    "id": 4053,
    "question": "A section of trunking has internal dimensions of 50 mm x 50 mm. If it contains several cables with a total combined cross-sectional area of 1,125 mm², what is the space factor?",
    "options": [
      "45%",
      "22.5%",
      "50%",
      "11.25%"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "ROUNDING_ERROR",
      "3": "DIVIDED_INSTEAD"
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
    "explanation": "First, calculate the trunking area: 50mm x 50mm = 2500mm². Then calculate the percentage: (1125 / 2500) x 100 = 45%."
  },
  {
    "id": 4054,
    "question": "When calculating the available area for cables inside a conduit, which measurement must be used to ensure the space factor is accurate?",
    "options": [
      "The internal diameter of the conduit",
      "The external diameter of the conduit",
      "The wall thickness of the conduit material",
      "The total circumference of the conduit"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "OTHER",
      "3": "FORMULA_NOT_REARRANGED"
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
    "estimatedTime": 60,
    "explanation": "Cables occupy the space inside the conduit, so the internal diameter (ID) must be used to calculate the available cross-sectional area."
  },
  {
    "id": 4055,
    "question": "An electrician is struggling to pull three 6mm² cables through a 20mm conduit with several 90-degree bends. What is the most likely risk if they force the cables through?",
    "options": [
      "The insulation may be scraped or torn, leading to potential short circuits",
      "The frequency of the AC supply will fluctuate due to cable compression",
      "The magnetic field of the cables will be trapped inside the conduit",
      "The voltage will increase because the cables are packed tighter together"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_FREQUENCY_WITH_VOLTAGE",
      "2": "OTHER",
      "3": "CONFUSED_I_V_R"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor / Enclosure Fill",
    "tags": [
      "application",
      "conceptual",
      "health-safety"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "Forcing cables into an overfilled enclosure or through tight bends causes mechanical stress and friction, which can damage the insulation and lead to electrical faults."
  },
  {
    "id": 4056,
    "question": "An electrician is installing several circuits into a 100mm x 50mm steel trunking. If the total cross-sectional area of all cables is 2,250 mm², what is the calculated space factor?",
    "options": [
      "45%",
      "22.5%",
      "50%",
      "2.22%"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "FORMULA_NOT_REARRANGED",
      "2": "MULTIPLIED_INSTEAD",
      "3": "DIVIDED_INSTEAD"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor / Enclosure Fill",
    "tags": [
      "calculation",
      "units",
      "terminology"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "The space factor is (Total Cable Area / Enclosure Area) x 100. Enclosure Area = 100mm x 50mm = 5,000 mm². Space Factor = (2,250 / 5,000) x 100 = 45%."
  },
  {
    "id": 4057,
    "question": "Which of the following describes the primary thermal risk associated with exceeding the recommended space factor in a conduit?",
    "options": [
      "Trapped air gaps between cables act as insulation, preventing heat dissipation to the enclosure walls",
      "The increased friction during installation causes the copper conductors to work-harden and increase resistance",
      "The magnetic fields of the cables overlap more intensely, causing induced heating in the conduit material",
      "The cables will physically expand and crack the conduit due to lack of expansion room"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "TOPOLOGY_CONFUSION",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor / Enclosure Fill",
    "tags": [
      "conceptual",
      "explanation"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 120,
    "explanation": "Overfilling reduces the volume of air around cables. Since air is needed to carry heat away to the enclosure surface, tightly packed cables retain heat, leading to insulation degradation."
  },
  {
    "id": 4058,
    "question": "A 25mm internal diameter conduit contains four cables, each with an overall diameter of 8mm. What is the approximate percentage fill of this conduit?",
    "options": [
      "41%",
      "32%",
      "51%",
      "10%"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_SERIES_RULE",
      "2": "ROUNDING_ERROR",
      "3": "RECIPROCAL_ERROR"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor / Enclosure Fill",
    "tags": [
      "calculation",
      "mixed-circuit"
    ],
    "learningOutcomeId": "203-3F-LO3",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 150,
    "explanation": "Conduit Area = π x (12.5)² ≈ 490.87 mm². Single Cable Area = π x (4)² ≈ 50.27 mm². Total Cable Area = 4 x 50.27 = 201.08 mm². Fill = (201.08 / 490.87) x 100 ≈ 40.96%."
  },
  {
    "id": 4059,
    "question": "When calculating space factor for a complex installation, why must the 'overall diameter' of the cable be used rather than the conductor's cross-sectional area (e.g., 2.5mm²)?",
    "options": [
      "The space occupied in the enclosure includes the insulation and any protective sheathing",
      "The conductor area is only relevant for DC circuits, whereas overall diameter is for AC",
      "The insulation thickness changes the frequency of the current flowing through the cable",
      "BS 7671 requires calculations to be based on the external surface area of the copper only"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_AC_WITH_DC",
      "2": "CONFUSED_FREQUENCY_WITH_VOLTAGE",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor / Enclosure Fill",
    "tags": [
      "discrimination",
      "conceptual"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "Space factor is a physical measurement of volume/area. The insulation and sheathing take up physical space within the conduit, so the 'overall diameter' is the only relevant dimension for fill calculations."
  },
  {
    "id": 4060,
    "question": "An installation requires a 45% maximum space factor. A 50mm x 50mm trunking is being used. What is the maximum total cross-sectional area of cables allowed?",
    "options": [
      "1,125 mm²",
      "2,500 mm²",
      "1,250 mm²",
      "5,555 mm²"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "DIVIDED_INSTEAD",
      "2": "UNITS_MISSING",
      "3": "MULTIPLIED_INSTEAD"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor / Enclosure Fill",
    "tags": [
      "calculation",
      "application"
    ],
    "learningOutcomeId": "203-3F-LO4",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "Trunking Area = 50 x 50 = 2,500 mm². 45% of 2,500 = 0.45 x 2,500 = 1,125 mm²."
  },
  {
    "id": 4061,
    "question": "Which of the following is a mechanical consequence of pulling cables into a conduit that has exceeded its space factor limit?",
    "options": [
      "Excessive friction causing the outer insulation to stretch or tear",
      "The cables will vibrate at 50Hz and cause the conduit fixings to loosen",
      "The voltage drop across the cable will increase due to the compression of the atoms",
      "A vacuum is created within the conduit which prevents the flow of electrons"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_FREQUENCY_WITH_CURRENT",
      "2": "CONFUSED_I_V_R",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor / Enclosure Fill",
    "tags": [
      "conceptual",
      "application"
    ],
    "learningOutcomeId": "203-3F-LO2",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 90,
    "explanation": "Overfilled conduits result in high friction during the 'pulling-in' phase, which can snag and tear the insulation, leading to potential short circuits or earth faults."
  },
  {
    "id": 4062,
    "question": "A technician needs to choose between two conduits. Conduit A has an internal diameter of 20mm. Conduit B has an internal diameter of 25mm. How much more cable area can Conduit B hold compared to Conduit A?",
    "options": [
      "Approximately 56% more area",
      "Exactly 25% more area",
      "Approximately 20% more area",
      "Exactly 5mm more area"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "WRONG_UNITS",
      "2": "FORMULA_NOT_REARRANGED",
      "3": "SIGN_ERROR"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor / Enclosure Fill",
    "tags": [
      "calculation",
      "discrimination"
    ],
    "learningOutcomeId": "203-3F-LO3",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 180,
    "explanation": "Area A = π x 10² = 314.16. Area B = π x 12.5² = 490.87. (490.87 / 314.16) = 1.56, which is a 56% increase. This highlights that small changes in diameter result in large changes in area."
  },
  {
    "id": 4063,
    "question": "In the context of UK electrical installations, why is 'future-proofing' considered a reason for maintaining a lower space factor?",
    "options": [
      "To allow for the addition of further circuits without replacing the entire containment system",
      "To ensure that the 50Hz frequency has enough space to oscillate within the trunking",
      "Because the cables will naturally grow in diameter as they age due to copper oxidation",
      "To prevent the magnetic field from reaching the outside of the trunking"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_FREQUENCY_WITH_VOLTAGE",
      "2": "OTHER",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor / Enclosure Fill",
    "tags": [
      "conceptual",
      "application"
    ],
    "learningOutcomeId": "203-3F-LO2",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 90,
    "explanation": "Professional workmanship involves leaving spare capacity (headroom) so that future modifications or additional circuits can be installed easily without violating safety limits."
  },
  {
    "id": 4064,
    "question": "An electrician is calculating the fill for a 50mm x 50mm trunking containing 12 cables. If each cable has an overall diameter of 10mm, what is the status of the installation based on a 45% limit?",
    "options": [
      "It is overfilled at approximately 37.7%",
      "It is acceptable at approximately 37.7%",
      "It is acceptable at approximately 12%",
      "It is overfilled at approximately 48%"
    ],
    "correctAnswer": 1,
    "misconceptionCodes": {
      "1": "ROUNDING_ERROR",
      "2": "USED_SERIES_RULE",
      "3": "MULTIPLIED_INSTEAD"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor / Enclosure Fill",
    "tags": [
      "calculation",
      "application"
    ],
    "learningOutcomeId": "203-3F-LO4",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 180,
    "explanation": "Trunking Area = 2500 mm². Cable Area (1) = π x 5² = 78.54. Total Cable Area = 12 x 78.54 = 942.48. Fill = (942.48 / 2500) x 100 = 37.7%. This is below the 45% limit, so it is acceptable."
  },
  {
    "id": 4065,
    "question": "Which dimension is used to calculate the 'Available Internal Area' of a circular conduit for space factor purposes?",
    "options": [
      "The internal diameter (ID)",
      "The external diameter (OD)",
      "The wall thickness multiplied by pi",
      "The circumference of the outer wall"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "WRONG_UNITS",
      "3": "FORMULA_NOT_REARRANGED"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor / Enclosure Fill",
    "tags": [
      "discrimination",
      "units"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 60,
    "explanation": "The cables are placed inside the conduit; therefore, the external diameter is irrelevant to the available space. Only the internal diameter determines the usable cross-sectional area."
  }
];
