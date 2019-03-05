import React, { Component } from 'react';
import * as bs4 from "reactstrap"
import * as MdIcon from 'react-icons/lib/md'
import { connect } from 'react-redux'
import { is_loader } from '../../actions'

const $ = require("jquery")
const { proxy, public_function } = require("../../service")

class Add_Rate extends Component {
    constructor(props) {
        super(props)
        this.state = {
            customer_code: this.props.customer,
            customer_name:"",
            customer_email:"",
            point: 1,
            tbl_show: [],
            tbl_keep: [],
            arr_data_send: []
        }
    }
    componentWillMount() {
        this._call_api_get_assessment(this)
    }
    _call_api_get_assessment(self) {
        self.props.dispatch(is_loader(true))
        var url = proxy.develop + "rate/get-head-rate/"
        fetch(url)
            .then(response => response.json())
            .then((responseJson) => {
                console.log("_call_api_get_assessment", responseJson)
                if (responseJson.status === 200) {
                    self._set_data_table(self, responseJson.result)
                } else {
                    let arr_data = []
                    arr_data.push(<tr><th colSpan="2" style={{ textAlign: "center", fontWeight: "800" }} >{"ไม่พบข้อมูลในระบบ"}</th></tr>)
                    self.setState({ tbl_show: arr_data }, () => {
                        self.props.dispatch(is_loader(false))
                    })
                }
            })
    }
    _set_data_table(self, result) {
        let arr_data = []
        result.forEach((val, i) => {
            if (val.group_id == 1) {
                arr_data.push(
                    <tr className={"group" + val.group_id} style={{ display: "" }}  >
                        <th style={{ textAlign: "center", width: "10%" }} > <bs4.Input type="checkbox" id={val.assessment_id} onClick={() => self._check_assessment(val.assessment_id, val.group_id)} /> </th>
                        <th style={{ textAlign: "left" }} > {val.subject} </th>
                    </tr>
                )
            } else {
                arr_data.push(
                    <tr className={"group" + val.group_id} style={{ display: "none" }}  >
                        <th style={{ textAlign: "center", width: "10%" }} > <bs4.Input type="checkbox" id={val.assessment_id} onClick={() => self._check_assessment(val.assessment_id, val.group_id)} /> </th>
                        <th style={{ textAlign: "left" }} > {val.subject} </th>
                    </tr>
                )
            }
        });
        self.setState({
            tbl_show: arr_data
        }, () => {
            self.props.dispatch(is_loader(false))
        })
    }
    _check_assessment(assessment_id, group_id) {
        var arr_checkbox = this.state.arr_data_send
        if ($("#" + assessment_id).is(":checked")) {
            var data_send = {
                customer_code: "",
                customer_name: "",
                customer_email: "",
                rate_id: assessment_id,
                rate_group: group_id,
                rate_date: "",
                point: 1
            }
            arr_checkbox.push(data_send)
        } else {
            var get_index = public_function.getIndexArray(assessment_id, this.state.arr_data_send, "rate_id")
            arr_checkbox.splice(get_index, 1)
        }
        this.setState({
            arr_data_send: arr_checkbox
        }, () => {
            // console.log("arr_checkbox",this.state.arr_data_api);
        })
    }
    _onClickRate(index) {
        for (var i = 1; i <= 5; i++) {
            if (i <= index) {
                $("#star" + i).addClass("star02")
            } else {
                $("#star" + i).removeClass("star02")
            }
        }
        if (index < 4) {
            this.setState({ point: index }, () => {
                $('#form-data').fadeIn("slow")
            })
        } else {
            this.setState({ point: index }, () => {
                $('#form-data').fadeOut("slow")
            })
        }
    }
    _onClick_Group(group_id) {
        // console.log("group_id",group_id)
        switch (group_id) {
            case 1:
                $(".group1").fadeIn("slow")
                $(".group2").hide()
                $(".group3").hide()
                break;
            case 2:
                $(".group1").hide()
                $(".group2").fadeIn("slow")
                $(".group3").hide()
                break;
            case 3:
                $(".group1").hide()
                $(".group2").hide()
                $(".group3").fadeIn("slow")
                break;
        }
    }
    _onClickSend=()=>{
        if(window.confirm("โปรดยืนยันการทำรายการ")){
            this._call_api_save(this)
        }else{
            return false
        }
    }
    _call_api_save(self){
        var data_send = {
            rate:{
                point:self.state.point,
                rate_date:self.state.rate_date,
                customer_code: self.state.customer_code,
                customer_name: self.state.customer_name,
                customer_email: self.state.customer_email,
                comment:self.state.comment
            },
            tran:self.state.arr_data_send
        }
        console.log("data_send",data_send)
        var url = proxy.develop + "rate/create-rate/"
        // fetch(url, {
        //     method: "POST",
        //     headers: {
        //         Accept: "application/json",
        //         "Content-Type": "application/json;charset=utf-8"
        //     },
        //     body: JSON.stringify(data_send)
        // })
        //     .then(response => response.json())
        //     .then((responseJson) => {
        //         console.log("_call_api_save",responseJson)
        //         if (responseJson.status === 200) {
        //             alert("ขอบคุณสำหรับการประเมิน \n ทางเราจะพัฒนาการบริการให้ดียิ่งขึ้น")
        //             // self.get_data_from_api(self)
        //         } else {
        //             alert("ผิดพลาด การบันทึกข้อมูลอาจจะมีปัญหากรุณาตรวจสอบข้อมูลก่อนบันทึกอิีกครั้ง")
        //         }
        //     })
    }
    render() {
        return (
            <div>
                <div className="bgBackGround" style={{ padding: "10px 10px 10px 10px" }}>
                    <bs4.Container className="bgContainer-White" fluid>
                        <div style={{ textAlign: "left", fontSize: "22px", fontWeight: "800", marginBottom: "25px" }} >แบบการประเมินพนักงานจัดส่งสินค้า</div>
                        <bs4.Row>
                            <bs4.Col style={{ textAlign: "center" }} sm="12" md={{ size: 6, offset: 3 }}>
                                <span style={{ fontSize: "20px", fontWeight: "bold" }} >รบกวนลูกค้าให้คะแนนความพึงพอใจในบริการ การส่งสินค้า</span>
                            </bs4.Col>
                        </bs4.Row>
                        <bs4.Row style={{ marginTop: "20px" }}>
                            <bs4.Col sm="12" md={{ size: 6, offset: 3 }}>
                                <div style={{ background: "#F5CBA7", padding: "10px 10px 10px 10px", textAlign: "center", fontWeight: "bold" }} >
                                    <div style={{ background: "#FFFFFF", margin: "10px 10px 10px 10px" }} >
                                        <div style={{ padding: "10px 10px 10px 10px", textAlign: "center" }} >
                                            <MdIcon.MdStar id="star1" className="star01" style={{ cursor: "pointer" }} onClick={(e) => this._onClickRate(1)} />
                                            <MdIcon.MdStar id="star2" className="star01" style={{ cursor: "pointer" }} onClick={(e) => this._onClickRate(2)} />
                                            <MdIcon.MdStar id="star3" className="star01" style={{ cursor: "pointer" }} onClick={(e) => this._onClickRate(3)} />
                                            <MdIcon.MdStar id="star4" className="star01" style={{ cursor: "pointer" }} onClick={(e) => this._onClickRate(4)} />
                                            <MdIcon.MdStar id="star5" className="star01" style={{ cursor: "pointer" }} onClick={(e) => this._onClickRate(5)} />
                                        </div>
                                    </div>
                                    <span>ซึ่งจะมี 5 ระดับคะแนน คือ 1 ดาว หมายถึง พึงพอใจน้อยที่สุด<br />ไปจนถึง 5 ดาว หมายถึง พึงพอใจมากที่สุด</span>
                                </div>
                            </bs4.Col>
                        </bs4.Row>

                        <div id="form-data" style={{ display: "none" }} >
                            <bs4.Row style={{ marginTop: "20px" }} >
                                <bs4.Col style={{ textAlign: "center" }} sm="12" md={{ size: 6, offset: 3 }}>
                                    <div style={{ fontSize: "20px", fontWeight: "bold" }} > <span style={{ borderBottom: "double" }} >หัวข้อการประเมิน</span></div>
                                </bs4.Col>
                            </bs4.Row>
                            <bs4.Row style={{ marginTop: "20px" }}>
                                <bs4.Col style={{ textAlign: "center" }} sm="3" md={{ size: 2, offset: 3 }}>
                                    <bs4.Button onClick={() => this._onClick_Group(1)} >ด้านการส่งมอนสินค้า</bs4.Button>
                                </bs4.Col>
                                <bs4.Col style={{ textAlign: "center" }} sm="3" md={{ size: 2 }}>
                                    <bs4.Button onClick={() => this._onClick_Group(2)} >ด้านการส่งมอนสินค้า</bs4.Button>
                                </bs4.Col>
                                <bs4.Col style={{ textAlign: "center" }} sm="3" md={{ size: 2 }}>
                                    <bs4.Button onClick={() => this._onClick_Group(3)} >ด้านการส่งมอนสินค้า</bs4.Button>
                                </bs4.Col>
                            </bs4.Row>

                            <bs4.Row style={{ margin: "20px 0px 0px 20px" }}>
                                <bs4.Col style={{ textAlign: "center", padding: "10px 10px 10px 10px", background: "#EAEDED" }} sm="12" md={{ size: 6, offset: 3 }}>
                                    <bs4.Table style={{ background: "#FFFFFF" }} >
                                        <tbody>
                                            {this.state.tbl_show}
                                        </tbody>
                                    </bs4.Table>
                                </bs4.Col>
                            </bs4.Row>
                        </div>

                        <bs4.Row>
                            <bs4.Col style={{ marginTop: "30px" }} sm="12" md={{ offset: 2 }}>
                                <span style={{ fontSize: "14px", fontWeight: "bold" }} >ข้อเสนอแนะอื่น ๆ เพื่อการปรับปรุงให้ดียิ่งขึ้น</span>
                            </bs4.Col>
                            <bs4.Col sm="12" md={{ size: 8, offset: 2 }}>
                                <bs4.Input type="textarea" />
                            </bs4.Col>
                            <bs4.Col style={{ marginTop: "40px" }} sm="12" md={{ size: 3, offset: 5 }}>
                                <bs4.Button color="success" type="button" onClick={this._onClickSend} >ส่งข้อมูลแบบสอบถาม</bs4.Button>
                            </bs4.Col>
                        </bs4.Row>
                    </bs4.Container>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    // console.log(state)
    return state
}
export default connect(mapStateToProps)(Add_Rate);