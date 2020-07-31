import React, { Component } from 'react'
import './App.css'
import axios from 'axios'

class App extends Component {
  constructor(){
    super()
    this.state = {
      ticker: '',
      value: ''
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  handleSubmit(){
    axios.get('http://localhost:8080/dividends/getByTicker?ticker='+this.state.value)
      .then(response => console.log(response.data.ticker))
      //      .then(response => this.setState({ticker: response.data.ticker}))
      console.log(this.state.ticker)
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  render () {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Name:
          <input type="text" value={this.state.value} onChange={this.handleChange} />
        </label>
        <input type="submit" value="Submit" />
      </form>
    )
  }
}
export default App
