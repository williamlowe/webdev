import React, { useState } from 'react';
import Select from 'react-select';

function App() {
  const data = [
    {
      value: 1,
      label: "APPLE"
    },
    {
      value: 2,
      label: "AIG"
    },
    {
      value: 3,
      label: "AMD"
    },
    {
      value: 4,
      label: "DELL"
    },
    {
      value: 5,
      label: "DOW"
    },
    {
      value: 6,
      label: "GOOGLE"
    },
    {
        value:7,
        label: "HPQ"
    },
    {
        value:8,
        label:"IBM"
    },
    {
        value:9,
        label:"INTC"
    },
    {
        value:10,
        label:"MICROSOFT"
    },
  ];
  const current = new Date();
  const date = `${current.getDate()}/${current.getMonth()+1}/${current.getFullYear()}`;
  const yday = current.setDate(current.getDate()-1);

  const [selectedOption, setSelectedOption] = useState(null);
 
  // handle onChange event of the dropdown
  const handleChange = e => {
    setSelectedOption(e);
  }
 
  return (
    <div className="App">
 
      <Select
        placeholder="Select Option"
        value={selectedOption} // set selected value
        options={data} // set list of the data
        onChange={handleChange} // assign onChange function
      />
 
      {selectedOption && <div style={{ marginTop: 20, lineHeight: '25px' }}>
        <b>Trading Info for {date}:</b><br />
        <div style={{ marginTop: 10 }}><b>Sym: </b> {selectedOption.label}</div>
        <div><b>Max Trade Price: </b> {selectedOption.value}</div>
        <div><b>Min Trade Price: </b> {selectedOption.value}</div>
        <div><b>Current Trade Price: </b> {selectedOption.value}</div>
        <p></p>
        <b>{yday} Trading Info:</b>
        <div style={{ marginTop: 10 }}><b>Sym: </b> {selectedOption.label}</div>
        <div><b>Max Trade Price: </b> {selectedOption.value}</div>
        <div><b>Min Trade Price: </b> {selectedOption.value}</div>
        <div><b>Closing Trade Price: </b> {selectedOption.value}</div>
        <p></p>

      </div>}
    </div>
  );
}

export default App;