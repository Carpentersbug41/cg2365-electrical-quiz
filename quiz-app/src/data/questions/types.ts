/**
 * Question Bank Types
 * Extended from existing Question type with tagging and misconception support
 */

import { Question as BaseQuestion } from '../questions';

/**
 * Misconception Code: Identifies common student errors
 */
export type MisconceptionCode =
  | 'USED_PARALLEL_RULE'        // Applied parallel formula in series
  | 'USED_SERIES_RULE'          // Applied series formula in parallel
  | 'UNITS_MISSING'             // Answer missing units
  | 'WRONG_UNITS'               // Incorrect unit used
  | 'MULTIPLIED_INSTEAD'        // Multiplied when should add/divide
  | 'DIVIDED_INSTEAD'           // Divided when should multiply/add
  | 'RECIPROCAL_ERROR'          // Forgot to take reciprocal in parallel
  | 'SIGN_ERROR'                // Sign mistake in calculation
  | 'ROUNDING_ERROR'            // Excessive rounding
  | 'FORMULA_NOT_REARRANGED'    // Used formula without rearranging
  | 'CONFUSED_I_V_R'            // Mixed up I, V, R positions
  | 'TOPOLOGY_CONFUSION'        // Couldn't identify series vs parallel
  | 'ARITHMETIC_ERROR'          // Basic arithmetic mistake
  | 'VOLTAGE_EQUAL_SPLIT_ERROR' // Assumed voltage splits equally regardless of resistance
  | 'VOLTAGE_DIVIDER_ERROR'     // Incorrect voltage divider calculation
  | 'VOLTAGE_RULE'              // Incorrect application of voltage rule
  | 'METER_CONNECTION_ERROR'    // Wrong meter connection (ammeter/voltmeter)
  // AC/DC specific
  | 'CONFUSED_AC_DC_SOURCES'    // Mixed up which sources provide AC vs DC
  | 'CONFUSED_INTERNATIONAL_VOLTAGE' // Used voltage from different country
  | 'CONFUSED_WITH_LOW_VOLTAGE' // Confused mains voltage with low voltage
  | 'CONFUSED_WITH_THREE_PHASE' // Confused single phase with three phase voltage
  | 'CONFUSED_INTERNATIONAL_FREQUENCY' // Used frequency from different country
  | 'DOUBLED_FREQUENCY'         // Incorrectly doubled the frequency
  | 'HALVED_FREQUENCY'          // Incorrectly halved the frequency
  | 'CONFUSED_FREQUENCY_WITH_VOLTAGE' // Mixed up frequency with voltage
  | 'CONFUSED_FREQUENCY_WITH_CURRENT' // Mixed up frequency with current
  | 'CONFUSED_FREQUENCY_UNIT'   // Used wrong unit for frequency
  | 'CONFUSED_DC_WITH_AC'       // Applied DC characteristics to AC
  | 'CONFUSED_AC_WITH_DC'       // Applied AC characteristics to DC
  | 'ASSIGNED_FREQUENCY_TO_DC'  // Incorrectly gave DC a frequency
  | 'CONFUSED_WIRE_COLORS'      // Mixed up UK wire color codes
  | 'CONFUSED_OLD_WIRE_COLORS'  // Used old UK wire colors instead of new
  | 'CONFUSED_INTERNATIONAL_STANDARDS' // Mixed up international electrical standards
  | 'CONFUSED_POWER_SUPPLY_VS_LOAD' // Mixed up power supply with load device
  | 'CONFUSED_CYCLE_WITH_FREQUENCY' // Confused one cycle with the frequency value
  | 'CONFUSED_FREQUENCY_WITH_REVERSALS' // Confused cycles per second with direction reversals
  | 'CONFUSED_TRANSFORMER_WITH_RECTIFIER' // Mixed up transformer and rectifier functions
  | 'CONFUSED_INVERTER_WITH_RECTIFIER' // Mixed up inverter and rectifier functions
  | 'CONFUSED_NEUTRAL_WITH_EARTH' // Mixed up neutral and earth wire functions
  | 'CONFUSED_AC_DC_INTERNATIONALLY' // Thought different countries use different current types
  | 'CONFUSED_DISTRIBUTION_VOLTAGES' // Mixed up transmission/distribution voltage levels
  | 'CONFUSED_LIVE_NEUTRAL_FUNCTION' // Mixed up live and neutral wire functions
  | 'EXPECTED_EXACT_NOMINAL_VOLTAGE' // Expected exactly nominal voltage (e.g., exactly 230V)
  | 'DID_NOT_DIVIDE_BY_TIME'    // Forgot to divide by time in frequency calculation
  | 'CONFUSED_FREQUENCY_EFFECT_ON_MOTORS' // Misunderstood how frequency affects motor speed
  | 'HALVED_INSTEAD_OF_DOUBLED' // Halved when should have doubled
  | 'CONFUSED_ELECTRON_DRIFT_WITH_SIGNAL' // Mixed up electron drift velocity with signal velocity
  | 'CONFUSED_ELECTRON_SPEED_WITH_LIGHT_SPEED' // Thought electrons travel at light speed
  | 'CONFUSED_RMS_WITH_DC'      // Confused RMS AC voltage with constant DC
  | 'CONFUSED_RMS_WITH_PEAK'    // Confused RMS voltage with peak voltage
  | 'CONFUSED_RESISTANCE_WITH_AC_DC' // Thought resistance changes with AC vs DC
  | 'CONFUSED_TRANSFORMER_WITH_AC_DC' // Mixed up transformer function with AC/DC conversion
  | 'CONFUSED_VOLTAGE_WITH_POWER' // Mixed up voltage with power
  | 'CONFUSED_FREQUENCY_WITH_VOLTAGE_RATIO' // Thought frequency affects transformer voltage ratio
  // AC Generation specific
  | 'CONFUSED_AC_DC_GENERATOR_PARTS' // Mixed up slip rings with commutator
  | 'CONFUSED_PARALLEL_PERPENDICULAR' // Mixed up when generator voltage is max vs zero
  | 'DID_NOT_CONVERT_RPM_TO_RPS' // Forgot to convert rpm to revolutions per second
  | 'CONFUSED_POSITIVE_NEGATIVE_PEAKS' // Mixed up which rotation position produces which peak
  // AC Waveform specific
  | 'CONFUSED_TERMINOLOGY'       // Mixed up technical terminology
  | 'CONFUSED_PEAK_DEFINITIONS'  // Confused different peak measurements
  | 'CONFUSED_METER_READING'     // Misunderstood what meters display
  | 'USED_F_INSTEAD_OF_1_F'      // Used frequency directly instead of 1/f for period
  | 'CONFUSED_PEAK_TO_PEAK'      // Confused peak-to-peak with peak or RMS
  | 'CALCULATED_RMS_WRONG'       // Error in RMS calculation
  | 'FORMULA_WRONG'              // Used wrong formula
  | 'CONFUSED_AVERAGE_RMS'       // Confused average voltage with RMS
  | 'CONFUSED_AVERAGE_PEAK'      // Confused average voltage with peak
  | 'CONFUSED_AMPLITUDE_RMS'     // Confused amplitude with RMS
  | 'CONFUSED_TIME_VOLTAGE'      // Mixed up time and voltage measurements
  | 'USED_PEAK_NOT_P_P'          // Used peak value instead of peak-to-peak
  | 'INVERSE_WRONG'              // Got inverse relationship backwards
  | 'CONFUSED_RELATIONSHIP'      // Misunderstood relationship between concepts
  | 'WRONG_REASON'               // Correct answer but wrong reasoning
  | 'CONFUSED_PEAK_CURRENT'      // Confused peak voltage with current
  | 'CONFUSED_PEAK_POWER'        // Confused peak voltage with power
  | 'COUNTED_BOTH_PEAKS'         // Counted both positive and negative peaks
  | 'WRONG_MULTIPLIER'           // Used wrong multiplication factor
  | 'CONFUSED_INSTRUMENTS'       // Misunderstood instrument readings
  | 'CONFUSED_PERIOD_FREQUENCY'  // Mixed up period and frequency
  | 'DIVIDED_WRONG'              // Division error in calculation
  | 'MULTIPLIED_BY_2_WRONG'      // Incorrectly multiplied by 2
  | 'USED_0707_WRONG_WAY'        // Applied 0.707 factor incorrectly
  | 'USED_RMS_NOT_PEAK'          // Used RMS when peak was needed
  | 'USED_PEAK_TO_PEAK'          // Used peak-to-peak when other value needed
  | 'WRONG_DIAGNOSIS'            // Incorrect diagnosis of problem
  | 'WRONG_INTERPRETATION'       // Misinterpreted information
  | 'WRONG_ACTION'               // Recommended wrong action
  | 'CONFUSED_VOLTAGE_FREQUENCY' // Mixed up voltage and frequency
  | 'CONFUSED_DISTORTION_EFFECT' // Misunderstood effect of waveform distortion
  | 'FORGOT_TO_HALVE_P_P'        // Forgot to divide peak-to-peak by 2
  | 'CALCULATED_PEAK_NOT_P_P'    // Calculated peak instead of peak-to-peak
  | 'MULTIPLIED_BY_2_ONLY'       // Only multiplied by 2 without other conversion
  | 'WRONG_DECIMAL'              // Decimal point error
  | 'USED_T_INSTEAD_OF_1_T'      // Used T directly instead of 1/T
  | 'WRONG_CALCULATION'          // General calculation error
  | 'WRONG_UNITS'                // Used wrong units
  // Magnetism specific (from existing lessons)
  | 'CONFUSED_WITH_ELECTRICAL_CHARGE' // Mixed up magnetic poles with electrical charge
  | 'CONFUSED_POLE_BEHAVIOR'    // Misunderstood how magnetic poles attract/repel
  | 'REVERSED_FIELD_DIRECTION'  // Got magnetic field direction backwards
  | 'PARTIAL_UNDERSTANDING'     // Partially correct but incomplete understanding
  | 'HEALTH_SAFETY'             // Health and safety misconception
  | 'CALCULATION_ERROR'         // General calculation error
  | 'OTHER';                    // Other error

