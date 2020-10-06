import * as React from 'react';  
import { Select, MenuItem, InputLabel } from '@material-ui/core';
import axios from 'axios';

export default class CurrentPrice extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      days: 0,
      graphData: {},

      //TableData
      currentPrices: [],
      maxSym: {
        sym: "",
        price: 0
      },
      minSym: {
        sym: "",
        price: 0
      },
      highSym: {
        sym: "",
        volume: 0
      }
    }
    this.handleChange = this.handleChange.bind(this);
  }

  async updateData(){
    let newGraphData = await this.getGraphData();
    
    let newTableData = await this.getTableData();
    console.log(newTableData);

    //Extracts the Current Prices, Max, Min, and Highest Traded from Tabledata
    let newPrices = [];
    let newMax = 0, newMaxInd = 0;
    let newMin = 10000, newMinInd = 0;
    let newHigh = 0, newHighInd = 0;
    for(let i=0; i<10; i++){
      newPrices.push(newTableData[i].lastp);
      if(newTableData[i].maxp >= newMax){
        newMax = newTableData[i].maxp;
        newMaxInd = i;
      }
      if(newTableData[i].minp >= newMin){
        newMin = newTableData[i].minp;
        newMinInd = i;
      }
      if(newTableData[i].vol >= newHigh){
        newHigh = newTableData[i].vol;
        newHighInd = i;
      }
    }
    //Creates Objects for state
    let newMaxSym = {
      sym: newTableData[newMaxInd].sym,
      price: newTableData[newMaxInd].maxp
    };
    let newMinSym = {
      sym: newTableData[newMinInd].sym,
      price: newTableData[newMinInd].minp
    };
    let newHighSym = {
      sym: newTableData[newHighInd].sym,
      volume: newTableData[newHighInd].vol
    };

    this.setState({graphData: newGraphData,
      currentPrices: newPrices,
      maxSym: newMaxSym,
      minSym: newMinSym,
      highSym: newHighSym});

  }

  async getGraphData() { 
    //Async/Await Query to qRest here
    //Then put results in state's graphData

    var url="https://81.150.99.19:8035/executeQuery";

  //Taking prices for last price for syms for 15 min 
    let queryRequest= {
        "query": "(select last price by sym, 15 xbar time.minute from trade where time.date within(`date$(.z.d-"+this.state.days+");.z.d))",
        "type": "sync",
        "response": true
    };

    let response = await axios.post(url, queryRequest, {
        headers: {
            "Accept": "*/*",
            "Authorization": "BASIC dXNlcjpwYXNz"
        },
        auth: {
            username: 'user',
            password: 'pass'
        }
    });

    let res = response.data.result;
    return res;
  }

  async getTableData() { 

    var url="https://81.150.99.19:8035/executeQuery";

  
    let queryRequest= {
        "query": "(select lastp: last price, maxp: max price, minp: min price, vol:sum size by sym from trade where time.date = .z.d)",
        "type": "sync",
        "response": true
    };

    let response = await axios.post(url, queryRequest, {
        headers: {
            "Accept": "*/*",
            "Authorization": "BASIC dXNlcjpwYXNz"
        },
        auth: {
            username: 'user',
            password: 'pass'
        }
    });

    let res = response.data.result;
    return res;
  }

  handleChange = (event) => {
    event.persist();
    this.setState({days: event.target.value});
  };

  async componentDidMount(){
    await this.updateData();

    window.setInterval(function () {
      this.updateData();
    }.bind(this), 5000);
  }

  render() {
    return (
      <div>
        <InputLabel id="time-selector">Extend History</InputLabel>
        <Select
          labelId="time-selector-label"
          id="time-selector"
          defaultValue="0"
          onChange={this.handleChange}
        >
          <MenuItem value={0}>Today</MenuItem>
          <MenuItem value={1}>2 Days</MenuItem>
          <MenuItem value={2}>3 Days</MenuItem>
        </Select>
      </div>
    )
  }
}