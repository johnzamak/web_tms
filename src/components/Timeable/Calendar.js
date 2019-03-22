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
    padding: '10px'
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
        console.log('2lastDate', lastDate)
        console.log('3month', month)
        var arr = []
        var url = proxy.test + 'calendar/get-all-calendar/2019-' + month + '-01&2019-' + month + '-' + lastDate
        //var url = proxy.test + 'calendar/get-all-calendar/2019-6-01&2019-6-'+lastDate
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
                        var color
                        var type_mess

                        if (type_messArr[0] === 'MCV') {
                            color = 'rgb(0, 217, 255)' //blue
                            type_mess = 'Cashvan'
                        } else if (type_messArr[0] === 'MDL') {
                            color = 'rgb(255, 251, 0)' //yellow
                            type_mess = 'Dealer'
                        }

                        var events = {
                            title: val.MessNO + ' ' + val.MessName,
                            description: val.remark,
                            Source: val.start_point,
                            destination: val.end_point,
                            start: val.start_date,
                            end: val.end_date,
                            car_license: val.car_license,
                            car_type: val.car_type,
                            type_mess: type_mess,
                            color: color,
                        }
                        //console.log(events)
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
                        <div style={{ fontSize: "22px", fontWeight: "800" }} >ปฎิทินแสดงรอบรถบริษัท</div>
                        <bs4.Button outline color="primary" style={{ marginLeft: "20px" }} href={"/timeable/addTimeable"}>+เพิ่มรอบรถ</bs4.Button>

                        <bs4.Col sm={{ offset: 7 }}>
                            <bs4.Row inline>
                                <MdIcon.MdBrightness1 className="iconlg" color="rgb(0, 217, 255)" />
                                <p style={{ marginLeft: "10px" }}>Meessenger Cashvan</p>
                                <MdIcon.MdBrightness1 className="iconlg" color="rgb(255, 251, 0)" style={{ marginLeft: "20px" }}/>
                                <p style={{ marginLeft: "10px" }}>Meessenger Dealer</p>
                            </bs4.Row>
                        </bs4.Col>
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