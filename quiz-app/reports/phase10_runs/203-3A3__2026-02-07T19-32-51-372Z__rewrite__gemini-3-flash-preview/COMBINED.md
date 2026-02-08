# Phase 10 Debug Run

**Run ID:** 203-3A3__2026-02-07T19-32-51-372Z__rewrite__gemini-3-flash-preview
**Lesson:** 203-3A3
**Strategy:** rewrite
**Timestamp:** 2026-02-07T19:32:51.372Z
**Status:** failed

================================================================================

## Summary

- **Score Before:** 97/100 (Strong)
- **Score After:** 96/100 (Strong)
- **Delta:** -1 points
- **Validation:** ✅ PASSED

**Failure:**
- Step: score
- Message: Score gate failed: score declined by 1 points

================================================================================

## Input & Output Lesson Files

### Input Lesson (Before Refinement)

**File:** `00_input_lesson.json`

```json
{
  "id": "203-3A3",
  "title": "203.3A3 — Circuit Types: What They Do",
  "description": "Learn about Circuit Types: What They Do in Electrical Installations Technology",
  "layout": "split-vis",
  "unit": "Unit 203",
  "topic": "Circuit Types: What They Do",
  "learningOutcomes": [
    "Identify the various categories of electrical circuits used in installations",
    "Describe the specific purpose and typical applications for different circuit types",
    "Explain the fundamental principles and typical uses of ring final and radial topologies"
  ],
  "prerequisites": [],
  "blocks": [
    {
      "id": "203-3A3-outcomes",
      "type": "outcomes",
      "order": 1,
      "content": {
        "outcomes": [
          {
            "text": "Identify the various categories of electrical circuits used in installations",
            "bloomLevel": "remember"
          },
          {
            "text": "Describe the specific purpose and typical applications for different circuit types",
            "bloomLevel": "understand"
          },
          {
            "text": "Explain the fundamental principles and typical uses of ring final and radial topologies",
            "bloomLevel": "understand"
          }
        ]
      }
    },
    {
      "id": "203-3A3-vocab",
      "type": "vocab",
      "order": 2,
      "content": {
        "terms": [
          {
            "term": "Final Circuit",
            "definition": "A circuit connected directly from a consumer unit or distribution board to current-using equipment or socket-outlets."
          },
          {
            "term": "Radial Circuit",
            "definition": "A circuit arrangement where the cable runs from the distribution board to each point in succession and terminates at the final point."
          },
          {
            "term": "Ring Final Circuit",
            "definition": "A circuit arrangement that forms a continuous loop, starting and finishing at the same protective device in the consumer unit."
          },
          {
            "term": "Control Circuit",
            "definition": "A circuit used to regulate or command the operation of other electrical equipment or power circuits, such as a motor starter or thermostat."
          },
          {
            "term": "Safety Service",
            "definition": "A system which is provided for the safety of persons and which is required to remain operational during a fire or other emergency, such as fire alarms or emergency lighting."
          },
          {
            "term": "BS 7671",
            "definition": "The UK national standard for electrical installations."
          },
          {
            "term": "Extra-low voltage (ELV)",
            "definition": "A voltage not exceeding 50 V AC or 120 V ripple-free DC between conductors or to Earth. Often used for data and safety systems to reduce risk of shock."
          }
        ]
      }
    },
    {
      "id": "203-3A3-diagram",
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
          "consumer-unit",
          "protective-device",
          "current-using-equipment"
        ],
        "placeholderText": "A comparison diagram showing two wiring layouts originating from a central consumer-unit. On the left, a radial-circuit is shown as a single line of cable connecting several socket-outlets in a sequence, ending at the last one. On the right, a ring-final-circuit is shown as a continuous loop of cable that leaves a protective-device, passes through several socket-outlets (current-using-equipment), and returns to the exact same terminal in the consumer-unit. Arrows should indicate the two paths of current flow in the ring arrangement compared to the single path in the radial arrangement."
      }
    },
    {
      "id": "203-3A3-explain-1",
      "type": "explanation",
      "order": 4,
      "content": {
        "title": "Circuit Categories and Applications",
        "content": "### In this lesson\nThink of a consumer unit like a distribution hub; instead of one wire for the whole house, we branch out into specific paths. In this lesson, you will learn how to identify the various categories of electrical circuits used in modern installations and understand their specific roles. You are acting as an electrician planning the layout of a new domestic or commercial building to ensure all equipment is powered correctly. Three key takeaways include: how to distinguish between power and control circuits, the critical nature of safety service segregation, and why we divide installations into multiple final circuits.\n\n**What this is**\nIn any electrical installation, the total electrical load is divided into several smaller sections known as a **Final Circuit**. Refer to the provided diagram to see how a Final Circuit is connected directly from a consumer unit or distribution board to appliances, equipment, or socket-outlets. These circuits are categorized based on the type of load they serve, such as lighting, power, heating, or safety systems. By separating these loads, we ensure that the installation remains manageable, safe, and functional. For instance, a fault on a socket circuit should not cause the lights to go out, which is a fundamental principle of circuit design.\n\n**Why it matters**\nUnderstanding the purpose and typical applications for different circuit types is essential for both safety and compliance with **BS 7671**. If an electrician does not correctly identify the various categories of electrical circuits, they might inadvertently mix loads that should be kept separate, such as data and high-voltage power lines. This can lead to electromagnetic interference or, more seriously, a failure of safety services during an emergency. Proper categorization also allows for easier maintenance and fault finding, as each circuit has a clearly defined purpose and area of coverage.\n\n**Key facts / rules**\n*   Every installation must be divided into circuits to avoid danger and minimize inconvenience in the event of a fault.\n*   A **Control Circuit** is specifically used to regulate or command the operation of other electrical equipment, such as a motor starter or thermostat.\n*   A **Safety Service** (emergency circuit) must be designed to supply power to critical systems, such as fire alarms or emergency lighting, during a power failure.\n*   Circuits must be identified at the distribution board or consumer unit using clear labeling.\n*   Data and communication circuits typically operate at **extra-low voltage (ELV)** and must be segregated from power circuits to prevent signal interference.\n*   Standard power circuits typically supply general-purpose socket-outlets or heavy appliances like cookers and water heaters (which are usually radial arrangements).\n\n**When to choose it**\nYou choose a specific circuit category based on the equipment's intended function and power requirements. Lighting circuits are selected for fixed luminaires and usually involve lower current demands. Power circuits are the choice for general-purpose socket-outlets or dedicated high-load items like electric showers. You must choose a **Control Circuit** when the goal is to manage another system, such as using a relay or a sensor to turn on a pump. **Safety Services** are a mandatory choice for life-safety systems where the circuit must remain operational during a fire or power loss. Data circuits are selected for networking and communication needs, requiring specific cabling like Cat6 or fiber optics.\n\n**Common mistakes**\nA common error is failing to provide enough separate circuits, leading to **nuisance tripping** (the unintended operation of a protective device caused by the combined load of too many appliances or cumulative small leakage currents). Another mistake is mixing safety services with standard power circuits; a **Safety Service** must often have its own dedicated path and protection to ensure it is not affected by faults in general-use equipment. Electricians also sometimes forget to label circuits correctly, making future identification and isolation difficult for other professionals.\n\n**Key Points**\n*   **Final Circuits** connect the distribution board directly to the end-user equipment.\n*   **Control Circuits** are used for regulation and commanding other power circuits.\n*   **Safety Services** are specialized for safety systems like fire alarms.\n*   Proper circuit categorization prevents total loss of power during a single fault.\n*   Data and communication circuits require segregation from mains voltage cabling.\n\n**Quick recap**\nElectrical installations are divided into various categories of circuits to ensure safety and functionality. These include lighting, power, control, and safety services, each serving a specific purpose. By understanding these categories, an electrician can design an installation that is easy to maintain and compliant with safety standards like BS 7671.\n\n### Coming Up Next\nNow that you can identify circuit categories, we will look at the physical arrangements of these wires, specifically the differences between ring and radial topologies."
      }
    },
    {
      "id": "203-3A3-check-1",
      "type": "practice",
      "order": 4.5,
      "content": {
        "title": "Check Your Understanding: Circuit Categories and Applications",
        "mode": "conceptual",
        "sequential": true,
        "questions": [
          {
            "id": "203-3A3-C1-L1-A",
            "questionText": "What is the term for a circuit connected directly from a consumer unit or distribution board to current-using equipment?",
            "answerType": "short-text",
            "cognitiveLevel": "recall",
            "expectedAnswer": [
              "final circuit",
              "final circuits",
              "a final circuit"
            ],
            "hint": "This term describes the section of the installation that feeds the end-user equipment."
          },
          {
            "id": "203-3A3-C1-L1-B",
            "questionText": "Identify the circuit type specifically used to regulate or command the operation of other electrical equipment.",
            "answerType": "short-text",
            "cognitiveLevel": "recall",
            "expectedAnswer": [
              "control circuit",
              "control circuits",
              "a control circuit"
            ],
            "hint": "Think of circuits used for motor starters or thermostats."
          },
          {
            "id": "203-3A3-C1-L1-C",
            "questionText": "Which type of circuit must be designed to supply power to critical systems like fire alarms?",
            "answerType": "short-text",
            "cognitiveLevel": "recall",
            "expectedAnswer": [
              "safety service",
              "safety services",
              "emergency circuit",
              "emergency circuits"
            ],
            "hint": "These circuits are mandatory for fire alarms and emergency lighting."
          },
          {
            "id": "203-3A3-C1-L2",
            "questionText": "Using your answers to Q1 (Final Circuits), Q2 (Control Circuits), and Q3 (Safety Services), explain how these categories help organize an electrical installation.",
            "answerType": "short-text",
            "cognitiveLevel": "connection",
            "expectedAnswer": [
              "prevents a single fault from causing total power loss",
              "ensures safety services remain operational",
              "allows independent control and protection",
              "minimizes inconvenience during a fault"
            ],
            "hint": "Consider how separating these roles prevents a single fault from affecting everything."
          }
        ]
      }
    },
    {
      "id": "203-3A3-explain-2",
      "type": "explanation",
      "order": 5,
      "content": {
        "title": "Circuit Topologies: Ring vs Radial",
        "content": "### In this lesson\nIn this lesson, you will learn the fundamental principles and typical uses of ring final and radial topologies in electrical installations. You are evaluating the best way to wire a series of socket-outlets in a domestic property to maximize efficiency and safety. Three key takeaways include: the definition of a continuous loop in a ring circuit, the point-to-point nature of a radial circuit, and the typical applications for each arrangement.\n\n**What this is**\nCircuit topology refers to the way the cables are physically connected to form a circuit. As illustrated in the diagram, a **Radial Circuit** resembles a tree branch following a linear path from the distribution board to each point in succession and terminating at the final point. Conversely, a **Ring Final Circuit** forms a continuous loop, starting and finishing at the same protective device in the consumer unit. This means that current has two **parallel** paths to reach any point on the circuit, which effectively increases the current-carrying capacity of the circuit using smaller cables than would be required for a single-path radial.\n\n**Why it matters**\nChoosing the right topology is a balance between cost, ease of installation, and the electrical load requirements. The **Ring Final Circuit** is a unique feature of UK electrical installations, originally designed to save copper while providing enough power for post-war housing. Understanding these topologies is crucial for an electrician to ensure that the circuit is not overloaded and that the protective devices will operate correctly. Incorrectly identifying a circuit as a ring when it is actually a broken loop (becoming two radials) can lead to cable overheating and potential fire hazards.\n\n**Key facts / rules**\n*   A **Radial Circuit** starts at the consumer unit and ends at the last socket or light fitting.\n*   A **Ring Final Circuit** must start and finish at the same terminal in the consumer unit to form a complete loop.\n*   Radial circuits are commonly used for lighting, where the total current demand is relatively low.\n*   Ring circuits are typically used for general-purpose socket-outlets in domestic buildings.\n*   Dedicated radial circuits are used for high-power appliances like electric showers or cookers.\n*   In a ring circuit, the current splits and travels in both directions around the loop to reach the load.\n*   Verification of the \"continuity\" of the ring is a critical safety test during commissioning.\n\n**When to choose it**\nYou should choose a **Radial Circuit** for lighting installations or when supplying a single, high-power appliance that requires its own dedicated fuse or breaker. Radials are also simpler to install and test in small areas or commercial units where circuits are frequently modified. You would choose a **Ring Final Circuit** when you need to cover a large floor area with multiple socket-outlets, such as in a living room or bedroom. The ring arrangement allows for a higher total load—typically protected by a 30A or 32A device—distributed across the loop. It is the standard choice for general domestic power because it provides a good balance of capacity and cable economy (saving money by using thinner cables for the same amount of power).\n\n**Common mistakes**\nThe most dangerous mistake with a **Ring Final Circuit** is a \"broken ring,\" where the loop is interrupted but the circuit still appears to work. This causes the remaining cable to carry more current than it was designed for, leading to overheating. Another common error is \"interconnecting\" two different ring circuits, which makes isolation dangerous. For **Radial Circuits**, a common mistake is adding too many points to a single circuit, exceeding the design load and causing the protective device to trip frequently.\n\n**Key Points**\n*   **Radial Circuits** run from the source to a final termination point.\n*   **Ring Final Circuits** form a loop back to the same protective device.\n*   Ring circuits provide two paths for current, allowing for higher load capacity.\n*   Radial circuits are the standard choice for lighting and high-power dedicated appliances.\n*   Proper testing is required to ensure a ring circuit is truly continuous.\n\n**Quick recap**\nElectricians use two main topologies: radial and ring final. A **Radial Circuit** follows a linear path and is ideal for lighting and dedicated appliances. A **Ring Final Circuit** forms a loop, offering a high-capacity solution for general power outlets in homes. Selecting the right topology ensures the installation is efficient, safe, and compliant with current regulations.\n\n### Coming Up Next\nNext, we will explore how to select the correct protective devices, such as MCBs and RCDs, to safeguard these different circuit types."
      }
    },
    {
      "id": "203-3A3-check-2",
      "type": "practice",
      "order": 5.5,
      "content": {
        "title": "Check Your Understanding: Circuit Topologies: Ring vs Radial",
        "mode": "conceptual",
        "sequential": true,
        "questions": [
          {
            "id": "203-3A3-C2-L1-A",
            "questionText": "Identify the circuit arrangement where the cable runs from the distribution board to each point in succession.",
            "answerType": "short-text",
            "cognitiveLevel": "recall",
            "expectedAnswer": [
              "radial circuit",
              "radial circuits",
              "a radial circuit"
            ],
            "hint": "This arrangement is like a branch of a tree and ends at the last point."
          },
          {
            "id": "203-3A3-C2-L1-B",
            "questionText": "What is the name for a circuit arrangement that forms a continuous loop starting and finishing at the same protective device?",
            "answerType": "short-text",
            "cognitiveLevel": "recall",
            "expectedAnswer": [
              "ring final circuit",
              "ring circuit",
              "a ring final circuit"
            ],
            "hint": "This topology is common for UK domestic socket-outlets."
          },
          {
            "id": "203-3A3-C2-L1-C",
            "questionText": "What do ring circuits provide to allow for higher load capacity?",
            "answerType": "short-text",
            "cognitiveLevel": "recall",
            "expectedAnswer": [
              "two paths for current",
              "two parallel paths",
              "dual paths",
              "two paths in parallel"
            ],
            "hint": "The loop structure allows the electricity to travel in more than one direction."
          },
          {
            "id": "203-3A3-C2-L2",
            "questionText": "Using your answers to Q1 (Radial Circuits), Q2 (Ring Final Circuits), and Q3 (current paths), explain how these topologies differ in their physical path and capacity. (Answer in 2-3 sentences or concise bullet points.)",
            "answerType": "short-text",
            "cognitiveLevel": "connection",
            "expectedAnswer": [
              "radial circuits run to a final point while ring final circuits form a loop to provide two paths for current for higher load capacity",
              "a radial circuit terminates at the last point but a ring circuit forms a loop back to the board to provide two paths for current",
              "the loop in a ring final circuit allows for higher load capacity via two paths compared to the single path of a radial circuit"
            ],
            "hint": "Compare the end point of a radial to the loop of a ring and the resulting number of paths."
          }
        ]
      }
    },
    {
      "id": "203-3A3-practice",
      "type": "practice",
      "order": 8,
      "content": {
        "title": "Your Turn (You Do)",
        "questions": [
          {
            "id": "203-3A3-P1",
            "questionText": "Why must an installation be divided into several final circuits rather than using one single large circuit for the whole building?",
            "answerType": "short-text",
            "expectedAnswer": [
              "avoid danger and minimize inconvenience",
              "prevent total loss of power",
              "isolate faults",
              "minimize inconvenience"
            ],
            "hint": "This is the general category for circuits serving loads like lights or sockets."
          },
          {
            "id": "203-3A3-P2",
            "questionText": "Which circuit topology forms a continuous loop by starting and finishing at the same protective device?",
            "answerType": "short-text",
            "expectedAnswer": [
              "Ring Final Circuit",
              "a Ring Final Circuit",
              "Ring Final"
            ],
            "hint": "This arrangement provides two paths for the current to reach the load."
          },
          {
            "id": "203-3A3-P3",
            "questionText": "Which circuit arrangement is the standard choice for fixed lighting installations or high-power dedicated appliances like electric showers?",
            "answerType": "short-text",
            "expectedAnswer": [
              "Radial Circuit",
              "a Radial Circuit",
              "the Radial Circuit"
            ],
            "hint": "This circuit runs from the source and terminates at the final point without returning to the board."
          },
          {
            "id": "203-3A3-P4",
            "questionText": "What is the specific purpose of a Control Circuit in an electrical installation?",
            "answerType": "short-text",
            "expectedAnswer": [
              "regulate or command other equipment",
              "to regulate or command other equipment",
              "manage the operation of power circuits",
              "regulation of equipment"
            ],
            "hint": "Think of the role played by a thermostat or a motor starter's secondary wiring."
          },
          {
            "id": "203-3A3-P5",
            "questionText": "Identify the specialized circuit category required for systems such as fire alarms and emergency lighting that must remain operational during a power failure.",
            "answerType": "short-text",
            "expectedAnswer": [
              "Safety Service",
              "Safety Services",
              "Emergency Circuit",
              "an Emergency Circuit"
            ],
            "hint": "These circuits are critical for life safety and require segregation from standard power."
          }
        ]
      }
    },
    {
      "id": "203-3A3-integrative",
      "type": "practice",
      "order": 9.5,
      "content": {
        "title": "Putting It All Together",
        "mode": "integrative",
        "sequential": true,
        "questions": [
          {
            "id": "203-3A3-INT-1",
            "questionText": "Explain how circuit categories and topologies are selected for a specific installation. In your answer, include: (1) the purpose of power circuits, (2) the requirement for safety service segregation, (3) why radial topologies are used for specific applications. (2-3 sentences)",
            "answerType": "short-text",
            "cognitiveLevel": "connection",
            "expectedAnswer": [
              "power circuits provide energy while safety services are segregated and radials provide independent control",
              "power circuits deliver electricity but safety services must be separate and radials are used for specific applications",
              "dividing into power and safety services with radial topologies ensures safety and reliability"
            ],
            "hint": "Think about why we separate different types of circuits and how the radial layout supports that separation."
          },
          {
            "id": "203-3A3-INT-2",
            "questionText": "Summarize the relationship between circuit categories and their physical wiring arrangements in a building. In your answer, include: (1) the difference between power and control circuits, (2) the continuous loop of a ring final topology, (3) the point-to-point nature of a radial topology, (4) typical applications for these arrangements. Answer in 3-4 sentences OR concise bullet points.",
            "answerType": "short-text",
            "cognitiveLevel": "synthesis",
            "expectedAnswer": [
              "power circuits deliver energy",
              "control circuits regulate or command",
              "ring final forms continuous loop",
              "radial uses point-to-point structure",
              "ring for domestic sockets",
              "radial for lighting or heavy appliances"
            ],
            "hint": "Consider how the physical shape of the circuit (loop vs. line) matches the intended use of the circuit category."
          }
        ]
      }
    },
    {
      "id": "203-3A3-spaced-review",
      "type": "spaced-review",
      "order": 10,
      "content": {
        "title": "Foundation Check",
        "questions": [
          {
            "id": "203-3A3-SR-1",
            "questionText": "What is the primary document used as the national standard for electrical installations in the UK?",
            "expectedAnswer": [
              "BS 7671",
              "Wiring Regulations",
              "The Regs"
            ],
            "hint": "It is published by the IET and BSI.",
            "answerType": "short-text"
          },
          {
            "id": "203-3A3-SR-2",
            "questionText": "What is the term for the distribution board used in domestic premises to house circuit breakers and the main switch?",
            "expectedAnswer": [
              "Consumer Unit",
              "CU",
              "Fuse box"
            ],
            "hint": "It is where all final circuits originate in a home.",
            "answerType": "short-text"
          },
          {
            "id": "203-3A3-SR-3",
            "questionText": "What component is used to protect a final circuit against overcurrent by automatically switching off?",
            "expectedAnswer": [
              "MCB",
              "Circuit Breaker",
              "Miniature Circuit Breaker"
            ],
            "hint": "It is the modern alternative to a fuse found in a consumer unit.",
            "answerType": "short-text"
          }
        ],
        "notes": "Foundation check before starting Circuit Types: What They Do"
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
  "id": "203-3A3",
  "title": "203.3A3 — Circuit Types: What They Do",
  "description": "Learn about Circuit Types: What They Do in Electrical Installations Technology",
  "layout": "split-vis",
  "unit": "Unit 203",
  "topic": "Circuit Types: What They Do",
  "learningOutcomes": [
    "Identify the various categories of electrical circuits used in installations",
    "Describe the specific purpose and typical applications for different circuit types",
    "Explain the fundamental principles and typical uses of ring final and radial topologies"
  ],
  "prerequisites": [],
  "blocks": [
    {
      "id": "203-3A3-outcomes",
      "type": "outcomes",
      "order": 1,
      "content": {
        "outcomes": [
          {
            "text": "Identify the various categories of electrical circuits used in installations",
            "bloomLevel": "remember"
          },
          {
            "text": "Describe the specific purpose and typical applications for different circuit types",
            "bloomLevel": "understand"
          },
          {
            "text": "Explain the fundamental principles and typical uses of ring final and radial topologies",
            "bloomLevel": "understand"
          }
        ]
      }
    },
    {
      "id": "203-3A3-vocab",
      "type": "vocab",
      "order": 2,
      "content": {
        "terms": [
          {
            "term": "Final Circuit",
            "definition": "A circuit connected directly from a consumer unit or distribution board to current-using equipment or socket-outlets."
          },
          {
            "term": "Radial Circuit",
            "definition": "A circuit arrangement where the cable runs from the distribution board to each point in succession and terminates at the final point."
          },
          {
            "term": "Ring Final Circuit",
            "definition": "A circuit arrangement that forms a continuous loop, starting and finishing at the same protective device in the consumer unit."
          },
          {
            "term": "Control Circuit",
            "definition": "A circuit used to regulate or command the operation of other electrical equipment or power circuits, such as a motor starter or thermostat."
          },
          {
            "term": "Safety Service",
            "definition": "A system which is provided for the safety of persons and which is required to remain operational during a fire or other emergency, such as fire alarms or emergency lighting."
          },
          {
            "term": "BS 7671",
            "definition": "The UK national standard for electrical installations."
          },
          {
            "term": "Extra-low voltage (ELV)",
            "definition": "A voltage not exceeding 50 V AC or 120 V ripple-free DC between conductors or to Earth. Often used for data and safety systems to reduce risk of shock."
          }
        ]
      }
    },
    {
      "id": "203-3A3-diagram",
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
          "consumer-unit",
          "protective-device",
          "current-using-equipment"
        ],
        "placeholderText": "A comparison diagram showing two wiring layouts originating from a central consumer-unit. On the left, a radial-circuit is shown as a single line of cable connecting several socket-outlets in a sequence, ending at the last one. On the right, a ring-final-circuit is shown as a continuous loop of cable that leaves a protective-device, passes through several socket-outlets (current-using-equipment), and returns to the exact same terminal in the consumer-unit. Arrows should indicate the two paths of current flow in the ring arrangement compared to the single path in the radial arrangement."
      }
    },
    {
      "id": "203-3A3-explain-1",
      "type": "explanation",
      "order": 4,
      "content": {
        "title": "Circuit Categories and Applications",
        "content": "### In this lesson\nThink of a consumer unit like a distribution hub; instead of one wire for the whole house, we branch out into specific paths. In this lesson, you will learn how to identify the various categories of electrical circuits used in modern installations and understand their specific roles. You are acting as an electrician planning the layout of a new domestic or commercial building to ensure all equipment is powered correctly. Three key takeaways include: how to distinguish between power and control circuits, the critical nature of safety service segregation, and why we divide installations into multiple final circuits.\n\n**What this is**\nIn any electrical installation, the total electrical load is divided into several smaller sections known as a **Final Circuit**. Refer to the provided diagram to see how a Final Circuit is connected directly from a consumer unit or distribution board to appliances, equipment, or socket-outlets. These circuits are categorized based on the type of load they serve, such as lighting, power, heating, or safety systems. By separating these loads, we ensure that the installation remains manageable, safe, and functional. For instance, a fault on a socket circuit should not cause the lights to go out, which is a fundamental principle of circuit design.\n\n**Why it matters**\nUnderstanding the purpose and typical applications for different circuit types is essential for both safety and compliance with **BS 7671**. If an electrician does not correctly identify the various categories of electrical circuits, they might inadvertently mix loads that should be kept separate, such as data and high-voltage power lines. This can lead to electromagnetic interference or, more seriously, a failure of safety services during an emergency. Proper categorization also allows for easier maintenance and fault finding, as each circuit has a clearly defined purpose and area of coverage.\n\n**Key facts / rules**\n*   Every installation must be divided into circuits to avoid danger and minimize inconvenience in the event of a fault.\n*   A **Control Circuit** is specifically used to regulate or command the operation of other electrical equipment, such as a motor starter or thermostat.\n*   A **Safety Service** (emergency circuit) must be designed to supply power to critical systems, such as fire alarms or emergency lighting, during a power failure.\n*   Circuits must be identified at the distribution board or consumer unit using clear labeling.\n*   Data and communication circuits typically operate at **extra-low voltage (ELV)** and must be segregated from power circuits to prevent signal interference.\n*   Standard power circuits typically supply general-purpose socket-outlets or heavy appliances like cookers and water heaters (which are usually radial arrangements).\n\n**When to choose it**\nYou choose a specific circuit category based on the equipment's intended function and power requirements. Lighting circuits are selected for fixed luminaires and usually involve lower current demands. Power circuits are the choice for general-purpose socket-outlets or dedicated high-load items like electric showers. You must choose a **Control Circuit** when the goal is to manage another system, such as using a relay or a sensor to turn on a pump. **Safety Services** are a mandatory choice for life-safety systems where the circuit must remain operational during a fire or power loss. Data circuits are selected for networking and communication needs, requiring specific cabling like Cat6 or fiber optics.\n\n**Common mistakes**\nA common error is failing to provide enough separate circuits, leading to **nuisance tripping** (the unintended operation of a protective device caused by the combined load of too many appliances or cumulative small leakage currents). Another mistake is mixing safety services with standard power circuits; a **Safety Service** must often have its own dedicated path and protection to ensure it is not affected by faults in general-use equipment. Electricians also sometimes forget to label circuits correctly, making future identification and isolation difficult for other professionals.\n\n**Key Points**\n*   **Final Circuits** connect the distribution board directly to the end-user equipment.\n*   **Control Circuits** are used for regulation and commanding other power circuits.\n*   **Safety Services** are specialized for safety systems like fire alarms.\n*   Proper circuit categorization prevents total loss of power during a single fault.\n*   Data and communication circuits require segregation from mains voltage cabling.\n\n**Quick recap**\nElectrical installations are divided into various categories of circuits to ensure safety and functionality. These include lighting, power, control, and safety services, each serving a specific purpose. By understanding these categories, an electrician can design an installation that is easy to maintain and compliant with safety standards like BS 7671.\n\n### Coming Up Next\nNow that you can identify circuit categories, we will look at the physical arrangements of these wires, specifically the differences between ring and radial topologies."
      }
    },
    {
      "id": "203-3A3-check-1",
      "type": "practice",
      "order": 4.5,
      "content": {
        "title": "Check Your Understanding: Circuit Categories and Applications",
        "mode": "conceptual",
        "sequential": true,
        "questions": [
          {
            "id": "203-3A3-C1-L1-A",
            "questionText": "What is the term for a circuit connected directly from a consumer unit or distribution board to current-using equipment?",
            "answerType": "short-text",
            "cognitiveLevel": "recall",
            "expectedAnswer": [
              "final circuit",
              "final circuits",
              "a final circuit"
            ],
            "hint": "This term describes the section of the installation that feeds the end-user equipment."
          },
          {
            "id": "203-3A3-C1-L1-B",
            "questionText": "Identify the circuit type specifically used to regulate or command the operation of other electrical equipment.",
            "answerType": "short-text",
            "cognitiveLevel": "recall",
            "expectedAnswer": [
              "control circuit",
              "control circuits",
              "a control circuit"
            ],
            "hint": "Think of circuits used for motor starters or thermostats."
          },
          {
            "id": "203-3A3-C1-L1-C",
            "questionText": "Which type of circuit must be designed to supply power to critical systems like fire alarms?",
            "answerType": "short-text",
            "cognitiveLevel": "recall",
            "expectedAnswer": [
              "safety service",
              "safety services",
              "emergency circuit",
              "emergency circuits"
            ],
            "hint": "These circuits are mandatory for fire alarms and emergency lighting."
          },
          {
            "id": "203-3A3-C1-L2",
            "questionText": "Using your answers to Q1 (Final Circuits), Q2 (Control Circuits), and Q3 (Safety Services), explain how these categories help organize an electrical installation.",
            "answerType": "short-text",
            "cognitiveLevel": "connection",
            "expectedAnswer": [
              "prevents a single fault from causing total power loss",
              "ensures safety services remain operational",
              "allows independent control and protection",
              "minimizes inconvenience during a fault"
            ],
            "hint": "Consider how separating these roles prevents a single fault from affecting everything."
          }
        ]
      }
    },
    {
      "id": "203-3A3-explain-2",
      "type": "explanation",
      "order": 5,
      "content": {
        "title": "Circuit Topologies: Ring vs Radial",
        "content": "### In this lesson\nIn this lesson, you will learn the fundamental principles and typical uses of ring final and radial topologies in electrical installations. You are evaluating the best way to wire a series of socket-outlets in a domestic property to maximize efficiency and safety. Three key takeaways include: the definition of a continuous loop in a ring circuit, the point-to-point nature of a radial circuit, and the typical applications for each arrangement.\n\n**What this is**\nCircuit topology refers to the way the cables are physically connected to form a circuit. As illustrated in the diagram, a **Radial Circuit** resembles a tree branch following a linear path from the distribution board to each point in succession and terminating at the final point. Conversely, a **Ring Final Circuit** forms a continuous loop, starting and finishing at the same protective device in the consumer unit. This means that current has two **parallel** paths to reach any point on the circuit, which effectively increases the current-carrying capacity of the circuit using smaller cables than would be required for a single-path radial.\n\n**Why it matters**\nChoosing the right topology is a balance between cost, ease of installation, and the electrical load requirements. The **Ring Final Circuit** is a unique feature of UK electrical installations, originally designed to save copper while providing enough power for post-war housing. Understanding these topologies is crucial for an electrician to ensure that the circuit is not overloaded and that the protective devices will operate correctly. Incorrectly identifying a circuit as a ring when it is actually a broken loop (becoming two radials) can lead to cable overheating and potential fire hazards.\n\n**Key facts / rules**\n*   A **Radial Circuit** starts at the consumer unit and ends at the last socket or light fitting.\n*   A **Ring Final Circuit** must start and finish at the same terminal in the consumer unit to form a complete loop.\n*   Radial circuits are commonly used for lighting, where the total current demand is relatively low.\n*   Ring circuits are typically used for general-purpose socket-outlets in domestic buildings.\n*   Dedicated radial circuits are used for high-power appliances like electric showers or cookers.\n*   In a ring circuit, the current splits and travels in both directions around the loop to reach the load.\n*   Verification of the \"continuity\" of the ring is a critical safety test during commissioning.\n\n**When to choose it**\nYou should choose a **Radial Circuit** for lighting installations or when supplying a single, high-power appliance that requires its own dedicated fuse or breaker. Radials are also simpler to install and test in small areas or commercial units where circuits are frequently modified. You would choose a **Ring Final Circuit** when you need to cover a large floor area with multiple socket-outlets, such as in a living room or bedroom. The ring arrangement allows for a higher total load—typically protected by a 30A or 32A device—distributed across the loop. It is the standard choice for general domestic power because it provides a good balance of capacity and cable economy (saving money by using thinner cables for the same amount of power).\n\n**Common mistakes**\nThe most dangerous mistake with a **Ring Final Circuit** is a \"broken ring,\" where the loop is interrupted but the circuit still appears to work. This causes the remaining cable to carry more current than it was designed for, leading to overheating. Another common error is \"interconnecting\" two different ring circuits, which makes isolation dangerous. For **Radial Circuits**, a common mistake is adding too many points to a single circuit, exceeding the design load and causing the protective device to trip frequently.\n\n**Key Points**\n*   **Radial Circuits** run from the source to a final termination point.\n*   **Ring Final Circuits** form a loop back to the same protective device.\n*   Ring circuits provide two paths for current, allowing for higher load capacity.\n*   Radial circuits are the standard choice for lighting and high-power dedicated appliances.\n*   Proper testing is required to ensure a ring circuit is truly continuous.\n\n**Quick recap**\nElectricians use two main topologies: radial and ring final. A **Radial Circuit** follows a linear path and is ideal for lighting and dedicated appliances. A **Ring Final Circuit** forms a loop, offering a high-capacity solution for general power outlets in homes. Selecting the right topology ensures the installation is efficient, safe, and compliant with current regulations.\n\n### Coming Up Next\nNext, we will explore how to select the correct protective devices, such as MCBs and RCDs, to safeguard these different circuit types."
      }
    },
    {
      "id": "203-3A3-check-2",
      "type": "practice",
      "order": 5.5,
      "content": {
        "title": "Check Your Understanding: Circuit Topologies: Ring vs Radial",
        "mode": "conceptual",
        "sequential": true,
        "questions": [
          {
            "id": "203-3A3-C2-L1-A",
            "questionText": "Identify the circuit arrangement where the cable runs from the distribution board to each point in succession.",
            "answerType": "short-text",
            "cognitiveLevel": "recall",
            "expectedAnswer": [
              "radial circuit",
              "radial circuits",
              "a radial circuit"
            ],
            "hint": "This arrangement is like a branch of a tree and ends at the last point."
          },
          {
            "id": "203-3A3-C2-L1-B",
            "questionText": "What is the name for a circuit arrangement that forms a continuous loop starting and finishing at the same protective device?",
            "answerType": "short-text",
            "cognitiveLevel": "recall",
            "expectedAnswer": [
              "ring final circuit",
              "ring circuit",
              "a ring final circuit"
            ],
            "hint": "This topology is common for UK domestic socket-outlets."
          },
          {
            "id": "203-3A3-C2-L1-C",
            "questionText": "What do ring circuits provide to allow for higher load capacity?",
            "answerType": "short-text",
            "cognitiveLevel": "recall",
            "expectedAnswer": [
              "two paths for current",
              "two parallel paths",
              "dual paths",
              "two paths in parallel"
            ],
            "hint": "The loop structure allows the electricity to travel in more than one direction."
          },
          {
            "id": "203-3A3-C2-L2",
            "questionText": "Using your answers to Q1 (Radial Circuits), Q2 (Ring Final Circuits), and Q3 (current paths), explain how these topologies differ in their physical path and capacity. (Answer in 2-3 sentences or concise bullet points.)",
            "answerType": "short-text",
            "cognitiveLevel": "connection",
            "expectedAnswer": [
              "radial circuits run to a final point while ring final circuits form a loop to provide two paths for current for higher load capacity",
              "a radial circuit terminates at the last point but a ring circuit forms a loop back to the board to provide two paths for current",
              "the loop in a ring final circuit allows for higher load capacity via two paths compared to the single path of a radial circuit"
            ],
            "hint": "Compare the end point of a radial to the loop of a ring and the resulting number of paths."
          }
        ]
      }
    },
    {
      "id": "203-3A3-practice",
      "type": "practice",
      "order": 8,
      "content": {
        "title": "Your Turn (You Do)",
        "questions": [
          {
            "id": "203-3A3-P1",
            "questionText": "Why must an installation be divided into several final circuits rather than using one single large circuit for the whole building?",
            "answerType": "short-text",
            "expectedAnswer": [
              "avoid danger and minimize inconvenience",
              "prevent total loss of power",
              "isolate faults",
              "minimize inconvenience"
            ],
            "hint": "This is the general category for circuits serving loads like lights or sockets."
          },
          {
            "id": "203-3A3-P2",
            "questionText": "Which circuit topology forms a continuous loop by starting and finishing at the same protective device?",
            "answerType": "short-text",
            "expectedAnswer": [
              "Ring Final Circuit",
              "a Ring Final Circuit",
              "Ring Final"
            ],
            "hint": "This arrangement provides two paths for the current to reach the load."
          },
          {
            "id": "203-3A3-P3",
            "questionText": "Which circuit arrangement is the standard choice for fixed lighting installations or high-power dedicated appliances like electric showers?",
            "answerType": "short-text",
            "expectedAnswer": [
              "Radial Circuit",
              "a Radial Circuit",
              "the Radial Circuit"
            ],
            "hint": "This circuit runs from the source and terminates at the final point without returning to the board."
          },
          {
            "id": "203-3A3-P4",
            "questionText": "What is the specific purpose of a Control Circuit in an electrical installation?",
            "answerType": "short-text",
            "expectedAnswer": [
              "regulate or command other equipment",
              "to regulate or command other equipment",
              "manage the operation of power circuits",
              "regulation of equipment"
            ],
            "hint": "Think of the role played by a thermostat or a motor starter's secondary wiring."
          },
          {
            "id": "203-3A3-P5",
            "questionText": "Identify the specialized circuit category required for systems such as fire alarms and emergency lighting that must remain operational during a power failure.",
            "answerType": "short-text",
            "expectedAnswer": [
              "Safety Service",
              "Safety Services",
              "Emergency Circuit",
              "an Emergency Circuit"
            ],
            "hint": "These circuits are critical for life safety and require segregation from standard power."
          }
        ]
      }
    },
    {
      "id": "203-3A3-integrative",
      "type": "practice",
      "order": 9.5,
      "content": {
        "title": "Putting It All Together",
        "mode": "integrative",
        "sequential": true,
        "questions": [
          {
            "id": "203-3A3-INT-1",
            "questionText": "Explain how circuit categories and topologies are selected for a specific installation. In your answer, include: (1) the purpose of power circuits, (2) the requirement for safety service segregation, (3) why radial topologies are used for specific applications. (2-3 sentences)",
            "answerType": "short-text",
            "cognitiveLevel": "connection",
            "expectedAnswer": [
              "power circuits provide energy while safety services are segregated and radials provide independent control",
              "power circuits deliver electricity but safety services must be separate and radials are used for specific applications",
              "dividing into power and safety services with radial topologies ensures safety and reliability"
            ],
            "hint": "Think about why we separate different types of circuits and how the radial layout supports that separation."
          },
          {
            "id": "203-3A3-INT-2",
            "questionText": "Summarize the relationship between circuit categories and their physical wiring arrangements in a building. In your answer, include: (1) the difference between power and control circuits, (2) the continuous loop of a ring final topology, (3) the point-to-point nature of a radial topology, (4) typical applications for these arrangements. Answer in 3-4 sentences OR concise bullet points.",
            "answerType": "short-text",
            "cognitiveLevel": "synthesis",
            "expectedAnswer": [
              "power circuits deliver energy",
              "control circuits regulate or command",
              "ring final forms continuous loop",
              "radial uses point-to-point structure",
              "ring for domestic sockets",
              "radial for lighting or heavy appliances"
            ],
            "hint": "Consider how the physical shape of the circuit (loop vs. line) matches the intended use of the circuit category."
          }
        ]
      }
    },
    {
      "id": "203-3A3-spaced-review",
      "type": "spaced-review",
      "order": 10,
      "content": {
        "title": "Foundation Check",
        "questions": [
          {
            "id": "203-3A3-SR-1",
            "questionText": "What is the primary document used as the national standard for electrical installations in the UK?",
            "expectedAnswer": [
              "BS 7671",
              "Wiring Regulations",
              "The Regs"
            ],
            "hint": "It is published by the IET and BSI.",
            "answerType": "short-text"
          },
          {
            "id": "203-3A3-SR-2",
            "questionText": "What is the term for the distribution board used in domestic premises to house circuit breakers and the main switch?",
            "expectedAnswer": [
              "Consumer Unit",
              "CU",
              "Fuse box"
            ],
            "hint": "It is where all final circuits originate in a home.",
            "answerType": "short-text"
          },
          {
            "id": "203-3A3-SR-3",
            "questionText": "What component is used to protect a final circuit against overcurrent by automatically switching off?",
            "expectedAnswer": [
              "MCB",
              "Circuit Breaker",
              "Miniature Circuit Breaker"
            ],
            "hint": "It is the modern alternative to a fuse found in a consumer unit.",
            "answerType": "short-text"
          }
        ],
        "notes": "Foundation check before starting Circuit Types: What They Do"
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
  "total": 97,
  "breakdown": {
    "schemaCompliance": 15,
    "pedagogy": 44,
    "questions": 24,
    "marking": 9,
    "visual": 5,
    "safety": 0
  },
  "details": [
    {
      "section": "markingRobustness: Keyword soup in synthesis marking. The question asks for 3-4...",
      "score": 0,
      "maxScore": 3,
      "issues": [
        "Keyword soup in synthesis marking. The question asks for 3-4 sentences, but the expected answers are fragmented fragments."
      ],
      "suggestions": [
        "Change blocks[8].content.questions[1].expectedAnswer from '[current value]' to 'Power circuits provide electricity to equipment while control circuits regulate their operation. Ring final circuits form a continuous loop to provide two paths for current, whereas radial circuits follow a point-to-point path to a final termination.,Power circuits deliver energy to loads and control circuits manage that delivery. A ring final circuit uses a loop topology for higher capacity, while radial circuits are used for lighting or high-power items like cookers.'"
      ],
      "jsonPointers": [
        "/blocks/8/content/questions/1/expectedAnswer"
      ]
    },
    {
      "section": "questions: Hint mismatch. This hint describes the definition of a 'Fina...",
      "score": 0,
      "maxScore": 2,
      "issues": [
        "Hint mismatch. This hint describes the definition of a 'Final Circuit', but the question asks 'Why' we divide the installation."
      ],
      "suggestions": [
        "Change blocks[7].content.questions[0].hint from '[current value]' to 'Think about what happens to the whole building if a single fault occurs and there is only one circuit.'"
      ],
      "jsonPointers": [
        "/blocks/7/content/questions/0/hint"
      ]
    },
    {
      "section": "beginnerClarityStaging: Terminology ambiguity. BS 7671 specifically uses 'Safety Ser...",
      "score": 0,
      "maxScore": 2,
      "issues": [
        "Terminology ambiguity. BS 7671 specifically uses 'Safety Service'. Using 'emergency circuit' as an equal synonym can lead to confusion in exams."
      ],
      "suggestions": [
        "Modify blocks[3].content.content"
      ],
      "jsonPointers": [
        "/blocks/3/content/content"
      ]
    },
    {
      "section": "markingRobustness: The expected answer 'minimize inconvenience' is too restrict...",
      "score": 0,
      "maxScore": 2,
      "issues": [
        "The expected answer 'minimize inconvenience' is too restrictive."
      ],
      "suggestions": [
        "Append to blocks[7].content.questions[0].expectedAnswer: 'prevent total blackout'",
        "Append to blocks[7].content.questions[0].expectedAnswer: 'stop a fault affecting everything'"
      ],
      "jsonPointers": [
        "/blocks/7/content/questions/0/expectedAnswer"
      ]
    },
    {
      "section": "beginnerClarityStaging: Missing 'Teaching-before-testing' for the specific danger me...",
      "score": 0,
      "maxScore": 2,
      "issues": [
        "Missing 'Teaching-before-testing' for the specific danger mechanism."
      ],
      "suggestions": [
        "Modify blocks[5].content.content"
      ],
      "jsonPointers": [
        "/blocks/5/content/content"
      ]
    },
    {
      "section": "questions: Question relies on previous answers in a way that creates 'd...",
      "score": 0,
      "maxScore": 1,
      "issues": [
        "Question relies on previous answers in a way that creates 'double jeopardy'."
      ],
      "suggestions": [
        "Change blocks[6].content.questions[3].questionText from '[current value]' to 'Compare radial and ring final topologies in terms of their physical path and how they handle electrical load.'"
      ],
      "jsonPointers": [
        "/blocks/6/content/questions/3/questionText"
      ]
    },
    {
      "section": "markingRobustness: Connection question expects specific phrases but the prompt ...",
      "score": 0,
      "maxScore": 2,
      "issues": [
        "Connection question expects specific phrases but the prompt is very broad."
      ],
      "suggestions": [
        "Append to blocks[4].content.questions[3].expectedAnswer: 'separates different types of loads for safety'",
        "Append to blocks[4].content.questions[3].expectedAnswer: 'isolates faults to specific areas'"
      ],
      "jsonPointers": [
        "/blocks/4/content/questions/3/expectedAnswer"
      ]
    },
    {
      "section": "beginnerClarityStaging: ELV definition is slightly too broad regarding 'safety syste...",
      "score": 0,
      "maxScore": 1,
      "issues": [
        "ELV definition is slightly too broad regarding 'safety systems'."
      ],
      "suggestions": [
        "Modify blocks[1].content.terms[6].definition"
      ],
      "jsonPointers": [
        "/blocks/1/content/terms/6/definition"
      ]
    },
    {
      "section": "alignment: The spaced review question is about a 'component', whereas t...",
      "score": 0,
      "maxScore": 2,
      "issues": [
        "The spaced review question is about a 'component', whereas the lesson is about 'Circuit Types'."
      ],
      "suggestions": [
        "Change blocks[9].content.questions[2].questionText from '[current value]' to 'What is the main reason for dividing an installation into different circuits according to BS 7671?'",
        "Change blocks[9].content.questions[2].expectedAnswer from '[current value]' to 'prevent danger and minimize inconvenience,safety and convenience'"
      ],
      "jsonPointers": [
        "/blocks/9/content/questions/2/questionText"
      ]
    },
    {
      "section": "markingRobustness: Missing the common abbreviation used in the trade.",
      "score": 0,
      "maxScore": 1,
      "issues": [
        "Missing the common abbreviation used in the trade."
      ],
      "suggestions": [
        "Append to blocks[6].content.questions[1].expectedAnswer: 'RFC'"
      ],
      "jsonPointers": [
        "/blocks/6/content/questions/1/expectedAnswer"
      ]
    }
  ],
  "grade": "Strong",
  "overallAssessment": "The lesson is technically sound and well-structured, but requires tighter marking robustness for synthesis questions and better alignment between question hints and content. Some recall questions are repetitive, and the 'Safety Service' terminology needs more rigorous application to match BS 7671 standards."
}
```

