import React, { Component } from 'react';
import Header from '../components/Header/Header'
import Menu from '../components/Menu/Menu'

class App extends Component {
  render() {
    var test = this.props.children.props.location.pathname
    var c_addRate = false, c_alreadyRate = false
    if (test.match("/rate/addRate") === null) { c_addRate = false } else if (test.match("/rate/addRate").length > 0) { c_addRate = true }
    if (test.match("/rate/already_Rate") === null) { c_alreadyRate = false } else if (test.match("/rate/already_Rate").length > 0) { c_alreadyRate = true }
    console.log("test", c_addRate,c_alreadyRate)
    return (
      <div className="App">
        <div id="react-no-print">
          {(this.props.children.props.location.pathname == "/") ? "" : <Header />}
          {(this.props.children.props.location.pathname == "/" || c_addRate == true || c_alreadyRate == true) ? "" : <Menu />}
        </div>
        {this.props.children}
      </div>
    );
  }
}

export default App;