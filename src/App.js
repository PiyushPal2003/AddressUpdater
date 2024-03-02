import './App.css';
import React, {useState} from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Address from './components/Address';

function App() {
  return (
    <div className="heading">
      <div>
      <Router>
        <Routes>
          <Route exact path='/' element={<Address/>} />
        </Routes>
      </Router>
      </div>
    </div>
  );
}

export default App;
