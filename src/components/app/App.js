import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import PageHeader from '../page-header/PageHeader';
import Navbar from '../navbar/Navbar';

function App() {
  return(
    <div className="App">
      <header className="App-header">
        <p>
          <PageHeader/>
          <Router>
            <Navbar/>
            <Switch>  
                <Route path="/page2">  
                    <div className='my-page-content'>Running Average Timeseries</div>  
                </Route>  
                <Route path="/page3">  
                    <div className='my-page-content'>Last Value Data Cache</div>  
                </Route>  
                <Route path="/page4">  
                    <div className='my-page-content'>Sym Volatility</div>  
                </Route>  
                <Route path="/">  
                    <div className='my-page-content'>Current Prices</div>  
                </Route>  
            </Switch>  
          </Router>
        </p>
      </header>
    </div>
  )

}

export default App;
