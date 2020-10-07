import React from 'react';
import { Grid } from '@material-ui/core';

import PageHeader from '../page-header/PageHeader';
import CurrentPrice from '../current-price/CurrentPrice'
import Timeseries from '../timeseries/Timeseries'
import Volatility from '../volatility/Volatility'

function App() {
  return(
    <div className="App">
      <header className="App-header">
          <PageHeader/>
      </header>
      <Grid container spacing={1}>
        <Grid item xs={5}>
          <CurrentPrice/>
        </Grid>
        <Grid item xs={7}>
          <Timeseries/>
        </Grid>
        <Grid item xs={12}>
          <Volatility/>
        </Grid>
      </Grid>
      
      <br/>
      
      <br/>
      
    </div>
  )

}

export default App;
