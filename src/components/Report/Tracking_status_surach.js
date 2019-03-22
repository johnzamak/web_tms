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

class Tracking_status extends Component {
    constructor(props) {
        super(props)
        this.state = {
            show_date_bill: "",
            show_sale_code: "",
            show_table: [],
            date_start: moment(),
            date_end: moment(),
            tbl_keep: []
        }
    }
    onChangeForm = (id, value) => {
        this.setState({ [id]: value }, () => {
            console.log("checkData", this.state);
        })
    }
    componentWillMount() {
        const { first_data } = this.props
        if (first_data) {
            this.get_data_from_api(this)
        }
    }
    get_data_from_api = (self) => {
        self.props.dispatch(is_loader(true))
        setTimeout(() => {
            var date_start = moment(self.state.date_start._d).format("YYYY-MM-DD")
            var date_end = moment(self.state.date_end._d).format("YYYY-MM-DD")
            let url = proxy.main + "report/report-status-surach/" + date_start + "&" + date_end
            fetch(url)
                .then(response => response.json())
                .then((responseJson) => {
                    console.log("get_data_from_api", responseJson);
                    if (responseJson.status === 200) {
                        self.set_data_table(self, responseJson.result)
                    } else {

                    }
                })
        }, 3000);
    }
    check_status_track(status, mess_rec, mess_send, mess_clear) {
        let set_status
        switch (status) {
            case 0: set_status = { bgColor: "#F4D03F", text: "รอคอนเฟิร์ม", cName: "0" }; break;
            case 1: set_status = { bgColor: "#F5B041", text: "รอรับงาน", cName: "1" }; break;
            case 2: set_status = { bgColor: "#EB984E", text: "รอจ่ายงาน", cName: "2" }; break;
            case 3:
                if (mess_rec == null && mess_send == null && mess_clear == null) {
                    set_status = { bgColor: "#E74C3C", text: "รอแมสรับงาน", cName: "3" }
                } else if (mess_rec != null && mess_send == null && mess_clear == null) {
                    set_status = { bgColor: "#5DADE2", text: "รอแมสส่งสินค้า", cName: "4" }
                } else if (mess_rec != null && mess_send != null && mess_clear == null) {
                    set_status = { bgColor: "#48C9B0", text: "รอแมสเคลียร์เงิน", cName: "5" }
                } else if (mess_rec != null && mess_send != null && mess_clear != null) {
                    set_status = { bgColor: "#00FF00", text: "จบงานแล้ว", cName: "6" }
                } else if (mess_rec == null && mess_send == null && mess_clear != null) {
                    set_status = { bgColor: "#C0C0C0", text: "งานส่งใหม่", cName: "8" }
                } else if (mess_rec != null && mess_send == null && mess_clear != null) {
                    set_status = { bgColor: "#808080", text: "งานกำลังส่งใหม่", cName: "7" }
                }
                break;
        }
        return set_status;
    }
    set_data_table(self, result) {
        let arr_data = [], get_status, arr_keep_tbl = []
        if (result.length > 0) {
            result.forEach((val, i) => {
                get_status = this.check_status_track(val.status, val.stamp_workapp, val.stamp_finishapp, val.stamp_report)
                let new_obj = Object.assign({ cName: get_status.cName }, val)
                arr_keep_tbl.push(new_obj)
                arr_data.push(
                    <tr>
                        <td className={get_status.cName} style={{ whiteSpace: "nowrap", textAlign: "center" }} > {i + 1} </td>
                        <td className={get_status.cName} style={{ whiteSpace: "nowrap", textAlign: "center" }} > {val.document_main} </td>
                        <td className={get_status.cName} style={{ whiteSpace: "nowrap", textAlign: "center" }} > {val.document_sub} </td>
                        <td className={get_status.cName} style={{ whiteSpace: "nowrap", textAlign: "left" }} > {val.customer_name} </td>
                        <td className={get_status.cName} style={{ whiteSpace: "nowrap", textAlign: "center" }} > {val.sales_group} </td>
                        <td className={get_status.cName} style={{ whiteSpace: "nowrap", textAlign: "left" }} > {val.store_zone} </td>
                        <td className={get_status.cName} style={{ whiteSpace: "nowrap", textAlign: "center" }} > {val.code_zone} </td>
                        <td className={get_status.cName} style={{ whiteSpace: "nowrap", textAlign: "right" }} > {this.numberFormat(val.invoice_qty, 0)} </td>
                        <td className={get_status.cName} style={{ whiteSpace: "nowrap", textAlign: "right" }} > {this.numberFormat(val.invoice_amount, 0)} </td>
                        <td className={get_status.cName} style={{ whiteSpace: "nowrap", textAlign: "right" }} > {val.box_amount} </td>
                        <td className={get_status.cName} style={{ whiteSpace: "nowrap", textAlign: "center" }} > {val.dlv_term} </td>
                        <td className={get_status.cName} style={{ whiteSpace: "nowrap", textAlign: "center" }} > {val.delivery_date} </td>
                        <td className={get_status.cName} style={{ whiteSpace: "nowrap", textAlign: "center", backgroundColor: get_status.bgColor }} > {get_status.text} </td>
                        <td className={get_status.cName} style={{ whiteSpace: "nowrap", textAlign: "center" }} > {val.confirm_scan} </td>
                        <td className={get_status.cName} style={{ whiteSpace: "nowrap", textAlign: "center" }} > {val.receive_scan} </td>
                        <td className={get_status.cName} style={{ whiteSpace: "nowrap", textAlign: "center" }} > {val.send_scan} </td>
                        <td className={get_status.cName} style={{ whiteSpace: "nowrap", textAlign: "left" }} > {val.MessName} </td>
                        <td className={get_status.cName} style={{ whiteSpace: "nowrap", textAlign: "center" }} > {val.stamp_workapp} </td>
                        <td className={get_status.cName} style={{ whiteSpace: "nowrap", textAlign: "center" }} > {val.stamp_finishapp} </td>
                        <td className={get_status.cName} style={{ whiteSpace: "nowrap", textAlign: "center" }} > {(get_status.cName === "7") ? "" : val.stamp_report} </td>
                        <td className={get_status.cName} style={{ whiteSpace: "nowrap", textAlign: "center" }} > <MdIcon.MdEdit className="iconlg" /> </td>
                    </tr>
                )
            });
            var date_start = moment(self.state.date_start._d).format("YYYY-MM-DD")
            var date_end = moment(self.state.date_end._d).format("YYYY-MM-DD")
            self.setState({ tbl_keep: arr_keep_tbl, show_table: arr_data, show_date_bill: date_start + " - " + date_end }, () => {
                $("#tblData").show()
                self.props.dispatch(is_loader(false))
                self._set_filter_tbl(self, "")
            })
        }
    }
    numberFormat(val, fixed) {
        val = parseInt(val)
        fixed = parseInt(fixed)
        if (fixed <= 0) {
            return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        } else {
            return val.toFixed(fixed).toString().replace(/(\d)(?=(\d{3})+\.)/g, '$1,')
        }
        if (val <= 0) {
            return false
        }
    }
    _set_filter_tbl(self, cStatus) {
        self.props.dispatch(is_loader(true))
        var new_arr_data = [], arr_data = [], get_status
        var all_tbl = self.state.tbl_keep
        if (cStatus === "") {
            new_arr_data = self.state.tbl_keep
        } else {
            new_arr_data = all_tbl.filter(key => key.cName === cStatus)
        }
        new_arr_data.forEach((val, i) => {
            get_status = self.check_status_track(val.status, val.stamp_workapp, val.stamp_finishapp, val.stamp_report)
            if (get_status.cName === "6") {
                if(cStatus===""){}else{
                    arr_data.push(
                        <tr>
                            <td className={get_status.cName} style={{ whiteSpace: "nowrap", textAlign: "center" }} > {i + 1} </td>
                            <td className={get_status.cName} style={{ whiteSpace: "nowrap", textAlign: "center" }} > {val.document_main} </td>
                            <td className={get_status.cName} style={{ whiteSpace: "nowrap", textAlign: "center" }} > {val.document_sub} </td>
                            <td className={get_status.cName} style={{ whiteSpace: "nowrap", textAlign: "center" }} > {val.customer_name} </td>
                            <td className={get_status.cName} style={{ whiteSpace: "nowrap", textAlign: "center" }} > {val.sales_group} </td>
                            <td className={get_status.cName} style={{ whiteSpace: "nowrap", textAlign: "center" }} > {val.store_zone} </td>
                            <td className={get_status.cName} style={{ whiteSpace: "nowrap", textAlign: "center" }} > {val.code_zone} </td>
                            <td className={get_status.cName} style={{ whiteSpace: "nowrap", textAlign: "right" }} > {self.numberFormat(val.invoice_qty, 0)} </td>
                            <td className={get_status.cName} style={{ whiteSpace: "nowrap", textAlign: "right" }} > {self.numberFormat(val.invoice_amount, 0)} </td>
                            <td className={get_status.cName} style={{ whiteSpace: "nowrap", textAlign: "right" }} > {val.box_amount} </td>
                            <td className={get_status.cName} style={{ whiteSpace: "nowrap", textAlign: "center" }} > {val.dlv_term} </td>
                            <td className={get_status.cName} style={{ whiteSpace: "nowrap", textAlign: "center" }} > {val.delivery_date} </td>
                            <td className={get_status.cName} style={{ whiteSpace: "nowrap", textAlign: "center", backgroundColor: get_status.bgColor }} > {get_status.text} </td>
                            <td className={get_status.cName} style={{ whiteSpace: "nowrap", textAlign: "center" }} > {val.confirm_scan} </td>
                            <td className={get_status.cName} style={{ whiteSpace: "nowrap", textAlign: "center" }} > {val.receive_scan} </td>
                            <td className={get_status.cName} style={{ whiteSpace: "nowrap", textAlign: "center" }} > {val.send_scan} </td>
                            <td className={get_status.cName} style={{ whiteSpace: "nowrap", textAlign: "center" }} > {val.MessName} </td>
                            <td className={get_status.cName} style={{ whiteSpace: "nowrap", textAlign: "center" }} > {val.stamp_workapp} </td>
                            <td className={get_status.cName} style={{ whiteSpace: "nowrap", textAlign: "center" }} > {val.stamp_finishapp} </td>
                            <td className={get_status.cName} style={{ whiteSpace: "nowrap", textAlign: "center" }} > {(get_status.cName === "7") ? "" : val.stamp_report} </td>
                            <td className={get_status.cName} style={{ whiteSpace: "nowrap", textAlign: "center" }} > <MdIcon.MdEdit className="iconlg" /> </td>
                        </tr>
                    )
                }
            }else{
                arr_data.push(
                    <tr>
                        <td className={get_status.cName} style={{ whiteSpace: "nowrap", textAlign: "center" }} > {i + 1} </td>
                        <td className={get_status.cName} style={{ whiteSpace: "nowrap", textAlign: "center" }} > {val.document_main} </td>
                        <td className={get_status.cName} style={{ whiteSpace: "nowrap", textAlign: "center" }} > {val.document_sub} </td>
                        <td className={get_status.cName} style={{ whiteSpace: "nowrap", textAlign: "center" }} > {val.customer_name} </td>
                        <td className={get_status.cName} style={{ whiteSpace: "nowrap", textAlign: "center" }} > {val.sales_group} </td>
                        <td className={get_status.cName} style={{ whiteSpace: "nowrap", textAlign: "center" }} > {val.store_zone} </td>
                        <td className={get_status.cName} style={{ whiteSpace: "nowrap", textAlign: "center" }} > {val.code_zone} </td>
                        <td className={get_status.cName} style={{ whiteSpace: "nowrap", textAlign: "right" }} > {self.numberFormat(val.invoice_qty, 0)} </td>
                        <td className={get_status.cName} style={{ whiteSpace: "nowrap", textAlign: "right" }} > {self.numberFormat(val.invoice_amount, 0)} </td>
                        <td className={get_status.cName} style={{ whiteSpace: "nowrap", textAlign: "right" }} > {val.box_amount} </td>
                        <td className={get_status.cName} style={{ whiteSpace: "nowrap", textAlign: "center" }} > {val.dlv_term} </td>
                        <td className={get_status.cName} style={{ whiteSpace: "nowrap", textAlign: "center" }} > {val.delivery_date} </td>
                        <td className={get_status.cName} style={{ whiteSpace: "nowrap", textAlign: "center", backgroundColor: get_status.bgColor }} > {get_status.text} </td>
                        <td className={get_status.cName} style={{ whiteSpace: "nowrap", textAlign: "center" }} > {val.confirm_scan} </td>
                        <td className={get_status.cName} style={{ whiteSpace: "nowrap", textAlign: "center" }} > {val.receive_scan} </td>
                        <td className={get_status.cName} style={{ whiteSpace: "nowrap", textAlign: "center" }} > {val.send_scan} </td>
                        <td className={get_status.cName} style={{ whiteSpace: "nowrap", textAlign: "center" }} > {val.MessName} </td>
                        <td className={get_status.cName} style={{ whiteSpace: "nowrap", textAlign: "center" }} > {val.stamp_workapp} </td>
                        <td className={get_status.cName} style={{ whiteSpace: "nowrap", textAlign: "center" }} > {val.stamp_finishapp} </td>
                        <td className={get_status.cName} style={{ whiteSpace: "nowrap", textAlign: "center" }} > {(get_status.cName === "7") ? "" : val.stamp_report} </td>
                        <td className={get_status.cName} style={{ whiteSpace: "nowrap", textAlign: "center" }} > <MdIcon.MdEdit className="iconlg" /> </td>
                    </tr>
                )
            }
        });
        self.setState({ show_table: arr_data }, () => {
            self.props.dispatch(is_loader(false))
        })
    }
    filter_tbl = (e) => {
        var val = e.target.value
        this._set_filter_tbl(this, val)
    }
    render() {
        return (
            <div>
                <bs4.Container className="bgContainer-White" fluid>
                    <div style={{ textAlign: "left", fontSize: "22px", fontWeight: "800" }} >รายงานติดตามสถานะ</div>
                    <bs4.Row>
                        <bs4.Col xs="3" >
                            <bs4.FormGroup row>
                                <bs4.Label style={{ fontWeight: "500", fontSize: "16px", margin: "10px 20px 0px 20px" }} >วันที่เริ่มต้น</bs4.Label>
                                <div style={{ marginTop: "10px", }} >
                                    <DatePicker
                                        dateFormat="YYYY-MM-DD"
                                        selected={this.state.date_start}
                                        onChange={(date) => this.onChangeForm("date_start", date)}
                                        // minDate={moment(date.addDays(0))}
                                        maxDate={addMonths(new Date(), 1)}
                                    />
                                </div>
                            </bs4.FormGroup>
                        </bs4.Col>
                        <bs4.Col xs="3" >
                            <bs4.FormGroup row>
                                <bs4.Label style={{ fontWeight: "500", fontSize: "16px", margin: "10px 20px 0px 20px" }} >วันที่สิ้นสุด</bs4.Label>
                                <div style={{ marginTop: "10px", }} >
                                    <DatePicker
                                        dateFormat="YYYY-MM-DD"
                                        selected={this.state.date_end}
                                        onChange={(date) => this.onChangeForm("date_end", date)}
                                        // minDate={moment(date.addDays(0))}
                                        maxDate={addMonths(new Date(), 1)}
                                    />
                                </div>
                            </bs4.FormGroup>
                        </bs4.Col>
                        <bs4.Col xs="2" >
                            <bs4.Button color="info" onClick={() => { this.get_data_from_api(this) }} > <MdIcon.MdSearch className="iconlg" /> SEARCH</bs4.Button>
                        </bs4.Col>
                    </bs4.Row >
                    <hr className="hrCustom" />
                    <div id="tblData" style={{ display: "none" }} >
                        <div style={{ float: "left" }}>
                            <bs4.Input type="select" onChange={this.filter_tbl} >
                                <option value="" >แสดงทั้งหมด</option>
                                <option value="0" >รอคอนเฟิร์ม</option>
                                <option value="1" >รอรับงาน</option>
                                <option value="2" >รอจ่ายงาน</option>
                                <option value="3" >รอแมสรับงาน</option>
                                <option value="4" >รอแมสส่งสินค้า</option>
                                <option value="5" >รอแมสเคลียร์เงิน</option>
                                <option value="6" >จบงานแล้ว</option>
                            </bs4.Input> </div>
                        <div style={{ textAlign: "center", fontSize: "18px" }} >วันที่ : {this.state.show_date_bill} </div>
                        <div style={{ clear: "both" }} ></div>
                        <bs4.Row>
                            <bs4.Table striped hover bordered style={{ margin: "10px 10px 10px 10px" }} >
                                <thead style={{ backgroundColor: "#17a2b8", whiteSpace: "nowrap" }} >
                                    <td style={{ whiteSpace: "nowrap", textAlign: "center" }} >ลำดับ</td>
                                    <td style={{ whiteSpace: "nowrap", textAlign: "center" }} >เอกสาร</td>
                                    <td style={{ whiteSpace: "nowrap", textAlign: "center" }} >เอกสารอ้างอิง</td>
                                    <td style={{ whiteSpace: "nowrap", textAlign: "center" }} >ชื่อลูกค้า</td>
                                    <td style={{ whiteSpace: "nowrap", textAlign: "center" }} >Group</td>
                                    <td style={{ whiteSpace: "nowrap", textAlign: "center" }} >Store zone</td>
                                    <td style={{ whiteSpace: "nowrap", textAlign: "center" }} >Zone</td>
                                    <td style={{ whiteSpace: "nowrap", textAlign: "center" }} >จำนวนสินค้า</td>
                                    <td style={{ whiteSpace: "nowrap", textAlign: "center" }} >ราคาสินค้าทั้งหมด</td>
                                    <td style={{ whiteSpace: "nowrap", textAlign: "center" }} >จำนวนกล่อง</td>
                                    <td style={{ whiteSpace: "nowrap", textAlign: "center" }} >ช่องทางจัดส่ง</td>
                                    <td style={{ whiteSpace: "nowrap", textAlign: "center" }} >วันที่จัดส่ง</td>
                                    <td style={{ whiteSpace: "nowrap", textAlign: "center" }} >สถานะปัจจุบัน</td>
                                    <td style={{ whiteSpace: "nowrap", textAlign: "center" }} >สแกนคอนเฟิร์ม</td>
                                    <td style={{ whiteSpace: "nowrap", textAlign: "center" }} >สแกนรับงาน</td>
                                    <td style={{ whiteSpace: "nowrap", textAlign: "center" }} >สแกนจ่ายงาน</td>
                                    <td style={{ whiteSpace: "nowrap", textAlign: "center" }} >ชื่อผู้รับงาน</td>
                                    <td style={{ whiteSpace: "nowrap", textAlign: "center" }} >รับงาน</td>
                                    <td style={{ whiteSpace: "nowrap", textAlign: "center" }} >ส่งงาน</td>
                                    <td style={{ whiteSpace: "nowrap", textAlign: "center" }} >เคลียร์เงิน</td>
                                    <td style={{ whiteSpace: "nowrap", textAlign: "center" }} >หมา่ยเหตุ</td>
                                </thead>
                                <tbody  >
                                    {this.state.show_table}
                                </tbody>

                            </bs4.Table>
                        </bs4.Row>
                    </div>
                </bs4.Container>
            </div>
        );
    }
}
function mapStateToProps(state) {
    console.log(state)
    return state
}
export default connect(mapStateToProps)(Tracking_status);