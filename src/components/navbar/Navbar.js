import * as React from 'react';  
import { Link } from 'react-router-dom';
export default class Navbar extends React.Component {
    constructor(props) {  
        super(props);  
    
        this.state = {  
            selected: 0  
        }  
    }   

    updateSelected = (idx) => {  
        this.setState({selected: idx});  
    } 

    render() {  
        return (  
            <div className='navbar'> 
                <Link to='/' onClick={() => this.updateSelected(0)}> 
                    <div className={`navigation-item ${this.state.selected === 0 ? 'selected' : ''}`}> 
                        <p className='navigation-text'>  
                            Current Prices  
                        </p>  
                    </div>  
                </Link> 
                <Link to='/page2' onClick={() => this.updateSelected(1)}> 
                    <div className={`navigation-item ${this.state.selected === 1 ? 'selected' : ''}`}>  
                        <p className='navigation-text'>  
                            Running Average Timeseries  
                        </p>  
                    </div> 
                </Link> 
                <Link to='/page3' onClick={() => this.updateSelected(2)}> 
                    <div className={`navigation-item ${this.state.selected === 2 ? 'selected' : ''}`}>  
                        <p className='navigation-text'>  
                            Last Value Data Cache  
                        </p>  
                    </div> 
                </Link> 
                <Link to='page4' onClick={() => this.updateSelected(3)}> 
                    <div className={`navigation-item ${this.state.selected === 3 ? 'selected' : ''}`}>  
                        <p className='navigation-text'>  
                            Sym Volatility  
                        </p>  
                    </div>  
                </Link> 
            </div>  
        )  
    }  
}