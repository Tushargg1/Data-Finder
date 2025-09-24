import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';

// --- Theme and Feature Icons ---
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

// --- Enhanced Navbar ---
const Navbar = ({ theme, toggleTheme }) => (
  <nav className={`${theme === 'dark' ? 'bg-slate-900/70 border-slate-700/60' : 'bg-white/70 border-gray-200/60'} backdrop-blur-xl fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-6xl mx-auto z-50 rounded-xl shadow-lg`}>
    <div className="container mx-auto px-6 py-3">
      <div className="flex justify-between items-center">
        <div className="flex-1 flex justify-start items-center space-x-8">
          <Link to="/" className={`${theme === 'dark' ? 'text-gray-300 hover:text-amber-400' : 'text-gray-700 hover:text-blue-600'} font-medium transition-colors duration-300`}>Home</Link>
          <Link to="/filters" className={`${theme === 'dark' ? 'text-gray-300 hover:text-amber-400' : 'text-gray-700 hover:text-blue-600'} font-medium transition-colors duration-300`}>Filters</Link>
        </div>
        <div className="flex-1 flex justify-center">
            <h2 className={`text-2xl font-bold tracking-tight whitespace-nowrap font-poppins ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Company Results
            </h2>
        </div>
        <div className="flex-1 flex justify-end items-center gap-4">
            <button onClick={toggleTheme} className={`p-2 rounded-full transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-200 hover:bg-gray-300' : 'bg-slate-800 hover:bg-slate-700'}`}>
                {theme === 'dark' ? <SunIcon className="h-5 w-5 text-blue-600" /> : <MoonIcon className="h-5 w-5 text-amber-400" />}
            </button>
        </div>
      </div>
    </div>
  </nav>
);

// Helper function to get filter parameters
const getFilterParams = (location) => {
    if (location.state) {
        sessionStorage.setItem('tableParams', JSON.stringify(location.state));
        return location.state;
    }
    const storedParams = sessionStorage.getItem('tableParams');
    if (storedParams) {
        return JSON.parse(storedParams);
    }
    return null;
}


const TablePage = () => {
  const [theme, setTheme] = useState('light');
  const location = useLocation();
  
  const filterParams = getFilterParams(location);
  const { city, company_type, count } = filterParams || {};
  
  const [companyData, setCompanyData] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- PAGINATION STATE ---
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // You can make this dynamic if you want

  useEffect(() => {
    const currentParams = { city, company_type, count };
    const cachedParams = JSON.parse(sessionStorage.getItem('tableParams'));
    const cachedData = JSON.parse(sessionStorage.getItem('companyData'));

    if (cachedData && JSON.stringify(currentParams) === JSON.stringify(cachedParams)) {
        setCompanyData(cachedData);
        setLoading(false);
        return;
    }

    if (city && company_type && count) {
      fetch(`http://localhost:8080/companies?city=${city}&industry=${company_type}&count=${count}`)
        .then((res) => res.json())
        .then((data) => {
          setCompanyData(data);
          sessionStorage.setItem('companyData', JSON.stringify(data));
          setCurrentPage(1); // Reset to first page on new data
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching company data:", err);
          setLoading(false);
        });
    } else {
        setLoading(false);
    }
  }, [city, company_type, count]);

  const handleDownloadExcel = async () => {
    try {
      const url = `http://localhost:8080/export-excel?count=${count}&industry=${encodeURIComponent(company_type)}&city=${encodeURIComponent(city)}`;
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.setAttribute("download", `${count}_${company_type}_companies_in_${city}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  const getBadgeClass = (remark) => {
    const baseClasses = "badge text-xs font-semibold px-2 py-1 h-auto";
    const themeClasses = theme === 'dark' 
        ? 'text-slate-900' 
        : 'text-white';

    switch (remark) {
      case "Active":
        return `${baseClasses} ${theme === 'dark' ? 'bg-green-400' : 'bg-green-500'} ${themeClasses}`;
      case "Closed":
        return `${baseClasses} ${theme === 'dark' ? 'bg-red-400' : 'bg-red-500'} ${themeClasses}`;
      case "Website not working":
      case "HQ not in city":
        return `${baseClasses} ${theme === 'dark' ? 'bg-yellow-400' : 'bg-yellow-500'} ${themeClasses}`;
      default:
        return `${baseClasses} ${theme === 'dark' ? 'bg-slate-600 text-slate-200' : 'bg-gray-300 text-gray-700'}`;
    }
  };
  
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark');
  };

  // --- PAGINATION LOGIC ---
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = companyData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(companyData.length / itemsPerPage);

  const nextPage = () => setCurrentPage(prev => (prev < totalPages ? prev + 1 : prev));
  const prevPage = () => setCurrentPage(prev => (prev > 1 ? prev - 1 : prev));


  return (
    <div className={`${theme === 'dark' ? 'bg-slate-900 text-white' : 'bg-white text-gray-900'} min-h-screen font-sans transition-colors duration-500`}>
       <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@700&display=swap');
        
        .font-poppins {
            font-family: 'Poppins', sans-serif;
        }

        .loader {
            border: 4px solid ${theme === 'dark' ? '#334155' : '#e2e8f0'};
            border-top: 4px solid ${theme === 'dark' ? '#fbbf24' : '#3b82f6'};
            border-radius: 50%;
            width: 50px;
            height: 50px;
            animation: spin 1s linear infinite;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        .themed-bg {
            background-color: ${theme === 'dark' ? '#0f172a' : '#f8fafc'};
            background-image: ${theme === 'dark' 
                ? `radial-gradient(ellipse at center, rgba(251, 191, 36, 0.1) 0%, transparent 70%), url("data:image/svg+xml,%3Csvg width='20' height='12' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M10 12L0 2h2l8 8 8-8h2L10 12z' fill='%231e293b' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E")`
                : `radial-gradient(ellipse at center, rgba(59, 130, 246, 0.1) 0%, transparent 70%), url("data:image/svg+xml,%3Csvg width='20' height='12' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M10 12L0 2h2l8 8 8-8h2L10 12z' fill='%23e2e8f0' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E")`
            };
        }
        .sticky-header thead {
            position: sticky;
            top: 0;
            z-index: 10;
        }
      `}</style>
      
      <div className="themed-bg min-h-screen">
        <Navbar theme={theme} toggleTheme={toggleTheme} />

        <div className="container mx-auto pt-23">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="loader"></div>
            </div>
          ) : companyData.length > 0 ? (
            <div className="flex flex-col items-center gap-4">
              <div className={`w-full max-w-5xl overflow-hidden rounded-2xl shadow-2xl border ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'}`}>
                <div className="overflow-y-auto sticky-header" style={{ maxHeight: 'calc(100vh - 10rem)' }}>
                  <table className={`w-full text-left ${theme === 'dark' ? 'bg-slate-900' : 'bg-white'}`}>
                    <thead className={`sticky top-0 z-10 ${theme === 'dark' ? 'bg-slate-800' : 'bg-gray-100'}`}>
                      <tr>
                        <th className="p-4 font-semibold">No.</th>
                        <th className="p-4 font-semibold">Company Name</th>
                        <th className="p-4 font-semibold">Website</th>
                        <th className="p-4 font-semibold">Note</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentItems.map((company, index) => (
                        <tr key={index} className={`border-t ${theme === 'dark' ? 'border-slate-800 hover:bg-slate-800/50' : 'border-gray-200 hover:bg-gray-50'} transition-colors`}>
                          <td className="p-4 align-top">{indexOfFirstItem + index + 1}</td>
                          <td className="p-4 font-medium align-top">{company.name}</td>
                          <td className="p-4 align-top">
                            <a
                              href={company.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`${theme === 'dark' ? 'text-amber-400 hover:text-amber-300' : 'text-blue-600 hover:text-blue-800'} underline transition-colors`}
                            >
                              {company.website}
                            </a>
                          </td>
                          <td className="p-4">
                            <span className={`${getBadgeClass(company.remark)} whitespace-normal text-left`}>
                              {company.remark}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              {/* --- ACTION ROW WITH PAGINATION AND DOWNLOAD --- */}
              <div className="w-full max-w-5xl flex flex-col sm:flex-row justify-between items-center gap-4">
                {/* Pagination Controls */}
                <div className="flex items-center gap-2">
                    <button onClick={prevPage} disabled={currentPage === 1} className={`px-2 py-1 rounded-lg transition-colors ${theme === 'dark' ? 'bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:text-slate-500' : 'bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400'}`}>
                        Previous
                    </button>
                    <span className={`font-semibold px-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        Page {currentPage} of {totalPages}
                    </span>
                    <button onClick={nextPage} disabled={currentPage === totalPages} className={`px-2 py-1 rounded-lg transition-colors ${theme === 'dark' ? 'bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:text-slate-500' : 'bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400'}`}>
                        Next
                    </button>
                </div>

                {/* Download Button */}
                <div className="text-center">
                  <button
                    onClick={handleDownloadExcel}
                    className={`text-base font-bold px-8 py-2 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl ${theme === 'dark' ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-900 hover:from-amber-600 hover:to-yellow-500' : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700'}`}
                  >
                    Download as Excel
                  </button>
                </div>
              </div>

            </div>
          ) : (
            <div className={`text-center py-20 px-6 rounded-2xl ${theme === 'dark' ? 'bg-slate-800' : 'bg-gray-100'}`}>
              <h3 className="text-3xl font-semibold">No Company Data Found</h3>
              <p className={`mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                There were no results for your query. Please try different filters.
              </p>
              <Link to="/filters" className={`mt-6 inline-block text-base font-bold px-8 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg ${theme === 'dark' ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-900' : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'}`}>
                Back to Filters
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TablePage;
