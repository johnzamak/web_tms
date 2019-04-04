import React, { Component } from 'react';
import Header from '../components/Header/Header'
import Menu from '../components/Menu/Menu'

class App extends Component {
  render() {
    var test = this.props.children.props.location.pathname
    var c_addRate = false, c_alreadyRate = false, monitor1 = false, monitor2 = false, monitor3 = false
    if (test.match("/rate/addRate") === null) { c_addRate = false } else if (test.match("/rate/addRate").length > 0) { c_addRate = true }
    if (test.match("/rate/already_Rate") === null) { c_alreadyRate = false } else if (test.match("/rate/already_Rate").length > 0) { c_alreadyRate = true }
    if (test.match("/monitor/monitor1") === null) { monitor1 = false } else if (test.match("/monitor/monitor1").length > 0) { monitor1 = true }
    if (test.match("/monitor/monitor2") === null) { monitor2 = false } else if (test.match("/monitor/monitor2").length > 0) { monitor2 = true }
    if (test.match("/monitor/monitor3") === null) { monitor3 = false } else if (test.match("/monitor/monitor3").length > 0) { monitor3 = true }
    console.log("test", c_addRate,c_alreadyRate)
    return (
      <div className="App">
        <div id="react-no-print">
          {(this.props.children.props.location.pathname == "/") || monitor1 == true || monitor2 == true || monitor3 == true ? "" : <Header />}
          {(this.props.children.props.location.pathname == "/" || c_addRate == true || c_alreadyRate == true || monitor1 == true || monitor2 == true || monitor3 == true) ? "" : <Menu />}
        </div>
        {this.props.children}
      </div>
    );
  }
}

export default App;