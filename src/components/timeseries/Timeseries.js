import * as React from 'react';  
import { Container, Slider } from '@material-ui/core';
import axios from 'axios';
import Chart from 'react-apexcharts';

export default class Timeseries extends React.Component {
    constructor(props) {  
        super(props);  

        let x = 15; //minutes interval
        let times = []; // time array
        let tt = 0; // start time

        //Generate Time Labels for Slider
        for (var i=0;tt<24*60; i++) {
            var hh = Math.floor(tt/60); // getting hours of day in 0-24 format
            var mm = (tt%60); // getting minutes of the hour in 0-55 format
            times[i] = ("0" + hh).slice(-2) + ':' + ("0" + mm).slice(-2); 
            tt = tt + x;
        }

        //Calculate Current Time for Slider Max
        let today = new Date();
        let hours = today.getUTCHours();
        let minutes = today.getUTCMinutes();
        let cTime = Math.ceil((hours*60+minutes)/15)

        let midnight = (new Date(""+today.getUTCFullYear()+" "+(today.getUTCMonth()+1)+" "+today.getUTCDate()+" UTC")).getTime();

        this.state = {
            //Range Indices for Slider
            rangeShort: 0,
            rangeLong: cTime,

            dateNum: midnight,

            //String Array of Time Labels for Slider and Graph
            sliderLabels: times,

            //Blank Data Holder for Line Graph
            series: [{
                name: "AAPL",
                data: []
              },
              {
                name: "AIG",
                data: []
              },
              {
                name: "AMD",
                data: []
              },
              {
                name: "DELL",
                data: []
              },
              {
                name: "DOW",
                data: []
              },
              {
                name: "GOOG",
                data: []
              },
              {
                name: "HPQ",
                data: []
              },
              {
                name: "IBM",
                data: []
              },
              {
                name: "INTC",
                data: []
              },
              {
                name: "MSFT",
                data: []
              }
            ],
            //Default Options for Line Graph
            options: {
                chart: {
                  id: 'timeseries-chart',
                  height: 400,
                  type: 'line',
                  zoom: {
                    enabled: false
                  },
                },
                dataLabels: {
                  enabled: false
                },
                stroke: {
                  curve: 'straight'
                },
                title: {
                  text: 'Running Average Price',
                  align: 'left'
                },
                legend: {
                  tooltipHoverFormatter: function(val, opts) {
                    return val + ' - ' + opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex] + ''
                  }
                },
                markers: {
                  size: 0,
                  hover: {
                    sizeOffset: 6
                  }
                },
                xaxis: {
                  type: "datetime",
                  tickAmount: 15,
                  min: midnight,
                },
                tooltip: {
                  y: [
                    {
                      title: {
                        formatter: function (val) {
                          return val;
                        }
                      }
                    },
                    {
                      title: {
                        formatter: function (val) {
                          return val;
                        }
                      }
                    },
                    {
                      title: {
                        formatter: function (val) {
                          return val;
                        }
                      }
                    },
                    {
                        title: {
                            formatter: function (val) {
                            return val;
                            }
                        }
                    },
                    {
                        title: {
                          formatter: function (val) {
                            return val;
                          }
                        }
                    },
                    {
                        title: {
                          formatter: function (val) {
                            return val;
                          }
                        }
                    },
                    {
                        title: {
                          formatter: function (val) {
                            return val;
                          }
                        }
                    },
                    {
                        title: {
                          formatter: function (val) {
                            return val;
                          }
                        }
                    },
                    {
                        title: {
                          formatter: function (val) {
                            return val;
                          }
                        }
                    },
                    {
                        title: {
                          formatter: function (val) {
                            return val;
                          }
                        }
                    }
                  ]
                },
                grid: {
                  borderColor: '#f1f1f1',
                }
            }
        }  
        this.updateRange = this.updateRange.bind(this);
        this.getLabel = this.getLabel.bind(this);
    }   

    //Updates Range of Times in the state (Integer Index of 15 minute increment)
    updateRange(event, value){  
        this.setState({rangeShort: value[0],
            rangeLong: value[1]});  
    }

    //Retrieve Time Label as a String from the Index
    getLabel(index){
        return this.state.sliderLabels[index];
    }

    //Performs API call to retrieve, process, and format Line Graph Data
    async getData(){
        //URL for qRest Process on Homer
        var url="https://81.150.99.19:8035/executeQuery";

        //Query for Gateway to be sent through qRest
        let queryRequest= {
            "query": "(select .Q.f[3; avg(avgs price)] by sym, 15 xbar time.minute from trade where time.date = .z.d, time.minute within("+this.state.sliderLabels[this.state.rangeShort]+";"+this.state.sliderLabels[this.state.rangeLong]+"))",
            "type": "sync",
            "response": true
        };

        //Async call to qRest to retrieve graph data
        //Requires Auth for qRest login and Authorization for kdb login
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


        //Instantiates arrays to store prices for Symbols
        let AAPLp=[], AIGp=[], AMDp=[], DELLp=[], DOWp=[], GOOGp=[], HPQp=[], IBMp=[], INTCp=[], MSFTp=[];
        let newData = [2];
        
        //Loops Through Data and Pushes Price to the Correct Array
        let max = res.length;
        for(let i=0; i<max; i++){
            switch (res[i].sym){
                case "AAPL":
                    newData[0]= this.state.dateNum+(res[i].minute.i * 60000);
                    newData[1]= res[i].price;
                    AAPLp.push(newData.slice());
                    break;
                case "AIG":
                    newData[0]= this.state.dateNum+(res[i].minute.i * 60000);
                    newData[1]= res[i].price;
                    AIGp.push(newData.slice());
                    break;
                case "AMD":
                    newData[0]= this.state.dateNum+(res[i].minute.i * 60000);
                    newData[1]= res[i].price;
                    AMDp.push(newData.slice());
                    break;
                case "DELL":
                    newData[0]= this.state.dateNum+(res[i].minute.i * 60000);
                    newData[1]= res[i].price;
                    DELLp.push(newData.slice());
                    break;
                case "DOW":
                    newData[0]= this.state.dateNum+(res[i].minute.i * 60000);
                    newData[1]= res[i].price;
                    DOWp.push(newData.slice());
                    break;
                case "GOOG":
                    newData[0]= this.state.dateNum+(res[i].minute.i * 60000);
                    newData[1]= res[i].price;
                    GOOGp.push(newData.slice());
                    break;
                case "HPQ":
                    newData[0]= this.state.dateNum+(res[i].minute.i * 60000);
                    newData[1]= res[i].price;
                    HPQp.push(newData.slice());
                    break;
                case "IBM":
                    newData[0]= this.state.dateNum+(res[i].minute.i * 60000);
                    newData[1]= res[i].price;
                    IBMp.push(newData.slice());
                    break;
                case "INTC":
                    newData[0]= this.state.dateNum+(res[i].minute.i * 60000);
                    newData[1]= res[i].price;
                    INTCp.push(newData.slice());
                    break;
                case "MSFT":
                    newData[0]= this.state.dateNum+(res[i].minute.i * 60000);
                    newData[1]= res[i].price;
                    MSFTp.push(newData.slice());
                    break;
                default:
                    break;
            }
        }

        //Formats Prices for pex Line Graph
        let newSeries = [{
            name: "AAPL",
            data: AAPLp
          },
          {
            name: "AIG",
            data: AIGp
          },
          {
            name: "AMD",
            data: AMDp
          },
          {
            name: "DELL",
            data: DELLp
          },
          {
            name: "DOW",
            data: DOWp
          },
          {
            name: "GOOG",
            data: GOOGp
          },
          {
            name: "HPQ",
            data: HPQp
          },
          {
            name: "IBM",
            data: IBMp
          },
          {
            name: "INTC",
            data: INTCp
          },
          {
            name: "MSFT",
            data: MSFTp
          }
        ];

        //Updates Options to Ensure Correct Time Range
        let newOptions = this.state.options;
        newOptions.xaxis.min = newSeries[0].data[0];
        //Sets the new Series and Options for Line Graph
        this.setState({series: newSeries, 
          options:newOptions});
    }

    //Sets Up the Component upon being Loaded
    async componentDidMount() { 
        
        //Initial Call to Populate Graph
        await this.getData();

        //Sets Auto-Update Every 2 Seconds
        window.setInterval(function () {
        this.getData();
        }.bind(this), 2000);

    } 
    renderGraph(props) {
      return(
        <Chart options={props.options} series={props.series} type="line" />
      );
    }

    render() {  

        //Retrieve Current Time in Hours and Minutes        
        let today = new Date();
        let hh = today.getUTCHours();
        let mm = today.getUTCMinutes();

        //Generate Ticks for Slider
        let vals = [];
        for(let i=0; i<Math.ceil((hh*60+mm)/15); i++){
            vals[i] = {
                value: i
            };
        }

        let graphProps = {
          series: this.state.series,
          options: this.state.options
        }

        return (  
            <Container>
                {this.renderGraph(graphProps)}
                <br/>
                <Slider
                    defaultValue={[0, Math.ceil((hh*60+mm)/15)-1]}
                    onChangeCommitted={this.updateRange}
                    valueLabelDisplay="on"
                    valueLabelFormat={this.getLabel}
                    marks={vals}
                    step={null}
                />
            </Container>  
        )  
    }  
}