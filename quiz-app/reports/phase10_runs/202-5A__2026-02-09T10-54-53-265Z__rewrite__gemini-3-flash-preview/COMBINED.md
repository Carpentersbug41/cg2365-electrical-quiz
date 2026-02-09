# Phase 10 Debug Run

**Run ID:** 202-5A__2026-02-09T10-54-53-265Z__rewrite__gemini-3-flash-preview
**Lesson:** 202-5A
**Strategy:** rewrite
**Timestamp:** 2026-02-09T10:54:53.265Z
**Status:** success

================================================================================

## Summary

- **Score Before:** 96/100 (Strong)
- **Score After:** 97/100 (Strong)
- **Delta:** +1 points
- **Validation:** ✅ PASSED

================================================================================

## Input & Output Lesson Files

### Input Lesson (Before Refinement)

**File:** `00_input_lesson.json`

```json
{
  "id": "202-5A",
  "title": "202.5A — Magnetism basics: attraction/repulsion + flux vs flux density",
  "description": "Learn about Magnetism basics: attraction/repulsion + flux vs flux density in Science 2365 Level 2",
  "layout": "split-vis",
  "unit": "Unit 202",
  "topic": "Magnetism basics: attraction/repulsion + flux vs flux density",
  "learningOutcomes": [
    "State the laws of attraction and repulsion between like and unlike magnetic poles",
    "Explain the difference between magnetic flux and magnetic flux density using conceptual analogies",
    "Classify scenarios as describing either the total amount of flux or the concentration of flux density"
  ],
  "prerequisites": [],
  "blocks": [
    {
      "id": "202-5A-outcomes",
      "type": "outcomes",
      "order": 1,
      "content": {
        "outcomes": [
          {
            "text": "State the laws of attraction and repulsion between like and unlike magnetic poles",
            "bloomLevel": "remember"
          },
          {
            "text": "Explain the difference between magnetic flux and magnetic flux density using conceptual analogies",
            "bloomLevel": "understand"
          },
          {
            "text": "Classify scenarios as describing either the total amount of flux or the concentration of flux density",
            "bloomLevel": "apply"
          }
        ]
      }
    },
    {
      "id": "202-5A-vocab",
      "type": "vocab",
      "order": 2,
      "content": {
        "terms": [
          {
            "term": "Magnetic Poles",
            "definition": "The regions at the ends of a magnet where the magnetic force is most concentrated, designated as North and South poles."
          },
          {
            "term": "Magnetic Flux",
            "definition": "The total amount of magnetic field lines produced by a source, measured in Webers (Wb), not the concentration of those lines in a specific area."
          },
          {
            "term": "Magnetic Flux Density",
            "definition": "The concentration of magnetic field lines passing through a specific unit area, measured in Tesla (T), which represents the strength of the magnetic field."
          },
          {
            "term": "Weber (Wb)",
            "definition": "The SI unit used to measure total magnetic flux, representing the entire quantity of magnetic lines of force."
          },
          {
            "term": "Tesla (T)",
            "definition": "The SI unit used to measure magnetic flux density, defined as one Weber per square metre."
          }
        ]
      }
    },
    {
      "id": "202-5A-diagram",
      "type": "diagram",
      "order": 3,
      "content": {
        "title": "Magnetism basics: attraction/repulsion + flux vs flux density Diagram",
        "description": "Visual representation of Magnetism basics: attraction/repulsion + flux vs flux density",
        "videoUrl": "",
        "diagramType": "concept",
        "elementIds": [
          "magnetic-poles",
          "magnetic-flux",
          "magnetic-flux-density",
          "north-pole",
          "south-pole"
        ],
        "placeholderText": "The diagram should feature two bar magnets. The first part shows the law of attraction/repulsion: two magnets with 'N' and 'S' labels (magnetic-poles). One pair should show 'N' facing 'S' with arrows pointing together (attraction), and another showing 'N' facing 'N' with arrows pointing apart (repulsion). The second part of the diagram should illustrate a single magnet with field lines (magnetic-flux) looping from the north-pole to the south-pole. A highlighted square area near the pole should show many lines packed together to represent high magnetic-flux-density, while a square of the same size further away shows fewer lines to represent lower density."
      }
    },
    {
      "id": "202-5A-explain-1",
      "type": "explanation",
      "order": 4,
      "content": {
        "title": "Magnetic Poles and Interaction",
        "content": "### In this lesson\nThis lesson introduces the fundamental behavior of magnets and how they interact with one another. You are exploring this in the context of basic electrical science, which forms the foundation for understanding how motors and transformers work in an installation. \n\n*   Magnets always possess two distinct regions of force.\n*   Like poles push away from each other.\n*   Unlike poles pull toward each other.\n\n**What this is**\nMagnetism is a physical phenomenon produced by the motion of electric charge, resulting in attractive and repulsive forces between objects. Every magnet has two specific ends known as **Magnetic Poles**. These are designated as the North pole and the South pole. Even if you were to cut a magnet in half, each piece would still develop its own North and South poles. The area surrounding these poles where the magnetic force can be detected is known as the magnetic field. \n\n**Why it matters**\nUnderstanding how **Magnetic Poles** interact is critical for an electrician because it explains the mechanical rotation in electric motors. By using the laws of attraction and repulsion, we can force a motor's internal components to move. Furthermore, this knowledge is essential when identifying how protective devices like circuit breakers use magnetic trip elements to disconnect a circuit during a fault. \n\n**Key facts / rules**\n*   Every magnet must have a North pole and a South pole.\n*   The law of attraction states that unlike poles (North and South) will pull toward each other.\n*   The law of repulsion states that like poles (North and North, or South and South) will push away from each other.\n*   Magnetic field lines are typically illustrated as exiting the North pole and entering the South pole.\n*   The magnetic force is strongest at the poles and weakens as you move further away.\n*   Magnetic materials, such as iron or steel, are attracted to either pole of a magnet.\n\n**How to recognise it**\nTo recognise the interaction between magnets, you look for the direction of the physical force being applied. If you bring two magnets together and feel a resisting force that prevents them from touching, you are observing repulsion between like poles. Conversely, if the magnets snap together with force, you are observing attraction between unlike poles. On the diagram, notice that the **north-pole** and **south-pole** labels indicate the specific regions where the magnetic force is most concentrated. You can also recognise these interactions through the behavior of a compass needle, which is itself a small magnet that aligns its poles with the Earth's magnetic field.\n\n**Common mistakes**\nLearners often confuse **attraction** with **repulsion**; **attraction** is the pulling together of unlike poles whereas **repulsion** is the pushing apart of like poles. Another common error is assuming that a magnet only has one pole or that the poles can be separated, which is physically impossible in standard electrical applications.\n\n**Key Points**\n*   Magnets always have two poles: North and South.\n*   Like poles repel; unlike poles attract.\n*   The magnetic field is the region where these forces act.\n*   Force is most concentrated at the poles themselves.\n\n**Quick recap**\nMagnets interact based on their poles. Like poles always push apart (repulsion), while opposite poles always pull together (attraction). These forces are the strongest at the ends of the magnet, which we call the North and South poles.\n\n### Coming Up Next\nNow that you understand how poles interact, we will look at how we measure the \"amount\" and \"concentration\" of the magnetic field using flux and flux density."
      }
    },
    {
      "id": "202-5A-check-1",
      "type": "practice",
      "order": 4.5,
      "content": {
        "title": "Check Your Understanding: Magnetic Poles and Interaction",
        "mode": "conceptual",
        "sequential": true,
        "questions": [
          {
            "id": "202-5A-C1-L1-A",
            "questionText": "According to the diagram, what do the north-pole and south-pole labels indicate about the magnetic force?",
            "answerType": "short-text",
            "cognitiveLevel": "recall",
            "expectedAnswer": [
              "magnetic force is most concentrated",
              "force is most concentrated",
              "where the magnetic force is most concentrated"
            ],
            "hint": "Look at the description of the labels in the 'How to recognise it' section."
          },
          {
            "id": "202-5A-C1-L1-B",
            "questionText": "What term describes the interaction when unlike poles pull toward each other?",
            "answerType": "short-text",
            "cognitiveLevel": "recall",
            "expectedAnswer": [
              "attraction",
              "magnetic attraction",
              "pulling together"
            ],
            "hint": "This is the opposite of pushing apart."
          },
          {
            "id": "202-5A-C1-L1-C",
            "questionText": "What term describes the interaction when like poles push away from each other?",
            "answerType": "short-text",
            "cognitiveLevel": "recall",
            "expectedAnswer": [
              "repulsion",
              "magnetic repulsion",
              "pushing apart"
            ],
            "hint": "This occurs when two North poles or two South poles are brought together."
          },
          {
            "id": "202-5A-C1-L2",
            "questionText": "Using your answers to Q1 (concentrated force), Q2 (attraction), and Q3 (repulsion), explain how magnetic poles determine the physical movement of objects.",
            "answerType": "short-text",
            "cognitiveLevel": "connection",
            "expectedAnswer": [
              "the concentrated force at the poles causes magnets to either pull together through attraction or push apart through repulsion",
              "magnets move because the concentrated force at their poles creates attraction between unlike poles and repulsion between like poles",
              "attraction and repulsion are the forces most concentrated at the poles that cause magnetic movement"
            ],
            "hint": "Think about how the location of the force and the type of interaction work together to create movement."
          }
        ]
      }
    },
    {
      "id": "202-5A-explain-2",
      "type": "explanation",
      "order": 5,
      "content": {
        "title": "Magnetic Flux vs. Flux Density",
        "content": "### In this lesson\nYou will learn to distinguish between the total magnetic field produced and how concentrated that field is in a given space. This is essential for understanding how magnetic components like transformer cores are selected for specific electrical loads.\n\n*   Flux represents the total quantity of magnetic field lines.\n*   Flux density represents the concentration of those lines per unit area.\n*   Different units (Webers and Teslas) are used to measure these distinct properties.\n\n**What this is**\n**Magnetic Flux** refers to the total number of magnetic field lines passing through a specific surface. Think of it as the \"total volume\" of magnetism. The SI unit for this is the **Weber (Wb)**. On the other hand, **Magnetic Flux Density** describes how tightly packed those field lines are within a specific area. It is a measure of the strength of the magnetic field at a particular point. The SI unit for flux density is the **Tesla (T)**, which is defined as one **Weber (Wb)** per square metre.\n\n**Why it matters**\nIn electrical engineering, we need to know more than just the total amount of magnetism; we need to know if that magnetism is \"strong\" enough to do work. For example, in a transformer, if the **Magnetic Flux Density** becomes too high, the iron core can become saturated and stop working efficiently. Choosing the right material and cross-sectional area ensures that the flux is handled correctly without overheating the component.\n\n**Key facts / rules**\n*   **Magnetic Flux** is the total amount of magnetic field, measured in **Webers (Wb)**.\n*   **Magnetic Flux Density** is the concentration of the field, measured in **Tesla (T)**.\n*   One **Tesla (T)** is equal to one Weber per square metre (Wb/m²).\n*   If the area decreases but the total flux stays the same, the flux density increases.\n*   If the total flux increases but the area stays the same, the flux density increases.\n*   Flux density is a vector quantity, meaning it has both magnitude and direction.\n\n**How to recognise it**\nTo classify scenarios correctly, look for whether the description focuses on a \"total\" or a \"concentration.\" For example, if a manufacturer states the total output of a magnet, they are describing **Magnetic Flux**. If they describe the strength of the field at the surface of a specific 10mm² sensor, they are describing **Magnetic Flux Density**. A helpful conceptual analogy is rain: the total amount of water falling on a whole garden is the flux, while the amount of water hitting a single square inch of a patio is the flux density. On the diagram, notice that the **magnetic-flux-density** is represented by how closely the lines are drawn together in a specific area.\n\n**Common mistakes**\nLearners often confuse **Magnetic Flux** with **Magnetic Flux Density**; **Magnetic Flux** is the total amount of field lines (measured in Webers) whereas **Magnetic Flux Density** is how concentrated those lines are in a specific area (measured in Tesla). Many people forget that density is dependent on the area the flux is passing through.\n\n**Key Points**\n*   Flux (Wb) = Total amount of magnetic field.\n*   Flux Density (T) = Concentration of field per square metre.\n*   Smaller area with the same flux results in higher density.\n*   Tesla is the unit of measurement for field strength (density).\n\n**Quick recap**\n**Magnetic Flux** (Webers) tells us the total amount of magnetic field lines present. **Magnetic Flux Density** (Tesla) tells us how squashed together those lines are. If you squeeze the same amount of flux into a smaller pipe, the density goes up.\n\n### Coming Up Next\nWith these basics mastered, we will move on to see how electricity can be used to create these magnetic fields in a process called electromagnetism."
      }
    },
    {
      "id": "202-5A-check-2",
      "type": "practice",
      "order": 5.5,
      "content": {
        "title": "Check Your Understanding: Magnetic Flux vs. Flux Density",
        "mode": "conceptual",
        "sequential": true,
        "questions": [
          {
            "id": "202-5A-C2-L1-A",
            "questionText": "On the diagram, how is the magnetic-flux-density visually represented?",
            "answerType": "short-text",
            "cognitiveLevel": "recall",
            "expectedAnswer": [
              "how closely the lines are drawn together",
              "closely drawn lines",
              "lines are drawn together"
            ],
            "hint": "Look for the description of the diagram in the 'How to recognise it' section."
          },
          {
            "id": "202-5A-C2-L1-B",
            "questionText": "Identify the term for the total amount of field lines measured in Webers.",
            "answerType": "short-text",
            "cognitiveLevel": "recall",
            "expectedAnswer": [
              "Magnetic Flux",
              "flux",
              "total flux"
            ],
            "hint": "This represents the total volume of the magnetic field."
          },
          {
            "id": "202-5A-C2-L1-C",
            "questionText": "Identify the term for how concentrated those lines are in a specific area measured in Tesla.",
            "answerType": "short-text",
            "cognitiveLevel": "recall",
            "expectedAnswer": [
              "Magnetic Flux Density",
              "flux density",
              "density"
            ],
            "hint": "This describes the strength of the field at a particular point."
          },
          {
            "id": "202-5A-C2-L2",
            "questionText": "Using your answers to Q1 (line closeness), Q2 (Magnetic Flux), and Q3 (Magnetic Flux Density), explain the relationship between the total field and its concentration.",
            "answerType": "short-text",
            "cognitiveLevel": "connection",
            "expectedAnswer": [
              "Magnetic Flux Density measures how the total Magnetic Flux is concentrated in an area, which is shown by how closely the lines are drawn together",
              "the total Magnetic Flux becomes Magnetic Flux Density when it is concentrated into a specific area as indicated by the closeness of the lines",
              "line closeness represents the Magnetic Flux Density which is the concentration of the total Magnetic Flux lines"
            ],
            "hint": "Connect the total quantity of lines to how they are packed into a specific area."
          }
        ]
      }
    },
    {
      "id": "202-5A-practice",
      "type": "practice",
      "order": 8,
      "content": {
        "title": "Magnetic Principles Practice",
        "questions": [
          {
            "id": "202-5A-P1",
            "questionText": "Identify the specific regions at the ends of a magnet where the magnetic force is most concentrated.",
            "answerType": "short-text",
            "expectedAnswer": [
              "Magnetic Poles",
              "the magnetic poles",
              "poles"
            ],
            "hint": "These are designated as North and South."
          },
          {
            "id": "202-5A-P2",
            "questionText": "A transformer core has a total magnetic flux of 8 Webers distributed over a cross-sectional area of 2 square metres. Calculate the magnetic flux density. (Round to the nearest whole number)",
            "answerType": "numeric",
            "expectedAnswer": [
              "4",
              "4.0"
            ],
            "hint": "Flux Density is Webers per square metre (Wb/m²). Result is in Tesla (T)."
          },
          {
            "id": "202-5A-P3",
            "questionText": "An electrician is installing a magnetic door lock. If the North pole of the door magnet is brought directly towards the North pole of the frame magnet, what physical force will occur between them?",
            "answerType": "short-text",
            "expectedAnswer": [
              "Repulsion",
              "magnetic repulsion",
              "repelling force"
            ],
            "hint": "Consider the law regarding 'like' poles."
          },
          {
            "id": "202-5A-P4",
            "questionText": "A magnetic field is measured to have a flux density of 10 Tesla acting over an area of 0.5 square metres. What is the total magnetic flux produced? (Round to the nearest whole number)",
            "answerType": "numeric",
            "expectedAnswer": [
              "5",
              "5.0"
            ],
            "hint": "If 1 Tesla = 1 Weber per 1m², multiply the density by the area. Result is in Webers (Wb)."
          },
          {
            "id": "202-5A-P5",
            "questionText": "Which SI unit is used to measure the total quantity of magnetic lines of force, representing the 'total volume' of magnetism?",
            "answerType": "short-text",
            "expectedAnswer": [
              "Weber",
              "the Weber",
              "Wb"
            ],
            "hint": "This unit is distinct from the Tesla, which measures concentration."
          }
        ]
      }
    },
    {
      "id": "202-5A-integrative",
      "type": "practice",
      "order": 9.5,
      "content": {
        "title": "Putting It All Together",
        "mode": "integrative",
        "sequential": true,
        "questions": [
          {
            "id": "202-5A-INT-1",
            "questionText": "Explain how the interaction between magnetic poles relates to the measurement of a magnetic field. In your answer, include: (1) the laws of attraction and repulsion, (2) magnetic flux as a total quantity, (3) how flux density describes the field's concentration. (2-3 sentences)",
            "answerType": "short-text",
            "cognitiveLevel": "connection",
            "expectedAnswer": [
              "Like poles repel and unlike poles attract, creating a magnetic field where the total quantity of lines is defined as magnetic flux. Flux density then measures how concentrated those magnetic lines are within a specific cross-sectional area.",
              "When unlike poles attract or like poles repel, they produce magnetic flux representing the total field lines. Flux density describes the concentration of this flux in a given space, indicating the local strength of the magnetic interaction.",
              "Magnetic flux is the total amount of field produced by the interaction of like or unlike poles. Flux density describes how tightly packed or concentrated that total flux is within a specific area."
            ],
            "hint": "Think about how the behavior of poles creates a field and the two different ways we measure the 'amount' versus the 'tightness' of that field."
          },
          {
            "id": "202-5A-INT-2",
            "questionText": "Summarize the relationship between magnetic behavior and the units used to measure magnetic properties. In your answer, include: (1) behavior of like and unlike poles, (2) the definition of flux in Webers, (3) the definition of flux density in Teslas, (4) how concentration differs from total amount. Answer in 3-4 sentences OR concise bullet points.",
            "answerType": "short-text",
            "cognitiveLevel": "synthesis",
            "expectedAnswer": [
              "Magnets interact such that like poles repel and unlike poles attract. The total quantity of the resulting magnetic field is flux, measured in Webers, whereas flux density, measured in Teslas, describes the concentration of those lines per unit area. This distinguishes the total magnetic output from how 'packed' the field is in a specific component like a transformer core.",
              "1. Like poles repel and unlike poles attract to create a field. 2. Magnetic flux is the total number of field lines measured in Webers. 3. Flux density is the concentration of these lines per square meter, measured in Teslas. 4. Flux represents the total amount of magnetism, while density represents its concentration in a specific area.",
              "Magnetic poles exert force where like poles repel and unlike poles attract. This force is measured as total magnetic flux in Webers, while the concentration of that force per unit area is called flux density, measured in Teslas. Understanding both is necessary to distinguish between the total field available and how intense that field is in a given space."
            ],
            "hint": "Ensure you mention the specific units (Webers and Teslas) and clearly distinguish between the total 'volume' of the field versus its 'intensity' in one spot."
          }
        ]
      }
    },
    {
      "id": "202-5A-spaced-review",
      "type": "spaced-review",
      "order": 10,
      "content": {
        "title": "Foundation Check",
        "questions": [
          {
            "id": "202-5A-SR-1",
            "questionText": "What is the SI unit of measurement for electrical current?",
            "expectedAnswer": [
              "Ampere",
              "Amperes",
              "Amps",
              "A"
            ],
            "hint": "It is named after a French physicist and is often abbreviated to the letter 'A'.",
            "answerType": "short-text"
          },
          {
            "id": "202-5A-SR-2",
            "questionText": "What name is given to a material that easily allows the flow of electric current?",
            "expectedAnswer": [
              "Conductor",
              "Electrical conductor",
              "Conductive"
            ],
            "hint": "Copper and aluminum are common examples used in cables.",
            "answerType": "short-text"
          },
          {
            "id": "202-5A-SR-3",
            "questionText": "Which negatively charged subatomic particle flows through a conductor to create an electric current?",
            "expectedAnswer": [
              "Electron",
              "Electrons"
            ],
            "hint": "These particles orbit the nucleus of an atom and are responsible for charge transfer.",
            "answerType": "short-text"
          }
        ],
        "notes": "Foundation check before starting Magnetism basics: attraction/repulsion + flux vs flux density"
      }
    }
  ],
  "metadata": {
    "created": "2026-02-09",
    "updated": "2026-02-09",
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
  "id": "202-5A",
  "title": "202.5A — Magnetism basics: attraction/repulsion + flux vs flux density",
  "description": "Learn about Magnetism basics: attraction/repulsion + flux vs flux density in Science 2365 Level 2",
  "layout": "split-vis",
  "unit": "Unit 202",
  "topic": "Magnetism basics: attraction/repulsion + flux vs flux density",
  "learningOutcomes": [
    "State the laws of attraction and repulsion between like and unlike magnetic poles",
    "Explain the difference between magnetic flux and magnetic flux density using conceptual analogies",
    "Classify scenarios as describing either the total amount of flux or the concentration of flux density"
  ],
  "prerequisites": [],
  "blocks": [
    {
      "id": "202-5A-outcomes",
      "type": "outcomes",
      "order": 1,
      "content": {
        "outcomes": [
          {
            "text": "State the laws of attraction and repulsion between like and unlike magnetic poles",
            "bloomLevel": "remember"
          },
          {
            "text": "Explain the difference between magnetic flux and magnetic flux density using conceptual analogies",
            "bloomLevel": "understand"
          },
          {
            "text": "Classify scenarios as describing either the total amount of flux or the concentration of flux density",
            "bloomLevel": "apply"
          }
        ]
      }
    },
    {
      "id": "202-5A-vocab",
      "type": "vocab",
      "order": 2,
      "content": {
        "terms": [
          {
            "term": "Magnetic Poles",
            "definition": "The regions at the ends of a magnet where the magnetic force is most concentrated, designated as North and South poles."
          },
          {
            "term": "Magnetic Flux (Φ)",
            "definition": "The total amount of magnetic field lines produced by a source, measured in Webers (Wb), representing the entire quantity of magnetic lines of force."
          },
          {
            "term": "Magnetic Flux Density (B)",
            "definition": "The concentration of magnetic field lines passing through a specific unit area, measured in Tesla (T), defined as one Weber per square metre."
          },
          {
            "term": "Weber (Wb)",
            "definition": "The SI unit used to measure total magnetic flux (Φ)."
          },
          {
            "term": "Tesla (T)",
            "definition": "The SI unit used to measure magnetic flux density (B), representing the strength of the magnetic field."
          }
        ]
      }
    },
    {
      "id": "202-5A-diagram",
      "type": "diagram",
      "order": 3,
      "content": {
        "title": "Magnetism basics: attraction/repulsion + flux vs flux density Diagram",
        "description": "Visual representation of Magnetism basics: attraction/repulsion + flux vs flux density",
        "videoUrl": "",
        "diagramType": "concept",
        "elementIds": [
          "magnetic-poles",
          "magnetic-flux",
          "magnetic-flux-density",
          "north-pole",
          "south-pole"
        ],
        "placeholderText": "The diagram should feature two bar magnets. The first part shows the law of attraction/repulsion: two magnets with 'N' and 'S' labels (magnetic-poles). One pair should show 'N' facing 'S' with arrows pointing together (attraction), and another showing 'N' facing 'N' with arrows pointing apart (repulsion). The second part of the diagram should illustrate a single magnet with field lines (magnetic-flux) looping from the north-pole to the south-pole. A highlighted square area near the pole should show many lines packed together to represent high magnetic-flux-density, while a square of the same size further away shows fewer lines to represent lower density."
      }
    },
    {
      "id": "202-5A-explain-1",
      "type": "explanation",
      "order": 4,
      "content": {
        "title": "Magnetic Poles and Interaction",
        "content": "### In this lesson\nThis lesson introduces the fundamental behavior of magnets and how they interact with one another. You are exploring this in the context of basic electrical science, which forms the foundation for understanding how motors and transformers work in an installation. \n\n*   Magnets always possess two distinct regions of force.\n*   Like poles push away from each other.\n*   Unlike poles pull toward each other.\n\n**What this is**\nMagnetism is a physical phenomenon produced by the motion of electric charge, resulting in attractive and repulsive forces between objects. Every magnet has two specific ends known as **Magnetic Poles**. These are designated as the North pole and the South pole. Even if you were to cut a magnet in half, each piece would still develop its own North and South poles. The area surrounding these poles where the magnetic force can be detected is known as the magnetic field. \n\n**Why it matters**\nUnderstanding how **Magnetic Poles** interact is critical for an electrician because it explains the mechanical rotation in electric motors. By using the laws of attraction and repulsion, we can force a motor's internal components to move. Furthermore, this knowledge is essential when identifying how protective devices like circuit breakers use magnetic trip elements to disconnect a circuit during a fault. \n\n**Key facts / rules**\n*   Every magnet must have a North pole and a South pole.\n*   The law of attraction states that unlike poles (North and South) will pull toward each other.\n*   The law of repulsion states that like poles (North and North, or South and South) will push away from each other.\n*   Magnetic field lines never cross, form continuous loops, and are conventionally shown flowing from the North pole to the South pole externally.\n*   The magnetic force is strongest at the poles and weakens as you move further away.\n*   Magnetic materials, such as iron or steel, are attracted to either pole of a magnet.\n\n**How to recognise it**\nTo recognise the interaction between magnets, you look for the direction of the physical force being applied. If you bring two magnets together and feel a resisting force that prevents them from touching, you are observing repulsion between like poles. Conversely, if the magnets snap together with force, you are observing attraction between unlike poles. On the diagram, notice that the **north-pole** and **south-pole** labels indicate the specific regions where the magnetic force is most concentrated. You can also recognise these interactions through the behavior of a compass needle, which is itself a small magnet that aligns its poles with the Earth's magnetic field.\n\n**Common mistakes**\nLearners often confuse **attraction** with **repulsion**; **attraction** is the pulling together of unlike poles whereas **repulsion** is the pushing apart of like poles. Another common error is assuming that a magnet only has one pole or that the poles can be separated, which is physically impossible in standard electrical applications.\n\n**Key Points**\n*   Magnets always have two poles: North and South.\n*   Like poles repel; unlike poles attract.\n*   The magnetic field is the region where these forces act.\n*   Force is most concentrated at the poles themselves.\n\n**Quick recap**\nMagnets interact based on their poles. Like poles always push apart (repulsion), while opposite poles always pull together (attraction). These forces are the strongest at the ends of the magnet, which we call the North and South poles.\n\n### Coming Up Next\nNow that you understand how poles interact, we will look at how we measure the \"amount\" and \"concentration\" of the magnetic field using flux and flux density."
      }
    },
    {
      "id": "202-5A-check-1",
      "type": "practice",
      "order": 4.5,
      "content": {
        "title": "Check Your Understanding: Magnetic Poles and Interaction",
        "mode": "conceptual",
        "sequential": true,
        "questions": [
          {
            "id": "202-5A-C1-L1-A",
            "questionText": "According to the diagram, what do the north-pole and south-pole labels indicate about the magnetic force?",
            "answerType": "short-text",
            "cognitiveLevel": "recall",
            "expectedAnswer": [
              "magnetic force is most concentrated",
              "force is most concentrated",
              "where the magnetic force is most concentrated"
            ],
            "hint": "Look at the description of the labels in the 'How to recognise it' section."
          },
          {
            "id": "202-5A-C1-L1-B",
            "questionText": "What term describes the interaction when unlike poles pull toward each other?",
            "answerType": "short-text",
            "cognitiveLevel": "recall",
            "expectedAnswer": [
              "attraction",
              "magnetic attraction",
              "pulling together",
              "attract"
            ],
            "hint": "This is the opposite of pushing apart."
          },
          {
            "id": "202-5A-C1-L1-C",
            "questionText": "What term describes the interaction when like poles push away from each other?",
            "answerType": "short-text",
            "cognitiveLevel": "recall",
            "expectedAnswer": [
              "repulsion",
              "magnetic repulsion",
              "pushing apart",
              "repel"
            ],
            "hint": "This occurs when two North poles or two South poles are brought together."
          },
          {
            "id": "202-5A-C1-L2",
            "questionText": "Using your answers to Q1 (concentrated force), Q2 (attraction), and Q3 (repulsion), explain how magnetic poles determine the physical movement of objects.",
            "answerType": "short-text",
            "cognitiveLevel": "connection",
            "expectedAnswer": [
              "the concentrated force at the poles causes magnets to either pull together through attraction or push apart through repulsion",
              "magnets move because the concentrated force at their poles creates attraction between unlike poles and repulsion between like poles",
              "attraction and repulsion are the forces most concentrated at the poles that cause magnetic movement"
            ],
            "hint": "Think about how the location of the force and the type of interaction work together to create movement."
          }
        ]
      }
    },
    {
      "id": "202-5A-explain-2",
      "type": "explanation",
      "order": 5,
      "content": {
        "title": "Magnetic Flux vs. Flux Density",
        "content": "**Worked Example:**\nA magnet produces 0.5 Wb of flux over an area of 0.25 m². To find the density (B):\n1. Identify values: Φ = 0.5, A = 0.25\n2. Apply formula: B = Φ / A\n3. Result: **2 Tesla (T)**\n\n### In this lesson\nYou will learn to distinguish between the total magnetic field produced and how concentrated that field is in a given space. This is essential for understanding how magnetic components like transformer cores are selected for specific electrical loads.\n\n*   Flux represents the total quantity of magnetic field lines.\n*   Flux density represents the concentration of those lines per unit area.\n*   Different units (Webers and Teslas) are used to measure these distinct properties.\n\n**What this is**\n**Magnetic Flux (Φ)** refers to the total number of magnetic field lines passing through a specific surface. Think of it as the \"total volume\" of magnetism. The SI unit for this is the **Weber (Wb)**. On the other hand, **Magnetic Flux Density (B)** describes how tightly packed those field lines are within a specific area. The relationship is expressed as $B = \\Phi / A$. The SI unit for flux density is the **Tesla (T)**, which is defined as one **Weber (Wb)** per square metre.\n\n**Why it matters**\nIn electrical engineering, we need to know more than just the total amount of magnetism; we need to know if that magnetism is \"strong\" enough to do work. For example, in a transformer, if the **Magnetic Flux Density** becomes too high, the iron core can become **saturated** and stop working efficiently. Choosing the right material and cross-sectional area ensures that the flux is handled correctly without overheating the component.\n\n**Key facts / rules**\n*   **Magnetic Flux (Φ)** is the total amount of magnetic field, measured in **Webers (Wb)**.\n*   **Magnetic Flux Density (B)** is the concentration of the field, measured in **Tesla (T)**.\n*   One **Tesla (T)** is equal to one Weber per square metre (Wb/m²).\n*   If the area decreases but the total flux stays the same, the flux density increases.\n*   If the total flux increases but the area stays the same, the flux density increases.\n*   Flux density is a vector quantity, meaning it has both magnitude and direction.\n\n**How to recognise it**\nTo classify scenarios correctly, look for whether the description focuses on a \"total\" or a \"concentration.\" For example, if a manufacturer states the total output of a magnet, they are describing **Magnetic Flux**. If they describe the strength of the field at the surface of a specific 10mm² sensor, they are describing **Magnetic Flux Density**. A helpful conceptual analogy is rain: the total amount of water falling on a whole garden is the flux, while the amount of water hitting a single square inch of a patio is the flux density. On the diagram, notice that the **magnetic-flux-density** is represented by how closely the lines are drawn together in a specific area.\n\n**Common mistakes**\nLearners often confuse **Magnetic Flux** with **Magnetic Flux Density**; **Magnetic Flux** is the total amount of field lines (measured in Webers) whereas **Magnetic Flux Density** is how concentrated those lines are in a specific area (measured in Tesla). Many people forget that density is dependent on the area the flux is passing through. Learners also forget the concept of **magnetic saturation**, where a material reaches a point where it cannot hold any more flux density, regardless of how much total flux is applied.\n\n**Key Points**\n*   Flux (Wb) = Total amount of magnetic field.\n*   Flux Density (T) = Concentration of field per square metre.\n*   Smaller area with the same flux results in higher density.\n*   Tesla is the unit of measurement for field strength (density).\n\n**Quick recap**\n**Magnetic Flux** (Webers) tells us the total amount of magnetic field lines present. **Magnetic Flux Density** (Tesla) tells us how squashed together those lines are. If you squeeze the same amount of flux into a smaller pipe, the density goes up.\n\n### Coming Up Next\nWith these basics mastered, we will move on to see how electricity can be used to create these magnetic fields in a process called electromagnetism."
      }
    },
    {
      "id": "202-5A-check-2",
      "type": "practice",
      "order": 5.5,
      "content": {
        "title": "Check Your Understanding: Magnetic Flux vs. Flux Density",
        "mode": "conceptual",
        "sequential": true,
        "questions": [
          {
            "id": "202-5A-C2-L1-A",
            "questionText": "On the diagram, how is the magnetic-flux-density visually represented?",
            "answerType": "short-text",
            "cognitiveLevel": "recall",
            "expectedAnswer": [
              "how closely the lines are drawn together",
              "closely drawn lines",
              "lines are drawn together"
            ],
            "hint": "Look for the description of the diagram in the 'How to recognise it' section."
          },
          {
            "id": "202-5A-C2-L1-B",
            "questionText": "Identify the term for the total amount of field lines measured in Webers.",
            "answerType": "short-text",
            "cognitiveLevel": "recall",
            "expectedAnswer": [
              "Magnetic Flux",
              "flux",
              "total flux"
            ],
            "hint": "This represents the total volume of the magnetic field."
          },
          {
            "id": "202-5A-C2-L1-C",
            "questionText": "Identify the term for how concentrated those lines are in a specific area measured in Tesla.",
            "answerType": "short-text",
            "cognitiveLevel": "recall",
            "expectedAnswer": [
              "Magnetic Flux Density",
              "flux density",
              "density"
            ],
            "hint": "This describes the strength of the field at a particular point."
          },
          {
            "id": "202-5A-C2-L2",
            "questionText": "Using your answers to Q1 (line closeness), Q2 (Magnetic Flux), and Q3 (Magnetic Flux Density), explain the relationship between the total field and its concentration.",
            "answerType": "short-text",
            "cognitiveLevel": "connection",
            "expectedAnswer": [
              "Magnetic Flux Density measures how the total Magnetic Flux is concentrated in an area, which is shown by how closely the lines are drawn together",
              "the total Magnetic Flux becomes Magnetic Flux Density when it is concentrated into a specific area as indicated by the closeness of the lines",
              "line closeness represents the Magnetic Flux Density which is the concentration of the total Magnetic Flux lines"
            ],
            "hint": "Connect the total quantity of lines to how they are packed into a specific area."
          }
        ]
      }
    },
    {
      "id": "202-5A-practice",
      "type": "practice",
      "order": 8,
      "content": {
        "title": "Magnetic Principles Practice",
        "questions": [
          {
            "id": "202-5A-P1",
            "questionText": "Identify the specific regions at the ends of a magnet where the magnetic force is most concentrated.",
            "answerType": "short-text",
            "expectedAnswer": [
              "Magnetic Poles",
              "the magnetic poles",
              "poles"
            ],
            "hint": "These are designated as North and South."
          },
          {
            "id": "202-5A-P2",
            "questionText": "A transformer core has a total magnetic flux of 8 Webers distributed over a cross-sectional area of 2 square metres. Calculate the magnetic flux density. (Round to the nearest whole number and provide the numeric value only)",
            "answerType": "calculation",
            "expectedAnswer": [
              "4",
              "4.0"
            ],
            "hint": "Flux Density is Webers per square metre (Wb/m²). Result is in Tesla (T)."
          },
          {
            "id": "202-5A-P3",
            "questionText": "An electrician is installing a magnetic door lock. If the North pole of the door magnet is brought directly towards the North pole of the frame magnet, what physical force will occur between them?",
            "answerType": "short-text",
            "expectedAnswer": [
              "Repulsion",
              "magnetic repulsion",
              "repelling force",
              "repel"
            ],
            "hint": "Consider the law regarding 'like' poles."
          },
          {
            "id": "202-5A-P4",
            "questionText": "A magnetic field is measured to have a flux density of 10 Tesla acting over an area of 0.5 square metres. What is the total magnetic flux produced? (Round to the nearest whole number and provide the numeric value only)",
            "answerType": "calculation",
            "expectedAnswer": [
              "5",
              "5.0"
            ],
            "hint": "If 1 Tesla = 1 Weber per 1m², multiply the density by the area. Result is in Webers (Wb)."
          },
          {
            "id": "202-5A-P5",
            "questionText": "A manufacturer specifies that a magnet produces a total of 0.05 Webers. Is this specification describing 'Magnetic Flux' or 'Magnetic Flux Density'?",
            "answerType": "short-text",
            "expectedAnswer": [
              "Magnetic Flux",
              "flux",
              "total flux"
            ],
            "hint": "This unit is distinct from the Tesla, which measures concentration."
          }
        ]
      }
    },
    {
      "id": "202-5A-integrative",
      "type": "practice",
      "order": 9.5,
      "content": {
        "title": "Putting It All Together",
        "mode": "integrative",
        "sequential": true,
        "questions": [
          {
            "id": "202-5A-INT-1",
            "questionText": "Explain how the interaction between magnetic poles relates to the measurement of a magnetic field. In your answer, include: (1) the laws of attraction and repulsion, (2) magnetic flux as a total quantity, (3) how flux density describes the field's concentration.",
            "answerType": "short-text",
            "cognitiveLevel": "connection",
            "expectedAnswer": [
              "Like poles repel and unlike poles attract, creating a magnetic field where the total quantity of lines is defined as magnetic flux. Flux density then measures how concentrated those magnetic lines are within a specific cross-sectional area.",
              "When unlike poles attract or like poles repel, they produce magnetic flux representing the total field lines. Flux density describes the concentration of this flux in a given space, indicating the local strength of the magnetic interaction.",
              "unlike attract like repel flux total density concentration"
            ],
            "hint": "Think about how the behavior of poles creates a field and the two different ways we measure the 'amount' versus the 'tightness' of that field."
          },
          {
            "id": "202-5A-INT-2",
            "questionText": "Summarize the relationship between magnetic behavior and the units used to measure magnetic properties. In your answer, include: (1) behavior of like and unlike poles, (2) the definition of flux in Webers, (3) the definition of flux density in Teslas, (4) how concentration differs from total amount. Answer in 3-4 sentences OR concise bullet points.",
            "answerType": "short-text",
            "cognitiveLevel": "synthesis",
            "expectedAnswer": [
              "like poles repel and unlike poles attract",
              "magnetic flux (Φ) is the total field quantity",
              "Webers (Wb) measure total flux",
              "flux density (B) is concentration per area",
              "Teslas (T) measure flux density",
              "B = Φ / A formula relationship",
              "distinction between total volume and intensity"
            ],
            "hint": "Ensure you mention the specific units (Webers and Teslas) and clearly distinguish between the total 'volume' of the field versus its 'intensity' in one spot."
          }
        ]
      }
    },
    {
      "id": "202-5A-spaced-review",
      "type": "spaced-review",
      "order": 10,
      "content": {
        "title": "Foundation Check",
        "questions": [
          {
            "id": "202-5A-SR-1",
            "questionText": "What is the SI unit of measurement for electrical current?",
            "expectedAnswer": [
              "Ampere",
              "Amperes",
              "Amps",
              "A"
            ],
            "hint": "It is named after a French physicist and is often abbreviated to the letter 'A'.",
            "answerType": "short-text"
          },
          {
            "id": "202-5A-SR-2",
            "questionText": "What name is given to a material that easily allows the flow of electric current?",
            "expectedAnswer": [
              "Conductor",
              "Electrical conductor",
              "Conductive"
            ],
            "hint": "Copper and aluminum are common examples used in cables.",
            "answerType": "short-text"
          },
          {
            "id": "202-5A-SR-3",
            "questionText": "Which negatively charged subatomic particle flows through a conductor to create an electric current?",
            "expectedAnswer": [
              "Electron",
              "Electrons"
            ],
            "hint": "These particles orbit the nucleus of an atom and are responsible for charge transfer.",
            "answerType": "short-text"
          }
        ],
        "notes": "Review of fundamental concepts from Unit 202 (Lessons 202.1-202.4) regarding electron flow and conductors."
      }
    }
  ],
  "metadata": {
    "created": "2026-02-09",
    "updated": "2026-02-09",
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
  "total": 96,
  "breakdown": {
    "schemaCompliance": 15,
    "pedagogy": 44,
    "questions": 24,
    "marking": 8,
    "visual": 5,
    "safety": 0
  },
  "details": [
    {
      "section": "beginnerClarityStaging: The mathematical relationship is mentioned in text but lacks...",
      "score": 0,
      "maxScore": 3,
      "issues": [
        "The mathematical relationship is mentioned in text but lacks formal notation."
      ],
      "suggestions": [
        "Modify blocks[5].content.content"
      ],
      "jsonPointers": [
        "/blocks/5/content/content"
      ]
    },
    {
      "section": "beginnerClarityStaging: Vocab definitions omit the standard Greek/Latin symbols used...",
      "score": 0,
      "maxScore": 2,
      "issues": [
        "Vocab definitions omit the standard Greek/Latin symbols used in C&G exams."
      ],
      "suggestions": [
        "Modify blocks[1].content.terms[1].term",
        "Modify blocks[1].content.terms[2].term"
      ],
      "jsonPointers": [
        "/blocks/1/content/terms"
      ]
    },
    {
      "section": "alignment: Missing a worked example for the calculation questions P2 an...",
      "score": 0,
      "maxScore": 3,
      "issues": [
        "Missing a worked example for the calculation questions P2 and P4."
      ],
      "suggestions": [
        "Prepend to blocks[5].content.content: '**Worked Example:**\nA magnet produces 0.5 Wb of flux over an area of 0.25 m². To find the density (B):\n1. Identify values: Φ = 0.5, A = 0.25\n2. Apply formula: B = 0.5 / 0.25\n3. Result: **2 Tesla (T)**\n\n'"
      ],
      "jsonPointers": [
        "/blocks/5/content/content"
      ]
    },
    {
      "section": "beginnerClarityStaging: Incomplete technical description of field lines.",
      "score": 0,
      "maxScore": 2,
      "issues": [
        "Incomplete technical description of field lines."
      ],
      "suggestions": [
        "Modify blocks[3].content.content"
      ],
      "jsonPointers": [
        "/blocks/3/content/content"
      ]
    },
    {
      "section": "markingRobustness: Integrative questions require complex multi-point answers bu...",
      "score": 0,
      "maxScore": 3,
      "issues": [
        "Integrative questions require complex multi-point answers but only provide 3 full-sentence variants."
      ],
      "suggestions": [
        "Append to blocks[8].content.questions[0].expectedAnswer: 'unlike attract like repel flux total density concentration'",
        "Append to blocks[8].content.questions[1].expectedAnswer: 'Weber total Tesla concentration area'"
      ],
      "jsonPointers": [
        "/blocks/8/content/questions/0/expectedAnswer"
      ]
    },
    {
      "section": "markingRobustness: Numeric questions don't specify if the unit should be includ...",
      "score": 0,
      "maxScore": 2,
      "issues": [
        "Numeric questions don't specify if the unit should be included in the answer."
      ],
      "suggestions": [
        "Append to blocks[7].content.questions[1].questionText: ' (Provide the numeric value only)'",
        "Append to blocks[7].content.questions[3].questionText: ' (Provide the numeric value only)'"
      ],
      "jsonPointers": [
        "/blocks/7/content/questions/1/questionText",
        "/blocks/7/content/questions/3/questionText"
      ]
    },
    {
      "section": "beginnerClarityStaging: The 'Common Mistakes' section misses the critical concept of...",
      "score": 0,
      "maxScore": 2,
      "issues": [
        "The 'Common Mistakes' section misses the critical concept of saturation mentioned in 'Why it matters'."
      ],
      "suggestions": [
        "Modify blocks[5].content.content"
      ],
      "jsonPointers": [
        "/blocks/5/content/content"
      ]
    },
    {
      "section": "alignment: The spaced review notes are generic.",
      "score": 0,
      "maxScore": 1,
      "issues": [
        "The spaced review notes are generic."
      ],
      "suggestions": [
        "Change blocks[9].content.notes from '[current value]' to 'Review of fundamental concepts from Unit 202 (Lessons 202.1-202.4) regarding electron flow and conductors.'"
      ],
      "jsonPointers": [
        "/blocks/9/content/notes"
      ]
    },
    {
      "section": "alignment: Question P5 is a simple recall question, missing an opportun...",
      "score": 0,
      "maxScore": 2,
      "issues": [
        "Question P5 is a simple recall question, missing an opportunity to meet Outcome 3 (Classify scenarios)."
      ],
      "suggestions": [
        "Change blocks[7].content.questions[4].questionText from '[current value]' to 'A manufacturer specifies that a magnet produces a total of 0.05 Webers. Is this specification describing 'Magnetic Flux' or 'Magnetic Flux Density'?'"
      ],
      "jsonPointers": [
        "/blocks/7/content/questions/4/questionText"
      ]
    },
    {
      "section": "markingRobustness: Missing common verb-based variants (e.g., 'attract', 'repel'...",
      "score": 0,
      "maxScore": 2,
      "issues": [
        "Missing common verb-based variants (e.g., 'attract', 'repel')."
      ],
      "suggestions": [
        "Append to blocks[4].content.questions[1].expectedAnswer: 'attract'",
        "Append to blocks[4].content.questions[2].expectedAnswer: 'repel'"
      ],
      "jsonPointers": [
        "/blocks/4/content/questions/1/expectedAnswer",
        "/blocks/4/content/questions/2/expectedAnswer"
      ]
    }
  ],
  "grade": "Strong",
  "overallAssessment": "The lesson is well-structured with clear analogies, but requires more rigorous mathematical staging and marking robustness for integrative questions. Specifically, the relationship between flux and flux density needs explicit formula notation and worked examples to support the calculation questions in the practice block."
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
    "pedagogy": 44,
    "questions": 24,
    "marking": 9,
    "visual": 5,
    "safety": 0
  },
  "details": [
    {
      "section": "beginnerClarityStaging: The worked example is placed at the very beginning of the ex...",
      "score": 0,
      "maxScore": 3,
      "issues": [
        "The worked example is placed at the very beginning of the explanation block, before the concepts of flux and density are defined."
      ],
      "suggestions": [
        "Change blocks[5].content.content from '[current value]' to '### In this lesson\nYou will learn to distinguish between the total magnetic field produced and how concentrated that field is in a given space. This is essential for understanding how magnetic components like transformer cores are selected for specific electrical loads.\n\n*   Flux represents the total quantity of magnetic field lines.\n*   Flux density represents the concentration of those lines per unit area.\n*   Different units (Webers and Teslas) are used to measure these distinct properties.\n\n**What this is**\n**Magnetic Flux (Φ)** refers to the total number of magnetic field lines passing through a specific surface. Think of it as the \"total volume\" of magnetism. The SI unit for this is the **Weber (Wb)**. On the other hand, **Magnetic Flux Density (B)** describes how tightly packed those field lines are within a specific area. The relationship is expressed as $B = \\Phi / A$. The SI unit for flux density is the **Tesla (T)**, which is defined as one **Weber (Wb)** per square metre.\n\n**Worked Example:**\nA magnet produces 0.5 Wb of flux over an area of 0.25 m². To find the density (B):\n1. Identify values: Φ = 0.5, A = 0.25\n2. Apply formula: B = Φ / A\n3. Result: **2 Tesla (T)**\n\n**Why it matters**\nIn electrical engineering, we need to know more than just the total amount of magnetism; we need to know if that magnetism is \"strong\" enough to do work. For example, in a transformer, if the **Magnetic Flux Density** becomes too high, the iron core can become **saturated** and stop working efficiently. Choosing the right material and cross-sectional area ensures that the flux is handled correctly without overheating the component.\n\n**Key facts / rules**\n*   **Magnetic Flux (Φ)** is the total amount of magnetic field, measured in **Webers (Wb)**.\n*   **Magnetic Flux Density (B)** is the concentration of the field, measured in **Tesla (T)**.\n*   One **Tesla (T)** is equal to one Weber per square metre (Wb/m²).\n*   If the area decreases but the total flux stays the same, the flux density increases.\n*   If the total flux increases but the area stays the same, the flux density increases.\n*   Flux density is a vector quantity, meaning it has both magnitude and direction.\n\n**How to recognise it**\nTo classify scenarios correctly, look for whether the description focuses on a \"total\" or a \"concentration.\" For example, if a manufacturer states the total output of a magnet, they are describing **Magnetic Flux**. If they describe the strength of the field at the surface of a specific 10mm² sensor, they are describing **Magnetic Flux Density**. A helpful conceptual analogy is rain: the total amount of water falling on a whole garden is the flux, while the amount of water hitting a single square inch of a patio is the flux density. On the diagram, notice that the **magnetic-flux-density** is represented by how closely the lines are drawn together in a specific area.\n\n**Common mistakes**\nLearners often confuse **Magnetic Flux** with **Magnetic Flux Density**; **Magnetic Flux** is the total amount of field lines (measured in Webers) whereas **Magnetic Flux Density** is how concentrated those lines are in a specific area (measured in Tesla). Many people forget that density is dependent on the area the flux is passing through. Learners also forget the concept of **magnetic saturation**, where a material reaches a point where it cannot hold any more flux density, regardless of how much total flux is applied.\n\n**Key Points**\n*   Flux (Wb) = Total amount of magnetic field.\n*   Flux Density (T) = Concentration of field per square metre.\n*   Smaller area with the same flux results in higher density.\n*   Tesla is the unit of measurement for field strength (density).\n\n**Quick recap**\n**Magnetic Flux** (Webers) tells us the total amount of magnetic field lines present. **Magnetic Flux Density** (Tesla) tells us how squashed together those lines are. If you squeeze the same amount of flux into a smaller pipe, the density goes up.\n\n### Coming Up Next\nWith these basics mastered, we will move on to see how electricity can be used to create these magnetic fields in a process called electromagnetism.'"
      ],
      "jsonPointers": [
        "/blocks/4/content/content"
      ]
    },
    {
      "section": "markingRobustness: Missing variants for units in calculation questions.",
      "score": 0,
      "maxScore": 2,
      "issues": [
        "Missing variants for units in calculation questions."
      ],
      "suggestions": [
        "Append to blocks[7].content.questions[1].expectedAnswer: '4T'",
        "Append to blocks[7].content.questions[1].expectedAnswer: '4 Tesla'"
      ],
      "jsonPointers": [
        "/blocks/8/content/questions/1/expectedAnswer"
      ]
    },
    {
      "section": "beginnerClarityStaging: Ambiguous terminology. 'Magnetic Field Strength' is a separa...",
      "score": 0,
      "maxScore": 2,
      "issues": [
        "Ambiguous terminology. 'Magnetic Field Strength' is a separate vector (H) measured in A/m."
      ],
      "suggestions": [
        "Modify blocks[1].content.terms[4].definition"
      ],
      "jsonPointers": [
        "/blocks/1/content/terms/4/definition"
      ]
    },
    {
      "section": "markingRobustness: The integrative expected answer uses a 'keyword soup' which ...",
      "score": 0,
      "maxScore": 2,
      "issues": [
        "The integrative expected answer uses a 'keyword soup' which is poor for qualitative assessment."
      ],
      "suggestions": [
        "Change blocks[8].content.questions[0].expectedAnswer from '[current value]' to 'Like poles repel and unlike poles attract, creating a magnetic field where the total quantity of lines is defined as magnetic flux. Flux density then measures how concentrated those magnetic lines are within a specific cross-sectional area.,Unlike poles attract and like poles repel; these interactions generate magnetic flux (total lines), while the concentration of these lines in an area is called flux density.'"
      ],
      "jsonPointers": [
        "/blocks/8/content/questions/1/expectedAnswer"
      ]
    },
    {
      "section": "beginnerClarityStaging: Missing clarification on non-magnetic materials.",
      "score": 0,
      "maxScore": 2,
      "issues": [
        "Missing clarification on non-magnetic materials."
      ],
      "suggestions": [
        "Modify blocks[3].content.content"
      ],
      "jsonPointers": [
        "/blocks/3/content/content"
      ]
    },
    {
      "section": "markingRobustness: The expected answer is missing the most obvious simple answe...",
      "score": 0,
      "maxScore": 1,
      "issues": [
        "The expected answer is missing the most obvious simple answer: 'the poles'."
      ],
      "suggestions": [
        "Append to blocks[4].content.questions[0].expectedAnswer: 'the poles'",
        "Append to blocks[4].content.questions[0].expectedAnswer: 'magnetic poles'"
      ],
      "jsonPointers": [
        "/blocks/4/content/questions/0/expectedAnswer"
      ]
    },
    {
      "section": "alignment: Calculation is too simple (8/2).",
      "score": 0,
      "maxScore": 2,
      "issues": [
        "Calculation is too simple (8/2)."
      ],
      "suggestions": [
        "Modify blocks[7].content.questions[1].questionText"
      ],
      "jsonPointers": [
        "/blocks/7/content/questions/1/questionText"
      ]
    },
    {
      "section": "beginnerClarityStaging: The rain analogy lacks a 'per area' distinction for the flux...",
      "score": 0,
      "maxScore": 1,
      "issues": [
        "The rain analogy lacks a 'per area' distinction for the flux part."
      ],
      "suggestions": [
        "Modify blocks[5].content.content"
      ],
      "jsonPointers": [
        "/blocks/5/content/content"
      ]
    },
    {
      "section": "questions: Spaced review questions are 'siloed' and don't bridge to the...",
      "score": 0,
      "maxScore": 2,
      "issues": [
        "Spaced review questions are 'siloed' and don't bridge to the current topic."
      ],
      "suggestions": [
        "Modify blocks[9].content.questions[0].questionText"
      ],
      "jsonPointers": [
        "/blocks/9/content/questions/0/questionText"
      ]
    },
    {
      "section": "markingRobustness: Missing common lowercase/misspelling variants for 'repulsion...",
      "score": 0,
      "maxScore": 1,
      "issues": [
        "Missing common lowercase/misspelling variants for 'repulsion'."
      ],
      "suggestions": [
        "Append to blocks[7].content.questions[2].expectedAnswer: 'repulsing'",
        "Append to blocks[7].content.questions[2].expectedAnswer: 'pushing away'"
      ],
      "jsonPointers": [
        "/blocks/7/content/questions/2/expectedAnswer"
      ]
    }
  ],
  "grade": "Strong",
  "overallAssessment": "The lesson is technically sound and follows a logical progression, but suffers from a 'testing before teaching' sequence in the second explanation block where the worked example precedes the theory. Marking robustness in the integrative section needs to transition from keyword lists to structured checklists for better grading accuracy."
}
```

