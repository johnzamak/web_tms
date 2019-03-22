import React, { Component } from 'react';
import * as bs4 from "reactstrap"
import * as MdIcon from 'react-icons/lib/md'
import './style-lg.css'
import { connect } from 'react-redux'
import moment from 'moment';

class EventCalendar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            event: [],
            messID: '',
            messName: '',
            type_mess: '',
            start: '',
            end: '',
            Source: '',
            Destination: '',
            Description: '',
            car_type: '',
            car_license: '',
            color: ''
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
                this.get_event(this, this.state.event)
        })
    }
    get_event(self, event) {
        console.log("nextPropsEvent", event)

        var start = (moment(event.start).format('DD-MM-YYYY HH:mm'))
        var end = (moment(event.end).format('DD-MM-YYYY HH:mm'))

        self.setState({
            messID: event.title,
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

    render() {
        return (
            <div>
                <bs4.Modal isOpen={this.state.modal} toggle={this.toggle}>
                    <bs4.ModalHeader toggle={this.toggle}>{/* <MdIcon.MdGrade className="iconlg" color={this.state.color} size='40px'/>&nbsp;&nbsp;&nbsp; */}{this.state.messID} ({this.state.type_mess})</bs4.ModalHeader>
                    <bs4.ModalBody>
                        <bs4.FormGroup row>
                            <MdIcon.MdLocalShipping className="iconlg" color="black" style={{ marginLeft: "25px" ,marginRight:"10px" }}/>
                                <p>ประเภทรถ<b style={{ marginLeft: "70px" }}>{this.state.car_type}</b></p>
                        </bs4.FormGroup>
                        <bs4.FormGroup row>
                            <MdIcon.MdLabel className="iconlg" color="orange" style={{ marginLeft: "25px" ,marginRight:"10px" }}/>
                                <p>เลขทะเบียน<b style={{ marginLeft: "60px" }}>{this.state.car_license}</b></p>
                        </bs4.FormGroup>
                        <bs4.FormGroup row>
                            <MdIcon.MdRoom className="iconlg" color="blue" style={{ marginLeft: "25px" ,marginRight:"10px" }}/>
                                <p>ต้นทาง<b style={{ marginLeft: "86px" }}>{this.state.Source}</b></p>
                        </bs4.FormGroup>
                        <bs4.FormGroup row>
                            <MdIcon.MdRoom className="iconlg" color="green" style={{ marginLeft: "25px" ,marginRight:"10px" }}/>
                                <p>ปลายทาง<b style={{ marginLeft: "73px" }}>{this.state.Destination}</b></p>
                        </bs4.FormGroup>
                        <bs4.FormGroup row>
                            <MdIcon.MdEventAvailable className="iconlg" color="black" style={{ marginLeft: "25px" ,marginRight:"10px" }}/>
                                <p>วันที่<b style={{ marginLeft: "101px" }}>{this.state.start}</b>&nbsp;&nbsp;&nbsp;ถึง&nbsp;&nbsp;&nbsp;<b>{this.state.end}</b></p>
                        </bs4.FormGroup>
                        <bs4.FormGroup row>
                            <MdIcon.MdWarning className="iconlg" color="red" style={{ marginLeft: "25px" ,marginRight:"10px" }}/>
                                <p>คำอธิบายเพิ่มเติม<b style={{ marginLeft: "27px" }}>{this.state.Description}</b></p>
                        </bs4.FormGroup>
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