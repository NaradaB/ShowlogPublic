import "./App.css";
import "./Homepage.css";
import "./Collection.css";
import RegisterPage from "./Register";
import LoginPage from "./Login";
import Homepage from "./Homepage";
import SearchResults from "./SearchResults";
import Collection from "./Collection";
import Profile from "./Profile";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/search/:searchQuery" element={<SearchResults />} />
        </Routes>
        <Routes>
          <Route path="/collection" element={<Collection />} />
        </Routes>
        <Routes>
          <Route path="/profile/:username" element={<Profile />} />
        </Routes>
        <Routes>
          <Route path="/register" element={<RegisterPage />} />
        </Routes>

        <Routes>
          <Route path="/login" element={<LoginPage />} />
        </Routes>
        <Routes>
          <Route exact path="/" element={<Homepage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
