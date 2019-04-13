import React, { Component } from 'react';
import * as bs4 from "reactstrap"
import * as MdIcon from 'react-icons/lib/md'
import { connect } from 'react-redux'
import DatePicker from "react-datepicker"
import { is_loader } from '../../actions'

const moment = require("moment")
const addMonths = require('addmonths')
const { proxy,public_function } = require("../../service")
const $ = require("jquery")

class ClearRoundCost extends Component {
    constructor(props) {
        super(props)
        this.state = {
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
    _onClick_search=async ()=>{
        var messCode = this.state.mess_code, inDate = moment(this.state.input_date).format("YYYY-MM-DD")
        var url = proxy.develop + "round-cost/get-round-mess/" + inDate + "&" + messCode
        await public_function.is_loading(this.props,true)
        var res_api=await public_function.api_get(url,"getDataRoundMess")
        // this._getDataRoundMess(this)
    }
    _getDataRoundMess(self){
        var messCode = self.state.mess_code, inDate = moment(self.state.input_date).format("YYYY-MM-DD")
        var url = proxy.develop + "round-cost/get-round-mess/" + inDate + "&" + messCode
        fetch(url)
            .then(response => response.json())
            .then((responseJson) => {
                console.log("_getDataRoundMess", responseJson)
                if (responseJson.status === 200) {
                    // self.set_data_table(self, responseJson.result)
                } else {
                    let arr_data = []
                    arr_data.push(<tr><td colSpan="14" style={{ textAlign: "center", fontWeight: "800" }} >{"ไม่พบข้อมูลในระบบ"}</td></tr>)
                    self.setState({ show_table: arr_data }, () => {
                        self.props.dispatch(is_loader(false))
                    })
                }
            })
    }
    _setDataTable(self,result){
        var dataTable=[]
        return new Promise((reslove,reject)=>{
            result.forEach((val,i) => {
                dataTable.push(
                    <tr>
                        <td style={{textAlign:"center"}} > {(i+1)} </td>
                        <td style={{textAlign:"center"}} > {(i+1)} </td>
                        <td style={{textAlign:"center"}} > {(i+1)} </td>
                        <td style={{textAlign:"center"}} > {(i+1)} </td>
                        <td style={{textAlign:"center"}} > {(i+1)} </td>
                    </tr>
                )
            });
        })
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
                </bs4.Container>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return state
}
export default connect(mapStateToProps)(ClearRoundCost);
