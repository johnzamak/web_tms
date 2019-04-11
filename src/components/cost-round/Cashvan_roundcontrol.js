import React, { Component } from 'react';
import * as bs4 from "reactstrap"
import * as MdIcon from 'react-icons/lib/md'
import { connect } from 'react-redux'
import moment from 'moment';
//import FullCalendar from 'fullcalendar-reactwrapper'
import DatePicker from "react-datepicker"
import ReactToPrint from 'react-to-print';
import { is_loader } from '../../actions'
const $ = require("jquery")
const { proxy } = require("../../service")

class Cashvan_roundcontrol extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dateStart: moment(),
            showTable: '',
            selecter: '',
            IDMess: '',
            dataTable: '',
            DateReport: '',
            MessName: '',
            BillAmount: '',
            result: '',
            status: true
        }
    }

    onChangeForm = (id, value) => {
        this.setState({ [id]: value }, () => {
            console.log("checkData", this.state)
        })
    }

    componentDidMount() {
        this.call_messenger()
    }

    call_messenger = () => {
        var arr = []
        var url = proxy.main + "app-api/get-messenger/MCV"
        console.log(url)
        fetch(url)
            .then(response => response.json())
            .then((responseJson) => {
                console.log("responseJson", responseJson.result)
                responseJson.result.forEach(function (val, i) {
                    arr.push(
                        <option value={val.IDMess}>{val.MessName}</option>
                    )
                }, this);

                this.setState({
                    selecter: arr
                }, () => {
                    this.setTo_Print()
                })
            })
    }

    setTo_Print = (e) => {
        var table = <div style={{ padding:"20px",pageBreakAfter: "always" }} ref={el => (this.componentRef = el)}>
            <br />
            <div style={{ textAlign: "center", fontSize: "18px", fontWeight: "800" }} >ใบคุมรอบ Mess Cashvan</div>
            <div style={{ textAlign: "center", fontSize: "14px", fontWeight: "500" }} ><u>Delivery date</u> : <b>{this.state.DateReport}</b>&nbsp;&nbsp;&nbsp;<u>Messenger Name</u> : <b>{this.state.MessName}</b>&nbsp;&nbsp;&nbsp;<u>จำนวน Invoice</u> : <b>{this.state.BillAmount} บิล</b></div>
            <br />
            <bs4.Table bordered style={{ fontSize: "12px" }}  >
                <thead style={{ fontWeight: "700" }}>
                    <th style={{ textAlign: "center" }}>ลำดับ</th>
                    <th style={{ textAlign: "center" }}>สถานที่ส่ง (งานออเดอร์)</th>
                    <th style={{ textAlign: "center" }} >จำนวน Invoice</th>
                    <th style={{ textAlign: "center" }} >หมายเหตุ</th>
                </thead>
                <tbody >
                    {this.state.dataTable}
                </tbody>
            </bs4.Table>
            <br />
            <br />
            <div style={{ textAlign: "center", fontSize: "14px", fontWeight: "500" }} >ผู้ตรวจสอบ................................................................   ผู้ส่งสินค้า................................................................</div>
        </div>

        this.setState({ showTable: table })
    }

    getReport = () => {
        var id = this.state.IDMess
        var date = moment(this.state.dateStart).format('YYYY-MM-DD')

        if (id === '') {
            alert('กรุณาเลือก Messeger')
        } else {
            var props = this.props
            props.dispatch(is_loader(true))
            var countBill = 0
            var arrReport = []
            var url = proxy.develop + 'get-daily-costmess-MCV/' + date + '&' + id
            console.log('----', url)
            fetch(url)
                .then(response => response.json())
                .then((responseJson) => {
                    console.log("responseJson", responseJson.result)
                    if (responseJson.status !== 200) {
                        props.dispatch(is_loader(false))
                        alert('ไม่พบข้อมูล')
                    } else {
                        responseJson.result.forEach(function (val, i) {
                            arrReport.push(
                                <tr>
                                    <td style={{ textAlign: "center" }}>{i + 1}</td>
                                    <td style={{ textAlign: "center" }}>{val.Zone}</td>
                                    <td style={{ textAlign: "right" }} >{val.Bill}</td>
                                    <td style={{ textAlign: "center" }} >{val.Remark}</td>
                                </tr>
                            )

                            countBill += val.Bill
                        }, this);

                        this.setState({
                            dataTable: arrReport,
                            MessName: responseJson.result[0].MessName,
                            DateReport: responseJson.result[0].Datetime,
                            BillAmount: countBill,
                            result: responseJson.result
                        }, () => {
                            props.dispatch(is_loader(false))
                            this.setTo_Print()
                        })
                    }
                })
        }
    }

    compareBy(key) {
        if (this.state.status !== true) {
            return function (a, b) {
                if (a[key] < b[key]) return -1;
                if (a[key] > b[key]) return 1;
                return 0;
            };
        } else {
            return function (a, b) {
                if (a[key] > b[key]) return -1;
                if (a[key] < b[key]) return 1;
                return 0;
            };
        }
    }

    sortBy(key) {
        let arrayCopy = [...this.state.result]
        var arrShowData = []
        arrayCopy.sort(this.compareBy(key)).forEach(function (val, i) { 
            arrShowData.push(
                <tr>
                    <td style={{ textAlign: "center" }}>{i + 1}</td>
                    <td style={{ textAlign: "center" }}>{val.Zone}</td>
                    <td style={{ textAlign: "right" }} >{val.Bill}</td>
                    <td style={{ textAlign: "center" }} >{val.Remark}</td>
                </tr>
            )
        }, this)
        this.setState({
            dataTable: arrShowData,
            status: !this.state.status
        }, () => { this.setTo_Print() });
    }

    render() {
        return (
            <div>
                <bs4.Container className="bgContainer-White" fluid>
                    <bs4.Form>
                        <div style={{ textAlign: "left", fontSize: "25px", fontWeight: "1000" }} >สรุปรอบรายวัน Cashvan</div>
                    </bs4.Form>
                    <bs4.Row>
                        <bs4.Label style={{ fontWeight: "600", fontSize: "16px", margin: "10px 20px 0px 20px" }} >Delivery date:</bs4.Label>
                        <div style={{ marginTop: "10px", }} >
                            <DatePicker
                                dateFormat="YYYY-MM-DD"
                                selected={this.state.dateStart}
                                onChange={(date) => this.onChangeForm("dateStart", date)}
                            />
                        </div>
                        <bs4.Label style={{ fontWeight: "600", fontSize: "16px", margin: "10px 10px 0px 20px" }} >Messenger</bs4.Label>
                        <bs4.Col sm='3'>
                            <bs4.Input type="select" name="IDMess" id="exampleSelect" onChange={(e) => this.onChangeForm(e.target.name, e.target.value)}>
                                <option value=''>กรุณาเลือก Messenger</option>
                                {this.state.selecter}
                            </bs4.Input>
                        </bs4.Col>
                        <bs4.Col xs="2" >
                            <bs4.Button color="info" onClick={() => { this.getReport() }} ><MdIcon.MdSearch className="iconlg" />SEARCH</bs4.Button>
                            <ReactToPrint
                                trigger={() => <bs4.Button color='warning' style={{ margin: "0px 0px 0px 20px" }} href='#'><MdIcon.MdPrint className="iconSize" /> PRINT</bs4.Button>}
                                content={() => this.componentRef}
                            />
                            <div hidden>{this.state.showTable}</div>
                        </bs4.Col>
                    </bs4.Row>
                    <br />
                    <br />
                    <div style={{ textAlign: "center", fontSize: "25px", fontWeight: "800" }} >ใบคุมรอบ Mess Cashvan</div>
                    <div style={{ textAlign: "center", fontSize: "18px", fontWeight: "500" }} ><u>Delivery date</u> : <b>{this.state.DateReport}</b>&nbsp;&nbsp;&nbsp;<u>Messenger Name</u> : <b>{this.state.MessName}</b>&nbsp;&nbsp;&nbsp;<u>จำนวน Invoice</u> : <b>{this.state.BillAmount} บิล</b></div>
                    <br />
                    <bs4.Row >
                        <bs4.Table striped hover bordered style={{ margin: "10px 10px 10px 10px", fontSize: "15px", fontWeight: "600" }}  >
                            <thead style={{ backgroundColor: "#1E90FF", whiteSpace: "nowrap", color: 'white' }} >
                                <th style={{ textAlign: "center" }}>ลำดับ</th>
                                <th style={{ textAlign: "center" }}>สถานที่ส่ง (งานออเดอร์)<MdIcon.MdUnfoldMore className="iconlg" onClick={() => this.sortBy('Zone')} /></th>
                                <th style={{ textAlign: "center" }} >จำนวน Invoice<MdIcon.MdUnfoldMore className="iconlg" onClick={() => this.sortBy('Bill')} /></th>
                                <th style={{ textAlign: "center" }} >หมายเหตุ<MdIcon.MdUnfoldMore className="iconlg" onClick={() => this.sortBy('Remark')} /></th>
                            </thead>
                            <tbody >
                                {this.state.dataTable}
                            </tbody>
                        </bs4.Table>
                        <bs4.Label style={{ fontWeight: "500", fontSize: "18px", margin: "30px 20px 0px 600px" }} >ผู้ตรวจสอบ................................................................</bs4.Label>
                        <bs4.Label style={{ fontWeight: "500", fontSize: "18px", margin: "30px 10px 0px 30px" }} >ผู้ส่งสินค้า................................................................</bs4.Label>
                    </bs4.Row>
                    <br />
                </bs4.Container>
            </div >
        );
    }
}

function mapStateToProps(state) {
    console.log(state)
    return state
}
export default connect(mapStateToProps)(Cashvan_roundcontrol);