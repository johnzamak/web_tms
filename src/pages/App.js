import React, { Component } from 'react';
import Header from '../components/Header/Header'
import Menu from '../components/Menu/Menu'

class App extends Component {
  render() {
    var test =this.props.children.props.location.pathname
    var c_rate=false
    if(test.match("/rate/addRate")===null){c_rate=false}else if(test.match("/rate/addRate").length>0){c_rate=true}
    console.log("test",test.match("/rate/"))
    return (
      <div className="App">
        <div id="react-no-print">
          {(this.props.children.props.location.pathname == "/") ? "" : <Header />}
          {(this.props.children.props.location.pathname == "/" || c_rate==true ) ? "" : <Menu />}
        </div>
        {this.props.children}
      </div>
    );
  }
}

export default App;