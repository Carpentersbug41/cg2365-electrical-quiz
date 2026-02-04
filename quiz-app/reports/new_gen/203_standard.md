{
  "id": "203-3F",
  "title": "203.3F — Spacing Factor / Enclosure Fill",
  "description": "Learn what space factor (enclosure fill) is, why it matters for safe cable pulling and heat dissipation, and how to calculate percentage fill for conduit and trunking.",
  "layout": "split-vis",
  "unit": "Unit 203",
  "topic": "Spacing Factor / Enclosure Fill",
  "learningOutcomes": [
    "Define space factor (enclosure fill) in plain language for conduit and trunking",
    "Explain why overfilling increases mechanical damage risk and reduces heat dissipation",
    "Calculate percentage fill using cross-sectional area for circular and rectangular enclosures",
    "Decide if an installation is acceptable by comparing the calculated fill to a given limit"
  ],
  "prerequisites": ["203-3E"],
  "blocks": [
    {
      "id": "203-3F-outcomes",
      "type": "outcomes",
      "order": 1,
      "content": {
        "outcomes": [
          {
            "text": "Define space factor (enclosure fill) for conduit and trunking",
            "bloomLevel": "remember"
          },
          {
            "text": "Explain how overfilling increases mechanical damage risk and reduces heat dissipation",
            "bloomLevel": "understand"
          },
          {
            "text": "Calculate percentage fill and judge compliance against a stated limit",
            "bloomLevel": "apply"
          }
        ]
      }
    },
    {
      "id": "203-3F-vocab",
      "type": "vocab",
      "order": 2,
      "content": {
        "terms": [
          {
            "term": "Space factor (enclosure fill)",
            "definition": "The percentage of an enclosure’s internal cross-sectional area that is occupied by the cables inside."
          },
          {
            "term": "Cross-sectional area (CSA)",
            "definition": "The area you get when you cut across an object; measured in square millimetres for this topic."
          },
          {
            "term": "Internal diameter (ID)",
            "definition": "The measurement across the inside of a conduit; it represents the usable space for cables."
          },
          {
            "term": "Overall cable diameter",
            "definition": "The full diameter of a cable including insulation and sheath; used to calculate cable CSA."
          },
          {
            "term": "Mechanical damage",
            "definition": "Physical harm to cable insulation (snags, scraping, tearing) during pulling-in due to overcrowding and friction."
          },
          {
            "term": "Heat dissipation",
            "definition": "Heat escaping from cables into the surrounding air; reduced when cables are tightly packed with little air space."
          }
        ]
      }
    },
    {
      "id": "203-3F-diagram",
      "type": "diagram",
      "order": 3,
      "content": {
        "title": "Conduit Fill Cross-Section (Concept)",
        "description": "A conduit cross-section showing cables as smaller circles and remaining air space for cooling and pulling-in.",
        "videoUrl": "",
        "diagramType": "concept",
        "elementIds": [
          "Internal Diameter (ID)",
          "Cable Overall Diameter",
          "Air Space"
        ],
        "placeholderText": "A large circle labelled Internal Diameter (ID). Inside are smaller circles labelled Cable Overall Diameter. The remaining area is labelled Air Space."
      }
    },
    {
      "id": "203-3F-explain-meaning",
      "type": "explanation",
      "order": 4,
      "content": {
        "title": "What Space Factor Is (and Why It Matters)",
        "content": "**What this is (plain terms)**\n\nSpace factor (also called **enclosure fill**) is how “full” a containment system is. It is the **percentage of the enclosure’s internal cross-sectional area** that is taken up by the cables inside.\n\n**Why it matters (real job context)**\n\nIn real installs, you don’t just want cables to “fit”. You want them to be safe to pull in, safe in service, and maintainable.\n\n1) **Mechanical damage risk (pulling-in phase):** If an enclosure is crowded, cables have less room to move. Friction increases, cables snag more easily at bends, and insulation can be **scraped or torn** during pulling-in.\n\n2) **Heat dissipation risk (in service):** Current-carrying cables generate heat. If cables are packed tightly, there is less **air space**, so heat is harder to dissipate. Higher operating temperature speeds up insulation ageing and increases the chance of faults.\n\n**Key rules / facts**\n- Space factor is a **percentage (%)**.\n- It is based on the **internal** usable area of the enclosure (not outside dimensions).\n- You must add **cable areas (CSA)**, not cable diameters.\n- Overfilling increases friction during pulling-in and reduces air space for heat dissipation.\n- To judge acceptability, compare your calculated % fill to the **limit given** (exam question, manufacturer guidance, or reference table).\n\n**How to use it (mini workflow)**\n1) Identify the enclosure type: conduit (circular) or trunking (rectangular).\n2) Calculate enclosure internal area.\n3) Calculate each cable’s CSA from its **overall diameter**, then add (or multiply if identical).\n4) Calculate % fill: (total cable area ÷ enclosure area) × 100.\n5) Compare to the stated limit and decide compliant / not compliant.\n\n**Common mistakes**\n- Using external measurements instead of internal usable measurements.\n- Adding cable diameters instead of calculating and adding CSAs.\n- Forgetting to square the radius in the circle area formula.\n\n**Quick recap**\n- Space factor is “how full the enclosure is” as a percentage.\n- Too full = more pulling friction + more insulation damage risk.\n- Too full = less air space + poorer heat dissipation.\n- Always use CSA and compare to the limit given."
      }
    },
    {
      "id": "203-3F-check-1",
      "type": "practice",
      "order": 4.5,
      "content": {
        "title": "Check Your Understanding: Meaning and Risks",
        "mode": "conceptual",
        "sequential": true,
        "questions": [
          {
            "id": "203-3F-C1-L1-A",
            "questionText": "What is space factor (enclosure fill)?",
            "answerType": "short-text",
            "cognitiveLevel": "recall",
            "expectedAnswer": [
              "the percentage of an enclosure’s internal cross-sectional area occupied by the cables",
              "percentage of internal area taken up by cables",
              "enclosure fill percentage (cable area ÷ enclosure internal area × 100)"
            ],
            "hint": "It’s a percentage based on internal area."
          },
          {
            "id": "203-3F-C1-L1-B",
            "questionText": "During pulling-in, what mechanical problem becomes more likely when an enclosure is overfilled?",
            "answerType": "short-text",
            "cognitiveLevel": "recall",
            "expectedAnswer": [
              "insulation can be scraped or torn due to increased friction and snagging",
              "more friction and snagging can damage insulation",
              "cables can snag at bends and insulation can be damaged"
            ],
            "hint": "Think friction, bends, and insulation damage."
          },
          {
            "id": "203-3F-C1-L1-C",
            "questionText": "In service, what thermal problem becomes more likely when cables are packed tightly together?",
            "answerType": "short-text",
            "cognitiveLevel": "recall",
            "expectedAnswer": [
              "reduced heat dissipation because there is less air space",
              "heat is harder to dissipate so cables run hotter",
              "less air space leads to heat buildup"
            ],
            "hint": "Less air space = less cooling."
          },
          {
            "id": "203-3F-C1-L2",
            "questionText": "Using your answers to Q1 (definition), Q2 (mechanical risk), and Q3 (thermal risk), explain why we apply a space factor limit.",
            "answerType": "short-text",
            "cognitiveLevel": "connection",
            "expectedAnswer": [
              "a limit keeps enclosure fill low enough to reduce friction and snagging during pulling-in and to preserve air space for heat dissipation in service",
              "space factor limits prevent insulation damage during installation and reduce overheating risk during operation",
              "limits ensure cables can be pulled safely and still dissipate heat once energised"
            ],
            "hint": "Tie together: percentage fill → friction/snags → insulation damage, and air space → heat dissipation."
          }
        ]
      }
    },
    {
      "id": "203-3F-explain-maths",
      "type": "explanation",
      "order": 5,
      "content": {
        "title": "The Basic Maths: Calculating Percentage Fill",
        "content": "**What this is (plain terms)**\n\nTo calculate space factor, you compare the **total cable CSA** to the **enclosure internal area** and express it as a percentage.\n\n**Why it matters**\n\nThis turns “it looks like it fits” into a clear decision you can defend: you can prove whether the enclosure choice is acceptable against the stated limit.\n\n**Key rules / facts**\n- Conduit and cables are treated as **circles**: Area = π × r².\n- Trunking is treated as a **rectangle**: Area = width × height.\n- Radius r = diameter ÷ 2.\n- Total cable area = sum of each cable CSA (or CSA × quantity for identical cables).\n- % fill = (total cable area ÷ enclosure internal area) × 100.\n- Use the **internal** enclosure dimensions.\n\n**How to use it (mini workflow)**\n1) Enclosure area:\n   - Conduit: π × (ID ÷ 2)²\n   - Trunking: width × height\n2) Cable area (for each cable size): π × (overall diameter ÷ 2)²\n3) Add cable areas.\n4) Divide total cable area by enclosure area, then × 100.\n5) Compare to the given limit.\n\n**Common mistakes**\n- Using diameter directly instead of radius.\n- Forgetting to square the radius.\n- Adding diameters instead of adding areas.\n- Using external instead of internal dimensions.\n\n**Quick recap**\n- Compute enclosure internal area.\n- Compute total cable CSA.\n- % fill = (cable ÷ enclosure) × 100.\n- Compare to the stated limit to decide acceptable / not acceptable."
      }
    },
    {
      "id": "203-3F-check-2",
      "type": "practice",
      "order": 5.5,
      "content": {
        "title": "Check Your Understanding: The Maths Rules",
        "mode": "conceptual",
        "sequential": true,
        "questions": [
          {
            "id": "203-3F-C2-L1-A",
            "questionText": "What formula is used to calculate the cross-sectional area of a circular conduit or cable?",
            "answerType": "short-text",
            "cognitiveLevel": "recall",
            "expectedAnswer": [
              "area = pi × r squared",
              "area = π × r²",
              "pi times radius squared"
            ],
            "hint": "Circle area."
          },
          {
            "id": "203-3F-C2-L1-B",
            "questionText": "What formula is used to calculate the internal area of rectangular trunking?",
            "answerType": "short-text",
            "cognitiveLevel": "recall",
            "expectedAnswer": [
              "width × height",
              "width times height",
              "w × h"
            ],
            "hint": "Rectangle area."
          },
          {
            "id": "203-3F-C2-L1-C",
            "questionText": "When calculating total cable space, do you add cable diameters or cable areas?",
            "answerType": "short-text",
            "cognitiveLevel": "recall",
            "expectedAnswer": [
              "add cable areas (CSA)",
              "add the calculated cross-sectional areas",
              "add areas, not diameters"
            ],
            "hint": "Space factor uses CSA."
          },
          {
            "id": "203-3F-C2-L2",
            "questionText": "Why must you use the enclosure’s internal dimensions when calculating percentage fill?",
            "answerType": "short-text",
            "cognitiveLevel": "connection",
            "expectedAnswer": [
              "because cables only occupy the usable internal space, not the enclosure wall thickness",
              "external dimensions include material thickness that cables cannot use",
              "the usable space for cables is the internal cross-sectional area"
            ],
            "hint": "Think: what space can cables actually occupy?"
          }
        ]
      }
    },
    {
      "id": "203-3F-worked-example",
      "type": "worked-example",
      "order": 6,
      "content": {
        "title": "Worked Example: Conduit Percentage Fill",
        "given": "A conduit has an internal diameter of 25 mm. It will contain 5 cables, each with an overall diameter of 6 mm.",
        "steps": [
          {
            "stepNumber": 1,
            "description": "Calculate conduit internal area. Radius = 25 ÷ 2 = 12.5.",
            "formula": "Area = π × r²",
            "calculation": "3.142 × 12.5 × 12.5",
            "result": "490.94"
          },
          {
            "stepNumber": 2,
            "description": "Calculate one cable area. Radius = 6 ÷ 2 = 3.",
            "formula": "Area = π × r²",
            "calculation": "3.142 × 3 × 3",
            "result": "28.28"
          },
          {
            "stepNumber": 3,
            "description": "Total cable area = one cable area × 5.",
            "formula": "Total cable area = cable area × quantity",
            "calculation": "28.28 × 5",
            "result": "141.40"
          },
          {
            "stepNumber": 4,
            "description": "Percentage fill = (total cable area ÷ conduit area) × 100.",
            "formula": "% fill = (cable ÷ enclosure) × 100",
            "calculation": "(141.40 ÷ 490.94) × 100",
            "result": "28.8"
          }
        ],
        "notes": "Result is 28.8% fill. You would compare this to the stated limit given in the question or reference table."
      }
    },
    {
      "id": "203-3F-guided",
      "type": "guided-practice",
      "order": 7,
      "content": {
        "title": "Guided Practice (We Do): Conduit Percentage Fill",
        "problem": "Calculate the percentage fill for 6 cables (overall diameter 4 mm) installed in a conduit with internal diameter 20 mm.",
        "steps": [
          {
            "stepNumber": 1,
            "prompt": "What is the conduit internal area? (Radius = 10)",
            "expectedAnswer": ["314.16", "314.2"],
            "hint": "Use π × r². Keep units out of the answer; units belong in the hint."
          },
          {
            "stepNumber": 2,
            "prompt": "What is the area of one 4 mm cable? (Radius = 2)",
            "expectedAnswer": ["12.56", "12.57"],
            "hint": "Use π × r². Keep units out of the answer."
          },
          {
            "stepNumber": 3,
            "prompt": "What is the total area of all 6 cables?",
            "expectedAnswer": ["75.36", "75.42"],
            "hint": "Multiply the single cable area by 6. Keep units out of the answer."
          },
          {
            "stepNumber": 4,
            "prompt": "What is the final percentage fill? (Round to 1 decimal place)",
            "expectedAnswer": ["24.0", "24"],
            "hint": "(total cable area ÷ conduit area) × 100. Keep the % symbol out of the answer."
          }
        ]
      }
    },
    {
      "id": "203-3F-practice",
      "type": "practice",
      "order": 8,
      "content": {
        "title": "Your Turn (You Do)",
        "questions": [
          {
            "id": "203-3F-P1",
            "questionText": "Calculate the internal area of trunking with internal dimensions 75 by 50. (Answer in mm2)",
            "answerType": "numeric",
            "expectedAnswer": ["3750"],
            "hint": "Area = width × height. Keep units out of expectedAnswer."
          },
          {
            "id": "203-3F-P2",
            "questionText": "A conduit has an internal area of 500. The total cable area is 175. What is the percentage fill?",
            "answerType": "numeric",
            "expectedAnswer": ["35", "35.0"],
            "hint": "(175 ÷ 500) × 100. Keep the % symbol out of expectedAnswer."
          },
          {
            "id": "203-3F-P3",
            "questionText": "One cable CSA is 12.5 and you install 8 of them. What is the total cable area?",
            "answerType": "numeric",
            "expectedAnswer": ["100"],
            "hint": "Total = 12.5 × 8. Keep units out of expectedAnswer."
          },
          {
            "id": "203-3F-P4",
            "questionText": "If the calculated fill is higher than the stated limit, is the installation acceptable?",
            "answerType": "short-text",
            "expectedAnswer": ["no", "not acceptable", "not compliant"],
            "hint": "Compare calculated % fill to the given limit."
          },
          {
            "id": "203-3F-P5",
            "questionText": "Name one reason why leaving spare space is considered good workmanship.",
            "answerType": "short-text",
            "expectedAnswer": [
              "it allows easier pulling-in and reduces snagging",
              "it leaves room for future additions or maintenance",
              "it reduces friction during pulling-in"
            ],
            "hint": "Think pulling-in and future maintenance."
          }
        ]
      }
    },
    {
      "id": "203-3F-integrative",
      "type": "practice",
      "order": 9.5,
      "content": {
        "title": "Putting It All Together",
        "mode": "integrative",
        "sequential": true,
        "questions": [
          {
            "id": "203-3F-INT-1",
            "questionText": "How does calculating percentage fill help you reduce BOTH mechanical damage risk during pulling-in and heat dissipation risk in service? (2-3 sentences)",
            "answerType": "short-text",
            "cognitiveLevel": "connection",
            "expectedAnswer": [
              "the calculation tells you how much air space remains; lower fill reduces friction and snagging during pulling-in and preserves air space so heat can dissipate in service",
              "percentage fill lets you check enclosure choice against a limit so cables can be pulled without insulation damage and still have air space for heat dissipation"
            ],
            "hint": "Link: % fill → free space → friction/snags and air space → heat dissipation."
          },
          {
            "id": "203-3F-INT-2",
            "questionText": "Explain the full process an electrician uses to decide if conduit or trunking is acceptable for a set of cables. Include what space factor is, the key maths steps, and the decision against a stated limit. (3-4 sentences)",
            "answerType": "short-text",
            "cognitiveLevel": "synthesis",
            "expectedAnswer": [
              "Space factor is the percentage of an enclosure’s internal cross-sectional area occupied by cables. The electrician calculates the enclosure internal area (circle for conduit, rectangle for trunking) and calculates total cable CSA from overall cable diameters. They use % fill = (total cable area ÷ enclosure area) × 100. Finally, they compare the calculated % fill to the stated limit to decide acceptable or not acceptable, reducing pulling-in damage risk and preserving air space for heat dissipation."
            ],
            "hint": "Definition → enclosure area → total cable area → % fill → compare to limit + safety reasons."
          }
        ]
      }
    },
    {
      "id": "203-3F-spaced-review",
      "type": "spaced-review",
      "order": 10,
      "content": {
        "title": "Spaced Review (from prerequisites)",
        "questions": [
          {
            "id": "203-3F-SR-1",
            "questionText": "In installation work, what does a containment system do for cables?",
            "expectedAnswer": [
              "it supports and protects cables",
              "it provides support and protection for cables",
              "supports and protects cables"
            ],
            "hint": "Think: why do we use conduit/trunking/tray?"
          },
          {
            "id": "203-3F-SR-2",
            "questionText": "What is conduit (as a containment type)?",
            "expectedAnswer": [
              "a tube or pipe enclosure used to protect and route cables",
              "a tube containment system that protects and routes cables",
              "a pipe enclosure for cables"
            ],
            "hint": "It’s the round tube containment."
          },
          {
            "id": "203-3F-SR-3",
            "questionText": "What is trunking (as a containment type)?",
            "expectedAnswer": [
              "a rectangular enclosure with a lid used to house and protect cables",
              "a rectangular cable enclosure (usually with a lid)",
              "a rectangular containment enclosure for cables"
            ],
            "hint": "Think rectangular enclosure with a lid."
          },
          {
            "id": "203-3F-SR-4",
            "questionText": "What does internal dimension/measurement refer to when choosing or checking a containment size?",
            "expectedAnswer": [
              "the usable internal space available for cables",
              "the measurement inside the enclosure that cables can occupy",
              "the inside measurement excluding the enclosure material thickness"
            ],
            "hint": "It’s the space the cables can actually occupy."
          }
        ],
        "notes": "SR-1 -> 203-3E (containment purpose); SR-2 -> 203-3E (conduit definition); SR-3 -> 203-3E (trunking definition); SR-4 -> 203-3E (internal usable space)"
      }
    }
  ],
  "metadata": {
    "created": "2026-02-04",
    "updated": "2026-02-04",
    "version": "1.1",
    "author": "C&G 2365 Learning Team"
  }
}