---

### Score After Refinement

#### Parsed Score

```json
{
  "total": 96,
  "breakdown": {
    "schemaCompliance": 15,
    "pedagogy": 43,
    "questions": 24,
    "marking": 9,
    "visual": 5,
    "safety": 0
  },
  "details": [
    {
      "section": "questions: This question tests content introduced in the current lesson...",
      "score": 0,
      "maxScore": 3,
      "issues": [
        "This question tests content introduced in the current lesson (Explain-1), violating the rule that spaced review must come from preceding lessons."
      ],
      "suggestions": [
        "Change blocks[9].content.questions[2] from '[current value]' to '[object Object]'"
      ],
      "jsonPointers": [
        "/blocks/9/content/questions/2"
      ]
    },
    {
      "section": "markingRobustness: The expected answer for a 'synthesis' question asking for 3-...",
      "score": 0,
      "maxScore": 3,
      "issues": [
        "The expected answer for a 'synthesis' question asking for 3-4 sentences is a list of short fragments."
      ],
      "suggestions": [
        "Change blocks[8].content.questions[1].expectedAnswer from '[current value]' to 'Power circuits provide energy to appliances while control circuits manage operations. Ring circuits form a loop for higher capacity, whereas radials are point-to-point for dedicated loads.,Installations use power circuits for loads and control circuits for regulation. A ring topology creates a continuous loop, while a radial is a single line; both serve different application needs.,The relationship involves matching circuit types like safety services to specific wiring. Rings provide two paths for current in a loop, while radials provide a direct line to equipment.'"
      ],
      "jsonPointers": [
        "/blocks/8/content/questions/1/expectedAnswer"
      ]
    },
    {
      "section": "beginnerClarityStaging: Missing the specific technical 'why' (cable current carrying...",
      "score": 0,
      "maxScore": 2,
      "issues": [
        "Missing the specific technical 'why' (cable current carrying capacity vs breaker rating)."
      ],
      "suggestions": [
        "Modify blocks[5].content.content"
      ],
      "jsonPointers": [
        "/blocks/5/content/content"
      ]
    },
    {
      "section": "markingRobustness: Missing the plural/singular variations and the technical ter...",
      "score": 0,
      "maxScore": 2,
      "issues": [
        "Missing the plural/singular variations and the technical term 'Safety Services' often used in BS 7671."
      ],
      "suggestions": [
        "Append to blocks[4].content.questions[3].expectedAnswer: 'safety system'",
        "Append to blocks[4].content.questions[3].expectedAnswer: 'life safety circuit'"
      ],
      "jsonPointers": [
        "/blocks/4/content/questions/3/expectedAnswer"
      ]
    },
    {
      "section": "beginnerClarityStaging: The definition is good but missing the key requirement of 's...",
      "score": 0,
      "maxScore": 2,
      "issues": [
        "The definition is good but missing the key requirement of 'segregation'."
      ],
      "suggestions": [
        "Append to blocks[1].content.terms[4].definition: ' These circuits must be strictly segregated from other systems to prevent interference.'"
      ],
      "jsonPointers": [
        "/blocks/1/content/terms/4/definition"
      ]
    },
    {
      "section": "markingRobustness: Missing the very common term 'Ring Main' which, while techni...",
      "score": 0,
      "maxScore": 1,
      "issues": [
        "Missing the very common term 'Ring Main' which, while technically deprecated in BS 7671, is still widely used by students."
      ],
      "suggestions": [
        "Append to blocks[6].content.questions[2].expectedAnswer: 'ring main'"
      ],
      "jsonPointers": [
        "/blocks/6/content/questions/2/expectedAnswer"
      ]
    },
    {
      "section": "beginnerClarityStaging: Nuisance tripping is mentioned but not explained in the cont...",
      "score": 0,
      "maxScore": 2,
      "issues": [
        "Nuisance tripping is mentioned but not explained in the context of circuit division."
      ],
      "suggestions": [
        "Modify blocks[3].content.content"
      ],
      "jsonPointers": [
        "/blocks/3/content/content"
      ]
    },
    {
      "section": "beginnerClarityStaging: The vocab definition for ELV doesn't explicitly link it to '...",
      "score": 0,
      "maxScore": 1,
      "issues": [
        "The vocab definition for ELV doesn't explicitly link it to 'Control Circuits' or 'Data' mentioned later."
      ],
      "suggestions": [
        "Append to blocks[1].content.terms[6].definition: ' Commonly used for control circuits and signaling.'"
      ],
      "jsonPointers": [
        "/blocks/1/content/terms/6/definition"
      ]
    },
    {
      "section": "markingRobustness: The expected answer is a bit rigid for a 'why' question.",
      "score": 0,
      "maxScore": 1,
      "issues": [
        "The expected answer is a bit rigid for a 'why' question."
      ],
      "suggestions": [
        "Append to blocks[7].content.questions[0].expectedAnswer: 'safety and functionality'",
        "Append to blocks[7].content.questions[0].expectedAnswer: 'to isolate faults'"
      ],
      "jsonPointers": [
        "/blocks/7/content/questions/0/expectedAnswer"
      ]
    },
    {
      "section": "alignment: The outcome is slightly generic.",
      "score": 0,
      "maxScore": 2,
      "issues": [
        "The outcome is slightly generic."
      ],
      "suggestions": [
        "Change blocks[0].content.outcomes[0].text from '[current value]' to 'Identify standard circuit categories including power, control, and safety services'"
      ],
      "jsonPointers": [
        "/blocks/0/content/outcomes/0/text"
      ]
    }
  ],
  "grade": "Strong",
  "overallAssessment": "The lesson has a strong logical flow and clear technical definitions, but suffers from 'teaching-the-test' in the spaced review section and loose marking criteria for synthesis questions. Strengthening the expected answer variants and ensuring spaced review content is truly from preceding lessons will significantly improve robustness."
}
```

