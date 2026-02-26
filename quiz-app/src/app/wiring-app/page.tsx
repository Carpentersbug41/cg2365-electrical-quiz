'use client';

import { useMemo, useState } from 'react';

type TerminalSide = 'left' | 'right';
type WireType = 'live' | 'neutral' | 'earth';

type Terminal = {
  id: string;
  label: string;
  side: TerminalSide;
};

type ComponentNode = {
  id: string;
  label: string;
  type: 'consumer-unit' | 'switch' | 'lamp' | 'generic';
  x: number;
  y: number;
  terminals: Terminal[];
};

type WirePair = [string, string];

type UserWire = {
  from: string;
  to: string;
  color: WireType;
};

type ExerciseDefinition = {
  id: string;
  title: string;
  description: string;
  components: ComponentNode[];
  requiredWires: WirePair[];
};

type Feedback = {
  tone: 'neutral' | 'success' | 'warning' | 'error';
  message: string;
  details: string[];
};

const CARD_WIDTH = 210;
const LAMP_SIZE = 170;
const TERMINAL_START_Y = 64;
const TERMINAL_ROW_GAP = 30;
const TERMINAL_SIZE = 34;
const TERMINAL_INSET_X = 10;

const defaultExercise: ExerciseDefinition = {
  id: 'lighting-1way-basic',
  title: 'Basic One-Way Lighting Circuit',
  description:
    'Wire a consumer unit, one-way switch, and lamp so the switch controls the lamp correctly.',
  components: [
    {
      id: 'cu',
      label: 'Consumer Unit',
      type: 'consumer-unit',
      x: 80,
      y: 96,
      terminals: [
        { id: 'cu-l', label: 'L', side: 'right' },
        { id: 'cu-n', label: 'N', side: 'right' },
        { id: 'cu-e', label: 'E', side: 'right' },
      ],
    },
    {
      id: 'sw1',
      label: '1-Way Switch',
      type: 'switch',
      x: 355,
      y: 96,
      terminals: [
        { id: 'sw1-l1', label: 'L1', side: 'right' },
        { id: 'sw1-com', label: 'COM', side: 'left' },
        { id: 'sw1-e', label: 'E', side: 'left' },
      ],
    },
    {
      id: 'lamp1',
      label: 'Lamp',
      type: 'lamp',
      x: 680,
      y: 86,
      terminals: [
        { id: 'lamp1-l', label: 'L', side: 'left' },
        { id: 'lamp1-n', label: 'N', side: 'left' },
        { id: 'lamp1-e', label: 'E', side: 'left' },
      ],
    },
  ],
  requiredWires: [
    ['cu-l', 'sw1-com'],
    ['sw1-l1', 'lamp1-l'],
    ['cu-n', 'lamp1-n'],
    ['cu-e', 'sw1-e'],
    ['sw1-e', 'lamp1-e'],
  ],
};

function wireKey(a: string, b: string): string {
  return [a, b].sort().join('|');
}

function wireLabel(type: WireType): string {
  if (type === 'earth') return 'green (earth)';
  if (type === 'neutral') return 'blue (neutral)';
  return 'brown (live)';
}

function describeWirePair(wire: WirePair, terminalLabels: Record<string, string>): string {
  const [a, b] = wire;
  return `${terminalLabels[a] ?? a} -> ${terminalLabels[b] ?? b}`;
}

function describeUserWire(wire: UserWire, terminalLabels: Record<string, string>): string {
  return `${terminalLabels[wire.from] ?? wire.from} -> ${terminalLabels[wire.to] ?? wire.to}`;
}

function inferWireType(
  a: string,
  b: string,
  _terminalDisplayLabels: Record<string, string>
): WireType {
  const aCode = a.split('-').pop()?.toLowerCase() ?? '';
  const bCode = b.split('-').pop()?.toLowerCase() ?? '';
  if (aCode === 'e' || bCode === 'e') return 'earth';
  if (aCode === 'n' || bCode === 'n') return 'neutral';
  return 'live';
}

