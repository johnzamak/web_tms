import React, { Component } from 'react';
import * as bs4 from "reactstrap"
import * as MdIcon from 'react-icons/lib/md'
import './style-lg.css'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router';
import moment from 'moment';
import { is_loader } from '../../actions'
const stringify = require('json-stringify-safe')
const { proxy } = require('../../service')

class EventCalendar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            title: '',
            messName: '',
            type_mess: '',
            start: '',
            end: '',
            Source: '',
            Destination: '',
            Description: '',
            car_type: '',
            car_license: '',
            color: '',
            event: ''
        };
        this.toggle = this.toggle.bind(this);
    }

    toggle() {
        this.setState({
            modal: !this.state.modal
        });
    }

    componentWillReceiveProps(nextProps) {
        //console.log("nextProps", nextProps)
        this.setState({
            modal: nextProps.data.is_open,
            event: nextProps.data.event
        }, () => {
            if (this.state.modal)
                console.log("event", this.state.event)
            this.get_event(this, this.state.event)
        })
    }
    get_event(self, event) {
        console.log("nextPropsEvent", event)

        var start = (moment(event.start).format('DD-MM-YYYY HH:mm'))
        var end = (moment(event.end).format('DD-MM-YYYY HH:mm'))
        var title = event.title.split(" ")

        self.setState({
            title: title[2] + ' ' + title[3] + ' ' + title[4],
            messName: event.messName,
            type_mess: event.type_mess,
            start: start,
            end: end,
            Source: event.Source,
            Destination: event.destination,
            Description: event.description,
            car_type: event.car_type,
            car_license: event.car_license,
            color: event.color
        }, () => {
            console.log("checkState", this.state)
        })
    }

    onDelete_task = () => {
        if (window.confirm('กรุณายืนยันการลบข้อมูล')) {
            console.log('document_no', this.state.event.document_no)

            var props = this.props
            props.dispatch(is_loader(true))

            var data_send = []
            data_send.push(this.state.event.document_no)
            let url = proxy.main + "calendar/delete-task/"
            console.log('url',url)
            fetch(url, {
                method: "DELETE",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json;charset=utf-8"
                },
                body: JSON.stringify(data_send)
            })
                .then(response => response.json())
                .then((responseJson) => {
                    props.dispatch(is_loader(false))
                    console.log("responseJson", responseJson)
                    if (responseJson.status === 200) {
                        alert('ลบข้อมูลสำเร็จ')
                        window.location.href = '/timeable/calendar'
                    } else {
                        alert("ไม่สามารถลบข้อมูลได้ กรุณาลองใหม่")
                    }
                })
                .catch((error) => {
                    props.dispatch(is_loader(false))
                    console.log("err", error)
                })
        }
    }

    onEdit_task = () => {
        localStorage.setItem('edit_task', this.state.event.document_no)
        browserHistory.push('/timeable/editTimeable')
    }

    render() {
        return (
            <div>
                <bs4.Modal isOpen={this.state.modal} toggle={this.toggle}>
                    <bs4.ModalHeader toggle={this.toggle}>{this.state.title} ({this.state.type_mess})</bs4.ModalHeader>
                    <bs4.ModalBody style={{ fontSize: "15px", fontWeight: "600" }}>
                        <bs4.FormGroup row>
                            <MdIcon.MdLocalShipping className="iconlg" color="black" style={{ marginLeft: "25px", marginRight: "10px" }} />
                            <p>ประเภทรถ<b style={{ marginLeft: "72px" }}>{this.state.car_type}</b></p>
                        </bs4.FormGroup>
                        <bs4.FormGroup row>
                            <MdIcon.MdLabel className="iconlg" color="orange" style={{ marginLeft: "25px", marginRight: "10px" }} />
                            <p>เลขทะเบียน<b style={{ marginLeft: "62px" }}>{this.state.car_license}</b></p>
                        </bs4.FormGroup>
                        <bs4.FormGroup row>
                            <MdIcon.MdRoom className="iconlg" color="blue" style={{ marginLeft: "25px", marginRight: "10px" }} />
                            <p>ต้นทาง<b style={{ marginLeft: "94px" }}>{this.state.Source}</b></p>
                        </bs4.FormGroup>
                        <bs4.FormGroup row>
                            <MdIcon.MdRoom className="iconlg" color="green" style={{ marginLeft: "25px", marginRight: "10px" }} />
                            <p>ปลายทาง<b style={{ marginLeft: "78px" }}>{this.state.Destination}</b></p>
                        </bs4.FormGroup>
                        <bs4.FormGroup row>
                            <MdIcon.MdEventAvailable className="iconlg" color="black" style={{ marginLeft: "25px", marginRight: "10px" }} />
                            <p>วันที่<b style={{ marginLeft: "115px" }}>{this.state.start}</b>&nbsp;&nbsp;&nbsp;ถึง&nbsp;&nbsp;&nbsp;<b>{this.state.end}</b></p>
                        </bs4.FormGroup>
                        <bs4.FormGroup row>
                            <MdIcon.MdWarning className="iconlg" color="red" style={{ marginLeft: "25px", marginRight: "10px" }} />
                            <p>คำอธิบายเพิ่มเติม<b style={{ marginLeft: "27px" }}>{this.state.Description}</b></p>
                        </bs4.FormGroup>
                        <bs4.Row>
                            <bs4.Col xs="2" >
                                <bs4.Button color="warning" onClick={this.onEdit_task} > <MdIcon.MdCreate className="iconlg" /> EDIT</bs4.Button>
                            </bs4.Col>
                            <bs4.Col xs="3" >
                                <bs4.Button color="danger" onClick={this.onDelete_task} > <MdIcon.MdDelete className="iconlg" /> DELETE</bs4.Button>
                            </bs4.Col>
                        </bs4.Row>
                    </bs4.ModalBody>
                </bs4.Modal>
            </div>
        );
    }
}
function mapStateToProps(state) {
    console.log(state)
    return state
}
export default connect(mapStateToProps)(EventCalendar);