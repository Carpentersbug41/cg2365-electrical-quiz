import React, { useState } from "react";
import {
  BookOpen,
  Activity,
  HelpCircle,
  CheckCircle,
  ArrowRight,
  PlayCircle,
  Layers,
  RefreshCw,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import WaveAnimation from "./components/WaveAnimation";
import QuizSection from "./components/QuizSection";
import FillGapActivity from "./components/FillGapActivity";

const sections = [
  { id: "intro", title: "Introduction", icon: BookOpen },
  { id: "energy", title: "Energy Transfer", icon: Activity },
  { id: "evidence", title: "Evidence", icon: Layers },
  { id: "practice", title: "Practice", icon: CheckCircle },
];

export default function App() {
  const [activeSection, setActiveSection] = useState("intro");

  const renderContent = () => {
    switch (activeSection) {
      case "intro":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="p-8">
                <WaveAnimation />
              </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-8 text-white shadow-xl shadow-indigo-200">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-sm font-medium mb-6">
                <BookOpen size={16} />
                PHY.4-1A
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                Introduction to Waves
              </h1>
              <p className="text-indigo-100 text-lg md:text-xl max-w-2xl mb-8 leading-relaxed">
                Learn how waves transfer energy and information without
                transferring matter.
              </p>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-indigo-400/50 flex items-center justify-center text-sm font-bold">
                      1
                    </div>
                    <h3 className="font-semibold">Recall</h3>
                  </div>
                  <p className="text-indigo-50 text-sm">
                    Waves transfer energy and information without transferring
                    matter.
                  </p>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-indigo-400/50 flex items-center justify-center text-sm font-bold">
                      2
                    </div>
                    <h3 className="font-semibold">Describe</h3>
                  </div>
                  <p className="text-indigo-50 text-sm">
                    Evidence from water waves that the medium does not travel
                    with the wave.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                <HelpCircle className="text-indigo-500" />
                Key Vocabulary
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  {
                    term: "Wave",
                    def: "A disturbance that transfers energy and information from one location to another, not the physical matter of the medium.",
                  },
                  {
                    term: "Medium",
                    def: "The material or substance through which a wave travels, which oscillates in place rather than moving with the wave.",
                  },
                  {
                    term: "Oscillation",
                    def: "A repetitive back-and-forth motion about a central point, which serves as the mechanism for energy transfer.",
                  },
                  {
                    term: "Equilibrium",
                    def: "The original, undisturbed position of a medium's particles before and after a wave passes through them.",
                  },
                  {
                    term: "Displacement",
                    def: "The distance and direction an oscillating particle has moved from its equilibrium position.",
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/50 transition-colors group"
                  >
                    <h3 className="text-lg font-bold text-indigo-600 mb-2 group-hover:text-indigo-700">
                      {item.term}
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      {item.def}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setActiveSection("energy")}
                className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-medium transition-colors"
              >
                Next: Energy Transfer
                <ArrowRight size={18} />
              </button>
            </div>
          </motion.div>
        );
      case "energy":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="bg-slate-900 p-8 text-white">
                <h2 className="text-3xl font-bold mb-4">
                  Waves and Energy Transfer
                </h2>
                <p className="text-slate-300 text-lg max-w-3xl leading-relaxed">
                  A Wave is defined as a disturbance that transfers energy and
                  information from one location to another. Crucially, this
                  process does not involve the physical transport of the matter
                  that makes up the environment.
                </p>
              </div>

              <div className="p-8 bg-slate-50 border-t border-slate-100">
                <h3 className="text-xl font-bold text-slate-800 mb-4">
                  Key Points
                </h3>
                <ul className="space-y-3">
                  {[
                    "Energy and information move; matter stays local.",
                    "The Medium oscillates but does not experience net movement.",
                    'Equilibrium is the "zero" point for particle position.',
                    "Displacement is the momentary deviation from that zero point.",
                  ].map((point, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 text-slate-700"
                    >
                      <div className="mt-1 w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center flex-shrink-0">
                        <CheckCircle size={12} />
                      </div>
                      <span className="leading-relaxed">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <QuizSection
              title="Check Your Understanding: Energy Transfer"
              questions={[
                {
                  id: 1,
                  type: "recall",
                  question:
                    "What are waves primarily defined as mechanisms for, rather than matter transport?",
                  hint: "Think about what moves from one place to another when a wave passes.",
                  answerKeywords: ["energy", "information", "transfer"],
                  explanation:
                    "Waves are mechanisms for energy and information transfer.",
                },
                {
                  id: 2,
                  type: "recall",
                  question:
                    "What provides the physical path for a wave without traveling along with it?",
                  hint: "It starts with an M and is the substance the wave travels through.",
                  answerKeywords: ["medium"],
                  explanation:
                    "The medium provides the physical path but does not travel with the wave.",
                },
                {
                  id: 3,
                  type: "recall",
                  question:
                    "What term represents the rest state of the particles within the medium?",
                  hint: "It means a state of balance or rest.",
                  answerKeywords: ["equilibrium"],
                  explanation:
                    "Equilibrium represents the original, undisturbed position of a medium's particles.",
                },
                {
                  id: 4,
                  type: "connection",
                  question:
                    "Why must the particles return to their rest state for the wave to function as a non-matter transfer mechanism?",
                  hint: "If they didn't return, what would happen to the matter?",
                  answerKeywords: ["return", "matter", "move", "net", "stay"],
                  explanation:
                    "If particles did not return to their rest state, there would be a net movement of matter, which contradicts the definition of a wave transferring only energy.",
                },
              ]}
            />

            <div className="flex justify-between">
              <button
                onClick={() => setActiveSection("intro")}
                className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-medium transition-colors"
              >
                Back
              </button>
              <button
                onClick={() => setActiveSection("evidence")}
                className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-medium transition-colors"
              >
                Next: Evidence
                <ArrowRight size={18} />
              </button>
            </div>
          </motion.div>
        );
      case "evidence":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="bg-indigo-600 p-8 text-white">
                <h2 className="text-3xl font-bold mb-4">
                  Evidence for Non-Matter Transfer
                </h2>
                <p className="text-indigo-100 text-lg max-w-3xl leading-relaxed">
                  To prove that waves transfer energy without matter, we look at
                  the behavior of the Medium during the passage of a
                  disturbance.
                </p>
              </div>

              <div className="p-8 grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="p-6 rounded-2xl bg-blue-50 border border-blue-100">
                    <h3 className="text-xl font-bold text-blue-800 mb-3 flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center">
                        🌊
                      </div>
                      Water Waves
                    </h3>
                    <p className="text-blue-900 leading-relaxed">
                      Consider a leaf floating on a pond. When ripples spread
                      outward, the leaf moves up and down (vertical
                      Displacement) but does not travel outward with the ripple.
                      It stays in its original position.
                    </p>
                  </div>

                  <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-100">
                    <h3 className="text-xl font-bold text-emerald-800 mb-3 flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-emerald-200 flex items-center justify-center">
                        🔊
                      </div>
                      Sound Waves
                    </h3>
                    <p className="text-emerald-900 leading-relaxed">
                      When a drum is struck 20 meters away, you hear the sound
                      but don't feel a gust of wind. The air molecules simply
                      knock into each other, passing energy along through local
                      Oscillation.
                    </p>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 flex flex-col justify-center">
                  <h3 className="font-bold text-slate-800 mb-4">
                    Common Misconceptions
                  </h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-white rounded-xl border border-red-100 shadow-sm">
                      <div className="text-red-500 font-bold text-sm uppercase tracking-wider mb-1">
                        Myth
                      </div>
                      <p className="text-slate-700 font-medium mb-2">
                        Surfers are carried by the water molecules of the wave.
                      </p>
                      <div className="text-green-600 font-bold text-sm uppercase tracking-wider mb-1 mt-3">
                        Fact
                      </div>
                      <p className="text-slate-600 text-sm">
                        Surfers use the energy of the wave and gravity; the
                        water itself moves in a circular loop.
                      </p>
                    </div>
                    <div className="p-4 bg-white rounded-xl border border-red-100 shadow-sm">
                      <div className="text-red-500 font-bold text-sm uppercase tracking-wider mb-1">
                        Myth
                      </div>
                      <p className="text-slate-700 font-medium mb-2">
                        Sound is a wind that carries noise to our ears.
                      </p>
                      <div className="text-green-600 font-bold text-sm uppercase tracking-wider mb-1 mt-3">
                        Fact
                      </div>
                      <p className="text-slate-600 text-sm">
                        Sound is a pressure wave; air molecules vibrate in
                        place.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <QuizSection
              title="Check Your Understanding: Evidence"
              questions={[
                {
                  id: 1,
                  type: "recall",
                  question:
                    "How do objects floating on water waves behave as the energy passes them?",
                  hint: "Think about the leaf on the pond.",
                  answerKeywords: [
                    "up",
                    "down",
                    "bob",
                    "vertical",
                    "place",
                    "circular",
                  ],
                  explanation:
                    "They move up and down (or in circular paths) but stay in the same general area.",
                },
                {
                  id: 2,
                  type: "recall",
                  question:
                    "How far do air molecules travel when sound moves from a speaker to a listener?",
                  hint: "Do they travel the whole distance or just a little bit?",
                  answerKeywords: [
                    "little",
                    "fraction",
                    "millimeter",
                    "not far",
                    "don't travel",
                    "vibrate in place",
                  ],
                  explanation:
                    "They only travel a tiny fraction of a millimeter, vibrating in place.",
                },
                {
                  id: 3,
                  type: "recall",
                  question:
                    "What specific behavior of the medium confirms there is no net movement after a wave passes?",
                  hint: "What state do they return to?",
                  answerKeywords: ["return", "equilibrium", "rest", "original"],
                  explanation:
                    "The return to Equilibrium after a wave passes confirms no net movement.",
                },
              ]}
            />

            <div className="flex justify-between">
              <button
                onClick={() => setActiveSection("energy")}
                className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-medium transition-colors"
              >
                Back
              </button>
              <button
                onClick={() => setActiveSection("practice")}
                className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-medium transition-colors"
              >
                Next: Practice
                <ArrowRight size={18} />
              </button>
            </div>
          </motion.div>
        );
      case "practice":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            <FillGapActivity />

            <QuizSection
              title="Waves and Energy Transfer Practice"
              questions={[
                {
                  id: 1,
                  type: "connection",
                  question:
                    "A wave carries 100 Joules of energy across a 50-meter length of a copper rail. Once the energy has passed through the rail completely, what is the net distance in meters that the copper atoms have moved from their starting position?",
                  hint: "Remember the definition of net movement for a medium.",
                  answerKeywords: ["0", "zero", "none"],
                  explanation:
                    "0 meters. The atoms return to their equilibrium position after the wave passes.",
                },
                {
                  id: 2,
                  type: "connection",
                  question:
                    "How do we know that sound waves do not physically transport the air molecules from a speaker to a listener's ear?",
                  hint: "What would you feel if air molecules travelled 340 m/s towards you?",
                  answerKeywords: ["wind", "feel", "blow", "gust"],
                  explanation:
                    "If they did, we would feel a massive gust of wind every time a loud sound was made.",
                },
                {
                  id: 3,
                  type: "recall",
                  question:
                    "A technician is analyzing vibrations in a support beam. The beam particles move back and forth but stay in the same average location. What is the specific term for this repetitive back-and-forth motion about a central point?",
                  hint: "It starts with an O.",
                  answerKeywords: ["oscillation"],
                  explanation:
                    "Oscillation is the repetitive back-and-forth motion.",
                },
                {
                  id: 4,
                  type: "recall",
                  question:
                    "A particle in a mechanical system is disturbed by a passing wave, reaching a peak distance of 4mm away from its rest position. What is the technical term for this specific distance from the rest position?",
                  hint: "It starts with a D.",
                  answerKeywords: ["displacement"],
                  explanation:
                    "Displacement is the distance moved from the equilibrium position.",
                },
              ]}
            />

            <div className="flex justify-between">
              <button
                onClick={() => setActiveSection("evidence")}
                className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-medium transition-colors"
              >
                Back
              </button>
              <button
                onClick={() => setActiveSection("intro")}
                className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors"
              >
                Restart Lesson
                <RefreshCw size={18} />
              </button>
            </div>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">
              W
            </div>
            <span className="font-bold text-lg tracking-tight">
              Physics Interactive
            </span>
          </div>
          <div className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
            GCSE Science
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">
        {/* Sidebar Navigation */}
        <aside className="md:w-64 flex-shrink-0">
          <nav className="sticky top-24 space-y-2">
            {sections.map((section) => {
              const Icon = section.icon;
              const isActive = activeSection === section.id;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left font-medium transition-all ${
                    isActive
                      ? "bg-indigo-50 text-indigo-700 shadow-sm border border-indigo-100"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-transparent"
                  }`}
                >
                  <Icon
                    size={20}
                    className={isActive ? "text-indigo-600" : "text-slate-400"}
                  />
                  {section.title}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 min-w-0">
          <AnimatePresence mode="wait">{renderContent()}</AnimatePresence>
        </main>
      </div>
    </div>
  );
}
