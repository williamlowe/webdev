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

    componentDidMount() { 
        //Async/Await Query to qRest here
        //Then put results in state's tableData and graphData
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