---

Grade: 98 / 100

Why it scores high (what you nailed):

✅ Schema + order contract perfect: 1,2,3,4,4.5,5,5.5,6,7,8,9.5,10 and strictly monotonic.

✅ Correct check structure: both checks are exactly 3× recall + 1× connection, and placed immediately after the explanations.

✅ Integrative block correct: exactly 2 questions, with connection + synthesis, and the prompts explicitly request the right sentence lengths.

✅ Worked ↔ guided alignment: guided practice mirrors the worked example workflow and step count (4 steps), which is what your rubric wants.

✅ Marking robustness: expectedAnswer is always arrays, numeric answers are unit-free, and you actively prevent %/mm² in expectedAnswer.

✅ Teaching-before-testing + staging: nothing is assessed before it’s taught (checks come after the relevant explanations).

What stops it being 100/100 (small but real):

Answer-coverage validator risk (1–2 pts): your current “answers must appear in explanations” logic can still flag numeric-heavy items or some phrasings even when the question is legitimate. The lesson is good; the validator may be the thing that “marks it down.”

Spaced review anchor fidelity (1 pt): SR is written to match typical 203-3E content, but without seeing the exact extracted anchors for your 203-3E file, I can’t guarantee verbatim alignment with your anchor extractor output.

To make it a guaranteed 100/100 in your pipeline

Adjust validateAnswerCoverage() to skip numeric questions entirely (or treat numbers as always-covered).

Ensure SR questions are generated only from the actual prerequisiteAnchors text (not “typical containment knowledge”). If you paste me the extracted anchors for 203-3E, I’ll rewrite SR to match them exactly.