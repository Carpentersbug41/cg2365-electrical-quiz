import type { Block } from '@/data/lessons/types';
import type { GuidedChunkFrame } from '@/lib/guidedChunk/types';

const groupSortingMicrobreak: Block = {
  id: '204-13A-gc-microbreak-1',
  type: 'microbreak',
  order: 999,
  content: {
    breakType: 'game',
    gameType: 'classify-two-bins',
    leftLabel: 'Permanent live loop',
    rightLabel: 'Switched live',
    prompt: 'Sort each statement into the correct side.',
    instructions: 'A quick reset before the next chunk.',
    timerSeconds: 30,
    enableSound: false,
    enableEffects: false,
    items: [
      { text: 'Feeds the switch down the drop', correctBin: 'left' },
      { text: 'Returns from the switch to the lamp', correctBin: 'right' },
      { text: 'Still live when the switch is off', correctBin: 'left' },
      { text: 'Only energises the lamp when the switch closes', correctBin: 'right' }
    ]
  }
};

export const lesson20413AFrame: GuidedChunkFrame = {
  lessonId: 'gc-204-13A',
  lessonCode: '204-13A',
  title: '204.13A - 3-plate ceiling rose (loop-in): Guided chunk runtime',
  runtimeVersion: 'guided_chunk_v1',
  variantId: '204-13A-v1a',
  unit: 'Unit 204',
  topic: '3-plate ceiling rose (loop-in)',
  sourceRefs: ['204-13A legacy lesson JSON', '2365 Unit 204 syllabus'],
  metadata: {
    created: '2026-03-10',
    updated: '2026-03-10',
    author: 'OpenAI guided chunk prototype'
  },
  loSequence: [
    {
      loId: '204-13A-LO1',
      loTitle: 'Understand what a 3-plate ceiling rose is and what loop-in means',
      successCriteria: [
        'State that a ceiling rose is both a lamp connection point and a junction point.',
        'Explain loop-in in plain English.'
      ],
      reviewHooks: ['ceiling rose purpose', 'loop-in meaning'],
      chunkPlan: [
        {
          chunkId: '204-13A-LO1-C1',
          chunkIndex: 0,
          learningGoal: 'Define the ceiling rose and its dual purpose.',
          teachingCore: 'A 3-plate ceiling rose is not just where the lamp hangs. In a loop-in lighting circuit it usually does two jobs at once: it acts as the connection point for the lamp and it acts as a small junction point where circuit conductors are grouped by job. That is why it can look crowded. For a beginner, the safest mental model is simple: the rose is a place where wires are sorted into the correct groups so the lamp can work and the circuit can continue.',
          teachingWordCount: 90,
          vocabPack: [
            { term: 'Ceiling rose', definition: 'A fitting that connects the lamp and also joins circuit conductors together.' },
            { term: 'Junction point', definition: 'A place where conductors are joined in the circuit.' }
          ],
          initialRecallQuestions: [
            {
              id: '204-13A-LO1-C1-Q1',
              prompt: 'What are the two jobs of a ceiling rose in this lesson?',
              acceptableAnswers: ['Lamp connection point and junction point', 'It connects the lamp and joins the circuit conductors'],
              expectedConcepts: ['lamp connection', 'junction point']
            },
            {
              id: '204-13A-LO1-C1-Q2',
              prompt: 'Why can a ceiling rose look crowded?',
              acceptableAnswers: ['Because it is also joining circuit conductors', 'Because it does more than just hold the lamp'],
              expectedConcepts: ['joins circuit conductors', 'not just lamp holder']
            },
            {
              id: '204-13A-LO1-C1-Q3',
              prompt: 'Is the rose only a lamp connector, yes or no?',
              acceptableAnswers: ['No', 'No, it is also a junction point'],
              expectedConcepts: ['not only lamp connector']
            }
          ],
          candidateFollowUpModes: ['probe', 'contrast'],
          candidateDeeperQuestion: {
            id: '204-13A-LO1-C1-D1',
            prompt: 'Explain in one or two sentences why calling a ceiling rose only a lamp connector is misleading.',
            expectedConcepts: ['junction point', 'conductors grouped', 'dual purpose']
          },
          misconceptionCodes: ['rose_only_holds_lamp'],
          repairTemplates: [
            {
              misconceptionCode: 'rose_only_holds_lamp',
              triggerPhrases: ['just holds the lamp', 'only for the lamp', 'only a light fitting'],
              shortCorrection: 'Close. The rose connects the lamp, but it also groups circuit conductors as a junction point.',
              contrastPrompt: 'Lamp holder only, or lamp connection plus conductor grouping?',
              retryPrompt: 'Try again: what two jobs does the ceiling rose do here?'
            }
          ],
          assetInjection: null,
          microbreakAfter: null,
          advanceRule: {
            minAcceptedRecallAnswers: 2,
            maxRepairLoops: 1,
            allowAdvanceOnFlaggedWeakness: true
          }
        },
        {
          chunkId: '204-13A-LO1-C2',
          chunkIndex: 1,
          learningGoal: 'Explain loop-in in plain English.',
          teachingCore: 'Loop-in means the main supply is joined at each light point and then continues to the next one. So a ceiling rose in the middle of the run may have a supply coming in, a supply going out, a cable going to the switch, and the lamp flex. You do not need a formal definition here. Think of the supply arriving at the rose, being grouped correctly, then carrying on to feed the next light. That is why a mid-circuit rose is busier than the last rose on the circuit.',
          teachingWordCount: 91,
          vocabPack: [
            { term: 'Loop-in', definition: 'A method where the supply is joined at each rose and continues to the next light point.' },
            { term: 'Lamp flex', definition: 'The short cable from the rose to the lamp holder.' }
          ],
          initialRecallQuestions: [
            {
              id: '204-13A-LO1-C2-Q1',
              prompt: 'In plain English, what does loop-in mean?',
              acceptableAnswers: ['The supply is joined at each rose and continues to the next light', 'The main supply loops from one light point to the next'],
              expectedConcepts: ['supply joined at each rose', 'continues to next light']
            },
            {
              id: '204-13A-LO1-C2-Q2',
              prompt: 'Why is a mid-circuit rose usually busier than the last rose?',
              acceptableAnswers: ['Because it has supply in and supply out roles', 'Because the circuit continues onward from it'],
              expectedConcepts: ['supply out', 'circuit continues']
            },
            {
              id: '204-13A-LO1-C2-Q3',
              prompt: 'Name one thing you might see at the rose besides the lamp flex.',
              expectedConcepts: ['supply in', 'supply out', 'switch drop']
            }
          ],
          candidateFollowUpModes: ['probe', 'apply'],
          candidateDeeperQuestion: {
            id: '204-13A-LO1-C2-D1',
            prompt: 'How would you explain the difference between a mid-circuit rose and the last rose to a total beginner?',
            expectedConcepts: ['mid-circuit has supply out', 'last rose less crowded', 'circuit continues vs ends']
          },
          misconceptionCodes: ['loop_in_means_ring', 'mid_and_end_same'],
          repairTemplates: [
            {
              misconceptionCode: 'loop_in_means_ring',
              shortCorrection: 'Not quite. Loop-in here means the lighting supply is joined at each rose and then continues onward, not that the lighting point forms a ring.',
              contrastPrompt: 'Does the supply stop at the rose, or continue to another light point?',
              retryPrompt: 'Try the loop-in idea again in plain English.'
            },
            {
              misconceptionCode: 'mid_and_end_same',
              shortCorrection: 'A mid-circuit rose usually has both supply in and supply out. The last rose does not have the onward supply role.',
              contrastPrompt: 'Which rose still has to feed another light point?',
              retryPrompt: 'Why is a mid-circuit rose busier than the last rose?'
            }
          ],
          assetInjection: null,
          microbreakAfter: null,
          advanceRule: {
            minAcceptedRecallAnswers: 2,
            maxRepairLoops: 1,
            allowAdvanceOnFlaggedWeakness: true
          }
        }
      ],
      loTestMcq: {
        intro: 'You have finished the first learning outcome. Do a quick multiple-choice check on what has been taught.',
        mcqs: [
          {
            id: '204-13A-LO1-M1',
            prompt: 'Which statement best describes a ceiling rose in this lesson?',
            options: ['It only supports the lamp physically', 'It is both a lamp connection point and a junction point', 'It replaces the light switch', 'It is only used on ring circuits'],
            correctIndex: 1,
            explanation: 'In this context the rose connects the lamp and groups conductors together.'
          },
          {
            id: '204-13A-LO1-M2',
            prompt: 'What does loop-in mean here?',
            options: ['The lamp flex loops around the holder', 'The main supply is joined at each rose and continues to the next light', 'The circuit has no switch', 'The CPC is looped through the switch'],
            correctIndex: 1,
            explanation: 'Loop-in refers to how the supply is joined and continued at each rose.'
          },
          {
            id: '204-13A-LO1-M3',
            prompt: 'Why is a mid-circuit ceiling rose often more crowded?',
            options: ['It contains the consumer unit', 'It must always include two switches', 'It often has supply in and supply out roles', 'It has no lamp flex'],
            correctIndex: 2,
            explanation: 'A mid-circuit rose still has to feed onward to another light point.'
          },
          {
            id: '204-13A-LO1-M4',
            prompt: 'Which item is the short cable from the rose to the lamp holder?',
            options: ['Switch drop', 'Lamp flex', 'CPC', 'Loop group'],
            correctIndex: 1,
            explanation: 'The lamp flex is the cable leading to the lamp holder.'
          },
          {
            id: '204-13A-LO1-M5',
            prompt: 'Which rose is usually less crowded?',
            options: ['Mid-circuit rose', 'End-of-circuit rose', 'Any rose with a switch drop', 'All are equally crowded'],
            correctIndex: 1,
            explanation: 'The end-of-circuit rose is usually less crowded because there is no onward supply out.'
          }
        ],
        shortAnswers: []
      },
      loTestShortAnswer: {
        intro: 'Finish the LO with two short written answers.',
        mcqs: [],
        shortAnswers: [
          {
            id: '204-13A-LO1-S1',
            prompt: 'Explain what loop-in means in one or two sentences.',
            acceptableAnswers: ['The supply is joined at each ceiling rose and continues to the next light point'],
            expectedConcepts: ['supply joined', 'continues to next light point']
          },
          {
            id: '204-13A-LO1-S2',
            prompt: 'Why is a ceiling rose more than just a lamp connector?',
            expectedConcepts: ['junction point', 'groups conductors', 'dual purpose']
          }
        ]
      }
    },
    {
      loId: '204-13A-LO2',
      loTitle: 'Sort conductors into the three terminal groups',
      successCriteria: ['Name the neutral, permanent live loop, and switched live groups.', 'Place common conductors into the correct group.'],
      reviewHooks: ['neutral group', 'loop group', 'switched live group'],
      chunkPlan: [
        {
          chunkId: '204-13A-LO2-C1',
          chunkIndex: 0,
          learningGoal: 'Recognise the three groups visually and by purpose.',
          teachingCore: 'A 3-plate rose makes more sense if you think in three labeled buckets. One bucket is for neutrals. One bucket is for permanent lives, often called the loop group. The third bucket is for the switched live side that feeds the lamp after the switch has done its job. Beginners often try to memorize color first. That is risky. The safer rule is to identify the conductor by job, then place it in the correct group. Group by function first, then use color only as a supporting clue.',
          teachingWordCount: 95,
          vocabPack: [
            { term: 'Permanent live loop', definition: 'The group that remains live and feeds onward conductors and the switch feed.' },
            { term: 'Switched live', definition: 'The live conductor returning from the switch to feed the lamp when the switch is on.' }
          ],
          initialRecallQuestions: [
            {
              id: '204-13A-LO2-C1-Q1',
              prompt: 'What are the three main terminal groups in a 3-plate rose?',
              acceptableAnswers: ['Neutral, permanent live loop, and switched live'],
              expectedConcepts: ['neutral', 'permanent live loop', 'switched live']
            },
            {
              id: '204-13A-LO2-C1-Q2',
              prompt: 'Should you identify conductors by color first or by job first?',
              acceptableAnswers: ['By job first', 'By role first'],
              expectedConcepts: ['job first', 'role first']
            },
            {
              id: '204-13A-LO2-C1-Q3',
              prompt: 'Which group remains live when the switch is off?',
              acceptableAnswers: ['Permanent live loop', 'Loop group'],
              expectedConcepts: ['permanent live', 'loop group']
            }
          ],
          candidateFollowUpModes: ['contrast', 'probe'],
          candidateDeeperQuestion: {
            id: '204-13A-LO2-C1-D1',
            prompt: 'Why is grouping by conductor role safer than grouping by color alone?',
            expectedConcepts: ['color can mislead', 'job determines correct terminal', 'role first']
          },
          misconceptionCodes: ['sort_by_colour_only', 'switched_live_same_as_loop'],
          repairTemplates: [
            {
              misconceptionCode: 'sort_by_colour_only',
              shortCorrection: 'Color can help, but the real rule is role first. A conductor goes into the group that matches its job.',
              contrastPrompt: 'Which is more reliable for placement: color, or the conductor job in the circuit?',
              retryPrompt: 'Try again: should you sort by color first or by job first?'
            },
            {
              misconceptionCode: 'switched_live_same_as_loop',
              shortCorrection: 'The loop group stays permanently live. The switched live only feeds the lamp after the switch returns it.',
              contrastPrompt: 'Which group is live before the switch is turned on?',
              retryPrompt: 'Which group remains live when the switch is off?'
            }
          ],
          assetInjection: {
            kind: 'image',
            assetId: '204-13A-main-diagram',
            title: 'Three terminal groups at a glance',
            description: 'Use the image to anchor the three buckets before moving into conductor sorting.',
            imageUrl: '/images/lessons/1769620003359-ceiling_rose_end_newcolours.png',
            alt: 'Three-plate ceiling rose diagram showing neutrals, permanent live loop, and switched live groups.'
          },
          microbreakAfter: null,
          advanceRule: {
            minAcceptedRecallAnswers: 2,
            maxRepairLoops: 1,
            allowAdvanceOnFlaggedWeakness: true
          }
        },
        {
          chunkId: '204-13A-LO2-C2',
          chunkIndex: 1,
          learningGoal: 'Place common conductor roles into the correct group.',
          teachingCore: 'Now sort the common roles. In the neutral group you usually join neutral in, neutral out, and the lamp neutral. In the permanent live loop group you usually join live in, live out, and the feed that goes down to the switch. In the switched live group you usually join the switched live return from the switch with the lamp live. This is the key beginner pattern. If the lamp live sat in the permanent live group, the lamp would be live all the time instead of waiting for the switch return.',
          teachingWordCount: 98,
          vocabPack: [{ term: 'Switch drop', definition: 'The cable that carries a permanent live down to the switch and brings the switched live back.' }],
          initialRecallQuestions: [
            {
              id: '204-13A-LO2-C2-Q1',
              prompt: 'Which group usually contains the feed going down to the switch?',
              acceptableAnswers: ['Permanent live loop', 'Loop group'],
              expectedConcepts: ['permanent live', 'switch feed']
            },
            {
              id: '204-13A-LO2-C2-Q2',
              prompt: 'Where does the lamp live go?',
              acceptableAnswers: ['Switched live group', 'With the switched live return'],
              expectedConcepts: ['switched live group', 'lamp live with switched return']
            },
            {
              id: '204-13A-LO2-C2-Q3',
              prompt: 'Name one conductor role that belongs in the neutral group.',
              expectedConcepts: ['neutral in', 'neutral out', 'lamp neutral']
            }
          ],
          candidateFollowUpModes: ['apply', 'contrast'],
          candidateDeeperQuestion: {
            id: '204-13A-LO2-C2-D1',
            prompt: 'Why must the lamp live be kept out of the permanent live loop group?',
            expectedConcepts: ['lamp would be permanently live', 'switch must control lamp', 'switched return']
          },
          misconceptionCodes: ['lamp_live_in_loop_group', 'switch_feed_in_switched_group'],
          repairTemplates: [
            {
              misconceptionCode: 'lamp_live_in_loop_group',
              shortCorrection: 'If the lamp live sat in the permanent live group, the lamp would be live continuously instead of being controlled by the switch.',
              contrastPrompt: 'Which side should receive the return from the switch: permanent live, or switched live?',
              retryPrompt: 'Try again: where does the lamp live go?'
            },
            {
              misconceptionCode: 'switch_feed_in_switched_group',
              shortCorrection: 'The feed down to the switch starts as a permanent live. It belongs in the loop group, not the switched live group.',
              contrastPrompt: 'Is the feed going to the switch already switched, or still permanently live?',
              retryPrompt: 'Which group contains the feed going down to the switch?'
            }
          ],
          assetInjection: null,
          microbreakAfter: {
            id: '204-13A-LO2-MB1',
            intro: 'Quick reset: sort the loop-side statements from the switched-live statements.',
            resumePrompt: 'Good. Bring that distinction straight back into the next step.',
            block: groupSortingMicrobreak
          },
          advanceRule: {
            minAcceptedRecallAnswers: 2,
            maxRepairLoops: 1,
            allowAdvanceOnFlaggedWeakness: true
          }
        }
      ],
      loTestMcq: {
        intro: 'Quick multiple-choice check on the terminal groups.',
        mcqs: [
          {
            id: '204-13A-LO2-M1',
            prompt: 'Which group usually contains neutral in, neutral out, and lamp neutral?',
            options: ['Neutral group', 'Switched live group', 'Permanent live loop', 'CPC group'],
            correctIndex: 0,
            explanation: 'Those conductor roles all belong in the neutral group.'
          },
          {
            id: '204-13A-LO2-M2',
            prompt: 'Which group usually contains live in, live out, and the feed to the switch?',
            options: ['Switched live group', 'Neutral group', 'Permanent live loop', 'Lamp flex only'],
            correctIndex: 2,
            explanation: 'Those roles are still permanently live and belong in the loop group.'
          },
          {
            id: '204-13A-LO2-M3',
            prompt: 'Where should the lamp live usually be joined?',
            options: ['Neutral group', 'Permanent live loop', 'Switched live group', 'CPC connector'],
            correctIndex: 2,
            explanation: 'Lamp live should be joined with the switched live return.'
          },
          {
            id: '204-13A-LO2-M4',
            prompt: 'Why should you not sort by color alone?',
            options: ['Because color has no meaning at all', 'Because role in the circuit is the safer rule', 'Because all conductors are the same color', 'Because color only matters for CPCs'],
            correctIndex: 1,
            explanation: 'Role in the circuit is the reliable placement rule.'
          },
          {
            id: '204-13A-LO2-M5',
            prompt: 'What would likely happen if lamp live were placed in the permanent live loop group?',
            options: ['The lamp would stay off forever', 'The CPC would become neutral', 'The lamp would be live all the time', 'The rose would stop acting as a junction'],
            correctIndex: 2,
            explanation: 'The switch would no longer control the lamp correctly.'
          }
        ],
        shortAnswers: []
      },
      loTestShortAnswer: {
        intro: 'Finish with two short answers on conductor grouping.',
        mcqs: [],
        shortAnswers: [
          {
            id: '204-13A-LO2-S1',
            prompt: 'Explain where the switched live return belongs and why.',
            expectedConcepts: ['switched live group', 'feeds lamp after switch', 'not permanent live']
          },
          {
            id: '204-13A-LO2-S2',
            prompt: 'List the three terminal groups in a 3-plate rose and one conductor role for each.',
            expectedConcepts: ['neutral group', 'permanent live loop', 'switched live group']
          }
        ]
      }
    },
    {
      loId: '204-13A-LO3',
      loTitle: 'Explain switched control and compare end-of-circuit with mid-circuit roses',
      successCriteria: ['Explain why the switch must control the lamp through the switched live return.', 'State why an end-of-circuit rose is less crowded.'],
      reviewHooks: ['switch control', 'end-of-circuit rose'],
      chunkPlan: [
        {
          chunkId: '204-13A-LO3-C1',
          chunkIndex: 0,
          learningGoal: 'Explain why the switch controls the lamp through the switched live return.',
          teachingCore: 'A simple one-way switch acts like a bridge in the live path. A permanent live is sent down to the switch. When the switch closes, that live returns as the switched live and then feeds the lamp live. That is why the lamp only comes on when the switch completes the path. This is the core control idea: the lamp live must wait for the switched return. If you ignore that relationship, the rose becomes a memorizing exercise instead of a circuit you actually understand.',
          teachingWordCount: 91,
          vocabPack: [{ term: 'Switched return', definition: 'The live conductor coming back from the switch after the switch closes the path.' }],
          initialRecallQuestions: [
            {
              id: '204-13A-LO3-C1-Q1',
              prompt: 'Why does the lamp only come on when the switch closes?',
              expectedConcepts: ['switched live return', 'completes live path', 'feeds lamp live']
            },
            {
              id: '204-13A-LO3-C1-Q2',
              prompt: 'What travels down to the switch before it returns to the lamp?',
              acceptableAnswers: ['Permanent live', 'A permanent live feed'],
              expectedConcepts: ['permanent live feed']
            },
            {
              id: '204-13A-LO3-C1-Q3',
              prompt: 'What does the switched live return do?',
              expectedConcepts: ['returns from switch', 'feeds lamp live', 'controls lamp']
            }
          ],
          candidateFollowUpModes: ['probe', 'apply'],
          candidateDeeperQuestion: {
            id: '204-13A-LO3-C1-D1',
            prompt: 'Explain in one or two sentences why understanding the switched return is better than memorizing wire positions.',
            expectedConcepts: ['explains control logic', 'understand circuit function', 'not just memorization']
          },
          misconceptionCodes: ['switch_controls_neutral', 'lamp_live_always_live'],
          repairTemplates: [
            {
              misconceptionCode: 'switch_controls_neutral',
              shortCorrection: 'In this beginner model the switch is controlling the live path to the lamp, not the neutral group.',
              contrastPrompt: 'Which side is being interrupted to control the lamp in this lesson: neutral or live?',
              retryPrompt: 'Try again: why does the lamp only come on when the switch closes?'
            },
            {
              misconceptionCode: 'lamp_live_always_live',
              shortCorrection: 'Lamp live should wait for the switched return. It is not meant to sit permanently energized in the loop group.',
              contrastPrompt: 'Does lamp live wait for the return from the switch, or stay permanently live?',
              retryPrompt: 'What does the switched live return do?'
            }
          ],
          assetInjection: null,
          microbreakAfter: null,
          advanceRule: {
            minAcceptedRecallAnswers: 2,
            maxRepairLoops: 1,
            allowAdvanceOnFlaggedWeakness: true
          }
        },
        {
          chunkId: '204-13A-LO3-C2',
          chunkIndex: 1,
          learningGoal: 'Compare end-of-circuit and mid-circuit roses.',
          teachingCore: 'An end-of-circuit rose is usually less crowded because it does not have the onward supply-out roles found at a mid-circuit rose. The last rose still needs the lamp connections and the switch relationship, but it does not need to feed another light point beyond itself. That means fewer conductors to group. This comparison matters because it stops learners thinking every ceiling rose must look equally busy. The job is the same pattern, but the conductor count changes depending on whether the circuit continues onward from that point.',
          teachingWordCount: 90,
          vocabPack: [],
          initialRecallQuestions: [
            {
              id: '204-13A-LO3-C2-Q1',
              prompt: 'Why is an end-of-circuit rose usually less crowded?',
              acceptableAnswers: ['Because it does not have the onward supply out roles', 'Because the circuit does not continue to another light point'],
              expectedConcepts: ['no supply out', 'circuit does not continue']
            },
            {
              id: '204-13A-LO3-C2-Q2',
              prompt: 'Does the last rose still need the switch relationship for the lamp, yes or no?',
              acceptableAnswers: ['Yes', 'Yes, it still needs switched control for the lamp'],
              expectedConcepts: ['still needs switch relationship']
            },
            {
              id: '204-13A-LO3-C2-Q3',
              prompt: 'What changes between a mid-circuit rose and an end-of-circuit rose: the basic pattern, or the conductor count?',
              acceptableAnswers: ['The conductor count', 'Mainly the conductor count'],
              expectedConcepts: ['conductor count changes', 'basic pattern same']
            }
          ],
          candidateFollowUpModes: ['contrast'],
          candidateDeeperQuestion: {
            id: '204-13A-LO3-C2-D1',
            prompt: 'How would you reassure a beginner who thinks every ceiling rose must look equally crowded?',
            expectedConcepts: ['pattern same', 'conductor count differs', 'depends if circuit continues']
          },
          misconceptionCodes: ['end_rose_no_switch_logic', 'all_roses_same_density'],
          repairTemplates: [
            {
              misconceptionCode: 'end_rose_no_switch_logic',
              shortCorrection: 'The end rose is less crowded, but the lamp still needs the switch relationship and switched return.',
              contrastPrompt: 'Does the lamp at the last rose still need switched control?',
              retryPrompt: 'Does the last rose still need the switch relationship for the lamp?'
            },
            {
              misconceptionCode: 'all_roses_same_density',
              shortCorrection: 'The pattern stays the same, but a mid-circuit rose often has more conductors because it must feed onward.',
              contrastPrompt: 'Which rose still has to feed another light point onward?',
              retryPrompt: 'Why is an end-of-circuit rose usually less crowded?'
            }
          ],
          assetInjection: null,
          microbreakAfter: null,
          advanceRule: {
            minAcceptedRecallAnswers: 2,
            maxRepairLoops: 1,
            allowAdvanceOnFlaggedWeakness: true
          }
        }
      ],
      loTestMcq: {
        intro: 'Final multiple-choice check for the last LO.',
        mcqs: [
          {
            id: '204-13A-LO3-M1',
            prompt: 'What returns from the switch to feed the lamp?',
            options: ['Neutral', 'CPC', 'Switched live', 'Supply out neutral'],
            correctIndex: 2,
            explanation: 'The switched live return comes back from the switch to feed the lamp live.'
          },
          {
            id: '204-13A-LO3-M2',
            prompt: 'Why is the lamp not permanently on?',
            options: ['Because the switch controls the live path to the lamp', 'Because the neutral is switched', 'Because the CPC carries normal current', 'Because the lamp flex blocks current'],
            correctIndex: 0,
            explanation: 'The switch must complete the live path before the lamp is fed.'
          },
          {
            id: '204-13A-LO3-M3',
            prompt: 'Why is an end-of-circuit rose usually less crowded?',
            options: ['It has no lamp flex', 'It has no CPCs', 'It does not need onward supply-out roles', 'It does not use a switch'],
            correctIndex: 2,
            explanation: 'There is no onward light point to feed from the final rose.'
          },
          {
            id: '204-13A-LO3-M4',
            prompt: 'What mainly changes between a mid-circuit and an end-of-circuit rose?',
            options: ['The conductor count', 'The need for a lamp', 'The presence of neutrals', 'The existence of a switch'],
            correctIndex: 0,
            explanation: 'The pattern stays, but the conductor count often changes.'
          },
          {
            id: '204-13A-LO3-M5',
            prompt: 'Which statement is correct?',
            options: ['Lamp live belongs in the permanent live loop group', 'The switch usually interrupts the live path to the lamp', 'An end rose never has a switched live', 'All roses must look equally crowded'],
            correctIndex: 1,
            explanation: 'The switch controls the live path by returning a switched live to the lamp.'
          }
        ],
        shortAnswers: []
      },
      loTestShortAnswer: {
        intro: 'Finish the lesson with two final short answers.',
        mcqs: [],
        shortAnswers: [
          {
            id: '204-13A-LO3-S1',
            prompt: 'Explain why the lamp live waits for the switched live return.',
            expectedConcepts: ['switch controls lamp', 'returns from switch', 'not permanently live']
          },
          {
            id: '204-13A-LO3-S2',
            prompt: 'Compare a mid-circuit rose and an end-of-circuit rose in one or two sentences.',
            expectedConcepts: ['mid-circuit feeds onward', 'end less crowded', 'pattern same but conductor count differs']
          }
        ]
      }
    }
  ]
};