function wireStroke(type: WireType): string {
  if (type === 'earth') return '#2f9a47';
  if (type === 'neutral') return '#1d5fd1';
  return '#7b3f00';
}

function componentAccent(type: ComponentNode['type']): string {
  if (type === 'consumer-unit') return '#0f766e';
  if (type === 'switch') return '#b45309';
  if (type === 'lamp') return '#b91c1c';
  return '#334155';
}

function componentWidth(component: ComponentNode): number {
  return component.type === 'lamp' ? LAMP_SIZE : CARD_WIDTH;
}

function terminalOffset(component: ComponentNode, terminal: Terminal, index: number): { left: number; top: number } {
  const width = componentWidth(component);

  if (component.type === 'lamp') {
    const lampTop = 92;
    if (terminal.label === 'L') return { left: 24, top: lampTop };
    if (terminal.label === 'N') return { left: width - 24 - TERMINAL_SIZE, top: lampTop };
    return { left: width / 2 - terminalSizeFor(component, terminal) / 2, top: lampTop + 38 };
  }

  if (component.type === 'switch' && terminal.label === 'E') {
    return {
      top: TERMINAL_START_Y + 2 * TERMINAL_ROW_GAP - 8,
      left: width / 2 - terminalSizeFor(component, terminal) / 2,
    };
  }

  return {
    top: TERMINAL_START_Y + index * TERMINAL_ROW_GAP - 12,
    left:
      terminal.side === 'left'
        ? TERMINAL_INSET_X
        : width - TERMINAL_INSET_X - TERMINAL_SIZE,
  };
}

function terminalSizeFor(component: ComponentNode, terminal: Terminal): number {
  if ((component.type === 'switch' || component.type === 'lamp') && terminal.label === 'E') return 24;
  return TERMINAL_SIZE;
}

function validateExercise(candidate: ExerciseDefinition): string[] {
  const errors: string[] = [];

  if (!candidate.id?.trim()) errors.push('Exercise id is required.');
  if (!candidate.title?.trim()) errors.push('Exercise title is required.');
  if (!Array.isArray(candidate.components) || candidate.components.length === 0) {
    errors.push('At least one component is required.');
  }

  const terminalIds = new Set<string>();
  candidate.components.forEach((component) => {
    if (!component.id?.trim()) errors.push('Each component needs an id.');
    if (!Array.isArray(component.terminals) || component.terminals.length === 0) {
      errors.push(`Component ${component.id || '(missing-id)'} needs at least one terminal.`);
      return;
    }
    component.terminals.forEach((terminal) => {
      if (!terminal.id?.trim()) errors.push(`Component ${component.id} has a terminal with no id.`);
      if (terminalIds.has(terminal.id)) errors.push(`Duplicate terminal id found: ${terminal.id}`);
      terminalIds.add(terminal.id);
    });
  });

  if (!Array.isArray(candidate.requiredWires) || candidate.requiredWires.length === 0) {
    errors.push('At least one required wire is needed.');
  } else {
    candidate.requiredWires.forEach((wire, index) => {
      if (!Array.isArray(wire) || wire.length !== 2) {
        errors.push(`requiredWires[${index}] must be a pair like ["a", "b"].`);
        return;
      }
      if (!terminalIds.has(wire[0]) || !terminalIds.has(wire[1])) {
        errors.push(`requiredWires[${index}] references unknown terminal ids.`);
      }
    });
  }

  return errors;
}

