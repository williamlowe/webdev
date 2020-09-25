import * as React from 'react';  
export default class ValueCache extends React.Component {
    constructor(props) {  
        super(props);  
    
        this.state = {  
            tableData: {}
        }  
    }   

    componentDidMount() { 
        //Async/Await Query to qRest here
        //Then put results in state's tableData
    } 

    render() {  
        return (  
            <div>
                <p>Last Value Cache Table</p>
            </div>  
        )  
    }  
}