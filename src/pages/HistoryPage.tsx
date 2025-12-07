import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';

import { useDictionary, SavedQuestion } from '../hooks/useDictionary';

const HistoryPage: React.FC = () => {
  const { getSavedQuestions, loading: dbLoading } = useDictionary();
  const [questions, setQuestions] = useState<SavedQuestion[]>([]);

  // Modal State
  const [selectedQuestion, setSelectedQuestion] = useState<SavedQuestion | null>(null);

  useEffect(() => {
    if (!dbLoading) {
      setQuestions(getSavedQuestions());
    }
  }, [dbLoading, getSavedQuestions]);

  const formatDate = (isoString?: string) => {
    if (!isoString) return '';
    return new Date(isoString).toLocaleDateString() + ' ' + new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Layout>

      <div className="max-w-5xl mx-auto px-6 pt-10 pb-24">
        <h1 className="text-3xl font-bold text-rose-600 mb-8 text-center">📜 Saved Questions Bank</h1>

        {dbLoading ? (
          <p className="text-center text-gray-500">Loading database...</p>
        ) : questions.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-3xl shadow-lg border border-rose-100">
            <p className="text-2xl mb-2">📭</p>
            <p className="text-gray-600">No saved questions yet.</p>
            <a href="/quiz" className="inline-block mt-4 px-6 py-2 rounded-full bg-rose-500 text-white font-bold hover:shadow-lg transition-all">
              Create New Quiz
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {questions.map((q) => (
              <button
                key={q.question_id}
                onClick={() => setSelectedQuestion(q)}
                className="text-left bg-white p-6 rounded-2xl shadow-sm border border-rose-100 hover:shadow-md hover:border-rose-300 transition-all group h-full flex flex-col justify-between"
              >
                <div>
                  {q.created_at && (
                    <span className="text-xs font-semibold text-rose-400 bg-rose-50 px-2 py-1 rounded-md mb-2 inline-block">
                      {formatDate(q.created_at)}
                    </span>
                  )}
                  <h3 className="font-bold text-gray-800 group-hover:text-rose-600 line-clamp-3 mb-2">
                    {q.question_text}
                  </h3>
                </div>
                <div className="text-sm text-gray-400 font-medium">
                  Click to view details →
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedQuestion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-scale-up">
            <div className="sticky top-0 bg-white border-b border-gray-100 p-6 flex justify-between items-center z-10">
              <div>
                <span className="text-sm font-bold text-rose-500">Selected Question</span>
                {selectedQuestion.created_at && (
                  <p className="text-xs text-gray-400">{formatDate(selectedQuestion.created_at)}</p>
                )}
              </div>
              <button
                onClick={() => setSelectedQuestion(null)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 font-bold transition-all"
              >
                ✕
              </button>
            </div>

            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">{selectedQuestion.question_text}</h2>

              <div className="grid grid-cols-1 gap-3 mb-6">
                {['a', 'b', 'c', 'd'].map((key) => {
                  // @ts-ignore
                  const optionText = selectedQuestion[`option_${key}`];
                  if (!optionText) return null;
                  const isCorrect = selectedQuestion.correct_answer_key.toLowerCase() === key;

                  return (
                    <div
                      key={key}
                      className={`p-4 rounded-xl border-2 flex items-center ${isCorrect
                        ? 'bg-green-50 border-green-500'
                        : 'bg-white border-gray-100'
                        }`}
                    >
                      <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold mr-3 ${isCorrect ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-500'
                        }`}>
                        {key.toUpperCase()}
                      </span>
                      <span className={`font-medium ${isCorrect ? 'text-green-800' : 'text-gray-700'}`}>
                        {optionText}
                      </span>
                      {isCorrect && <span className="ml-auto text-green-600 font-bold">✓ Correct Answer</span>}
                    </div>
                  );
                })}
              </div>

              <div className="bg-rose-50 p-6 rounded-2xl border border-rose-100">
                <h4 className="font-bold text-rose-600 mb-2 flex items-center gap-2">
                  <span>💡</span> Explanation
                </h4>
                <p className="text-gray-700 leading-relaxed">
                  {selectedQuestion.explanation}
                </p>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50 rounded-b-3xl flex justify-end">
              <button
                onClick={() => setSelectedQuestion(null)}
                className="px-6 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}


    </Layout>
  );
};

export default HistoryPage;
