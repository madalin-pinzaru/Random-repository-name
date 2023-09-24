import { BrowserRouter, Route, Routes } from "react-router-dom";
import SearchBar from "./components/Search/SearchBar";
import Results from "./components/Results/Results";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SearchBar />} />
        <Route path="/results" element={<Results />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
