import React, { useState, useEffect, useMemo } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useDictionary, DictionaryEntry } from '../hooks/useDictionary';

const DictionaryPage: React.FC = () => {
  const { db, loading, error, search, getTotalCount } = useDictionary();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEntry, setSelectedEntry] = useState<DictionaryEntry | null>(null);
  const [sortBy, setSortBy] = useState<'frequency' | 'pinyin'>('frequency');
  const [currentPage, setCurrentPage] = useState(0);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

  // Detect screen size
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const itemsPerPage = isDesktop ? 20 : 5;

  // Search results dengan pagination
  const { results, totalCount } = useMemo(() => {
    if (!db) return { results: [], totalCount: 0 };

    const totalCount = getTotalCount(searchQuery);
    const offset = currentPage * itemsPerPage;

    const results = search(searchQuery, { limit: itemsPerPage, offset, sortBy });

    return { results, totalCount };
  }, [db, searchQuery, sortBy, currentPage, itemsPerPage, search, getTotalCount]);

  // Reset page saat search berubah
  useEffect(() => {
    setCurrentPage(0);
  }, [searchQuery, sortBy]);

  // Clear selection saat search berubah
  useEffect(() => {
    if (selectedEntry && !results.find((e: DictionaryEntry) => e.id === selectedEntry.id)) {
      setSelectedEntry(null);
    }
  }, [results, selectedEntry]);

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />

      {/* Header */}
      <div className="bg-gradient-to-r from-rose-400 to-rose-300 pt-8 pb-8 px-6 shadow-lg">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-2">📖 Chinese Dictionary</h1>
          <p className="text-rose-50">
            Explore and learn {totalCount.toLocaleString()} Chinese characters completely
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10">
        <h3>The future cannot be predicted, but the future can be created</h3>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-2xl text-red-700">
            <p className="font-semibold">⚠️ Error</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        )}

        {/* Search Section */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search character, pinyin, or meaning..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-6 py-4 rounded-full border-2 border-rose-200 focus:border-rose-400 focus:outline-none text-lg font-medium placeholder-gray-400"
            />
            <span className="absolute right-6 top-1/2 transform -translate-y-1/2 text-2xl">🔍</span>
          </div>

          {/* Sort & Filter Options */}
          <div className="flex gap-4">
            <button
              onClick={() => setSortBy('frequency')}
              className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${sortBy === 'frequency'
                ? 'bg-rose-400 text-black shadow-lg'
                : 'bg-rose-100 text-rose-700 hover:shadow-md'
                }`}
            >
              📊 Popular
            </button>
            <button
              onClick={() => setSortBy('pinyin')}
              className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${sortBy === 'pinyin'
                ? 'bg-rose-400 text-black shadow-lg'
                : 'bg-rose-100 text-rose-700 hover:shadow-md'
                }`}
            >
              🔤 Alphabet
            </button>
          </div>

          {/* Results Count */}
          <p className="text-sm text-gray-600">
            {loading ? (
              <span>Loading...</span>
            ) : (
              <>
                Found <span className="font-bold text-rose-600">{totalCount}</span> characters (Page {currentPage + 1} of {Math.ceil(totalCount / itemsPerPage)})
              </>
            )}
          </p>

          {/* Pagination */}
          {totalCount > itemsPerPage && (
            <div className="flex items-center justify-center gap-2 mt-4">
              <button
                onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                disabled={currentPage === 0}
                className="px-4 py-2 rounded-full bg-rose-100 text-rose-700 font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-md transition-all"
              >
                ← Previous
              </button>
              <span className="text-sm font-semibold text-gray-600 px-2">
                Page {currentPage + 1}
              </span>
              <button
                onClick={() => setCurrentPage(prev => prev + 1)}
                disabled={currentPage >= Math.ceil(totalCount / itemsPerPage) - 1}
                className="px-4 py-2 rounded-full bg-rose-100 text-rose-700 font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-md transition-all"
              >
                Next →
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Dictionary List */}
          <div className="lg:col-span-2">
            <div className="space-y-3">
              {loading ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 text-lg">Loading data...</p>
                </div>
              ) : results.length > 0 ? (
                results.map((entry: DictionaryEntry) => (
                  <div
                    key={entry.id}
                    onClick={() => setSelectedEntry(entry)}
                    className={`p-5 rounded-2xl cursor-pointer transition-all duration-300 border-2 ${selectedEntry?.id === entry.id
                      ? 'border-rose-400 bg-rose-50 shadow-lg'
                      : 'border-rose-100 bg-white hover:border-rose-300 hover:shadow-md'
                      }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-4">
                          <div className="text-5xl font-serif text-rose-500">
                            {entry.simplified}
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">
                              {entry.traditional !== entry.simplified && (
                                <span className="mr-2">Trad: {entry.traditional}</span>
                              )}
                              <span className="font-semibold text-rose-600">{entry.pinyin}</span>
                            </p>
                            <p className="font-semibold text-gray-800">{entry.meaning}</p>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-500">Frequency</div>
                        <div className="text-2xl font-bold text-lavender-500">
                          {entry.frequency}%
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 text-lg">No matching results found 😢</p>
                </div>
              )}
            </div>

            {/* Bottom Pagination */}
            {totalCount > itemsPerPage && (
              <div className="flex items-center justify-center gap-2 mt-6">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                  disabled={currentPage === 0}
                  className="px-4 py-2 rounded-full bg-rose-100 text-rose-700 font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-md transition-all"
                >
                  ← Previous
                </button>
                <span className="text-sm font-semibold text-gray-600 px-2">
                  Page {currentPage + 1} of {Math.ceil(totalCount / itemsPerPage)}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  disabled={currentPage >= Math.ceil(totalCount / itemsPerPage) - 1}
                  className="px-4 py-2 rounded-full bg-rose-100 text-rose-700 font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-md transition-all"
                >
                  Next →
                </button>
              </div>
            )}
          </div>

          {/* Detail Panel */}
          <div className="lg:col-span-1">
            {selectedEntry ? (
              <div className="sticky top-20 bg-white rounded-3xl shadow-xl p-8 space-y-6">
                {/* Character Display */}
                <div className="text-center space-y-2">
                  <div className="text-7xl font-serif text-rose-500">
                    {selectedEntry.simplified}
                  </div>
                  {selectedEntry.traditional !== selectedEntry.simplified && (
                    <div className="text-2xl text-gray-400">
                      Traditional: {selectedEntry.traditional}
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="space-y-4">
                  {/* Pinyin */}
                  <div className="bg-rose-50 rounded-2xl p-4 text-center">
                    <p className="text-sm text-gray-600 mb-1">Pinyin</p>
                    <p className="text-2xl font-bold text-rose-600">
                      {selectedEntry.pinyin}
                    </p>
                  </div>

                  {/* Meaning */}
                  <div className="bg-lavender-50 rounded-2xl p-4">
                    <p className="text-sm text-gray-600 mb-2">Meaning</p>
                    <p className="text-lg font-bold text-lavender-700">
                      {selectedEntry.meaning}
                    </p>
                  </div>

                  {/* Frequency */}
                  <div className="bg-mint-50 rounded-2xl p-4">
                    <p className="text-sm text-gray-600 mb-2">Usage Level</p>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-3 bg-mint-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-mint-400 to-mint-500"
                          style={{ width: `${selectedEntry.frequency}%` }}
                        />
                      </div>
                      <span className="font-bold text-mint-600">
                        {selectedEntry.frequency}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3 pt-4 border-t-2 border-gray-100">
                  <button className="w-full px-4 py-3 rounded-full bg-gradient-to-r from-rose-400 to-rose-500 text-black font-bold hover:shadow-lg transition-all duration-300">
                    ♥️ Save
                  </button>
                  <button className="w-full px-4 py-3 rounded-full bg-lavender-100 text-lavender-700 font-bold hover:shadow-lg transition-all duration-300">
                    🔊 Listen
                  </button>
                </div>
              </div>
            ) : (
              <div className="sticky top-20 bg-gradient-to-b from-rose-50 to-lavender-50 rounded-3xl shadow-lg p-8 text-center">
                <p className="text-5xl mb-4">👈</p>
                <p className="text-gray-600 font-medium">
                  Select a character from the list to view details
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default DictionaryPage;
