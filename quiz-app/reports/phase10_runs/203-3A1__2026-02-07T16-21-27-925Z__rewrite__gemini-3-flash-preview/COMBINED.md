# Phase 10 Debug Run

**Run ID:** 203-3A1__2026-02-07T16-21-27-925Z__rewrite__gemini-3-flash-preview
**Lesson:** 203-3A1
**Strategy:** rewrite
**Timestamp:** 2026-02-07T16:21:27.924Z
**Status:** success

================================================================================

## Summary

- **Score Before:** 94/100 (Strong)
- **Score After:** 95/100 (Strong)
- **Delta:** +1 points
- **Validation:** ✅ PASSED

================================================================================

## Input & Output Lesson Files

### Input Lesson (Before Refinement)

**File:** `00_input_lesson.json`

```json
{
  "id": "203-3A1",
  "title": "203.3A1 — Circuit Types: What They Do",
  "description": "Learn about Circuit Types: What They Do in Electrical Installations Technology",
  "layout": "split-vis",
  "unit": "Unit 203",
  "topic": "Circuit Types: What They Do",
  "learningOutcomes": [
    "Identify the primary functions of different circuit types including lighting, power, and data",
    "Describe the operating principles of ring final and radial circuit topologies",
    "Explain the typical applications for specialized circuits such as emergency lighting and control systems"
  ],
  "prerequisites": [],
  "blocks": [
    {
      "id": "203-3A1-outcomes",
      "type": "outcomes",
      "order": 1,
      "content": {
        "outcomes": [
          {
            "text": "Identify the primary functions of different circuit types including lighting, power, and data",
            "bloomLevel": "remember"
          },
          {
            "text": "Describe the operating principles of ring final and radial circuit topologies",
            "bloomLevel": "understand"
          },
          {
            "text": "Explain the typical applications for specialized circuits such as emergency lighting and control systems",
            "bloomLevel": "understand"
          }
        ]
      }
    },
    {
      "id": "203-3A1-vocab",
      "type": "vocab",
      "order": 2,
      "content": {
        "terms": [
          {
            "term": "Final Circuit",
            "definition": "A circuit intended to supply electrical energy directly to current-using equipment or socket-outlets."
          },
          {
            "term": "Radial Circuit",
            "definition": "An electrical circuit that originates from a distribution board and runs to one or more points, terminating at the final outlet."
          },
          {
            "term": "Ring Final Circuit",
            "definition": "A circuit that starts and ends at the same protective device in the distribution board, forming a continuous loop to supply socket-outlets."
          },
          {
            "term": "Control Circuit",
            "definition": "A circuit used to regulate or manage the operation of other electrical equipment or larger power circuits."
          },
          {
            "term": "Data Circuit",
            "definition": "A specialized circuit designed for the transmission of digital information rather than the distribution of power."
          },
          {
            "term": "Emergency Lighting",
            "definition": "Lighting intended to provide illumination for the safety of people leaving a location when the normal power supply fails."
          }
        ]
      }
    },
    {
      "id": "203-3A1-diagram",
      "type": "diagram",
      "order": 3,
      "content": {
        "title": "Circuit Types: What They Do Diagram",
        "description": "Visual representation of Circuit Types: What They Do",
        "videoUrl": "",
        "diagramType": "circuit",
        "elementIds": [
          "ring-final-circuit",
          "radial-circuit",
          "distribution-board",
          "socket-outlet",
          "final-circuit",
          "control-circuit",
          "data-circuit"
        ],
        "placeholderText": "The diagram should show two side-by-side comparisons. On the left, a distribution-board with a radial-circuit extending to three socket-outlet symbols in a linear line, ending at the last one. On the right, the same distribution-board with a ring-final-circuit shown as a continuous loop: two conductors leaving the same breaker, visiting several socket-outlet points in a circle, and both returning to the same terminal. Labels should clearly identify each as a final-circuit type. Additionally, include a small inset diagram showing a Data Circuit (using twisted-pair symbols) and a Control Circuit (connecting a sensor to a load) to illustrate functional variety beyond power distribution."
      }
    },
    {
      "id": "203-3A1-explain-1",
      "type": "explanation",
      "order": 4,
      "content": {
        "title": "Functional Circuit Categories",
        "content": "### In this lesson\nThis lesson explores how to identify the primary functions of different circuit types including lighting, power, and data. As shown in the functional diagram, different circuits serve distinct purposes. You are acting as an installation technician planning the layout of a new mixed-use building. \n\n*   Differentiate between power, lighting, and specialized circuits.\n*   Understand the purpose of control and data transmission systems.\n*   Identify the unique requirements for emergency and safety systems.\n\n**What this is**\nIn any electrical installation, every **Final Circuit** is categorized by its intended function. A **Final Circuit** is a circuit intended to supply electrical energy directly to current-using equipment or socket-outlets. Common categories include lighting circuits for illumination, power circuits for general-purpose socket-outlets, and specialized circuits like a **Control Circuit** or a **Data Circuit**.\n\n**Why it matters**\nUnderstanding circuit functions is critical for safety and efficiency. Separating functions ensures that a fault on a power circuit (such as a tripped socket) does not plunge a whole building into darkness. This ensures **safety of movement**, allowing occupants to navigate the building using the still-functioning lighting circuits. Specialized systems like emergency lighting must also be identified correctly to ensure they function during a mains failure.\n\n**Key facts / rules**\n*   Lighting circuits typically supply fixed luminaires and are often rated lower than power circuits.\n*   Power circuits supply socket-outlets or fixed appliances like heaters and cookers.\n*   A **Control Circuit** is used to regulate or manage the operation of other electrical equipment, often facilitating **remote switching** of high-power loads via thermostats or sensors.\n*   A **Data Circuit** is designed for the transmission of information rather than power distribution, often using twisted-pair or fiber-optic cabling.\n*   Emergency lighting circuits must provide illumination when the normal supply fails.\n*   All circuits must be clearly identified at the distribution board according to BS 7671 to prevent dangerous mistakes during maintenance.\n\n**When to choose it**\nYou should choose a dedicated lighting circuit when the primary goal is to provide fixed illumination. Power circuits are selected for general-purpose use. You would select a **Control Circuit** when you need to manage a high-power load from a remote switch or sensor. **Data Circuit** selection is necessary for networking. Emergency lighting is chosen specifically for escape routes to ensure safety during power outages.\n\n**Common mistakes**\nOne common error is mixing functional types, such as connecting a high-power heater to a lighting circuit. Another mistake is failing to provide adequate separation between power cables and a **Data Circuit**, which can lead to electromagnetic interference (EMI).\n\n**Key Points**\n*   A **Final Circuit** delivers energy or signals directly to the end-user equipment.\n*   Lighting and power circuits must be separated to maintain continuity of service and **safety of movement**.\n*   **Control Circuit** arrangements allow for the safe management of loads through **remote switching**.\n*   **Data Circuit** systems focus on information transmission and require protection from interference.\n*   Emergency lighting provides critical illumination during mains power failure.\n*   All circuits must be clearly identified at the distribution board to BS 7671 standards.\n\n**Quick recap**\nElectrical installations are divided into functional categories to ensure safety and usability. Lighting, power, control, data, and emergency circuits each serve a specific role. Proper identification and selection of these types are essential for a compliant installation."
      }
    },
    {
      "id": "203-3A1-check-1",
      "type": "practice",
      "order": 4.5,
      "content": {
        "title": "Check Your Understanding: Functional Circuit Categories",
        "mode": "conceptual",
        "sequential": true,
        "questions": [
          {
            "id": "203-3A1-C1-L1-A",
            "questionText": "What is the purpose of a Final Circuit?",
            "answerType": "short-text",
            "cognitiveLevel": "recall",
            "expectedAnswer": [
              "supply energy to equipment",
              "supply current-using equipment",
              "supply socket-outlets",
              "energy delivery to equipment",
              "powering end-use devices",
              "supply energy to outlets",
              "supply current to equipment"
            ],
            "hint": "Look at the definition of a circuit that delivers energy to end-user equipment."
          },
          {
            "id": "203-3A1-C1-L1-B",
            "questionText": "What is the specific function of a Control Circuit?",
            "answerType": "short-text",
            "cognitiveLevel": "recall",
            "expectedAnswer": [
              "regulate or manage equipment",
              "manage operation of equipment",
              "control other electrical equipment",
              "manage power circuits",
              "remote switching"
            ],
            "hint": "Identify the circuit type used for managing the operation of other systems."
          },
          {
            "id": "203-3A1-C1-L1-C",
            "questionText": "What is the primary purpose for selecting a Data Circuit?",
            "answerType": "short-text",
            "cognitiveLevel": "recall",
            "expectedAnswer": [
              "transmission of information",
              "information transfer",
              "digital or analogue information",
              "data transmission"
            ],
            "hint": "Consider what type of circuit is chosen when information transfer is the priority."
          },
          {
            "id": "203-3A1-C1-L2",
            "questionText": "What is a primary safety benefit of separating lighting and power into different functional categories?",
            "answerType": "short-text",
            "cognitiveLevel": "connection",
            "expectedAnswer": [
              "continuity of service",
              "prevent loss of lighting",
              "fault isolation",
              "maintain illumination",
              "safety of movement"
            ],
            "hint": "Think about what happens to the lights if a socket-outlet circuit trips and how that affects people moving in the building."
          }
        ]
      }
    },
    {
      "id": "203-3A1-explain-2",
      "type": "explanation",
      "order": 5,
      "content": {
        "title": "Circuit Topologies: Ring vs Radial",
        "content": "### In this lesson\nIn this section, we examine the operating principles of ring final and radial circuit topologies. As shown in the diagram's comparison of topologies, circuit layout is key. You are designing the wiring layout for a domestic dwelling to determine the most efficient way to connect socket-outlets. \n\n*   Describe the continuous loop principle of a ring final circuit.\n*   Identify the start-to-finish layout of a radial circuit.\n*   Compare the typical applications for both circuit arrangements.\n\n**What this is**\nCircuit topology refers to the physical layout of the wiring. In the UK, the two most common topologies for a **Final Circuit** are the **Radial Circuit** and the **Ring Final Circuit**. A **Radial Circuit** originates from a distribution board and runs to one or more points, terminating at the final outlet. In contrast, a **Ring Final Circuit** starts and ends at the same protective device in the distribution board, forming a continuous loop to supply socket-outlets.\n\n**Why it matters**\nThe choice of topology affects cable usage and load handling. A **Ring Final Circuit** allows for smaller conductors to supply a larger area because the load is shared across two paths. However, if the loop is broken (a \"broken ring\"), the circuit may still appear to work while overstressing the remaining cable. This poses a severe **overheating and fire risk** because the conductors are no longer sharing the load as designed. A **Radial Circuit** is simpler to test but may require larger cables for high-power appliances.\n\n**Key facts / rules**\n*   A **Radial Circuit** is like a branch of a tree, stopping at the last point of use.\n*   A **Ring Final Circuit** must be a continuous loop to function as intended by design.\n*   Radial circuits are commonly used for lighting and high-load fixed appliances like cookers.\n*   Ring final circuits are typically used for general-purpose socket-outlets.\n*   In a ring, current travels in both directions from the distribution board to the load.\n\n**When to choose it**\nChoose a **Radial Circuit** for dedicated high-power appliances, such as an electric shower, where the load is at a single point. Radials are also the standard choice for lighting. Choose a **Ring Final Circuit** when you need to provide many socket-outlets over a large floor area, as it is often more cost-effective for cable usage.\n\n**Common mistakes**\nA major mistake is creating an \"interconnected\" circuit with a bridge. Another is failing to ensure both ends of a **Ring Final Circuit** are terminated into the same terminal. Failing to verify the continuity of the ring during commissioning can leave a dangerous \"broken ring\" undetected, leading to potential **overheating** of the conductors.\n\n**Key Points**\n*   **Radial Circuit** topology runs from the source to the last point and stops.\n*   **Ring Final Circuit** topology forms a complete loop back to the source.\n*   Rings support higher total loads with smaller cables but carry an **overheating and fire risk** if the loop is broken.\n*   Radials are simpler to diagnose and used for lighting and heavy fixed loads.\n\n**Quick recap**\nRadials follow a linear path, while ring final circuits form a loop. Each has advantages depending on the load type and area served, but rings require careful continuity testing to ensure safety."
      }
    },
    {
      "id": "203-3A1-check-2",
      "type": "practice",
      "order": 5.5,
      "content": {
        "title": "Check Your Understanding: Circuit Topologies: Ring vs Radial",
        "mode": "conceptual",
        "sequential": true,
        "questions": [
          {
            "id": "203-3A1-C2-L1-A",
            "questionText": "Identify the path of a Radial Circuit from the distribution board.",
            "answerType": "short-text",
            "cognitiveLevel": "recall",
            "expectedAnswer": [
              "originates from distribution board",
              "runs to one or more points",
              "terminates at final outlet",
              "linear path"
            ],
            "hint": "Describe the linear path this circuit takes from its source."
          },
          {
            "id": "203-3A1-C2-L1-B",
            "questionText": "Where does a Ring Final Circuit start and end?",
            "answerType": "short-text",
            "cognitiveLevel": "recall",
            "expectedAnswer": [
              "same protective device",
              "distribution board",
              "source and end at same terminal",
              "breaker",
              "consumer unit",
              "fuse board"
            ],
            "hint": "Identify the location where both ends of the loop are terminated."
          },
          {
            "id": "203-3A1-C2-L1-C",
            "questionText": "What specific physical condition must a Ring Final Circuit meet to function as intended?",
            "answerType": "short-text",
            "cognitiveLevel": "recall",
            "expectedAnswer": [
              "continuous loop",
              "closed loop",
              "no breaks in loop",
              "complete ring"
            ],
            "hint": "State the necessary loop requirement for this topology to work correctly."
          },
          {
            "id": "203-3A1-C2-L2",
            "questionText": "State the primary safety risk associated with a broken ring final circuit.",
            "answerType": "short-text",
            "cognitiveLevel": "connection",
            "expectedAnswer": [
              "overheating",
              "fire risk",
              "overstressing cable",
              "cable failure",
              "overloaded conductor"
            ],
            "hint": "Consider what happens to the remaining cable if the load-sharing loop is broken."
          }
        ]
      }
    },
    {
      "id": "203-3A1-practice",
      "type": "practice",
      "order": 8,
      "content": {
        "title": "Your Turn (You Do)",
        "questions": [
          {
            "id": "203-3A1-P1",
            "questionText": "Identify the specialized circuit type required to provide illumination for the safety of people leaving a location when the normal power supply fails.",
            "answerType": "short-text",
            "expectedAnswer": [
              "Emergency Lighting",
              "Emergency Lighting Circuit",
              "Emergency Lights",
              "Emergency lighting system"
            ],
            "hint": "Consider the systems designed to operate when the main power supply is lost."
          },
          {
            "id": "203-3A1-P2",
            "questionText": "An installation technician is planning general-purpose socket-outlets across a large domestic floor area. Which circuit topology is most cost-effective for cable usage in this scenario?",
            "answerType": "short-text",
            "expectedAnswer": [
              "Ring Final Circuit",
              "A Ring Final Circuit",
              "Ring Final",
              "Ring circuit",
              "Ring topology"
            ],
            "hint": "This topology forms a continuous loop back to the distribution board."
          },
          {
            "id": "203-3A1-P3",
            "questionText": "State the primary purpose of a Control Circuit within an electrical system.",
            "answerType": "short-text",
            "expectedAnswer": [
              "regulate or manage equipment",
              "manage operation of equipment",
              "control other electrical equipment",
              "remote switching",
              "switching high power loads",
              "manage power circuits",
              "control of equipment",
              "switching for high power loads"
            ],
            "hint": "Think about how a thermostat interacts with a heating pump or how remote switching manages high-power loads."
          },
          {
            "id": "203-3A1-P4",
            "questionText": "Which circuit topology is typically the standard choice for dedicated high-power fixed appliances, such as an electric shower or a cooker?",
            "answerType": "short-text",
            "expectedAnswer": [
              "Radial Circuit",
              "a Radial Circuit",
              "the Radial Circuit",
              "Radial"
            ],
            "hint": "This layout runs from the source and stops at the final outlet."
          },
          {
            "id": "203-3A1-P5",
            "questionText": "What term describes a circuit intended to supply electrical energy directly to current-using equipment or socket-outlets?",
            "answerType": "short-text",
            "expectedAnswer": [
              "Final Circuit",
              "Final",
              "Final circuits",
              "A final circuit"
            ],
            "hint": "These are categorized by their intended function at the end of the installation."
          }
        ]
      }
    },
    {
      "id": "203-3A1-integrative",
      "type": "practice",
      "order": 9.5,
      "content": {
        "title": "Putting It All Together",
        "mode": "integrative",
        "sequential": true,
        "questions": [
          {
            "id": "203-3A1-INT-1",
            "questionText": "Compare domestic lighting and general-purpose socket-outlets by identifying the standard circuit topology for each.",
            "answerType": "short-text",
            "cognitiveLevel": "connection",
            "expectedAnswer": [
              "radial and ring",
              "radial; ring",
              "radial for lighting and ring for power",
              "lighting is radial and sockets are ring",
              "radial for lighting and ring final for sockets",
              "radial and ring final",
              "radial then ring"
            ],
            "hint": "Think about the difference in power demand between a single light bulb and multiple high-draw appliances on a socket circuit."
          },
          {
            "id": "203-3A1-INT-2",
            "questionText": "Explain the integrated benefits of separating lighting from power circuits and using ring topologies for sockets. Answer in 2-3 sentences.",
            "answerType": "short-text",
            "cognitiveLevel": "synthesis",
            "expectedAnswer": [
              "safety of movement and cable economy",
              "fault isolation and load sharing",
              "prevents dark rooms and overheating",
              "continuity of service and efficiency",
              "safety of movement and fault isolation",
              "isolation and economy",
              "separation ensures lighting during power faults while ring circuits provide efficient load sharing",
              "circuit separation maintains safety of movement and ring topology offers cable economy"
            ],
            "hint": "Recall how separation ensures people can see during faults, while ring topologies allow for efficient load sharing across smaller cables."
          }
        ]
      }
    },
    {
      "id": "203-3A1-spaced-review",
      "type": "spaced-review",
      "order": 10,
      "content": {
        "title": "Final Knowledge Review",
        "questions": [
          {
            "id": "203-3A1-SR-1",
            "questionText": "What is the standard unit of measurement for electrical current?",
            "expectedAnswer": [
              "Ampere",
              "Amperes",
              "Amps",
              "Amp",
              "A"
            ],
            "hint": "The unit symbol is 'A'.",
            "answerType": "short-text"
          },
          {
            "id": "203-3A1-SR-2",
            "questionText": "What term is used to describe a material, such as copper, that allows electrical current to flow through it easily?",
            "expectedAnswer": [
              "Conductor",
              "Conductors",
              "Conductive"
            ],
            "hint": "It is the opposite of an insulator.",
            "answerType": "short-text"
          },
          {
            "id": "203-3A1-SR-3",
            "questionText": "What is the name of the basic component used to manually open or close an electrical circuit?",
            "expectedAnswer": [
              "Switch",
              "Switches",
              "A switch"
            ],
            "hint": "You use this to turn a light on or off.",
            "answerType": "short-text"
          }
        ],
        "notes": "Review of foundational electrical concepts.\n\n### Key Points Summary\n- Final circuits are categorized by function (lighting, power, data).\n- Radial circuits follow a linear path; Ring final circuits form a loop.\n- Separation of circuits ensures safety of movement during faults.\n- Ring circuits allow for cable economy but require careful testing for continuity.\n\n**Coming Up Next:**\nCircuit Protection and Overcurrent Devices."
      }
    }
  ],
  "metadata": {
    "created": "2026-02-07",
    "updated": "2026-02-07",
    "version": "1.0",
    "author": "C&G 2365 Learning Team"
  }
}
```

