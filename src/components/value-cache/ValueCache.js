import * as React from 'react';  
import axios from 'axios';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableCell';
import TableCell from '@material-ui/core/TableCell';
//import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import TableContainer from '@material-ui/core/TableContainer';
//import { withStyles } from "@material-ui/core/styles";


/*const StyledTableCell = withStyles(theme => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white
  },
  body: {
    fontSize: 15
  }
}))(TableCell); */


export default class ValueCache extends React.Component {
    constructor(props) {  
        super(props);  
    
        this.state = {  
            tableData: [
          {
            sym: "AAPL",
            price: [],
            priceChange: []
          },
          {
            sym: "AIG",
            price: [],
            priceChange: []

          },
          {
            sym: "AMD",
            price: [],
            priceChange: []
          },
          {
            sym: "DELL",
            price: [],
            priceChange: []

          },
          {
            sym: "DOW",
            price: [],
            priceChange: []
          },
          {
            sym: "GOOG",
            price: [],
            priceChange: []
          },
          {
            sym: "HPQ",
            price: [],
            priceChange: []
          },
          {
            sym: "IBM",
            price: [],
            priceChange: []
          },
          {
            sym: "INTC",
            price: [],
            priceChange: []
          },
          {
            sym: "MSFT",
            price: [],
            priceChange: []
          }
        ]
        }
    }

async getData(){
        var url="https://81.150.99.19:8035/executeQuery";

      
        let queryRequest= {
            "query": "(select .Q.f[2;last price], priceChange:.Q.f[2;last deltas price] by sym from trade where time.date= .z.d)",
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
    
        console.log(response.data.result)


        let AAPLp=[], AIGp=[], AMDp=[], DELLp=[], DOWp=[], GOOGp=[], HPQp=[], IBMp=[], INTCp=[], MSFTp=[];
        let AAPLpc=[], AIGpc=[], AMDpc=[], DELLpc=[], DOWpc=[], GOOGpc=[], HPQpc=[], IBMpc=[], INTCpc=[], MSFTpc=[];
        let res = response.data.result;
        let len = res.length;
        for(let i=0; i<len; i++){
            switch (res[i].sym){
                case "AAPL":
                    AAPLp.push(res[i].price);
                    AAPLpc.push(res[i].priceChange);
                    break;
                case "AIG":
                    AIGp.push(res[i].price);
                    AIGpc.push(res[i].priceChange);
                    break;
                case "AMD":
                    AMDp.push(res[i].price);
                    AMDpc.push(res[i].priceChange);
                    break;
                case "DELL":
                    DELLp.push(res[i].price);
                    DELLpc.push(res[i].priceChange);
                    break;
                case "DOW":
                    DOWp.push(res[i].price);
                    DOWpc.push(res[i].priceChange)
                    break;
                case "GOOG":
                    GOOGp.push(res[i].price);
                    GOOGpc.push(res[i].priceChange);
                    break;
                case "HPQ":
                    HPQp.push(res[i].price);
                    HPQpc.push(res[i].priceChange);
                    break;
                case "IBM":
                    IBMp.push(res[i].price);
                    IBMpc.push(res[i].priceChange);
                    break;
                case "INTC":
                    INTCp.push(res[i].price);
                    INTCpc.push(res[i].priceChange);
                    break;
                case "MSFT":
                    MSFTp.push(res[i].price);
                    MSFTpc.push(res[i].priceChange)
                    break;
                default:
                    break;
            }
        }

        let newTableData = [
          {
            sym: "AAPL",
            price: AAPLp ,
            priceChange: AAPLpc
          },
          {
            sym: "AIG",
            price: AIGp ,
            priceChange: AIGpc

          },
          {
            sym: "AMD",
            price: AMDp ,
            priceChange: AMDpc
          },
          {
            sym: "DELL",
            price: DELLp ,
            priceChange: DELLpc

          },
          {
            sym: "DOW",
            price: DOWp ,
            priceChange: DOWpc
          },
          {
            sym: "GOOG",
            price: GOOGp ,
            priceChange: GOOGpc
          },
          {
            sym: "HPQ",
            price: HPQp ,
            priceChange: HPQpc
          },
          {
            sym: "IBM",
            price: IBMp ,
            priceChange: IBMpc
          },
          {
            sym: "INTC",
            price: INTCp,
            priceChange: INTCpc
          },
          {
            sym: "MSFT",
            price: MSFTp ,
            priceChange: MSFTpc
          }
        ];

        
        this.setState({tableData: newTableData});


        // check the console for positive or negative values working
        if(INTCpc < 0)
        {
          console.log(INTCpc)
          console.log("negative")
        }
        else if (INTCpc > 0){
            console.log(INTCpc)
          console.log("positive")
        }
        else{
          console.log(INTCpc)
          console.log("no change")

        }

        for (let i=0; i<len; i++){
        console.log(this.state.tableData[i].priceChange)
            
        }
    
    }

    async componentDidMount() { 
        
       await this.getData();

        window.setInterval(function () {
            this.getData();
         
        }.bind(this), 2000)
        
    }
    
   render() { 
       // Red and Green boxes to be done

        return (  
            <div>
                
                <TableContainer component={Paper}>
                <Table>
                    <TableBody>
                           <TableRow>
                            <TableCell align="center" colSpan={3} ><b> Last Value Cache </b></TableCell>
                           </TableRow>
                            <TableRow style= {{backgroundColor: "white", boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)'}}>
                            <TableCell style={{ height: 10 , width: 100 , border: "1.75px solid lightgrey", backgroundColor: "white"}} align="left"><strong>Sym</strong></TableCell>
                            <TableCell style={{ height: 10 , width: 170, border: "1.75px solid lightgrey",backgroundColor: "white"}} align="left"><strong>Price</strong></TableCell>
                            <TableCell style={{ height: 10 , width: 170, border: "1.75px solid lightgrey", backgroundColor: "white"}} align="left"><strong>Price Change</strong></TableCell>
                        </TableRow>
                            {this.state.tableData.map((data, index) => (
                                <TableRow key={data.sym} style= {{boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)'}}>
                                    <TableCell style={{backgroundColor: "white", border: "1px solid lightgrey"}} align="left"><b>{data.sym}</b></TableCell>
                                    <TableCell style={{ backgroundColor: "white",border: "1px solid lightgrey"}} align="left">{data.price}</TableCell>
                                    <TableCell style={{ backgroundColor: "white",border: "1px solid lightgrey"}} align="left" >{data.priceChange}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                </Table>
                </TableContainer>
            </div>
            
             
        )  
     
        }
}