---

## Rewrite Step

### Rewrite Prompt

**Timestamp:** 2026-02-07T19:32:51.376Z
**Model:** gemini-3-pro
**Temperature:** 0
**Max Tokens:** 24000

#### System Prompt

```
You are an expert lesson JSON refiner.

You will be given:
1) The ORIGINAL lesson JSON (valid).
2) A scoring report listing issues and suggested improvements.

Your job:
Improve the lesson's PEDAGOGICAL QUALITY (clarity, teaching effectiveness, gradeability).
Return a NEW lesson JSON that fixes the pedagogical issues while preserving the lesson's structure.

CRITICAL: Structure validation is enforced by Phase10_Validators.ts BEFORE this stage.
Focus on PEDAGOGY: content clarity, teaching-before-testing, scaffolding, question quality, and marking robustness.
Do NOT worry about schema/structure - that's already validated.

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
  "id": "203-3A3",
  "title": "203.3A3 — Circuit Types: What They Do",
  "description": "Learn about Circuit Types: What They Do in Electrical Installations Technology",
  "layout": "split-vis",
  "unit": "Unit 203",
  "topic": "Circuit Types: What They Do",
  "learningOutcomes": [
    "Identify the various categories of electrical circuits used in installations",
    "Describe the specific purpose and typical applications for different circuit types",
    "Explain the fundamental principles and typical uses of ring final and radial topologies"
  ],
  "prerequisites": [],
  "blocks": [
    {
      "id": "203-3A3-outcomes",
      "type": "outcomes",
      "order": 1,
      "content": {
        "outcomes": [
          {
            "text": "Identify the various categories of electrical circuits used in installations",
            "bloomLevel": "remember"
          },
          {
            "text": "Describe the specific purpose and typical applications for different circuit types",
            "bloomLevel": "understand"
          },
          {
            "text": "Explain the fundamental principles and typical uses of ring final and radial topologies",
            "bloomLevel": "understand"
          }
        ]
      }
    },
    {
      "id": "203-3A3-vocab",
      "type": "vocab",
      "order": 2,
      "content": {
        "terms": [
          {
            "term": "Final Circuit",
            "definition": "A circuit connected directly from a consumer unit or distribution board to current-using equipment or socket-outlets."
          },
          {
            "term": "Radial Circuit",
            "definition": "A circuit arrangement where the cable runs from the distribution board to each point in succession and terminates at the final point."
          },
          {
            "term": "Ring Final Circuit",
            "definition": "A circuit arrangement that forms a continuous loop, starting and finishing at the same protective device in the consumer unit."
          },
          {
            "term": "Control Circuit",
            "definition": "A circuit used to regulate or command the operation of other electrical equipment or power circuits, such as a motor starter or thermostat."
          },
          {
            "term": "Safety Service",
            "definition": "A system which is provided for the safety of persons and which is required to remain operational during a fire or other emergency, such as fire alarms or emergency lighting."
          },
          {
            "term": "BS 7671",
            "definition": "The UK national standard for electrical installations."
          },
          {
            "term": "Extra-low voltage (ELV)",
            "definition": "A voltage not exceeding 50 V AC or 120 V ripple-free DC between conductors or to Earth. Often used for data and safety systems to reduce risk of shock."
          }
        ]
      }
    },
    {
      "id": "203-3A3-diagram",
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
          "consumer-unit",
          "protective-device",
          "current-using-equipment"
        ],
        "placeholderText": "A comparison diagram showing two wiring layouts originating from a central consumer-unit. On the left, a radial-circuit is shown as a single line of cable connecting several socket-outlets in a sequence, ending at the last one. On the right, a ring-final-circuit is shown as a continuous loop of cable that leaves a protective-device, passes through several socket-outlets (current-using-equipment), and returns to the exact same terminal in the consumer-unit. Arrows should indicate the two paths of current flow in the ring arrangement compared to the single path in the radial arrangement."
      }
    },
    {
      "id": "203-3A3-explain-1",
      "type": "explanation",
      "order": 4,
      "content": {
        "title": "Circuit Categories and Applications",
        "content": "### In this lesson\nThink of a consumer unit like a distribution hub; instead of one wire for the whole house, we branch out into specific paths. In this lesson, you will learn how to identify the various categories of electrical circuits used in modern installations and understand their specific roles. You are acting as an electrician planning the layout of a new domestic or commercial building to ensure all equipment is powered correctly. Three key takeaways include: how to distinguish between power and control circuits, the critical nature of safety service segregation, and why we divide installations into multiple final circuits.\n\n**What this is**\nIn any electrical installation, the total electrical load is divided into several smaller sections known as a **Final Circuit**. Refer to the provided diagram to see how a Final Circuit is connected directly from a consumer unit or distribution board to appliances, equipment, or socket-outlets. These circuits are categorized based on the type of load they serve, such as lighting, power, heating, or safety systems. By separating these loads, we ensure that the installation remains manageable, safe, and functional. For instance, a fault on a socket circuit should not cause the lights to go out, which is a fundamental principle of circuit design.\n\n**Why it matters**\nUnderstanding the purpose and typical applications for different circuit types is essential for both safety and compliance with **BS 7671**. If an electrician does not correctly identify the various categories of electrical circuits, they might inadvertently mix loads that should be kept separate, such as data and high-voltage power lines. This can lead to electromagnetic interference or, more seriously, a failure of safety services during an emergency. Proper categorization also allows for easier maintenance and fault finding, as each circuit has a clearly defined purpose and area of coverage.\n\n**Key facts / rules**\n*   Every installation must be divided into circuits to avoid danger and minimize inconvenience in the event of a fault.\n*   A **Control Circuit** is specifically used to regulate or command the operation of other electrical equipment, such as a motor starter or thermostat.\n*   A **Safety Service** (emergency circuit) must be designed to supply power to critical systems, such as fire alarms or emergency lighting, during a power failure.\n*   Circuits must be identified at the distribution board or consumer unit using clear labeling.\n*   Data and communication circuits typically operate at **extra-low voltage (ELV)** and must be segregated from power circuits to prevent signal interference.\n*   Standard power circuits typically supply general-purpose socket-outlets or heavy appliances like cookers and water heaters (which are usually radial arrangements).\n\n**When to choose it**\nYou choose a specific circuit category based on the equipment's intended function and power requirements. Lighting circuits are selected for fixed luminaires and usually involve lower current demands. Power circuits are the choice for general-purpose socket-outlets or dedicated high-load items like electric showers. You must choose a **Control Circuit** when the goal is to manage another system, such as using a relay or a sensor to turn on a pump. **Safety Services** are a mandatory choice for life-safety systems where the circuit must remain operational during a fire or power loss. Data circuits are selected for networking and communication needs, requiring specific cabling like Cat6 or fiber optics.\n\n**Common mistakes**\nA common error is failing to provide enough separate circuits, leading to **nuisance tripping** (the unintended operation of a protective device caused by the combined load of too many appliances or cumulative small leakage currents). Another mistake is mixing safety services with standard power circuits; a **Safety Service** must often have its own dedicated path and protection to ensure it is not affected by faults in general-use equipment. Electricians also sometimes forget to label circuits correctly, making future identification and isolation difficult for other professionals.\n\n**Key Points**\n*   **Final Circuits** connect the distribution board directly to the end-user equipment.\n*   **Control Circuits** are used for regulation and commanding other power circuits.\n*   **Safety Services** are specialized for safety systems like fire alarms.\n*   Proper circuit categorization prevents total loss of power during a single fault.\n*   Data and communication circuits require segregation from mains voltage cabling.\n\n**Quick recap**\nElectrical installations are divided into various categories of circuits to ensure safety and functionality. These include lighting, power, control, and safety services, each serving a specific purpose. By understanding these categories, an electrician can design an installation that is easy to maintain and compliant with safety standards like BS 7671.\n\n### Coming Up Next\nNow that you can identify circuit categories, we will look at the physical arrangements of these wires, specifically the differences between ring and radial topologies."
      }
    },
    {
      "id": "203-3A3-check-1",
      "type": "practice",
      "order": 4.5,
      "content": {
        "title": "Check Your Understanding: Circuit Categories and Applications",
        "mode": "conceptual",
        "sequential": true,
        "questions": [
          {
            "id": "203-3A3-C1-L1-A",
            "questionText": "What is the term for a circuit connected directly from a consumer unit or distribution board to current-using equipment?",
            "answerType": "short-text",
            "cognitiveLevel": "recall",
            "expectedAnswer": [
              "final circuit",
              "final circuits",
              "a final circuit"
            ],
            "hint": "This term describes the section of the installation that feeds the end-user equipment."
          },
          {
            "id": "203-3A3-C1-L1-B",
            "questionText": "Identify the circuit type specifically used to regulate or command the operation of other electrical equipment.",
            "answerType": "short-text",
            "cognitiveLevel": "recall",
            "expectedAnswer": [
              "control circuit",
              "control circuits",
              "a control circuit"
            ],
            "hint": "Think of circuits used for motor starters or thermostats."
          },
          {
            "id": "203-3A3-C1-L1-C",
            "questionText": "Which type of circuit must be designed to supply power to critical systems like fire alarms?",
            "answerType": "short-text",
            "cognitiveLevel": "recall",
            "expectedAnswer": [
              "safety service",
              "safety services",
              "emergency circuit",
              "emergency circuits"
            ],
            "hint": "These circuits are mandatory for fire alarms and emergency lighting."
          },
          {
            "id": "203-3A3-C1-L2",
            "questionText": "Using your answers to Q1 (Final Circuits), Q2 (Control Circuits), and Q3 (Safety Services), explain how these categories help organize an electrical installation.",
            "answerType": "short-text",
            "cognitiveLevel": "connection",
            "expectedAnswer": [
              "prevents a single fault from causing total power loss",
              "ensures safety services remain operational",
              "allows independent control and protection",
              "minimizes inconvenience during a fault"
            ],
            "hint": "Consider how separating these roles prevents a single fault from affecting everything."
          }
        ]
      }
    },
    {
      "id": "203-3A3-explain-2",
      "type": "explanation",
      "order": 5,
      "content": {
        "title": "Circuit Topologies: Ring vs Radial",
        "content": "### In this lesson\nIn this lesson, you will learn the fundamental principles and typical uses of ring final and radial topologies in electrical installations. You are evaluating the best way to wire a series of socket-outlets in a domestic property to maximize efficiency and safety. Three key takeaways include: the definition of a continuous loop in a ring circuit, the point-to-point nature of a radial circuit, and the typical applications for each arrangement.\n\n**What this is**\nCircuit topology refers to the way the cables are physically connected to form a circuit. As illustrated in the diagram, a **Radial Circuit** resembles a tree branch following a linear path from the distribution board to each point in succession and terminating at the final point. Conversely, a **Ring Final Circuit** forms a continuous loop, starting and finishing at the same protective device in the consumer unit. This means that current has two **parallel** paths to reach any point on the circuit, which effectively increases the current-carrying capacity of the circuit using smaller cables than would be required for a single-path radial.\n\n**Why it matters**\nChoosing the right topology is a balance between cost, ease of installation, and the electrical load requirements. The **Ring Final Circuit** is a unique feature of UK electrical installations, originally designed to save copper while providing enough power for post-war housing. Understanding these topologies is crucial for an electrician to ensure that the circuit is not overloaded and that the protective devices will operate correctly. Incorrectly identifying a circuit as a ring when it is actually a broken loop (becoming two radials) can lead to cable overheating and potential fire hazards.\n\n**Key facts / rules**\n*   A **Radial Circuit** starts at the consumer unit and ends at the last socket or light fitting.\n*   A **Ring Final Circuit** must start and finish at the same terminal in the consumer unit to form a complete loop.\n*   Radial circuits are commonly used for lighting, where the total current demand is relatively low.\n*   Ring circuits are typically used for general-purpose socket-outlets in domestic buildings.\n*   Dedicated radial circuits are used for high-power appliances like electric showers or cookers.\n*   In a ring circuit, the current splits and travels in both directions around the loop to reach the load.\n*   Verification of the \"continuity\" of the ring is a critical safety test during commissioning.\n\n**When to choose it**\nYou should choose a **Radial Circuit** for lighting installations or when supplying a single, high-power appliance that requires its own dedicated fuse or breaker. Radials are also simpler to install and test in small areas or commercial units where circuits are frequently modified. You would choose a **Ring Final Circuit** when you need to cover a large floor area with multiple socket-outlets, such as in a living room or bedroom. The ring arrangement allows for a higher total load—typically protected by a 30A or 32A device—distributed across the loop. It is the standard choice for general domestic power because it provides a good balance of capacity and cable economy (saving money by using thinner cables for the same amount of power).\n\n**Common mistakes**\nThe most dangerous mistake with a **Ring Final Circuit** is a \"broken ring,\" where the loop is interrupted but the circuit still appears to work. This causes the remaining cable to carry more current than it was designed for, leading to overheating. Another common error is \"interconnecting\" two different ring circuits, which makes isolation dangerous. For **Radial Circuits**, a common mistake is adding too many points to a single circuit, exceeding the design load and causing the protective device to trip frequently.\n\n**Key Points**\n*   **Radial Circuits** run from the source to a final termination point.\n*   **Ring Final Circuits** form a loop back to the same protective device.\n*   Ring circuits provide two paths for current, allowing for higher load capacity.\n*   Radial circuits are the standard choice for lighting and high-power dedicated appliances.\n*   Proper testing is required to ensure a ring circuit is truly continuous.\n\n**Quick recap**\nElectricians use two main topologies: radial and ring final. A **Radial Circuit** follows a linear path and is ideal for lighting and dedicated appliances. A **Ring Final Circuit** forms a loop, offering a high-capacity solution for general power outlets in homes. Selecting the right topology ensures the installation is efficient, safe, and compliant with current regulations.\n\n### Coming Up Next\nNext, we will explore how to select the correct protective devices, such as MCBs and RCDs, to safeguard these different circuit types."
      }
    },
    {
      "id": "203-3A3-check-2",
      "type": "practice",
      "order": 5.5,
      "content": {
        "title": "Check Your Understanding: Circuit Topologies: Ring vs Radial",
        "mode": "conceptual",
        "sequential": true,
        "questions": [
          {
            "id": "203-3A3-C2-L1-A",
            "questionText": "Identify the circuit arrangement where the cable runs from the distribution board to each point in succession.",
            "answerType": "short-text",
            "cognitiveLevel": "recall",
            "expectedAnswer": [
              "radial circuit",
              "radial circuits",
              "a radial circuit"
            ],
            "hint": "This arrangement is like a branch of a tree and ends at the last point."
          },
          {
            "id": "203-3A3-C2-L1-B",
            "questionText": "What is the name for a circuit arrangement that forms a continuous loop starting and finishing at the same protective device?",
            "answerType": "short-text",
            "cognitiveLevel": "recall",
            "expectedAnswer": [
              "ring final circuit",
              "ring circuit",
              "a ring final circuit"
            ],
            "hint": "This topology is common for UK domestic socket-outlets."
          },
          {
            "id": "203-3A3-C2-L1-C",
            "questionText": "What do ring circuits provide to allow for higher load capacity?",
            "answerType": "short-text",
            "cognitiveLevel": "recall",
            "expectedAnswer": [
              "two paths for current",
              "two parallel paths",
              "dual paths",
              "two paths in parallel"
            ],
            "hint": "The loop structure allows the electricity to travel in more than one direction."
          },
          {
            "id": "203-3A3-C2-L2",
            "questionText": "Using your answers to Q1 (Radial Circuits), Q2 (Ring Final Circuits), and Q3 (current paths), explain how these topologies differ in their physical path and capacity. (Answer in 2-3 sentences or concise bullet points.)",
            "answerType": "short-text",
            "cognitiveLevel": "connection",
            "expectedAnswer": [
              "radial circuits run to a final point while ring final circuits form a loop to provide two paths for current for higher load capacity",
              "a radial circuit terminates at the last point but a ring circuit forms a loop back to the board to provide two paths for current",
              "the loop in a ring final circuit allows for higher load capacity via two paths compared to the single path of a radial circuit"
            ],
            "hint": "Compare the end point of a radial to the loop of a ring and the resulting number of paths."
          }
        ]
      }
    },
    {
      "id": "203-3A3-practice",
      "type": "practice",
      "order": 8,
      "content": {
        "title": "Your Turn (You Do)",
        "questions": [
          {
            "id": "203-3A3-P1",
            "questionText": "Why must an installation be divided into several final circuits rather than using one single large circuit for the whole building?",
            "answerType": "short-text",
            "expectedAnswer": [
              "avoid danger and minimize inconvenience",
              "prevent total loss of power",
              "isolate faults",
              "minimize inconvenience"
            ],
            "hint": "This is the general category for circuits serving loads like lights or sockets."
          },
          {
            "id": "203-3A3-P2",
            "questionText": "Which circuit topology forms a continuous loop by starting and finishing at the same protective device?",
            "answerType": "short-text",
            "expectedAnswer": [
              "Ring Final Circuit",
              "a Ring Final Circuit",
              "Ring Final"
            ],
            "hint": "This arrangement provides two paths for the current to reach the load."
          },
          {
            "id": "203-3A3-P3",
            "questionText": "Which circuit arrangement is the standard choice for fixed lighting installations or high-power dedicated appliances like electric showers?",
            "answerType": "short-text",
            "expectedAnswer": [
              "Radial Circuit",
              "a Radial Circuit",
              "the Radial Circuit"
            ],
            "hint": "This circuit runs from the source and terminates at the final point without returning to the board."
          },
          {
            "id": "203-3A3-P4",
            "questionText": "What is the specific purpose of a Control Circuit in an electrical installation?",
            "answerType": "short-text",
            "expectedAnswer": [
              "regulate or command other equipment",
              "to regulate or command other equipment",
              "manage the operation of power circuits",
              "regulation of equipment"
            ],
            "hint": "Think of the role played by a thermostat or a motor starter's secondary wiring."
          },
          {
            "id": "203-3A3-P5",
            "questionText": "Identify the specialized circuit category required for systems such as fire alarms and emergency lighting that must remain operational during a power failure.",
            "answerType": "short-text",
            "expectedAnswer": [
              "Safety Service",
              "Safety Services",
              "Emergency Circuit",
              "an Emergency Circuit"
            ],
            "hint": "These circuits are critical for life safety and require segregation from standard power."
          }
        ]
      }
    },
    {
      "id": "203-3A3-integrative",
      "type": "practice",
      "order": 9.5,
      "content": {
        "title": "Putting It All Together",
        "mode": "integrative",
        "sequential": true,
        "questions": [
          {
            "id": "203-3A3-INT-1",
            "questionText": "Explain how circuit categories and topologies are selected for a specific installation. In your answer, include: (1) the purpose of power circuits, (2) the requirement for safety service segregation, (3) why radial topologies are used for specific applications. (2-3 sentences)",
            "answerType": "short-text",
            "cognitiveLevel": "connection",
            "expectedAnswer": [
              "power circuits provide energy while safety services are segregated and radials provide independent control",
              "power circuits deliver electricity but safety services must be separate and radials are used for specific applications",
              "dividing into power and safety services with radial topologies ensures safety and reliability"
            ],
            "hint": "Think about why we separate different types of circuits and how the radial layout supports that separation."
          },
          {
            "id": "203-3A3-INT-2",
            "questionText": "Summarize the relationship between circuit categories and their physical wiring arrangements in a building. In your answer, include: (1) the difference between power and control circuits, (2) the continuous loop of a ring final topology, (3) the point-to-point nature of a radial topology, (4) typical applications for these arrangements. Answer in 3-4 sentences OR concise bullet points.",
            "answerType": "short-text",
            "cognitiveLevel": "synthesis",
            "expectedAnswer": [
              "power circuits deliver energy",
              "control circuits regulate or command",
              "ring final forms continuous loop",
              "radial uses point-to-point structure",
              "ring for domestic sockets",
              "radial for lighting or heavy appliances"
            ],
            "hint": "Consider how the physical shape of the circuit (loop vs. line) matches the intended use of the circuit category."
          }
        ]
      }
    },
    {
      "id": "203-3A3-spaced-review",
      "type": "spaced-review",
      "order": 10,
      "content": {
        "title": "Foundation Check",
        "questions": [
          {
            "id": "203-3A3-SR-1",
            "questionText": "What is the primary document used as the national standard for electrical installations in the UK?",
            "expectedAnswer": [
              "BS 7671",
              "Wiring Regulations",
              "The Regs"
            ],
            "hint": "It is published by the IET and BSI.",
            "answerType": "short-text"
          },
          {
            "id": "203-3A3-SR-2",
            "questionText": "What is the term for the distribution board used in domestic premises to house circuit breakers and the main switch?",
            "expectedAnswer": [
              "Consumer Unit",
              "CU",
              "Fuse box"
            ],
            "hint": "It is where all final circuits originate in a home.",
            "answerType": "short-text"
          },
          {
            "id": "203-3A3-SR-3",
            "questionText": "What component is used to protect a final circuit against overcurrent by automatically switching off?",
            "expectedAnswer": [
              "MCB",
              "Circuit Breaker",
              "Miniature Circuit Breaker"
            ],
            "hint": "It is the modern alternative to a fuse found in a consumer unit.",
            "answerType": "short-text"
          }
        ],
        "notes": "Foundation check before starting Circuit Types: What They Do"
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
Total Score: 97/100 (Strong)

OVERALL ASSESSMENT:
The lesson is technically sound and well-structured, but requires tighter marking robustness for synthesis questions and better alignment between question hints and content. Some recall questions are repetitive, and the 'Safety Service' terminology needs more rigorous application to match BS 7671 standards.

Issues by Section:

## markingRobustness: Keyword soup in synthesis marking. The question asks for 3-4... (0/3)
- Issue: Keyword soup in synthesis marking. The question asks for 3-4 sentences, but the expected answers are fragmented fragments.
  Suggestion: Change blocks[8].content.questions[1].expectedAnswer from '[current value]' to 'Power circuits provide electricity to equipment while control circuits regulate their operation. Ring final circuits form a continuous loop to provide two paths for current, whereas radial circuits follow a point-to-point path to a final termination.,Power circuits deliver energy to loads and control circuits manage that delivery. A ring final circuit uses a loop topology for higher capacity, while radial circuits are used for lighting or high-power items like cookers.'

## questions: Hint mismatch. This hint describes the definition of a 'Fina... (0/2)
- Issue: Hint mismatch. This hint describes the definition of a 'Final Circuit', but the question asks 'Why' we divide the installation.
  Suggestion: Change blocks[7].content.questions[0].hint from '[current value]' to 'Think about what happens to the whole building if a single fault occurs and there is only one circuit.'

## beginnerClarityStaging: Terminology ambiguity. BS 7671 specifically uses 'Safety Ser... (0/2)
- Issue: Terminology ambiguity. BS 7671 specifically uses 'Safety Service'. Using 'emergency circuit' as an equal synonym can lead to confusion in exams.
  Suggestion: Modify blocks[3].content.content

## markingRobustness: The expected answer 'minimize inconvenience' is too restrict... (0/2)
- Issue: The expected answer 'minimize inconvenience' is too restrictive.
  Suggestion: Append to blocks[7].content.questions[0].expectedAnswer: 'prevent total blackout'

## beginnerClarityStaging: Missing 'Teaching-before-testing' for the specific danger me... (0/2)
- Issue: Missing 'Teaching-before-testing' for the specific danger mechanism.
  Suggestion: Modify blocks[5].content.content

## questions: Question relies on previous answers in a way that creates 'd... (0/1)
- Issue: Question relies on previous answers in a way that creates 'double jeopardy'.
  Suggestion: Change blocks[6].content.questions[3].questionText from '[current value]' to 'Compare radial and ring final topologies in terms of their physical path and how they handle electrical load.'

## markingRobustness: Connection question expects specific phrases but the prompt ... (0/2)
- Issue: Connection question expects specific phrases but the prompt is very broad.
  Suggestion: Append to blocks[4].content.questions[3].expectedAnswer: 'separates different types of loads for safety'

## beginnerClarityStaging: ELV definition is slightly too broad regarding 'safety syste... (0/1)
- Issue: ELV definition is slightly too broad regarding 'safety systems'.
  Suggestion: Modify blocks[1].content.terms[6].definition

## alignment: The spaced review question is about a 'component', whereas t... (0/2)
- Issue: The spaced review question is about a 'component', whereas the lesson is about 'Circuit Types'.
  Suggestion: Change blocks[9].content.questions[2].questionText from '[current value]' to 'What is the main reason for dividing an installation into different circuits according to BS 7671?'

## markingRobustness: Missing the common abbreviation used in the trade. (0/1)
- Issue: Missing the common abbreviation used in the trade.
  Suggestion: Append to blocks[6].content.questions[1].expectedAnswer: 'RFC'


TASK:
- Produce a refined version of the full lesson JSON that addresses the scoring issues.
- Preserve ALL structural invariants (same blocks, same ids/types/orders, same block count).
- Return ONLY the refined JSON.
```

