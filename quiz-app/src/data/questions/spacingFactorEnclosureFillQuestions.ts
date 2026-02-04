import { TaggedQuestion } from './types';

/**
 * Spacing Factor / Enclosure Fill Question Bank
 * Aligned with lesson 203-3F learning outcomes
 * Generated: 2026-02-04
 */

export const spacingFactorEnclosureFillQuestions: TaggedQuestion[] = [
  {
    "id": 4016,
    "question": "What is the definition of 'space factor' in an electrical installation?",
    "options": [
      "The percentage of an enclosure's internal space occupied by cables",
      "The total weight of cables allowed inside a containment system",
      "The distance between cable clips inside a trunking system",
      "The thickness of the insulation on a single-core cable"
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
    "id": 4017,
    "question": "Why is it important not to overfill a conduit with cables?",
    "options": [
      "To prevent heat buildup and potential damage to cable insulation",
      "To make the conduit look more professional from the outside",
      "To ensure the cables can move freely during a short circuit",
      "To allow water to drain out of the conduit more easily"
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
      "health-safety"
    ],
    "learningOutcomeId": "203-3F-LO2",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Overfilling reduces the air space around cables, which limits heat dissipation. This can lead to overheating and breakdown of the cable insulation."
  },
  {
    "id": 4018,
    "question": "When calculating the space factor for conduit, which dimension must be used to find the enclosure area?",
    "options": [
      "Internal diameter",
      "External diameter",
      "Wall thickness",
      "Total length"
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
      "discrimination",
      "units"
    ],
    "learningOutcomeId": "203-3F-LO3",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "The cables are installed inside the conduit, so only the internal diameter determines the available space for the cables."
  },
  {
    "id": 4019,
    "question": "A section of trunking has internal dimensions of 50 mm by 50 mm. What is its internal cross-sectional area?",
    "options": [
      "2500 mm²",
      "100 mm²",
      "200 mm²",
      "500 mm²"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "MULTIPLIED_INSTEAD",
      "3": "DIVIDED_INSTEAD"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor / Enclosure Fill",
    "tags": [
      "calculation",
      "application"
    ],
    "learningOutcomeId": "203-3F-LO3",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "The area of a rectangle is width multiplied by height. 50 mm x 50 mm = 2500 mm²."
  },
  {
    "id": 4020,
    "question": "What is a primary mechanical risk of pulling cables into a conduit that is over the recommended fill limit?",
    "options": [
      "Damage to the cable insulation due to high friction and snagging",
      "The conduit bending under the weight of the cables",
      "The cables becoming too long due to stretching",
      "The conduit changing color due to internal pressure"
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
      "health-safety"
    ],
    "learningOutcomeId": "203-3F-LO2",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Overfilled conduits cause high friction during installation, which can tear or scrape the insulation, leading to potential electrical faults."
  },
  {
    "id": 4021,
    "question": "Which mathematical value is required to calculate the cross-sectional area of a circular conduit?",
    "options": [
      "Pi (π)",
      "Resistance (Ω)",
      "Frequency (Hz)",
      "Voltage (V)"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_I_V_R",
      "2": "CONFUSED_FREQUENCY_WITH_VOLTAGE",
      "3": "CONFUSED_I_V_R"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor / Enclosure Fill",
    "tags": [
      "discrimination",
      "calculation"
    ],
    "learningOutcomeId": "203-3F-LO3",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "The formula for the area of a circle is A = πr², so the constant Pi (π) is required."
  },
  {
    "id": 4022,
    "question": "If the total area of cables is 150 mm² and the internal area of the trunking is 500 mm², what is the percentage fill?",
    "options": [
      "30%",
      "3.3%",
      "333%",
      "15%"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "DIVIDED_INSTEAD",
      "2": "RECIPROCAL_ERROR",
      "3": "OTHER"
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
    "estimatedTime": 60,
    "explanation": "Percentage fill = (Cable Area / Enclosure Area) x 100. (150 / 500) x 100 = 0.3 x 100 = 30%."
  },
  {
    "id": 4023,
    "question": "Why is 'headroom' or spare capacity left in a trunking installation?",
    "options": [
      "To allow for future additions or maintenance",
      "To reduce the cost of the initial installation",
      "To make the trunking lighter for the wall fixings",
      "To increase the voltage of the circuits"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "OTHER",
      "3": "CONFUSED_I_V_R"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor / Enclosure Fill",
    "tags": [
      "discrimination",
      "conceptual"
    ],
    "learningOutcomeId": "203-3F-LO2",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Leaving spare capacity is good practice as it allows for future circuit additions without having to replace the entire containment system."
  },
  {
    "id": 4024,
    "question": "To find the area of a conduit with an internal diameter of 20 mm using the formula A = πr², what value should be used for 'r'?",
    "options": [
      "10 mm",
      "20 mm",
      "40 mm",
      "5 mm"
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
      "discrimination"
    ],
    "learningOutcomeId": "203-3F-LO3",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "The radius (r) is half of the diameter. Therefore, 20 mm / 2 = 10 mm."
  },
  {
    "id": 4025,
    "question": "In the context of space factor, which of the following is considered an 'enclosure'?",
    "options": [
      "Steel conduit",
      "A copper conductor",
      "A PVC cable clip",
      "A wooden joist"
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
      "conceptual",
      "terminology"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "An enclosure is a containment system like conduit or trunking that surrounds and protects cables."
  },
  {
    "id": 4026,
    "question": "What is the definition of 'space factor' (enclosure fill) in an electrical installation?",
    "options": [
      "The percentage of an enclosure's internal space occupied by cables",
      "The external diameter of the conduit compared to the wall thickness",
      "The total weight of the cables relative to the conduit length",
      "The distance between the saddles supporting the conduit"
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
      "terminology",
      "conceptual",
      "units"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Space factor is a ratio, usually expressed as a percentage, of the cross-sectional area of the cables to the internal cross-sectional area of the conduit or trunking."
  },
  {
    "id": 4027,
    "question": "Why is it important to avoid overfilling a conduit with too many cables?",
    "options": [
      "To prevent heat buildup and mechanical damage during installation",
      "To ensure the conduit remains magnetic for earthing purposes",
      "To increase the resistance of the conductors to save energy",
      "To allow the cables to vibrate at the correct frequency"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
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
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Overfilling causes friction which can tear insulation (mechanical damage) and reduces airflow, leading to overheating (thermal risk)."
  },
  {
    "id": 4028,
    "question": "A section of trunking has an internal cross-sectional area of 1000 mm². If the total area of the cables to be installed is 250 mm², what is the percentage fill?",
    "options": [
      "25%",
      "4%",
      "250%",
      "0.25%"
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
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "The percentage fill is calculated as (Total Cable Area / Enclosure Area) x 100. In this case: (250 / 1000) x 100 = 25%."
  },
  {
    "id": 4029,
    "question": "When calculating the space factor for a conduit, which measurement of the conduit must be used?",
    "options": [
      "The internal diameter",
      "The external diameter",
      "The total length of the run",
      "The wall thickness of the tube"
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
      "terminology"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Cables are installed inside the conduit, so only the internal diameter (ID) determines the available space for the cables."
  },
  {
    "id": 4030,
    "question": "What is a likely physical consequence of pulling cables into a conduit that has a space factor that is too high?",
    "options": [
      "The cable insulation may be scraped or torn due to high friction",
      "The AC supply frequency will decrease due to the tight fit",
      "The cables will automatically convert from AC to DC current",
      "The conduit will become easier to bend once the cables are inside"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_FREQUENCY_WITH_VOLTAGE",
      "2": "CONFUSED_AC_WITH_DC",
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
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "High space factor leads to high friction during the 'pull-in' phase, which often results in mechanical damage to the cable's outer sheath or insulation."
  },
  {
    "id": 4031,
    "question": "In electrical installation technology, how is the 'space factor' of a conduit or trunking system best defined?",
    "options": [
      "The percentage of the internal cross-sectional area of an enclosure occupied by cables",
      "The ratio of the external diameter of the conduit to the number of cables inside",
      "The total weight of the cables compared to the mechanical strength of the enclosure",
      "The amount of air gap required between the conduit and the building structure"
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
      "terminology",
      "conceptual",
      "units"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Space factor (or enclosure fill) is a percentage calculation comparing the total cross-sectional area of the cables to the available space inside the conduit or trunking."
  },
  {
    "id": 4032,
    "question": "An electrician is calculating the space factor for a 25mm PVC conduit. Which dimension must they use to ensure the calculation is accurate?",
    "options": [
      "The internal diameter of the conduit",
      "The external diameter of the conduit",
      "The wall thickness of the conduit",
      "The total length of the conduit run"
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
      "conceptual"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "Cables occupy the space inside the conduit; therefore, the internal diameter (ID) is the only dimension that determines the available cross-sectional area."
  },
  {
    "id": 4033,
    "question": "A conduit has an internal cross-sectional area of 314 mm². It contains three cables, each with an overall cross-sectional area of 30 mm². What is the percentage fill?",
    "options": [
      "28.7%",
      "9.5%",
      "10.4%",
      "90.0%"
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
      "application"
    ],
    "learningOutcomeId": "203-3F-LO3",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "Total cable area = 3 x 30 = 90 mm². % Fill = (90 / 314) x 100 = 28.66%."
  },
  {
    "id": 4034,
    "question": "Why is it considered poor practice to exceed the recommended space factor when installing cables in a long conduit run with several bends?",
    "options": [
      "It increases friction, making it likely that the cable insulation will be damaged during pulling",
      "It causes the conduit to expand and crack due to the lack of internal air pressure",
      "It reduces the voltage drop across the circuit to dangerously low levels",
      "It prevents the Earth Continuity Conductor from making contact with the conduit wall"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_AC_DC_SOURCES",
      "2": "CONFUSED_I_V_R",
      "3": "TOPOLOGY_CONFUSION"
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
    "explanation": "Overfilling increases mechanical resistance. When pulling cables through bends, high friction can scrape or tear the insulation, leading to short circuits or earth faults."
  },
  {
    "id": 4035,
    "question": "A section of trunking measures 50mm x 50mm internally. If the total cross-sectional area of the installed cables is 1,125 mm², what is the space factor?",
    "options": [
      "45%",
      "22.5%",
      "50%",
      "11.25%"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "ROUNDING_ERROR",
      "2": "MULTIPLIED_INSTEAD",
      "3": "DIVIDED_INSTEAD"
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
    "explanation": "Trunking area = 50 x 50 = 2,500 mm². Space factor = (1,125 / 2,500) x 100 = 45%."
  },
  {
    "id": 4036,
    "question": "When calculating space factor, which cable measurement must be used to find the 'Total Cable Area'?",
    "options": [
      "The overall diameter including the outer insulation",
      "The cross-sectional area of the copper conductor only",
      "The thickness of the PVC insulation only",
      "The diameter of the individual copper strands"
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
      "discrimination",
      "units"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "The enclosure fill calculation must account for the entire physical space the cable takes up, which includes both the conductor and its insulation/sheathing."
  },
  {
    "id": 4037,
    "question": "What is the primary thermal risk associated with overfilling an enclosure with current-carrying conductors?",
    "options": [
      "Heat cannot dissipate effectively, leading to insulation breakdown",
      "The air inside the conduit becomes ionized and causes arcing",
      "The resistance of the cables decreases, causing a massive current surge",
      "The conduit will melt and fuse to the copper conductors"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_AC_DC_SOURCES",
      "2": "CONFUSED_I_V_R",
      "3": "OTHER"
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
    "explanation": "Cables generate heat when carrying current. If they are packed too tightly, there is insufficient air to carry the heat away, causing the temperature to rise and potentially damaging the insulation."
  },
  {
    "id": 4038,
    "question": "A conduit has an internal diameter of 20mm. Calculate the approximate internal area of the conduit.",
    "options": [
      "314 mm²",
      "1,256 mm²",
      "62.8 mm²",
      "400 mm²"
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
    "learningOutcomeId": "203-3F-LO3",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "Area = πr². If diameter is 20mm, radius is 10mm. Area = 3.14159 x 10² = 314.16 mm²."
  },
  {
    "id": 4039,
    "question": "An installation requires 10 cables, each with an area of 12 mm², to be installed in a trunking with an internal area of 400 mm². What is the space factor, and is it likely to be acceptable if the limit is 45%?",
    "options": [
      "30%, which is acceptable",
      "12%, which is acceptable",
      "48%, which is too full",
      "3.3%, which is acceptable"
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
      "application",
      "calculation",
      "discrimination"
    ],
    "learningOutcomeId": "203-3F-LO4",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "Total cable area = 10 x 12 = 120 mm². Space factor = (120 / 400) x 100 = 30%. Since 30% < 45%, it is acceptable."
  },
  {
    "id": 4040,
    "question": "Which of the following is a practical reason for maintaining a low space factor in a new electrical installation?",
    "options": [
      "To allow for the easy addition of circuits in the future",
      "To reduce the cost of the cables by using smaller diameters",
      "To ensure the conduit acts as a better insulator against moisture",
      "To increase the frequency of the AC supply within the cables"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "TOPOLOGY_CONFUSION",
      "3": "CONFUSED_FREQUENCY_WITH_VOLTAGE"
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
    "estimatedTime": 45,
    "explanation": "Leaving spare capacity in conduits and trunking is a sign of good workmanship, as it allows for future modifications or additions without needing to install new containment."
  },
  {
    "id": 4041,
    "question": "Which of the following best defines the term 'space factor' in relation to electrical containment systems?",
    "options": [
      "The percentage of the internal area of an enclosure that is occupied by cables",
      "The ratio of the external diameter of a conduit to the total number of cables inside",
      "The maximum weight of cables that can be supported by a trunking run",
      "The total distance between the outer surface of a cable and the inner wall of the conduit"
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
      "conceptual",
      "units"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Space factor (or enclosure fill) is specifically the ratio of the total cross-sectional area of the cables to the internal cross-sectional area of the enclosure, expressed as a percentage."
  },
  {
    "id": 4042,
    "question": "When calculating the available space inside a piece of conduit, why must an electrician use the internal diameter (ID) rather than the external diameter (OD)?",
    "options": [
      "The wall thickness of the conduit does not provide space for cables",
      "The external diameter is only used for calculating the number of conduit saddles",
      "The internal diameter is always 50% of the external diameter",
      "Using the external diameter would lead to an underestimation of the fill percentage"
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
      "conceptual",
      "calculation",
      "units"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Cables are installed inside the conduit; therefore, the wall thickness must be subtracted from the external size to find the actual usable area (internal diameter)."
  },
  {
    "id": 4043,
    "question": "An electrician is pulling cables into a long run of 20mm conduit. If the space factor is exceeded, what is the most immediate mechanical risk during installation?",
    "options": [
      "Tearing or scraping of the cable insulation due to high friction",
      "The conduit will expand due to the physical pressure of the cables",
      "The AC frequency of the circuit will decrease due to congestion",
      "The cables will become magnetized and stick to the conduit walls"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "CONFUSED_FREQUENCY_WITH_CURRENT",
      "3": "CONFUSED_AC_DC_SOURCES"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor / Enclosure Fill",
    "tags": [
      "application",
      "health-safety",
      "conceptual"
    ],
    "learningOutcomeId": "203-3F-LO2",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 75,
    "explanation": "Overfilling a conduit increases friction significantly, which can lead to mechanical damage (tearing or stretching) of the cable insulation as they are pulled through."
  },
  {
    "id": 4044,
    "question": "Calculate the approximate percentage fill for a 20mm internal diameter conduit containing two cables, each with an overall diameter of 8mm.",
    "options": [
      "32%",
      "80%",
      "40%",
      "16%"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "MULTIPLIED_INSTEAD",
      "3": "RECIPROCAL_ERROR"
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
    "explanation": "Conduit Area = π x 10² ≈ 314mm². Cable Area (1) = π x 4² ≈ 50.26mm². Total Cable Area = 100.52mm². % Fill = (100.52 / 314) x 100 ≈ 32%."
  },
  {
    "id": 4045,
    "question": "A section of trunking measures 50mm x 50mm internally. If it contains 10 cables that each have a cross-sectional area of 100mm², what is the space factor?",
    "options": [
      "40%",
      "20%",
      "50%",
      "10%"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "DIVIDED_INSTEAD",
      "2": "ROUNDING_ERROR",
      "3": "UNITS_MISSING"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor / Enclosure Fill",
    "tags": [
      "calculation",
      "units",
      "application"
    ],
    "learningOutcomeId": "203-3F-LO3",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "Trunking Area = 50 x 50 = 2500mm². Total Cable Area = 10 x 100 = 1000mm². % Fill = (1000 / 2500) x 100 = 40%."
  },
  {
    "id": 4046,
    "question": "Which of the following is a long-term thermal consequence of exceeding the recommended space factor in a containment system?",
    "options": [
      "Heat cannot dissipate, leading to insulation breakdown",
      "The resistance of the cables will decrease as they get hotter",
      "The RMS voltage of the circuit will increase automatically",
      "The frequency of the AC supply will fluctuate"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_I_V_R",
      "2": "CONFUSED_RMS_WITH_PEAK",
      "3": "CONFUSED_FREQUENCY_WITH_VOLTAGE"
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
    "difficulty": 2,
    "estimatedTime": 75,
    "explanation": "Cables generate heat due to resistance. If they are packed too tightly, there is insufficient air circulation to carry heat away, which can cause the insulation to melt or degrade over time."
  },
  {
    "id": 4047,
    "question": "In the UK, why is it considered good practice to leave a significant amount of 'headroom' (empty space) in trunking installations?",
    "options": [
      "To allow for future additions and ease of maintenance",
      "To ensure the magnetic fields of AC cables do not cancel out",
      "To prevent the trunking from becoming too heavy for the wall fixings",
      "To allow the cables to vibrate at 50Hz without touching each other"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "OTHER",
      "3": "CONFUSED_FREQUENCY_WITH_CURRENT"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor / Enclosure Fill",
    "tags": [
      "conceptual",
      "application",
      "discrimination"
    ],
    "learningOutcomeId": "203-3F-LO4",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Leaving spare capacity (headroom) is a hallmark of professional workmanship, allowing future circuits to be added without replacing the entire containment system."
  },
  {
    "id": 4048,
    "question": "An electrician needs to install 4 cables, each with an overall diameter of 7mm, into a conduit with an internal diameter of 25mm. Calculate the percentage fill.",
    "options": [
      "31%",
      "45%",
      "28%",
      "14%"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "ROUNDING_ERROR",
      "2": "USED_SERIES_RULE",
      "3": "DIVIDED_INSTEAD"
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
    "explanation": "Conduit Area = π x 12.5² ≈ 490.9mm². Cable Area (1) = π x 3.5² ≈ 38.5mm². Total Cable Area = 4 x 38.5 = 154mm². % Fill = (154 / 490.9) x 100 ≈ 31.3%."
  },
  {
    "id": 4049,
    "question": "When calculating the space factor for a rectangular trunking, which mathematical process is correct?",
    "options": [
      "Divide the sum of cable areas by the trunking's internal width multiplied by its height",
      "Multiply the total cable diameter by the trunking's external perimeter",
      "Divide the trunking width by the number of cables and multiply by 100",
      "Add the diameters of all cables and divide by the diagonal of the trunking"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "FORMULA_NOT_REARRANGED",
      "2": "USED_SERIES_RULE",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor / Enclosure Fill",
    "tags": [
      "discrimination",
      "calculation",
      "terminology"
    ],
    "learningOutcomeId": "203-3F-LO3",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 75,
    "explanation": "The area of a rectangle is width x height. To find the space factor, you divide the total area of the cables by this internal area."
  },
  {
    "id": 4050,
    "question": "A technician is comparing the fill of two identical conduit runs. Run A carries DC cables and Run B carries AC cables. Regarding space factor rules, which statement is true?",
    "options": [
      "The mathematical calculation for space factor remains the same for both AC and DC",
      "AC cables require 50% more space because the current alternates",
      "DC cables do not require a space factor calculation as they do not get hot",
      "The space factor only applies to AC circuits due to the 50Hz frequency"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_AC_WITH_DC",
      "2": "CONFUSED_AC_DC_SOURCES",
      "3": "CONFUSED_FREQUENCY_WITH_VOLTAGE"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor / Enclosure Fill",
    "tags": [
      "conceptual",
      "ac-dc",
      "discrimination"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "While AC and DC have different electrical characteristics, the 'space factor' is a physical/mechanical calculation based on cross-sectional area, so the formula does not change."
  },
  {
    "id": 4051,
    "question": "When calculating the space factor for a conduit installation, which specific dimension of the conduit must be used to determine the available area?",
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
      "units",
      "terminology",
      "calculation"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "The space factor is based on the usable space inside the enclosure; therefore, the internal diameter of the conduit is used to calculate the available cross-sectional area."
  },
  {
    "id": 4052,
    "question": "Why is overfilling a trunking or conduit system considered a significant thermal risk for electrical cables?",
    "options": [
      "It reduces air circulation around cables, preventing heat dissipation",
      "It increases the electrical resistance of the cable conductors",
      "It causes the supply frequency to fluctuate due to induction",
      "It increases the voltage drop across the length of the run"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_I_V_R",
      "2": "CONFUSED_FREQUENCY_WITH_VOLTAGE",
      "3": "CONFUSED_AC_DC_SOURCES"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor / Enclosure Fill",
    "tags": [
      "conceptual",
      "health-safety"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Cables generate heat when carrying current. If an enclosure is overfilled, there is less air to carry heat away, which can lead to insulation breakdown and fire risks."
  },
  {
    "id": 4053,
    "question": "A section of conduit has an internal diameter of 20 mm. If it contains four cables, each with an overall diameter of 5 mm, what is the approximate percentage fill (space factor)?",
    "options": [
      "25%",
      "100%",
      "6.25%",
      "50%"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "OTHER",
      "3": "FORMULA_NOT_REARRANGED"
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
    "estimatedTime": 120,
    "explanation": "Conduit area = π × 10² ≈ 314 mm². Area of one cable = π × 2.5² ≈ 19.63 mm². Total cable area = 19.63 × 4 = 78.52 mm². % fill = (78.52 / 314) × 100 = 25%."
  },
  {
    "id": 4054,
    "question": "What is the primary mechanical risk associated with exceeding the recommended space factor when installing cables in a conduit system with several bends?",
    "options": [
      "Damage to cable insulation caused by high friction and snagging",
      "The conduit collapsing under the weight of the cables",
      "The cables becoming magnetized and sticking to the conduit walls",
      "The reduction of the conduit's external corrosion resistance"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "TOPOLOGY_CONFUSION",
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
    "estimatedTime": 60,
    "explanation": "Overfilling increases the force required to pull cables through, especially around bends. This leads to friction that can scrape or tear the insulation, potentially causing future faults."
  },
  {
    "id": 4055,
    "question": "An electrician is installing 10 cables, each with a total cross-sectional area of 30 mm², into a 50 mm x 50 mm trunking. What is the calculated space factor for this installation?",
    "options": [
      "12%",
      "1.2%",
      "8.3%",
      "30%"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "UNITS_MISSING",
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
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "Total cable area = 10 × 30 mm² = 300 mm². Trunking area = 50 mm × 50 mm = 2500 mm². Space factor = (300 / 2500) × 100 = 12%."
  },
  {
    "id": 4056,
    "question": "Which measurement is the critical denominator when calculating the space factor of a conduit system to ensure safe cable installation?",
    "options": [
      "The internal cross-sectional area of the conduit",
      "The external cross-sectional area of the conduit",
      "The total cross-sectional area of the copper conductors only",
      "The internal diameter of the conduit multiplied by the cable length"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "FORMULA_NOT_REARRANGED"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor / Enclosure Fill",
    "tags": [
      "units",
      "terminology",
      "conceptual"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 90,
    "explanation": "Space factor is the ratio of cable area to the available space inside the enclosure. Therefore, the internal cross-sectional area of the conduit is the correct reference point."
  },
  {
    "id": 4057,
    "question": "Why does overfilling a trunking with AC power cables increase the fire risk, even if the circuit protective devices are correctly rated for the cables?",
    "options": [
      "Reduced air volume restricts heat dissipation, leading to thermal insulation breakdown",
      "The cables will experience a significant increase in ohmic resistance due to crowding",
      "The frequency of the AC supply increases when cables are physically compressed",
      "Overfilling creates a transformer effect that boosts the voltage to dangerous levels"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_I_V_R",
      "2": "CONFUSED_FREQUENCY_WITH_VOLTAGE",
      "3": "CONFUSED_TRANSFORMER_WITH_AC_DC"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor / Enclosure Fill",
    "tags": [
      "application",
      "health-safety",
      "ac-dc"
    ],
    "learningOutcomeId": "203-3F-LO2",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 120,
    "explanation": "Cables generate heat during operation. If the enclosure (trunking) is too full, there is insufficient air to carry heat away, which can lead to the insulation melting or catching fire."
  },
  {
    "id": 4058,
    "question": "A conduit has an internal diameter (ID) of 25 mm. It contains four cables, each with an overall diameter of 7 mm. Calculate the approximate space factor for this installation.",
    "options": [
      "31.4%",
      "112.0%",
      "7.8%",
      "28.0%"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "DIVIDED_INSTEAD",
      "3": "FORMULA_NOT_REARRANGED"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor / Enclosure Fill",
    "tags": [
      "calculation",
      "units",
      "application"
    ],
    "learningOutcomeId": "203-3F-LO3",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 180,
    "explanation": "Conduit area = π * (12.5)² ≈ 490.87 mm². Single cable area = π * (3.5)² ≈ 38.48 mm². Total cable area = 4 * 38.48 = 153.92 mm². Space factor = (153.92 / 490.87) * 100 ≈ 31.36%."
  },
  {
    "id": 4059,
    "question": "When installing three-phase AC circuits in steel trunking, why is it essential to maintain the correct space factor while ensuring all phases and neutral are in the same enclosure?",
    "options": [
      "To allow magnetic fields to cancel out, preventing eddy currents and enclosure heating",
      "To increase the frequency of the magnetic flux to 50 Hz within the steel",
      "To ensure the RMS voltage is evenly distributed across the trunking surface",
      "To convert the AC magnetic field into a DC static field for safety"
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
      "electromagnetic-induction"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 150,
    "explanation": "In AC circuits, magnetic fields around conductors cancel if they are grouped. If separated in a metallic enclosure, the alternating fields induce eddy currents in the steel, causing significant heating."
  },
  {
    "id": 4060,
    "question": "A section of rectangular trunking measures 100 mm by 50 mm internally. If the maximum allowed space factor is 45%, what is the maximum total cross-sectional area (including insulation) all cables can occupy?",
    "options": [
      "2250 mm²",
      "5000 mm²",
      "1125 mm²",
      "450 mm²"
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
      "units"
    ],
    "learningOutcomeId": "203-3F-LO4",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "Trunking area = 100 * 50 = 5000 mm². Max cable area = 45% of 5000 = 0.45 * 5000 = 2250 mm²."
  },
  {
    "id": 4061,
    "question": "How does the RMS voltage rating of a cable typically affect the space factor calculation for a given conduit size?",
    "options": [
      "Higher voltage ratings require thicker insulation, increasing the cable's overall diameter",
      "Higher RMS voltage reduces the physical size of the cable due to increased pressure",
      "The voltage rating only affects the copper core and has no impact on space factor",
      "The space factor must be doubled for any cable exceeding 230V RMS"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_RMS_WITH_PEAK",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "USED_SERIES_RULE"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor / Enclosure Fill",
    "tags": [
      "conceptual",
      "rms-peak",
      "units"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 90,
    "explanation": "Cables rated for higher voltages require thicker insulation to prevent breakdown. This increases the 'overall diameter' used in space factor calculations."
  },
  {
    "id": 4062,
    "question": "An electrician is adding three 5 mm diameter cables to an existing 20 mm ID conduit that is already at 15% fill. What will be the new approximate space factor?",
    "options": [
      "33.8%",
      "18.8%",
      "25.0%",
      "45.0%"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "MULTIPLIED_INSTEAD",
      "2": "FORMULA_NOT_REARRANGED",
      "3": "USED_SERIES_RULE"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor / Enclosure Fill",
    "tags": [
      "calculation",
      "application"
    ],
    "learningOutcomeId": "203-3F-LO3",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 180,
    "explanation": "Conduit Area = π*10² ≈ 314.16. Existing cable area = 15% of 314.16 ≈ 47.12. New cable area = 3 * (π * 2.5²) ≈ 3 * 19.63 ≈ 58.89. Total area = 47.12 + 58.89 = 106.01. New % = (106.01 / 314.16) * 100 ≈ 33.75%."
  },
  {
    "id": 4063,
    "question": "Which of the following describes a 'discrimination' issue regarding enclosure fill rather than a thermal issue?",
    "options": [
      "The inability to pull in additional cables in the future due to lack of physical space",
      "The melting of insulation due to mutual heating of bundled conductors",
      "The reduction of current carrying capacity (Iz) due to grouping factors",
      "The induction of eddy currents in the metal walls of the trunking"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "CONFUSED_AC_DC_SOURCES"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor / Enclosure Fill",
    "tags": [
      "discrimination",
      "conceptual",
      "terminology"
    ],
    "learningOutcomeId": "203-3F-LO2",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 90,
    "explanation": "Discrimination in this context refers to distinguishing between mechanical/workmanship issues (like future capacity) and electrical/thermal issues (like overheating)."
  },
  {
    "id": 4064,
    "question": "A technician calculates that 8 cables with an area of 25 mm² each are being installed into a 40 mm by 40 mm trunking. What is the space factor, and is it likely to be acceptable if the limit is 45%?",
    "options": [
      "12.5%, which is acceptable",
      "20.0%, which is acceptable",
      "50.0%, which is too full",
      "80.0%, which is too full"
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
      "discrimination",
      "application"
    ],
    "learningOutcomeId": "203-3F-LO4",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 150,
    "explanation": "Total cable area = 8 * 25 = 200 mm². Trunking area = 40 * 40 = 1600 mm². Space factor = (200 / 1600) * 100 = 12.5%. This is well below the 45% limit."
  },
  {
    "id": 4065,
    "question": "What is the primary risk of using the 'outside diameter' of a conduit when performing a space factor calculation?",
    "options": [
      "The calculation will overestimate the available space, potentially leading to overfilling",
      "The calculation will underestimate the space factor, making the conduit appear too small",
      "The calculation will cause the RMS voltage to drop across the conduit wall",
      "The calculation will incorrectly suggest that DC current can be used in the conduit"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "WRONG_UNITS",
      "2": "CONFUSED_RMS_WITH_PEAK",
      "3": "CONFUSED_AC_WITH_DC"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor / Enclosure Fill",
    "tags": [
      "conceptual",
      "terminology",
      "units"
    ],
    "learningOutcomeId": "203-3F-LO3",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "The outside diameter includes the conduit wall thickness. Using it in the formula suggests there is more room for cables than actually exists inside, leading to a dangerous overfill."
  }
];
