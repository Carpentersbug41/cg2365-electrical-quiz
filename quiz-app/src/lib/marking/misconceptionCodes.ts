/**
 * Misconception Taxonomy
 * Defines common student errors and their corrections
 */

import { MisconceptionCode } from '@/data/questions/types';
import { MisconceptionDefinition } from './types';

export const MISCONCEPTIONS: Record<MisconceptionCode, MisconceptionDefinition> = {
  USED_PARALLEL_RULE: {
    code: 'USED_PARALLEL_RULE',
    name: 'Used Parallel Formula in Series',
    description: 'Applied the parallel resistance formula (1/Rtotal = 1/R1 + 1/R2) in a series circuit.',
    commonIn: ['series circuits', 'mixed circuits'],
    fixPrompt: 'In **series**, resistances simply ADD together: R_total = R1 + R2. The 1/R formula is for **parallel** circuits only.',
    relatedBlockIds: ['202-4A-explain-rules', '202-4A-worked-example'],
    severity: 'critical',
  },

  USED_SERIES_RULE: {
    code: 'USED_SERIES_RULE',
    name: 'Used Series Formula in Parallel',
    description: 'Applied the series resistance formula (R_total = R1 + R2) in a parallel circuit.',
    commonIn: ['parallel circuits', 'mixed circuits'],
    fixPrompt: 'In **parallel**, you cannot simply add resistances. Use: 1/R_total = 1/R1 + 1/R2, then take the reciprocal.',
    relatedBlockIds: [],
    severity: 'critical',
  },

  UNITS_MISSING: {
    code: 'UNITS_MISSING',
    name: 'Answer Missing Units',
    description: 'The numerical answer is correct, but units are missing.',
    commonIn: ['all calculation questions'],
    fixPrompt: '**Always include units** with your answer. Resistance is measured in Ohms (Ω), current in Amperes (A), voltage in Volts (V).',
    relatedBlockIds: [],
    severity: 'minor',
  },

  WRONG_UNITS: {
    code: 'WRONG_UNITS',
    name: 'Incorrect Units Used',
    description: 'The calculation may be correct, but the wrong unit was used.',
    commonIn: ['all calculation questions'],
    fixPrompt: 'Check your units! Resistance = Ohms (Ω), Current = Amperes (A), Voltage = Volts (V).',
    relatedBlockIds: [],
    severity: 'moderate',
  },

  MULTIPLIED_INSTEAD: {
    code: 'MULTIPLIED_INSTEAD',
    name: 'Multiplied Instead of Adding',
    description: 'Multiplied values when they should be added (e.g., R1 × R2 instead of R1 + R2).',
    commonIn: ['series circuits'],
    fixPrompt: 'In series, resistances **add**: R_total = R1 + R2. Multiplication is not used here.',
    relatedBlockIds: ['202-4A-explain-rules'],
    severity: 'critical',
  },

  DIVIDED_INSTEAD: {
    code: 'DIVIDED_INSTEAD',
    name: 'Divided Instead of Adding',
    description: 'Divided values incorrectly.',
    commonIn: ['series circuits', 'voltage calculations'],
    fixPrompt: 'Review the formula. In series, we **add** resistances, we don\'t divide them.',
    relatedBlockIds: ['202-4A-explain-rules'],
    severity: 'moderate',
  },

  RECIPROCAL_ERROR: {
    code: 'RECIPROCAL_ERROR',
    name: 'Reciprocal Calculation Error',
    description: 'Made an error when calculating reciprocals for parallel circuits.',
    commonIn: ['parallel circuits'],
    fixPrompt: 'When using 1/R_total = 1/R1 + 1/R2, remember to take the **reciprocal at the end**: R_total = 1 / (sum of reciprocals).',
    relatedBlockIds: [],
    severity: 'moderate',
  },

  SIGN_ERROR: {
    code: 'SIGN_ERROR',
    name: 'Sign Error in Calculation',
    description: 'Made a sign error (positive/negative) in the calculation.',
    commonIn: ['all calculations'],
    fixPrompt: 'Check your signs carefully. Review your working step-by-step.',
    relatedBlockIds: [],
    severity: 'minor',
  },

  ROUNDING_ERROR: {
    code: 'ROUNDING_ERROR',
    name: 'Excessive Rounding',
    description: 'Rounded too early or too much, leading to an inaccurate final answer.',
    commonIn: ['all calculations'],
    fixPrompt: 'Avoid rounding until the final step. Keep at least 2-3 decimal places during intermediate calculations.',
    relatedBlockIds: [],
    severity: 'minor',
  },

  FORMULA_NOT_REARRANGED: {
    code: 'FORMULA_NOT_REARRANGED',
    name: 'Formula Not Rearranged',
    description: 'Used a formula without rearranging it to solve for the required variable.',
    commonIn: ['Ohms Law', 'formula-based questions'],
    fixPrompt: 'You need to **rearrange the formula** first. If you\'re finding I, rearrange V = I × R to get I = V / R.',
    relatedBlockIds: [],
    severity: 'moderate',
  },

  CONFUSED_I_V_R: {
    code: 'CONFUSED_I_V_R',
    name: 'Confused I, V, R Relationships',
    description: 'Mixed up the relationship between current, voltage, and resistance.',
    commonIn: ['Ohms Law', 'circuit analysis'],
    fixPrompt: 'Remember: **V = I × R**. Voltage = Current × Resistance. Practice rearranging this for I and R.',
    relatedBlockIds: [],
    severity: 'moderate',
  },

  TOPOLOGY_CONFUSION: {
    code: 'TOPOLOGY_CONFUSION',
    name: 'Circuit Topology Confusion',
    description: 'Confused series and parallel circuit characteristics (e.g., thinking current divides in series).',
    commonIn: ['series circuits', 'parallel circuits'],
    fixPrompt: '**Series**: one path, same current everywhere, voltage divides. **Parallel**: multiple paths, current divides, same voltage across branches.',
    relatedBlockIds: ['202-4A-explain-rules'],
    severity: 'critical',
  },

  ARITHMETIC_ERROR: {
    code: 'ARITHMETIC_ERROR',
    name: 'Arithmetic Error',
    description: 'Made a basic arithmetic mistake in calculation (addition, subtraction, multiplication, division).',
    commonIn: ['all calculation questions'],
    fixPrompt: 'Check your arithmetic carefully. Review each step of your calculation and recalculate if needed.',
    relatedBlockIds: [],
    severity: 'minor',
  },

  VOLTAGE_EQUAL_SPLIT_ERROR: {
    code: 'VOLTAGE_EQUAL_SPLIT_ERROR',
    name: 'Assumed Equal Voltage Split',
    description: 'Assumed voltage splits equally between components regardless of their resistance values.',
    commonIn: ['series circuits', 'voltage calculations'],
    fixPrompt: 'Voltage in series does NOT split equally unless resistances are equal. Use the voltage divider: V_R1 = V_total × (R1 / (R1 + R2)).',
    relatedBlockIds: ['202-4A-explain-rules'],
    severity: 'moderate',
  },

  VOLTAGE_DIVIDER_ERROR: {
    code: 'VOLTAGE_DIVIDER_ERROR',
    name: 'Voltage Divider Calculation Error',
    description: 'Made an error when calculating voltage drops using the voltage divider principle.',
    commonIn: ['series circuits', 'voltage calculations'],
    fixPrompt: 'Remember the voltage divider formula: V_R1 = V_total × (R1 / (R1 + R2)). The voltage drop is proportional to resistance.',
    relatedBlockIds: ['202-4A-explain-rules'],
    severity: 'moderate',
  },

  METER_CONNECTION_ERROR: {
    code: 'METER_CONNECTION_ERROR',
    name: 'Incorrect Meter Connection',
    description: 'Connected ammeter or voltmeter incorrectly (e.g., voltmeter in series, ammeter in parallel).',
    commonIn: ['measurement questions'],
    fixPrompt: '**Ammeter**: Connect in SERIES (current flows through it). **Voltmeter**: Connect in PARALLEL (across the component).',
    relatedBlockIds: [],
    severity: 'critical',
  },

  // AC/DC Specific Misconceptions
  CONFUSED_AC_DC_SOURCES: {
    code: 'CONFUSED_AC_DC_SOURCES',
    name: 'Confused AC and DC Sources',
    description: 'Mixed up which sources provide AC vs DC (e.g., thinking batteries provide AC or mains provides DC).',
    commonIn: ['AC principles'],
    fixPrompt: '**Batteries** and **solar panels** provide **DC** (one direction). **Mains sockets** and **generators** provide **AC** (alternating direction).',
    relatedBlockIds: ['202-7A-explain-ac-vs-dc'],
    severity: 'critical',
  },

  CONFUSED_INTERNATIONAL_VOLTAGE: {
    code: 'CONFUSED_INTERNATIONAL_VOLTAGE',
    name: 'Used International Voltage Standard',
    description: 'Used voltage from a different country (e.g., 110V from USA instead of UK 230V).',
    commonIn: ['AC principles', 'UK mains'],
    fixPrompt: '**UK mains** is **230V**. The USA uses 110V. Always check which country\'s standard applies.',
    relatedBlockIds: ['202-7A-explain-mains'],
    severity: 'moderate',
  },

  CONFUSED_WITH_LOW_VOLTAGE: {
    code: 'CONFUSED_WITH_LOW_VOLTAGE',
    name: 'Confused Mains with Low Voltage',
    description: 'Confused mains voltage (230V) with low voltage supplies (12V, 24V).',
    commonIn: ['AC principles'],
    fixPrompt: 'UK mains is **230V** (high voltage). Low voltage supplies like batteries are typically 12V or less.',
    relatedBlockIds: ['202-7A-explain-mains'],
    severity: 'moderate',
  },

  CONFUSED_WITH_THREE_PHASE: {
    code: 'CONFUSED_WITH_THREE_PHASE',
    name: 'Confused Single Phase with Three Phase',
    description: 'Confused single-phase 230V with three-phase 415V.',
    commonIn: ['AC principles'],
    fixPrompt: 'Domestic supply is **230V single-phase**. **415V three-phase** is used in commercial/industrial settings.',
    relatedBlockIds: ['202-7A-explain-mains'],
    severity: 'moderate',
  },

  CONFUSED_INTERNATIONAL_FREQUENCY: {
    code: 'CONFUSED_INTERNATIONAL_FREQUENCY',
    name: 'Used International Frequency Standard',
    description: 'Used frequency from a different country (e.g., 60Hz from USA instead of UK 50Hz).',
    commonIn: ['AC principles', 'frequency'],
    fixPrompt: '**UK frequency** is **50 Hz**. The USA and some other countries use 60 Hz.',
    relatedBlockIds: ['202-7A-explain-frequency'],
    severity: 'moderate',
  },

  DOUBLED_FREQUENCY: {
    code: 'DOUBLED_FREQUENCY',
    name: 'Incorrectly Doubled Frequency',
    description: 'Doubled the frequency value when not appropriate (e.g., confusing cycles with reversals).',
    commonIn: ['AC principles', 'frequency calculations'],
    fixPrompt: 'Be careful not to confuse **cycles per second** with **direction reversals**. 50 Hz = 50 cycles, but 100 reversals.',
    relatedBlockIds: ['202-7A-explain-frequency'],
    severity: 'moderate',
  },

  HALVED_FREQUENCY: {
    code: 'HALVED_FREQUENCY',
    name: 'Incorrectly Halved Frequency',
    description: 'Halved the frequency value incorrectly.',
    commonIn: ['AC principles', 'frequency calculations'],
    fixPrompt: 'Check your calculation. Frequency is measured directly in cycles per second (Hz).',
    relatedBlockIds: ['202-7A-explain-frequency'],
    severity: 'moderate',
  },

  CONFUSED_FREQUENCY_WITH_VOLTAGE: {
    code: 'CONFUSED_FREQUENCY_WITH_VOLTAGE',
    name: 'Confused Frequency with Voltage',
    description: 'Mixed up frequency (how fast AC alternates) with voltage (electrical potential).',
    commonIn: ['AC principles'],
    fixPrompt: '**Frequency (Hz)** measures how many cycles per second. **Voltage (V)** measures electrical potential. They are completely different.',
    relatedBlockIds: ['202-7A-explain-frequency'],
    severity: 'critical',
  },

  CONFUSED_FREQUENCY_WITH_CURRENT: {
    code: 'CONFUSED_FREQUENCY_WITH_CURRENT',
    name: 'Confused Frequency with Current',
    description: 'Mixed up frequency with current flow rate.',
    commonIn: ['AC principles'],
    fixPrompt: '**Frequency (Hz)** is how fast AC alternates. **Current (A)** is the amount of charge flow. Different concepts.',
    relatedBlockIds: ['202-7A-explain-frequency'],
    severity: 'moderate',
  },

  CONFUSED_FREQUENCY_UNIT: {
    code: 'CONFUSED_FREQUENCY_UNIT',
    name: 'Wrong Unit for Frequency',
    description: 'Used the wrong unit for frequency (e.g., watts, volts, or seconds instead of hertz).',
    commonIn: ['AC principles', 'frequency'],
    fixPrompt: 'Frequency is measured in **Hertz (Hz)**, which means cycles per second.',
    relatedBlockIds: ['202-7A-explain-frequency'],
    severity: 'moderate',
  },

  CONFUSED_DC_WITH_AC: {
    code: 'CONFUSED_DC_WITH_AC',
    name: 'Applied DC Characteristics to AC',
    description: 'Incorrectly applied DC characteristics to AC (e.g., thinking AC has constant polarity).',
    commonIn: ['AC principles'],
    fixPrompt: '**AC alternates direction** - it doesn\'t flow constantly one way like DC. AC has frequency, DC doesn\'t.',
    relatedBlockIds: ['202-7A-explain-ac-vs-dc'],
    severity: 'critical',
  },

  CONFUSED_AC_WITH_DC: {
    code: 'CONFUSED_AC_WITH_DC',
    name: 'Applied AC Characteristics to DC',
    description: 'Incorrectly applied AC characteristics to DC (e.g., thinking DC has frequency).',
    commonIn: ['AC principles'],
    fixPrompt: '**DC flows in one direction only**. It has no frequency. Frequency only applies to AC.',
    relatedBlockIds: ['202-7A-explain-ac-vs-dc'],
    severity: 'critical',
  },

  ASSIGNED_FREQUENCY_TO_DC: {
    code: 'ASSIGNED_FREQUENCY_TO_DC',
    name: 'Gave DC a Frequency',
    description: 'Incorrectly assigned a frequency value to DC supply.',
    commonIn: ['AC principles'],
    fixPrompt: '**DC has no frequency** (0 Hz). It doesn\'t alternate. Only AC has frequency.',
    relatedBlockIds: ['202-7A-explain-ac-vs-dc'],
    severity: 'critical',
  },

  CONFUSED_WIRE_COLORS: {
    code: 'CONFUSED_WIRE_COLORS',
    name: 'Confused UK Wire Colors',
    description: 'Mixed up the UK wire color codes (brown live, blue neutral, green/yellow earth).',
    commonIn: ['AC principles', 'UK mains', 'safety'],
    fixPrompt: 'UK wiring: **Brown** = Live, **Blue** = Neutral, **Green/Yellow** = Earth. Memorize this for safety!',
    relatedBlockIds: ['202-7A-explain-mains'],
    severity: 'critical',
  },

  CONFUSED_OLD_WIRE_COLORS: {
    code: 'CONFUSED_OLD_WIRE_COLORS',
    name: 'Used Old UK Wire Colors',
    description: 'Used old wire color codes (red live, black neutral) instead of current UK standard.',
    commonIn: ['AC principles', 'UK mains'],
    fixPrompt: 'Old colors were red/black. **Current UK standard**: Brown = Live, Blue = Neutral, Green/Yellow = Earth.',
    relatedBlockIds: ['202-7A-explain-mains'],
    severity: 'moderate',
  },

  CONFUSED_INTERNATIONAL_STANDARDS: {
    code: 'CONFUSED_INTERNATIONAL_STANDARDS',
    name: 'Mixed Up International Standards',
    description: 'Confused electrical standards from different countries.',
    commonIn: ['AC principles', 'UK mains'],
    fixPrompt: '**UK**: 230V, 50Hz. **USA**: 110V, 60Hz. Always check which standard applies.',
    relatedBlockIds: ['202-7A-explain-mains'],
    severity: 'moderate',
  },

  CONFUSED_POWER_SUPPLY_VS_LOAD: {
    code: 'CONFUSED_POWER_SUPPLY_VS_LOAD',
    name: 'Confused Power Supply with Load',
    description: 'Mixed up a power supply/source with a load/device that consumes power.',
    commonIn: ['AC principles', 'circuit analysis'],
    fixPrompt: '**Sources** (battery, mains) **provide** power. **Loads** (appliances, resistors) **consume** power.',
    relatedBlockIds: [],
    severity: 'moderate',
  },

  CONFUSED_CYCLE_WITH_FREQUENCY: {
    code: 'CONFUSED_CYCLE_WITH_FREQUENCY',
    name: 'Confused One Cycle with Frequency',
    description: 'Mixed up one cycle with the frequency value.',
    commonIn: ['AC principles', 'frequency'],
    fixPrompt: 'One **cycle** is one complete forward-backward alternation. **Frequency** is how many cycles occur per second.',
    relatedBlockIds: ['202-7A-explain-frequency'],
    severity: 'moderate',
  },

  CONFUSED_FREQUENCY_WITH_REVERSALS: {
    code: 'CONFUSED_FREQUENCY_WITH_REVERSALS',
    name: 'Confused Cycles with Reversals',
    description: 'Confused cycles per second with direction reversals (which is double).',
    commonIn: ['AC principles', 'frequency'],
    fixPrompt: '50 Hz = 50 **cycles** per second. Each cycle has **2 direction reversals**, so 100 reversals per second.',
    relatedBlockIds: ['202-7A-explain-frequency'],
    severity: 'moderate',
  },

  CONFUSED_TRANSFORMER_WITH_RECTIFIER: {
    code: 'CONFUSED_TRANSFORMER_WITH_RECTIFIER',
    name: 'Confused Transformer with Rectifier',
    description: 'Mixed up transformer (changes AC voltage) with rectifier (converts AC to DC).',
    commonIn: ['AC principles', 'AC/DC conversion'],
    fixPrompt: '**Transformer** changes AC voltage levels. **Rectifier** converts AC to DC. Different functions!',
    relatedBlockIds: ['202-7A-explain-ac-vs-dc'],
    severity: 'moderate',
  },

  CONFUSED_INVERTER_WITH_RECTIFIER: {
    code: 'CONFUSED_INVERTER_WITH_RECTIFIER',
    name: 'Confused Inverter with Rectifier',
    description: 'Mixed up inverter (DC to AC) with rectifier (AC to DC).',
    commonIn: ['AC principles', 'AC/DC conversion'],
    fixPrompt: '**Inverter**: DC → AC. **Rectifier**: AC → DC. They do opposite conversions.',
    relatedBlockIds: ['202-7A-explain-ac-vs-dc'],
    severity: 'moderate',
  },

  CONFUSED_NEUTRAL_WITH_EARTH: {
    code: 'CONFUSED_NEUTRAL_WITH_EARTH',
    name: 'Confused Neutral with Earth',
    description: 'Mixed up the neutral wire (return path) with the earth wire (safety ground).',
    commonIn: ['AC principles', 'UK mains', 'safety'],
    fixPrompt: '**Neutral** (blue) is the current return path. **Earth** (green/yellow) is safety ground. Different purposes!',
    relatedBlockIds: ['202-7A-explain-mains'],
    severity: 'critical',
  },

  CONFUSED_AC_DC_INTERNATIONALLY: {
    code: 'CONFUSED_AC_DC_INTERNATIONALLY',
    name: 'Thought AC/DC Varies by Country',
    description: 'Incorrectly thought different countries use different current types (AC vs DC).',
    commonIn: ['AC principles'],
    fixPrompt: 'All countries use **AC for mains**. Voltage and frequency vary, but it\'s all AC.',
    relatedBlockIds: ['202-7A-explain-ac-vs-dc'],
    severity: 'moderate',
  },

  CONFUSED_DISTRIBUTION_VOLTAGES: {
    code: 'CONFUSED_DISTRIBUTION_VOLTAGES',
    name: 'Confused Distribution Voltage Levels',
    description: 'Mixed up different voltage levels in the distribution system (transmission, distribution, domestic).',
    commonIn: ['AC principles', 'UK mains'],
    fixPrompt: 'Transmission: 400kV → Distribution: 11kV/33kV → Domestic: 230V. Different stages of the grid.',
    relatedBlockIds: ['202-7A-explain-mains'],
    severity: 'minor',
  },

  CONFUSED_LIVE_NEUTRAL_FUNCTION: {
    code: 'CONFUSED_LIVE_NEUTRAL_FUNCTION',
    name: 'Confused Live and Neutral Functions',
    description: 'Mixed up which wire carries the voltage (live) vs return path (neutral).',
    commonIn: ['AC principles', 'UK mains'],
    fixPrompt: '**Live** (brown) carries the 230V. **Neutral** (blue) is the return at ~0V. Never confuse them!',
    relatedBlockIds: ['202-7A-explain-mains'],
    severity: 'critical',
  },

  EXPECTED_EXACT_NOMINAL_VOLTAGE: {
    code: 'EXPECTED_EXACT_NOMINAL_VOLTAGE',
    name: 'Expected Exactly Nominal Voltage',
    description: 'Expected to measure exactly 230V, not understanding nominal voltage can vary.',
    commonIn: ['AC principles', 'UK mains', 'measurement'],
    fixPrompt: '**230V is nominal** (target). Actual supply varies between ~220V and ~240V. This is normal.',
    relatedBlockIds: ['202-7A-explain-mains'],
    severity: 'minor',
  },

  DID_NOT_DIVIDE_BY_TIME: {
    code: 'DID_NOT_DIVIDE_BY_TIME',
    name: 'Forgot to Divide by Time',
    description: 'Calculated frequency but forgot to divide cycles by time.',
    commonIn: ['AC principles', 'frequency calculations'],
    fixPrompt: 'Frequency = cycles / time. If 100 cycles in 2 seconds: f = 100/2 = 50 Hz.',
    relatedBlockIds: ['202-7A-explain-frequency'],
    severity: 'moderate',
  },

  CONFUSED_FREQUENCY_EFFECT_ON_MOTORS: {
    code: 'CONFUSED_FREQUENCY_EFFECT_ON_MOTORS',
    name: 'Misunderstood Frequency Effect on Motors',
    description: 'Didn\'t understand that motor speed is proportional to frequency.',
    commonIn: ['AC principles', 'frequency', 'motors'],
    fixPrompt: 'AC motor speed is proportional to frequency. Higher frequency = faster rotation.',
    relatedBlockIds: ['202-7A-explain-frequency'],
    severity: 'moderate',
  },

  HALVED_INSTEAD_OF_DOUBLED: {
    code: 'HALVED_INSTEAD_OF_DOUBLED',
    name: 'Halved When Should Have Doubled',
    description: 'Halved a value when inverse relationship meant it should be doubled.',
    commonIn: ['AC principles', 'frequency calculations'],
    fixPrompt: 'Check the relationship. If frequency is halved, period is **doubled** (inverse relationship).',
    relatedBlockIds: ['202-7A-explain-frequency'],
    severity: 'moderate',
  },

  CONFUSED_ELECTRON_DRIFT_WITH_SIGNAL: {
    code: 'CONFUSED_ELECTRON_DRIFT_WITH_SIGNAL',
    name: 'Confused Electron Movement with Signal Speed',
    description: 'Thought electrons travel long distances in AC, or confused drift velocity with signal velocity.',
    commonIn: ['AC principles', 'conceptual'],
    fixPrompt: 'In AC, **electrons vibrate** in place. **Energy/signal** travels fast, but **electrons** don\'t travel far.',
    relatedBlockIds: ['202-7A-explain-ac-vs-dc'],
    severity: 'minor',
  },

  CONFUSED_ELECTRON_SPEED_WITH_LIGHT_SPEED: {
    code: 'CONFUSED_ELECTRON_SPEED_WITH_LIGHT_SPEED',
    name: 'Thought Electrons Travel at Light Speed',
    description: 'Incorrectly thought electrons travel at the speed of light.',
    commonIn: ['AC principles', 'conceptual'],
    fixPrompt: 'Electrons move slowly (mm/s drift). The **electromagnetic signal** travels near light speed, not the electrons.',
    relatedBlockIds: [],
    severity: 'minor',
  },

  CONFUSED_RMS_WITH_DC: {
    code: 'CONFUSED_RMS_WITH_DC',
    name: 'Confused RMS AC with DC',
    description: 'Didn\'t understand that AC voltage ratings are RMS (root mean square), not constant like DC.',
    commonIn: ['AC principles', 'measurement'],
    fixPrompt: '**AC ratings are RMS values** (equivalent power). 12V AC (RMS) has peaks of ~17V, but delivers same power as 12V DC.',
    relatedBlockIds: ['202-7A-explain-ac-vs-dc'],
    severity: 'moderate',
  },

  CONFUSED_RMS_WITH_PEAK: {
    code: 'CONFUSED_RMS_WITH_PEAK',
    name: 'Confused RMS with Peak Voltage',
    description: 'Confused RMS voltage with peak voltage in AC.',
    commonIn: ['AC principles', 'measurement'],
    fixPrompt: 'AC voltage ratings are **RMS** (average effective). Peak voltage is higher: V_peak ≈ 1.414 × V_RMS.',
    relatedBlockIds: ['202-7A-explain-ac-vs-dc'],
    severity: 'moderate',
  },

  CONFUSED_RESISTANCE_WITH_AC_DC: {
    code: 'CONFUSED_RESISTANCE_WITH_AC_DC',
    name: 'Thought Resistance Changes with AC/DC',
    description: 'Incorrectly thought resistance value changes depending on AC or DC.',
    commonIn: ['AC principles', 'resistance'],
    fixPrompt: '**Resistance** (Ω) is a material property. It doesn\'t change whether you apply AC or DC.',
    relatedBlockIds: [],
    severity: 'moderate',
  },

  CONFUSED_TRANSFORMER_WITH_AC_DC: {
    code: 'CONFUSED_TRANSFORMER_WITH_AC_DC',
    name: 'Thought Transformers Convert AC/DC',
    description: 'Confused transformers (which change AC voltage) with AC/DC converters.',
    commonIn: ['AC principles', 'transformers'],
    fixPrompt: '**Transformers** change AC voltage levels (step up/down). They don\'t convert between AC and DC.',
    relatedBlockIds: ['202-7A-explain-ac-vs-dc'],
    severity: 'moderate',
  },

  CONFUSED_VOLTAGE_WITH_POWER: {
    code: 'CONFUSED_VOLTAGE_WITH_POWER',
    name: 'Confused Voltage with Power',
    description: 'Mixed up voltage (V) with power (W).',
    commonIn: ['all topics'],
    fixPrompt: '**Voltage (V)** is electrical potential. **Power (W)** is rate of energy transfer. Use P = V × I to relate them.',
    relatedBlockIds: [],
    severity: 'moderate',
  },

  CONFUSED_FREQUENCY_WITH_VOLTAGE_RATIO: {
    code: 'CONFUSED_FREQUENCY_WITH_VOLTAGE_RATIO',
    name: 'Thought Frequency Affects Transformer Ratio',
    description: 'Incorrectly thought frequency affects the voltage transformation ratio.',
    commonIn: ['AC principles', 'transformers'],
    fixPrompt: 'Frequency stays the same through a transformer. Only **voltage** changes based on turns ratio.',
    relatedBlockIds: ['202-7A-explain-frequency'],
    severity: 'moderate',
  },

  // Magnetism Specific (from existing lessons)
  CONFUSED_WITH_ELECTRICAL_CHARGE: {
    code: 'CONFUSED_WITH_ELECTRICAL_CHARGE',
    name: 'Confused Magnetic Poles with Electrical Charge',
    description: 'Mixed up magnetic poles (North/South) with electrical charge (positive/negative).',
    commonIn: ['magnetism'],
    fixPrompt: 'Magnetic poles are **North and South**. Electrical charges are **positive and negative**. Different concepts!',
    relatedBlockIds: ['202-6A-explain-basics'],
    severity: 'moderate',
  },

  CONFUSED_POLE_BEHAVIOR: {
    code: 'CONFUSED_POLE_BEHAVIOR',
    name: 'Misunderstood Pole Attraction/Repulsion',
    description: 'Got the rule for magnetic pole attraction/repulsion backwards.',
    commonIn: ['magnetism'],
    fixPrompt: '**Unlike poles attract** (N-S). **Like poles repel** (N-N or S-S).',
    relatedBlockIds: ['202-6A-explain-basics'],
    severity: 'moderate',
  },

  REVERSED_FIELD_DIRECTION: {
    code: 'REVERSED_FIELD_DIRECTION',
    name: 'Reversed Magnetic Field Direction',
    description: 'Got the direction of magnetic field lines backwards.',
    commonIn: ['magnetism'],
    fixPrompt: 'Magnetic field lines point **from North to South** outside the magnet.',
    relatedBlockIds: ['202-6A-explain-basics'],
    severity: 'moderate',
  },

  OTHER: {
    code: 'OTHER',
    name: 'Other Error',
    description: 'An error that doesn\'t fit into predefined categories.',
    commonIn: ['all questions'],
    fixPrompt: 'Review your working carefully and try again. If you\'re stuck, ask the tutor for guidance.',
    relatedBlockIds: [],
    severity: 'moderate',
  },
};

/**
 * Get misconception definition by code
 */
export function getMisconception(code: MisconceptionCode): MisconceptionDefinition {
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/95d04586-4afa-43d8-871a-85454b44a405',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'misconceptionCodes.ts:144',message:'getMisconception called',data:{code,codeExists:code in MISCONCEPTIONS,availableCodes:Object.keys(MISCONCEPTIONS)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
  // #endregion
  if (!(code in MISCONCEPTIONS)) {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/95d04586-4afa-43d8-871a-85454b44a405',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'misconceptionCodes.ts:147',message:'Misconception code not found',data:{code,availableCodes:Object.keys(MISCONCEPTIONS)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
    // #endregion
    throw new Error(`Misconception code "${code}" not found in MISCONCEPTIONS`);
  }
  return MISCONCEPTIONS[code];
}

/**
 * Get fix prompt for a misconception
 */
export function getFixPrompt(code: MisconceptionCode): string {
  return MISCONCEPTIONS[code].fixPrompt;
}

/**
 * Get related lesson blocks for a misconception
 */
export function getRelatedBlocks(code: MisconceptionCode): string[] {
  return MISCONCEPTIONS[code].relatedBlockIds || [];
}





