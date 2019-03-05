import React, { Component } from 'react';
import * as bs4 from "reactstrap"
import * as MdIcon from 'react-icons/lib/md'
import './style-lg.css'
import { connect } from 'react-redux'
import { is_loader } from '../../actions'
const { proxy, public_function } = require("../../service")
const $ = require("jquery")

class Signature extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            ITRNo: "",
            show_img_signature: []
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
                this._call_api_get_signature(this, this.state.ITRNo)
        })
    }
    _call_api_get_signature(self, invoice) {
        var url = "http://dplus-system.com:3499/signature/get-signature/" + invoice
        fetch(url)
            .then(response => response.json())
            .then((responseJson) => {
                console.log("_call_api_get_signature", responseJson)
                if (responseJson.status === 200) {
                    var arr_data = []
                    responseJson.result.forEach((val, i) => {
                        arr_data.push(
                            <tr>
                                <td style={{ textAlign: "center" }} >
                                    <img width="25%" src={val.url} />
                                </td>
                            </tr>
                        )
                    });
                    self.setState({
                        show_img_signature: arr_data
                    })
                } else {
                }
            })
    }
    render() {
        return (
            <div >
                {/* <bs4.Button color="danger" onClick={this.toggle}>{this.props.buttonLabel}</bs4.Button> */}
                <bs4.Modal isOpen={this.state.modal} toggle={this.toggle} >
                    <bs4.ModalHeader toggle={this.toggle}><strong>ลายเซ็น</strong></bs4.ModalHeader>
                    <bs4.ModalBody>
                        <body onContextMenu="return false">
                            <center>
                                <table>
                                {this.state.show_img_signature}
                                </table>
                            </center>
                        </body>
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
export default connect(mapStateToProps)(Signature);