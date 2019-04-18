import React, { Component } from 'react';
import * as bs4 from "reactstrap"
import * as MdIcon from 'react-icons/lib/md'
import { connect } from 'react-redux'
import moment from 'moment';
import { is_loader } from '../../actions'
import DatePicker from "react-datepicker"
import ReactToPrint from 'react-to-print';
const $ = require("jquery")
const { proxy } = require("../../service")

class Dealer_roundcontrol extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dateStart: moment(),
            IDMess: '',
            car_type: '',
            showTable: '',
            selecter: '',
            MessName: '',
            DateReport: '',
            BillAmount: '',
            CarType: '',
            result: ''
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
        var url = proxy.main + "app-api/get-messenger/MDL"
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
        var table = <div style={{ padding:"20px", pageBreakAfter: "always" }} ref={el => (this.componentRef = el)}>
            <br />
            <div style={{ textAlign: "center", fontSize: "18px", fontWeight: "800" }} >ใบคุมรอบ Mess Dealer/Trade</div>
            <div style={{ textAlign: "center", fontSize: "14px", fontWeight: "500" }} ><u>Delivery date</u> : <b>{this.state.DateReport}</b>&nbsp;&nbsp;&nbsp;<u>Messenger Name</u> : <b>{this.state.MessName}</b>&nbsp;&nbsp;&nbsp;<u>ประเภทรถ</u> : <b>{this.state.CarType}</b>&nbsp;&nbsp;&nbsp;<u>จำนวน Invoice</u> : <b>{this.state.BillAmount} บิล</b></div><br />
            <bs4.Table bordered style={{ fontSize: "12px" }}  >
                <thead style={{ fontWeight: "700" }}>
                    <th width="5%" style={{ textAlign: "center" }}>ลำดับ</th>
                    <th style={{ textAlign: "center" }}>Sale order</th>
                    <th width="15%" style={{ textAlign: "center" }} >Customer Name</th>
                    <th style={{ textAlign: "center" }} >เลขที่ INV</th>
                    <th width="5%" style={{ textAlign: "center" }} >จำนวนกล่อง</th>
                    <th width="5%" style={{ textAlign: "center" }} >น้ำหนักกล่อง</th>
                    <th width="20%" style={{ textAlign: "center" }} >ที่อยู่</th>
                    <th width="15%" style={{ textAlign: "center" }} >Remarks</th>
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
        var type = this.state.car_type

        if (id === '' || type === '') {
            alert('กรุณาเลือกข้อมูลให้ครบ')
        } else {
            var props = this.props
            props.dispatch(is_loader(true))
            var arrReport = []
            var url = proxy.main + 'get-daily-costmess-MDL/' + date + '&' + id + '&' + type
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
                                    <td style={{ textAlign: "center" }}>{val.so}</td>
                                    <td style={{ textAlign: "center" }} >{val.CustomerName}</td>
                                    <td style={{ textAlign: "center" }} >{val.INVOICEID}</td>
                                    <td style={{ textAlign: "right" }} >{val.box_amount}</td>
                                    <td style={{ textAlign: "right" }} ></td>
                                    <td style={{ textAlign: "center" }} >{val.AddressShipment}</td>
                                    <td style={{ textAlign: "center" }} >{val.remark}</td>
                                </tr>
                            )
                        }, this);

                        this.setState({
                            dataTable: arrReport,
                            MessName: responseJson.result[0].MessName,
                            DateReport: responseJson.result[0].Datetime,
                            BillAmount: responseJson.result.length,
                            CarType: responseJson.result[0].car_type,
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
                    <td style={{ textAlign: "center" }}>{val.so}</td>
                    <td style={{ textAlign: "center" }} >{val.CustomerName}</td>
                    <td style={{ textAlign: "center" }} >{val.INVOICEID}</td>
                    <td style={{ textAlign: "right" }} >{val.box_amount}</td>
                    <td style={{ textAlign: "right" }} ></td>
                    <td style={{ textAlign: "center" }} >{val.AddressShipment}</td>
                    <td style={{ textAlign: "center" }} >{val.remark}</td>
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
                        <div style={{ textAlign: "left", fontSize: "25px", fontWeight: "1000" }} >สรุปรอบรายวัน Dealer/Trade</div>
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
                        <bs4.Label style={{ fontWeight: "600", fontSize: "16px", margin: "10px 10px 0px 20px" }} >ประเภทรถ</bs4.Label>
                        <bs4.Col sm='3'>
                            <bs4.Input type="select" name="car_type" id="exampleSelect" onChange={(e) => this.onChangeForm(e.target.name, e.target.value)}>
                                <option value=''>กรุณาเลือก ประเภทรถ</option>
                                <option value='2'>2 ล้อ</option>
                                <option value='4'>4 ล้อ</option>
                                <option value='6'>6 ล้อ</option>
                                <option value='10'>10 ล้อ</option>
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
                    <div style={{ textAlign: "center", fontSize: "25px", fontWeight: "800" }} >ใบคุมรอบ Mess Dealer/Trade</div>
                    <div style={{ textAlign: "center", fontSize: "18px", fontWeight: "500" }} ><u>Delivery date</u> : <b>{this.state.DateReport}</b>&nbsp;&nbsp;&nbsp;<u>Messenger Name</u> : <b>{this.state.MessName}</b>&nbsp;&nbsp;&nbsp;<u>ประเภทรถ</u> : <b>{this.state.CarType}</b>&nbsp;&nbsp;&nbsp;<u>จำนวน Invoice</u> : <b>{this.state.BillAmount} บิล</b></div>
                    <br />
                    <bs4.Row >
                        <bs4.Table striped hover bordered style={{ margin: "10px 10px 10px 10px", fontSize: "15px", fontWeight: "600" }}  >
                            <thead style={{ backgroundColor: "#1E90FF", whiteSpace: "nowrap", color: 'white' }} >
                                <th width="5%" style={{ textAlign: "center" }}>ลำดับ</th>
                                <th style={{ textAlign: "center" }}>Sale order<MdIcon.MdUnfoldMore className="iconlg" onClick={() => this.sortBy('so')} /></th>
                                <th width="15%" style={{ textAlign: "center" }} >Customer Name<MdIcon.MdUnfoldMore className="iconlg" onClick={() => this.sortBy('CustomerName')} /></th>
                                <th style={{ textAlign: "center" }} >เลขที่ INV<MdIcon.MdUnfoldMore className="iconlg" onClick={() => this.sortBy('INVOICEID')} /></th>
                                <th width="5%" style={{ textAlign: "center" }} >จำนวนกล่อง<MdIcon.MdUnfoldMore className="iconlg" onClick={() => this.sortBy('box_amount')} /></th>
                                <th width="5%" style={{ textAlign: "center" }} >น้ำหนักกล่อง{/* <MdIcon.MdUnfoldMore className="iconlg" onClick={() => this.sortBy('rec_time')} />*/}</th>
                                <th width="20%" style={{ textAlign: "center" }} >ที่อยู่<MdIcon.MdUnfoldMore className="iconlg" onClick={() => this.sortBy('AddressShipment')} /></th>
                                <th width="15%" style={{ textAlign: "center" }} >Remarks<MdIcon.MdUnfoldMore className="iconlg" onClick={() => this.sortBy('remark')} /></th>
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
export default connect(mapStateToProps)(Dealer_roundcontrol);