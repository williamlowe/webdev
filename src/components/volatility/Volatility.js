import * as React from 'react';  
export default class Volatility extends React.Component {
    constructor(props) {  
        super(props);  
    
        this.state = {  
            tableData: {}
        }  
    }   

    componentDidMount() { 
        //Async/Await Query to qRest here
        //Then put results in state's graphData
    } 

    render() {  
        return (  
            <div>
                <p>Current Price Summary Boxes, Table and Graph</p>
            </div>  
        )  
    }  
}