import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, Bounce, toast } from "react-toastify";
import axios from "axios";
import 'react-toastify/dist/ReactToastify.css';

const GlobeIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2h8a2 2 0 002-2v-1a2 2 0 012-2h1.945M7.881 4.002l.023.001a10.978 10.978 0 0111.99 0l.023-.001M16.119 19.998l.023.001a10.978 10.978 0 01-11.99 0l-.023-.001M12 21a9 9 0 100-18 9 9 0 000 18z" />
  </svg>
);
const MapIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 16.382V5.618a1 1 0 00-1.447-.894L15 7m-6 13v- hükümet" />
  </svg>
);
const CityIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
);
const BriefcaseIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
);
const NumberIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
    </svg>
);

const Navbar = () => (
  <nav className="bg-white/70 backdrop-blur-xl fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-6xl mx-auto z-50 rounded-xl shadow-lg border border-gray-200/60">
    <div className="container mx-auto px-6 py-3">
      <div className="flex justify-between items-center">
        <div className="text-2xl font-bold text-gray-900 tracking-wider">
          DataFinder
        </div>
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-300">Home</Link>
          <Link to="/table" className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-300">Table</Link>
        </div>

      </div>
    </div>
  </nav>
);


const Filters = () => {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const [showDropdown, setShowDropdown] = useState(false);
  const [showStateDropdown, setShowStateDropdown] = useState(false);
  const [showCityDropdown, setShowCityDropdown] = useState(false);

  const [countrySearch, setCountrySearch] = useState("");
  const [stateSearch, setStateSearch] = useState("");
  const [citySearch, setCitySearch] = useState("");

  const countryDropdownRef = useRef(null);
  const stateDropdownRef = useRef(null);
  const cityDropdownRef = useRef(null);

  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [company_type, setCompany_type] = useState("");
  const [count, setCount] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
      if (stateDropdownRef.current && !stateDropdownRef.current.contains(event.target)) {
        setShowStateDropdown(false);
      }
      if (cityDropdownRef.current && !cityDropdownRef.current.contains(event.target)) {
        setShowCityDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    axios.get("http://localhost:8080/countries").then((res) => setCountries(res.data));
  }, []);

  useEffect(() => {
    if (selectedCountry) {
      const countryId = countries.find((c) => c.name === selectedCountry)?.id;
      if (countryId) {
        axios.get(`http://localhost:8080/states?countryId=${countryId}`).then((res) => setStates(res.data));
      }
    }
  }, [selectedCountry, countries]);

  useEffect(() => {
    if (selectedState) {
      const stateId = states.find((s) => s.name === selectedState)?.id;
      if (stateId) {
        axios.get(`http://localhost:8080/cities?stateId=${stateId}`).then((res) => setCities(res.data));
      }
    }
  }, [selectedState, states]);

  const deny = () => {
    toast.warn("Please add valid details", {
      position: "top-right", autoClose: 5000, theme: "light", transition: Bounce,
    });
  };

  const accept = () => {
    toast.success("Fetching your data...", {
      position: "top-right", autoClose: 5000, theme: "light", transition: Bounce,
    });
    setTimeout(() => {
      navigate("/table", {
        state: { country: selectedCountry, state: selectedState, city: selectedCity, count, company_type },
      });
    }, 4000);
  };

  return (
    <div className="min-h-screen font-sans hero-bg">
      <style>{`
        .hero-bg {
          background-color: #f8fafc;
          background-image: 
            radial-gradient(ellipse at center, rgba(240, 244, 255, 0.6) 0%, rgba(255, 255, 255, 0) 70%),
            url("data:image/svg+xml,%3Csvg width='20' height='12' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M10 12L0 2h2l8 8 8-8h2L10 12z' fill='%23e2e8f0' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E");
        }
        .custom-input {
          border-radius: 0.75rem;
          border-width: 1px;
          border-color: #d1d5db;
          transition: all 0.3s;
          padding-left: 2.5rem; /* Make space for icon */
        }
        .custom-input:focus {
          outline: none;
          box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.5);
          border-color: #3b82f6;
        }
        .dropdown-ul {
          top: 100%;
          margin-top: 0.25rem;
          width: 100%;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
        }
        @keyframes formFadeIn {
          from { opacity: 0; transform: translateY(30px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .form-fade-in {
          animation: formFadeIn 0.6s ease-out forwards;
        }
      `}</style>
      <ToastContainer />
      <Navbar />

      <dialog id="verify_modal" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box bg-white p-6 rounded-2xl shadow-xl border border-gray-200">
          <h3 className="font-bold text-xl mb-4 text-center text-gray-800">Confirm Your Selections</h3>
          <div className="text-left space-y-2 bg-gray-50 p-4 rounded-lg border border-gray-200">
            <p><strong className="font-medium text-gray-700">Country:</strong> <span className="text-blue-600 font-semibold">{selectedCountry}</span></p>
            <p><strong className="font-medium text-gray-700">State:</strong> <span className="text-blue-600 font-semibold">{selectedState}</span></p>
            <p><strong className="font-medium text-gray-700">City:</strong> <span className="text-blue-600 font-semibold">{selectedCity}</span></p>
          </div>
          <div className="modal-action flex justify-end gap-3 mt-6">
            <button className="btn btn-sm bg-gray-200 hover:bg-gray-300 text-gray-700 border-0" onClick={() => { document.getElementById("verify_modal").close(); deny(); }}>
              Deny
            </button>
            <button className="btn btn-sm bg-blue-600 hover:bg-blue-700 text-white border-0" onClick={() => { document.getElementById("verify_modal").close(); accept(); }}>
              Accept
            </button>
          </div>
        </div>
      </dialog>

      <div className="min-h-screen flex items-center justify-center pt-24 pb-10 px-4">
        <div className="px-8 py-6 bg-white shadow-2xl rounded-2xl w-full max-w-lg space-y-5 border border-gray-200/80 form-fade-in">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800">Select Your Filters</h1>
            <p className="text-gray-500 mt-2">Fill out the fields below to find the data you need.</p>
          </div>

          <div className="form-control w-full relative" ref={countryDropdownRef}>
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"><GlobeIcon className="h-5 w-5 text-gray-400" /></div>
            <input type="text" placeholder="Search Country" className="input custom-input w-full" value={countrySearch} onChange={(e) => setCountrySearch(e.target.value)} onFocus={() => setShowDropdown(true)} />
            {showDropdown && (
              <ul className="absolute bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto z-10 dropdown-ul">
                {countries.filter((c) => c.name.toLowerCase().includes(countrySearch.toLowerCase())).map((c) => (
                  <li key={c.id} className="px-4 py-2 hover:bg-blue-50 cursor-pointer" onClick={() => {
                    setSelectedCountry(c.name); setCountrySearch(c.name); setShowDropdown(false);
                    setSelectedState(""); setStateSearch(""); setStates([]);
                    setSelectedCity(""); setCitySearch(""); setCities([]);
                  }}>{c.name}</li>
                ))}
              </ul>
            )}
          </div>

          <div className="form-control w-full relative" ref={stateDropdownRef}>
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"><MapIcon className="h-5 w-5 text-gray-400" /></div>
            <input type="text" placeholder="Search State" className="input custom-input w-full" value={stateSearch} onChange={(e) => setStateSearch(e.target.value)} onFocus={() => setShowStateDropdown(true)} disabled={!selectedCountry} />
            {showStateDropdown && (
              <ul className="absolute bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto z-10 dropdown-ul">
                {states.filter((s) => s.name.toLowerCase().includes(stateSearch.toLowerCase())).map((s) => (
                  <li key={s.id} className="px-4 py-2 hover:bg-blue-50 cursor-pointer" onClick={() => {
                    setSelectedState(s.name); setStateSearch(s.name); setShowStateDropdown(false);
                    setSelectedCity(""); setCitySearch(""); setCities([]);
                  }}>{s.name}</li>
                ))}
              </ul>
            )}
          </div>

          <div className="form-control w-full relative" ref={cityDropdownRef}>
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"><CityIcon className="h-5 w-5 text-gray-400" /></div>
            <input type="text" placeholder="Search City" className="input custom-input w-full" value={citySearch} onChange={(e) => setCitySearch(e.target.value)} onFocus={() => setShowCityDropdown(true)} disabled={!selectedState} />
            {showCityDropdown && (
              <ul className="absolute bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto z-10 dropdown-ul">
                {cities.filter((c) => c.name.toLowerCase().includes(citySearch.toLowerCase())).map((c) => (
                  <li key={c.id} className="px-4 py-2 hover:bg-blue-50 cursor-pointer" onClick={() => {
                    setSelectedCity(c.name); setCitySearch(c.name); setShowCityDropdown(false);
                  }}>{c.name}</li>
                ))}
              </ul>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"><BriefcaseIcon className="h-5 w-5 text-gray-400" /></div>
              <input type="text" className="input custom-input w-full" value={company_type} onChange={(e) => setCompany_type(e.target.value)} placeholder="e.g. Biotech" />
            </div>
            <div className="form-control relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"><NumberIcon className="h-5 w-5 text-gray-400" /></div>
              <input type="number" min="1" className="input custom-input w-full" value={count} onChange={(e) => setCount(e.target.value)} placeholder="e.g. 5" />
            </div>
          </div>

          <button
            className="btn w-full text-white text-lg font-semibold border-0 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl disabled:from-gray-400 disabled:to-gray-500 disabled:shadow-none disabled:transform-none disabled:cursor-not-allowed"
            onClick={() => document.getElementById("verify_modal").showModal()}
            disabled={!selectedCountry || !selectedState || !selectedCity || !company_type || !count}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default Filters;