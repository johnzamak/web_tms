import React, { Component } from 'react';
import * as bs4 from "reactstrap"
import DatePicker from 'react-datepicker';
import { is_loader } from '../../actions'
import { connect } from 'react-redux'
const { proxy, public_function } = require("../../service")
const moment = require("moment")

class Dealer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataTable: '',
            month: moment().format("YYYY-MM"),
        }
    }

    refreshComponent = () => {
        //this.setState({time: this.state.time+1})
    }

    componentDidMount = () => {
        this.getData()
    }

    handleChange = (e) => {
        console.log('value', e.target.value)
        this.setState({ month: e.target.value })
    }

    getData = () => {
        var props = this.props
        props.dispatch(is_loader(true))
        var month = this.state.month

        var arrReport = []
        var url = proxy.develop + 'get_report_costmess_MDL/' + month
        console.log('----', url)
        fetch(url)
            .then(response => response.json())
            .then((responseJson) => {
                console.log("responseJson", responseJson.result)
                if (!responseJson.result) {
                    alert('ไม่พบข้อมูล')
                } else {
                    responseJson.result.forEach(function (val, i) {
                        arrReport.push(
                            <tr align="center">
                                <td>{i + 1}</td>
                                <td></td>
                                <td>{val.MessNO}</td>
                                <td>{val.MessName}</td>
                                <td> </td>
                                <td align="right">{public_function.numberFormat(val.trip, 0)}</td>
                                <td align="right">{public_function.numberFormat(val.shop, 0)}</td>
                                <td><bs4.Input /></td>
                                <td><bs4.Input /></td>
                                <td align="right">{val.Net_cost}</td>
                                <td><bs4.Input /></td>
                                <td> </td>
                            </tr>
                        )
                    },this);

                    this.setState({ dataTable: arrReport }, () => {
                        props.dispatch(is_loader(false))
                    })
                }
            })
    }

    render() {
        return (
            <div>
                <bs4.Container className="bgContainer-White" fluid>
                    <bs4.Row inline style={{ padding: '20px' }} >
                        <div style={{ fontSize: "22px", fontWeight: "800", marginRight: "70px" }} >หน้าสรุปค่ารอบ Dealer Messengers</div>
                        {/* <DatePicker 
                            selected={moment()}
                            onChange={this.handleChange}
                            dateFormat="YYYY-MM"
                        /> */}
                        <input type="month" defaultValue={this.state.month} onChange={this.handleChange} />
                        <bs4.Col xs="2" >
                            <bs4.Button color="info" style={{ marginLeft: "20px" }} onClick={this.getData} >SEARCH</bs4.Button>
                        </bs4.Col>
                    </bs4.Row>

                    <bs4.Table striped bordered hover >
                        <thead style={{ textAlign: 'center', backgroundColor: '#3399FF' }}>
                            <tr>
                                <th>ลำดับ</th>
                                <th>การจ้างงาน</th>
                                <th>รหัส</th>
                                <th>ชื่อ</th>
                                <th>หน่วยงาน</th>
                                <th style={{ backgroundColor: '#8FBC8F' }}>จำนวนเที่ยว</th>
                                <th style={{ backgroundColor: '#8FBC8F' }}>จำนวนร้าน</th>
                                <th>เงินเดือน</th>
                                <th>ค่าร้านค้าส่งของ</th>
                                <th>ค่ารอบรถวิ่งส่งของ</th>
                                <th>ค่าน้ำมัน+ค่าเสื่อม</th>
                                <th style={{ backgroundColor: '#33FF33' }}>ค่า Net ที่จ่าย</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.dataTable}
                        </tbody>
                    </bs4.Table>
                </bs4.Container>
            </div>
        );
    }
}

function mapStateToProps(state) {
    console.log(state)
    return state
}
export default connect(mapStateToProps)(Dealer);
