import * as React from 'react';  
import Select from 'react-select';
import axios from 'axios';

export default class Timeseries extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      selectOptions : [],
      sym: "",
      price: '',
      price1: '',
      price2: ''
    }
  }

  async getOptions() { 
    //Async/Await Query to qRest here
    //Then put results in state's graphData

    var url="https://81.150.99.19:8035/executeQuery";

  //Taking prices for last price for syms for 15 min 
    let queryRequest= {
        "query": "(select last price by sym, 15 xbar time.minute from trade where time.date =.z.d-"+this.changes+" )",
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

    console.log(response);

    let res = response.data.result;





  }
}