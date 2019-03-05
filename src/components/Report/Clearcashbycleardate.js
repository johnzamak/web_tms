import React, { Component } from 'react';
import * as bs4 from "reactstrap"
import * as MdIcon from 'react-icons/lib/md'
import DatePicker from "react-datepicker"
import { connect } from 'react-redux'
import { is_loader } from '../../actions'

const moment = require("moment")
const addMonths = require('addmonths')
const { proxy } = require("../../service")
const $ = require("jquery")
var date = new Date();

class Clearcash extends Component {
    constructor(props) {
        super(props)
        this.state = {
            show_date_bill: "",
            show_sale_code: "",
            show_table: [],
            input_date: moment(),
            tbl_keep: []
        }
    }
    _onClick_search=(e)=>{
        this._get_data_from_api(this)
    }
    _get_messenger(self) {
        var url = proxy.main + "app-api/get-messenger/" + self.state.type_mess
        fetch(url)
            .then(response => response.json())
            .then((responseJson) => {
                console.log("get_messenger", responseJson)
                var arr_data = []
                if (responseJson.status === 200) {
                    responseJson.result.forEach((val, i) => {
                        arr_data.push(
                            <option value={val.IDMess}>{val.MessName}</option>
                        )
                    });
                    self.setState({ option_messenger: arr_data })
                } else {

                }
            })
    }
    _get_data_from_api(self) {
        self.props.dispatch(is_loader(true))
        var messCode = self.state.mess_code, inDate = moment(self.state.input_date).format("YYYY-MM-DD")
        var url = proxy.main + "report/report-clearcash-by-cleardate/" + messCode + "&" + inDate
        fetch(url)
            .then(response => response.json())
            .then((responseJson) => {
                console.log("_get_data_from_api", responseJson)
                if (responseJson.status === 200) {
                    self._set_data_table(self, responseJson.result)
                } else {
                    let arr_data = []
                    arr_data.push(<tr><td colSpan="13" style={{ textAlign: "center", fontWeight: "800" }} >{"ไม่พบข้อมูลในระบบ"}</td></tr>)
                    self.setState({ show_table: arr_data }, () => {
                        self.props.dispatch(is_loader(false))
                    })
                }
            })
    }
    _onChange_type_mess = (e) => {
        var val = e.target.value
        var self = this
        this.setState({
            type_mess: val
        }, () => {
            self._get_messenger(self)
        })
    }
    _onChange_select_mess = (e) => {
        var val = $('#select_mess option:selected').text()
        var valCode = e.target.value
        this.setState({ mess_code: valCode, mess_name: val, show_mess_name: val })
    }
    _set_data_table(self){

    }
    _onClick_Print=(e)=>{

    }
    _onChange_Form = (id, value) => {
        this.setState({ [id]: value })
    }
    render() {
        return (
            <div>
                <bs4.Container className="bgContainer-White" fluid>
                    <div style={{ textAlign: "left", fontSize: "22px", fontWeight: "800" }} >รายงานโอนเงินตามวันที่เคลียร์</div>
                    <bs4.Row>
                        <bs4.Col xs="2" >
                            <bs4.FormGroup row>
                                <div style={{ marginTop: "10px", marginLeft: "20px" }} >
                                    <bs4.Input id="type_mess" type="select" onChange={this._onChange_type_mess} >
                                        <option value="">โปรดเลือกกลุ่มงาน</option>
                                        <option value="MDL">Dealer</option>
                                        <option value="MCV">Cashvan</option>
                                    </bs4.Input>
                                </div>
                            </bs4.FormGroup>
                        </bs4.Col>
                        <bs4.Col xs="2" >
                            <bs4.FormGroup row>
                                <div style={{ marginTop: "10px", }} >
                                    <bs4.Input id="select_mess" type="select" onChange={this._onChange_select_mess} >
                                        <option value="">โปรดเลือกพนักงานจัดส่ง</option>
                                        {this.state.option_messenger}
                                    </bs4.Input>
                                </div>
                            </bs4.FormGroup>
                        </bs4.Col>
                        <bs4.Col xs="3" >
                            <bs4.FormGroup row>
                                <bs4.Label style={{ fontWeight: "500", fontSize: "16px", margin: "10px 20px 0px 20px" }} >วันที่เคลียร์บิล</bs4.Label>
                                <div style={{ marginTop: "10px", }} >
                                    <DatePicker
                                        dateFormat="YYYY-MM-DD"
                                        selected={this.state.input_date}
                                        onChange={(date) => this._onChange_Form("input_date", date)}
                                        maxDate={addMonths(new Date(), 1)}
                                    />
                                </div>
                            </bs4.FormGroup>
                        </bs4.Col>
                        <bs4.Col xs="2" >
                            <bs4.Button id="btnSearch" color="info" onClick={this._onClick_search} > <MdIcon.MdSearch className="iconlg" /> SEARCH</bs4.Button>
                        </bs4.Col>
                        <bs4.Col xs="2" >
                                <bs4.Button id="btnPrintSlip" className="btnLong" color="warning" onClick={this._onClick_Print} ><MdIcon.MdPrint className="iconSize" /> PRINT</bs4.Button>
                            </bs4.Col>
                    </bs4.Row>
                    <hr className="hrCustom" />
                    <div style={{ textAlign: "center", fontSize: "36px", fontWeight: "800" }} >รายงานโอนเงินตามวันที่เคลียร์</div>
                    <div style={{ textAlign: "center", fontSize: "18px" }} >วันที่เคลียร์บิล : {this.state.show_date_bill}| ผู้ส่งเอกสาร : .......................................... </div>
                    <bs4.Row>
                        <bs4.Table striped hover style={{ margin: "10px 10px 10px 10px" }} >
                            <thead style={{ backgroundColor: "#17a2b8", whiteSpace: "nowrap" }} >
                                <th style={{ whiteSpace: "nowrap", textAlign: "center" }} >ลำดับ</th>
                                <th style={{ whiteSpace: "nowrap", textAlign: "center" }} >Invoice Date</th>
                                <th style={{ whiteSpace: "nowrap", textAlign: "center" }} >Clear Date</th>
                                <th style={{ whiteSpace: "nowrap", textAlign: "center" }} >Amount (Invoice)</th>
                            </thead>
                            <tbody  >
                                {this.state.show_table}
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
export default connect(mapStateToProps)(Clearcash);