---

## Rewrite Step

### Rewrite Prompt

**Timestamp:** 2026-02-09T10:55:07.406Z
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

ANSWER TYPE RULES (CRITICAL - VALIDATION WILL REJECT IF VIOLATED):
There are ONLY 4 valid answerTypes. Using any other type will cause IMMEDIATE REJECTION.

VALID answerTypes (ONLY THESE):
1. "short-text" - for brief text answers (1-2 sentences)
2. "multiple-choice" - for multiple choice questions
3. "calculation" - for ANY numeric/mathematical questions
4. "true-false" - for true/false questions

FORBIDDEN answerTypes (WILL CAUSE REJECTION):
- "numeric" ❌ WRONG - Use "calculation" instead
- "long-text" ❌ WRONG - Use "short-text" instead
- "essay" ❌ WRONG - Not supported
- "open-ended" ❌ WRONG - Not supported
- ANY other value ❌ WRONG

CRITICAL EXAMPLE - COMMON MISTAKE TO AVOID:
❌ WRONG: { "answerType": "numeric", "questionText": "Calculate..." }
✅ RIGHT: { "answerType": "calculation", "questionText": "Calculate..." }

If you use "numeric", the lesson will be REJECTED and you will have failed.
Use "calculation" for ALL number-based questions without exception.

