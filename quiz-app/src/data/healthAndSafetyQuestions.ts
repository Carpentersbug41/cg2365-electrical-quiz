import { Question } from './questions';

export const healthAndSafetyQuestions: Question[] = [
  {
    id: 1,
    question: "What is the maximum voltage allowed for extra-low voltage systems?",
    options: ["50V AC", "120V AC", "230V AC", "400V AC"],
    correctAnswer: 0,
    category: "Basic Electrical Safety",
    section: "Health and Safety"
  },
  {
    id: 2,
    question: "What does PPE stand for?",
    options: ["Personal Protection Equipment", "Personal Protective Equipment", "Professional Protection Equipment", "Protective Personal Equipment"],
    correctAnswer: 1,
    category: "Safety Equipment",
    section: "Health and Safety"
  },
  {
    id: 3,
    question: "What is the purpose of a Residual Current Device (RCD)?",
    options: ["To control lighting", "To protect against electric shock", "To reduce voltage", "To increase current"],
    correctAnswer: 1,
    category: "Protection Devices",
    section: "Health and Safety"
  },
  {
    id: 4,
    question: "What is the minimum depth for cables buried underground in a wall?",
    options: ["25mm", "50mm", "75mm", "100mm"],
    correctAnswer: 1,
    category: "Installation Requirements",
    section: "Health and Safety"
  },
  {
    id: 5,
    question: "What color is the earth wire in UK electrical installations?",
    options: ["Blue", "Brown", "Green and Yellow", "Black"],
    correctAnswer: 2,
    category: "Wiring Standards",
    section: "Health and Safety"
  },
  {
    id: 6,
    question: "What is the standard voltage for single-phase domestic supply in the UK?",
    options: ["110V", "230V", "240V", "415V"],
    correctAnswer: 1,
    category: "Electrical Standards",
    section: "Health and Safety"
  },
  {
    id: 7,
    question: "What does IP rating stand for?",
    options: ["Internal Protection", "Ingress Protection", "Insulation Protection", "International Protection"],
    correctAnswer: 1,
    category: "Equipment Standards",
    section: "Health and Safety"
  },
  {
    id: 8,
    question: "What is the first action when discovering an electrical fire?",
    options: ["Use water to extinguish", "Disconnect the power supply", "Call the fire brigade only", "Open windows"],
    correctAnswer: 1,
    category: "Emergency Procedures",
    section: "Health and Safety"
  },
  {
    id: 9,
    question: "What is the maximum disconnection time for a circuit protected by an RCD in a TT system?",
    options: ["0.1 seconds", "0.2 seconds", "0.4 seconds", "5 seconds"],
    correctAnswer: 1,
    category: "Protection Standards",
    section: "Health and Safety"
  },
  {
    id: 10,
    question: "Which regulation covers electrical installations in the UK?",
    options: ["BS 7671", "BS 7672", "BS 6701", "BS 5839"],
    correctAnswer: 0,
    category: "Regulations",
    section: "Health and Safety"
  },
  {
    id: 11,
    question: "What is the purpose of bonding in electrical installations?",
    options: ["To increase resistance", "To provide equal potential", "To reduce voltage", "To increase current flow"],
    correctAnswer: 1,
    category: "Bonding and Earthing",
    section: "Health and Safety"
  },
  {
    id: 12,
    question: "What type of circuit breaker is used for arc fault protection?",
    options: ["MCB", "RCBO", "AFDD", "RCD"],
    correctAnswer: 2,
    category: "Protection Devices",
    section: "Health and Safety"
  },
  {
    id: 13,
    question: "What is the minimum resistance value for insulation resistance test at 500V?",
    options: ["0.5 MΩ", "1.0 MΩ", "2.0 MΩ", "5.0 MΩ"],
    correctAnswer: 1,
    category: "Testing",
    section: "Health and Safety"
  },
  {
    id: 14,
    question: "Which zone in a bathroom is considered the most hazardous?",
    options: ["Zone 0", "Zone 1", "Zone 2", "Outside zones"],
    correctAnswer: 0,
    category: "Special Locations",
    section: "Health and Safety"
  },
  {
    id: 15,
    question: "What does EICR stand for?",
    options: ["Electrical Installation Certificate Report", "Electrical Inspection Condition Report", "Electrical Installation Condition Report", "Electrical Inspection Certificate Report"],
    correctAnswer: 2,
    category: "Inspection and Testing",
    section: "Health and Safety"
  },
  {
    id: 16,
    question: "What is the color code for the neutral conductor?",
    options: ["Brown", "Blue", "Green and Yellow", "Grey"],
    correctAnswer: 1,
    category: "Wiring Standards",
    section: "Health and Safety"
  },
  {
    id: 17,
    question: "What is the maximum Zs (earth fault loop impedance) for a 32A Type B MCB?",
    options: ["1.37Ω", "1.44Ω", "2.19Ω", "2.87Ω"],
    correctAnswer: 0,
    category: "Testing Standards",
    section: "Health and Safety"
  },
  {
    id: 18,
    question: "What does SELV stand for?",
    options: ["Safe Extra Low Voltage", "Separated Extra Low Voltage", "Standard Extra Low Voltage", "Secured Extra Low Voltage"],
    correctAnswer: 1,
    category: "Electrical Systems",
    section: "Health and Safety"
  },
  {
    id: 19,
    question: "How often should a commercial property have an electrical inspection?",
    options: ["Every year", "Every 3 years", "Every 5 years", "Every 10 years"],
    correctAnswer: 2,
    category: "Regulations",
    section: "Health and Safety"
  },
  {
    id: 20,
    question: "What is the purpose of a main equipotential bonding conductor?",
    options: ["To carry load current", "To connect extraneous conductive parts", "To increase voltage", "To reduce power consumption"],
    correctAnswer: 1,
    category: "Bonding and Earthing",
    section: "Health and Safety"
  },
  {
    id: 21,
    question: "What is the minimum cross-sectional area for main protective bonding conductors in most domestic installations?",
    options: ["2.5mm²", "4mm²", "6mm²", "10mm²"],
    correctAnswer: 2,
    category: "Cable Sizing",
    section: "Health and Safety"
  },
  {
    id: 22,
    question: "What does TN-C-S earthing system stand for?",
    options: ["Terra Neutral Combined Separate", "Terra Neutral Concentric Separate", "Terra Neutral Combined System", "Terra Neutral Circuit Separate"],
    correctAnswer: 0,
    category: "Earthing Systems",
    section: "Health and Safety"
  },
  {
    id: 23,
    question: "What class of fire extinguisher should be used on electrical fires?",
    options: ["Class A", "Class B", "Class C", "CO2 or Dry Powder"],
    correctAnswer: 3,
    category: "Fire Safety",
    section: "Health and Safety"
  },
  {
    id: 24,
    question: "What is the purpose of conducting a continuity test?",
    options: ["To check voltage levels", "To verify conductor connections", "To measure power consumption", "To check insulation"],
    correctAnswer: 1,
    category: "Testing",
    section: "Health and Safety"
  },
  {
    id: 25,
    question: "What is the typical rating of an RCD for socket outlets?",
    options: ["10mA", "30mA", "100mA", "300mA"],
    correctAnswer: 1,
    category: "Protection Devices",
    section: "Health and Safety"
  },
  {
    id: 26,
    question: "At what height should socket outlets be installed in new dwellings?",
    options: ["150mm", "300mm", "450mm", "600mm"],
    correctAnswer: 2,
    category: "Installation Requirements",
    section: "Health and Safety"
  },
  {
    id: 27,
    question: "What is the maximum operating temperature for PVC insulated cables?",
    options: ["50°C", "60°C", "70°C", "90°C"],
    correctAnswer: 2,
    category: "Cable Standards",
    section: "Health and Safety"
  },
  {
    id: 28,
    question: "What does the first digit of an IP rating indicate?",
    options: ["Water protection", "Solid object protection", "Temperature resistance", "Voltage rating"],
    correctAnswer: 1,
    category: "Equipment Standards",
    section: "Health and Safety"
  },
  {
    id: 29,
    question: "What is the purpose of a permit to work system?",
    options: ["To pay workers", "To control hazardous work activities", "To schedule maintenance", "To track hours worked"],
    correctAnswer: 1,
    category: "Safety Procedures",
    section: "Health and Safety"
  },
  {
    id: 30,
    question: "What is the minimum test voltage for a polarity test?",
    options: ["50V", "230V", "500V", "1000V"],
    correctAnswer: 1,
    category: "Testing",
    section: "Health and Safety"
  },
  {
    id: 31,
    question: "What does RCBO stand for?",
    options: ["Residual Current Breaker Overload", "Residual Circuit Breaker Overload", "Residual Current Breaker with Overcurrent", "Residual Circuit Breaker Output"],
    correctAnswer: 2,
    category: "Protection Devices",
    section: "Health and Safety"
  },
  {
    id: 32,
    question: "What is the maximum distance for emergency lighting escape route illumination?",
    options: ["2 meters", "3 meters", "4 meters", "5 meters"],
    correctAnswer: 0,
    category: "Emergency Systems",
    section: "Health and Safety"
  },
  {
    id: 33,
    question: "What must be done before working on electrical equipment?",
    options: ["Wear gloves only", "Isolate and lock off", "Inform supervisor only", "Use insulated tools only"],
    correctAnswer: 1,
    category: "Safe Isolation",
    section: "Health and Safety"
  },
  {
    id: 34,
    question: "What is the color of the live conductor in a three-phase system (L1)?",
    options: ["Brown", "Black", "Grey", "Blue"],
    correctAnswer: 0,
    category: "Wiring Standards",
    section: "Health and Safety"
  },
  {
    id: 35,
    question: "What is a dead test?",
    options: ["Testing with power on", "Testing without power", "Testing after installation", "Testing before installation"],
    correctAnswer: 1,
    category: "Testing Procedures",
    section: "Health and Safety"
  },
  {
    id: 36,
    question: "What is the maximum voltage drop allowed in lighting circuits?",
    options: ["2%", "3%", "5%", "10%"],
    correctAnswer: 1,
    category: "Design Standards",
    section: "Health and Safety"
  },
  {
    id: 37,
    question: "What is the purpose of supplementary bonding?",
    options: ["To increase light levels", "To provide additional equal potential", "To reduce energy costs", "To improve power factor"],
    correctAnswer: 1,
    category: "Bonding and Earthing",
    section: "Health and Safety"
  },
  {
    id: 38,
    question: "What class of equipment has reinforced insulation?",
    options: ["Class 0", "Class I", "Class II", "Class III"],
    correctAnswer: 2,
    category: "Equipment Classification",
    section: "Health and Safety"
  },
  {
    id: 39,
    question: "What is the recommended inspection frequency for construction sites?",
    options: ["Monthly", "Every 3 months", "Every 6 months", "Annually"],
    correctAnswer: 1,
    category: "Inspection Requirements",
    section: "Health and Safety"
  },
  {
    id: 40,
    question: "What is the safe isolation procedure's correct order?",
    options: ["Test, Isolate, Lock, Test", "Isolate, Test, Lock, Test", "Lock, Isolate, Test, Test", "Test, Lock, Isolate, Test"],
    correctAnswer: 1,
    category: "Safe Isolation",
    section: "Health and Safety"
  },
  {
    id: 41,
    question: "What is the purpose of a risk assessment?",
    options: ["To calculate costs", "To identify hazards and control risks", "To schedule work", "To determine pay rates"],
    correctAnswer: 1,
    category: "Health and Safety",
    section: "Health and Safety"
  },
  {
    id: 42,
    question: "What is the minimum size of earthing conductor for a TN-S system with 16mm² supply?",
    options: ["6mm²", "10mm²", "16mm²", "25mm²"],
    correctAnswer: 2,
    category: "Earthing Conductor Sizing",
    section: "Health and Safety"
  },
  {
    id: 43,
    question: "What does the Electricity at Work Regulations 1989 require?",
    options: ["All work to be done by electricians", "Electrical systems to be safe", "Annual inspections", "24/7 maintenance"],
    correctAnswer: 1,
    category: "Legal Requirements",
    section: "Health and Safety"
  },
  {
    id: 44,
    question: "What is the purpose of a Method Statement?",
    options: ["To describe how work will be done safely", "To calculate materials", "To invoice clients", "To record time spent"],
    correctAnswer: 0,
    category: "Safety Documentation",
    section: "Health and Safety"
  },
  {
    id: 45,
    question: "What is the maximum duration for emergency lighting to operate?",
    options: ["30 minutes", "1 hour", "3 hours", "6 hours"],
    correctAnswer: 2,
    category: "Emergency Systems",
    section: "Health and Safety"
  },
  {
    id: 46,
    question: "What type of cable is required in fire alarm installations?",
    options: ["Standard PVC", "Fire resistant cable", "Armoured cable", "Flexible cable"],
    correctAnswer: 1,
    category: "Fire Safety Systems",
    section: "Health and Safety"
  },
  {
    id: 47,
    question: "What is the minimum headroom clearance for overhead cables?",
    options: ["3.0m", "3.5m", "4.0m", "5.2m"],
    correctAnswer: 3,
    category: "Installation Safety",
    section: "Health and Safety"
  },
  {
    id: 48,
    question: "What must be provided with every new electrical installation?",
    options: ["A discount", "A warranty only", "An Electrical Installation Certificate", "A user manual only"],
    correctAnswer: 2,
    category: "Certification",
    section: "Health and Safety"
  },
  {
    id: 49,
    question: "What is the maximum earth fault loop impedance for a TN system at 230V?",
    options: ["It varies by protective device", "Always 1Ω", "Always 2Ω", "Always 5Ω"],
    correctAnswer: 0,
    category: "Testing Standards",
    section: "Health and Safety"
  },
  {
    id: 50,
    question: "What must be worn when working at height?",
    options: ["Only hard hat", "Appropriate PPE including harness", "Only safety boots", "Only high-visibility vest"],
    correctAnswer: 1,
    category: "Working at Height",
    section: "Health and Safety"
  },
  {
    id: 51,
    question: "What is the purpose of a first-aid kit?",
    options: ["To treat minor injuries until professional help arrives", "To replace the need for a first aider", "To be stored for inspection", "For decoration"],
    correctAnswer: 0,
    category: "First Aid",
    section: "Health and Safety"
  },

  // Added from questions.json
  {
    id: 53,
    question: "Which body can issue enforcement notices for breaches in health and safety law?",
    options: ["The local police", "The Health and Safety Executive (HSE)", "The client", "The insurance company"],
    correctAnswer: 1,
    category: "Regulations",
    section: "Health and Safety"
  },
  {
    id: 54,
    question: "What is a “hazard”?",
    options: ["The chance of something going wrong", "Anything with the potential to cause harm", "A minor inconvenience", "A safe condition"],
    correctAnswer: 1,
    category: "Risk Management",
    section: "Health and Safety"
  },
  {
    id: 52,
    question: "What is a \"risk\"?",
    options: ["Something dangerous", "The likelihood that harm will occur", "A warning sign", "A type of PPE"],
    correctAnswer: 1,
    category: "Risk Management",
    section: "Health and Safety"
  },
  {
    id: 55,
    question: "Who should sign off a risk assessment?",
    options: ["The client", "A competent person", "Any worker", "A health inspector"],
    correctAnswer: 1,
    category: "Risk Management",
    section: "Health and Safety"
  },
  {
    id: 56,
    question: "Which of these best describes a \"competent person\"?",
    options: ["Someone with training, experience, and knowledge to do the job safely", "Someone who has worked for over 10 years", "Anyone over 18", "A person with a safety certificate"],
    correctAnswer: 0,
    category: "Competency",
    section: "Health and Safety"
  },
  {
    id: 57,
    question: "What should you do if you are unsure about a safety procedure?",
    options: ["Do it your way", "Ask a competent supervisor or manager", "Guess based on experience", "Ignore it"],
    correctAnswer: 1,
    category: "Safety Procedures",
    section: "Health and Safety"
  },
  {
    id: 58,
    question: "The most common cause of accidents in construction is:",
    options: ["Electrical shock", "Slips, trips, and falls", "Vehicle accidents", "Fires"],
    correctAnswer: 1,
    category: "Accident Prevention",
    section: "Health and Safety"
  },
  {
    id: 59,
    question: "What type of fire extinguisher has a cream label?",
    options: ["Water", "Foam", "CO₂", "Dry powder"],
    correctAnswer: 1,
    category: "Fire Safety",
    section: "Health and Safety"
  },
  {
    id: 60,
    question: "What colour is the CO₂ fire extinguisher label?",
    options: ["Black", "Blue", "Red", "Yellow"],
    correctAnswer: 0,
    category: "Fire Safety",
    section: "Health and Safety"
  },
  {
    id: 61,
    question: "Which fire extinguisher should you not use on metal fires?",
    options: ["Dry powder", "CO₂", "Water", "Foam"],
    correctAnswer: 2,
    category: "Fire Safety",
    section: "Health and Safety"
  },
  {
    id: 62,
    question: "What should you do before using a power tool?",
    options: ["Check it visually and test it safely", "Assume it’s fine", "Oil it", "Switch it on and off a few times"],
    correctAnswer: 0,
    category: "Tool Safety",
    section: "Health and Safety"
  },
  {
    id: 63,
    question: "What is a “residual current device” (RCD) designed to do?",
    options: ["Measure voltage", "Protect against electric shock", "Test insulation", "Control lighting circuits"],
    correctAnswer: 1,
    category: "Protection Devices",
    section: "Health and Safety"
  },
  {
    id: 64,
    question: "Why should cables be uncoiled fully before use?",
    options: ["To avoid overheating", "To make them neater", "To reduce voltage", "To increase current"],
    correctAnswer: 0,
    category: "Electrical Safety",
    section: "Health and Safety"
  },
  {
    id: 65,
    question: "Which of the following must be displayed on a construction site?",
    options: ["Fire assembly point sign", "Daily toolbox talk sheet", "Electrical test certificate", "Tool register"],
    correctAnswer: 0,
    category: "Site Safety",
    section: "Health and Safety"
  },
  {
    id: 66,
    question: "When using an extension lead, which of the following is good practice?",
    options: ["Run it through doorways", "Keep it off the floor and untangled", "Coil it tightly", "Use a 230V reel indoors"],
    correctAnswer: 1,
    category: "Electrical Safety",
    section: "Health and Safety"
  },
  {
    id: 67,
    question: "If someone collapses from electric shock, your first action should be:",
    options: ["Pull them away from the source", "Isolate the power supply first", "Give them water", "Shout for help but do nothing"],
    correctAnswer: 1,
    category: "Emergency Procedures",
    section: "Health and Safety"
  },
  {
    id: 68,
    question: "What is the correct ratio of chest compressions to rescue breaths in CPR (adult)?",
    options: ["10:2", "15:1", "30:2", "50:5"],
    correctAnswer: 2,
    category: "First Aid",
    section: "Health and Safety"
  },
  {
    id: 69,
    question: "Which regulation controls manual handling at work?",
    options: ["Manual Handling Operations Regulations 1992", "COSHH 2002", "PUWER 1998", "RIDDOR 2013"],
    correctAnswer: 0,
    category: "Legal Requirements",
    section: "Health and Safety"
  },
  {
    id: 70,
    question: "What must be done if an accident results in a worker being off for more than 7 days?",
    options: ["Record only", "Report to HSE under RIDDOR", "Ignore it", "Tell HR"],
    correctAnswer: 1,
    category: "Accident Reporting",
    section: "Health and Safety"
  },
  {
    id: 71,
    question: "What is the maximum safe step height between rungs on a ladder?",
    options: ["250 mm", "300 mm", "350 mm", "400 mm"],
    correctAnswer: 1,
    category: "Working at Height",
    section: "Health and Safety"
  },
  {
    id: 72,
    question: "What is a “permit to dig”?",
    options: ["Permission to install electrical wiring", "A control system for excavation work to prevent hitting underground services", "A parking permit", "A site entry form"],
    correctAnswer: 1,
    category: "Permit to Work",
    section: "Health and Safety"
  },
  {
    id: 73,
    question: "What should you check before using an abrasive wheel?",
    options: ["That it fits, is undamaged, and suitable for speed and material", "Its colour", "Its brand", "That it sparks well"],
    correctAnswer: 0,
    category: "Tool Safety",
    section: "Health and Safety"
  },
  {
    id: 74,
    question: "What is one key sign of heat exhaustion?",
    options: ["Cold, clammy skin", "Very dry skin", "Loss of appetite", "Coughing"],
    correctAnswer: 0,
    category: "Health Hazards",
    section: "Health and Safety"
  },
  {
    id: 75,
    question: "What should be done after completing a risk assessment?",
    options: ["Share findings with those affected", "File it away unseen", "Destroy it", "Send it to HSE"],
    correctAnswer: 0,
    category: "Risk Management",
    section: "Health and Safety"
  },
  {
    id: 76,
    question: "Why are trailing cables a hazard?",
    options: ["They look messy", "They can cause trips and damage", "They use more energy", "They’re hard to clean"],
    correctAnswer: 1,
    category: "Electrical Safety",
    section: "Health and Safety"
  },
  {
    id: 77,
    question: "When working in a noisy environment, exposure limits are measured in:",
    options: ["dB (decibels)", "Hz (hertz)", "V (volts)", "W (watts)"],
    correctAnswer: 0,
    category: "Noise Control",
    section: "Health and Safety"
  },
  {
    id: 78,
    question: "What must be done with defective tools?",
    options: ["Label “Do Not Use” and report them", "Use carefully", "Fix with tape", "Store them in the van"],
    correctAnswer: 0,
    category: "Tool Safety",
    section: "Health and Safety"
  },
  {
    id: 79,
    question: "What is the main cause of electric shock injuries?",
    options: ["Faulty insulation or poor isolation", "Overloading circuits", "Poor lighting", "Low voltage"],
    correctAnswer: 0,
    category: "Electrical Safety",
    section: "Health and Safety"
  },
  {
    id: 80,
    question: "What is the safest way to prove a circuit is dead?",
    options: ["Use an approved voltage tester on all conductors", "Touch with insulated gloves", "Check the MCB is off", "Look for sparks"],
    correctAnswer: 0,
    category: "Safe Isolation",
    section: "Health and Safety"
  },
  {
    id: 81,
    question: "When lifting, what position should your feet be in?",
    options: ["Together", "Apart for balance", "Crossed", "One in front of the other only"],
    correctAnswer: 1,
    category: "Manual Handling",
    section: "Health and Safety"
  },
  {
    id: 82,
    question: "What does PPE not protect against?",
    options: ["All workplace hazards", "Certain residual risks", "Chemical spills (if unsuitable)", "Everything"],
    correctAnswer: 0,
    category: "Safety Equipment",
    section: "Health and Safety"
  },
  {
    id: 83,
    question: "When should first aid supplies be restocked?",
    options: ["Monthly", "After items are used or expired", "Annually", "Only after inspection"],
    correctAnswer: 1,
    category: "First Aid",
    section: "Health and Safety"
  },
  {
    id: 84,
    question: "What should you do before starting work each day?",
    options: ["Check tools, PPE, and work area for safety", "Begin immediately", "Wait for the supervisor", "Check your phone"],
    correctAnswer: 0,
    category: "Site Safety",
    section: "Health and Safety"
  },
  {
    id: 85,
    question: "What is the best way to control dust when drilling?",
    options: ["Use extraction or wet drilling", "Sweep it away after", "Wear normal clothes", "Ignore it"],
    correctAnswer: 0,
    category: "Hazardous Substances",
    section: "Health and Safety"
  },
  {
    id: 86,
    question: "What is the main purpose of a safety data sheet (SDS)?",
    options: ["To provide information on how to handle hazardous substances safely", "To describe a company’s products", "To list ingredients only", "To advertise cleaning chemicals"],
    correctAnswer: 0,
    category: "Safety Documentation",
    section: "Health and Safety"
  },
  {
    id: 87,
    question: "What should you do if PPE doesn’t fit correctly?",
    options: ["Wear it anyway", "Modify it", "Ask for a replacement", "Share with someone else"],
    correctAnswer: 2,
    category: "Safety Equipment",
    section: "Health and Safety"
  },
  {
    id: 88,
    question: "Which regulation covers the safe lifting of equipment using cranes or hoists?",
    options: ["LOLER 1998", "PUWER 1998", "COSHH 2002", "RIDDOR 2013"],
    correctAnswer: 0,
    category: "Legal Requirements",
    section: "Health and Safety"
  },
  {
    id: 89,
    question: "Why is good housekeeping important on site?",
    options: ["It looks professional", "It reduces hazards such as slips and trips", "It makes inspections easier", "It’s required by clients"],
    correctAnswer: 1,
    category: "Site Safety",
    section: "Health and Safety"
  },
  {
    id: 90,
    question: "What is the most common type of personal injury on electrical installations?",
    options: ["Shock or burns", "Eye strain", "Cuts", "Headache"],
    correctAnswer: 0,
    category: "Electrical Safety",
    section: "Health and Safety"
  },
  {
    id: 91,
    question: "What type of sign is a green sign with a white cross?",
    options: ["First aid", "Warning", "Fire", "Mandatory"],
    correctAnswer: 0,
    category: "Safety Signs",
    section: "Health and Safety"
  },
  {
    id: 92,
    question: "Why must scaffolds be inspected weekly?",
    options: ["To meet legal requirements and ensure stability", "To count tools", "To repaint them", "To remove boards"],
    correctAnswer: 0,
    category: "Working at Height",
    section: "Health and Safety"
  },
  {
    id: 93,
    question: "What is the main hazard of using a step ladder incorrectly?",
    options: ["Falling from height", "Getting shocked", "Overreaching", "Making noise"],
    correctAnswer: 0,
    category: "Working at Height",
    section: "Health and Safety"
  },
  {
    id: 94,
    question: "What should be worn when cutting conduit or trunking?",
    options: ["Hard hat", "Safety goggles", "Gloves only", "Ear plugs only"],
    correctAnswer: 1,
    category: "Safety Equipment",
    section: "Health and Safety"
  },
  {
    id: 95,
    question: "What should you do if a fire blocks your usual escape route?",
    options: ["Find another safe exit", "Hide in a room", "Try to extinguish it", "Wait for others"],
    correctAnswer: 0,
    category: "Emergency Procedures",
    section: "Health and Safety"
  },
  {
    id: 96,
    question: "What is the purpose of earthing?",
    options: ["To provide a path for current to flow safely to ground", "To make circuits live", "To increase resistance", "To stop fuses blowing"],
    correctAnswer: 0,
    category: "Bonding and Earthing",
    section: "Health and Safety"
  },
  {
    id: 97,
    question: "When is it acceptable to work on live circuits?",
    options: ["Never, unless absolutely unavoidable and authorised with control measures", "Always", "When in a hurry", "When using insulated tools"],
    correctAnswer: 0,
    category: "Electrical Safety",
    section: "Health and Safety"
  },
  {
    id: 98,
    question: "What should a “Toolbox Talk” include?",
    options: ["Key hazards and safe working procedures for the day’s task", "Sports news", "Company profits", "Shift rota"],
    correctAnswer: 0,
    category: "Training",
    section: "Health and Safety"
  },
  {
    id: 99,
    question: "What is an environmental hazard?",
    options: ["A hazard that harms the surroundings, e.g. spills, noise, waste", "A trip hazard", "A social hazard", "A financial risk"],
    correctAnswer: 0,
    category: "Environmental Safety",
    section: "Health and Safety"
  },
  {
    id: 100,
    question: "Who should stop work if unsafe conditions arise?",
    options: ["The HSE only", "Any competent worker", "Only the supervisor", "The client"],
    correctAnswer: 1,
    category: "Safety Procedures",
    section: "Health and Safety"
  },
  {
    id: 101,
    question: "Under the CDM Regulations 2015, who appoints the Principal Designer and Principal Contractor?",
    options: ["HSE", "Client", "Architect", "Main contractor"],
    correctAnswer: 1,
    category: "Legal Requirements",
    section: "Health and Safety"
  },
  {
    id: 102,
    question: "The primary aim of a method statement (RAMS) is to:",
    options: ["Replace the risk assessment", "Describe the safe system of work for a specific task", "Record PPE issue", "Provide training records"],
    correctAnswer: 1,
    category: "Safety Documentation",
    section: "Health and Safety"
  },
  {
    id: 103,
    question: "The correct ladder angle (“4-to-1 rule”) approximates:",
    options: ["60°", "80°", "75°", "45°"],
    correctAnswer: 2,
    category: "Working at Height",
    section: "Health and Safety"
  },
  {
    id: 104,
    question: "Before proving dead on an electrical circuit, you must:",
    options: ["Use a non-contact “pen” tester only", "Prove your voltage indicator on a proving unit, test the circuit, then re-prove", "Switch off and start work", "Ask a colleague to check it"],
    correctAnswer: 1,
    category: "Safe Isolation",
    section: "Health and Safety"
  },
  {
    id: 105,
    question: "Which statement about lockout/tagout (LOTO) is correct?",
    options: ["Tags are enough without locks", "Each worker should apply their own lock", "One group lock covers everyone’s responsibility", "Keys should be left in locks"],
    correctAnswer: 1,
    category: "Safe Isolation",
    section: "Health and Safety"
  },
  {
    id: 106,
    question: "Arc-flash risk is best reduced by:",
    options: ["Wearing metal jewellery", "Working live to finish faster", "De-energising and using arc-rated PPE where risk remains", "Using higher fault levels"],
    correctAnswer: 2,
    category: "Electrical Safety",
    section: "Health and Safety"
  },
  {
    id: 107,
    question: "Typical “let-go” current for an adult (50–60 Hz) is around:",
    options: ["1 mA", "10 mA", "100 mA", "1 A"],
    correctAnswer: 1,
    category: "Electrical Safety",
    section: "Health and Safety"
  },
  {
    id: 108,
    question: "An RCD primarily provides protection against:",
    options: ["Overcurrent", "Short-circuits only", "Earth leakage and shock", "Overvoltage"],
    correctAnswer: 2,
    category: "Protection Devices",
    section: "Health and Safety"
  },
  {
    id: 109,
    question: "A combined device providing overcurrent and residual current protection is a:",
    options: ["MCB", "RCBO", "Fuse", "Isolator"],
    correctAnswer: 1,
    category: "Protection Devices",
    section: "Health and Safety"
  },
  {
    id: 110,
    question: "In UK/EU CLP labelling, the skull and crossbones pictogram means:",
    options: ["Flammable", "Explosive", "Acute toxicity (severe)", "Environmental hazard"],
    correctAnswer: 2,
    category: "Hazardous Substances",
    section: "Health and Safety"
  },
  {
    id: 111,
    question: "Dust from cutting concrete is hazardous mainly because it may contain:",
    options: ["Cellulose", "Silica (RCS)", "Chalk", "Nylon fibres"],
    correctAnswer: 1,
    category: "Hazardous Substances",
    section: "Health and Safety"
  },
  {
    id: 112,
    question: "Best control for silica dust at source:",
    options: ["Sweeping after work", "Dry cutting only", "Water suppression or on-tool extraction", "Open a window"],
    correctAnswer: 2,
    category: "Hazardous Substances",
    section: "Health and Safety"
  },
  {
    id: 113,
    question: "HAVS relates to exposure from:",
    options: ["High noise", "Hand-arm vibration from tools", "UV radiation", "Heat stress"],
    correctAnswer: 1,
    category: "Health Hazards",
    section: "Health and Safety"
  },
  {
    id: 114,
    question: "When opening an enclosure that may contain capacitors, you should:",
    options: ["Assume discharged", "Short them with a screwdriver", "Isolate, wait, and verify residual voltage is discharged", "Touch with gloved hands"],
    correctAnswer: 2,
    category: "Electrical Safety",
    section: "Health and Safety"
  },
  {
    id: 115,
    question: "IP rating: in IP54, the “5” indicates:",
    options: ["Water jets protection", "Dust protected (limited ingress)", "Totally dust-tight", "Submersion protection"],
    correctAnswer: 1,
    category: "Equipment Standards",
    section: "Health and Safety"
  },
  {
    id: 116,
    question: "Class II (double-insulated) tools are identified by:",
    options: ["CE mark", "A square within a square symbol", "A triangle symbol", "A “Class II” label in words only"],
    correctAnswer: 1,
    category: "Equipment Classification",
    section: "Health and Safety"
  },
  {
    id: 117,
    question: "Portable tools on construction sites should normally be supplied at:",
    options: ["24 V", "110 V centre-tapped to earth", "230 V", "400 V"],
    correctAnswer: 1,
    category: "Electrical Standards",
    section: "Health and Safety"
  },
  {
    id: 118,
    question: "A dynamic risk assessment is:",
    options: ["A one-off document", "A real-time check adapting to changing site conditions", "Only for managers", "Only for confined spaces"],
    correctAnswer: 1,
    category: "Risk Management",
    section: "Health and Safety"
  },
  {
    id: 119,
    question: "“Stop Work Authority” means:",
    options: ["Only HSE can halt work", "Anyone competent can stop unsafe work", "Only the client can stop work", "Only first aiders can stop work"],
    correctAnswer: 1,
    category: "Safety Procedures",
    section: "Health and Safety"
  },
  {
    id: 120,
    question: "Fire classes: Class F involves:",
    options: ["Flammable liquids", "Flammable gases", "Metals", "Cooking oils and fats"],
    correctAnswer: 3,
    category: "Fire Safety",
    section: "Health and Safety"
  },
  {
    id: 121,
    question: "The correct first aid for burns is to cool with running water for:",
    options: ["2 minutes", "5 minutes", "20 minutes", "Until it stops hurting"],
    correctAnswer: 2,
    category: "First Aid",
    section: "Health and Safety"
  },
  {
    id: 122,
    question: "AED (defibrillator) use should begin:",
    options: ["Only after 10 minutes of CPR", "As soon as it arrives and is safe to use", "Only by a doctor", "Only if the casualty is conscious"],
    correctAnswer: 1,
    category: "First Aid",
    section: "Health and Safety"
  },
  {
    id: 123,
    question: "A Hot Work Permit controls:",
    options: ["Any cold cutting", "Activities with ignition sources (e.g., welding, grinding)", "Painting works", "Office work"],
    correctAnswer: 1,
    category: "Permit to Work",
    section: "Health and Safety"
  },
  {
    id: 124,
    question: "Before excavation, services should be located by:",
    options: ["Guessing typical depths", "Asking a passer-by", "Reviewing plans and using CAT & Genny, then trial holes", "Calling the fire brigade"],
    correctAnswer: 2,
    category: "Site Safety",
    section: "Health and Safety"
  },
  {
    id: 125,
    question: "When approaching a suspected HV ground fault area outdoors you should:",
    options: ["Run away", "Take long strides", "Shuffle with feet together to reduce step potential", "Jump repeatedly"],
    correctAnswer: 2,
    category: "Electrical Safety",
    section: "Health and Safety"
  },
  {
    id: 126,
    question: "Eye wash for chemical splashes should be used for at least:",
    options: ["1 minute", "5 minutes", "10–15 minutes (or per SDS)", "Until lunchtime"],
    correctAnswer: 2,
    category: "First Aid",
    section: "Health and Safety"
  },
  {
    id: 127,
    question: "Emergency stop actuators are normally:",
    options: ["Green on blue", "Red on yellow background", "Yellow on black", "Blue on white"],
    correctAnswer: 1,
    category: "Safety Equipment",
    section: "Health and Safety"
  },
  {
    id: 128,
    question: "Noise regulations set lower/upper exposure action values around:",
    options: ["60/70 dB(A)", "70/80 dB(A)", "80/85 dB(A)", "90/100 dB(A)"],
    correctAnswer: 2,
    category: "Noise Control",
    section: "Health and Safety"
  },
  {
    id: 129,
    question: "A scaffold inspection status tag system (e.g., Scafftag) is used to:",
    options: ["Record paint colours", "Indicate last inspection and whether it’s safe to use", "Count boards", "Track deliveries"],
    correctAnswer: 1,
    category: "Working at Height",
    section: "Health and Safety"
  },
  {
    id: 130,
    question: "Which extinguisher is generally preferred for energised electrical fires?",
    options: ["Water", "Foam", "CO₂", "Wet chemical"],
    correctAnswer: 2,
    category: "Fire Safety",
    section: "Health and Safety"
  },
  {
    id: 131,
    question: "WEEE regulations mainly address:",
    options: ["Electrical safety testing", "Disposal and recycling of electrical/electronic waste", "Cable sizing", "Training requirements"],
    correctAnswer: 1,
    category: "Legal Requirements",
    section: "Health and Safety"
  },
  {
    id: 132,
    question: "COSHH assessments must consider:",
    options: ["Only PPE", "Only ventilation", "Substance hazards, exposure routes, controls, storage, and disposal", "Colour of containers"],
    correctAnswer: 2,
    category: "Hazardous Substances",
    section: "Health and Safety"
  },
  {
    id: 133,
    question: "A near-miss culture encourages:",
    options: ["Punishment for reports", "Not reporting small issues", "Reporting hazards to prevent accidents", "Reporting only injuries"],
    correctAnswer: 2,
    category: "Accident Prevention",
    section: "Health and Safety"
  },
  {
    id: 134,
    question: "For display screen equipment (DSE), one key control is:",
    options: ["Dim lighting only", "Adjustable chair and screen setup (ergonomics)", "Louder background music", "Smaller text"],
    correctAnswer: 1,
    category: "Ergonomics",
    section: "Health and Safety"
  },
  {
    id: 135,
    question: "Welfare on construction sites must include:",
    options: ["A canteen only", "Drinking water, toilets, washing, and rest facilities", "A smoking hut", "A gym"],
    correctAnswer: 1,
    category: "Site Welfare",
    section: "Health and Safety"
  },
  {
    id: 136,
    question: "If asbestos-containing material (ACM) is suspected you should:",
    options: ["Disturb to confirm", "Stop work and inform the duty holder for assessment", "Vacuum with a domestic cleaner", "Wet and remove immediately yourself"],
    correctAnswer: 1,
    category: "Hazardous Substances",
    section: "Health and Safety"
  },
  {
    id: 137,
    question: "The safest way to carry long conduit through a busy area is:",
    options: ["Horizontally at head height", "Drag along the floor", "Use two people, carry low and warn others", "Throw ahead carefully"],
    correctAnswer: 2,
    category: "Manual Handling",
    section: "Health and Safety"
  },
  {
    id: 138,
    question: "MCB trip curve B is generally suited to:",
    options: ["High inrush motors only", "General circuits with low inrush", "Welding circuits", "Transformer primaries"],
    correctAnswer: 1,
    category: "Protection Devices",
    section: "Health and Safety"
  },
  {
    id: 139,
    question: "A permit-to-work should be:",
    options: ["Verbal", "Written, specific, time-bound, and authorised", "Optional", "Left blank for flexibility"],
    correctAnswer: 1,
    category: "Permit to Work",
    section: "Health and Safety"
  },
  {
    id: 140,
    question: "A spill kit should be used:",
    options: ["Only for water", "For containing and absorbing oil/chemical spills", "For cleaning PPE", "For mopping floors nightly"],
    correctAnswer: 1,
    category: "Environmental Safety",
    section: "Health and Safety"
  },
  {
    id: 141,
    question: "Safe manual handling includes:",
    options: ["Load close to the body, neutral spine, use legs", "Twisting whilst lifting", "Holding away from the body", "Fast jerking motion"],
    correctAnswer: 0,
    category: "Manual Handling",
    section: "Health and Safety"
  },
  {
    id: 142,
    question: "“Test before touch” means:",
    options: ["Touch with gloves first", "Always verify de-energised state with an approved tester before contact", "Ask a colleague to touch", "Look for warning labels only"],
    correctAnswer: 1,
    category: "Safe Isolation",
    section: "Health and Safety"
  },
  {
    id: 143,
    question: "SELV voltage limits (BS 7671) are up to approximately:",
    options: ["12 V a.c. or 24 V d.c.", "25 V a.c. or 60 V d.c.", "50 V a.c. or 120 V ripple-free d.c.", "230 V a.c. only"],
    correctAnswer: 2,
    category: "Electrical Standards",
    section: "Health and Safety"
  },
  {
    id: 144,
    question: "For extension leads on site you should:",
    options: ["Keep coiled to save space", "Fully uncoil high-load reels to prevent overheating", "Bury under debris", "Tape permanently to the floor"],
    correctAnswer: 1,
    category: "Electrical Safety",
    section: "Health and Safety"
  },
  {
    id: 145,
    question: "When using a tower scaffold, you must:",
    options: ["Move it while someone is on the platform", "Ensure it’s on firm level ground and correctly braced", "Use bricks to level", "Climb the outside frames"],
    correctAnswer: 1,
    category: "Working at Height",
    section: "Health and Safety"
  },
  {
    id: 146,
    question: "A “competent person” for inspection and testing is one who:",
    options: ["Holds any card", "Is trained, experienced, and understands the work and hazards", "Is the most senior", "Works the fastest"],
    correctAnswer: 1,
    category: "Competency",
    section: "Health and Safety"
  },
  {
    id: 147,
    question: "If a colleague shows signs of heat stress, you should:",
    options: ["Encourage rest, cooling, fluids, and move to shade", "Ignore it", "Give hot drinks", "Increase workload to finish quicker"],
    correctAnswer: 0,
    category: "Health Hazards",
    section: "Health and Safety"
  },
  {
    id: 148,
    question: "Dry powder extinguishers can:",
    options: ["Obscure vision and impair breathing in confined spaces", "Be used as coolants", "Replace CO₂ always", "Be used on food fires as first choice"],
    correctAnswer: 0,
    category: "Fire Safety",
    section: "Health and Safety"
  },
  {
    id: 149,
    question: "When using a Cable Avoidance Tool (CAT) you should:",
    options: ["Skip calibration/functional checks", "Use with signal generator (Genny) where possible and follow a survey pattern", "Wave randomly", "Only use after digging"],
    correctAnswer: 1,
    category: "Site Safety",
    section: "Health and Safety"
  },
  {
    id: 150,
    question: "After completing work under a permit, you must:",
    options: ["Leave the permit open", "Remove locks and tags without telling anyone", "Hand back and formally close the permit, confirming area is safe", "File it next month"],
    correctAnswer: 2,
    category: "Permit to Work",
    section: "Health and Safety"
  },
  {
    id: 151,
    question: "Under CDM 2015, the Principal Designer’s key duty is to:",
    options: ["Supervise daily site labour", "Plan, manage and coordinate health & safety in the pre-construction phase", "Sign off electrical certificates", "Enforce PPE discipline only"],
    correctAnswer: 1,
    category: "Legal Requirements",
    section: "Health and Safety"
  },
  {
    id: 152,
    question: "A toolbox talk should be:",
    options: ["Annual and generic", "Short, task-specific, and interactive", "Written only", "Delivered by HSE"],
    correctAnswer: 1,
    category: "Training",
    section: "Health and Safety"
  },
  {
    id: 153,
    question: "The safest order for safe isolation is:",
    options: ["Isolate → Lock off → Prove dead → Tag", "Isolate → Lock off → Tag → Prove dead", "Lock off → Prove dead → Isolate → Tag", "Tag → Isolate → Prove dead → Lock off"],
    correctAnswer: 1,
    category: "Safe Isolation",
    section: "Health and Safety"
  },
  {
    id: 154,
    question: "A permit-to-work is normally required for:",
    options: ["Sweeping floors", "Live electrical work or confined space entry", "Painting", "Desktop IT work"],
    correctAnswer: 1,
    category: "Permit to Work",
    section: "Health and Safety"
  },
  {
    id: 155,
    question: "DSEAR primarily controls risks from:",
    options: ["Manual handling", "Explosive atmospheres and dangerous substances", "Display screen equipment", "UV radiation"],
    correctAnswer: 1,
    category: "Hazardous Substances",
    section: "Health and Safety"
  },
  {
    id: 156,
    question: "ATEX Zone 2 indicates:",
    options: ["Explosive atmosphere present continuously", "Present occasionally in normal operation", "Unlikely in normal operation, if it occurs—short duration", "No hazard exists"],
    correctAnswer: 2,
    category: "Hazardous Locations",
    section: "Health and Safety"
  },
  {
    id: 157,
    question: "Best control for overreaching on ladders:",
    options: ["Heavier ladder", "Tie off both stiles and reposition frequently", "Work faster", "Use top rung only"],
    correctAnswer: 1,
    category: "Working at Height",
    section: "Health and Safety"
  },
  {
    id: 158,
    question: "A MEWP harness lanyard should usually be:",
    options: ["Shock-absorbing 2 m", "Twin-tail fall-arrest", "Short restraint lanyard to prevent ejection", "No harness needed"],
    correctAnswer: 2,
    category: "Working at Height",
    section: "Health and Safety"
  },
  {
    id: 159,
    question: "Trench deeper than 1.2 m generally requires:",
    options: ["No action if soil is dry", "Edge boards only", "Shoring, battering or trench boxes", "A warning sign only"],
    correctAnswer: 2,
    category: "Excavation Safety",
    section: "Health and Safety"
  },
  {
    id: 160,
    question: "Lone working is acceptable when:",
    options: ["Risks are assessed and controls/communication in place", "It’s quicker", "No first aid cover exists", "At night only"],
    correctAnswer: 0,
    category: "Safety Procedures",
    section: "Health and Safety"
  },
  {
    id: 161,
    question: "Most effective control in the hierarchy:",
    options: ["PPE", "Administrative controls", "Engineering controls", "Elimination"],
    correctAnswer: 3,
    category: "Risk Management",
    section: "Health and Safety"
  },
  {
    id: 162,
    question: "A “proving unit” is used to:",
    options: ["Charge batteries", "Confirm a voltage indicator works before/after testing", "Identify polarity", "Test RCDs"],
    correctAnswer: 1,
    category: "Electrical Testing",
    section: "Health and Safety"
  },
  {
    id: 163,
    question: "Before cutting into a wall or floor, you should:",
    options: ["Assume no services exist", "Check drawings, use a cable/pipe locator, and mark a safe zone", "Drill a pilot hole blindly", "Ask a colleague"],
    correctAnswer: 1,
    category: "Site Safety",
    section: "Health and Safety"
  },
  {
    id: 164,
    question: "RPE must be:",
    options: ["Shared freely", "Face-fit tested for tight-fitting types", "Worn over beards without issue", "Used instead of extraction always"],
    correctAnswer: 1,
    category: "Safety Equipment",
    section: "Health and Safety"
  },
  {
    id: 165,
    question: "A spill kit typically contains:",
    options: ["Only brushes", "Absorbents, pads, socks and disposal bags", "Fire blankets only", "First-aid items"],
    correctAnswer: 1,
    category: "Environmental Safety",
    section: "Health and Safety"
  },
  {
    id: 166,
    question: "Electrical arc flash severity increases with:",
    options: ["Lower fault current and longer clearance time", "Higher fault current and longer clearing time", "Lower voltage and shorter time", "Cooler ambient temperature"],
    correctAnswer: 1,
    category: "Electrical Safety",
    section: "Health and Safety"
  },
  {
    id: 167,
    question: "A “lock-off hasp” allows:",
    options: ["A single key for all", "Multiple workers to apply their individual locks", "Locking without tags", "Tag use only"],
    correctAnswer: 1,
    category: "Safe Isolation",
    section: "Health and Safety"
  },
  {
    id: 168,
    question: "A Class II tool reduces risk because it:",
    options: ["Uses 400 V", "Is double-insulated with no protective earth", "Has a metal body", "Needs an RCD"],
    correctAnswer: 1,
    category: "Equipment Classification",
    section: "Health and Safety"
  },
  {
    id: 169,
    question: "Thermal burns first aid includes:",
    options: ["Ice application", "Remove loose clothing/jewellery and cool 20 min with water", "Applying creams", "Popping blisters"],
    correctAnswer: 1,
    category: "First Aid",
    section: "Health and Safety"
  },
  {
    id: 170,
    question: "A site induction should cover:",
    options: ["Pay rates", "Site-specific hazards, controls, emergency procedures and welfare", "Social activities", "Overtime rules only"],
    correctAnswer: 1,
    category: "Training",
    section: "Health and Safety"
  },
  {
    id: 171,
    question: "A near-miss investigation aims to:",
    options: ["Allocate blame", "Identify root causes and prevent recurrence", "Close the file", "Punish the reporter"],
    correctAnswer: 1,
    category: "Accident Reporting",
    section: "Health and Safety"
  },
  {
    id: 172,
    question: "Typical trigger time for portable RCD (30 mA) is:",
    options: ["Instant", "≤ 40 ms at 5× IΔn", "1 s at IΔn", "5 s always"],
    correctAnswer: 1,
    category: "Protection Devices",
    section: "Health and Safety"
  },
  {
    id: 173,
    question: "Dry powder extinguishers are not ideal indoors because:",
    options: ["They’re expensive", "They reduce oxygen", "They obscure vision and can affect breathing/clean-up", "They conduct electricity"],
    correctAnswer: 2,
    category: "Fire Safety",
    section: "Health and Safety"
  },
  {
    id: 174,
    question: "COSHH storage should ensure:",
    options: ["Mixed chemicals together", "Ventilation, segregation, secure containers and correct labelling", "Warm room", "Open shelves"],
    correctAnswer: 1,
    category: "Hazardous Substances",
    section: "Health and Safety"
  },
  {
    id: 175,
    question: "Safety signs with blue circles indicate:",
    options: ["Prohibition", "Mandatory action", "Emergency/first aid", "Warning"],
    correctAnswer: 1,
    category: "Safety Signs",
    section: "Health and Safety"
  },
  {
    id: 176,
    question: "Typical maximum manual team lift improves when:",
    options: ["Two people always double the limit", "Load is shared, plan the lift and communicate", "Taller person leads silently", "Twist at the waist"],
    correctAnswer: 1,
    category: "Manual Handling",
    section: "Health and Safety"
  },
  {
    id: 177,
    question: "An Emergency Stop should:",
    options: ["Latch mechanically and require manual reset", "Auto-reset", "Be green", "Be hidden"],
    correctAnswer: 0,
    category: "Safety Equipment",
    section: "Health and Safety"
  },
  {
    id: 178,
    question: "Electrical equipment in wet locations should be:",
    options: ["230 V without RCD", "IP rated appropriately and RCD protected", "Class I only", "Painted"],
    correctAnswer: 1,
    category: "Electrical Safety",
    section: "Health and Safety"
  },
  {
    id: 179,
    question: "Tagging without locking is:",
    options: ["Sufficient", "Not a positive isolation", "Better than locking", "Mandatory"],
    correctAnswer: 1,
    category: "Safe Isolation",
    section: "Health and Safety"
  },
  {
    id: 180,
    question: "A dynamic risk assessment is performed:",
    options: ["After the job", "During the task as conditions change", "Monthly only", "By HSE"],
    correctAnswer: 1,
    category: "Risk Management",
    section: "Health and Safety"
  },
  {
    id: 181,
    question: "Edge protection on scaffolds should include:",
    options: ["Top rail only", "Top rail, mid-rail, toe boards (and infill where required)", "Toe boards only", "Netting only"],
    correctAnswer: 1,
    category: "Working at Height",
    section: "Health and Safety"
  },
  {
    id: 182,
    question: "PAT frequency should be based on:",
    options: ["Colour of appliance", "Risk assessment considering environment and usage", "Fixed interval for all items", "Brand"],
    correctAnswer: 1,
    category: "Electrical Testing",
    section: "Health and Safety"
  },
  {
    id: 183,
    question: "Best practice for cable reels:",
    options: ["Keep coiled for heat retention", "Fully uncoil at higher loads to prevent overheating", "Bury under carpets", "Use 2 mm² cable only"],
    correctAnswer: 1,
    category: "Electrical Safety",
    section: "Health and Safety"
  },
  {
    id: 184,
    question: "A sharps injury (e.g., used blade) should be:",
    options: ["Ignored", "Squeezed aggressively", "Washed, covered, reported and seek medical advice", "Treated with solvent"],
    correctAnswer: 2,
    category: "First Aid",
    section: "Health and Safety"
  },
  {
    id: 185,
    question: "UV hazard from arc welding is controlled by:",
    options: ["Regular sunglasses", "Proper welding screens and rated eye/skin protection", "Looking away", "Shorter welds only"],
    correctAnswer: 1,
    category: "Hazardous Substances",
    section: "Health and Safety"
  },
  {
    id: 186,
    question: "Cold stress (hypothermia) early sign:",
    options: ["Euphoria and shivering", "Heavy sweating", "Sunburn", "Nosebleed"],
    correctAnswer: 0,
    category: "Health Hazards",
    section: "Health and Safety"
  },
  {
    id: 187,
    question: "Noise control priority is to:",
    options: ["Issue earplugs first", "Eliminate/substitute or engineer out the noise at source", "Shorten shifts only", "Move workers closer"],
    correctAnswer: 1,
    category: "Noise Control",
    section: "Health and Safety"
  },
  {
    id: 188,
    question: "When lifting a load with unknown weight:",
    options: ["Just try it", "Break into smaller loads or use mechanical aids", "Ask the smallest person", "Twist to test"],
    correctAnswer: 1,
    category: "Manual Handling",
    section: "Health and Safety"
  },
  {
    id: 189,
    question: "A chemical labelled “corrosion” pictogram warns of:",
    options: ["Flammability", "Skin burns/eye damage and metal corrosion", "Acute toxicity", "Environmental harm only"],
    correctAnswer: 1,
    category: "Hazardous Substances",
    section: "Health and Safety"
  },
  {
    id: 190,
    question: "Waste segregation on site should:",
    options: ["Mix all waste for speed", "Separate streams (general, metal, cable, WEEE, hazardous)", "Burn timber", "Leave liquids to evaporate"],
    correctAnswer: 1,
    category: "Environmental Safety",
    section: "Health and Safety"
  },
  {
    id: 191,
    question: "First aider suspects spinal injury; they should:",
    options: ["Move casualty immediately", "Keep the head still, maintain airway, call emergency services", "Give them a drink", "Sit them up"],
    correctAnswer: 1,
    category: "First Aid",
    section: "Health and Safety"
  },
  {
    id: 192,
    question: "Most appropriate extinguisher for energized server cabinet:",
    options: ["Water", "CO₂", "Foam", "Wet chemical"],
    correctAnswer: 1,
    category: "Fire Safety",
    section: "Health and Safety"
  },
  {
    id: 193,
    question: "Evidence for incident investigations should be:",
    options: ["Discarded quickly", "Collected promptly (photos, statements, documents) and preserved", "Kept verbal only", "Taken days later"],
    correctAnswer: 1,
    category: "Accident Reporting",
    section: "Health and Safety"
  },
  {
    id: 194,
    question: "A risk matrix typically combines:",
    options: ["Cost and time", "Likelihood and severity", "Headcount and duration", "Tool type and voltage"],
    correctAnswer: 1,
    category: "Risk Management",
    section: "Health and Safety"
  },
  {
    id: 195,
    question: "Working near overhead lines requires:",
    options: ["Wooden ladders", "Defined exclusion zones, planning, and supervision", "Faster work", "Plastic hats only"],
    correctAnswer: 1,
    category: "Electrical Safety",
    section: "Health and Safety"
  },
  {
    id: 196,
    question: "Battery energy storage cabinets require:",
    options: ["Nothing special", "Ventilation, fire strategy, electrical isolation and spill/thermal runaway controls", "Open flames for testing", "Water hose inside"],
    correctAnswer: 1,
    category: "Electrical Safety",
    section: "Health and Safety"
  },
  {
    id: 197,
    question: "A typical site emergency number and procedure should be:",
    options: ["Unknown; improvise", "Displayed on notices and covered in induction", "Secret for management", "Text-only"],
    correctAnswer: 1,
    category: "Emergency Procedures",
    section: "Health and Safety"
  },
  {
    id: 198,
    question: "Risk of dermatitis from oils/adhesives is reduced by:",
    options: ["Strong solvents for hand-cleaning", "Wearing suitable gloves and using skin care (barrier/after-work creams)", "Hot water only", "Ignoring minor rashes"],
    correctAnswer: 1,
    category: "Health Hazards",
    section: "Health and Safety"
  },
  {
    id: 199,
    question: "When using a generator on site:",
    options: ["Earth/neutral arrangements and RCD protection must be appropriate and checked", "Use any socket freely", "Never bond anything", "Skip inspections"],
    correctAnswer: 0,
    category: "Electrical Safety",
    section: "Health and Safety"
  },
  {
    id: 200,
    question: "After a lock-off, keys should be:",
    options: ["Left in the switch", "Kept by the person who applied the lock", "Put in a communal bowl", "Handed to a visitor"],
    correctAnswer: 1,
    category: "Safe Isolation",
    section: "Health and Safety"
  },
  {
    id: 203,
    question: "Which of these current levels is potentially lethal to humans?",
    options: ["1 mA", "10 mA", "50 mA", "1 A"],
    correctAnswer: 2,
    category: "Basic Electrical Safety",
    section: "Health and Safety"
  },
  {
    id: 204,
    question: "If a coworker is being electrocuted by live electrical equipment, what is the first thing you should do?",
    options: ["Switch off the power source", "Check for breathing and pulse", "Start CPR immediately", "Call an ambulance"],
    correctAnswer: 0,
    category: "First Aid",
    section: "Health and Safety"
  },
  {
    id: 205,
    question: "What does the term 'lockout/tagout' refer to in electrical safety?",
    options: ["Locking and tagging a power source to prevent it from being turned on during maintenance", "Securing tools in a locked box after use", "Using tags to label electrical panels", "Turning off lights at the end of the day"],
    correctAnswer: 0,
    category: "Working Practices",
    section: "Health and Safety"
  },
  {
    id: 206,
    question: "If a circuit breaker keeps tripping, what should you do?",
    options: ["Investigate and fix the cause of the overload or fault before resetting", "Hold the breaker in the ON position to keep power on", "Replace it with a higher-rated breaker", "Ignore it and keep resetting it"],
    correctAnswer: 0,
    category: "Electrical Protection",
    section: "Health and Safety"
  },
  {
    id: 207,
    question: "Which class of hard hat provides protection from high-voltage electrical shock?",
    options: ["Class C (Conductive)", "Class E (Electrical)", "Class G (General)", "Bump cap"],
    correctAnswer: 1,
    category: "Safety Equipment",
    section: "Health and Safety"
  },
  {
    id: 208,
    question: "Why are insulating rubber mats used in front of electrical switchboards?",
    options: ["To insulate the worker from ground and reduce shock risk", "To provide comfort while standing", "To absorb oil spills", "To protect the floor from wear"],
    correctAnswer: 0,
    category: "Basic Electrical Safety",
    section: "Health and Safety"
  },
  {
    id: 209,
    question: "What is a safe practice when using power tools outdoors?",
    options: ["Use a Residual Current Device (RCD) for the power supply", "Keep the tool's cord submerged in water for grounding", "Remove the ground pin of the plug to avoid tripping breakers", "Connect multiple extension cords together for extra length"],
    correctAnswer: 0,
    category: "Tools and Equipment Safety",
    section: "Health and Safety"
  },
  {
    id: 210,
    question: "What does RCD stand for?",
    options: ["Residual Current Device", "Rapid Circuit Disconnect", "Rated Control Device", "Residual Current Distributor"],
    correctAnswer: 0,
    category: "Electrical Protection",
    section: "Health and Safety"
  },
  {
    id: 211,
    question: "How can you verify that an electrical circuit is de-energized before working on it?",
    options: ["Test the circuit with a proper voltage tester after isolating it", "Turn off the switch and assume it is off", "Unplug any connected devices and proceed", "Rely on the circuit breaker label"],
    correctAnswer: 0,
    category: "Working Practices",
    section: "Health and Safety"
  },
  {
    id: 212,
    question: "In modern wiring, what color is the insulation of the earth (ground) wire?",
    options: ["Green and yellow", "Brown", "Blue", "Red"],
    correctAnswer: 0,
    category: "Basic Electrical Safety",
    section: "Health and Safety"
  },
  {
    id: 213,
    question: "What should you do if you discover damaged insulation on a power tool's cord?",
    options: ["Stop using it and have it repaired or replaced", "Wrap the damaged area with tape and continue using it", "Use it only at half power", "Only use it with gloves on"],
    correctAnswer: 0,
    category: "Tools and Equipment Safety",
    section: "Health and Safety"
  },
  {
    id: 214,
    question: "What is the purpose of the earth (ground) wire in electrical equipment?",
    options: ["To carry fault current safely to ground if a fault occurs", "To act as a neutral wire", "To save energy during operation", "To make the appliance run faster"],
    correctAnswer: 0,
    category: "Basic Electrical Safety",
    section: "Health and Safety"
  },
  {
    id: 215,
    question: "What could cause a Residual Current Device (RCD) to trip?",
    options: ["A leakage of current to earth (ground)", "Normal operation of equipment", "High ambient temperature", "Low supply voltage"],
    correctAnswer: 0,
    category: "Electrical Protection",
    section: "Health and Safety"
  },
  {
    id: 216,
    question: "What is the main danger of using a metal ladder near live electrical wires?",
    options: ["The ladder can conduct electricity, leading to electric shock", "The ladder might rust or corrode", "The ladder could bend under weight", "The ladder may slip more easily"],
    correctAnswer: 0,
    category: "Working Practices",
    section: "Health and Safety"
  },
  {
    id: 217,
    question: "Which of these is NOT a safe practice when using a ladder?",
    options: ["Standing on the top rungs of the ladder", "Maintaining three points of contact while climbing", "Setting the ladder at a proper angle (about 75°)", "Inspecting the ladder for damage before use"],
    correctAnswer: 0,
    category: "Working at Height",
    section: "Health and Safety"
  },
  {
    id: 218,
    question: "What does COSHH stand for?",
    options: ["Control of Substances Hazardous to Health", "Control of Spills and Harmful Hazards", "Council on Occupational Safety and Health", "Company Operational Safety & Health Handbook"],
    correctAnswer: 0,
    category: "Regulations",
    section: "Health and Safety"
  },
  {
    id: 219,
    question: "Under the RIDDOR regulations, what must employers do?",
    options: ["Report certain workplace injuries, diseases, and dangerous occurrences to authorities", "Provide free safety equipment to all employees", "Conduct daily fire drills", "Give each employee a health check every month"],
    correctAnswer: 0,
    category: "Regulations",
    section: "Health and Safety"
  },
  {
    id: 220,
    question: "What is the main legislation governing workplace health and safety in the UK?",
    options: ["Health and Safety at Work Act 1974", "Occupational Safety and Health Act 1970", "Factories Act 1961", "Working Time Regulations 1998"],
    correctAnswer: 0,
    category: "Regulations",
    section: "Health and Safety"
  },
  {
    id: 221,
    question: "In what year was the Health and Safety at Work Act enacted in the UK?",
    options: ["1974", "1984", "1996", "2005"],
    correctAnswer: 0,
    category: "Regulations",
    section: "Health and Safety"
  },
  {
    id: 222,
    question: "What is a method statement?",
    options: ["A document detailing how to carry out a job safely and correctly", "A worker's personal medical record", "A legal contract for financial terms", "A list of tools required for a job"],
    correctAnswer: 0,
    category: "Working Practices",
    section: "Health and Safety"
  },
  {
    id: 223,
    question: "Before entering a confined space, you should:",
    options: ["Test the atmosphere for sufficient oxygen and toxic gases", "Wear ear protection for noise", "Warm up to avoid muscle strain", "Ensure the space is dark to see hazards"],
    correctAnswer: 0,
    category: "Hazardous Environments",
    section: "Health and Safety"
  },
  {
    id: 224,
    question: "What is the purpose of a risk assessment?",
    options: ["To identify hazards and implement controls to reduce the risk of harm", "To check if workers are doing their jobs", "To calculate project costs", "To ensure employees work faster"],
    correctAnswer: 0,
    category: "Risk Assessment",
    section: "Health and Safety"
  },
  {
    id: 225,
    question: "What is the first step in performing a risk assessment?",
    options: ["Identify potential hazards in the workplace or task", "Buy personal protective equipment (PPE)", "Train all employees in safety procedures", "Report all past accidents"],
    correctAnswer: 0,
    category: "Risk Assessment",
    section: "Health and Safety"
  },
  {
    id: 226,
    question: "If a hazardous chemical spill occurs, what should you consult for cleanup instructions?",
    options: ["The Material Safety Data Sheet (MSDS) for that substance", "The company's financial report", "The fire evacuation plan", "The electrical schematic"],
    correctAnswer: 0,
    category: "Hazardous Substances",
    section: "Health and Safety"
  },
  {
    id: 227,
    question: "Which type of fire extinguisher is safe to use on a live electrical fire?",
    options: ["Carbon Dioxide (CO2) extinguisher", "Water extinguisher", "Foam extinguisher", "Wet chemical extinguisher"],
    correctAnswer: 0,
    category: "Fire Safety",
    section: "Health and Safety"
  },
  {
    id: 228,
    question: "A yellow triangular sign with a black lightning bolt symbol indicates:",
    options: ["Electrical danger/high voltage", "Mandatory high-visibility clothing area", "No open flames allowed", "Biohazard present"],
    correctAnswer: 0,
    category: "Safety Signs",
    section: "Health and Safety"
  },
  {
    id: 229,
    question: "What color are fire emergency exit signs usually?",
    options: ["Green and white", "Red and white", "Blue and white", "Yellow and black"],
    correctAnswer: 0,
    category: "Safety Signs",
    section: "Health and Safety"
  },
  {
    id: 230,
    question: "A safety sign with a blue circle (and white symbol) indicates:",
    options: ["A mandatory action that must be followed (requirement)", "A prohibition (do not do) instruction", "A warning of a hazard", "Emergency exit information"],
    correctAnswer: 0,
    category: "Safety Signs",
    section: "Health and Safety"
  },
  {
    id: 231,
    question: "Which of the following is the correct way to lift a heavy object?",
    options: ["Bend your knees and keep your back straight while lifting with your legs", "Keep your legs straight and bend your back to lift", "Lift quickly using your back to get it done faster", "Hold the object away from your body to balance"],
    correctAnswer: 0,
    category: "Manual Handling",
    section: "Health and Safety"
  },
  {
    id: 232,
    question: "What is a common symptom of hearing damage from long-term noise exposure?",
    options: ["Ringing in the ears (tinnitus)", "Sharper hearing ability", "Improved balance", "Better night vision"],
    correctAnswer: 0,
    category: "Noise Hazards",
    section: "Health and Safety"
  },
  {
    id: 233,
    question: "Above approximately what noise level is hearing protection recommended for prolonged exposure?",
    options: ["85 dB(A)", "50 dB(A)", "70 dB(A)", "100 dB(A)"],
    correctAnswer: 0,
    category: "Noise Hazards",
    section: "Health and Safety"
  },
  {
    id: 234,
    question: "What does the unit dB (decibel) measure?",
    options: ["Sound intensity (noise level)", "Electrical resistance", "Frequency of a sound", "Light brightness"],
    correctAnswer: 0,
    category: "Noise Hazards",
    section: "Health and Safety"
  },
  {
    id: 235,
    question: "What is the main purpose of a fuse or circuit breaker?",
    options: ["To protect wiring by cutting off power during an overload or short circuit", "To stabilize the voltage in the circuit", "To save energy in the system", "To provide backup power"],
    correctAnswer: 0,
    category: "Electrical Protection",
    section: "Health and Safety"
  },
  {
    id: 236,
    question: "A fire extinguisher with a blue label contains:",
    options: ["Dry Powder for class A, B, C fires and electrical", "Water for class A fires", "CO2 for electrical fires", "Foam for class B fires"],
    correctAnswer: 0,
    category: "Fire Safety",
    section: "Health and Safety"
  },
  {
    id: 237,
    question: "Fires involving combustible metals (like magnesium or aluminum) are class:",
    options: ["Class D", "Class A", "Class C", "Class F"],
    correctAnswer: 0,
    category: "Fire Safety",
    section: "Health and Safety"
  },
  {
    id: 238,
    question: "If a person's clothing catches fire, what is the best action to take?",
    options: ["Wrap them in a fire blanket to smother the flames", "Spray them with a CO2 extinguisher", "Have them run to fan out the flames", "Pour water mixed with oil on the flames"],
    correctAnswer: 0,
    category: "Fire Safety",
    section: "Health and Safety"
  },
  {
    id: 239,
    question: "The fire triangle consists of which three elements?",
    options: ["Heat, Fuel, and Oxygen", "Heat, Water, and Oxygen", "Fuel, Carbon Dioxide, and Ignition", "Fuel, Oxygen, and Electricity"],
    correctAnswer: 0,
    category: "Fire Safety",
    section: "Health and Safety"
  },
  {
    id: 240,
    question: "Which of the following is a potential effect of an electric shock on the body?",
    options: ["Severe muscle contractions and burns", "Improved circulation", "Enhanced muscle strength", "Immunity to future shocks"],
    correctAnswer: 0,
    category: "Basic Electrical Safety",
    section: "Health and Safety"
  },
  {
    id: 241,
    question: "A common cause of electrical fires in homes is:",
    options: ["Overloading outlets or circuits with too many appliances", "Using LED bulbs instead of incandescent", "Unplugging devices when not in use", "Low household voltage levels"],
    correctAnswer: 0,
    category: "Fire Safety",
    section: "Health and Safety"
  },
  {
    id: 242,
    question: "On power tools, a symbol of two squares, one inside the other, means the tool:",
    options: ["Is double insulated and does not require an earth ground", "Has two-speed settings", "Is safe to use in water", "Requires two people to operate"],
    correctAnswer: 0,
    category: "Electrical Protection",
    section: "Health and Safety"
  },
  {
    id: 243,
    question: "Why must large capacitors be discharged before working on a circuit?",
    options: ["They can hold a dangerous charge even after power is off", "They can explode from air pressure if not discharged", "They block AC current when charged", "They will immediately catch fire when touched"],
    correctAnswer: 0,
    category: "Basic Electrical Safety",
    section: "Health and Safety"
  },
  {
    id: 244,
    question: "Which tool can detect electrical voltage without touching the conductor?",
    options: ["A non-contact voltage tester", "A multimeter set to resistance", "An ohmmeter", "A thermometer"],
    correctAnswer: 0,
    category: "Tools and Equipment",
    section: "Health and Safety"
  },
  {
    id: 245,
    question: "What is the safe way to disconnect an electrical plug from a socket?",
    options: ["Grip and pull the plug by its body (not the cord)", "Yank the cord from a distance", "Turn off the main power first every time", "Pull the cord while twisting"],
    correctAnswer: 0,
    category: "Basic Electrical Safety",
    section: "Health and Safety"
  },
  {
    id: 246,
    question: "In a UK plug, what color is the live (hot) wire?",
    options: ["Brown", "Blue", "Green/yellow", "Black"],
    correctAnswer: 0,
    category: "Basic Electrical Safety",
    section: "Health and Safety"
  },
  {
    id: 247,
    question: "If you encounter an exposed live wire or open electrical panel, you should:",
    options: ["Keep others away and shut off power, then report it to a qualified person", "Immediately touch it to verify if it's live", "Cover it with metal to shield it", "Ignore it if it's not sparking"],
    correctAnswer: 0,
    category: "Basic Electrical Safety",
    section: "Health and Safety"
  },
  {
    id: 248,
    question: "What does ELCB stand for?",
    options: ["Earth Leakage Circuit Breaker", "Electric Line Circuit Board", "Earth Line Connection Box", "Emergency Load Control Button"],
    correctAnswer: 0,
    category: "Electrical Protection",
    section: "Health and Safety"
  },
  {
    id: 249,
    question: "Before climbing a ladder, always ensure that:",
    options: ["The ladder is on a firm, level base and secured", "It is an aluminum ladder for strength", "The ladder is painted to prevent wear", "Someone is at the top to pull you up"],
    correctAnswer: 0,
    category: "Working at Height",
    section: "Health and Safety"
  },
  {
    id: 250,
    question: "When working on or near live electrical parts, you should use:",
    options: ["Insulated tools with handles rated for the voltage", "Standard metal tools with rubber handles", "Any tools as long as your hands are dry", "Plastic tools only"],
    correctAnswer: 0,
    category: "Tools and Equipment",
    section: "Health and Safety"
  },
  {
    id: 251,
    question: "Why is water near electrical equipment dangerous?",
    options: ["Water conducts electricity, increasing the risk of shock", "Water raises the electrical voltage", "Water acts as an insulator", "Water automatically trips circuit breakers"],
    correctAnswer: 0,
    category: "Basic Electrical Safety",
    section: "Health and Safety"
  },
  {
    id: 252,
    question: "Why should you remove metal jewelry before working on electrical equipment?",
    options: ["Metal jewelry can conduct electricity and cause burns or shock", "It might get dirty or scratched", "It could magnetize the equipment", "It violates electrical codes to wear jewelry"],
    correctAnswer: 0,
    category: "Basic Electrical Safety",
    section: "Health and Safety"
  },
  {
    id: 253,
    question: "If an electrical appliance emits a burning smell, you should first:",
    options: ["Disconnect the power immediately", "Pour water on the appliance", "Open windows and continue to monitor it", "Ignore it and hope it stops"],
    correctAnswer: 0,
    category: "Basic Electrical Safety",
    section: "Health and Safety"
  },
  {
    id: 254,
    question: "What should you do when you see a sign that says 'Danger: High Voltage'?",
    options: ["Keep a safe distance unless you are authorized and trained", "Assume the equipment is safe because it's labeled", "Touch it briefly to test if it's live", "Proceed as normal; the sign is just a caution"],
    correctAnswer: 0,
    category: "Safety Signs",
    section: "Health and Safety"
  },
  {
    id: 255,
    question: "Why are cordless power tools often considered safer than corded tools?",
    options: ["They use lower voltages (battery power), reducing risk of electric shock", "They are less powerful so they cannot cause harm", "They never malfunction", "They don’t produce any heat"],
    correctAnswer: 0,
    category: "Basic Electrical Safety",
    section: "Health and Safety"
  },
  {
    id: 256,
    question: "Which of the following is NOT an example of Personal Protective Equipment (PPE)?",
    options: ["A toolbox", "Safety harness", "Ear plugs", "Hard hat"],
    correctAnswer: 0,
    category: "Safety Equipment",
    section: "Health and Safety"
  },
  {
    id: 257,
    question: "Which type of PPE protects your lungs from dust or fumes?",
    options: ["A respirator or dust mask", "Safety goggles", "Ear defenders", "Steel-toe boots"],
    correctAnswer: 0,
    category: "Safety Equipment",
    section: "Health and Safety"
  },
  {
    id: 258,
    question: "A safety harness is designed to protect you from:",
    options: ["Falls from height", "Loud noise", "Electrical shock", "Dust inhalation"],
    correctAnswer: 0,
    category: "Safety Equipment",
    section: "Health and Safety"
  },
  {
    id: 259,
    question: "When should high-visibility (hi-vis) clothing be worn?",
    options: ["When working near vehicles or in low-visibility areas to ensure you are seen", "Only at night", "Only in warehouses", "Only during emergencies"],
    correctAnswer: 0,
    category: "Safety Equipment",
    section: "Health and Safety"
  },
  {
    id: 260,
    question: "Which item protects your head from falling objects?",
    options: ["A hard hat (safety helmet)", "Ear muffs", "Safety goggles", "High-visibility cap"],
    correctAnswer: 0,
    category: "Safety Equipment",
    section: "Health and Safety"
  },
  {
    id: 261,
    question: "Insulating gloves (rated for electrical work) protect against:",
    options: ["Electric shock", "Cold temperatures", "Chemical spills", "Vibration injuries"],
    correctAnswer: 0,
    category: "Safety Equipment",
    section: "Health and Safety"
  },
  {
    id: 262,
    question: "What color label does a CO2 fire extinguisher have?",
    options: ["Black", "Red", "Blue", "Yellow"],
    correctAnswer: 0,
    category: "Fire Safety",
    section: "Health and Safety"
  },
  {
    id: 263,
    question: "When positioning an extension ladder, the base should be approximately what fraction of its length away from the wall?",
    options: ["One quarter of its working length (4:1 ratio)", "Half of its length (1:2 ratio)", "Equal to its height (1:1 ratio)", "There is no set ratio"],
    correctAnswer: 0,
    category: "Working at Height",
    section: "Health and Safety"
  },
  {
    id: 264,
    question: "What safety measure should be in place when working at a roof edge or open side at height?",
    options: ["Guardrails or a personal fall arrest harness to prevent falls", "Only a warning sign at ground level", "No special measures if you are careful", "A net to catch tools only"],
    correctAnswer: 0,
    category: "Working at Height",
    section: "Health and Safety"
  },
  {
    id: 265,
    question: "When lifting a heavy object with a coworker, you should:",
    options: ["Coordinate and lift together with clear communication", "Each lift from opposite ends without talking", "Let the taller person do all the lifting", "Twist your body while lifting for better leverage"],
        correctAnswer: 0,
    category: "Manual Handling",
    section: "Health and Safety"
  },
  {
    id: 266,
    question: "If an object is too heavy or bulky to lift alone, you should:",
    options: ["Ask for help or use lifting equipment", "Lift it quickly to minimize time under strain", "Drag it across the floor by yourself", "Break the object into smaller pieces with force"],
    correctAnswer: 0,
    category: "Manual Handling",
    section: "Health and Safety"
  },
  {
    id: 267,
    question: "Good housekeeping (keeping the work area tidy) is important because it:",
    options: ["Helps prevent accidents like slips, trips, and falls", "Makes the workplace look nice for visitors", "Reduces the need for any safety training", "Allows workers to work faster by ignoring hazards"],
    correctAnswer: 0,
    category: "General Safety",
    section: "Health and Safety"
  },
  {
    id: 268,
    question: "Which of the following could be a trip hazard in a workplace?",
    options: ["An extension cord running across a walkway", "A closed door in a hallway", "A wall-mounted fire extinguisher", "A loud alarm sound"],
    correctAnswer: 0,
    category: "General Safety",
    section: "Health and Safety"
  },
  {
    id: 269,
    question: "If oil or grease is spilled on the floor, what should you do?",
    options: ["Clean it up immediately or use absorbent to prevent a slipping hazard", "Ignore it if warning signs are present", "Cover it with paper and leave it", "Wait for it to dry on its own"],
    correctAnswer: 0,
    category: "General Safety",
    section: "Health and Safety"
  },
  {
    id: 270,
    question: "Which of the following is NOT an electrical protective device?",
    options: ["A transformer", "A fuse", "A circuit breaker", "An RCD (Residual Current Device)"],
    correctAnswer: 0,
    category: "Electrical Protection",
    section: "Health and Safety"
  },
  {
    id: 271,
    question: "What does GFCI stand for?",
    options: ["Ground Fault Circuit Interrupter", "Ground Frequency Current Indicator", "General Fuse and Circuit Isolator", "Global Fire Circuit Insulation"],
    correctAnswer: 0,
    category: "Electrical Protection",
    section: "Health and Safety"
  },
  {
    id: 272,
    question: "A sign saying 'DANGER: CONFINED SPACE' implies:",
    options: ["The area may contain life-threatening hazards (low oxygen, toxic gas) and entry is restricted", "The area is very small and uncomfortable", "Only one person is allowed inside at a time", "It is a designated break area"],
    correctAnswer: 0,
    category: "Hazardous Environments",
    section: "Health and Safety"
  },
  {
    id: 273,
    question: "What is a safe way to use lighting in a wet or damp environment?",
    options: ["Use low-voltage lighting or ensure the circuit is protected by an RCD", "Use standard mains lighting with extension cords in water", "Stand in a puddle while changing the bulb to ground yourself", "Only use metal-cased lights for durability"],
    correctAnswer: 0,
    category: "Basic Electrical Safety",
    section: "Health and Safety"
  },
  {
    id: 274,
    question: "What should you always do before cleaning or repairing an electrical appliance?",
    options: ["Disconnect it from power (unplug it or switch off its breaker)", "Spray it with cleaner while it's running to see where the dirt is", "Make sure it's turned to the highest setting", "Keep it plugged in but turned off, for a quick start after"],
    correctAnswer: 0,
    category: "Basic Electrical Safety",
    section: "Health and Safety"
  },
  {
    id: 275,
    question: "If live electrical work must be done in exceptional cases, which PPE is essential?",
    options: ["Insulated gloves, insulated tools, and face protection rated for the voltage", "Only regular cloth gloves since they're dry", "No special PPE if you are careful", "Metal jewelry to divert the electricity"],
    correctAnswer: 0,
    category: "Basic Electrical Safety",
    section: "Health and Safety"
  },
  {
    id: 276,
    question: "Why is it dangerous to replace a blown fuse with one of a higher amperage rating?",
    options: ["It can allow excessive current, causing overheating and fire before the circuit is protected", "It will make the electricity bill higher", "It will cause the power to shut off more often", "It will make appliances run slower"],
    correctAnswer: 0,
    category: "Electrical Protection",
    section: "Health and Safety"
  },
  {
    id: 277,
    question: "Before digging or excavating at a site, you should:",
    options: ["Check for underground utilities by reviewing plans and using cable locators", "Dig only a few inches deep to be safe", "Use only a shovel, not power equipment", "Assume there are no cables if none are visible"],
    correctAnswer: 0,
    category: "Worksite Safety",
    section: "Health and Safety"
  },
  {
    id: 278,
    question: "If water is present on the floor around electrical equipment, you should:",
    options: ["Stop using the equipment, cut power, and dry the area before continuing", "Proceed since water grounds the area", "Only use the equipment at low settings", "Wear two pairs of socks for insulation"],
    correctAnswer: 0,
    category: "Basic Electrical Safety",
    section: "Health and Safety"
  },
  {
    id: 279,
    question: "What kind of footwear should an electrician wear for safety?",
    options: ["Safety boots with insulating soles and steel toe caps (EH-rated boots)", "Rubber flip-flops to avoid grounding", "Metal cleated boots for better grip", "Any sneakers, as long as they're comfortable"],
    correctAnswer: 0,
    category: "Safety Equipment",
    section: "Health and Safety"
  },
  {
    id: 280,
    question: "Before using a new chemical at work, you should:",
    options: ["Read its Safety Data Sheet (SDS) to understand the hazards and precautions", "Assume it's safe if it's commonly used elsewhere", "Mix it with water to reduce strength and then use it", "Trust that the supplier handled safety so no action is needed"],
    correctAnswer: 0,
    category: "Hazardous Substances",
    section: "Health and Safety"
  },
  {
    id: 281,
    question: "Why should you never run a gasoline/petrol generator indoors?",
    options: ["It produces carbon monoxide gas which can be deadly in enclosed spaces", "It will overheat without wind", "It could steal oxygen needed for breathing by cooling the air", "Generators only work outdoors due to satellite link"],
    correctAnswer: 0,
    category: "General Safety",
    section: "Health and Safety"
  },
  {
    id: 282,
    question: "If you suspect a material contains asbestos, you should:",
    options: ["Stop work and have a licensed professional test or remove it - do not disturb it", "Spray it with water and continue working carefully", "Wear a simple dust mask and proceed slowly", "Double-wrap it in plastic and throw it in the regular trash"],
    correctAnswer: 0,
    category: "Hazardous Substances",
    section: "Health and Safety"
  },
  {
    id: 283,
    question: "What should you do if a power tool causes an RCD to trip every time it's used?",
    options: ["Stop using the tool and have it inspected or repaired (it may have a fault)", "Use the tool on a circuit without an RCD", "Tape down the RCD switch to prevent it from tripping", "Wear rubber gloves and continue using the tool"],
    correctAnswer: 0,
    category: "Electrical Protection",
    section: "Health and Safety"
  },
  {
    id: 284,
    question: "Long-term use of vibrating tools (like jackhammers) can lead to:",
    options: ["Hand-Arm Vibration Syndrome (HAVS)", "Improved circulation in the hands", "Carpal tunnel syndrome in the ears", "Chronic knee pain"],
    correctAnswer: 0,
    category: "Health Hazards",
    section: "Health and Safety"
  },
  {
    id: 285,
    question: "How can you reduce the risk of hand-arm vibration syndrome (HAVS) when using power tools?",
    options: ["Limit the time using them and wear anti-vibration gloves; take regular breaks", "Press the tool harder to finish faster", "Only use them in cold environments to numb the pain", "Avoid taking breaks to keep your hands used to it"],
    correctAnswer: 0,
    category: "Health Hazards",
    section: "Health and Safety"
  },
  {
    id: 286,
    question: "What is a 'toolbox talk'?",
    options: ["A short safety meeting or briefing on-site about specific safety topics or tasks", "A discussion where workers complain about their tools", "A box in which safety documents are kept", "A formal annual safety conference"],
    correctAnswer: 0,
    category: "General Safety",
    section: "Health and Safety"
  },
  {
    id: 287,
    question: "How often should power tools and cords be inspected for damage?",
    options: ["Before each use or routinely, to catch any damage or wear", "Once every five years", "Only when they stop working", "No need if they are new"],
    correctAnswer: 0,
    category: "Tools and Equipment",
    section: "Health and Safety"
  },
  {
    id: 288,
    question: "Portable Appliance Testing (PAT) involves:",
    options: ["Visually inspecting and electrically testing an appliance for safety", "Checking if an appliance performs its function quickly", "Adding extra insulation tape to wires", "Testing how hot an appliance gets during use"],
    correctAnswer: 0,
    category: "Electrical Protection",
    section: "Health and Safety"
  },
  {
    id: 289,
    question: "How often should you press the test button on an RCD (Residual Current Device) to ensure it's working?",
    options: ["About every 3 months (quarterly)", "Daily", "Once a decade", "Never, unless it trips"],
    correctAnswer: 0,
    category: "Electrical Protection",
    section: "Health and Safety"
  },
  {
    id: 290,
    question: "If you are not trained or authorized to perform a certain dangerous task, you should:",
    options: ["Inform a supervisor and do not proceed until properly trained or authorized", "Try it under supervision of a friend", "Read about it online and attempt it", "Go ahead to avoid delaying work"],
    correctAnswer: 0,
    category: "General Safety",
    section: "Health and Safety"
  }
];