export default function WiringAppPage() {
  const [exercise, setExercise] = useState<ExerciseDefinition>(defaultExercise);
  const [selectedWireType, setSelectedWireType] = useState<WireType>('live');
  const [selectedTerminal, setSelectedTerminal] = useState<string | null>(null);
  const [wires, setWires] = useState<UserWire[]>([]);
  const [feedback, setFeedback] = useState<Feedback>({
    tone: 'neutral',
    message: 'Pick a wire color, then click one terminal and then another to connect.',
    details: [],
  });
  const [editorValue, setEditorValue] = useState<string>(JSON.stringify(defaultExercise, null, 2));

  const terminalPositions = useMemo(() => {
    const positions: Record<string, { x: number; y: number }> = {};
    exercise.components.forEach((component) => {
      component.terminals.forEach((terminal, index) => {
        const offset = terminalOffset(component, terminal, index);
        const size = terminalSizeFor(component, terminal);
        positions[terminal.id] = {
          x: component.x + offset.left + size / 2,
          y: component.y + offset.top + size / 2,
        };
      });
    });
    return positions;
  }, [exercise]);

  const terminalLabels = useMemo(() => {
    const labels: Record<string, string> = {};
    exercise.components.forEach((component) => {
      component.terminals.forEach((terminal) => {
        labels[terminal.id] = terminal.label;
      });
    });
    return labels;
  }, [exercise]);

  const requiredWireKeys = useMemo(
    () => new Set(exercise.requiredWires.map(([a, b]) => wireKey(a, b))),
    [exercise.requiredWires]
  );

  const expectedTypeByWireKey = useMemo(() => {
    const result: Record<string, WireType> = {};
    exercise.requiredWires.forEach(([a, b]) => {
      result[wireKey(a, b)] = inferWireType(a, b, terminalLabels);
    });
    return result;
  }, [exercise.requiredWires, terminalLabels]);

  function onTerminalClick(terminalId: string) {
    if (!selectedTerminal) {
      setSelectedTerminal(terminalId);
      setFeedback({
        tone: 'neutral',
        message: `Selected ${terminalLabels[terminalId]} using ${wireLabel(selectedWireType)}.`,
        details: ['Choose the second terminal to place this wire.'],
      });
      return;
    }

    if (selectedTerminal === terminalId) {
      setSelectedTerminal(null);
      setFeedback({
        tone: 'neutral',
        message: 'Selection cancelled.',
        details: [],
      });
      return;
    }

    const key = wireKey(selectedTerminal, terminalId);
    const alreadyExists = wires.some((wire) => wireKey(wire.from, wire.to) === key);
    if (alreadyExists) {
      setSelectedTerminal(null);
      setFeedback({
        tone: 'warning',
        message: 'That wire already exists.',
        details: [],
      });
      return;
    }

    setWires((prev) => [...prev, { from: selectedTerminal, to: terminalId, color: selectedWireType }]);
    setSelectedTerminal(null);
    setFeedback({
      tone: 'neutral',
      message: `Wire added (${wireLabel(selectedWireType)}): ${terminalLabels[selectedTerminal]} -> ${terminalLabels[terminalId]}`,
      details: [],
    });
  }

  function removeWire(index: number) {
    setWires((prev) => prev.filter((_, i) => i !== index));
  }

  function clearWires() {
    setWires([]);
    setSelectedTerminal(null);
    setFeedback({
      tone: 'neutral',
      message: 'All user wires cleared.',
      details: [],
    });
  }

  function testCircuit() {
    const userKeys = new Set(wires.map((wire) => wireKey(wire.from, wire.to)));
    const missing = [...requiredWireKeys].filter((key) => !userKeys.has(key));
    const extra = [...userKeys].filter((key) => !requiredWireKeys.has(key));

    const wrongColor = wires.filter((wire) => {
      const key = wireKey(wire.from, wire.to);
      const expected = expectedTypeByWireKey[key];
      return expected && expected !== wire.color;
    });

    if (missing.length === 0 && extra.length === 0 && wrongColor.length === 0) {
      setFeedback({
        tone: 'success',
        message: 'Circuit test passed. Connections and wire colors are correct.',
        details: ['All required wires are present with the correct brown/blue/green selection.'],
      });
      return;
    }

    const details: string[] = [];
    if (missing.length > 0) {
      details.push(`Missing wires: ${missing.length}`);
      exercise.requiredWires
        .filter(([a, b]) => missing.includes(wireKey(a, b)))
        .forEach((pair) => details.push(`- ${describeWirePair(pair, terminalLabels)}`));
    }

    if (extra.length > 0) {
      details.push(`Extra wires: ${extra.length}`);
      wires
        .filter((wire) => extra.includes(wireKey(wire.from, wire.to)))
        .forEach((wire) =>
          details.push(`- ${describeUserWire(wire, terminalLabels)} (${wireLabel(wire.color)})`)
        );
    }

    if (wrongColor.length > 0) {
      details.push(`Wrong wire colors: ${wrongColor.length}`);
      wrongColor.forEach((wire) => {
        const key = wireKey(wire.from, wire.to);
        const expected = expectedTypeByWireKey[key];
        details.push(
          `- ${describeUserWire(wire, terminalLabels)} expected ${wireLabel(expected)} but used ${wireLabel(wire.color)}`
        );
      });
    }

    setFeedback({
      tone: 'error',
      message: 'Circuit failed test.',
      details,
    });
  }

  function applyEditorConfig() {
    try {
      const parsed = JSON.parse(editorValue) as ExerciseDefinition;
      const errors = validateExercise(parsed);
      if (errors.length > 0) {
        setFeedback({
          tone: 'error',
          message: 'Config not applied due to validation errors.',
          details: errors.map((error) => `- ${error}`),
        });
        return;
      }

      setExercise(parsed);
      setWires([]);
      setSelectedTerminal(null);
      setFeedback({
        tone: 'success',
        message: `Loaded exercise: ${parsed.title}`,
        details: ['Wires were reset to match the new exercise definition.'],
      });
    } catch {
      setFeedback({
        tone: 'error',
        message: 'Config not applied. JSON parse error.',
        details: ['Check the JSON syntax in the admin editor.'],
      });
    }
  }

  function loadDefaultConfig() {
    const text = JSON.stringify(defaultExercise, null, 2);
    setEditorValue(text);
    setExercise(defaultExercise);
    setWires([]);
    setSelectedTerminal(null);
    setFeedback({
      tone: 'neutral',
      message: 'Default exercise restored.',
      details: [],
    });
  }

  return (
    <main
      style={{
        minHeight: '100vh',
        padding: '1.2rem',
        background:
          'radial-gradient(circle at 15% 10%, #e8f2ff 0%, #f5f9ff 35%, #f8fafc 70%, #f1f5f9 100%)',
      }}
    >
      <div
        style={{
          maxWidth: 1320,
          margin: '0 auto',
          display: 'grid',
          gap: '1rem',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        }}
      >
        <section
          style={{
            background: 'linear-gradient(180deg, #ffffff 0%, #fdfefe 100%)',
            border: '1px solid #d4e0ea',
            borderRadius: 16,
            padding: '1rem',
            boxShadow: '0 14px 34px rgba(15, 23, 42, 0.08)',
          }}
        >
          <h1 style={{ marginTop: 0, marginBottom: 8, color: '#0f172a', letterSpacing: '0.2px' }}>
            Wiring Prototype
          </h1>
          <p style={{ marginTop: 0, color: '#334155' }}>{exercise.description}</p>

          <div style={{ marginBottom: 12, display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
            <strong>Selected wire:</strong>
            <button
              type="button"
              onClick={() => setSelectedWireType('live')}
              style={{ ...colorSelectButtonStyle, borderColor: selectedWireType === 'live' ? '#7b3f00' : '#b9c7d6' }}
            >
              <span style={{ ...colorSwatchStyle, background: wireStroke('live') }} /> Brown (Live)
            </button>
            <button
              type="button"
              onClick={() => setSelectedWireType('neutral')}
              style={{
                ...colorSelectButtonStyle,
                borderColor: selectedWireType === 'neutral' ? '#1d5fd1' : '#b9c7d6',
              }}
            >
              <span style={{ ...colorSwatchStyle, background: wireStroke('neutral') }} /> Blue (Neutral)
            </button>
            <button
              type="button"
              onClick={() => setSelectedWireType('earth')}
              style={{ ...colorSelectButtonStyle, borderColor: selectedWireType === 'earth' ? '#2f9a47' : '#b9c7d6' }}
            >
              <span style={{ ...colorSwatchStyle, background: wireStroke('earth') }} /> Green (Earth)
            </button>
          </div>

          <div style={{ overflowX: 'auto', border: '1px solid #d8e3ef', borderRadius: 14 }}>
            <div
              style={{
                position: 'relative',
                width: 920,
                height: 360,
                background:
                  'linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(244,250,255,1) 100%)',
              }}
            >
              {exercise.components.map((component) => (
                <article
                  key={component.id}
                  style={{
                    position: 'absolute',
                    left: component.x,
                    top: component.y,
                    width: componentWidth(component),
                    height: component.type === 'lamp' ? LAMP_SIZE : 150,
                    border: '1px solid #d1dce7',
                    borderRadius: component.type === 'lamp' ? '50%' : 14,
                    background: '#ffffff',
                    boxShadow: '0 10px 22px rgba(17, 34, 51, 0.10)',
                    overflow: 'hidden',
                  }}
                >
                  <header
                    style={{
                      borderBottom: component.type === 'lamp' ? 'none' : '1px solid #e8eef5',
                      borderTop: `4px solid ${componentAccent(component.type)}`,
                      padding: component.type === 'lamp' ? '10px 10px 4px' : '8px 10px',
                      fontWeight: 600,
                      color: '#1d2a3a',
                      textAlign: component.type === 'lamp' ? 'center' : 'left',
                    }}
                  >
                    {component.label}
                  </header>
                  {component.terminals.map((terminal, index) => {
                    const isSelected = selectedTerminal === terminal.id;
                    const offset = terminalOffset(component, terminal, index);
                    const terminalSize = terminalSizeFor(component, terminal);
                    return (
                      <button
                        key={terminal.id}
                        type="button"
                        onClick={() => onTerminalClick(terminal.id)}
                        style={{
                          position: 'absolute',
                          top: offset.top,
                          left: offset.left,
                          width: terminalSize,
                          height: terminalSize,
                          border: isSelected ? '3px solid #0b6bcb' : '2px solid #b8c4d3',
                          borderRadius: 999,
                          padding: 0,
                          background: isSelected ? '#dff0ff' : '#ffffff',
                          color: '#1d2a3a',
                          fontSize: 12,
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        {terminal.label}
                      </button>
                    );
                  })}
                </article>
              ))}

              <svg
                width={920}
                height={360}
                style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 10 }}
              >
                {wires.map((wire, index) => {
                  const start = terminalPositions[wire.from];
                  const end = terminalPositions[wire.to];
                  if (!start || !end) return null;
                  return (
                    <line
                      key={`${wire.from}-${wire.to}-${index}`}
                      x1={start.x}
                      y1={start.y}
                      x2={end.x}
                      y2={end.y}
                      stroke={wireStroke(wire.color)}
                      strokeWidth={4}
                      strokeLinecap="round"
                    />
                  );
                })}
              </svg>
            </div>
          </div>

          <div style={{ marginTop: 12, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button type="button" onClick={testCircuit} style={buttonStyle}>
              Test Circuit
            </button>
            <button type="button" onClick={clearWires} style={buttonStyle}>
              Clear Wires
            </button>
          </div>

          <div
            style={{
              marginTop: 12,
              borderRadius: 8,
              border: `1px solid ${
                feedback.tone === 'success'
                  ? '#86d6a8'
                  : feedback.tone === 'warning'
                    ? '#e1bf71'
                    : feedback.tone === 'error'
                      ? '#e29d9d'
                      : '#ccd8e6'
              }`,
              background:
                feedback.tone === 'success'
                  ? '#f1fff7'
                  : feedback.tone === 'warning'
                    ? '#fff9ef'
                    : feedback.tone === 'error'
                      ? '#fff5f5'
                      : '#f8fbff',
              padding: '10px 12px',
            }}
          >
            <strong>{feedback.message}</strong>
            {feedback.details.length > 0 && (
              <ul style={{ margin: '8px 0 0 18px', padding: 0 }}>
                {feedback.details.map((detail) => (
                  <li key={detail}>{detail}</li>
                ))}
              </ul>
            )}
          </div>

          <h2 style={{ marginBottom: 8 }}>Current Wires</h2>
          {wires.length === 0 ? (
            <p style={{ marginTop: 0, color: '#56667b' }}>No wires yet.</p>
          ) : (
            <ul style={{ marginTop: 0, paddingLeft: 20 }}>
              {wires.map((wire, index) => (
                <li key={`${wire.from}-${wire.to}-${index}`} style={{ marginBottom: 6 }}>
                  {describeUserWire(wire, terminalLabels)} ({wireLabel(wire.color)})
                  <button
                    type="button"
                    onClick={() => removeWire(index)}
                    style={{
                      marginLeft: 8,
                      border: '1px solid #c4d1df',
                      borderRadius: 6,
                      padding: '1px 6px',
                      background: '#fff',
                      cursor: 'pointer',
                    }}
                  >
                    remove
                  </button>
                </li>
              ))}
            </ul>
          )}
          <p style={{ marginTop: 8, color: '#56667b', fontSize: 13 }}>
            Wire colors: <span style={{ color: '#7b3f00', fontWeight: 700 }}>brown = live</span>,{' '}
            <span style={{ color: '#1d5fd1', fontWeight: 700 }}>blue = neutral</span>,{' '}
            <span style={{ color: '#2f9a47', fontWeight: 700 }}>green = earth</span>.
          </p>
        </section>

        <aside
          style={{
            background: 'linear-gradient(180deg, #ffffff 0%, #fcfdff 100%)',
            border: '1px solid #d4e0ea',
            borderRadius: 16,
            padding: '1rem',
            boxShadow: '0 14px 34px rgba(15, 23, 42, 0.08)',
          }}
        >
          <h2 style={{ marginTop: 0 }}>Admin Prototype</h2>
          <p style={{ color: '#344257' }}>
            Edit the exercise JSON to define different components and expected wires.
          </p>

          <div style={{ display: 'flex', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
            <button type="button" onClick={applyEditorConfig} style={buttonStyle}>
              Apply Config
            </button>
            <button type="button" onClick={loadDefaultConfig} style={buttonStyle}>
              Reset Default
            </button>
          </div>

          <textarea
            value={editorValue}
            onChange={(event) => setEditorValue(event.target.value)}
            spellCheck={false}
            style={{
              width: '100%',
              minHeight: 520,
              border: '1px solid #ccd8e6',
              borderRadius: 8,
              padding: 10,
              fontFamily: 'Consolas, "Courier New", monospace',
              fontSize: 12,
              resize: 'vertical',
              background: '#fbfdff',
            }}
          />
        </aside>
      </div>
    </main>
  );
}

const buttonStyle: React.CSSProperties = {
  border: '1px solid #b8c8d9',
  borderRadius: 10,
  padding: '7px 12px',
  background: 'linear-gradient(180deg, #ffffff 0%, #f8fbff 100%)',
  cursor: 'pointer',
  color: '#102033',
  fontWeight: 600,
};

const colorSelectButtonStyle: React.CSSProperties = {
  ...buttonStyle,
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  padding: '7px 11px',
  borderWidth: 2,
};

const colorSwatchStyle: React.CSSProperties = {
  width: 12,
  height: 12,
  borderRadius: '50%',
  display: 'inline-block',
  border: '1px solid rgba(0,0,0,0.2)',
};
