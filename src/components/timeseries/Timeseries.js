import * as React from 'react';  
import { Slider } from '@material-ui/core';
import axios from 'axios';
import Chart from 'react-apexcharts';

export default class Timeseries extends React.Component {
    constructor(props) {  
        super(props);  
        
        let kdbDate = this.getNewDate();
        let kdbTime = this.getNewTime();

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

        let today = new Date();
        let hours = today.getUTCHours();
        let minutes = today.getUTCMinutes();
        let cTime = Math.ceil((hours*60+minutes)/15)

        this.state = {
            currentDate: kdbDate,
            currentTime: kdbTime,
            rangeShort: 0,
            rangeLong: cTime,
            sliderLabels: times,
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
            options: {
                chart: {
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
                  categories: times.slice(0, cTime+1)
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

    getNewDate(){
        let today = new Date();
        let kdbDay = today.getUTCDate().toString();
        if(kdbDay < 10){
            kdbDay = "0"+kdbDay;
        }
        let kdbMonth = (today.getUTCMonth()+1).toString();
        if(kdbMonth < 10){
            kdbMonth = "0"+kdbMonth;
        }
        let kdbYear = today.getUTCFullYear().toString();
        return kdbYear+"."+kdbMonth+"."+kdbDay;
    }

    getNewTime(){
        let today = new Date();
        let kdbHour = today.getUTCHours();
        if(kdbHour < 10){
            kdbHour = "0"+kdbHour.toString();
        }
        let kdbMinutes = today.getUTCMinutes();
        if(kdbMinutes < 10){
            kdbMinutes = "0"+kdbMinutes.toString();
        }
        let kdbSeconds = today.getUTCSeconds();
        if(kdbSeconds < 10){
            kdbSeconds = "0"+kdbSeconds.toString();
        }
        return kdbHour+":"+kdbMinutes+":"+kdbSeconds;
    }

    updateDateTime(){
        let newTime = this.getNewTime();
        let newDate = this.getNewDate();

        this.setState({currentTime: newTime,
            currentDate: newDate});
    }

    //Updates Range of Times in the state (Integer Index of 15 minute increment)
    //Use getLabel() to retrieve the string value for the time or in state's sliderLabels
    updateRange(event, value){  
        this.setState({rangeShort: value[0],
            rangeLong: value[1]});  
    }

    getLabel(index){
        return this.state.sliderLabels[index];
    }

    async getData(){
        var url="https://81.150.99.19:8035/executeQuery";

      
        let queryRequest= {
            "query": "(select .Q.f[3; avg(avgs price)] by sym, 15 xbar time.minute from trade where time.date = .z.d, time.minute within("+this.state.sliderLabels[this.state.rangeShort]+";"+this.state.sliderLabels[this.state.rangeLong]+"))",
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

        let AAPLp=[], AIGp=[], AMDp=[], DELLp=[], DOWp=[], GOOGp=[], HPQp=[], IBMp=[], INTCp=[], MSFTp=[];
        let res = response.data.result;
        let max = res.length;
        for(let i=0; i<max; i++){
            switch (res[i].sym){
                case "AAPL":
                    AAPLp.push(res[i].price);
                    break;
                case "AIG":
                    AIGp.push(res[i].price);
                    break;
                case "AMD":
                    AMDp.push(res[i].price);
                    break;
                case "DELL":
                    DELLp.push(res[i].price);
                    break;
                case "DOW":
                    DOWp.push(res[i].price);
                    break;
                case "GOOG":
                    GOOGp.push(res[i].price);
                    break;
                case "HPQ":
                    HPQp.push(res[i].price);
                    break;
                case "IBM":
                    IBMp.push(res[i].price);
                    break;
                case "INTC":
                    INTCp.push(res[i].price);
                    break;
                case "MSFT":
                    MSFTp.push(res[i].price);
                    break;
                default:
                    break;
            }
        }

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

        let newOptions = this.state.options;

        newOptions.xaxis = this.state.sliderLabels.slice(this.state.rangeShort, this.state.rangeLong);

        this.setState({series: newSeries, options:newOptions});
    }

    async componentDidMount() { 
        
        await this.getData();

        window.setInterval(function () {
            this.updateDateTime();
          }.bind(this), 1000);

          window.setInterval(function () {
            this.getData();
          }.bind(this), 2000);

    } 

    render() {  
        //Slider component set for the number of possible 15-minute increments, to be updated when query for qRest is known
        
        let today = new Date();
        let hh = today.getUTCHours();
        let mm = today.getUTCMinutes();

        let vals = [];

        for(let i=0; i<Math.ceil((hh*60+mm)/15)+1; i++){
            vals[i] = {
                value: i
            };
        }

        return (  
            <div>
                <p>Timeseries Graph and Slider for {this.state.currentDate}D{this.state.currentTime}</p>
                <br/>
                <Chart options={this.state.options} series={this.state.series} type="line" />
                <br/>
                <Slider
                    defaultValue={[0, Math.ceil((hh*60+mm)/15)]}
                    onChangeCommitted={this.updateRange}
                    valueLabelDisplay="on"
                    valueLabelFormat={this.getLabel}
                    marks={vals}
                    step={null}
                />
                {this.state.sliderVal}
            </div>  
        )  
    }  
}