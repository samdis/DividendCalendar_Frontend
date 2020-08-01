import React, { Component } from 'react'
import './App.css'
import axios from 'axios'

class App extends Component {
  constructor(){
    super()
    this.state = {
      value: '',
      ticker: ''
    }

    this.handleClick = this.handleClick.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  handleClick(){
    axios.get('http://localhost:8080/dividends/getByTicker?ticker=' + this.state.value)
    .then(response => this.setState({ticker: response.data.ticker}))
    alert(this.state.ticker)
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
        <p>{this.state.ticker}</p>
      </form>
    )
  }
}
export default App