DO NOT change answerType values - only fix content/pedagogy.
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
  "id": "202-5A",
  "title": "202.5A — Magnetism basics: attraction/repulsion + flux vs flux density",
  "description": "Learn about Magnetism basics: attraction/repulsion + flux vs flux density in Science 2365 Level 2",
  "layout": "split-vis",
  "unit": "Unit 202",
  "topic": "Magnetism basics: attraction/repulsion + flux vs flux density",
  "learningOutcomes": [
    "State the laws of attraction and repulsion between like and unlike magnetic poles",
    "Explain the difference between magnetic flux and magnetic flux density using conceptual analogies",
    "Classify scenarios as describing either the total amount of flux or the concentration of flux density"
  ],
  "prerequisites": [],
  "blocks": [
    {
      "id": "202-5A-outcomes",
      "type": "outcomes",
      "order": 1,
      "content": {
        "outcomes": [
          {
            "text": "State the laws of attraction and repulsion between like and unlike magnetic poles",
            "bloomLevel": "remember"
          },
          {
            "text": "Explain the difference between magnetic flux and magnetic flux density using conceptual analogies",
            "bloomLevel": "understand"
          },
          {
            "text": "Classify scenarios as describing either the total amount of flux or the concentration of flux density",
            "bloomLevel": "apply"
          }
        ]
      }
    },
    {
      "id": "202-5A-vocab",
      "type": "vocab",
      "order": 2,
      "content": {
        "terms": [
          {
            "term": "Magnetic Poles",
            "definition": "The regions at the ends of a magnet where the magnetic force is most concentrated, designated as North and South poles."
          },
          {
            "term": "Magnetic Flux",
            "definition": "The total amount of magnetic field lines produced by a source, measured in Webers (Wb), not the concentration of those lines in a specific area."
          },
          {
            "term": "Magnetic Flux Density",
            "definition": "The concentration of magnetic field lines passing through a specific unit area, measured in Tesla (T), which represents the strength of the magnetic field."
          },
          {
            "term": "Weber (Wb)",
            "definition": "The SI unit used to measure total magnetic flux, representing the entire quantity of magnetic lines of force."
          },
          {
            "term": "Tesla (T)",
            "definition": "The SI unit used to measure magnetic flux density, defined as one Weber per square metre."
          }
        ]
      }
    },
    {
      "id": "202-5A-diagram",
      "type": "diagram",
      "order": 3,
      "content": {
        "title": "Magnetism basics: attraction/repulsion + flux vs flux density Diagram",
        "description": "Visual representation of Magnetism basics: attraction/repulsion + flux vs flux density",
        "videoUrl": "",
        "diagramType": "concept",
        "elementIds": [
          "magnetic-poles",
          "magnetic-flux",
          "magnetic-flux-density",
          "north-pole",
          "south-pole"
        ],
        "placeholderText": "The diagram should feature two bar magnets. The first part shows the law of attraction/repulsion: two magnets with 'N' and 'S' labels (magnetic-poles). One pair should show 'N' facing 'S' with arrows pointing together (attraction), and another showing 'N' facing 'N' with arrows pointing apart (repulsion). The second part of the diagram should illustrate a single magnet with field lines (magnetic-flux) looping from the north-pole to the south-pole. A highlighted square area near the pole should show many lines packed together to represent high magnetic-flux-density, while a square of the same size further away shows fewer lines to represent lower density."
      }
    },
    {
      "id": "202-5A-explain-1",
      "type": "explanation",
      "order": 4,
      "content": {
        "title": "Magnetic Poles and Interaction",
        "content": "### In this lesson\nThis lesson introduces the fundamental behavior of magnets and how they interact with one another. You are exploring this in the context of basic electrical science, which forms the foundation for understanding how motors and transformers work in an installation. \n\n*   Magnets always possess two distinct regions of force.\n*   Like poles push away from each other.\n*   Unlike poles pull toward each other.\n\n**What this is**\nMagnetism is a physical phenomenon produced by the motion of electric charge, resulting in attractive and repulsive forces between objects. Every magnet has two specific ends known as **Magnetic Poles**. These are designated as the North pole and the South pole. Even if you were to cut a magnet in half, each piece would still develop its own North and South poles. The area surrounding these poles where the magnetic force can be detected is known as the magnetic field. \n\n**Why it matters**\nUnderstanding how **Magnetic Poles** interact is critical for an electrician because it explains the mechanical rotation in electric motors. By using the laws of attraction and repulsion, we can force a motor's internal components to move. Furthermore, this knowledge is essential when identifying how protective devices like circuit breakers use magnetic trip elements to disconnect a circuit during a fault. \n\n**Key facts / rules**\n*   Every magnet must have a North pole and a South pole.\n*   The law of attraction states that unlike poles (North and South) will pull toward each other.\n*   The law of repulsion states that like poles (North and North, or South and South) will push away from each other.\n*   Magnetic field lines are typically illustrated as exiting the North pole and entering the South pole.\n*   The magnetic force is strongest at the poles and weakens as you move further away.\n*   Magnetic materials, such as iron or steel, are attracted to either pole of a magnet.\n\n**How to recognise it**\nTo recognise the interaction between magnets, you look for the direction of the physical force being applied. If you bring two magnets together and feel a resisting force that prevents them from touching, you are observing repulsion between like poles. Conversely, if the magnets snap together with force, you are observing attraction between unlike poles. On the diagram, notice that the **north-pole** and **south-pole** labels indicate the specific regions where the magnetic force is most concentrated. You can also recognise these interactions through the behavior of a compass needle, which is itself a small magnet that aligns its poles with the Earth's magnetic field.\n\n**Common mistakes**\nLearners often confuse **attraction** with **repulsion**; **attraction** is the pulling together of unlike poles whereas **repulsion** is the pushing apart of like poles. Another common error is assuming that a magnet only has one pole or that the poles can be separated, which is physically impossible in standard electrical applications.\n\n**Key Points**\n*   Magnets always have two poles: North and South.\n*   Like poles repel; unlike poles attract.\n*   The magnetic field is the region where these forces act.\n*   Force is most concentrated at the poles themselves.\n\n**Quick recap**\nMagnets interact based on their poles. Like poles always push apart (repulsion), while opposite poles always pull together (attraction). These forces are the strongest at the ends of the magnet, which we call the North and South poles.\n\n### Coming Up Next\nNow that you understand how poles interact, we will look at how we measure the \"amount\" and \"concentration\" of the magnetic field using flux and flux density."
      }
    },
    {
      "id": "202-5A-check-1",
      "type": "practice",
      "order": 4.5,
      "content": {
        "title": "Check Your Understanding: Magnetic Poles and Interaction",
        "mode": "conceptual",
        "sequential": true,
        "questions": [
          {
            "id": "202-5A-C1-L1-A",
            "questionText": "According to the diagram, what do the north-pole and south-pole labels indicate about the magnetic force?",
            "answerType": "short-text",
            "cognitiveLevel": "recall",
            "expectedAnswer": [
              "magnetic force is most concentrated",
              "force is most concentrated",
              "where the magnetic force is most concentrated"
            ],
            "hint": "Look at the description of the labels in the 'How to recognise it' section."
          },
          {
            "id": "202-5A-C1-L1-B",
            "questionText": "What term describes the interaction when unlike poles pull toward each other?",
            "answerType": "short-text",
            "cognitiveLevel": "recall",
            "expectedAnswer": [
              "attraction",
              "magnetic attraction",
              "pulling together"
            ],
            "hint": "This is the opposite of pushing apart."
          },
          {
            "id": "202-5A-C1-L1-C",
            "questionText": "What term describes the interaction when like poles push away from each other?",
            "answerType": "short-text",
            "cognitiveLevel": "recall",
            "expectedAnswer": [
              "repulsion",
              "magnetic repulsion",
              "pushing apart"
            ],
            "hint": "This occurs when two North poles or two South poles are brought together."
          },
          {
            "id": "202-5A-C1-L2",
            "questionText": "Using your answers to Q1 (concentrated force), Q2 (attraction), and Q3 (repulsion), explain how magnetic poles determine the physical movement of objects.",
            "answerType": "short-text",
            "cognitiveLevel": "connection",
            "expectedAnswer": [
              "the concentrated force at the poles causes magnets to either pull together through attraction or push apart through repulsion",
              "magnets move because the concentrated force at their poles creates attraction between unlike poles and repulsion between like poles",
              "attraction and repulsion are the forces most concentrated at the poles that cause magnetic movement"
            ],
            "hint": "Think about how the location of the force and the type of interaction work together to create movement."
          }
        ]
      }
    },
    {
      "id": "202-5A-explain-2",
      "type": "explanation",
      "order": 5,
      "content": {
        "title": "Magnetic Flux vs. Flux Density",
        "content": "### In this lesson\nYou will learn to distinguish between the total magnetic field produced and how concentrated that field is in a given space. This is essential for understanding how magnetic components like transformer cores are selected for specific electrical loads.\n\n*   Flux represents the total quantity of magnetic field lines.\n*   Flux density represents the concentration of those lines per unit area.\n*   Different units (Webers and Teslas) are used to measure these distinct properties.\n\n**What this is**\n**Magnetic Flux** refers to the total number of magnetic field lines passing through a specific surface. Think of it as the \"total volume\" of magnetism. The SI unit for this is the **Weber (Wb)**. On the other hand, **Magnetic Flux Density** describes how tightly packed those field lines are within a specific area. It is a measure of the strength of the magnetic field at a particular point. The SI unit for flux density is the **Tesla (T)**, which is defined as one **Weber (Wb)** per square metre.\n\n**Why it matters**\nIn electrical engineering, we need to know more than just the total amount of magnetism; we need to know if that magnetism is \"strong\" enough to do work. For example, in a transformer, if the **Magnetic Flux Density** becomes too high, the iron core can become saturated and stop working efficiently. Choosing the right material and cross-sectional area ensures that the flux is handled correctly without overheating the component.\n\n**Key facts / rules**\n*   **Magnetic Flux** is the total amount of magnetic field, measured in **Webers (Wb)**.\n*   **Magnetic Flux Density** is the concentration of the field, measured in **Tesla (T)**.\n*   One **Tesla (T)** is equal to one Weber per square metre (Wb/m²).\n*   If the area decreases but the total flux stays the same, the flux density increases.\n*   If the total flux increases but the area stays the same, the flux density increases.\n*   Flux density is a vector quantity, meaning it has both magnitude and direction.\n\n**How to recognise it**\nTo classify scenarios correctly, look for whether the description focuses on a \"total\" or a \"concentration.\" For example, if a manufacturer states the total output of a magnet, they are describing **Magnetic Flux**. If they describe the strength of the field at the surface of a specific 10mm² sensor, they are describing **Magnetic Flux Density**. A helpful conceptual analogy is rain: the total amount of water falling on a whole garden is the flux, while the amount of water hitting a single square inch of a patio is the flux density. On the diagram, notice that the **magnetic-flux-density** is represented by how closely the lines are drawn together in a specific area.\n\n**Common mistakes**\nLearners often confuse **Magnetic Flux** with **Magnetic Flux Density**; **Magnetic Flux** is the total amount of field lines (measured in Webers) whereas **Magnetic Flux Density** is how concentrated those lines are in a specific area (measured in Tesla). Many people forget that density is dependent on the area the flux is passing through.\n\n**Key Points**\n*   Flux (Wb) = Total amount of magnetic field.\n*   Flux Density (T) = Concentration of field per square metre.\n*   Smaller area with the same flux results in higher density.\n*   Tesla is the unit of measurement for field strength (density).\n\n**Quick recap**\n**Magnetic Flux** (Webers) tells us the total amount of magnetic field lines present. **Magnetic Flux Density** (Tesla) tells us how squashed together those lines are. If you squeeze the same amount of flux into a smaller pipe, the density goes up.\n\n### Coming Up Next\nWith these basics mastered, we will move on to see how electricity can be used to create these magnetic fields in a process called electromagnetism."
      }
    },
    {
      "id": "202-5A-check-2",
      "type": "practice",
      "order": 5.5,
      "content": {
        "title": "Check Your Understanding: Magnetic Flux vs. Flux Density",
        "mode": "conceptual",
        "sequential": true,
        "questions": [
          {
            "id": "202-5A-C2-L1-A",
            "questionText": "On the diagram, how is the magnetic-flux-density visually represented?",
            "answerType": "short-text",
            "cognitiveLevel": "recall",
            "expectedAnswer": [
              "how closely the lines are drawn together",
              "closely drawn lines",
              "lines are drawn together"
            ],
            "hint": "Look for the description of the diagram in the 'How to recognise it' section."
          },
          {
            "id": "202-5A-C2-L1-B",
            "questionText": "Identify the term for the total amount of field lines measured in Webers.",
            "answerType": "short-text",
            "cognitiveLevel": "recall",
            "expectedAnswer": [
              "Magnetic Flux",
              "flux",
              "total flux"
            ],
            "hint": "This represents the total volume of the magnetic field."
          },
          {
            "id": "202-5A-C2-L1-C",
            "questionText": "Identify the term for how concentrated those lines are in a specific area measured in Tesla.",
            "answerType": "short-text",
            "cognitiveLevel": "recall",
            "expectedAnswer": [
              "Magnetic Flux Density",
              "flux density",
              "density"
            ],
            "hint": "This describes the strength of the field at a particular point."
          },
          {
            "id": "202-5A-C2-L2",
            "questionText": "Using your answers to Q1 (line closeness), Q2 (Magnetic Flux), and Q3 (Magnetic Flux Density), explain the relationship between the total field and its concentration.",
            "answerType": "short-text",
            "cognitiveLevel": "connection",
            "expectedAnswer": [
              "Magnetic Flux Density measures how the total Magnetic Flux is concentrated in an area, which is shown by how closely the lines are drawn together",
              "the total Magnetic Flux becomes Magnetic Flux Density when it is concentrated into a specific area as indicated by the closeness of the lines",
              "line closeness represents the Magnetic Flux Density which is the concentration of the total Magnetic Flux lines"
            ],
            "hint": "Connect the total quantity of lines to how they are packed into a specific area."
          }
        ]
      }
    },
    {
      "id": "202-5A-practice",
      "type": "practice",
      "order": 8,
      "content": {
        "title": "Magnetic Principles Practice",
        "questions": [
          {
            "id": "202-5A-P1",
            "questionText": "Identify the specific regions at the ends of a magnet where the magnetic force is most concentrated.",
            "answerType": "short-text",
            "expectedAnswer": [
              "Magnetic Poles",
              "the magnetic poles",
              "poles"
            ],
            "hint": "These are designated as North and South."
          },
          {
            "id": "202-5A-P2",
            "questionText": "A transformer core has a total magnetic flux of 8 Webers distributed over a cross-sectional area of 2 square metres. Calculate the magnetic flux density. (Round to the nearest whole number)",
            "answerType": "numeric",
            "expectedAnswer": [
              "4",
              "4.0"
            ],
            "hint": "Flux Density is Webers per square metre (Wb/m²). Result is in Tesla (T)."
          },
          {
            "id": "202-5A-P3",
            "questionText": "An electrician is installing a magnetic door lock. If the North pole of the door magnet is brought directly towards the North pole of the frame magnet, what physical force will occur between them?",
            "answerType": "short-text",
            "expectedAnswer": [
              "Repulsion",
              "magnetic repulsion",
              "repelling force"
            ],
            "hint": "Consider the law regarding 'like' poles."
          },
          {
            "id": "202-5A-P4",
            "questionText": "A magnetic field is measured to have a flux density of 10 Tesla acting over an area of 0.5 square metres. What is the total magnetic flux produced? (Round to the nearest whole number)",
            "answerType": "numeric",
            "expectedAnswer": [
              "5",
              "5.0"
            ],
            "hint": "If 1 Tesla = 1 Weber per 1m², multiply the density by the area. Result is in Webers (Wb)."
          },
          {
            "id": "202-5A-P5",
            "questionText": "Which SI unit is used to measure the total quantity of magnetic lines of force, representing the 'total volume' of magnetism?",
            "answerType": "short-text",
            "expectedAnswer": [
              "Weber",
              "the Weber",
              "Wb"
            ],
            "hint": "This unit is distinct from the Tesla, which measures concentration."
          }
        ]
      }
    },
    {
      "id": "202-5A-integrative",
      "type": "practice",
      "order": 9.5,
      "content": {
        "title": "Putting It All Together",
        "mode": "integrative",
        "sequential": true,
        "questions": [
          {
            "id": "202-5A-INT-1",
            "questionText": "Explain how the interaction between magnetic poles relates to the measurement of a magnetic field. In your answer, include: (1) the laws of attraction and repulsion, (2) magnetic flux as a total quantity, (3) how flux density describes the field's concentration. (2-3 sentences)",
            "answerType": "short-text",
            "cognitiveLevel": "connection",
            "expectedAnswer": [
              "Like poles repel and unlike poles attract, creating a magnetic field where the total quantity of lines is defined as magnetic flux. Flux density then measures how concentrated those magnetic lines are within a specific cross-sectional area.",
              "When unlike poles attract or like poles repel, they produce magnetic flux representing the total field lines. Flux density describes the concentration of this flux in a given space, indicating the local strength of the magnetic interaction.",
              "Magnetic flux is the total amount of field produced by the interaction of like or unlike poles. Flux density describes how tightly packed or concentrated that total flux is within a specific area."
            ],
            "hint": "Think about how the behavior of poles creates a field and the two different ways we measure the 'amount' versus the 'tightness' of that field."
          },
          {
            "id": "202-5A-INT-2",
            "questionText": "Summarize the relationship between magnetic behavior and the units used to measure magnetic properties. In your answer, include: (1) behavior of like and unlike poles, (2) the definition of flux in Webers, (3) the definition of flux density in Teslas, (4) how concentration differs from total amount. Answer in 3-4 sentences OR concise bullet points.",
            "answerType": "short-text",
            "cognitiveLevel": "synthesis",
            "expectedAnswer": [
              "Magnets interact such that like poles repel and unlike poles attract. The total quantity of the resulting magnetic field is flux, measured in Webers, whereas flux density, measured in Teslas, describes the concentration of those lines per unit area. This distinguishes the total magnetic output from how 'packed' the field is in a specific component like a transformer core.",
              "1. Like poles repel and unlike poles attract to create a field. 2. Magnetic flux is the total number of field lines measured in Webers. 3. Flux density is the concentration of these lines per square meter, measured in Teslas. 4. Flux represents the total amount of magnetism, while density represents its concentration in a specific area.",
              "Magnetic poles exert force where like poles repel and unlike poles attract. This force is measured as total magnetic flux in Webers, while the concentration of that force per unit area is called flux density, measured in Teslas. Understanding both is necessary to distinguish between the total field available and how intense that field is in a given space."
            ],
            "hint": "Ensure you mention the specific units (Webers and Teslas) and clearly distinguish between the total 'volume' of the field versus its 'intensity' in one spot."
          }
        ]
      }
    },
    {
      "id": "202-5A-spaced-review",
      "type": "spaced-review",
      "order": 10,
      "content": {
        "title": "Foundation Check",
        "questions": [
          {
            "id": "202-5A-SR-1",
            "questionText": "What is the SI unit of measurement for electrical current?",
            "expectedAnswer": [
              "Ampere",
              "Amperes",
              "Amps",
              "A"
            ],
            "hint": "It is named after a French physicist and is often abbreviated to the letter 'A'.",
            "answerType": "short-text"
          },
          {
            "id": "202-5A-SR-2",
            "questionText": "What name is given to a material that easily allows the flow of electric current?",
            "expectedAnswer": [
              "Conductor",
              "Electrical conductor",
              "Conductive"
            ],
            "hint": "Copper and aluminum are common examples used in cables.",
            "answerType": "short-text"
          },
          {
            "id": "202-5A-SR-3",
            "questionText": "Which negatively charged subatomic particle flows through a conductor to create an electric current?",
            "expectedAnswer": [
              "Electron",
              "Electrons"
            ],
            "hint": "These particles orbit the nucleus of an atom and are responsible for charge transfer.",
            "answerType": "short-text"
          }
        ],
        "notes": "Foundation check before starting Magnetism basics: attraction/repulsion + flux vs flux density"
      }
    }
  ],
  "metadata": {
    "created": "2026-02-09",
    "updated": "2026-02-09",
    "version": "1.0",
    "author": "C&G 2365 Learning Team"
  }
}

