import React, { Component } from 'react';
import * as bs4 from "reactstrap"
import { connect } from 'react-redux'
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { TimePicker } from 'antd';
import "antd/dist/antd.css";
import Messsenger from '../../components/Modal/Messsenger';
import { is_loader } from '../../actions'

const { proxy } = require("../../service")
const moment = require("moment")
let minDate = new Date()
minDate.setDate(minDate.getDate() + 1 * 86400000)

Date.prototype.addDays = function (days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

var date = new Date();
const format = 'HH:mm';
var divStyle = {
    alignItems: 'center',
    padding: '50px',
};

let data_send = []

class Addtimeable extends Component {
    constructor(props) {
        super(props)
        this.state = {
            inData: {
                //messID:'',
                //messName: '',
                start_date: '',
                end_date: '',
                start_point: '',
                end_point: '',
                remark: '',
                car_type: '',
                car_license: '',
                //type_mess: '',
                mess_code: ''
            },
            modal_messsenger: {
                is_open: false,
                type_mess: "",
            },
            selecter: '',
            StartDate: moment(),
            StartTime: new Date(),
            EndDate: moment(),
            EndTime: new Date(),
            messID: '',
            messName: ''
        }
    }

    onChange_type_mess = (e) => {
        var type_mess = e.target.value

        // var data = this.state.inData
        // var  objinData = { 
        //     type_mess : type_mess
        // }

        // var inData = Object.assign(data, objinData);
        this.setState({
            //inData: inData,
            modal_messsenger: { is_open: true, type_mess: type_mess, }
        })
    }

    onChangeForm = (id, value) => {
        var data = this.state.inData
        var objinData = {
            [id]: value
        }

        var inData = Object.assign(data, objinData)
        this.setState({ inData: inData }, () => {
            console.log("checkData", this.state.inData)
            this.getCar()
        })
    }

    onChangeCar = (id, value) => {
        var arr = value.split(",")
        var type = arr[0]
        var license = arr[1]
        console.log('arr', arr)

        var data = this.state.inData
        var objinData = {
            car_type: type,
            car_license: license
        }

        var inData = Object.assign(data, objinData);
        this.setState({ inData: inData }, () => {
            console.log("checkData", this.state.inData)
        })
    }

    onChangeDateTime = (id, value) => {
        this.setState({ [id]: value }, () => {
            this.getCar()
        })
    }

    getCar = () => {
        var start = (moment(this.state.StartDate).format('YYYY-MM-DD')) + ' ' + (moment(this.state.StartTime).format('HH:mm'))
        var end = (moment(this.state.EndDate).format('YYYY-MM-DD')) + ' ' + (moment(this.state.EndTime).format('HH:mm'))
        var arr = []
        //var url = proxy.main + 'calendar/get-cars/'+start+'&'+end
        var url = proxy.test + 'calendar/get-cars/' + start + '&' + end
        console.log('----', url)
        fetch(url)
            .then(response => response.json())
            .then((responseJson) => {
                if (!responseJson.result) {
                    console.log("not found")
                } else {
                    console.log("responseJson", responseJson)
                    console.log("responseJson", responseJson.result)
                    if(responseJson.status !== 500){
                        responseJson.result.forEach(function (val, i) {
                            arr.push(
                                <option value={[val.car_type, val.license]}>{val.car_type} {val.license}</option>
                            )
                        });
                        var data = this.state.inData
                        var objinData = {
                            start_date: start,
                            end_date: end
                        }
    
                        var inData = Object.assign(data, objinData)
                        this.setState({ selecter: arr, inData: inData }, () => {
                            console.log("checkData_getCar", this.state.inData)
                        })
                    }else{
                        alert('ไม่มีข้อมูล หรืออาจมีข้อผิดพลาดเกิดขึื้น')
                    }
                }
            })
    }

    saveToDB = () => {
        var props = this.props
        if(this.state.inData.mess_code !== '' && this.state.inData.car_license !== '' 
        && this.state.inData.remark !== '' && this.state.inData.start_date !== '' && this.state.inData.end_date !== ''
        && this.state.inData.car_license !== '' && this.state.inData.remark !== ''){
                if (window.confirm('กรุณายืนยันการเพิ่มรอบรถ')) {

                data_send.push(this.state.inData)
                let url = proxy.test + "calendar/create-task/"
                console.log("save_task", data_send)
                fetch(url, {
                    method: "POST",
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
                            alert('เพิ่มรอบสำเร็จ')
                            window.location.href = '/timeable/calendar'
                        } else {
                            alert("ไม่สามารถบันทึกข้อมูลได้ กรุณาลองใหม่")
                        }
                    })
                    .catch((error) => {
                        props.dispatch(is_loader(false))
                        console.log("err", error)
                    })
            }
            }else{
                alert('กรุณากรอกข้อมูลให้ครบ')
        }
    }

    DataMess = (MessNo, MessName, mess_code) => {
        //console.log('--------',MessNo,MessName)
        var data = this.state.inData
        var objinData = {
            mess_code: mess_code
        }

        var inData = Object.assign(data, objinData);
        this.setState({
            inData: inData,
            modal_messsenger: { is_open: false },
            messID: MessNo,
            messName: MessName
        }, () => {
            console.log("checkData", this.state.inData);
        })
    }

    render() {
        return (
            <div>
                <bs4.Container className="bgContainer-White" fluid>
                    <bs4.Form>
                        <div style={{ textAlign: "left", fontSize: "22px", fontWeight: "800" }} >กรอกข้อมูลรอบรถบริษัท</div>
                    </bs4.Form>
                </bs4.Container>

                <bs4.Container className="bgContainer-White" fluid>
                    <div style={divStyle}>
                        <bs4.FormGroup row>
                            <bs4.Label for="exampleSelect">&nbsp;&nbsp;&nbsp;ประเภทแมสเซนเจอร์</bs4.Label>
                            <bs4.Col>
                                <bs4.Input type="select" name="select" id="exampleSelect" onChange={this.onChange_type_mess}>
                                    <option value=" ">------</option>
                                    <option value="MCV">Cashvan</option>
                                    <option value="MDL">Dealer</option>
                                </bs4.Input>
                            </bs4.Col>
                        </bs4.FormGroup>
                        <br />
                        <bs4.FormGroup row>
                            <bs4.Label for="exampleSelect">&nbsp;&nbsp;&nbsp;รหัสพนักงาน&nbsp;&nbsp;&nbsp;&nbsp;</bs4.Label>
                            <bs4.Col>
                                <bs4.Input type="text" name="select" id="exampleSelect" value={this.state.messID} disabled />
                            </bs4.Col>
                            <bs4.Label for="exampleSelect">&nbsp;&nbsp;&nbsp;ชื่อ - นามสกุล&nbsp;&nbsp;&nbsp;&nbsp;</bs4.Label>
                            <bs4.Col>
                                <bs4.Input type="text" name="select" id="exampleSelect" value={this.state.messName} disabled />
                            </bs4.Col>
                        </bs4.FormGroup>
                        <br />
                        <bs4.FormGroup row>
                            <bs4.Label for="exampleDate">&nbsp;&nbsp;&nbsp;วันที่</bs4.Label>
                            <bs4.Col >
                                <DatePicker
                                    dateFormat="YYYY-MM-DD"
                                    selected={this.state.StartDate}
                                    onChange={(date) => this.onChangeDateTime('StartDate', date)}
                                    //minDate={moment(date.addDays(1))}
                                />
                            </bs4.Col>
                            <bs4.Label for="exampleTime">เวลา</bs4.Label>
                            <bs4.Col>
                                <TimePicker
                                    onChange={(time) => this.onChangeDateTime('StartTime', time)}
                                    defaultValue={moment(this.state.StartTime, format)} format={format}
                                />
                            </bs4.Col>

                            <bs4.Label for="exampleDate">ถึงวันที่</bs4.Label>
                            <bs4.Col>
                                <DatePicker
                                    dateFormat="YYYY-MM-DD"
                                    selected={this.state.EndDate}
                                    onChange={(date) => this.onChangeDateTime('EndDate', date)}
                                    //minDate={moment(date.addDays(1))}
                                />
                            </bs4.Col>
                            <bs4.Label for="exampleTime">เวลา</bs4.Label>
                            <bs4.Col>
                                <TimePicker
                                    onChange={(time) => this.onChangeDateTime('EndTime', time)}
                                    defaultValue={moment(this.state.EndTime, format)} format={format}
                                />
                            </bs4.Col>
                            <bs4.Label for="exampleSelect">เลือกรถ</bs4.Label>
                            <bs4.Col sm='6'>
                                <bs4.Input type="select" name="Car" onChange={(e) => this.onChangeCar(e.target.name, e.target.value)}>
                                    <option value=" ">-------</option>
                                    {this.state.selecter}
                                </bs4.Input>
                            </bs4.Col>
                        </bs4.FormGroup>
                        <br />
                        <bs4.Row>
                            <bs4.Label for="exampleSelect">&nbsp;&nbsp;&nbsp;ต้นทาง</bs4.Label>
                            <bs4.Col>
                                <bs4.Input type="text" name="start_point" id="exampleSelect01" onChange={(e) => this.onChangeForm(e.target.name, e.target.value)} />
                            </bs4.Col>
                            <bs4.Label for="exampleSelect">&nbsp;&nbsp;&nbsp;ปลายทาง&nbsp;&nbsp;&nbsp;</bs4.Label>
                            <bs4.Col>
                                <bs4.Input type="text" name="end_point" id="exampleSelect02" onChange={(e) => this.onChangeForm(e.target.name, e.target.value)} />
                            </bs4.Col>
                        </bs4.Row>
                        <br />
                        <bs4.Row>
                            <bs4.Label for="exampleText">คำอธิบายเพิ่มเติม</bs4.Label>
                            <bs4.Input type="textarea" name="remark" id="exampleText" onChange={(e) => this.onChangeForm(e.target.name, e.target.value)} />
                        </bs4.Row>
                        <br />
                        <bs4.Button color='success' onClick={this.saveToDB}>บันทึก</bs4.Button>
                    </div >
                </bs4.Container>

                <Messsenger data={this.state.modal_messsenger} handleChange={this.DataMess.bind(this)} />
            </div >
        );
    }
}

function mapStateToProps(state) {
    console.log(state)
    return state
}
export default connect(mapStateToProps)(Addtimeable);