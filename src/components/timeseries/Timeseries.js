import * as React from 'react';  
import { Slider } from '@material-ui/core';

export default class Timeseries extends React.Component {
    constructor(props) {  
        super(props);  
        
        let kdbDate = this.getNewDate();
        let kdbTime = this.getNewTime();

        let x = 15; //minutes interval
        let times = []; // time array
        let tt = 0; // start time

        //Generate Time Labels for Slider
        for (var i=0;tt<24*60; i++) {
            var hh = Math.floor(tt/60); // getting hours of day in 0-24 format
            var mm = (tt%60); // getting minutes of the hour in 0-55 format
            times[i] = ("0" + hh).slice(-2) + ':' + ("0" + mm).slice(-2); 
            tt = tt + x;
        }

        this.state = {  
            graphData: {},
            currentDate: kdbDate,
            currentTime: kdbTime,
            rangeShort: 0,
            rangeLong: 12,
            sliderLabels: times
        }  
        this.updateRange = this.updateRange.bind(this);
        this.getLabel = this.getLabel.bind(this);
    }   

    getNewDate(){
        let today = new Date();
        let kdbDay = today.getUTCDate().toString();
        if(kdbDay < 10){
            kdbDay = "0"+kdbDay;
        }
        let kdbMonth = (today.getUTCMonth()+1).toString();
        if(kdbMonth < 10){
            kdbMonth = "0"+kdbMonth;
        }
        let kdbYear = today.getUTCFullYear().toString();
        return kdbYear+"."+kdbMonth+"."+kdbDay;
    }

    getNewTime(){
        let today = new Date();
        let kdbHour = today.getUTCHours();
        if(kdbHour < 10){
            kdbHour = "0"+kdbHour.toString();
        }
        let kdbMinutes = today.getUTCMinutes();
        if(kdbMinutes < 10){
            kdbMinutes = "0"+kdbMinutes.toString();
        }
        let kdbSeconds = today.getUTCSeconds();
        if(kdbSeconds < 10){
            kdbSeconds = "0"+kdbSeconds.toString();
        }
        return kdbHour+":"+kdbMinutes+":"+kdbSeconds;
    }

    updateDateTime(){
        let newTime = this.getNewTime();
        let newDate = this.getNewDate();

        this.setState({currentTime: newTime,
            currentDate: newDate});
    }

    //Updates Range of Times in the state (Integer Index of 15 minute increment)
    //Use getLabel() to retrieve the string value for the time or in state's sliderLabels
    updateRange(event, value){  
        this.setState({rangeShort: value[0],
            rangeLong: value[1]});  
    }

    getLabel(index){
        return this.state.sliderLabels[index];
    }

    componentDidMount() { 
        //Async/Await Query to qRest here
        //Then put results in state's graphData
        window.setInterval(function () {
            this.updateDateTime();
          }.bind(this), 10000);
    } 

    render() {  
        //Slider component set for the number of possible 15-minute increments, to be updated when query for qRest is known
        
        return (  
            <div>
                <p>Timeseries Graph and Slider for {this.state.currentDate}D{this.state.currentTime}</p>
                <br/><br/>
                <Slider
                    defaultValue={[this.state.rangeShort, this.state.rangeLong]}
                    onChangeCommitted={this.updateRange}
                    valueLabelDisplay="on"
                    valueLabelFormat={this.getLabel}
                    min={0}
                    max={96}
                />
                {this.state.sliderVal}
            </div>  
        )  
    }  
}