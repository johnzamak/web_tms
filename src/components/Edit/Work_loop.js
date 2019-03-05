import React, { Component } from 'react';
import * as bs4 from "reactstrap"
import * as MdIcon from 'react-icons/lib/md'
import { connect } from 'react-redux'
import { is_loader } from '../../actions'
import { loadState } from '../../localStorage';

const moment = require("moment")
const { proxy } = require("../../service")
const $ = require("jquery")

class Work_loop extends Component {
    constructor(props) {
        super(props)
        this.state = {
            tooltipOpen_signature: false,
            in_invoice: ""
        }
    }
    onChange_form = (e) => {
        var id = e.target.id
        var val = e.target.value
        this.setState({
            [id]: val
        })
    }
    onKeyPress_search = (e) => {
        var val = e.target.value
        var check_scan = val.split(":")
        if (e.key == "Enter") {
            if (check_scan.length > 0) {
                this.setState({ in_invoice: check_scan[0] }, () => {
                    this.call_api_search(this)
                })
            } else {
                this.call_api_search(this)
            }
        }
    }
    onClick_search = (e) => {
        this.call_api_search(this)
    }
    call_api_search(self) {
        self.props.dispatch(is_loader(true))
        var in_val = ""
        switch (self.state.type_mess) {
            case "DOC": in_val = self.state.in_invoice; break;
            default: in_val = self.state.mess_code; break;
        }
        var url = proxy.main + "edit/work-loop/" + self.state.type_mess + "&" + in_val
        fetch(url)
            .then(response => response.json())
            .then((responseJson) => {
                console.log("call_api_search", responseJson)
                if (responseJson.status === 200) {
                    self.set_data_table(self, responseJson.result)
                } else {
                    let arr_data = []
                    arr_data.push(<tr><td colSpan="13" style={{ textAlign: "center", fontWeight: "800" }} >{"ไม่พบข้อมูลในระบบ"}</td></tr>)
                    self.setState({ show_table: arr_data,tbl_keep:"" }, () => {
                        self.props.dispatch(is_loader(false))
                    })
                }
            })
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
    set_data_table(self, result) {
        let arr_data = [], arr_keep_tbl = result
        // result.forEach((val, i) => {
            // var get_typePayment=""
            // if(val.paymentType val.tranType val.CheckboxTranfer)
            // arr_data.push(
            //     <tr>
            //         <td style={{ whiteSpace: "nowrap", textAlign: "center" }} > {i + 1} </td>
            //         <td style={{ whiteSpace: "nowrap", textAlign: "center" }} > {val.INVOICEID} </td>
            //         <td style={{ whiteSpace: "nowrap", textAlign: "center" }} > {val.DocumentSet} </td>
            //         <td style={{ whiteSpace: "nowrap", textAlign: "left" }} > {val.CustomerName} </td>
            //         <td style={{ whiteSpace: "nowrap", textAlign: "center" }} > {val.IDMess + " | " + val.MessName} </td>
            //         <td style={{ whiteSpace: "nowrap", textAlign: "center" }} > {val.Detail} </td>
            //         <td style={{ whiteSpace: "nowrap", textAlign: "right" }} > {self.numberFormat(val.box_amount, 0)} </td>
            //         <td style={{ whiteSpace: "nowrap", textAlign: "center" }} >
            //             <bs4.Button onClick={() => self.show_Change(i, "MDL")} > Dealer </bs4.Button>
            //             <bs4.Button style={{ marginLeft: "10px" }} onClick={() => self.show_Change(i, "MCV")} > Cashvan </bs4.Button>
            //         </td>
            //         <td style={{ whiteSpace: "nowrap", textAlign: "center" }} >
            //             <bs4.Input style={{ display: "none" }} id={"select_change_mess" + i} type="select" onChange={self.onChange_select_change_mess} >
            //                 <option value="">โปรดเลือกพนักงานจัดส่ง</option>
            //                 {this.state.option_change_messenger}
            //             </bs4.Input>
            //         </td>
            //     </tr>
            // )
        // });
        self.setState({
            show_table: arr_data,
            tbl_keep: arr_keep_tbl,
            show_date_bill: moment(self.state.input_date).format("YYYY-MM-DD"),
            show_mess_name: self.state.mess_name
        }, () => {
            self.props.dispatch(is_loader(false))
        })
    }
    onChange_type_mess = (e) => {
        var val = e.target.value
        var self = this
        this.setState({
            type_mess: val
        }, () => {
            if (val != "DOC") {
                self.get_messenger(self)
                $("#select_mess").show()
                $("#in_invoice").hide()
            } else {
                $("#select_mess").hide()
                $("#in_invoice").show()
            }
        })
    }
    get_messenger(self) {
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
    onChange_select_mess = (e) => {
        var val = $('#select_mess option:selected').text()
        var valCode = e.target.value
        this.setState({ mess_code: valCode, mess_name: val, show_mess_name: val })
    }
    _onClick_workloop(self, mess_id, mess_name, invoice) {
        let data_user = loadState("data_user")[0]
        var send_data = { mess_id: mess_id, mess_name: mess_name, invoice: invoice,id_user:data_user.ID_User }
        if (window.confirm("กรุณายืนยันการทำรายการ")) {
            console.log("send_data",send_data);
            this._call_api_workloop(self, send_data)
        } else {
            return false
        }
    }
    _call_api_workloop(self, send_data) {
        self.props.dispatch(is_loader(true))
        var url = proxy.main + "edit/take-loop/"
        var data_send = send_data
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
                console.log("call_api_update", responseJson)
                if (responseJson.status === 200) {
                    alert("บันทึกข้อมูลเรียบร้อย")
                    self.call_api_search(self)
                } else {
                    alert("ผิดพลาด การบันทึกข้อมูลอาจจะมีปัญหากรุณาตรวจสอบข้อมูลก่อนบันทึกอิีกครั้ง")
                }
            })
    }
    show_Change(index, type) {
        var url = proxy.main + "app-api/get-messenger/" + type
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
                    this.setState({ option_change_messenger: arr_data }, () => {
                        $("#select_change_mess" + index).show()
                    })
                } else {

                }
            })
    }
    _show_signature(invoice) {
        this.setState({
            [invoice]: !this.state[invoice]
        });
    }
    render() {
        return (
            <div>
                <bs4.Container className="bgContainer-White" fluid>
                    <div style={{ textAlign: "left", fontSize: "22px", fontWeight: "800" }} >งานวน ส่งใหม่</div>
                    <bs4.Row>
                        <bs4.Col xs="3" >
                            <div style={{ marginTop: "10px", marginLeft: "20px" }} >
                                <bs4.Input id="type_mess" type="select" onChange={this.onChange_type_mess} >
                                    <option value="">โปรดเลือก</option>
                                    <option value="DOC">ค้นหาจากเอกสาร INV, TMS, ITR</option>
                                    <option value="MDL">ค้นหาจากชื่อแมส Dealer</option>
                                    <option value="MCV">ค้นหาจากชื่อแมส Cashvan</option>
                                </bs4.Input>
                            </div>
                        </bs4.Col>
                        <bs4.Col xs="3" >
                            <div style={{ marginTop: "10px", marginLeft: "20px" }} >
                                <bs4.Input style={{ display: "none" }} type="text" onChange={this.onChange_form} onKeyPress={this.onKeyPress_search} id="in_invoice" value={this.state.in_invoice} placeholder="กรุณากรอก INV หรือ ITR หรือ TMS" />
                                <bs4.Input style={{ display: "none" }} id="select_mess" type="select" onChange={this.onChange_select_mess} >
                                    <option value="">โปรดเลือกพนักงานจัดส่ง</option>
                                    {this.state.option_messenger}
                                </bs4.Input>

                            </div>
                        </bs4.Col>
                        <bs4.Col xs="2" >
                            <div style={{ marginTop: "10px" }} >
                                <bs4.Button id="btnSearch" color="info" onClick={this.onClick_search} > <MdIcon.MdSearch className="iconlg" /> SEARCH</bs4.Button>
                            </div>
                        </bs4.Col>
                    </bs4.Row>
                    <hr className="hrCustom" />
                    <bs4.Row>
                        <bs4.Table striped hover style={{ margin: "10px 10px 10px 10px" }} >
                            <thead style={{ backgroundColor: "#17a2b8", whiteSpace: "nowrap" }} >
                                <td style={{ whiteSpace: "nowrap", textAlign: "center" }} >ลำดับ</td>
                                <td style={{ whiteSpace: "nowrap", textAlign: "center" }} >เลข INV</td>
                                <td style={{ whiteSpace: "nowrap", textAlign: "center" }} >เอกสารอ้างอิง</td>
                                <td style={{ whiteSpace: "nowrap", textAlign: "center" }} >ชื่อลูกค้า</td>
                                <td style={{ whiteSpace: "nowrap", textAlign: "center" }} >ชื่อพนักงานจัดส่ง</td>
                                <td style={{ whiteSpace: "nowrap", textAlign: "center" }} >สถานะ</td>

                                <td style={{ whiteSpace: "nowrap", textAlign: "center" }} >จำนวนกล่อง </td>
                                <td style={{ whiteSpace: "nowrap", textAlign: "center" }} >เลือกส่งใหม่</td>
                                <td style={{ whiteSpace: "nowrap", textAlign: "center" }} >เลือกพนง.จัดส่งใหม่</td>
                            </thead>
                            <tbody  >
                                {
                                    (this.state.tbl_keep) ? this.state.tbl_keep.map((val, i) => {
                                        return (
                                            <tr>
                                                <td style={{ whiteSpace: "nowrap", textAlign: "center" }} > {i + 1} </td>
                                                <td style={{ whiteSpace: "nowrap", textAlign: "center" }} > {val.INVOICEID} </td>
                                                <td style={{ whiteSpace: "nowrap", textAlign: "center" }} > {val.DocumentSet} </td>
                                                <td style={{ whiteSpace: "nowrap", textAlign: "left" }} > {val.CustomerName} </td>
                                                <td style={{ whiteSpace: "nowrap", textAlign: "center" }} > {val.MessName} </td>
                                                <td style={{ whiteSpace: "nowrap", textAlign: "center" }} > {val.Detail} </td>
                                                <td style={{ whiteSpace: "nowrap", textAlign: "right" }} > {this.numberFormat(val.box_amount, 0)} </td>
                                                <td style={{ whiteSpace: "nowrap", textAlign: "center" }} >
                                                    <bs4.Button id={val.INVOICEID} color="info" onClick={(e) => this._onClick_workloop(this, val.IDMess, val.MessName, val.INVOICEID)} >พนง.เดิม</bs4.Button>
                                                    <br/>
                                                    <bs4.Tooltip placement="top" isOpen={this.state[val.INVOICEID]} autohide={false} target={val.INVOICEID} toggle={(e)=>this._show_signature(val.INVOICEID)}>
                        Tooltip Content!
                    </bs4.Tooltip>
                                                    <bs4.Button color="danger" style={{marginTop:"10px"}} onClick={() => this.show_Change(i, "MDL")} >พนง.ใหม่ Dealer </bs4.Button>
                                                    <br/>
                                                    <bs4.Button color="warning" style={{marginTop:"10px"}} onClick={() => this.show_Change(i, "MCV")} >พนง.ใหม่ Cashvan </bs4.Button>
                                                </td>
                                                <td style={{ whiteSpace: "nowrap", textAlign: "center" }} >
                                                    <bs4.Input style={{ display: "none" }} id={"select_change_mess" + i} type="select" onChange={(e) => this._onClick_workloop(this, e.target.value, e.text, val.INVOICEID)} >
                                                        <option value="">โปรดเลือกพนักงานจัดส่ง</option>
                                                        {this.state.option_change_messenger}
                                                    </bs4.Input>
                                                </td>
                                            </tr>)
                                    }) : this.state.show_table
                                }
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
export default connect(mapStateToProps)(Work_loop);