import React, { Component } from 'react';
import './App.css';
import axios from 'axios';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import ApiCalendar from 'react-google-calendar-api';

import Jumbotron from 'react-bootstrap/Jumbotron';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button'
import Navbar from 'react-bootstrap/Navbar'
import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'
import Nav from 'react-bootstrap/Nav'
import Badge from 'react-bootstrap/Badge'

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
      rowData: [],
      isLoggedIn : false
    }

    this.handleClick      = this.handleClick.bind(this);
    this.handleChange     = this.handleChange.bind(this);
    this.addRowData       = this.addRowData.bind(this);
    //google cal
    this.handleSignIn     = this.handleSignIn.bind(this);
    this.handleSignOut    = this.handleSignOut.bind(this);
    this.showAllEvents    = this.showAllEvents.bind(this);

    //helpers for adding events
    this.buildEvent = this.buildEvent.bind(this);
  }

  showAllEvents(){
    alert("Adding dates to calendar!")
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
    var dateStringStart = d.toISOString();
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
    ApiCalendar.handleAuthClick()
    this.setState({isLoggedIn: true})
  }

  handleSignOut()
  {
    ApiCalendar.handleSignoutClick();
    this.setState({isLoggedIn: false})
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
    this.setState({value: event.target.value.toUpperCase()});
  }

  onGridReady = params => {
   params.api.sizeColumnsToFit();
 };

  render () {
    const isLoggedIn = this.state.isLoggedIn;
    let button;
    let body;
    if (!isLoggedIn) {
        button =
        <Button variant="primary"
                size="lg"
                class="login"
                type="submit"
                onClick={this.handleSignIn}
                active
        >
        <i class="fa fa-google"></i> Sign in with Google
        </Button>
    } else {
      body =
        <div class="header">
          <h2><i class="fa fa-search"></i> Select Stock Tickers</h2>
          <InputGroup className="mb-3" value={this.state.value} onChange={this.handleChange}>
            <InputGroup.Prepend>
              <Button
                variant="outline-secondary"
                onClick={this.handleClick}
                >Add</Button>
            </InputGroup.Prepend>
            <FormControl aria-describedby="basic-addon1" />
          </InputGroup>

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
          <Button variant="secondary" size="lg" onClick={this.showAllEvents} block>
            <i class="fa fa-calendar"></i> Add Events
          </Button>
          </div>
        </div>;

      }

    return(
      <>
      <link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet"/>
        <Navbar bg="dark" variant="dark">
          <Navbar.Brand>
            <img
              src="/logo192.png"
              width="30"
              height="30"
              className="d-inline-block align-top"
            />{' '}
            Dividend Calendar
          </Navbar.Brand>
        </Navbar>
        <Container className="p-3">
          <Jumbotron>
            {button}
            {body}
          </Jumbotron>
        </Container>
        <footer className='footer mt-auto py-3 bg-dark text-white'>
          <div className='container'>
            <Nav
              activeKey="/home"
              onSelect={(selectedKey) => window.open(selectedKey)}
            >
              <Nav.Item>
                <Nav.Link disabled>
                <img
                  src="/GitHub-Mark-Light-64px.png"
                  width="30"
                  height="30"
                  />
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="https://github.com/samdis/DividendCalendar_Frontend">Frontend</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="https://github.com/samdis/DividenCalendar_Backend">Backend</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="https://github.com/samdis/DividendCalendar_ETL"> ETL </Nav.Link>
              </Nav.Item>
            </Nav>
          </div>
        </footer>
      </>
    )
  }

}
export default App
