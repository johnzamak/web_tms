import React, { Component } from 'react';
import * as bs4 from "reactstrap"
import * as MdIcon from 'react-icons/lib/md'
import DatePicker from "react-datepicker"
import { connect } from 'react-redux'
import { is_loader } from '../../actions'
import ITR_Detail from "../../components/Modal/ITR_Detail"
import Signature from "../../components/Modal/Signature"

const moment = require("moment")
const addMonths = require('addmonths')
const { proxy } = require("../../service")
const $ = require("jquery")
var date = new Date();

class Tracking_status_Claim extends Component {
    constructor(props) {
        super(props)
        this.state = {
            show_date_bill: "",
            show_sale_code: "",
            show_table: [],
            date_start: moment(),
            date_end: moment(),
            tbl_keep: [],
            modal_itr: {
                is_open: false,
                ITRNo: "",
            },
            modal_signature: {
                is_open: false,
                ITRNo: "",
            }
        }
    }

    componentWillMount() {
        const { first_data } = this.props
        if (first_data) {
            // this.get_data_from_api(this)
        }
    }
    get_data_from_api = (self) => {
        self.props.dispatch(is_loader(true))
        $("#tblData").fadeOut("fast")
        var date_start = moment(self.state.date_start._d).format("YYYY-MM-DD")
        var date_end = moment(self.state.date_end._d).format("YYYY-MM-DD")
        let url = proxy.main + "report/report-status-claim/" + date_start + "&" + date_end
        fetch(url)
            .then(response => response.json())
            .then((responseJson) => {
                console.log("get_data_from_api", responseJson);
                if (responseJson.status === 200) {
                    self.set_data_table(self, responseJson.result)
                } else {
                    self.props.dispatch(is_loader(false))
                }
            })
    }
    check_status_track(status, mess_rec, mess_send, mess_clear) {
        let set_status = { bgColor: "", text: "", cName: "99" }
        switch (status) {
            case 0: set_status = { bgColor: "#dc3545", text: "รอคอนเฟิร์ม", cName: "0" }; break;
            case 1: set_status = { bgColor: "#ffc107", text: "รอรับงาน", cName: "1" }; break;
            case 2: set_status = { bgColor: "#fd7e14", text: "รอจ่ายงาน", cName: "2" }; break;
            case 3:
                if (mess_rec == null && mess_send == null && mess_clear == null) {
                    set_status = { bgColor: "#6f42c1", text: "รอแมสรับงาน", cName: "3" }
                } else if (mess_rec != null && mess_send == null && mess_clear == null) {
                    set_status = { bgColor: "#20c997", text: "รอแมสส่งสินค้า", cName: "4" }
                } else if (mess_rec != null && mess_send != null && mess_clear == null) {
                    set_status = { bgColor: "#20c997", text: "รอแมสเคลียร์เงิน", cName: "5" }
                } else if (mess_rec != null && mess_send != null && mess_clear != null) {
                    set_status = { bgColor: "#28a745", text: "จบงานแล้ว", cName: "6" }
                } else if (mess_rec == null && mess_send == null && mess_clear != null) {
                    set_status = { bgColor: "#ABB2B9", text: "งานส่งใหม่", cName: "8" }
                } else if (mess_rec != null && mess_send == null && mess_clear != null) {
                    set_status = { bgColor: "#ABB2B9", text: "งานกำลังส่งใหม่", cName: "7" }
                }
                break;
        }
        return set_status
    }
    _onClick_modal_signature = (ITRNo) => {
        this.setState({
            modal_signature: {
                is_open: true,
                ITRNo: ITRNo,
            }
        })
    }
    _onClick_modal_itrDetail = (ITRNo) => {
        this.setState({
            modal_itr: {
                is_open: true,
                ITRNo: ITRNo,
            }
        })
    }
    onChangeForm = (id, value) => {
        this.setState({ [id]: value }, () => {
            console.log("checkData", this.state);
        })
    }
    set_data_table(self, result) {
        let arr_data = [], get_status, arr_keep_tbl = [], show_work_day = { days: 0, bgColor: "" }
        if (result.length > 0) {
            result.forEach((val, i) => {
                var check_Days = moment(val.stamp_report).diff(val.createDate, 'days')
                get_status = this.check_status_track(val.status, val.stamp_workapp, val.stamp_finishapp, val.stamp_report)
                // console.log("object", get_status, val)
                if (typeof get_status.cName == "undefined") {
                    // console.log("object", get_status)
                }
                if (isNaN(check_Days)) {
                    show_work_day = { days: 0, bgColor: "" }
                } else {
                    if (check_Days > 5) {
                        show_work_day = { days: check_Days, bgColor: "#E74C3C" }
                    } else {
                        show_work_day = { days: check_Days, bgColor: "" }
                    }
                }

                let new_obj = Object.assign({ cName: get_status.cName }, val)
                arr_keep_tbl.push(new_obj)
                arr_data.push(
                    <tr>
                        <td className={get_status.cName} style={{ whiteSpace: "nowrap", textAlign: "center" }} > {i + 1} </td>
                        <td className={get_status.cName} style={{ whiteSpace: "nowrap", textAlign: "center" }} > {val.customerNo} </td>
                        <td className={get_status.cName} style={{ whiteSpace: "nowrap", textAlign: "left" }} > {val.customerName} </td>
                        <td className={get_status.cName} style={{ textAlign: "center" }} > {val.remark} </td>
                        <td className={get_status.cName} style={{ whiteSpace: "nowrap", textAlign: "center" }} > {val.saleCode} </td>
                        <td className={get_status.cName} style={{ whiteSpace: "nowrap", textAlign: "center" }} > {val.packingRemark} </td>
                        <td className={get_status.cName} style={{ whiteSpace: "nowrap", textAlign: "center" }} > {val.extDocNo} </td>
                        <td className={get_status.cName} style={{ whiteSpace: "nowrap", textAlign: "center" }} > {val.receiveDate} </td>
                        <td className={get_status.cName} style={{ whiteSpace: "nowrap", textAlign: "center" }} > {val.createDate} </td>
                        <td className={get_status.cName} style={{ whiteSpace: "nowrap", textAlign: "center" }} > {val.AXDocument} </td>
                        <td className={get_status.cName} style={{ whiteSpace: "nowrap", textAlign: "center" }} >
                            <span onClick={() => this._onClick_modal_itrDetail(val.ITRNo)} style={{ cursor: "pointer", color: "#007bff" }} >
                                {val.ITRNo} </span>
                        </td>

                        <td className={get_status.cName} style={{ whiteSpace: "nowrap", textAlign: "center" }} > {val.document_main} </td>
                        {/* <td className={get_status.cName} style={{ whiteSpace: "nowrap", textAlign: "left" }} > {val.customer_name} </td> */}
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
                        <td className={get_status.cName} style={{ whiteSpace: "nowrap", textAlign: "center" }} >
                            <div onClick={(e) => this._onClick_modal_signature(val.ITRNo)} style={{ cursor: "pointer", color: "#007bff" }} >{val.stamp_finishapp} </div>
                        </td>
                        <td className={get_status.cName} style={{ whiteSpace: "nowrap", textAlign: "center" }} > {(get_status.cName === "7") ? "" : val.stamp_report} </td>
                        <td className={get_status.cName} style={{ whiteSpace: "nowrap", textAlign: "center", backgroundColor: show_work_day.bgColor }} > {show_work_day.days} </td>
                    </tr>
                )
            });
            var date_start = moment(self.state.date_start._d).format("YYYY-MM-DD")
            var date_end = moment(self.state.date_end._d).format("YYYY-MM-DD")
            this.setState({ tbl_keep: arr_keep_tbl, show_table: arr_data, show_date_bill: date_start + " - " + date_end }, () => {
                self.props.dispatch(is_loader(false))
                $("#tblData").fadeIn("slow")
            })
        }
    }
    numberFormat(val, fixed) {
        val = parseInt(val)
        fixed = parseInt(fixed)
        if (val <= 0) {
            return 0
        }
        if (isNaN(val)) {
            return ""
        }
        if (fixed <= 0) {
            return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        } else {
            return val.toFixed(fixed).toString().replace(/(\d)(?=(\d{3})+\.)/g, '$1,')
        }

    }
    filter_tbl = (e) => {
        this.props.dispatch(is_loader(true))
        var new_arr_data = [], arr_data = [], get_status,show_work_day = { days: 0, bgColor: "" }
        var all_tbl = this.state.tbl_keep
        var val = e.target.value
        if (val === "") {
            new_arr_data = this.state.tbl_keep
        } else {
            new_arr_data = all_tbl.filter(key => key.cName === val)
        }

        new_arr_data.forEach((val, i) => {
            get_status = this.check_status_track(val.status, val.stamp_workapp, val.stamp_finishapp, val.stamp_report)
            var check_Days = moment(val.stamp_report).diff(val.createDate, 'days')
            if (isNaN(check_Days)) {
                show_work_day = { days: 0, bgColor: "" }
            } else {
                if (check_Days > 5) {
                    show_work_day = { days: check_Days, bgColor: "#E74C3C" }
                } else {
                    show_work_day = { days: check_Days, bgColor: "" }
                }
            }
            arr_data.push(
                <tr>
                    <td className={get_status.cName} style={{ whiteSpace: "nowrap", textAlign: "center" }} > {i + 1} </td>
                    <td className={get_status.cName} style={{ whiteSpace: "nowrap", textAlign: "center" }} > {val.customerNo} </td>
                    <td className={get_status.cName} style={{ whiteSpace: "nowrap", textAlign: "left" }} > {val.customerName} </td>
                    <td className={get_status.cName} style={{ textAlign: "center" }} > {val.remark} </td>
                    <td className={get_status.cName} style={{ whiteSpace: "nowrap", textAlign: "center" }} > {val.saleCode} </td>
                    <td className={get_status.cName} style={{ whiteSpace: "nowrap", textAlign: "center" }} > {val.packingRemark} </td>
                    <td className={get_status.cName} style={{ whiteSpace: "nowrap", textAlign: "center" }} > {val.extDocNo} </td>
                    <td className={get_status.cName} style={{ whiteSpace: "nowrap", textAlign: "center" }} > {val.receiveDate} </td>
                    <td className={get_status.cName} style={{ whiteSpace: "nowrap", textAlign: "center" }} > {val.createDate} </td>
                    <td className={get_status.cName} style={{ whiteSpace: "nowrap", textAlign: "center" }} > {val.AXDocument} </td>
                    <td className={get_status.cName} style={{ whiteSpace: "nowrap", textAlign: "center" }} >
                        <span onClick={() => this._onClick_modal_itrDetail(val.ITRNo)} style={{ cursor: "pointer", color: "#007bff" }} >
                            {val.ITRNo} </span>
                    </td>

                    <td className={get_status.cName} style={{ whiteSpace: "nowrap", textAlign: "center" }} > {val.document_main} </td>
                    {/* <td className={get_status.cName} style={{ whiteSpace: "nowrap", textAlign: "left" }} > {val.customer_name} </td> */}
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
                    <td className={get_status.cName} style={{ whiteSpace: "nowrap", textAlign: "center" }} >
                        <div onClick={(e) => this._onClick_modal_signature(val.ITRNo)} style={{ cursor: "pointer", color: "#007bff" }} >{val.stamp_finishapp} </div>
                    </td>
                    <td className={get_status.cName} style={{ whiteSpace: "nowrap", textAlign: "center" }} > {(get_status.cName === "7") ? "" : val.stamp_report} </td>
                    <td className={get_status.cName} style={{ whiteSpace: "nowrap", textAlign: "center", backgroundColor: show_work_day.bgColor }} > {show_work_day.days} </td>
                </tr>
            )
        });
        this.setState({ show_table: arr_data }, () => {
            this.props.dispatch(is_loader(false))
        })
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
                    </bs4.Row>
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
                                    <td style={{ whiteSpace: "nowrap", textAlign: "center" }} >รหัสลูกค้า</td>
                                    <td style={{ whiteSpace: "nowrap", textAlign: "center" }} >ชื่อลูกค้า</td>
                                    <td style={{ textAlign: "center" }} >หมายเหตุ</td>
                                    <td style={{ whiteSpace: "nowrap", textAlign: "center" }} >รหัสเซลล์</td>
                                    <td style={{ whiteSpace: "nowrap", textAlign: "center" }} >Packing Remark</td>
                                    <td style={{ whiteSpace: "nowrap", textAlign: "center" }} >Ext. No</td>
                                    <td style={{ whiteSpace: "nowrap", textAlign: "center" }} >วันที่รับ</td>
                                    <td style={{ whiteSpace: "nowrap", textAlign: "center" }} >วันที่คีย์</td>
                                    <td style={{ whiteSpace: "nowrap", textAlign: "center" }} >เอกสาร AX</td>

                                    <td style={{ whiteSpace: "nowrap", textAlign: "center" }} >เอกสาร ITR</td>
                                    <td style={{ whiteSpace: "nowrap", textAlign: "center" }} >เอกสาร TMS</td>
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
                                    <td style={{ whiteSpace: "nowrap", textAlign: "center" }} >เดินงาน/วัน</td>
                                </thead>
                                <tbody  >
                                    {this.state.show_table}
                                </tbody>

                            </bs4.Table>
                        </bs4.Row>
                    </div>
                </bs4.Container>
                <ITR_Detail data={this.state.modal_itr} />
                <Signature data={this.state.modal_signature} />
            </div>
        );
    }
}
function mapStateToProps(state) {
    console.log(state)
    return state
}
export default connect(mapStateToProps)(Tracking_status_Claim);