---

### Output Lesson (After Refinement)

**File:** `10_output_lesson.json`

```json
{
  "id": "203-3A1",
  "title": "203.3A1 — Circuit Types: What They Do",
  "description": "Learn about Circuit Types: What They Do in Electrical Installations Technology",
  "layout": "split-vis",
  "unit": "Unit 203",
  "topic": "Circuit Types: What They Do",
  "learningOutcomes": [
    "Identify the primary functions of different circuit types including lighting, power, and data",
    "Describe the operating principles of ring final and radial circuit topologies",
    "Explain the typical applications for specialized circuits such as emergency lighting and control systems"
  ],
  "prerequisites": [],
  "blocks": [
    {
      "id": "203-3A1-outcomes",
      "type": "outcomes",
      "order": 1,
      "content": {
        "outcomes": [
          {
            "text": "Identify the primary functions of different circuit types including lighting, power, and data",
            "bloomLevel": "remember"
          },
          {
            "text": "Describe the operating principles of ring final and radial circuit topologies",
            "bloomLevel": "understand"
          },
          {
            "text": "Explain the typical applications for specialized circuits such as emergency lighting and control systems",
            "bloomLevel": "understand"
          }
        ]
      }
    },
    {
      "id": "203-3A1-vocab",
      "type": "vocab",
      "order": 2,
      "content": {
        "terms": [
          {
            "term": "Final Circuit",
            "definition": "A circuit intended to supply electrical energy directly to current-using equipment or socket-outlets."
          },
          {
            "term": "Radial Circuit",
            "definition": "An electrical circuit that originates from a distribution board and runs to one or more points, terminating at the final outlet."
          },
          {
            "term": "Ring Final Circuit",
            "definition": "A circuit that starts and ends at the same protective device in the distribution board, forming a continuous loop to supply socket-outlets."
          },
          {
            "term": "Control Circuit",
            "definition": "A circuit used to regulate or manage the operation of other electrical equipment or larger power circuits."
          },
          {
            "term": "Data Circuit",
            "definition": "A specialized circuit designed for the transmission of digital information rather than the distribution of power."
          },
          {
            "term": "Emergency Lighting",
            "definition": "Lighting intended to provide illumination for the safety of people leaving a location when the normal power supply fails."
          },
          {
            "term": "BS 7671",
            "definition": "The British Standard for Requirements for Electrical Installations, also known as the IET Wiring Regulations."
          }
        ]
      }
    },
    {
      "id": "203-3A1-diagram",
      "type": "diagram",
      "order": 3,
      "content": {
        "title": "Circuit Types: What They Do Diagram",
        "description": "Visual representation of Circuit Types: What They Do",
        "videoUrl": "",
        "diagramType": "circuit",
        "elementIds": [
          "ring-final-circuit",
          "radial-circuit",
          "distribution-board",
          "socket-outlet",
          "final-circuit",
          "control-circuit",
          "data-circuit"
        ],
        "placeholderText": "The diagram should show two side-by-side comparisons. On the left, a distribution-board with a radial-circuit extending to three socket-outlet symbols in a linear line, ending at the last one. On the right, the same distribution-board with a ring-final-circuit shown as a continuous loop: two conductors leaving the same breaker, visiting several socket-outlet points in a circle, and both returning to the same terminal. Labels should clearly identify each as a final-circuit type. Additionally, include a small inset diagram showing a Data Circuit (using twisted-pair symbols) and a Control Circuit (connecting a sensor to a load) to illustrate functional variety beyond power distribution."
      }
    },
    {
      "id": "203-3A1-explain-1",
      "type": "explanation",
      "order": 4,
      "content": {
        "title": "Functional Circuit Categories",
        "content": "### In this lesson\nThis lesson explores how to identify the primary functions of different circuit types including lighting, power, and data. As shown in the functional diagram, different circuits serve distinct purposes. You are acting as an installation technician planning the layout of a new mixed-use building. \n\n*   Differentiate between power, lighting, and specialized circuits.\n*   Understand the purpose of control and data transmission systems.\n*   Identify the unique requirements for emergency and safety systems.\n\n**What this is**\nIn any electrical installation, every **Final Circuit** is categorized by its intended function. A **Final Circuit** is a circuit intended to supply electrical energy directly to current-using equipment or socket-outlets. Common categories include lighting circuits for illumination, power circuits for general-purpose socket-outlets, and specialized circuits like a **Control Circuit** or a **Data Circuit**.\n\n**Why it matters**\nUnderstanding circuit functions is critical for safety and efficiency. Separating functions ensures that a fault on a power circuit (such as a tripped socket) does not plunge a whole building into darkness. This ensures **continuity of service** and **safety of movement**, allowing occupants to navigate the building using the still-functioning lighting circuits.\n\n**Key facts / rules**\n*   Lighting circuits typically supply fixed luminaires and are often rated lower than power circuits.\n*   Power circuits supply socket-outlets or fixed appliances like heaters and cookers.\n*   A **Control Circuit** is used to regulate or manage the operation of other electrical equipment, often facilitating **remote switching** of high-power loads via thermostats or sensors.\n*   A **Data Circuit** is designed for the transmission of information rather than power distribution, often using twisted-pair or fiber-optic cabling.\n*   Emergency lighting circuits must provide illumination when the normal supply fails.\n*   All circuits must be clearly identified at the distribution board according to **BS 7671** (the UK Wiring Regulations) to prevent dangerous mistakes during maintenance.\n\n**When to choose it**\nYou should choose a dedicated lighting circuit when the primary goal is to provide fixed illumination. Power circuits are selected for general-purpose use. You would select a **Control Circuit** when you need to manage a high-power load from a remote switch or sensor. **Data Circuit** selection is necessary for networking. Emergency lighting is chosen specifically for escape routes to ensure safety during power outages.\n\n**Common mistakes**\nOne common error is mixing functional types, such as connecting a high-power heater to a lighting circuit. Another mistake is failing to provide adequate separation between power cables and a **Data Circuit**, which can lead to electromagnetic interference (EMI).\n\n**Key Points**\n*   A **Final Circuit** delivers energy or signals directly to the end-user equipment.\n*   Lighting and power circuits must be separated to maintain **continuity of service** and **safety of movement**.\n*   **Control Circuit** arrangements allow for the safe management of loads through **remote switching**.\n*   **Data Circuit** systems focus on information transmission and require protection from interference.\n*   Emergency lighting provides critical illumination during mains power failure.\n*   All circuits must be clearly identified at the distribution board to **BS 7671** standards.\n\n**Quick recap**\nElectrical installations are divided into functional categories to ensure safety and usability. Lighting, power, control, data, and emergency circuits each serve a specific role. Proper identification and selection of these types are essential for a compliant installation."
      }
    },
    {
      "id": "203-3A1-check-1",
      "type": "practice",
      "order": 4.5,
      "content": {
        "title": "Check Your Understanding: Functional Circuit Categories",
        "mode": "conceptual",
        "sequential": true,
        "questions": [
          {
            "id": "203-3A1-C1-L1-A",
            "questionText": "What is the purpose of a Final Circuit?",
            "answerType": "short-text",
            "cognitiveLevel": "recall",
            "expectedAnswer": [
              "supply energy to equipment",
              "supply current-using equipment",
              "supply socket-outlets",
              "energy delivery to equipment",
              "powering end-use devices",
              "supply energy to outlets",
              "supply current to equipment"
            ],
            "hint": "Look at the definition of a circuit that delivers energy to end-user equipment."
          },
          {
            "id": "203-3A1-C1-L1-B",
            "questionText": "What is the specific function of a Control Circuit?",
            "answerType": "short-text",
            "cognitiveLevel": "recall",
            "expectedAnswer": [
              "regulate or manage equipment",
              "manage operation of equipment",
              "control other electrical equipment",
              "manage power circuits",
              "remote switching"
            ],
            "hint": "Identify the circuit type used for managing the operation of other systems."
          },
          {
            "id": "203-3A1-C1-L1-C",
            "questionText": "What is the primary purpose for selecting a Data Circuit?",
            "answerType": "short-text",
            "cognitiveLevel": "recall",
            "expectedAnswer": [
              "transmission of information",
              "information transfer",
              "digital or analogue information",
              "data transmission"
            ],
            "hint": "Consider what type of circuit is chosen when information transfer is the priority."
          },
          {
            "id": "203-3A1-C1-L2",
            "questionText": "What is a primary safety benefit of separating lighting and power into different functional categories?",
            "answerType": "short-text",
            "cognitiveLevel": "connection",
            "expectedAnswer": [
              "continuity of service",
              "prevent loss of lighting",
              "fault isolation",
              "maintain illumination",
              "safety of movement"
            ],
            "hint": "Think about what happens to the lights if a socket-outlet circuit trips and how that affects people moving in the building."
          }
        ]
      }
    },
    {
      "id": "203-3A1-explain-2",
      "type": "explanation",
      "order": 5,
      "content": {
        "title": "Circuit Topologies: Ring vs Radial",
        "content": "### In this lesson\nIn this section, we examine the operating principles of ring final and radial circuit topologies. As shown in the diagram's comparison of topologies, circuit layout is key. You are designing the wiring layout for a domestic dwelling to determine the most efficient way to connect socket-outlets. \n\n*   Describe the continuous loop principle of a ring final circuit.\n*   Identify the start-to-finish layout of a radial circuit.\n*   Compare the typical applications for both circuit arrangements.\n\n**What this is**\nCircuit topology refers to the physical layout of the wiring. In the UK, the two most common topologies for a **Final Circuit** are the **Radial Circuit** and the **Ring Final Circuit**. A **Radial Circuit** originates from a distribution board and runs to one or more points, terminating at the final outlet. In contrast, a **Ring Final Circuit** starts and ends at the same protective device in the distribution board, forming a continuous loop to supply socket-outlets.\n\n**Why it matters**\nThe choice of topology affects cable usage and load handling. A **Ring Final Circuit** allows for smaller conductors to supply a larger area because the load is shared across two paths. However, if the loop is broken (a \"broken ring\"), the circuit may still appear to work while overstressing the remaining cable. This poses a severe **overheating and fire risk** because the conductors are no longer sharing the load as designed. A **Radial Circuit** is simpler to test but may require larger cables for high-power appliances.\n\n**Key facts / rules**\n*   A **Radial Circuit** is like a branch of a tree, stopping at the last point of use.\n*   A **Ring Final Circuit** must be a continuous loop to function as intended by design.\n*   Radial circuits are commonly used for lighting and high-load fixed appliances like cookers.\n*   Ring final circuits are typically used for general-purpose socket-outlets.\n*   In a ring, current travels in both directions from the distribution board to the load.\n\n**When to choose it**\nChoose a **Radial Circuit** for dedicated high-power appliances, such as an electric shower, where the load is at a single point. Radials are also the standard choice for lighting. Choose a **Ring Final Circuit** when you need to provide many socket-outlets over a large floor area, as it is often more cost-effective for cable usage.\n\n**Common mistakes**\nA major mistake is creating an \"interconnected\" circuit with a bridge. Another is failing to ensure both ends of a **Ring Final Circuit** are terminated into the same terminal. Failing to verify the continuity of the ring during commissioning can leave a dangerous \"broken ring\" undetected, leading to potential **overheating** of the conductors.\n\n**Key Points**\n*   **Radial Circuit** topology runs from the source to the last point and stops.\n*   **Ring Final Circuit** topology forms a complete loop back to the source.\n*   Rings support higher total loads with smaller cables but carry an **overheating and fire risk** if the loop is broken.\n*   Radials are simpler to diagnose and used for lighting and heavy fixed loads.\n\n**Quick recap**\nRadials follow a linear path, while ring final circuits form a loop. Each has advantages depending on the load type and area served, but rings require careful continuity testing to ensure safety."
      }
    },
    {
      "id": "203-3A1-check-2",
      "type": "practice",
      "order": 5.5,
      "content": {
        "title": "Check Your Understanding: Circuit Topologies: Ring vs Radial",
        "mode": "conceptual",
        "sequential": true,
        "questions": [
          {
            "id": "203-3A1-C2-L1-A",
            "questionText": "Identify the path of a Radial Circuit from the distribution board.",
            "answerType": "short-text",
            "cognitiveLevel": "recall",
            "expectedAnswer": [
              "originates from distribution board",
              "runs to one or more points",
              "terminates at final outlet",
              "linear path"
            ],
            "hint": "Describe the linear path this circuit takes from its source."
          },
          {
            "id": "203-3A1-C2-L1-B",
            "questionText": "Where does a Ring Final Circuit start and end?",
            "answerType": "short-text",
            "cognitiveLevel": "recall",
            "expectedAnswer": [
              "same protective device",
              "distribution board",
              "source and end at same terminal",
              "breaker",
              "consumer unit",
              "fuse board"
            ],
            "hint": "Identify the location where both ends of the loop are terminated."
          },
          {
            "id": "203-3A1-C2-L1-C",
            "questionText": "What specific physical condition must a Ring Final Circuit meet to function as intended?",
            "answerType": "short-text",
            "cognitiveLevel": "recall",
            "expectedAnswer": [
              "continuous loop",
              "closed loop",
              "no breaks in loop",
              "complete ring"
            ],
            "hint": "State the necessary loop requirement for this topology to work correctly."
          },
          {
            "id": "203-3A1-C2-L2",
            "questionText": "State the primary safety risk associated with a broken ring final circuit.",
            "answerType": "short-text",
            "cognitiveLevel": "connection",
            "expectedAnswer": [
              "overheating",
              "fire risk",
              "overstressing cable",
              "cable failure",
              "overloaded conductor"
            ],
            "hint": "Consider what happens to the remaining cable if the load-sharing loop is broken."
          }
        ]
      }
    },
    {
      "id": "203-3A1-practice",
      "type": "practice",
      "order": 8,
      "content": {
        "title": "Your Turn (You Do)",
        "questions": [
          {
            "id": "203-3A1-P1",
            "questionText": "Identify the specialized circuit type required to provide illumination for the safety of people leaving a location when the normal power supply fails.",
            "answerType": "short-text",
            "expectedAnswer": [
              "Emergency Lighting",
              "Emergency Lighting Circuit",
              "Emergency Lights",
              "Emergency lighting system"
            ],
            "hint": "Consider the systems designed to operate when the main power supply is lost."
          },
          {
            "id": "203-3A1-P2",
            "questionText": "An installation technician is planning general-purpose socket-outlets across a large domestic floor area. Which circuit topology is most cost-effective for cable usage in this scenario?",
            "answerType": "short-text",
            "expectedAnswer": [
              "Ring Final Circuit",
              "A Ring Final Circuit",
              "Ring Final",
              "Ring circuit",
              "Ring topology"
            ],
            "hint": "This topology forms a continuous loop back to the distribution board."
          },
          {
            "id": "203-3A1-P3",
            "questionText": "State the primary purpose of a Control Circuit within an electrical system.",
            "answerType": "short-text",
            "expectedAnswer": [
              "regulate or manage equipment",
              "manage operation of equipment",
              "control other electrical equipment",
              "remote switching",
              "switching high power loads",
              "manage power circuits",
              "control of equipment",
              "switching for high power loads"
            ],
            "hint": "Think about how a thermostat interacts with a heating pump or how remote switching manages high-power loads."
          },
          {
            "id": "203-3A1-P4",
            "questionText": "Which circuit topology is typically the standard choice for dedicated high-power fixed appliances, such as an electric shower or a cooker?",
            "answerType": "short-text",
            "expectedAnswer": [
              "Radial Circuit",
              "a Radial Circuit",
              "the Radial Circuit",
              "Radial"
            ],
            "hint": "This layout runs from the source and stops at the final outlet."
          },
          {
            "id": "203-3A1-P5",
            "questionText": "What term describes a circuit intended to supply electrical energy directly to current-using equipment or socket-outlets?",
            "answerType": "short-text",
            "expectedAnswer": [
              "Final Circuit",
              "Final",
              "Final circuits",
              "A final circuit"
            ],
            "hint": "These are categorized by their intended function at the end of the installation."
          }
        ]
      }
    },
    {
      "id": "203-3A1-integrative",
      "type": "practice",
      "order": 9.5,
      "content": {
        "title": "Putting It All Together",
        "mode": "integrative",
        "sequential": true,
        "questions": [
          {
            "id": "203-3A1-INT-1",
            "questionText": "Compare domestic lighting and general-purpose socket-outlets by identifying the standard circuit topology for each.",
            "answerType": "short-text",
            "cognitiveLevel": "connection",
            "expectedAnswer": [
              "lighting: radial; sockets: ring",
              "lighting: radial; power: ring final",
              "radial for lighting and ring for sockets",
              "lighting is radial, sockets are ring final",
              "lighting: radial; socket-outlets: ring final"
            ],
            "hint": "Think about the difference in power demand between a single light bulb and multiple high-draw appliances on a socket circuit."
          },
          {
            "id": "203-3A1-INT-2",
            "questionText": "Explain the integrated benefits of separating lighting from power circuits and using ring topologies for sockets. Answer in 3-4 sentences OR concise bullet points.",
            "answerType": "short-text",
            "cognitiveLevel": "synthesis",
            "expectedAnswer": [
              "continuity of service",
              "safety of movement",
              "fault isolation",
              "cable economy",
              "load sharing across paths",
              "preventing total darkness"
            ],
            "hint": "Recall how separation ensures people can see during faults, while ring topologies allow for efficient load sharing across smaller cables."
          }
        ]
      }
    },
    {
      "id": "203-3A1-spaced-review",
      "type": "spaced-review",
      "order": 10,
      "content": {
        "title": "Final Knowledge Review",
        "questions": [
          {
            "id": "203-3A1-SR-1",
            "questionText": "What is the standard unit of measurement for electrical current?",
            "expectedAnswer": [
              "Ampere",
              "Amperes",
              "Amps",
              "Amp",
              "A"
            ],
            "hint": "The unit symbol is 'A'.",
            "answerType": "short-text"
          },
          {
            "id": "203-3A1-SR-2",
            "questionText": "What term is used to describe a material, such as copper, that allows electrical current to flow through it easily?",
            "expectedAnswer": [
              "Conductor",
              "Conductors",
              "Conductive"
            ],
            "hint": "It is the opposite of an insulator.",
            "answerType": "short-text"
          },
          {
            "id": "203-3A1-SR-3",
            "questionText": "What is the name of the basic component used to manually open or close an electrical circuit?",
            "expectedAnswer": [
              "Switch",
              "Switches",
              "A switch"
            ],
            "hint": "You use this to turn a light on or off.",
            "answerType": "short-text"
          }
        ],
        "notes": "Review of foundational electrical concepts.\n\n### Key Points Summary\n- Final circuits are categorized by function (lighting, power, data).\n- Radial circuits follow a linear path; Ring final circuits form a loop.\n- Separation of circuits ensures safety of movement during faults.\n- Ring circuits allow for cable economy but require careful testing for continuity.\n\n**Coming Up Next:** Circuit Protection and Overcurrent Devices."
      }
    }
  ],
  "metadata": {
    "created": "2026-02-07",
    "updated": "2026-02-07",
    "version": "1.0",
    "author": "C&G 2365 Learning Team"
  }
}
```

