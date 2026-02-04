import { TaggedQuestion } from './types';

/**
 * Spacing Factor / Enclosure Fill Question Bank
 * Aligned with lesson 203-3F learning outcomes
 * Generated: 2026-02-04
 */

export const spacingFactorEnclosureFillQuestions: TaggedQuestion[] = [
  {
    "id": 4016,
    "question": "What is the primary reason for limiting the number of cables installed within a conduit or trunking?",
    "options": [
      "To allow for heat dissipation and prevent overheating",
      "To ensure the cables can carry a higher voltage",
      "To reduce the magnetic field around the enclosure",
      "To make the circuit resistance as low as possible"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_I_V_R",
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
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "The space factor ensures there is enough air around cables to dissipate heat and prevents damage to insulation during installation."
  },
  {
    "id": 4017,
    "question": "In the context of cable management systems, what does the term 'Space Factor' refer to?",
    "options": [
      "The percentage of the internal area of an enclosure occupied by cables",
      "The total length of the conduit run compared to the cable length",
      "The thickness of the metal or plastic used to make the trunking",
      "The distance between the saddles supporting the conduit"
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
    "explanation": "Space factor is a ratio (usually expressed as a percentage) of the cross-sectional area of the cables to the internal cross-sectional area of the enclosure."
  },
  {
    "id": 4018,
    "question": "According to general guidance in the On-Site Guide, what is the recommended maximum space factor for cables in a trunking system?",
    "options": [
      "45%",
      "100%",
      "75%",
      "20%"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "WRONG_UNITS",
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
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "The standard space factor for trunking is 45%, meaning cables should not occupy more than 45% of the internal space."
  },
  {
    "id": 4019,
    "question": "Why is it important to avoid overfilling a conduit even if the cables physically fit inside?",
    "options": [
      "To prevent damage to cable insulation when pulling them in",
      "To ensure the conduit remains waterproof",
      "To increase the frequency of the AC supply",
      "To allow the conduit to be bent more easily after installation"
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
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Overfilling causes excessive friction during installation, which can tear or stress the cable insulation."
  },
  {
    "id": 4020,
    "question": "If a section of trunking has an internal area of 1000 mm² and the installed cables have a total area of 400 mm², what is the percentage fill?",
    "options": [
      "40%",
      "4%",
      "250%",
      "60%"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "ROUNDING_ERROR",
      "2": "DIVIDED_INSTEAD",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor / Enclosure Fill",
    "tags": [
      "calculation",
      "units"
    ],
    "learningOutcomeId": "203-3F-LO2",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Percentage fill is (Cable Area / Total Area) x 100. So (400 / 1000) x 100 = 40%."
  },
  {
    "id": 4021,
    "question": "Which publication contains the standard 'factor' tables used to calculate conduit and trunking sizes for cable capacities?",
    "options": [
      "The On-Site Guide",
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
      "terminology",
      "discrimination"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "The On-Site Guide (Appendix E) provides the factor tables for determining cable capacities in conduit and trunking."
  },
  {
    "id": 4022,
    "question": "When using the factor method to select a conduit size for multiple cables, what is the first step?",
    "options": [
      "Add together the individual factors for every cable",
      "Multiply the cable factors together",
      "Divide the largest cable factor by the smallest",
      "Subtract the earth cable factor from the phase cable factor"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "MULTIPLIED_INSTEAD",
      "2": "DIVIDED_INSTEAD",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor / Enclosure Fill",
    "tags": [
      "application",
      "calculation"
    ],
    "learningOutcomeId": "203-3F-LO2",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "To find the total factor required, you must sum (add) the factors for all cables to be installed in the enclosure."
  },
  {
    "id": 4023,
    "question": "If an electrician exceeds the recommended space factor in a plastic conduit, what is the most likely risk?",
    "options": [
      "The cables may overheat and damage the conduit",
      "The AC frequency will change from 50Hz to 60Hz",
      "The insulation resistance will automatically increase",
      "The magnetic field will cause the conduit to melt"
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
      "conceptual",
      "application"
    ],
    "learningOutcomeId": "203-3F-LO3",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Excessive fill prevents air circulation, leading to heat build-up which can degrade cable insulation and soften plastic conduits."
  },
  {
    "id": 4024,
    "question": "Which of these factors would require you to use a larger conduit for the same number of cables?",
    "options": [
      "Having several bends in the conduit run",
      "Using a shorter length of conduit",
      "Installing the conduit vertically instead of horizontally",
      "Using cables with thinner insulation"
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
      "application"
    ],
    "learningOutcomeId": "203-3F-LO3",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "The more bends in a run, the harder it is to pull cables through; therefore, the 'conduit factor' is reduced, often requiring a larger conduit size."
  },
  {
    "id": 4025,
    "question": "What happens to the 'cable factor' as the cross-sectional area of a cable increases?",
    "options": [
      "The factor increases",
      "The factor decreases",
      "The factor stays exactly the same",
      "The factor becomes zero"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "RECIPROCAL_ERROR",
      "2": "OTHER",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor / Enclosure Fill",
    "tags": [
      "conceptual",
      "discrimination"
    ],
    "learningOutcomeId": "203-3F-LO2",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Larger cables take up more space, so they are assigned a higher factor value in the calculation tables."
  },
  {
    "id": 4026,
    "question": "What is the maximum recommended space factor for cables installed in a conduit system?",
    "options": [
      "45%",
      "35%",
      "55%",
      "75%"
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
      "terminology",
      "calculation",
      "discrimination"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "The standard space factor for cables in conduit is 45%, ensuring there is enough room to draw cables in without damage and to allow for heat dissipation."
  },
  {
    "id": 4027,
    "question": "Why is it important to limit the number of cables in a trunking or conduit using a space factor?",
    "options": [
      "To allow heat generated by the cables to dissipate safely",
      "To ensure the cables stay in a straight line",
      "To reduce the total weight of the containment system",
      "To prevent the voltage from increasing in the circuit"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "OTHER",
      "3": "CONFUSED_I_V_R"
    },
    "section": "Electrical Installations Technology",
    "category": "Enclosure Fill",
    "tags": [
      "explanation",
      "conceptual"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Cables generate heat when carrying current; limiting the space factor ensures there is sufficient air around them to prevent overheating."
  },
  {
    "id": 4028,
    "question": "In the context of electrical containment, what does the 'Space Factor' specifically measure?",
    "options": [
      "The percentage of the internal area of the enclosure occupied by cables",
      "The distance between the conduit saddles or trunking supports",
      "The thickness of the PVC insulation on the conductors",
      "The number of bends permitted in a single conduit run"
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
      "terminology",
      "conceptual"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "The space factor is the ratio of the total cross-sectional area of the cables to the internal cross-sectional area of the conduit or trunking, expressed as a percentage."
  },
  {
    "id": 4029,
    "question": "When installing cables in a standard trunking system, what is the maximum percentage of the internal area that should be filled?",
    "options": [
      "45%",
      "20%",
      "80%",
      "100%"
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
      "application",
      "units"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "For both conduit and trunking, a 45% space factor is generally applied to ensure ease of installation and thermal safety."
  },
  {
    "id": 4030,
    "question": "What is a likely physical consequence of exceeding the recommended space factor in a conduit?",
    "options": [
      "Damage to cable insulation during the drawing-in process",
      "A decrease in the resistance of the copper conductors",
      "A change in the frequency of the AC supply",
      "The magnetic field around the cables will disappear"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_I_V_R",
      "2": "CONFUSED_FREQUENCY_WITH_VOLTAGE",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Enclosure Fill",
    "tags": [
      "explanation",
      "conceptual",
      "application"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "If a conduit is overfilled, there is high friction when pulling cables through, which can tear or stress the insulation, leading to potential faults."
  },
  {
    "id": 4031,
    "question": "Why is it essential to adhere to the recommended space factor when installing cables in a conduit system?",
    "options": [
      "To allow for heat dissipation and prevent damage to cable insulation",
      "To ensure the magnetic fields of the conductors cancel each other out",
      "To reduce the total cost of the installation by using less material",
      "To prevent the cables from vibrating against the conduit walls"
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
      "calculation",
      "conceptual",
      "units"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Space factor limits (typically 40% for conduit) are primarily designed to allow air to circulate for heat dissipation and to ensure cables can be drawn in without damaging the insulation."
  },
  {
    "id": 4032,
    "question": "According to the general guidance for electrical trunking, what is the maximum recommended space factor percentage for cable fill?",
    "options": [
      "45%",
      "40%",
      "55%",
      "35%"
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
      "discrimination"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "While conduit is generally limited to a 40% space factor, trunking has a slightly higher allowance of 45% because the removable lids make cable installation easier than pulling through conduit."
  },
  {
    "id": 4033,
    "question": "An electrician is installing six 2.5mm² stranded conductors in a conduit run. If the unit factor for a 2.5mm² cable is 43, what is the total cable unit factor required for this circuit?",
    "options": [
      "258",
      "43",
      "10.75",
      "25.8"
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
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "To find the total cable unit factor, multiply the number of cables by the unit factor for that specific cable size: 6 cables x 43 = 258."
  },
  {
    "id": 4034,
    "question": "When calculating enclosure fill, what does the term 'Space Factor' specifically compare?",
    "options": [
      "The total cross-sectional area of cables to the internal area of the enclosure",
      "The outer diameter of the conduit to the inner diameter of the cable",
      "The weight of the cables to the maximum load-bearing capacity of the trunking",
      "The length of the cable run to the number of 90-degree bends"
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
      "conceptual",
      "terminology"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Space factor is the ratio of the sum of the cross-sectional areas of the cables (including insulation) to the internal cross-sectional area of the conduit or trunking."
  },
  {
    "id": 4035,
    "question": "If a conduit run contains two 90-degree bends, how does this affect the selection of the conduit size compared to a straight run of the same length?",
    "options": [
      "The capacity factor of the conduit decreases, requiring a larger conduit for the same cables",
      "The capacity factor increases because the bends provide more surface area for cooling",
      "There is no change to the capacity factor as only the cable length matters",
      "The space factor percentage is increased from 40% to 50% to compensate"
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
      "conceptual",
      "application"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "Bends increase the friction and difficulty of drawing in cables. Therefore, the 'conduit factor' (capacity) in standard tables is lower for runs with bends than for straight runs, often requiring a larger conduit size."
  },
  {
    "id": 4036,
    "question": "A trunking system has an internal cross-sectional area of 2000mm². If the maximum space factor is 45%, what is the maximum total cross-sectional area of cables permitted?",
    "options": [
      "900mm²",
      "1100mm²",
      "4444mm²",
      "90mm²"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "SIGN_ERROR",
      "2": "RECIPROCAL_ERROR",
      "3": "WRONG_UNITS"
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
    "explanation": "To find the permitted area, multiply the total area by the space factor percentage: 2000mm² x 0.45 = 900mm²."
  },
  {
    "id": 4037,
    "question": "Which of the following describes the 'Unit Factor' method used in the On-Site Guide for conduit sizing?",
    "options": [
      "A simplified system where cables and conduits are assigned numerical values to ensure the space factor is not exceeded",
      "A method to calculate the exact voltage drop for cables in metallic enclosures",
      "A way to determine the maximum weight of trunking supports required per metre",
      "A calculation used to find the resistance of the conduit for earthing purposes"
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
      "discrimination",
      "terminology"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "The Unit Factor method (Appendix 5) assigns 'Cable Factors' and 'Conduit/Trunking Factors' based on area. If the sum of cable factors is less than the conduit factor, the space factor is compliant."
  },
  {
    "id": 4038,
    "question": "An electrician needs to install cables in a 3-metre straight run of conduit. The total cable factor is 320. Which conduit size is the minimum requirement if the conduit factors are: 20mm = 286, 25mm = 463, 32mm = 800?",
    "options": [
      "25mm",
      "20mm",
      "32mm",
      "16mm"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "ROUNDING_ERROR",
      "2": "OTHER",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor / Enclosure Fill",
    "tags": [
      "application",
      "calculation"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "The conduit factor must be equal to or greater than the total cable factor. Since 320 is greater than 286 (20mm), the next size up (25mm with a factor of 463) must be used."
  },
  {
    "id": 4039,
    "question": "Why is the space factor for trunking (45%) higher than the space factor for conduit (40%)?",
    "options": [
      "Trunking lids are removable, allowing cables to be laid in rather than pulled through",
      "Trunking is always made of metal which dissipates heat faster than plastic conduit",
      "Trunking has a square profile which naturally prevents cables from touching",
      "Trunking is only used for DC circuits which generate less heat than AC"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "OTHER",
      "3": "CONFUSED_AC_WITH_DC"
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
    "explanation": "The primary reason for the higher allowance in trunking is the ease of installation. Because the lid can be removed, there is less risk of mechanical damage to cables compared to pulling them through a closed conduit."
  },
  {
    "id": 4040,
    "question": "When using the sizing tables in the On-Site Guide, what distinguishes 'Term 1' (short straight runs) from 'Term 2' (long runs or runs with bends)?",
    "options": [
      "Term 1 uses higher capacity factors because there is less friction during cable draw-in",
      "Term 1 is only used for plastic conduit while Term 2 is for metal conduit",
      "Term 1 refers to single-core cables and Term 2 refers to multi-core cables",
      "Term 1 is for domestic installations and Term 2 is for industrial installations"
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
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "Short straight runs (Term 1) have higher conduit factors because it is much easier to pull cables through them. Longer runs or those with bends (Term 2) require more free space to reduce the force needed to pull the cables."
  },
  {
    "id": 4041,
    "question": "What is the primary reason for limiting the space factor of cables within a conduit or trunking system?",
    "options": [
      "To ensure heat generated by the cables can dissipate effectively",
      "To prevent electromagnetic interference between different circuits",
      "To allow for the future installation of additional circuits",
      "To reduce the mechanical tension on the cable insulation"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "OTHER",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor",
    "tags": [
      "calculation",
      "conceptual",
      "units"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "The main reason for space factor limits is thermal. Cables generate heat due to resistance; if packed too tightly, heat cannot escape, leading to insulation degradation."
  },
  {
    "id": 4042,
    "question": "According to general UK installation guidelines, what is the maximum recommended space factor for cables installed in a trunking system?",
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
    "category": "Spacing Factor",
    "tags": [
      "terminology",
      "application",
      "legislation"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "Trunking typically allows for a 45% space factor, whereas conduit is generally more restrictive at 35% due to the difficulty of drawing cables through."
  },
  {
    "id": 4043,
    "question": "An electrician calculates that a group of cables has a total cross-sectional area of 450mm². If they are to be installed in trunking with an internal area of 1000mm², what is the percentage fill?",
    "options": [
      "45%",
      "222%",
      "55%",
      "4.5%"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "DIVIDED_INSTEAD",
      "2": "RECIPROCAL_ERROR",
      "3": "UNITS_MISSING"
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
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "Percentage fill is (Total Cable Area / Internal Enclosure Area) x 100. So, (450 / 1000) * 100 = 45%."
  },
  {
    "id": 4044,
    "question": "When using the 'Unit of Quantity' method from the On-Site Guide, what does the 'Cable Factor' represent?",
    "options": [
      "A numerical value proportional to the space a specific cable occupies",
      "The maximum current-carrying capacity of the cable in the enclosure",
      "The resistance of the cable per meter of the run",
      "The percentage of the conduit that the cable will fill"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_I_V_R",
      "2": "CONFUSED_I_V_R",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor",
    "tags": [
      "terminology",
      "conceptual",
      "application"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Cable factors are arbitrary units used to simplify the calculation of enclosure sizes; they are proportional to the cable's overall diameter."
  },
  {
    "id": 4045,
    "question": "If a conduit run contains several 90-degree bends, how does this affect the 'Conduit Factor' compared to a straight run of the same length?",
    "options": [
      "The conduit factor decreases, allowing fewer cables to be installed",
      "The conduit factor increases, allowing more cables to be installed",
      "The conduit factor remains the same as it is based only on diameter",
      "The cable factor increases to account for the friction of the bends"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "TOPOLOGY_CONFUSION",
      "3": "WRONG_UNITS"
    },
    "section": "Electrical Installations Technology",
    "category": "Enclosure Fill",
    "tags": [
      "application",
      "discrimination",
      "topology-confusion"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "Bends increase the difficulty of pulling cables. Therefore, the tables in the On-Site Guide provide lower conduit factors for runs with bends to ensure the space factor is not exceeded."
  },
  {
    "id": 4046,
    "question": "Why must all phase conductors and the neutral conductor of an AC circuit be enclosed in the same metallic conduit?",
    "options": [
      "To prevent the conduit from heating up due to electromagnetic induction",
      "To ensure that the earth fault loop impedance is kept to a minimum",
      "To prevent the cables from vibrating at a frequency of 50Hz",
      "To ensure the RMS voltage remains constant throughout the run"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_FREQUENCY_WITH_VOLTAGE",
      "3": "CONFUSED_RMS_WITH_PEAK"
    },
    "section": "Electrical Installations Technology",
    "category": "Electrical Installations Technology",
    "tags": [
      "ac-dc",
      "conceptual",
      "electromagnetic-induction"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "In AC circuits, magnetic fields around conductors cancel each other out if they are together. If separated in a metallic enclosure, eddy currents are induced in the metal, causing significant heating."
  },
  {
    "id": 4047,
    "question": "An electrician is selecting a conduit for a straight 4-meter run. The total cable factor is 480. Which conduit factor is the smallest acceptable size to meet the requirements?",
    "options": [
      "543",
      "460",
      "290",
      "960"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "OTHER",
      "3": "MULTIPLIED_INSTEAD"
    },
    "section": "Electrical Installations Technology",
    "category": "Enclosure Fill",
    "tags": [
      "calculation",
      "application",
      "discrimination"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "The conduit factor must be equal to or greater than the sum of the cable factors. 543 is the smallest factor provided that is greater than 480."
  },
  {
    "id": 4048,
    "question": "Which of the following describes the 'Space Factor' method used for trunking installations?",
    "options": [
      "The total area of the cables should not exceed 45% of the internal area of the trunking",
      "The total area of the cables should not exceed 35% of the internal area of the trunking",
      "The diameter of the cables should not exceed 45% of the trunking width",
      "The weight of the cables should not exceed 45% of the trunking's support capacity"
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
      "terminology",
      "discrimination",
      "conceptual"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "The space factor for trunking is a ratio of the cross-sectional areas, specifically 45% for trunking applications."
  },
  {
    "id": 4049,
    "question": "How does increasing the frequency of an AC supply affect the inductive reactance in a circuit contained within a steel conduit?",
    "options": [
      "It increases the inductive reactance",
      "It decreases the inductive reactance",
      "It has no effect on the inductive reactance",
      "It converts the inductive reactance into resistance"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "CONFUSED_FREQUENCY_WITH_VOLTAGE",
      "3": "CONFUSED_AC_WITH_DC"
    },
    "section": "Electrical Installations Technology",
    "category": "Electrical Installations Technology",
    "tags": [
      "ac-dc",
      "frequency",
      "conceptual"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 60,
    "explanation": "Inductive reactance (XL = 2πfL) is directly proportional to frequency. Increasing frequency increases reactance."
  },
  {
    "id": 4050,
    "question": "When calculating enclosure fill, why is it necessary to use the 'overall' diameter of the cable including the sheath, rather than just the conductor size?",
    "options": [
      "Because the sheath occupies physical space within the enclosure",
      "Because the sheath acts as an additional conductor in AC circuits",
      "Because the sheath reduces the resistance of the circuit",
      "Because the sheath determines the RMS voltage of the cable"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_I_V_R",
      "3": "CONFUSED_RMS_WITH_PEAK"
    },
    "section": "Electrical Installations Technology",
    "category": "Enclosure Fill",
    "tags": [
      "conceptual",
      "terminology",
      "application"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "Space factor is a measure of physical volume. The insulation and sheath take up significant space and must be accounted for to ensure proper heat dissipation."
  },
  {
    "id": 4051,
    "question": "What is the primary reason BS 7671 limits the 'space factor' (enclosure fill) of cables within a conduit or trunking system?",
    "options": [
      "To prevent the accumulation of heat and ensure cables do not exceed their operating temperature.",
      "To allow for the physical expansion of the copper conductors when carrying DC current.",
      "To ensure that the electromagnetic fields of the AC supply do not cause the conduit to vibrate.",
      "To allow the conduit to be used as a return path for the neutral conductor in a single-phase system."
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_AC_WITH_DC",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor",
    "tags": [
      "calculation",
      "conceptual",
      "units"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "The space factor is limited primarily to allow air circulation. If cables are packed too tightly, heat generated by the current (I²R losses) cannot dissipate, leading to insulation damage."
  },
  {
    "id": 4052,
    "question": "When calculating the capacity of a straight run of trunking, what is the generally accepted maximum percentage of the internal cross-sectional area that should be occupied by cables?",
    "options": [
      "45%",
      "35%",
      "55%",
      "75%"
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
      "calculation",
      "terminology"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "For trunking, the space factor is typically 45%, meaning the total cross-sectional area of the cables (including insulation) should not exceed 45% of the trunking's internal area."
  },
  {
    "id": 4053,
    "question": "An electrician is pulling multiple AC circuits into a single conduit. If the space factor is exceeded, how does this affect the 'current-carrying capacity' (Iz) of the conductors?",
    "options": [
      "The capacity must be reduced (derated) because the cables cannot dissipate heat effectively.",
      "The capacity increases because the cables are closer together, reducing total resistance.",
      "The capacity remains the same, but the voltage drop (mV/A/m) will increase significantly.",
      "The capacity is only affected if the supply frequency is changed from 50Hz to 60Hz."
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "CONFUSED_FREQUENCY_WITH_CURRENT"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor",
    "tags": [
      "conceptual",
      "application",
      "ac-dc"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "Overcrowding leads to higher ambient temperatures within the enclosure. According to BS 7671, grouping factors must be applied to derate the cables to prevent insulation failure."
  },
  {
    "id": 4054,
    "question": "When using the 'Unit System' from the On-Site Guide to determine conduit size, which of the following must be taken into account if the run is NOT straight?",
    "options": [
      "The number of bends in the conduit run and the total length.",
      "The RMS voltage of the circuit being installed.",
      "The peak-to-peak value of the sine wave current.",
      "Whether the conduit is made of PVC or Galvanized Steel."
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_RMS_WITH_PEAK",
      "2": "CONFUSED_RMS_WITH_PEAK",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor",
    "tags": [
      "discrimination",
      "calculation",
      "sine-wave"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "The unit system provides different 'cable factors' and 'conduit factors' based on the length of the run and the number of bends, as bends increase the friction and difficulty of pulling cables."
  },
  {
    "id": 4055,
    "question": "A section of cable trunking has internal dimensions of 50mm x 50mm. Using a 45% space factor, calculate the maximum total cross-sectional area available for cables.",
    "options": [
      "1,125 mm²",
      "2,500 mm²",
      "1,375 mm²",
      "55.5 mm²"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "FORMULA_NOT_REARRANGED",
      "3": "DIVIDED_INSTEAD"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor",
    "tags": [
      "calculation",
      "application",
      "units"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 120,
    "explanation": "First, calculate total area: 50mm x 50mm = 2,500 mm². Then apply the 45% factor: 2,500 x 0.45 = 1,125 mm²."
  },
  {
    "id": 4056,
    "question": "A contractor is installing several 2.5mm² stranded copper conductors into a 3-meter run of galvanized steel conduit with two 90-degree bends. According to the IET On-Site Guide, why must the total cable factor not exceed the conduit factor?",
    "options": [
      "To prevent insulation damage during the drawing-in process and ensure adequate heat dissipation",
      "To ensure that the magnetic fields of the conductors cancel each other out within the steel enclosure",
      "To maintain the earth fault loop impedance (Zs) within the regulated limits for the circuit breaker",
      "To allow for the thermal expansion of the steel conduit when the ambient temperature rises"
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
      "calculation",
      "conceptual",
      "application"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "Space factor limits (typically 35% for conduit and 45% for trunking) are designed to ensure cables can be drawn in without excessive force damaging the insulation and to allow air to circulate for heat dissipation."
  },
  {
    "id": 4057,
    "question": "When calculating the enclosure fill for a trunking system containing various cross-sectional areas of PVC/PVC cables, the 'Space Factor' is generally limited to 45%. If an electrician ignores this and fills the trunking to 80%, what is the most likely long-term technical consequence?",
    "options": [
      "The cables will operate at a higher temperature, leading to premature insulation hardening and failure",
      "The increased mass of the cables will cause the trunking supports to fail under mechanical load",
      "The voltage drop across the circuit will decrease due to the reduced air gap between conductors",
      "The frequency of the AC supply will fluctuate due to increased inductive reactance between cables"
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
      "application",
      "power"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 150,
    "explanation": "Overfilling an enclosure restricts airflow. According to BS 7671, this reduces the cable's ability to dissipate heat, meaning the current-carrying capacity must be derated or the insulation will degrade prematurely."
  },
  {
    "id": 4058,
    "question": "An electrician is using the 'Unit System' from the IET On-Site Guide to size a conduit. The total cable factor for the selected conductors is 480. The conduit factor for a 20mm conduit over a 6-meter run with one bend is 460, while a 25mm conduit is 800. Which installation choice is correct?",
    "options": [
      "Use the 25mm conduit to ensure the cable factor is less than the conduit factor",
      "Use the 20mm conduit because the difference of 20 units is within the 5% tolerance",
      "Use the 20mm conduit but remove one bend to increase the conduit's capacity factor",
      "Use the 25mm conduit and increase the circuit breaker size to account for the extra space"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "ROUNDING_ERROR",
      "2": "FORMULA_NOT_REARRANGED",
      "3": "CONFUSED_I_V_R"
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
    "difficulty": 4,
    "estimatedTime": 180,
    "explanation": "In the unit system, the sum of the cable factors must not exceed the factor given for the conduit. Since 480 > 460, the 20mm conduit is insufficient, necessitating the 25mm option."
  },
  {
    "id": 4059,
    "question": "Which of the following correctly discriminates between the space factor requirements for conduit and trunking systems?",
    "options": [
      "Conduit is limited to a 35% fill factor, while trunking is allowed up to 45%",
      "Conduit is limited to a 45% fill factor, while trunking is allowed up to 35%",
      "Both conduit and trunking are limited to 45% to allow for future circuit additions",
      "Conduit fill is based on the external diameter, while trunking is based on internal area"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "TOPOLOGY_CONFUSION",
      "3": "UNITS_MISSING"
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
    "difficulty": 4,
    "estimatedTime": 90,
    "explanation": "Standard industry practice and guidelines define the space factor for conduit (a circular enclosure) as 35% and for trunking (usually rectangular) as 45%."
  },
  {
    "id": 4060,
    "question": "In a scenario where a trunking run contains both power cables and data cables, what is the primary reason for calculating the space factor including the segregation distance?",
    "options": [
      "To prevent electromagnetic interference (EMI) while maintaining thermal safety",
      "To ensure the data cables do not increase the resistance of the copper power conductors",
      "To allow the AC frequency of the power cables to synchronize with the data signals",
      "To prevent the data cables from drawing excess current from the mains supply"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_I_V_R",
      "2": "CONFUSED_AC_DC_SOURCES",
      "3": "CONFUSED_FREQUENCY_WITH_CURRENT"
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
    "difficulty": 5,
    "estimatedTime": 150,
    "explanation": "When mixing cable types, the space factor ensures physical room for segregation barriers used to prevent EMI, while still ensuring neither set of cables overheats."
  },
  {
    "id": 4061,
    "question": "A 50mm x 50mm square trunking has an internal cross-sectional area of 2500mm². If the 45% space factor rule is applied, what is the maximum usable area for cables?",
    "options": [
      "1125 mm²",
      "1375 mm²",
      "2500 mm²",
      "55.5 mm²"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "RECIPROCAL_ERROR",
      "3": "DIVIDED_INSTEAD"
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
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "To find the usable area, multiply the total area by the space factor: 2500 mm² * 0.45 = 1125 mm²."
  },
  {
    "id": 4062,
    "question": "How does the presence of multiple 90-degree bends in a conduit run affect the selection of the conduit size during the design stage?",
    "options": [
      "It reduces the conduit factor, meaning a larger diameter conduit may be required for the same number of cables",
      "It increases the conduit factor, allowing more cables to be installed due to the increased surface area",
      "It has no effect on the conduit factor as the internal cross-sectional area remains constant",
      "It requires the electrician to use DC current instead of AC to reduce skin effect at the bends"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "MULTIPLIED_INSTEAD",
      "2": "OTHER",
      "3": "CONFUSED_AC_WITH_DC"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor / Enclosure Fill",
    "tags": [
      "conceptual",
      "calculation",
      "application"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "Bends increase friction and the risk of cable damage during pulling. Therefore, the 'conduit factor' (capacity) in standard tables decreases as the number of bends increases, necessitating a larger conduit."
  },
  {
    "id": 4063,
    "question": "An electrician notes that a circuit's grouping factor (Cg) is very low because the trunking is filled to its maximum 45% capacity. What is the relationship between space factor and Cg?",
    "options": [
      "A high space factor increases mutual heating between cables, requiring a lower Cg to reduce current capacity",
      "A high space factor increases the frequency of the circuit, requiring a higher Cg to compensate",
      "A low space factor increases the voltage drop, requiring a lower Cg to maintain 230V",
      "There is no relationship; Cg is determined only by the number of circuits, regardless of enclosure size"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_FREQUENCY_WITH_VOLTAGE",
      "2": "CONFUSED_I_V_R",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor / Enclosure Fill",
    "tags": [
      "conceptual",
      "calculation",
      "power"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 180,
    "explanation": "The more cables packed into an enclosure (higher space factor), the less effectively they can dissipate heat. This mutual heating is accounted for by the grouping factor (Cg) in cable sizing calculations."
  },
  {
    "id": 4064,
    "question": "When comparing a 25mm conduit and a 25mm x 25mm mini-trunking, why is the trunking permitted a higher percentage fill (space factor)?",
    "options": [
      "Trunking usually has a removable lid, making it easier to lay cables in rather than pulling them through",
      "Trunking is made of plastic which conducts heat better than galvanized steel conduit",
      "Conduit creates a vacuum when cables are pulled through, increasing mechanical resistance",
      "Trunking is only used for DC circuits which generate less heat than AC circuits"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
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
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "Trunking systems have removable covers, allowing cables to be 'laid in'. Conduit requires cables to be 'drawn in', which involves higher mechanical stress, necessitating more free space (a lower fill factor)."
  },
  {
    "id": 4065,
    "question": "A design specification requires a 35% space factor for a conduit installation. If the internal diameter of the conduit is 20mm (Area ≈ 314mm²), what is the maximum total cross-sectional area of cables allowed?",
    "options": [
      "109.9 mm²",
      "204.1 mm²",
      "314.0 mm²",
      "897.1 mm²"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_PARALLEL_RULE",
      "2": "RECIPROCAL_ERROR",
      "3": "MULTIPLIED_INSTEAD"
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
    "difficulty": 5,
    "estimatedTime": 150,
    "explanation": "The maximum cable area is calculated as: Total Area * Space Factor. 314 mm² * 0.35 = 109.9 mm²."
  }
];
