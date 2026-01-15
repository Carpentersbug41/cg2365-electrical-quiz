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
    relatedBlockIds: ['202-3A-explain-rules', '202-3A-worked-example'],
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
    relatedBlockIds: ['202-3A-explain-rules'],
    severity: 'critical',
  },

  DIVIDED_INSTEAD: {
    code: 'DIVIDED_INSTEAD',
    name: 'Divided Instead of Adding',
    description: 'Divided values incorrectly.',
    commonIn: ['series circuits', 'voltage calculations'],
    fixPrompt: 'Review the formula. In series, we **add** resistances, we don\'t divide them.',
    relatedBlockIds: ['202-3A-explain-rules'],
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
    relatedBlockIds: ['202-3A-explain-rules'],
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
    relatedBlockIds: ['202-3A-explain-rules'],
    severity: 'moderate',
  },

  VOLTAGE_DIVIDER_ERROR: {
    code: 'VOLTAGE_DIVIDER_ERROR',
    name: 'Voltage Divider Calculation Error',
    description: 'Made an error when calculating voltage drops using the voltage divider principle.',
    commonIn: ['series circuits', 'voltage calculations'],
    fixPrompt: 'Remember the voltage divider formula: V_R1 = V_total × (R1 / (R1 + R2)). The voltage drop is proportional to resistance.',
    relatedBlockIds: ['202-3A-explain-rules'],
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

  CONFUSED_AC_DC_GENERATOR_PARTS: {
    code: 'CONFUSED_AC_DC_GENERATOR_PARTS',
    name: 'Confused AC and DC Generator Components',
    description: 'Mixed up slip rings (AC generator) with commutator (DC generator).',
    commonIn: ['AC generation', 'generators'],
    fixPrompt: '**AC generators** use slip rings (continuous). **DC generators** use a commutator (split ring). Different components for different current types.',
    relatedBlockIds: ['202-7B-explain-components'],
    severity: 'moderate',
  },

  CONFUSED_PARALLEL_PERPENDICULAR: {
    code: 'CONFUSED_PARALLEL_PERPENDICULAR',
    name: 'Confused Parallel and Perpendicular Positions',
    description: 'Mixed up when generator voltage is maximum (perpendicular) vs zero (parallel to field).',
    commonIn: ['AC generation', 'electromagnetic induction'],
    fixPrompt: '**Perpendicular to field** (loop vertical) = maximum voltage. **Parallel to field** (loop horizontal) = zero voltage.',
    relatedBlockIds: ['202-7B-explain-how-it-works'],
    severity: 'critical',
  },

  DID_NOT_CONVERT_RPM_TO_RPS: {
    code: 'DID_NOT_CONVERT_RPM_TO_RPS',
    name: 'Forgot to Convert RPM to Revolutions per Second',
    description: 'Used rpm directly as Hz without dividing by 60 to convert to revolutions per second.',
    commonIn: ['AC generation', 'frequency calculations'],
    fixPrompt: 'Frequency (Hz) = revolutions per second. To convert rpm to Hz: **divide by 60**. Example: 3000 rpm = 3000/60 = 50 Hz.',
    relatedBlockIds: ['202-7B-explain-how-it-works'],
    severity: 'moderate',
  },

  CONFUSED_POSITIVE_NEGATIVE_PEAKS: {
    code: 'CONFUSED_POSITIVE_NEGATIVE_PEAKS',
    name: 'Confused Positive and Negative Peaks',
    description: 'Mixed up which rotation position produces positive peak vs negative peak on sine wave.',
    commonIn: ['AC generation', 'waveform'],
    fixPrompt: '90° = positive peak (first perpendicular position). 270° = negative peak (opposite perpendicular position).',
    relatedBlockIds: ['202-7B-explain-how-it-works'],
    severity: 'moderate',
  },

  // AC Waveform Specific Misconceptions
  CONFUSED_TERMINOLOGY: {
    code: 'CONFUSED_TERMINOLOGY',
    name: 'Confused Technical Terminology',
    description: 'Mixed up technical terms or used incorrect terminology.',
    commonIn: ['AC waveforms', 'terminology'],
    fixPrompt: 'Review the vocabulary carefully. Each term (RMS, peak, period, frequency) has a specific meaning.',
    relatedBlockIds: ['202-7C-vocab'],
    severity: 'minor',
  },

  CONFUSED_PEAK_DEFINITIONS: {
    code: 'CONFUSED_PEAK_DEFINITIONS',
    name: 'Confused Peak Measurement Definitions',
    description: 'Mixed up different types of peak measurements (peak, peak-to-peak, amplitude).',
    commonIn: ['AC waveforms', 'measurements'],
    fixPrompt: '**Peak** = maximum in one direction. **Peak-to-peak** = total from +peak to -peak. **Amplitude** = same as peak.',
    relatedBlockIds: ['202-7C-explain-measurements'],
    severity: 'moderate',
  },

  CONFUSED_METER_READING: {
    code: 'CONFUSED_METER_READING',
    name: 'Misunderstood Meter Display',
    description: 'Didn\'t understand what type of value meters display (RMS, peak, average).',
    commonIn: ['AC waveforms', 'measurements'],
    fixPrompt: 'Multimeters in AC mode display **RMS voltage**, not peak or average.',
    relatedBlockIds: ['202-7C-explain-measurements'],
    severity: 'moderate',
  },

  USED_F_INSTEAD_OF_1_F: {
    code: 'USED_F_INSTEAD_OF_1_F',
    name: 'Used Frequency Instead of 1/f',
    description: 'Used frequency value directly instead of calculating 1/f for period.',
    commonIn: ['AC waveforms', 'period calculations'],
    fixPrompt: 'Period T = **1/f**, not just f. If f = 50Hz, then T = 1/50 = 0.02 seconds.',
    relatedBlockIds: ['202-7C-explain-time'],
    severity: 'critical',
  },

  CONFUSED_PEAK_TO_PEAK: {
    code: 'CONFUSED_PEAK_TO_PEAK',
    name: 'Confused Peak-to-Peak Measurement',
    description: 'Used peak-to-peak value when peak or RMS was needed, or vice versa.',
    commonIn: ['AC waveforms', 'measurements'],
    fixPrompt: 'Peak-to-peak = 2 × peak. Make sure you\'re using the right measurement for the context.',
    relatedBlockIds: ['202-7C-explain-measurements'],
    severity: 'moderate',
  },

  CALCULATED_RMS_WRONG: {
    code: 'CALCULATED_RMS_WRONG',
    name: 'RMS Calculation Error',
    description: 'Made an error calculating RMS from peak or peak-to-peak.',
    commonIn: ['AC waveforms', 'calculations'],
    fixPrompt: 'RMS = 0.707 × peak (or peak = 1.414 × RMS). Check your calculation.',
    relatedBlockIds: ['202-7C-explain-measurements'],
    severity: 'moderate',
  },

  FORMULA_WRONG: {
    code: 'FORMULA_WRONG',
    name: 'Used Wrong Formula',
    description: 'Applied incorrect formula or relationship.',
    commonIn: ['all calculations'],
    fixPrompt: 'Review the correct formula. T = 1/f, RMS = 0.707 × peak, peak-to-peak = 2 × peak.',
    relatedBlockIds: ['202-7C-explain-measurements', '202-7C-explain-time'],
    severity: 'critical',
  },

  CONFUSED_AVERAGE_RMS: {
    code: 'CONFUSED_AVERAGE_RMS',
    name: 'Confused Average with RMS',
    description: 'Mixed up average voltage (zero for AC) with RMS voltage.',
    commonIn: ['AC waveforms', 'measurements'],
    fixPrompt: '**Average** voltage for pure AC = 0V (positive cancels negative). **RMS** is the effective value we use.',
    relatedBlockIds: ['202-7C-explain-average'],
    severity: 'moderate',
  },

  CONFUSED_AVERAGE_PEAK: {
    code: 'CONFUSED_AVERAGE_PEAK',
    name: 'Confused Average with Peak',
    description: 'Mixed up average voltage with peak voltage.',
    commonIn: ['AC waveforms', 'measurements'],
    fixPrompt: '**Average** = 0V for symmetrical AC. **Peak** = maximum voltage reached.',
    relatedBlockIds: ['202-7C-explain-average'],
    severity: 'moderate',
  },

  CONFUSED_AMPLITUDE_RMS: {
    code: 'CONFUSED_AMPLITUDE_RMS',
    name: 'Confused Amplitude with RMS',
    description: 'Mixed up amplitude (peak value) with RMS value.',
    commonIn: ['AC waveforms', 'measurements'],
    fixPrompt: '**Amplitude** = peak value (maximum displacement). **RMS** = effective value (0.707 × peak).',
    relatedBlockIds: ['202-7C-explain-measurements'],
    severity: 'moderate',
  },

  CONFUSED_TIME_VOLTAGE: {
    code: 'CONFUSED_TIME_VOLTAGE',
    name: 'Confused Time and Voltage Measurements',
    description: 'Mixed up time-based measurements (period, frequency) with voltage measurements.',
    commonIn: ['AC waveforms'],
    fixPrompt: '**Period/frequency** measure time. **RMS/peak/amplitude** measure voltage. Different concepts!',
    relatedBlockIds: ['202-7C-explain-time', '202-7C-explain-measurements'],
    severity: 'moderate',
  },

  USED_PEAK_NOT_P_P: {
    code: 'USED_PEAK_NOT_P_P',
    name: 'Used Peak Instead of Peak-to-Peak',
    description: 'Used peak value when peak-to-peak was asked for.',
    commonIn: ['AC waveforms', 'calculations'],
    fixPrompt: 'Peak-to-peak = **2 × peak**. Don\'t forget to double it!',
    relatedBlockIds: ['202-7C-explain-measurements'],
    severity: 'moderate',
  },

  INVERSE_WRONG: {
    code: 'INVERSE_WRONG',
    name: 'Inverse Relationship Error',
    description: 'Got an inverse relationship backwards (when one increases, other decreases).',
    commonIn: ['AC waveforms', 'period-frequency'],
    fixPrompt: 'Period and frequency are **inversely related**: T = 1/f. When frequency increases, period decreases.',
    relatedBlockIds: ['202-7C-explain-time'],
    severity: 'moderate',
  },

  CONFUSED_RELATIONSHIP: {
    code: 'CONFUSED_RELATIONSHIP',
    name: 'Misunderstood Relationship',
    description: 'Didn\'t understand how concepts relate to each other.',
    commonIn: ['AC waveforms', 'conceptual'],
    fixPrompt: 'Review how these measurements relate: RMS = 0.707 × peak, T = 1/f, peak-to-peak = 2 × peak.',
    relatedBlockIds: ['202-7C-explain-measurements', '202-7C-explain-time'],
    severity: 'moderate',
  },

  WRONG_REASON: {
    code: 'WRONG_REASON',
    name: 'Incorrect Reasoning',
    description: 'May have right answer but for wrong reason, or wrong explanation.',
    commonIn: ['conceptual questions'],
    fixPrompt: 'Review the explanation. Understanding WHY is as important as knowing WHAT.',
    relatedBlockIds: ['202-7C-explain-measurements'],
    severity: 'minor',
  },

  CONFUSED_PEAK_CURRENT: {
    code: 'CONFUSED_PEAK_CURRENT',
    name: 'Confused Peak Voltage with Current',
    description: 'Mixed up peak voltage with current-related concepts.',
    commonIn: ['AC waveforms'],
    fixPrompt: 'Peak voltage and peak current are different. Make sure you\'re working with the right quantity.',
    relatedBlockIds: ['202-7C-explain-measurements'],
    severity: 'moderate',
  },

  CONFUSED_PEAK_POWER: {
    code: 'CONFUSED_PEAK_POWER',
    name: 'Confused Peak Voltage with Power',
    description: 'Mixed up peak voltage with power calculations.',
    commonIn: ['AC waveforms', 'power'],
    fixPrompt: 'Use **RMS** voltage for power calculations, not peak. Power = V_RMS × I_RMS.',
    relatedBlockIds: ['202-7C-explain-measurements'],
    severity: 'moderate',
  },

  COUNTED_BOTH_PEAKS: {
    code: 'COUNTED_BOTH_PEAKS',
    name: 'Counted Positive and Negative Peaks',
    description: 'Counted both peaks per cycle when only one was asked for.',
    commonIn: ['AC waveforms', 'frequency'],
    fixPrompt: 'One cycle = one positive peak + one negative peak. Frequency (Hz) = cycles per second, not peaks.',
    relatedBlockIds: ['202-7C-explain-time'],
    severity: 'moderate',
  },

  WRONG_MULTIPLIER: {
    code: 'WRONG_MULTIPLIER',
    name: 'Used Wrong Multiplication Factor',
    description: 'Used incorrect multiplier (e.g., wrong conversion factor).',
    commonIn: ['AC waveforms', 'calculations'],
    fixPrompt: 'Check the correct factors: RMS = 0.707 × peak, peak = 1.414 × RMS, peak-to-peak = 2 × peak.',
    relatedBlockIds: ['202-7C-explain-measurements'],
    severity: 'moderate',
  },

  CONFUSED_INSTRUMENTS: {
    code: 'CONFUSED_INSTRUMENTS',
    name: 'Confused Instrument Readings',
    description: 'Didn\'t understand what different instruments display (multimeter vs oscilloscope).',
    commonIn: ['AC waveforms', 'measurements'],
    fixPrompt: '**Multimeter** (AC mode) shows RMS. **Oscilloscope** shows actual waveform with peak values visible.',
    relatedBlockIds: ['202-7C-worked-example'],
    severity: 'moderate',
  },

  CONFUSED_PERIOD_FREQUENCY: {
    code: 'CONFUSED_PERIOD_FREQUENCY',
    name: 'Confused Period with Frequency',
    description: 'Mixed up period (time per cycle) with frequency (cycles per second).',
    commonIn: ['AC waveforms', 'time measurements'],
    fixPrompt: '**Period (T)** = time for one cycle (seconds). **Frequency (f)** = cycles per second (Hz). Related by T = 1/f.',
    relatedBlockIds: ['202-7C-explain-time'],
    severity: 'moderate',
  },

  DIVIDED_WRONG: {
    code: 'DIVIDED_WRONG',
    name: 'Division Error',
    description: 'Made an error in division calculation.',
    commonIn: ['calculations'],
    fixPrompt: 'Check your division carefully. Use a calculator if needed.',
    relatedBlockIds: [],
    severity: 'minor',
  },

  MULTIPLIED_BY_2_WRONG: {
    code: 'MULTIPLIED_BY_2_WRONG',
    name: 'Incorrectly Multiplied by 2',
    description: 'Multiplied by 2 when shouldn\'t have, or forgot to multiply by 2.',
    commonIn: ['AC waveforms', 'peak-to-peak'],
    fixPrompt: 'Peak-to-peak = 2 × peak. Check whether you need to multiply by 2 or not.',
    relatedBlockIds: ['202-7C-explain-measurements'],
    severity: 'moderate',
  },

  USED_0707_WRONG_WAY: {
    code: 'USED_0707_WRONG_WAY',
    name: 'Applied 0.707 Factor Incorrectly',
    description: 'Applied the 0.707 conversion factor the wrong way around.',
    commonIn: ['AC waveforms', 'RMS calculations'],
    fixPrompt: 'RMS = 0.707 × peak (multiply). Peak = RMS / 0.707 (divide) or peak = 1.414 × RMS.',
    relatedBlockIds: ['202-7C-explain-measurements'],
    severity: 'moderate',
  },

  USED_RMS_NOT_PEAK: {
    code: 'USED_RMS_NOT_PEAK',
    name: 'Used RMS When Peak Needed',
    description: 'Used RMS value when peak voltage was required.',
    commonIn: ['AC waveforms', 'applications'],
    fixPrompt: 'For insulation/capacitor ratings, use **peak voltage**, not RMS. Peak = 1.414 × RMS.',
    relatedBlockIds: ['202-7C-explain-measurements'],
    severity: 'critical',
  },

  USED_PEAK_TO_PEAK: {
    code: 'USED_PEAK_TO_PEAK',
    name: 'Used Peak-to-Peak Incorrectly',
    description: 'Used peak-to-peak value when another measurement was needed.',
    commonIn: ['AC waveforms'],
    fixPrompt: 'Check which measurement is needed: RMS, peak, or peak-to-peak. They\'re all different!',
    relatedBlockIds: ['202-7C-explain-measurements'],
    severity: 'moderate',
  },

  WRONG_DIAGNOSIS: {
    code: 'WRONG_DIAGNOSIS',
    name: 'Incorrect Problem Diagnosis',
    description: 'Misdiagnosed what the problem or situation indicates.',
    commonIn: ['application questions'],
    fixPrompt: 'Review the information carefully. What do the measurements tell you?',
    relatedBlockIds: ['202-7C-worked-example'],
    severity: 'moderate',
  },

  WRONG_INTERPRETATION: {
    code: 'WRONG_INTERPRETATION',
    name: 'Misinterpreted Information',
    description: 'Incorrectly interpreted the given information or measurements.',
    commonIn: ['application questions'],
    fixPrompt: 'Read the question carefully. What do the values actually represent?',
    relatedBlockIds: ['202-7C-worked-example'],
    severity: 'moderate',
  },

  WRONG_ACTION: {
    code: 'WRONG_ACTION',
    name: 'Recommended Wrong Action',
    description: 'Suggested incorrect action to take in a situation.',
    commonIn: ['application questions'],
    fixPrompt: 'Think through the consequences. What would be the safe and correct action?',
    relatedBlockIds: ['202-7C-explain-measurements'],
    severity: 'moderate',
  },

  CONFUSED_VOLTAGE_FREQUENCY: {
    code: 'CONFUSED_VOLTAGE_FREQUENCY',
    name: 'Confused Voltage with Frequency',
    description: 'Mixed up voltage and frequency as if they\'re related.',
    commonIn: ['AC waveforms'],
    fixPrompt: '**Voltage** and **frequency** are independent. Voltage can change without frequency changing.',
    relatedBlockIds: ['202-7C-explain-measurements', '202-7C-explain-time'],
    severity: 'moderate',
  },

  CONFUSED_DISTORTION_EFFECT: {
    code: 'CONFUSED_DISTORTION_EFFECT',
    name: 'Misunderstood Waveform Distortion',
    description: 'Didn\'t understand how waveform distortion affects measurements.',
    commonIn: ['AC waveforms', 'advanced'],
    fixPrompt: 'The 0.707 factor only works for pure sine waves. Distorted waveforms have different RMS-to-peak ratios.',
    relatedBlockIds: ['202-7C-explain-measurements'],
    severity: 'moderate',
  },

  FORGOT_TO_HALVE_P_P: {
    code: 'FORGOT_TO_HALVE_P_P',
    name: 'Forgot to Divide Peak-to-Peak by 2',
    description: 'Used peak-to-peak value without dividing by 2 to get peak.',
    commonIn: ['AC waveforms', 'calculations'],
    fixPrompt: 'Peak = peak-to-peak / 2. Don\'t forget to divide by 2!',
    relatedBlockIds: ['202-7C-explain-measurements'],
    severity: 'moderate',
  },

  CALCULATED_PEAK_NOT_P_P: {
    code: 'CALCULATED_PEAK_NOT_P_P',
    name: 'Calculated Peak Instead of Peak-to-Peak',
    description: 'Calculated peak value when peak-to-peak was asked for.',
    commonIn: ['AC waveforms', 'calculations'],
    fixPrompt: 'If peak-to-peak is needed, remember: peak-to-peak = 2 × peak.',
    relatedBlockIds: ['202-7C-explain-measurements'],
    severity: 'moderate',
  },

  MULTIPLIED_BY_2_ONLY: {
    code: 'MULTIPLIED_BY_2_ONLY',
    name: 'Only Multiplied by 2',
    description: 'Only multiplied by 2 without doing other necessary conversions.',
    commonIn: ['AC waveforms', 'calculations'],
    fixPrompt: 'Converting RMS to peak-to-peak requires TWO steps: RMS × 1.414 (to get peak), then × 2 (to get peak-to-peak).',
    relatedBlockIds: ['202-7C-explain-measurements'],
    severity: 'moderate',
  },

  WRONG_DECIMAL: {
    code: 'WRONG_DECIMAL',
    name: 'Decimal Point Error',
    description: 'Made an error with decimal point placement.',
    commonIn: ['calculations'],
    fixPrompt: 'Check your decimal point carefully. Is your answer in the right range?',
    relatedBlockIds: [],
    severity: 'minor',
  },

  USED_T_INSTEAD_OF_1_T: {
    code: 'USED_T_INSTEAD_OF_1_T',
    name: 'Used T Instead of 1/T',
    description: 'Used period value directly instead of calculating 1/T for frequency.',
    commonIn: ['AC waveforms', 'frequency calculations'],
    fixPrompt: 'Frequency f = **1/T**, not just T. If T = 0.02s, then f = 1/0.02 = 50Hz.',
    relatedBlockIds: ['202-7C-explain-time'],
    severity: 'critical',
  },

  WRONG_CALCULATION: {
    code: 'WRONG_CALCULATION',
    name: 'General Calculation Error',
    description: 'Made a calculation error (not fitting other specific categories).',
    commonIn: ['calculations'],
    fixPrompt: 'Check your calculation step by step. Verify each operation.',
    relatedBlockIds: [],
    severity: 'minor',
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

  // Cable-related Misconceptions
  CONFUSED_CABLE_COMPONENTS: {
    code: 'CONFUSED_CABLE_COMPONENTS',
    name: 'Confused Cable Components',
    description: 'Mixed up the different parts of a cable (conductor, insulation, sheath, CPC).',
    commonIn: ['cables', 'construction'],
    fixPrompt: '**Conductor** carries current, **insulation** prevents shock, **sheath** protects from damage, **CPC** provides earth path.',
    relatedBlockIds: ['203-1A-explain-construction'],
    severity: 'moderate',
  },

  CONFUSED_CONDUCTOR_COLOURS: {
    code: 'CONFUSED_CONDUCTOR_COLOURS',
    name: 'Confused Conductor Colours',
    description: 'Mixed up the UK wiring colour codes.',
    commonIn: ['cables', 'wiring'],
    fixPrompt: 'Current UK code: **Brown** = Live, **Blue** = Neutral, **Green/Yellow** = Earth.',
    relatedBlockIds: ['203-1A-explain-identification'],
    severity: 'critical',
  },

  OLD_COLOUR_CODE: {
    code: 'OLD_COLOUR_CODE',
    name: 'Used Old Colour Code',
    description: 'Used the old UK colour code (red/black) instead of current standard.',
    commonIn: ['cables', 'wiring'],
    fixPrompt: 'Old code was red/black. **Current UK code** (post-2004): Brown = Live, Blue = Neutral, Green/Yellow = Earth.',
    relatedBlockIds: ['203-1A-explain-identification'],
    severity: 'moderate',
  },

  CONFUSED_CABLE_MATERIALS: {
    code: 'CONFUSED_CABLE_MATERIALS',
    name: 'Confused Cable Materials',
    description: 'Mixed up which materials are used for conductors vs insulation.',
    commonIn: ['cables', 'construction'],
    fixPrompt: '**Conductors** are metal (copper/aluminium). **Insulation** is non-conductive (PVC, rubber).',
    relatedBlockIds: ['203-1A-explain-construction'],
    severity: 'moderate',
  },

  CONFUSED_CABLE_APPLICATIONS: {
    code: 'CONFUSED_CABLE_APPLICATIONS',
    name: 'Confused Cable Applications',
    description: 'Used wrong cable type for the application (e.g., flex for fixed wiring).',
    commonIn: ['cables', 'selection'],
    fixPrompt: '**T&E** for fixed domestic, **singles** for commercial, **flex** for portable, **SWA** for outdoor/underground.',
    relatedBlockIds: ['203-1A-explain-types', '203-1A-explain-selection'],
    severity: 'critical',
  },

  CONFUSED_CPC_FORMS: {
    code: 'CONFUSED_CPC_FORMS',
    name: 'Confused CPC Forms',
    description: 'Didn\'t know whether CPC should be bare or insulated in different cable types.',
    commonIn: ['cables', 'construction'],
    fixPrompt: 'T&E has **bare CPC**. Flex has **green/yellow insulated CPC**.',
    relatedBlockIds: ['203-1A-explain-construction'],
    severity: 'moderate',
  },

  CONFUSED_CONDUCTOR_TYPES: {
    code: 'CONFUSED_CONDUCTOR_TYPES',
    name: 'Confused Conductor Types',
    description: 'Mixed up solid vs stranded conductors.',
    commonIn: ['cables', 'construction'],
    fixPrompt: '**Solid** conductors (T&E) for fixed wiring. **Stranded** conductors (flex) for flexibility.',
    relatedBlockIds: ['203-1A-explain-types'],
    severity: 'moderate',
  },

  CONFUSED_CABLE_SIZES: {
    code: 'CONFUSED_CABLE_SIZES',
    name: 'Confused Cable Sizes',
    description: 'Used wrong cable size for the circuit type.',
    commonIn: ['cables', 'selection'],
    fixPrompt: 'Lighting: 1.0-1.5mm². Sockets: 2.5mm². Cookers: 6-10mm². Size depends on load!',
    relatedBlockIds: ['203-1A-explain-identification'],
    severity: 'critical',
  },

  CONFUSED_BURIAL_DEPTHS: {
    code: 'CONFUSED_BURIAL_DEPTHS',
    name: 'Confused Burial Depths',
    description: 'Didn\'t know correct burial depth for underground cables.',
    commonIn: ['cables', 'installation'],
    fixPrompt: 'Underground cables: **600mm deep** (or 450mm if under paving).',
    relatedBlockIds: ['203-1A-worked-example'],
    severity: 'moderate',
  },

  CURRENT_COLOUR_CODE: {
    code: 'CURRENT_COLOUR_CODE',
    name: 'Used Current Code Instead of Old',
    description: 'Used current colour code when old code was being referenced.',
    commonIn: ['cables', 'wiring'],
    fixPrompt: 'Old UK code (pre-2004): Red = Live, Black = Neutral. Current code: Brown = Live, Blue = Neutral.',
    relatedBlockIds: ['203-1A-explain-identification'],
    severity: 'minor',
  },

  CONFUSED_WITH_FLEX: {
    code: 'CONFUSED_WITH_FLEX',
    name: 'Confused Cable with Flex',
    description: 'Mixed up characteristics of fixed cable (T&E) with flexible cord.',
    commonIn: ['cables', 'types'],
    fixPrompt: '**T&E** is flat, solid conductors, for fixed wiring. **Flex** is round, stranded, for portable.',
    relatedBlockIds: ['203-1A-explain-types'],
    severity: 'moderate',
  },

  CONFUSED_WITH_TE: {
    code: 'CONFUSED_WITH_TE',
    name: 'Confused Flex with T&E',
    description: 'Mixed up characteristics of flex with Twin & Earth cable.',
    commonIn: ['cables', 'types'],
    fixPrompt: '**Flex** is round, stranded, for portable use. **T&E** is flat, solid, for fixed wiring.',
    relatedBlockIds: ['203-1A-explain-types'],
    severity: 'moderate',
  },

  CONFUSED_CPC_PURPOSE: {
    code: 'CONFUSED_CPC_PURPOSE',
    name: 'Misunderstood CPC Purpose',
    description: 'Didn\'t understand the function of the Circuit Protective Conductor.',
    commonIn: ['cables', 'safety'],
    fixPrompt: 'CPC provides **low-resistance path to earth** for fault protection, not for carrying normal current.',
    relatedBlockIds: ['203-1A-explain-construction'],
    severity: 'critical',
  },

  UNDERESTIMATED_ENVIRONMENTAL_FACTORS: {
    code: 'UNDERESTIMATED_ENVIRONMENTAL_FACTORS',
    name: 'Underestimated Environmental Factors',
    description: 'Didn\'t consider environmental factors (chemicals, moisture, temperature) when selecting cable.',
    commonIn: ['cables', 'selection'],
    fixPrompt: 'Always assess **temperature, moisture, mechanical risk, and chemical exposure** when selecting cables.',
    relatedBlockIds: ['203-1A-explain-selection'],
    severity: 'critical',
  },

  IGNORED_TEMPERATURE_EFFECTS: {
    code: 'IGNORED_TEMPERATURE_EFFECTS',
    name: 'Ignored Temperature Effects',
    description: 'Didn\'t account for high ambient temperature reducing cable current capacity.',
    commonIn: ['cables', 'derating'],
    fixPrompt: 'High temperature requires **derating** (larger cable size) because heat reduces current capacity.',
    relatedBlockIds: ['203-1A-explain-selection'],
    severity: 'critical',
  },

  ASSUMED_COPPER_ALWAYS_BEST: {
    code: 'ASSUMED_COPPER_ALWAYS_BEST',
    name: 'Assumed Copper Always Best',
    description: 'Didn\'t understand that aluminium can be better for some large installations.',
    commonIn: ['cables', 'materials'],
    fixPrompt: 'Copper has better conductivity, but **aluminium** is lighter and cheaper for very large conductors.',
    relatedBlockIds: ['203-1A-explain-construction'],
    severity: 'minor',
  },

  IGNORED_CONDENSATION_RISK: {
    code: 'IGNORED_CONDENSATION_RISK',
    name: 'Ignored Condensation Risk',
    description: 'Didn\'t consider condensation when cable passes between hot and cold areas.',
    commonIn: ['cables', 'installation'],
    fixPrompt: 'Temperature differences cause **condensation** inside cables. Requires sealing or drainage.',
    relatedBlockIds: ['203-1A-explain-selection'],
    severity: 'moderate',
  },

  IGNORED_GROUPING_EFFECTS: {
    code: 'IGNORED_GROUPING_EFFECTS',
    name: 'Ignored Cable Grouping Effects',
    description: 'Didn\'t account for derating when multiple cables are bundled together.',
    commonIn: ['cables', 'derating'],
    fixPrompt: 'Bundled cables heat each other. Apply **grouping factors** (derating) when cables are together.',
    relatedBlockIds: ['203-1A-explain-selection'],
    severity: 'critical',
  },

  OVERSIMPLIFIED_INSTALLATION: {
    code: 'OVERSIMPLIFIED_INSTALLATION',
    name: 'Oversimplified Installation Method',
    description: 'Didn\'t consider complexity of installation method requirements.',
    commonIn: ['cables', 'installation'],
    fixPrompt: 'Installation method depends on **protection needs, aesthetics, environment, and cable type**.',
    relatedBlockIds: ['203-1A-explain-selection'],
    severity: 'moderate',
  },

  MISUNDERSTOOD_SWA_TERMINATION: {
    code: 'MISUNDERSTOOD_SWA_TERMINATION',
    name: 'Misunderstood SWA Termination',
    description: 'Didn\'t understand why SWA needs special glands.',
    commonIn: ['cables', 'SWA'],
    fixPrompt: 'SWA glands provide **mechanical retention, armour termination, and earth continuity**.',
    relatedBlockIds: ['203-1A-explain-types'],
    severity: 'moderate',
  },

  IGNORED_EMC_REQUIREMENTS: {
    code: 'IGNORED_EMC_REQUIREMENTS',
    name: 'Ignored EMC Requirements',
    description: 'Didn\'t consider electromagnetic compatibility in sensitive environments.',
    commonIn: ['cables', 'selection'],
    fixPrompt: 'Sensitive equipment areas need cables with **EMC consideration** (screening, routing) to minimize interference.',
    relatedBlockIds: ['203-1A-explain-selection'],
    severity: 'moderate',
  },

  IGNORED_FIRE_REQUIREMENTS: {
    code: 'IGNORED_FIRE_REQUIREMENTS',
    name: 'Ignored Fire Requirements',
    description: 'Didn\'t consider fire performance requirements for escape routes.',
    commonIn: ['cables', 'selection'],
    fixPrompt: 'Escape routes need **Low Smoke & Fume (LSF)** or **fire-resistant** cables.',
    relatedBlockIds: ['203-1A-explain-selection'],
    severity: 'critical',
  },

  SIMPLIFIED_INSTALLATION_METHOD: {
    code: 'SIMPLIFIED_INSTALLATION_METHOD',
    name: 'Simplified Installation Method',
    description: 'Selected cable size based on only one installation method when multiple methods used.',
    commonIn: ['cables', 'selection'],
    fixPrompt: 'Use **most onerous (worst-case) installation method** when route includes multiple methods.',
    relatedBlockIds: ['203-1A-explain-selection'],
    severity: 'critical',
  },

  IGNORED_IP_REQUIREMENTS: {
    code: 'IGNORED_IP_REQUIREMENTS',
    name: 'Ignored IP Rating Requirements',
    description: 'Didn\'t consider IP rating requirements for bathroom zones or damp locations.',
    commonIn: ['cables', 'selection'],
    fixPrompt: 'Bathrooms and damp areas require appropriate **IP ratings** and moisture-resistant cables.',
    relatedBlockIds: ['203-1A-explain-selection'],
    severity: 'critical',
  },

  COUNTED_CPC_AS_INSULATED: {
    code: 'COUNTED_CPC_AS_INSULATED',
    name: 'Counted CPC as Insulated Conductor',
    description: 'Incorrectly counted the bare CPC as an insulated conductor.',
    commonIn: ['cables', 'identification'],
    fixPrompt: 'T&E has **two insulated conductors** plus a bare CPC. Don\'t count the CPC as insulated.',
    relatedBlockIds: ['203-1A-explain-construction'],
    severity: 'minor',
  },

  CONFUSED_VOLTAGE_RATINGS: {
    code: 'CONFUSED_VOLTAGE_RATINGS',
    name: 'Confused Cable Voltage Ratings',
    description: 'Mixed up cable voltage rating with supply voltage.',
    commonIn: ['cables', 'identification'],
    fixPrompt: 'Cable rating 300/500V means **cable capability**, not the supply voltage. 230V mains uses 300/500V rated cable.',
    relatedBlockIds: ['203-1A-explain-identification'],
    severity: 'moderate',
  },

  CONFUSED_BS_STANDARDS: {
    code: 'CONFUSED_BS_STANDARDS',
    name: 'Confused British Standards',
    description: 'Mixed up different British Standards.',
    commonIn: ['cables', 'standards'],
    fixPrompt: '**BS 6004** = PVC cables, **BS 7671** = Wiring Regulations, **BS 1363** = Plugs/Sockets.',
    relatedBlockIds: ['203-1A-explain-identification'],
    severity: 'minor',
  },

  UNDERESTIMATED_OUTDOOR_REQUIREMENTS: {
    code: 'UNDERESTIMATED_OUTDOOR_REQUIREMENTS',
    name: 'Underestimated Outdoor Requirements',
    description: 'Didn\'t realize outdoor cables need special protection even above ground.',
    commonIn: ['cables', 'selection'],
    fixPrompt: 'Outdoor cables need **weather resistance and mechanical protection** whether buried or above ground. Use SWA.',
    relatedBlockIds: ['203-1A-worked-example'],
    severity: 'critical',
  },

  ASSUMED_COLOUR_CODE_UNIVERSAL: {
    code: 'ASSUMED_COLOUR_CODE_UNIVERSAL',
    name: 'Assumed Colour Code is Universal',
    description: 'Assumed all wiring uses current colour code without checking.',
    commonIn: ['cables', 'safety'],
    fixPrompt: 'Older installations use different colours. **Always test** to verify - never assume!',
    relatedBlockIds: ['203-1A-explain-identification'],
    severity: 'critical',
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





