import { TaggedQuestion } from './types';

/**
 * Types of Cables and Applications Question Bank
 * Aligned with lesson 203-1A learning outcomes
 * Covers cable construction, common cable types, environmental selection, and identification
 */

export const cablesApplicationsQuestions: TaggedQuestion[] = [
  // ===== EASY QUESTIONS (Difficulty 1-2) =====
  
  {
    id: 4001,
    question: "What is the main function of the conductor in a cable?",
    options: [
      "To carry electrical current",
      "To provide insulation",
      "To protect against mechanical damage",
      "To provide earthing"
    ],
    correctAnswer: 0,
    section: "Electrical Installations Technology",
    category: "Types of Cables",
    tags: ['application', 'conceptual'],
    learningOutcomeId: "203-1A-LO1",
    answerType: 'mcq',
    difficulty: 1,
    estimatedTime: 30,
    explanation: "The conductor is the metal core (usually copper or aluminium) that carries the electric current through the cable.",
    misconceptionCodes: {
      1: 'OTHER',
      2: 'OTHER',
      3: 'OTHER'
    }
  },

  {
    id: 4002,
    question: "What does CPC stand for in cable construction?",
    options: [
      "Circuit Protective Conductor",
      "Cable Protection Cover",
      "Current Path Connector",
      "Central Power Cable"
    ],
    correctAnswer: 0,
    section: "Electrical Installations Technology",
    category: "Types of Cables",
    tags: ['application', 'discrimination'],
    learningOutcomeId: "203-1A-LO1",
    answerType: 'mcq',
    difficulty: 1,
    estimatedTime: 30,
    explanation: "CPC stands for Circuit Protective Conductor, also known as the earth conductor or earth wire.",
    misconceptionCodes: {
      1: 'OTHER',
      2: 'OTHER',
      3: 'OTHER'
    }
  },

  {
    id: 4003,
    question: "What colour is the live conductor in current UK wiring standards?",
    options: [
      "Brown",
      "Blue",
      "Green and yellow",
      "Red"
    ],
    correctAnswer: 0,
    section: "Electrical Installations Technology",
    category: "Types of Cables",
    tags: ['application', 'discrimination'],
    learningOutcomeId: "203-1A-LO1",
    answerType: 'mcq',
    difficulty: 1,
    estimatedTime: 30,
    explanation: "Since 2004, the UK uses brown for live (line), blue for neutral, and green/yellow for earth.",
    misconceptionCodes: {
      1: 'OTHER',
      2: 'OTHER',
      3: 'OTHER'
    }
  },

  {
    id: 4004,
    question: "What colour is the neutral conductor in current UK wiring standards?",
    options: [
      "Blue",
      "Brown",
      "Black",
      "Green and yellow"
    ],
    correctAnswer: 0,
    section: "Electrical Installations Technology",
    category: "Types of Cables",
    tags: ['application', 'discrimination'],
    learningOutcomeId: "203-1A-LO1",
    answerType: 'mcq',
    difficulty: 1,
    estimatedTime: 30,
    explanation: "The neutral conductor is blue in the current UK colour code (post-2004).",
    misconceptionCodes: {
      1: 'OTHER',
      2: 'OTHER',
      3: 'OTHER'
    }
  },

  {
    id: 4005,
    question: "What does T&E stand for?",
    options: [
      "Twin and Earth",
      "Two and Earth",
      "Terminal and Earth",
      "Thick and Earthed"
    ],
    correctAnswer: 0,
    section: "Electrical Installations Technology",
    category: "Types of Cables",
    tags: ['application', 'discrimination'],
    learningOutcomeId: "203-1A-LO2",
    answerType: 'mcq',
    difficulty: 1,
    estimatedTime: 30,
    explanation: "T&E stands for Twin and Earth cable, commonly used for fixed domestic wiring.",
    misconceptionCodes: {
      1: 'OTHER',
      2: 'OTHER',
      3: 'OTHER'
    }
  },

  {
    id: 4006,
    question: "What is the typical sheath colour of Twin and Earth cable?",
    options: [
      "Grey or white",
      "Black",
      "Red",
      "Green"
    ],
    correctAnswer: 0,
    section: "Electrical Installations Technology",
    category: "Types of Cables",
    tags: ['application', 'discrimination'],
    learningOutcomeId: "203-1A-LO2",
    answerType: 'mcq',
    difficulty: 1,
    estimatedTime: 30,
    explanation: "Twin and Earth cable typically has a grey or white PVC sheath.",
    misconceptionCodes: {
      1: 'OTHER',
      2: 'OTHER',
      3: 'OTHER'
    }
  },

  {
    id: 4007,
    question: "What is the main purpose of cable insulation?",
    options: [
      "To prevent electric shock and short circuits",
      "To carry the electrical current",
      "To provide mechanical strength",
      "To identify the cable type"
    ],
    correctAnswer: 0,
    section: "Electrical Installations Technology",
    category: "Types of Cables",
    tags: ['application', 'conceptual'],
    learningOutcomeId: "203-1A-LO1",
    answerType: 'mcq',
    difficulty: 1,
    estimatedTime: 30,
    explanation: "Insulation is the non-conductive material that surrounds conductors to prevent electric shock and short circuits.",
    misconceptionCodes: {
      1: 'OTHER',
      2: 'OTHER',
      3: 'OTHER'
    }
  },

  {
    id: 4008,
    question: "What material are cable conductors typically made from?",
    options: [
      "Copper",
      "PVC",
      "Rubber",
      "Steel"
    ],
    correctAnswer: 0,
    section: "Electrical Installations Technology",
    category: "Types of Cables",
    tags: ['application', 'discrimination'],
    learningOutcomeId: "203-1A-LO1",
    answerType: 'mcq',
    difficulty: 1,
    estimatedTime: 30,
    explanation: "Cable conductors are typically made from copper (sometimes aluminium) because it has low resistance and conducts electricity efficiently.",
    misconceptionCodes: {
      1: 'OTHER',
      2: 'OTHER',
      3: 'OTHER'
    }
  },

  {
    id: 4009,
    question: "What type of cable is commonly used for connecting portable appliances?",
    options: [
      "Flexible cord (flex)",
      "Twin and Earth",
      "Singles in conduit",
      "SWA cable"
    ],
    correctAnswer: 0,
    section: "Electrical Installations Technology",
    category: "Types of Cables",
    tags: ['application', 'application'],
    learningOutcomeId: "203-1A-LO2",
    answerType: 'mcq',
    difficulty: 1,
    estimatedTime: 30,
    explanation: "Flexible cord (flex) has stranded conductors designed for flexibility, making it suitable for portable appliances.",
    misconceptionCodes: {
      1: 'OTHER',
      2: 'OTHER',
      3: 'OTHER'
    }
  },

  {
    id: 4010,
    question: "What does SWA stand for?",
    options: [
      "Steel Wire Armoured",
      "Single Wire Attached",
      "Safe Wiring Application",
      "Sheath With Aluminium"
    ],
    correctAnswer: 0,
    section: "Electrical Installations Technology",
    category: "Types of Cables",
    tags: ['application', 'discrimination'],
    learningOutcomeId: "203-1A-LO2",
    answerType: 'mcq',
    difficulty: 1,
    estimatedTime: 30,
    explanation: "SWA stands for Steel Wire Armoured cable, which has a layer of steel wires for protection against mechanical damage.",
    misconceptionCodes: {
      1: 'OTHER',
      2: 'OTHER',
      3: 'OTHER'
    }
  },

  {
    id: 4011,
    question: "What is the main purpose of the cable sheath?",
    options: [
      "To protect against mechanical damage and moisture",
      "To carry electrical current",
      "To prevent electric shock",
      "To provide colour coding"
    ],
    correctAnswer: 0,
    section: "Electrical Installations Technology",
    category: "Types of Cables",
    tags: ['application', 'conceptual'],
    learningOutcomeId: "203-1A-LO1",
    answerType: 'mcq',
    difficulty: 1,
    estimatedTime: 30,
    explanation: "The sheath is the outer protective layer that protects the cable from mechanical damage, moisture, and environmental factors.",
    misconceptionCodes: {
      1: 'OTHER',
      2: 'OTHER',
      3: 'OTHER'
    }
  },

  {
    id: 4012,
    question: "Which cable type has solid conductors?",
    options: [
      "Twin and Earth",
      "Flexible cord",
      "Flex",
      "Extension lead cable"
    ],
    correctAnswer: 0,
    section: "Electrical Installations Technology",
    category: "Types of Cables",
    tags: ['application', 'discrimination'],
    learningOutcomeId: "203-1A-LO2",
    answerType: 'mcq',
    difficulty: 1,
    estimatedTime: 30,
    explanation: "Twin and Earth cable has solid (single strand) conductors, while flex has stranded conductors for flexibility.",
    misconceptionCodes: {
      1: 'OTHER',
      2: 'OTHER',
      3: 'OTHER'
    }
  },

  {
    id: 4013,
    question: "What is the typical size of Twin and Earth cable used for socket circuits?",
    options: [
      "2.5mm²",
      "1.0mm²",
      "1.5mm²",
      "4.0mm²"
    ],
    correctAnswer: 0,
    section: "Electrical Installations Technology",
    category: "Types of Cables",
    tags: ['application', 'discrimination'],
    learningOutcomeId: "203-1A-LO2",
    answerType: 'mcq',
    difficulty: 2,
    estimatedTime: 30,
    explanation: "2.5mm² T&E cable is the standard size for domestic socket circuits.",
    misconceptionCodes: {
      1: 'OTHER',
      2: 'OTHER',
      3: 'OTHER'
    }
  },

  {
    id: 4014,
    question: "What is the typical size of Twin and Earth cable used for lighting circuits?",
    options: [
      "1.0mm² or 1.5mm²",
      "2.5mm²",
      "4.0mm²",
      "6.0mm²"
    ],
    correctAnswer: 0,
    section: "Electrical Installations Technology",
    category: "Types of Cables",
    tags: ['application', 'discrimination'],
    learningOutcomeId: "203-1A-LO2",
    answerType: 'mcq',
    difficulty: 2,
    estimatedTime: 30,
    explanation: "Lighting circuits typically use 1.0mm² or 1.5mm² T&E cable because lighting loads are relatively small.",
    misconceptionCodes: {
      1: 'OTHER',
      2: 'OTHER',
      3: 'OTHER'
    }
  },

  {
    id: 4015,
    question: "Which cable type is most suitable for underground installation?",
    options: [
      "SWA (Steel Wire Armoured)",
      "Twin and Earth",
      "Flexible cord",
      "Singles in standard conduit"
    ],
    correctAnswer: 0,
    section: "Electrical Installations Technology",
    category: "Types of Cables",
    tags: ['application', 'application'],
    learningOutcomeId: "203-1A-LO3",
    answerType: 'mcq',
    difficulty: 2,
    estimatedTime: 30,
    explanation: "SWA cable is designed for underground installation with its steel armour protecting against moisture and mechanical damage.",
    misconceptionCodes: {
      1: 'OTHER',
      2: 'OTHER',
      3: 'OTHER'
    }
  },

  // ===== MEDIUM QUESTIONS (Difficulty 2-3) =====

  {
    id: 4016,
    question: "Why is flexible cord NOT suitable for fixed installations?",
    options: [
      "It is easily damaged and not designed to be clipped to surfaces",
      "It is too expensive",
      "It cannot carry enough current",
      "It does not have an earth conductor"
    ],
    correctAnswer: 0,
    section: "Electrical Installations Technology",
    category: "Types of Cables",
    tags: ['application', 'conceptual'],
    learningOutcomeId: "203-1A-LO2",
    answerType: 'mcq',
    difficulty: 2,
    estimatedTime: 45,
    explanation: "Flex is designed for flexibility and movement, making it vulnerable to damage. It's not suitable for permanent installation clipped to surfaces.",
    misconceptionCodes: {
      1: 'OTHER',
      2: 'OTHER',
      3: 'OTHER'
    }
  },

  {
    id: 4017,
    question: "In a Twin and Earth cable, what form is the CPC typically in?",
    options: [
      "Bare copper",
      "Green and yellow insulated",
      "Blue insulated",
      "Brown insulated"
    ],
    correctAnswer: 0,
    section: "Electrical Installations Technology",
    category: "Types of Cables",
    tags: ['application', 'discrimination'],
    learningOutcomeId: "203-1A-LO1",
    answerType: 'mcq',
    difficulty: 2,
    estimatedTime: 30,
    explanation: "In T&E cable, the CPC is typically bare copper (no insulation), positioned between the two insulated conductors.",
    misconceptionCodes: {
      1: 'OTHER',
      2: 'OTHER',
      3: 'OTHER'
    }
  },

  {
    id: 4018,
    question: "What type of conductor does flexible cord have?",
    options: [
      "Fine stranded conductors",
      "Solid single-strand conductors",
      "Hollow tube conductors",
      "Flat ribbon conductors"
    ],
    correctAnswer: 0,
    section: "Electrical Installations Technology",
    category: "Types of Cables",
    tags: ['application', 'discrimination'],
    learningOutcomeId: "203-1A-LO2",
    answerType: 'mcq',
    difficulty: 2,
    estimatedTime: 30,
    explanation: "Flexible cord has fine stranded conductors (many thin wires twisted together) to allow repeated bending without breaking.",
    misconceptionCodes: {
      1: 'OTHER',
      2: 'OTHER',
      3: 'OTHER'
    }
  },

  {
    id: 4019,
    question: "Where would you typically use singles in conduit or trunking?",
    options: [
      "Commercial and industrial installations",
      "Domestic socket circuits only",
      "Portable appliance connections",
      "Underground outdoor installations"
    ],
    correctAnswer: 0,
    section: "Electrical Installations Technology",
    category: "Types of Cables",
    tags: ['application', 'application'],
    learningOutcomeId: "203-1A-LO2",
    answerType: 'mcq',
    difficulty: 2,
    estimatedTime: 45,
    explanation: "Singles in conduit or trunking are commonly used in commercial and industrial installations for neat, professional-looking cable runs with mechanical protection.",
    misconceptionCodes: {
      1: 'OTHER',
      2: 'OTHER',
      3: 'OTHER'
    }
  },

  {
    id: 4020,
    question: "What environmental factor would require you to derate a cable?",
    options: [
      "High ambient temperature",
      "Low voltage",
      "Short cable length",
      "Clean environment"
    ],
    correctAnswer: 0,
    section: "Electrical Installations Technology",
    category: "Types of Cables",
    tags: ['application', 'application'],
    learningOutcomeId: "203-1A-LO3",
    answerType: 'mcq',
    difficulty: 3,
    estimatedTime: 45,
    explanation: "High ambient temperature reduces a cable's current-carrying capacity, requiring derating (using a larger cable size than would otherwise be needed).",
    misconceptionCodes: {
      1: 'OTHER',
      2: 'OTHER',
      3: 'OTHER'
    }
  },

  {
    id: 4021,
    question: "What is the main advantage of using singles in trunking over T&E cable?",
    options: [
      "Easier to modify cable runs later and better mechanical protection",
      "Cheaper to install",
      "Carries more current",
      "Better for domestic installations"
    ],
    correctAnswer: 0,
    section: "Electrical Installations Technology",
    category: "Types of Cables",
    tags: ['application', 'conceptual'],
    learningOutcomeId: "203-1A-LO2",
    answerType: 'mcq',
    difficulty: 3,
    estimatedTime: 45,
    explanation: "Singles in trunking can be pulled out and replaced easily, and the trunking provides excellent mechanical protection and a neat professional appearance.",
    misconceptionCodes: {
      1: 'OTHER',
      2: 'OTHER',
      3: 'OTHER'
    }
  },

  {
    id: 4022,
    question: "How many insulated conductors does a typical 2-core Twin and Earth cable have?",
    options: [
      "Two (plus a bare CPC)",
      "Three",
      "Two",
      "Four"
    ],
    correctAnswer: 0,
    section: "Electrical Installations Technology",
    category: "Types of Cables",
    tags: ['application', 'discrimination'],
    learningOutcomeId: "203-1A-LO1",
    answerType: 'mcq',
    difficulty: 2,
    estimatedTime: 30,
    explanation: "Twin and Earth has two insulated conductors (live and neutral) plus a bare CPC, despite being called '2-core + earth'.",
    misconceptionCodes: {
      1: 'OTHER',
      2: 'OTHER',
      3: 'OTHER'
    }
  },

  {
    id: 4023,
    question: "What does the marking '6242Y' on a cable indicate?",
    options: [
      "Twin and Earth cable type",
      "Cable voltage rating",
      "Cable length in meters",
      "Manufacturer code"
    ],
    correctAnswer: 0,
    section: "Electrical Installations Technology",
    category: "Types of Cables",
    tags: ['application', 'discrimination'],
    learningOutcomeId: "203-1A-LO2",
    answerType: 'mcq',
    difficulty: 3,
    estimatedTime: 45,
    explanation: "6242Y is the designation for Twin and Earth cable with 2 insulated conductors plus earth.",
    misconceptionCodes: {
      1: 'OTHER',
      2: 'OTHER',
      3: 'OTHER'
    }
  },

  {
    id: 4024,
    question: "You need to wire socket circuits in a domestic property. The cable will be clipped to ceiling joists and buried in walls within safe zones. What cable should you use?",
    options: [
      "Twin and Earth (T&E)",
      "Flexible cord",
      "SWA cable",
      "Singles in flexible conduit"
    ],
    correctAnswer: 0,
    section: "Electrical Installations Technology",
    category: "Types of Cables",
    tags: ['application', 'application'],
    learningOutcomeId: "203-1A-LO3",
    answerType: 'mcq',
    difficulty: 2,
    estimatedTime: 45,
    explanation: "Twin and Earth is the standard cable for domestic fixed wiring, suitable for clipping to surfaces and burying in walls within safe zones.",
    misconceptionCodes: {
      1: 'OTHER',
      2: 'OTHER',
      3: 'OTHER'
    }
  },

  {
    id: 4025,
    question: "What is the minimum burial depth for SWA cable under a garden (not under paving)?",
    options: [
      "600mm",
      "300mm",
      "450mm",
      "900mm"
    ],
    correctAnswer: 0,
    section: "Electrical Installations Technology",
    category: "Types of Cables",
    tags: ['application', 'application'],
    learningOutcomeId: "203-1A-LO3",
    answerType: 'mcq',
    difficulty: 3,
    estimatedTime: 45,
    explanation: "SWA cable should be buried at least 600mm deep in gardens (or 450mm if covered by paving) to protect against digging damage.",
    misconceptionCodes: {
      1: 'OTHER',
      2: 'OTHER',
      3: 'OTHER'
    }
  },

  {
    id: 4026,
    question: "What was the live conductor colour in the old UK wiring colour code (pre-2004)?",
    options: [
      "Red",
      "Brown",
      "Black",
      "Blue"
    ],
    correctAnswer: 0,
    section: "Electrical Installations Technology",
    category: "Types of Cables",
    tags: ['application', 'discrimination'],
    learningOutcomeId: "203-1A-LO1",
    answerType: 'mcq',
    difficulty: 2,
    estimatedTime: 30,
    explanation: "Before 2004, the UK used red for live. The current code (post-2004) uses brown for live.",
    misconceptionCodes: {
      1: 'OTHER',
      2: 'OTHER',
      3: 'OTHER'
    }
  },

  {
    id: 4027,
    question: "What shape is Twin and Earth cable?",
    options: [
      "Flat",
      "Round",
      "Square",
      "Triangular"
    ],
    correctAnswer: 0,
    section: "Electrical Installations Technology",
    category: "Types of Cables",
    tags: ['application', 'discrimination'],
    learningOutcomeId: "203-1A-LO2",
    answerType: 'mcq',
    difficulty: 1,
    estimatedTime: 30,
    explanation: "Twin and Earth cable is flat in cross-section, with the bare CPC positioned between the two insulated conductors.",
    misconceptionCodes: {
      1: 'OTHER',
      2: 'OTHER',
      3: 'OTHER'
    }
  },

  {
    id: 4028,
    question: "What shape is flexible cord (flex)?",
    options: [
      "Round",
      "Flat",
      "Square",
      "Oval"
    ],
    correctAnswer: 0,
    section: "Electrical Installations Technology",
    category: "Types of Cables",
    tags: ['application', 'discrimination'],
    learningOutcomeId: "203-1A-LO2",
    answerType: 'mcq',
    difficulty: 1,
    estimatedTime: 30,
    explanation: "Flexible cord is round in cross-section, with all conductors (including earth if present) being insulated.",
    misconceptionCodes: {
      1: 'OTHER',
      2: 'OTHER',
      3: 'OTHER'
    }
  },

  {
    id: 4029,
    question: "Why is copper preferred over aluminium for most cable conductors?",
    options: [
      "Lower resistance and better conductivity",
      "Cheaper cost",
      "Lighter weight",
      "Better insulation properties"
    ],
    correctAnswer: 0,
    section: "Electrical Installations Technology",
    category: "Types of Cables",
    tags: ['application', 'conceptual'],
    learningOutcomeId: "203-1A-LO1",
    answerType: 'mcq',
    difficulty: 2,
    estimatedTime: 45,
    explanation: "Copper has lower resistance and better electrical conductivity than aluminium, making it more efficient for carrying current.",
    misconceptionCodes: {
      1: 'OTHER',
      2: 'OTHER',
      3: 'OTHER'
    }
  },

  {
    id: 4030,
    question: "What is the main purpose of the CPC (Circuit Protective Conductor)?",
    options: [
      "To provide a low-resistance path to earth for fault protection",
      "To carry the neutral current",
      "To provide mechanical strength to the cable",
      "To insulate the live conductor"
    ],
    correctAnswer: 0,
    section: "Electrical Installations Technology",
    category: "Types of Cables",
    tags: ['application', 'conceptual'],
    learningOutcomeId: "203-1A-LO1",
    answerType: 'mcq',
    difficulty: 2,
    estimatedTime: 45,
    explanation: "The CPC provides a low-resistance path to earth. If a fault occurs, current flows through the CPC, tripping the protective device and preventing electric shock.",
    misconceptionCodes: {
      1: 'OTHER',
      2: 'OTHER',
      3: 'OTHER'
    }
  },

  {
    id: 4031,
    question: "A cable is to be run through an area exposed to oils and solvents in an industrial workshop. What should you consider?",
    options: [
      "Use a cable with chemical-resistant insulation and sheath",
      "Use standard T&E cable",
      "Use flexible cord",
      "No special considerations needed"
    ],
    correctAnswer: 0,
    section: "Electrical Installations Technology",
    category: "Types of Cables",
    tags: ['application', 'application'],
    learningOutcomeId: "203-1A-LO3",
    answerType: 'mcq',
    difficulty: 3,
    estimatedTime: 60,
    explanation: "Industrial environments with oils, solvents, or aggressive chemicals may require specialized cable types with chemical-resistant insulation rather than standard PVC.",
    misconceptionCodes: {
      1: 'OTHER',
      2: 'OTHER',
      3: 'OTHER'
    }
  },

  {
    id: 4032,
    question: "You need to install a cable in a loft space where temperatures can exceed 40°C in summer. What should you do?",
    options: [
      "Derate the cable or select a larger size to compensate for reduced current capacity",
      "Use the standard cable size without adjustment",
      "Use flexible cord instead",
      "Install the cable directly on the insulation"
    ],
    correctAnswer: 0,
    section: "Electrical Installations Technology",
    category: "Types of Cables",
    tags: ['application', 'application'],
    learningOutcomeId: "203-1A-LO3",
    answerType: 'mcq',
    difficulty: 3,
    estimatedTime: 60,
    explanation: "High ambient temperatures reduce current-carrying capacity. The cable must be derated (a larger size selected) to ensure it can safely carry the required current without overheating.",
    misconceptionCodes: {
      1: 'OTHER',
      2: 'OTHER',
      3: 'OTHER'
    }
  },

  {
    id: 4033,
    question: "What advantage does stranded conductor have over solid conductor?",
    options: [
      "More flexible and can withstand repeated bending",
      "Carries more current",
      "Cheaper to manufacture",
      "Better insulation"
    ],
    correctAnswer: 0,
    section: "Electrical Installations Technology",
    category: "Types of Cables",
    tags: ['application', 'conceptual'],
    learningOutcomeId: "203-1A-LO2",
    answerType: 'mcq',
    difficulty: 2,
    estimatedTime: 45,
    explanation: "Stranded conductors (many thin wires) are more flexible than solid conductors and can withstand repeated bending without breaking, which is why they're used in flex.",
    misconceptionCodes: {
      1: 'OTHER',
      2: 'OTHER',
      3: 'OTHER'
    }
  },

  {
    id: 4034,
    question: "What is the standard voltage rating marked on most domestic cables?",
    options: [
      "300/500V",
      "230V",
      "110V",
      "400V"
    ],
    correctAnswer: 0,
    section: "Electrical Installations Technology",
    category: "Types of Cables",
    tags: ['application', 'discrimination'],
    learningOutcomeId: "203-1A-LO1",
    answerType: 'mcq',
    difficulty: 3,
    estimatedTime: 45,
    explanation: "Domestic cables are typically rated 300/500V (300V to earth, 500V between conductors), which is well above the 230V mains supply.",
    misconceptionCodes: {
      1: 'OTHER',
      2: 'OTHER',
      3: 'OTHER'
    }
  },

  {
    id: 4035,
    question: "Which British Standard covers PVC-insulated cables for fixed wiring?",
    options: [
      "BS 6004",
      "BS 7671",
      "BS 1363",
      "BS 5839"
    ],
    correctAnswer: 0,
    section: "Electrical Installations Technology",
    category: "Types of Cables",
    tags: ['application', 'discrimination'],
    learningOutcomeId: "203-1A-LO1",
    answerType: 'mcq',
    difficulty: 3,
    estimatedTime: 45,
    explanation: "BS 6004 is the British Standard for PVC-insulated cables (non-armoured) for electric power and lighting, including T&E cable.",
    misconceptionCodes: {
      1: 'OTHER',
      2: 'OTHER',
      3: 'OTHER'
    }
  },

  {
    id: 4036,
    question: "You're running a cable to supply a workshop at the bottom of the garden. The cable will be clipped to fence panels above ground. What type of cable should you use?",
    options: [
      "SWA cable (for outdoor use and mechanical protection)",
      "Standard T&E cable",
      "Flexible cord",
      "Singles in plastic conduit"
    ],
    correctAnswer: 0,
    section: "Electrical Installations Technology",
    category: "Types of Cables",
    tags: ['application', 'application'],
    learningOutcomeId: "203-1A-LO3",
    answerType: 'mcq',
    difficulty: 3,
    estimatedTime: 60,
    explanation: "Even above ground, outdoor cables need weather resistance and mechanical protection. SWA cable is suitable for outdoor installation whether buried or clipped to structures.",
    misconceptionCodes: {
      1: 'OTHER',
      2: 'OTHER',
      3: 'OTHER'
    }
  },

  {
    id: 4037,
    question: "What does '2C + E' mean in cable markings?",
    options: [
      "2 cores plus earth",
      "2 circuits plus equipment",
      "2 conductors, earthed",
      "2 connections, extended"
    ],
    correctAnswer: 0,
    section: "Electrical Installations Technology",
    category: "Types of Cables",
    tags: ['application', 'discrimination'],
    learningOutcomeId: "203-1A-LO1",
    answerType: 'mcq',
    difficulty: 2,
    estimatedTime: 30,
    explanation: "'2C + E' means 2 cores (insulated conductors) plus earth conductor, which describes a standard Twin and Earth cable.",
    misconceptionCodes: {
      1: 'OTHER',
      2: 'OTHER',
      3: 'OTHER'
    }
  },

  {
    id: 4038,
    question: "Why should you never assume conductor identification without testing?",
    options: [
      "Older installations may use different colour codes, and wiring could be incorrect",
      "All colours are the same",
      "Testing is not necessary",
      "Colours fade over time"
    ],
    correctAnswer: 0,
    section: "Electrical Installations Technology",
    category: "Types of Cables",
    tags: ['application', 'conceptual'],
    learningOutcomeId: "203-1A-LO1",
    answerType: 'mcq',
    difficulty: 2,
    estimatedTime: 45,
    explanation: "Older installations use different colour codes (red/black vs brown/blue), and even in new installations, wiring could have been done incorrectly. Always test to verify.",
    misconceptionCodes: {
      1: 'OTHER',
      2: 'OTHER',
      3: 'OTHER'
    }
  },

  {
    id: 4039,
    question: "What type of cable would typically be used for a cooker circuit requiring 6mm² conductors?",
    options: [
      "6mm² Twin and Earth",
      "Flexible cord",
      "Singles in flex conduit",
      "Extension lead cable"
    ],
    correctAnswer: 0,
    section: "Electrical Installations Technology",
    category: "Types of Cables",
    tags: ['application', 'application'],
    learningOutcomeId: "203-1A-LO2",
    answerType: 'mcq',
    difficulty: 2,
    estimatedTime: 45,
    explanation: "Cooker circuits are fixed installations in domestic properties, so Twin and Earth cable is appropriate. The size (6mm²) is selected based on the load.",
    misconceptionCodes: {
      1: 'OTHER',
      2: 'OTHER',
      3: 'OTHER'
    }
  },

  {
    id: 4040,
    question: "In what situation might you see 3-core Twin and Earth cable?",
    options: [
      "For two-way lighting circuits (two switches controlling one light)",
      "For standard socket circuits",
      "For portable appliances",
      "For underground installations"
    ],
    correctAnswer: 0,
    section: "Electrical Installations Technology",
    category: "Types of Cables",
    tags: ['application', 'application'],
    learningOutcomeId: "203-1A-LO2",
    answerType: 'mcq',
    difficulty: 3,
    estimatedTime: 60,
    explanation: "3-core + earth Twin and Earth cable is used for two-way switching (e.g., stairs lighting controlled from two locations), providing the extra conductor needed for the switching arrangement.",
    misconceptionCodes: {
      1: 'OTHER',
      2: 'OTHER',
      3: 'OTHER'
    }
  },

  // ===== HARD QUESTIONS (Difficulty 4-5) =====

  {
    id: 4041,
    question: "You're installing cables in a building's fire escape route. What additional requirement must the cables meet?",
    options: [
      "Low smoke and fume (LSF) or fire-resistant properties",
      "Standard PVC insulation is sufficient",
      "Must use flexible cord only",
      "Must be painted red"
    ],
    correctAnswer: 0,
    section: "Electrical Installations Technology",
    category: "Types of Cables",
    tags: ['application', 'application'],
    learningOutcomeId: "203-1A-LO3",
    answerType: 'mcq',
    difficulty: 4,
    estimatedTime: 75,
    explanation: "Escape routes and high-fire-risk areas may require Low Smoke and Fume (LSF) cables or fire-resistant cables to maintain safety during a fire and minimize toxic fumes.",
    misconceptionCodes: {
      1: 'OTHER',
      2: 'OTHER',
      3: 'OTHER'
    }
  },

  {
    id: 4042,
    question: "A cable run includes sections with different installation methods (clipped direct, buried in walls, in insulation). How does this affect cable selection?",
    options: [
      "Must select cable size based on the most onerous installation method and apply appropriate derating",
      "Use the average of all methods",
      "Only consider the longest section",
      "No effect on selection"
    ],
    correctAnswer: 0,
    section: "Electrical Installations Technology",
    category: "Types of Cables",
    tags: ['application', 'application'],
    learningOutcomeId: "203-1A-LO3",
    answerType: 'mcq',
    difficulty: 4,
    estimatedTime: 90,
    explanation: "When a cable run includes multiple installation methods, you must select the cable size based on the worst-case (most onerous) method, which is typically the one with poorest heat dissipation.",
    misconceptionCodes: {
      1: 'OTHER',
      2: 'OTHER',
      3: 'OTHER'
    }
  },

  {
    id: 4043,
    question: "What is MICC cable and where would it typically be used?",
    options: [
      "Mineral Insulated Copper Clad cable, used in high-fire-risk environments",
      "Metal Insulated Cable Cover, used for general wiring",
      "Multi-core Industrial Connection Cable, used for factories",
      "Moisture Insulated Commercial Cable, used outdoors"
    ],
    correctAnswer: 0,
    section: "Electrical Installations Technology",
    category: "Types of Cables",
    tags: ['application', 'discrimination'],
    learningOutcomeId: "203-1A-LO2",
    answerType: 'mcq',
    difficulty: 4,
    estimatedTime: 60,
    explanation: "MICC (Mineral Insulated Copper Clad) cable has mineral powder insulation and is highly fire-resistant, making it suitable for high-risk environments like boiler rooms and fire alarm systems.",
    misconceptionCodes: {
      1: 'OTHER',
      2: 'OTHER',
      3: 'OTHER'
    }
  },

  {
    id: 4044,
    question: "A bathroom installation requires cables in zone 1 (near the bath/shower). What considerations apply?",
    options: [
      "Cables must have adequate IP rating protection and be suitable for damp locations",
      "Standard T&E cable with no special requirements",
      "Must use flexible cord only",
      "No electrical cables allowed in zone 1"
    ],
    correctAnswer: 0,
    section: "Electrical Installations Technology",
    category: "Types of Cables",
    tags: ['application', 'application'],
    learningOutcomeId: "203-1A-LO3",
    answerType: 'mcq',
    difficulty: 4,
    estimatedTime: 90,
    explanation: "Bathroom zones have strict requirements for IP ratings and moisture protection. Cables in zones must be suitable for damp locations, and specific regulations apply to what can be installed.",
    misconceptionCodes: {
      1: 'OTHER',
      2: 'OTHER',
      3: 'OTHER'
    }
  },

  {
    id: 4045,
    question: "Why might aluminium conductors be used instead of copper in some large installations despite copper's superior conductivity?",
    options: [
      "Aluminium is lighter and cheaper for very large conductor sizes",
      "Aluminium has better conductivity",
      "Aluminium is more flexible",
      "Aluminium is required by regulations"
    ],
    correctAnswer: 0,
    section: "Electrical Installations Technology",
    category: "Types of Cables",
    tags: ['application', 'conceptual'],
    learningOutcomeId: "203-1A-LO1",
    answerType: 'mcq',
    difficulty: 4,
    estimatedTime: 75,
    explanation: "While copper has better conductivity, aluminium is significantly lighter and cheaper. For very large conductor sizes (e.g., in distribution networks), these advantages can outweigh the need for larger cross-sectional area.",
    misconceptionCodes: {
      1: 'OTHER',
      2: 'OTHER',
      3: 'OTHER'
    }
  },

  {
    id: 4046,
    question: "A cable will pass through a wall between a cold garage and a warm house. What issue might this create?",
    options: [
      "Condensation may form inside the cable due to temperature difference",
      "No issues",
      "The cable will expand too much",
      "The insulation will melt"
    ],
    correctAnswer: 0,
    section: "Electrical Installations Technology",
    category: "Types of Cables",
    tags: ['application', 'application'],
    learningOutcomeId: "203-1A-LO3",
    answerType: 'mcq',
    difficulty: 5,
    estimatedTime: 90,
    explanation: "When cables pass between areas with significant temperature differences, moisture from warm air can condense inside the cable at the cold end, potentially causing corrosion and breakdown. Proper sealing or drainage may be needed.",
    misconceptionCodes: {
      1: 'OTHER',
      2: 'OTHER',
      3: 'OTHER'
    }
  },

  {
    id: 4047,
    question: "What is 'grouping' and how does it affect cable selection?",
    options: [
      "Multiple cables bundled together must be derated because they can't dissipate heat effectively",
      "Organizing cables by color for easy identification",
      "Connecting multiple circuits to one breaker",
      "Installing cables at specific intervals"
    ],
    correctAnswer: 0,
    section: "Electrical Installations Technology",
    category: "Types of Cables",
    tags: ['application', 'application'],
    learningOutcomeId: "203-1A-LO3",
    answerType: 'mcq',
    difficulty: 4,
    estimatedTime: 90,
    explanation: "When multiple cables are grouped (bundled together or in the same enclosure), they heat each other and cannot dissipate heat effectively. This requires derating factors to be applied when selecting cable sizes.",
    misconceptionCodes: {
      1: 'OTHER',
      2: 'OTHER',
      3: 'OTHER'
    }
  },

  {
    id: 4048,
    question: "What determines whether a cable can be 'clipped direct' to a surface or must be enclosed in conduit/trunking?",
    options: [
      "Mechanical protection requirements, aesthetics, installation environment, and cable type",
      "Only the cable size",
      "Only the voltage",
      "Only the current rating"
    ],
    correctAnswer: 0,
    section: "Electrical Installations Technology",
    category: "Types of Cables",
    tags: ['application', 'application'],
    learningOutcomeId: "203-1A-LO3",
    answerType: 'mcq',
    difficulty: 4,
    estimatedTime: 75,
    explanation: "The choice between clipped direct and enclosure depends on multiple factors: level of mechanical protection needed, environmental conditions, aesthetic requirements, and cable type. Some cables (like singles) must be in enclosures.",
    misconceptionCodes: {
      1: 'OTHER',
      2: 'OTHER',
      3: 'OTHER'
    }
  },

  {
    id: 4049,
    question: "Why do SWA cable terminations require special glands?",
    options: [
      "To properly terminate the steel wire armour, provide mechanical retention, and maintain earth continuity",
      "Just for aesthetics",
      "To make installation easier",
      "They don't require special glands"
    ],
    correctAnswer: 0,
    section: "Electrical Installations Technology",
    category: "Types of Cables",
    tags: ['application', 'conceptual'],
    learningOutcomeId: "203-1A-LO2",
    answerType: 'mcq',
    difficulty: 4,
    estimatedTime: 75,
    explanation: "SWA glands provide mechanical retention (clamping), properly terminate the steel wire armour (which acts as a CPC), and ensure electrical continuity of the earth path. They also maintain IP ratings.",
    misconceptionCodes: {
      1: 'OTHER',
      2: 'OTHER',
      3: 'OTHER'
    }
  },

  {
    id: 4050,
    question: "A data center requires cabling for power distribution. Beyond standard electrical requirements, what additional consideration might apply to cable selection?",
    options: [
      "EMC (electromagnetic compatibility) to minimize interference with data equipment",
      "Cable color must match the decor",
      "All cables must be flexible cord",
      "No additional considerations beyond normal electrical requirements"
    ],
    correctAnswer: 0,
    section: "Electrical Installations Technology",
    category: "Types of Cables",
    tags: ['application', 'application'],
    learningOutcomeId: "203-1A-LO3",
    answerType: 'mcq',
    difficulty: 5,
    estimatedTime: 90,
    explanation: "In environments with sensitive electronic equipment, electromagnetic compatibility (EMC) is crucial. Power cables may need screening or special routing to minimize electromagnetic interference with data equipment.",
    misconceptionCodes: {
      1: 'OTHER',
      2: 'OTHER',
      3: 'OTHER'
    }
  }
];
