import React, { Component } from 'react';
import * as bs4 from "reactstrap"
import * as MdIcon from 'react-icons/lib/md'
import { connect } from 'react-redux'
import moment from 'moment';
import DatePicker from 'react-datepicker';

import MonitorRight from "./MonitorRight"
import MonitorLeft from "./MonitorLeft"
import MonitorBelow from "./MonitorBelow"

class monitor2 extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: {
        start: moment(),
        end: moment(),
        group: 'ALL'
      },
      dateStart: moment(),
      dateEnd: moment(),
      group: 'ALL',
    }
  }

  onChangeForm = (id, data) => {
    this.setState({ [id]: data }, () => {
      console.log('state', this.state)
    })
  }

  onSearch = () => {
    localStorage.setItem('statusL','true')
    localStorage.setItem('statusR','true')
    localStorage.setItem('statusB','true')

    var start = moment(this.state.dateStart).format('YYYY-MM-DD')
    var end = moment(this.state.dateEnd).format('YYYY-MM-DD')
    var group = this.state.group

    this.setState({
      data: {
        start: start,
        end: end,
        group: group
      }
    }, () => {
      console.log('_props', this.state.data)
    })
  }

  render() {
    return (
      <div >
        <bs4.Container className="bgContainer-White" fluid>

        <bs4.FormGroup row style={{ margin: "30px"}}>
            <bs4.Label style={{ fontWeight: "500", fontSize: "16px", margin: "10px 20px 0px 20px" }} >วันที่เริ่มต้น</bs4.Label>
            <DatePicker
              dateFormat="YYYY-MM-DD"
              selected={this.state.dateStart}
              onChange={(date) => this.onChangeForm('dateStart', date)}
            />
            <bs4.Label style={{ fontWeight: "500", fontSize: "16px", margin: "10px 20px 0px 20px" }} >วันที่สิ้นสุด</bs4.Label>
            <DatePicker
              dateFormat="YYYY-MM-DD"
              selected={this.state.dateEnd}
              onChange={(date) => this.onChangeForm('dateEnd', date)}
            />
            <bs4.Label style={{ fontWeight: "500", fontSize: "16px", margin: "10px 20px 0px 50px" }} >Select</bs4.Label>
            <bs4.Col sm='4'>
              <bs4.Input type="select" name="group" id="exampleSelect" onChange={(e) => this.onChangeForm(e.target.name, e.target.value)}>
                <option value='ALL'>ALL</option>
                <option value='Order DL กทม.'>Dealer-กรุงเทพฯ</option>
                <option value='Order DL ตจว.'>Dealer-ต่างจังหวัด</option>
                <option value='Order CV กทม.'>Cashvan-กรุงเทพฯ</option>
                <option value='Order CV ตจว.'>Cashvan-ต่างจังหวัด</option>
                <option value='Order Express'>Express</option>
                <option value='Order Trade1'>Trade1</option>
                <option value='Order Trade2'>Trade2</option>
                <option value='Online'>Online</option>
                <option value='Claim'>Claim</option>
                <option value='Other'>Other</option>
                {/* <option value='Claim'>Claim</option> */}
              </bs4.Input>
            </bs4.Col>
            <bs4.Button style={{ marginLeft: "20px" }} color="info" onClick={this.onSearch} > SEARCH</bs4.Button>
          </bs4.FormGroup>

          <bs4.FormGroup row style={{ margin: "0px" }}>
            <bs4.Col sm='5'>
              <MonitorLeft data={this.state.data}/>
            </bs4.Col>
            <bs4.Col sm='7'>
              <MonitorRight data={this.state.data}/>
            </bs4.Col>
            <bs4.Col sm='12'>
              <MonitorBelow data={this.state.data}/>
            </bs4.Col>
          </bs4.FormGroup>
        </bs4.Container>
      </div>
    );
  }
}

function mapStateToProps(state) {
  console.log(state)
  return state
}
export default connect(mapStateToProps)(monitor2);
