import React, { Component } from 'react';
import * as bs4 from "reactstrap"
import * as MdIcon from 'react-icons/lib/md'
import DatePicker from "react-datepicker"
import { connect } from 'react-redux'
import { is_loader } from '../../actions'
import { TimePicker } from 'antd';
import { browserHistory } from 'react-router';
const { proxy } = require("../../service")
const moment = require("moment")
const addMonths = require('addmonths')

let data_send = []
var date = new Date();
const format = 'HH:mm';

class Editreport_Timeable extends Component {
    constructor(props) {
        super(props)
        this.state = {
            selecter: '',
            Timeout: '',
            Arrivaltime: '',
            StartTime: new Date(),
            dataTable: [],
            arrData: []
        }
    }

    onChangeinData = (id, value, index) => {
        console.log('-----', id, value, index)
        var arrData = this.state.arrData
        var indexArr = arrData[index]
        var objinData = {
            [id]: value
        }
        var mergeObj = Object.assign(indexArr, objinData)
        arrData.splice(index, 1, mergeObj)

        this.setState({ arrData: arrData }, () => {
            console.log('checkData', arrData)
            //this.handleArrivaltime(index)
        })
    }

    onChangeinDataTime = (id, value, index) => {
        console.log('-----', id, value, index)

        value = moment(value).format('YYYY-MM-DDTHH:mm:ss')
        var arrData = this.state.arrData
        var indexArr = arrData[index]
        var objinData = {
            [id]: value
        }
        var mergeObj = Object.assign(indexArr, objinData)
        arrData.splice(index, 1, mergeObj)

        this.setState({ arrData: arrData }, () => {
            console.log('checkData', arrData)
        })
    }


    componentWillMount = () => {
        this.getCause()
    }

    getCause = () => {
        var arr = []
        var url = proxy.main + 'calendar/get-cause/'
        fetch(url)
            .then(response => response.json())
            .then((responseJson) => {
                if (!responseJson.result) {
                    alert('555')
                } else {
                    console.log("responseJson", responseJson.result)
                    responseJson.result.forEach(function (val, i) {
                        arr.push(
                            <option value={val.id}>{val.cause}</option>
                        )
                    });
                }
                this.setState({ selecter: arr }, () => {
                    this.getReport()
                })
            })
    }

    getReport = () => {
        var result = localStorage.getItem('report')
        this.setState({ arrData: JSON.parse(result) }, () => {
            this.create_table()
        })
    }

