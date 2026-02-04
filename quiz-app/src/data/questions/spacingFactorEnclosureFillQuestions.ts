import { TaggedQuestion } from './types';

/**
 * Spacing Factor / Enclosure Fill Question Bank
 * Aligned with lesson 202-3F learning outcomes
 * Generated: 2026-02-04
 */

export const spacingFactorEnclosureFillQuestions: TaggedQuestion[] = [
  {
    "id": 4016,
    "question": "What is the definition of 'space factor' (enclosure fill) in an electrical installation?",
    "options": [
      "The percentage of an enclosure's internal space occupied by cables",
      "The total weight of the cables inside a conduit",
      "The length of the trunking divided by the number of cables",
      "The outside diameter of the containment system"
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
    "learningOutcomeId": "202-3F-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Space factor is the ratio of the total cross-sectional area of the cables to the internal cross-sectional area of the enclosure, expressed as a percentage."
  },
  {
    "id": 4017,
    "question": "When calculating the space factor for a conduit, which dimension must be used for the calculation?",
    "options": [
      "The internal diameter",
      "The external diameter",
      "The wall thickness",
      "The total length of the run"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor / Enclosure Fill",
    "tags": [
      "discrimination",
      "units"
    ],
    "learningOutcomeId": "202-3F-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Only the internal space is available for cables; using the external diameter would result in an incorrect and unsafe calculation."
  },
  {
    "id": 4018,
    "question": "What is a primary thermal risk of overfilling a cable trunking?",
    "options": [
      "Heat cannot dissipate, leading to insulation breakdown",
      "The trunking will melt instantly due to the current",
      "The circuit voltage will increase to dangerous levels",
      "The cables will become magnetic and stick together"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "CONFUSED_I_V_R",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor / Enclosure Fill",
    "tags": [
      "conceptual",
      "explanation"
    ],
    "learningOutcomeId": "202-3F-LO2",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Cables generate heat; if they are packed too tightly, air cannot circulate to cool them, which damages the insulation over time."
  },
  {
    "id": 4019,
    "question": "Why is it difficult and risky to pull cables through a conduit that has a high space factor?",
    "options": [
      "Increased friction can cause mechanical damage to cable insulation",
      "The conduit will expand and become loose from its fixings",
      "The cables will shrink in length if they are too tight",
      "The air inside the conduit will become pressurized"
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
      "conceptual",
      "application"
    ],
    "learningOutcomeId": "202-3F-LO2",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "High friction during installation in an overfilled conduit can tear or scrape the cable insulation, leading to potential short circuits."
  },
  {
    "id": 4020,
    "question": "A piece of trunking has internal dimensions of 50 mm by 50 mm. What is its internal cross-sectional area?",
    "options": [
      "2500 mm²",
      "100 mm²",
      "200 mm²",
      "250 mm²"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_SERIES_RULE",
      "2": "MULTIPLIED_INSTEAD",
      "3": "ROUNDING_ERROR"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor / Enclosure Fill",
    "tags": [
      "calculation",
      "units"
    ],
    "learningOutcomeId": "202-3F-LO3",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Area of a rectangle = width × height. 50 mm × 50 mm = 2500 mm²."
  },
  {
    "id": 4021,
    "question": "Which formula correctly identifies the percentage fill of an enclosure?",
    "options": [
      "(Total cable area ÷ Enclosure internal area) × 100",
      "(Enclosure internal area ÷ Total cable area) × 100",
      "(Total cable area + Enclosure internal area) × 100",
      "(Total cable area × Enclosure internal area) ÷ 100"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "RECIPROCAL_ERROR",
      "2": "OTHER",
      "3": "MULTIPLIED_INSTEAD"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor / Enclosure Fill",
    "tags": [
      "discrimination",
      "terminology"
    ],
    "learningOutcomeId": "202-3F-LO3",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "To find the percentage, you divide the part (cables) by the whole (enclosure) and multiply by 100."
  },
  {
    "id": 4022,
    "question": "If the total area of all cables is 400 mm² and the internal area of the trunking is 1000 mm², what is the space factor?",
    "options": [
      "40%",
      "4%",
      "2.5%",
      "60%"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "UNITS_MISSING",
      "2": "RECIPROCAL_ERROR",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor / Enclosure Fill",
    "tags": [
      "calculation",
      "application"
    ],
    "learningOutcomeId": "202-3F-LO3",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "(400 ÷ 1000) × 100 = 0.4 × 100 = 40%."
  },
  {
    "id": 4023,
    "question": "What is a practical benefit of leaving spare capacity in a trunking installation?",
    "options": [
      "It allows for future additions or circuit modifications",
      "It makes the trunking lighter and easier to fix to the wall",
      "It reduces the cost of the cables being installed",
      "It increases the supply frequency of the circuits"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "OTHER",
      "3": "CONFUSED_FREQUENCY_WITH_VOLTAGE"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor / Enclosure Fill",
    "tags": [
      "conceptual",
      "application"
    ],
    "learningOutcomeId": "202-3F-LO2",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Good workmanship includes planning for the future; leaving space allows new circuits to be added without replacing the containment."
  },
  {
    "id": 4024,
    "question": "Which unit is standard for calculating the internal cross-sectional area of conduit and trunking?",
    "options": [
      "mm²",
      "mm",
      "cm",
      "m²"
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
      "discrimination",
      "units"
    ],
    "learningOutcomeId": "202-3F-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 30,
    "explanation": "Cross-sectional area is measured in square millimeters (mm²) in the UK electrical industry."
  },
  {
    "id": 4025,
    "question": "When using the formula Area = πr² to find the area of a circular conduit, what does 'r' represent?",
    "options": [
      "The internal radius (half the internal diameter)",
      "The full external diameter",
      "The thickness of the conduit wall",
      "The total length of the conduit pipe"
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
      "calculation"
    ],
    "learningOutcomeId": "202-3F-LO3",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "In the area formula for a circle, 'r' is the radius, which is exactly half of the internal diameter."
  },
  {
    "id": 4026,
    "question": "What is the definition of 'space factor' (enclosure fill) in an electrical installation?",
    "options": [
      "The percentage of the enclosure's internal area occupied by cables",
      "The total length of the conduit used in a circuit",
      "The external diameter of the conduit or trunking",
      "The weight of the cables relative to the enclosure"
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
      "terminology",
      "conceptual"
    ],
    "learningOutcomeId": "202-3F-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Space factor is the ratio of the total cross-sectional area of the cables to the internal cross-sectional area of the conduit or trunking, expressed as a percentage."
  },
  {
    "id": 4027,
    "question": "What is a primary risk of overfilling a conduit with electrical cables?",
    "options": [
      "Excessive heat buildup due to restricted airflow",
      "An increase in the supply frequency",
      "The conduit becoming magnetic",
      "A reduction in the supply voltage from the transformer"
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
      "conceptual"
    ],
    "learningOutcomeId": "202-3F-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Overfilled enclosures prevent air from circulating around cables, which leads to heat buildup and can damage cable insulation over time."
  },
  {
    "id": 4028,
    "question": "When calculating the available space inside a conduit, which measurement is used?",
    "options": [
      "Internal diameter",
      "External diameter",
      "Wall thickness",
      "Overall length"
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
      "terminology",
      "discrimination"
    ],
    "learningOutcomeId": "202-3F-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Cables are installed inside the conduit, so the internal diameter is the dimension that determines the available cross-sectional area."
  },
  {
    "id": 4029,
    "question": "A section of trunking has an internal area of 2000 mm². If the total area of the installed cables is 500 mm², what is the percentage fill?",
    "options": [
      "25%",
      "4%",
      "40%",
      "1500%"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "DIVIDED_INSTEAD",
      "2": "ROUNDING_ERROR",
      "3": "MULTIPLIED_INSTEAD"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor / Enclosure Fill",
    "tags": [
      "calculation",
      "units"
    ],
    "learningOutcomeId": "202-3F-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 60,
    "explanation": "Percentage fill is (Total Cable Area / Enclosure Area) x 100. Therefore, (500 / 2000) x 100 = 25%."
  },
  {
    "id": 4030,
    "question": "An electrician struggles to pull cables through a conduit run with several bends. Which factor is most likely to cause damage to the cable insulation in this scenario?",
    "options": [
      "The conduit is overfilled, increasing friction",
      "The supply is AC instead of DC",
      "The cable conductor is made of copper",
      "The conduit is installed vertically"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_AC_WITH_DC",
      "2": "OTHER",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor / Enclosure Fill",
    "tags": [
      "application",
      "conceptual"
    ],
    "learningOutcomeId": "202-3F-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "High space factor (overfilling) increases friction during the pulling-in process, which can lead to mechanical damage of the insulation, especially at bends."
  },
  {
    "id": 4031,
    "question": "Which of the following best defines the term 'space factor' in relation to electrical enclosures?",
    "options": [
      "The percentage of the internal cross-sectional area of an enclosure occupied by cables",
      "The total length of cable that can be pulled through a conduit without using lubricant",
      "The external diameter of a conduit divided by the number of cables inside",
      "The thickness of the insulation on a cable compared to the conduit wall thickness"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "DIVIDED_INSTEAD",
      "3": "CONFUSED_I_V_R"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor / Enclosure Fill",
    "tags": [
      "terminology",
      "conceptual",
      "units"
    ],
    "learningOutcomeId": "202-3F-LO3",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "Space factor is the ratio (expressed as a percentage) of the total cross-sectional area of the cables to the internal cross-sectional area of the conduit or trunking."
  },
  {
    "id": 4032,
    "question": "An electrician is calculating the space factor for a 25 mm conduit. Why must they use the internal diameter rather than the external diameter for this calculation?",
    "options": [
      "The external diameter includes the wall thickness which provides no space for cables",
      "The external diameter is used only for calculating the number of saddles required",
      "Using the external diameter would result in an underestimate of the percentage fill",
      "The internal diameter is always exactly 50% of the external diameter"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "RECIPROCAL_ERROR",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor / Enclosure Fill",
    "tags": [
      "discrimination",
      "conceptual",
      "units"
    ],
    "learningOutcomeId": "202-3F-LO3",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Cables occupy the space inside the conduit; the conduit wall thickness reduces the available area, so only the internal diameter is relevant for fill calculations."
  },
  {
    "id": 4033,
    "question": "What is a primary thermal risk associated with overfilling a trunking system with power cables?",
    "options": [
      "Reduced air circulation prevents heat dissipation, leading to insulation breakdown",
      "The increased weight of the cables generates friction heat against the trunking base",
      "The magnetic field of the cables interacts with the metal trunking to create heat",
      "Overfilling increases the voltage drop, which directly causes the trunking to melt"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_AC_DC_SOURCES",
      "3": "FORMULA_NOT_REARRANGED"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor / Enclosure Fill",
    "tags": [
      "conceptual",
      "health-safety",
      "application"
    ],
    "learningOutcomeId": "202-3F-LO3",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "Cables generate heat during operation. If an enclosure is too full, there is insufficient air to carry that heat away, which can cause the insulation to degrade and eventually fail."
  },
  {
    "id": 4034,
    "question": "A piece of trunking has internal dimensions of 50 mm x 50 mm. If the total cross-sectional area of the cables to be installed is 1,000 mm², what is the space factor?",
    "options": [
      "40%",
      "20%",
      "50%",
      "25%"
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
      "units",
      "application"
    ],
    "learningOutcomeId": "202-3F-LO3",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "Trunking area = 50 x 50 = 2,500 mm². Space factor = (Cable Area / Trunking Area) x 100 = (1,000 / 2,500) x 100 = 40%."
  },
  {
    "id": 4035,
    "question": "When pulling cables into a conduit system with several 90-degree bends, why is it critical to maintain a lower space factor?",
    "options": [
      "To reduce the mechanical friction and prevent damage to the cable insulation",
      "To ensure the cables can vibrate freely at a frequency of 50 Hz",
      "To allow the conduit to be bent further after the cables have been installed",
      "To prevent the cables from becoming tangled and reversing the polarity"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_FREQUENCY_WITH_VOLTAGE",
      "2": "TOPOLOGY_CONFUSION",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor / Enclosure Fill",
    "tags": [
      "conceptual",
      "application",
      "health-safety"
    ],
    "learningOutcomeId": "202-3F-LO3",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Bends increase the friction during the 'pulling-in' phase. A lower space factor ensures there is enough room for the cables to move around the bends without tearing the insulation."
  },
  {
    "id": 4036,
    "question": "A conduit has an internal diameter of 20 mm (Area ≈ 314 mm²). If you install three cables, each with a total cross-sectional area of 30 mm², what is the approximate percentage fill?",
    "options": [
      "28.7%",
      "9.5%",
      "90.0%",
      "31.4%"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_SERIES_RULE",
      "2": "MULTIPLIED_INSTEAD",
      "3": "RECIPROCAL_ERROR"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor / Enclosure Fill",
    "tags": [
      "calculation",
      "units",
      "application"
    ],
    "learningOutcomeId": "202-3F-LO3",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "Total cable area = 3 x 30 = 90 mm². Percentage fill = (90 / 314) x 100 = 28.66% (rounded to 28.7%)."
  },
  {
    "id": 4037,
    "question": "An electrician is choosing between two sizes of trunking for a job. If the calculated space factor for the first size is 55% and the industry guidance suggests a limit of 45%, what should the electrician do?",
    "options": [
      "Select a larger size of trunking to reduce the space factor",
      "Use a lubricant to force the cables into the smaller trunking",
      "Remove the earth conductors to create more space in the enclosure",
      "Increase the voltage of the circuit to compensate for the heat"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "HEALTH_SAFETY",
      "3": "CONFUSED_I_V_R"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor / Enclosure Fill",
    "tags": [
      "application",
      "discrimination",
      "health-safety"
    ],
    "learningOutcomeId": "202-3F-LO3",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "If the calculated fill exceeds the limit, a larger enclosure must be used to ensure safety, ease of installation, and future-proofing."
  },
  {
    "id": 4038,
    "question": "Which mathematical step is correct when determining the total area occupied by five identical circular cables?",
    "options": [
      "Calculate the area of one cable using πr² and multiply the result by five",
      "Multiply the diameter of one cable by five and then square the result",
      "Add the diameters of all five cables together and multiply by π",
      "Square the radius of one cable and multiply by the total length of the run"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "FORMULA_NOT_REARRANGED",
      "2": "UNITS_MISSING",
      "3": "MULTIPLIED_INSTEAD"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor / Enclosure Fill",
    "tags": [
      "discrimination",
      "calculation",
      "units"
    ],
    "learningOutcomeId": "202-3F-LO3",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "To find the total area, you must find the cross-sectional area of a single cable first (πr²) and then multiply that area by the number of cables."
  },
  {
    "id": 4039,
    "question": "Leaving 'headroom' or spare capacity in a trunking installation is considered good workmanship primarily because it:",
    "options": [
      "Allows for future additions to the electrical system without replacing the enclosure",
      "Reduces the cost of the initial installation by using less cable",
      "Prevents the cables from touching the sides of the metal trunking",
      "Ensures the magnetic fields of the cables do not overlap"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor / Enclosure Fill",
    "tags": [
      "conceptual",
      "application",
      "legislation"
    ],
    "learningOutcomeId": "202-3F-LO3",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "Spare capacity is essential for future-proofing an installation, allowing additional circuits to be added later without significant structural changes."
  },
  {
    "id": 4040,
    "question": "A student calculates the space factor of a conduit and gets a result of 115%. What does this result indicate?",
    "options": [
      "The cables have a larger combined area than the available space inside the conduit",
      "The conduit is perfectly filled and meets all safety standards",
      "The calculation is correct, as the space factor usually exceeds 100%",
      "The conduit is only 15% full and has plenty of spare capacity"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "ROUNDING_ERROR",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor / Enclosure Fill",
    "tags": [
      "discrimination",
      "conceptual",
      "calculation"
    ],
    "learningOutcomeId": "202-3F-LO3",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 60,
    "explanation": "A percentage over 100% means the items being placed inside are physically larger than the container, which is impossible in practice and indicates a calculation error or a serious design flaw."
  },
  {
    "id": 4041,
    "question": "Which of the following best defines the term 'space factor' in relation to electrical enclosures?",
    "options": [
      "The percentage of the internal area of an enclosure occupied by cables",
      "The ratio of the cable's copper cross-section to the conduit's external diameter",
      "The maximum length of cable that can be pulled through a conduit before a bend",
      "The amount of air required to keep a conductor at room temperature"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "TOPOLOGY_CONFUSION",
      "3": "CONFUSED_I_V_R"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor / Enclosure Fill",
    "tags": [
      "terminology",
      "conceptual",
      "units"
    ],
    "learningOutcomeId": "202-3F-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Space factor (or enclosure fill) is the ratio of the total cross-sectional area of all cables to the internal cross-sectional area of the conduit or trunking, expressed as a percentage."
  },
  {
    "id": 4042,
    "question": "What is the primary thermal reason for limiting the number of cables installed within a single conduit?",
    "options": [
      "To prevent heat buildup by ensuring there is sufficient air for dissipation",
      "To increase the resistance of the cables to prevent over-current",
      "To ensure the magnetic fields of the AC supply do not cause vibration",
      "To allow the conduit material to expand and contract with the frequency"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_I_V_R",
      "2": "CONFUSED_AC_DC_SOURCES",
      "3": "CONFUSED_FREQUENCY_WITH_VOLTAGE"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor / Enclosure Fill",
    "tags": [
      "conceptual",
      "health-safety"
    ],
    "learningOutcomeId": "202-3F-LO2",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Cables generate heat when carrying current. If an enclosure is overfilled, there is less air to circulate and remove that heat, leading to insulation degradation and potential fire risks."
  },
  {
    "id": 4043,
    "question": "An electrician is calculating the space factor for a 25 mm internal diameter (ID) conduit. What is the approximate internal cross-sectional area available for cables?",
    "options": [
      "491 mm²",
      "1,963 mm²",
      "78 mm²",
      "625 mm²"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "FORMULA_NOT_REARRANGED",
      "2": "MULTIPLIED_INSTEAD",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor / Enclosure Fill",
    "tags": [
      "calculation",
      "units"
    ],
    "learningOutcomeId": "202-3F-LO3",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "Using the area of a circle formula (πr²): The radius is half the diameter (25 / 2 = 12.5 mm). Area = 3.14159 × 12.5² ≈ 490.87 mm²."
  },
  {
    "id": 4044,
    "question": "When pulling cables into a trunking system, an overfilled enclosure is most likely to cause which mechanical problem?",
    "options": [
      "Damage to cable insulation due to high friction and snagging",
      "A decrease in the supply frequency from 50 Hz to 40 Hz",
      "The trunking becoming magnetised and attracting hand tools",
      "An increase in the RMS voltage at the furthest point of the circuit"
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
      "application",
      "health-safety"
    ],
    "learningOutcomeId": "202-3F-LO2",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Overfilling an enclosure increases friction during the 'pulling in' phase, which can tear or scrape the insulation, leading to short circuits or earth faults later."
  },
  {
    "id": 4045,
    "question": "A section of trunking has internal dimensions of 100 mm x 50 mm. If the total cross-sectional area of the cables to be installed is 1,250 mm², what is the space factor?",
    "options": [
      "25%",
      "12.5%",
      "50%",
      "8%"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "UNITS_MISSING",
      "2": "MULTIPLIED_INSTEAD",
      "3": "RECIPROCAL_ERROR"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor / Enclosure Fill",
    "tags": [
      "calculation",
      "application"
    ],
    "learningOutcomeId": "202-3F-LO3",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "Trunking area = 100 mm × 50 mm = 5,000 mm². Space factor = (Cable Area / Trunking Area) × 100 = (1,250 / 5,000) × 100 = 25%."
  },
  {
    "id": 4046,
    "question": "Which dimension must be used to correctly calculate the space factor of a conduit installation?",
    "options": [
      "The internal diameter of the conduit",
      "The external diameter of the conduit",
      "The thickness of the conduit wall",
      "The total length of the conduit run"
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
      "discrimination",
      "terminology"
    ],
    "learningOutcomeId": "202-3F-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "Only the internal area is available for cables. Using the external diameter would incorrectly suggest more space is available than actually exists."
  },
  {
    "id": 4047,
    "question": "A 50 mm x 50 mm trunking has a maximum recommended fill limit of 45%. If the planned cables have a total area of 1,200 mm², is this installation acceptable?",
    "options": [
      "No, because the fill is 48%",
      "Yes, because the fill is 24%",
      "Yes, because the fill is 45%",
      "No, because the fill is 52%"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "ROUNDING_ERROR",
      "2": "FORMULA_NOT_REARRANGED",
      "3": "DIVIDED_INSTEAD"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor / Enclosure Fill",
    "tags": [
      "application",
      "calculation"
    ],
    "learningOutcomeId": "202-3F-LO4",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 120,
    "explanation": "Trunking area = 50 × 50 = 2,500 mm². Fill = (1,200 / 2,500) × 100 = 48%. Since 48% is greater than the 45% limit, it is not acceptable."
  },
  {
    "id": 4048,
    "question": "Why is it important to include the cable's insulation when calculating the total cable area for space factor?",
    "options": [
      "The insulation takes up physical volume within the enclosure",
      "The insulation increases the voltage capacity of the conduit",
      "The insulation protects the conduit from electromagnetic induction",
      "The insulation allows the current to flow at a higher frequency"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_I_V_R",
      "2": "CONFUSED_TRANSFORMER_WITH_AC_DC",
      "3": "CONFUSED_FREQUENCY_WITH_VOLTAGE"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor / Enclosure Fill",
    "tags": [
      "conceptual",
      "terminology"
    ],
    "learningOutcomeId": "202-3F-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Space factor is a measure of physical occupancy. The entire cable, including its sheath and insulation, occupies space inside the conduit or trunking."
  },
  {
    "id": 4049,
    "question": "If two cables, each with an overall diameter of 10 mm, are installed in a conduit, what is their total combined area for a space factor calculation?",
    "options": [
      "157 mm²",
      "314 mm²",
      "20 mm²",
      "100 mm²"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "FORMULA_NOT_REARRANGED",
      "2": "MULTIPLIED_INSTEAD",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor / Enclosure Fill",
    "tags": [
      "calculation",
      "discrimination"
    ],
    "learningOutcomeId": "202-3F-LO3",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "Area of one cable = π × r² = 3.14 × 5² = 78.5 mm². Total area for two cables = 78.5 × 2 = 157 mm²."
  },
  {
    "id": 4050,
    "question": "Which of the following describes a benefit of leaving spare capacity (low space factor) in a trunking installation?",
    "options": [
      "It allows for easier maintenance and future wiring additions",
      "It increases the RMS voltage of the circuit automatically",
      "It converts the DC components of the circuit into AC",
      "It reduces the resistance of the protective earthing conductor"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_RMS_WITH_PEAK",
      "2": "CONFUSED_AC_WITH_DC",
      "3": "CONFUSED_I_V_R"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor / Enclosure Fill",
    "tags": [
      "conceptual",
      "application"
    ],
    "learningOutcomeId": "202-3F-LO2",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Good workmanship involves planning for the future. Leaving spare space ensures that additional circuits can be added later without needing to replace the entire containment system."
  },
  {
    "id": 4051,
    "question": "Which of the following best defines the term 'space factor' (enclosure fill) in an electrical installation?",
    "options": [
      "The percentage of the internal cross-sectional area of an enclosure occupied by cables",
      "The total external volume of the conduit divided by the number of cables inside",
      "The ratio of the cable's copper conductor area to the total external diameter of the conduit",
      "The maximum length of cable that can be pulled through a single run of trunking"
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
      "conceptual"
    ],
    "learningOutcomeId": "202-3F-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Space factor is a ratio expressed as a percentage, comparing the total cross-sectional area of the cables to the available internal area of the conduit or trunking."
  },
  {
    "id": 4052,
    "question": "An electrician is installing cables into a 20mm conduit. Why is it critical not to exceed the recommended space factor?",
    "options": [
      "To prevent heat buildup and mechanical damage to insulation during installation",
      "To ensure the AC frequency remains stable at 50 Hz throughout the circuit",
      "To increase the resistance of the cables to prevent overcurrent",
      "To ensure that the magnetic fields of the live and neutral conductors do not overlap"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_FREQUENCY_WITH_VOLTAGE",
      "2": "CONFUSED_I_V_R",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor / Enclosure Fill",
    "tags": [
      "conceptual",
      "health-safety",
      "application"
    ],
    "learningOutcomeId": "202-3F-LO2",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Overfilling an enclosure restricts airflow, leading to overheating, and increases friction, which can tear cable insulation during the pulling-in process."
  },
  {
    "id": 4053,
    "question": "A section of 50mm x 50mm trunking contains 15 cables. Each cable has a total cross-sectional area (including insulation) of 20 mm². Calculate the percentage fill of the trunking.",
    "options": [
      "12%",
      "30%",
      "6%",
      "25%"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "MULTIPLIED_INSTEAD",
      "2": "DIVIDED_INSTEAD",
      "3": "ROUNDING_ERROR"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor / Enclosure Fill",
    "tags": [
      "calculation",
      "units",
      "application"
    ],
    "learningOutcomeId": "202-3F-LO3",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "Trunking area = 50 x 50 = 2500 mm². Total cable area = 15 x 20 = 300 mm². % fill = (300 / 2500) x 100 = 12%."
  },
  {
    "id": 4054,
    "question": "When calculating the area available for cables inside a conduit, which dimension must be used for the calculation to be accurate?",
    "options": [
      "Internal diameter",
      "External diameter",
      "Wall thickness",
      "Outside circumference"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "OTHER",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor / Enclosure Fill",
    "tags": [
      "discrimination",
      "terminology"
    ],
    "learningOutcomeId": "202-3F-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "Cables occupy the space inside the conduit; therefore, the internal diameter (ID) must be used to calculate the available cross-sectional area."
  },
  {
    "id": 4055,
    "question": "A conduit has an internal area of 314 mm². It currently contains two cables, each with a cross-sectional area of 40 mm². An electrician wants to add a third cable with an area of 50 mm². What will be the final space factor?",
    "options": [
      "41.4%",
      "28.7%",
      "12.7%",
      "130.0%"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "FORMULA_NOT_REARRANGED",
      "2": "RECIPROCAL_ERROR",
      "3": "UNITS_MISSING"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor / Enclosure Fill",
    "tags": [
      "calculation",
      "application",
      "mixed-circuit"
    ],
    "learningOutcomeId": "202-3F-LO4",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 100,
    "explanation": "Total cable area = 40 + 40 + 50 = 130 mm². Space factor = (130 / 314) x 100 = 41.4%."
  },
  {
    "id": 4056,
    "question": "An electrician is installing 6.0 mm² cables into a section of trunking. If the calculated space factor is significantly exceeded, what is the primary thermal risk to the installation?",
    "options": [
      "The reduction of air circulation prevents heat dissipation, leading to insulation degradation.",
      "The increased resistance of the cables due to proximity causes a voltage spike.",
      "The magnetic fields of the cables will overlap, causing the trunking to become live.",
      "The cables will expand physically and crack the trunking joints."
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_I_V_R",
      "2": "TOPOLOGY_CONFUSION",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor / Enclosure Fill",
    "tags": [
      "conceptual",
      "power",
      "calculation"
    ],
    "learningOutcomeId": "202-3F-LO2",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "Overfilling an enclosure reduces the volume of air available to circulate around the conductors. Air acts as a cooling medium; without it, heat builds up, which can cause the PVC insulation to soften or become brittle over time."
  },
  {
    "id": 4057,
    "question": "A 25 mm conduit has an internal diameter (ID) of 21 mm. It contains four cables, each with an overall diameter of 7 mm. Calculate the approximate percentage space factor.",
    "options": [
      "44%",
      "33%",
      "66%",
      "28%"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "ROUNDING_ERROR",
      "2": "RECIPROCAL_ERROR",
      "3": "FORMULA_NOT_REARRANGED"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor / Enclosure Fill",
    "tags": [
      "calculation",
      "units",
      "resistance-rule"
    ],
    "learningOutcomeId": "202-3F-LO3",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 180,
    "explanation": "Conduit Area = π * (21/2)² ≈ 346.36 mm². Total Cable Area = 4 * (π * (7/2)²) ≈ 4 * 38.48 ≈ 153.92 mm². % Fill = (153.92 / 346.36) * 100 ≈ 44.4%."
  },
  {
    "id": 4058,
    "question": "When calculating the space factor for a conduit run, why must the electrician use the internal diameter rather than the nominal outside diameter?",
    "options": [
      "The outside diameter includes the wall thickness, which provides no usable space for cables.",
      "The outside diameter is used only for calculating the number of saddles required.",
      "The internal diameter changes depending on the frequency of the AC supply.",
      "The internal diameter is required to calculate the magnetic flux density of the enclosure."
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "CONFUSED_AC_DC_SOURCES",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor / Enclosure Fill",
    "tags": [
      "discrimination",
      "terminology",
      "units"
    ],
    "learningOutcomeId": "202-3F-LO1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 90,
    "explanation": "The space factor is a measure of the available volume inside the tube. Using the outside diameter would overestimate the available space because it includes the thickness of the conduit material itself."
  },
  {
    "id": 4059,
    "question": "A length of trunking measures 50 mm x 50 mm internally. If the maximum permissible space factor is 45%, what is the maximum total cross-sectional area (including insulation) that the cables can occupy?",
    "options": [
      "1125 mm²",
      "2500 mm²",
      "1250 mm²",
      "500 mm²"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "MULTIPLIED_INSTEAD",
      "2": "DIVIDED_INSTEAD",
      "3": "UNITS_MISSING"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor / Enclosure Fill",
    "tags": [
      "application",
      "calculation",
      "units"
    ],
    "learningOutcomeId": "202-3F-LO4",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 150,
    "explanation": "Total internal area = 50 * 50 = 2500 mm². 45% of 2500 = 2500 * 0.45 = 1125 mm²."
  },
  {
    "id": 4060,
    "question": "During a complex pull through a conduit system with several 90-degree bends, a high space factor is most likely to cause which mechanical issue?",
    "options": [
      "Strain and abrasion on the cable insulation due to high friction.",
      "A decrease in the conductor's resistance due to compression.",
      "The conduit joints to expand and disconnect due to internal pressure.",
      "The cables to twist and create a transformer effect with the conduit."
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_I_V_R",
      "2": "OTHER",
      "3": "CONFUSED_TRANSFORMER_WITH_AC_DC"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor / Enclosure Fill",
    "tags": [
      "conceptual",
      "health-safety",
      "application"
    ],
    "learningOutcomeId": "202-3F-LO2",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "High space factors leave little room for cables to move. In bends, cables are pressed against the inner walls; if there is too much fill, the friction increases significantly, leading to torn or damaged insulation."
  },
  {
    "id": 4061,
    "question": "An installation requires two 10 mm diameter cables and four 5 mm diameter cables in a single trunking. What is the total cross-sectional area of these cables?",
    "options": [
      "235.6 mm²",
      "157.1 mm²",
      "40.0 mm²",
      "314.2 mm²"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_SERIES_RULE",
      "2": "MULTIPLIED_INSTEAD",
      "3": "RECIPROCAL_ERROR"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor / Enclosure Fill",
    "tags": [
      "calculation",
      "units",
      "mixed-circuit"
    ],
    "learningOutcomeId": "202-3F-LO3",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 180,
    "explanation": "Area of one 10mm cable = π*(5)² = 78.54. Two 10mm cables = 157.08. Area of one 5mm cable = π*(2.5)² = 19.63. Four 5mm cables = 78.52. Total = 157.08 + 78.52 = 235.6 mm²."
  },
  {
    "id": 4062,
    "question": "Which of the following best describes the 'Space Factor' in the context of trunking and conduit?",
    "options": [
      "The ratio of the total cable area to the internal area of the enclosure.",
      "The distance between the outer surface of the cable and the inner wall of the conduit.",
      "The maximum length of a cable run before a draw-in box is required.",
      "The thickness of the galvanized coating on the steel enclosure."
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "OTHER",
      "3": "UNITS_MISSING"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor / Enclosure Fill",
    "tags": [
      "discrimination",
      "terminology",
      "conceptual"
    ],
    "learningOutcomeId": "202-3F-LO1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 60,
    "explanation": "Space factor (or enclosure fill) is specifically the percentage or ratio of the internal cross-sectional area of an enclosure that is occupied by cables."
  },
  {
    "id": 4063,
    "question": "An electrician decides to use 50 mm x 50 mm trunking for a circuit that only requires 25 mm x 25 mm trunking. How does this affect the installation's future-proofing?",
    "options": [
      "It allows for easier addition of future circuits and better heat dissipation.",
      "It decreases the circuit's efficiency by increasing the inductive reactance.",
      "It is a violation of BS 7671 as enclosures must be sized exactly to the load.",
      "It requires the use of higher-rated insulation because of the extra air volume."
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_AC_DC_SOURCES",
      "2": "OTHER",
      "3": "CONFUSED_I_V_R"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor / Enclosure Fill",
    "tags": [
      "application",
      "conceptual",
      "legislation"
    ],
    "learningOutcomeId": "202-3F-LO2",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 90,
    "explanation": "Using larger enclosures than strictly necessary is good practice (workmanship) because it facilitates easier maintenance, easier cooling, and permits future upgrades without replacing the containment."
  },
  {
    "id": 4064,
    "question": "You have a total cable area of 400 mm². Which of the following conduit internal diameters would result in a space factor closest to 40%?",
    "options": [
      "36 mm",
      "20 mm",
      "25 mm",
      "50 mm"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "WRONG_UNITS",
      "2": "FORMULA_NOT_REARRANGED",
      "3": "ROUNDING_ERROR"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor / Enclosure Fill",
    "tags": [
      "calculation",
      "application",
      "units"
    ],
    "learningOutcomeId": "202-3F-LO3",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 210,
    "explanation": "If 400 mm² is 40%, then 100% (Total Area) = 1000 mm². Area = πr², so r² = 1000/π ≈ 318.3. r ≈ 17.84 mm. Diameter = 2 * r ≈ 35.68 mm. 36 mm is the closest."
  },
  {
    "id": 4065,
    "question": "Why is 'Cable Factor' often used in on-site guides instead of calculating areas using πr²?",
    "options": [
      "It simplifies complex geometry into easy-to-add whole numbers for quick field use.",
      "It accounts for the skin effect in AC conductors which πr² ignores.",
      "It is a legal requirement under the Electricity at Work Regulations.",
      "It converts the circular area of a cable into a square area for easier trunking fill."
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_AC_DC_SOURCES",
      "2": "OTHER",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor / Enclosure Fill",
    "tags": [
      "discrimination",
      "terminology",
      "application"
    ],
    "learningOutcomeId": "202-3F-LO1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "Cable factors and terms like 'conduit factor' are pre-calculated values that allow electricians to sum up values for various cables and compare them to a conduit's capacity without needing to perform πr² calculations on site."
  }
];
