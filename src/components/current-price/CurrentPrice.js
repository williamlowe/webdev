import React, { Component } from 'react'
import Select from 'react-select'
import axios from 'axios'


export default class App extends Component {

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

  
    let queryRequest= {
        "query": "(select last price, max price, min price by sym from trade)",
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

    //function myFunction(item, index, arr) {
    //  arr[index] = item.sym;
    //}
  
    let res = response.data.result;
    //res.forEach(myFunction);

    //alert(res);
    

    //window.setInterval(function () {
      //  this.updateDateTime();
      //}.bind(this), 1000);

      const options = res.map(d => ({
        "label" : d.sym,
        "value" : d.price,
        "value2": d.price1,
        "value3": d.price2}))
  
  this.setState({selectOptions: options})
  
  } 

  handleChange(e){
   this.setState({sym:e.label,
    currentprice:e.value, 
    maxprice:e.value2, 
    minprice:e.value3})
  }

  componentDidMount(){
    this.getOptions()
  }
  
  render() {
    console.log(this.state.selectOptions)
    return (
      <div>
        <Select options={this.state.selectOptions} 
        onChange={this.handleChange.bind(this)} />
    <p>You have selected <strong>{this.state.sym}</strong></p>
    <p>Current price is <strong>{this.state.currentprice}</strong></p>
    <p>Max price is <strong>{this.state.maxprice}</strong></p>
    <p>Min price is <strong>{this.state.minprice}</strong></p>
      </div>
    )
  }
}