/**
 * Question Tag: For filtering and organization
 */
export type QuestionTag =
  | 'series'
  | 'parallel'
  | 'mixed-circuit'
  | 'ohms-law'
  | 'current-rule'
  | 'voltage-rule'
  | 'resistance-rule'
  | 'calculation'
  | 'discrimination'
  | 'explanation'
  | 'conceptual'
  | 'application'
  | 'measurement'       // About meter connections/measurements
  | 'formula'           // Formula recognition/application
  | 'units'             // Unit conversion/understanding
  | 'conversion'        // Unit or value conversion
  | 'topology'          // Circuit topology identification
  | 'voltage-divider'   // Voltage divider calculations
  | 'faults'            // Circuit faults/troubleshooting
  // AC/DC specific tags
  | 'ac-dc'             // AC vs DC concepts
  | 'frequency'         // Frequency-related questions
  | 'uk-mains'          // UK mains supply specifics
  | 'safety'            // Safety considerations
  // Magnetism specific tags (from existing lessons)
  | 'magnetic-poles'    // Magnetic pole behavior
  | 'magnetic-field'    // Magnetic field concepts
  | 'electromagnets'    // Electromagnet principles
  | 'motors'            // Electric motor principles
  | 'relays'            // Relay operation
  | 'transformers'      // Transformer principles
  // AC Generation specific tags
  | 'generator-components'  // Generator parts and functions
  | 'generator-principle'   // How generators work
  | 'electromagnetic-induction' // Electromagnetic induction principle
  | 'rotation-position' // Generator rotation angle and voltage
  | 'waveform'          // AC waveform/sine wave concepts
  | 'rotation-speed'    // Rotation speed and frequency relationship
  | 'voltage-output'    // Generator voltage output
  | 'ac-principle'      // AC generation principles
  | 'energy-conversion' // Energy conversion in generators
  | 'coil-design'       // Generator coil design factors
  | 'voltage-factors'   // Factors affecting voltage
  | 'real-world'        // Real-world generator applications
  | 'rotation-direction' // Direction of rotation effects
  | 'time-period'       // Time period and frequency
  | 'visual'            // Visual interpretation of diagrams
  | 'ac-vs-dc'          // AC vs DC generator differences
  | 'connections'       // Connections to other concepts
  | 'terminology'       // Generator terminology
  | 'load-response'     // Generator response to load changes
  | 'efficiency'        // Generator efficiency
  | 'generator-design'  // Generator design considerations
  | 'advanced'          // Advanced generator concepts
  | 'mathematical'      // Mathematical relationships
  // AC Waveform specific tags
  | 'ac-waveforms'      // AC waveform characteristics
  | 'rms'               // RMS voltage/current
  | 'peak-voltage'      // Peak voltage
  | 'peak-to-peak'      // Peak-to-peak voltage
  | 'period'            // Period (time for one cycle)
  | 'average-voltage'   // Average voltage
  | 'amplitude'         // Amplitude/peak value
  | 'efficiency'       // Efficiency calculations
  | 'power'            // Power calculations
  | 'energy'           // Energy calculations
  // Dead testing specific tags
  | 'continuity'       // Continuity testing
  | 'continuity-rule'  // Continuity testing rules
  | 'health-safety'    // Health and safety considerations
  | 'methodology'      // Testing methodology and procedures
  | 'topology-confusion' // Topology confusion concepts
  | 'identification';  // Component/circuit identification

