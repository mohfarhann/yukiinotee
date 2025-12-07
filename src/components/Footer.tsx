import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-rose-400 text-white mt-12 py-8">
      <div className="max-w-4xl mx-auto px-6">
        <div className="grid grid-cols-3 gap-8 mb-8">
          <div>
            <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
              <span className="text-2xl">🌸</span>
              Yuki Dictionary
            </h4>
            <p className="text-rose-50 opacity-90">
              Interactive Mandarin digital dictionary with CC-CEDICT database
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-4">功能 (Features)</h4>
            <ul className="space-y-2 text-rose-50 opacity-90">
              <li><a href="/" className="hover:text-white transition-all duration-300">字典 (Dictionary)</a></li>
              <li><a href="#" className="hover:text-white transition-all duration-300">發音 (Pronunciation)</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">關於 (About)</h4>
            <ul className="space-y-2 text-rose-50 opacity-90">
              <li><a href="#" className="hover:text-white transition-all duration-300">Data: CC-CEDICT</a></li>
              <li><a href="#" className="hover:text-white transition-all duration-300">繁體中文支援 (Traditional)</a></li>
              <li><a href="#" className="hover:text-white transition-all duration-300">簡體中文支援 (Simplified)</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-rose-300 pt-6 text-center text-rose-50 opacity-75">
          <p>&copy; 2025 Yuki Dictionary. All rights reserved. | 來學習中文吧！</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
