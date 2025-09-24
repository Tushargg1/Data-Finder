import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const SunIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="1.5"></circle>
    <path d="M12 2V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
    <path d="M12 20V22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
    <path d="M4 12L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
    <path d="M22 12L20 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
    <path opacity="0.5" d="M19.7778 4.22266L17.5558 6.25424" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
    <path opacity="0.5" d="M4.22217 4.22266L6.44418 6.25424" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
    <path opacity="0.5" d="M6.44434 17.5557L4.22211 19.7779" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
    <path opacity="0.5" d="M19.7778 19.7773L17.5558 17.5551" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
  </svg>
);
const MoonIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
  </svg>
);
const FilterIcon = ({ theme }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={`h-12 w-12 ${theme === 'dark' ? 'text-amber-400' : 'text-blue-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L16 11.414V16a1 1 0 01-.293.707l-2 2A1 1 0 0113 18v-1.586l-3.707-3.707A1 1 0 019 12V6.414L3.293 4.707A1 1 0 013 4z" />
  </svg>
);
const TableIcon = ({ theme }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={`h-12 w-12 ${theme === 'dark' ? 'text-amber-400' : 'text-blue-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
);
const DownloadIcon = ({ theme }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={`h-12 w-12 ${theme === 'dark' ? 'text-amber-400' : 'text-blue-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
);

const Navbar = ({ theme, toggleTheme }) => (
  <nav className={`${theme === 'dark' ? 'bg-slate-900/70 border-slate-700/60' : 'bg-white/70 border-gray-200/60'} backdrop-blur-xl fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-6xl mx-auto z-50 rounded-xl shadow-lg`}>
    <div className="container mx-auto px-6 py-3">
      <div className="flex justify-between items-center">
        <div className={`text-2xl font-bold tracking-wider ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          DataFinder
        </div>
        <div className="flex items-center gap-4">
            <Link to="/filters" className={`hidden md:block font-bold px-6 py-2 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-px ${theme === 'dark' ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-900 hover:from-amber-600 hover:to-yellow-500' : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700'}`}>
                Get Started
            </Link>
            <button onClick={toggleTheme} className={`p-2 rounded-full transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-200 hover:bg-gray-300' : 'bg-slate-800 hover:bg-slate-700'}`}>
                {theme === 'dark' ? <SunIcon className="h-5 w-5 text-blue-600" /> : <MoonIcon className="h-5 w-5 text-amber-400" />}
            </button>
        </div>
      </div>
    </div>
  </nav>
);

const Front = () => {
  const [theme, setTheme] = useState('light'); 

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <div className={`${theme === 'dark' ? 'bg-slate-900 text-white' : 'bg-white text-gray-900'} min-h-screen font-sans transition-colors duration-500`}>
      <style>{`
        /* --- Dark Theme Styles --- */
        .hero-bg-dark {
          background-color: #0f172a;
          background-image: 
            radial-gradient(ellipse at center, rgba(251, 191, 36, 0.1) 0%, transparent 70%),
            url("data:image/svg+xml,%3Csvg width='20' height='12' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M10 12L0 2h2l8 8 8-8h2L10 12z' fill='%231e293b' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E");
        }
        .dark ::-webkit-scrollbar-thumb { background-color: #475569; border-color: #0f172a; }
        .dark ::-webkit-scrollbar-thumb:hover { background-color: #fbbf24; }
        .dark * { scrollbar-color: #475569 #0f172a; }
        
        /* --- Light Theme Styles --- */
        .hero-bg-light {
          background-color: #f8fafc;
          background-image: 
            radial-gradient(ellipse at center, rgba(59, 130, 246, 0.1) 0%, transparent 70%),
            url("data:image/svg+xml,%3Csvg width='20' height='12' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M10 12L0 2h2l8 8 8-8h2L10 12z' fill='%23e2e8f0' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E");
        }
        .light ::-webkit-scrollbar-thumb { background-color: #9ca3af; border-color: #f8fafc; }
        .light ::-webkit-scrollbar-thumb:hover { background-color: #3b82f6; }
        .light * { scrollbar-color: #9ca3af #f8fafc; }
        
        /* --- General Styles --- */
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .fade-in { animation: fadeIn 0.8s ease-out forwards; }
        .fade-in-delay-1 { animation-delay: 0.2s; }
        .fade-in-delay-2 { animation-delay: 0.4s; }
        ::-webkit-scrollbar { width: 12px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { border-radius: 10px; border: 3px solid; background-clip: content-box; }
        * { scrollbar-width: thin; }
      `}</style>
      
      <div className={theme}>
        <Navbar theme={theme} toggleTheme={toggleTheme} />

        <main className={`${theme === 'dark' ? 'hero-bg-dark' : 'hero-bg-light'} pt-32 pb-20 md:pt-48 md:pb-28 transition-colors duration-500`}>
          <div className="container mx-auto px-6 text-center">
            <h1 className={`text-4xl md:text-6xl font-extrabold leading-tight fade-in ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
              Find and Analyze Companies, <br className="hidden md:block" />
              <span className={`bg-gradient-to-r bg-clip-text text-transparent ${theme === 'dark' ? 'from-amber-500 to-yellow-400' : 'from-blue-600 to-indigo-600'}`}>Instantly</span>.
            </h1>
            <p className={`mt-6 text-lg md:text-xl max-w-3xl mx-auto fade-in fade-in-delay-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>
              Our powerful platform allows you to filter through a vast database of companies by city and industry. Get the data you need and export it with a single click.
            </p>
            <div className="mt-10 fade-in fade-in-delay-2">
              <Link to="/filters" className={`text-lg font-bold px-10 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl ${theme === 'dark' ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-900 hover:from-amber-600 hover:to-yellow-500' : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700'}`}>
                Start Searching Now
              </Link>
            </div>
          </div>
        </main>

        <section id="how-it-works" className={`py-24 ${theme === 'dark' ? 'bg-slate-800' : 'bg-white'} transition-colors duration-500`}>
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className={`text-3xl md:text-4xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>How It Works</h2>
              <p className={`text-lg mt-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Get your desired company data in three simple steps.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              {[
                { icon: <FilterIcon theme={theme} />, title: "1. Apply Filters", text: "Choose a city and company type to narrow down your search and find exactly what you're looking for." },
                { icon: <TableIcon theme={theme} />, title: "2. View Results", text: "Instantly see a clean, organized table of companies that match your criteria, complete with website links." },
                { icon: <DownloadIcon theme={theme} />, title: "3. Download Data", text: "Export the entire list of companies to an Excel file for your own records, analysis, or lead generation." }
              ].map((item, index) => (
                <div key={index} className={`${theme === 'dark' ? 'bg-slate-900 border-slate-700 hover:shadow-amber-500/10' : 'bg-gray-50 border-gray-200/80 hover:shadow-xl'} p-8 rounded-2xl shadow-lg transition-all duration-300 border transform hover:-translate-y-2`}>
                  <div className={`flex justify-center items-center h-20 w-20 mx-auto rounded-full mb-6 ring-8 ${theme === 'dark' ? 'bg-slate-800 ring-slate-800' : 'bg-blue-100 ring-white'}`}>
                    {item.icon}
                  </div>
                  <h3 className={`text-2xl font-semibold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>{item.title}</h3>
                  <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <footer className={`${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-gray-100 border-gray-200'} text-white py-12 border-t transition-colors duration-500`}>
          <div className="container mx-auto px-6 text-center">
            <p className={`${theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}`}>&copy; 2024 DataFinder. All Rights Reserved.</p>
            <div className="flex justify-center space-x-6 mt-4">
              <Link to="/privacy" className={`${theme === 'dark' ? 'text-gray-500 hover:text-amber-400' : 'text-gray-600 hover:text-blue-600'} transition-colors`}>Privacy Policy</Link>
              <Link to="/terms" className={`${theme === 'dark' ? 'text-gray-500 hover:text-amber-400' : 'text-gray-600 hover:text-blue-600'} transition-colors`}>Terms of Service</Link>
              <Link to="/contact" className={`${theme === 'dark' ? 'text-gray-500 hover:text-amber-400' : 'text-gray-600 hover:text-blue-600'} transition-colors`}>Contact</Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Front;
