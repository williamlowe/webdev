import * as React from 'react';  
import PropTypes from 'prop-types';
import {Typography, IconButton, Box, Collapse, Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';
import axios from 'axios';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';

export default class CurrentPrice extends React.Component {

  constructor(props){
    super(props)
    let dummyData=[
      { date: '2020-10-04', closePrice: 0, oldMaxPrice: 0, oldMinPrice: 0 },
      { date: '2020-10-03', closePrice: 0, oldMaxPrice: 0, oldMinPrice: 0 },
      { date: '2020-10-02', closePrice: 0, oldMaxPrice: 0, oldMinPrice: 0 }
    ];
    this.state = {
      //TableData
      currentPrices: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      maxPrices: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      minPrices: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      colors: ["","","","","","","","","",""],
      colorSigns: ["","","","","","","","","",""],
      highSym: {
        sym: "IBM",
        volume: 0
      },
      history: [dummyData,dummyData,dummyData,dummyData,dummyData,dummyData,dummyData,dummyData,dummyData,dummyData],

      updatedTime: ""
      
    }
  }

  async getCurrentData() { 

    var url="https://81.150.99.19:8035/executeQuery";

  
    let queryRequest= {
        "query": "(select change:.Q.f[2;last deltas price], lastp: .Q.f[2;last price], maxp: .Q.f[2;max price], minp: .Q.f[2;min price], vol:sum size by sym, time.date from trade where time.date =.z.d)",
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

    let newTableData = response.data.result;

    let newTime = response.data.responseTime.substring(11, 19) + " UTC";

    //Extracts the Current Prices, Max, Min, and Highest Traded from Tabledata
    let newPrices=[], newMaxPrices=[], newMinPrices=[], newColors=[], newSigns=[];
    
    let newHigh = 0, newHighInd = 0;
    for(let i=0; i<10; i++){
      newPrices.push(newTableData[i].lastp);
      newMaxPrices.push(newTableData[i].maxp);
      newMinPrices.push(newTableData[i].minp);

      if(newTableData[i].change < 0){
        newColors.push("red-box");
        newSigns.push("-");
      }
      else{
        newColors.push("green-box");
        newSigns.push("+");
      }
      
      if(newTableData[i].vol >= newHigh){
        newHigh = newTableData[i].vol;
        newHighInd = i;
      }
    }
    
    let newHighSym = {
      sym: newTableData[newHighInd].sym,
      volume: newTableData[newHighInd].vol
    };

    return({
      currentPrices: newPrices,
      maxPrices: newMaxPrices,
      minPrices: newMinPrices,
      highSym: newHighSym,
      colors: newColors,
      colorSigns: newSigns,
      updatedTime: newTime});
  }

  async getHistoricalData() { 

    var url="https://81.150.99.19:8035/executeQuery";

  
    let queryRequest= {
        "query": "(select lastp: .Q.f[2;last price], maxp: .Q.f[2;max price], minp: .Q.f[2;min price] by sym, time.date from trade where time.date within(.z.d-3; .z.d-1))",
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
    
    
    let AAPLh=[], AIGh=[], AMDh=[], DELLh=[], DOWh=[], GOOGh=[], HPQh=[], IBMh=[], INTCh=[], MSFTh=[];
    let newInput = {
      date: "",
      closePrice: 0,
      maxPrice: 0,
      minPrice: 0
    }
    let max = res.length;
    for(let i=0; i<max; i++){
        switch (res[i].sym){
            case "AAPL":
                newInput.date = res[i].date;
                newInput.closePrice= res[i].lastp;
                newInput.oldMaxPrice = res[i].maxp;
                newInput.oldMinPrice = res[i].minp;
                AAPLh.push({...newInput});
                break;
            case "AIG":
              newInput.date = res[i].date;
              newInput.closePrice= res[i].lastp;
              newInput.oldMaxPrice = res[i].maxp;
              newInput.oldMinPrice = res[i].minp;
              AIGh.push({...newInput});
                break;
            case "AMD":
              newInput.date = res[i].date;
              newInput.closePrice= res[i].lastp;
              newInput.oldMaxPrice = res[i].maxp;
              newInput.oldMinPrice = res[i].minp;
              AMDh.push({...newInput});
                break;
            case "DELL":
              newInput.date = res[i].date;
              newInput.closePrice= res[i].lastp;
              newInput.oldMaxPrice = res[i].maxp;
              newInput.oldMinPrice = res[i].minp;
              DELLh.push({...newInput});
                break;
            case "DOW":
              newInput.date = res[i].date;
              newInput.closePrice= res[i].lastp;
              newInput.oldMaxPrice = res[i].maxp;
              newInput.oldMinPrice = res[i].minp;
              DOWh.push({...newInput});
                break;
            case "GOOG":
              newInput.date = res[i].date;
              newInput.closePrice= res[i].lastp;
              newInput.oldMaxPrice = res[i].maxp;
              newInput.oldMinPrice = res[i].minp;
              GOOGh.push({...newInput});
                break;
            case "HPQ":
              newInput.date = res[i].date;
              newInput.closePrice= res[i].lastp;
              newInput.oldMaxPrice = res[i].maxp;
              newInput.oldMinPrice = res[i].minp;
              HPQh.push({...newInput});
                break;
            case "IBM":
              newInput.date = res[i].date;
              newInput.closePrice= res[i].lastp;
              newInput.oldMaxPrice = res[i].maxp;
              newInput.oldMinPrice = res[i].minp;
              IBMh.push({...newInput});
                break;
            case "INTC":
              newInput.date = res[i].date;
              newInput.closePrice= res[i].lastp;
              newInput.oldMaxPrice = res[i].maxp;
              newInput.oldMinPrice = res[i].minp;
              INTCh.push({...newInput});
                break;
            case "MSFT":
              newInput.date = res[i].date;
              newInput.closePrice= res[i].lastp;
              newInput.oldMaxPrice = res[i].maxp;
              newInput.oldMinPrice = res[i].minp;
              MSFTh.push({...newInput});
                break;
            default:
                break;
        }
    }
    
    let newHistory = [];
    newHistory.push(AAPLh);
    newHistory.push(AIGh);
    newHistory.push(AMDh);
    newHistory.push(DELLh);
    newHistory.push(DOWh);
    newHistory.push(GOOGh);
    newHistory.push(HPQh);
    newHistory.push(IBMh);
    newHistory.push(INTCh);
    newHistory.push(MSFTh);

    //this.setState({history: newHistory});

    return newHistory;
  }

  async updateData(){
    let newHistory = await this.getHistoricalData();
    let newCurrent = await this.getCurrentData();

    this.setState({currentPrices: newCurrent.currentPrices,
      maxPrices: newCurrent.maxPrices,
      minPrices: newCurrent.minPrices,
      highSym: newCurrent.highSym,
      history: newHistory,
      colors: newCurrent.colors,
      colorSigns: newCurrent.colorSigns,
      updatedTime: newCurrent.updatedTime});
  }



  async componentDidMount(){
    await this.updateData();

    window.setInterval(function () {
      this.updateData();
    }.bind(this), 15000);

  }

  render() {

    function createData(sym, sign, colorBox, currentPrice, maxPrice, minPrice, history) {
        return {
          sym,
          sign,
          colorBox,
          currentPrice,
          maxPrice,
          minPrice,
          history,
        };
      }

    function Row(props) {
        const { row } = props;
        const [open, setOpen] = React.useState(false);

        return (
            <React.Fragment>
              <TableRow>
                <TableCell>
                  <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>{open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}</IconButton>
                </TableCell>
                <TableCell className={row.colorBox}>{row.sym}{row.sign}</TableCell>
                <TableCell align="right">${row.currentPrice}</TableCell>
                <TableCell align="right">${row.maxPrice}</TableCell>
                <TableCell align="right">${row.minPrice}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                  <Collapse in={open} timeout="auto" unmountOnExit>
                    <Box margin={1}>
                      <Typography variant="h6" gutterBottom component="div">
                        History
                      </Typography>
                      <Table size="small" aria-label="purchases">
                        <TableHead>
                          <TableRow>
                            <TableCell>Date</TableCell>
                            <TableCell>Close Price</TableCell>
                            <TableCell>Max Price</TableCell>
                            <TableCell>Min Price</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {row.history.map((historyRow) => (
                            <TableRow key={historyRow.date}>
                              <TableCell component="th" scope="row">
                                {historyRow.date}
                              </TableCell>
                              <TableCell>${historyRow.closePrice}</TableCell>
                              <TableCell>${historyRow.oldMaxPrice}</TableCell>
                              <TableCell>${historyRow.oldMinPrice}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </Box>
                  </Collapse>
                </TableCell>
              </TableRow>
            </React.Fragment>
          );
        }

        Row.propTypes = {
            row: PropTypes.shape({
              colorBox: PropTypes.string.isRequired,
              sign: PropTypes.string.isRequired,
              maxPrice: PropTypes.number.isRequired,
              minPrice: PropTypes.number.isRequired,
              currentPrice: PropTypes.number.isRequired,
              history: PropTypes.arrayOf(
                PropTypes.shape({
                  closePrice: PropTypes.number.isRequired,
                  oldMaxPrice: PropTypes.number.isRequired,
                  oldMinPrice: PropTypes.number.isRequired,
                  date: PropTypes.string.isRequired,
                }),
              ).isRequired,
              sym: PropTypes.string.isRequired,
            }).isRequired,
          };

        const rows = [
            createData('AAPL', this.state.colorSigns[0], this.state.colors[0], this.state.currentPrices[0], this.state.maxPrices[0], this.state.minPrices[0], this.state.history[0]),
            createData('AIG', this.state.colorSigns[1], this.state.colors[1], this.state.currentPrices[1], this.state.maxPrices[1], this.state.minPrices[1], this.state.history[1]),
            createData('AMD', this.state.colorSigns[2], this.state.colors[2], this.state.currentPrices[2], this.state.maxPrices[2], this.state.minPrices[2], this.state.history[2]),
            createData('DELL', this.state.colorSigns[3], this.state.colors[3], this.state.currentPrices[3], this.state.maxPrices[3], this.state.minPrices[3], this.state.history[3]),
            createData('DOW', this.state.colorSigns[4], this.state.colors[4], this.state.currentPrices[4], this.state.maxPrices[4], this.state.minPrices[4], this.state.history[4]),
            createData('GOOG', this.state.colorSigns[5], this.state.colors[5], this.state.currentPrices[5], this.state.maxPrices[5], this.state.minPrices[5], this.state.history[5]),
            createData('HPQ', this.state.colorSigns[6], this.state.colors[6], this.state.currentPrices[6], this.state.maxPrices[6], this.state.minPrices[6], this.state.history[6]),
            createData('IBM', this.state.colorSigns[7], this.state.colors[7], this.state.currentPrices[7], this.state.maxPrices[7], this.state.minPrices[7], this.state.history[7]),
            createData('INTC', this.state.colorSigns[8], this.state.colors[8], this.state.currentPrices[8], this.state.maxPrices[8], this.state.minPrices[8], this.state.history[8]),
            createData('MSFT', this.state.colorSigns[9], this.state.colors[9], this.state.currentPrices[9], this.state.maxPrices[9], this.state.minPrices[9], this.state.history[9]),
        ];
    
    

    return (
    <Box border={1} borderColor="grey.500" borderRadius={10} m={1.5} p={0.3} bgcolor="#f8f8ff" boxShadow={1}>
      <p><strong>Current Prices</strong></p>
        <Table size="small" width='450' >
        <TableHead className='table-head'>
          <TableRow>
            <TableCell>History</TableCell>
            <TableCell className='table-head-cell'>Sym</TableCell>
            <TableCell className='table-head-cell' align="center">Current Price</TableCell>
            <TableCell className='table-head-cell' align="center">Max Price</TableCell>
            <TableCell className='table-head-cell' align="center">Min Price</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <Row key={row.sym} row={row} />
          ))}
        </TableBody>
      </Table>
      <div className="table-head">Highest Traded Today:  <strong>{this.state.highSym.sym}</strong></div> 
      <p align="right">Last Updated: {this.state.updatedTime}</p>
    </Box>
        )
    }
  }