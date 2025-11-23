import React from 'react';
import { Link } from 'react-router-dom'; // --- IMPORT LINK ---
import { 
  FaWind, 
  FaBrain, 
  FaMusic, 
  FaLeaf, 
  FaRunning, 
  FaSmileBeam 
} from 'react-icons/fa';

// --- UPDATE THE TOOLS ARRAY WITH PATHS ---
const tools = [
  { 
    title: '4-7-8 Breathing', 
    desc: 'A calming breathing technique to reduce anxiety and promote relaxation', 
    icon: FaWind,
    color: 'blue',
    path: '/coping-tools/breathing' // --- ADDED PATH ---
  },
  { 
    title: 'Guided Meditation', 
    desc: '5-minute mindfulness meditation for stress relief', 
    icon: FaBrain,
    color: 'purple',
    path: '/coping-tools/meditation' // Placeholder, add real path later
  },
  { 
    title: 'Mood Music', 
    desc: 'Curated playlists designed to uplift your spirits', 
    icon: FaMusic,
    color: 'orange',
    path: '/coping-tools/music' // Placeholder
  },
  { 
    title: 'Grounding Exercise', 
    desc: '5-4-3-2-1 technique to reconnect with the present moment', 
    icon: FaLeaf,
    color: 'green',
    path: '/coping-tools/grounding' // Placeholder
  },
  { 
    title: 'Progressive Relaxation', 
    desc: 'Systematic muscle relaxation to release physical tension', 
    icon: FaRunning,
    color: 'indigo',
    path: '/coping-tools/relaxation' // Placeholder
  },
  { 
    title: 'Positive Affirmations', 
    desc: 'Daily affirmations to boost self-confidence and positivity', 
    icon: FaSmileBeam,
    color: 'yellow',
    path: '/coping-tools/affirmations' // Placeholder
  },
];

const tips = [
  { 
    title: 'When Feeling Overwhelmed', 
    text: 'Take 5 deep breaths, name 3 things you can see, 2 you can hear, and 1 you can touch.',
    color: 'blue'
  },
  { 
    title: 'When Feeling Down', 
    text: 'Reach out to someone you trust, take a short walk, or listen to uplifting music.',
    color: 'purple'
  },
  { 
    title: 'During Anxiety', 
    text: 'Remember: This feeling is temporary. You are safe. You have overcome anxiety before.',
    color: 'yellow'
  },
  { 
    title: 'For Better Sleep', 
    text: 'Create a bedtime routine, avoid screens 1 hour before bed, and practice gratitude.',
    color: 'indigo'
  },
];

const colorClasses = {
  blue: { bg: 'bg-blue-100', text: 'text-blue-600', button: 'from-blue-500 to-cyan-400' },
  purple: { bg: 'bg-purple-100', text: 'text-purple-600', button: 'from-purple-500 to-pink-500' },
  orange: { bg: 'bg-orange-100', text: 'text-orange-600', button: 'from-orange-500 to-red-500' },
  green: { bg: 'bg-green-100', text: 'text-green-600', button: 'from-green-500 to-teal-400' },
  indigo: { bg: 'bg-indigo-100', text: 'text-indigo-600', button: 'from-indigo-500 to-violet-500' },
  yellow: { bg: 'bg-yellow-100', text: 'text-yellow-600', button: 'from-yellow-500 to-amber-400' },
}

const CopingToolsPage = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Coping Tools</h1>
        <p className="text-gray-600">Techniques to help you manage stress and anxiety</p>
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool) => {
          const colors = colorClasses[tool.color];
          return (
            <div key={tool.title} className="bg-white p-6 rounded-lg shadow-md flex flex-col justify-between">
              <div>
                <div className={`p-3 rounded-full inline-block ${colors.bg}`}>
                  <tool.icon className={`text-3xl ${colors.text}`} />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mt-4">{tool.title}</h3>
                <p className="text-gray-600 text-sm mt-1">{tool.desc}</p>
              </div>
              
              {/* --- WRAP THE BUTTON IN A LINK --- */}
              <Link to={tool.path} className="mt-6">
                <button 
                  className={`w-full py-2 px-4 rounded-lg text-white font-semibold bg-linear-to-r ${colors.button} shadow-md`}
                >
                  Start
                </button>
              </Link>
              {/* --- END LINK WRAPPER --- */}
            </div>
          )
        })}
      </div>

      {/* Quick Tips */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Quick Coping Tips</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tips.map(tip => {
            const colors = colorClasses[tip.color];
            return (
              <div key={tip.title} className={`p-4 rounded-lg ${colors.bg} border border-l-4 ${colors.text.replace('text-', 'border-')}-400`}>
                <h4 className={`font-bold ${colors.text}`}>{tip.title}</h4>
                <p className={`text-sm ${colors.text.replace('600', '700')} opacity-90`}>{tip.text}</p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  );
};

export default CopingToolsPage;