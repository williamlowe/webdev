import * as React from 'react';  
export default class Timeseries extends React.Component {
    constructor(props) {  
        super(props);  
    
        this.state = {  
            graphData: {}
        }  
    }   

    componentDidMount() { 
        //Async/Await Query to qRest here
        //Then put results in state's graphData
    } 

    render() {  
        return (  
            <div>
                <p>Timeseries Graph and Slider</p>
            </div>  
        )  
    }  
}