import * as React from 'react';  
import axios from 'axios';
import { Box, Grid, Container, Select, MenuItem, InputLabel, FormControl } from '@material-ui/core';
import Chart from 'react-apexcharts';

export default class Volatility extends React.Component {
    constructor(props) {  
        super(props);  
    
        this.state = {  
            extend: 0,
            series: [],
            updatedTime: ""
            //Default Options for Line Graph
        }  
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
        let days=0;
        let mins="15";
        let ex = this.state.extend;
        if(ex===1){
            days=1;
            mins="30";
        }
        else if(ex===2){
            days=7;
            mins="60";
        }
        else if(ex===3){
            days=30;
            mins="720";
        }

        //URL for qRest Process on Homer
        var url="https://81.150.99.19:8013/executeQuery";

        //Query for Gateway to be sent through qRest
        let queryRequest= {
            "query": "(select price:.Q.f[3; 100*(dev price)%(avg price)] by sym, time.date, "+mins+" xbar time.minute from trade where time.date within((.z.d-"+days+");.z.d))",
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

        
        //Loops Through Data and Pushes Price to the Correct Array
        let max = res.length;

        let newSeries=[];
        let newSym={
          name: "",
          data: []
        };
        let newData = [2];
        let check = -1;

        for(let i=0; i<max; i++){
          check = this.checkInside(res[i].sym, newSeries);
          if(check === -1){
            newData[0]= (new Date(""+res[i].date.substring(0,4)+" "+res[i].date.substring(5,7) + " " + res[i].date.substring(8) +" UTC")).getTime()+(res[i].minute.i * 60000);
            newData[1]= res[i].price;
            newSym = {
              name: res[i].sym,
              data:[newData.slice()]
            }
            newSeries.push({...newSym});
          }
          else{
            newData[0]= (new Date(""+res[i].date.substring(0,4)+" "+res[i].date.substring(5,7) + " " + res[i].date.substring(8) +" UTC")).getTime()+(res[i].minute.i * 60000);
            newData[1]= res[i].price;
            newSeries[check].data.push(newData.slice());
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

        for(let i=0; i<newSeries.length; i++){
          newSeries[i].data.sort(sortFunction);
        }
        

        //Sets the new Series and Options for Line Graph
        this.setState({series: newSeries,
          updatedTime: newTime});


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
        }.bind(this), 30000);

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
              curve: 'straight',
              width: 2
            },
            colors: ['#680039', '#333399', '#0076b8', '#006300', '#ff0067', '#2a2a1e', '#6dff60', '#d8a400', '#993399', '#b61200'],
            title: {
              text: 'Stock Volatility',
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
                text: "Price Volatility Percentage",
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
        return(
          <Chart options={options} series={props.series} type="line" height="350"/>
        );
    }

    render() {  
        let graphProps = {
            series: this.state.series,
            extend: this.state.extend
          }
        return (  
          <Box border={1} borderColor="grey.500" borderRadius={10} m={2} p={0.5} bgcolor="#f8f8ff" boxShadow={1}>
            
            <Grid item xs={12}>
                {this.renderGraph(graphProps)}
              </Grid>
            <Grid container spacing={3}>              
              <Grid item xs={3}>
                  <Container>
                  <FormControl variant="filled" fullWidth="true">
                    <InputLabel id="time-selector-label">Volatility Range</InputLabel>
                    <Select
                        autoWidth="true"
                        labelId="time-selector-label"
                        id="time-selector"
                        defaultValue=""
                        onChange={this.handleChange}
                    >
                        <MenuItem value={0}>Today</MenuItem>
                        <MenuItem value={1}>Yesterday</MenuItem>
                        <MenuItem value={2}>Last Week</MenuItem>
                        <MenuItem value={3}>Last Month</MenuItem>
                    </Select>
                  </FormControl>
                  </Container>
              </Grid>
              <Grid item xs={9}><p align="right">Last Updated: {this.state.updatedTime}</p></Grid>
            </Grid>
            
          </Box>
        )  
    }  
}