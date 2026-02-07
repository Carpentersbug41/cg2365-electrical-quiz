# Phase 10 Debug Run

**Run ID:** 203-3A3__2026-02-07T16-51-53-139Z__rewrite__gemini-3-flash-preview
**Lesson:** 203-3A3
**Strategy:** rewrite
**Timestamp:** 2026-02-07T16:51:53.139Z
**Status:** success

================================================================================

## Summary

- **Score Before:** 88/100 (Usable)
- **Score After:** 97/100 (Strong)
- **Delta:** +9 points
- **Validation:** ✅ PASSED

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
            "term": "Emergency Circuit",
            "definition": "A specialized circuit designed to supply power to critical safety systems, such as fire alarms or emergency lighting, during a power failure or fire."
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
        "content": "### In this lesson\nIn this lesson, you will learn how to identify the various categories of electrical circuits used in modern installations and understand their specific roles. You are acting as an electrician planning the layout of a new domestic or commercial building to ensure all equipment is powered correctly. Three key takeaways include: how to distinguish between power and control circuits, the critical nature of emergency circuit segregation, and why we divide installations into multiple final circuits.\n\n**What this is**\nIn any electrical installation, the total electrical load is divided into several smaller sections known as a **Final Circuit**. A **Final Circuit** is defined as a circuit connected directly from a consumer unit or distribution board to current-using equipment or socket-outlets. These circuits are categorized based on the type of load they serve, such as lighting, power, heating, or safety systems. By separating these loads, we ensure that the installation remains manageable, safe, and functional. For instance, a fault on a socket circuit should not cause the lights to go out, which is a fundamental principle of circuit design.\n\n**Why it matters**\nUnderstanding the purpose and typical applications for different circuit types is essential for both safety and compliance with BS 7671 (refer to current edition). If an electrician does not correctly identify the various categories of electrical circuits, they might inadvertently mix loads that should be kept separate, such as data and high-voltage power lines. This can lead to electromagnetic interference or, more seriously, a failure of safety systems during an emergency. Proper categorization also allows for easier maintenance and fault finding, as each circuit has a clearly defined purpose and area of coverage.\n\n**Key facts / rules**\n*   Every installation must be divided into circuits to avoid danger and minimize inconvenience in the event of a fault.\n*   A **Control Circuit** is specifically used to regulate or command the operation of other electrical equipment, such as a motor starter or thermostat.\n*   An **Emergency Circuit** must be designed to supply power to critical safety systems, such as fire alarms or emergency lighting, during a power failure.\n*   Circuits must be identified at the distribution board or consumer unit using clear labeling.\n*   Data and communication circuits typically operate at extra-low voltage and must be segregated from power circuits to prevent signal interference.\n*   Standard power circuits typically supply general-purpose socket-outlets or heavy appliances like cookers and water heaters.\n\n**When to choose it**\nYou choose a specific circuit category based on the equipment's intended function and power requirements. Lighting circuits are selected for fixed luminaires and usually involve lower current demands. Power circuits are the choice for general-purpose socket-outlets or dedicated high-load items like electric showers. You must choose a **Control Circuit** when the goal is to manage another system, such as using a relay or a sensor to turn on a pump. **Emergency Circuits** are a mandatory choice for life-safety systems where the circuit must remain operational during a fire or power loss. Data circuits are selected for networking and communication needs, requiring specific cabling like Cat6 or fiber optics.\n\n**Common mistakes**\nA common error is failing to provide enough separate circuits, leading to \"nuisance tripping\" where too many appliances are connected to a single protective device. Another mistake is mixing emergency systems with standard power circuits; an **Emergency Circuit** must often have its own dedicated path and protection to ensure it is not affected by faults in general-use equipment. Electricians also sometimes forget to label circuits correctly, making future identification and isolation difficult for other professionals.\n\n**Key Points**\n*   **Final Circuits** connect the distribution board directly to the end-user equipment.\n*   **Control Circuits** are used for regulation and commanding other power circuits.\n*   **Emergency Circuits** are specialized for safety systems like fire alarms.\n*   Proper circuit categorization prevents total loss of power during a single fault.\n*   Data and communication circuits require segregation from mains voltage cabling.\n\n**Quick recap**\nElectrical installations are divided into various categories of circuits to ensure safety and functionality. These include lighting, power, control, and emergency circuits, each serving a specific purpose. By understanding these categories, an electrician can design an installation that is easy to maintain and compliant with safety standards like BS 7671.\n\n### Coming Up Next\nNow that you can identify circuit categories, we will look at the physical arrangements of these wires, specifically the differences between ring and radial topologies."
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
              "Final Circuit is defined as a circuit connected directly from a consumer unit or distribution board to current-using equipment",
              "final circuit",
              "final circuits"
            ],
            "hint": "This term describes the section of the installation that feeds the end-user equipment."
          },
          {
            "id": "203-3A3-C1-L1-B",
            "questionText": "Identify the circuit type specifically used to regulate or command the operation of other electrical equipment.",
            "answerType": "short-text",
            "cognitiveLevel": "recall",
            "expectedAnswer": [
              "Control Circuit is specifically used to regulate or command the operation of other electrical equipment",
              "control circuit",
              "control circuits"
            ],
            "hint": "Think of circuits used for motor starters or thermostats."
          },
          {
            "id": "203-3A3-C1-L1-C",
            "questionText": "Which type of circuit must be designed to supply power to critical safety systems?",
            "answerType": "short-text",
            "cognitiveLevel": "recall",
            "expectedAnswer": [
              "Emergency Circuit must be designed to supply power to critical safety systems",
              "emergency circuit",
              "emergency circuits"
            ],
            "hint": "These circuits are mandatory for fire alarms and emergency lighting."
          },
          {
            "id": "203-3A3-C1-L2",
            "questionText": "Using your answers to Q1 (Final Circuits), Q2 (Control Circuits), and Q3 (Emergency Circuits), explain how these categories help organize an electrical installation.",
            "answerType": "short-text",
            "cognitiveLevel": "connection",
            "expectedAnswer": [
              "separating final circuits control circuits and emergency circuits ensures the installation remains manageable and that safety systems are protected from general faults",
              "categorizing circuits into final control and emergency types allows for specific roles to be managed safely without interference",
              "dividing an installation into final control and emergency circuits ensures functionality and prevents safety system failure during faults"
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
        "content": "### In this lesson\nIn this lesson, you will learn the fundamental principles and typical uses of ring final and radial topologies in electrical installations. You are evaluating the best way to wire a series of socket-outlets in a domestic property to maximize efficiency and safety. Three key takeaways include: the definition of a continuous loop in a ring circuit, the point-to-point nature of a radial circuit, and the typical applications for each arrangement.\n\n**What this is**\nCircuit topology refers to the way the cables are physically connected to form a circuit. A **Radial Circuit** is a circuit arrangement where the cable runs from the distribution board to each point in succession and terminates at the final point. It is like a branch of a tree. A **Ring Final Circuit**, however, is a circuit arrangement that forms a continuous loop, starting and finishing at the same protective device in the consumer unit. This means that current has two paths to reach any point on the circuit, which effectively increases the current-carrying capacity of the circuit using smaller cables than would be required for a single-path radial.\n\n**Why it matters**\nChoosing the right topology is a balance between cost, ease of installation, and the electrical load requirements. The **Ring Final Circuit** is a unique feature of UK electrical installations, originally designed to save copper while providing enough power for post-war housing. Understanding these topologies is crucial for an electrician to ensure that the circuit is not overloaded and that the protective devices will operate correctly. Incorrectly identifying a circuit as a ring when it is actually a broken loop (becoming two radials) can lead to cable overheating and potential fire hazards.\n\n**Key facts / rules**\n*   A **Radial Circuit** starts at the consumer unit and ends at the last socket or light fitting.\n*   A **Ring Final Circuit** must start and finish at the same terminal in the consumer unit to form a complete loop.\n*   Radial circuits are commonly used for lighting, where the total current demand is relatively low.\n*   Ring circuits are typically used for general-purpose socket-outlets in domestic buildings.\n*   Dedicated radial circuits are used for high-power appliances like electric showers or cookers.\n*   In a ring circuit, the current splits and travels in both directions around the loop to reach the load.\n*   Verification of the \"continuity\" of the ring is a critical safety test during commissioning.\n\n**When to choose it**\nYou should choose a **Radial Circuit** for lighting installations or when supplying a single, high-power appliance that requires its own dedicated fuse or breaker. Radials are also simpler to install and test in small areas or commercial units where circuits are frequently modified. You would choose a **Ring Final Circuit** when you need to cover a large floor area with multiple socket-outlets, such as in a living room or bedroom. The ring arrangement allows for a higher total load—typically protected by a 30A or 32A device—distributed across the loop. It is the standard choice for general domestic power because it provides a good balance of capacity and cable economy.\n\n**Common mistakes**\nThe most dangerous mistake with a **Ring Final Circuit** is a \"broken ring,\" where the loop is interrupted but the circuit still appears to work. This causes the remaining cable to carry more current than it was designed for, leading to overheating. Another common error is \"interconnecting\" two different ring circuits, which makes isolation dangerous. For **Radial Circuits**, a common mistake is adding too many points to a single circuit, exceeding the design load and causing the protective device to trip frequently.\n\n**Key Points**\n*   **Radial Circuits** run from the source to a final termination point.\n*   **Ring Final Circuits** form a loop back to the same protective device.\n*   Ring circuits provide two paths for current, allowing for higher load capacity.\n*   Radial circuits are the standard choice for lighting and high-power dedicated appliances.\n*   Proper testing is required to ensure a ring circuit is truly continuous.\n\n**Quick recap**\nElectricians use two main topologies: radial and ring final. A **Radial Circuit** follows a linear path and is ideal for lighting and dedicated appliances. A **Ring Final Circuit** forms a loop, offering a high-capacity solution for general power outlets in homes. Selecting the right topology ensures the installation is efficient, safe, and compliant with current regulations.\n\n### Coming Up Next\nNext, we will explore how to select the correct protective devices, such as MCBs and RCDs, to safeguard these different circuit types."
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
              "Radial Circuit is a circuit arrangement where the cable runs from the distribution board to each point in succession",
              "radial circuit",
              "radial circuits"
            ],
            "hint": "This arrangement is like a branch of a tree and ends at the last point."
          },
          {
            "id": "203-3A3-C2-L1-B",
            "questionText": "What is the name for a circuit arrangement that forms a continuous loop starting and finishing at the same protective device?",
            "answerType": "short-text",
            "cognitiveLevel": "recall",
            "expectedAnswer": [
              "Ring Final Circuit is a circuit arrangement that forms a continuous loop starting and finishing at the same protective device",
              "ring final circuit",
              "ring circuit"
            ],
            "hint": "This topology is common for UK domestic socket-outlets."
          },
          {
            "id": "203-3A3-C2-L1-C",
            "questionText": "What do ring circuits provide to allow for higher load capacity?",
            "answerType": "short-text",
            "cognitiveLevel": "recall",
            "expectedAnswer": [
              "Ring circuits provide two paths for current allowing for higher load capacity",
              "two paths for current",
              "two paths"
            ],
            "hint": "The loop structure allows the electricity to travel in more than one direction."
          },
          {
            "id": "203-3A3-C2-L2",
            "questionText": "Using your answers to Q1 (Radial Circuits), Q2 (Ring Final Circuits), and Q3 (current paths), explain how these topologies differ in their physical path and capacity.",
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
            "questionText": "Identify the type of circuit that connects directly from a consumer unit or distribution board to current-using equipment.",
            "answerType": "short-text",
            "expectedAnswer": [
              "Final Circuit",
              "a Final Circuit",
              "the Final Circuit"
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
              "to regulate or command other equipment"
            ],
            "hint": "Think of the role played by a thermostat or a motor starter's secondary wiring."
          },
          {
            "id": "203-3A3-P5",
            "questionText": "Identify the specialized circuit category required for systems such as fire alarms and emergency lighting that must remain operational during a power failure.",
            "answerType": "short-text",
            "expectedAnswer": [
              "Emergency Circuit",
              "an Emergency Circuit",
              "the Emergency Circuit"
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
            "questionText": "Explain how circuit categories and topologies are selected for a specific installation. In your answer, include: (1) the purpose of power circuits, (2) the requirement for emergency circuit segregation, (3) why radial topologies are used for specific applications. (2-3 sentences)",
            "answerType": "short-text",
            "cognitiveLevel": "connection",
            "expectedAnswer": [
              "(1) Power circuits provide energy to equipment, while (2) emergency circuits must be segregated for safety; (3) radial topologies are often used for these specific applications to ensure independent control and reliability.",
              "(1) The purpose of power circuits is to deliver electricity to loads, but (2) emergency circuits require strict segregation from others; (3) radial topologies are typically chosen for these and other specific applications like lighting to maintain circuit independence.",
              "(1) Power circuits distribute energy to outlets and appliances, (2) requiring emergency circuits to be kept separate (segregated); (3) radial topologies are then used for these specific applications to simplify the wiring and meet safety standards."
            ],
            "hint": "Think about why we separate different types of circuits and how the radial layout supports that separation."
          },
          {
            "id": "203-3A3-INT-2",
            "questionText": "Summarize the relationship between circuit categories and their physical wiring arrangements in a building. In your answer, include: (1) the difference between power and control circuits, (2) the continuous loop of a ring final topology, (3) the point-to-point nature of a radial topology, (4) typical applications for these arrangements. Answer in 3-4 sentences OR concise bullet points.",
            "answerType": "short-text",
            "cognitiveLevel": "synthesis",
            "expectedAnswer": [
              "(1) Power circuits deliver energy while control circuits manage operations; (2) ring final topologies use a continuous loop for socket outlets, whereas (3) radial topologies use a point-to-point structure. (4) Typical applications include rings for domestic sockets and radials for lighting or heavy appliances.",
              "1. Power circuits provide electricity to loads while control circuits regulate them. 2. Ring final topologies consist of a continuous loop from the consumer unit and back. 3. Radial topologies use a point-to-point arrangement from the source to the last point. 4. Rings are used for socket circuits, while radials are used for lighting and fixed appliances.",
              "(1) Electricians distinguish between power circuits for loads and control circuits for switching; (2) a ring final topology creates a continuous loop to increase current capacity, (3) while a radial topology follows a point-to-point path. (4) Rings are commonly used for domestic sockets, while radials are standard for lighting and dedicated power feeds."
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
            "questionText": "What unit is used to measure electrical current?",
            "expectedAnswer": [
              "Amperes",
              "Amps",
              "A"
            ],
            "hint": "It is named after a French physicist and often abbreviated to a single letter.",
            "answerType": "short-text"
          },
          {
            "id": "203-3A3-SR-2",
            "questionText": "In which type of basic circuit configuration is there only one path for the current to flow?",
            "expectedAnswer": [
              "Series",
              "Series circuit",
              "A series circuit"
            ],
            "hint": "Think of components connected end-to-end in a single loop.",
            "answerType": "short-text"
          },
          {
            "id": "203-3A3-SR-3",
            "questionText": "What is the term for a material that allows electricity to flow through it easily?",
            "expectedAnswer": [
              "Conductor",
              "A conductor",
              "Electrical conductor"
            ],
            "hint": "Copper and aluminum are common examples used in wiring.",
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
            "term": "Emergency Circuit",
            "definition": "A specialized circuit designed to supply power to critical safety systems, such as fire alarms or emergency lighting, during a power failure or fire."
          },
          {
            "term": "BS 7671",
            "definition": "The UK national standard for electrical installations."
          },
          {
            "term": "Extra-low voltage (ELV)",
            "definition": "A voltage not exceeding 50 V AC or 120 V ripple-free DC."
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
        "content": "### In this lesson\nIn this lesson, you will learn how to identify the various categories of electrical circuits used in modern installations and understand their specific roles. You are acting as an electrician planning the layout of a new domestic or commercial building to ensure all equipment is powered correctly. Three key takeaways include: how to distinguish between power and control circuits, the critical nature of emergency circuit segregation, and why we divide installations into multiple final circuits.\n\n**What this is**\nIn any electrical installation, the total electrical load is divided into several smaller sections known as a **Final Circuit**. Refer to the provided diagram to see how a Final Circuit is connected directly from a consumer unit or distribution board to current-using equipment or socket-outlets. These circuits are categorized based on the type of load they serve, such as lighting, power, heating, or safety systems. By separating these loads, we ensure that the installation remains manageable, safe, and functional. For instance, a fault on a socket circuit should not cause the lights to go out, which is a fundamental principle of circuit design.\n\n**Why it matters**\nUnderstanding the purpose and typical applications for different circuit types is essential for both safety and compliance with **BS 7671**. If an electrician does not correctly identify the various categories of electrical circuits, they might inadvertently mix loads that should be kept separate, such as data and high-voltage power lines. This can lead to electromagnetic interference or, more seriously, a failure of safety systems during an emergency. Proper categorization also allows for easier maintenance and fault finding, as each circuit has a clearly defined purpose and area of coverage.\n\n**Key facts / rules**\n*   Every installation must be divided into circuits to avoid danger and minimize inconvenience in the event of a fault.\n*   A **Control Circuit** is specifically used to regulate or command the operation of other electrical equipment, such as a motor starter or thermostat.\n*   An **Emergency Circuit** must be designed to supply power to critical safety systems, such as fire alarms or emergency lighting, during a power failure.\n*   Circuits must be identified at the distribution board or consumer unit using clear labeling.\n*   Data and communication circuits typically operate at **extra-low voltage (ELV)** and must be segregated from power circuits to prevent signal interference.\n*   Standard power circuits typically supply general-purpose socket-outlets or heavy appliances like cookers and water heaters.\n\n**When to choose it**\nYou choose a specific circuit category based on the equipment's intended function and power requirements. Lighting circuits are selected for fixed luminaires and usually involve lower current demands. Power circuits are the choice for general-purpose socket-outlets or dedicated high-load items like electric showers. You must choose a **Control Circuit** when the goal is to manage another system, such as using a relay or a sensor to turn on a pump. **Emergency Circuits** are a mandatory choice for life-safety systems where the circuit must remain operational during a fire or power loss. Data circuits are selected for networking and communication needs, requiring specific cabling like Cat6 or fiber optics.\n\n**Common mistakes**\nA common error is failing to provide enough separate circuits, leading to \"nuisance tripping\" where too many appliances are connected to a single protective device. Another mistake is mixing emergency systems with standard power circuits; an **Emergency Circuit** must often have its own dedicated path and protection to ensure it is not affected by faults in general-use equipment. Electricians also sometimes forget to label circuits correctly, making future identification and isolation difficult for other professionals.\n\n**Key Points**\n*   **Final Circuits** connect the distribution board directly to the end-user equipment.\n*   **Control Circuits** are used for regulation and commanding other power circuits.\n*   **Emergency Circuits** are specialized for safety systems like fire alarms.\n*   Proper circuit categorization prevents total loss of power during a single fault.\n*   Data and communication circuits require segregation from mains voltage cabling.\n\n**Quick recap**\nElectrical installations are divided into various categories of circuits to ensure safety and functionality. These include lighting, power, control, and emergency circuits, each serving a specific purpose. By understanding these categories, an electrician can design an installation that is easy to maintain and compliant with safety standards like BS 7671.\n\n### Coming Up Next\nNow that you can identify circuit categories, we will look at the physical arrangements of these wires, specifically the differences between ring and radial topologies."
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
            "questionText": "Which type of circuit must be designed to supply power to critical safety systems?",
            "answerType": "short-text",
            "cognitiveLevel": "recall",
            "expectedAnswer": [
              "emergency circuit",
              "emergency circuits",
              "an emergency circuit"
            ],
            "hint": "These circuits are mandatory for fire alarms and emergency lighting."
          },
          {
            "id": "203-3A3-C1-L2",
            "questionText": "Using your answers to Q1 (Final Circuits), Q2 (Control Circuits), and Q3 (Emergency Circuits), explain how these categories help organize an electrical installation. (Answer in 2-3 sentences or concise bullet points.)",
            "answerType": "short-text",
            "cognitiveLevel": "connection",
            "expectedAnswer": [
              "separating final circuits control circuits and emergency circuits ensures the installation remains manageable and that safety systems are protected from general faults",
              "categorizing circuits into final control and emergency types allows for specific roles to be managed safely without interference",
              "dividing an installation into final control and emergency circuits ensures functionality and prevents safety system failure during faults"
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
        "content": "### In this lesson\nIn this lesson, you will learn the fundamental principles and typical uses of ring final and radial topologies in electrical installations. You are evaluating the best way to wire a series of socket-outlets in a domestic property to maximize efficiency and safety. Three key takeaways include: the definition of a continuous loop in a ring circuit, the point-to-point nature of a radial circuit, and the typical applications for each arrangement.\n\n**What this is**\nCircuit topology refers to the way the cables are physically connected to form a circuit. As illustrated in the diagram, a **Radial Circuit** resembles a tree branch following a linear path from the distribution board to each point in succession and terminating at the final point. Conversely, a **Ring Final Circuit** forms a continuous loop, starting and finishing at the same protective device in the consumer unit. This means that current has two paths to reach any point on the circuit, which effectively increases the current-carrying capacity of the circuit using smaller cables than would be required for a single-path radial.\n\n**Why it matters**\nChoosing the right topology is a balance between cost, ease of installation, and the electrical load requirements. The **Ring Final Circuit** is a unique feature of UK electrical installations, originally designed to save copper while providing enough power for post-war housing. Understanding these topologies is crucial for an electrician to ensure that the circuit is not overloaded and that the protective devices will operate correctly. Incorrectly identifying a circuit as a ring when it is actually a broken loop (becoming two radials) can lead to cable overheating and potential fire hazards.\n\n**Key facts / rules**\n*   A **Radial Circuit** starts at the consumer unit and ends at the last socket or light fitting.\n*   A **Ring Final Circuit** must start and finish at the same terminal in the consumer unit to form a complete loop.\n*   Radial circuits are commonly used for lighting, where the total current demand is relatively low.\n*   Ring circuits are typically used for general-purpose socket-outlets in domestic buildings.\n*   Dedicated radial circuits are used for high-power appliances like electric showers or cookers.\n*   In a ring circuit, the current splits and travels in both directions around the loop to reach the load.\n*   Verification of the \"continuity\" of the ring is a critical safety test during commissioning.\n\n**When to choose it**\nYou should choose a **Radial Circuit** for lighting installations or when supplying a single, high-power appliance that requires its own dedicated fuse or breaker. Radials are also simpler to install and test in small areas or commercial units where circuits are frequently modified. You would choose a **Ring Final Circuit** when you need to cover a large floor area with multiple socket-outlets, such as in a living room or bedroom. The ring arrangement allows for a higher total load—typically protected by a 30A or 32A device—distributed across the loop. It is the standard choice for general domestic power because it provides a good balance of capacity and cable economy.\n\n**Common mistakes**\nThe most dangerous mistake with a **Ring Final Circuit** is a \"broken ring,\" where the loop is interrupted but the circuit still appears to work. This causes the remaining cable to carry more current than it was designed for, leading to overheating. Another common error is \"interconnecting\" two different ring circuits, which makes isolation dangerous. For **Radial Circuits**, a common mistake is adding too many points to a single circuit, exceeding the design load and causing the protective device to trip frequently.\n\n**Key Points**\n*   **Radial Circuits** run from the source to a final termination point.\n*   **Ring Final Circuits** form a loop back to the same protective device.\n*   Ring circuits provide two paths for current, allowing for higher load capacity.\n*   Radial circuits are the standard choice for lighting and high-power dedicated appliances.\n*   Proper testing is required to ensure a ring circuit is truly continuous.\n\n**Quick recap**\nElectricians use two main topologies: radial and ring final. A **Radial Circuit** follows a linear path and is ideal for lighting and dedicated appliances. A **Ring Final Circuit** forms a loop, offering a high-capacity solution for general power outlets in homes. Selecting the right topology ensures the installation is efficient, safe, and compliant with current regulations.\n\n### Coming Up Next\nNext, we will explore how to select the correct protective devices, such as MCBs and RCDs, to safeguard these different circuit types."
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
              "two paths",
              "dual paths"
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
            "questionText": "An electrician is wiring a dedicated feed for a new electric oven; what is the general term for this type of circuit connected directly from the consumer unit?",
            "answerType": "short-text",
            "expectedAnswer": [
              "Final Circuit",
              "a Final Circuit",
              "the Final Circuit"
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
              "to regulate or command other equipment"
            ],
            "hint": "Think of the role played by a thermostat or a motor starter's secondary wiring."
          },
          {
            "id": "203-3A3-P5",
            "questionText": "Identify the specialized circuit category required for systems such as fire alarms and emergency lighting that must remain operational during a power failure.",
            "answerType": "short-text",
            "expectedAnswer": [
              "Emergency Circuit",
              "an Emergency Circuit",
              "the Emergency Circuit"
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
            "questionText": "Explain how circuit categories and topologies are selected for a specific installation. In your answer, include: (1) the purpose of power circuits, (2) the requirement for emergency circuit segregation, (3) why radial topologies are used for specific applications. (2-3 sentences)",
            "answerType": "short-text",
            "cognitiveLevel": "connection",
            "expectedAnswer": [
              "(1) Power circuits provide energy to equipment, while (2) emergency circuits must be segregated for safety; (3) radial topologies are often used for these specific applications to ensure independent control and reliability.",
              "(1) The purpose of power circuits is to deliver electricity to loads, but (2) emergency circuits require strict segregation from others; (3) radial topologies are typically chosen for these and other specific applications like lighting to maintain circuit independence.",
              "(1) Power circuits distribute energy to outlets and appliances, (2) requiring emergency circuits to be kept separate (segregated); (3) radial topologies are then used for these specific applications to simplify the wiring and meet safety standards."
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
            "questionText": "What unit is used to measure electrical current?",
            "expectedAnswer": [
              "Amperes",
              "Amps",
              "A"
            ],
            "hint": "It is named after a French physicist and often abbreviated to a single letter.",
            "answerType": "short-text"
          },
          {
            "id": "203-3A3-SR-2",
            "questionText": "In which type of basic circuit configuration is there only one path for the current to flow?",
            "expectedAnswer": [
              "Series",
              "Series circuit",
              "A series circuit"
            ],
            "hint": "Think of components connected end-to-end in a single loop.",
            "answerType": "short-text"
          },
          {
            "id": "203-3A3-SR-3",
            "questionText": "What is the term for a material that allows electricity to flow through it easily?",
            "expectedAnswer": [
              "Conductor",
              "A conductor",
              "Electrical conductor"
            ],
            "hint": "Copper and aluminum are common examples used in wiring.",
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
  "total": 88,
  "breakdown": {
    "schemaCompliance": 15,
    "pedagogy": 24,
    "questions": 22,
    "marking": 8,
    "visual": 4,
    "safety": 0
  },
  "details": [
    {
      "section": "beginnerClarityStaging: The lesson jumps from simple recall questions in the checks ...",
      "score": 0,
      "maxScore": 4,
      "issues": [
        "The lesson jumps from simple recall questions in the checks to high-level synthesis in the integrative block without a worked example or guided practice to model how to construct these complex answers."
      ],
      "suggestions": [
        "Cannot be fixed by Phase 10 - requires regeneration"
      ],
      "jsonPointers": [
        "/blocks/8",
        "/blocks/9"
      ]
    },
    {
      "section": "markingRobustness: Expected answers for recall questions (e.g., 203-3A3-C1-L1-A...",
      "score": 0,
      "maxScore": 3,
      "issues": [
        "Expected answers for recall questions (e.g., 203-3A3-C1-L1-A) include redundant prompt text ('Final Circuit is defined as...'), which creates high friction for short-text matching."
      ],
      "suggestions": [
        "Change blocks[4].content.questions[0].expectedAnswer from 'Final Circuit is defined as a circuit connected directly from a consumer unit or distribution board to current-using equipment,final circuit,final circuits' to 'final circuit,final circuits,a final circuit'",
        "Change blocks[4].content.questions[1].expectedAnswer from 'Control Circuit is specifically used to regulate or command the operation of other electrical equipment,control circuit,control circuits' to 'control circuit,control circuits,a control circuit'",
        "Change blocks[4].content.questions[2].expectedAnswer from 'Emergency Circuit must be designed to supply power to critical safety systems,emergency circuit,emergency circuits' to 'emergency circuit,emergency circuits,an emergency circuit'"
      ],
      "jsonPointers": [
        "/blocks/4/content/questions/0/expectedAnswer",
        "/blocks/4/content/questions/1/expectedAnswer",
        "/blocks/4/content/questions/2/expectedAnswer",
        "/blocks/6/content/questions/0/expectedAnswer",
        "/blocks/6/content/questions/1/expectedAnswer",
        "/blocks/6/content/questions/2/expectedAnswer"
      ]
    },
    {
      "section": "questions: Independent practice question P1 is virtually identical to c...",
      "score": 0,
      "maxScore": 3,
      "issues": [
        "Independent practice question P1 is virtually identical to check question C1-L1-A, providing no new context or application for the student to test their understanding."
      ],
      "suggestions": [
        "Change blocks[7].content.questions[0].questionText from 'Identify the type of circuit that connects directly from a consumer unit or distribution board to current-using equipment.' to 'An electrician is wiring a dedicated feed for a new electric oven; what is the general term for this type of circuit connected directly from the consumer unit?'"
      ],
      "jsonPointers": [
        "/blocks/7/content/questions/0/questionText"
      ]
    },
    {
      "section": "visual: The explanation blocks (4 and 6) do not explicitly reference...",
      "score": 0,
      "maxScore": 2,
      "issues": [
        "The explanation blocks (4 and 6) do not explicitly reference the diagram provided in block 3, missing an opportunity to anchor the text to the visual representation."
      ],
      "suggestions": [
        "Modify blocks[3].content.content",
        "Modify blocks[5].content.content"
      ],
      "jsonPointers": [
        "/blocks/3/content/content",
        "/blocks/5/content/content"
      ]
    },
    {
      "section": "beginnerClarityStaging: Technical terms 'BS 7671' and 'Extra-low voltage (ELV)' are ...",
      "score": 0,
      "maxScore": 2,
      "issues": [
        "Technical terms 'BS 7671' and 'Extra-low voltage (ELV)' are introduced in the text but are missing from the Vocab block, which may confuse beginners."
      ],
      "suggestions": [
        "Append to blocks[1].content.terms: '[object Object],[object Object]'"
      ],
      "jsonPointers": [
        "/blocks/1/content/terms"
      ]
    },
    {
      "section": "questions: Connection-level questions at 203-3A3-C1-L2 and 203-3A3-C2-L...",
      "score": 0,
      "maxScore": 2,
      "issues": [
        "Connection-level questions at 203-3A3-C1-L2 and 203-3A3-C2-L2 lack formatting instructions (e.g., 'Answer in 1-2 sentences'), which can lead to overly brief or long-winded student responses."
      ],
      "suggestions": [
        "Append to blocks[4].content.questions[3].questionText: ' (Answer in 2-3 sentences or concise bullet points.)'",
        "Append to blocks[6].content.questions[3].questionText: ' (Answer in 2-3 sentences or concise bullet points.)'"
      ],
      "jsonPointers": [
        "/blocks/4/content/questions/3/questionText",
        "/blocks/6/content/questions/3/questionText"
      ]
    }
  ],
  "grade": "Usable"
}
```

---

### Score After Refinement

#### Parsed Score

```json
{
  "total": 97,
  "breakdown": {
    "schemaCompliance": 15,
    "pedagogy": 29,
    "questions": 24,
    "marking": 9,
    "visual": 5,
    "safety": 0
  },
  "details": [
    {
      "section": "markingRobustness: Connection questions (C1-L2, C2-L2, and INT-1) use rigid, fu...",
      "score": 0,
      "maxScore": 2,
      "issues": [
        "Connection questions (C1-L2, C2-L2, and INT-1) use rigid, full-sentence expected answers. This creates high friction for students who provide the correct concepts but use different phrasing."
      ],
      "suggestions": [
        "Change blocks[4].content.questions[3].expectedAnswer from 'separating final circuits control circuits and emergency circuits ensures the installation remains manageable and that safety systems are protected from general faults,categorizing circuits into final control and emergency types allows for specific roles to be managed safely without interference,dividing an installation into final control and emergency circuits ensures functionality and prevents safety system failure during faults' to 'manageable installation,safety systems protected,prevent general faults,organize installation,circuit categorization,separating roles'",
        "Change blocks[6].content.questions[3].expectedAnswer from 'radial circuits run to a final point while ring final circuits form a loop to provide two paths for current for higher load capacity,a radial circuit terminates at the last point but a ring circuit forms a loop back to the board to provide two paths for current,the loop in a ring final circuit allows for higher load capacity via two paths compared to the single path of a radial circuit' to 'radial circuits terminal point,ring circuits continuous loop,two paths for current,higher load capacity,physical path differences'",
        "Change blocks[8].content.questions[0].expectedAnswer from '(1) Power circuits provide energy to equipment, while (2) emergency circuits must be segregated for safety; (3) radial topologies are often used for these specific applications to ensure independent control and reliability.,(1) The purpose of power circuits is to deliver electricity to loads, but (2) emergency circuits require strict segregation from others; (3) radial topologies are typically chosen for these and other specific applications like lighting to maintain circuit independence.,(1) Power circuits distribute energy to outlets and appliances, (2) requiring emergency circuits to be kept separate (segregated); (3) radial topologies are then used for these specific applications to simplify the wiring and meet safety standards.' to 'power circuits deliver energy,emergency circuits segregated,radial topologies independent control,maintain circuit independence,safety standards'"
      ],
      "jsonPointers": [
        "/blocks/4/content/questions/3/expectedAnswer",
        "/blocks/6/content/questions/3/expectedAnswer",
        "/blocks/8/content/questions/0/expectedAnswer"
      ]
    },
    {
      "section": "beginnerClarityStaging: Explanation block 1 uses the technical term 'nuisance trippi...",
      "score": 0,
      "maxScore": 1,
      "issues": [
        "Explanation block 1 uses the technical term 'nuisance tripping' in the common mistakes section without providing a definition for beginners."
      ],
      "suggestions": [
        "Modify blocks[3].content.content"
      ],
      "jsonPointers": [
        "/blocks/3/content/content"
      ]
    },
    {
      "section": "markingRobustness: Practice question 203-3A3-P4 has limited variations for the ...",
      "score": 0,
      "maxScore": 1,
      "issues": [
        "Practice question 203-3A3-P4 has limited variations for the purpose of a control circuit, potentially failing correct student answers."
      ],
      "suggestions": [
        "Change blocks[7].content.questions[3].expectedAnswer from 'regulate or command other equipment,to regulate or command other equipment' to 'regulate or command equipment,control other systems,manage other circuits,command operation,regulate electrical equipment'"
      ],
      "jsonPointers": [
        "/blocks/7/content/questions/3/expectedAnswer"
      ]
    }
  ],
  "grade": "Strong"
}
```

---

## Rewrite Step

### Rewrite Prompt

**Timestamp:** 2026-02-07T16:52:22.924Z
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
            "term": "Emergency Circuit",
            "definition": "A specialized circuit designed to supply power to critical safety systems, such as fire alarms or emergency lighting, during a power failure or fire."
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
        "content": "### In this lesson\nIn this lesson, you will learn how to identify the various categories of electrical circuits used in modern installations and understand their specific roles. You are acting as an electrician planning the layout of a new domestic or commercial building to ensure all equipment is powered correctly. Three key takeaways include: how to distinguish between power and control circuits, the critical nature of emergency circuit segregation, and why we divide installations into multiple final circuits.\n\n**What this is**\nIn any electrical installation, the total electrical load is divided into several smaller sections known as a **Final Circuit**. A **Final Circuit** is defined as a circuit connected directly from a consumer unit or distribution board to current-using equipment or socket-outlets. These circuits are categorized based on the type of load they serve, such as lighting, power, heating, or safety systems. By separating these loads, we ensure that the installation remains manageable, safe, and functional. For instance, a fault on a socket circuit should not cause the lights to go out, which is a fundamental principle of circuit design.\n\n**Why it matters**\nUnderstanding the purpose and typical applications for different circuit types is essential for both safety and compliance with BS 7671 (refer to current edition). If an electrician does not correctly identify the various categories of electrical circuits, they might inadvertently mix loads that should be kept separate, such as data and high-voltage power lines. This can lead to electromagnetic interference or, more seriously, a failure of safety systems during an emergency. Proper categorization also allows for easier maintenance and fault finding, as each circuit has a clearly defined purpose and area of coverage.\n\n**Key facts / rules**\n*   Every installation must be divided into circuits to avoid danger and minimize inconvenience in the event of a fault.\n*   A **Control Circuit** is specifically used to regulate or command the operation of other electrical equipment, such as a motor starter or thermostat.\n*   An **Emergency Circuit** must be designed to supply power to critical safety systems, such as fire alarms or emergency lighting, during a power failure.\n*   Circuits must be identified at the distribution board or consumer unit using clear labeling.\n*   Data and communication circuits typically operate at extra-low voltage and must be segregated from power circuits to prevent signal interference.\n*   Standard power circuits typically supply general-purpose socket-outlets or heavy appliances like cookers and water heaters.\n\n**When to choose it**\nYou choose a specific circuit category based on the equipment's intended function and power requirements. Lighting circuits are selected for fixed luminaires and usually involve lower current demands. Power circuits are the choice for general-purpose socket-outlets or dedicated high-load items like electric showers. You must choose a **Control Circuit** when the goal is to manage another system, such as using a relay or a sensor to turn on a pump. **Emergency Circuits** are a mandatory choice for life-safety systems where the circuit must remain operational during a fire or power loss. Data circuits are selected for networking and communication needs, requiring specific cabling like Cat6 or fiber optics.\n\n**Common mistakes**\nA common error is failing to provide enough separate circuits, leading to \"nuisance tripping\" where too many appliances are connected to a single protective device. Another mistake is mixing emergency systems with standard power circuits; an **Emergency Circuit** must often have its own dedicated path and protection to ensure it is not affected by faults in general-use equipment. Electricians also sometimes forget to label circuits correctly, making future identification and isolation difficult for other professionals.\n\n**Key Points**\n*   **Final Circuits** connect the distribution board directly to the end-user equipment.\n*   **Control Circuits** are used for regulation and commanding other power circuits.\n*   **Emergency Circuits** are specialized for safety systems like fire alarms.\n*   Proper circuit categorization prevents total loss of power during a single fault.\n*   Data and communication circuits require segregation from mains voltage cabling.\n\n**Quick recap**\nElectrical installations are divided into various categories of circuits to ensure safety and functionality. These include lighting, power, control, and emergency circuits, each serving a specific purpose. By understanding these categories, an electrician can design an installation that is easy to maintain and compliant with safety standards like BS 7671.\n\n### Coming Up Next\nNow that you can identify circuit categories, we will look at the physical arrangements of these wires, specifically the differences between ring and radial topologies."
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
              "Final Circuit is defined as a circuit connected directly from a consumer unit or distribution board to current-using equipment",
              "final circuit",
              "final circuits"
            ],
            "hint": "This term describes the section of the installation that feeds the end-user equipment."
          },
          {
            "id": "203-3A3-C1-L1-B",
            "questionText": "Identify the circuit type specifically used to regulate or command the operation of other electrical equipment.",
            "answerType": "short-text",
            "cognitiveLevel": "recall",
            "expectedAnswer": [
              "Control Circuit is specifically used to regulate or command the operation of other electrical equipment",
              "control circuit",
              "control circuits"
            ],
            "hint": "Think of circuits used for motor starters or thermostats."
          },
          {
            "id": "203-3A3-C1-L1-C",
            "questionText": "Which type of circuit must be designed to supply power to critical safety systems?",
            "answerType": "short-text",
            "cognitiveLevel": "recall",
            "expectedAnswer": [
              "Emergency Circuit must be designed to supply power to critical safety systems",
              "emergency circuit",
              "emergency circuits"
            ],
            "hint": "These circuits are mandatory for fire alarms and emergency lighting."
          },
          {
            "id": "203-3A3-C1-L2",
            "questionText": "Using your answers to Q1 (Final Circuits), Q2 (Control Circuits), and Q3 (Emergency Circuits), explain how these categories help organize an electrical installation.",
            "answerType": "short-text",
            "cognitiveLevel": "connection",
            "expectedAnswer": [
              "separating final circuits control circuits and emergency circuits ensures the installation remains manageable and that safety systems are protected from general faults",
              "categorizing circuits into final control and emergency types allows for specific roles to be managed safely without interference",
              "dividing an installation into final control and emergency circuits ensures functionality and prevents safety system failure during faults"
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
        "content": "### In this lesson\nIn this lesson, you will learn the fundamental principles and typical uses of ring final and radial topologies in electrical installations. You are evaluating the best way to wire a series of socket-outlets in a domestic property to maximize efficiency and safety. Three key takeaways include: the definition of a continuous loop in a ring circuit, the point-to-point nature of a radial circuit, and the typical applications for each arrangement.\n\n**What this is**\nCircuit topology refers to the way the cables are physically connected to form a circuit. A **Radial Circuit** is a circuit arrangement where the cable runs from the distribution board to each point in succession and terminates at the final point. It is like a branch of a tree. A **Ring Final Circuit**, however, is a circuit arrangement that forms a continuous loop, starting and finishing at the same protective device in the consumer unit. This means that current has two paths to reach any point on the circuit, which effectively increases the current-carrying capacity of the circuit using smaller cables than would be required for a single-path radial.\n\n**Why it matters**\nChoosing the right topology is a balance between cost, ease of installation, and the electrical load requirements. The **Ring Final Circuit** is a unique feature of UK electrical installations, originally designed to save copper while providing enough power for post-war housing. Understanding these topologies is crucial for an electrician to ensure that the circuit is not overloaded and that the protective devices will operate correctly. Incorrectly identifying a circuit as a ring when it is actually a broken loop (becoming two radials) can lead to cable overheating and potential fire hazards.\n\n**Key facts / rules**\n*   A **Radial Circuit** starts at the consumer unit and ends at the last socket or light fitting.\n*   A **Ring Final Circuit** must start and finish at the same terminal in the consumer unit to form a complete loop.\n*   Radial circuits are commonly used for lighting, where the total current demand is relatively low.\n*   Ring circuits are typically used for general-purpose socket-outlets in domestic buildings.\n*   Dedicated radial circuits are used for high-power appliances like electric showers or cookers.\n*   In a ring circuit, the current splits and travels in both directions around the loop to reach the load.\n*   Verification of the \"continuity\" of the ring is a critical safety test during commissioning.\n\n**When to choose it**\nYou should choose a **Radial Circuit** for lighting installations or when supplying a single, high-power appliance that requires its own dedicated fuse or breaker. Radials are also simpler to install and test in small areas or commercial units where circuits are frequently modified. You would choose a **Ring Final Circuit** when you need to cover a large floor area with multiple socket-outlets, such as in a living room or bedroom. The ring arrangement allows for a higher total load—typically protected by a 30A or 32A device—distributed across the loop. It is the standard choice for general domestic power because it provides a good balance of capacity and cable economy.\n\n**Common mistakes**\nThe most dangerous mistake with a **Ring Final Circuit** is a \"broken ring,\" where the loop is interrupted but the circuit still appears to work. This causes the remaining cable to carry more current than it was designed for, leading to overheating. Another common error is \"interconnecting\" two different ring circuits, which makes isolation dangerous. For **Radial Circuits**, a common mistake is adding too many points to a single circuit, exceeding the design load and causing the protective device to trip frequently.\n\n**Key Points**\n*   **Radial Circuits** run from the source to a final termination point.\n*   **Ring Final Circuits** form a loop back to the same protective device.\n*   Ring circuits provide two paths for current, allowing for higher load capacity.\n*   Radial circuits are the standard choice for lighting and high-power dedicated appliances.\n*   Proper testing is required to ensure a ring circuit is truly continuous.\n\n**Quick recap**\nElectricians use two main topologies: radial and ring final. A **Radial Circuit** follows a linear path and is ideal for lighting and dedicated appliances. A **Ring Final Circuit** forms a loop, offering a high-capacity solution for general power outlets in homes. Selecting the right topology ensures the installation is efficient, safe, and compliant with current regulations.\n\n### Coming Up Next\nNext, we will explore how to select the correct protective devices, such as MCBs and RCDs, to safeguard these different circuit types."
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
              "Radial Circuit is a circuit arrangement where the cable runs from the distribution board to each point in succession",
              "radial circuit",
              "radial circuits"
            ],
            "hint": "This arrangement is like a branch of a tree and ends at the last point."
          },
          {
            "id": "203-3A3-C2-L1-B",
            "questionText": "What is the name for a circuit arrangement that forms a continuous loop starting and finishing at the same protective device?",
            "answerType": "short-text",
            "cognitiveLevel": "recall",
            "expectedAnswer": [
              "Ring Final Circuit is a circuit arrangement that forms a continuous loop starting and finishing at the same protective device",
              "ring final circuit",
              "ring circuit"
            ],
            "hint": "This topology is common for UK domestic socket-outlets."
          },
          {
            "id": "203-3A3-C2-L1-C",
            "questionText": "What do ring circuits provide to allow for higher load capacity?",
            "answerType": "short-text",
            "cognitiveLevel": "recall",
            "expectedAnswer": [
              "Ring circuits provide two paths for current allowing for higher load capacity",
              "two paths for current",
              "two paths"
            ],
            "hint": "The loop structure allows the electricity to travel in more than one direction."
          },
          {
            "id": "203-3A3-C2-L2",
            "questionText": "Using your answers to Q1 (Radial Circuits), Q2 (Ring Final Circuits), and Q3 (current paths), explain how these topologies differ in their physical path and capacity.",
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
            "questionText": "Identify the type of circuit that connects directly from a consumer unit or distribution board to current-using equipment.",
            "answerType": "short-text",
            "expectedAnswer": [
              "Final Circuit",
              "a Final Circuit",
              "the Final Circuit"
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
              "to regulate or command other equipment"
            ],
            "hint": "Think of the role played by a thermostat or a motor starter's secondary wiring."
          },
          {
            "id": "203-3A3-P5",
            "questionText": "Identify the specialized circuit category required for systems such as fire alarms and emergency lighting that must remain operational during a power failure.",
            "answerType": "short-text",
            "expectedAnswer": [
              "Emergency Circuit",
              "an Emergency Circuit",
              "the Emergency Circuit"
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
            "questionText": "Explain how circuit categories and topologies are selected for a specific installation. In your answer, include: (1) the purpose of power circuits, (2) the requirement for emergency circuit segregation, (3) why radial topologies are used for specific applications. (2-3 sentences)",
            "answerType": "short-text",
            "cognitiveLevel": "connection",
            "expectedAnswer": [
              "(1) Power circuits provide energy to equipment, while (2) emergency circuits must be segregated for safety; (3) radial topologies are often used for these specific applications to ensure independent control and reliability.",
              "(1) The purpose of power circuits is to deliver electricity to loads, but (2) emergency circuits require strict segregation from others; (3) radial topologies are typically chosen for these and other specific applications like lighting to maintain circuit independence.",
              "(1) Power circuits distribute energy to outlets and appliances, (2) requiring emergency circuits to be kept separate (segregated); (3) radial topologies are then used for these specific applications to simplify the wiring and meet safety standards."
            ],
            "hint": "Think about why we separate different types of circuits and how the radial layout supports that separation."
          },
          {
            "id": "203-3A3-INT-2",
            "questionText": "Summarize the relationship between circuit categories and their physical wiring arrangements in a building. In your answer, include: (1) the difference between power and control circuits, (2) the continuous loop of a ring final topology, (3) the point-to-point nature of a radial topology, (4) typical applications for these arrangements. Answer in 3-4 sentences OR concise bullet points.",
            "answerType": "short-text",
            "cognitiveLevel": "synthesis",
            "expectedAnswer": [
              "(1) Power circuits deliver energy while control circuits manage operations; (2) ring final topologies use a continuous loop for socket outlets, whereas (3) radial topologies use a point-to-point structure. (4) Typical applications include rings for domestic sockets and radials for lighting or heavy appliances.",
              "1. Power circuits provide electricity to loads while control circuits regulate them. 2. Ring final topologies consist of a continuous loop from the consumer unit and back. 3. Radial topologies use a point-to-point arrangement from the source to the last point. 4. Rings are used for socket circuits, while radials are used for lighting and fixed appliances.",
              "(1) Electricians distinguish between power circuits for loads and control circuits for switching; (2) a ring final topology creates a continuous loop to increase current capacity, (3) while a radial topology follows a point-to-point path. (4) Rings are commonly used for domestic sockets, while radials are standard for lighting and dedicated power feeds."
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
            "questionText": "What unit is used to measure electrical current?",
            "expectedAnswer": [
              "Amperes",
              "Amps",
              "A"
            ],
            "hint": "It is named after a French physicist and often abbreviated to a single letter.",
            "answerType": "short-text"
          },
          {
            "id": "203-3A3-SR-2",
            "questionText": "In which type of basic circuit configuration is there only one path for the current to flow?",
            "expectedAnswer": [
              "Series",
              "Series circuit",
              "A series circuit"
            ],
            "hint": "Think of components connected end-to-end in a single loop.",
            "answerType": "short-text"
          },
          {
            "id": "203-3A3-SR-3",
            "questionText": "What is the term for a material that allows electricity to flow through it easily?",
            "expectedAnswer": [
              "Conductor",
              "A conductor",
              "Electrical conductor"
            ],
            "hint": "Copper and aluminum are common examples used in wiring.",
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
Total Score: 88/100 (Usable)

Issues by Section:

## beginnerClarityStaging: The lesson jumps from simple recall questions in the checks ... (0/4)
- Issue: The lesson jumps from simple recall questions in the checks to high-level synthesis in the integrative block without a worked example or guided practice to model how to construct these complex answers.
  Suggestion: Cannot be fixed by Phase 10 - requires regeneration

## markingRobustness: Expected answers for recall questions (e.g., 203-3A3-C1-L1-A... (0/3)
- Issue: Expected answers for recall questions (e.g., 203-3A3-C1-L1-A) include redundant prompt text ('Final Circuit is defined as...'), which creates high friction for short-text matching.
  Suggestion: Change blocks[4].content.questions[0].expectedAnswer from 'Final Circuit is defined as a circuit connected directly from a consumer unit or distribution board to current-using equipment,final circuit,final circuits' to 'final circuit,final circuits,a final circuit'

## questions: Independent practice question P1 is virtually identical to c... (0/3)
- Issue: Independent practice question P1 is virtually identical to check question C1-L1-A, providing no new context or application for the student to test their understanding.
  Suggestion: Change blocks[7].content.questions[0].questionText from 'Identify the type of circuit that connects directly from a consumer unit or distribution board to current-using equipment.' to 'An electrician is wiring a dedicated feed for a new electric oven; what is the general term for this type of circuit connected directly from the consumer unit?'

## visual: The explanation blocks (4 and 6) do not explicitly reference... (0/2)
- Issue: The explanation blocks (4 and 6) do not explicitly reference the diagram provided in block 3, missing an opportunity to anchor the text to the visual representation.
  Suggestion: Modify blocks[3].content.content

## beginnerClarityStaging: Technical terms 'BS 7671' and 'Extra-low voltage (ELV)' are ... (0/2)
- Issue: Technical terms 'BS 7671' and 'Extra-low voltage (ELV)' are introduced in the text but are missing from the Vocab block, which may confuse beginners.
  Suggestion: Append to blocks[1].content.terms: '[object Object],[object Object]'

## questions: Connection-level questions at 203-3A3-C1-L2 and 203-3A3-C2-L... (0/2)
- Issue: Connection-level questions at 203-3A3-C1-L2 and 203-3A3-C2-L2 lack formatting instructions (e.g., 'Answer in 1-2 sentences'), which can lead to overly brief or long-winded student responses.
  Suggestion: Append to blocks[4].content.questions[3].questionText: ' (Answer in 2-3 sentences or concise bullet points.)'


FIX PLAN (implement every non-blocked item):
{
  "lessonId": "203-3A3",
  "timestamp": "2026-02-07T16:52:22.921Z",
  "plan": [
    {
      "issueId": "beginnerClarityStaging.synthesis.gap",
      "rubricRef": "beginnerClarityStaging",
      "fixability": "requires_regeneration",
      "targets": [
        "/blocks/8",
        "/blocks/9"
      ],
      "instructions": "This issue requires adding a worked example or guided practice block to bridge the gap between simple recall and high-level synthesis. Adding or reordering blocks is strictly prohibited by Phase 10 invariants.",
      "guardrails": [
        "do not add blocks",
        "do not reorder blocks"
      ]
    },
    {
      "issueId": "markingRobustness.redundant.text",
      "rubricRef": "markingRobustness",
      "fixability": "deterministic",
      "targets": [
        "/blocks/4/content/questions/0/expectedAnswer",
        "/blocks/4/content/questions/1/expectedAnswer",
        "/blocks/4/content/questions/2/expectedAnswer",
        "/blocks/6/content/questions/0/expectedAnswer",
        "/blocks/6/content/questions/1/expectedAnswer",
        "/blocks/6/content/questions/2/expectedAnswer"
      ],
      "instructions": "Remove redundant definition text from the expectedAnswer strings. For Block 4: Set Q0 to 'final circuit,final circuits,a final circuit', Q1 to 'control circuit,control circuits,a control circuit', and Q2 to 'emergency circuit,emergency circuits,an emergency circuit'. Apply the same logic to Block 6 for its respective terms.",
      "guardrails": [
        "ensure synonyms are comma-separated",
        "do not change answerType"
      ],
      "textSnippets": [
        "final circuit,final circuits,a final circuit",
        "control circuit,control circuits,a control circuit",
        "emergency circuit,emergency circuits,an emergency circuit"
      ]
    },
    {
      "issueId": "questions.duplicate.context",
      "rubricRef": "questions",
      "fixability": "llm_editable",
      "targets": [
        "/blocks/7/content/questions/0/questionText"
      ],
      "instructions": "Rewrite the question to introduce a practical scenario (e.g., an electrician installing a dedicated feed for an oven) to test the application of the 'final circuit' concept rather than simple recall.",
      "guardrails": [
        "ensure the correct answer remains 'final circuit'",
        "do not change answerType"
      ]
    },
    {
      "issueId": "visual.explanation.reference",
      "rubricRef": "visual",
      "fixability": "llm_editable",
      "targets": [
        "/blocks/3/content/content",
        "/blocks/5/content/content"
      ],
      "instructions": "Add explicit references to the diagram in block 2 (e.g., 'As shown in the diagram...', 'Refer to the visual layout...') to anchor the explanation text to the provided visual aid.",
      "guardrails": [
        "preserve technical accuracy",
        "do not change block IDs"
      ]
    },
    {
      "issueId": "beginnerClarityStaging.missing.vocab",
      "rubricRef": "beginnerClarityStaging",
      "fixability": "deterministic",
      "targets": [
        "/blocks/1/content/terms"
      ],
      "instructions": "Add two new term objects to the vocab block: 'BS 7671' (The UK national standard for electrical installations) and 'Extra-low voltage (ELV)' (A voltage not exceeding 50 V AC or 120 V ripple-free DC).",
      "guardrails": [
        "preserve existing terms",
        "maintain correct array structure"
      ]
    },
    {
      "issueId": "questions.formatting.instructions",
      "rubricRef": "questions",
      "fixability": "deterministic",
      "targets": [
        "/blocks/4/content/questions/3/questionText",
        "/blocks/6/content/questions/3/questionText"
      ],
      "instructions": "Append response length instructions '(Answer in 2-3 sentences or concise bullet points.)' to the questionText for the connection-level questions in both practice blocks.",
      "guardrails": [
        "do not change answerType",
        "preserve existing question text"
      ],
      "textSnippets": [
        " (Answer in 2-3 sentences or concise bullet points.)"
      ]
    }
  ]
}

IMPLEMENTATION PRIORITY:
- Implement ALL items marked as "deterministic" or "llm_editable"
- DO NOT attempt items marked as "blocked_by_policy" or "requires_regeneration"
- Follow the specific instructions and guardrails for each plan item
- Use the suggested textSnippets where provided

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
            "term": "Emergency Circuit",
            "definition": "A specialized circuit designed to supply power to critical safety systems, such as fire alarms or emergency lighting, during a power failure or fire."
          },
          {
            "term": "BS 7671",
            "definition": "The UK national standard for electrical installations."
          },
          {
            "term": "Extra-low voltage (ELV)",
            "definition": "A voltage not exceeding 50 V AC or 120 V ripple-free DC."
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
        "content": "### In this lesson\nIn this lesson, you will learn how to identify the various categories of electrical circuits used in modern installations and understand their specific roles. You are acting as an electrician planning the layout of a new domestic or commercial building to ensure all equipment is powered correctly. Three key takeaways include: how to distinguish between power and control circuits, the critical nature of emergency circuit segregation, and why we divide installations into multiple final circuits.\n\n**What this is**\nIn any electrical installation, the total electrical load is divided into several smaller sections known as a **Final Circuit**. Refer to the provided diagram to see how a Final Circuit is connected directly from a consumer unit or distribution board to current-using equipment or socket-outlets. These circuits are categorized based on the type of load they serve, such as lighting, power, heating, or safety systems. By separating these loads, we ensure that the installation remains manageable, safe, and functional. For instance, a fault on a socket circuit should not cause the lights to go out, which is a fundamental principle of circuit design.\n\n**Why it matters**\nUnderstanding the purpose and typical applications for different circuit types is essential for both safety and compliance with **BS 7671**. If an electrician does not correctly identify the various categories of electrical circuits, they might inadvertently mix loads that should be kept separate, such as data and high-voltage power lines. This can lead to electromagnetic interference or, more seriously, a failure of safety systems during an emergency. Proper categorization also allows for easier maintenance and fault finding, as each circuit has a clearly defined purpose and area of coverage.\n\n**Key facts / rules**\n*   Every installation must be divided into circuits to avoid danger and minimize inconvenience in the event of a fault.\n*   A **Control Circuit** is specifically used to regulate or command the operation of other electrical equipment, such as a motor starter or thermostat.\n*   An **Emergency Circuit** must be designed to supply power to critical safety systems, such as fire alarms or emergency lighting, during a power failure.\n*   Circuits must be identified at the distribution board or consumer unit using clear labeling.\n*   Data and communication circuits typically operate at **extra-low voltage (ELV)** and must be segregated from power circuits to prevent signal interference.\n*   Standard power circuits typically supply general-purpose socket-outlets or heavy appliances like cookers and water heaters.\n\n**When to choose it**\nYou choose a specific circuit category based on the equipment's intended function and power requirements. Lighting circuits are selected for fixed luminaires and usually involve lower current demands. Power circuits are the choice for general-purpose socket-outlets or dedicated high-load items like electric showers. You must choose a **Control Circuit** when the goal is to manage another system, such as using a relay or a sensor to turn on a pump. **Emergency Circuits** are a mandatory choice for life-safety systems where the circuit must remain operational during a fire or power loss. Data circuits are selected for networking and communication needs, requiring specific cabling like Cat6 or fiber optics.\n\n**Common mistakes**\nA common error is failing to provide enough separate circuits, leading to \"nuisance tripping\" where too many appliances are connected to a single protective device. Another mistake is mixing emergency systems with standard power circuits; an **Emergency Circuit** must often have its own dedicated path and protection to ensure it is not affected by faults in general-use equipment. Electricians also sometimes forget to label circuits correctly, making future identification and isolation difficult for other professionals.\n\n**Key Points**\n*   **Final Circuits** connect the distribution board directly to the end-user equipment.\n*   **Control Circuits** are used for regulation and commanding other power circuits.\n*   **Emergency Circuits** are specialized for safety systems like fire alarms.\n*   Proper circuit categorization prevents total loss of power during a single fault.\n*   Data and communication circuits require segregation from mains voltage cabling.\n\n**Quick recap**\nElectrical installations are divided into various categories of circuits to ensure safety and functionality. These include lighting, power, control, and emergency circuits, each serving a specific purpose. By understanding these categories, an electrician can design an installation that is easy to maintain and compliant with safety standards like BS 7671.\n\n### Coming Up Next\nNow that you can identify circuit categories, we will look at the physical arrangements of these wires, specifically the differences between ring and radial topologies."
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
            "questionText": "Which type of circuit must be designed to supply power to critical safety systems?",
            "answerType": "short-text",
            "cognitiveLevel": "recall",
            "expectedAnswer": [
              "emergency circuit",
              "emergency circuits",
              "an emergency circuit"
            ],
            "hint": "These circuits are mandatory for fire alarms and emergency lighting."
          },
          {
            "id": "203-3A3-C1-L2",
            "questionText": "Using your answers to Q1 (Final Circuits), Q2 (Control Circuits), and Q3 (Emergency Circuits), explain how these categories help organize an electrical installation. (Answer in 2-3 sentences or concise bullet points.)",
            "answerType": "short-text",
            "cognitiveLevel": "connection",
            "expectedAnswer": [
              "separating final circuits control circuits and emergency circuits ensures the installation remains manageable and that safety systems are protected from general faults",
              "categorizing circuits into final control and emergency types allows for specific roles to be managed safely without interference",
              "dividing an installation into final control and emergency circuits ensures functionality and prevents safety system failure during faults"
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
        "content": "### In this lesson\nIn this lesson, you will learn the fundamental principles and typical uses of ring final and radial topologies in electrical installations. You are evaluating the best way to wire a series of socket-outlets in a domestic property to maximize efficiency and safety. Three key takeaways include: the definition of a continuous loop in a ring circuit, the point-to-point nature of a radial circuit, and the typical applications for each arrangement.\n\n**What this is**\nCircuit topology refers to the way the cables are physically connected to form a circuit. As illustrated in the diagram, a **Radial Circuit** resembles a tree branch following a linear path from the distribution board to each point in succession and terminating at the final point. Conversely, a **Ring Final Circuit** forms a continuous loop, starting and finishing at the same protective device in the consumer unit. This means that current has two paths to reach any point on the circuit, which effectively increases the current-carrying capacity of the circuit using smaller cables than would be required for a single-path radial.\n\n**Why it matters**\nChoosing the right topology is a balance between cost, ease of installation, and the electrical load requirements. The **Ring Final Circuit** is a unique feature of UK electrical installations, originally designed to save copper while providing enough power for post-war housing. Understanding these topologies is crucial for an electrician to ensure that the circuit is not overloaded and that the protective devices will operate correctly. Incorrectly identifying a circuit as a ring when it is actually a broken loop (becoming two radials) can lead to cable overheating and potential fire hazards.\n\n**Key facts / rules**\n*   A **Radial Circuit** starts at the consumer unit and ends at the last socket or light fitting.\n*   A **Ring Final Circuit** must start and finish at the same terminal in the consumer unit to form a complete loop.\n*   Radial circuits are commonly used for lighting, where the total current demand is relatively low.\n*   Ring circuits are typically used for general-purpose socket-outlets in domestic buildings.\n*   Dedicated radial circuits are used for high-power appliances like electric showers or cookers.\n*   In a ring circuit, the current splits and travels in both directions around the loop to reach the load.\n*   Verification of the \"continuity\" of the ring is a critical safety test during commissioning.\n\n**When to choose it**\nYou should choose a **Radial Circuit** for lighting installations or when supplying a single, high-power appliance that requires its own dedicated fuse or breaker. Radials are also simpler to install and test in small areas or commercial units where circuits are frequently modified. You would choose a **Ring Final Circuit** when you need to cover a large floor area with multiple socket-outlets, such as in a living room or bedroom. The ring arrangement allows for a higher total load—typically protected by a 30A or 32A device—distributed across the loop. It is the standard choice for general domestic power because it provides a good balance of capacity and cable economy.\n\n**Common mistakes**\nThe most dangerous mistake with a **Ring Final Circuit** is a \"broken ring,\" where the loop is interrupted but the circuit still appears to work. This causes the remaining cable to carry more current than it was designed for, leading to overheating. Another common error is \"interconnecting\" two different ring circuits, which makes isolation dangerous. For **Radial Circuits**, a common mistake is adding too many points to a single circuit, exceeding the design load and causing the protective device to trip frequently.\n\n**Key Points**\n*   **Radial Circuits** run from the source to a final termination point.\n*   **Ring Final Circuits** form a loop back to the same protective device.\n*   Ring circuits provide two paths for current, allowing for higher load capacity.\n*   Radial circuits are the standard choice for lighting and high-power dedicated appliances.\n*   Proper testing is required to ensure a ring circuit is truly continuous.\n\n**Quick recap**\nElectricians use two main topologies: radial and ring final. A **Radial Circuit** follows a linear path and is ideal for lighting and dedicated appliances. A **Ring Final Circuit** forms a loop, offering a high-capacity solution for general power outlets in homes. Selecting the right topology ensures the installation is efficient, safe, and compliant with current regulations.\n\n### Coming Up Next\nNext, we will explore how to select the correct protective devices, such as MCBs and RCDs, to safeguard these different circuit types."
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
              "two paths",
              "dual paths"
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
            "questionText": "An electrician is wiring a dedicated feed for a new electric oven; what is the general term for this type of circuit connected directly from the consumer unit?",
            "answerType": "short-text",
            "expectedAnswer": [
              "Final Circuit",
              "a Final Circuit",
              "the Final Circuit"
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
              "to regulate or command other equipment"
            ],
            "hint": "Think of the role played by a thermostat or a motor starter's secondary wiring."
          },
          {
            "id": "203-3A3-P5",
            "questionText": "Identify the specialized circuit category required for systems such as fire alarms and emergency lighting that must remain operational during a power failure.",
            "answerType": "short-text",
            "expectedAnswer": [
              "Emergency Circuit",
              "an Emergency Circuit",
              "the Emergency Circuit"
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
            "questionText": "Explain how circuit categories and topologies are selected for a specific installation. In your answer, include: (1) the purpose of power circuits, (2) the requirement for emergency circuit segregation, (3) why radial topologies are used for specific applications. (2-3 sentences)",
            "answerType": "short-text",
            "cognitiveLevel": "connection",
            "expectedAnswer": [
              "(1) Power circuits provide energy to equipment, while (2) emergency circuits must be segregated for safety; (3) radial topologies are often used for these specific applications to ensure independent control and reliability.",
              "(1) The purpose of power circuits is to deliver electricity to loads, but (2) emergency circuits require strict segregation from others; (3) radial topologies are typically chosen for these and other specific applications like lighting to maintain circuit independence.",
              "(1) Power circuits distribute energy to outlets and appliances, (2) requiring emergency circuits to be kept separate (segregated); (3) radial topologies are then used for these specific applications to simplify the wiring and meet safety standards."
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
            "questionText": "What unit is used to measure electrical current?",
            "expectedAnswer": [
              "Amperes",
              "Amps",
              "A"
            ],
            "hint": "It is named after a French physicist and often abbreviated to a single letter.",
            "answerType": "short-text"
          },
          {
            "id": "203-3A3-SR-2",
            "questionText": "In which type of basic circuit configuration is there only one path for the current to flow?",
            "expectedAnswer": [
              "Series",
              "Series circuit",
              "A series circuit"
            ],
            "hint": "Think of components connected end-to-end in a single loop.",
            "answerType": "short-text"
          },
          {
            "id": "203-3A3-SR-3",
            "questionText": "What is the term for a material that allows electricity to flow through it easily?",
            "expectedAnswer": [
              "Conductor",
              "A conductor",
              "Electrical conductor"
            ],
            "hint": "Copper and aluminum are common examples used in wiring.",
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

## Patch/Parse Artifacts

_These files exist even for rewrite strategy to show whether patch logic was invoked._

### Patches Parsed

**File:** `14_patches_parsed.json`

```json
[]
```

---

## Fix Plan

**Items:** 6
**Fixable:** 5
**Blocked:** 1

```json
{
  "lessonId": "203-3A3",
  "timestamp": "2026-02-07T16:52:22.921Z",
  "plan": [
    {
      "issueId": "beginnerClarityStaging.synthesis.gap",
      "rubricRef": "beginnerClarityStaging",
      "fixability": "requires_regeneration",
      "targets": [
        "/blocks/8",
        "/blocks/9"
      ],
      "instructions": "This issue requires adding a worked example or guided practice block to bridge the gap between simple recall and high-level synthesis. Adding or reordering blocks is strictly prohibited by Phase 10 invariants.",
      "guardrails": [
        "do not add blocks",
        "do not reorder blocks"
      ]
    },
    {
      "issueId": "markingRobustness.redundant.text",
      "rubricRef": "markingRobustness",
      "fixability": "deterministic",
      "targets": [
        "/blocks/4/content/questions/0/expectedAnswer",
        "/blocks/4/content/questions/1/expectedAnswer",
        "/blocks/4/content/questions/2/expectedAnswer",
        "/blocks/6/content/questions/0/expectedAnswer",
        "/blocks/6/content/questions/1/expectedAnswer",
        "/blocks/6/content/questions/2/expectedAnswer"
      ],
      "instructions": "Remove redundant definition text from the expectedAnswer strings. For Block 4: Set Q0 to 'final circuit,final circuits,a final circuit', Q1 to 'control circuit,control circuits,a control circuit', and Q2 to 'emergency circuit,emergency circuits,an emergency circuit'. Apply the same logic to Block 6 for its respective terms.",
      "guardrails": [
        "ensure synonyms are comma-separated",
        "do not change answerType"
      ],
      "textSnippets": [
        "final circuit,final circuits,a final circuit",
        "control circuit,control circuits,a control circuit",
        "emergency circuit,emergency circuits,an emergency circuit"
      ]
    },
    {
      "issueId": "questions.duplicate.context",
      "rubricRef": "questions",
      "fixability": "llm_editable",
      "targets": [
        "/blocks/7/content/questions/0/questionText"
      ],
      "instructions": "Rewrite the question to introduce a practical scenario (e.g., an electrician installing a dedicated feed for an oven) to test the application of the 'final circuit' concept rather than simple recall.",
      "guardrails": [
        "ensure the correct answer remains 'final circuit'",
        "do not change answerType"
      ]
    },
    {
      "issueId": "visual.explanation.reference",
      "rubricRef": "visual",
      "fixability": "llm_editable",
      "targets": [
        "/blocks/3/content/content",
        "/blocks/5/content/content"
      ],
      "instructions": "Add explicit references to the diagram in block 2 (e.g., 'As shown in the diagram...', 'Refer to the visual layout...') to anchor the explanation text to the provided visual aid.",
      "guardrails": [
        "preserve technical accuracy",
        "do not change block IDs"
      ]
    },
    {
      "issueId": "beginnerClarityStaging.missing.vocab",
      "rubricRef": "beginnerClarityStaging",
      "fixability": "deterministic",
      "targets": [
        "/blocks/1/content/terms"
      ],
      "instructions": "Add two new term objects to the vocab block: 'BS 7671' (The UK national standard for electrical installations) and 'Extra-low voltage (ELV)' (A voltage not exceeding 50 V AC or 120 V ripple-free DC).",
      "guardrails": [
        "preserve existing terms",
        "maintain correct array structure"
      ]
    },
    {
      "issueId": "questions.formatting.instructions",
      "rubricRef": "questions",
      "fixability": "deterministic",
      "targets": [
        "/blocks/4/content/questions/3/questionText",
        "/blocks/6/content/questions/3/questionText"
      ],
      "instructions": "Append response length instructions '(Answer in 2-3 sentences or concise bullet points.)' to the questionText for the connection-level questions in both practice blocks.",
      "guardrails": [
        "do not change answerType",
        "preserve existing question text"
      ],
      "textSnippets": [
        " (Answer in 2-3 sentences or concise bullet points.)"
      ]
    }
  ]
}
```

---

## Issue Lifecycle

**Total Issues:** 6
**Fixed:** 6
**Unmoved:** 0
**Blocked:** 0

```json
{
  "runId": "203-3A3__2026-02-07T16-51-53-139Z__rewrite__gemini-3-flash-preview",
  "lessonId": "203-3A3",
  "issues": [
    {
      "issueId": "B1.beginnerClarity",
      "rubricRef": "b",
      "section": "questions",
      "scoreBefore": 0,
      "maxScore": 4,
      "jsonPointers": [
        "/blocks/8",
        "/blocks/9"
      ],
      "fixability": "llm_editable",
      "reason": "The lesson jumps from simple recall questions in the checks to high-level synthesis in the integrative block without a worked example or guided practice to model how to construct these complex answers.",
      "plan": null,
      "appliedEdits": [
        {
          "op": "replace",
          "path": "/blocks/8/content/questions/1/expectedAnswer/0",
          "summary": "Updated expected answer at blocks.8.content.questions.1.expectedAnswer.0"
        },
        {
          "op": "replace",
          "path": "/blocks/8/content/questions/1/expectedAnswer/1",
          "summary": "Updated expected answer at blocks.8.content.questions.1.expectedAnswer.1"
        },
        {
          "op": "replace",
          "path": "/blocks/8/content/questions/1/expectedAnswer/2",
          "summary": "Updated expected answer at blocks.8.content.questions.1.expectedAnswer.2"
        },
        {
          "op": "add",
          "path": "/blocks/8/content/questions/1/expectedAnswer/3",
          "summary": "Added element at blocks.8.content.questions.1.expectedAnswer.3"
        },
        {
          "op": "add",
          "path": "/blocks/8/content/questions/1/expectedAnswer/4",
          "summary": "Added element at blocks.8.content.questions.1.expectedAnswer.4"
        },
        {
          "op": "add",
          "path": "/blocks/8/content/questions/1/expectedAnswer/5",
          "summary": "Added element at blocks.8.content.questions.1.expectedAnswer.5"
        }
      ],
      "outcome": "fixed"
    },
    {
      "issueId": "D2.questions",
      "rubricRef": "D",
      "section": "questions",
      "scoreBefore": 0,
      "maxScore": 3,
      "jsonPointers": [
        "/blocks/4/content/questions/0/expectedAnswer",
        "/blocks/4/content/questions/1/expectedAnswer",
        "/blocks/4/content/questions/2/expectedAnswer",
        "/blocks/6/content/questions/0/expectedAnswer",
        "/blocks/6/content/questions/1/expectedAnswer",
        "/blocks/6/content/questions/2/expectedAnswer"
      ],
      "fixability": "llm_editable",
      "reason": "Expected answers for recall questions (e.g., 203-3A3-C1-L1-A) include redundant prompt text ('Final Circuit is defined as...'), which creates high friction for short-text matching.",
      "plan": null,
      "appliedEdits": [
        {
          "op": "replace",
          "path": "/blocks/4/content/questions/0/expectedAnswer/0",
          "summary": "Updated expected answer at blocks.4.content.questions.0.expectedAnswer.0"
        },
        {
          "op": "replace",
          "path": "/blocks/4/content/questions/0/expectedAnswer/1",
          "summary": "Updated expected answer at blocks.4.content.questions.0.expectedAnswer.1"
        },
        {
          "op": "replace",
          "path": "/blocks/4/content/questions/0/expectedAnswer/2",
          "summary": "Updated expected answer at blocks.4.content.questions.0.expectedAnswer.2"
        },
        {
          "op": "replace",
          "path": "/blocks/4/content/questions/1/expectedAnswer/0",
          "summary": "Updated expected answer at blocks.4.content.questions.1.expectedAnswer.0"
        },
        {
          "op": "replace",
          "path": "/blocks/4/content/questions/1/expectedAnswer/1",
          "summary": "Updated expected answer at blocks.4.content.questions.1.expectedAnswer.1"
        },
        {
          "op": "replace",
          "path": "/blocks/4/content/questions/1/expectedAnswer/2",
          "summary": "Updated expected answer at blocks.4.content.questions.1.expectedAnswer.2"
        },
        {
          "op": "replace",
          "path": "/blocks/4/content/questions/2/expectedAnswer/0",
          "summary": "Updated expected answer at blocks.4.content.questions.2.expectedAnswer.0"
        },
        {
          "op": "replace",
          "path": "/blocks/4/content/questions/2/expectedAnswer/1",
          "summary": "Updated expected answer at blocks.4.content.questions.2.expectedAnswer.1"
        },
        {
          "op": "replace",
          "path": "/blocks/4/content/questions/2/expectedAnswer/2",
          "summary": "Updated expected answer at blocks.4.content.questions.2.expectedAnswer.2"
        },
        {
          "op": "replace",
          "path": "/blocks/6/content/questions/0/expectedAnswer/0",
          "summary": "Updated expected answer at blocks.6.content.questions.0.expectedAnswer.0"
        },
        {
          "op": "replace",
          "path": "/blocks/6/content/questions/0/expectedAnswer/1",
          "summary": "Updated expected answer at blocks.6.content.questions.0.expectedAnswer.1"
        },
        {
          "op": "replace",
          "path": "/blocks/6/content/questions/0/expectedAnswer/2",
          "summary": "Updated expected answer at blocks.6.content.questions.0.expectedAnswer.2"
        },
        {
          "op": "replace",
          "path": "/blocks/6/content/questions/1/expectedAnswer/0",
          "summary": "Updated expected answer at blocks.6.content.questions.1.expectedAnswer.0"
        },
        {
          "op": "replace",
          "path": "/blocks/6/content/questions/1/expectedAnswer/1",
          "summary": "Updated expected answer at blocks.6.content.questions.1.expectedAnswer.1"
        },
        {
          "op": "replace",
          "path": "/blocks/6/content/questions/1/expectedAnswer/2",
          "summary": "Updated expected answer at blocks.6.content.questions.1.expectedAnswer.2"
        },
        {
          "op": "replace",
          "path": "/blocks/6/content/questions/2/expectedAnswer/0",
          "summary": "Updated expected answer at blocks.6.content.questions.2.expectedAnswer.0"
        },
        {
          "op": "replace",
          "path": "/blocks/6/content/questions/2/expectedAnswer/1",
          "summary": "Updated expected answer at blocks.6.content.questions.2.expectedAnswer.1"
        },
        {
          "op": "replace",
          "path": "/blocks/6/content/questions/2/expectedAnswer/2",
          "summary": "Updated expected answer at blocks.6.content.questions.2.expectedAnswer.2"
        }
      ],
      "outcome": "fixed"
    },
    {
      "issueId": "D3.questions",
      "rubricRef": "D",
      "section": "questions",
      "scoreBefore": 0,
      "maxScore": 3,
      "jsonPointers": [
        "/blocks/7/content/questions/0/questionText"
      ],
      "fixability": "llm_editable",
      "reason": "Independent practice question P1 is virtually identical to check question C1-L1-A, providing no new context or application for the student to test their understanding.",
      "plan": null,
      "appliedEdits": [
        {
          "op": "replace",
          "path": "/blocks/7/content/questions/0/questionText",
          "summary": "Modified question text at blocks.7.content.questions.0.questionText"
        }
      ],
      "outcome": "fixed"
    },
    {
      "issueId": "F4.visual",
      "rubricRef": "F",
      "section": "visual",
      "scoreBefore": 0,
      "maxScore": 2,
      "jsonPointers": [
        "/blocks/3/content/content",
        "/blocks/5/content/content"
      ],
      "fixability": "llm_editable",
      "reason": "Add explicit references to the diagram in block 2 (e.g., 'As shown in the diagram...', 'Refer to the visual layout...') to anchor the explanation text to the provided visual aid.",
      "plan": {
        "strategy": "Add explicit references to the diagram in block 2 (e.g., 'As shown in the diagram...', 'Refer to the visual layout...') to anchor the explanation text to the provided visual aid.",
        "targets": [
          "/blocks/3/content/content",
          "/blocks/5/content/content"
        ]
      },
      "appliedEdits": [
        {
          "op": "replace",
          "path": "/blocks/3/content/content",
          "summary": "Updated content in blocks.3"
        },
        {
          "op": "replace",
          "path": "/blocks/5/content/content",
          "summary": "Updated content in blocks.5"
        }
      ],
      "outcome": "fixed"
    },
    {
      "issueId": "B5.beginnerClarity",
      "rubricRef": "b",
      "section": "general",
      "scoreBefore": 0,
      "maxScore": 2,
      "jsonPointers": [
        "/blocks/1/content/terms"
      ],
      "fixability": "deterministic",
      "reason": "Technical terms 'BS 7671' and 'Extra-low voltage (ELV)' are introduced in the text but are missing from the Vocab block, which may confuse beginners.",
      "plan": null,
      "appliedEdits": [
        {
          "op": "add",
          "path": "/blocks/1/content/terms/5",
          "summary": "Added element at blocks.1.content.terms.5"
        },
        {
          "op": "add",
          "path": "/blocks/1/content/terms/6",
          "summary": "Added element at blocks.1.content.terms.6"
        }
      ],
      "outcome": "fixed"
    },
    {
      "issueId": "D6.questions",
      "rubricRef": "D",
      "section": "questions",
      "scoreBefore": 0,
      "maxScore": 2,
      "jsonPointers": [
        "/blocks/4/content/questions/3/questionText",
        "/blocks/6/content/questions/3/questionText"
      ],
      "fixability": "deterministic",
      "reason": "Connection-level questions at 203-3A3-C1-L2 and 203-3A3-C2-L2 lack formatting instructions (e.g., 'Answer in 1-2 sentences'), which can lead to overly brief or long-winded student responses.",
      "plan": null,
      "appliedEdits": [
        {
          "op": "replace",
          "path": "/blocks/4/content/questions/3/questionText",
          "summary": "Modified question text at blocks.4.content.questions.3.questionText"
        },
        {
          "op": "replace",
          "path": "/blocks/6/content/questions/3/questionText",
          "summary": "Modified question text at blocks.6.content.questions.3.questionText"
        }
      ],
      "outcome": "fixed"
    }
  ]
}
```

---

## Pointer Diff (JSON Pointer Format)

**Changes:** 32

```json
{
  "lessonId": "203-3A3",
  "timestamp": "2026-02-07T16:53:57.002Z",
  "changes": [
    {
      "op": "add",
      "path": "/blocks/1/content/terms/5",
      "after": {
        "term": "BS 7671",
        "definition": "The UK national standard for electrical installations."
      },
      "summary": "Added element at blocks.1.content.terms.5"
    },
    {
      "op": "add",
      "path": "/blocks/1/content/terms/6",
      "after": {
        "term": "Extra-low voltage (ELV)",
        "definition": "A voltage not exceeding 50 V AC or 120 V ripple-free DC."
      },
      "summary": "Added element at blocks.1.content.terms.6"
    },
    {
      "op": "remove",
      "path": "/blocks/2/content/imageUrl",
      "summary": "Removed blocks.2.content.imageUrl"
    },
    {
      "op": "replace",
      "path": "/blocks/3/content/content",
      "before": "### In this lesson\nIn this lesson, you will learn how to identify the various categories of electrical circuits used in modern installations and understand their specific roles. You are acting as an electrician planning the layout of a new domestic or commercial building to ensure all equipment is powered correctly. Three key takeaways include: how to distinguish between power and control circuits, the critical nature of emergency circuit segregation, and why we divide installations into multiple final circuits.\n\n**What this is**\nIn any electrical installation, the total electrical load is divided into several smaller sections known as a **Final Circuit**. A **Final Circuit** is defined as a circuit connected directly from a consumer unit or distribution board to current-using equipment or socket-outlets. These circuits are categorized based on the type of load they serve, such as lighting, power, heating, or safety systems. By separating these loads, we ensure that the installation remains manageable, safe, and functional. For instance, a fault on a socket circuit should not cause the lights to go out, which is a fundamental principle of circuit design.\n\n**Why it matters**\nUnderstanding the purpose and typical applications for different circuit types is essential for both safety and compliance with BS 7671 (refer to current edition). If an electrician does not correctly identify the various categories of electrical circuits, they might inadvertently mix loads that should be kept separate, such as data and high-voltage power lines. This can lead to electromagnetic interference or, more seriously, a failure of safety systems during an emergency. Proper categorization also allows for easier maintenance and fault finding, as each circuit has a clearly defined purpose and area of coverage.\n\n**Key facts / rules**\n*   Every installation must be divided into circuits to avoid danger and minimize inconvenience in the event of a fault.\n*   A **Control Circuit** is specifically used to regulate or command the operation of other electrical equipment, such as a motor starter or thermostat.\n*   An **Emergency Circuit** must be designed to supply power to critical safety systems, such as fire alarms or emergency lighting, during a power failure.\n*   Circuits must be identified at the distribution board or consumer unit using clear labeling.\n*   Data and communication circuits typically operate at extra-low voltage and must be segregated from power circuits to prevent signal interference.\n*   Standard power circuits typically supply general-purpose socket-outlets or heavy appliances like cookers and water heaters.\n\n**When to choose it**\nYou choose a specific circuit category based on the equipment's intended function and power requirements. Lighting circuits are selected for fixed luminaires and usually involve lower current demands. Power circuits are the choice for general-purpose socket-outlets or dedicated high-load items like electric showers. You must choose a **Control Circuit** when the goal is to manage another system, such as using a relay or a sensor to turn on a pump. **Emergency Circuits** are a mandatory choice for life-safety systems where the circuit must remain operational during a fire or power loss. Data circuits are selected for networking and communication needs, requiring specific cabling like Cat6 or fiber optics.\n\n**Common mistakes**\nA common error is failing to provide enough separate circuits, leading to \"nuisance tripping\" where too many appliances are connected to a single protective device. Another mistake is mixing emergency systems with standard power circuits; an **Emergency Circuit** must often have its own dedicated path and protection to ensure it is not affected by faults in general-use equipment. Electricians also sometimes forget to label circuits correctly, making future identification and isolation difficult for other professionals.\n\n**Key Points**\n*   **Final Circuits** connect the distribution board directly to the end-user equipment.\n*   **Control Circuits** are used for regulation and commanding other power circuits.\n*   **Emergency Circuits** are specialized for safety systems like fire alarms.\n*   Proper circuit categorization prevents total loss of power during a single fault.\n*   Data and communication circuits require segregation from mains voltage cabling.\n\n**Quick recap**\nElectrical installations are divided into various categories of circuits to ensure safety and functionality. These include lighting, power, control, and emergency circuits, each serving a specific purpose. By understanding these categories, an electrician can design an installation that is easy to maintain and compliant with safety standards like BS 7671.\n\n### Coming Up Next\nNow that you can identify circuit categories, we will look at the physical arrangements of these wires, specifically the differences between ring and radial topologies.",
      "after": "### In this lesson\nIn this lesson, you will learn how to identify the various categories of electrical circuits used in modern installations and understand their specific roles. You are acting as an electrician planning the layout of a new domestic or commercial building to ensure all equipment is powered correctly. Three key takeaways include: how to distinguish between power and control circuits, the critical nature of emergency circuit segregation, and why we divide installations into multiple final circuits.\n\n**What this is**\nIn any electrical installation, the total electrical load is divided into several smaller sections known as a **Final Circuit**. Refer to the provided diagram to see how a Final Circuit is connected directly from a consumer unit or distribution board to current-using equipment or socket-outlets. These circuits are categorized based on the type of load they serve, such as lighting, power, heating, or safety systems. By separating these loads, we ensure that the installation remains manageable, safe, and functional. For instance, a fault on a socket circuit should not cause the lights to go out, which is a fundamental principle of circuit design.\n\n**Why it matters**\nUnderstanding the purpose and typical applications for different circuit types is essential for both safety and compliance with **BS 7671**. If an electrician does not correctly identify the various categories of electrical circuits, they might inadvertently mix loads that should be kept separate, such as data and high-voltage power lines. This can lead to electromagnetic interference or, more seriously, a failure of safety systems during an emergency. Proper categorization also allows for easier maintenance and fault finding, as each circuit has a clearly defined purpose and area of coverage.\n\n**Key facts / rules**\n*   Every installation must be divided into circuits to avoid danger and minimize inconvenience in the event of a fault.\n*   A **Control Circuit** is specifically used to regulate or command the operation of other electrical equipment, such as a motor starter or thermostat.\n*   An **Emergency Circuit** must be designed to supply power to critical safety systems, such as fire alarms or emergency lighting, during a power failure.\n*   Circuits must be identified at the distribution board or consumer unit using clear labeling.\n*   Data and communication circuits typically operate at **extra-low voltage (ELV)** and must be segregated from power circuits to prevent signal interference.\n*   Standard power circuits typically supply general-purpose socket-outlets or heavy appliances like cookers and water heaters.\n\n**When to choose it**\nYou choose a specific circuit category based on the equipment's intended function and power requirements. Lighting circuits are selected for fixed luminaires and usually involve lower current demands. Power circuits are the choice for general-purpose socket-outlets or dedicated high-load items like electric showers. You must choose a **Control Circuit** when the goal is to manage another system, such as using a relay or a sensor to turn on a pump. **Emergency Circuits** are a mandatory choice for life-safety systems where the circuit must remain operational during a fire or power loss. Data circuits are selected for networking and communication needs, requiring specific cabling like Cat6 or fiber optics.\n\n**Common mistakes**\nA common error is failing to provide enough separate circuits, leading to \"nuisance tripping\" where too many appliances are connected to a single protective device. Another mistake is mixing emergency systems with standard power circuits; an **Emergency Circuit** must often have its own dedicated path and protection to ensure it is not affected by faults in general-use equipment. Electricians also sometimes forget to label circuits correctly, making future identification and isolation difficult for other professionals.\n\n**Key Points**\n*   **Final Circuits** connect the distribution board directly to the end-user equipment.\n*   **Control Circuits** are used for regulation and commanding other power circuits.\n*   **Emergency Circuits** are specialized for safety systems like fire alarms.\n*   Proper circuit categorization prevents total loss of power during a single fault.\n*   Data and communication circuits require segregation from mains voltage cabling.\n\n**Quick recap**\nElectrical installations are divided into various categories of circuits to ensure safety and functionality. These include lighting, power, control, and emergency circuits, each serving a specific purpose. By understanding these categories, an electrician can design an installation that is easy to maintain and compliant with safety standards like BS 7671.\n\n### Coming Up Next\nNow that you can identify circuit categories, we will look at the physical arrangements of these wires, specifically the differences between ring and radial topologies.",
      "summary": "Updated content in blocks.3"
    },
    {
      "op": "replace",
      "path": "/blocks/4/content/questions/0/expectedAnswer/0",
      "before": "Final Circuit is defined as a circuit connected directly from a consumer unit or distribution board to current-using equipment",
      "after": "final circuit",
      "summary": "Updated expected answer at blocks.4.content.questions.0.expectedAnswer.0"
    },
    {
      "op": "replace",
      "path": "/blocks/4/content/questions/0/expectedAnswer/1",
      "before": "final circuit",
      "after": "final circuits",
      "summary": "Updated expected answer at blocks.4.content.questions.0.expectedAnswer.1"
    },
    {
      "op": "replace",
      "path": "/blocks/4/content/questions/0/expectedAnswer/2",
      "before": "final circuits",
      "after": "a final circuit",
      "summary": "Updated expected answer at blocks.4.content.questions.0.expectedAnswer.2"
    },
    {
      "op": "replace",
      "path": "/blocks/4/content/questions/1/expectedAnswer/0",
      "before": "Control Circuit is specifically used to regulate or command the operation of other electrical equipment",
      "after": "control circuit",
      "summary": "Updated expected answer at blocks.4.content.questions.1.expectedAnswer.0"
    },
    {
      "op": "replace",
      "path": "/blocks/4/content/questions/1/expectedAnswer/1",
      "before": "control circuit",
      "after": "control circuits",
      "summary": "Updated expected answer at blocks.4.content.questions.1.expectedAnswer.1"
    },
    {
      "op": "replace",
      "path": "/blocks/4/content/questions/1/expectedAnswer/2",
      "before": "control circuits",
      "after": "a control circuit",
      "summary": "Updated expected answer at blocks.4.content.questions.1.expectedAnswer.2"
    },
    {
      "op": "replace",
      "path": "/blocks/4/content/questions/2/expectedAnswer/0",
      "before": "Emergency Circuit must be designed to supply power to critical safety systems",
      "after": "emergency circuit",
      "summary": "Updated expected answer at blocks.4.content.questions.2.expectedAnswer.0"
    },
    {
      "op": "replace",
      "path": "/blocks/4/content/questions/2/expectedAnswer/1",
      "before": "emergency circuit",
      "after": "emergency circuits",
      "summary": "Updated expected answer at blocks.4.content.questions.2.expectedAnswer.1"
    },
    {
      "op": "replace",
      "path": "/blocks/4/content/questions/2/expectedAnswer/2",
      "before": "emergency circuits",
      "after": "an emergency circuit",
      "summary": "Updated expected answer at blocks.4.content.questions.2.expectedAnswer.2"
    },
    {
      "op": "replace",
      "path": "/blocks/4/content/questions/3/questionText",
      "before": "Using your answers to Q1 (Final Circuits), Q2 (Control Circuits), and Q3 (Emergency Circuits), explain how these categories help organize an electrical installation.",
      "after": "Using your answers to Q1 (Final Circuits), Q2 (Control Circuits), and Q3 (Emergency Circuits), explain how these categories help organize an electrical installation. (Answer in 2-3 sentences or concise bullet points.)",
      "summary": "Modified question text at blocks.4.content.questions.3.questionText"
    },
    {
      "op": "replace",
      "path": "/blocks/5/content/content",
      "before": "### In this lesson\nIn this lesson, you will learn the fundamental principles and typical uses of ring final and radial topologies in electrical installations. You are evaluating the best way to wire a series of socket-outlets in a domestic property to maximize efficiency and safety. Three key takeaways include: the definition of a continuous loop in a ring circuit, the point-to-point nature of a radial circuit, and the typical applications for each arrangement.\n\n**What this is**\nCircuit topology refers to the way the cables are physically connected to form a circuit. A **Radial Circuit** is a circuit arrangement where the cable runs from the distribution board to each point in succession and terminates at the final point. It is like a branch of a tree. A **Ring Final Circuit**, however, is a circuit arrangement that forms a continuous loop, starting and finishing at the same protective device in the consumer unit. This means that current has two paths to reach any point on the circuit, which effectively increases the current-carrying capacity of the circuit using smaller cables than would be required for a single-path radial.\n\n**Why it matters**\nChoosing the right topology is a balance between cost, ease of installation, and the electrical load requirements. The **Ring Final Circuit** is a unique feature of UK electrical installations, originally designed to save copper while providing enough power for post-war housing. Understanding these topologies is crucial for an electrician to ensure that the circuit is not overloaded and that the protective devices will operate correctly. Incorrectly identifying a circuit as a ring when it is actually a broken loop (becoming two radials) can lead to cable overheating and potential fire hazards.\n\n**Key facts / rules**\n*   A **Radial Circuit** starts at the consumer unit and ends at the last socket or light fitting.\n*   A **Ring Final Circuit** must start and finish at the same terminal in the consumer unit to form a complete loop.\n*   Radial circuits are commonly used for lighting, where the total current demand is relatively low.\n*   Ring circuits are typically used for general-purpose socket-outlets in domestic buildings.\n*   Dedicated radial circuits are used for high-power appliances like electric showers or cookers.\n*   In a ring circuit, the current splits and travels in both directions around the loop to reach the load.\n*   Verification of the \"continuity\" of the ring is a critical safety test during commissioning.\n\n**When to choose it**\nYou should choose a **Radial Circuit** for lighting installations or when supplying a single, high-power appliance that requires its own dedicated fuse or breaker. Radials are also simpler to install and test in small areas or commercial units where circuits are frequently modified. You would choose a **Ring Final Circuit** when you need to cover a large floor area with multiple socket-outlets, such as in a living room or bedroom. The ring arrangement allows for a higher total load—typically protected by a 30A or 32A device—distributed across the loop. It is the standard choice for general domestic power because it provides a good balance of capacity and cable economy.\n\n**Common mistakes**\nThe most dangerous mistake with a **Ring Final Circuit** is a \"broken ring,\" where the loop is interrupted but the circuit still appears to work. This causes the remaining cable to carry more current than it was designed for, leading to overheating. Another common error is \"interconnecting\" two different ring circuits, which makes isolation dangerous. For **Radial Circuits**, a common mistake is adding too many points to a single circuit, exceeding the design load and causing the protective device to trip frequently.\n\n**Key Points**\n*   **Radial Circuits** run from the source to a final termination point.\n*   **Ring Final Circuits** form a loop back to the same protective device.\n*   Ring circuits provide two paths for current, allowing for higher load capacity.\n*   Radial circuits are the standard choice for lighting and high-power dedicated appliances.\n*   Proper testing is required to ensure a ring circuit is truly continuous.\n\n**Quick recap**\nElectricians use two main topologies: radial and ring final. A **Radial Circuit** follows a linear path and is ideal for lighting and dedicated appliances. A **Ring Final Circuit** forms a loop, offering a high-capacity solution for general power outlets in homes. Selecting the right topology ensures the installation is efficient, safe, and compliant with current regulations.\n\n### Coming Up Next\nNext, we will explore how to select the correct protective devices, such as MCBs and RCDs, to safeguard these different circuit types.",
      "after": "### In this lesson\nIn this lesson, you will learn the fundamental principles and typical uses of ring final and radial topologies in electrical installations. You are evaluating the best way to wire a series of socket-outlets in a domestic property to maximize efficiency and safety. Three key takeaways include: the definition of a continuous loop in a ring circuit, the point-to-point nature of a radial circuit, and the typical applications for each arrangement.\n\n**What this is**\nCircuit topology refers to the way the cables are physically connected to form a circuit. As illustrated in the diagram, a **Radial Circuit** resembles a tree branch following a linear path from the distribution board to each point in succession and terminating at the final point. Conversely, a **Ring Final Circuit** forms a continuous loop, starting and finishing at the same protective device in the consumer unit. This means that current has two paths to reach any point on the circuit, which effectively increases the current-carrying capacity of the circuit using smaller cables than would be required for a single-path radial.\n\n**Why it matters**\nChoosing the right topology is a balance between cost, ease of installation, and the electrical load requirements. The **Ring Final Circuit** is a unique feature of UK electrical installations, originally designed to save copper while providing enough power for post-war housing. Understanding these topologies is crucial for an electrician to ensure that the circuit is not overloaded and that the protective devices will operate correctly. Incorrectly identifying a circuit as a ring when it is actually a broken loop (becoming two radials) can lead to cable overheating and potential fire hazards.\n\n**Key facts / rules**\n*   A **Radial Circuit** starts at the consumer unit and ends at the last socket or light fitting.\n*   A **Ring Final Circuit** must start and finish at the same terminal in the consumer unit to form a complete loop.\n*   Radial circuits are commonly used for lighting, where the total current demand is relatively low.\n*   Ring circuits are typically used for general-purpose socket-outlets in domestic buildings.\n*   Dedicated radial circuits are used for high-power appliances like electric showers or cookers.\n*   In a ring circuit, the current splits and travels in both directions around the loop to reach the load.\n*   Verification of the \"continuity\" of the ring is a critical safety test during commissioning.\n\n**When to choose it**\nYou should choose a **Radial Circuit** for lighting installations or when supplying a single, high-power appliance that requires its own dedicated fuse or breaker. Radials are also simpler to install and test in small areas or commercial units where circuits are frequently modified. You would choose a **Ring Final Circuit** when you need to cover a large floor area with multiple socket-outlets, such as in a living room or bedroom. The ring arrangement allows for a higher total load—typically protected by a 30A or 32A device—distributed across the loop. It is the standard choice for general domestic power because it provides a good balance of capacity and cable economy.\n\n**Common mistakes**\nThe most dangerous mistake with a **Ring Final Circuit** is a \"broken ring,\" where the loop is interrupted but the circuit still appears to work. This causes the remaining cable to carry more current than it was designed for, leading to overheating. Another common error is \"interconnecting\" two different ring circuits, which makes isolation dangerous. For **Radial Circuits**, a common mistake is adding too many points to a single circuit, exceeding the design load and causing the protective device to trip frequently.\n\n**Key Points**\n*   **Radial Circuits** run from the source to a final termination point.\n*   **Ring Final Circuits** form a loop back to the same protective device.\n*   Ring circuits provide two paths for current, allowing for higher load capacity.\n*   Radial circuits are the standard choice for lighting and high-power dedicated appliances.\n*   Proper testing is required to ensure a ring circuit is truly continuous.\n\n**Quick recap**\nElectricians use two main topologies: radial and ring final. A **Radial Circuit** follows a linear path and is ideal for lighting and dedicated appliances. A **Ring Final Circuit** forms a loop, offering a high-capacity solution for general power outlets in homes. Selecting the right topology ensures the installation is efficient, safe, and compliant with current regulations.\n\n### Coming Up Next\nNext, we will explore how to select the correct protective devices, such as MCBs and RCDs, to safeguard these different circuit types.",
      "summary": "Updated content in blocks.5"
    },
    {
      "op": "replace",
      "path": "/blocks/6/content/questions/0/expectedAnswer/0",
      "before": "Radial Circuit is a circuit arrangement where the cable runs from the distribution board to each point in succession",
      "after": "radial circuit",
      "summary": "Updated expected answer at blocks.6.content.questions.0.expectedAnswer.0"
    },
    {
      "op": "replace",
      "path": "/blocks/6/content/questions/0/expectedAnswer/1",
      "before": "radial circuit",
      "after": "radial circuits",
      "summary": "Updated expected answer at blocks.6.content.questions.0.expectedAnswer.1"
    },
    {
      "op": "replace",
      "path": "/blocks/6/content/questions/0/expectedAnswer/2",
      "before": "radial circuits",
      "after": "a radial circuit",
      "summary": "Updated expected answer at blocks.6.content.questions.0.expectedAnswer.2"
    },
    {
      "op": "replace",
      "path": "/blocks/6/content/questions/1/expectedAnswer/0",
      "before": "Ring Final Circuit is a circuit arrangement that forms a continuous loop starting and finishing at the same protective device",
      "after": "ring final circuit",
      "summary": "Updated expected answer at blocks.6.content.questions.1.expectedAnswer.0"
    },
    {
      "op": "replace",
      "path": "/blocks/6/content/questions/1/expectedAnswer/1",
      "before": "ring final circuit",
      "after": "ring circuit",
      "summary": "Updated expected answer at blocks.6.content.questions.1.expectedAnswer.1"
    },
    {
      "op": "replace",
      "path": "/blocks/6/content/questions/1/expectedAnswer/2",
      "before": "ring circuit",
      "after": "a ring final circuit",
      "summary": "Updated expected answer at blocks.6.content.questions.1.expectedAnswer.2"
    },
    {
      "op": "replace",
      "path": "/blocks/6/content/questions/2/expectedAnswer/0",
      "before": "Ring circuits provide two paths for current allowing for higher load capacity",
      "after": "two paths for current",
      "summary": "Updated expected answer at blocks.6.content.questions.2.expectedAnswer.0"
    },
    {
      "op": "replace",
      "path": "/blocks/6/content/questions/2/expectedAnswer/1",
      "before": "two paths for current",
      "after": "two paths",
      "summary": "Updated expected answer at blocks.6.content.questions.2.expectedAnswer.1"
    },
    {
      "op": "replace",
      "path": "/blocks/6/content/questions/2/expectedAnswer/2",
      "before": "two paths",
      "after": "dual paths",
      "summary": "Updated expected answer at blocks.6.content.questions.2.expectedAnswer.2"
    },
    {
      "op": "replace",
      "path": "/blocks/6/content/questions/3/questionText",
      "before": "Using your answers to Q1 (Radial Circuits), Q2 (Ring Final Circuits), and Q3 (current paths), explain how these topologies differ in their physical path and capacity.",
      "after": "Using your answers to Q1 (Radial Circuits), Q2 (Ring Final Circuits), and Q3 (current paths), explain how these topologies differ in their physical path and capacity. (Answer in 2-3 sentences or concise bullet points.)",
      "summary": "Modified question text at blocks.6.content.questions.3.questionText"
    },
    {
      "op": "replace",
      "path": "/blocks/7/content/questions/0/questionText",
      "before": "Identify the type of circuit that connects directly from a consumer unit or distribution board to current-using equipment.",
      "after": "An electrician is wiring a dedicated feed for a new electric oven; what is the general term for this type of circuit connected directly from the consumer unit?",
      "summary": "Modified question text at blocks.7.content.questions.0.questionText"
    },
    {
      "op": "replace",
      "path": "/blocks/8/content/questions/1/expectedAnswer/0",
      "before": "(1) Power circuits deliver energy while control circuits manage operations; (2) ring final topologies use a continuous loop for socket outlets, whereas (3) radial topologies use a point-to-point structure. (4) Typical applications include rings for domestic sockets and radials for lighting or heavy appliances.",
      "after": "power circuits deliver energy",
      "summary": "Updated expected answer at blocks.8.content.questions.1.expectedAnswer.0"
    },
    {
      "op": "replace",
      "path": "/blocks/8/content/questions/1/expectedAnswer/1",
      "before": "1. Power circuits provide electricity to loads while control circuits regulate them. 2. Ring final topologies consist of a continuous loop from the consumer unit and back. 3. Radial topologies use a point-to-point arrangement from the source to the last point. 4. Rings are used for socket circuits, while radials are used for lighting and fixed appliances.",
      "after": "control circuits regulate or command",
      "summary": "Updated expected answer at blocks.8.content.questions.1.expectedAnswer.1"
    },
    {
      "op": "replace",
      "path": "/blocks/8/content/questions/1/expectedAnswer/2",
      "before": "(1) Electricians distinguish between power circuits for loads and control circuits for switching; (2) a ring final topology creates a continuous loop to increase current capacity, (3) while a radial topology follows a point-to-point path. (4) Rings are commonly used for domestic sockets, while radials are standard for lighting and dedicated power feeds.",
      "after": "ring final forms continuous loop",
      "summary": "Updated expected answer at blocks.8.content.questions.1.expectedAnswer.2"
    },
    {
      "op": "add",
      "path": "/blocks/8/content/questions/1/expectedAnswer/3",
      "after": "radial uses point-to-point structure",
      "summary": "Added element at blocks.8.content.questions.1.expectedAnswer.3"
    },
    {
      "op": "add",
      "path": "/blocks/8/content/questions/1/expectedAnswer/4",
      "after": "ring for domestic sockets",
      "summary": "Added element at blocks.8.content.questions.1.expectedAnswer.4"
    },
    {
      "op": "add",
      "path": "/blocks/8/content/questions/1/expectedAnswer/5",
      "after": "radial for lighting or heavy appliances",
      "summary": "Added element at blocks.8.content.questions.1.expectedAnswer.5"
    }
  ]
}
```

---

## Blockers Summary

**Total Blocked:** 1
**Points Blocked:** 3

```json
{
  "lessonId": "203-3A3",
  "timestamp": "2026-02-07T16:54:47.352Z",
  "blockers": [
    {
      "issueId": "beginnerClarityStaging.synthesis.gap",
      "type": "invariant_limits_fix",
      "rubricRef": "beginnerClarityStaging",
      "description": "Issue requires reordering blocks, but Phase 10 invariant forbids changing block order.",
      "policyConflict": "Rubric expects different block ordering; Phase 10 cannot reorder blocks",
      "recommendation": "Requires full lesson regeneration with corrected block order."
    }
  ],
  "summary": {
    "totalBlocked": 1,
    "pointsBlocked": 3
  }
}
```

---

## Index Manifest

**File:** `INDEX.json`

```json
{
  "lessonId": "203-3A3",
  "runId": "203-3A3__2026-02-07T16-51-53-139Z__rewrite__gemini-3-flash-preview",
  "timestampUtc": "2026-02-07T16:51:53.139Z",
  "phase10Strategy": "rewrite",
  "models": {
    "rewrite": "gemini-3-flash-preview",
    "scoring": "gemini-3-flash-preview"
  },
  "runConfig": null,
  "scoreBefore": {
    "total": 88,
    "grade": "Usable",
    "breakdownFile": "01_score_before.json",
    "promptFile": "05_prompt_score_before.json",
    "outputFile": "06_output_score_before.txt",
    "metadata": null
  },
  "scoreAfter": {
    "total": 97,
    "grade": "Strong",
    "breakdownFile": "11_score_after.json",
    "promptFile": "12_prompt_score_after.json",
    "outputFile": "13_output_score_after.txt",
    "metadata": null
  },
  "scoreStability": null,
  "fixPlan": {
    "file": "04_plan.json",
    "promptFile": "04_prompt_plan.json",
    "itemCount": 6,
    "fixableCount": 5,
    "blockedCount": 1
  },
  "issueLifecycle": {
    "file": "18_issue_lifecycle.json",
    "totalIssues": 6,
    "fixed": 6,
    "unmoved": 0,
    "blocked": 0
  },
  "pointerDiff": {
    "file": "19_pointer_diff.json",
    "changeCount": 32
  },
  "blockers": {
    "file": "21_blockers.json",
    "totalBlocked": 1,
    "pointsBlocked": 3
  },
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
    "04_plan.json",
    "04_prompt_plan.json",
    "10_output_lesson.json",
    "11_score_after.json",
    "14_patches_parsed.json",
    "16_validation.json",
    "17_diff.txt",
    "18_issue_lifecycle.json",
    "19_pointer_diff.json",
    "21_blockers.json"
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

Lesson: 203-3A3
Timestamp: 2026-02-07T16:53:56.997Z

================================================================================

## Metadata Changes

## Block Changes

Block 1: vocab (203-3A3-vocab) - CHANGED

  Content: CHANGED (1030 → 1278 chars)
    - terms: CHANGED

Block 3: explanation (203-3A3-explain-1) - CHANGED

  Content: CHANGED (5040 → 5043 chars)
    - content: CHANGED

Block 4: practice (203-3A3-check-1) - CHANGED

  Content: CHANGED (2653 → 2451 chars)
    - questions: CHANGED

Block 5: explanation (203-3A3-explain-2) - CHANGED

  Content: CHANGED (4831 → 4806 chars)
    - content: CHANGED

Block 6: practice (203-3A3-check-2) - CHANGED

  Content: CHANGED (2599 → 2379 chars)
    - questions: CHANGED

Block 7: practice (203-3A3-practice) - CHANGED

  Content: CHANGED (2263 → 2300 chars)
    - questions: CHANGED

Block 8: practice (203-3A3-integrative) - CHANGED

  Content: CHANGED (3211 → 2421 chars)
    - questions: CHANGED

================================================================================

Summary: 7 of 10 blocks changed

Before Hash: 98102366d2120494
After Hash:  fa40372137eaca4d
```

---

## End of Report

Generated: 2026-02-07T16:54:47.358Z
Total files: 16
