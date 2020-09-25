import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import PageHeader from '../page-header/PageHeader';
import Navbar from '../navbar/Navbar';
import CurrentPrice from '../current-price/CurrentPrice'
import Timeseries from '../timeseries/Timeseries'
import ValueCache from '../value-cache/ValueCache'
import Volatility from '../volatility/Volatility'

function App() {
  return(
    <div className="App">
      <header className="App-header">
        <p>
          <PageHeader/>
          <Router>
            <Navbar/>
            <Switch>  
                <Route path="/current-price">  
                    <div className='my-page-content'><CurrentPrice/></div>  
                </Route>
                <Route path="/timeseries">  
                    <div className='my-page-content'><Timeseries/></div>  
                </Route>  
                <Route path="/value-cache">  
                    <div className='my-page-content'><ValueCache/></div>  
                </Route>  
                <Route path="/volatility">  
                    <div className='my-page-content'><Volatility/></div>  
                </Route>  
                <Route path="/">  
                    <div className='my-page-content'><CurrentPrice/></div>  
                </Route>  
            </Switch>  
          </Router>
        </p>
      </header>
    </div>
  )

}

export default App;
