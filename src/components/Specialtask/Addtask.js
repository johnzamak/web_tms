import React, { Component } from 'react';
import * as bs4 from "reactstrap"
import * as MdIcon from 'react-icons/lib/md'
import ImageUploader from 'react-images-upload';
import DatePicker from "react-datepicker"
import 'react-datepicker/dist/react-datepicker.css';
import { is_loader,alert_box } from '../../actions'
import { connect } from 'react-redux'
import { loadState } from "../../localStorage"
import { TimePicker } from 'antd';
import "antd/dist/antd.css";
import { browserHistory } from 'react-router';

Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

var date = new Date();

var $ = require("jquery")
const { proxy } = require("../../service")
const addMonths = require('addmonths')
const moment = require("moment")
let data_send=[]
const format = 'HH:mm';
let minDate=new Date()
minDate.setDate(minDate.getDate()+1*86400000)


class Addtask extends Component {
    constructor(props) {
        super(props)
        this.state = {
            receive_from: "",
            receive_date: "",
            receive_time_first: new Date(),
            receive_time_second: "",
            user_request_tel: "",
            send_to: "",
            send_date: "",
            send_time_first: new Date(),
            send_time_second: "",
            send_tel_user: "",
            work_type: "Other",
            cashvan_inv: "",
            cashvan_box: "",
            pictures: "",
            comment: "",
            typework: "NORMAL",
            min_date:minDate
        }
    }
    componentWillMount() {
        let data_user = loadState("data_user")[0]
        this.setState({
            user_login: data_user.Name,
            user_email: data_user.Email,
            user_request_code:data_user.ID_User,
            user_request_name:data_user.Name,
            user_request_department:data_user.DepartmentNo
        })
    }
    onChangeForm = (id, value) => {
        this.setState({ [id]: value }, () => {
            console.log("checkData", this.state);
        })
    }
    onDrop = (picture) => {
        this.setState({
            pictures: picture
        }, () => {
            console.log(this.state)
        });
    }
    handleChangetype = (e) => {
        var val = e.target.value
        switch (val) {
            case "Cashvan": $(".cashvan").show(); $(".cn").hide(); break;
            case "CN": $(".cn").show(); $(".cashvan").hide(); break;
            default: $(".cashvan").hide(); $(".cn").hide(); break;
        }
    }
    handleClicktypework = (e) => {
        var name = e.target.name
        var val = e.target.value
        this.setState({
            [name]: val
        })
    }
    check_input_data(state, callback) {
        if (state.receive_from != "" && state.receive_date != "" && state.receive_time_first != "" &&
            state.user_request_tel != "" && state.send_to != "" && state.send_date != "" &&
            state.send_time_first != "" && state.send_tel_user != "" && state.comment != "" &&
            state.typework != ""
        ) {
            if (state.work_type == "Other") {
                callback(true)
            } else if (state.work_type == "Cashvan") {
                if (state.cashvan_inv != "" && state.cashvan_box != "") {
                    callback(true)
                } else {
                    callback(false)
                }
            } else if (state.work_type == "CN") {
                if (state.pictures != "") {
                    callback(true)
                } else {
                    callback(false)
                }
            }
        } else {
            callback(false)
        }
    }
    handleClicksave = (e) => {
        var state = this.state
        var props = this.props
        // props.dispatch(alert_box(true,"test","test"))
        props.dispatch(is_loader(true))
        this.check_input_data(state, (check_data) => {
            if (check_data && window.confirm("กรุณายืนยันรายการ")) {
                this.save_task(state,props)
            } else {
                alert("กรุณากรอกข้อมูลให้ครบถ้วนทุกช่องคะ")
                props.dispatch(is_loader(false))
                return false
            }
        })
    }
    save_task(state,props) {
        let url = proxy.main + "special-circles/add-task/"
        data_send.push(state)
        console.log("save_task", data_send)
        fetch(url, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data_send)
        })
            .then(response => response.json())
            .then((responseJson) => {
                props.dispatch(is_loader(false))
                console.log("responseJson", responseJson)
                if(responseJson.status===200){
                    alert("บันทึกข้อมูลเรียบร้อยแล้ว")
                    browserHistory.push('/speceialtask')
                }else{
                    alert("ไม่สามารถบันทึกข้อมูลได้ กรุณาลองใหม่")
                }
            })
            .catch((error) => {
                props.dispatch(is_loader(false))
                console.log("err",error)
            })
    }

    render() {
        return (
            <div>
                <bs4.Container>
                    <bs4.Form>
                        <bs4.Row>
                            <bs4.Col xs="4">
                                <bs4.Label>ผู้ของาน</bs4.Label>
                                <bs4.Input type="text" name="user_login" onChange={(e) => this.onChangeForm(e.target.name, e.target.value)} value={this.state.user_login} />
                            </bs4.Col>
                            <bs4.Col xs="4">
                                <bs4.Label>Email</bs4.Label>
                                <bs4.Input type="text" name="user_email" onChange={(e) => this.onChangeForm(e.target.name, e.target.value)} value={this.state.user_email} />
                            </bs4.Col>
                        </bs4.Row>
                        <bs4.Row>
                            <bs4.Col xs="4">
                                <bs4.Label>รับของจาก</bs4.Label>
                                <bs4.Input type="text" name="receive_from" onChange={(e) => this.onChangeForm(e.target.name, e.target.value)} value={this.state.receive_from} />
                            </bs4.Col>
                            <bs4.Col xs="2">
                                <bs4.Label>วันที่รับของ</bs4.Label>
                                <DatePicker
                                    dateFormat="YYYY-MM-DD"
                                    selected={this.state.receive_date}
                                    onChange={(date) => this.onChangeForm("receive_date", date)}
                                    placeholderText="วันที่รับของ"
                                    value={this.state.receive_date}
                                    minDate={moment(date.addDays(1))}
                                    maxDate={addMonths(new Date(), 1)}
                                />
                            </bs4.Col>
                            <bs4.Col xs="2">
                                <table cellPadding="3" >
                                    <td>เวลา</td>
                                    <tr>
                                        <td colSpan="2" >
                                            <TimePicker onChange={(time) => this.onChangeForm("receive_time_first", time)} defaultValue={moment(this.state.receive_time_first, format)} format={format} />
                                        </td>
                                    </tr>
                                </table>
                            </bs4.Col>
                            <bs4.Col xs="4">
                                <bs4.Label>เบอร์โทร.ผู้ของาน</bs4.Label>
                                <bs4.Input type="text" name="user_request_tel" onChange={(e) => this.onChangeForm(e.target.name, e.target.value)} value={this.state.user_request_tel} />
                            </bs4.Col>
                        </bs4.Row>
                        <bs4.Row>
                            <bs4.Col xs="4">
                                <bs4.Label>ไปส่งของที่</bs4.Label>
                                <bs4.Input type="text" name="send_to" onChange={(e) => this.onChangeForm(e.target.name, e.target.value)} value={this.state.send_to} />
                            </bs4.Col>
                            <bs4.Col xs="2">
                                <bs4.Label>วันที่ไปส่ง</bs4.Label>
                                <DatePicker
                                    dateFormat="YYYY-MM-DD"
                                    selected={this.state.send_date}
                                    onChange={(date) => this.onChangeForm("send_date", date)}
                                    placeholderText="วันที่ไปส่ง"
                                    value={this.state.send_date}
                                    minDate={moment(date.addDays(1))}
                                />
                            </bs4.Col>
                            <bs4.Col xs="2">
                                <table cellPadding="3" >
                                    <td>เวลา</td>
                                    <tr>
                                        <td>
                                            <TimePicker onChange={(time) => this.onChangeForm("send_time_first", time)} defaultValue={moment(this.state.send_time_first, format)} format={format} />
                                        </td>
                                    </tr>
                                </table>
                            </bs4.Col>
                            <bs4.Col xs="4">
                                <bs4.Label>เบอร์โทร.ผู้รับของ</bs4.Label>
                                <bs4.Input type="text" name="send_tel_user" onChange={(e) => this.onChangeForm(e.target.name, e.target.value)} value={this.state.send_tel_user} />
                            </bs4.Col>
                        </bs4.Row>
                        <bs4.Row>
                            <bs4.Col xs="4">
                                <bs4.Label>เลือก Zone</bs4.Label>
                                <bs4.Input type="select" name="work_type" onChange={this.handleChangetype} >
                                </bs4.Input>
                            </bs4.Col>
                        </bs4.Row>
                        <bs4.Row>
                            <bs4.Col xs="4">
                                <bs4.Label>เลือกประเภทงาน</bs4.Label>
                                <bs4.Input type="select" name="work_type" onChange={this.handleChangetype} >
                                    <option>Other</option>
                                    <option>Cashvan</option>
                                    <option>CN</option>
                                </bs4.Input>
                            </bs4.Col>
                            <bs4.Col xs="4" className="cashvan" style={{ display: "none" }} >
                                <bs4.Label>กรุณากรอกเลข INV</bs4.Label>
                                <bs4.Input type="text" name="cashvan_inv" onChange={(e) => this.onChangeForm(e.target.name, e.target.value)} value={this.state.cashvan_inv} />
                            </bs4.Col>
                            <bs4.Col xs="2" className="cashvan" style={{ display: "none" }} >
                                <bs4.Label>จำนวนกล่อง</bs4.Label>
                                <bs4.Input type="text" name="cashvan_box" onChange={(e) => this.onChangeForm(e.target.name, e.target.value)} value={this.state.cashvan_box} />
                            </bs4.Col>
                            <bs4.Col xs="4" className="cn" style={{ display: "none" }} >
                                <bs4.Label>อัพโหลดรูปภาพ</bs4.Label>
                                <ImageUploader
                                    withIcon={true}
                                    buttonText='Choose images'
                                    onChange={this.onDrop}
                                    imgExtension={['.jpg']}
                                    maxFileSize={5242880}
                                    withPreview={true}
                                />
                            </bs4.Col>
                        </bs4.Row>
                        <bs4.Row>
                            <bs4.Col xs="6">
                                <bs4.Label>หมายเหตุ <font color="red">(**กรอกเป็นชนิดและปริมาณสิ่งของ)</font></bs4.Label>
                                <bs4.Input type="textarea" name="comment" onChange={(e) => this.onChangeForm(e.target.name, e.target.value)} value={this.state.comment} >
                                </bs4.Input>
                            </bs4.Col>
                        </bs4.Row>
                        <bs4.Row>
                            <bs4.Col xs="4"><br />
                                <bs4.Label>
                                    <bs4.Input name="typework" checked type="radio" value="NORMAL" onClick={this.handleClicktypework} />งานปกติ
                                </bs4.Label>
                            </bs4.Col>
                            <bs4.Col xs="4"><br />
                                <bs4.Label>
                                    <bs4.Input name="typework" type="radio" value="EXPRESS" onClick={this.handleClicktypework} />งานด่วน <font color="red">(รอหัวหน้าอนุมัติ)</font>
                                </bs4.Label>
                            </bs4.Col>
                        </bs4.Row>
                        <bs4.Row>
                            <bs4.Col xs="12">
                                <table style={{ color: "red" }} >
                                    <tr>
                                        <td>**โปรดอ่าน</td>
                                        <td>งานปกติ</td>
                                        <td>ก่อนเวลา 17.00 น. จะรับงานในวันถัดไปและจัดส่งตามกำหนดที่ขอมา</td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td></td>
                                        <td>หลังเวลา 17.00 น. จะรับงานใน 2 วันจากวันที่ของานและจัดส่งตามกำหนดที่ขอมา</td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td>งานด่วน</td>
                                        <td>เมื่อผ่านการอนุมัติจะรับและส่งงานตามกำหนดทันที</td>
                                    </tr>
                                </table>
                            </bs4.Col>
                        </bs4.Row>
                        <bs4.Row>
                            <bs4.Col xs="12">
                                <bs4.Button type="button" color="success" onClick={this.handleClicksave} ><MdIcon.MdSave className="iconlg" /> บันทึก</bs4.Button>
                            </bs4.Col>
                        </bs4.Row>
                    </bs4.Form>
                </bs4.Container>
            </div>
        );
    }
}
function mapStateToProps(state) {
    console.log(state)
    return state
}


export default connect(mapStateToProps)(Addtask)