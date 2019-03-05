import React, { Component } from 'react';
import * as bs4 from "reactstrap"
import * as MdIcon from 'react-icons/lib/md'
import './style-lg.css'
import { connect } from 'react-redux'
import { is_loader } from '../../actions'
const { proxy } = require("../../service")
const $ = require("jquery")

var oldVal=0


class Clearbill_CN extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            invoice: ""
        };
        this.toggle = this.toggle.bind(this);
    }

    toggle() {
        this.setState({
            modal: !this.state.modal
        });
    }
    componentWillReceiveProps(nextProps) {
        console.log("nextProps", nextProps)
        this.setState({
            modal: nextProps.dataCN.is_open,
            invoice: nextProps.dataCN.invoice
        }, () => {
            if (this.state.modal)
                this.get_data_api(this)
        })
    }
    get_data_api(self) {
        let url = proxy.main + "clearbill-detail/get-detail/" + self.state.invoice
        fetch(url)
            .then(response => response.json())
            .then((responseJson) => {
                console.log("responseJson", responseJson)
                if (responseJson.status === 200) {
                    this.set_data_table(self, responseJson.result)
                } else {
                    alert("ไม่สามารถติดต่อกับเซิฟเวอร์ได้ กรุณาลองใหม่ภายหลัง")
                }
            })
    }
    set_data_table(self, result) {
        var arr_data = []
        if (result.length <= 0) {
            arr_data = []
        } else {
            result.forEach((val, i) => {
                self.setState({
                    ["priceUnit"+val.id]:val.PriceOfUnit,
                    ["qtyCN" + val.id]: 0,
                    ["amtAct" + val.id]: val.AmountActaul,
                    ["qtyBill"+val.id]:val.QtyBill,
                    ["qtyAct" + val.id]: val.QtyActual,
                    ["amtBill"+val.id]:val.AmountBill
                })
            });
        }
        self.setState({
            show_table: result,
            keep_tbl: result,
            data_send:result
        })
    }
    onChange_input = (e, numLine, keyObj) => {
        var id = e.target.id
        var val = e.target.value
        this.setState({
            [id]: val
        }, () => {
            this.re_data_set(this, numLine, val, keyObj)
        })
    }
    re_data_set(self, id, newVal, keyObj) {
        var arr_data = self.state.data_send
        var get_index = this.getIndexArray(id, self.state.data_send, "id")
        var new_obj;
        switch (keyObj) {
            case "QtyActual":
                var new_Act=self.state["qtyBill"+id] - newVal
                var new_AmtBill=new_Act*self.state["priceUnit"+id]
                var new_AmtAct=new_Act*self.state["priceUnit"+id]
                self.setState({
                    ["qtyAct"+id]:new_Act,
                    ["amtBill"+id]:new_AmtBill,
                    ["amtAct"+id]:new_AmtAct
                })
                new_obj =  Object.assign({ 
                    new_QtyActual: new_Act,
                    new_AmountBill: new_AmtBill,
                    new_AmountActaul: new_AmtAct,
                 }, arr_data[get_index])
                break;
            case "AmountActaul":
                new_obj = Object.assign({ AmountActaul: new_AmtAct }, arr_data[get_index])
                break;
        }
        arr_data.splice(get_index, 1, new_obj)
        self.setState({ data_send: arr_data })
        
    }
    getIndexArray(val, arr, prop) {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i][prop] === val) {
                return i
            }
        }
        return -1
    }
    save_data = (e) => {
        
        if (window.confirm("กรุณายืนยันการทำรายการ")) {
            // console.log("object",this.state.data_send)
            this.send_save_data(this)
        } else {
            return false
        }
    }
    send_save_data(self) {
        self.props.dispatch(is_loader(true))
        var url = proxy.main + "clearbill-detail/update-detail/"
        var data_send = self.state.data_send
        console.log("data_send",data_send)
        fetch(url, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json;charset=utf-8"
            },
            body: JSON.stringify(data_send)
        })
            .then(response => response.json())
            .then((responseJson) => {
                console.log("responseJson",responseJson)
                self.props.dispatch(is_loader(false))
            })
    }
    onFocus=(e) =>{
        var id =e.target.id
        oldVal = e.target.value
        this.setState({
            [id]: ""
        })
    }
    onBlur=(e)=> {
        var id =e.target.id
        if (e.target.value == "" || parseInt(e.target.value) < 0) {
            this.setState({
                [id]: oldVal
            })
        }
    }
    render() {
        return (
            <div >
                {/* <bs4.Button color="danger" onClick={this.toggle}>{this.props.buttonLabel}</bs4.Button> */}
                <bs4.Modal isOpen={this.state.modal} toggle={this.toggle} size="lg" >
                    <bs4.ModalHeader toggle={this.toggle}>รายละเอียดบิล</bs4.ModalHeader>
                    <bs4.ModalBody>
                        <bs4.Table style={{ fontSize: "14px" }} >
                            <thead className="bg-primary">
                                <tr>
                                    <td>#</td>
                                    <td>รหัสสินค้า</td>
                                    <td>ชื่อสินค้า</td>
                                    <td>จำนวน</td>
                                    <td>คืน</td>
                                    <td>คงเหลือ</td>
                                    <td>ราคา</td>
                                    <td>ยอดบิล</td>
                                    <td>จำนวนเงิน</td>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.show_table && this.state.show_table.map((val, i) => {
                                    return (<tr>
                                        <td> {(i + 1)} </td>
                                        <td style={{ whiteSpace: "nowrap" }} > {val.ItemCode} </td>
                                        <td > {val.ItemName} </td>
                                        <td style={{ whiteSpace: "nowrap" }} > {val.QtyBill} </td>
                                        <td style={{ whiteSpace: "nowrap" }} >  <bs4.Input style={{ textAlign: "right", fontSize: "14px", width: "75px" }} type="text" onChange={(e) => this.onChange_input(e,val.id, "QtyActual")}
                                        onBlur={this.onBlur}
                                        onFocus={this.onFocus}
                                        id={"qtyCN" + val.id} value={this.state["qtyCN" + val.id]} /> </td>
                                        <td style={{ whiteSpace: "nowrap" }} >  <span id={"qtyAct" + val.id} >{this.state["qtyAct" + val.id]}</span> </td>
                                        <td style={{ whiteSpace: "nowrap" }} >  {val.PriceOfUnit} </td>
                                        <td style={{ whiteSpace: "nowrap" }} >  <span id={"amtBill" + val.id} >{this.state["amtBill"+val.id]}</span></td>
                                        <td style={{ whiteSpace: "nowrap" }} >  <bs4.Input style={{ textAlign: "right", fontSize: "14px", width: "75px" }} 
                                        onBlur={this.onBlur}
                                        onFocus={this.onFocus}
                                        type="text" onChange={(e) => this.onChange_input(e,val.id, "AmountActaul")} id={"amtAct" + val.id} value={this.state["amtAct" + val.id]} /> </td>
                                    </tr>)
                                })}
                            </tbody>
                        </bs4.Table>
                    </bs4.ModalBody>
                    <bs4.ModalFooter>
                        <bs4.Button color="success" onClick={this.save_data}>บันทึก</bs4.Button>
                        <bs4.Button color="secondary" onClick={this.toggle}>ยกเลิก</bs4.Button>
                    </bs4.ModalFooter>
                </bs4.Modal>
            </div>
        );
    }
}
function mapStateToProps(state) {
    console.log(state)
    return state
}
export default connect(mapStateToProps)(Clearbill_CN);