---

## Scoring

### Score Before Refinement

#### Parsed Score

```json
{
  "total": 94,
  "breakdown": {
    "schemaCompliance": 15,
    "pedagogy": 28,
    "questions": 23,
    "marking": 8,
    "visual": 5,
    "safety": 0
  },
  "details": [
    {
      "section": "beginnerClarityStaging: The term 'BS 7671' is introduced in the explanation 'Functio...",
      "score": 0,
      "maxScore": 2,
      "issues": [
        "The term 'BS 7671' is introduced in the explanation 'Functional Circuit Categories' without being defined in the vocabulary block or previous text, which may confuse beginners."
      ],
      "suggestions": [
        "Append to blocks[1].content.terms: '[object Object]'"
      ],
      "jsonPointers": [
        "/blocks/1/content/terms"
      ]
    },
    {
      "section": "markingRobustness: Synthesis question 203-3A1-INT-2 asks for 2-3 sentences, but...",
      "score": 0,
      "maxScore": 2,
      "issues": [
        "Synthesis question 203-3A1-INT-2 asks for 2-3 sentences, but the expectedAnswer variations are single phrases. This will cause high friction in grading."
      ],
      "suggestions": [
        "Change blocks[8].content.questions[1].expectedAnswer from 'safety of movement and cable economy,fault isolation and load sharing,prevents dark rooms and overheating,continuity of service and efficiency,safety of movement and fault isolation,isolation and economy,separation ensures lighting during power faults while ring circuits provide efficient load sharing,circuit separation maintains safety of movement and ring topology offers cable economy' to 'separation ensures lighting remains active during power faults for safety of movement while ring circuits provide efficient load sharing,maintains safety of movement by isolating faults and provides cable economy through ring topology,separating circuits prevents total blackout and ring final circuits allow smaller cables to handle larger loads,ensures continuity of service for lighting and cost-effective power distribution via ring loops,prevents tripping of lights when sockets fail and allows load sharing across two paths in a ring'"
      ],
      "jsonPointers": [
        "/blocks/8/content/questions/1/expectedAnswer"
      ]
    },
    {
      "section": "questions: Question 203-3A1-INT-2 uses 'Answer in 2-3 sentences'. To be...",
      "score": 0,
      "maxScore": 1,
      "issues": [
        "Question 203-3A1-INT-2 uses 'Answer in 2-3 sentences'. To better align with the pedagogical contract for synthesis grading, it should offer the option for bullet points."
      ],
      "suggestions": [
        "Modify blocks[8].content.questions[1].questionText"
      ],
      "jsonPointers": [
        "/blocks/8/content/questions/1/questionText"
      ]
    },
    {
      "section": "beginnerClarityStaging: The explanation uses the phrase 'still-functioning lighting'...",
      "score": 0,
      "maxScore": 2,
      "issues": [
        "The explanation uses the phrase 'still-functioning lighting' to describe a concept, but the check question answer expects 'continuity of service'. Terminology should be perfectly aligned for beginners."
      ],
      "suggestions": [
        "Modify blocks[3].content.content"
      ],
      "jsonPointers": [
        "/blocks/3/content/content"
      ]
    },
    {
      "section": "beginnerClarityStaging: The 'Coming Up Next' transition is located in the 'notes' fi...",
      "score": 0,
      "maxScore": 1,
      "issues": [
        "The 'Coming Up Next' transition is located in the 'notes' field of the spaced review. It is more effective when placed clearly at the end of the lesson content for visibility."
      ],
      "suggestions": [
        "Modify blocks[9].content.notes"
      ],
      "jsonPointers": [
        "/blocks/9/content/notes"
      ]
    }
  ],
  "grade": "Strong"
}
```

