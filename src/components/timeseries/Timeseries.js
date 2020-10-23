import * as React from 'react';  
import { Box, Slider } from '@material-ui/core';
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

            updatedTime: "",

            //Blank Data Holder for Line Graph
            series: [],
            //Default Options for Line Graph
            options: {
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
                colors: ['#680039', '#333399', '#0076b8', '#006300', '#ff0067', '#2a2a1e', '#6dff60', '#d8a400', '#993399', '#b61200'],
                stroke: {
                  curve: 'straight',
                  width: 2
                },
                title: {
                  text: 'Running Average Price',
                  align: 'left'
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
                  title: {
                    text: "Time",
                    offsetX: 0,
                    offsetY: 4,
                    style: {
                        fontSize: '14px',
                        fontFamily: 'Helvetica, Arial, sans-serif',
                        fontWeight: 600,
                        cssClass: 'apexcharts-xaxis-title',
                    }
                  }
                },
                yaxis: {
                  title: {
                    text: "Average Price",
                    rotate: -90,
                    offsetX: 0,
                    offsetY: 0,
                    style: {
                        fontSize: '12px',
                        fontFamily: 'Helvetica, Arial, sans-serif',
                        fontWeight: 600,
                        cssClass: 'apexcharts-yaxis-title',
                    },
                  }
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

    checkInside(sym, arr){
      let ind= -1;
      for(let i=0; i<arr.length; i++){
        if (arr[i].name === sym){
          ind=i;
        }
      }
      return ind;
    }

    //Performs API call to retrieve, process, and format Line Graph Data
    async getData(){
        //URL for qRest Process on Homer
        var url="https://81.150.99.19:8013/executeQuery";

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

        let newTime = response.data.responseTime.substring(11, 19) + " UTC";

        let newSeries=[];
        let newSym={
          name: "",
          data: []
        };
        let newData = [2];
        let check = -1;
        
        //Loops Through Data and Pushes Price to the Correct Array
        let max = res.length;
        for(let i=0; i<max; i++){
          check = this.checkInside(res[i].sym, newSeries);
          if(check === -1){
            newData[0]= this.state.dateNum+(res[i].minute.i * 60000);
            newData[1]= res[i].price;
            newSym = {
              name: res[i].sym,
              data:[newData.slice()]
            }
            newSeries.push({...newSym});
          }
          else{
            newData[0]= this.state.dateNum+(res[i].minute.i * 60000);
            newData[1]= res[i].price;
            newSeries[check].data.push(newData.slice());
          }
        }

        //Updates Options to Ensure Correct Time Range
        let newOptions = this.state.options;
        newOptions.xaxis.min = newSeries[0].data[0];
        //Sets the new Series and Options for Line Graph
        this.setState({series: newSeries, 
          options: newOptions,
          updatedTime: newTime});
    }

    //Sets Up the Component upon being Loaded
    async componentDidMount() { 
        
        //Initial Call to Populate Graph
        await this.getData();

        //Sets Auto-Update Every 2 Seconds
        window.setInterval(function () {
        this.getData();
        }.bind(this), 5000);

    } 


    async componentDidUpdate(prevProps, prevState){
      if (prevState.rangeShort !== this.state.rangeShort){
          await this.getData();
      }
      if (prevState.rangeLong !== this.state.rangeLong){
        await this.getData();
      }
  }

    renderGraph(props) {
      return(
        <Chart options={props.options} series={props.series} type="line" height="450"/>
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
            <Box border={1} borderColor="grey.500" borderRadius={10} m={2} p={1} bgcolor="#f8f8ff" boxShadow={1}>
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
                <p align="right">Last Updated: {this.state.updatedTime}</p>
            </Box>  
        )  
    }  
}