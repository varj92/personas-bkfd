import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import {Personas} from './components/Personas'
import {Navbar} from './components/Navbar'

function App() {
  return (
    <Router>
      <Navbar/>
      <div className="container p-2">
        <switch>
          {/* <Route path="/" component={Users} /> */}
          <Route path="/" component={Personas} />
        </switch>
      </div>
    </Router>
  );
}

export default App;
