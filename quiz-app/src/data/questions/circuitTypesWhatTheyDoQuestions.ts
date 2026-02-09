import { TaggedQuestion } from './types';

/**
 * Circuit Types: What They Do Question Bank
 * Aligned with lesson 203-3A111 learning outcomes
 * Generated: 2026-02-09
 */

export const circuitTypesWhatTheyDoQuestions: TaggedQuestion[] = [
  {
    "id": 4016,
    "question": "Which type of circuit starts at the distribution board and connects to several socket outlets before returning to the same terminal in the distribution board?",
    "options": [
      "Ring final circuit",
      "Radial circuit",
      "Series circuit",
      "Control circuit"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "USED_SERIES_RULE",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "terminology",
      "conceptual",
      "parallel"
    ],
    "learningOutcomeId": "203-3A111-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "A ring final circuit is unique because the circuit conductors form a loop, starting and ending at the same point in the distribution board."
  },
  {
    "id": 4017,
    "question": "Calculate the total resistance of two 15 Ω resistors connected in series.",
    "options": [
      "30 Ω",
      "7.5 Ω",
      "225 Ω",
      "1 Ω"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_PARALLEL_RULE",
      "2": "MULTIPLIED_INSTEAD",
      "3": "DIVIDED_INSTEAD"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Rules",
    "tags": [
      "series",
      "resistance-rule",
      "calculation"
    ],
    "learningOutcomeId": "203-3A111-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "In a series circuit, total resistance is the sum of all individual resistances (Rt = R1 + R2)."
  },
  {
    "id": 4018,
    "question": "In a parallel circuit containing three lamps, what happens to the voltage across each lamp?",
    "options": [
      "The voltage remains the same across each lamp",
      "The voltage is shared equally between the lamps",
      "The voltage increases as more lamps are added",
      "The voltage drops to zero at the last lamp"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_SERIES_RULE",
      "2": "TOPOLOGY_CONFUSION",
      "3": "CONFUSED_I_V_R"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Rules",
    "tags": [
      "parallel",
      "voltage-rule",
      "conceptual"
    ],
    "learningOutcomeId": "203-3A111-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "In a parallel circuit, the voltage across each branch is equal to the supply voltage."
  },
  {
    "id": 4019,
    "question": "Which circuit type is most commonly used for domestic lighting installations in the UK?",
    "options": [
      "Radial circuit",
      "Ring final circuit",
      "Series circuit",
      "Data circuit"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "USED_SERIES_RULE",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "application",
      "terminology",
      "units"
    ],
    "learningOutcomeId": "203-3A111-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Lighting circuits are typically wired as radial circuits, where the cable runs from the consumer unit to the first point, then the second, and ends at the last point."
  },
  {
    "id": 4020,
    "question": "If a series circuit has a total current of 2 A flowing through the first component, what is the current flowing through the second component?",
    "options": [
      "2 A",
      "1 A",
      "4 A",
      "0 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "MULTIPLIED_INSTEAD",
      "3": "CONFUSED_I_V_R"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Rules",
    "tags": [
      "series",
      "current-rule",
      "calculation"
    ],
    "learningOutcomeId": "203-3A111-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "In a series circuit, the current is the same at all points in the circuit."
  },
  {
    "id": 4021,
    "question": "What is the primary purpose of a 'Control Circuit' in an electrical installation?",
    "options": [
      "To operate equipment like contactors or relays",
      "To provide high-speed internet to the building",
      "To supply power to heavy heating loads",
      "To provide the main earthing for the property"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "TOPOLOGY_CONFUSION",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "conceptual",
      "terminology",
      "relays"
    ],
    "learningOutcomeId": "203-3A111-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Control circuits are used to manage the operation of other circuits, often using lower voltages to switch higher power loads via relays or contactors."
  },
  {
    "id": 4022,
    "question": "Calculate the total resistance of two 20 Ω resistors connected in parallel.",
    "options": [
      "10 Ω",
      "40 Ω",
      "400 Ω",
      "2 Ω"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_SERIES_RULE",
      "2": "MULTIPLIED_INSTEAD",
      "3": "DIVIDED_INSTEAD"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Rules",
    "tags": [
      "parallel",
      "resistance-rule",
      "calculation"
    ],
    "learningOutcomeId": "203-3A111-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "For two identical resistors in parallel, the total resistance is half the value of one resistor (Rt = R / n)."
  },
  {
    "id": 4023,
    "question": "Which of the following is a typical application for a data and communications circuit?",
    "options": [
      "Ethernet cabling for a computer network",
      "Supplying a 9 kW electric shower",
      "Connecting a 3-phase industrial motor",
      "Wiring a ring final for kitchen sockets"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "OTHER",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "application",
      "units",
      "terminology"
    ],
    "learningOutcomeId": "203-3A111-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Data and communications circuits are designed for signal transmission, such as Ethernet (Cat5e/Cat6) for computer networking."
  },
  {
    "id": 4024,
    "question": "If a 230 V circuit supplies a heater with a resistance of 46 Ω, what is the current flowing in the circuit?",
    "options": [
      "5 A",
      "10580 A",
      "0.2 A",
      "276 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "MULTIPLIED_INSTEAD",
      "2": "RECIPROCAL_ERROR",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Rules",
    "tags": [
      "ohms-law",
      "calculation",
      "power"
    ],
    "learningOutcomeId": "203-3A111-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Using Ohm's Law (I = V / R), the current is 230 V / 46 Ω = 5 A."
  },
  {
    "id": 4025,
    "question": "A circuit has a total power consumption of 2.3 kW at 230 V. Calculate the current.",
    "options": [
      "10 A",
      "0.1 A",
      "529 A",
      "23 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "DIVIDED_INSTEAD",
      "2": "MULTIPLIED_INSTEAD",
      "3": "UNITS_MISSING"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Rules",
    "tags": [
      "power",
      "calculation",
      "units"
    ],
    "learningOutcomeId": "203-3A111-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Using the power formula (I = P / V), first convert 2.3 kW to 2300 W. Then, 2300 W / 230 V = 10 A."
  },
  {
    "id": 4026,
    "question": "Which characteristic best describes a radial circuit in a domestic installation?",
    "options": [
      "The circuit cable runs from the consumer unit to the last point on the circuit without returning",
      "The circuit cable forms a continuous loop starting and ending at the consumer unit",
      "All components on the circuit are connected in a single series string",
      "The circuit is only used for high-voltage industrial machinery"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "USED_SERIES_RULE",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "terminology",
      "conceptual",
      "discrimination"
    ],
    "learningOutcomeId": "203-3A111-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "A radial circuit runs from the source (consumer unit) to the various points or outlets and ends at the final point, unlike a ring final circuit which returns to the source."
  },
  {
    "id": 4027,
    "question": "Two resistors with values of 10 Ω and 20 Ω are connected in series. What is the total resistance of the circuit?",
    "options": [
      "30 Ω",
      "6.67 Ω",
      "200 Ω",
      "10 Ω"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_PARALLEL_RULE",
      "2": "MULTIPLIED_INSTEAD",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "series",
      "resistance-rule",
      "calculation"
    ],
    "learningOutcomeId": "203-3A111-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "In a series circuit, total resistance is the sum of all individual resistances (Rt = R1 + R2)."
  },
  {
    "id": 4028,
    "question": "In a standard domestic 230V parallel lighting circuit, what is the voltage across each individual lamp?",
    "options": [
      "230 V",
      "The voltage is divided equally between the number of lamps",
      "0 V",
      "460 V"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "OTHER",
      "3": "MULTIPLIED_INSTEAD"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "parallel",
      "voltage-rule",
      "conceptual"
    ],
    "learningOutcomeId": "203-3A111-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "In a parallel circuit, the voltage across each branch remains the same as the supply voltage."
  },
  {
    "id": 4029,
    "question": "An electrician is installing a circuit specifically for the purpose of transmitting internet and telephone signals. Which circuit category does this fall into?",
    "options": [
      "Data and communications",
      "Control and automation",
      "Power and heating",
      "Emergency and alarm"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "OTHER",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "application",
      "terminology",
      "discrimination"
    ],
    "learningOutcomeId": "203-3A111-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Circuits used for IT, internet, and telephones are classified as data and communications circuits."
  },
  {
    "id": 4030,
    "question": "A series circuit consists of two identical heating elements. If the total resistance is 40 Ω, what is the resistance of each individual element?",
    "options": [
      "20 Ω",
      "80 Ω",
      "40 Ω",
      "1600 Ω"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "MULTIPLIED_INSTEAD",
      "2": "OTHER",
      "3": "FORMULA_NOT_REARRANGED"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "series",
      "resistance-rule",
      "calculation"
    ],
    "learningOutcomeId": "203-3A111-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "In a series circuit with identical components, the total resistance is the sum of the parts. Therefore, 40 Ω / 2 = 20 Ω per element."
  },
  {
    "id": 4031,
    "question": "A heating installation uses two parallel heating elements with resistances of 40 Ω and 60 Ω. What is the total resistance of this circuit?",
    "options": [
      "24 Ω",
      "100 Ω",
      "2400 Ω",
      "50 Ω"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_SERIES_RULE",
      "2": "MULTIPLIED_INSTEAD",
      "3": "ROUNDING_ERROR"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "parallel",
      "calculation",
      "resistance-rule"
    ],
    "learningOutcomeId": "203-3A111-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "For parallel circuits, the total resistance (Rt) is calculated using (R1 x R2) / (R1 + R2). So, (40 x 60) / (40 + 60) = 2400 / 100 = 24 Ω."
  },
  {
    "id": 4032,
    "question": "Which of the following best describes the current behavior in a standard UK 32A ring final circuit?",
    "options": [
      "Current has two paths from the consumer unit to every socket-outlet",
      "Current flows in one direction only around the loop to the last socket",
      "The current is the same at every point in the circuit loop",
      "Voltage increases as current travels further from the source"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "USED_SERIES_RULE",
      "3": "CONFUSED_I_V_R"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "parallel",
      "conceptual",
      "current-rule"
    ],
    "learningOutcomeId": "203-3A111-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "A ring final circuit is a type of parallel circuit where the cable forms a loop, providing two paths for the current to reach any given point."
  },
  {
    "id": 4033,
    "question": "An electrician is installing a 230V radial circuit for a small workshop. If the circuit serves a 2kW heater and a 1kW extractor fan running simultaneously, what is the approximate total current?",
    "options": [
      "13.04 A",
      "4.35 A",
      "3000 A",
      "0.07 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "FORMULA_NOT_REARRANGED",
      "2": "UNITS_MISSING",
      "3": "DIVIDED_INSTEAD"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "calculation",
      "power",
      "ohms-law"
    ],
    "learningOutcomeId": "203-3A111-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "Total Power = 2000W + 1000W = 3000W. Using I = P / V: 3000 / 230 = 13.04 A."
  },
  {
    "id": 4034,
    "question": "In a series-connected emergency lighting control string, there are three identical indicator lamps. If the total supply voltage is 24V, what is the voltage drop across each lamp?",
    "options": [
      "8V",
      "24V",
      "72V",
      "3V"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_PARALLEL_RULE",
      "2": "MULTIPLIED_INSTEAD",
      "3": "CONFUSED_I_V_R"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "series",
      "voltage-rule",
      "calculation"
    ],
    "learningOutcomeId": "203-3A111-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "In a series circuit, the total voltage is shared across the components. For three identical components: 24V / 3 = 8V each."
  },
  {
    "id": 4035,
    "question": "When installing data and communication cabling near power circuits, why is physical separation or screening required?",
    "options": [
      "To prevent electromagnetic interference from power cables affecting data signals",
      "To ensure the data cables don't overheat the power cables",
      "To allow the data cables to carry higher voltage in emergencies",
      "To prevent the data circuit from drawing current from the ring final"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_AC_DC_SOURCES",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "conceptual",
      "terminology",
      "application"
    ],
    "learningOutcomeId": "203-3A111-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Data cables operate at high frequencies and low voltages, making them susceptible to electromagnetic interference (EMI) from nearby power cables."
  },
  {
    "id": 4036,
    "question": "An electrician measures the end-to-end resistance of the phase conductor (r1) in a ring final circuit as 0.8 Ω. What should be the expected resistance (R1) measured at the furthest point of the loop?",
    "options": [
      "0.2 Ω",
      "0.4 Ω",
      "1.6 Ω",
      "0.8 Ω"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "DIVIDED_INSTEAD",
      "2": "MULTIPLIED_INSTEAD",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "calculation",
      "resistance-rule",
      "application"
    ],
    "learningOutcomeId": "203-3A111-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "In a ring final circuit, the resistance at the furthest point (R1) is 1/4 of the end-to-end resistance (r1). So, 0.8 / 4 = 0.2 Ω."
  },
  {
    "id": 4037,
    "question": "Which type of circuit is specifically designed to allow a low-voltage switch to safely operate a high-power industrial motor?",
    "options": [
      "Control circuit",
      "Ring final circuit",
      "Radial power circuit",
      "Data circuit"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "conceptual",
      "application",
      "terminology"
    ],
    "learningOutcomeId": "203-3A111-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "Control circuits use low power/voltage signals (often via relays or contactors) to manage and switch higher power loads safely."
  },
  {
    "id": 4038,
    "question": "A radial circuit has three loads connected in parallel: a 5A light, a 10A heater, and a 2A fan. What is the total current supplied by the consumer unit?",
    "options": [
      "17 A",
      "5.6 A",
      "100 A",
      "2 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "RECIPROCAL_ERROR",
      "2": "MULTIPLIED_INSTEAD",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "calculation",
      "current-rule",
      "parallel"
    ],
    "learningOutcomeId": "203-3A111-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "In a parallel circuit, the total current (It) is the sum of the individual branch currents: 5 + 10 + 2 = 17 A."
  },
  {
    "id": 4039,
    "question": "What is the primary reason for wiring domestic smoke alarms on a dedicated circuit or a regularly used local lighting circuit?",
    "options": [
      "To ensure the supply is not accidentally turned off and remains monitored",
      "To allow the smoke alarm to use the same 1.5mm² cable as the lights",
      "To increase the voltage available to the alarm during a fire",
      "To prevent the alarm from being affected by electromagnetic interference"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "CONFUSED_I_V_R"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "application",
      "health-safety",
      "conceptual"
    ],
    "learningOutcomeId": "203-3A111-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "Smoke alarms need a reliable supply. Wiring them to a regularly used lighting circuit ensures that if the circuit trips, the user will notice immediately because the lights won't work."
  },
  {
    "id": 4040,
    "question": "Calculate the total power consumed by a 230V radial circuit supplying four 60W lamps and one 500W floodlight.",
    "options": [
      "740 W",
      "560 W",
      "240 W",
      "1200 W"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "ROUNDING_ERROR",
      "2": "UNITS_MISSING",
      "3": "MULTIPLIED_INSTEAD"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "calculation",
      "power",
      "units"
    ],
    "learningOutcomeId": "203-3A111-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Total Power = (4 x 60W) + 500W = 240W + 500W = 740W."
  },
  {
    "id": 4041,
    "question": "A ring final circuit has a measured end-to-end resistance (r1) of 0.80 Ω. What is the theoretical resistance measured at a socket outlet at the furthest point of the ring, assuming no spurs?",
    "options": [
      "0.20 Ω",
      "0.80 Ω",
      "0.40 Ω",
      "1.60 Ω"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "DIVIDED_INSTEAD",
      "3": "MULTIPLIED_INSTEAD"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "parallel",
      "calculation",
      "resistance-rule"
    ],
    "learningOutcomeId": "203-3A111-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "In a ring final circuit, the resistance at the furthest point (R1) is calculated as (r1 + r2) / 4. For the line conductor alone, it is r1 / 4. 0.80 / 4 = 0.20 Ω."
  },
  {
    "id": 4042,
    "question": "Why is a ring final circuit often preferred over a radial circuit for supplying standard socket outlets in a large domestic area?",
    "options": [
      "It allows for a smaller cable cross-sectional area by providing two paths for current",
      "It significantly reduces the total length of cable required for the installation",
      "It makes the process of fault-finding much simpler for the electrician",
      "It prevents voltage drop from occurring at the furthest point of the circuit"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "OTHER",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "conceptual",
      "application",
      "terminology"
    ],
    "learningOutcomeId": "203-3A111-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "By looping the circuit back to the consumer unit, current is shared between two paths, allowing a 32A circuit to use 2.5mm² cable which would typically only carry 20-27A in a radial arrangement."
  },
  {
    "id": 4043,
    "question": "A 230V radial circuit supplies a 2.3kW jet wash. If the total resistance of the circuit conductors is 0.15 Ω, what is the voltage drop at the appliance when in use?",
    "options": [
      "1.5V",
      "15V",
      "34.5V",
      "0.15V"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "MULTIPLIED_INSTEAD",
      "2": "CONFUSED_I_V_R",
      "3": "UNITS_MISSING"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "ohms-law",
      "calculation",
      "voltage-rule"
    ],
    "learningOutcomeId": "203-3A111-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 100,
    "explanation": "First find current: I = P / V = 2300 / 230 = 10A. Then find voltage drop: V = I * R = 10 * 0.15 = 1.5V."
  },
  {
    "id": 4044,
    "question": "An electrician is installing a two-way lighting circuit in a hallway. Which specific conductors are required between the two switches to allow independent control?",
    "options": [
      "Two strappers and a common",
      "A single phase and a neutral",
      "A series link and an earth",
      "Two neutrals and a switch wire"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "OTHER",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "application",
      "terminology",
      "conceptual"
    ],
    "learningOutcomeId": "203-3A111-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Two-way switching requires three-core and earth cable between switches, providing two 'strapper' wires and a 'common' return/feed to enable the switching logic."
  },
  {
    "id": 4045,
    "question": "What is the primary reason for maintaining physical separation between data/communication cables and 230V power cables in a trunking system?",
    "options": [
      "To prevent electromagnetic interference (EMI) from affecting signal integrity",
      "To prevent the data cables from overheating due to high resistance",
      "To ensure the 230V cables do not experience a drop in frequency",
      "To stop the data cables from drawing excess current from the mains"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "CONFUSED_FREQUENCY_WITH_VOLTAGE",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "conceptual",
      "application",
      "legislation"
    ],
    "learningOutcomeId": "203-3A111-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "High voltage AC power cables create electromagnetic fields that can induce noise (EMI) into sensitive low-voltage data cables, causing data corruption."
  },
  {
    "id": 4046,
    "question": "Two identical 60 Ω heating elements are connected in parallel within an industrial heater. What is the total resistance of the heating circuit?",
    "options": [
      "30 Ω",
      "120 Ω",
      "60 Ω",
      "3600 Ω"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_SERIES_RULE",
      "2": "OTHER",
      "3": "MULTIPLIED_INSTEAD"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "parallel",
      "calculation",
      "resistance-rule"
    ],
    "learningOutcomeId": "203-3A111-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "For two identical resistors in parallel, the total resistance is half of one resistor: 60 / 2 = 30 Ω."
  },
  {
    "id": 4047,
    "question": "A 'non-maintained' emergency lighting luminaire is installed in a commercial office. Under which condition will this specific light operate?",
    "options": [
      "Only when the normal mains power supply fails",
      "Continuously while the building is occupied",
      "Only when the fire alarm system is activated",
      "When the ambient light level drops below a set lux level"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "OTHER",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "conceptual",
      "terminology",
      "health-safety"
    ],
    "learningOutcomeId": "203-3A111-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Non-maintained emergency lights are designed to stay off during normal operation and only illuminate using battery power if the local mains supply fails."
  },
  {
    "id": 4048,
    "question": "In a 32A ring final circuit, a 20A load is connected at a socket exactly halfway around the ring. How much current flows through each of the two legs of the ring back to the consumer unit?",
    "options": [
      "10A",
      "20A",
      "32A",
      "5A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "OTHER",
      "3": "DIVIDED_INSTEAD"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "current-rule",
      "calculation",
      "application"
    ],
    "learningOutcomeId": "203-3A111-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 80,
    "explanation": "In a ring circuit, the current splits. If the load is at the midpoint and resistances are equal, the current divides equally: 20A / 2 = 10A per leg."
  },
  {
    "id": 4049,
    "question": "What is the primary function of a relay when used in a motor control circuit?",
    "options": [
      "To use a low-current control signal to switch a high-current load",
      "To convert AC supply into a DC supply for the motor",
      "To increase the voltage to compensate for cable resistance",
      "To provide a manual means of isolating the circuit for maintenance"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TRANSFORMER_WITH_AC_DC",
      "2": "OTHER",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "conceptual",
      "relays",
      "application"
    ],
    "learningOutcomeId": "203-3A111-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Relays allow for isolation between a control circuit (often low voltage/current) and the power circuit (high current), providing safety and control flexibility."
  },
  {
    "id": 4050,
    "question": "A radial lighting circuit supplies six 40W lamps and four 10W LED panels. What is the total current drawn by the circuit at a nominal voltage of 230V?",
    "options": [
      "1.22A",
      "0.22A",
      "2.80A",
      "0.17A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "MULTIPLIED_INSTEAD",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "calculation",
      "power",
      "ohms-law"
    ],
    "learningOutcomeId": "203-3A111-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 100,
    "explanation": "Total Power = (6 * 40) + (4 * 10) = 240 + 40 = 280W. Current (I) = P / V = 280 / 230 = 1.217A (rounded to 1.22A)."
  },
  {
    "id": 4051,
    "question": "An electrician is testing a series-connected heating circuit containing three elements with resistances of 20 Ω, 30 Ω, and 50 Ω. If the circuit is connected to a 230 V supply, what is the total current flowing through the 30 Ω element?",
    "options": [
      "2.3 A",
      "7.6 A",
      "23.0 A",
      "0.43 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_PARALLEL_RULE",
      "2": "ROUNDING_ERROR",
      "3": "FORMULA_NOT_REARRANGED"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "series",
      "calculation",
      "ohms-law"
    ],
    "learningOutcomeId": "203-3A111-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "In a series circuit, the total resistance (Rt) is the sum of all resistances: 20 + 30 + 50 = 100 Ω. Using Ohm's Law (I = V / R), the total current is 230 V / 100 Ω = 2.3 A. In a series circuit, the current is the same at all points."
  },
  {
    "id": 4052,
    "question": "Which of the following best describes the electrical behavior of a Ring Final Circuit used in UK domestic power installations?",
    "options": [
      "Current splits into two paths from the consumer unit to reach each socket outlet",
      "The total resistance increases as more socket outlets are added to the ring",
      "The voltage is divided equally between every socket outlet on the ring",
      "Current must flow through every appliance in sequence to complete the circuit"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_SERIES_RULE",
      "2": "TOPOLOGY_CONFUSION",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "parallel",
      "conceptual",
      "application"
    ],
    "learningOutcomeId": "203-3A111-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "A Ring Final Circuit is a type of parallel circuit where the cable forms a loop. This provides two paths for the current to reach any point, which effectively increases the current-carrying capacity of the cable used."
  },
  {
    "id": 4053,
    "question": "A maintenance technician is checking a parallel-connected extraction system. Two identical fans, each with a resistance of 460 Ω, are connected in parallel to a 230 V supply. What is the total resistance of the circuit?",
    "options": [
      "230 Ω",
      "920 Ω",
      "460 Ω",
      "0.004 Ω"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_SERIES_RULE",
      "2": "TOPOLOGY_CONFUSION",
      "3": "RECIPROCAL_ERROR"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "parallel",
      "calculation",
      "resistance-rule"
    ],
    "learningOutcomeId": "203-3A111-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "For two identical resistors in parallel, the total resistance is half of one resistor (R / n). Therefore, 460 Ω / 2 = 230 Ω. Alternatively, using the product-over-sum rule: (460 * 460) / (460 + 460) = 230 Ω."
  },
  {
    "id": 4054,
    "question": "In a commercial warehouse, a radial circuit is used for the emergency lighting system. If one lamp in the middle of the radial run fails due to a 'blown' bulb (open circuit), what will happen to the remaining lamps further down the circuit?",
    "options": [
      "They will continue to operate normally",
      "They will all go out because the path is broken",
      "They will become brighter due to increased voltage",
      "The circuit breaker will trip immediately"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_SERIES_RULE",
      "2": "TOPOLOGY_CONFUSION",
      "3": "CONFUSED_I_V_R"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "application",
      "conceptual",
      "discrimination"
    ],
    "learningOutcomeId": "203-3A111-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Standard lighting radials are wired in parallel. While the cable layout is 'radial' (from the source to the last point), the loads themselves are connected in parallel across the live and neutral. An open circuit in one bulb does not break the path for others."
  },
  {
    "id": 4055,
    "question": "Two identical 115 V signal lamps are accidentally wired in series and connected to a 230 V AC supply. What is the voltage drop across each lamp, and how will they perform?",
    "options": [
      "115 V each; they will both operate at normal brightness",
      "230 V each; they will both burn out immediately",
      "115 V each; they will be very dim due to shared current",
      "230 V total; only the first lamp in the circuit will light up"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_PARALLEL_RULE",
      "2": "TOPOLOGY_CONFUSION",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "series",
      "voltage-rule",
      "calculation"
    ],
    "learningOutcomeId": "203-3A111-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "In a series circuit with identical resistances, the supply voltage is divided equally. 230 V / 2 = 115 V per lamp. Since the lamps are rated at 115 V, they will receive their design voltage and operate at normal brightness."
  },
  {
    "id": 4056,
    "question": "A ring final circuit is being tested for continuity. The end-to-end resistance of the phase conductor (r1) is 0.80 Ω and the neutral conductor (rn) is 0.80 Ω. What is the expected phase-to-neutral loop resistance (Rpn) measured at a socket-outlet located exactly at the midpoint of the ring?",
    "options": [
      "0.40 Ω",
      "0.20 Ω",
      "0.80 Ω",
      "1.60 Ω"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "DIVIDED_INSTEAD",
      "2": "TOPOLOGY_CONFUSION",
      "3": "USED_SERIES_RULE"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "calculation",
      "ring-final",
      "resistance-rule"
    ],
    "learningOutcomeId": "203-3A111-LO1",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 150,
    "explanation": "In a ring final circuit, the resistance at the midpoint (Rpn) is calculated as (r1 + rn) / 4. Here, (0.80 + 0.80) / 4 = 1.60 / 4 = 0.40 Ω."
  },
  {
    "id": 4057,
    "question": "An industrial control circuit uses a 24V DC PLC to operate a 400V AC three-phase motor. Which component is essential to provide electrical separation between the low voltage power circuit and the extra-low voltage control circuit?",
    "options": [
      "A contactor or relay",
      "A step-up transformer",
      "A bridge rectifier",
      "A double-pole isolator"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TRANSFORMER_WITH_AC_DC",
      "2": "CONFUSED_AC_DC_SOURCES",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "conceptual",
      "application",
      "relays"
    ],
    "learningOutcomeId": "203-3A111-LO1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "Relays and contactors allow a low-voltage control signal to safely switch a high-voltage power circuit while maintaining physical and electrical separation between the two systems."
  },
  {
    "id": 4058,
    "question": "A radial power circuit supplies a 6kW electric heater at 230V. The circuit uses 4mm² cable with a voltage drop value of 11mV/A/m and is 18 metres long. Calculate the total voltage drop for this circuit.",
    "options": [
      "5.17 V",
      "1.19 V",
      "21.45 V",
      "11.88 V"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "FORMULA_NOT_REARRANGED",
      "2": "UNITS_MISSING",
      "3": "MULTIPLIED_INSTEAD"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "calculation",
      "ohms-law",
      "voltage-rule"
    ],
    "learningOutcomeId": "203-3A111-LO2",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 180,
    "explanation": "First find current: I = P/V = 6000/230 = 26.09A. Then Vd = (mV/A/m × I × L) / 1000 = (11 × 26.09 × 18) / 1000 = 5.165V, rounded to 5.17V."
  },
  {
    "id": 4059,
    "question": "When installing data and communications cabling alongside 230V power circuits, what is the primary reason for maintaining a minimum separation distance or using screened cables?",
    "options": [
      "To prevent electromagnetic interference (EMI) corrupting signals",
      "To stop the data cable from overheating the power cable",
      "To ensure the data cable reaches its maximum current carrying capacity",
      "To prevent the power circuit from drawing current from the data line"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_I_V_R",
      "2": "TOPOLOGY_CONFUSION",
      "3": "CONFUSED_AC_DC_SOURCES"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "conceptual",
      "application",
      "discrimination"
    ],
    "learningOutcomeId": "203-3A111-LO1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 90,
    "explanation": "Data cables carry high-frequency, low-voltage signals that are highly susceptible to electromagnetic interference (EMI) produced by the magnetic fields around AC power cables."
  },
  {
    "id": 4060,
    "question": "A workshop has three identical 120 Ω heating elements connected in parallel to a 230V supply. What is the total current drawn by the circuit?",
    "options": [
      "5.75 A",
      "1.92 A",
      "0.64 A",
      "17.25 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "RECIPROCAL_ERROR",
      "2": "USED_SERIES_RULE",
      "3": "DIVIDED_INSTEAD"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "calculation",
      "parallel",
      "current-rule"
    ],
    "learningOutcomeId": "203-3A111-LO2",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 150,
    "explanation": "Total resistance Rt = R / n = 120 / 3 = 40 Ω. Total current It = V / Rt = 230 / 40 = 5.75 A."
  },
  {
    "id": 4061,
    "question": "In a large commercial building, why might a designer choose multiple radial circuits for lighting rather than a single large ring circuit?",
    "options": [
      "To ensure that a single fault does not result in the loss of all lighting",
      "Because radial circuits allow for higher current carrying capacity on smaller cables",
      "Because ring circuits are prohibited for use in lighting installations",
      "To reduce the total resistance of the lighting circuit to zero"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "USED_PARALLEL_RULE"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "conceptual",
      "discrimination",
      "application"
    ],
    "learningOutcomeId": "203-3A111-LO1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "Dividing lighting into multiple radial circuits provides better discrimination and continuity of service; if one circuit trips, the others remain functional."
  },
  {
    "id": 4062,
    "question": "A 9.2 kW electric shower is used for an average of 15 minutes per day. Calculate the total energy consumed by the shower in one week (7 days) in kilowatt-hours (kWh).",
    "options": [
      "16.1 kWh",
      "64.4 kWh",
      "2.3 kWh",
      "966.0 kWh"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "MULTIPLIED_INSTEAD",
      "2": "DIVIDED_INSTEAD",
      "3": "WRONG_UNITS"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "calculation",
      "energy",
      "conversion"
    ],
    "learningOutcomeId": "203-3A111-LO3",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 150,
    "explanation": "Daily energy = 9.2 kW × (15/60) hours = 2.3 kWh. Weekly energy = 2.3 kWh × 7 days = 16.1 kWh."
  },
  {
    "id": 4063,
    "question": "A circuit contains two resistors in parallel (10 Ω and 15 Ω) which are then connected in series with a 4 Ω resistor. If the total supply voltage is 20V, what is the current flowing through the 4 Ω resistor?",
    "options": [
      "2.0 A",
      "0.8 A",
      "5.0 A",
      "1.33 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_SERIES_RULE",
      "2": "RECIPROCAL_ERROR",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "calculation",
      "mixed-circuit",
      "ohms-law"
    ],
    "learningOutcomeId": "203-3A111-LO2",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 240,
    "explanation": "Parallel part: (10 × 15) / (10 + 15) = 150 / 25 = 6 Ω. Total resistance = 6 Ω + 4 Ω = 10 Ω. Total current = 20V / 10 Ω = 2A. Since the 4 Ω resistor is in series with the whole circuit, 2A flows through it."
  },
  {
    "id": 4064,
    "question": "Which of the following describes the 'fail-safe' principle typically applied to emergency alarm circuits?",
    "options": [
      "The circuit is designed so that a broken wire or loss of power triggers the alarm or a safe state",
      "The circuit is designed with redundant paths so that it never activates unless manually triggered",
      "The circuit uses high-resistance conductors to prevent current flow during a fault",
      "The circuit is disconnected from the main earthing terminal to prevent noise"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "TOPOLOGY_CONFUSION",
      "3": "HEALTH_SAFETY"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "conceptual",
      "application",
      "health-safety"
    ],
    "learningOutcomeId": "203-3A111-LO1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "Fail-safe design ensures that if the system fails (e.g., power cut or wire break), the system defaults to its safest mode, such as triggering an alarm or releasing fire doors."
  },
  {
    "id": 4065,
    "question": "A ring final circuit is protected by a 32A Type B MCB. If the circuit is modified by adding several high-power appliances, resulting in a total load of 40A distributed evenly around the ring, what is the most likely outcome?",
    "options": [
      "The MCB will eventually trip due to thermal overload",
      "The conductors will fail immediately while the MCB remains closed",
      "The current will automatically divide into 20A per leg, which is safe for 2.5mm² cable",
      "The voltage at the sockets will increase to compensate for the load"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_I_V_R",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "application",
      "ring-final",
      "current-rule"
    ],
    "learningOutcomeId": "203-3A111-LO1",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 150,
    "explanation": "The MCB is designed to protect the cable. If the load exceeds the 32A rating, the thermal element in the MCB will heat up and trip the circuit to prevent cable damage, even if the current is split between the two legs of the ring."
  }
];
