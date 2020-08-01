import React, { Component } from 'react';
import './App.css';
import axios from 'axios';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

class App extends Component {
  constructor(){
    super()
    this.state = {
      value: '',
      ticker: '',
      date: new Date().toLocaleString(),
      columnDefs: [{
        headerName: "Ticker", field: "ticker"
      }, {
        headerName: "Date", field: "dates"
      }],
      rowData: ''
    }

    this.handleClick = this.handleClick.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  handleClick(event){
    axios.get('http://localhost:8080/dividends/getByTicker?ticker=' + this.state.value)
    .then(response => this.setState({rowData: response}))
    event.preventDefault()
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  render () {
    return (
      <form>
        <label>
          Name:
          <input type="text" value={this.state.value} onChange={this.handleChange} />
        </label>
        <button className='button' onClick={this.handleClick}>Click Me</button>
        <div
          className="ag-theme-alpine"
          style={{
          height: '250px',
          width: '600px' }}
          >
        <AgGridReact
          columnDefs={this.state.columnDefs}
          rowData={this.state.rowData}>
        </AgGridReact>
      </div>
      </form>
    )
  }
}
export default App