---

### Score After Refinement

#### Parsed Score

```json
{
  "total": 95,
  "breakdown": {
    "schemaCompliance": 15,
    "pedagogy": 28,
    "questions": 24,
    "marking": 8,
    "visual": 5,
    "safety": 0
  },
  "details": [
    {
      "section": "beginnerClarityStaging: The prerequisites field is empty, but the Spaced Review bloc...",
      "score": 0,
      "maxScore": 2,
      "issues": [
        "The prerequisites field is empty, but the Spaced Review block (blocks[10]) assesses knowledge of 'Amperes' and 'Conductors'. These foundational concepts should be explicitly listed as prerequisites."
      ],
      "suggestions": [
        "Change prerequisites from '' to 'Basic electrical units (Amperes),Properties of conductors and insulators'"
      ],
      "jsonPointers": [
        "/prerequisites"
      ]
    },
    {
      "section": "questions: The phrasing of the first integrative question (blocks[8]) '...",
      "score": 0,
      "maxScore": 2,
      "issues": [
        "The phrasing of the first integrative question (blocks[8]) 'Compare... by identifying' is slightly contradictory. Comparison implies identifying differences/similarities, while identification is a simpler task."
      ],
      "suggestions": [
        "Modify blocks[8].content.questions[0].questionText"
      ],
      "jsonPointers": [
        "/blocks/8/content/questions/0/questionText"
      ]
    },
    {
      "section": "markingRobustness: Questions in check blocks (blocks[4], blocks[6]) use short-t...",
      "score": 0,
      "maxScore": 2,
      "issues": [
        "Questions in check blocks (blocks[4], blocks[6]) use short-text answerType with prompts like 'Identify the path...' or 'What is the purpose...', which often elicit long responses. Missing length constraints may lead to grading friction."
      ],
      "suggestions": [
        "Append to blocks[4].content.questions[0].questionText: ' (Answer in 3-5 words)'",
        "Append to blocks[6].content.questions[0].questionText: ' (Answer in 3-5 words)'"
      ],
      "jsonPointers": [
        "/blocks/4/content/questions/0/questionText",
        "/blocks/6/content/questions/0/questionText"
      ]
    },
    {
      "section": "beginnerClarityStaging: In the explanation of ring circuits (blocks[5]), the safety ...",
      "score": 0,
      "maxScore": 1,
      "issues": [
        "In the explanation of ring circuits (blocks[5]), the safety risk of a 'broken ring' is mentioned but could be clearer for beginners by explicitly stating that the circuit continues to operate without tripping protection."
      ],
      "suggestions": [
        "Modify blocks[5].content.content"
      ],
      "jsonPointers": [
        "/blocks/5/content/content"
      ]
    }
  ],
  "grade": "Strong"
}
```

---

## Rewrite Step

### Rewrite Prompt

**Timestamp:** 2026-02-07T16:21:27.932Z
**Model:** gemini-3-flash-preview
**Temperature:** 0
**Max Tokens:** 24000

#### System Prompt

```
You are an expert lesson JSON refiner.

You will be given:
1) The ORIGINAL lesson JSON (valid).
2) A scoring report listing issues and suggested improvements.

Your job:
Return a NEW lesson JSON that fixes the issues while preserving the lesson's structure.

STRICT RULES (HARD):
- Output ONLY valid JSON. No commentary. No markdown. No code fences.
- Do NOT change: lesson.id, lesson.unit, lesson.topic, lesson.layout.
- Do NOT reorder blocks.
- Do NOT add blocks.
- Do NOT remove blocks.
- Do NOT change any block.id values.
- Do NOT change any block.type values.
- Do NOT change any block.order values.
- Keep blocks array length EXACTLY the same.
- Only edit fields inside existing blocks to improve clarity, correctness, marking robustness, and alignment.

CONTENT RULES:
- Fix the issues described in the scoring report as priority.
- Do not introduce "[object Object]" or placeholder text.
- If the scoring report contains malformed suggestions (e.g. '[object Object]'), ignore those suggestions and instead implement the intended fix safely.

ANSWER TYPE RULES (CRITICAL):
- VALID answerTypes: "short-text", "multiple-choice", "calculation", "true-false"
- NEVER use: "numeric", "long-text", "essay", "open-ended", or any other type
- DO NOT change answerType anywhere. This is a hard constraint.
- For synthesis questions (cognitiveLevel: "synthesis"): questionText MUST end with EXACTLY this instruction: "Answer in 3-4 sentences OR concise bullet points." AND expectedAnswer MUST be a checklist of 4-8 key concepts/phrases to grade against (not full sentence variants). Do not use any other numbers or phrasing variants.

SYNTHESIS QUESTION REQUIREMENTS:
- questionText ends with: "Answer in 3-4 sentences OR concise bullet points."
- expectedAnswer format: ["key concept 1", "key concept 2", "key concept 3", "key concept 4", ...]
- Example expectedAnswer: ["fault isolation and continuity", "cable economy", "load sharing across paths", "safety of movement during faults"]
- Do NOT use full sentence variants for synthesis questions

CONNECTION QUESTION REQUIREMENTS (D3 Question 1):
- For mapping questions (e.g., "which circuit type for X and Y"), expectedAnswer must use explicit mappings
- BAD: ["radial and ring", "ring and radial"]
- GOOD: ["lighting: radial; sockets: ring", "radial for lighting, ring final for sockets"]
- Prevents false positives from reversed answers

OUTPUT FORMAT:
Return the full lesson JSON object.


OUTPUT REQUIREMENTS:
- Valid RFC 8259 JSON only (parseable by JSON.parse())
- No markdown blocks, comments, or explanations
- Double-quoted property names, no trailing commas
- Return ONLY the JSON, nothing else
```

#### User Prompt

