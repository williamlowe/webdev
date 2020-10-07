import * as React from 'react';  
import PropTypes from 'prop-types';
import {Typography, IconButton, Box, Collapse, Select, MenuItem, InputLabel, Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';
import axios from 'axios';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import { makeStyles } from '@material-ui/core/styles';

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
      if(newTableData[i].minp <= newMin){
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

    this.setState({
      currentPrices: newPrices,
      maxSym: newMaxSym,
      minSym: newMinSym,
      highSym: newHighSym});

  }

  async getTableData() { 

    var url="https://81.150.99.19:8035/executeQuery";

  
    let queryRequest= {
        "query": "(select lastp: .Q.f[3;last price], maxp: .Q.f[3;max price], minp: .Q.f[3;min price], vol:sum size by sym, time.date from trade where time.date within (.z.d-2;.z.d))",
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

    const useRowStyles = makeStyles({
        root: {
          '& > *': {
            borderBottom: 'unset',
          },
        },
      });

    function createData(sym,currentPrices, maxPrice, minPrice,) {
        return {
          sym,
          currentPrices,
          maxPrice,
          minPrice,
          history: [
            { date: '2020-01-05', maxPrice: '11091700', minPrice: 3,},
            { date: '2020-01-02', maxPrice: 'Anonymous', minPrice: 1, },
          ],
        };
      }

    function Row(props) {
        const { row } = props;
        const [open, setOpen] = React.useState(false);
        const classes = useRowStyles();

        return (
            <React.Fragment>
              <TableRow className={classes.root}>
                <TableCell>
                  <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                    {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                  </IconButton>
                </TableCell>
                <TableCell component="th" scope="row">
                  {row.sym}
                </TableCell>
                <TableCell align="right">{row.currentPrices}</TableCell>
                <TableCell align="right">{row.maxPrice}</TableCell>
                <TableCell align="right">{row.minPrice}</TableCell>
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
                            <TableCell> Max Price</TableCell>
                            <TableCell>Min Price</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {row.history.map((historyRow) => (
                            <TableRow key={historyRow.date}>
                              <TableCell component="th" scope="row">
                                {historyRow.date}
                              </TableCell>
                              <TableCell>{historyRow.maxPrice}</TableCell>
                              <TableCell>{historyRow.minPrice}</TableCell>
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
              maxPrice: PropTypes.number.isRequired,
              minPrice: PropTypes.number.isRequired,
              CurrentPrice: PropTypes.number.isRequired,
              history: PropTypes.arrayOf(
                PropTypes.shape({
                  amount: PropTypes.number.isRequired,
                  customerId: PropTypes.string.isRequired,
                  date: PropTypes.string.isRequired,
                }),
              ).isRequired,
              sym: PropTypes.string.isRequired,
            }).isRequired,
          };

        const rows = [
            createData('AAPL', 159, 6.0, 24, 4.0, 3.99),
            createData('AIG', 237, 9.0, 37, 4.3, 4.99),
            createData('AMD', 262, 16.0, 24, 6.0, 3.79),
            createData('DELL', 305, 3.7, 67, 4.3, 2.5),
            createData('DOW', 356, 16.0, 49, 3.9, 1.5),
            createData('GOOG', 356, 16.0, 49, 3.9, 1.5),
            createData('HPQ', 356, 16.0, 49, 3.9, 1.5),
            createData('IBM', 356, 16.0, 49, 3.9, 1.5),
            createData('INTC', 356, 16.0, 49, 3.9, 1.5),
            createData('MSFT', 356, 16.0, 49, 3.9, 1.5),
        ];
    
    

    return (
    <div>
    <p>Highest traded sym is {this.state.highSym.sym}</p>
        <Table>
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Sym</TableCell>
            <TableCell align="right">Current Price</TableCell>
            <TableCell align="right">Max Price</TableCell>
            <TableCell align="right">Min Price</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <Row key={row.sym} row={row} />
          ))}
        </TableBody>
      </Table>
      </div>
        )
    }
  }