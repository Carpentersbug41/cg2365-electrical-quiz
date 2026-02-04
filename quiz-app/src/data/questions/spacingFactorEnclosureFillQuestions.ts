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
      "The percentage of an enclosure's internal area occupied by cables",
      "The total length of cable that can fit inside a conduit",
      "The thickness of the insulation on a single conductor",
      "The external diameter of the conduit or trunking"
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
      "terminology",
      "conceptual"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Space factor is the ratio of the total cross-sectional area of cables to the internal cross-sectional area of the enclosure, expressed as a percentage."
  },
  {
    "id": 4017,
    "question": "Why is it important to avoid overfilling conduit and trunking with cables?",
    "options": [
      "To prevent heat buildup and mechanical damage to insulation",
      "To ensure the voltage of the circuit remains constant",
      "To prevent the cables from becoming magnetized",
      "To increase the resistance of the conductors"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_I_V_R",
      "2": "OTHER",
      "3": "CONFUSED_I_V_R"
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
    "explanation": "Overfilling restricts airflow, leading to heat buildup, and increases the risk of insulation damage during the cable pulling process."
  },
  {
    "id": 4018,
    "question": "When calculating the space factor for a circular conduit, which dimension must be used?",
    "options": [
      "Internal diameter",
      "External diameter",
      "Wall thickness",
      "Outer circumference"
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
    "explanation": "The space available for cables is determined by the internal diameter of the conduit, not the external size."
  },
  {
    "id": 4019,
    "question": "Which mathematical formula is used to calculate the internal cross-sectional area of a conduit?",
    "options": [
      "π × r²",
      "Width × Height",
      "π × d",
      "2 × π × r"
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
      "calculation",
      "units"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Conduit is circular, so the standard formula for the area of a circle (πr²) is used."
  },
  {
    "id": 4020,
    "question": "A section of trunking has an internal area of 2000 mm². If the total area of the cables inside is 500 mm², what is the percentage fill?",
    "options": [
      "25%",
      "4%",
      "40%",
      "50%"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "RECIPROCAL_ERROR",
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
    "difficulty": 1,
    "estimatedTime": 60,
    "explanation": "(Cable Area / Enclosure Area) x 100 = (500 / 2000) x 100 = 25%."
  },
  {
    "id": 4021,
    "question": "What is a likely consequence of overfilling a conduit that contains several 90-degree bends?",
    "options": [
      "Insulation may be scraped or torn during installation",
      "The frequency of the AC supply will decrease",
      "The magnetic field around the cables will disappear",
      "The cables will become easier to pull through"
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
      "health-safety"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "High friction at bends in an overfilled conduit often leads to mechanical damage (snagging or tearing) of the cable insulation."
  },
  {
    "id": 4022,
    "question": "How is the internal cross-sectional area of a rectangular trunking calculated?",
    "options": [
      "Width × Height",
      "π × Radius squared",
      "Length + Width + Height",
      "Width × 4"
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
    "estimatedTime": 45,
    "explanation": "Trunking is rectangular, so its area is calculated by multiplying the internal width by the internal height."
  },
  {
    "id": 4023,
    "question": "Why should an electrician provide 'headroom' (spare space) when installing trunking?",
    "options": [
      "To allow for future additions and ease of maintenance",
      "To prevent the voltage from dropping over distance",
      "To ensure the trunking remains lightweight",
      "To allow the trunking to be used as a spare conductor"
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
      "application"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Leaving spare capacity is a sign of good workmanship, allowing for future circuit additions without replacing the entire enclosure."
  },
  {
    "id": 4024,
    "question": "If a calculated space factor is 55% and the maximum limit for that enclosure is 45%, the installation is:",
    "options": [
      "Non-compliant because it is too full",
      "Compliant because it is over 50%",
      "Safe as long as the cables are DC",
      "Only a problem if the conduit is metal"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "CONFUSED_AC_WITH_DC",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor / Enclosure Fill",
    "tags": [
      "discrimination",
      "application"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "If the calculated percentage exceeds the allowed limit, the enclosure is overfilled and does not meet safety or installation standards."
  },
  {
    "id": 4025,
    "question": "Which measurement is used to find the cross-sectional area of an individual cable for space factor calculations?",
    "options": [
      "The overall diameter including the insulation",
      "The diameter of the bare copper conductor",
      "The length of the cable being installed",
      "The color of the outer insulation"
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
      "units"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "The 'fill' is based on the total space the cable takes up, so the overall diameter (including insulation) must be used."
  },
  {
    "id": 4026,
    "question": "What is the definition of 'space factor' when installing cables in an enclosure?",
    "options": [
      "The percentage of the internal space of an enclosure occupied by cables",
      "The total length of the conduit run between two draw-in boxes",
      "The thickness of the insulation surrounding the conductors",
      "The distance required between the enclosure and the building structure"
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
      "explanation"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Space factor (or enclosure fill) is the ratio of the total cross-sectional area of the cables to the internal cross-sectional area of the conduit or trunking, expressed as a percentage."
  },
  {
    "id": 4027,
    "question": "Why is it important to avoid overfilling a conduit with cables?",
    "options": [
      "To prevent heat buildup and mechanical damage during installation",
      "To ensure the voltage remains at a constant frequency",
      "To prevent the conduit from becoming magnetic",
      "To reduce the resistance of the copper conductors"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_FREQUENCY_WITH_VOLTAGE",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "CONFUSED_I_V_R"
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
    "explanation": "Overfilling restricts airflow, leading to overheating, and increases friction during the pulling-in process, which can tear or scrape cable insulation."
  },
  {
    "id": 4028,
    "question": "When calculating the space factor for a circular conduit, which dimension must be used to find the available area?",
    "options": [
      "The internal diameter",
      "The external diameter",
      "The wall thickness",
      "The total length of the conduit"
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
      "units"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "The internal diameter defines the actual space available for cables. Using the external diameter would result in an incorrect calculation as it includes the thickness of the conduit material."
  },
  {
    "id": 4029,
    "question": "A section of trunking has an internal cross-sectional area of 2,000 mm². If the total area of the cables to be installed is 500 mm², what is the percentage fill?",
    "options": [
      "25%",
      "4%",
      "40%",
      "50%"
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
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Percentage fill is calculated as (Cable Area / Enclosure Area) x 100. Therefore: (500 / 2000) x 100 = 0.25 x 100 = 25%."
  },
  {
    "id": 4030,
    "question": "Which formula is used to calculate the percentage space factor (fill) for an enclosure?",
    "options": [
      "(Total cable area ÷ Enclosure internal area) x 100",
      "(Enclosure internal area ÷ Total cable area) x 100",
      "(Total cable area + Enclosure internal area) ÷ 2",
      "Total cable area x Enclosure internal area"
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
      "application"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "To find the percentage of space used, you divide the area taken up by cables by the total area available, then multiply by 100."
  },
  {
    "id": 4031,
    "question": "In electrical installation technology, what is the best definition of the 'space factor' within a conduit or trunking system?",
    "options": [
      "The percentage of the internal cross-sectional area of an enclosure occupied by cables",
      "The ratio of the external diameter of the conduit to the total diameter of the cables",
      "The total weight of the cables compared to the mechanical strength of the enclosure",
      "The distance between the outside of the cable insulation and the internal wall of the conduit"
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
      "conceptual",
      "units"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Space factor is defined as the percentage of the internal cross-sectional area of an enclosure (like conduit or trunking) that is taken up by the cables inside it."
  },
  {
    "id": 4032,
    "question": "Why is it critical to use the internal diameter rather than the external diameter when calculating the space factor of a conduit?",
    "options": [
      "The internal diameter defines the actual space available for cables to occupy",
      "The external diameter is only used for calculating the weight of the conduit",
      "The wall thickness of the conduit increases the resistance of the cables inside",
      "The external diameter changes depending on the frequency of the AC supply"
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
      "conceptual",
      "calculation",
      "terminology"
    ],
    "learningOutcomeId": "203-3F-LO2",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Cables are installed inside the conduit; therefore, only the internal cross-sectional area represents the available space for the installation."
  },
  {
    "id": 4033,
    "question": "An electrician is pulling cables into a long run of conduit. If the space factor is exceeded (overfilled), what is the primary mechanical risk during installation?",
    "options": [
      "Excessive friction causing the cable insulation to tear or scrape",
      "The conduit expanding due to the physical pressure of the cables",
      "A decrease in the frequency of the AC current flowing through the conductors",
      "The weight of the cables causing the conduit to become a permanent magnet"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "CONFUSED_FREQUENCY_WITH_CURRENT",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor / Enclosure Fill",
    "tags": [
      "conceptual",
      "health-safety",
      "application"
    ],
    "learningOutcomeId": "203-3F-LO2",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Overfilling an enclosure increases friction, which makes pulling cables difficult and often leads to mechanical damage of the cable's insulation."
  },
  {
    "id": 4034,
    "question": "Calculate the total internal cross-sectional area of a section of trunking with internal dimensions of 75 mm x 50 mm.",
    "options": [
      "3,750 mm²",
      "250 mm²",
      "125 mm²",
      "5,625 mm²"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_SERIES_RULE",
      "2": "DIVIDED_INSTEAD",
      "3": "MULTIPLIED_INSTEAD"
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
    "explanation": "The area of a rectangular trunking is calculated as Width x Height. 75 mm * 50 mm = 3,750 mm²."
  },
  {
    "id": 4035,
    "question": "A conduit has an internal diameter of 20 mm. What is the approximate internal cross-sectional area available for cables? (Use π = 3.14)",
    "options": [
      "314 mm²",
      "1,256 mm²",
      "62.8 mm²",
      "100 mm²"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "FORMULA_NOT_REARRANGED",
      "2": "MULTIPLIED_INSTEAD",
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
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "Area = πr². If diameter is 20mm, radius is 10mm. Area = 3.14 * 10² = 314 mm²."
  },
  {
    "id": 4036,
    "question": "When current flows through cables in a confined space, heat is generated. How does overfilling a conduit affect this thermal condition?",
    "options": [
      "It restricts air circulation, preventing heat from dissipating and risking insulation failure",
      "It increases the RMS voltage of the circuit, causing the cables to run cooler",
      "It changes the AC supply into DC, which generates less heat in the enclosure",
      "It reduces the resistance of the cables, allowing more current to flow safely"
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
      "ac-dc",
      "health-safety"
    ],
    "learningOutcomeId": "203-3F-LO2",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "Cables generate heat due to resistance. If they are packed too tightly, air cannot circulate to carry heat away, leading to overheating and potential fire hazards."
  },
  {
    "id": 4037,
    "question": "A run of 50 mm x 50 mm trunking contains cables with a total cross-sectional area of 500 mm². What is the space factor (percentage fill) of this installation?",
    "options": [
      "20%",
      "10%",
      "25%",
      "50%"
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
      "application"
    ],
    "learningOutcomeId": "203-3F-LO3",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "Trunking area = 50 * 50 = 2,500 mm². % Fill = (Cable Area / Trunking Area) * 100 = (500 / 2,500) * 100 = 20%."
  },
  {
    "id": 4038,
    "question": "Which of the following would be a valid reason to leave significant 'spare' capacity (a low space factor) in a new trunking installation?",
    "options": [
      "To allow for the easy addition of more circuits in the future",
      "To ensure the frequency of the mains supply remains at 50 Hz",
      "To prevent the cables from vibrating at the peak voltage of the sine wave",
      "To allow the trunking to act as a step-down transformer for the building"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_FREQUENCY_WITH_VOLTAGE",
      "2": "CONFUSED_RMS_WITH_PEAK",
      "3": "CONFUSED_TRANSFORMER_WITH_AC_DC"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor / Enclosure Fill",
    "tags": [
      "conceptual",
      "application",
      "sine-wave"
    ],
    "learningOutcomeId": "203-3F-LO4",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Good workmanship involves leaving space for future maintenance or additional cables, ensuring the installation is adaptable."
  },
  {
    "id": 4039,
    "question": "An electrician is using a conduit with an internal area of 400 mm². If the maximum permitted space factor is 40%, what is the maximum total cable area allowed inside?",
    "options": [
      "160 mm²",
      "100 mm²",
      "40 mm²",
      "240 mm²"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "DIVIDED_INSTEAD",
      "2": "UNITS_MISSING",
      "3": "FORMULA_NOT_REARRANGED"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor / Enclosure Fill",
    "tags": [
      "calculation",
      "application",
      "discrimination"
    ],
    "learningOutcomeId": "203-3F-LO4",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "To find the maximum cable area, multiply the total area by the percentage limit: 400 mm² * 0.40 = 160 mm²."
  },
  {
    "id": 4040,
    "question": "Which of these scenarios correctly identifies a discrimination between trunking and conduit area calculations?",
    "options": [
      "Trunking area is calculated using width x height, while conduit area uses πr²",
      "Conduit area is always measured in cm², while trunking is always in mm²",
      "Trunking space factor is only for DC, while conduit is only for AC",
      "Conduit area is calculated by adding the diameters, while trunking uses the radius squared"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "WRONG_UNITS",
      "2": "CONFUSED_AC_WITH_DC",
      "3": "FORMULA_NOT_REARRANGED"
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
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Because of their different shapes (rectangular vs circular), trunking requires a linear area calculation (W x H) while conduit requires a circular area calculation (πr²)."
  },
  {
    "id": 4041,
    "question": "What is the primary reason for limiting the 'space factor' within a conduit or trunking system?",
    "options": [
      "To prevent heat buildup and mechanical damage to cable insulation",
      "To ensure the magnetic field from AC current can expand freely",
      "To reduce the total weight of the installation on the building structure",
      "To allow the cables to vibrate at the correct mains frequency"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_AC_DC",
      "2": "OTHER",
      "3": "CONFUSED_FREQUENCY_WITH_CURRENT"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor / Enclosure Fill",
    "tags": [
      "conceptual",
      "units",
      "health-safety"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 60,
    "explanation": "Space factor limits ensure there is enough air for heat dissipation and enough physical room to pull cables through without tearing the insulation due to friction."
  },
  {
    "id": 4042,
    "question": "When calculating the internal cross-sectional area of a conduit for space factor purposes, which dimension must be used?",
    "options": [
      "The internal diameter",
      "The external diameter",
      "The nominal wall thickness",
      "The external circumference"
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
      "calculation",
      "units"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "Only the internal space is available for cables; using the external diameter would result in an overestimation of the available space."
  },
  {
    "id": 4043,
    "question": "A conduit has an internal diameter of 20mm. Calculate the approximate internal cross-sectional area of this conduit.",
    "options": [
      "314 mm²",
      "1256 mm²",
      "62.8 mm²",
      "400 mm²"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "FORMULA_NOT_REARRANGED",
      "2": "MULTIPLIED_INSTEAD",
      "3": "RECIPROCAL_ERROR"
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
    "explanation": "Area = πr². If diameter is 20mm, radius is 10mm. Area = 3.14159 * 10 * 10 = 314.16 mm²."
  },
  {
    "id": 4044,
    "question": "A piece of trunking has internal dimensions of 50mm x 50mm. If the total cross-sectional area of the installed cables is 1000mm², what is the space factor?",
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
      "application"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "Trunking area = 50 * 50 = 2500 mm². Space factor = (Cable Area / Trunking Area) * 100. (1000 / 2500) * 100 = 40%."
  },
  {
    "id": 4045,
    "question": "Which of the following is a likely consequence of pulling cables into an overfilled conduit with multiple 90-degree bends?",
    "options": [
      "The friction will cause the cable insulation to stretch or tear",
      "The voltage drop across the cable will decrease significantly",
      "The frequency of the AC supply will fluctuate",
      "The conduit will become magnetized and attract iron debris"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_I_V_R",
      "2": "CONFUSED_FREQUENCY_WITH_VOLTAGE",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor / Enclosure Fill",
    "tags": [
      "conceptual",
      "application",
      "health-safety"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Overfilling increases friction, especially at bends, which mechanically stresses and damages the insulation."
  },
  {
    "id": 4046,
    "question": "An electrician needs to install four cables, each with an overall diameter of 10mm, into a conduit. What is the total cross-sectional area of the cables?",
    "options": [
      "314 mm²",
      "400 mm²",
      "1256 mm²",
      "78.5 mm²"
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
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "Area of one cable = π * (5)² = 78.54 mm². Total area for 4 cables = 4 * 78.54 = 314.16 mm²."
  },
  {
    "id": 4047,
    "question": "If a specific regulation limits the space factor of a trunking run to 45%, and your calculation shows a fill of 48%, what action should be taken?",
    "options": [
      "Select a larger size of trunking",
      "Use cables with thinner insulation to reduce the area",
      "Apply lubricant to the cables to reduce the heat",
      "Ignore the result as 3% is within acceptable rounding tolerance"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "OTHER",
      "3": "ROUNDING_ERROR"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor / Enclosure Fill",
    "tags": [
      "application",
      "discrimination"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "If the calculated fill exceeds the limit, a larger enclosure must be used to comply with safety and installation standards."
  },
  {
    "id": 4048,
    "question": "How does 'enclosure fill' relate to the future-proofing of an electrical installation?",
    "options": [
      "Leaving spare capacity allows for additional circuits to be added later",
      "A higher fill percentage prevents cables from moving during a short circuit",
      "A tight fill increases the RMS voltage delivered to the load",
      "Maximum fill ensures the conduit acts as a better heat sink"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "CONFUSED_RMS_WITH_PEAK",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor / Enclosure Fill",
    "tags": [
      "conceptual",
      "discrimination"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Good workmanship involves leaving spare capacity (headroom) so that future modifications or additions can be made without replacing the entire containment system."
  },
  {
    "id": 4049,
    "question": "A student calculates the space factor by adding the diameters of all cables and dividing by the diameter of the conduit. Why is this method incorrect?",
    "options": [
      "Space factor must be calculated using cross-sectional areas, not linear diameters",
      "Diameters should be multiplied together, not added",
      "The student should have used the external circumference of the cables",
      "The method only works for DC circuits, not AC mains circuits"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "MULTIPLIED_INSTEAD",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "CONFUSED_AC_WITH_DC"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor / Enclosure Fill",
    "tags": [
      "conceptual",
      "discrimination",
      "calculation"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "Space factor is a ratio of areas. Adding diameters does not account for the circular geometry and the empty spaces between the cables."
  },
  {
    "id": 4050,
    "question": "Which of the following describes the 'Space Factor' in plain language?",
    "options": [
      "The percentage of the internal space of an enclosure occupied by cables",
      "The distance required between conduit supports",
      "The maximum length of a conduit run before a draw-in box is needed",
      "The ratio of the cable's copper core to its external insulation"
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
      "terminology",
      "conceptual"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "Space factor is simply a measure (usually a percentage) of how much of the inside of a tube or box is filled with cable."
  },
  {
    "id": 4051,
    "question": "Why is it critical to limit the number of cables installed within a conduit or trunking system to a specific space factor?",
    "options": [
      "To prevent heat build-up and mechanical damage to cable insulation",
      "To ensure the resistance of the conductors remains at zero",
      "To allow the AC frequency to fluctuate safely within the enclosure",
      "To reduce the voltage drop by increasing the air gap around cables"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_I_V_R",
      "2": "CONFUSED_FREQUENCY_WITH_VOLTAGE",
      "3": "CONFUSED_TERMINOLOGY"
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
    "explanation": "Limiting the space factor ensures there is enough air to dissipate heat and enough physical room to pull cables through without tearing the insulation."
  },
  {
    "id": 4052,
    "question": "When calculating the space factor for a conduit installation, which dimension of the conduit must be used to determine the available area?",
    "options": [
      "The internal diameter",
      "The external diameter",
      "The total length of the conduit run",
      "The thickness of the conduit wall"
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
      "terminology",
      "discrimination",
      "units"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "The available space for cables is defined by the internal diameter of the conduit; using the external diameter would result in an overestimation of available space."
  },
  {
    "id": 4053,
    "question": "A section of trunking has internal dimensions of 50 mm x 50 mm. If the total cross-sectional area of the cables to be installed is 1,125 mm², what is the percentage fill?",
    "options": [
      "45%",
      "22.5%",
      "0.45%",
      "50%"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "DIVIDED_INSTEAD",
      "2": "WRONG_UNITS",
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
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "Trunking area = 50 x 50 = 2500 mm². Percentage fill = (1125 / 2500) x 100 = 45%."
  },
  {
    "id": 4054,
    "question": "Which of the following is a direct consequence of exceeding the recommended space factor in a cable enclosure?",
    "options": [
      "Premature breakdown of insulation due to thermal stress",
      "A change in the supply from Alternating Current (AC) to Direct Current (DC)",
      "An increase in the RMS voltage of the circuit",
      "The creation of a magnetic vacuum within the trunking"
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
      "discrimination",
      "ac-dc"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Overfilling prevents air circulation, leading to heat build-up which causes the cable insulation to degrade and eventually fail."
  },
  {
    "id": 4055,
    "question": "An electrician is installing four cables, each with an overall diameter of 10 mm, into a conduit with an internal diameter of 40 mm. Using π = 3.14, calculate the approximate space factor.",
    "options": [
      "25%",
      "50%",
      "6.25%",
      "10%"
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
      "application",
      "units"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 120,
    "explanation": "Conduit area = 3.14 x 20² = 1256 mm². One cable area = 3.14 x 5² = 78.5 mm². Total cable area = 4 x 78.5 = 314 mm². % fill = (314 / 1256) x 100 = 25%."
  },
  {
    "id": 4056,
    "question": "An electrician is installing several single-core cables into a length of steel conduit. Why is it critical to calculate the space factor based on the internal cross-sectional area rather than the external diameter of the conduit?",
    "options": [
      "The external diameter includes the wall thickness which provides no usable space for cable heat dissipation or movement",
      "The external diameter is only used for calculating the mechanical strength of the conduit supports",
      "The internal area is used to determine the magnetic flux density of the AC circuit",
      "The external diameter varies based on the type of paint or galvanising used on the conduit"
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
      "conceptual",
      "units",
      "terminology"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "Space factor is concerned with the available physical room inside the enclosure. Using the external diameter would lead to an overestimation of available space because it includes the thickness of the conduit walls."
  },
  {
    "id": 4057,
    "question": "When installing AC circuits in a ferrous (steel) conduit, why does the space factor become more critical than in a DC circuit of the same current rating?",
    "options": [
      "AC causes eddy currents and hysteresis in the conduit, generating additional heat that requires more air space for dissipation",
      "AC cables have a larger physical diameter than DC cables due to the skin effect at 50 Hz",
      "The peak voltage of an AC sine wave requires thicker insulation, reducing the available space factor",
      "DC circuits do not require a space factor calculation as they do not produce a magnetic field"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_AC_WITH_DC",
      "2": "CONFUSED_RMS_WITH_PEAK",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor / Enclosure Fill",
    "tags": [
      "ac-dc",
      "conceptual",
      "explanation"
    ],
    "learningOutcomeId": "203-3F-LO2",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 150,
    "explanation": "Alternating current in conductors surrounded by ferrous material induces eddy currents and hysteresis losses in the metal, which generates heat. Sufficient air space (space factor) is needed to ensure this heat doesn't damage the cable insulation."
  },
  {
    "id": 4058,
    "question": "Calculate the percentage fill for a 32 mm internal diameter conduit containing six cables, each with an overall diameter of 10 mm. (Use π = 3.14)",
    "options": [
      "58.6%",
      "187.5%",
      "31.2%",
      "14.7%"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "FORMULA_NOT_REARRANGED",
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
    "learningOutcomeId": "203-3F-LO3",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 180,
    "explanation": "Conduit Area: π * (16^2) = 803.84 mm². Total Cable Area: 6 * (π * 5^2) = 6 * 78.5 = 471 mm². % Fill: (471 / 803.84) * 100 = 58.6%."
  },
  {
    "id": 4059,
    "question": "Which of the following describes a 'mechanical' risk associated with exceeding the recommended space factor in a long conduit run with multiple bends?",
    "options": [
      "High friction during the 'pull-in' process leading to the tearing or stretching of cable insulation",
      "The cables vibrating at 50 Hz frequency causing the conduit couplings to unscrew",
      "Increased resistance in the copper conductors due to physical compression",
      "The breakdown of air as an insulator between the cables due to lack of spacing"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_FREQUENCY_WITH_CURRENT",
      "2": "FORMULA_NOT_REARRANGED",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor / Enclosure Fill",
    "tags": [
      "conceptual",
      "application",
      "discrimination"
    ],
    "learningOutcomeId": "203-3F-LO2",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "Overfilling a conduit increases the surface contact and friction between cables and the conduit walls. During installation, this friction can physically damage (tear or stretch) the insulation, leading to future electrical faults."
  },
  {
    "id": 4060,
    "question": "A section of trunking measures 100 mm x 50 mm internally. If the maximum permitted space factor is 45%, what is the maximum total cross-sectional area available for cables?",
    "options": [
      "2,250 mm²",
      "5,000 mm²",
      "1,125 mm²",
      "4,500 mm²"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "DIVIDED_INSTEAD",
      "2": "RECIPROCAL_ERROR",
      "3": "UNITS_MISSING"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor / Enclosure Fill",
    "tags": [
      "calculation",
      "application",
      "units"
    ],
    "learningOutcomeId": "203-3F-LO4",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "Total internal area = 100 mm * 50 mm = 5,000 mm². Available area at 45% = 5,000 * 0.45 = 2,250 mm²."
  },
  {
    "id": 4061,
    "question": "When considering the RMS current rating of a cable, how does the space factor directly influence the cable's safe operating temperature?",
    "options": [
      "By maintaining an air gap that allows for convective cooling, preventing the heat from reaching the insulation's thermal limit",
      "By increasing the peak voltage capacity of the cable insulation in high-frequency circuits",
      "By ensuring the cables are held tightly together to allow heat to conduct into the conduit walls",
      "By reducing the magnetic reactance of the cables when they are spaced further apart"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_RMS_WITH_PEAK",
      "2": "TOPOLOGY_CONFUSION",
      "3": "CONFUSED_FREQUENCY_WITH_VOLTAGE"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor / Enclosure Fill",
    "tags": [
      "conceptual",
      "rms-peak",
      "explanation"
    ],
    "learningOutcomeId": "203-3F-LO2",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 150,
    "explanation": "Cables generate heat based on their RMS current. If the space factor is too high (overfilled), there is insufficient air for convection, causing the heat to build up and potentially exceed the temperature rating of the insulation."
  },
  {
    "id": 4062,
    "question": "An electrician is installing 10 cables into a trunking system. Each cable has an overall diameter of 8 mm. The trunking internal dimensions are 50 mm x 50 mm. What is the approximate percentage fill?",
    "options": [
      "20.1%",
      "32.0%",
      "6.4%",
      "25.5%"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_SERIES_RULE",
      "2": "ROUNDING_ERROR",
      "3": "FORMULA_NOT_REARRANGED"
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
    "difficulty": 5,
    "estimatedTime": 180,
    "explanation": "Trunking Area = 50 * 50 = 2500 mm². One cable area = π * 4² = 50.26 mm². Total cable area (10 cables) = 502.6 mm². % Fill = (502.6 / 2500) * 100 = 20.1%."
  },
  {
    "id": 4063,
    "question": "A transformer's secondary tails are being installed in a short length of trunking. If the cables are carrying high-frequency AC, why might the designer specify a lower space factor (more empty space) than for a standard 50 Hz circuit?",
    "options": [
      "To account for increased thermal stress caused by higher skin effect and proximity effect losses",
      "Because high-frequency AC requires a vacuum between cables to prevent arcing",
      "Because the RMS voltage increases significantly at higher frequencies, requiring larger enclosures",
      "To prevent the transformer from vibrating the trunking at its resonant frequency"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_FREQUENCY_WITH_VOLTAGE",
      "2": "CONFUSED_TRANSFORMER_WITH_AC_DC",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor / Enclosure Fill",
    "tags": [
      "transformers",
      "frequency",
      "conceptual"
    ],
    "learningOutcomeId": "203-3F-LO2",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 150,
    "explanation": "Higher frequencies increase the skin effect and proximity effect, leading to higher heat generation within the conductors. A lower space factor provides more air for cooling to manage this additional thermal load."
  },
  {
    "id": 4064,
    "question": "Which of these scenarios would most likely require the strictest (lowest) space factor limit in an installation?",
    "options": [
      "A long conduit run with four 90-degree bends containing multiple circuits",
      "A short, straight vertical drop of trunking with a single circuit",
      "A horizontal run of trunking in a temperature-controlled server room",
      "A DC circuit installed in a plastic (non-ferrous) conduit"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_AC_DC_SOURCES",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor / Enclosure Fill",
    "tags": [
      "application",
      "discrimination",
      "conceptual"
    ],
    "learningOutcomeId": "203-3F-LO4",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "Bends significantly increase the friction and mechanical stress during cable pulling. The more bends and the longer the run, the more 'headroom' (lower space factor) is needed to prevent cable damage."
  },
  {
    "id": 4065,
    "question": "When calculating the space factor for a rectangular trunking, which measurement is used to determine the available enclosure area?",
    "options": [
      "The internal width multiplied by the internal height",
      "The external width multiplied by the external height",
      "The sum of the four internal side lengths",
      "The cross-sectional area of the largest single cable multiplied by the number of cables"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "FORMULA_NOT_REARRANGED",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "MULTIPLIED_INSTEAD"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor / Enclosure Fill",
    "tags": [
      "discrimination",
      "terminology",
      "units"
    ],
    "learningOutcomeId": "203-3F-LO3",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 90,
    "explanation": "Trunking is rectangular, so its internal capacity (area) is calculated as Width x Height. Only internal dimensions are relevant for the space available to cables."
  }
];