SCORING REPORT (issues + suggestions):
Total Score: 96/100 (Strong)

OVERALL ASSESSMENT:
The lesson is well-structured with clear analogies, but requires more rigorous mathematical staging and marking robustness for integrative questions. Specifically, the relationship between flux and flux density needs explicit formula notation and worked examples to support the calculation questions in the practice block.

Issues by Section:

## beginnerClarityStaging: The mathematical relationship is mentioned in text but lacks... (0/3)
- Issue: The mathematical relationship is mentioned in text but lacks formal notation.
  Suggestion: Modify blocks[5].content.content

## beginnerClarityStaging: Vocab definitions omit the standard Greek/Latin symbols used... (0/2)
- Issue: Vocab definitions omit the standard Greek/Latin symbols used in C&G exams.
  Suggestion: Modify blocks[1].content.terms[1].term

## alignment: Missing a worked example for the calculation questions P2 an... (0/3)
- Issue: Missing a worked example for the calculation questions P2 and P4.
  Suggestion: Prepend to blocks[5].content.content: '**Worked Example:**
A magnet produces 0.5 Wb of flux over an area of 0.25 m². To find the density (B):
1. Identify values: Φ = 0.5, A = 0.25
2. Apply formula: B = 0.5 / 0.25
3. Result: **2 Tesla (T)**

