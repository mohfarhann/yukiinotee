import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useDictionary } from '../hooks/useDictionary';
import { generateGeminiQuiz, AIQuizResponse } from '../services/gemini';

const QuizPage: React.FC = () => {
  const { saveQuizQuestions, loading: dbLoading } = useDictionary();

  // Setup State
  const [theme, setTheme] = useState('');
  const [questionCount, setQuestionCount] = useState(5);
  const [questions, setQuestions] = useState<AIQuizResponse[]>([]);
  const [generated, setGenerated] = useState(false);
  const [loadingAI, setLoadingAI] = useState(false);

  // Quiz State
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: string }>({}); // Maps index -> 'a'|'b'..
  const [feedback, setFeedback] = useState<{ [key: number]: 'correct' | 'wrong' }>({});
  const [saved, setSaved] = useState(false);

  const handleGenerate = async () => {
    if (!theme) {
      alert("Please enter a theme!");
      return;
    }

    setLoadingAI(true);
    try {
      const quiz = await generateGeminiQuiz(theme, questionCount);
      if (quiz.length === 0) {
        alert("Failed to generate questions. Please try again or check your connection.");
        setLoadingAI(false);
        return;
      }
      setQuestions(quiz);
      setGenerated(true);
      setUserAnswers({});
      setFeedback({});
      setSaved(false);
    } catch (e) {
      alert("Error generating quiz.");
    } finally {
      setLoadingAI(false);
    }
  };

  const handleAnswer = (index: number, selectedKey: string, correctKey: string) => {
    if (userAnswers[index]) return; // Prevent changing answer

    const isCorrect = selectedKey === correctKey;
    setUserAnswers(prev => ({ ...prev, [index]: selectedKey }));
    setFeedback(prev => ({ ...prev, [index]: isCorrect ? 'correct' : 'wrong' }));
  };

  const calculateScore = () => {
    let score = 0;
    questions.forEach((q, idx) => {
      if (feedback[idx] === 'correct') score++;
    });
    return score;
  };

  const handleSave = () => {
    saveQuizQuestions(questions);
    setSaved(true);
    alert("Questions saved to repository successfully!");
  };

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />

      <div className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold text-rose-600 mb-8 text-center">📝 AI Quiz Practice</h1>

        {/* Setup Section */}
        {!generated ? (
          <div className="bg-white rounded-3xl shadow-lg p-8 space-y-6 max-w-xl mx-auto">
            <div className="space-y-2">
              <label className="font-bold text-gray-700">Topic / Summary</label>
              <textarea
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                placeholder="Enter topic or summary text for quiz material..."
                className="w-full px-4 py-3 rounded-xl border-2 border-rose-100 focus:border-rose-400 focus:outline-none h-32"
              />
            </div>

            <div className="space-y-2">
              <label className="font-bold text-gray-700">Number of Questions</label>
              <input
                type="number"
                min="1"
                max="20"
                value={questionCount}
                onChange={(e) => setQuestionCount(parseInt(e.target.value))}
                className="w-full px-4 py-3 rounded-xl border-2 border-rose-100 focus:border-rose-400 focus:outline-none"
              />
            </div>

            <button
              onClick={handleGenerate}
              disabled={loadingAI || dbLoading}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-rose-400 to-rose-500 text-white font-bold text-lg hover:shadow-lg transition-all disabled:opacity-50 flex justify-center items-center gap-2"
            >
              {loadingAI ? (
                <>
                  <span className="animate-spin">🔄</span> Generating with AI...
                </>
              ) : (
                '✨ Generate Quiz!'
              )}
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm">
              <button
                onClick={() => setGenerated(false)}
                className="text-gray-500 hover:text-rose-500 font-semibold"
              >
                ← Change Topic
              </button>
              <div className="text-xl font-bold text-rose-600 truncate max-w-md">
                Theme: {theme}
              </div>
            </div>

            {/* Questions List */}
            <div className="space-y-6">
              {questions.map((q, index) => {
                const status = feedback[index];
                const isAnswered = !!userAnswers[index];

                return (
                  <div
                    key={index}
                    className={`p-6 rounded-3xl border-2 transition-all duration-500 ${status === 'correct' ? 'bg-green-50 border-green-400' :
                      status === 'wrong' ? 'bg-red-50 border-red-400' :
                        'bg-white border-rose-100'
                      }`}
                  >
                    <div className="mb-4">
                      <span className="inline-block px-3 py-1 rounded-full bg-rose-100 text-rose-600 text-sm font-bold mb-2">
                        Question {index + 1}
                      </span>
                      <h3 className="text-xl font-bold text-gray-800">
                        {q.question}
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                      {Object.entries(q.options).map(([key, value]) => (
                        <label
                          key={key}
                          className={`
                            relative flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all
                            ${userAnswers[index] === key
                              ? (status === 'correct' ? 'border-green-500 bg-green-100' : 'border-red-500 bg-red-100')
                              : 'border-gray-100 hover:border-rose-200 bg-white'
                            }
                            ${isAnswered ? 'cursor-default' : 'hover:shadow-md'}
                          `}
                        >
                          <input
                            type="radio"
                            name={`question-${index}`}
                            value={key}
                            disabled={isAnswered}
                            onChange={() => handleAnswer(index, key, q.answer)}
                            className="w-5 h-5 text-rose-500 focus:ring-rose-400 mr-3"
                          />
                          <span className="font-medium text-gray-700 flex-1">
                            <span className="font-bold mr-2 uppercase">{key}.</span> {value}
                          </span>
                        </label>
                      ))}
                    </div>

                    {/* Explanation Div */}
                    {isAnswered && (
                      <div className={`
                        mt-4 p-4 rounded-xl text-sm font-medium animate-fade-in
                        ${status === 'correct' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                      `}>
                        <p className="font-bold mb-1">
                          {status === 'correct' ? '✅ Correct! 🎉' : '❌ Incorrect'}
                        </p>
                        <p>{q.explanation}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Save Button */}
            <div className="sticky bottom-8 bg-white/80 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-rose-100 flex justify-between items-center">
              <div className="text-lg font-bold text-gray-700">
                Score: <span className="text-rose-600 text-2xl">{calculateScore()}</span> / {questions.length}
              </div>
              <button
                onClick={handleSave}
                disabled={saved}
                className="px-8 py-3 rounded-full bg-rose-500 text-white font-bold hover:bg-rose-600 disabled:bg-gray-400 disabled:cursor-not-allowed shadow-lg transition-all"
              >
                {saved ? 'Saved ✅' : '💾 Save Questions'}
              </button>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default QuizPage;
