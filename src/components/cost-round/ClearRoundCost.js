import React, { Component } from 'react';
import * as bs4 from "reactstrap"
import * as MdIcon from 'react-icons/lib/md'
import { connect } from 'react-redux'
import DatePicker from "react-datepicker"
import ModalConfirmBox from "../Modal/Confirm_Box"
import ModalAlertBox from "../Modal/Alert_Box"
import Print from "react-print"

const moment = require("moment")
const addMonths = require('addmonths')
const { proxy, public_function } = require("../../service")
const $ = require("jquery")

class ClearRoundCost extends Component {
    constructor(props) {
        super(props)
        this.state = {
            show_date_bill: "",
            show_sale_code: "",
            show_table: [],
            show_tblCost: [],
            mess_code: "",
            mess_name: "",
            input_date: moment(),
            start_date: moment().day(-30),
            end_date: moment(),
            tbl_keep: [],
            option_messenger: [],
            arr_data_api: [],
            checkStat: true,
            is_confirm: false,
            is_alert: false,
            data_send: [],
            show_total: [],
            print_table: []
        }
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
    onChange_type_mess = (e) => {
        var ship = $('#type_mess option:selected').text()
        var val = e.target.value
        var self = this
        this.setState({
            type_mess: val,
            num_ship: ship
        }, () => {
            self.get_messenger(self)
        })
    }
    onChange_select_mess = (e) => {
        var val = $('#select_mess option:selected').text()
        var valCode = e.target.value
        this.setState({ mess_code: valCode, mess_name: val, show_mess_name: val })
    }
    onChangeForm = (id, value) => {
        this.setState({ [id]: value }, () => {
            // console.log("checkData", this.state);
        })
    }
    _onClick_search = async () => {
        var messCode = this.state.mess_code, inDate = moment(this.state.input_date).format("YYYY-MM-DD")
        var stDate = moment(this.state.start_date).format("YYYY-MM-DD")
        var enDate = moment(this.state.end_date).format("YYYY-MM-DD")
        var url_roundMess = proxy.main + "round-cost/get-round-mess/" + inDate + "&" + messCode + "&" + this.state.num_ship
        var url_shipCode = proxy.main + "round-cost/get-group-shipCode/" + inDate + "&" + messCode + "&" + this.state.num_ship
        var url_billCost = proxy.main + "round-cost/get-group-billCost/" + inDate + "&" + messCode + "&" + this.state.num_ship

        var url_report = proxy.develop + "round-cost/get-round-report/" + stDate + "&" + enDate + "&" + messCode + "&" + this.state.num_ship

        await public_function.is_loading(this.props, true)
        // var res_roundMess = await public_function.api_get(url_roundMess, "getDataRoundMess")
        // var res_cal = await this._setDataforCal(this,res_roundMess)
        // var res_shipCode = await public_function.api_get(url_shipCode, "getDataRoundMess")
        // var res_cal = await this._setDataforCal(this,res_shipCode)
        // var res_billCost = await public_function.api_get(url_billCost, "getDataRoundMess")
        // var res_cal = await this._setDataforCal(this,res_billCost)
        var res_report = await public_function.api_get(url_report, "getDataRoundMess")

        var loading_false1 = await this._setDataTableRoundMess(this, res_report)
        // if (messCode.substring(0, 1) === "S") {
        //     var loading_false = await this._calRoundCost_Staff(this, res_shipCode)
        // } else {
        //     if (res_billCost.length > 0 && res_billCost.length > 0) {
        //         var loading_false = await this._calRoundCost_Mess_Dealer(this, res_shipCode, res_billCost)
        //     } else {
        //         this.setState({ show_tblCost: [] })
        //     }
        // }

        await public_function.is_loading(this.props, loading_false1)
        // this._getDataRoundMess(this)
    }
    _setDataTableRoundMess(self, result) {
        return new Promise((reslove, reject) => {
            var stDate = moment(this.state.start_date).format("YYYY-MM-DD")
            var enDate = moment(this.state.end_date).format("YYYY-MM-DD")
            var tBody = [], tbl = [], rateCost = 0, billCost = 0, roundCost = 0, sumRoundCost = 0
            var sumBill = 0, sumBillCost = 0, sumRate = 0, valTime = 3000, sumOil = 0
            var tHead = [], tFoot = [], oilCost = 0
            var arrData = [], printTbl = []
            var messCode = this.state.mess_code
            var mess1digit = messCode.substring(0, 1)
            var mess3digit = messCode.substring(0, 3)
            var newTotal = []
            if (result == false) {
                tBody.push(
                    <tr>
                        <td colSpan="9" style={{ textAlign: "center" }} > ไม่พบข้อมูลในระบบ </td>
                    </tr>
                )
            } else {
                result.forEach((val, i) => {
                    switch (mess3digit) {
                        case "MDL": billCost = val.bill_count * 10; break;
                        case "MCV": billCost = val.bill_count * 3; break;
                    }
                    switch (mess1digit) {
                        case "S":
                            valTime = 0
                            rateCost = val.ship_cost2
                            billCost = 0
                            if (i === 0) {
                                roundCost = val.ship_cost2
                                oilCost = 0
                                sumOil += oilCost
                                sumRoundCost += roundCost
                            } else {
                                roundCost = val.staff_cost
                                oilCost = 0
                                sumOil += oilCost
                                sumRoundCost += roundCost
                            }
                            arrData.push({
                                mess_code: this.state.mess_code,
                                mess_name: this.state.mess_name,
                                clearing_date: val.ClearingDate,
                                bill_count: val.bill_count,
                                bill_cost: billCost,
                                rate_cost: rateCost,
                                round_cost: roundCost,
                                oil_cost: oilCost,
                                car_type: val.car_type,
                            })
                            tBody.push(
                                <tr>
                                    <td style={{ textAlign: "center" }} > {(i + 1)} </td>
                                    <td style={{ textAlign: "center" }} > {val.ClearingDate} </td>
                                    <td style={{ textAlign: "center" }} > {val.ship_code} </td>
                                    <td style={{ textAlign: "center" }} > {val.ship_name} </td>
                                    <td style={{ textAlign: "center" }} > {val.car_type + " ล้อ"} </td>
                                    <td style={{ textAlign: "center" }} > {val.Trip} </td>
                                    <td style={{ textAlign: "right" }} > {val.bill_count} </td>
                                    <td style={{ textAlign: "right" }} > {public_function.numberFormat(billCost)} </td>
                                    <td style={{ textAlign: "right" }} > {public_function.numberFormat(rateCost)} </td>
                                    <td style={{ textAlign: "right" }} > {public_function.numberFormat(roundCost)} </td>
                                    <td style={{ textAlign: "right" }} > {public_function.numberFormat(oilCost)} </td>
                                </tr>
                            )
                            break;
                        default:
                            rateCost = val.ship_cost

                            sumBill += val.bill_count
                            sumBillCost += billCost
                            sumRate += val.ship_cost
                            switch (mess3digit) {
                                case "MDL":
                                    switch (val.car_type) {
                                        case 2:
                                            if (i === 0) {
                                                roundCost = val.ship_cost
                                                oilCost = roundCost * 0.69
                                                sumOil += oilCost
                                                sumRoundCost += roundCost
                                            } else {
                                                roundCost = val.round_cost
                                                oilCost = roundCost * 0.69
                                                sumOil += oilCost
                                                sumRoundCost += roundCost
                                            }
                                            break;
                                        case 4:
                                            if (messCode == "MDL_05") { valTime = 0 }
                                            if (i === 0) {
                                                roundCost = val.ship_cost
                                                oilCost = 0
                                                sumOil += oilCost
                                                sumRoundCost += roundCost
                                            } else {
                                                roundCost = val.round_cost
                                                oilCost = 0
                                                sumOil += oilCost
                                                sumRoundCost += roundCost
                                            }
                                            break;
                                        case 6:
                                            valTime = 0
                                            if (i === 0) {
                                                roundCost = val.ship_cost
                                                oilCost = 0
                                                sumOil += oilCost
                                                sumRoundCost += roundCost
                                            } else {
                                                roundCost = val.round_cost
                                                oilCost = 0
                                                sumOil += oilCost
                                                sumRoundCost += roundCost
                                            }
                                            break;
                                    }
                                    break;
                                case "MCV":
                                    if (i === 0) {
                                        roundCost = val.ship_cost
                                        oilCost = roundCost * 0.69
                                        sumOil += oilCost
                                        sumRoundCost += roundCost
                                    } else {
                                        roundCost = val.round_cost
                                        oilCost = roundCost * 0.69
                                        sumOil += oilCost
                                        sumRoundCost += roundCost
                                    }
                                    break;
                            }
                            arrData.push({
                                mess_code: this.state.mess_code,
                                mess_name: this.state.mess_name,
                                clearing_date: val.ClearingDate,
                                bill_count: val.bill_count,
                                bill_cost: billCost,
                                rate_cost: rateCost,
                                round_cost: roundCost,
                                oil_cost: oilCost,
                                car_type: val.car_type,
                            })
                            tBody.push(
                                <tr>
                                    <td style={{ textAlign: "center" }} > {(i + 1)} </td>
                                    <td style={{ textAlign: "center" }} > {val.ClearingDate} </td>
                                    <td style={{ textAlign: "center" }} > {val.ship_code} </td>
                                    <td style={{ textAlign: "center" }} > {val.ship_name} </td>
                                    <td style={{ textAlign: "center" }} > {val.car_type + " ล้อ"} </td>
                                    <td style={{ textAlign: "center" }} > {val.Trip} </td>
                                    <td style={{ textAlign: "right" }} > {val.bill_count} </td>
                                    <td style={{ textAlign: "right" }} > {public_function.numberFormat(billCost)} </td>
                                    <td style={{ textAlign: "right" }} > {public_function.numberFormat(rateCost)} </td>
                                    <td style={{ textAlign: "right" }} > {public_function.numberFormat(roundCost)} </td>
                                    <td style={{ textAlign: "right" }} > {public_function.numberFormat(oilCost)} </td>
                                </tr>
                            )
                            break;
                    }
                });
                tHead.push(<tr>
                    <th style={{ textAlign: "center" }} >#</th>
                    <th style={{ textAlign: "center" }} >วันที่</th>
                    <th style={{ textAlign: "center" }} >Ship Code</th>
                    <th style={{ textAlign: "center" }} >สถานที่ส่ง</th>
                    <th style={{ textAlign: "center" }} >ประเภทรถ</th>
                    <th style={{ textAlign: "center" }} >ทริป</th>
                    <th style={{ textAlign: "center" }} >จำนวนบิล</th>
                    <th style={{ textAlign: "center" }} >ค่าบิล</th>
                    <th style={{ textAlign: "center" }} >เรทจ่าย</th>
                    <th style={{ textAlign: "center" }} >ค่ารอบ</th>
                    <th style={{ textAlign: "center" }} >ค่าเสื่อม</th>
                </tr>)
                tFoot.push(<tr>
                    <td colSpan="6"></td>
                    <td style={{ textAlign: "right" }} ><span style={{ borderBottom: "double" }} > {public_function.numberFormat(sumBill)} </span></td>
                    <td style={{ textAlign: "right" }} ><span style={{ borderBottom: "double" }} > {public_function.numberFormat(sumBillCost)} </span></td>
                    <td style={{ textAlign: "right" }} ><span style={{ borderBottom: "double" }} > {public_function.numberFormat(sumRate)} </span></td>
                    <td style={{ textAlign: "right" }} ><span style={{ borderBottom: "double" }} > {public_function.numberFormat(sumRoundCost)} </span></td>
                    <td style={{ textAlign: "right" }} ><span style={{ borderBottom: "double" }} > {public_function.numberFormat(sumOil)} </span></td>

                </tr>)
                newTotal.push(
                    <center>
                        <h3>
                            {"ค่าวิ่ง " + self.state.mess_name + " ตั้งแต่วันที่ " + stDate + " ถึง " + enDate}
                        </h3>
                    </center>
                )
                newTotal.push(
                    <center>
                        <table border="1" cellSpacing="0" cellPadding="5" >
                            <tr style={{ backgroundColor: "#ffc107" }} >
                                <th>จำนวนเงินที่วิ่งได้</th>
                                <th>ค่าน้ำมันและค่าเสื่อม</th>
                                <th>ค่าร้าน</th>
                                <th>รวมเงินทั้งหมด</th>
                                <th>หักค่าเวลา</th>
                                <th>คงเหลือ</th>
                            </tr>
                            <tr>
                                <th style={{ textAlign: "right" }} > {public_function.numberFormat(sumRoundCost)} </th>
                                <th style={{ textAlign: "right" }} > {public_function.numberFormat(sumOil)} </th>
                                <th style={{ textAlign: "right" }} > {public_function.numberFormat(sumBillCost)} </th>
                                <th style={{ textAlign: "right" }} > {public_function.numberFormat((sumRoundCost + sumOil + sumBillCost))} </th>
                                <th style={{ textAlign: "right" }} > {public_function.numberFormat(valTime)} </th>
                                <th style={{ textAlign: "right" }} > {public_function.numberFormat(((sumRoundCost + sumOil + sumBillCost) - valTime))} </th>
                            </tr>
                        </table>
                    </center>
                )
            }

            tbl.push(
                <bs4.Table>
                    <thead className="bg-primary" >
                        {tHead}
                    </thead>
                    <tbody>
                        {tBody}
                    </tbody>
                    <tfoot>
                        {tFoot}
                    </tfoot>
                </bs4.Table>
            )
            printTbl.push(
                <center>
                    <table border="1" cellSpacing="0" cellPadding="5" >
                        <thead className="bg-primary" >
                            {tHead}
                        </thead>
                        <tbody>
                            {tBody}
                        </tbody>
                        <tfoot>
                            {tFoot}
                        </tfoot>
                    </table>
                </center>
            )
            self.setState({
                show_table: tbl,
                print_table: printTbl,
                data_table: result,
                show_total: newTotal
            }, () => {
                reslove(false)
            })
        })
    }
    _calRoundCost_Staff(self, arrRoundCost) {
        return new Promise((reslove) => {
            var checki = 0, costTable = [], roundCost = 0
            arrRoundCost.forEach((val, i) => {
                if (checki === 0) {
                    roundCost = roundCost + val.ship_cost2
                } else {
                    roundCost = roundCost + val.staff_cost
                }
                if ((i + 1) < arrRoundCost.length) {
                    if (arrRoundCost[i + 1].Trip == val.Trip) {
                        checki++
                    } else {
                        checki = 0
                    }
                }
            })
            costTable.push(
                <bs4.Table>
                    <tr>
                        <th>รวมค่ารอบ</th>
                        <th style={{ textAlign: "right" }} > {public_function.numberFormat(roundCost)} </th>
                    </tr>
                    <tr>
                        <th>รวมค่าร้าน</th>
                        <th style={{ textAlign: "right" }} > {public_function.numberFormat(0)} </th>
                    </tr>
                    <tr>
                        <th>สุทธิทั้งหมด</th>
                        <th style={{ textAlign: "right" }} > {roundCost} </th>
                    </tr>
                </bs4.Table>
            )
            self.setState({
                show_tblCost: costTable,
                round_cost: roundCost,
                shop_cost: 0,
                total_cost: roundCost,
                car_type: 99
            }, () => {
                reslove(false)
            })
        })
    }
    _calRoundCost_Mess_Dealer(self, arrRoundCost, arrBill) {
        return new Promise((reslove) => {
            var roundCost = 0, costTable = [], shopCost = arrBill[0].bill_cost
            var carType = arrBill[0].car_type, checki = 0
            arrRoundCost.forEach((val, i) => {
                if (carType == 6) {
                    roundCost = roundCost + val.ship_cost
                } else {
                    if (val.Trip == 1) {
                        if (checki === 0) {
                            roundCost = roundCost + val.ship_cost
                        } else {
                            roundCost = roundCost + val.round_cost
                        }
                        if ((i + 1) < arrRoundCost.length) {
                            if (arrRoundCost[i + 1].Trip == val.Trip) {
                                checki++
                            } else {
                                checki = 0
                            }
                        }
                    } else if (val.Trip == 2) {
                        if (checki === 0) {
                            roundCost = roundCost + val.ship_cost
                        } else {
                            roundCost = roundCost + val.round_cost
                        }
                        if ((i + 1) < arrRoundCost.length) {
                            if (arrRoundCost[i + 1].Trip == val.Trip) {
                                checki++
                            } else {
                                checki = 0
                            }
                        }
                    }
                }
            });
            var totalCost = self._calTotalCost(self, carType, roundCost, shopCost)
            costTable.push(
                <bs4.Table>
                    <tr>
                        <th>รวมค่ารอบ</th>
                        <th style={{ textAlign: "right" }} > {public_function.numberFormat(roundCost)} </th>
                    </tr>
                    <tr>
                        <th>รวมค่าร้าน</th>
                        <th style={{ textAlign: "right" }} > {public_function.numberFormat(shopCost)} </th>
                    </tr>
                    <tr>
                        <th>สุทธิทั้งหมด</th>
                        <th style={{ textAlign: "right" }} > {totalCost} </th>
                    </tr>
                </bs4.Table>
            )
            self.setState({
                show_tblCost: costTable,
                round_cost: roundCost,
                shop_cost: shopCost,
                total_cost: totalCost,
                car_type: carType
            }, () => {
                reslove(false)
            })
        })
    }
    _calTotalCost(self, carType, roundCost, shopCost) {
        var messID = self.state.mess_code
        var oilCost = 0
        switch (carType) {
            case 2:
                oilCost = (roundCost * 0.69)
                var totalCost = ((roundCost + shopCost) - 3000)
                return totalCost
            case 4:
                if (messID === "MDL_05") {
                    var totalCost = roundCost + shopCost
                    return totalCost
                } else {
                    var totalCost = roundCost + shopCost - 3000
                    return totalCost
                }
            case 6:
                var totalCost = roundCost + shopCost
                return totalCost
            default: break;
        }

    }
    _onClick_saveData = async () => {
        this.setState({
            is_confirm: true
        })
    }
    _confirm = async (conf) => {
        if (conf) {
            var dataSend = this.state.data_send
            var url_save = proxy.main + "round-cost/cost-round-mess/"
            await public_function.is_loading(this.props, true)
            var res_post = await public_function.api_post(url_save, "postSaveData", dataSend)
            this.setState({ is_confirm: false })
            if (res_post.status === 200) {
                await public_function.is_loading(this.props, false)
                this.setState({ is_alert: true, modal_body: "บันทึกข้อมูลเรียบร้อยแล้ว" })
            } else {
                await public_function.is_loading(this.props, false)
                this.setState({ is_alert: true, modal_body: "ผิดพลาด! บันทึกข้อมูลไม่สำเร็จ กรุณาลองใหม่" })
            }
        }
    }
    onClick_Print = (e) => {
        $(".printNow").removeClass()
        window.print()
        setTimeout(()=>{
            $("#printNow").hide()
        },1000)
    }
    render() {
        return (
            <div>
                <div id="react-no-print">
                    <bs4.Container className="bgContainer-White" fluid>

                        <div style={{ textAlign: "left", fontSize: "22px", fontWeight: "800" }} >เคลียร์บิล</div>
                        <bs4.Row>
                            <bs4.Col xs="2" >
                                <bs4.FormGroup row>
                                    {/* <bs4.Label style={{ fontWeight: "500", fontSize: "16px", margin: "10px 20px 0px 20px" }} >เลือกพนักงานจัดส่ง</bs4.Label> */}
                                    <div style={{ marginTop: "10px", marginLeft: "20px" }} >
                                        <bs4.Input id="type_mess" type="select" onChange={this.onChange_type_mess} >
                                            <option value="">โปรดเลือกกลุ่มงาน</option>
                                            <option value="MDL">Dealer</option>
                                            <option value="MCV">Cashvan</option>
                                            <option value="SDL">Staff Ship1</option>
                                            <option value="SDL">Staff Ship2</option>
                                            <option value="SDL">Staff Ship3</option>
                                        </bs4.Input>
                                    </div>
                                </bs4.FormGroup>
                            </bs4.Col>
                            <bs4.Col xs="2" >
                                <bs4.FormGroup row>
                                    {/* <bs4.Label style={{ fontWeight: "500", fontSize: "16px", margin: "10px 20px 0px 20px" }} >เลือกพนักงานจัดส่ง</bs4.Label> */}
                                    <div style={{ marginTop: "10px", }} >
                                        <bs4.Input id="select_mess" type="select" onChange={this.onChange_select_mess} >
                                            <option value="">โปรดเลือกพนักงานจัดส่ง</option>
                                            {this.state.option_messenger}
                                        </bs4.Input>
                                    </div>
                                </bs4.FormGroup>
                            </bs4.Col>
                            <bs4.Col xs="2" >
                                <bs4.Button id="btnSearch" color="info" onClick={this._onClick_search} > <MdIcon.MdSearch className="iconlg" /> SEARCH</bs4.Button>
                            </bs4.Col>
                            <bs4.Col xs="2" >
                                <bs4.Button id="btnPrintSlip" className="btnLong" color="warning" onClick={this.onClick_Print} ><MdIcon.MdPrint className="iconSize" /> PRINT</bs4.Button>
                            </bs4.Col>
                        </bs4.Row>
                        <bs4.Row>
                            <bs4.Col xs="3" >
                                <bs4.FormGroup row>
                                    <bs4.Label style={{ fontWeight: "500", fontSize: "16px", margin: "10px 20px 0px 20px" }} >วันที่เริ่มต้น</bs4.Label>
                                    <div style={{ marginTop: "10px", }} >
                                        <DatePicker
                                            dateFormat="YYYY-MM-DD"
                                            selected={this.state.start_date}
                                            onChange={(date) => this.onChangeForm("start_date", date)}
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
                                            selected={this.state.end_date}
                                            onChange={(date) => this.onChangeForm("end_date", date)}
                                            // minDate={moment(date.addDays(0))}
                                            maxDate={addMonths(new Date(), 1)}
                                        />
                                    </div>
                                </bs4.FormGroup>
                            </bs4.Col>
                        </bs4.Row>

                        <bs4.Row>
                            <bs4.Col style={{ marginBottom: "10px" }} xs="12">
                                {this.state.show_total}
                            </bs4.Col>
                            <bs4.Col xs="12">
                                {
                                    this.state.show_table
                                }
                            </bs4.Col>
                            <bs4.Col xs={{ size: 'auto', offset: 10 }} >
                                {
                                    this.state.show_tblCost
                                }
                            </bs4.Col>
                            <bs4.Col xs="2" >
                                <bs4.Button color="success" type="button" onClick={this._onClick_saveData} >
                                    <MdIcon.MdSave className="iconlg" />บันทึก
                        </bs4.Button>
                            </bs4.Col>
                            <bs4.Col xs="10" ></bs4.Col>
                        </bs4.Row>

                    </bs4.Container>
                </div>
                <div  >
                <bs4.Row className="printNow" id="printNow" style={{ backgroundColor: "#FFFFFF !important" }} >
                    <bs4.Col style={{ marginBottom: "10px" }} xs="12">
                        {this.state.show_total}
                    </bs4.Col>
                    <bs4.Col xs="12">
                        {
                            this.state.print_table
                        }
                    </bs4.Col>
                    <bs4.Col xs="10" ></bs4.Col>
                </bs4.Row>
                </div>
                <ModalAlertBox alertOpen={this.state.is_alert} modalBody={this.state.modal_body} />
                <ModalConfirmBox confirmOpen={this.state.is_confirm} checkStat={this._confirm} />
            </div>
        )
    }
}

function mapStateToProps(state) {
    return state
}
export default connect(mapStateToProps)(ClearRoundCost);