'

## beginnerClarityStaging: Incomplete technical description of field lines. (0/2)
- Issue: Incomplete technical description of field lines.
  Suggestion: Modify blocks[3].content.content

## markingRobustness: Integrative questions require complex multi-point answers bu... (0/3)
- Issue: Integrative questions require complex multi-point answers but only provide 3 full-sentence variants.
  Suggestion: Append to blocks[8].content.questions[0].expectedAnswer: 'unlike attract like repel flux total density concentration'

## markingRobustness: Numeric questions don't specify if the unit should be includ... (0/2)
- Issue: Numeric questions don't specify if the unit should be included in the answer.
  Suggestion: Append to blocks[7].content.questions[1].questionText: ' (Provide the numeric value only)'

## beginnerClarityStaging: The 'Common Mistakes' section misses the critical concept of... (0/2)
- Issue: The 'Common Mistakes' section misses the critical concept of saturation mentioned in 'Why it matters'.
  Suggestion: Modify blocks[5].content.content

## alignment: The spaced review notes are generic. (0/1)
- Issue: The spaced review notes are generic.
  Suggestion: Change blocks[9].content.notes from '[current value]' to 'Review of fundamental concepts from Unit 202 (Lessons 202.1-202.4) regarding electron flow and conductors.'

## alignment: Question P5 is a simple recall question, missing an opportun... (0/2)
- Issue: Question P5 is a simple recall question, missing an opportunity to meet Outcome 3 (Classify scenarios).
  Suggestion: Change blocks[7].content.questions[4].questionText from '[current value]' to 'A manufacturer specifies that a magnet produces a total of 0.05 Webers. Is this specification describing 'Magnetic Flux' or 'Magnetic Flux Density'?'

## markingRobustness: Missing common verb-based variants (e.g., 'attract', 'repel'... (0/2)
- Issue: Missing common verb-based variants (e.g., 'attract', 'repel').
  Suggestion: Append to blocks[4].content.questions[1].expectedAnswer: 'attract'


