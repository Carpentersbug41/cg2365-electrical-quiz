import { TaggedQuestion } from './types';

/**
 * Spacing Factor / Enclosure Fill Question Bank
 * Aligned with lesson 203-3F learning outcomes
 * Generated: 2026-02-04
 */

export const spacingFactorEnclosureFillQuestions: TaggedQuestion[] = [
  {
    "id": 4016,
    "question": "What is the definition of the term 'space factor' in electrical installations?",
    "options": [
      "The percentage of the internal space of an enclosure occupied by cables",
      "The external diameter of a conduit compared to its length",
      "The total weight of the cables inside a trunking system",
      "The amount of current a cable can carry before it gets hot"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "CONFUSED_I_V_R"
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
    "explanation": "Space factor (or enclosure fill) is specifically the ratio of the total cross-sectional area of the cables to the internal cross-sectional area of the conduit or trunking, expressed as a percentage."
  },
  {
    "id": 4017,
    "question": "When calculating the available space inside a conduit, which dimension must be used?",
    "options": [
      "The internal diameter",
      "The external diameter",
      "The wall thickness",
      "The outside circumference"
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
      "units"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 30,
    "explanation": "Only the internal diameter matters because that defines the actual physical space available for the cables to be installed."
  },
  {
    "id": 4018,
    "question": "Why is it dangerous to overfill a conduit with too many cables?",
    "options": [
      "Heat cannot escape easily, leading to insulation breakdown",
      "The resistance of the copper conductors will decrease",
      "The voltage in the circuit will significantly increase",
      "The conduit will become magnetic and attract dust"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_I_V_R",
      "2": "CONFUSED_I_V_R",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor / Enclosure Fill",
    "tags": [
      "conceptual",
      "health-safety"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Cables generate heat when carrying current; if they are packed too tightly, there is insufficient air for cooling, which can melt or damage the insulation."
  },
  {
    "id": 4019,
    "question": "In the context of cable calculations, what does the abbreviation 'CSA' stand for?",
    "options": [
      "Cross-sectional area",
      "Cable safety amount",
      "Circuit system arrangement",
      "Current standard allowance"
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
      "discrimination"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 30,
    "explanation": "CSA stands for Cross-Sectional Area, which is the 'slice' area of a cable or enclosure used in fill calculations."
  },
  {
    "id": 4020,
    "question": "A section of trunking has an internal area of 1000 mm². If the total area of the cables inside is 250 mm², what is the percentage fill?",
    "options": [
      "25%",
      "4%",
      "40%",
      "75%"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "DIVIDED_INSTEAD",
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
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "The calculation is (Cable Area / Enclosure Area) x 100. So, (250 / 1000) x 100 = 25%."
  },
  {
    "id": 4021,
    "question": "What mechanical risk is associated with exceeding the recommended space factor in a conduit?",
    "options": [
      "Damage to cable insulation during the pulling-in process",
      "The conduit pipe becoming too heavy for its fixings",
      "The cables vibrating and creating noise",
      "The copper conductors snapping due to lack of air"
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
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "If a conduit is too full, the friction between cables and the conduit walls is very high, which often leads to the insulation being torn or scraped during installation."
  },
  {
    "id": 4022,
    "question": "Which basic formula is used to calculate the internal cross-sectional area of rectangular trunking?",
    "options": [
      "Width × Height",
      "π × radius²",
      "Width + Height",
      "Length × Width × Height"
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
      "discrimination",
      "calculation"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 30,
    "explanation": "Trunking is rectangular, so its area is simply the internal width multiplied by the internal height."
  },
  {
    "id": 4023,
    "question": "An electrician is calculating the area of a circular conduit with an internal diameter of 20 mm. What is the radius (r) they should use in the formula πr²?",
    "options": [
      "10 mm",
      "20 mm",
      "5 mm",
      "40 mm"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "FORMULA_NOT_REARRANGED",
      "2": "DIVIDED_INSTEAD",
      "3": "MULTIPLIED_INSTEAD"
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
    "estimatedTime": 30,
    "explanation": "The radius is always half of the diameter. 20 mm / 2 = 10 mm."
  },
  {
    "id": 4024,
    "question": "What is a professional reason for leaving spare capacity (headroom) in a trunking installation?",
    "options": [
      "To allow for future additions or circuit modifications",
      "To make the trunking look more aesthetically pleasing",
      "To reduce the cost of the initial installation",
      "To prevent the trunking from rusting"
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
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Good workmanship involves planning for the future, ensuring that extra cables can be added later without needing to replace the entire containment system."
  },
  {
    "id": 4025,
    "question": "Which of these represents the correct method to find the space factor of an installation?",
    "options": [
      "(Total Cable Area ÷ Enclosure Internal Area) × 100",
      "(Enclosure Internal Area ÷ Total Cable Area) × 100",
      "(Total Cable Area + Enclosure Internal Area) ÷ 2",
      "(Cable Diameter × Enclosure Diameter) ÷ 100"
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
      "calculation",
      "conceptual"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "To find the percentage fill (space factor), you divide the 'used' area by the 'available' area and multiply by 100."
  },
  {
    "id": 4026,
    "question": "What is the primary definition of 'space factor' in an electrical installation?",
    "options": [
      "The percentage of the internal space of an enclosure occupied by cables",
      "The total length of conduit required for a specific circuit",
      "The thickness of the insulation surrounding a copper conductor",
      "The amount of external space required between two parallel conduits"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "OTHER",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor",
    "tags": [
      "terminology",
      "explanation",
      "conceptual"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Space factor, also known as enclosure fill, is the ratio of the total cross-sectional area of cables to the internal cross-sectional area of the conduit or trunking, expressed as a percentage."
  },
  {
    "id": 4027,
    "question": "When calculating the space factor for a conduit, which measurement of the conduit must be used to find its area?",
    "options": [
      "The internal diameter",
      "The external diameter",
      "The wall thickness",
      "The total length"
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
      "units",
      "discrimination",
      "conceptual"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "To determine how much space is available for cables, you must use the internal diameter of the conduit. Using the external diameter would result in an incorrect calculation of available space."
  },
  {
    "id": 4028,
    "question": "What is a major risk associated with overfilling a conduit or trunking with too many cables?",
    "options": [
      "Excessive heat buildup leading to insulation damage",
      "An increase in the frequency of the AC supply",
      "A decrease in the resistance of the conductors",
      "The cables becoming magnetic and attracting dust"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_FREQUENCY_WITH_VOLTAGE",
      "2": "CONFUSED_I_V_R",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor",
    "tags": [
      "health-safety",
      "conceptual",
      "explanation"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Overfilling prevents air circulation around cables, leading to heat buildup. This can cause the insulation to degrade and eventually fail, creating a fire or shock hazard."
  },
  {
    "id": 4029,
    "question": "A piece of trunking has an internal cross-sectional area of 1000 mm². If the total area of the cables installed inside is 350 mm², what is the percentage fill?",
    "options": [
      "35%",
      "2.8%",
      "65%",
      "350%"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "DIVIDED_INSTEAD",
      "2": "OTHER",
      "3": "MULTIPLIED_INSTEAD"
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
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Percentage fill is calculated by (Total Cable Area / Enclosure Area) x 100. In this case: (350 / 1000) x 100 = 35%."
  },
  {
    "id": 4030,
    "question": "Which formula should an electrician use to find the internal cross-sectional area of a rectangular trunking?",
    "options": [
      "Internal width × internal height",
      "π × radius squared",
      "Internal width + internal height",
      "Diameter × length"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_PARALLEL_RULE",
      "2": "OTHER",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor",
    "tags": [
      "calculation",
      "discrimination",
      "terminology"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "The area of a rectangle (trunking) is calculated by multiplying its width by its height. The formula πr² is used for circular conduits."
  },
  {
    "id": 4031,
    "question": "When calculating the available space for cables within a length of conduit, which dimension of the conduit must be used?",
    "options": [
      "Internal diameter",
      "External diameter",
      "Wall thickness",
      "Outer circumference"
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
      "units",
      "terminology",
      "calculation"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "Space factor is based on the usable space inside the enclosure; therefore, the internal diameter of the conduit is required to calculate the internal area."
  },
  {
    "id": 4032,
    "question": "Why is it dangerous to exceed the recommended space factor (enclosure fill) in a trunking system?",
    "options": [
      "Heat cannot dissipate effectively, leading to insulation breakdown",
      "The increased weight will cause the trunking to become magnetic",
      "The voltage drop across the cables will decrease significantly",
      "The frequency of the AC supply will fluctuate due to friction"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_I_V_R",
      "3": "CONFUSED_FREQUENCY_WITH_VOLTAGE"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor / Enclosure Fill",
    "tags": [
      "explanation",
      "conceptual",
      "health-safety"
    ],
    "learningOutcomeId": "203-3F-LO2",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Cables generate heat due to resistance; if they are packed too tightly, air cannot circulate to remove that heat, risking fire or insulation damage."
  },
  {
    "id": 4033,
    "question": "A section of trunking has internal dimensions of 50 mm x 50 mm. If it contains 15 cables, each with a cross-sectional area of 20 mm², what is the space factor?",
    "options": [
      "12%",
      "30%",
      "7.5%",
      "60%"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "MULTIPLIED_INSTEAD",
      "2": "DIVIDED_INSTEAD",
      "3": "FORMULA_NOT_REARRANGED"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor / Enclosure Fill",
    "tags": [
      "calculation",
      "application"
    ],
    "learningOutcomeId": "203-3F-LO3",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "Total cable area = 15 x 20 = 300 mm². Trunking area = 50 x 50 = 2500 mm². Space factor = (300 / 2500) x 100 = 12%."
  },
  {
    "id": 4034,
    "question": "An electrician is pulling cables into a conduit and finds they are sticking and requiring excessive force. What is the most likely cause related to space factor?",
    "options": [
      "Mechanical friction and snagging due to overfilling",
      "The cables are generating a strong magnetic field",
      "The AC frequency is causing the cables to vibrate",
      "The conduit has too high a resistance value"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_FREQUENCY_WITH_CURRENT",
      "3": "CONFUSED_I_V_R"
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
    "explanation": "Overfilled enclosures increase friction and the risk of snagging, which can lead to mechanical damage of the cable insulation during installation."
  },
  {
    "id": 4035,
    "question": "When calculating the space factor for a group of cables with different diameters, which method must be used to find the total 'fill'?",
    "options": [
      "Add the cross-sectional areas of all individual cables",
      "Add the diameters of all cables together",
      "Use the diameter of the largest cable only",
      "Multiply the average diameter by the number of cables"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "OTHER",
      "3": "MULTIPLIED_INSTEAD"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor / Enclosure Fill",
    "tags": [
      "discrimination",
      "conceptual"
    ],
    "learningOutcomeId": "203-3F-LO3",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Space factor is a ratio of areas. You must calculate and sum the area (πr²) of every individual cable to find the total occupied space."
  },
  {
    "id": 4036,
    "question": "A conduit has an internal area of 400 mm². If the maximum allowed space factor is 40%, what is the maximum total cable area permitted?",
    "options": [
      "160 mm²",
      "1000 mm²",
      "16 mm²",
      "240 mm²"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "RECIPROCAL_ERROR",
      "2": "ROUNDING_ERROR",
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
    "estimatedTime": 75,
    "explanation": "To find the maximum area: (40 / 100) x 400 = 160 mm²."
  },
  {
    "id": 4037,
    "question": "Why is it considered 'unprofessional' to install cables at the absolute maximum space factor limit in a new trunking installation?",
    "options": [
      "It prevents the addition of future circuits or maintenance",
      "It causes the RMS voltage of the circuit to drop",
      "It increases the frequency of the AC sine wave",
      "It makes the trunking act as a step-up transformer"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_RMS_WITH_PEAK",
      "2": "CONFUSED_FREQUENCY_WITH_VOLTAGE",
      "3": "CONFUSED_TRANSFORMER_WITH_AC_DC"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor / Enclosure Fill",
    "tags": [
      "conceptual",
      "explanation"
    ],
    "learningOutcomeId": "203-3F-LO2",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Good workmanship involves leaving spare capacity for future maintenance or additional circuits, which is impossible if the enclosure is full."
  },
  {
    "id": 4038,
    "question": "Which of the following describes the correct formula to calculate the percentage fill (space factor)?",
    "options": [
      "(Total Cable Area ÷ Enclosure Internal Area) x 100",
      "(Enclosure Internal Area ÷ Total Cable Area) x 100",
      "(Total Cable Diameter ÷ Enclosure Diameter) x 100",
      "(Total Cable Area x Enclosure Internal Area) ÷ 100"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "RECIPROCAL_ERROR",
      "2": "TOPOLOGY_CONFUSION",
      "3": "MULTIPLIED_INSTEAD"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor / Enclosure Fill",
    "tags": [
      "discrimination",
      "terminology"
    ],
    "learningOutcomeId": "203-3F-LO3",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "The space factor is the ratio of the area taken up by cables compared to the total area available, expressed as a percentage."
  },
  {
    "id": 4039,
    "question": "A length of 20mm internal diameter conduit (Area ≈ 314 mm²) is being used for 3 cables, each with a 6mm overall diameter. What is the approximate space factor?",
    "options": [
      "27%",
      "9%",
      "54%",
      "18%"
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
      "application"
    ],
    "learningOutcomeId": "203-3F-LO3",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 120,
    "explanation": "Cable radius = 3mm. Area of one cable = π x 3² ≈ 28.27 mm². Total cable area = 3 x 28.27 = 84.81 mm². % fill = (84.81 / 314) x 100 ≈ 27%."
  },
  {
    "id": 4040,
    "question": "If an installation design specifies a 35% space factor limit, and your calculation results in 42%, what is the most appropriate solution?",
    "options": [
      "Select a larger size of conduit or trunking",
      "Remove the cable insulation to save space",
      "Increase the supply frequency to reduce heat",
      "Use a DC supply instead of an AC supply"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "CONFUSED_FREQUENCY_WITH_VOLTAGE",
      "3": "CONFUSED_AC_WITH_DC"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor / Enclosure Fill",
    "tags": [
      "application",
      "discrimination"
    ],
    "learningOutcomeId": "203-3F-LO4",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "If the calculated fill exceeds the safety or design limit, the enclosure size must be increased to ensure safe heat dissipation and ease of installation."
  },
  {
    "id": 4041,
    "question": "In electrical installation technology, what is the definition of 'space factor'?",
    "options": [
      "The percentage of the internal space of an enclosure occupied by cables",
      "The distance maintained between cables to prevent electromagnetic interference",
      "The thickness of the insulation relative to the conductor cross-sectional area",
      "The ratio of the external diameter of a conduit to its internal diameter"
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
      "conceptual"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "Space factor (or enclosure fill) is defined as the amount of the internal cross-sectional area of a conduit or trunking that is taken up by the cables, expressed as a percentage."
  },
  {
    "id": 4042,
    "question": "Why is it dangerous to exceed the recommended space factor in a conduit installation?",
    "options": [
      "Heat cannot dissipate effectively, leading to insulation breakdown",
      "The resistance of the copper conductors will decrease significantly",
      "The conduit will lose its mechanical strength and collapse",
      "The magnetic fields of the cables will cancel each other out"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_I_V_R",
      "2": "OTHER",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor / Enclosure Fill",
    "tags": [
      "explanation",
      "conceptual"
    ],
    "learningOutcomeId": "203-3F-LO2",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Overfilling a conduit reduces the amount of air surrounding the cables, which prevents heat from escaping. This thermal buildup can cause the cable insulation to degrade and eventually fail."
  },
  {
    "id": 4043,
    "question": "A length of trunking has internal dimensions of 50 mm x 50 mm. What is the total available internal area for cable installation?",
    "options": [
      "2,500 mm²",
      "200 mm²",
      "100 mm²",
      "7,850 mm²"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "MULTIPLIED_INSTEAD",
      "2": "FORMULA_NOT_REARRANGED",
      "3": "RECIPROCAL_ERROR"
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
    "estimatedTime": 45,
    "explanation": "The area of rectangular trunking is calculated by multiplying the internal width by the internal height (50 mm x 50 mm = 2,500 mm²)."
  },
  {
    "id": 4044,
    "question": "An electrician calculates the area of a single cable with an overall diameter of 4 mm. Which of the following is the correct area?",
    "options": [
      "12.57 mm²",
      "50.27 mm²",
      "16.00 mm²",
      "6.28 mm²"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "RECIPROCAL_ERROR",
      "2": "FORMULA_NOT_REARRANGED",
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
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "To find the area of a cable, use πr². If the diameter is 4mm, the radius (r) is 2mm. Area = π × 2² = 3.14159 × 4 ≈ 12.57 mm²."
  },
  {
    "id": 4045,
    "question": "Which dimension must be used when calculating the space factor for cables inside a piece of conduit?",
    "options": [
      "Internal diameter",
      "External diameter",
      "Wall thickness",
      "Outer circumference"
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
      "conceptual"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "The space factor is concerned with the space available 'inside' the enclosure, therefore the internal diameter of the conduit must be used for calculations."
  },
  {
    "id": 4046,
    "question": "A conduit has an internal area of 314 mm². If the total cross-sectional area of the cables to be installed is 94 mm², what is the percentage fill?",
    "options": [
      "29.9%",
      "3.34%",
      "40.8%",
      "22.0%"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "UNITS_MISSING",
      "2": "DIVIDED_INSTEAD",
      "3": "ROUNDING_ERROR"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor / Enclosure Fill",
    "tags": [
      "calculation",
      "application"
    ],
    "learningOutcomeId": "203-3F-LO3",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "Percentage fill = (Total Cable Area / Enclosure Area) x 100. (94 / 314) x 100 = 29.936...% which rounds to 29.9%."
  },
  {
    "id": 4047,
    "question": "Besides thermal issues, what is a major mechanical risk of overfilling a conduit system?",
    "options": [
      "Damage to cable insulation during the pulling-in process",
      "The conduit joints becoming loose due to cable weight",
      "Increased voltage drop due to physical compression of the copper",
      "The cables becoming magnetised to the conduit walls"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "CONFUSED_I_V_R",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor / Enclosure Fill",
    "tags": [
      "explanation",
      "application"
    ],
    "learningOutcomeId": "203-3F-LO2",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "High friction and lack of space in an overfilled conduit make it difficult to pull cables through, often resulting in the insulation being scraped or torn against the conduit or other cables."
  },
  {
    "id": 4048,
    "question": "An electrician is installing six cables, each with an area of 20 mm², into a trunking with an internal area of 600 mm². What is the space factor?",
    "options": [
      "20%",
      "10%",
      "30%",
      "5%"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "DIVIDED_INSTEAD",
      "2": "MULTIPLIED_INSTEAD",
      "3": "RECIPROCAL_ERROR"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor / Enclosure Fill",
    "tags": [
      "calculation",
      "application"
    ],
    "learningOutcomeId": "203-3F-LO3",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "First, find the total cable area: 6 cables x 20 mm² = 120 mm². Then calculate percentage: (120 / 600) x 100 = 20%."
  },
  {
    "id": 4049,
    "question": "When comparing conduit and trunking of the same internal cross-sectional area, why might trunking be easier to install cables into?",
    "options": [
      "Trunking usually has a removable lid allowing cables to be laid in",
      "Trunking is always made of more slippery material than conduit",
      "Trunking creates a vacuum that helps pull the cables through",
      "Trunking dimensions are not subject to space factor limits"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "OTHER",
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
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Trunking typically features a removable lid, which allows cables to be 'laid in' rather than 'drawn in' (pulled through), reducing mechanical stress on the insulation compared to conduit."
  },
  {
    "id": 4050,
    "question": "A student calculates a space factor of 55% for a conduit run with several 90-degree bends. Why should this installation be reconsidered?",
    "options": [
      "It exceeds typical limits, making it very difficult to pull cables around bends",
      "The cables will cause the conduit to expand and break the saddles",
      "A fill over 50% causes the AC frequency to change",
      "The space factor must always be exactly 100% for a secure fit"
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
      "application",
      "conceptual"
    ],
    "learningOutcomeId": "203-3F-LO4",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "High space factors (like 55%) are problematic, especially where there are bends, as the cables will jam against the internal walls, causing damage and making installation nearly impossible."
  },
  {
    "id": 4051,
    "question": "What is the primary reason for limiting the enclosure fill (space factor) in terms of the thermal performance of a circuit?",
    "options": [
      "To allow air to circulate and dissipate heat generated by the cables",
      "To increase the resistance of the cables to prevent heat buildup",
      "To ensure the conduit acts as a heat sink for the conductors",
      "To prevent the magnetic fields from overlapping and causing heat"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_I_V_R",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor / Enclosure Fill",
    "tags": [
      "conceptual",
      "units",
      "terminology"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Cables generate heat when carrying current. If an enclosure is too full, there is insufficient air to carry this heat away, leading to insulation degradation or fire risk."
  },
  {
    "id": 4052,
    "question": "When calculating the space factor for a conduit installation, which dimensions must be used to ensure the calculation is accurate?",
    "options": [
      "The internal diameter of the conduit and the overall diameter of the cables",
      "The external diameter of the conduit and the cross-sectional area of the copper conductors",
      "The internal diameter of the conduit and the cross-sectional area of the copper conductors",
      "The external diameter of the conduit and the overall diameter of the cables"
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
      "terminology",
      "calculation"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "Space factor is the ratio of the space occupied by cables to the space available inside. Therefore, you must use the internal diameter of the conduit and the total diameter of the cable (including its insulation/sheath)."
  },
  {
    "id": 4053,
    "question": "A section of trunking measures 50 mm x 50 mm internally. If the total cross-sectional area of the cables to be installed is 750 mm², what is the percentage fill (space factor)?",
    "options": [
      "30%",
      "15%",
      "7.5%",
      "50%"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "DIVIDED_INSTEAD",
      "2": "UNITS_MISSING",
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
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "Internal area of trunking = 50mm x 50mm = 2500 mm². Percentage fill = (Cable Area / Trunking Area) x 100. (750 / 2500) x 100 = 30%."
  },
  {
    "id": 4054,
    "question": "What is the most likely consequence of pulling cables into a conduit that has been overfilled beyond its recommended capacity?",
    "options": [
      "The insulation may be damaged due to high friction and snagging",
      "The circuit breaker will trip immediately due to magnetic interference",
      "The resistance of the conductors will decrease because they are packed tighter",
      "The frequency of the AC supply will fluctuate due to cable compression"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_I_V_R",
      "3": "CONFUSED_FREQUENCY_WITH_VOLTAGE"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor / Enclosure Fill",
    "tags": [
      "conceptual",
      "health-safety",
      "application"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Overfilling a conduit increases friction during the 'pull-in' phase of installation, which can tear or scrape the insulation, leading to short circuits or earth faults."
  },
  {
    "id": 4055,
    "question": "An electrician is installing 8 cables into a trunking system. Each cable has an overall cross-sectional area of 25 mm². If the trunking has an internal area of 1,000 mm², what is the calculated space factor?",
    "options": [
      "20%",
      "2.5%",
      "8%",
      "25%"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "RECIPROCAL_ERROR",
      "2": "FORMULA_NOT_REARRANGED",
      "3": "MULTIPLIED_INSTEAD"
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
    "explanation": "Total cable area = 8 cables x 25 mm² = 200 mm². Space factor = (200 / 1000) x 100 = 20%."
  },
  {
    "id": 4056,
    "question": "An electrician is installing four single-core cables, each with an overall diameter of 8 mm, into a conduit with an internal diameter (ID) of 25 mm. Calculate the space factor (percentage fill) for this installation.",
    "options": [
      "40.96%",
      "10.24%",
      "25.60%",
      "64.00%"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "FORMULA_NOT_REARRANGED",
      "2": "ROUNDING_ERROR",
      "3": "WRONG_UNITS"
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
    "difficulty": 5,
    "estimatedTime": 150,
    "explanation": "Cable area = π × r² = π × 4² = 50.26 mm². Total cable area (4 cables) = 201.06 mm². Conduit area = π × 12.5² = 490.87 mm². % Fill = (201.06 / 490.87) × 100 = 40.96%."
  },
  {
    "id": 4057,
    "question": "Which of the following best describes the primary technical risk of exceeding the recommended space factor in a steel trunking system carrying multiple AC circuits?",
    "options": [
      "Increased thermal resistance leading to insulation degradation",
      "A significant increase in the circuit frequency due to eddy currents",
      "The conversion of AC current into DC current within the enclosure",
      "A reduction in the RMS voltage delivered to the load"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_FREQUENCY_WITH_CURRENT",
      "2": "CONFUSED_AC_WITH_DC",
      "3": "CONFUSED_I_V_R"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor / Enclosure Fill",
    "tags": [
      "conceptual",
      "ac-dc",
      "explanation"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "Overfilling an enclosure restricts airflow around cables. This increases thermal resistance, preventing heat from dissipating, which causes the insulation to overheat and degrade over time."
  },
  {
    "id": 4058,
    "question": "A section of trunking with internal dimensions of 100 mm x 50 mm is used to house cables. If the maximum permissible space factor is 45%, what is the maximum total cross-sectional area of cables that can be installed?",
    "options": [
      "2250 mm²",
      "5000 mm²",
      "1125 mm²",
      "4500 mm²"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "DIVIDED_INSTEAD",
      "2": "RECIPROCAL_ERROR",
      "3": "MULTIPLIED_INSTEAD"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor / Enclosure Fill",
    "tags": [
      "calculation",
      "units"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "Trunking Area = 100 mm × 50 mm = 5000 mm². Maximum cable area = 45% of 5000 = 0.45 × 5000 = 2250 mm²."
  },
  {
    "id": 4059,
    "question": "In the UK, the nominal mains supply is 230V AC at 50Hz. What is the approximate peak-to-peak voltage that the cable insulation within a conduit must be able to withstand?",
    "options": [
      "650 V",
      "325 V",
      "230 V",
      "460 V"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_RMS_WITH_PEAK",
      "2": "OTHER",
      "3": "MULTIPLIED_INSTEAD"
    },
    "section": "Electrical Installations Technology",
    "category": "Sine Waves and RMS",
    "tags": [
      "sine-wave",
      "rms-peak",
      "conceptual"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 150,
    "explanation": "The RMS voltage is 230V. The peak voltage (Vpk) is 230 × 1.414 ≈ 325V. The peak-to-peak voltage (Vpp) is 2 × Vpk ≈ 650V."
  },
  {
    "id": 4060,
    "question": "When calculating the space factor for a conduit, why is it critical to use the internal diameter (ID) rather than the external diameter (OD)?",
    "options": [
      "The OD includes the thickness of the conduit wall, which provides no space for cables",
      "The OD is only relevant for DC circuits to prevent magnetic saturation",
      "The ID is used to calculate the frequency response of the containment",
      "The OD would result in a lower percentage fill, making the installation look safer than it is"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_AC_DC_SOURCES",
      "2": "CONFUSED_FREQUENCY_WITH_VOLTAGE",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor / Enclosure Fill",
    "tags": [
      "conceptual",
      "terminology",
      "explanation"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "Space factor is about the available volume inside the enclosure. Using the external diameter would incorrectly include the thickness of the conduit material, leading to an overestimation of available space."
  },
  {
    "id": 4061,
    "question": "An electrician notes that a transformer is humming loudly and feels hot, despite the load being within limits. Which AC principle explains why the cables inside the connected metal trunking might also be contributing to this heat if grouped incorrectly?",
    "options": [
      "Eddy currents and electromagnetic induction in the metal enclosure",
      "The conversion of RMS voltage to peak voltage within the trunking",
      "A shift in the supply frequency from 50Hz to 60Hz",
      "The cables acting as a DC battery source due to friction"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_RMS_WITH_PEAK",
      "2": "CONFUSED_FREQUENCY_WITH_VOLTAGE",
      "3": "CONFUSED_AC_WITH_DC"
    },
    "section": "Electrical Installations Technology",
    "category": "Electrical Installations Technology",
    "tags": [
      "electromagnetic-induction",
      "ac-dc",
      "application"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 180,
    "explanation": "Alternating current creates a varying magnetic field. If phase conductors are not grouped together in a metal enclosure, the magnetic field can induce eddy currents in the enclosure itself, causing significant heat."
  },
  {
    "id": 4062,
    "question": "If a cable has an overall diameter of 10 mm, what is the cross-sectional area used for space factor calculations?",
    "options": [
      "78.54 mm²",
      "314.16 mm²",
      "31.42 mm²",
      "100.00 mm²"
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
      "units"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 90,
    "explanation": "Area = π × r². If diameter is 10 mm, radius is 5 mm. Area = π × 5² = 78.54 mm²."
  },
  {
    "id": 4063,
    "question": "A 50Hz AC sine wave reaches its first positive peak at 5 milliseconds. At what time will it reach its first negative peak?",
    "options": [
      "15 milliseconds",
      "10 milliseconds",
      "20 milliseconds",
      "25 milliseconds"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "CONFUSED_FREQUENCY_WITH_CURRENT",
      "3": "DIVIDED_INSTEAD"
    },
    "section": "Electrical Installations Technology",
    "category": "Sine Waves and RMS",
    "tags": [
      "sine-wave",
      "conceptual",
      "calculation"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 150,
    "explanation": "A 50Hz wave has a period of 20ms (1/50). The positive peak is at 1/4 cycle (5ms), the zero-crossing is at 1/2 cycle (10ms), and the negative peak is at 3/4 cycle (15ms)."
  },
  {
    "id": 4064,
    "question": "Which of the following is a direct consequence of mechanical stress during the pulling of cables into an overfilled conduit?",
    "options": [
      "Tearing or thinning of the insulation sheath",
      "An increase in the supply frequency",
      "A change in the magnetic polarity of the copper conductor",
      "The conversion of the cable into a transformer winding"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_FREQUENCY_WITH_VOLTAGE",
      "2": "MAGNETIC_POLES",
      "3": "CONFUSED_TRANSFORMER_WITH_AC_DC"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor / Enclosure Fill",
    "tags": [
      "discrimination",
      "health-safety"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 90,
    "explanation": "High friction in overfilled conduits causes mechanical stress that can scrape, tear, or thin the insulation, leading to potential short circuits or earth faults later."
  },
  {
    "id": 4065,
    "question": "An enclosure contains two different circuits. Circuit A has a total cable area of 400 mm² and Circuit B has 600 mm². If the enclosure is a 50 mm x 50 mm trunking, what is the total space factor?",
    "options": [
      "40%",
      "25%",
      "100%",
      "10%"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "DIVIDED_INSTEAD",
      "2": "MULTIPLIED_INSTEAD",
      "3": "UNITS_MISSING"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor / Enclosure Fill",
    "tags": [
      "calculation",
      "mixed-circuit"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "Total cable area = 400 + 600 = 1000 mm². Trunking area = 50 × 50 = 2500 mm². Space factor = (1000 / 2500) × 100 = 40%."
  }
];