    create_table = () => {
        var props = this.props
        props.dispatch(is_loader(true))

        var arrData = this.state.arrData
        console.log('result', arrData)

        var arr = []
        arrData.forEach(function (val, i) {
            var date = (moment(val.start_date).format('DD-MM-YYYY'))

            var arr_rec_time = val.rec_time === null ? '' : val.rec_time.split('T')
            var rec_time = (moment(moment(arr_rec_time[1], 'HH:mm')).format('HH:mm'))

            var arr_exit_time = val.exit_time === null ? '' : val.exit_time.split('T')
            var exit_time = (moment(moment(arr_exit_time[1], 'HH:mm')).format('HH:mm'))

            var arr_finish_time = val.finish_time === null ? '' : val.finish_time.split('T')
            var finish_time = (moment(moment(arr_finish_time[1], 'HH:mm')).format('HH:mm'))

            arr.push(
                <tr>
                    <td style={{ textAlign: "center" }} >{i + 1}</td>
                    <td style={{ textAlign: "center" }} >{date}</td>
                    <td style={{ textAlign: "center" }} >{val.start_point}</td>
                    <td style={{ textAlign: "center" }} >{val.end_point}</td>
                    <td style={{ textAlign: "center", backgroundColor: "#FFA500" }} ><bs4.Input type='number' name='qty_product' defaultValue={val.qty_product} onChange={(e) => this.onChangeinData(e.target.name, e.target.value, i)} /></td>
                    <td style={{ textAlign: "center", backgroundColor: "#33CCFF" }} >{
                        val.rec_time === null ?
                            <TimePicker
                                onChange={(time) => this.onChangeinDataTime('rec_time', time, i)}
                                defaultValue={moment(this.state.StartTime, format)} format={format} />
                            : <TimePicker
                                onChange={(time) => this.onChangeinDataTime('rec_time', time, i)}
                                defaultValue={moment(rec_time, format)} format={format} />
                    }</td>
                    <td style={{ textAlign: "center", backgroundColor: "#33CCFF" }} >{
                        val.exit_time === null ?
                            <TimePicker
                                onChange={(time) => this.onChangeinDataTime('exit_time', time, i)}
                                defaultValue={moment(this.state.StartTime, format)} format={format} />
                            : <TimePicker
                                onChange={(time) => this.onChangeinDataTime('exit_time', time, i)}
                                defaultValue={moment(exit_time, format)} format={format} />
                    }</td>
                    <td style={{ textAlign: "center", backgroundColor: "#32CD32" }} >{
                        val.finish_time === null ?
                            <TimePicker
                                onChange={(time) => this.onChangeinDataTime('finish_time', time, i)}
                                defaultValue={moment(this.state.StartTime, format)} format={format} />
                            : <TimePicker
                                onChange={(time) => this.onChangeinDataTime('finish_time', time, i)}
                                defaultValue={moment(finish_time, format)} format={format} />
                    }</td>
                    {/* <td style={{ textAlign: "center" }} >{result}</td> */}
                    <td style={{ textAlign: "center" }} >{val.car_license}</td>
                    <td style={{ textAlign: "center" }} >{val.car_type}</td>
                    <td style={{ textAlign: "center" }} >{val.mess_code}</td>
                    <td style={{ textAlign: "center" }} >
                        <bs4.Input type="select" name='cause_id' onChange={(e) => this.onChangeinData(e.target.name, e.target.value, i)}>
                            <option value={val.cause_id}>{val.cause_name}</option>
                            {this.state.selecter}
                        </bs4.Input></td>
                    <td style={{ textAlign: "center" }} >
                        <bs4.Input type='text' name='remark' defaultValue={val.remark} onChange={(e) => this.onChangeinData(e.target.name, e.target.value, i)} />
                    </td>
                </tr>
            )
        }, this)

        this.setState({ dataTable: arr }, () => {
            props.dispatch(is_loader(false))
        })
    }