TASK:
- Produce a refined version of the full lesson JSON that addresses the scoring issues.
- Preserve ALL structural invariants (same blocks, same ids/types/orders, same block count).
- Return ONLY the refined JSON.
```

### Rewrite Output (Raw Model Response)

```json
{
  "id": "202-5A",
  "title": "202.5A — Magnetism basics: attraction/repulsion + flux vs flux density",
  "description": "Learn about Magnetism basics: attraction/repulsion + flux vs flux density in Science 2365 Level 2",
  "layout": "split-vis",
  "unit": "Unit 202",
  "topic": "Magnetism basics: attraction/repulsion + flux vs flux density",
  "learningOutcomes": [
    "State the laws of attraction and repulsion between like and unlike magnetic poles",
    "Explain the difference between magnetic flux and magnetic flux density using conceptual analogies",
    "Classify scenarios as describing either the total amount of flux or the concentration of flux density"
  ],
  "prerequisites": [],
  "blocks": [
    {
      "id": "202-5A-outcomes",
      "type": "outcomes",
      "order": 1,
      "content": {
        "outcomes": [
          {
            "text": "State the laws of attraction and repulsion between like and unlike magnetic poles",
            "bloomLevel": "remember"
          },
          {
            "text": "Explain the difference between magnetic flux and magnetic flux density using conceptual analogies",
            "bloomLevel": "understand"
          },
          {
            "text": "Classify scenarios as describing either the total amount of flux or the concentration of flux density",
            "bloomLevel": "apply"
          }
        ]
      }
    },
    {
      "id": "202-5A-vocab",
      "type": "vocab",
      "order": 2,
      "content": {
        "terms": [
          {
            "term": "Magnetic Poles",
            "definition": "The regions at the ends of a magnet where the magnetic force is most concentrated, designated as North and South poles."
          },
          {
            "term": "Magnetic Flux (Φ)",
            "definition": "The total amount of magnetic field lines produced by a source, measured in Webers (Wb), representing the entire quantity of magnetic lines of force."
          },
          {
            "term": "Magnetic Flux Density (B)",
            "definition": "The concentration of magnetic field lines passing through a specific unit area, measured in Tesla (T), defined as one Weber per square metre."
          },
          {
            "term": "Weber (Wb)",
            "definition": "The SI unit used to measure total magnetic flux (Φ)."
          },
          {
            "term": "Tesla (T)",
            "definition": "The SI unit used to measure magnetic flux density (B), representing the strength of the magnetic field."
          }
        ]
      }
    },
    {
      "id": "202-5A-diagram",
      "type": "diagram",
      "order": 3,
      "content": {
        "title": "Magnetism basics: attraction/repulsion + flux vs flux density Diagram",
        "description": "Visual representation of Magnetism basics: attraction/repulsion + flux vs flux density",
        "videoUrl": "",
        "diagramType": "concept",
        "elementIds": [
          "magnetic-poles",
          "magnetic-flux",
          "magnetic-flux-density",
          "north-pole",
          "south-pole"
        ],
        "placeholderText": "The diagram should feature two bar magnets. The first part shows the law of attraction/repulsion: two magnets with 'N' and 'S' labels (magnetic-poles). One pair should show 'N' facing 'S' with arrows pointing together (attraction), and another showing 'N' facing 'N' with arrows pointing apart (repulsion). The second part of the diagram should illustrate a single magnet with field lines (magnetic-flux) looping from the north-pole to the south-pole. A highlighted square area near the pole should show many lines packed together to represent high magnetic-flux-density, while a square of the same size further away shows fewer lines to represent lower density."
      }
    },
    {
      "id": "202-5A-explain-1",
      "type": "explanation",
      "order": 4,
      "content": {
        "title": "Magnetic Poles and Interaction",
        "content": "### In this lesson\nThis lesson introduces the fundamental behavior of magnets and how they interact with one another. You are exploring this in the context of basic electrical science, which forms the foundation for understanding how motors and transformers work in an installation. \n\n*   Magnets always possess two distinct regions of force.\n*   Like poles push away from each other.\n*   Unlike poles pull toward each other.\n\n**What this is**\nMagnetism is a physical phenomenon produced by the motion of electric charge, resulting in attractive and repulsive forces between objects. Every magnet has two specific ends known as **Magnetic Poles**. These are designated as the North pole and the South pole. Even if you were to cut a magnet in half, each piece would still develop its own North and South poles. The area surrounding these poles where the magnetic force can be detected is known as the magnetic field. \n\n**Why it matters**\nUnderstanding how **Magnetic Poles** interact is critical for an electrician because it explains the mechanical rotation in electric motors. By using the laws of attraction and repulsion, we can force a motor's internal components to move. Furthermore, this knowledge is essential when identifying how protective devices like circuit breakers use magnetic trip elements to disconnect a circuit during a fault. \n\n**Key facts / rules**\n*   Every magnet must have a North pole and a South pole.\n*   The law of attraction states that unlike poles (North and South) will pull toward each other.\n*   The law of repulsion states that like poles (North and North, or South and South) will push away from each other.\n*   Magnetic field lines never cross, form continuous loops, and are conventionally shown flowing from the North pole to the South pole externally.\n*   The magnetic force is strongest at the poles and weakens as you move further away.\n*   Magnetic materials, such as iron or steel, are attracted to either pole of a magnet.\n\n**How to recognise it**\nTo recognise the interaction between magnets, you look for the direction of the physical force being applied. If you bring two magnets together and feel a resisting force that prevents them from touching, you are observing repulsion between like poles. Conversely, if the magnets snap together with force, you are observing attraction between unlike poles. On the diagram, notice that the **north-pole** and **south-pole** labels indicate the specific regions where the magnetic force is most concentrated. You can also recognise these interactions through the behavior of a compass needle, which is itself a small magnet that aligns its poles with the Earth's magnetic field.\n\n**Common mistakes**\nLearners often confuse **attraction** with **repulsion**; **attraction** is the pulling together of unlike poles whereas **repulsion** is the pushing apart of like poles. Another common error is assuming that a magnet only has one pole or that the poles can be separated, which is physically impossible in standard electrical applications.\n\n**Key Points**\n*   Magnets always have two poles: North and South.\n*   Like poles repel; unlike poles attract.\n*   The magnetic field is the region where these forces act.\n*   Force is most concentrated at the poles themselves.\n\n**Quick recap**\nMagnets interact based on their poles. Like poles always push apart (repulsion), while opposite poles always pull together (attraction). These forces are the strongest at the ends of the magnet, which we call the North and South poles.\n\n### Coming Up Next\nNow that you understand how poles interact, we will look at how we measure the \"amount\" and \"concentration\" of the magnetic field using flux and flux density."
      }
    },
    {
      "id": "202-5A-check-1",
      "type": "practice",
      "order": 4.5,
      "content": {
        "title": "Check Your Understanding: Magnetic Poles and Interaction",
        "mode": "conceptual",
        "sequential": true,
        "questions": [
          {
            "id": "202-5A-C1-L1-A",
            "questionText": "According to the diagram, what do the north-pole and south-pole labels indicate about the magnetic force?",
            "answerType": "short-text",
            "cognitiveLevel": "recall",
            "expectedAnswer": [
              "magnetic force is most concentrated",
              "force is most concentrated",
              "where the magnetic force is most concentrated"
            ],
            "hint": "Look at the description of the labels in the 'How to recognise it' section."
          },
          {
            "id": "202-5A-C1-L1-B",
            "questionText": "What term describes the interaction when unlike poles pull toward each other?",
            "answerType": "short-text",
            "cognitiveLevel": "recall",
            "expectedAnswer": [
              "attraction",
              "magnetic attraction",
              "pulling together",
              "attract"
            ],
            "hint": "This is the opposite of pushing apart."
          },
          {
            "id": "202-5A-C1-L1-C",
            "questionText": "What term describes the interaction when like poles push away from each other?",
            "answerType": "short-text",
            "cognitiveLevel": "recall",
            "expectedAnswer": [
              "repulsion",
              "magnetic repulsion",
              "pushing apart",
              "repel"
            ],
            "hint": "This occurs when two North poles or two South poles are brought together."
          },
          {
            "id": "202-5A-C1-L2",
            "questionText": "Using your answers to Q1 (concentrated force), Q2 (attraction), and Q3 (repulsion), explain how magnetic poles determine the physical movement of objects.",
            "answerType": "short-text",
            "cognitiveLevel": "connection",
            "expectedAnswer": [
              "the concentrated force at the poles causes magnets to either pull together through attraction or push apart through repulsion",
              "magnets move because the concentrated force at their poles creates attraction between unlike poles and repulsion between like poles",
              "attraction and repulsion are the forces most concentrated at the poles that cause magnetic movement"
            ],
            "hint": "Think about how the location of the force and the type of interaction work together to create movement."
          }
        ]
      }
    },
    {
      "id": "202-5A-explain-2",
      "type": "explanation",
      "order": 5,
      "content": {
        "title": "Magnetic Flux vs. Flux Density",
        "content": "**Worked Example:**\nA magnet produces 0.5 Wb of flux over an area of 0.25 m². To find the density (B):\n1. Identify values: Φ = 0.5, A = 0.25\n2. Apply formula: B = Φ / A\n3. Result: **2 Tesla (T)**\n\n### In this lesson\nYou will learn to distinguish between the total magnetic field produced and how concentrated that field is in a given space. This is essential for understanding how magnetic components like transformer cores are selected for specific electrical loads.\n\n*   Flux represents the total quantity of magnetic field lines.\n*   Flux density represents the concentration of those lines per unit area.\n*   Different units (Webers and Teslas) are used to measure these distinct properties.\n\n**What this is**\n**Magnetic Flux (Φ)** refers to the total number of magnetic field lines passing through a specific surface. Think of it as the \"total volume\" of magnetism. The SI unit for this is the **Weber (Wb)**. On the other hand, **Magnetic Flux Density (B)** describes how tightly packed those field lines are within a specific area. The relationship is expressed as $B = \\Phi / A$. The SI unit for flux density is the **Tesla (T)**, which is defined as one **Weber (Wb)** per square metre.\n\n**Why it matters**\nIn electrical engineering, we need to know more than just the total amount of magnetism; we need to know if that magnetism is \"strong\" enough to do work. For example, in a transformer, if the **Magnetic Flux Density** becomes too high, the iron core can become **saturated** and stop working efficiently. Choosing the right material and cross-sectional area ensures that the flux is handled correctly without overheating the component.\n\n**Key facts / rules**\n*   **Magnetic Flux (Φ)** is the total amount of magnetic field, measured in **Webers (Wb)**.\n*   **Magnetic Flux Density (B)** is the concentration of the field, measured in **Tesla (T)**.\n*   One **Tesla (T)** is equal to one Weber per square metre (Wb/m²).\n*   If the area decreases but the total flux stays the same, the flux density increases.\n*   If the total flux increases but the area stays the same, the flux density increases.\n*   Flux density is a vector quantity, meaning it has both magnitude and direction.\n\n**How to recognise it**\nTo classify scenarios correctly, look for whether the description focuses on a \"total\" or a \"concentration.\" For example, if a manufacturer states the total output of a magnet, they are describing **Magnetic Flux**. If they describe the strength of the field at the surface of a specific 10mm² sensor, they are describing **Magnetic Flux Density**. A helpful conceptual analogy is rain: the total amount of water falling on a whole garden is the flux, while the amount of water hitting a single square inch of a patio is the flux density. On the diagram, notice that the **magnetic-flux-density** is represented by how closely the lines are drawn together in a specific area.\n\n**Common mistakes**\nLearners often confuse **Magnetic Flux** with **Magnetic Flux Density**; **Magnetic Flux** is the total amount of field lines (measured in Webers) whereas **Magnetic Flux Density** is how concentrated those lines are in a specific area (measured in Tesla). Many people forget that density is dependent on the area the flux is passing through. Learners also forget the concept of **magnetic saturation**, where a material reaches a point where it cannot hold any more flux density, regardless of how much total flux is applied.\n\n**Key Points**\n*   Flux (Wb) = Total amount of magnetic field.\n*   Flux Density (T) = Concentration of field per square metre.\n*   Smaller area with the same flux results in higher density.\n*   Tesla is the unit of measurement for field strength (density).\n\n**Quick recap**\n**Magnetic Flux** (Webers) tells us the total amount of magnetic field lines present. **Magnetic Flux Density** (Tesla) tells us how squashed together those lines are. If you squeeze the same amount of flux into a smaller pipe, the density goes up.\n\n### Coming Up Next\nWith these basics mastered, we will move on to see how electricity can be used to create these magnetic fields in a process called electromagnetism."
      }
    },
    {
      "id": "202-5A-check-2",
      "type": "practice",
      "order": 5.5,
      "content": {
        "title": "Check Your Understanding: Magnetic Flux vs. Flux Density",
        "mode": "conceptual",
        "sequential": true,
        "questions": [
          {
            "id": "202-5A-C2-L1-A",
            "questionText": "On the diagram, how is the magnetic-flux-density visually represented?",
            "answerType": "short-text",
            "cognitiveLevel": "recall",
            "expectedAnswer": [
              "how closely the lines are drawn together",
              "closely drawn lines",
              "lines are drawn together"
            ],
            "hint": "Look for the description of the diagram in the 'How to recognise it' section."
          },
          {
            "id": "202-5A-C2-L1-B",
            "questionText": "Identify the term for the total amount of field lines measured in Webers.",
            "answerType": "short-text",
            "cognitiveLevel": "recall",
            "expectedAnswer": [
              "Magnetic Flux",
              "flux",
              "total flux"
            ],
            "hint": "This represents the total volume of the magnetic field."
          },
          {
            "id": "202-5A-C2-L1-C",
            "questionText": "Identify the term for how concentrated those lines are in a specific area measured in Tesla.",
            "answerType": "short-text",
            "cognitiveLevel": "recall",
            "expectedAnswer": [
              "Magnetic Flux Density",
              "flux density",
              "density"
            ],
            "hint": "This describes the strength of the field at a particular point."
          },
          {
            "id": "202-5A-C2-L2",
            "questionText": "Using your answers to Q1 (line closeness), Q2 (Magnetic Flux), and Q3 (Magnetic Flux Density), explain the relationship between the total field and its concentration.",
            "answerType": "short-text",
            "cognitiveLevel": "connection",
            "expectedAnswer": [
              "Magnetic Flux Density measures how the total Magnetic Flux is concentrated in an area, which is shown by how closely the lines are drawn together",
              "the total Magnetic Flux becomes Magnetic Flux Density when it is concentrated into a specific area as indicated by the closeness of the lines",
              "line closeness represents the Magnetic Flux Density which is the concentration of the total Magnetic Flux lines"
            ],
            "hint": "Connect the total quantity of lines to how they are packed into a specific area."
          }
        ]
      }
    },
    {
      "id": "202-5A-practice",
      "type": "practice",
      "order": 8,
      "content": {
        "title": "Magnetic Principles Practice",
        "questions": [
          {
            "id": "202-5A-P1",
            "questionText": "Identify the specific regions at the ends of a magnet where the magnetic force is most concentrated.",
            "answerType": "short-text",
            "expectedAnswer": [
              "Magnetic Poles",
              "the magnetic poles",
              "poles"
            ],
            "hint": "These are designated as North and South."
          },
          {
            "id": "202-5A-P2",
            "questionText": "A transformer core has a total magnetic flux of 8 Webers distributed over a cross-sectional area of 2 square metres. Calculate the magnetic flux density. (Round to the nearest whole number and provide the numeric value only)",
            "answerType": "calculation",
            "expectedAnswer": [
              "4",
              "4.0"
            ],
            "hint": "Flux Density is Webers per square metre (Wb/m²). Result is in Tesla (T)."
          },
          {
            "id": "202-5A-P3",
            "questionText": "An electrician is installing a magnetic door lock. If the North pole of the door magnet is brought directly towards the North pole of the frame magnet, what physical force will occur between them?",
            "answerType": "short-text",
            "expectedAnswer": [
              "Repulsion",
              "magnetic repulsion",
              "repelling force",
              "repel"
            ],
            "hint": "Consider the law regarding 'like' poles."
          },
          {
            "id": "202-5A-P4",
            "questionText": "A magnetic field is measured to have a flux density of 10 Tesla acting over an area of 0.5 square metres. What is the total magnetic flux produced? (Round to the nearest whole number and provide the numeric value only)",
            "answerType": "calculation",
            "expectedAnswer": [
              "5",
              "5.0"
            ],
            "hint": "If 1 Tesla = 1 Weber per 1m², multiply the density by the area. Result is in Webers (Wb)."
          },
          {
            "id": "202-5A-P5",
            "questionText": "A manufacturer specifies that a magnet produces a total of 0.05 Webers. Is this specification describing 'Magnetic Flux' or 'Magnetic Flux Density'?",
            "answerType": "short-text",
            "expectedAnswer": [
              "Magnetic Flux",
              "flux",
              "total flux"
            ],
            "hint": "This unit is distinct from the Tesla, which measures concentration."
          }
        ]
      }
    },
    {
      "id": "202-5A-integrative",
      "type": "practice",
      "order": 9.5,
      "content": {
        "title": "Putting It All Together",
        "mode": "integrative",
        "sequential": true,
        "questions": [
          {
            "id": "202-5A-INT-1",
            "questionText": "Explain how the interaction between magnetic poles relates to the measurement of a magnetic field. In your answer, include: (1) the laws of attraction and repulsion, (2) magnetic flux as a total quantity, (3) how flux density describes the field's concentration.",
            "answerType": "short-text",
            "cognitiveLevel": "connection",
            "expectedAnswer": [
              "Like poles repel and unlike poles attract, creating a magnetic field where the total quantity of lines is defined as magnetic flux. Flux density then measures how concentrated those magnetic lines are within a specific cross-sectional area.",
              "When unlike poles attract or like poles repel, they produce magnetic flux representing the total field lines. Flux density describes the concentration of this flux in a given space, indicating the local strength of the magnetic interaction.",
              "unlike attract like repel flux total density concentration"
            ],
            "hint": "Think about how the behavior of poles creates a field and the two different ways we measure the 'amount' versus the 'tightness' of that field."
          },
          {
            "id": "202-5A-INT-2",
            "questionText": "Summarize the relationship between magnetic behavior and the units used to measure magnetic properties. In your answer, include: (1) behavior of like and unlike poles, (2) the definition of flux in Webers, (3) the definition of flux density in Teslas, (4) how concentration differs from total amount. Answer in 3-4 sentences OR concise bullet points.",
            "answerType": "short-text",
            "cognitiveLevel": "synthesis",
            "expectedAnswer": [
              "like poles repel and unlike poles attract",
              "magnetic flux (Φ) is the total field quantity",
              "Webers (Wb) measure total flux",
              "flux density (B) is concentration per area",
              "Teslas (T) measure flux density",
              "B = Φ / A formula relationship",
              "distinction between total volume and intensity"
            ],
            "hint": "Ensure you mention the specific units (Webers and Teslas) and clearly distinguish between the total 'volume' of the field versus its 'intensity' in one spot."
          }
        ]
      }
    },
    {
      "id": "202-5A-spaced-review",
      "type": "spaced-review",
      "order": 10,
      "content": {
        "title": "Foundation Check",
        "questions": [
          {
            "id": "202-5A-SR-1",
            "questionText": "What is the SI unit of measurement for electrical current?",
            "expectedAnswer": [
              "Ampere",
              "Amperes",
              "Amps",
              "A"
            ],
            "hint": "It is named after a French physicist and is often abbreviated to the letter 'A'.",
            "answerType": "short-text"
          },
          {
            "id": "202-5A-SR-2",
            "questionText": "What name is given to a material that easily allows the flow of electric current?",
            "expectedAnswer": [
              "Conductor",
              "Electrical conductor",
              "Conductive"
            ],
            "hint": "Copper and aluminum are common examples used in cables.",
            "answerType": "short-text"
          },
          {
            "id": "202-5A-SR-3",
            "questionText": "Which negatively charged subatomic particle flows through a conductor to create an electric current?",
            "expectedAnswer": [
              "Electron",
              "Electrons"
            ],
            "hint": "These particles orbit the nucleus of an atom and are responsible for charge transfer.",
            "answerType": "short-text"
          }
        ],
        "notes": "Review of fundamental concepts from Unit 202 (Lessons 202.1-202.4) regarding electron flow and conductors."
      }
    }
  ],
  "metadata": {
    "created": "2026-02-09",
    "updated": "2026-02-09",
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

## Issue Lifecycle

**Total Issues:** 10
**Fixed:** 9
**Unmoved:** 1
**Blocked:** 0

```json
{
  "runId": "202-5A__2026-02-09T10-54-53-265Z__rewrite__gemini-3-flash-preview",
  "lessonId": "202-5A",
  "issues": [
    {
      "issueId": "B1.beginnerClarity",
      "rubricRef": "b",
      "section": "general",
      "scoreBefore": 0,
      "maxScore": 3,
      "jsonPointers": [
        "/blocks/5/content/content"
      ],
      "fixability": "llm_editable",
      "reason": "The mathematical relationship is mentioned in text but lacks formal notation.",
      "plan": null,
      "appliedEdits": [
        {
          "op": "replace",
          "path": "/blocks/5/content/content",
          "summary": "Updated content in blocks.5"
        }
      ],
      "outcome": "fixed"
    },
    {
      "issueId": "B2.beginnerClarity",
      "rubricRef": "b",
      "section": "vocabulary",
      "scoreBefore": 0,
      "maxScore": 2,
      "jsonPointers": [
        "/blocks/1/content/terms"
      ],
      "fixability": "llm_editable",
      "reason": "Vocab definitions omit the standard Greek/Latin symbols used in C&G exams.",
      "plan": null,
      "appliedEdits": [
        {
          "op": "replace",
          "path": "/blocks/1/content/terms/1/term",
          "summary": "Changed blocks.1.content.terms.1.term from \"Magnetic Flux\" to \"Magnetic Flux (Φ)\""
        },
        {
          "op": "replace",
          "path": "/blocks/1/content/terms/1/definition",
          "summary": "Changed blocks.1.content.terms.1.definition from \"The total amount of magnetic field lines produced ...\" to \"The total amount of magnetic field lines produced ...\""
        },
        {
          "op": "replace",
          "path": "/blocks/1/content/terms/2/term",
          "summary": "Changed blocks.1.content.terms.2.term from \"Magnetic Flux Density\" to \"Magnetic Flux Density (B)\""
        },
        {
          "op": "replace",
          "path": "/blocks/1/content/terms/2/definition",
          "summary": "Changed blocks.1.content.terms.2.definition from \"The concentration of magnetic field lines passing ...\" to \"The concentration of magnetic field lines passing ...\""
        },
        {
          "op": "replace",
          "path": "/blocks/1/content/terms/3/definition",
          "summary": "Changed blocks.1.content.terms.3.definition from \"The SI unit used to measure total magnetic flux, r...\" to \"The SI unit used to measure total magnetic flux (Φ...\""
        },
        {
          "op": "replace",
          "path": "/blocks/1/content/terms/4/definition",
          "summary": "Changed blocks.1.content.terms.4.definition from \"The SI unit used to measure magnetic flux density,...\" to \"The SI unit used to measure magnetic flux density ...\""
        }
      ],
      "outcome": "fixed"
    },
    {
      "issueId": "C3.alignment",
      "rubricRef": "a",
      "section": "questions",
      "scoreBefore": 0,
      "maxScore": 3,
      "jsonPointers": [
        "/blocks/5/content/content"
      ],
      "fixability": "deterministic",
      "reason": "Missing a worked example for the calculation questions P2 and P4.",
      "plan": null,
      "appliedEdits": [
        {
          "op": "replace",
          "path": "/blocks/5/content/content",
          "summary": "Updated content in blocks.5"
        }
      ],
      "outcome": "unmoved"
    },
    {
      "issueId": "B4.beginnerClarity",
      "rubricRef": "b",
      "section": "general",
      "scoreBefore": 0,
      "maxScore": 2,
      "jsonPointers": [
        "/blocks/3/content/content"
      ],
      "fixability": "llm_editable",
      "reason": "Incomplete technical description of field lines.",
      "plan": null,
      "appliedEdits": [
        {
          "op": "replace",
          "path": "/blocks/3/content/content",
          "summary": "Updated content in blocks.3"
        }
      ],
      "outcome": "fixed"
    },
    {
      "issueId": "D5.questions",
      "rubricRef": "D",
      "section": "questions",
      "scoreBefore": 0,
      "maxScore": 3,
      "jsonPointers": [
        "/blocks/8/content/questions/0/expectedAnswer"
      ],
      "fixability": "deterministic",
      "reason": "Integrative questions require complex multi-point answers but only provide 3 full-sentence variants.",
      "plan": null,
      "appliedEdits": [
        {
          "op": "replace",
          "path": "/blocks/8/content/questions/0/expectedAnswer/2",
          "summary": "Updated expected answer at blocks.8.content.questions.0.expectedAnswer.2"
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
        "/blocks/7/content/questions/1/questionText",
        "/blocks/7/content/questions/3/questionText"
      ],
      "fixability": "deterministic",
      "reason": "Numeric questions don't specify if the unit should be included in the answer.",
      "plan": null,
      "appliedEdits": [
        {
          "op": "replace",
          "path": "/blocks/7/content/questions/1/questionText",
          "summary": "Modified question text at blocks.7.content.questions.1.questionText"
        },
        {
          "op": "replace",
          "path": "/blocks/7/content/questions/3/questionText",
          "summary": "Modified question text at blocks.7.content.questions.3.questionText"
        }
      ],
      "outcome": "fixed"
    },
    {
      "issueId": "B7.beginnerClarity",
      "rubricRef": "b",
      "section": "general",
      "scoreBefore": 0,
      "maxScore": 2,
      "jsonPointers": [
        "/blocks/5/content/content"
      ],
      "fixability": "llm_editable",
      "reason": "The 'Common Mistakes' section misses the critical concept of saturation mentioned in 'Why it matters'.",
      "plan": null,
      "appliedEdits": [
        {
          "op": "replace",
          "path": "/blocks/5/content/content",
          "summary": "Updated content in blocks.5"
        }
      ],
      "outcome": "fixed"
    },
    {
      "issueId": "C8.alignment",
      "rubricRef": "a",
      "section": "general",
      "scoreBefore": 0,
      "maxScore": 1,
      "jsonPointers": [
        "/blocks/9/content/notes"
      ],
      "fixability": "llm_editable",
      "reason": "The spaced review notes are generic.",
      "plan": null,
      "appliedEdits": [
        {
          "op": "replace",
          "path": "/blocks/9/content/notes",
          "summary": "Changed blocks.9.content.notes from \"Foundation check before starting Magnetism basics:...\" to \"Review of fundamental concepts from Unit 202 (Less...\""
        }
      ],
      "outcome": "fixed"
    },
    {
      "issueId": "C9.alignment",
      "rubricRef": "a",
      "section": "questions",
      "scoreBefore": 0,
      "maxScore": 2,
      "jsonPointers": [
        "/blocks/7/content/questions/4/questionText"
      ],
      "fixability": "llm_editable",
      "reason": "Question P5 is a simple recall question, missing an opportunity to meet Outcome 3 (Classify scenarios).",
      "plan": null,
      "appliedEdits": [
        {
          "op": "replace",
          "path": "/blocks/7/content/questions/4/questionText",
          "summary": "Modified question text at blocks.7.content.questions.4.questionText"
        }
      ],
      "outcome": "fixed"
    },
    {
      "issueId": "E10.marking",
      "rubricRef": "E",
      "section": "general",
      "scoreBefore": 0,
      "maxScore": 2,
      "jsonPointers": [
        "/blocks/4/content/questions/1/expectedAnswer",
        "/blocks/4/content/questions/2/expectedAnswer"
      ],
      "fixability": "deterministic",
      "reason": "Missing common verb-based variants (e.g., 'attract', 'repel').",
      "plan": null,
      "appliedEdits": [
        {
          "op": "add",
          "path": "/blocks/4/content/questions/1/expectedAnswer/3",
          "summary": "Added element at blocks.4.content.questions.1.expectedAnswer.3"
        },
        {
          "op": "add",
          "path": "/blocks/4/content/questions/2/expectedAnswer/3",
          "summary": "Added element at blocks.4.content.questions.2.expectedAnswer.3"
        }
      ],
      "outcome": "fixed"
    }
  ]
}
```

---

## Pointer Diff (JSON Pointer Format)

**Changes:** 30

```json
{
  "lessonId": "202-5A",
  "timestamp": "2026-02-09T10:56:27.564Z",
  "changes": [
    {
      "op": "replace",
      "path": "/blocks/1/content/terms/1/term",
      "before": "Magnetic Flux",
      "after": "Magnetic Flux (Φ)",
      "summary": "Changed blocks.1.content.terms.1.term from \"Magnetic Flux\" to \"Magnetic Flux (Φ)\""
    },
    {
      "op": "replace",
      "path": "/blocks/1/content/terms/1/definition",
      "before": "The total amount of magnetic field lines produced by a source, measured in Webers (Wb), not the concentration of those lines in a specific area.",
      "after": "The total amount of magnetic field lines produced by a source, measured in Webers (Wb), representing the entire quantity of magnetic lines of force.",
      "summary": "Changed blocks.1.content.terms.1.definition from \"The total amount of magnetic field lines produced ...\" to \"The total amount of magnetic field lines produced ...\""
    },
    {
      "op": "replace",
      "path": "/blocks/1/content/terms/2/term",
      "before": "Magnetic Flux Density",
      "after": "Magnetic Flux Density (B)",
      "summary": "Changed blocks.1.content.terms.2.term from \"Magnetic Flux Density\" to \"Magnetic Flux Density (B)\""
    },
    {
      "op": "replace",
      "path": "/blocks/1/content/terms/2/definition",
      "before": "The concentration of magnetic field lines passing through a specific unit area, measured in Tesla (T), which represents the strength of the magnetic field.",
      "after": "The concentration of magnetic field lines passing through a specific unit area, measured in Tesla (T), defined as one Weber per square metre.",
      "summary": "Changed blocks.1.content.terms.2.definition from \"The concentration of magnetic field lines passing ...\" to \"The concentration of magnetic field lines passing ...\""
    },
    {
      "op": "replace",
      "path": "/blocks/1/content/terms/3/definition",
      "before": "The SI unit used to measure total magnetic flux, representing the entire quantity of magnetic lines of force.",
      "after": "The SI unit used to measure total magnetic flux (Φ).",
      "summary": "Changed blocks.1.content.terms.3.definition from \"The SI unit used to measure total magnetic flux, r...\" to \"The SI unit used to measure total magnetic flux (Φ...\""
    },
    {
      "op": "replace",
      "path": "/blocks/1/content/terms/4/definition",
      "before": "The SI unit used to measure magnetic flux density, defined as one Weber per square metre.",
      "after": "The SI unit used to measure magnetic flux density (B), representing the strength of the magnetic field.",
      "summary": "Changed blocks.1.content.terms.4.definition from \"The SI unit used to measure magnetic flux density,...\" to \"The SI unit used to measure magnetic flux density ...\""
    },
    {
      "op": "remove",
      "path": "/blocks/2/content/imageUrl",
      "summary": "Removed blocks.2.content.imageUrl"
    },
    {
      "op": "replace",
      "path": "/blocks/3/content/content",
      "before": "### In this lesson\nThis lesson introduces the fundamental behavior of magnets and how they interact with one another. You are exploring this in the context of basic electrical science, which forms the foundation for understanding how motors and transformers work in an installation. \n\n*   Magnets always possess two distinct regions of force.\n*   Like poles push away from each other.\n*   Unlike poles pull toward each other.\n\n**What this is**\nMagnetism is a physical phenomenon produced by the motion of electric charge, resulting in attractive and repulsive forces between objects. Every magnet has two specific ends known as **Magnetic Poles**. These are designated as the North pole and the South pole. Even if you were to cut a magnet in half, each piece would still develop its own North and South poles. The area surrounding these poles where the magnetic force can be detected is known as the magnetic field. \n\n**Why it matters**\nUnderstanding how **Magnetic Poles** interact is critical for an electrician because it explains the mechanical rotation in electric motors. By using the laws of attraction and repulsion, we can force a motor's internal components to move. Furthermore, this knowledge is essential when identifying how protective devices like circuit breakers use magnetic trip elements to disconnect a circuit during a fault. \n\n**Key facts / rules**\n*   Every magnet must have a North pole and a South pole.\n*   The law of attraction states that unlike poles (North and South) will pull toward each other.\n*   The law of repulsion states that like poles (North and North, or South and South) will push away from each other.\n*   Magnetic field lines are typically illustrated as exiting the North pole and entering the South pole.\n*   The magnetic force is strongest at the poles and weakens as you move further away.\n*   Magnetic materials, such as iron or steel, are attracted to either pole of a magnet.\n\n**How to recognise it**\nTo recognise the interaction between magnets, you look for the direction of the physical force being applied. If you bring two magnets together and feel a resisting force that prevents them from touching, you are observing repulsion between like poles. Conversely, if the magnets snap together with force, you are observing attraction between unlike poles. On the diagram, notice that the **north-pole** and **south-pole** labels indicate the specific regions where the magnetic force is most concentrated. You can also recognise these interactions through the behavior of a compass needle, which is itself a small magnet that aligns its poles with the Earth's magnetic field.\n\n**Common mistakes**\nLearners often confuse **attraction** with **repulsion**; **attraction** is the pulling together of unlike poles whereas **repulsion** is the pushing apart of like poles. Another common error is assuming that a magnet only has one pole or that the poles can be separated, which is physically impossible in standard electrical applications.\n\n**Key Points**\n*   Magnets always have two poles: North and South.\n*   Like poles repel; unlike poles attract.\n*   The magnetic field is the region where these forces act.\n*   Force is most concentrated at the poles themselves.\n\n**Quick recap**\nMagnets interact based on their poles. Like poles always push apart (repulsion), while opposite poles always pull together (attraction). These forces are the strongest at the ends of the magnet, which we call the North and South poles.\n\n### Coming Up Next\nNow that you understand how poles interact, we will look at how we measure the \"amount\" and \"concentration\" of the magnetic field using flux and flux density.",
      "after": "### In this lesson\nThis lesson introduces the fundamental behavior of magnets and how they interact with one another. You are exploring this in the context of basic electrical science, which forms the foundation for understanding how motors and transformers work in an installation. \n\n*   Magnets always possess two distinct regions of force.\n*   Like poles push away from each other.\n*   Unlike poles pull toward each other.\n\n**What this is**\nMagnetism is a physical phenomenon produced by the motion of electric charge, resulting in attractive and repulsive forces between objects. Every magnet has two specific ends known as **Magnetic Poles**. These are designated as the North pole and the South pole. Even if you were to cut a magnet in half, each piece would still develop its own North and South poles. The area surrounding these poles where the magnetic force can be detected is known as the magnetic field. \n\n**Why it matters**\nUnderstanding how **Magnetic Poles** interact is critical for an electrician because it explains the mechanical rotation in electric motors. By using the laws of attraction and repulsion, we can force a motor's internal components to move. Furthermore, this knowledge is essential when identifying how protective devices like circuit breakers use magnetic trip elements to disconnect a circuit during a fault. \n\n**Key facts / rules**\n*   Every magnet must have a North pole and a South pole.\n*   The law of attraction states that unlike poles (North and South) will pull toward each other.\n*   The law of repulsion states that like poles (North and North, or South and South) will push away from each other.\n*   Magnetic field lines never cross, form continuous loops, and are conventionally shown flowing from the North pole to the South pole externally.\n*   The magnetic force is strongest at the poles and weakens as you move further away.\n*   Magnetic materials, such as iron or steel, are attracted to either pole of a magnet.\n\n**How to recognise it**\nTo recognise the interaction between magnets, you look for the direction of the physical force being applied. If you bring two magnets together and feel a resisting force that prevents them from touching, you are observing repulsion between like poles. Conversely, if the magnets snap together with force, you are observing attraction between unlike poles. On the diagram, notice that the **north-pole** and **south-pole** labels indicate the specific regions where the magnetic force is most concentrated. You can also recognise these interactions through the behavior of a compass needle, which is itself a small magnet that aligns its poles with the Earth's magnetic field.\n\n**Common mistakes**\nLearners often confuse **attraction** with **repulsion**; **attraction** is the pulling together of unlike poles whereas **repulsion** is the pushing apart of like poles. Another common error is assuming that a magnet only has one pole or that the poles can be separated, which is physically impossible in standard electrical applications.\n\n**Key Points**\n*   Magnets always have two poles: North and South.\n*   Like poles repel; unlike poles attract.\n*   The magnetic field is the region where these forces act.\n*   Force is most concentrated at the poles themselves.\n\n**Quick recap**\nMagnets interact based on their poles. Like poles always push apart (repulsion), while opposite poles always pull together (attraction). These forces are the strongest at the ends of the magnet, which we call the North and South poles.\n\n### Coming Up Next\nNow that you understand how poles interact, we will look at how we measure the \"amount\" and \"concentration\" of the magnetic field using flux and flux density.",
      "summary": "Updated content in blocks.3"
    },
    {
      "op": "add",
      "path": "/blocks/4/content/questions/1/expectedAnswer/3",
      "after": "attract",
      "summary": "Added element at blocks.4.content.questions.1.expectedAnswer.3"
    },
    {
      "op": "add",
      "path": "/blocks/4/content/questions/2/expectedAnswer/3",
      "after": "repel",
      "summary": "Added element at blocks.4.content.questions.2.expectedAnswer.3"
    },
    {
      "op": "replace",
      "path": "/blocks/5/content/content",
      "before": "### In this lesson\nYou will learn to distinguish between the total magnetic field produced and how concentrated that field is in a given space. This is essential for understanding how magnetic components like transformer cores are selected for specific electrical loads.\n\n*   Flux represents the total quantity of magnetic field lines.\n*   Flux density represents the concentration of those lines per unit area.\n*   Different units (Webers and Teslas) are used to measure these distinct properties.\n\n**What this is**\n**Magnetic Flux** refers to the total number of magnetic field lines passing through a specific surface. Think of it as the \"total volume\" of magnetism. The SI unit for this is the **Weber (Wb)**. On the other hand, **Magnetic Flux Density** describes how tightly packed those field lines are within a specific area. It is a measure of the strength of the magnetic field at a particular point. The SI unit for flux density is the **Tesla (T)**, which is defined as one **Weber (Wb)** per square metre.\n\n**Why it matters**\nIn electrical engineering, we need to know more than just the total amount of magnetism; we need to know if that magnetism is \"strong\" enough to do work. For example, in a transformer, if the **Magnetic Flux Density** becomes too high, the iron core can become saturated and stop working efficiently. Choosing the right material and cross-sectional area ensures that the flux is handled correctly without overheating the component.\n\n**Key facts / rules**\n*   **Magnetic Flux** is the total amount of magnetic field, measured in **Webers (Wb)**.\n*   **Magnetic Flux Density** is the concentration of the field, measured in **Tesla (T)**.\n*   One **Tesla (T)** is equal to one Weber per square metre (Wb/m²).\n*   If the area decreases but the total flux stays the same, the flux density increases.\n*   If the total flux increases but the area stays the same, the flux density increases.\n*   Flux density is a vector quantity, meaning it has both magnitude and direction.\n\n**How to recognise it**\nTo classify scenarios correctly, look for whether the description focuses on a \"total\" or a \"concentration.\" For example, if a manufacturer states the total output of a magnet, they are describing **Magnetic Flux**. If they describe the strength of the field at the surface of a specific 10mm² sensor, they are describing **Magnetic Flux Density**. A helpful conceptual analogy is rain: the total amount of water falling on a whole garden is the flux, while the amount of water hitting a single square inch of a patio is the flux density. On the diagram, notice that the **magnetic-flux-density** is represented by how closely the lines are drawn together in a specific area.\n\n**Common mistakes**\nLearners often confuse **Magnetic Flux** with **Magnetic Flux Density**; **Magnetic Flux** is the total amount of field lines (measured in Webers) whereas **Magnetic Flux Density** is how concentrated those lines are in a specific area (measured in Tesla). Many people forget that density is dependent on the area the flux is passing through.\n\n**Key Points**\n*   Flux (Wb) = Total amount of magnetic field.\n*   Flux Density (T) = Concentration of field per square metre.\n*   Smaller area with the same flux results in higher density.\n*   Tesla is the unit of measurement for field strength (density).\n\n**Quick recap**\n**Magnetic Flux** (Webers) tells us the total amount of magnetic field lines present. **Magnetic Flux Density** (Tesla) tells us how squashed together those lines are. If you squeeze the same amount of flux into a smaller pipe, the density goes up.\n\n### Coming Up Next\nWith these basics mastered, we will move on to see how electricity can be used to create these magnetic fields in a process called electromagnetism.",
      "after": "**Worked Example:**\nA magnet produces 0.5 Wb of flux over an area of 0.25 m². To find the density (B):\n1. Identify values: Φ = 0.5, A = 0.25\n2. Apply formula: B = Φ / A\n3. Result: **2 Tesla (T)**\n\n### In this lesson\nYou will learn to distinguish between the total magnetic field produced and how concentrated that field is in a given space. This is essential for understanding how magnetic components like transformer cores are selected for specific electrical loads.\n\n*   Flux represents the total quantity of magnetic field lines.\n*   Flux density represents the concentration of those lines per unit area.\n*   Different units (Webers and Teslas) are used to measure these distinct properties.\n\n**What this is**\n**Magnetic Flux (Φ)** refers to the total number of magnetic field lines passing through a specific surface. Think of it as the \"total volume\" of magnetism. The SI unit for this is the **Weber (Wb)**. On the other hand, **Magnetic Flux Density (B)** describes how tightly packed those field lines are within a specific area. The relationship is expressed as $B = \\Phi / A$. The SI unit for flux density is the **Tesla (T)**, which is defined as one **Weber (Wb)** per square metre.\n\n**Why it matters**\nIn electrical engineering, we need to know more than just the total amount of magnetism; we need to know if that magnetism is \"strong\" enough to do work. For example, in a transformer, if the **Magnetic Flux Density** becomes too high, the iron core can become **saturated** and stop working efficiently. Choosing the right material and cross-sectional area ensures that the flux is handled correctly without overheating the component.\n\n**Key facts / rules**\n*   **Magnetic Flux (Φ)** is the total amount of magnetic field, measured in **Webers (Wb)**.\n*   **Magnetic Flux Density (B)** is the concentration of the field, measured in **Tesla (T)**.\n*   One **Tesla (T)** is equal to one Weber per square metre (Wb/m²).\n*   If the area decreases but the total flux stays the same, the flux density increases.\n*   If the total flux increases but the area stays the same, the flux density increases.\n*   Flux density is a vector quantity, meaning it has both magnitude and direction.\n\n**How to recognise it**\nTo classify scenarios correctly, look for whether the description focuses on a \"total\" or a \"concentration.\" For example, if a manufacturer states the total output of a magnet, they are describing **Magnetic Flux**. If they describe the strength of the field at the surface of a specific 10mm² sensor, they are describing **Magnetic Flux Density**. A helpful conceptual analogy is rain: the total amount of water falling on a whole garden is the flux, while the amount of water hitting a single square inch of a patio is the flux density. On the diagram, notice that the **magnetic-flux-density** is represented by how closely the lines are drawn together in a specific area.\n\n**Common mistakes**\nLearners often confuse **Magnetic Flux** with **Magnetic Flux Density**; **Magnetic Flux** is the total amount of field lines (measured in Webers) whereas **Magnetic Flux Density** is how concentrated those lines are in a specific area (measured in Tesla). Many people forget that density is dependent on the area the flux is passing through. Learners also forget the concept of **magnetic saturation**, where a material reaches a point where it cannot hold any more flux density, regardless of how much total flux is applied.\n\n**Key Points**\n*   Flux (Wb) = Total amount of magnetic field.\n*   Flux Density (T) = Concentration of field per square metre.\n*   Smaller area with the same flux results in higher density.\n*   Tesla is the unit of measurement for field strength (density).\n\n**Quick recap**\n**Magnetic Flux** (Webers) tells us the total amount of magnetic field lines present. **Magnetic Flux Density** (Tesla) tells us how squashed together those lines are. If you squeeze the same amount of flux into a smaller pipe, the density goes up.\n\n### Coming Up Next\nWith these basics mastered, we will move on to see how electricity can be used to create these magnetic fields in a process called electromagnetism.",
      "summary": "Updated content in blocks.5"
    },
    {
      "op": "replace",
      "path": "/blocks/7/content/questions/1/questionText",
      "before": "A transformer core has a total magnetic flux of 8 Webers distributed over a cross-sectional area of 2 square metres. Calculate the magnetic flux density. (Round to the nearest whole number)",
      "after": "A transformer core has a total magnetic flux of 8 Webers distributed over a cross-sectional area of 2 square metres. Calculate the magnetic flux density. (Round to the nearest whole number and provide the numeric value only)",
      "summary": "Modified question text at blocks.7.content.questions.1.questionText"
    },
    {
      "op": "replace",
      "path": "/blocks/7/content/questions/1/answerType",
      "before": "numeric",
      "after": "calculation",
      "summary": "Changed answer type from \"numeric\" to \"calculation\" at blocks.7.content.questions.1.answerType"
    },
    {
      "op": "add",
      "path": "/blocks/7/content/questions/2/expectedAnswer/3",
      "after": "repel",
      "summary": "Added element at blocks.7.content.questions.2.expectedAnswer.3"
    },
    {
      "op": "replace",
      "path": "/blocks/7/content/questions/3/questionText",
      "before": "A magnetic field is measured to have a flux density of 10 Tesla acting over an area of 0.5 square metres. What is the total magnetic flux produced? (Round to the nearest whole number)",
      "after": "A magnetic field is measured to have a flux density of 10 Tesla acting over an area of 0.5 square metres. What is the total magnetic flux produced? (Round to the nearest whole number and provide the numeric value only)",
      "summary": "Modified question text at blocks.7.content.questions.3.questionText"
    },
    {
      "op": "replace",
      "path": "/blocks/7/content/questions/3/answerType",
      "before": "numeric",
      "after": "calculation",
      "summary": "Changed answer type from \"numeric\" to \"calculation\" at blocks.7.content.questions.3.answerType"
    },
    {
      "op": "replace",
      "path": "/blocks/7/content/questions/4/questionText",
      "before": "Which SI unit is used to measure the total quantity of magnetic lines of force, representing the 'total volume' of magnetism?",
      "after": "A manufacturer specifies that a magnet produces a total of 0.05 Webers. Is this specification describing 'Magnetic Flux' or 'Magnetic Flux Density'?",
      "summary": "Modified question text at blocks.7.content.questions.4.questionText"
    },
    {
      "op": "replace",
      "path": "/blocks/7/content/questions/4/expectedAnswer/0",
      "before": "Weber",
      "after": "Magnetic Flux",
      "summary": "Updated expected answer at blocks.7.content.questions.4.expectedAnswer.0"
    },
    {
      "op": "replace",
      "path": "/blocks/7/content/questions/4/expectedAnswer/1",
      "before": "the Weber",
      "after": "flux",
      "summary": "Updated expected answer at blocks.7.content.questions.4.expectedAnswer.1"
    },
    {
      "op": "replace",
      "path": "/blocks/7/content/questions/4/expectedAnswer/2",
      "before": "Wb",
      "after": "total flux",
      "summary": "Updated expected answer at blocks.7.content.questions.4.expectedAnswer.2"
    },
    {
      "op": "replace",
      "path": "/blocks/8/content/questions/0/questionText",
      "before": "Explain how the interaction between magnetic poles relates to the measurement of a magnetic field. In your answer, include: (1) the laws of attraction and repulsion, (2) magnetic flux as a total quantity, (3) how flux density describes the field's concentration. (2-3 sentences)",
      "after": "Explain how the interaction between magnetic poles relates to the measurement of a magnetic field. In your answer, include: (1) the laws of attraction and repulsion, (2) magnetic flux as a total quantity, (3) how flux density describes the field's concentration.",
      "summary": "Modified question text at blocks.8.content.questions.0.questionText"
    },
    {
      "op": "replace",
      "path": "/blocks/8/content/questions/0/expectedAnswer/2",
      "before": "Magnetic flux is the total amount of field produced by the interaction of like or unlike poles. Flux density describes how tightly packed or concentrated that total flux is within a specific area.",
      "after": "unlike attract like repel flux total density concentration",
      "summary": "Updated expected answer at blocks.8.content.questions.0.expectedAnswer.2"
    },
    {
      "op": "replace",
      "path": "/blocks/8/content/questions/1/expectedAnswer/0",
      "before": "Magnets interact such that like poles repel and unlike poles attract. The total quantity of the resulting magnetic field is flux, measured in Webers, whereas flux density, measured in Teslas, describes the concentration of those lines per unit area. This distinguishes the total magnetic output from how 'packed' the field is in a specific component like a transformer core.",
      "after": "like poles repel and unlike poles attract",
      "summary": "Updated expected answer at blocks.8.content.questions.1.expectedAnswer.0"
    },
    {
      "op": "replace",
      "path": "/blocks/8/content/questions/1/expectedAnswer/1",
      "before": "1. Like poles repel and unlike poles attract to create a field. 2. Magnetic flux is the total number of field lines measured in Webers. 3. Flux density is the concentration of these lines per square meter, measured in Teslas. 4. Flux represents the total amount of magnetism, while density represents its concentration in a specific area.",
      "after": "magnetic flux (Φ) is the total field quantity",
      "summary": "Updated expected answer at blocks.8.content.questions.1.expectedAnswer.1"
    },
    {
      "op": "replace",
      "path": "/blocks/8/content/questions/1/expectedAnswer/2",
      "before": "Magnetic poles exert force where like poles repel and unlike poles attract. This force is measured as total magnetic flux in Webers, while the concentration of that force per unit area is called flux density, measured in Teslas. Understanding both is necessary to distinguish between the total field available and how intense that field is in a given space.",
      "after": "Webers (Wb) measure total flux",
      "summary": "Updated expected answer at blocks.8.content.questions.1.expectedAnswer.2"
    },
    {
      "op": "add",
      "path": "/blocks/8/content/questions/1/expectedAnswer/3",
      "after": "flux density (B) is concentration per area",
      "summary": "Added element at blocks.8.content.questions.1.expectedAnswer.3"
    },
    {
      "op": "add",
      "path": "/blocks/8/content/questions/1/expectedAnswer/4",
      "after": "Teslas (T) measure flux density",
      "summary": "Added element at blocks.8.content.questions.1.expectedAnswer.4"
    },
    {
      "op": "add",
      "path": "/blocks/8/content/questions/1/expectedAnswer/5",
      "after": "B = Φ / A formula relationship",
      "summary": "Added element at blocks.8.content.questions.1.expectedAnswer.5"
    },
    {
      "op": "add",
      "path": "/blocks/8/content/questions/1/expectedAnswer/6",
      "after": "distinction between total volume and intensity",
      "summary": "Added element at blocks.8.content.questions.1.expectedAnswer.6"
    },
    {
      "op": "replace",
      "path": "/blocks/9/content/notes",
      "before": "Foundation check before starting Magnetism basics: attraction/repulsion + flux vs flux density",
      "after": "Review of fundamental concepts from Unit 202 (Lessons 202.1-202.4) regarding electron flow and conductors.",
      "summary": "Changed blocks.9.content.notes from \"Foundation check before starting Magnetism basics:...\" to \"Review of fundamental concepts from Unit 202 (Less...\""
    }
  ]
}
```

---

## Blockers Summary

**Total Blocked:** 0
**Points Blocked:** 0

```json
{
  "lessonId": "202-5A",
  "timestamp": "2026-02-09T10:56:55.019Z",
  "blockers": [],
  "summary": {
    "totalBlocked": 0,
    "pointsBlocked": 0
  }
}
```

---

## Index Manifest

**File:** `INDEX.json`

```json
{
  "lessonId": "202-5A",
  "runId": "202-5A__2026-02-09T10-54-53-265Z__rewrite__gemini-3-flash-preview",
  "timestampUtc": "2026-02-09T10:54:53.265Z",
  "phase10Strategy": "rewrite",
  "models": {
    "rewrite": "gemini-3-flash-preview",
    "scoring": "gemini-3-flash-preview"
  },
  "runConfig": null,
  "scoreBefore": {
    "total": 96,
    "grade": "Strong",
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
  "fixPlan": null,
  "issueLifecycle": {
    "file": "18_issue_lifecycle.json",
    "totalIssues": 10,
    "fixed": 9,
    "unmoved": 1,
    "blocked": 0
  },
  "pointerDiff": {
    "file": "19_pointer_diff.json",
    "changeCount": 30
  },
  "blockers": {
    "file": "21_blockers.json",
    "totalBlocked": 0,
    "pointsBlocked": 0
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

Lesson: 202-5A
Timestamp: 2026-02-09T10:56:27.557Z

================================================================================

## Metadata Changes

## Block Changes

Block 1: vocab (202-5A-vocab) - CHANGED

  Content: CHANGED (972 → 927 chars)
    - terms: CHANGED

Block 3: explanation (202-5A-explain-1) - CHANGED

  Content: CHANGED (3756 → 3798 chars)
    - content: CHANGED

Block 4: practice (202-5A-check-1) - CHANGED

  Content: CHANGED (2287 → 2323 chars)
    - questions: CHANGED

Block 5: explanation (202-5A-explain-2) - CHANGED

  Content: CHANGED (3874 → 4254 chars)
    - content: CHANGED

Block 7: practice (202-5A-practice) - CHANGED

  Content: CHANGED (2165 → 2294 chars)
    - questions: CHANGED

Block 8: practice (202-5A-integrative) - CHANGED

  Content: CHANGED (3231 → 2321 chars)
    - questions: CHANGED

Block 9: spaced-review (202-5A-spaced-review) - CHANGED

  Content: CHANGED (1257 → 1269 chars)
    - notes: CHANGED

================================================================================

Summary: 7 of 10 blocks changed

Before Hash: 657dd8da1ea70dc7
After Hash:  b81059ca5bbb45a1
```

---

## End of Report

Generated: 2026-02-09T10:56:55.023Z
Total files: 15
