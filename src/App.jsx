import "./App.css";
import { Routes, Route } from "react-router-dom";

import Filters from "./pages/Filters";
import Table from "./pages/Table";
import Front from "./pages/Front";

function App() {
  return (
    <>
    <div className="body">

      <Routes>
        <Route path="/" element={<Front />} />
        <Route path="/filters" element={<Filters />} />
        <Route path="/table" element={<Table />} />
      </Routes>
    </div>
    </>
  );
}
export default App;
