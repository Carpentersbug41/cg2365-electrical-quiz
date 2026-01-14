import { TaggedQuestion } from './types';

/**
 * Health & Safety Legislation Question Bank
 * Aligned with lesson 201-1A learning outcomes
 * Covers purpose of legislation, HASAWA, EAWR, and employer/employee responsibilities
 */

export const healthSafetyLegislationQuestions: TaggedQuestion[] = [
  // ===== EASY QUESTIONS (Difficulty 1-2) =====
  
  {
    id: 2001,
    question: "What is the main purpose of health and safety legislation?",
    options: [
      "To protect people from harm in the workplace",
      "To increase business profits",
      "To reduce the number of employees needed",
      "To make work more difficult"
    ],
    correctAnswer: 0,
    section: "Health & Safety 2365 Level 1",
    category: "Health & Safety Legislation",
    tags: ['safety', 'conceptual'],
    learningOutcomeId: "201-1A-LO1",
    answerType: 'mcq',
    difficulty: 1,
    estimatedTime: 30,
    explanation: "The primary purpose of health and safety legislation is to protect people from harm, injury, and death in the workplace.",
    misconceptionCodes: {
      1: 'OTHER',
      2: 'OTHER',
      3: 'OTHER'
    }
  },

  {
    id: 2002,
    question: "What does HASAWA stand for?",
    options: [
      "Health and Safety at Work Act",
      "Health and Safety Advice for Workers Association",
      "Hazardous Activities and Safe Work Act",
      "Health Advice for Safe and Aware Workers"
    ],
    correctAnswer: 0,
    section: "Health & Safety 2365 Level 1",
    category: "Health & Safety Legislation",
    tags: ['safety', 'discrimination'],
    learningOutcomeId: "201-1A-LO2",
    answerType: 'mcq',
    difficulty: 1,
    estimatedTime: 30,
    explanation: "HASAWA stands for the Health and Safety at Work Act (1974), the primary UK workplace safety legislation.",
    misconceptionCodes: {
      1: 'OTHER',
      2: 'OTHER',
      3: 'OTHER'
    }
  },

  {
    id: 2003,
    question: "What does EAWR stand for?",
    options: [
      "Electricity at Work Regulations",
      "Electrical Apparatus Working Rules",
      "Emergency Action for Workplace Risks",
      "Electrical Assessment and Warning Requirements"
    ],
    correctAnswer: 0,
    section: "Health & Safety 2365 Level 1",
    category: "Health & Safety Legislation",
    tags: ['safety', 'discrimination'],
    learningOutcomeId: "201-1A-LO2",
    answerType: 'mcq',
    difficulty: 1,
    estimatedTime: 30,
    explanation: "EAWR stands for the Electricity at Work Regulations (1989), which cover electrical safety in the workplace.",
    misconceptionCodes: {
      1: 'OTHER',
      2: 'OTHER',
      3: 'OTHER'
    }
  },

  {
    id: 2004,
    question: "When were the Electricity at Work Regulations introduced?",
    options: [
      "1989",
      "1974",
      "2000",
      "1995"
    ],
    correctAnswer: 0,
    section: "Health & Safety 2365 Level 1",
    category: "Health & Safety Legislation",
    tags: ['safety', 'discrimination'],
    learningOutcomeId: "201-1A-LO2",
    answerType: 'mcq',
    difficulty: 1,
    estimatedTime: 30,
    explanation: "The Electricity at Work Regulations were introduced in 1989.",
    misconceptionCodes: {
      1: 'OTHER',
      2: 'OTHER',
      3: 'OTHER'
    }
  },

  {
    id: 2005,
    question: "According to the Electricity at Work Regulations, should work on live conductors be avoided?",
    options: [
      "Yes, wherever possible",
      "No, it's perfectly safe",
      "Only for voltages above 1000V",
      "Only on Fridays"
    ],
    correctAnswer: 0,
    section: "Health & Safety 2365 Level 1",
    category: "Health & Safety Legislation",
    tags: ['safety', 'conceptual'],
    learningOutcomeId: "201-1A-LO2",
    answerType: 'mcq',
    difficulty: 1,
    estimatedTime: 30,
    explanation: "Regulation 14 states that work on live conductors should be avoided wherever possible. Live working should only be done if it's unreasonable to make the system dead.",
    misconceptionCodes: {
      1: 'OTHER',
      2: 'OTHER',
      3: 'OTHER'
    }
  },

  {
    id: 2006,
    question: "Who is responsible for providing a safe workplace?",
    options: [
      "The employer",
      "The employee",
      "The government",
      "No one — it's optional"
    ],
    correctAnswer: 0,
    section: "Health & Safety 2365 Level 1",
    category: "Health & Safety Legislation",
    tags: ['safety', 'conceptual', 'application'],
    learningOutcomeId: "201-1A-LO3",
    answerType: 'mcq',
    difficulty: 1,
    estimatedTime: 30,
    explanation: "Employers have a legal duty under the Health and Safety at Work Act to provide a safe workplace for their employees.",
    misconceptionCodes: {
      1: 'OTHER',
      2: 'OTHER',
      3: 'OTHER'
    }
  },

  {
    id: 2007,
    question: "What must an employee do if they discover a hazard at work?",
    options: [
      "Report it to their employer",
      "Ignore it — it's not their responsibility",
      "Fix it themselves without telling anyone",
      "Only report it if someone gets injured"
    ],
    correctAnswer: 0,
    section: "Health & Safety 2365 Level 1",
    category: "Health & Safety Legislation",
    tags: ['safety', 'conceptual', 'application'],
    learningOutcomeId: "201-1A-LO3",
    answerType: 'mcq',
    difficulty: 1,
    estimatedTime: 30,
    explanation: "Employees have a duty to report hazards and defects to their employer. This helps prevent accidents before they occur.",
    misconceptionCodes: {
      1: 'OTHER',
      2: 'OTHER',
      3: 'OTHER'
    }
  },

  {
    id: 2008,
    question: "Who must provide training for employees to work safely?",
    options: [
      "The employer",
      "The employee must train themselves",
      "The local council",
      "Training is optional"
    ],
    correctAnswer: 0,
    section: "Health & Safety 2365 Level 1",
    category: "Health & Safety Legislation",
    tags: ['safety', 'conceptual', 'application'],
    learningOutcomeId: "201-1A-LO3",
    answerType: 'mcq',
    difficulty: 1,
    estimatedTime: 30,
    explanation: "Employers must provide information, instruction, training, and supervision to enable employees to work safely.",
    misconceptionCodes: {
      1: 'OTHER',
      2: 'OTHER',
      3: 'OTHER'
    }
  },

  {
    id: 2009,
    question: "What does PPE stand for?",
    options: [
      "Personal Protective Equipment",
      "Professional Power Engineering",
      "Practical Protection Essentials",
      "Personal Power Equipment"
    ],
    correctAnswer: 0,
    section: "Health & Safety 2365 Level 1",
    category: "Health & Safety Legislation",
    tags: ['safety', 'discrimination'],
    learningOutcomeId: "201-1A-LO3",
    answerType: 'mcq',
    difficulty: 1,
    estimatedTime: 30,
    explanation: "PPE stands for Personal Protective Equipment, such as safety boots, gloves, hard hats, and safety glasses.",
    misconceptionCodes: {
      1: 'OTHER',
      2: 'OTHER',
      3: 'OTHER'
    }
  },

  {
    id: 2010,
    question: "Who must provide PPE (Personal Protective Equipment) when it is needed?",
    options: [
      "The employer",
      "The employee must buy their own",
      "The government",
      "No one — PPE is optional"
    ],
    correctAnswer: 0,
    section: "Health & Safety 2365 Level 1",
    category: "Health & Safety Legislation",
    tags: ['safety', 'conceptual', 'application'],
    learningOutcomeId: "201-1A-LO3",
    answerType: 'mcq',
    difficulty: 1,
    estimatedTime: 30,
    explanation: "Employers must provide suitable PPE free of charge when risks cannot be adequately controlled by other means.",
    misconceptionCodes: {
      1: 'OTHER',
      2: 'OTHER',
      3: 'OTHER'
    }
  },

  {
    id: 2011,
    question: "What must employees do with the PPE provided to them?",
    options: [
      "Use it correctly",
      "Leave it in the van",
      "Sell it to other workers",
      "Only use it when the boss is watching"
    ],
    correctAnswer: 0,
    section: "Health & Safety 2365 Level 1",
    category: "Health & Safety Legislation",
    tags: ['safety', 'conceptual', 'application'],
    learningOutcomeId: "201-1A-LO3",
    answerType: 'mcq',
    difficulty: 1,
    estimatedTime: 30,
    explanation: "Employees must use PPE correctly as instructed. It's a legal duty to cooperate with safety arrangements.",
    misconceptionCodes: {
      1: 'OTHER',
      2: 'OTHER',
      3: 'OTHER'
    }
  },

  {
    id: 2012,
    question: "What does 'competent person' mean in the context of electrical work?",
    options: [
      "Someone with sufficient training, experience, and knowledge to work safely",
      "Anyone who thinks they can do the job",
      "Anyone over 18 years old",
      "Someone who owns a set of tools"
    ],
    correctAnswer: 0,
    section: "Health & Safety 2365 Level 1",
    category: "Health & Safety Legislation",
    tags: ['safety', 'conceptual'],
    learningOutcomeId: "201-1A-LO2",
    answerType: 'mcq',
    difficulty: 1,
    estimatedTime: 30,
    explanation: "A competent person has sufficient training, experience, knowledge, and other qualities to enable them to perform a specific task safely.",
    misconceptionCodes: {
      1: 'OTHER',
      2: 'OTHER',
      3: 'OTHER'
    }
  },

  {
    id: 2013,
    question: "Are health and safety regulations optional?",
    options: [
      "No, they are legal requirements",
      "Yes, they are just guidelines",
      "Only in large companies",
      "Only for dangerous industries"
    ],
    correctAnswer: 0,
    section: "Health & Safety 2365 Level 1",
    category: "Health & Safety Legislation",
    tags: ['safety', 'conceptual'],
    learningOutcomeId: "201-1A-LO1",
    answerType: 'mcq',
    difficulty: 1,
    estimatedTime: 30,
    explanation: "Health and safety regulations are not optional — they are legal requirements. Breaking them can result in prosecution.",
    misconceptionCodes: {
      1: 'OTHER',
      2: 'OTHER',
      3: 'OTHER'
    }
  },

  {
    id: 2014,
    question: "Can employees be prosecuted for breaking health and safety regulations?",
    options: [
      "Yes, both employers and employees can be prosecuted",
      "No, only employers can be prosecuted",
      "No, health and safety laws don't apply to employees",
      "Yes, but only if someone is injured"
    ],
    correctAnswer: 0,
    section: "Health & Safety 2365 Level 1",
    category: "Health & Safety Legislation",
    tags: ['safety', 'conceptual'],
    learningOutcomeId: "201-1A-LO3",
    answerType: 'mcq',
    difficulty: 2,
    estimatedTime: 30,
    explanation: "Both employers and employees have legal duties. Employees can be prosecuted for serious breaches, such as deliberately ignoring safety procedures.",
    misconceptionCodes: {
      1: 'OTHER',
      2: 'OTHER',
      3: 'OTHER'
    }
  },

  {
    id: 2015,
    question: "What is the primary legislation covering workplace health and safety in the UK?",
    options: [
      "Health and Safety at Work Act",
      "Electricity at Work Regulations",
      "Building Regulations",
      "Employment Rights Act"
    ],
    correctAnswer: 0,
    section: "Health & Safety 2365 Level 1",
    category: "Health & Safety Legislation",
    tags: ['safety', 'discrimination'],
    learningOutcomeId: "201-1A-LO2",
    answerType: 'mcq',
    difficulty: 1,
    estimatedTime: 30,
    explanation: "The Health and Safety at Work Act (1974) is the primary legislation covering workplace health and safety in the UK.",
    misconceptionCodes: {
      1: 'OTHER',
      2: 'OTHER',
      3: 'OTHER'
    }
  },

  // ===== MEDIUM QUESTIONS (Difficulty 2-3) =====

  {
    id: 2016,
    question: "What does 'so far as is reasonably practicable' mean in health and safety law?",
    options: [
      "Safety measures should be implemented unless the cost is grossly disproportionate to the risk",
      "Safety measures are optional if they're too expensive",
      "All safety measures must be implemented regardless of cost",
      "Safety measures only need to be considered if there's been an accident"
    ],
    correctAnswer: 0,
    section: "Health & Safety 2365 Level 1",
    category: "Health & Safety Legislation",
    tags: ['safety', 'conceptual'],
    learningOutcomeId: "201-1A-LO2",
    answerType: 'mcq',
    difficulty: 2,
    estimatedTime: 45,
    explanation: "'Reasonably practicable' means you must do everything reasonable to ensure safety, unless the cost is grossly disproportionate to the risk reduction achieved.",
    misconceptionCodes: {
      1: 'OTHER',
      2: 'OTHER',
      3: 'OTHER'
    }
  },

  {
    id: 2017,
    question: "Which regulation specifically requires that only competent persons work on electrical systems?",
    options: [
      "Regulation 16 of the Electricity at Work Regulations",
      "Regulation 5 of the Health and Safety at Work Act",
      "Regulation 12 of the Building Regulations",
      "Regulation 3 of the Employment Act"
    ],
    correctAnswer: 0,
    section: "Health & Safety 2365 Level 1",
    category: "Health & Safety Legislation",
    tags: ['safety', 'conceptual'],
    learningOutcomeId: "201-1A-LO2",
    answerType: 'mcq',
    difficulty: 2,
    estimatedTime: 45,
    explanation: "Regulation 16 of the Electricity at Work Regulations states that no person shall work on electrical systems unless they are competent to do so.",
    misconceptionCodes: {
      1: 'OTHER',
      2: 'OTHER',
      3: 'OTHER'
    }
  },

  {
    id: 2018,
    question: "Which regulation of the Electricity at Work Regulations covers work on or near live conductors?",
    options: [
      "Regulation 14",
      "Regulation 4",
      "Regulation 16",
      "Regulation 12"
    ],
    correctAnswer: 0,
    section: "Health & Safety 2365 Level 1",
    category: "Health & Safety Legislation",
    tags: ['safety', 'discrimination'],
    learningOutcomeId: "201-1A-LO2",
    answerType: 'mcq',
    difficulty: 2,
    estimatedTime: 45,
    explanation: "Regulation 14 covers work on or near live conductors, stating it should be avoided wherever possible.",
    misconceptionCodes: {
      1: 'OTHER',
      2: 'OTHER',
      3: 'OTHER'
    }
  },

  {
    id: 2019,
    question: "Under what circumstances is live electrical work permitted?",
    options: [
      "Only when it is unreasonable to make the system dead, and appropriate precautions are taken",
      "Whenever it's more convenient than isolating the supply",
      "Never — live working is always prohibited",
      "Only for voltages below 50V"
    ],
    correctAnswer: 0,
    section: "Health & Safety 2365 Level 1",
    category: "Health & Safety Legislation",
    tags: ['safety', 'conceptual', 'application'],
    learningOutcomeId: "201-1A-LO2",
    answerType: 'mcq',
    difficulty: 2,
    estimatedTime: 60,
    explanation: "Live working is only permitted when it's unreasonable to make the system dead (e.g., testing or fault-finding where isolation would defeat the purpose), and only with appropriate precautions.",
    misconceptionCodes: {
      1: 'OTHER',
      2: 'OTHER',
      3: 'OTHER'
    }
  },

  {
    id: 2020,
    question: "An apprentice has been taught basic wiring but has not been trained in safe isolation procedures. Can they work on an electrical installation?",
    options: [
      "No, they are not yet competent to work safely without supervision",
      "Yes, because they know basic wiring",
      "Yes, as long as they are over 18",
      "Yes, but only on lighting circuits"
    ],
    correctAnswer: 0,
    section: "Health & Safety 2365 Level 1",
    category: "Health & Safety Legislation",
    tags: ['safety', 'application'],
    learningOutcomeId: "201-1A-LO3",
    answerType: 'mcq',
    difficulty: 2,
    estimatedTime: 60,
    explanation: "Competence includes knowledge of safe working procedures. Without training in safe isolation, the apprentice is not competent to work unsupervised.",
    misconceptionCodes: {
      1: 'OTHER',
      2: 'OTHER',
      3: 'OTHER'
    }
  },

  {
    id: 2021,
    question: "What must an employer do before asking an employee to perform a potentially hazardous task?",
    options: [
      "Conduct a risk assessment and provide appropriate training and equipment",
      "Just tell them to be careful",
      "Provide them with a phone number for emergency services",
      "Nothing — it's the employee's responsibility to assess risks"
    ],
    correctAnswer: 0,
    section: "Health & Safety 2365 Level 1",
    category: "Health & Safety Legislation",
    tags: ['safety', 'conceptual', 'application'],
    learningOutcomeId: "201-1A-LO3",
    answerType: 'mcq',
    difficulty: 2,
    estimatedTime: 60,
    explanation: "Employers must conduct risk assessments, provide appropriate training, equipment, and supervision for potentially hazardous tasks.",
    misconceptionCodes: {
      1: 'OTHER',
      2: 'OTHER',
      3: 'OTHER'
    }
  },

  {
    id: 2022,
    question: "An employee notices a power tool has a damaged cable. What should they do?",
    options: [
      "Stop using the tool immediately and report it to their supervisor",
      "Continue using it carefully",
      "Wrap the damaged part in electrical tape and carry on",
      "Only report it if they get a shock"
    ],
    correctAnswer: 0,
    section: "Health & Safety 2365 Level 1",
    category: "Health & Safety Legislation",
    tags: ['safety', 'application'],
    learningOutcomeId: "201-1A-LO3",
    answerType: 'mcq',
    difficulty: 2,
    estimatedTime: 45,
    explanation: "Employees must report hazards and defects, and must not use equipment they know to be faulty. Stop work and report it immediately.",
    misconceptionCodes: {
      1: 'OTHER',
      2: 'OTHER',
      3: 'OTHER'
    }
  },

  {
    id: 2023,
    question: "Who is responsible for maintaining electrical systems in the workplace?",
    options: [
      "The employer",
      "Each individual employee",
      "The building owner only",
      "Electrical systems don't require maintenance"
    ],
    correctAnswer: 0,
    section: "Health & Safety 2365 Level 1",
    category: "Health & Safety Legislation",
    tags: ['safety', 'conceptual', 'application'],
    learningOutcomeId: "201-1A-LO3",
    answerType: 'mcq',
    difficulty: 2,
    estimatedTime: 45,
    explanation: "Regulation 4 of the Electricity at Work Regulations requires employers to ensure electrical systems are maintained to prevent danger.",
    misconceptionCodes: {
      1: 'OTHER',
      2: 'OTHER',
      3: 'OTHER'
    }
  },

  {
    id: 2024,
    question: "What should an employee do if they are asked to perform electrical work they are not trained for?",
    options: [
      "Politely refuse and explain they are not competent for that task",
      "Do their best and hope nothing goes wrong",
      "Do it without telling anyone",
      "Complain but do it anyway"
    ],
    correctAnswer: 0,
    section: "Health & Safety 2365 Level 1",
    category: "Health & Safety Legislation",
    tags: ['safety', 'application'],
    learningOutcomeId: "201-1A-LO3",
    answerType: 'mcq',
    difficulty: 2,
    estimatedTime: 60,
    explanation: "Employees must take reasonable care for their own safety. If they are not competent for a task, they must refuse and explain why.",
    misconceptionCodes: {
      1: 'OTHER',
      2: 'OTHER',
      3: 'OTHER'
    }
  },

  {
    id: 2025,
    question: "Which regulation of the Electricity at Work Regulations covers the construction and maintenance of electrical systems?",
    options: [
      "Regulation 4",
      "Regulation 14",
      "Regulation 16",
      "Regulation 20"
    ],
    correctAnswer: 0,
    section: "Health & Safety 2365 Level 1",
    category: "Health & Safety Legislation",
    tags: ['safety', 'discrimination'],
    learningOutcomeId: "201-1A-LO2",
    answerType: 'mcq',
    difficulty: 2,
    estimatedTime: 45,
    explanation: "Regulation 4 requires that all electrical systems are constructed and maintained to prevent danger.",
    misconceptionCodes: {
      1: 'OTHER',
      2: 'OTHER',
      3: 'OTHER'
    }
  },

  {
    id: 2026,
    question: "When must an employer have a written health and safety policy?",
    options: [
      "If they have 5 or more employees",
      "If they have 50 or more employees",
      "Only if they work with electricity",
      "Written policies are not required"
    ],
    correctAnswer: 0,
    section: "Health & Safety 2365 Level 1",
    category: "Health & Safety Legislation",
    tags: ['safety', 'conceptual'],
    learningOutcomeId: "201-1A-LO3",
    answerType: 'mcq',
    difficulty: 2,
    estimatedTime: 45,
    explanation: "Under the Health and Safety at Work Act, employers with 5 or more employees must have a written health and safety policy.",
    misconceptionCodes: {
      1: 'OTHER',
      2: 'OTHER',
      3: 'OTHER'
    }
  },

  {
    id: 2027,
    question: "What type of electrical work typically requires live working?",
    options: [
      "Testing and fault-finding where isolation would prevent the test",
      "Installing new sockets",
      "Replacing light switches",
      "Wiring a new circuit"
    ],
    correctAnswer: 0,
    section: "Health & Safety 2365 Level 1",
    category: "Health & Safety Legislation",
    tags: ['safety', 'conceptual', 'application'],
    learningOutcomeId: "201-1A-LO2",
    answerType: 'mcq',
    difficulty: 2,
    estimatedTime: 60,
    explanation: "Live working may be necessary for testing or fault-finding where isolation would defeat the purpose of the work. Installation work should always be done on dead circuits.",
    misconceptionCodes: {
      1: 'OTHER',
      2: 'OTHER',
      3: 'OTHER'
    }
  },

  {
    id: 2028,
    question: "Which of these is an employer responsibility?",
    options: [
      "Conducting risk assessments",
      "Using equipment properly",
      "Reporting hazards",
      "Taking reasonable care for their own safety"
    ],
    correctAnswer: 0,
    section: "Health & Safety 2365 Level 1",
    category: "Health & Safety Legislation",
    tags: ['safety', 'conceptual', 'discrimination'],
    learningOutcomeId: "201-1A-LO3",
    answerType: 'mcq',
    difficulty: 2,
    estimatedTime: 45,
    explanation: "Conducting risk assessments is an employer responsibility. The other options are employee responsibilities.",
    misconceptionCodes: {
      1: 'OTHER',
      2: 'OTHER',
      3: 'OTHER'
    }
  },

  {
    id: 2029,
    question: "Which of these is an employee responsibility?",
    options: [
      "Cooperating with the employer on safety matters",
      "Providing PPE",
      "Conducting risk assessments",
      "Providing training"
    ],
    correctAnswer: 0,
    section: "Health & Safety 2365 Level 1",
    category: "Health & Safety Legislation",
    tags: ['safety', 'conceptual', 'discrimination'],
    learningOutcomeId: "201-1A-LO3",
    answerType: 'mcq',
    difficulty: 2,
    estimatedTime: 45,
    explanation: "Cooperating with the employer on safety matters is an employee responsibility. The other options are employer responsibilities.",
    misconceptionCodes: {
      1: 'OTHER',
      2: 'OTHER',
      3: 'OTHER'
    }
  },

  {
    id: 2030,
    question: "Why does specific legislation exist for electrical work (EAWR) in addition to general workplace safety laws (HASAWA)?",
    options: [
      "Because electricity presents unique hazards that require specific controls",
      "Because electricians didn't want to follow general safety laws",
      "Because the HASAWA doesn't apply to electrical work",
      "Because electrical work is not covered by any other legislation"
    ],
    correctAnswer: 0,
    section: "Health & Safety 2365 Level 1",
    category: "Health & Safety Legislation",
    tags: ['safety', 'conceptual'],
    learningOutcomeId: "201-1A-LO1",
    answerType: 'mcq',
    difficulty: 2,
    estimatedTime: 60,
    explanation: "Electricity presents unique hazards (shock, burns, fire) that are often invisible. Specific regulations ensure electrical work is carried out safely.",
    misconceptionCodes: {
      1: 'OTHER',
      2: 'OTHER',
      3: 'OTHER'
    }
  },

  {
    id: 2031,
    question: "A worker removes a machine guard because it slows down their work. Have they broken any regulations?",
    options: [
      "Yes, employees must not interfere with or misuse safety equipment",
      "No, they can remove guards if it improves productivity",
      "No, only the employer is responsible for guards",
      "Yes, but only if they cause an accident"
    ],
    correctAnswer: 0,
    section: "Health & Safety 2365 Level 1",
    category: "Health & Safety Legislation",
    tags: ['safety', 'application'],
    learningOutcomeId: "201-1A-LO3",
    answerType: 'mcq',
    difficulty: 2,
    estimatedTime: 60,
    explanation: "Employees have a legal duty not to interfere with or misuse safety equipment. Removing a guard is a breach of this duty.",
    misconceptionCodes: {
      1: 'OTHER',
      2: 'OTHER',
      3: 'OTHER'
    }
  },

  {
    id: 2032,
    question: "What must electrical systems be maintained to prevent, according to Regulation 4 of EAWR?",
    options: [
      "Danger",
      "Wear and tear",
      "Corrosion",
      "Obsolescence"
    ],
    correctAnswer: 0,
    section: "Health & Safety 2365 Level 1",
    category: "Health & Safety Legislation",
    tags: ['safety', 'conceptual'],
    learningOutcomeId: "201-1A-LO2",
    answerType: 'mcq',
    difficulty: 2,
    estimatedTime: 45,
    explanation: "Regulation 4 states that electrical systems must be maintained to prevent danger. While preventing wear, corrosion, and obsolescence may be good practice, the legal requirement is to prevent danger.",
    misconceptionCodes: {
      1: 'OTHER',
      2: 'OTHER',
      3: 'OTHER'
    }
  },

  {
    id: 2033,
    question: "An employer asks an employee to work in unsafe conditions. What should the employee do?",
    options: [
      "Refuse the unsafe work and report it",
      "Do the work to avoid conflict",
      "Do the work but complain afterwards",
      "Quit their job immediately"
    ],
    correctAnswer: 0,
    section: "Health & Safety 2365 Level 1",
    category: "Health & Safety Legislation",
    tags: ['safety', 'application'],
    learningOutcomeId: "201-1A-LO3",
    answerType: 'mcq',
    difficulty: 2,
    estimatedTime: 60,
    explanation: "Employees have the right to refuse unsafe work. They must take reasonable care for their own safety and report unsafe conditions.",
    misconceptionCodes: {
      1: 'OTHER',
      2: 'OTHER',
      3: 'OTHER'
    }
  },

  {
    id: 2034,
    question: "What three qualities must a 'competent person' have to work on electrical systems?",
    options: [
      "Training, knowledge, and experience",
      "Age, strength, and speed",
      "Tools, transport, and time",
      "Confidence, courage, and creativity"
    ],
    correctAnswer: 0,
    section: "Health & Safety 2365 Level 1",
    category: "Health & Safety Legislation",
    tags: ['safety', 'conceptual'],
    learningOutcomeId: "201-1A-LO2",
    answerType: 'mcq',
    difficulty: 2,
    estimatedTime: 45,
    explanation: "A competent person must have sufficient training, knowledge, experience, and other qualities to perform a task safely.",
    misconceptionCodes: {
      1: 'OTHER',
      2: 'OTHER',
      3: 'OTHER'
    }
  },

  {
    id: 2035,
    question: "Can an employer avoid providing PPE by asking employees to bring their own?",
    options: [
      "No, employers must provide PPE free of charge when it is needed",
      "Yes, employees should buy their own PPE",
      "Yes, if they reimburse employees for the cost",
      "Yes, as long as they tell employees where to buy it"
    ],
    correctAnswer: 0,
    section: "Health & Safety 2365 Level 1",
    category: "Health & Safety Legislation",
    tags: ['safety', 'conceptual', 'application'],
    learningOutcomeId: "201-1A-LO3",
    answerType: 'mcq',
    difficulty: 2,
    estimatedTime: 60,
    explanation: "Employers have a legal duty to provide suitable PPE free of charge. They cannot pass this cost to employees.",
    misconceptionCodes: {
      1: 'OTHER',
      2: 'OTHER',
      3: 'OTHER'
    }
  },

  {
    id: 2036,
    question: "Under the Electricity at Work Regulations, what must be provided for every circuit?",
    options: [
      "Means of isolation",
      "A guarantee certificate",
      "A circuit diagram",
      "An instruction manual"
    ],
    correctAnswer: 0,
    section: "Health & Safety 2365 Level 1",
    category: "Health & Safety Legislation",
    tags: ['safety', 'conceptual'],
    learningOutcomeId: "201-1A-LO2",
    answerType: 'mcq',
    difficulty: 2,
    estimatedTime: 45,
    explanation: "Regulation 12 requires that means of isolation must be provided for every circuit to allow safe working.",
    misconceptionCodes: {
      1: 'OTHER',
      2: 'OTHER',
      3: 'OTHER'
    }
  },

  {
    id: 2037,
    question: "What is the consequence of breaking health and safety regulations?",
    options: [
      "Prosecution, fines, or imprisonment for serious breaches",
      "A verbal warning only",
      "Nothing — regulations are just guidelines",
      "A letter of apology"
    ],
    correctAnswer: 0,
    section: "Health & Safety 2365 Level 1",
    category: "Health & Safety Legislation",
    tags: ['safety', 'conceptual'],
    learningOutcomeId: "201-1A-LO1",
    answerType: 'mcq',
    difficulty: 2,
    estimatedTime: 45,
    explanation: "Health and safety regulations are legal requirements. Serious breaches can result in prosecution, fines, or even imprisonment.",
    misconceptionCodes: {
      1: 'OTHER',
      2: 'OTHER',
      3: 'OTHER'
    }
  },

  {
    id: 2038,
    question: "What must employers do if 5 or more people are employed?",
    options: [
      "Have a written health and safety policy",
      "Register with the Health and Safety Executive",
      "Hire a dedicated safety officer",
      "Conduct monthly safety inspections"
    ],
    correctAnswer: 0,
    section: "Health & Safety 2365 Level 1",
    category: "Health & Safety Legislation",
    tags: ['safety', 'conceptual'],
    learningOutcomeId: "201-1A-LO3",
    answerType: 'mcq',
    difficulty: 2,
    estimatedTime: 45,
    explanation: "Employers with 5 or more employees must have a written health and safety policy under the Health and Safety at Work Act.",
    misconceptionCodes: {
      1: 'OTHER',
      2: 'OTHER',
      3: 'OTHER'
    }
  },

  {
    id: 2039,
    question: "Who can be held responsible if an accident occurs due to unsafe working practices?",
    options: [
      "Both the employer and the employee, depending on the circumstances",
      "Only the employer",
      "Only the employee",
      "No one — accidents just happen"
    ],
    correctAnswer: 0,
    section: "Health & Safety 2365 Level 1",
    category: "Health & Safety Legislation",
    tags: ['safety', 'conceptual', 'application'],
    learningOutcomeId: "201-1A-LO3",
    answerType: 'mcq',
    difficulty: 2,
    estimatedTime: 60,
    explanation: "Both employers and employees have legal duties. Responsibility depends on whether proper training was provided, procedures were followed, etc.",
    misconceptionCodes: {
      1: 'OTHER',
      2: 'OTHER',
      3: 'OTHER'
    }
  },

  {
    id: 2040,
    question: "A new employee is unsure how to safely use a piece of electrical test equipment. What should they do?",
    options: [
      "Ask for training before using the equipment",
      "Watch a YouTube video and then use it",
      "Try to figure it out themselves",
      "Use it carefully and hope for the best"
    ],
    correctAnswer: 0,
    section: "Health & Safety 2365 Level 1",
    category: "Health & Safety Legislation",
    tags: ['safety', 'application'],
    learningOutcomeId: "201-1A-LO3",
    answerType: 'mcq',
    difficulty: 2,
    estimatedTime: 60,
    explanation: "Employees must not use equipment they are not trained to use safely. They should request proper training from their employer.",
    misconceptionCodes: {
      1: 'OTHER',
      2: 'OTHER',
      3: 'OTHER'
    }
  },

  // ===== HARD QUESTIONS (Difficulty 4-5) =====

  {
    id: 2041,
    question: "A contractor arrives on site claiming to be an electrician. They have tools but no qualifications or proof of competence. Can they legally work on the electrical installation?",
    options: [
      "No, they cannot demonstrate competence as required by Regulation 16",
      "Yes, if they say they have experience",
      "Yes, if they have the right tools",
      "Yes, as long as they're supervised"
    ],
    correctAnswer: 0,
    section: "Health & Safety 2365 Level 1",
    category: "Health & Safety Legislation",
    tags: ['safety', 'application'],
    learningOutcomeId: "201-1A-LO2",
    answerType: 'mcq',
    difficulty: 4,
    estimatedTime: 90,
    explanation: "Regulation 16 requires persons to be competent before working on electrical systems. Competence must be demonstrable through qualifications, training records, or documented experience.",
    misconceptionCodes: {
      1: 'OTHER',
      2: 'OTHER',
      3: 'OTHER'
    }
  },

  {
    id: 2042,
    question: "An employer provides safety training but an employee deliberately ignores the procedures and causes an accident. Who can be prosecuted?",
    options: [
      "The employee can be prosecuted for deliberately ignoring safety procedures",
      "Only the employer for not supervising properly",
      "No one — it was an accident",
      "The training provider"
    ],
    correctAnswer: 0,
    section: "Health & Safety 2365 Level 1",
    category: "Health & Safety Legislation",
    tags: ['safety', 'application'],
    learningOutcomeId: "201-1A-LO3",
    answerType: 'mcq',
    difficulty: 4,
    estimatedTime: 90,
    explanation: "Employees have a legal duty to follow safety procedures. Deliberately ignoring procedures after proper training is a breach of the employee's duties and can result in prosecution.",
    misconceptionCodes: {
      1: 'OTHER',
      2: 'OTHER',
      3: 'OTHER'
    }
  },

  {
    id: 2043,
    question: "A fault-finding task requires testing a circuit while it is energized. What conditions must be met before this work can be carried out?",
    options: [
      "It must be unreasonable to isolate, the person must be competent, and appropriate precautions must be taken",
      "Just wear rubber gloves",
      "Get permission from the building owner",
      "Turn off nearby circuits only"
    ],
    correctAnswer: 0,
    section: "Health & Safety 2365 Level 1",
    category: "Health & Safety Legislation",
    tags: ['safety', 'application'],
    learningOutcomeId: "201-1A-LO2",
    answerType: 'mcq',
    difficulty: 4,
    estimatedTime: 90,
    explanation: "Regulation 14 allows live working only when: (1) it's unreasonable to make dead, (2) the person is competent, and (3) appropriate precautions are taken (insulated tools, barriers, etc.).",
    misconceptionCodes: {
      1: 'OTHER',
      2: 'OTHER',
      3: 'OTHER'
    }
  },

  {
    id: 2044,
    question: "An employer claims a safety measure is 'too expensive' under the 'reasonably practicable' principle. Under what circumstances would this be acceptable?",
    options: [
      "Only if the cost is grossly disproportionate to the very small risk reduction achieved",
      "Whenever the employer says so",
      "If it costs more than £1000",
      "If it would delay the project"
    ],
    correctAnswer: 0,
    section: "Health & Safety 2365 Level 1",
    category: "Health & Safety Legislation",
    tags: ['safety', 'conceptual', 'application'],
    learningOutcomeId: "201-1A-LO2",
    answerType: 'mcq',
    difficulty: 4,
    estimatedTime: 90,
    explanation: "'Reasonably practicable' has a specific legal meaning: measures must be taken unless the cost is grossly disproportionate to the risk. The burden of proof is on the employer.",
    misconceptionCodes: {
      1: 'OTHER',
      2: 'OTHER',
      3: 'OTHER'
    }
  },

  {
    id: 2045,
    question: "A qualified electrician is asked to work on a specialized industrial system they have never seen before. Are they competent to work on it?",
    options: [
      "Not necessarily — competence is task-specific and they may need additional training or supervision",
      "Yes, if they're qualified they can work on anything",
      "Yes, as long as they have general electrical qualifications",
      "No, they need a different qualification for each system"
    ],
    correctAnswer: 0,
    section: "Health & Safety 2365 Level 1",
    category: "Health & Safety Legislation",
    tags: ['safety', 'conceptual', 'application'],
    learningOutcomeId: "201-1A-LO2",
    answerType: 'mcq',
    difficulty: 4,
    estimatedTime: 90,
    explanation: "Competence is task-specific. A qualified electrician may still need additional training, instruction, or supervision for unfamiliar or specialized systems.",
    misconceptionCodes: {
      1: 'OTHER',
      2: 'OTHER',
      3: 'OTHER'
    }
  },

  {
    id: 2046,
    question: "An employer conducts a risk assessment and concludes a particular electrical task presents minimal risk. Do they still need to follow the Electricity at Work Regulations?",
    options: [
      "Yes, the Electricity at Work Regulations apply to all electrical work regardless of risk level",
      "No, low-risk tasks are exempt",
      "No, risk assessments override legislation",
      "Only if the voltage is above 230V"
    ],
    correctAnswer: 0,
    section: "Health & Safety 2365 Level 1",
    category: "Health & Safety Legislation",
    tags: ['safety', 'conceptual', 'application'],
    learningOutcomeId: "201-1A-LO2",
    answerType: 'mcq',
    difficulty: 4,
    estimatedTime: 90,
    explanation: "The EAWR apply to ALL electrical systems, equipment, and work activities. There is no minimum risk threshold below which regulations don't apply.",
    misconceptionCodes: {
      1: 'OTHER',
      2: 'OTHER',
      3: 'OTHER'
    }
  },

  {
    id: 2047,
    question: "A self-employed electrician works alone. Which health and safety duties apply to them?",
    options: [
      "They must ensure their own safety and the safety of others affected by their work",
      "None — self-employed people are exempt from health and safety law",
      "Only the duties of employees",
      "Only the duties of employers"
    ],
    correctAnswer: 0,
    section: "Health & Safety 2365 Level 1",
    category: "Health & Safety Legislation",
    tags: ['safety', 'conceptual', 'application'],
    learningOutcomeId: "201-1A-LO3",
    answerType: 'mcq',
    difficulty: 4,
    estimatedTime: 90,
    explanation: "Self-employed persons have duties under health and safety law. They must ensure their own safety and the safety of others who may be affected by their work.",
    misconceptionCodes: {
      1: 'OTHER',
      2: 'OTHER',
      3: 'OTHER'
    }
  },

  {
    id: 2048,
    question: "A supervisor pressures an apprentice to work faster by skipping safety checks. The apprentice complies and causes an accident. Who can be held responsible?",
    options: [
      "Both the supervisor (for creating pressure) and the apprentice (for not following procedures)",
      "Only the apprentice",
      "Only the supervisor",
      "No one — it was an accident"
    ],
    correctAnswer: 0,
    section: "Health & Safety 2365 Level 1",
    category: "Health & Safety Legislation",
    tags: ['safety', 'application'],
    learningOutcomeId: "201-1A-LO3",
    answerType: 'mcq',
    difficulty: 5,
    estimatedTime: 90,
    explanation: "Both parties have failed in their duties. The supervisor created unsafe pressure; the apprentice failed to follow procedures. Both can be held responsible in this scenario.",
    misconceptionCodes: {
      1: 'OTHER',
      2: 'OTHER',
      3: 'OTHER'
    }
  },

  {
    id: 2049,
    question: "Why is 'competence' for electrical work assessed on a task-by-task basis rather than as a general qualification?",
    options: [
      "Because electrical work varies greatly in complexity and risk, and experience in one area doesn't guarantee competence in another",
      "Because the regulations are poorly written",
      "Because qualifications expire",
      "Because different voltages require different qualifications"
    ],
    correctAnswer: 0,
    section: "Health & Safety 2365 Level 1",
    category: "Health & Safety Legislation",
    tags: ['safety', 'conceptual'],
    learningOutcomeId: "201-1A-LO2",
    answerType: 'mcq',
    difficulty: 4,
    estimatedTime: 90,
    explanation: "Electrical work ranges from simple tasks to highly complex systems. Competence must match the task: someone competent to wire a plug may not be competent to work on high-voltage systems.",
    misconceptionCodes: {
      1: 'OTHER',
      2: 'OTHER',
      3: 'OTHER'
    }
  },

  {
    id: 2050,
    question: "An electrical system is known to be dangerous but would cost £100,000 to make safe. The company has limited funds. What must the employer do under 'reasonably practicable'?",
    options: [
      "Implement the safety measures — serious risks must be controlled regardless of cost",
      "Do nothing — the cost is too high",
      "Wait until they have more money",
      "Put up warning signs instead"
    ],
    correctAnswer: 0,
    section: "Health & Safety 2365 Level 1",
    category: "Health & Safety Legislation",
    tags: ['safety', 'conceptual', 'application'],
    learningOutcomeId: "201-1A-LO2",
    answerType: 'mcq',
    difficulty: 5,
    estimatedTime: 90,
    explanation: "For serious risks, even high costs may not be 'grossly disproportionate'. Employers cannot use cost as an excuse for not controlling serious hazards. Alternative controls or ceasing the activity may be required.",
    misconceptionCodes: {
      1: 'OTHER',
      2: 'OTHER',
      3: 'OTHER'
    }
  }
];