```
REFINE THIS LESSON JSON.

ORIGINAL LESSON JSON:
{
  "id": "203-3A1",
  "title": "203.3A1 — Circuit Types: What They Do",
  "description": "Learn about Circuit Types: What They Do in Electrical Installations Technology",
  "layout": "split-vis",
  "unit": "Unit 203",
  "topic": "Circuit Types: What They Do",
  "learningOutcomes": [
    "Identify the primary functions of different circuit types including lighting, power, and data",
    "Describe the operating principles of ring final and radial circuit topologies",
    "Explain the typical applications for specialized circuits such as emergency lighting and control systems"
  ],
  "prerequisites": [],
  "blocks": [
    {
      "id": "203-3A1-outcomes",
      "type": "outcomes",
      "order": 1,
      "content": {
        "outcomes": [
          {
            "text": "Identify the primary functions of different circuit types including lighting, power, and data",
            "bloomLevel": "remember"
          },
          {
            "text": "Describe the operating principles of ring final and radial circuit topologies",
            "bloomLevel": "understand"
          },
          {
            "text": "Explain the typical applications for specialized circuits such as emergency lighting and control systems",
            "bloomLevel": "understand"
          }
        ]
      }
    },
    {
      "id": "203-3A1-vocab",
      "type": "vocab",
      "order": 2,
      "content": {
        "terms": [
          {
            "term": "Final Circuit",
            "definition": "A circuit intended to supply electrical energy directly to current-using equipment or socket-outlets."
          },
          {
            "term": "Radial Circuit",
            "definition": "An electrical circuit that originates from a distribution board and runs to one or more points, terminating at the final outlet."
          },
          {
            "term": "Ring Final Circuit",
            "definition": "A circuit that starts and ends at the same protective device in the distribution board, forming a continuous loop to supply socket-outlets."
          },
          {
            "term": "Control Circuit",
            "definition": "A circuit used to regulate or manage the operation of other electrical equipment or larger power circuits."
          },
          {
            "term": "Data Circuit",
            "definition": "A specialized circuit designed for the transmission of digital information rather than the distribution of power."
          },
          {
            "term": "Emergency Lighting",
            "definition": "Lighting intended to provide illumination for the safety of people leaving a location when the normal power supply fails."
          }
        ]
      }
    },
    {
      "id": "203-3A1-diagram",
      "type": "diagram",
      "order": 3,
      "content": {
        "title": "Circuit Types: What They Do Diagram",
        "description": "Visual representation of Circuit Types: What They Do",
        "videoUrl": "",
        "diagramType": "circuit",
        "elementIds": [
          "ring-final-circuit",
          "radial-circuit",
          "distribution-board",
          "socket-outlet",
          "final-circuit",
          "control-circuit",
          "data-circuit"
        ],
        "placeholderText": "The diagram should show two side-by-side comparisons. On the left, a distribution-board with a radial-circuit extending to three socket-outlet symbols in a linear line, ending at the last one. On the right, the same distribution-board with a ring-final-circuit shown as a continuous loop: two conductors leaving the same breaker, visiting several socket-outlet points in a circle, and both returning to the same terminal. Labels should clearly identify each as a final-circuit type. Additionally, include a small inset diagram showing a Data Circuit (using twisted-pair symbols) and a Control Circuit (connecting a sensor to a load) to illustrate functional variety beyond power distribution."
      }
    },
    {
      "id": "203-3A1-explain-1",
      "type": "explanation",
      "order": 4,
      "content": {
        "title": "Functional Circuit Categories",
        "content": "### In this lesson\nThis lesson explores how to identify the primary functions of different circuit types including lighting, power, and data. As shown in the functional diagram, different circuits serve distinct purposes. You are acting as an installation technician planning the layout of a new mixed-use building. \n\n*   Differentiate between power, lighting, and specialized circuits.\n*   Understand the purpose of control and data transmission systems.\n*   Identify the unique requirements for emergency and safety systems.\n\n**What this is**\nIn any electrical installation, every **Final Circuit** is categorized by its intended function. A **Final Circuit** is a circuit intended to supply electrical energy directly to current-using equipment or socket-outlets. Common categories include lighting circuits for illumination, power circuits for general-purpose socket-outlets, and specialized circuits like a **Control Circuit** or a **Data Circuit**.\n\n**Why it matters**\nUnderstanding circuit functions is critical for safety and efficiency. Separating functions ensures that a fault on a power circuit (such as a tripped socket) does not plunge a whole building into darkness. This ensures **safety of movement**, allowing occupants to navigate the building using the still-functioning lighting circuits. Specialized systems like emergency lighting must also be identified correctly to ensure they function during a mains failure.\n\n**Key facts / rules**\n*   Lighting circuits typically supply fixed luminaires and are often rated lower than power circuits.\n*   Power circuits supply socket-outlets or fixed appliances like heaters and cookers.\n*   A **Control Circuit** is used to regulate or manage the operation of other electrical equipment, often facilitating **remote switching** of high-power loads via thermostats or sensors.\n*   A **Data Circuit** is designed for the transmission of information rather than power distribution, often using twisted-pair or fiber-optic cabling.\n*   Emergency lighting circuits must provide illumination when the normal supply fails.\n*   All circuits must be clearly identified at the distribution board according to BS 7671 to prevent dangerous mistakes during maintenance.\n\n**When to choose it**\nYou should choose a dedicated lighting circuit when the primary goal is to provide fixed illumination. Power circuits are selected for general-purpose use. You would select a **Control Circuit** when you need to manage a high-power load from a remote switch or sensor. **Data Circuit** selection is necessary for networking. Emergency lighting is chosen specifically for escape routes to ensure safety during power outages.\n\n**Common mistakes**\nOne common error is mixing functional types, such as connecting a high-power heater to a lighting circuit. Another mistake is failing to provide adequate separation between power cables and a **Data Circuit**, which can lead to electromagnetic interference (EMI).\n\n**Key Points**\n*   A **Final Circuit** delivers energy or signals directly to the end-user equipment.\n*   Lighting and power circuits must be separated to maintain continuity of service and **safety of movement**.\n*   **Control Circuit** arrangements allow for the safe management of loads through **remote switching**.\n*   **Data Circuit** systems focus on information transmission and require protection from interference.\n*   Emergency lighting provides critical illumination during mains power failure.\n*   All circuits must be clearly identified at the distribution board to BS 7671 standards.\n\n**Quick recap**\nElectrical installations are divided into functional categories to ensure safety and usability. Lighting, power, control, data, and emergency circuits each serve a specific role. Proper identification and selection of these types are essential for a compliant installation."
      }
    },
    {
      "id": "203-3A1-check-1",
      "type": "practice",
      "order": 4.5,
      "content": {
        "title": "Check Your Understanding: Functional Circuit Categories",
        "mode": "conceptual",
        "sequential": true,
        "questions": [
          {
            "id": "203-3A1-C1-L1-A",
            "questionText": "What is the purpose of a Final Circuit?",
            "answerType": "short-text",
            "cognitiveLevel": "recall",
            "expectedAnswer": [
              "supply energy to equipment",
              "supply current-using equipment",
              "supply socket-outlets",
              "energy delivery to equipment",
              "powering end-use devices",
              "supply energy to outlets",
              "supply current to equipment"
            ],
            "hint": "Look at the definition of a circuit that delivers energy to end-user equipment."
          },
          {
            "id": "203-3A1-C1-L1-B",
            "questionText": "What is the specific function of a Control Circuit?",
            "answerType": "short-text",
            "cognitiveLevel": "recall",
            "expectedAnswer": [
              "regulate or manage equipment",
              "manage operation of equipment",
              "control other electrical equipment",
              "manage power circuits",
              "remote switching"
            ],
            "hint": "Identify the circuit type used for managing the operation of other systems."
          },
          {
            "id": "203-3A1-C1-L1-C",
            "questionText": "What is the primary purpose for selecting a Data Circuit?",
            "answerType": "short-text",
            "cognitiveLevel": "recall",
            "expectedAnswer": [
              "transmission of information",
              "information transfer",
              "digital or analogue information",
              "data transmission"
            ],
            "hint": "Consider what type of circuit is chosen when information transfer is the priority."
          },
          {
            "id": "203-3A1-C1-L2",
            "questionText": "What is a primary safety benefit of separating lighting and power into different functional categories?",
            "answerType": "short-text",
            "cognitiveLevel": "connection",
            "expectedAnswer": [
              "continuity of service",
              "prevent loss of lighting",
              "fault isolation",
              "maintain illumination",
              "safety of movement"
            ],
            "hint": "Think about what happens to the lights if a socket-outlet circuit trips and how that affects people moving in the building."
          }
        ]
      }
    },
    {
      "id": "203-3A1-explain-2",
      "type": "explanation",
      "order": 5,
      "content": {
        "title": "Circuit Topologies: Ring vs Radial",
        "content": "### In this lesson\nIn this section, we examine the operating principles of ring final and radial circuit topologies. As shown in the diagram's comparison of topologies, circuit layout is key. You are designing the wiring layout for a domestic dwelling to determine the most efficient way to connect socket-outlets. \n\n*   Describe the continuous loop principle of a ring final circuit.\n*   Identify the start-to-finish layout of a radial circuit.\n*   Compare the typical applications for both circuit arrangements.\n\n**What this is**\nCircuit topology refers to the physical layout of the wiring. In the UK, the two most common topologies for a **Final Circuit** are the **Radial Circuit** and the **Ring Final Circuit**. A **Radial Circuit** originates from a distribution board and runs to one or more points, terminating at the final outlet. In contrast, a **Ring Final Circuit** starts and ends at the same protective device in the distribution board, forming a continuous loop to supply socket-outlets.\n\n**Why it matters**\nThe choice of topology affects cable usage and load handling. A **Ring Final Circuit** allows for smaller conductors to supply a larger area because the load is shared across two paths. However, if the loop is broken (a \"broken ring\"), the circuit may still appear to work while overstressing the remaining cable. This poses a severe **overheating and fire risk** because the conductors are no longer sharing the load as designed. A **Radial Circuit** is simpler to test but may require larger cables for high-power appliances.\n\n**Key facts / rules**\n*   A **Radial Circuit** is like a branch of a tree, stopping at the last point of use.\n*   A **Ring Final Circuit** must be a continuous loop to function as intended by design.\n*   Radial circuits are commonly used for lighting and high-load fixed appliances like cookers.\n*   Ring final circuits are typically used for general-purpose socket-outlets.\n*   In a ring, current travels in both directions from the distribution board to the load.\n\n**When to choose it**\nChoose a **Radial Circuit** for dedicated high-power appliances, such as an electric shower, where the load is at a single point. Radials are also the standard choice for lighting. Choose a **Ring Final Circuit** when you need to provide many socket-outlets over a large floor area, as it is often more cost-effective for cable usage.\n\n**Common mistakes**\nA major mistake is creating an \"interconnected\" circuit with a bridge. Another is failing to ensure both ends of a **Ring Final Circuit** are terminated into the same terminal. Failing to verify the continuity of the ring during commissioning can leave a dangerous \"broken ring\" undetected, leading to potential **overheating** of the conductors.\n\n**Key Points**\n*   **Radial Circuit** topology runs from the source to the last point and stops.\n*   **Ring Final Circuit** topology forms a complete loop back to the source.\n*   Rings support higher total loads with smaller cables but carry an **overheating and fire risk** if the loop is broken.\n*   Radials are simpler to diagnose and used for lighting and heavy fixed loads.\n\n**Quick recap**\nRadials follow a linear path, while ring final circuits form a loop. Each has advantages depending on the load type and area served, but rings require careful continuity testing to ensure safety."
      }
    },
    {
      "id": "203-3A1-check-2",
      "type": "practice",
      "order": 5.5,
      "content": {
        "title": "Check Your Understanding: Circuit Topologies: Ring vs Radial",
        "mode": "conceptual",
        "sequential": true,
        "questions": [
          {
            "id": "203-3A1-C2-L1-A",
            "questionText": "Identify the path of a Radial Circuit from the distribution board.",
            "answerType": "short-text",
            "cognitiveLevel": "recall",
            "expectedAnswer": [
              "originates from distribution board",
              "runs to one or more points",
              "terminates at final outlet",
              "linear path"
            ],
            "hint": "Describe the linear path this circuit takes from its source."
          },
          {
            "id": "203-3A1-C2-L1-B",
            "questionText": "Where does a Ring Final Circuit start and end?",
            "answerType": "short-text",
            "cognitiveLevel": "recall",
            "expectedAnswer": [
              "same protective device",
              "distribution board",
              "source and end at same terminal",
              "breaker",
              "consumer unit",
              "fuse board"
            ],
            "hint": "Identify the location where both ends of the loop are terminated."
          },
          {
            "id": "203-3A1-C2-L1-C",
            "questionText": "What specific physical condition must a Ring Final Circuit meet to function as intended?",
            "answerType": "short-text",
            "cognitiveLevel": "recall",
            "expectedAnswer": [
              "continuous loop",
              "closed loop",
              "no breaks in loop",
              "complete ring"
            ],
            "hint": "State the necessary loop requirement for this topology to work correctly."
          },
          {
            "id": "203-3A1-C2-L2",
            "questionText": "State the primary safety risk associated with a broken ring final circuit.",
            "answerType": "short-text",
            "cognitiveLevel": "connection",
            "expectedAnswer": [
              "overheating",
              "fire risk",
              "overstressing cable",
              "cable failure",
              "overloaded conductor"
            ],
            "hint": "Consider what happens to the remaining cable if the load-sharing loop is broken."
          }
        ]
      }
    },
    {
      "id": "203-3A1-practice",
      "type": "practice",
      "order": 8,
      "content": {
        "title": "Your Turn (You Do)",
        "questions": [
          {
            "id": "203-3A1-P1",
            "questionText": "Identify the specialized circuit type required to provide illumination for the safety of people leaving a location when the normal power supply fails.",
            "answerType": "short-text",
            "expectedAnswer": [
              "Emergency Lighting",
              "Emergency Lighting Circuit",
              "Emergency Lights",
              "Emergency lighting system"
            ],
            "hint": "Consider the systems designed to operate when the main power supply is lost."
          },
          {
            "id": "203-3A1-P2",
            "questionText": "An installation technician is planning general-purpose socket-outlets across a large domestic floor area. Which circuit topology is most cost-effective for cable usage in this scenario?",
            "answerType": "short-text",
            "expectedAnswer": [
              "Ring Final Circuit",
              "A Ring Final Circuit",
              "Ring Final",
              "Ring circuit",
              "Ring topology"
            ],
            "hint": "This topology forms a continuous loop back to the distribution board."
          },
          {
            "id": "203-3A1-P3",
            "questionText": "State the primary purpose of a Control Circuit within an electrical system.",
            "answerType": "short-text",
            "expectedAnswer": [
              "regulate or manage equipment",
              "manage operation of equipment",
              "control other electrical equipment",
              "remote switching",
              "switching high power loads",
              "manage power circuits",
              "control of equipment",
              "switching for high power loads"
            ],
            "hint": "Think about how a thermostat interacts with a heating pump or how remote switching manages high-power loads."
          },
          {
            "id": "203-3A1-P4",
            "questionText": "Which circuit topology is typically the standard choice for dedicated high-power fixed appliances, such as an electric shower or a cooker?",
            "answerType": "short-text",
            "expectedAnswer": [
              "Radial Circuit",
              "a Radial Circuit",
              "the Radial Circuit",
              "Radial"
            ],
            "hint": "This layout runs from the source and stops at the final outlet."
          },
          {
            "id": "203-3A1-P5",
            "questionText": "What term describes a circuit intended to supply electrical energy directly to current-using equipment or socket-outlets?",
            "answerType": "short-text",
            "expectedAnswer": [
              "Final Circuit",
              "Final",
              "Final circuits",
              "A final circuit"
            ],
            "hint": "These are categorized by their intended function at the end of the installation."
          }
        ]
      }
    },
    {
      "id": "203-3A1-integrative",
      "type": "practice",
      "order": 9.5,
      "content": {
        "title": "Putting It All Together",
        "mode": "integrative",
        "sequential": true,
        "questions": [
          {
            "id": "203-3A1-INT-1",
            "questionText": "Compare domestic lighting and general-purpose socket-outlets by identifying the standard circuit topology for each.",
            "answerType": "short-text",
            "cognitiveLevel": "connection",
            "expectedAnswer": [
              "radial and ring",
              "radial; ring",
              "radial for lighting and ring for power",
              "lighting is radial and sockets are ring",
              "radial for lighting and ring final for sockets",
              "radial and ring final",
              "radial then ring"
            ],
            "hint": "Think about the difference in power demand between a single light bulb and multiple high-draw appliances on a socket circuit."
          },
          {
            "id": "203-3A1-INT-2",
            "questionText": "Explain the integrated benefits of separating lighting from power circuits and using ring topologies for sockets. Answer in 2-3 sentences.",
            "answerType": "short-text",
            "cognitiveLevel": "synthesis",
            "expectedAnswer": [
              "safety of movement and cable economy",
              "fault isolation and load sharing",
              "prevents dark rooms and overheating",
              "continuity of service and efficiency",
              "safety of movement and fault isolation",
              "isolation and economy",
              "separation ensures lighting during power faults while ring circuits provide efficient load sharing",
              "circuit separation maintains safety of movement and ring topology offers cable economy"
            ],
            "hint": "Recall how separation ensures people can see during faults, while ring topologies allow for efficient load sharing across smaller cables."
          }
        ]
      }
    },
    {
      "id": "203-3A1-spaced-review",
      "type": "spaced-review",
      "order": 10,
      "content": {
        "title": "Final Knowledge Review",
        "questions": [
          {
            "id": "203-3A1-SR-1",
            "questionText": "What is the standard unit of measurement for electrical current?",
            "expectedAnswer": [
              "Ampere",
              "Amperes",
              "Amps",
              "Amp",
              "A"
            ],
            "hint": "The unit symbol is 'A'.",
            "answerType": "short-text"
          },
          {
            "id": "203-3A1-SR-2",
            "questionText": "What term is used to describe a material, such as copper, that allows electrical current to flow through it easily?",
            "expectedAnswer": [
              "Conductor",
              "Conductors",
              "Conductive"
            ],
            "hint": "It is the opposite of an insulator.",
            "answerType": "short-text"
          },
          {
            "id": "203-3A1-SR-3",
            "questionText": "What is the name of the basic component used to manually open or close an electrical circuit?",
            "expectedAnswer": [
              "Switch",
              "Switches",
              "A switch"
            ],
            "hint": "You use this to turn a light on or off.",
            "answerType": "short-text"
          }
        ],
        "notes": "Review of foundational electrical concepts.\n\n### Key Points Summary\n- Final circuits are categorized by function (lighting, power, data).\n- Radial circuits follow a linear path; Ring final circuits form a loop.\n- Separation of circuits ensures safety of movement during faults.\n- Ring circuits allow for cable economy but require careful testing for continuity.\n\n**Coming Up Next:**\nCircuit Protection and Overcurrent Devices."
      }
    }
  ],
  "metadata": {
    "created": "2026-02-07",
    "updated": "2026-02-07",
    "version": "1.0",
    "author": "C&G 2365 Learning Team"
  }
}

SCORING REPORT (issues + suggestions):
Total Score: 94/100 (Strong)

Issues by Section:

## beginnerClarityStaging: The term 'BS 7671' is introduced in the explanation 'Functio... (0/2)
- Issue: The term 'BS 7671' is introduced in the explanation 'Functional Circuit Categories' without being defined in the vocabulary block or previous text, which may confuse beginners.
  Suggestion: Append to blocks[1].content.terms: '[object Object]'

## markingRobustness: Synthesis question 203-3A1-INT-2 asks for 2-3 sentences, but... (0/2)
- Issue: Synthesis question 203-3A1-INT-2 asks for 2-3 sentences, but the expectedAnswer variations are single phrases. This will cause high friction in grading.
  Suggestion: Change blocks[8].content.questions[1].expectedAnswer from 'safety of movement and cable economy,fault isolation and load sharing,prevents dark rooms and overheating,continuity of service and efficiency,safety of movement and fault isolation,isolation and economy,separation ensures lighting during power faults while ring circuits provide efficient load sharing,circuit separation maintains safety of movement and ring topology offers cable economy' to 'separation ensures lighting remains active during power faults for safety of movement while ring circuits provide efficient load sharing,maintains safety of movement by isolating faults and provides cable economy through ring topology,separating circuits prevents total blackout and ring final circuits allow smaller cables to handle larger loads,ensures continuity of service for lighting and cost-effective power distribution via ring loops,prevents tripping of lights when sockets fail and allows load sharing across two paths in a ring'

## questions: Question 203-3A1-INT-2 uses 'Answer in 2-3 sentences'. To be... (0/1)
- Issue: Question 203-3A1-INT-2 uses 'Answer in 2-3 sentences'. To better align with the pedagogical contract for synthesis grading, it should offer the option for bullet points.
  Suggestion: Modify blocks[8].content.questions[1].questionText

## beginnerClarityStaging: The explanation uses the phrase 'still-functioning lighting'... (0/2)
- Issue: The explanation uses the phrase 'still-functioning lighting' to describe a concept, but the check question answer expects 'continuity of service'. Terminology should be perfectly aligned for beginners.
  Suggestion: Modify blocks[3].content.content

## beginnerClarityStaging: The 'Coming Up Next' transition is located in the 'notes' fi... (0/1)
- Issue: The 'Coming Up Next' transition is located in the 'notes' field of the spaced review. It is more effective when placed clearly at the end of the lesson content for visibility.
  Suggestion: Modify blocks[9].content.notes


TASK:
- Produce a refined version of the full lesson JSON that addresses the scoring issues.
- Preserve ALL structural invariants (same blocks, same ids/types/orders, same block count).
- Return ONLY the refined JSON.
```