### Rewrite Output (Raw Model Response)

```json
{
  "id": "203-3A3",
  "title": "203.3A3 — Circuit Types: What They Do",
  "description": "Learn about Circuit Types: What They Do in Electrical Installations Technology",
  "layout": "split-vis",
  "unit": "Unit 203",
  "topic": "Circuit Types: What They Do",
  "learningOutcomes": [
    "Identify the various categories of electrical circuits used in installations",
    "Describe the specific purpose and typical applications for different circuit types",
    "Explain the fundamental principles and typical uses of ring final and radial topologies"
  ],
  "prerequisites": [],
  "blocks": [
    {
      "id": "203-3A3-outcomes",
      "type": "outcomes",
      "order": 1,
      "content": {
        "outcomes": [
          {
            "text": "Identify the various categories of electrical circuits used in installations",
            "bloomLevel": "remember"
          },
          {
            "text": "Describe the specific purpose and typical applications for different circuit types",
            "bloomLevel": "understand"
          },
          {
            "text": "Explain the fundamental principles and typical uses of ring final and radial topologies",
            "bloomLevel": "understand"
          }
        ]
      }
    },
    {
      "id": "203-3A3-vocab",
      "type": "vocab",
      "order": 2,
      "content": {
        "terms": [
          {
            "term": "Final Circuit",
            "definition": "A circuit connected directly from a consumer unit or distribution board to current-using equipment or socket-outlets."
          },
          {
            "term": "Radial Circuit",
            "definition": "A circuit arrangement where the cable runs from the distribution board to each point in succession and terminates at the final point."
          },
          {
            "term": "Ring Final Circuit",
            "definition": "A circuit arrangement that forms a continuous loop, starting and finishing at the same protective device in the consumer unit."
          },
          {
            "term": "Control Circuit",
            "definition": "A circuit used to regulate or command the operation of other electrical equipment or power circuits, such as a motor starter or thermostat."
          },
          {
            "term": "Safety Service",
            "definition": "A system which is provided for the safety of persons and which is required to remain operational during a fire or other emergency, such as fire alarms or emergency lighting."
          },
          {
            "term": "BS 7671",
            "definition": "The UK national standard for electrical installations."
          },
          {
            "term": "Extra-low voltage (ELV)",
            "definition": "A voltage not exceeding 50 V AC or 120 V ripple-free DC. Primarily used to reduce the risk of electric shock in specific environments and for data communication."
          }
        ]
      }
    },
    {
      "id": "203-3A3-diagram",
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
          "consumer-unit",
          "protective-device",
          "current-using-equipment"
        ],
        "placeholderText": "A comparison diagram showing two wiring layouts originating from a central consumer-unit. On the left, a radial-circuit is shown as a single line of cable connecting several socket-outlets in a sequence, ending at the last one. On the right, a ring-final-circuit is shown as a continuous loop of cable that leaves a protective-device, passes through several socket-outlets (current-using-equipment), and returns to the exact same terminal in the consumer-unit. Arrows should indicate the two paths of current flow in the ring arrangement compared to the single path in the radial arrangement."
      }
    },
    {
      "id": "203-3A3-explain-1",
      "type": "explanation",
      "order": 4,
      "content": {
        "title": "Circuit Categories and Applications",
        "content": "### In this lesson\nThink of a consumer unit like a distribution hub; instead of one wire for the whole house, we branch out into specific paths. In this lesson, you will learn how to identify the various categories of electrical circuits used in modern installations and understand their specific roles. You are acting as an electrician planning the layout of a new domestic or commercial building to ensure all equipment is powered correctly. Three key takeaways include: how to distinguish between power and control circuits, the critical nature of safety service segregation, and why we divide installations into multiple final circuits.\n\n**What this is**\nIn any electrical installation, the total electrical load is divided into several smaller sections known as a **Final Circuit**. Refer to the provided diagram to see how a Final Circuit is connected directly from a consumer unit or distribution board to appliances, equipment, or socket-outlets. These circuits are categorized based on the type of load they serve, such as lighting, power, heating, or safety systems. By separating these loads, we ensure that the installation remains manageable, safe, and functional. For instance, a fault on a socket circuit should not cause the lights to go out, which is a fundamental principle of circuit design.\n\n**Why it matters**\nUnderstanding the purpose and typical applications for different circuit types is essential for both safety and compliance with **BS 7671**. If an electrician does not correctly identify the various categories of electrical circuits, they might inadvertently mix loads that should be kept separate, such as data and high-voltage power lines. Proper categorization also allows for easier maintenance and fault finding, as each circuit has a clearly defined purpose and area of coverage.\n\n**Key facts / rules**\n*   Every installation must be divided into circuits to avoid danger and minimize inconvenience in the event of a fault.\n*   A **Control Circuit** is specifically used to regulate or command the operation of other electrical equipment, such as a motor starter or thermostat.\n*   A **Safety Service** must be designed to supply power to critical systems, such as fire alarms or emergency lighting, during a power failure. BS 7671 requires these to be strictly segregated from other circuits.\n*   Circuits must be identified at the distribution board or consumer unit using clear labeling.\n*   Data and communication circuits typically operate at **extra-low voltage (ELV)** and must be segregated from power circuits to prevent signal interference.\n*   Standard power circuits typically supply general-purpose socket-outlets or heavy appliances like cookers and water heaters (which are usually radial arrangements).\n\n**When to choose it**\nYou choose a specific circuit category based on the equipment's intended function and power requirements. Lighting circuits are selected for fixed luminaires and usually involve lower current demands. Power circuits are the choice for general-purpose socket-outlets or dedicated high-load items like electric showers. You must choose a **Control Circuit** when the goal is to manage another system, such as using a relay or a sensor to turn on a pump. **Safety Services** are a mandatory choice for life-safety systems where the circuit must remain operational during a fire or power loss.\n\n**Common mistakes**\nA common error is failing to provide enough separate circuits, leading to **nuisance tripping**. Another mistake is mixing safety services with standard power circuits; a **Safety Service** must have its own dedicated path and protection to ensure it is not affected by faults in general-use equipment. Electricians also sometimes forget to label circuits correctly, making future identification and isolation difficult."
      }
    },
    {
      "id": "203-3A3-check-1",
      "type": "practice",
      "order": 4.5,
      "content": {
        "title": "Check Your Understanding: Circuit Categories and Applications",
        "mode": "conceptual",
        "sequential": true,
        "questions": [
          {
            "id": "203-3A3-C1-L1-A",
            "questionText": "What is the term for a circuit connected directly from a consumer unit or distribution board to current-using equipment?",
            "answerType": "short-text",
            "cognitiveLevel": "recall",
            "expectedAnswer": [
              "final circuit",
              "final circuits",
              "a final circuit"
            ],
            "hint": "This term describes the section of the installation that feeds the end-user equipment."
          },
          {
            "id": "203-3A3-C1-L1-B",
            "questionText": "Identify the circuit type specifically used to regulate or command the operation of other electrical equipment.",
            "answerType": "short-text",
            "cognitiveLevel": "recall",
            "expectedAnswer": [
              "control circuit",
              "control circuits",
              "a control circuit"
            ],
            "hint": "Think of circuits used for motor starters or thermostats."
          },
          {
            "id": "203-3A3-C1-L1-C",
            "questionText": "Which type of circuit must be designed to supply power to critical systems like fire alarms?",
            "answerType": "short-text",
            "cognitiveLevel": "recall",
            "expectedAnswer": [
              "safety service",
              "safety services",
              "emergency circuit",
              "emergency circuits"
            ],
            "hint": "These circuits are mandatory for fire alarms and emergency lighting."
          },
          {
            "id": "203-3A3-C1-L2",
            "questionText": "Using your answers to Q1 (Final Circuits), Q2 (Control Circuits), and Q3 (Safety Services), explain how these categories help organize an electrical installation.",
            "answerType": "short-text",
            "cognitiveLevel": "connection",
            "expectedAnswer": [
              "prevents a single fault from causing total power loss",
              "ensures safety services remain operational",
              "allows independent control and protection",
              "minimizes inconvenience during a fault",
              "separates different types of loads for safety"
            ],
            "hint": "Consider how separating these roles prevents a single fault from affecting everything."
          }
        ]
      }
    },
    {
      "id": "203-3A3-explain-2",
      "type": "explanation",
      "order": 5,
      "content": {
        "title": "Circuit Topologies: Ring vs Radial",
        "content": "### In this lesson\nIn this lesson, you will learn the fundamental principles and typical uses of ring final and radial topologies in electrical installations. You are evaluating the best way to wire a series of socket-outlets in a domestic property to maximize efficiency and safety. Three key takeaways include: the definition of a continuous loop in a ring circuit, the point-to-point nature of a radial circuit, and the typical applications for each arrangement.\n\n**What this is**\nCircuit topology refers to the way the cables are physically connected to form a circuit. As illustrated in the diagram, a **Radial Circuit** resembles a tree branch following a linear path from the distribution board to each point in succession and terminating at the final point. Conversely, a **Ring Final Circuit** forms a continuous loop, starting and finishing at the same protective device in the consumer unit. This means that current has two **parallel** paths to reach any point on the circuit, which effectively increases the current-carrying capacity of the circuit using smaller cables than would be required for a single-path radial.\n\n**Why it matters**\nChoosing the right topology is a balance between cost, ease of installation, and the electrical load requirements. The **Ring Final Circuit** is a unique feature of UK electrical installations, originally designed to save copper. Understanding these topologies is crucial for an electrician to ensure that the circuit is not overloaded and that the protective devices will operate correctly.\n\n**Key facts / rules**\n*   A **Radial Circuit** starts at the consumer unit and ends at the last socket or light fitting.\n*   A **Ring Final Circuit** must start and finish at the same terminal in the consumer unit to form a complete loop.\n*   Radial circuits are commonly used for lighting, where the total current demand is relatively low.\n*   Ring circuits are typically used for general-purpose socket-outlets in domestic buildings.\n*   Dedicated radial circuits are used for high-power appliances like electric showers or cookers.\n*   Verification of the \"continuity\" of the ring is a critical safety test during commissioning.\n\n**When to choose it**\nYou should choose a **Radial Circuit** for lighting installations or when supplying a single, high-power appliance. You would choose a **Ring Final Circuit** when you need to cover a large floor area with multiple socket-outlets. The ring arrangement allows for a higher total load—typically protected by a 30A or 32A device—distributed across the loop.\n\n**Common mistakes**\nA critical danger with ring circuits is a \"broken ring\". If the loop is interrupted, it effectively becomes two radial circuits fed by a single 32A breaker. Because the cable is only sized for the shared load of a loop, this single-path \"radial\" can easily overheat without the breaker tripping, creating a significant fire risk. Another common error is \"interconnecting\" two different ring circuits, which makes isolation dangerous."
      }
    },
    {
      "id": "203-3A3-check-2",
      "type": "practice",
      "order": 5.5,
      "content": {
        "title": "Check Your Understanding: Circuit Topologies: Ring vs Radial",
        "mode": "conceptual",
        "sequential": true,
        "questions": [
          {
            "id": "203-3A3-C2-L1-A",
            "questionText": "Identify the circuit arrangement where the cable runs from the distribution board to each point in succession.",
            "answerType": "short-text",
            "cognitiveLevel": "recall",
            "expectedAnswer": [
              "radial circuit",
              "radial circuits",
              "a radial circuit"
            ],
            "hint": "This arrangement is like a branch of a tree and ends at the last point."
          },
          {
            "id": "203-3A3-C2-L1-B",
            "questionText": "What is the name for a circuit arrangement that forms a continuous loop starting and finishing at the same protective device?",
            "answerType": "short-text",
            "cognitiveLevel": "recall",
            "expectedAnswer": [
              "ring final circuit",
              "ring circuit",
              "a ring final circuit",
              "RFC"
            ],
            "hint": "This topology is common for UK domestic socket-outlets."
          },
          {
            "id": "203-3A3-C2-L1-C",
            "questionText": "What do ring circuits provide to allow for higher load capacity?",
            "answerType": "short-text",
            "cognitiveLevel": "recall",
            "expectedAnswer": [
              "two paths for current",
              "two parallel paths",
              "dual paths",
              "two paths in parallel"
            ],
            "hint": "The loop structure allows the electricity to travel in more than one direction."
          },
          {
            "id": "203-3A3-C2-L2",
            "questionText": "Compare radial and ring final topologies in terms of their physical path and how they handle electrical load.",
            "answerType": "short-text",
            "cognitiveLevel": "connection",
            "expectedAnswer": [
              "radial is point-to-point",
              "ring is a loop",
              "ring has two paths",
              "radial has one path",
              "higher load capacity in rings"
            ],
            "hint": "Compare the end point of a radial to the loop of a ring and the resulting number of paths."
          }
        ]
      }
    },
    {
      "id": "203-3A3-practice",
      "type": "practice",
      "order": 8,
      "content": {
        "title": "Your Turn (You Do)",
        "questions": [
          {
            "id": "203-3A3-P1",
            "questionText": "Why must an installation be divided into several final circuits rather than using one single large circuit for the whole building?",
            "answerType": "short-text",
            "expectedAnswer": [
              "avoid danger and minimize inconvenience",
              "prevent total loss of power",
              "isolate faults",
              "minimize inconvenience",
              "prevent total blackout"
            ],
            "hint": "Think about what happens to the whole building if a single fault occurs and there is only one circuit."
          },
          {
            "id": "203-3A3-P2",
            "questionText": "Which circuit topology forms a continuous loop by starting and finishing at the same protective device?",
            "answerType": "short-text",
            "expectedAnswer": [
              "Ring Final Circuit",
              "a Ring Final Circuit",
              "Ring Final",
              "RFC"
            ],
            "hint": "This arrangement provides two paths for the current to reach the load."
          },
          {
            "id": "203-3A3-P3",
            "questionText": "Which circuit arrangement is the standard choice for fixed lighting installations or high-power dedicated appliances like electric showers?",
            "answerType": "short-text",
            "expectedAnswer": [
              "Radial Circuit",
              "a Radial Circuit",
              "the Radial Circuit"
            ],
            "hint": "This circuit runs from the source and terminates at the final point without returning to the board."
          },
          {
            "id": "203-3A3-P4",
            "questionText": "What is the specific purpose of a Control Circuit in an electrical installation?",
            "answerType": "short-text",
            "expectedAnswer": [
              "regulate or command other equipment",
              "to regulate or command other equipment",
              "manage the operation of power circuits",
              "regulation of equipment"
            ],
            "hint": "Think of the role played by a thermostat or a motor starter's secondary wiring."
          },
          {
            "id": "203-3A3-P5",
            "questionText": "Identify the specialized circuit category required for systems such as fire alarms and emergency lighting that must remain operational during a power failure.",
            "answerType": "short-text",
            "expectedAnswer": [
              "Safety Service",
              "Safety Services",
              "Emergency Circuit",
              "an Emergency Circuit"
            ],
            "hint": "These circuits are critical for life safety and require segregation from standard power."
          }
        ]
      }
    },
    {
      "id": "203-3A3-integrative",
      "type": "practice",
      "order": 9.5,
      "content": {
        "title": "Putting It All Together",
        "mode": "integrative",
        "sequential": true,
        "questions": [
          {
            "id": "203-3A3-INT-1",
            "questionText": "Explain how circuit categories and topologies are selected for a specific installation. In your answer, include: (1) the purpose of power circuits, (2) the requirement for safety service segregation, (3) why radial topologies are used for specific applications. (2-3 sentences)",
            "answerType": "short-text",
            "cognitiveLevel": "connection",
            "expectedAnswer": [
              "power circuits provide energy while safety services are segregated and radials provide independent control",
              "power circuits deliver electricity but safety services must be separate and radials are used for specific applications",
              "dividing into power and safety services with radial topologies ensures safety and reliability"
            ],
            "hint": "Think about why we separate different types of circuits and how the radial layout supports that separation."
          },
          {
            "id": "203-3A3-INT-2",
            "questionText": "Summarize the relationship between circuit categories and their physical wiring arrangements in a building. In your answer, include: (1) the difference between power and control circuits, (2) the continuous loop of a ring final topology, (3) the point-to-point nature of a radial topology, (4) typical applications for these arrangements. Answer in 3-4 sentences OR concise bullet points.",
            "answerType": "short-text",
            "cognitiveLevel": "synthesis",
            "expectedAnswer": [
              "power circuits deliver energy",
              "control circuits regulate or command",
              "ring final forms continuous loop",
              "radial uses point-to-point structure",
              "higher load capacity in rings",
              "dedicated supply in radials",
              "safety service segregation"
            ],
            "hint": "Consider how the physical shape of the circuit (loop vs. line) matches the intended use of the circuit category."
          }
        ]
      }
    },
    {
      "id": "203-3A3-spaced-review",
      "type": "spaced-review",
      "order": 10,
      "content": {
        "title": "Foundation Check",
        "questions": [
          {
            "id": "203-3A3-SR-1",
            "questionText": "What is the primary document used as the national standard for electrical installations in the UK?",
            "expectedAnswer": [
              "BS 7671",
              "Wiring Regulations",
              "The Regs"
            ],
            "hint": "It is published by the IET and BSI.",
            "answerType": "short-text"
          },
          {
            "id": "203-3A3-SR-2",
            "questionText": "What is the term for the distribution board used in domestic premises to house circuit breakers and the main switch?",
            "expectedAnswer": [
              "Consumer Unit",
              "CU",
              "Fuse box"
            ],
            "hint": "It is where all final circuits originate in a home.",
            "answerType": "short-text"
          },
          {
            "id": "203-3A3-SR-3",
            "questionText": "What is the main reason for dividing an installation into different circuits according to BS 7671?",
            "expectedAnswer": [
              "avoid danger",
              "minimize inconvenience",
              "prevent total loss of power"
            ],
            "hint": "Consider the impact of a single fault on the whole building.",
            "answerType": "short-text"
          }
        ],
        "notes": "Foundation check before starting Circuit Types: What They Do"
      }
    }
  ],
  "metadata": {
    "created": "2026-02-07",
    "updated": "2026-02-07",
    "version": "1.1",
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

## Index Manifest

**File:** `INDEX.json`

```json
{
  "lessonId": "203-3A3",
  "runId": "203-3A3__2026-02-07T19-32-51-372Z__rewrite__gemini-3-flash-preview",
  "timestampUtc": "2026-02-07T19:32:51.372Z",
  "phase10Strategy": "rewrite",
  "models": {
    "rewrite": "gemini-3-flash-preview",
    "scoring": "gemini-3-flash-preview"
  },
  "runConfig": null,
  "scoreBefore": {
    "total": 97,
    "grade": "Strong",
    "breakdownFile": "01_score_before.json",
    "promptFile": "05_prompt_score_before.json",
    "outputFile": "06_output_score_before.txt",
    "metadata": null
  },
  "scoreAfter": {
    "total": 96,
    "grade": "Strong",
    "breakdownFile": "11_score_after.json",
    "promptFile": "12_prompt_score_after.json",
    "outputFile": "13_output_score_after.txt",
    "metadata": null
  },
  "scoreStability": null,
  "fixPlan": null,
  "issueLifecycle": null,
  "pointerDiff": null,
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
  "status": "failed",
  "failure": {
    "step": "score",
    "message": "Score gate failed: score declined by 1 points"
  },
  "files": [
    "00_input_lesson.json",
    "01_score_before.json",
    "02_prompt_rewrite.json",
    "03_output_rewrite.txt",
    "10_output_lesson.json",
    "11_score_after.json",
    "14_patches_parsed.json",
    "16_validation.json"
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

## End of Report

Generated: 2026-02-07T19:34:01.116Z
Total files: 10