    addCause = () => {
        var props = this.props
        if (window.confirm('คุณต้องการเพิ่มสาเหตุของปัญหาหรือไม่?')) {
            var _cause = prompt("กรุณากรอกสาเหตุของปัญหา")
            var objCause = {
                cause: _cause
            }
            data_send.push(objCause)
            props.dispatch(is_loader(true))
            if (_cause) {
                let url = proxy.main + "calendar/create-cause/"
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
                            alert("บันทึกข้อมูลเรียบร้อยแล้ว")
                            this.getCause()
                        } else {
                            alert("ไม่สามารถบันทึกข้อมูลได้ กรุณาลองใหม่")
                        }
                    })
                    .catch((error) => {
                        props.dispatch(is_loader(false))
                        console.log("err", error)
                    })
            } else {
                alert('อาจมีข้อผิดพลาดเกิดขึ้น')
            }
        }
    }

    save_data = () => {
        var props = this.props
        if (window.confirm('กรุณายืนยันการแก้ไขข้อมูล')) {

            data_send = this.state.arrData
            props.dispatch(is_loader(true))

            let url = proxy.main + "calendar/update-report-calendar/"
            console.log("save_task", data_send)
            fetch(url, {
                method: "PUT",
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
                    if (responseJson.status === 200) {
                        alert('แก้ไขข้อมูลสำเร็จ')
                        this.goto_report()
                    } else {
                        alert("ไม่สามารถแก้ไขข้อมูลได้ กรุณาลองใหม่")
                    }
                })
                .catch((error) => {
                    props.dispatch(is_loader(false))
                    console.log("err", error)
                })
        }
    }

    goto_report = () => {
        localStorage.setItem('reportStatus', 'success')
        browserHistory.push('/report/report_Timeable')
    }

    render() {
        return (
            <div>
                <bs4.Container className="bgContainer-White" fluid>
                    <div style={{ textAlign: "left", fontSize: "22px", fontWeight: "800" }} >รายงานแสดงข้อมูลรอบรถ</div>
                    <bs4.Row>
                        <bs4.Col xs="3" >
                            <bs4.FormGroup row>
                                <bs4.Label style={{ fontWeight: "600", fontSize: "16px", margin: "10px 20px 0px 20px" }} >วันที่เริ่มต้น</bs4.Label>
                                <div style={{ marginTop: "10px", }} >
                                    <DatePicker
                                        dateFormat="YYYY-MM-DD"
                                        selected={this.state.date_start}
                                        onChange={(date) => this.onChangeForm("date_start", date)}
                                        // minDate={moment(date.addDays(0))}
                                        maxDate={addMonths(new Date(), 1)}
                                        disabled
                                    />
                                </div>
                            </bs4.FormGroup>
                        </bs4.Col>
                        <bs4.Col xs="3" >
                            <bs4.FormGroup row>
                                <bs4.Label style={{ fontWeight: "600", fontSize: "16px", margin: "10px 20px 0px 20px" }} >วันที่สิ้นสุด</bs4.Label>
                                <div style={{ marginTop: "10px", }} >
                                    <DatePicker
                                        dateFormat="YYYY-MM-DD"
                                        selected={this.state.date_end}
                                        onChange={(date) => this.onChangeForm("date_end", date)}
                                        // minDate={moment(date.addDays(0))}
                                        maxDate={addMonths(new Date(), 1)}
                                        disabled
                                    />
                                </div>
                            </bs4.FormGroup>
                        </bs4.Col>
                        <bs4.Col xs="2" >
                            <bs4.Button color="info" disabled> <MdIcon.MdSearch className="iconlg" /> SEARCH</bs4.Button>
                        </bs4.Col>
                    </bs4.Row>
                    <bs4.Row>
                        <bs4.Col>
                            <bs4.Button outline style={{ fontSize: "15px", fontWeight: "600" }} disabled>EXCEL</bs4.Button>&nbsp;
                                <bs4.Button outline style={{ fontSize: "15px", fontWeight: "600" }} disabled>PDF</bs4.Button>&nbsp;
                                <bs4.Button outline style={{ fontSize: "15px", fontWeight: "600" }} disabled>PRINT</bs4.Button>&nbsp;
                                <bs4.Button color='success' style={{ fontSize: "15px", fontWeight: "600" }} onClick={this.save_data}>SAVE</bs4.Button>
                        </bs4.Col>
                    </bs4.Row>
                    <bs4.Row>

                        <bs4.Table striped hover bordered style={{ margin: "10px 10px 10px 10px", fontSize: "15px", fontWeight: "600" }} >
                            <thead style={{ backgroundColor: "#17a2b8", whiteSpace: "nowrap" }} >
                                <td style={{ textAlign: "center" }}>ลำดับ</td>
                                <td style={{ width: '15%', textAlign: "center" }}>วันที่</td>
                                <td style={{ width: '20%', textAlign: "center" }} >สถานที่รับสินค้า<br />(ต้นทาง)</td>
                                <td style={{ width: '20%', textAlign: "center" }} >สถานที่ส่งสินค้า<br />(ปลายทาง)</td>
                                <td style={{ textAlign: "center", backgroundColor: "#FFA500" }} >จำนวนสินค้า<br />(พาเลท)</td>
                                <td style={{ textAlign: "center", backgroundColor: "#33CCFF" }} >เวลาเข้ารับสินค้า</td>
                                <td style={{ textAlign: "center", backgroundColor: "#33CCFF" }} >เวลาออก</td>
                                <td style={{ textAlign: "center", backgroundColor: "#32CD32" }} >เวลาถึง</td>
                                {/* <td style={{ textAlign: "center", backgroundColor: "#FFFF00" }} >เวลาเดินทาง</td> */}
                                <td style={{ textAlign: "center" }} >ทะเบียนรถ</td>
                                <td style={{ textAlign: "center" }} >ประเภทรถ</td>
                                <td style={{ textAlign: "center" }} >ชื่อผู้ขับ</td>
                                <td style={{ textAlign: "center" }} >สาเหตุของปัญหา <bs4.Button color='success' size='sm' onClick={this.addCause} >+</bs4.Button></td>
                                <td style={{ width: '100%', textAlign: "center" }} >หมายเหตุ</td>
                            </thead>
                            <tbody  >
                                {this.state.dataTable}
                            </tbody>

                        </bs4.Table>
                    </bs4.Row>
                </bs4.Container>
            </div>
        );
    }
}
function mapStateToProps(state) {
    console.log(state)
    return state
}
export default connect(mapStateToProps)(Editreport_Timeable);