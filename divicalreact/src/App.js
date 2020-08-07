import React, { Component } from 'react';
import './App.css';
//Axios
import axios from 'axios';
//AG Grid
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
//Google Calendar API
import ApiCalendar from 'react-google-calendar-api';
//Bootstrap
import Jumbotron    from 'react-bootstrap/Jumbotron';
import Container    from 'react-bootstrap/Container';
import Button       from 'react-bootstrap/Button'
import Navbar       from 'react-bootstrap/Navbar'
import InputGroup   from 'react-bootstrap/InputGroup'
import FormControl  from 'react-bootstrap/FormControl'
import Nav          from 'react-bootstrap/Nav'
import Badge        from 'react-bootstrap/Badge'
import Popover        from 'react-bootstrap/Popover'
import OverlayTrigger        from 'react-bootstrap/OverlayTrigger'


import ReactGA from 'react-ga';
ReactGA.initialize('UA-174773976-1');
ReactGA.pageview(window.location.pathname + window.location.search);

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
        headerName: "Ex-Dividend Date", field: "dates"
      }],
      rowData: [],
      isLoggedIn : false
    }

    this.handleAddAndClear      = this.handleAddAndClear.bind(this);
    this.handleChange     = this.handleChange.bind(this);
    this.addRowData       = this.addRowData.bind(this);
    //google cal
    this.handleSignIn     = this.handleSignIn.bind(this);
    this.handleSignOut    = this.handleSignOut.bind(this);
    this.showAllEvents    = this.showAllEvents.bind(this);
    this.resetValue       = this.resetValue.bind(this);
    this.handleAdd        = this.handleAdd.bind(this);

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
    this.setState({rowData : []});
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

  handleAdd(){
    if(!this.state.rowData.some(item => this.state.value === item.ticker))
    {
      axios.get('https://dividendcalendar.ml/api/dividends/getByTicker?ticker=' + this.state.value)
      .then(response => { console.log(response);
                          this.addRowData(response);
                        });
    }
    else {
      alert("Ticker already selected!");
    }
  }

  handleAddAndClear(){
    this.handleAdd();
    this.resetValue();
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

  handleChange(event) {
    this.setState({value: event.target.value.toUpperCase()});
  }

  resetValue(){
    this.setState({value : ""})
  }

  onGridReady = params => {
   params.api.sizeColumnsToFit();
  };

  pillClick(ticker){
    alert(ticker)
    this.state.ticker = ticker;
    alert(this.state.value);
    this.handleAddAndClear();
    //handleAdd;
  }

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
                block
        >
        <i class="fa fa-google"></i> Sign in with Google
        </Button>;
    } else {
      button =
        <div>
        <Button variant="primary" size="lg" onClick={this.showAllEvents} block>
          <i class="fa fa-calendar"></i> Add Events
        </Button>
        <Button variant="secondary" size="lg" onClick={this.handleSignOut} block>
          <i class="fa fa-google"></i> Sign out
        </Button>
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

          <Nav className="ml-auto">
          <OverlayTrigger
            trigger="click"
            key="bottom"
            placement="bottom"
            overlay={
              <Popover id={`popover-positioned-bottom`}>
                <Popover.Title as="h3">Help</Popover.Title>
                <Popover.Content>
                <strong>Welcome to dividend calendar</strong>
                  <ol type="1">
                    <li>Enter or select a stock ticker</li>
                    <li>Add ticker(s) to the list</li>
                    <li>Connect to your Google Calendar</li>
                    <li>Add ex-dividend date event(s) to your calendar</li>
                  </ol>
                </Popover.Content>
              </Popover>
            }
          >
            <Nav.Link>
              <i class="fa fa-question-circle fa-lg" aria-hidden="true"></i>

            </Nav.Link>
            </OverlayTrigger>
          </Nav>

        </Navbar>
        <Container className="p-3">
          <Jumbotron>
            <div class="header">
              <InputGroup className="t-3"
                          onChange={this.handleChange}>
                <InputGroup.Prepend>
                  <Button
                    variant="outline-primary"
                    onClick={this.handleAddAndClear}
                    >Add</Button>
                </InputGroup.Prepend>
                <FormControl aria-describedby="basic-addon1"
                              placeholder="Enter a stock ticker"
                              value={this.state.value}
                />
              </InputGroup>
              <ul class="nav nav-pills">
                <li class="nav-item">
                  <a class="nav-link clear" href="#" onClick={() => {this.setState({value: 'MSFT'}, this.handleAddAndClear)}}>
                    <Badge pill variant="secondary">MSFT</Badge>
                  </a>
                </li>
                <li class="nav-item">
                  <a class="nav-link clear" href="#" onClick={() => {this.setState({value: 'PFO'}, this.handleAddAndClear)}}>
                    <Badge pill variant="secondary">PFO</Badge>
                  </a>
                </li>
                <li class="nav-item">
                  <a class="nav-link clear" href="#" onClick={() => {this.setState({value: 'LMT'}, this.handleAddAndClear)}}>
                    <Badge pill variant="secondary">LMT</Badge>
                  </a>
                </li>
              </ul>
              <div
                  className="ag-theme-alpine"
                  style={{
                  height: '250px',
                  width: '100%' }}
                  >
                <AgGridReact
                  columnDefs={this.state.columnDefs}
                  rowData={this.state.rowData}
                   onGridReady={this.onGridReady.bind(this)}
                   >
                </AgGridReact>
              </div>
              <div>
              {button}
              </div>
            </div>
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
