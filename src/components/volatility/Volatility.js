import * as React from 'react';  
import axios from 'axios';
import { Select, MenuItem, InputLabel } from '@material-ui/core';
import Chart from 'react-apexcharts';

export default class Volatility extends React.Component {
    constructor(props) {  
        super(props);  
    
        this.state = {  
            extend: 0,
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
        }  
    }   


     //Performs API call to retrieve, process, and format Line Graph Data
     async getData(){
        let days=0;
        let mins="15";
        let ex = this.state.extend;
        if(ex==1){
            days=1;
            mins="30";
        }
        else if(ex==2){
            days=7;
            mins="60";
        }
        else if(ex==3){
            days=30;
            mins="720";
        }

        //URL for qRest Process on Homer
        var url="https://81.150.99.19:8035/executeQuery";

        //Query for Gateway to be sent through qRest
        let queryRequest= {
            "query": "(select .Q.f[3; dev price] by sym, time.date, "+mins+" xbar time.minute from trade where time.date within((.z.d-"+days+");.z.d))",
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
        let newPoint = [2];
        
        //Loops Through Data and Pushes Price to the Correct Array
        let max = res.length;

        for(let i=0; i<max; i++){
            switch (res[i].sym){
                case "AAPL":
                    newPoint[0]= (new Date(""+res[i].date.substring(0,4)+" "+res[i].date.substring(5,7) + " " + res[i].date.substring(8) +" UTC")).getTime()+(res[i].minute.i * 60000);
                    newPoint[1]= res[i].price;
                    AAPLp.push(newPoint.slice());
                    break;
                case "AIG":
                    newPoint[0]= (new Date(""+res[i].date.substring(0,4)+" "+res[i].date.substring(5,7) + " " + res[i].date.substring(8) +" UTC")).getTime()+(res[i].minute.i * 60000);
                    newPoint[1]= res[i].price;
                    AIGp.push(newPoint.slice());
                    break;
                case "AMD":
                    newPoint[0]= (new Date(""+res[i].date.substring(0,4)+" "+res[i].date.substring(5,7) + " " + res[i].date.substring(8) +" UTC")).getTime()+(res[i].minute.i * 60000);
                    newPoint[1]= res[i].price;
                    AMDp.push(newPoint.slice());
                    break;
                case "DELL":
                    newPoint[0]= (new Date(""+res[i].date.substring(0,4)+" "+res[i].date.substring(5,7) + " " + res[i].date.substring(8) +" UTC")).getTime()+(res[i].minute.i * 60000);
                    newPoint[1]= res[i].price;
                    DELLp.push(newPoint.slice());
                    break;
                case "DOW":
                    newPoint[0]= (new Date(""+res[i].date.substring(0,4)+" "+res[i].date.substring(5,7) + " " + res[i].date.substring(8) +" UTC")).getTime()+(res[i].minute.i * 60000);
                    newPoint[1]= res[i].price;
                    DOWp.push(newPoint.slice());
                    break;
                case "GOOG":
                    newPoint[0]= (new Date(""+res[i].date.substring(0,4)+" "+res[i].date.substring(5,7) + " " + res[i].date.substring(8) +" UTC")).getTime()+(res[i].minute.i * 60000);
                    newPoint[1]= res[i].price;
                    GOOGp.push(newPoint.slice());
                    break;
                case "HPQ":
                    newPoint[0]= (new Date(""+res[i].date.substring(0,4)+" "+res[i].date.substring(5,7) + " " + res[i].date.substring(8) +" UTC")).getTime()+(res[i].minute.i * 60000);
                    newPoint[1]= res[i].price;
                    HPQp.push(newPoint.slice());
                    break;
                case "IBM":
                    newPoint[0]= (new Date(""+res[i].date.substring(0,4)+" "+res[i].date.substring(5,7) + " " + res[i].date.substring(8) +" UTC")).getTime()+(res[i].minute.i * 60000);
                    newPoint[1]= res[i].price;
                    IBMp.push(newPoint.slice());
                    break;
                case "INTC":
                    newPoint[0]= (new Date(""+res[i].date.substring(0,4)+" "+res[i].date.substring(5,7) + " " + res[i].date.substring(8) +" UTC")).getTime()+(res[i].minute.i * 60000);
                    newPoint[1]= res[i].price;
                    INTCp.push(newPoint.slice());
                    break;
                case "MSFT":
                    newPoint[0]= (new Date(""+res[i].date.substring(0,4)+" "+res[i].date.substring(5,7) + " " + res[i].date.substring(8) +" UTC")).getTime()+(res[i].minute.i * 60000);
                    newPoint[1]= res[i].price;
                    MSFTp.push(newPoint.slice());
                    break;
                default:
                    break;
            }
        }

        function sortFunction(a, b) {
            if (a[0] === b[0]) {
                return 0;
            }
            else {
                return (a[0] < b[0]) ? -1 : 1;
            }
        }
        AAPLp.sort(sortFunction);
        AIGp.sort(sortFunction);
        AMDp.sort(sortFunction);
        DELLp.sort(sortFunction);
        DOWp.sort(sortFunction);
        GOOGp.sort(sortFunction);
        HPQp.sort(sortFunction);
        IBMp.sort(sortFunction);
        INTCp.sort(sortFunction);
        MSFTp.sort(sortFunction);

        
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
        

        //Sets the new Series and Options for Line Graph
        this.setState({series: newSeries});


    }

    handleChange = (event) => {
        event.persist();
        this.setState({extend: event.target.value});
      };

    //Sets Up the Component upon being Loaded
    async componentDidMount() { 
        
        //Initial Call to Populate Graph
        await this.getData();

        //Sets Auto-Update Every 2 Seconds
        window.setInterval(function () {
        this.getData();
        }.bind(this), 60000);

    } 

    async componentDidUpdate(prevProps, prevState){
        if (prevState.extend !== this.state.extend){
            await this.getData();
        }
    }


    renderGraph(props) {
        let options= {
            chart: {
              id: 'timeseries-chart',
              height: 400,
              type: 'line',
              zoom: {
                type: 'x',
                enabled: true,
                autoScaleYaxis: true
              },
            },
            dataLabels: {
              enabled: false
            },
            stroke: {
              curve: 'straight'
            },
            title: {
              text: 'Stock Volatility',
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
              tickAmount: 15
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
        if(props.extend===1){
            //Handle Yesterday
        }
        else if(props.extend===2){
            //Handle Last Week
        }
        else if(props.extend===3){
            //Handle Last Month
        }
        else{
            //Handle Today
        }
        console.log(props.series);
        return(
          <Chart options={options} series={props.series} type="line" />
        );
    }

    render() {  
        let graphProps = {
            series: this.state.series,
            extend: this.state.extend
          }
        return (  
            <div>
                 <span>&nbsp;&nbsp;</span>
                <InputLabel id="time-selector">Extend Graph</InputLabel>
                <Select
                    labelId="time-selector-label"
                    id="time-selector"
                    defaultValue="0"
                    onChange={this.handleChange}
                >
                    <MenuItem value={0}>Today</MenuItem>
                    <MenuItem value={1}>Yesterday</MenuItem>
                    <MenuItem value={2}>Last Week</MenuItem>
                    <MenuItem value={3}>Last Month</MenuItem>
                </Select>
                <span>&nbsp;&nbsp;</span>
                {this.renderGraph(graphProps)}
            </div>  
        )  
    }  
}