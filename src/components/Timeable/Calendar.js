import React, { Component } from 'react';
import * as bs4 from "reactstrap"
import * as MdIcon from 'react-icons/lib/md'
import { connect } from 'react-redux'
import moment from 'moment';
//import FullCalendar from 'fullcalendar-reactwrapper'
import 'fullcalendar/dist/fullcalendar.css';
import 'fullcalendar/dist/fullcalendar.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import EventCalendar from '../Modal/EventCalendar'
const $ = require("jquery")
const { proxy } = require("../../service")


var divStyle = {
    padding: '10px',
    fontSize: '16px',
    fontWeight: '600',
    color: "rgb()"
};

class Calendar extends Component {
    constructor(props) {
        super(props)
        this.state = {
            action: [],
            modal_event: {
                is_open: false,
                event: [],
                next: ''
            },
            month: moment().month() + 1,
            dDate: moment()
        }
    }

    componentDidMount() {
        console.log('1')
        this.callApi_GetCalendar()
    }

    destroy = () => {
        $('#calendar').fullCalendar('destroy')
        this.callApi_GetCalendar()
    }

    callApi_GetCalendar = () => {
        var lastDate = moment().endOf('month').format('DD')
        var month = this.state.month
        var year = moment().format('YYYY')
        console.log('2lastDate', lastDate)
        console.log('3month', month)
        var arr = []
        var url = proxy.main + 'calendar/get-all-calendar/' + year + '-' + month + '-01&' + year + '-' + month + '-' + lastDate
        console.log(url)
        fetch(url)
            .then(response => response.json())
            .then((responseJson) => {
                if (!responseJson.result) {
                    console.log("not found")
                } else {
                    console.log("4responseJson", responseJson.result)
                    responseJson.result.forEach(function (val, i) {
                        var type_messArr = val.mess_code.split("_")
                        var start_date = val.start_date.split("T")
                        var start = start_date[1].split(":")
                        var end_date = val.end_date.split("T")
                        var end = end_date[1].split(":")
                        var car_license = val.car_license.split("")
                        var car = car_license.reverse()

                        var x = Math.floor(('0.'+car[0]+car[1]+car[2]+car[3]) * 256)
                        var y = Math.floor(('0.'+car[1]+car[2]+car[3]+car[0]) * 256)
                        var z = Math.floor(('0.'+car[2]+car[3]+car[0]+car[1]) * 256)
                        var bgColor = "rgb(" + x + "," + y + "," + z + ")"

                        var events = {
                            title: '- ' + end[0] + ':' + end[1] + ' ' + val.car_license + ' ' + val.MessName,
                            description: val.remark,
                            Source: val.start_point,
                            destination: val.end_point,
                            start: start_date[0] + ' ' + start[0] + ':' + start[1],
                            end: end_date[0] + ' ' + end[0] + ':' + end[1],
                            car_license: val.car_license,
                            car_type: val.car_type,
                            type_mess: type_messArr[0] === 'MCV'?'Cashvan':'Dealer',
                            document_no: val.document_no,
                            color: bgColor,
                        }
                        arr.push(events)
                    })

                    this.setState({ action: arr }, () => {
                        console.log("5checkAction", this.state.action)
                        this.showData()
                    })
                }
            })
    }

    showData = () => {

        // $('#calendar').fullCalendar('destroy')
        console.log('6', this.state.action)
        $('#calendar').fullCalendar({

            customButtons: {
                myButtonNext: {
                    icon: 'right-single-arrow',
                    click: function () {
                        $('#calendar').fullCalendar('destroy')
                        var month = moment(this.state.dDate).add(1, "M")
                        var getMonth = this.state.month + 1
                        this.setState({ dDate: month, month: getMonth }, () => {
                            this.callApi_GetCalendar()
                        })

                    }.bind(this)
                },
                myButtonPrev: {
                    icon: 'left-single-arrow',
                    click: function () {
                        $('#calendar').fullCalendar('destroy')
                        var month = moment(this.state.dDate).add(-1, "M")
                        var getMonth = this.state.month - 1
                        this.setState({ dDate: month, month: getMonth }, () => {
                            this.callApi_GetCalendar()
                        })
                    }.bind(this)
                }
            },
            header: {
                right: 'myButtonPrev,myButtonNext, month,basicWeek,basicDay',
                left: 'title',
            },
            height: 1000,
            contentHeight: 700,
            defaultDate: this.state.dDate,
            navLinks: true, // can click day/week names to navigate views
            editable: true,
            eventLimit: true, // allow "more" link when too many events
            events: this.state.action,
            eventTextColor: '#FFFFFF',
            timeFormat: 'HH:mm',
            eventClick: function (event, element) {
                if (event) {
                    this.hendleClick(event)
                }
            }.bind(this)
        })
    }


    hendleClick = (event) => {
        console.log('event----', event)

        this.setState({
            modal_event: { is_open: true, event: event }
        })
    }

    render() {
        return (
            <div>
                <bs4.Container className="bgContainer-White" fluid>
                    <bs4.Row inline style={{ padding: '20px' }} >
                        <bs4.Col sm="6" >
                            <bs4.Row>
                                <div style={{ fontSize: "22px", fontWeight: "800" }} >ปฎิทินแสดงรอบรถบริษัท</div>
                                <bs4.Button outline color="primary" style={{ marginLeft: "20px" }} href={"/timeable/addTimeable"}>+เพิ่มรอบรถ</bs4.Button>
                            </bs4.Row>
                        </bs4.Col>
                        {/* <bs4.Col sm={{ size: 6 }}>
                            <bs4.Row inline style={{ float: "right" }} >
                                <MdIcon.MdBrightness1 className="iconlg" color="rgb(0, 217, 255)" />
                                <p style={{ marginLeft: "10px", fontSize: "17px", fontWeight: "600" }}>Meessenger Cashvan</p>
                                <MdIcon.MdBrightness1 className="iconlg" color="rgb(255, 251, 0)" style={{ marginLeft: "20px" }} />
                                <p style={{ marginLeft: "10px", fontSize: "17px", fontWeight: "600" }}>Meessenger Dealer</p>
                            </bs4.Row>
                        </bs4.Col> */}
                    </bs4.Row>

                    <bs4.Row>
                        <div style={divStyle}>
                            <div id="calendar" />
                        </div>
                    </bs4.Row>
                </bs4.Container>

                <EventCalendar data={this.state.modal_event} />
            </div >
        );
    }
}

function mapStateToProps(state) {
    console.log(state)
    return state
}
export default connect(mapStateToProps)(Calendar);