### Rewrite Output (Raw Model Response)

```json
{
  "id": "203-3A1",
  "title": "203.3A1 — Circuit Types: What They Do",
  "description": "Learn about Circuit Types: What They Do in Electrical Installations Technology",
  "layout": "split-vis",
  "unit": "Unit 203",
  "topic": "Circuit Types: What They Do",
  "learningOutcomes": [
    "Identify the primary functions of different circuit types including lighting, power, and data",
    "Describe the operating principles of ring final and radial circuit topologies",
    "Explain the typical applications for specialized circuits such as emergency lighting and control systems"
  ],
  "prerequisites": [],
  "blocks": [
    {
      "id": "203-3A1-outcomes",
      "type": "outcomes",
      "order": 1,
      "content": {
        "outcomes": [
          {
            "text": "Identify the primary functions of different circuit types including lighting, power, and data",
            "bloomLevel": "remember"
          },
          {
            "text": "Describe the operating principles of ring final and radial circuit topologies",
            "bloomLevel": "understand"
          },
          {
            "text": "Explain the typical applications for specialized circuits such as emergency lighting and control systems",
            "bloomLevel": "understand"
          }
        ]
      }
    },
    {
      "id": "203-3A1-vocab",
      "type": "vocab",
      "order": 2,
      "content": {
        "terms": [
          {
            "term": "Final Circuit",
            "definition": "A circuit intended to supply electrical energy directly to current-using equipment or socket-outlets."
          },
          {
            "term": "Radial Circuit",
            "definition": "An electrical circuit that originates from a distribution board and runs to one or more points, terminating at the final outlet."
          },
          {
            "term": "Ring Final Circuit",
            "definition": "A circuit that starts and ends at the same protective device in the distribution board, forming a continuous loop to supply socket-outlets."
          },
          {
            "term": "Control Circuit",
            "definition": "A circuit used to regulate or manage the operation of other electrical equipment or larger power circuits."
          },
          {
            "term": "Data Circuit",
            "definition": "A specialized circuit designed for the transmission of digital information rather than the distribution of power."
          },
          {
            "term": "Emergency Lighting",
            "definition": "Lighting intended to provide illumination for the safety of people leaving a location when the normal power supply fails."
          },
          {
            "term": "BS 7671",
            "definition": "The British Standard for Requirements for Electrical Installations, also known as the IET Wiring Regulations."
          }
        ]
      }
    },
    {
      "id": "203-3A1-diagram",
      "type": "diagram",
      "order": 3,
      "content": {
        "title": "Circuit Types: What They Do Diagram",
        "description": "Visual representation of Circuit Types: What They Do",
        "videoUrl": "",
        "diagramType": "circuit",
        "elementIds": [
          "ring-final-circuit",
          "radial-circuit",
          "distribution-board",
          "socket-outlet",
          "final-circuit",
          "control-circuit",
          "data-circuit"
        ],
        "placeholderText": "The diagram should show two side-by-side comparisons. On the left, a distribution-board with a radial-circuit extending to three socket-outlet symbols in a linear line, ending at the last one. On the right, the same distribution-board with a ring-final-circuit shown as a continuous loop: two conductors leaving the same breaker, visiting several socket-outlet points in a circle, and both returning to the same terminal. Labels should clearly identify each as a final-circuit type. Additionally, include a small inset diagram showing a Data Circuit (using twisted-pair symbols) and a Control Circuit (connecting a sensor to a load) to illustrate functional variety beyond power distribution."
      }
    },
    {
      "id": "203-3A1-explain-1",
      "type": "explanation",
      "order": 4,
      "content": {
        "title": "Functional Circuit Categories",
        "content": "### In this lesson\nThis lesson explores how to identify the primary functions of different circuit types including lighting, power, and data. As shown in the functional diagram, different circuits serve distinct purposes. You are acting as an installation technician planning the layout of a new mixed-use building. \n\n*   Differentiate between power, lighting, and specialized circuits.\n*   Understand the purpose of control and data transmission systems.\n*   Identify the unique requirements for emergency and safety systems.\n\n**What this is**\nIn any electrical installation, every **Final Circuit** is categorized by its intended function. A **Final Circuit** is a circuit intended to supply electrical energy directly to current-using equipment or socket-outlets. Common categories include lighting circuits for illumination, power circuits for general-purpose socket-outlets, and specialized circuits like a **Control Circuit** or a **Data Circuit**.\n\n**Why it matters**\nUnderstanding circuit functions is critical for safety and efficiency. Separating functions ensures that a fault on a power circuit (such as a tripped socket) does not plunge a whole building into darkness. This ensures **continuity of service** and **safety of movement**, allowing occupants to navigate the building using the still-functioning lighting circuits.\n\n**Key facts / rules**\n*   Lighting circuits typically supply fixed luminaires and are often rated lower than power circuits.\n*   Power circuits supply socket-outlets or fixed appliances like heaters and cookers.\n*   A **Control Circuit** is used to regulate or manage the operation of other electrical equipment, often facilitating **remote switching** of high-power loads via thermostats or sensors.\n*   A **Data Circuit** is designed for the transmission of information rather than power distribution, often using twisted-pair or fiber-optic cabling.\n*   Emergency lighting circuits must provide illumination when the normal supply fails.\n*   All circuits must be clearly identified at the distribution board according to **BS 7671** (the UK Wiring Regulations) to prevent dangerous mistakes during maintenance.\n\n**When to choose it**\nYou should choose a dedicated lighting circuit when the primary goal is to provide fixed illumination. Power circuits are selected for general-purpose use. You would select a **Control Circuit** when you need to manage a high-power load from a remote switch or sensor. **Data Circuit** selection is necessary for networking. Emergency lighting is chosen specifically for escape routes to ensure safety during power outages.\n\n**Common mistakes**\nOne common error is mixing functional types, such as connecting a high-power heater to a lighting circuit. Another mistake is failing to provide adequate separation between power cables and a **Data Circuit**, which can lead to electromagnetic interference (EMI).\n\n**Key Points**\n*   A **Final Circuit** delivers energy or signals directly to the end-user equipment.\n*   Lighting and power circuits must be separated to maintain **continuity of service** and **safety of movement**.\n*   **Control Circuit** arrangements allow for the safe management of loads through **remote switching**.\n*   **Data Circuit** systems focus on information transmission and require protection from interference.\n*   Emergency lighting provides critical illumination during mains power failure.\n*   All circuits must be clearly identified at the distribution board to **BS 7671** standards.\n\n**Quick recap**\nElectrical installations are divided into functional categories to ensure safety and usability. Lighting, power, control, data, and emergency circuits each serve a specific role. Proper identification and selection of these types are essential for a compliant installation."
      }
    },
    {
      "id": "203-3A1-check-1",
      "type": "practice",
      "order": 4.5,
      "content": {
        "title": "Check Your Understanding: Functional Circuit Categories",
        "mode": "conceptual",
        "sequential": true,
        "questions": [
          {
            "id": "203-3A1-C1-L1-A",
            "questionText": "What is the purpose of a Final Circuit?",
            "answerType": "short-text",
            "cognitiveLevel": "recall",
            "expectedAnswer": [
              "supply energy to equipment",
              "supply current-using equipment",
              "supply socket-outlets",
              "energy delivery to equipment",
              "powering end-use devices",
              "supply energy to outlets",
              "supply current to equipment"
            ],
            "hint": "Look at the definition of a circuit that delivers energy to end-user equipment."
          },
          {
            "id": "203-3A1-C1-L1-B",
            "questionText": "What is the specific function of a Control Circuit?",
            "answerType": "short-text",
            "cognitiveLevel": "recall",
            "expectedAnswer": [
              "regulate or manage equipment",
              "manage operation of equipment",
              "control other electrical equipment",
              "manage power circuits",
              "remote switching"
            ],
            "hint": "Identify the circuit type used for managing the operation of other systems."
          },
          {
            "id": "203-3A1-C1-L1-C",
            "questionText": "What is the primary purpose for selecting a Data Circuit?",
            "answerType": "short-text",
            "cognitiveLevel": "recall",
            "expectedAnswer": [
              "transmission of information",
              "information transfer",
              "digital or analogue information",
              "data transmission"
            ],
            "hint": "Consider what type of circuit is chosen when information transfer is the priority."
          },
          {
            "id": "203-3A1-C1-L2",
            "questionText": "What is a primary safety benefit of separating lighting and power into different functional categories?",
            "answerType": "short-text",
            "cognitiveLevel": "connection",
            "expectedAnswer": [
              "continuity of service",
              "prevent loss of lighting",
              "fault isolation",
              "maintain illumination",
              "safety of movement"
            ],
            "hint": "Think about what happens to the lights if a socket-outlet circuit trips and how that affects people moving in the building."
          }
        ]
      }
    },
    {
      "id": "203-3A1-explain-2",
      "type": "explanation",
      "order": 5,
      "content": {
        "title": "Circuit Topologies: Ring vs Radial",
        "content": "### In this lesson\nIn this section, we examine the operating principles of ring final and radial circuit topologies. As shown in the diagram's comparison of topologies, circuit layout is key. You are designing the wiring layout for a domestic dwelling to determine the most efficient way to connect socket-outlets. \n\n*   Describe the continuous loop principle of a ring final circuit.\n*   Identify the start-to-finish layout of a radial circuit.\n*   Compare the typical applications for both circuit arrangements.\n\n**What this is**\nCircuit topology refers to the physical layout of the wiring. In the UK, the two most common topologies for a **Final Circuit** are the **Radial Circuit** and the **Ring Final Circuit**. A **Radial Circuit** originates from a distribution board and runs to one or more points, terminating at the final outlet. In contrast, a **Ring Final Circuit** starts and ends at the same protective device in the distribution board, forming a continuous loop to supply socket-outlets.\n\n**Why it matters**\nThe choice of topology affects cable usage and load handling. A **Ring Final Circuit** allows for smaller conductors to supply a larger area because the load is shared across two paths. However, if the loop is broken (a \"broken ring\"), the circuit may still appear to work while overstressing the remaining cable. This poses a severe **overheating and fire risk** because the conductors are no longer sharing the load as designed. A **Radial Circuit** is simpler to test but may require larger cables for high-power appliances.\n\n**Key facts / rules**\n*   A **Radial Circuit** is like a branch of a tree, stopping at the last point of use.\n*   A **Ring Final Circuit** must be a continuous loop to function as intended by design.\n*   Radial circuits are commonly used for lighting and high-load fixed appliances like cookers.\n*   Ring final circuits are typically used for general-purpose socket-outlets.\n*   In a ring, current travels in both directions from the distribution board to the load.\n\n**When to choose it**\nChoose a **Radial Circuit** for dedicated high-power appliances, such as an electric shower, where the load is at a single point. Radials are also the standard choice for lighting. Choose a **Ring Final Circuit** when you need to provide many socket-outlets over a large floor area, as it is often more cost-effective for cable usage.\n\n**Common mistakes**\nA major mistake is creating an \"interconnected\" circuit with a bridge. Another is failing to ensure both ends of a **Ring Final Circuit** are terminated into the same terminal. Failing to verify the continuity of the ring during commissioning can leave a dangerous \"broken ring\" undetected, leading to potential **overheating** of the conductors.\n\n**Key Points**\n*   **Radial Circuit** topology runs from the source to the last point and stops.\n*   **Ring Final Circuit** topology forms a complete loop back to the source.\n*   Rings support higher total loads with smaller cables but carry an **overheating and fire risk** if the loop is broken.\n*   Radials are simpler to diagnose and used for lighting and heavy fixed loads.\n\n**Quick recap**\nRadials follow a linear path, while ring final circuits form a loop. Each has advantages depending on the load type and area served, but rings require careful continuity testing to ensure safety."
      }
    },
    {
      "id": "203-3A1-check-2",
      "type": "practice",
      "order": 5.5,
      "content": {
        "title": "Check Your Understanding: Circuit Topologies: Ring vs Radial",
        "mode": "conceptual",
        "sequential": true,
        "questions": [
          {
            "id": "203-3A1-C2-L1-A",
            "questionText": "Identify the path of a Radial Circuit from the distribution board.",
            "answerType": "short-text",
            "cognitiveLevel": "recall",
            "expectedAnswer": [
              "originates from distribution board",
              "runs to one or more points",
              "terminates at final outlet",
              "linear path"
            ],
            "hint": "Describe the linear path this circuit takes from its source."
          },
          {
            "id": "203-3A1-C2-L1-B",
            "questionText": "Where does a Ring Final Circuit start and end?",
            "answerType": "short-text",
            "cognitiveLevel": "recall",
            "expectedAnswer": [
              "same protective device",
              "distribution board",
              "source and end at same terminal",
              "breaker",
              "consumer unit",
              "fuse board"
            ],
            "hint": "Identify the location where both ends of the loop are terminated."
          },
          {
            "id": "203-3A1-C2-L1-C",
            "questionText": "What specific physical condition must a Ring Final Circuit meet to function as intended?",
            "answerType": "short-text",
            "cognitiveLevel": "recall",
            "expectedAnswer": [
              "continuous loop",
              "closed loop",
              "no breaks in loop",
              "complete ring"
            ],
            "hint": "State the necessary loop requirement for this topology to work correctly."
          },
          {
            "id": "203-3A1-C2-L2",
            "questionText": "State the primary safety risk associated with a broken ring final circuit.",
            "answerType": "short-text",
            "cognitiveLevel": "connection",
            "expectedAnswer": [
              "overheating",
              "fire risk",
              "overstressing cable",
              "cable failure",
              "overloaded conductor"
            ],
            "hint": "Consider what happens to the remaining cable if the load-sharing loop is broken."
          }
        ]
      }
    },
    {
      "id": "203-3A1-practice",
      "type": "practice",
      "order": 8,
      "content": {
        "title": "Your Turn (You Do)",
        "questions": [
          {
            "id": "203-3A1-P1",
            "questionText": "Identify the specialized circuit type required to provide illumination for the safety of people leaving a location when the normal power supply fails.",
            "answerType": "short-text",
            "expectedAnswer": [
              "Emergency Lighting",
              "Emergency Lighting Circuit",
              "Emergency Lights",
              "Emergency lighting system"
            ],
            "hint": "Consider the systems designed to operate when the main power supply is lost."
          },
          {
            "id": "203-3A1-P2",
            "questionText": "An installation technician is planning general-purpose socket-outlets across a large domestic floor area. Which circuit topology is most cost-effective for cable usage in this scenario?",
            "answerType": "short-text",
            "expectedAnswer": [
              "Ring Final Circuit",
              "A Ring Final Circuit",
              "Ring Final",
              "Ring circuit",
              "Ring topology"
            ],
            "hint": "This topology forms a continuous loop back to the distribution board."
          },
          {
            "id": "203-3A1-P3",
            "questionText": "State the primary purpose of a Control Circuit within an electrical system.",
            "answerType": "short-text",
            "expectedAnswer": [
              "regulate or manage equipment",
              "manage operation of equipment",
              "control other electrical equipment",
              "remote switching",
              "switching high power loads",
              "manage power circuits",
              "control of equipment",
              "switching for high power loads"
            ],
            "hint": "Think about how a thermostat interacts with a heating pump or how remote switching manages high-power loads."
          },
          {
            "id": "203-3A1-P4",
            "questionText": "Which circuit topology is typically the standard choice for dedicated high-power fixed appliances, such as an electric shower or a cooker?",
            "answerType": "short-text",
            "expectedAnswer": [
              "Radial Circuit",
              "a Radial Circuit",
              "the Radial Circuit",
              "Radial"
            ],
            "hint": "This layout runs from the source and stops at the final outlet."
          },
          {
            "id": "203-3A1-P5",
            "questionText": "What term describes a circuit intended to supply electrical energy directly to current-using equipment or socket-outlets?",
            "answerType": "short-text",
            "expectedAnswer": [
              "Final Circuit",
              "Final",
              "Final circuits",
              "A final circuit"
            ],
            "hint": "These are categorized by their intended function at the end of the installation."
          }
        ]
      }
    },
    {
      "id": "203-3A1-integrative",
      "type": "practice",
      "order": 9.5,
      "content": {
        "title": "Putting It All Together",
        "mode": "integrative",
        "sequential": true,
        "questions": [
          {
            "id": "203-3A1-INT-1",
            "questionText": "Compare domestic lighting and general-purpose socket-outlets by identifying the standard circuit topology for each.",
            "answerType": "short-text",
            "cognitiveLevel": "connection",
            "expectedAnswer": [
              "lighting: radial; sockets: ring",
              "lighting: radial; power: ring final",
              "radial for lighting and ring for sockets",
              "lighting is radial, sockets are ring final",
              "lighting: radial; socket-outlets: ring final"
            ],
            "hint": "Think about the difference in power demand between a single light bulb and multiple high-draw appliances on a socket circuit."
          },
          {
            "id": "203-3A1-INT-2",
            "questionText": "Explain the integrated benefits of separating lighting from power circuits and using ring topologies for sockets. Answer in 3-4 sentences OR concise bullet points.",
            "answerType": "short-text",
            "cognitiveLevel": "synthesis",
            "expectedAnswer": [
              "continuity of service",
              "safety of movement",
              "fault isolation",
              "cable economy",
              "load sharing across paths",
              "preventing total darkness"
            ],
            "hint": "Recall how separation ensures people can see during faults, while ring topologies allow for efficient load sharing across smaller cables."
          }
        ]
      }
    },
    {
      "id": "203-3A1-spaced-review",
      "type": "spaced-review",
      "order": 10,
      "content": {
        "title": "Final Knowledge Review",
        "questions": [
          {
            "id": "203-3A1-SR-1",
            "questionText": "What is the standard unit of measurement for electrical current?",
            "expectedAnswer": [
              "Ampere",
              "Amperes",
              "Amps",
              "Amp",
              "A"
            ],
            "hint": "The unit symbol is 'A'.",
            "answerType": "short-text"
          },
          {
            "id": "203-3A1-SR-2",
            "questionText": "What term is used to describe a material, such as copper, that allows electrical current to flow through it easily?",
            "expectedAnswer": [
              "Conductor",
              "Conductors",
              "Conductive"
            ],
            "hint": "It is the opposite of an insulator.",
            "answerType": "short-text"
          },
          {
            "id": "203-3A1-SR-3",
            "questionText": "What is the name of the basic component used to manually open or close an electrical circuit?",
            "expectedAnswer": [
              "Switch",
              "Switches",
              "A switch"
            ],
            "hint": "You use this to turn a light on or off.",
            "answerType": "short-text"
          }
        ],
        "notes": "Review of foundational electrical concepts.\n\n### Key Points Summary\n- Final circuits are categorized by function (lighting, power, data).\n- Radial circuits follow a linear path; Ring final circuits form a loop.\n- Separation of circuits ensures safety of movement during faults.\n- Ring circuits allow for cable economy but require careful testing for continuity.\n\n**Coming Up Next:** Circuit Protection and Overcurrent Devices."
      }
    }
  ],
  "metadata": {
    "created": "2026-02-07",
    "updated": "2026-02-07",
    "version": "1.0",
    "author": "C&G 2365 Learning Team"
  }
}
```

