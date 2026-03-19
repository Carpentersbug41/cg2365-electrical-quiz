import type { GuidedChunkFrame } from '@/lib/guidedChunk/types';

export const lesson2034AFrame: GuidedChunkFrame = {
  lessonId: 'gc-203-4A',
  lessonCode: '203-4A',
  title: '203.4A - Earthing Systems and ADS Components',
  runtimeVersion: 'guided_chunk_v1',
  variantId: '203-4A-json-baseline',
  unit: '203',
  topic: 'Earthing Systems and ADS Components',
  sourceRefs: ['C&G 2365 Unit 203', 'Guided baseline authored frame'],
  metadata: {
    created: '2026-03-12',
    updated: '2026-03-12',
    author: 'OpenAI guided baseline',
  },
  loSequence: [
    {
      loId: '203-4A-LO1',
      loTitle: 'Identify earthing systems and the main parts that make ADS work',
      successCriteria: [
        'Name the three earthing system types in scope.',
        'State how each system gets its earth path.',
        'Explain that ADS needs both a fault path and a protective device.',
      ],
      reviewHooks: ['TT vs TN-S vs TN-C-S', 'fault path', 'protective device'],
      chunkPlan: [
        {
          chunkId: '203-4A-C1',
          chunkIndex: 0,
          learningGoal: 'Distinguish TT, TN-S, and TN-C-S by how the installation gets its earth path.',
          teachingCore:
            'The first difference between TT, TN-S, and TN-C-S is how the installation gets its earth path. In TT, the installation relies on its own earth electrode. In TN-S, the supplier provides a separate earth path back to the source. In TN-C-S, earth and neutral are combined in the supply and separated at the intake position. That distinction matters because you need to identify the earthing arrangement correctly before you test, fault-find, or judge whether fault protection will operate properly.',
          teachingWordCount: 81,
          vocabPack: [
            {
              term: 'TT',
              definition: 'An earthing arrangement where the installation relies on its own earth electrode.',
            },
            {
              term: 'TN-S',
              definition: 'An earthing arrangement where the supplier provides a separate earth path.',
            },
            {
              term: 'TN-C-S',
              definition: 'An arrangement where earth and neutral are combined in the supply and separated at the intake.',
            },
          ],
          initialRecallQuestions: [
            {
              id: '203-4A-C1-Q1',
              prompt: 'Which three earthing system types are being compared here?',
              acceptableAnswers: ['TT, TN-S and TN-C-S'],
              expectedConcepts: ['TT', 'TN-S', 'TN-C-S'],
            },
            {
              id: '203-4A-C1-Q2',
              prompt: 'In TT, where does the installation get its earth path from?',
              acceptableAnswers: ['Its own earth electrode', 'An earth electrode'],
              expectedConcepts: ['own earth electrode'],
            },
            {
              id: '203-4A-C1-Q3',
              prompt: 'At what point are earth and neutral separated in a TN-C-S system?',
              acceptableAnswers: ['At the intake', 'At the cut-out', 'At the intake position'],
              expectedConcepts: ['intake', 'cut-out', 'separated at intake'],
            },
          ],
          candidateFollowUpModes: ['probe', 'contrast'],
          candidateDeeperQuestion: {
            id: '203-4A-C1-D1',
            prompt: 'Why would identifying the wrong earthing system lead to poor testing or fault-finding decisions?',
            expectedConcepts: ['wrong interpretation of test results', 'wrong protective arrangement', 'fault protection judgement'],
          },
          misconceptionCodes: ['tt_vs_tn_confusion', 'tncs_split_point_confusion'],
          repairTemplates: [
            {
              misconceptionCode: 'tt_vs_tn_confusion',
              shortCorrection: 'Close. In TT the installation relies on its own electrode, while TN systems rely on a supplier earth path.',
              contrastPrompt: 'Which system uses its own electrode, and which systems rely on the supplier earth path?',
              retryPrompt: 'Try again: how does TT get its earth path?',
            },
            {
              misconceptionCode: 'tncs_split_point_confusion',
              shortCorrection: 'In TN-C-S, earth and neutral are combined in the supply and separated at the intake position.',
              contrastPrompt: 'Is the separation done out in the final circuit, or at the intake position?',
              retryPrompt: 'Where are earth and neutral separated in TN-C-S?',
            },
          ],
          assetInjection: null,
          microbreakAfter: null,
          advanceRule: {
            minAcceptedRecallAnswers: 2,
            maxRepairLoops: 1,
            allowAdvanceOnFlaggedWeakness: true,
          },
        },
        {
          chunkId: '203-4A-C2',
          chunkIndex: 1,
          learningGoal: 'Understand what ADS is trying to achieve during a fault.',
          teachingCore:
            'Automatic Disconnection of Supply, or ADS, is the protective measure that disconnects the circuit when a fault makes exposed metalwork dangerous. For ADS to work, two things matter. First, the fault current needs a complete path back to the source. Second, the protective device must operate quickly enough to disconnect the supply. If either part is weak, the fault may not clear in the required time. So ADS is never just about the device on its own. It depends on both the fault path and the disconnection time.',
          teachingWordCount: 84,
          vocabPack: [
            {
              term: 'ADS',
              definition: 'Automatic Disconnection of Supply, the protective measure that disconnects a circuit under fault conditions.',
            },
            {
              term: 'Fault path',
              definition: 'The route the fault current takes back to the source.',
            },
          ],
          initialRecallQuestions: [
            {
              id: '203-4A-C2-Q1',
              prompt: 'What does ADS stand for?',
              acceptableAnswers: ['Automatic Disconnection of Supply'],
              expectedConcepts: ['Automatic Disconnection of Supply'],
            },
            {
              id: '203-4A-C2-Q2',
              prompt: 'What two things does ADS depend on?',
              acceptableAnswers: ['A complete fault path and a protective device that disconnects in time'],
              expectedConcepts: ['complete fault path', 'device disconnects in time'],
            },
            {
              id: '203-4A-C2-Q3',
              prompt: 'Is ADS only about the protective device, yes or no?',
              acceptableAnswers: ['No', 'No, it also depends on the fault path'],
              expectedConcepts: ['not only device', 'fault path also matters'],
            },
          ],
          candidateFollowUpModes: ['probe', 'repair'],
          candidateDeeperQuestion: {
            id: '203-4A-C2-D1',
            prompt: 'Why is it wrong to say that ADS is only about the circuit breaker or fuse?',
            expectedConcepts: ['fault path matters', 'device alone is not enough', 'disconnection depends on current path'],
          },
          misconceptionCodes: ['ads_device_only'],
          repairTemplates: [
            {
              misconceptionCode: 'ads_device_only',
              shortCorrection: 'The protective device matters, but ADS also depends on the fault current having a complete return path.',
              contrastPrompt: 'What else is needed besides the device itself for ADS to work?',
              retryPrompt: 'Try again: what two things does ADS depend on?',
            },
          ],
          assetInjection: null,
          microbreakAfter: null,
          advanceRule: {
            minAcceptedRecallAnswers: 2,
            maxRepairLoops: 1,
            allowAdvanceOnFlaggedWeakness: true,
          },
        },
        {
          chunkId: '203-4A-C3',
          chunkIndex: 2,
          learningGoal: 'Identify the main conductors and connections that form the fault return path inside the installation.',
          teachingCore:
            'Inside the installation, the fault return path is built from specific conductors and connections. The circuit protective conductor, or CPC, carries fault current back from the exposed metalwork of the equipment. That CPC returns to the main earthing terminal, often called the MET. The main earthing conductor links the MET to the supplier earth or to the installation earth electrode, depending on the earthing system. If you mix up those parts, it becomes hard to explain how fault current gets back to the source. The key idea is that each conductor has a distinct job in the return path.',
          teachingWordCount: 90,
          vocabPack: [
            {
              term: 'CPC',
              definition: 'Circuit protective conductor, the conductor that carries fault current back from exposed metalwork.',
            },
            {
              term: 'MET',
              definition: 'Main earthing terminal, the main connection point for earthing and bonding conductors.',
            },
            {
              term: 'Main earthing conductor',
              definition: 'The conductor linking the MET to the supplier earth or earth electrode.',
            },
          ],
          initialRecallQuestions: [
            {
              id: '203-4A-C3-Q1',
              prompt: 'What does CPC stand for?',
              acceptableAnswers: ['Circuit protective conductor'],
              expectedConcepts: ['Circuit protective conductor'],
            },
            {
              id: '203-4A-C3-Q2',
              prompt: 'Where does the CPC return to inside the installation?',
              acceptableAnswers: ['The MET', 'The main earthing terminal'],
              expectedConcepts: ['MET', 'main earthing terminal'],
            },
            {
              id: '203-4A-C3-Q3',
              prompt: 'What is the job of the main earthing conductor?',
              acceptableAnswers: ['It links the MET to the supplier earth or earth electrode'],
              expectedConcepts: ['links MET to supplier earth', 'links MET to earth electrode'],
            },
          ],
          candidateFollowUpModes: ['probe', 'contrast'],
          candidateDeeperQuestion: {
            id: '203-4A-C3-D1',
            prompt: 'Explain the difference between the CPC and the main earthing conductor.',
            expectedConcepts: ['CPC is circuit return from exposed metalwork', 'main earthing conductor links MET to earth source'],
          },
          misconceptionCodes: ['cpc_vs_earthing_conductor_confusion', 'met_role_confusion'],
          repairTemplates: [
            {
              misconceptionCode: 'cpc_vs_earthing_conductor_confusion',
              shortCorrection: 'The CPC belongs to the circuit return path from equipment. The main earthing conductor links the MET to the earth source.',
              contrastPrompt: 'Which conductor is in the circuit, and which one links the installation to the earth source?',
              retryPrompt: 'Try again: what is the difference between the CPC and the main earthing conductor?',
            },
            {
              misconceptionCode: 'met_role_confusion',
              shortCorrection: 'The MET is the main joining point for earthing and bonding conductors inside the installation.',
              contrastPrompt: 'Is the MET a protective device, or a connection point?',
              retryPrompt: 'What is the MET?',
            },
          ],
          assetInjection: null,
          microbreakAfter: null,
          advanceRule: {
            minAcceptedRecallAnswers: 2,
            maxRepairLoops: 1,
            allowAdvanceOnFlaggedWeakness: true,
          },
        },
        {
          chunkId: '203-4A-C4',
          chunkIndex: 3,
          learningGoal: 'Understand what bonding does and how it differs from earthing.',
          teachingCore:
            'Earthing and bonding are related, but they do not do the same job. Earthing provides the return path that helps protective devices clear a fault. Bonding reduces dangerous potential differences between conductive parts that could be touched at the same time. That is why main bonding is applied to incoming metallic services such as gas or water pipes when they are extraneous-conductive-parts. Bonding is not there to carry normal circuit current. Its job is to keep touch voltages lower during fault conditions by keeping conductive parts at a similar potential.',
          teachingWordCount: 82,
          vocabPack: [
            {
              term: 'Bonding',
              definition: 'Connecting conductive parts to reduce dangerous potential differences during fault conditions.',
            },
            {
              term: 'Extraneous-conductive-part',
              definition: 'A conductive part not forming part of the electrical installation that can introduce earth potential.',
            },
          ],
          initialRecallQuestions: [
            {
              id: '203-4A-C4-Q1',
              prompt: 'Does bonding do the same job as earthing, yes or no?',
              acceptableAnswers: ['No'],
              expectedConcepts: ['different jobs'],
            },
            {
              id: '203-4A-C4-Q2',
              prompt: 'What does bonding reduce during a fault?',
              acceptableAnswers: ['Potential differences', 'Touch voltage differences', 'Dangerous potential differences'],
              expectedConcepts: ['potential differences', 'touch voltages'],
            },
            {
              id: '203-4A-C4-Q3',
              prompt: 'Give one example of an incoming metallic service that may need main bonding.',
              expectedConcepts: ['gas pipe', 'water pipe'],
            },
          ],
          candidateFollowUpModes: ['repair', 'apply'],
          candidateDeeperQuestion: {
            id: '203-4A-C4-D1',
            prompt: 'Why is bonding important if earthing is already present?',
            expectedConcepts: ['reduces potential difference', 'earthing and bonding different jobs', 'simultaneously touched metalwork'],
          },
          misconceptionCodes: ['bonding_vs_earthing', 'plastic_service_bonding_confusion'],
          repairTemplates: [
            {
              misconceptionCode: 'bonding_vs_earthing',
              shortCorrection: 'Earthing helps fault current return and clear the fault. Bonding keeps conductive parts closer to the same potential.',
              contrastPrompt: 'Which one is about the return path, and which one is about reducing potential difference?',
              retryPrompt: 'Try again: what is the difference between earthing and bonding?',
            },
            {
              misconceptionCode: 'plastic_service_bonding_confusion',
              shortCorrection: 'Only conductive incoming services are relevant here. A plastic service is not an extraneous-conductive-part.',
              contrastPrompt: 'Can a plastic service introduce earth potential into the installation?',
              retryPrompt: 'Would a plastic incoming service normally need main bonding?',
            },
          ],
          assetInjection: null,
          microbreakAfter: null,
          advanceRule: {
            minAcceptedRecallAnswers: 2,
            maxRepairLoops: 1,
            allowAdvanceOnFlaggedWeakness: true,
          },
        },
      ],
      loTestMcq: {
        intro: 'Quick LO check: answer the multiple-choice questions on earthing systems and ADS components.',
        mcqs: [
          {
            id: '203-4A-LO1-M1',
            prompt: 'Which earthing system relies on an earth electrode at the installation?',
            options: ['TT', 'TN-S', 'TN-C-S', 'None of them'],
            correctIndex: 0,
            explanation: 'TT relies on its own earth electrode.',
          },
          {
            id: '203-4A-LO1-M2',
            prompt: 'In TN-C-S, where are earth and neutral separated?',
            options: ['At the final circuit', 'At the intake position', 'At every accessory', 'At the load only'],
            correctIndex: 1,
            explanation: 'In TN-C-S they are combined in the supply and separated at the intake position.',
          },
          {
            id: '203-4A-LO1-M3',
            prompt: 'What two things does ADS depend on?',
            options: [
              'A complete fault path and a protective device that disconnects in time',
              'Only a larger fuse',
              'Only the CPC',
              'Only bonding conductors',
            ],
            correctIndex: 0,
            explanation: 'ADS depends on both the fault path and the device operating within the required time.',
          },
          {
            id: '203-4A-LO1-M4',
            prompt: 'What is the job of the main earthing conductor?',
            options: [
              'To link the MET to the supplier earth or earth electrode',
              'To replace the CPC in the circuit',
              'To switch the load on and off',
              'To carry normal load current',
            ],
            correctIndex: 0,
            explanation: 'The main earthing conductor links the installation earthing point to the earth source.',
          },
          {
            id: '203-4A-LO1-M5',
            prompt: 'What does bonding reduce during a fault?',
            options: [
              'Potential differences between conductive parts',
              'The supply voltage permanently',
              'The need for a protective device',
              'The line conductor size',
            ],
            correctIndex: 0,
            explanation: 'Bonding reduces dangerous potential differences between conductive parts.',
          },
        ],
        shortAnswers: [],
      },
      loTestShortAnswer: {
        intro: 'Finish the LO with two short written answers.',
        mcqs: [],
        shortAnswers: [
          {
            id: '203-4A-LO1-S1',
            prompt: 'Explain the practical difference between TT, TN-S, and TN-C-S in one or two sentences.',
            expectedConcepts: ['TT uses earth electrode', 'TN-S separate supplier earth', 'TN-C-S separated at intake'],
          },
          {
            id: '203-4A-LO1-S2',
            prompt: 'Explain why ADS is not only about the protective device.',
            expectedConcepts: ['fault path matters', 'device must disconnect in time', 'both path and device needed'],
          },
        ],
      },
    },
  ],
};
