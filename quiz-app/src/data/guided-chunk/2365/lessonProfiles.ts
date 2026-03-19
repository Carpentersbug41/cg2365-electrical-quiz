export interface Cg2365GuidedLessonProfile {
  lessonCode: string;
  unit: string;
  topic: string;
  sourceText: string;
  additionalInstructions: string;
}

const phase1LessonProfiles: Record<string, Cg2365GuidedLessonProfile> = {
  '201-1A': {
    lessonCode: '201-1A',
    unit: 'Unit 201',
    topic: 'Health and safety roles and legislation',
    sourceText:
      'LO1: Understand how relevant legislation applies in the workplace.\nEmployers, employees, organisations, and clients all carry responsibilities. Key legislation includes the Health and Safety at Work Act, Electricity at Work Regulations, Management of Health and Safety at Work Regulations, COSHH, PUWER, PPE at Work Regulations, Manual Handling Operations Regulations, Working at Height Regulations, and environmental legislation such as Environmental Protection Act and Hazardous Waste Regulations.\n\nLO2: Explain how duties apply on site.\nEmployers provide safe systems, information, training, supervision, and equipment. Employees must work safely, follow procedures, use equipment correctly, report hazards, and avoid putting others at risk. Organisations must maintain policies and systems. Clients influence safety through site conditions, planning, and project arrangements.',
    additionalInstructions:
      'Teach this like an experienced 2365 tutor preparing a beginner for Unit 201 written questions. Keep the legal meaning practical and site-based rather than abstract. Use short checks that distinguish employer duties from employee duties and separate health-and-safety law from environmental law.',
  },
  '202-1A': {
    lessonCode: '202-1A',
    unit: 'Unit 202',
    topic: 'Atomic structure and electric current basics',
    sourceText:
      'LO1: Understand atomic structure for electrical science.\nAtoms contain protons, neutrons, and electrons. Electrons carry negative charge and can move in conductors. Protons are positive and remain in the nucleus. Current is the flow of charge.\n\nLO2: Relate structure to conductors and insulators.\nConductors allow electrons to move more freely. Insulators resist electron movement. The nature of the material affects resistance, current flow, and suitability for electrical use.',
    additionalInstructions:
      'Keep the science strictly in service of 2365 electrical understanding. Avoid GCSE-style general science drift. Build clear links between electrons, conductors, current, and resistance. Use practical electrical examples rather than chemistry-style wording.',
  },
  '203-1A': {
    lessonCode: '203-1A',
    unit: 'Unit 203',
    topic: 'Circuit types and what they do',
    sourceText:
      'LO1: Identify common circuit arrangements.\nRadial circuits run from the origin to the load without returning in a loop. Ring final circuits return to the origin and supply socket outlets. Lighting circuits may be radial and use loop-in methods at ceiling roses or junction boxes.\n\nLO2: Explain practical use.\nDifferent circuit types are chosen for different purposes. Socket circuits, lighting circuits, and control circuits use different layouts because of load, convenience, safety, and inspection requirements.',
    additionalInstructions:
      'Teach this as a practical installation lesson, not just definitions. Make the learner compare radial, ring, and lighting arrangements clearly. Use quick contrast questions to stop the learner mixing ring and radial properties.',
  },
  '204-13A': {
    lessonCode: '204-13A',
    unit: 'Unit 204',
    topic: '3-plate ceiling rose (loop-in)',
    sourceText:
      'LO1: Understand what a 3-plate ceiling rose is and what loop-in means.\nA 3-plate ceiling rose acts as both a lamp connection point and a junction point. Loop-in means the supply is joined at each light point and then continues to the next one.\n\nLO2: Sort conductors into the neutral, permanent live loop, and switched live groups.\nNeutral conductors are grouped together. Permanent live conductors, including the feed to the switch, are grouped in the loop terminals. The switched live return from the switch is grouped with the lamp live.\n\nLO3: Explain switched control and compare end-of-circuit with mid-circuit roses.\nThe switch interrupts and returns the live path to the lamp through the switched live. End-of-circuit roses are less crowded because they do not feed onward to another light point.',
    additionalInstructions:
      'Treat this as a total-beginner wiring explanation. Use conductor role language first, not colour memory first. Keep the mental model clear: neutral group, permanent live loop, switched live return, then compare mid-circuit and end-of-circuit roses.',
  },
};

export function listCg2365GuidedLessonProfiles(): Cg2365GuidedLessonProfile[] {
  return Object.keys(phase1LessonProfiles)
    .sort()
    .map((lessonCode) => phase1LessonProfiles[lessonCode])
    .filter((profile): profile is Cg2365GuidedLessonProfile => Boolean(profile));
}

export function getCg2365GuidedLessonProfile(lessonCode: string): Cg2365GuidedLessonProfile | null {
  return phase1LessonProfiles[lessonCode.trim().toUpperCase()] ?? null;
}
