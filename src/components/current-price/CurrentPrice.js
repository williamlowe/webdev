import * as React from 'react';  
export default class CurrentPrice extends React.Component {
    constructor(props) {  
        super(props);  
    
        this.state = {  
            numDays: 1,  
            tableData: {},
            graphData: {}
        }  
    }   

    async componentDidMount() { 
        //Async/Await Query to qRest here
        //Then put results in state's tableData and graphData

        //var url="https://81.150.99.19:8004/";

        //var kdbQuery = {
        //    "query": "",
        //    "response": "true",
        //    "type": "sync"
        //};

        //let response = axios.post(url, kdbQuery, {
        //    headers: {
        //        authorization: 'my secret token'
        //    }
        //});

        //let data = response.json();

    } 

    //This is called when the date range for price history is extended
    updateSelected = (newNum) => {  
        this.setState({numDays: newNum});  
    } 

    render() {  
        return (  
            <div>
                <p>Current Price Summary Boxes, Table and Graph</p>
            </div>  
        )  
    }  
}