---

## Patch/Parse Artifacts

_These files exist even for rewrite strategy to show whether patch logic was invoked._

### Patches Parsed

**File:** `14_patches_parsed.json`

```json
[]
```

---

## Pointer Diff (JSON Pointer Format)

**Changes:** 19

```json
{
  "lessonId": "203-3A1",
  "timestamp": "2026-02-07T16:22:54.699Z",
  "changes": [
    {
      "op": "add",
      "path": "/blocks/1/content/terms/6",
      "after": {
        "term": "BS 7671",
        "definition": "The British Standard for Requirements for Electrical Installations, also known as the IET Wiring Regulations."
      },
      "summary": "Added element at blocks.1.content.terms.6"
    },
    {
      "op": "replace",
      "path": "/blocks/3/content/content",
      "before": "### In this lesson\nThis lesson explores how to identify the primary functions of different circuit types including lighting, power, and data. As shown in the functional diagram, different circuits serve distinct purposes. You are acting as an installation technician planning the layout of a new mixed-use building. \n\n*   Differentiate between power, lighting, and specialized circuits.\n*   Understand the purpose of control and data transmission systems.\n*   Identify the unique requirements for emergency and safety systems.\n\n**What this is**\nIn any electrical installation, every **Final Circuit** is categorized by its intended function. A **Final Circuit** is a circuit intended to supply electrical energy directly to current-using equipment or socket-outlets. Common categories include lighting circuits for illumination, power circuits for general-purpose socket-outlets, and specialized circuits like a **Control Circuit** or a **Data Circuit**.\n\n**Why it matters**\nUnderstanding circuit functions is critical for safety and efficiency. Separating functions ensures that a fault on a power circuit (such as a tripped socket) does not plunge a whole building into darkness. This ensures **safety of movement**, allowing occupants to navigate the building using the still-functioning lighting circuits. Specialized systems like emergency lighting must also be identified correctly to ensure they function during a mains failure.\n\n**Key facts / rules**\n*   Lighting circuits typically supply fixed luminaires and are often rated lower than power circuits.\n*   Power circuits supply socket-outlets or fixed appliances like heaters and cookers.\n*   A **Control Circuit** is used to regulate or manage the operation of other electrical equipment, often facilitating **remote switching** of high-power loads via thermostats or sensors.\n*   A **Data Circuit** is designed for the transmission of information rather than power distribution, often using twisted-pair or fiber-optic cabling.\n*   Emergency lighting circuits must provide illumination when the normal supply fails.\n*   All circuits must be clearly identified at the distribution board according to BS 7671 to prevent dangerous mistakes during maintenance.\n\n**When to choose it**\nYou should choose a dedicated lighting circuit when the primary goal is to provide fixed illumination. Power circuits are selected for general-purpose use. You would select a **Control Circuit** when you need to manage a high-power load from a remote switch or sensor. **Data Circuit** selection is necessary for networking. Emergency lighting is chosen specifically for escape routes to ensure safety during power outages.\n\n**Common mistakes**\nOne common error is mixing functional types, such as connecting a high-power heater to a lighting circuit. Another mistake is failing to provide adequate separation between power cables and a **Data Circuit**, which can lead to electromagnetic interference (EMI).\n\n**Key Points**\n*   A **Final Circuit** delivers energy or signals directly to the end-user equipment.\n*   Lighting and power circuits must be separated to maintain continuity of service and **safety of movement**.\n*   **Control Circuit** arrangements allow for the safe management of loads through **remote switching**.\n*   **Data Circuit** systems focus on information transmission and require protection from interference.\n*   Emergency lighting provides critical illumination during mains power failure.\n*   All circuits must be clearly identified at the distribution board to BS 7671 standards.\n\n**Quick recap**\nElectrical installations are divided into functional categories to ensure safety and usability. Lighting, power, control, data, and emergency circuits each serve a specific role. Proper identification and selection of these types are essential for a compliant installation.",
      "after": "### In this lesson\nThis lesson explores how to identify the primary functions of different circuit types including lighting, power, and data. As shown in the functional diagram, different circuits serve distinct purposes. You are acting as an installation technician planning the layout of a new mixed-use building. \n\n*   Differentiate between power, lighting, and specialized circuits.\n*   Understand the purpose of control and data transmission systems.\n*   Identify the unique requirements for emergency and safety systems.\n\n**What this is**\nIn any electrical installation, every **Final Circuit** is categorized by its intended function. A **Final Circuit** is a circuit intended to supply electrical energy directly to current-using equipment or socket-outlets. Common categories include lighting circuits for illumination, power circuits for general-purpose socket-outlets, and specialized circuits like a **Control Circuit** or a **Data Circuit**.\n\n**Why it matters**\nUnderstanding circuit functions is critical for safety and efficiency. Separating functions ensures that a fault on a power circuit (such as a tripped socket) does not plunge a whole building into darkness. This ensures **continuity of service** and **safety of movement**, allowing occupants to navigate the building using the still-functioning lighting circuits.\n\n**Key facts / rules**\n*   Lighting circuits typically supply fixed luminaires and are often rated lower than power circuits.\n*   Power circuits supply socket-outlets or fixed appliances like heaters and cookers.\n*   A **Control Circuit** is used to regulate or manage the operation of other electrical equipment, often facilitating **remote switching** of high-power loads via thermostats or sensors.\n*   A **Data Circuit** is designed for the transmission of information rather than power distribution, often using twisted-pair or fiber-optic cabling.\n*   Emergency lighting circuits must provide illumination when the normal supply fails.\n*   All circuits must be clearly identified at the distribution board according to **BS 7671** (the UK Wiring Regulations) to prevent dangerous mistakes during maintenance.\n\n**When to choose it**\nYou should choose a dedicated lighting circuit when the primary goal is to provide fixed illumination. Power circuits are selected for general-purpose use. You would select a **Control Circuit** when you need to manage a high-power load from a remote switch or sensor. **Data Circuit** selection is necessary for networking. Emergency lighting is chosen specifically for escape routes to ensure safety during power outages.\n\n**Common mistakes**\nOne common error is mixing functional types, such as connecting a high-power heater to a lighting circuit. Another mistake is failing to provide adequate separation between power cables and a **Data Circuit**, which can lead to electromagnetic interference (EMI).\n\n**Key Points**\n*   A **Final Circuit** delivers energy or signals directly to the end-user equipment.\n*   Lighting and power circuits must be separated to maintain **continuity of service** and **safety of movement**.\n*   **Control Circuit** arrangements allow for the safe management of loads through **remote switching**.\n*   **Data Circuit** systems focus on information transmission and require protection from interference.\n*   Emergency lighting provides critical illumination during mains power failure.\n*   All circuits must be clearly identified at the distribution board to **BS 7671** standards.\n\n**Quick recap**\nElectrical installations are divided into functional categories to ensure safety and usability. Lighting, power, control, data, and emergency circuits each serve a specific role. Proper identification and selection of these types are essential for a compliant installation.",
      "summary": "Updated content in blocks.3"
    },
    {
      "op": "replace",
      "path": "/blocks/8/content/questions/0/expectedAnswer/0",
      "before": "radial and ring",
      "after": "lighting: radial; sockets: ring",
      "summary": "Updated expected answer at blocks.8.content.questions.0.expectedAnswer.0"
    },
    {
      "op": "replace",
      "path": "/blocks/8/content/questions/0/expectedAnswer/1",
      "before": "radial; ring",
      "after": "lighting: radial; power: ring final",
      "summary": "Updated expected answer at blocks.8.content.questions.0.expectedAnswer.1"
    },
    {
      "op": "replace",
      "path": "/blocks/8/content/questions/0/expectedAnswer/2",
      "before": "radial for lighting and ring for power",
      "after": "radial for lighting and ring for sockets",
      "summary": "Updated expected answer at blocks.8.content.questions.0.expectedAnswer.2"
    },
    {
      "op": "replace",
      "path": "/blocks/8/content/questions/0/expectedAnswer/3",
      "before": "lighting is radial and sockets are ring",
      "after": "lighting is radial, sockets are ring final",
      "summary": "Updated expected answer at blocks.8.content.questions.0.expectedAnswer.3"
    },
    {
      "op": "replace",
      "path": "/blocks/8/content/questions/0/expectedAnswer/4",
      "before": "radial for lighting and ring final for sockets",
      "after": "lighting: radial; socket-outlets: ring final",
      "summary": "Updated expected answer at blocks.8.content.questions.0.expectedAnswer.4"
    },
    {
      "op": "remove",
      "path": "/blocks/8/content/questions/0/expectedAnswer/5",
      "before": "radial and ring final",
      "summary": "Removed element at blocks.8.content.questions.0.expectedAnswer.5"
    },
    {
      "op": "remove",
      "path": "/blocks/8/content/questions/0/expectedAnswer/6",
      "before": "radial then ring",
      "summary": "Removed element at blocks.8.content.questions.0.expectedAnswer.6"
    },
    {
      "op": "replace",
      "path": "/blocks/8/content/questions/1/questionText",
      "before": "Explain the integrated benefits of separating lighting from power circuits and using ring topologies for sockets. Answer in 2-3 sentences.",
      "after": "Explain the integrated benefits of separating lighting from power circuits and using ring topologies for sockets. Answer in 3-4 sentences OR concise bullet points.",
      "summary": "Modified question text at blocks.8.content.questions.1.questionText"
    },
    {
      "op": "replace",
      "path": "/blocks/8/content/questions/1/expectedAnswer/0",
      "before": "safety of movement and cable economy",
      "after": "continuity of service",
      "summary": "Updated expected answer at blocks.8.content.questions.1.expectedAnswer.0"
    },
    {
      "op": "replace",
      "path": "/blocks/8/content/questions/1/expectedAnswer/1",
      "before": "fault isolation and load sharing",
      "after": "safety of movement",
      "summary": "Updated expected answer at blocks.8.content.questions.1.expectedAnswer.1"
    },
    {
      "op": "replace",
      "path": "/blocks/8/content/questions/1/expectedAnswer/2",
      "before": "prevents dark rooms and overheating",
      "after": "fault isolation",
      "summary": "Updated expected answer at blocks.8.content.questions.1.expectedAnswer.2"
    },
    {
      "op": "replace",
      "path": "/blocks/8/content/questions/1/expectedAnswer/3",
      "before": "continuity of service and efficiency",
      "after": "cable economy",
      "summary": "Updated expected answer at blocks.8.content.questions.1.expectedAnswer.3"
    },
    {
      "op": "replace",
      "path": "/blocks/8/content/questions/1/expectedAnswer/4",
      "before": "safety of movement and fault isolation",
      "after": "load sharing across paths",
      "summary": "Updated expected answer at blocks.8.content.questions.1.expectedAnswer.4"
    },
    {
      "op": "replace",
      "path": "/blocks/8/content/questions/1/expectedAnswer/5",
      "before": "isolation and economy",
      "after": "preventing total darkness",
      "summary": "Updated expected answer at blocks.8.content.questions.1.expectedAnswer.5"
    },
    {
      "op": "remove",
      "path": "/blocks/8/content/questions/1/expectedAnswer/6",
      "before": "separation ensures lighting during power faults while ring circuits provide efficient load sharing",
      "summary": "Removed element at blocks.8.content.questions.1.expectedAnswer.6"
    },
    {
      "op": "remove",
      "path": "/blocks/8/content/questions/1/expectedAnswer/7",
      "before": "circuit separation maintains safety of movement and ring topology offers cable economy",
      "summary": "Removed element at blocks.8.content.questions.1.expectedAnswer.7"
    },
    {
      "op": "replace",
      "path": "/blocks/9/content/notes",
      "before": "Review of foundational electrical concepts.\n\n### Key Points Summary\n- Final circuits are categorized by function (lighting, power, data).\n- Radial circuits follow a linear path; Ring final circuits form a loop.\n- Separation of circuits ensures safety of movement during faults.\n- Ring circuits allow for cable economy but require careful testing for continuity.\n\n**Coming Up Next:**\nCircuit Protection and Overcurrent Devices.",
      "after": "Review of foundational electrical concepts.\n\n### Key Points Summary\n- Final circuits are categorized by function (lighting, power, data).\n- Radial circuits follow a linear path; Ring final circuits form a loop.\n- Separation of circuits ensures safety of movement during faults.\n- Ring circuits allow for cable economy but require careful testing for continuity.\n\n**Coming Up Next:** Circuit Protection and Overcurrent Devices.",
      "summary": "Changed blocks.9.content.notes from \"Review of foundational electrical concepts.\n\n### K...\" to \"Review of foundational electrical concepts.\n\n### K...\""
    }
  ]
}
```

