import { TaggedQuestion } from './types';

/**
 * Spacing Factor / Enclosure Fill Question Bank
 * Aligned with lesson 203-3F learning outcomes
 * Generated: 2026-02-04
 */

export const spacingFactorEnclosureFillQuestions: TaggedQuestion[] = [
  {
    "id": 4016,
    "question": "What is the definition of the 'space factor' in an electrical enclosure?",
    "options": [
      "The ratio of the total cross-sectional area of cables to the internal area of the enclosure",
      "The total length of the cables divided by the width of the trunking",
      "The amount of air gaps left between the individual strands of a conductor",
      "The maximum voltage a conduit can withstand before breaking down"
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
      "explanation",
      "units"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Space factor is the ratio of the combined cross-sectional area of all cables to the total internal cross-sectional area of the conduit or trunking, usually expressed as a percentage."
  },
  {
    "id": 4017,
    "question": "What is the standard maximum space factor permitted for cables installed in a conduit?",
    "options": [
      "45%",
      "35%",
      "55%",
      "100%"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "ROUNDING_ERROR",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor / Enclosure Fill",
    "tags": [
      "discrimination",
      "units",
      "calculation"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "According to standard UK practice and the On-Site Guide, the space factor for cables in conduit should not exceed 45% to ensure ease of installation and heat dissipation."
  },
  {
    "id": 4018,
    "question": "What is the primary reason for limiting the number of cables within a single piece of trunking?",
    "options": [
      "To allow heat to dissipate and prevent the cables from overheating",
      "To ensure the trunking remains light enough to stay on the wall",
      "To prevent the magnetic fields from slowing down the electricity",
      "To make sure the cables do not touch each other and short circuit"
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
      "explanation",
      "health-safety"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Cables generate heat when carrying current; if they are packed too tightly, the heat cannot escape, which can damage insulation and lead to fires."
  },
  {
    "id": 4019,
    "question": "If a section of trunking has an internal area of 2000 mm² and the cables inside have a total area of 800 mm², what is the percentage fill?",
    "options": [
      "40%",
      "25%",
      "200%",
      "80%"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "DIVIDED_INSTEAD",
      "2": "MULTIPLIED_INSTEAD",
      "3": "FORMULA_NOT_REARRANGED"
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
    "explanation": "Percentage fill is (Total Cable Area / Total Enclosure Area) x 100. (800 / 2000) x 100 = 40%."
  },
  {
    "id": 4020,
    "question": "Which document provides the specific 'cable factors' and 'enclosure factors' used to calculate the correct size of conduit for a job?",
    "options": [
      "The IET On-Site Guide",
      "The Health and Safety at Work Act",
      "The Electricity at Work Regulations",
      "The Part P Building Regulations"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "LEGISLATION_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor / Enclosure Fill",
    "tags": [
      "discrimination",
      "legislation",
      "terminology"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "The On-Site Guide (Appendix E) contains the tables for cable and conduit factors used for standard installation calculations."
  },
  {
    "id": 4021,
    "question": "If an electrician forces too many cables into a conduit, what is the most likely physical result during installation?",
    "options": [
      "The cable insulation may be stretched or stripped off",
      "The supply frequency will increase due to friction",
      "The voltage at the end of the run will become DC",
      "The conduit will become a permanent magnet"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_FREQUENCY_WITH_VOLTAGE",
      "2": "CONFUSED_AC_DC_SOURCES",
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
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Overfilling a conduit makes pulling cables through very difficult, often leading to mechanical damage to the outer sheath or insulation."
  },
  {
    "id": 4022,
    "question": "An electrician calculates a total 'cable factor' of 450. Which conduit should they select based on these 'conduit factors'?",
    "options": [
      "A conduit with a factor of 500",
      "A conduit with a factor of 400",
      "A conduit with a factor of 250",
      "A conduit with a factor of 100"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "FORMULA_NOT_REARRANGED",
      "3": "DIVIDED_INSTEAD"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor / Enclosure Fill",
    "tags": [
      "application",
      "discrimination",
      "calculation"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "The enclosure factor must be equal to or greater than the sum of the cable factors to ensure the space factor is not exceeded."
  },
  {
    "id": 4023,
    "question": "When calculating conduit fill using the On-Site Guide method, the 'cable factors' are based on which cable property?",
    "options": [
      "The overall diameter of the cable",
      "The length of the cable run",
      "The weight of the copper conductor",
      "The color of the insulation"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "WRONG_UNITS",
      "3": "CONFUSED_TERMINOLOGY"
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
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Cable factors are derived from the cross-sectional area (diameter) of the cable to ensure they fit within the enclosure's internal area."
  },
  {
    "id": 4024,
    "question": "What is the standard maximum space factor permitted for cables installed in trunking?",
    "options": [
      "45%",
      "10%",
      "75%",
      "90%"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "ROUNDING_ERROR",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor / Enclosure Fill",
    "tags": [
      "discrimination",
      "units",
      "terminology"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Standard practice for trunking fill is a maximum of 45% space factor, the same as conduit, to allow for air circulation and ease of installation."
  },
  {
    "id": 4025,
    "question": "Why is it important to leave 55% of a conduit empty?",
    "options": [
      "To prevent overheating and allow for easy withdrawal of cables",
      "To save money on the amount of copper used",
      "To allow the magnetic field to expand",
      "To make the conduit lighter for the fixings"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "TOPOLOGY_CONFUSION",
      "3": "CONFUSED_I_V_R"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor / Enclosure Fill",
    "tags": [
      "conceptual",
      "explanation",
      "application"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "A 45% space factor means 55% is empty. This 'free space' is vital for cooling the cables and ensuring they can be pulled in or out without damage."
  },
  {
    "id": 4026,
    "question": "What is the primary reason for applying a space factor when installing cables inside a conduit or trunking system?",
    "options": [
      "To allow for heat dissipation and prevent damage during the drawing-in of cables",
      "To ensure the cables are packed tightly to prevent movement",
      "To increase the resistance of the conductors within the enclosure",
      "To allow the cables to be easily identified by their colours"
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
      "terminology",
      "conceptual",
      "units"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "The space factor ensures there is enough 'air space' to allow heat to escape and to ensure cables are not damaged by friction or tension when being pulled into the enclosure."
  },
  {
    "id": 4027,
    "question": "In the UK, what is the standard maximum space factor percentage typically used for cables installed in a conduit?",
    "options": [
      "45%",
      "25%",
      "75%",
      "100%"
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
      "discrimination"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 30,
    "explanation": "The general rule for conduit and trunking is a 45% space factor, meaning the cables should occupy no more than 45% of the internal cross-sectional area."
  },
  {
    "id": 4028,
    "question": "When calculating enclosure fill for an AC circuit in the UK, what is the standard frequency of the supply that the cables will carry?",
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
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "UK Mains Characteristics",
    "tags": [
      "ac-dc",
      "frequency",
      "units"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 30,
    "explanation": "The standard frequency for the UK public low voltage AC supply is 50 Hz."
  },
  {
    "id": 4029,
    "question": "Which of the following describes the 'space factor' in an electrical installation?",
    "options": [
      "The ratio of the cross-sectional area of the cables to the internal area of the enclosure",
      "The distance between the conduit saddles or trunking supports",
      "The amount of physical space left between two different conduits",
      "The total length of the cable divided by the width of the trunking"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "TOPOLOGY_CONFUSION",
      "3": "DIVIDED_INSTEAD"
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
    "explanation": "Space factor is a comparison (ratio/percentage) of the area taken up by cables versus the total available area inside the conduit or trunking."
  },
  {
    "id": 4030,
    "question": "An electrician calculates that a group of cables has a total factor of 450. If the chosen conduit has a capacity factor of 1000, what is the percentage fill?",
    "options": [
      "45%",
      "4.5%",
      "55%",
      "450%"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "ROUNDING_ERROR",
      "2": "OTHER",
      "3": "MULTIPLIED_INSTEAD"
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
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Percentage fill is calculated by (Total Cable Factor / Conduit Capacity Factor) x 100. In this case: (450 / 1000) x 100 = 45%."
  },
  {
    "id": 4031,
    "question": "What is the primary reason for limiting the 'space factor' of a conduit to 45% of its internal cross-sectional area?",
    "options": [
      "To allow for heat dissipation and prevent damage during drawing-in",
      "To ensure the conduit acts as a better earth return path",
      "To prevent the skin effect from increasing conductor resistance",
      "To allow for the expansion of air inside the conduit during a fault"
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
    "explanation": "The 45% space factor is designed to ensure that cables are not damaged by friction when being pulled into the conduit and that there is sufficient air space for heat to dissipate."
  },
  {
    "id": 4032,
    "question": "An electrician is installing cables in a 50mm x 50mm trunking. If the total sum of the cable factors is 1,350, what is the percentage fill of the trunking?",
    "options": [
      "54%",
      "45%",
      "27%",
      "62%"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_PARALLEL_RULE",
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
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "Trunking area = 50 x 50 = 2500. Percentage fill = (Total Cable Factor / Trunking Factor) x 100. (1350 / 2500) x 100 = 54%."
  },
  {
    "id": 4033,
    "question": "When considering the heating effect of current in a crowded conduit, which value of an AC sine wave is used to determine the thermal stress on cable insulation?",
    "options": [
      "The RMS value",
      "The Peak value",
      "The Average value",
      "The Peak-to-Peak value"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_RMS_WITH_PEAK",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "CONFUSED_AC_WITH_DC"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor / Enclosure Fill",
    "tags": [
      "ac-dc",
      "sine-wave",
      "rms-peak"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "The RMS (Root Mean Square) value of an AC current is the value that represents its equivalent DC heating effect, which is critical for space factor and thermal calculations."
  },
  {
    "id": 4034,
    "question": "A run of conduit contains several 2.5mm² cables. If the frequency of the AC supply is increased from 50Hz to 400Hz (as in some aircraft systems), how does this directly affect the physical space factor calculation?",
    "options": [
      "The physical space factor remains the same",
      "The space factor must be reduced to 20% due to inductive reactance",
      "The conduit must be larger to account for increased magnetic flux",
      "The cables will require 50% more space to prevent the skin effect"
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
      "frequency",
      "conceptual",
      "ac-dc"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "Space factor is a physical measurement of cross-sectional area. While frequency affects reactance and skin effect, the calculation for enclosure fill (area occupied) does not change based on frequency."
  },
  {
    "id": 4035,
    "question": "Which document provides the specific 'unit factors' for different sizes of cables and conduits used to calculate enclosure fill?",
    "options": [
      "The IET On-Site Guide",
      "The Health and Safety at Work Act",
      "The Electricity at Work Regulations",
      "The Part P Building Regulations"
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
      "legislation",
      "terminology"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "The IET On-Site Guide contains the tables (Appendix E) used by electricians to determine cable and conduit factors for space factor calculations."
  },
  {
    "id": 4036,
    "question": "A 25mm diameter conduit has a factor of 800 for a straight run. If an electrician needs to install cables with a total factor of 350, is this installation compliant with the standard 45% space factor rule?",
    "options": [
      "Yes, because the cables occupy approximately 43.8% of the factor",
      "No, because the cables occupy 52% of the factor",
      "Yes, because any factor under 400 is acceptable for 25mm conduit",
      "No, because the factor must be exactly 450"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "DIVIDED_INSTEAD",
      "2": "FORMULA_NOT_REARRANGED",
      "3": "ROUNDING_ERROR"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor / Enclosure Fill",
    "tags": [
      "calculation",
      "application",
      "discrimination"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "350 divided by 800 equals 0.4375, or 43.75%. Since this is below the 45% limit, it is compliant."
  },
  {
    "id": 4037,
    "question": "Why is the usable space factor for a conduit run containing several bends lower than that of a straight run?",
    "options": [
      "To reduce the mechanical stress and friction on cable insulation during installation",
      "Because bends increase the resistance of the conductors",
      "Because the AC frequency increases as cables pass through a bend",
      "To prevent the accumulation of moisture at the lowest point of the bend"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_I_V_R",
      "2": "CONFUSED_FREQUENCY_WITH_CURRENT",
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
    "explanation": "Bends increase the pulling force required to install cables. A lower fill factor ensures cables can navigate bends without the insulation being stripped or damaged."
  },
  {
    "id": 4038,
    "question": "When using a step-down transformer to power 12V DC lighting from a 230V AC supply, why must the secondary 12V cables still follow space factor regulations within a conduit?",
    "options": [
      "Because all current-carrying conductors generate heat regardless of voltage",
      "Because 12V DC current travels on the outside of the cable only",
      "Because transformers increase the frequency of the DC output",
      "Because low voltage cables are physically larger than high voltage cables"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_AC_WITH_DC",
      "2": "CONFUSED_TRANSFORMER_WITH_AC_DC",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor / Enclosure Fill",
    "tags": [
      "transformers",
      "ac-dc",
      "conceptual"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "Space factor is primarily concerned with heat dissipation and physical protection. All conductors generate heat (I²R losses), so the rules apply regardless of the voltage level or whether it is AC or DC."
  },
  {
    "id": 4039,
    "question": "Which of the following describes a 'discrimination' error when selecting trunking size for a mixed circuit installation?",
    "options": [
      "Failing to account for the different factor values of 1.5mm² and 2.5mm² cables",
      "Using the same colour insulation for both AC and DC circuits",
      "Calculating the area of a square trunking as (width + height) instead of (width x height)",
      "Applying a 45% factor to a conduit instead of a 35% factor"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "MULTIPLIED_INSTEAD",
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
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Discrimination in this context refers to correctly identifying and applying the specific factors for different cable types and sizes within the same enclosure."
  },
  {
    "id": 4040,
    "question": "If a trunking is found to have a space factor of 65%, what is the most appropriate action for an electrician to take according to UK regulations?",
    "options": [
      "Increase the size of the trunking or reduce the number of cables",
      "Install a cooling fan to manage the extra heat dissipation",
      "Change the AC supply to DC to reduce the effective heating",
      "Apply a coating of lubricant to the cables to reduce friction"
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
      "application",
      "health-safety"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "If the space factor exceeds the 45% limit, the installation is non-compliant. The only regulatory solution is to provide more space (larger trunking) or fewer cables."
  },
  {
    "id": 4041,
    "question": "What is the primary reason for limiting the number of cables installed within a single conduit or trunking system, known as the 'space factor'?",
    "options": [
      "To allow for heat dissipation and prevent damage to cable insulation",
      "To ensure the magnetic fields of AC conductors do not cancel each other out",
      "To reduce the total weight of the installation on the building structure",
      "To ensure that voltage drop is minimized over long circuit runs"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "OTHER",
      "3": "CONFUSED_I_V_R"
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
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Limiting the space factor ensures there is enough air space around cables for heat to dissipate, preventing the insulation from overheating and degrading."
  },
  {
    "id": 4042,
    "question": "According to general industry standards for trunking, what is the maximum recommended percentage of the internal cross-sectional area that should be occupied by cables?",
    "options": [
      "45%",
      "35%",
      "55%",
      "25%"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "ROUNDING_ERROR",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor / Enclosure Fill",
    "tags": [
      "discrimination",
      "units",
      "calculation"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "The standard space factor for cable trunking is 45%, meaning the total cross-sectional area of the cables should not exceed 45% of the trunking's internal area."
  },
  {
    "id": 4043,
    "question": "An electrician is installing six 2.5mm² stranded cables into a short, straight run of 20mm conduit. Using a cable factor of 43 and a conduit factor of 460, will this installation comply with space factor guidelines?",
    "options": [
      "Yes, because the total cable factor (258) is less than the conduit factor (460)",
      "No, because the total cable factor (258) exceeds the conduit factor (460)",
      "Yes, because the conduit factor is calculated by multiplying cable diameter",
      "No, because 20mm conduit can only ever hold a maximum of four cables"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "DIVIDED_INSTEAD",
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
    "explanation": "Total cable factor = 6 x 43 = 258. Since 258 is less than the conduit factor of 460, the cables will fit comfortably within the space factor limits."
  },
  {
    "id": 4044,
    "question": "When using standard factor tables for conduit, how does the inclusion of 90-degree bends in a run affect the 'conduit factor' value?",
    "options": [
      "The conduit factor decreases, allowing for fewer cables to be installed",
      "The conduit factor increases, allowing for more cables to be installed",
      "The conduit factor remains the same as it is based only on diameter",
      "The conduit factor is doubled for every bend added to the run"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "MULTIPLIED_INSTEAD",
      "2": "TOPOLOGY_CONFUSION",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor / Enclosure Fill",
    "tags": [
      "conceptual",
      "application",
      "discrimination"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "Bends increase friction and difficulty when drawing in cables. Therefore, tables provide a lower 'conduit factor' for runs with bends, effectively reducing the number of cables permitted."
  },
  {
    "id": 4045,
    "question": "Why must all phase and neutral conductors of an AC circuit be enclosed within the same metallic conduit or trunking?",
    "options": [
      "To prevent electromagnetic induction from heating the metallic enclosure",
      "To ensure the space factor is calculated for the whole circuit at once",
      "To prevent the cables from vibrating at a frequency of 50Hz",
      "To allow the RMS voltage to remain constant across all conductors"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_FREQUENCY_WITH_VOLTAGE",
      "3": "CONFUSED_RMS_WITH_PEAK"
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
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "In AC circuits, the magnetic fields around the phase and neutral conductors cancel each other out. If they are separated in a metallic enclosure, eddy currents are induced in the metal, causing significant heating."
  },
  {
    "id": 4046,
    "question": "A trunking has internal dimensions of 50mm x 37.5mm. Using the 45% space factor rule, what is the maximum usable area for cables?",
    "options": [
      "843.75 mm²",
      "1875 mm²",
      "937.5 mm²",
      "656.25 mm²"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "UNITS_MISSING",
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
    "estimatedTime": 100,
    "explanation": "Total Area = 50 x 37.5 = 1875 mm². 45% of 1875 = 0.45 x 1875 = 843.75 mm²."
  },
  {
    "id": 4047,
    "question": "Which term describes the physical phenomenon where overcrowding cables in a conduit leads to a reduction in their current-carrying capacity?",
    "options": [
      "Thermal grouping",
      "Mutual induction",
      "Capacitive reactance",
      "Hysteresis loss"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "OTHER",
      "3": "CONFUSED_AC_WITH_DC"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor / Enclosure Fill",
    "tags": [
      "conceptual",
      "terminology",
      "health-safety"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Thermal grouping refers to the effect where multiple heat-producing cables in close proximity reduce the ability of any single cable to dissipate heat, requiring a rating factor (Cg) to be applied."
  },
  {
    "id": 4048,
    "question": "When calculating cable fill for a mixed installation of different cable sizes in trunking, what is the first step an electrician should take?",
    "options": [
      "Find the sum of the individual cable factors for all cables",
      "Measure the external diameter of the largest cable only",
      "Divide the trunking area by the number of cables",
      "Multiply the total number of cables by the 45% factor"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "DIVIDED_INSTEAD",
      "3": "MULTIPLIED_INSTEAD"
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
    "explanation": "The first step is to determine the total 'cable factor' by summing the factors for every individual cable intended for the enclosure."
  },
  {
    "id": 4049,
    "question": "What is a potential mechanical consequence of exceeding the recommended space factor in a conduit system during the installation phase?",
    "options": [
      "Damage to the cable insulation due to excessive pulling tension",
      "The conduit will expand due to the pressure of the cables",
      "The frequency of the AC supply will fluctuate",
      "The circuit breaker will trip immediately due to magnetic flux"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "CONFUSED_FREQUENCY_WITH_CURRENT",
      "3": "OTHER"
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
    "explanation": "If a conduit is overfilled, the force required to pull cables through becomes too high, often leading to the insulation being stretched or torn against the conduit walls or edges."
  },
  {
    "id": 4050,
    "question": "In the context of UK mains electricity (230V, 50Hz), how does the 'RMS' value relate to the heat produced in a conduit compared to a DC circuit of the same numerical voltage?",
    "options": [
      "The heating effect is the same for both RMS AC and DC",
      "The AC circuit produces significantly more heat due to the peak voltage",
      "The DC circuit produces more heat because the current is constant",
      "The AC circuit produces no heat because the average voltage is zero"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_RMS_WITH_PEAK",
      "2": "CONFUSED_AC_WITH_DC",
      "3": "SIGN_ERROR"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor / Enclosure Fill",
    "tags": [
      "rms-peak",
      "ac-dc",
      "conceptual"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "The RMS (Root Mean Square) value of an AC supply is specifically defined as the value that produces the same heating effect as a DC supply of the same numerical value."
  },
  {
    "id": 4051,
    "question": "When installing single-core cables in a conduit system, why is it necessary to maintain a specific space factor rather than filling the conduit to its maximum physical capacity?",
    "options": [
      "To prevent damage to cable insulation during drawing-in and to allow for heat dissipation.",
      "To ensure the conduit acts as a better circuit protective conductor by increasing the internal air gap.",
      "To reduce the magnetic field interference between the line and neutral conductors within the enclosure.",
      "Because the On-Site Guide requires a 100% safety margin for all future circuit additions."
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_AC_DC_SOURCES",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor / Enclosure Fill",
    "tags": [
      "calculation",
      "explanation",
      "conceptual"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Space factors (typically 45% for trunking) are designed to ensure cables can be pulled into the containment without being stretched or stripped, and to prevent overheating by allowing air to circulate."
  },
  {
    "id": 4052,
    "question": "According to the IET On-Site Guide, what is the generally accepted space factor percentage for cables installed within a trunking system?",
    "options": [
      "45%",
      "35%",
      "55%",
      "25%"
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
      "discrimination"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "The standard space factor for trunking is 45%, meaning the total cross-sectional area of the cables should not exceed 45% of the internal cross-sectional area of the trunking."
  },
  {
    "id": 4053,
    "question": "An electrician is using the 'unit factor' method for a straight 3-metre run of conduit. If the total sum of the cable factors is 150 and the conduit factor for a 20mm conduit is 141, what action should be taken?",
    "options": [
      "Select the next size up (25mm conduit) to ensure the cable factors do not exceed the conduit factor.",
      "Proceed with the 20mm conduit as the difference is within a standard 10% installation tolerance.",
      "Increase the voltage of the circuit to compensate for the reduced space within the conduit.",
      "Use the 20mm conduit but apply a correction factor for the ambient temperature instead."
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "CONFUSED_I_V_R",
      "3": "FORMULA_NOT_REARRANGED"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor / Enclosure Fill",
    "tags": [
      "application",
      "calculation",
      "units"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "The sum of cable factors must be equal to or less than the conduit factor. If the cable factors (150) exceed the conduit factor (141), a larger conduit must be selected."
  },
  {
    "id": 4054,
    "question": "In the context of enclosure fill, how does the presence of additional bends in a conduit run affect the 'conduit factor' assigned in the On-Site Guide tables?",
    "options": [
      "The conduit factor decreases as the number of bends increases or the run length increases.",
      "The conduit factor increases to account for the extra physical length of the pipe around the corner.",
      "The conduit factor remains constant, but the cable factors must be doubled for every 90-degree bend.",
      "Bends only affect the voltage drop and have no impact on the space factor calculations."
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "MULTIPLIED_INSTEAD",
      "2": "OTHER",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor / Enclosure Fill",
    "tags": [
      "conceptual",
      "discrimination",
      "application"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "As a run becomes more complex (more bends or longer distance), it becomes harder to draw cables in. Therefore, the 'capacity' (conduit factor) is reduced to ensure there is more free space."
  },
  {
    "id": 4055,
    "question": "When determining the maximum number of cables permitted in a length of trunking, which method is used to comply with the 45% space factor rule?",
    "options": [
      "Comparing the sum of the cable 'unit factors' to the 'trunking factor' for the specific size.",
      "Dividing the total cross-sectional area of the trunking by the number of individual circuits.",
      "Multiplying the cable diameter by the length of the run and dividing by the trunking width.",
      "Using the RMS value of the current to determine the required air gap between cables."
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "DIVIDED_INSTEAD",
      "2": "OTHER",
      "3": "CONFUSED_RMS_WITH_PEAK"
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
    "explanation": "The 'unit factor' method simplifies the calculation. Each cable size and trunking size is assigned a factor; as long as the cable total is less than the trunking total, the 45% rule is met."
  },
  {
    "id": 4056,
    "question": "When installing multiple single-core AC conductors within a steel trunking system, why is it critical to maintain the 45% space factor specifically regarding electromagnetic effects?",
    "options": [
      "To prevent excessive heat build-up caused by eddy currents and hysteresis in the steel enclosure",
      "To ensure that the peak voltage of the AC waveform does not cause insulation breakdown between cables",
      "To allow the magnetic fields of the individual phases to occupy 55% of the internal volume",
      "To ensure that the RMS current value remains constant regardless of the ambient temperature"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_RMS_WITH_PEAK",
      "2": "TOPOLOGY_CONFUSION",
      "3": "CONFUSED_I_V_R"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor / Enclosure Fill",
    "tags": [
      "ac-dc",
      "calculation",
      "explanation"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 120,
    "explanation": "In AC systems, magnetic fields around conductors induce eddy currents and hysteresis loss in ferromagnetic enclosures like steel trunking. Maintaining the space factor ensures adequate airflow to dissipate the resulting heat."
  },
  {
    "id": 4057,
    "question": "An electrician is calculating the capacity for a 3-meter straight run of conduit. If the total cable factor is 450 and the conduit factor for a 25mm conduit is 800, what is the most significant risk of ignoring the 45% space factor rule in this scenario?",
    "options": [
      "Mechanical damage to the cable insulation during the drawing-in process",
      "A decrease in the frequency of the AC supply due to cable density",
      "The conversion of the conduit into a transformer secondary winding",
      "An increase in the RMS voltage drop across the circuit length"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_FREQUENCY_WITH_VOLTAGE",
      "2": "CONFUSED_TRANSFORMER_WITH_AC_DC",
      "3": "CONFUSED_RMS_WITH_PEAK"
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
    "estimatedTime": 120,
    "explanation": "The space factor isn't just about heat; it's also about physical space. Overfilling a conduit makes it difficult to pull cables through, leading to high tension and potential tearing of the insulation."
  },
  {
    "id": 4058,
    "question": "In a scenario where a trunking system carries both 50Hz AC circuits and DC solar PV strings, how does the space factor requirement change according to standard UK installation practices?",
    "options": [
      "The space factor remains at 45% to ensure heat dissipation for both AC and DC conductors",
      "The space factor must be reduced to 25% because DC current produces more magnetic interference",
      "The space factor can be increased to 75% because DC does not produce a sine wave",
      "The space factor only applies to the AC circuits as DC does not generate heat"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_AC_DC_SOURCES",
      "2": "CONFUSED_AC_WITH_DC",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor / Enclosure Fill",
    "tags": [
      "ac-dc",
      "sine-wave",
      "conceptual"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 120,
    "explanation": "Regardless of whether the current is AC or DC, both types generate heat through resistance (I²R losses). The 45% space factor for trunking is a general rule to ensure thermoregulation for all current-carrying conductors."
  },
  {
    "id": 4059,
    "question": "A complex installation requires pulling ten 4.0mm² stranded copper cables (factor 58) and five 2.5mm² cables (factor 39) into a single conduit run with two 90-degree bends. Using the OSG method, what is the minimum conduit factor required?",
    "options": [
      "775",
      "97",
      "2262",
      "348"
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
      "application",
      "units"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 150,
    "explanation": "Total cable factor = (10 * 58) + (5 * 39) = 580 + 195 = 775. The conduit chosen must have a factor equal to or greater than this total."
  },
  {
    "id": 4060,
    "question": "How does the presence of high-frequency harmonics (e.g., from variable speed drives) affect the practical application of space factor in a large trunking system?",
    "options": [
      "It necessitates strict adherence to or reduction of the space factor due to increased skin effect and heat",
      "It allows for a 10% increase in space factor because high frequency reduces the RMS voltage",
      "It has no effect because the space factor is only concerned with the physical diameter of the cable",
      "It requires the use of DC-rated conduit because harmonics convert AC into DC"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_FREQUENCY_WITH_VOLTAGE",
      "2": "CONFUSED_AC_WITH_DC",
      "3": "CONFUSED_RMS_WITH_PEAK"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor / Enclosure Fill",
    "tags": [
      "frequency",
      "ac-dc",
      "conceptual"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 120,
    "explanation": "High-frequency harmonics increase the 'skin effect', where current flows primarily on the surface of the conductor, increasing resistance and heat. This makes the space factor (for cooling) even more critical."
  },
  {
    "id": 4061,
    "question": "Which of the following describes the 'discrimination' between the space factor for conduit and the space factor for trunking?",
    "options": [
      "Conduit is generally calculated using specific terms/factors from tables, while trunking uses a flat 45% of the cross-sectional area",
      "Trunking must be kept at 45% fill, whereas conduit can be filled to 100% if the run is straight",
      "Conduit space factor is based on the peak AC voltage, while trunking is based on the RMS current",
      "Trunking space factor applies to AC circuits, while conduit space factor only applies to DC circuits"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_RMS_WITH_PEAK",
      "3": "CONFUSED_AC_WITH_DC"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor / Enclosure Fill",
    "tags": [
      "discrimination",
      "terminology",
      "conceptual"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "In standard UK regulations (On-Site Guide), conduit capacity is determined by comparing summed cable factors against conduit factors in tables. Trunking is more simply calculated as 45% of its internal cross-sectional area."
  },
  {
    "id": 4062,
    "question": "An industrial site uses a 400Hz AC system for specialized equipment. Why might the standard 45% space factor for steel trunking be insufficient for this application?",
    "options": [
      "The higher frequency increases inductive reactance and magnetic heating in the steel enclosure",
      "A 400Hz frequency causes the cables to vibrate at a resonance that requires 90% space",
      "Higher frequencies decrease the RMS value, requiring more cables to carry the same power",
      "The space factor only works for the standard UK frequency of 50Hz and must be doubled for 400Hz"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_FREQUENCY_WITH_CURRENT",
      "2": "CONFUSED_RMS_WITH_PEAK",
      "3": "MULTIPLIED_INSTEAD"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor / Enclosure Fill",
    "tags": [
      "frequency",
      "ac-dc",
      "conceptual"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 120,
    "explanation": "Iron losses (hysteresis and eddy currents) in steel enclosures increase significantly with frequency. A 400Hz system will generate much more heat in the trunking walls than a 50Hz system, potentially requiring a lower fill ratio."
  },
  {
    "id": 4063,
    "question": "A trunking has internal dimensions of 50mm x 50mm. If the 45% space factor rule is applied, what is the maximum total cross-sectional area (including insulation) that the installed cables can occupy?",
    "options": [
      "1125 mm²",
      "2500 mm²",
      "1250 mm²",
      "562.5 mm²"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "DIVIDED_INSTEAD",
      "2": "FORMULA_NOT_REARRANGED",
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
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "Total area = 50mm * 50mm = 2500 mm². 45% of 2500 = 0.45 * 2500 = 1125 mm²."
  },
  {
    "id": 4064,
    "question": "When comparing a pure sine wave AC circuit and a flat-line DC circuit of the same RMS current magnitude, how does the required space factor for their respective conduits differ?",
    "options": [
      "The required space factor remains the same as it is based on the thermal equivalent (RMS) of the current",
      "The AC circuit requires more space because the peak voltage is 1.414 times higher than the DC voltage",
      "The DC circuit requires more space because it does not have a zero-crossing point to allow for cooling",
      "The AC circuit requires less space because the magnetic field alternates and cancels out heat"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_RMS_WITH_PEAK",
      "2": "CONFUSED_AC_WITH_DC",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor / Enclosure Fill",
    "tags": [
      "ac-dc",
      "sine-wave",
      "conceptual"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 150,
    "explanation": "RMS (Root Mean Square) is the DC equivalent value for heat dissipation. Since both circuits have the same RMS magnitude, they produce the same amount of heat in the conductors, meaning the space factor requirements for cooling are identical."
  },
  {
    "id": 4065,
    "question": "Which practical factor would most likely force an electrician to use a larger conduit than the standard space factor tables suggest for a 20-meter run?",
    "options": [
      "The presence of more than two 90-degree bends in the run",
      "The use of DC current instead of the standard 50Hz AC current",
      "The circuit being protected by a Type B circuit breaker instead of Type C",
      "The cables being used for a lighting circuit rather than a power circuit"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_AC_WITH_DC",
      "2": "TOPOLOGY_CONFUSION",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "Spacing Factor / Enclosure Fill",
    "tags": [
      "application",
      "discrimination",
      "calculation"
    ],
    "learningOutcomeId": "203-3F-LO1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "Standard conduit factor tables in the On-Site Guide account for specific lengths and numbers of bends. Increasing the number of bends increases friction and the risk of cable damage, necessitating a larger conduit size to maintain ease of pull."
  }
];
