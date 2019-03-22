import React, { Component } from 'react';
import * as bs4 from "reactstrap"
import * as MdIcon from 'react-icons/lib/md'
import DatePicker from "react-datepicker"
import { connect } from 'react-redux'
import { is_loader } from '../../actions'
import Clearbill_CN from "../../components/Modal/Clearbill_CN"

const moment = require("moment")
const addMonths = require('addmonths')
const { proxy } = require("../../service")
const $ = require("jquery")
var date = new Date();

class Clearbill_Surach_Kerry_DHL extends Component {
    constructor(props) {
        super(props)
        this.state = {
            type_mess:"ALL",
            show_date_bill: "",
            show_sale_code: "",
            show_table: [],
            mess_code: "",
            mess_name: "",
            input_date: moment(),
            tbl_keep: [],
            option_messenger: [],
            arr_data_api: [],
            clearbill_cn: {
                is_open: false,
                invoice: "",
            }
        }
    }
    componentWillMount() {
        // this.get_data_from_api(this)
        // this.get_messenger(this)
    }
    onClick_search = () => {
        this.get_data_from_api(this)
    }
    get_messenger(self) {
        var url = proxy.main + "app-api/get-messenger/" + self.state.type_mess
        fetch(url)
            .then(response => response.json())
            .then((responseJson) => {
                console.log("responseJson", responseJson)
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
    get_data_from_api(self) {
        self.props.dispatch(is_loader(true))
        var messCode = self.state.type_mess, inDate = moment(self.state.input_date).format("YYYY-MM-DD")
        var url = proxy.main + "clearbill/get-clearbill-surach-kerry-dhl/" + messCode + "&" + inDate
        fetch(url)
            .then(response => response.json())
            .then((responseJson) => {
                console.log("get_data_from_api", responseJson)
                if (responseJson.status === 200) {
                    self.set_data_table(self, responseJson.result)
                } else {
                    let arr_data = []
                    arr_data.push(<tr><td colSpan="13" style={{ textAlign: "center", fontWeight: "800" }} >{"ไม่พบข้อมูลในระบบ"}</td></tr>)
                    self.setState({ show_table: arr_data }, () => {
                        self.props.dispatch(is_loader(false))
                    })
                }
            })
    }
    onChangeForm = (id, value) => {
        this.setState({ [id]: value }, () => {
            // console.log("checkData", this.state);
        })
    }
    onClick_CN = (invoice) => {
        this.setState({
            clearbill_cn: {
                is_open: true,
                invoice: invoice,
            }
        })
    }
    check_status_track(status) {
        let set_status
        switch (status) {
            case 0: set_status = { bgColor: "#dc3545", text: "รอคอนเฟิร์ม", cName: "0" }; break;
            case 1: set_status = { bgColor: "#ffc107", text: "รอรับงาน", cName: "1" }; break;
            case 2: set_status = { bgColor: "#fd7e14", text: "รอจ่ายงาน", cName: "2" }; break;
        }
        return set_status
    }
    set_data_table(self, result) {
        let arr_data = [], arr_keep_tbl = result,get_status=""
        result.forEach((val, i) => {
            get_status = self.check_status_track(val.status)
            arr_data.push(
                <tr>
                    <td style={{ whiteSpace: "nowrap", textAlign: "center" }} >
                        {
                            (val.ClearingStatus === "9") ? <MdIcon.MdCheckCircle style={{ color: "#28a745", fontSize: "36px" }} /> :
                                <bs4.Input type="checkbox" id={val.tms_document} className="checkall" onClick={self.check_for_clear} />
                        }
                    </td>
                    <td style={{ whiteSpace: "nowrap", textAlign: "center" }} > {i + 1} </td>
                    <td style={{ whiteSpace: "nowrap", textAlign: "center", backgroundColor: get_status.bgColor }} > {get_status.text} </td>
                    <td style={{ whiteSpace: "nowrap", textAlign: "center" }} > {val.date} </td>
                    {/* <td style={{ whiteSpace: "nowrap", textAlign: "center" }} > {val.tms_document} </td> */}
                    <td style={{ whiteSpace: "nowrap", textAlign: "center" }} > {(val.document_tran)?val.document_sub+"|"+val.document_tran:val.document_sub} </td>
                    {/* <td style={{ whiteSpace: "nowrap", textAlign: "center" }} > {val.document_tran} </td> */}
                    <td style={{ textAlign: "left" }} > {val.customer_name} </td>
                    
                    <td style={{ textAlign: "center" }} > {val.store_zone} </td>
                    <td style={{ textAlign: "left" }} > {val.address_shipment} </td>
                    <td style={{ whiteSpace: "nowrap", textAlign: "center" }} > {val.dlv_term} </td>
                    
                    <td style={{ whiteSpace: "nowrap", textAlign: "right" }} > {self.numberFormat(val.invoice_qty, 2)} </td>
                    <td style={{ whiteSpace: "nowrap", textAlign: "right" }} > {self.numberFormat(val.invoice_amount, 2)} </td>
                    <td style={{ whiteSpace: "nowrap", textAlign: "center" }} >
                        {
                            (val.ClearingStatus === "9") ? <MdIcon.MdCheckCircle style={{ color: "#28a745", fontSize: "36px" }} /> :
                                <bs4.Button type="button" color="success" onClick={() => this.onClick_clearbill(val.tms_document)} > <MdIcon.MdClearAll className="iconlg" /> </bs4.Button>
                        }
                    </td>
                </tr>
            )
        });
        self.setState({
            show_table: arr_data,
            tbl_keep: arr_keep_tbl,
            show_date_bill: moment(self.state.input_date).format("YYYY-MM-DD"),
            show_mess_name: self.state.mess_name
        }, () => {
            self.props.dispatch(is_loader(false))
        })
    }
    check_for_clear = (e) => {
        var id = e.target.id
        var arr_checkbox = this.state.arr_data_api
        if ($("#" + id).is(":checked")) {
            var arr_data = this.state.tbl_keep.filter(key => key.tms_document == id)
            arr_checkbox.push(arr_data[0])
        } else {
            var get_index = this.getIndexArray(id, this.state.tbl_keep, "tms_document")
            arr_checkbox.splice(get_index, 1)
        }
        this.setState({
            arr_data_api: arr_checkbox
        },()=>{
            // console.log("arr_checkbox",this.state.arr_data_api);
        })
    }
    getIndexArray(val, arr, prop) {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i][prop] === val) {
                return i
            }
        }
        return -1
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
    onChange_select_mess = (e) => {
        var val = $('#select_mess option:selected').text()
        var valCode = e.target.value
        this.setState({ mess_code: valCode, mess_name: val, show_mess_name: val })
    }
    onClick_checkall = () => {
        var arr_checkbox = []
        var c_check = $("#checkboxall").is(":checked")
        $(".checkall").prop("checked", c_check)
        if (c_check) {
            arr_checkbox = this.state.tbl_keep
        } else {
            arr_checkbox = []
        }
        this.setState({ arr_data_api: arr_checkbox })
    }
    onClick_clearbill = (id) => {
        this.props.dispatch(is_loader(true))
        var url = proxy.main + "clearbill/update-clearbill-kerry-dhl/"
        var data_send = this.state.tbl_keep.filter(key => key.tms_document == id)
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
                this.props.dispatch(is_loader(false))
                console.log("onClick_clearbill", responseJson)
                if (responseJson.status === 200) {
                    alert("บันทึกข้อมูลเรียบร้อย")
                    this.get_data_from_api(this)
                } else {
                    alert("ผิดพลาด การบันทึกข้อมูลอาจจะมีปัญหากรุณาตรวจสอบข้อมูลก่อนบันทึกอิีกครั้ง")
                }
            })
    }
    onClick_clearall = () => {
        if (window.confirm("กรุณายืนยันการทำราย")) {
            this.call_api_clearbill(this)
        } else {
            return false;
        }
    }
    call_api_clearbill(self) {
        self.props.dispatch(is_loader(true))
        var url = proxy.main + "clearbill/update-clearbill-kerry-dhl/"
        var data_send = self.state.arr_data_api
        console.log("data_send",data_send[0])
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
                self.props.dispatch(is_loader(false))
                console.log("responseJson", responseJson)
                if (responseJson.status === 200) {
                    alert("บันทึกข้อมูลเรียบร้อย")
                    self.get_data_from_api(self)
                } else {
                    alert("ผิดพลาด การบันทึกข้อมูลอาจจะมีปัญหากรุณาตรวจสอบข้อมูลก่อนบันทึกอิีกครั้ง")
                }
            })
    }
    onChange_type_mess = (e) => {
        var val = e.target.value
        var self = this
        this.setState({
            type_mess: val
        }, () => {
            self.get_messenger(self)
        })
    }
    render() {
        return (
            <div>
                <bs4.Container className="bgContainer-White" fluid>
                    <div style={{ textAlign: "left", fontSize: "22px", fontWeight: "800" }} >เคลียร์บิล Kerry หรือ DHL</div>
                    <bs4.Row>
                        <bs4.Col xs="2" >
                            <bs4.FormGroup row>
                                {/* <bs4.Label style={{ fontWeight: "500", fontSize: "16px", margin: "10px 20px 0px 20px" }} >เลือกพนักงานจัดส่ง</bs4.Label> */}
                                <div style={{ marginTop: "10px", marginLeft: "20px" }} >
                                    <bs4.Input id="type_mess" type="select" onChange={this.onChange_type_mess} >
                                        <option value="ALL">แสดงทั้งหมด</option>
                                        <option value="Kerry">Kerry</option>
                                        <option value="DHL">DHL</option>
                                    </bs4.Input>
                                </div>
                            </bs4.FormGroup>
                        </bs4.Col>
                        <bs4.Col xs="3" >
                            <bs4.FormGroup row>
                                <bs4.Label style={{ fontWeight: "500", fontSize: "16px", margin: "10px 20px 0px 20px" }} >วันที่สิ้นสุด</bs4.Label>
                                <div style={{ marginTop: "10px", }} >
                                    <DatePicker
                                        dateFormat="YYYY-MM-DD"
                                        selected={this.state.input_date}
                                        onChange={(date) => this.onChangeForm("input_date", date)}
                                        // minDate={moment(date.addDays(0))}
                                        maxDate={addMonths(new Date(), 1)}
                                    />
                                </div>
                            </bs4.FormGroup>
                        </bs4.Col>
                        <bs4.Col xs="2" >
                            <bs4.Button id="btnSearch" color="info" onClick={this.onClick_search} > <MdIcon.MdSearch className="iconlg" /> SEARCH</bs4.Button>
                        </bs4.Col>
                    </bs4.Row>
                    <hr className="hrCustom" />
                    <div style={{ textAlign: "center", fontSize: "18px" }} >วันที่ : {this.state.show_date_bill} </div>
                    <div style={{ clear: "both" }} ></div>
                    <bs4.Row>
                        <bs4.Table striped hover style={{ margin: "10px 10px 10px 10px" }} >
                            <thead style={{ backgroundColor: "#17a2b8", whiteSpace: "nowrap" }} >
                                <td style={{ whiteSpace: "nowrap", textAlign: "center" }} > <bs4.Input type="checkbox" id="checkboxall" onClick={this.onClick_checkall} /> เลือกทั้งหมด</td>
                                <td style={{ whiteSpace: "nowrap", textAlign: "center" }} >ลำดับ</td>
                                <td style={{ whiteSpace: "nowrap", textAlign: "center" }} >สถานะ</td>
                                <td style={{ whiteSpace: "nowrap", textAlign: "center" }} >วันที่</td>
                                <td style={{ whiteSpace: "nowrap", textAlign: "center" }} >เอกสาร</td>
                                <td style={{ textAlign: "center" }} >ชื่อลูกค้า</td>
                                <td style={{ textAlign: "center" }} >โซน</td>
                                <td style={{ textAlign: "center" }} >ที่อยู่</td>
                                <td style={{ whiteSpace: "nowrap", textAlign: "center" }} >ช่องทางจัดส่ง</td>
                                <td style={{ whiteSpace: "nowrap", textAlign: "right" }} >จำนวนชิ้น</td>
                                <td style={{ whiteSpace: "nowrap", textAlign: "right" }} >จำนวนเงิน</td>
                                <td style={{ whiteSpace: "nowrap", textAlign: "center" }} >เคลียร์</td>
                                {/* <td style={{ whiteSpace: "nowrap", textAlign: "center" }} >CN</td> */}
                            </thead>
                            <tbody  >
                                {this.state.show_table}
                            </tbody>
                            <tfoot>
                                <td><bs4.Button color="success" type="button" onClick={this.onClick_clearall} > <MdIcon.MdSave className="iconlg" />เคลียร์ทั้งหมดที่เลือก </bs4.Button> </td>
                            </tfoot>
                        </bs4.Table>
                    </bs4.Row>
                </bs4.Container>
                <Clearbill_CN dataCN={this.state.clearbill_cn} />
            </div >
        );
    }
}

function mapStateToProps(state) {
    console.log(state)
    return state
}
export default connect(mapStateToProps)(Clearbill_Surach_Kerry_DHL);