---

## Index Manifest

**File:** `INDEX.json`

```json
{
  "lessonId": "203-3A1",
  "runId": "203-3A1__2026-02-07T16-21-27-925Z__rewrite__gemini-3-flash-preview",
  "timestampUtc": "2026-02-07T16:21:27.924Z",
  "phase10Strategy": "rewrite",
  "models": {
    "rewrite": "gemini-3-flash-preview",
    "scoring": "gemini-3-flash-preview"
  },
  "runConfig": null,
  "scoreBefore": {
    "total": 94,
    "grade": "Strong",
    "breakdownFile": "01_score_before.json",
    "promptFile": "05_prompt_score_before.json",
    "outputFile": "06_output_score_before.txt",
    "metadata": null
  },
  "scoreAfter": {
    "total": 95,
    "grade": "Strong",
    "breakdownFile": "11_score_after.json",
    "promptFile": "12_prompt_score_after.json",
    "outputFile": "13_output_score_after.txt",
    "metadata": null
  },
  "scoreStability": null,
  "fixPlan": null,
  "issueLifecycle": null,
  "pointerDiff": {
    "file": "19_pointer_diff.json",
    "changeCount": 19
  },
  "blockers": null,
  "validator": {
    "passed": true,
    "warnings": 0,
    "file": "16_validation.json"
  },
  "patching": {
    "patchCountProposed": 0,
    "patchCountApplied": 0,
    "applyFile": null,
    "parseFile": "14_patches_parsed.json"
  },
  "rewriteMetadata": null,
  "status": "success",
  "failure": null,
  "files": [
    "00_input_lesson.json",
    "01_score_before.json",
    "02_prompt_rewrite.json",
    "03_output_rewrite.txt",
    "10_output_lesson.json",
    "11_score_after.json",
    "14_patches_parsed.json",
    "16_validation.json",
    "17_diff.txt",
    "19_pointer_diff.json"
  ]
}
```

---

## Validation Results

**File:** `16_validation.json`

```json
{
  "valid": true,
  "errors": [],
  "warnings": [],
  "validators": {
    "structuralInvariants": {
      "passed": true,
      "errors": [],
      "warnings": []
    },
    "blockCompleteness": {
      "passed": true,
      "errors": [],
      "warnings": []
    },
    "corruptionDetection": {
      "passed": true,
      "errors": [],
      "warnings": []
    },
    "synthesisInstructions": {
      "passed": true,
      "errors": [],
      "warnings": []
    }
  }
}
```

---

## Human-Readable Diff

**File:** `17_diff.txt`

```
# Phase 10 Lesson Diff

Lesson: 203-3A1
Timestamp: 2026-02-07T16:22:54.696Z

================================================================================

## Metadata Changes

## Block Changes

Block 1: vocab (203-3A1-vocab) - CHANGED

  Content: CHANGED (1141 → 1311 chars)
    - terms: CHANGED

Block 3: explanation (203-3A1-explain-1) - CHANGED

  Content: CHANGED (3940 → 3884 chars)
    - content: CHANGED

Block 8: practice (203-3A1-integrative) - CHANGED

  Content: CHANGED (1753 → 1470 chars)
    - questions: CHANGED

Block 9: spaced-review (203-3A1-spaced-review) - CHANGED

  Content: CHANGED (1539 → 1538 chars)
    - notes: CHANGED

================================================================================

Summary: 4 of 10 blocks changed

Before Hash: 6b7e1d81f69dafc4
After Hash:  cdc4b82b63f4756c
```

---

## End of Report

Generated: 2026-02-07T16:22:54.703Z
Total files: 12
