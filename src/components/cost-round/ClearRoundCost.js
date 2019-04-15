import React, { Component } from 'react';
import * as bs4 from "reactstrap"
import * as MdIcon from 'react-icons/lib/md'
import { connect } from 'react-redux'
import DatePicker from "react-datepicker"
import ModalConfirmBox from "../Modal/Confirm_Box"

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
            tbl_keep: [],
            option_messenger: [],
            arr_data_api: [],
            checkStat: true,
            confirmOpen: false,
            alertOpen:false
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
        var val = e.target.value
        var self = this
        this.setState({
            type_mess: val
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
        var url_roundMess = proxy.develop + "round-cost/get-round-mess/" + inDate + "&" + messCode
        var url_shipCode = proxy.develop + "round-cost/get-group-shipCode/" + inDate + "&" + messCode
        var url_billCost = proxy.develop + "round-cost/get-group-billCost/" + inDate + "&" + messCode
        await public_function.is_loading(this.props, true)
        var res_roundMess = await public_function.api_get(url_roundMess, "getDataRoundMess")
        // var res_cal = await this._setDataforCal(this,res_roundMess)
        var res_shipCode = await public_function.api_get(url_shipCode, "getDataRoundMess")
        // var res_cal = await this._setDataforCal(this,res_shipCode)
        var res_billCost = await public_function.api_get(url_billCost, "getDataRoundMess")
        // var res_cal = await this._setDataforCal(this,res_billCost)

        var loading_false1 = await this._setDataTableRoundMess(this, res_roundMess)
        if (res_billCost.length > 0 && res_billCost.length > 0) {
            var loading_false = await this._calRoundCost_Mess_Dealer(this, res_shipCode, res_billCost)
        } else {
            this.setState({ show_tblCost: [] })
        }

        await public_function.is_loading(this.props, loading_false)
        // this._getDataRoundMess(this)
    }
    _setDataTableRoundMess(self, result) {
        return new Promise((reslove, reject) => {
            var tBody = [], tbl = []
            if (result == false) {
                tBody.push(
                    <tr>
                        <td colSpan="9" style={{ textAlign: "center" }} > ไม่พบข้อมูลในระบบ </td>
                    </tr>
                )
            } else {
                result.forEach((val, i) => {
                    tBody.push(
                        <tr>
                            <td style={{ textAlign: "center" }} > {(i + 1)} </td>
                            <td style={{ textAlign: "center" }} > {val.ClearingDate} </td>
                            <td style={{ textAlign: "center" }} > {val.INVOICEID} </td>
                            <td style={{ textAlign: "left" }} > {val.CustomerName} </td>
                            <td style={{ textAlign: "left" }} > {val.ship_name} </td>
                            <td style={{ textAlign: "center" }} > {val.car_type} </td>
                            <td style={{ textAlign: "center" }} > {val.Trip} </td>
                            <td style={{ textAlign: "right" }} > {val.ship_cost} </td>
                            {/* <td style={{ textAlign: "right" }} > {val.ship_cost} </td> */}
                        </tr>
                    )
                });
            }
            tbl.push(
                <bs4.Table>
                    <thead className="bg-primary" >
                        <th>#</th>
                        <th>วันที่</th>
                        <th>เอกสาร INV.</th>
                        <th>ชื่อลูกค้า</th>
                        <th>สถานที่ส่ง</th>
                        <th>ประเภทรถ</th>
                        <th>ทริป</th>
                        <th>เรทจ่าย</th>
                        {/* <th>จ่ายจริง</th> */}
                    </thead>
                    <tbody>
                        {tBody}
                    </tbody>
                </bs4.Table>
            )
            self.setState({
                show_table: tbl,
                data_table: result
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
            self.setState({ show_tblCost: costTable }, () => {
                reslove(false)
            })
        })
    }
    _calTotalCost(self, carType, roundCost, shopCost) {
        var messID = self.state.mess_code
        switch (carType) {
            case 2:
                roundCost = (roundCost * 0.69)
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
            modal: true
        })
    }
    _confirm = (conf) => {
        if (conf) {
            console.log("yrdyyy")
            // var url_save = proxy.develop + "round-cost/cost-round-mess/"
            // var dataSend = []
            // await public_function.is_loading(this.props, true)
            // var loading_false = await public_function.api_post(url_save, "postSaveData", dataSend)
            // await public_function.is_loading(this.props, loading_false)
        }
    }
    render() {
        return (
            <div>
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
                        <bs4.Col xs="3" >
                            <bs4.FormGroup row>
                                <bs4.Label style={{ fontWeight: "500", fontSize: "16px", margin: "10px 20px 0px 20px" }} >วันที่เคลียร์รอบ</bs4.Label>
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
                            <bs4.Button id="btnSearch" color="info" onClick={this._onClick_search} > <MdIcon.MdSearch className="iconlg" /> SEARCH</bs4.Button>
                        </bs4.Col>
                    </bs4.Row>
                    <bs4.Row>
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
                <ModalConfirmBox confirmOpen={this.state.modal} checkStat={this._confirm} />
            </div>
        )
    }
}

function mapStateToProps(state) {
    return state
}
export default connect(mapStateToProps)(ClearRoundCost);
