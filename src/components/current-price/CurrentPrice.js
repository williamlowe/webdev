import * as React from 'react';  
import PropTypes from 'prop-types';
import {Typography, IconButton, Box, Collapse, Table, TableBody, TableCell, TableHead, TableRow, Grid } from '@material-ui/core';
import axios from 'axios';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';

export default class CurrentPrice extends React.Component {

  constructor(props){
    super(props)
    //Uses Arrays of Equal Length for Table Columns
    this.state = {
      //Strings of Sym names
      syms: [],

      //Latest Price on Each Symbol
      currentPrices: [],
      
      //Daily Highest Price for Each Sym
      maxPrices: [],

      //Daily Lowest Price for Each Sym
      minPrices: [],

      //CSS classes for green/red boxes for prices going up or down
      colors: [],

      //'+' or '-' for each sym to show direction
      colorSigns: [],

      //Sym with the Highest Volume of Trades Today
      highSym: {
        sym: "",
        volume: 0
      },

      //An Array for Each Sym's Historical Data
      history: [],

      //Time of Latest Update
      updatedTime: ""
      
    }
  }

  //Queries and Handles the Daily Data for Each Sym in the Table
  async getCurrentData() { 

    //qRest Process URL
    var url="https://81.150.99.19:8013/executeQuery";

    //Body of qRest Post Call
    let queryRequest= {
        "query": "(select change:.Q.f[2;last deltas price], lastp: .Q.f[2;last price], maxp: .Q.f[2;max price], minp: .Q.f[2;min price], vol:sum size by sym, time.date from trade where time.date =.z.d)",
        "type": "sync",
        "response": true
    };

    //Sends a Post Request to qRest
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

    console.log(newTableData);

    //Most Reent Update Time
    let newTime = response.data.responseTime.substring(11, 19) + " UTC";

    
    let newSyms=[], newPrices=[], newMaxPrices=[], newMinPrices=[], newColors=[], newSigns=[];
    
    let newHigh = 0, newHighInd = 0;

    //Loops through response and Extracts the Current Prices, Maxs, Mins, and Highest Traded from Tabledata
    for(let i=0; i<newTableData.length; i++){
      newSyms.push(newTableData[i].sym);
      newPrices.push(newTableData[i].lastp);
      newMaxPrices.push(newTableData[i].maxp);
      newMinPrices.push(newTableData[i].minp);

      //Determines if Price has gone Up or Down
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

    //Returns an Object containing values for New State
    return({
      syms: newSyms,
      currentPrices: newPrices,
      maxPrices: newMaxPrices,
      minPrices: newMinPrices,
      highSym: newHighSym,
      colors: newColors,
      colorSigns: newSigns,
      updatedTime: newTime});
  }

  //Checks If Symbol is already in the Array
  checkInside(sym, arr){
    let ind= -1;
    for(let i=0; i<arr.length; i++){
      if (arr[i].name === sym){
        ind=i;
      }
    }
    return ind;
  }

  //Retrieves Historical Data for Table
  async getHistoricalData() { 

    //qRest Process URL
    var url="https://81.150.99.19:8013/executeQuery";

  
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
    
    let sortedInfo=[];
    let check = -1;
    let newInput = {
      date: "",
      closePrice: 0,
      maxPrice: 0,
      minPrice: 0
    };
    let newSym={
      name: "",
      data: []
    };
    let max = res.length;

    //Loops Through and creates historical datta array for each sym
    for(let i=0; i<max; i++){
      check= this.checkInside(res[i].sym, sortedInfo);
      if(check === -1){
        newSym= {
          name: res[i].sym,
          data: [
            {
              date: res[i].date,
              closePrice: res[i].lastp,
              oldMaxPrice: res[i].maxp,
              oldMinPrice: res[i].minp
            }
          ]
        };
        sortedInfo.push({...newSym});
      }
      else{
        newInput.date = res[i].date;
        newInput.closePrice= res[i].lastp;
        newInput.oldMaxPrice = res[i].maxp;
        newInput.oldMinPrice = res[i].minp;
        sortedInfo[check].data.push({...newInput});
      }
    }

    let newHistory = [];
    for(let j=0; j<sortedInfo.length; j++){
      newHistory.push(sortedInfo[j].data);
    }

    //this.setState({history: newHistory});

    return newHistory;
  }

  //Function to Update Both Daily and Historical Table Data in One Go
  async updateData(){
    let newHistory = await this.getHistoricalData();
    let newCurrent = await this.getCurrentData();

    this.setState({
      syms: newCurrent.syms,
      currentPrices: newCurrent.currentPrices,
      maxPrices: newCurrent.maxPrices,
      minPrices: newCurrent.minPrices,
      highSym: newCurrent.highSym,
      history: newHistory,
      colors: newCurrent.colors,
      colorSigns: newCurrent.colorSigns,
      updatedTime: newCurrent.updatedTime});
  }

  //Populates Initial Data to Page and Sets Timer for Periodic Update
  async componentDidMount(){
    await this.updateData();

    window.setInterval(function () {
      this.updateData();
    }.bind(this), 15000);

  }

  render() {

    //Used to Format Data for Each Row in the Table
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

      //Row Component of Material-UI Table
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
        //Strict Properties Required for Each Row Component
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

        let rows=[];
        for(let i=0; i<this.state.currentPrices.length; i++){
          rows.push(createData(this.state.syms[i], this.state.colorSigns[i], this.state.colors[i], this.state.currentPrices[i], this.state.maxPrices[i], this.state.minPrices[i], this.state.history[i]));
        }
        console.log(rows);
    

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
      <Grid container spacing={0}>              
        <Grid item xs={7}>
        <p className="table-head">Highest Traded Today:  <strong>{this.state.highSym.sym}</strong></p>
        </Grid>
        <Grid item xs={5}><p align="right">Last Updated: {this.state.updatedTime}</p></Grid>
      </Grid>      
    </Box>
        )
    }
  }