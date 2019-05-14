import React, { Component } from 'react';
import * as bs4 from "reactstrap"
import * as MdIcon from 'react-icons/lib/md'
import { public_function } from "../../service"
import Print from "react-print"

const moment = require("moment")

class Print_ACC_03 extends Component {
    constructor(props) {
        super(props)
        this.state = {
            show_table: []
        }
    }
    componentWillReceiveProps(nextProps) {
        console.log("nextProps", nextProps);
        let { data_print, data_date } = nextProps
        if (data_print) {
            this.setState({ show_date_bill: data_date.format("YYYY-MM-DD") })
            this.set_data_table(this, data_print)
        }
    }
    set_data_table(self, result) {
        console.log("data", result)
        let arr_data = [], arr_keep_tbl = result
        var total_invoice = 0, total_cash = 0, total_cn = 0, get_actual = 0, get_tranfer = ""
        if (result.length <= 0) {
            arr_data.push(
                <tr>
                    <td colSpan="6" style={{ whiteSpace: "nowrap", textAlign: "center" }} > {"ไม่พบข้อมูลในระบบ"} </td>
                </tr>
            )
        } else {
            result.forEach((val, i) => {
                // mess_name=val.mess_name
                get_actual = (val.check_tranfer == "true") ? 0 : val.amount_actual
                get_tranfer = (val.check_tranfer == "true") ? "มี" : "ไม่มี"
                total_invoice += val.amount_bill
                total_cash += get_actual
                total_cn += (val.amount_bill - val.amount_actual)
                arr_data.push(
                    <tr>
                        <td style={{ whiteSpace: "nowrap", textAlign: "center" }} > {i + 1} </td>
                        <td style={{ whiteSpace: "nowrap", textAlign: "center" }} > {val.invoice} </td>
                        <td style={{ whiteSpace: "nowrap", textAlign: "left" }} > {val.customer_name} </td>
                        <td style={{ whiteSpace: "nowrap", textAlign: "center" }} > {val.payment_type} </td>
                        <td style={{ whiteSpace: "nowrap", textAlign: "center" }} > {get_tranfer} </td>
                        <td style={{ whiteSpace: "nowrap", textAlign: "right" }} > {public_function.numberFormat(val.amount_bill, 2)} </td>
                        <td style={{ whiteSpace: "nowrap", textAlign: "right" }} > {public_function.numberFormat(get_actual, 2)} </td>
                        <td style={{ whiteSpace: "nowrap", textAlign: "right" }} > {public_function.numberFormat((val.amount_bill - val.amount_actual), 2)} </td>
                        <td style={{ textAlign: "left" }} > {val.cn_doc+val.comment} </td>
                    </tr>
                )
            });
        }
        self.setState({
            show_table: arr_data,
            tbl_keep: arr_keep_tbl,
            // show_date_bill: moment(self.state.input_date).format("YYYY-MM-DD"),
            // show_mess_name: mess_name,
            show_totalBill: total_invoice,
            show_totalActual: total_cash,
            show_totalCN: total_cn
        }, () => {
            // self.props.dispatch(is_loader(false))
        })
    }
    onClick_Print = (e) => {
        window.print()
    }
    render() {
        return (
            <div>
                <div id="react-no-print" style={{ textAlign: "center", fontSize: "36px", fontWeight: "800" }} >รายงานส่งบัญชี </div>
                <div style={{ textAlign: "center", fontSize: "18px" }} >วันที่บิล : {this.state.show_date_bill} || ผู้ส่งเอกสาร : ......................................... </div>
                <bs4.Table>
                    <thead>
                        <td style={{ textAlign: "center" }}>ลำดับ</td>
                        <td style={{ textAlign: "center" }}>เลขที่ invoice</td>
                        <td style={{ textAlign: "center" }}>ชื่อลูกค้า</td>
                        <td style={{ textAlign: "center" }}>การจ่าย</td>
                        <td style={{ textAlign: "center" }}>การโอน</td>
                        <td style={{ textAlign: "center" }}>จำนวนเงิน (invoice)</td>
                        <td style={{ textAlign: "center" }}>เงินสดที่เก็บได้</td>
                        <td style={{ textAlign: "center" }}>CN คืน</td>
                        <td style={{ textAlign: "center" }}>CN no. / Voucher / หมายเหตุ</td>
                    </thead>
                    <tbody  >
                        {this.state.show_table}
                    </tbody>
                    <tfoot>
                        <td colSpan="5" style={{ textAlign: "right" }} > <span style={{ borderBottom: "double", fontWeight: "bold" }} >{"จำนวนเงินรวม"}</span> </td>
                        <td style={{ textAlign: "right" }} ><span style={{ borderBottom: "double", fontWeight: "bold" }} >{public_function.numberFormat(this.state.show_totalBill, 2)}</span> </td>
                        <td style={{ textAlign: "right" }} ><span style={{ borderBottom: "double", fontWeight: "bold" }} >{public_function.numberFormat(this.state.show_totalActual, 2)}</span> </td>
                        <td style={{ textAlign: "right" }} ><span style={{ borderBottom: "double", fontWeight: "bold" }} >{public_function.numberFormat(this.state.show_totalCN, 2)}</span> </td>
                        <td></td>
                    </tfoot>
                </bs4.Table>
            </div>
        );
    }
}

export default Print_ACC_03;