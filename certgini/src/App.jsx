// App.js
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import './index.css'
import HomePage from './pages/HomePage';
import Templating from './pages/Templating';
import AppDrawer from './components/AppDrawer'

export default function App() {

  return (
    <Router>
      <div>
        <Routes>
          <Route exact path="/" element={ <HomePage/>} />
          <Route  path='/temp/:id' element={ <Templating/>} />
          {/* <Route component={NotFound} /> */}
        </Routes>
      </div>
    </Router>
  );
}
