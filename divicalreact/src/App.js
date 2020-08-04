import React, { Component } from 'react';
import './App.css';
import axios from 'axios';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import ApiCalendar from 'react-google-calendar-api';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Container from 'react-bootstrap/Container';


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

    this.handleClick      = this.handleClick.bind(this);
    this.handleChange     = this.handleChange.bind(this);
    this.addRowData       = this.addRowData.bind(this);
    //google cal
    this.handleSignIn     = this.handleSignIn.bind(this);
    this.handleSignOut    = this.handleSignOut.bind(this);
    this.createEvent      = this.createEvent.bind(this);
    this.showAllEvents    = this.showAllEvents.bind(this);

    //helpers for adding events
    this.buildEvent = this.buildEvent.bind(this);
  }

  showAllEvents(){
    alert("Adding dates to calendar!")
    var events = [];
    var rowDataLoc = this.state.rowData;
    rowDataLoc.forEach((value, i) => {
      console.log(value.ticker);
      var dateArray = value.dates.split(',');
      dateArray.forEach((date, i) => {
        console.log(date);
        this.buildEvent(value.ticker, date);
      });
    });
  }

  buildEvent(summary, date){
    var tz = "America/New_York";
    var d = new Date(date);
    var dateStringStart = d.toISOString();//.slice(0,10);
    d.setDate(d.getDate() + 1);
    var dateStringEnd = d.toISOString();
    var event = {
      summary,
      description : "Ex-dividend date",
      start :{
        dateTime : dateStringStart,
        timeZone: tz,
      },
      end: {
        dateTime : dateStringEnd,
        timeZone : tz,
      }
    };
    console.log(event);
    ApiCalendar.createEvent(event).then((result: object) => {
      console.log(result);
        })
     .catch((error: any) => {
       console.log(error);
        });
  }



  handleClick(){
    axios.get('https://dividendcalendar.ml/api/dividends/getByTicker?ticker=' + this.state.value)
    .then(response => { console.log(response);
                        this.addRowData(response);
                      });
  }

  handleSignIn()
  {
    ApiCalendar.handleAuthClick();
  }

  handleSignOut()
  {
    ApiCalendar.handleSignoutClick();
    alert("Signed out!")
  }

  addRowData(response)
  {
  if(response.status == 200 && response.data.dates.length != 0){
    this.setState({
      rowData : this.state.rowData.concat({ticker:response.data.ticker, dates:response.data.dates.toString()})
    });
  }else{
    alert("No dates found")
  }
    console.log(this.state.rowData);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  createEvent()
  {
    ApiCalendar.createEventFromNow({
      summary: "test event",
      time: 480
    }).then((result : object) => {
      console.log(result)
    })
    .catch((error: any) => {
      console.console.log(error);
    })
  }

  onGridReady = params => {
   params.api.sizeColumnsToFit();
 };

  render () {
    return (
        <Container className="p-3">
        <Jumbotron>
        <label>
          Name:
          <input type="text" value={this.state.value} onChange={this.handleChange} />
        </label>
        <button className='button' onClick={this.handleClick}>Click Me</button>
        <div
            className="ag-theme-alpine"
            style={{
            height: '250px',
            width: '100%' }}
            >
          <AgGridReact
            columnDefs={this.state.columnDefs}
            rowData={this.state.rowData}
             onGridReady={this.onGridReady.bind(this)}>
          </AgGridReact>
        </div>
        <div>
        <button onClick={this.handleSignIn}>
          sign-in
        </button>
        <button onClick={this.handleSignOut}>
          sign-out
        </button>
        <button onClick={this.createEvent}>
          create test event
        </button>
        <button onClick={this.showAllEvents}>
          Add events to calendar
        </button>
        </div>
        <div class="footer">
        	<div class="card">
            <div class="container">
              <a href="https://github.com/samdis/DividendCalendar_Frontend"> Frontend </a>
            </div>
          </div>
      		<div class="card">
            <div class="container">
              <a href="https://github.com/samdis/DividenCalendar_Backend"> Backend </a>
            </div>
        	</div>
      		<div class="card">
            <div class="container">
              <a href="https://github.com/samdis/DividendCalendar_ETL"> ETL </a>
            </div>
          </div>
        </div>
        </Jumbotron>
        </Container>
    )
  }
}
export default App
