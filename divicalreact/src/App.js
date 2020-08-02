import React, { Component } from 'react';
import './App.css';
import axios from 'axios';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import ApiCalendar from 'react-google-calendar-api';

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
      rowData: []
    }

    this.handleClick = this.handleClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.addRowData = this.addRowData.bind(this);
    //google cal
    this.handleItemClick = this.handleItemClick.bind(this);
  }

  handleClick(){
    axios.get('http://localhost:8080/dividends/getByTicker?ticker=' + this.state.value)
    .then(response => { console.log(response);
                        //this.setState({rowData: [{ticker:response.data.ticker, dates:response.data.dates.toString()}]});
                        this.addRowData(response);
                      });
  }

  public handleItemClick(event: SyntheticEvent<any>, name: string): void {
      if (name === 'sign-in') {
        ApiCalendar.handleAuthClick();
      } else if (name === 'sign-out') {
        ApiCalendar.handleSignoutClick();
      }

  addRowData(response)
  {
    this.setState({
      rowData : this.state.rowData.concat({ticker:response.data.ticker, dates:response.data.dates.toString()})
    });
    console.log(this.state.rowData);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  render () {
    return (
      <div>
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
        <button
            onClick={(e) => this.handleItemClick(e, 'sign-in')}
        >
          sign-in
        </button>
        <button
            onClick={(e) => this.handleItemClick(e, 'sign-out')}
        >
          sign-out
        </button>
      </div>
    )
  }
}
export default App