/**
 * Answer Type: Determines marking strategy
 */
export type AnswerType =
  | 'mcq'           // Multiple choice
  | 'numeric'       // Numeric answer with units
  | 'short-text'    // Short text response
  | 'step-by-step'  // Multi-step structured answer
  | 'true-false'    // True/false
  | 'matching';     // Match pairs

/**
 * Question Variant Template: For parametric generation
 */
export interface QuestionVariantTemplate {
  template: string; // Question text with {param} placeholders
  parameters: {
    [key: string]: {
      type: 'number' | 'choice';
      range?: [number, number]; // For number type
      choices?: string[]; // For choice type
      step?: number; // For number type (default 1)
    };
  };
  answerFormula?: string; // JavaScript expression to calculate answer
  acceptableAnswersFormula?: string[]; // Formulas for acceptable variations
}

/**
 * Tagged Question: Enhanced question with learning metadata
 */
export interface TaggedQuestion extends BaseQuestion {
  /**
   * Tags for filtering and organization
   */
  tags: QuestionTag[];

  /**
   * Learning outcome this question assesses
   * Format: "lessonId-LOX" e.g., "202-4A-LO3"
   */
  learningOutcomeId: string;

  /**
   * Misconception codes mapped to wrong answer indices
   * For MCQ: index maps to options array
   * For other types: describes common error patterns
   */
  misconceptionCodes?: {
    [answerIndex: number]: MisconceptionCode;
  };

