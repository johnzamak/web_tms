import React, { Component } from 'react';
import * as bs4 from "reactstrap"
import * as MdIcon from 'react-icons/lib/md'
import DatePicker from "react-datepicker"
import { connect } from 'react-redux'
import { is_loader } from '../../actions'
import { public_function } from "../../service"
import Print from "react-print"
import classnames from 'classnames';
import Print_ACC_01 from "./Print_ACC_01"
import Print_ACC_02 from "./Print_ACC_02"
import Print_ACC_03 from "./Print_ACC_03"


const moment = require("moment")
const addMonths = require('addmonths')
const { proxy } = require("../../service")
const $ = require("jquery")
var date = new Date();

class Form_accounting extends Component {
    constructor(props) {
        super(props)
        this.state = {
            tabActive: "1",
            show_date_bill: "",
            show_sale_code: "",
            show_table: [],
            show_table_footer: {
                total_invoice: 0,
                total_cash: 0,
                total_cn: 0
            },
            mess_code: "",
            mess_name: "",
            input_date: moment(),
            tbl_keep: [],
            option_messenger: [],
            arr_data_api: [],
            bgTab1: "#839192",
            bgTab2: "",
            bgTab3: "",
            data_print0: [],
            data_print1: [],
            data_print2: [],
            test: ""
        }
    }
    toggle = (tab) => {
        switch (tab) {
            case '1':
                this.setState({
                    bgTab1: "#839192",
                    bgTab2: "",
                    bgTab3: "",
                })
                break;
            case '2':
                this.setState({
                    bgTab1: "",
                    bgTab2: "#839192",
                    bgTab3: "",
                })
                break;
            case '3':
                this.setState({
                    bgTab1: "",
                    bgTab2: "",
                    bgTab3: "#839192",
                })
                break;
        }
        if (this.state.tabActive !== tab) {
            this.setState({
                tabActive: tab,
            })
        }
    }
    componentDidMount() {
        console.log("object", this.props);
        // this.get_data_from_api(this)
        // this.get_messenger(this)
    }
    onClick_search = () => {
        this.get_data_from_api(this)
    }
    onChangeForm = (id, value) => {
        this.setState({ [id]: value }, () => {
            console.log("checkData", this.state);
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
    get_data_from_api = (self) => {
        self.props.dispatch(is_loader(true))
        let url
        var mess_code = self.state.mess_code
        var input_date = moment(self.state.input_date._d).format("YYYY-MM-DD")
        var check_hub = (self.props.data_hub) ? self.props.data_hub.location : ""
        switch (check_hub) {
            case "surach":
                url = proxy.main + "report/report-formaccount/WS1&" + input_date
                break;
            case "phitsanulok":
                url = proxy.main + "report/report-formaccount/WN1&" + input_date
                break;
            default:
                url = proxy.main + "report/report-formaccount/BKK&" + input_date
                break;
        }
        console.log('url',url)
        fetch(url)
            .then(response => response.json())
            .then((responseJson) => {
                self.props.dispatch(is_loader(false))
                console.log("get_data_from_api", responseJson);
                if (responseJson.status === 200) {
                    self.setState({
                        data_print0: responseJson.result[0],
                        data_print1: responseJson.result[1],
                        data_print2: responseJson.result[2],
                    })
                    self.set_data_table(self, responseJson.result)
                }
            })
    }
    set_data_table(self, result) {
        let arr_data0 = [], arr_data1 = [], arr_data2 = [], arr_keep_tbl = result
        var total_invoice0 = 0, total_cash0 = 0, total_cn0 = 0
        var total_invoice1 = 0, total_cash1 = 0, total_cn1 = 0
        var total_invoice2 = 0, total_cash2 = 0, total_cn2 = 0, get_actual = 0, get_tranfer = ""
        if (result[0].length <= 0) {
            arr_data0.push(
                <tr>
                    <td colSpan="6" style={{ whiteSpace: "nowrap", textAlign: "center" }} > {"ไม่พบข้อมูลในระบบ"} </td>
                </tr>
            )
        } else {
            result[0].forEach((val, i) => {
                // mess_name=val.mess_name
                get_actual = (val.check_tranfer == "true") ? 0 : val.amount_actual
                get_tranfer = (val.check_tranfer=="true")? "มี" : "ไม่มี"
                total_invoice0 += val.amount_bill
                total_cash0 += get_actual
                total_cn0 += (val.amount_bill - val.amount_actual)
                arr_data0.push(
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
        if (result[1].length <= 0) {
            arr_data1.push(
                <tr>
                    <td colSpan="6" style={{ whiteSpace: "nowrap", textAlign: "center" }} > {"ไม่พบข้อมูลในระบบ"} </td>
                </tr>
            )
        } else {
            result[1].forEach((val, i) => {
                // mess_name=val.mess_name
                get_actual = (val.payment_type == "TRANSFER") ? 0 : val.amount_actual
                get_tranfer = (val.check_tranfer == "true") ? "มี" : "ไม่มี"
                total_invoice1 += val.amount_bill
                total_cash1 += get_actual
                total_cn1 += (val.amount_bill - val.amount_actual)
                arr_data1.push(
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
        if (result[2].length <= 0) {
            arr_data2.push(
                <tr>
                    <td colSpan="6" style={{ whiteSpace: "nowrap", textAlign: "center" }} > {"ไม่พบข้อมูลในระบบ"} </td>
                </tr>
            )
        } else {
            result[2].forEach((val, i) => {
                // mess_name=val.mess_name
                get_actual = (val.check_tranfer == "true") ? 0 : val.amount_actual
                get_tranfer = (val.check_tranfer == "true") ? "มี" : "ไม่มี"
                total_invoice2 += val.amount_bill
                total_cash2 += get_actual
                total_cn2 += (val.amount_bill - val.amount_actual)
                arr_data2.push(
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
            show_table0: arr_data0,
            show_table1: arr_data1,
            show_table2: arr_data2,
            tbl_keep: arr_keep_tbl,
            show_date_bill: moment(self.state.input_date).format("YYYY-MM-DD"),
            show_mess_name: self.state.mess_name,
            show_totalBill0: total_invoice0,
            show_totalActual0: total_cash0,
            show_totalCN0: total_cn0,
            show_totalBill1: total_invoice1,
            show_totalActual1: total_cash1,
            show_totalCN1: total_cn1,
            show_totalBill2: total_invoice2,
            show_totalActual2: total_cash2,
            show_totalCN2: total_cn2
        }, () => {
            self.props.dispatch(is_loader(false))
        })
    }
    onChange_select_mess = (e) => {
        var val = e.target.value
        this.setState({
            mess_code: val
        })
    }
    onClick_Print = (e) => {
        window.print()
    }
    render() {
        return (
            <div >
                <div id="react-no-print" className="bgBackGround" style={{ padding: "10px 10px 10px 10px" }} >
                    <bs4.Container fluid className="bgContainer-White" >
                        <bs4.Row>
                            {/* <bs4.Col xs="2" >
                                <bs4.FormGroup row>
                                    <bs4.Label style={{ fontWeight: "500", fontSize: "16px", margin: "10px 20px 0px 20px" }} >เลือกพนักงานจัดส่ง</bs4.Label>
                                    <div style={{ marginTop: "10px", marginLeft: "20px" }} >
                                        <bs4.Input id="type_mess" type="select" onChange={this.onChange_type_mess} >
                                            <option value="">โปรดเลือกกลุ่มงาน</option>
                                            <option value="MDL">Dealer</option>
                                            <option value="MCV">Cashvan</option>
                                        </bs4.Input>
                                    </div>
                                </bs4.FormGroup>
                            </bs4.Col>
                            <bs4.Col xs="2" >
                                <bs4.FormGroup row>
                                    <bs4.Label style={{ fontWeight: "500", fontSize: "16px", margin: "10px 20px 0px 20px" }} >เลือกพนักงานจัดส่ง</bs4.Label>
                                    <div style={{ marginTop: "10px", }} >
                                        <bs4.Input id="select_mess" type="select" onChange={this.onChange_select_mess} >
                                            <option value="">โปรดเลือกพนักงานจัดส่ง</option>
                                            {this.state.option_messenger}
                                        </bs4.Input>
                                    </div>
                                </bs4.FormGroup>
                            </bs4.Col> */}
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
                                {/* <bs4.Button id="btnPrintSlip" className="btnLong" color="info" onClick={()=>window.print()} ><MdIcon.MdPrint className="iconSize" /> PRINT</bs4.Button> */}
                            </bs4.Col>
                            <bs4.Col xs="2" >
                                {/* <bs4.Button id="btnSearch" color="info" onClick={this.onClick_search} > <MdIcon.MdSearch className="iconlg" /> SEARCH</bs4.Button> */}
                                <bs4.Button id="btnPrintSlip" className="btnLong" color="warning" onClick={this.onClick_Print} ><MdIcon.MdPrint className="iconSize" /> PRINT</bs4.Button>
                            </bs4.Col>
                        </bs4.Row>
                        {this.props.data_hub &&
                            (this.props.data_hub.location == "surach" || "phitsanulok") ?
                            <bs4.Nav tabs>
                                <bs4.NavItem>
                                    <bs4.NavLink
                                        style={{ backgroundColor: this.state.bgTab1 }}
                                        className={classnames({ active: this.state.tabActive === '1' })}
                                        onClick={() => { this.toggle('1'); }}>
                                        เงินสด+เครดิต ตจว.
                                    </bs4.NavLink>
                                </bs4.NavItem>
                            </bs4.Nav>
                            :
                            <bs4.Nav tabs>
                                <bs4.NavItem>
                                    <bs4.NavLink
                                        style={{ backgroundColor: this.state.bgTab1 }}
                                        className={classnames({ active: this.state.tabActive === '1' })}
                                        onClick={() => { this.toggle('1'); }}>
                                        เงินสด กทม.
                                    </bs4.NavLink>
                                </bs4.NavItem>
                                <bs4.NavItem>
                                    <bs4.NavLink
                                        style={{ backgroundColor: this.state.bgTab2 }}
                                        className={classnames({ active: this.state.tabActive === '2' })}
                                        onClick={() => { this.toggle('2'); }}>
                                        เครดิต กทม.
                                    </bs4.NavLink>
                                </bs4.NavItem>
                                <bs4.NavItem>
                                    <bs4.NavLink
                                        style={{ backgroundColor: this.state.bgTab3 }}
                                        className={classnames({ active: this.state.tabActive === '3' })}
                                        onClick={() => { this.toggle('3'); }}>
                                        เงินสด+เครดิต ตจว.
                                    </bs4.NavLink>
                                </bs4.NavItem>
                            </bs4.Nav>
                        }
                        {this.props.data_hub &&
                            (this.props.data_hub.location == "surach" || "phitsanulok") ?
                            <bs4.TabContent style={{ width: "100%" }} activeTab={this.state.tabActive}>
                                <bs4.TabPane tabId="1">
                                    <bs4.Row>
                                        <bs4.Col xs="12">
                                            <Print_ACC_03 data_print={this.state.data_print2} data_date={this.state.input_date} />
                                        </bs4.Col>
                                    </bs4.Row>
                                </bs4.TabPane>
                            </bs4.TabContent> :
                            <bs4.TabContent style={{ width: "100%" }} activeTab={this.state.tabActive}>
                                <bs4.TabPane tabId="1">
                                    <bs4.Row>
                                        <bs4.Col xs="12">
                                            <Print_ACC_01 data_print={this.state.data_print0} data_date={this.state.input_date} />
                                        </bs4.Col>
                                    </bs4.Row>
                                </bs4.TabPane>
                                <bs4.TabPane tabId="2">
                                    <bs4.Row>
                                        <bs4.Col xs="12">
                                            <Print_ACC_02 data_print={this.state.data_print1} data_date={this.state.input_date} />
                                        </bs4.Col>
                                    </bs4.Row>
                                </bs4.TabPane>
                                <bs4.TabPane tabId="3">
                                    <bs4.Row>
                                        <bs4.Col xs="12">
                                            <Print_ACC_03 data_print={this.state.data_print2} data_date={this.state.input_date} />
                                        </bs4.Col>
                                    </bs4.Row>
                                </bs4.TabPane>
                            </bs4.TabContent>
                        }

                    </bs4.Container>
                </div>
                {this.props.data_hub &&
                    (this.props.data_hub.location == "surach" || "phitsanulok") ?
                    <Print>
                        <div id="print-mount" style={{ pageBreakAfter: "always" }}>
                            <div style={{ textAlign: "center", fontSize: "36px", fontWeight: "800" }} >รายงานส่งบัญชี</div>
                            <div style={{ textAlign: "center", fontSize: "18px" }} >Dealer - ต่างจังหวัด || วันที่บิล : {this.state.show_date_bill} || ผู้ส่งเอกสาร : ......................................... </div>
                            <bs4.Table bordered>
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
                                    {this.state.show_table2}
                                </tbody>
                                <tfoot><tr>
                                    <td colSpan="5" style={{ textAlign: "right" }} > <span style={{ borderBottom: "double", fontWeight: "bold" }} >{"จำนวนเงินรวม"}</span> </td>
                                    <td style={{ textAlign: "right" }} ><span style={{ borderBottom: "double", fontWeight: "bold" }} >{public_function.numberFormat(this.state.show_totalBill2, 2)}</span> </td>
                                    <td style={{ textAlign: "right" }} ><span style={{ borderBottom: "double", fontWeight: "bold" }} >{public_function.numberFormat(this.state.show_totalActual2, 2)}</span> </td>
                                    <td style={{ textAlign: "right" }} ><span style={{ borderBottom: "double", fontWeight: "bold" }} >{public_function.numberFormat(this.state.show_totalCN2, 2)}</span> </td>
                                    <td></td></tr>
                                </tfoot>
                            </bs4.Table>
                        </div>
                    </Print>
                    :
                    <Print>
                        <div style={{ pageBreakAfter: "always" }}>
                            <div style={{ textAlign: "center", fontSize: "36px", fontWeight: "800" }} >รายงานส่งบัญชี</div>
                            <div style={{ textAlign: "center", fontSize: "18px" }} >Dealer - กรุงเทพฯ เงินสด || วันที่บิล : {this.state.show_date_bill} || ผู้ส่งเอกสาร : ......................................... </div>
                            <bs4.Table bordered>
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
                                    {this.state.show_table0}
                                </tbody>
                                <tfoot><tr>
                                    <td colSpan="5" style={{ textAlign: "right" }} > <span style={{ borderBottom: "double", fontWeight: "bold" }} >{"จำนวนเงินรวม"}</span> </td>
                                    <td style={{ textAlign: "right" }} ><span style={{ borderBottom: "double", fontWeight: "bold" }} >{public_function.numberFormat(this.state.show_totalBill0, 2)}</span> </td>
                                    <td style={{ textAlign: "right" }} ><span style={{ borderBottom: "double", fontWeight: "bold" }} >{public_function.numberFormat(this.state.show_totalActual0, 2)}</span> </td>
                                    <td style={{ textAlign: "right" }} ><span style={{ borderBottom: "double", fontWeight: "bold" }} >{public_function.numberFormat(this.state.show_totalCN0, 2)}</span> </td>
                                    <td></td></tr>
                                </tfoot>
                            </bs4.Table>
                        </div>

                        <div style={{ pageBreakAfter: "always" }}>
                            <div style={{ textAlign: "center", fontSize: "36px", fontWeight: "800" }} >รายงานส่งบัญชี</div>
                            <div style={{ textAlign: "center", fontSize: "18px" }} >Dealer - กรุงเทพฯ เครดิต || วันที่บิล : {this.state.show_date_bill} || ผู้ส่งเอกสาร : ......................................... </div>
                            <bs4.Table bordered>
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
                                    {this.state.show_table1}
                                </tbody>
                                <tfoot><tr>
                                    <td colSpan="5" style={{ textAlign: "right" }} > <span style={{ borderBottom: "double", fontWeight: "bold" }} >{"จำนวนเงินรวม"}</span> </td>
                                    <td style={{ textAlign: "right" }} ><span style={{ borderBottom: "double", fontWeight: "bold" }} >{public_function.numberFormat(this.state.show_totalBill1, 2)}</span> </td>
                                    <td style={{ textAlign: "right" }} ><span style={{ borderBottom: "double", fontWeight: "bold" }} >{public_function.numberFormat(this.state.show_totalActual1, 2)}</span> </td>
                                    <td style={{ textAlign: "right" }} ><span style={{ borderBottom: "double", fontWeight: "bold" }} >{public_function.numberFormat(this.state.show_totalCN1, 2)}</span> </td>
                                    <td></td></tr>
                                </tfoot>
                            </bs4.Table>
                        </div>

                        <div style={{ pageBreakAfter: "always" }}>
                            <div style={{ textAlign: "center", fontSize: "36px", fontWeight: "800" }} >รายงานส่งบัญชี</div>
                            <div style={{ textAlign: "center", fontSize: "18px" }} >Dealer - ต่างจังหวัด || วันที่บิล : {this.state.show_date_bill} || ผู้ส่งเอกสาร : ......................................... </div>
                            <bs4.Table bordered>
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
                                    {this.state.show_table2}
                                </tbody>
                                <tfoot><tr>
                                    <td colSpan="5" style={{ textAlign: "right" }} > <span style={{ borderBottom: "double", fontWeight: "bold" }} >{"จำนวนเงินรวม"}</span> </td>
                                    <td style={{ textAlign: "right" }} ><span style={{ borderBottom: "double", fontWeight: "bold" }} >{public_function.numberFormat(this.state.show_totalBill2, 2)}</span> </td>
                                    <td style={{ textAlign: "right" }} ><span style={{ borderBottom: "double", fontWeight: "bold" }} >{public_function.numberFormat(this.state.show_totalActual2, 2)}</span> </td>
                                    <td style={{ textAlign: "right" }} ><span style={{ borderBottom: "double", fontWeight: "bold" }} >{public_function.numberFormat(this.state.show_totalCN2, 2)}</span> </td>
                                    <td></td></tr>
                                </tfoot>
                            </bs4.Table>
                        </div>
                    </Print>
                }
            </div>
        );
    }
}

function mapStateToProps(state) {
    console.log(state)
    return state
}
export default connect(mapStateToProps)(Form_accounting);