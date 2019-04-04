import React, { Component } from 'react';
import * as bs4 from "reactstrap"
import moment from 'moment'
const { proxy, public_function } = require("../../service")

var arrStatusSOEN = { '0': 'Open', '1': 'Stock', '2': 'Credit', '3': 'Release' };

var arrColor_Tracking = {
  "0": "Tomato",
  "1": "Turquoise",//PICKINGROUTEID
  "2": "Yellow",//StampPickStart
  "3": "Lime",//StampPickStop
  "4": "Yellow",//StampCheckStart
  "5": "Lime",//StampCheckStop
  "6": "DodgerBlue",//INVOICEID
  "7": "RoyalBlue",//Receive
  "8": "SlateBlue",//Assign
  "9": "SkyBlue",//Trip
  "10": "YellowGreen",//Sent  1
  "11": "PaleGreen",//Sent  2
};
var arrTracking = {
  "0": "Waiting",
  "1": "Picking list",//PICKINGROUTEID
  "2": "Start pick",//StampPickStart
  "3": "Finish Pick",//StampPickStop
  "4": "Start Check",//StampCheckStart
  "5": "Finish Check",//StampCheckStop
  "6": "Invoice",//INVOICEID
  "7": "Received",//Receive
  "8": "Assignment",//Assign
  "9": "Delivery",//Trip
  "10": "Back order",//Sent  1
  "11": "Finish",//Sent  2
};
function fnCalTracking(PICKINGROUTEID, StampPickStart, StampPickStop, StampCheckStart, StampCheckStop, INVOICEID, Receive, Assign, Trip, Sent, Qty_B) {
  var ret = 0;
  var data = "";
  var arrDataChk =
    [
      "Default", PICKINGROUTEID, StampPickStart, StampPickStop, StampCheckStart, StampCheckStop, INVOICEID, Receive, Assign, Trip, Sent/*10*/
    ];
  var len = arrDataChk.length - 1;
  // console.log(arrDataChk , len)
  if (!(Sent === "" || Sent === null)) {
    ret = (Qty_B > 0) ? "10" : "11";
    data = Sent;
  } else {
    for (var i = len; i >= 0; i--) {
      // console.log(i,arrDataChk[i])
      if (!(arrDataChk[i] === "" || arrDataChk[i] === null)) {
        ret = i;
        data = arrDataChk[i];
        // if(i === 6 || i === 7 || i === 8) console.log('AAA',INVOICEID,Receive, Assign, Trip,)
        break;
      }
    }
  }
  return { 'code': ret, 'value': data };
}

class MonitorBelow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataTable: '',
      start: '',
      end: '',
      group: 'ALL'
    }
  }

  componentDidMount = () => {
    this.getData('', '', '')
  }

  componentWillReceiveProps(nextProps) {
    var result = localStorage.getItem('statusB')
    console.log("result", result)

    if (result === 'true') {
      localStorage.setItem('statusB', 'false')
      console.log('nextProps', nextProps)

      var start = nextProps.data.start
      var end = nextProps.data.end
      var group = nextProps.data.group

      this.getData(start, end, group)
    }
  }

  getData = (start, end, group) => {

    if (start === '') {
      start = moment().format('YYYY-MM-DD')
      end = moment().format('YYYY-MM-DD')
      group = 'ALL'
    }

    var arrReport = []
    var Tracking = "", TrackingObj = {};
    var statusSoColor = ""

    var url = proxy.main + 'monitor/get_data_monitorBelow/' + start + '&' + end + '&' + group
    console.log('----Below', url)

    fetch(url)
      .then(Response => Response.json())
      .then((responseJson) => {
        console.log("responseJsonBelow", responseJson.result)
        if (responseJson.status === 200) {
          responseJson.result.forEach(function (val, i) {
            TrackingObj = fnCalTracking(val.PICKINGROUTEID, val.StampPickStart, val.StampPickStop, val.StampCheckStart, val.StampCheckStop,
              val.INVOICEID, val.Receive, val.Assign, val.Trip, val.Sent, val.Qty_B)
            Tracking = arrTracking[TrackingObj.code]
            statusSoColor = (val.DPL_SO_STATUS == 3) ? "lime" : (val.DPL_SO_STATUS == 2) ? "tomato" : "orange";

            if (Tracking === 'Finish Pick') {
              arrReport.push(
                <tr>
                  <td align="center" style={{ 'background-color': statusSoColor }}>{arrStatusSOEN[val.DPL_SO_STATUS]}</td>
                  <td align="center" style={{ 'background-color': arrColor_Tracking[TrackingObj.code], }} title={TrackingObj.value}>{Tracking}</td>
                  <td align="center" nowrap="nowrap" title={val.Remark}>{val.No_}</td>
                  <td align="left" title={val.CUSTACCOUNT}>{val.Name}</td>
                  <td align="center" >{val.OrderGroupName}</td>
                  <td align="right">{val.Qty_SO}</td>
                  <td align="right">{val.Qty_B}</td>
                  <td align="center">{val.DLV_Date}</td>
                  <td align="right">{val.Qty_Inv}</td>
                </tr>
              )
            }
          }, this)

          this.setState({ dataTable: arrReport }, () => {
            //console.log('dataTable',this.state.dataTable)
          })
        } else {
          alert("มีข้อผิดพลาดเกิดขึ้น กรุณาลองใหม่")
        }
      })
  }

  render() {
    return (
      <div>
        <bs4.Container className="bgContainer-White" fluid>
          <bs4.Table striped bordered hover >
            <thead style={{ textAlign: 'center' }}>
              <tr>
                <th width="7%">Status SO</th>
                <th>Tracking</th>
                <th>Document</th>
                <th>Customer Name</th>
                <th>Group</th>
                <th>Order</th>
                <th>B.Order</th>
                <th>Delivery</th>
                <th>Qty</th>
              </tr>
            </thead>
            <tbody>
              {this.state.dataTable}
            </tbody>
          </bs4.Table>
        </bs4.Container>
      </div>
    );
  }
}

export default MonitorBelow;
