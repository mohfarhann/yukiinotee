import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

interface Character {
  id: number;
  simplified: string;
  traditional: string;
  pinyin: string;
  meaning: string;
  example: string;
  exampleMeaning: string;
}

const LearningPage: React.FC = () => {
  const { courseId, lessonId } = useParams<{ courseId?: string; lessonId?: string }>();
  const [currentCharacter, setCurrentCharacter] = useState<number>(0);
  const [showPinyin, setShowPinyin] = useState<boolean>(false);
  const [showMeaning, setShowMeaning] = useState<boolean>(false);

  // Sample data dari database (akan di-replace dengan data asli dari sqlite)
  const characters: Character[] = [
    {
      id: 1,
      simplified: '你',
      traditional: '你',
      pinyin: 'nǐ',
      meaning: 'You',
      example: '你好',
      exampleMeaning: 'Hello'
    },
    {
      id: 2,
      simplified: '好',
      traditional: '好',
      pinyin: 'hǎo',
      meaning: 'Good',
      example: '很好',
      exampleMeaning: 'Very good'
    },
    {
      id: 3,
      simplified: '名',
      traditional: '名',
      pinyin: 'míng',
      meaning: 'Name / Famous',
      example: '名字',
      exampleMeaning: 'Name'
    },
    {
      id: 4,
      simplified: '字',
      traditional: '字',
      pinyin: 'zì',
      meaning: 'Character / Letter',
      example: '名字',
      exampleMeaning: 'Name'
    },
  ];

  const character = characters[currentCharacter];

  const handleNext = () => {
    if (currentCharacter < characters.length - 1) {
      setCurrentCharacter(currentCharacter + 1);
      setShowPinyin(false);
      setShowMeaning(false);
    }
  };

  const handlePrev = () => {
    if (currentCharacter > 0) {
      setCurrentCharacter(currentCharacter - 1);
      setShowPinyin(false);
      setShowMeaning(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />

      {/* Header */}
      <div className="bg-gradient-to-r from-rose-300 to-rose-200 pt-8 pb-8 px-6 shadow-lg">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link to="/dashboard" className="text-rose-600 font-bold hover:text-rose-700 transition-all duration-300">
            ← Back
          </Link>
          <h1 className="text-3xl font-bold text-text-soft">📚 學習生字 (Learn Characters)</h1>
          <div className="text-sm text-text-soft font-semibold">
            {currentCharacter + 1} / {characters.length}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-6 py-10">

        {/* Character Card */}
        <div className="bg-white rounded-3xl shadow-xl p-12 mb-8 text-center">
          {/* Main Character Display */}
          <div className="text-8xl font-bold text-rose-500 mb-6 font-serif">
            {character.traditional}
          </div>

          {/* Pinyin */}
          <div className="mb-6">
            <button
              onClick={() => setShowPinyin(!showPinyin)}
              className="px-6 py-2 rounded-full bg-rose-100 text-rose-700 font-semibold hover:shadow-lg transition-all duration-300"
            >
              {showPinyin ? `📖 ${character.pinyin}` : 'Show Pinyin'}
            </button>
          </div>

          {/* Meaning */}
          <div className="mb-8">
            <button
              onClick={() => setShowMeaning(!showMeaning)}
              className="px-6 py-2 rounded-full bg-peach-100 text-orange-700 font-semibold hover:shadow-lg transition-all duration-300"
            >
              {showMeaning ? `Meaning: ${character.meaning}` : 'Show Meaning'}
            </button>
          </div>

          {/* Example */}
          <div className="bg-gradient-to-r from-lavender-100 to-lavender-200 rounded-2xl p-6 mb-6">
            <p className="text-sm text-purple-700 font-medium mb-2">Example Usage:</p>
            <p className="text-4xl text-purple-700 font-bold mb-3">{character.example}</p>
            <p className="text-sm text-purple-700">{character.exampleMeaning}</p>
          </div>

          {/* Stroke Info */}
          <div className="bg-mint-100 rounded-2xl p-4">
            <p className="text-sm text-teal-700 font-medium">
              💡 Tip: Learn character strokes from left to right, top to bottom
            </p>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between gap-4 mb-8">
          <button
            onClick={handlePrev}
            disabled={currentCharacter === 0}
            className="px-6 py-3 rounded-full bg-rose-400 text-black font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← Previous
          </button>

          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-rose-400 to-rose-500 transition-all duration-500"
              style={{ width: `${((currentCharacter + 1) / characters.length) * 100}%` }}
            />
          </div>

          <button
            onClick={handleNext}
            disabled={currentCharacter === characters.length - 1}
            className="px-6 py-3 rounded-full bg-rose-400 text-black font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next →
          </button>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4 mb-12">
          <button className="px-6 py-3 rounded-full font-semibold text-black bg-gradient-to-r from-rose-300 to-rose-400 hover:shadow-lg transition-all duration-300">
            🔊 Listen
          </button>
          <button className="px-6 py-3 rounded-full font-semibold text-black bg-gradient-to-r from-lavender-400 to-lavender-500 hover:shadow-lg transition-all duration-300">
            ❤️ Save
          </button>
        </div>

        {/* Quiz Button */}
        <Link
          to="/quiz"
          className="block text-center px-8 py-4 rounded-full font-bold text-black text-lg bg-gradient-to-r from-rose-400 to-rose-500 hover:shadow-lg transition-all duration-300"
        >
          ✨ Start Quiz
        </Link>
      </div>

      <Footer />
    </div>
  );
};

export default LearningPage;
