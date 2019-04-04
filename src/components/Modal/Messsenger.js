import React, { Component } from 'react';
import * as bs4 from "reactstrap"
import './style-lg.css'
import { connect } from 'react-redux'
const { proxy, public_function } = require("../../service")

class Messsenger extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            type_mess: "",
            tableMess: [],
            addTimeable: {
                MessNO: "",
                MessName: "",
            },
        };
        this.toggle = this.toggle.bind(this);
    }

    toggle() {
        this.setState({
            modal: !this.state.modal
        });
    }
    componentWillReceiveProps(nextProps) {
        //console.log("nextProps", nextProps)
        this.setState({
            modal: nextProps.data.is_open,
            type_mess: nextProps.data.type_mess
        }, () => {
            if (this.state.modal)
                this._call_api_get_messsenger(this, this.state.type_mess)
        })
    }
    _call_api_get_messsenger(self, type_mess) {
        var arr = [] 
        var url = proxy.main + "app-api/get-messenger/" + type_mess
        //var url = "http://dplus-system.com:3499/app-api/get-messenger/"+type_mess
        console.log(url)
        fetch(url)
            .then(response => response.json())
            .then((responseJson) => {
                if( !responseJson.result){
                    alert('กรุณาเลือกประเภทของแมสเซนเจอร์')
                }else {
                    //console.log("responseJson", responseJson.result)
                    responseJson.result.forEach(function (val,i) {
                        arr.push(
                            <tr>
                                <td><bs4.Button color="primary" type="radio" id="exampleCustomRadio" onClick={() =>this.onChangeMess(val.MessNO,val.MessName,val.IDMess)}>{val.IDMess}</bs4.Button></td>
                                <td>{val.MessNO}</td>
                                <td>{val.MessName}</td>
                            </tr>
                        )
                    },this);
                }
        })
        self.setState({
            tableMess :arr,
            type_mess : type_mess
        })
    }

    onChangeMess = (MessNO, MessName,mess_code) => {
        //console.log('MessNO---',MessNO,'MessName---',MessName)
        this.props.handleChange(MessNO,MessName,mess_code)
    }

    render() {
        return (
            <div>
                    <bs4.Modal isOpen={this.state.modal} toggle={this.toggle}>
                        <bs4.ModalHeader toggle={this.toggle}>เลือกพนักงาน</bs4.ModalHeader>
                        <bs4.ModalBody>
                            <bs4.Table striped>
                                <thead>
                                    <tr>
                                        <th> </th>
                                        <th>รหัสพนักงาน</th>
                                        <th>ชื่อ - นามสกุล</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.tableMess}
                                </tbody>
                            </bs4.Table>
                        </bs4.ModalBody>
                    </bs4.Modal>

                    {/* <AddTimeable data={this.state.addTimeable} /> */}
            </div>
        );
    }
}
function mapStateToProps(state) {
    console.log(state)
    return state
}
export default connect(mapStateToProps)(Messsenger);