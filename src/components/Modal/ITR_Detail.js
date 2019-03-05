import React, { Component } from 'react';
import * as bs4 from "reactstrap"
import * as MdIcon from 'react-icons/lib/md'
import './style-lg.css'
import { connect } from 'react-redux'
import { is_loader } from '../../actions'
const { proxy,public_function } = require("../../service")
const $ = require("jquery")

class ITR_Detail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            ITRNo: ""
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
            modal: nextProps.data.is_open,
            ITRNo: nextProps.data.ITRNo
        }, () => {
            if (this.state.modal)
                this.get_data_api(this)
        })
    }
    get_data_api(self) {
        let url = proxy.main + "report/report-status-claim/detail/" + self.state.ITRNo
        fetch(url)
            .then(response => response.json())
            .then((responseJson) => {
                console.log("get_data_api", responseJson)
                if (responseJson.status === 200) {
                    // this.set_data_table(self, responseJson.result)
                    self.setState({show_table:responseJson.result})
                } else {
                    alert("ไม่สามารถติดต่อกับเซิฟเวอร์ได้ กรุณาลองใหม่ภายหลัง")
                }
            })
    }
    render() {
        return (
            <div >
                {/* <bs4.Button color="danger" onClick={this.toggle}>{this.props.buttonLabel}</bs4.Button> */}
                <bs4.Modal isOpen={this.state.modal} toggle={this.toggle} size="lg" >
                    <bs4.ModalHeader toggle={this.toggle}>รายละเอียดบิล</bs4.ModalHeader>
                    <bs4.ModalBody>
                        <bs4.Table striped style={{ fontSize: "14px" }} >
                            <thead className="bg-primary">
                                <tr>
                                    <th>#</th>
                                    <th>รหัสสินค้า</th>
                                    <th>ชื่อสินค้า</th>
                                    <th>จำนวน</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.show_table && this.state.show_table.map((val, i) => {
                                    return (<tr>
                                        <td> {(i + 1)} </td>
                                        <td style={{ whiteSpace: "nowrap" }} > {val.itemNo} </td>
                                        <td > {val.itemName} </td>
                                        <td style={{ whiteSpace: "nowrap",textAlign:"right" }} > {public_function.numberFormat(val.Qty,0)} </td>
                                    </tr>)
                                })}
                            </tbody>
                        </bs4.Table>
                    </bs4.ModalBody>
                    <bs4.ModalFooter>
                        {/* <bs4.Button color="success" onClick={this.save_data}>บันทึก</bs4.Button> */}
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
export default connect(mapStateToProps)(ITR_Detail);