  /**
   * Answer type for marking logic
   */
  answerType?: AnswerType;

  /**
   * Acceptable answer variations (for non-MCQ)
   */
  acceptableAnswers?: string[];

  /**
   * Units required in answer (for numeric)
   */
  requiredUnits?: string;

  /**
   * Tolerance for numeric answers (e.g., ±0.1)
   */
  tolerance?: number;

  /**
   * Difficulty level (1-5)
   */
  difficulty?: number;

  /**
   * Time estimate in seconds
   */
  estimatedTime?: number;

  /**
   * Explanation for correct answer
   */
  explanation?: string;

  /**
   * Authored variants: List of question IDs that are variants of this question
   * Used for deterministic retesting in Fix mode
   */
  variantIds?: string[];

  /**
   * Parametric variant template: For generating deterministic variants
   * Used when variantIds not available
   */
  variantTemplate?: QuestionVariantTemplate;
}

/**
 * Question Filter: For querying question bank
 */
export interface QuestionFilter {
  section?: string;
  tags?: QuestionTag[];
  learningOutcomeId?: string;
  difficulty?: number[];
  limit?: number;
}

/**
 * Question Bank: Collection of questions with metadata
 */
export interface QuestionBank {
  id: string;
  name: string;
  description: string;
  questions: TaggedQuestion[];
  metadata: {
    created: string;
    updated: string;
    version: string;
  };
}





