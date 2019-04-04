import React, { Component } from 'react';
import * as bs4 from "reactstrap"
const { proxy, public_function } = require("../../service")
const moment = require("moment")

class MonitorRight extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataTable: '',
            dataTotal: '',
            start: '',
            end: '',
            group: 'ALL'
        }
    }

    componentDidMount = () => {
        this.getData('', '', '')
    }

    componentWillReceiveProps(nextProps) {
        var result = localStorage.getItem('statusR')
        console.log("result", result)

        if (result === 'true') {
            localStorage.setItem('statusR', 'false')
            console.log('nextProps', nextProps)

            var start = nextProps.data.start
            var end = nextProps.data.end
            var group = nextProps.data.group

            this.getData(start, end, group)
        }
    }

    getData = (start, end, group) => {

        if (start === '') {
            start = moment().format('YYYY-MM-DD')
            end = moment().format('YYYY-MM-DD')
            group = 'ALL'
        }

        var arrReport = []
        var arrTotal = []
        var sum_SO1 = 0
        var sum_Qty1 = 0
        var sum_Box1 = 0
        var sum_SO2 = 0
        var sum_Qty2 = 0
        var sum_Box2 = 0
        var sum_SO3 = 0
        var sum_Qty3 = 0
        var sum_Box3 = 0
        var sum_SO4 = 0
        var sum_Qty4 = 0
        var sum_Box4 = 0

        //var url = proxy.main + 'monitor/get_data_monitorTR_2/' + start + '&' + end
        var url = proxy.main + 'monitor/get_data_monitorTR_3/' + start + '&' + end
        console.log('----', url)

        fetch(url)
            .then(response => response.json())
            .then((responseJson) => {
                console.log("responseJsonRight", responseJson.result)
                if (responseJson.status === 200) {
                    responseJson.result.forEach(function (val, i) {
                        sum_SO1 += val.Bill_4
                        sum_Qty1 += val.Qty_4
                        sum_Box1 += val.Box_4
                        sum_SO2 += val.Bill_5
                        sum_Qty2 += val.Qty_5
                        sum_Box2 += val.Box_5
                        sum_SO3 += val.Bill_6
                        sum_Qty3 += val.Qty_6
                        sum_Box3 += val.Box_6
                        sum_SO4 += val.Bill_7
                        sum_Qty4 += val.Qty_7
                        sum_Box4 += val.Box_7

                        if (group === 'ALL') {
                            arrReport.push(
                                <tr>
                                    <td>{val.group_customer}</td>
                                    <td align="right">{public_function.numberFormat(val.Bill_4, 0)}</td>
                                    <td align="right">{public_function.numberFormat(val.Qty_4, 0)}</td>
                                    <td align="right">{public_function.numberFormat(val.Box_4, 0)}</td>
                                    <td align="right">{public_function.numberFormat(val.Bill_5, 0)}</td>
                                    <td align="right">{public_function.numberFormat(val.Qty_5, 0)}</td>
                                    <td align="right">{public_function.numberFormat(val.Box_5, 0)}</td>
                                    <td align="right">{public_function.numberFormat(val.Bill_6, 0)}</td>
                                    <td align="right">{public_function.numberFormat(val.Qty_6, 0)}</td>
                                    <td align="right">{public_function.numberFormat(val.Box_6, 0)}</td>
                                    <td align="right">{public_function.numberFormat(val.Bill_7, 0)}</td>
                                    <td align="right">{public_function.numberFormat(val.Qty_7, 0)}</td>
                                    <td align="right">{public_function.numberFormat(val.Box_7, 0)}</td>
                                </tr>
                            )
                        } else {
                            if (group === val.group_customer) {
                                arrReport.push(
                                    <tr>
                                        <td>{val.group_customer}</td>
                                        <td align="right">{public_function.numberFormat(val.Bill_4, 0)}</td>
                                        <td align="right">{public_function.numberFormat(val.Qty_4, 0)}</td>
                                        <td align="right">{public_function.numberFormat(val.Box_4, 0)}</td>
                                        <td align="right">{public_function.numberFormat(val.Bill_5, 0)}</td>
                                        <td align="right">{public_function.numberFormat(val.Qty_5, 0)}</td>
                                        <td align="right">{public_function.numberFormat(val.Box_5, 0)}</td>
                                        <td align="right">{public_function.numberFormat(val.Bill_6, 0)}</td>
                                        <td align="right">{public_function.numberFormat(val.Qty_6, 0)}</td>
                                        <td align="right">{public_function.numberFormat(val.Box_6, 0)}</td>
                                        <td align="right">{public_function.numberFormat(val.Bill_7, 0)}</td>
                                        <td align="right">{public_function.numberFormat(val.Qty_7, 0)}</td>
                                        <td align="right">{public_function.numberFormat(val.Box_7, 0)}</td>
                                    </tr>
                                )
                            }
                        }
                    }, this)
                    arrTotal.push(
                        <tr style={{ backgroundColor: "#330099" }}>
                            <th>Total</th>
                            <td align="right">{public_function.numberFormat(sum_SO1, 0)}</td>
                            <td align="right">{public_function.numberFormat(sum_Qty1, 0)}</td>
                            <td align="right">{public_function.numberFormat(sum_Box1, 0)}</td>
                            <td align="right">{public_function.numberFormat(sum_SO2, 0)}</td>
                            <td align="right">{public_function.numberFormat(sum_Qty2, 0)}</td>
                            <td align="right">{public_function.numberFormat(sum_Box2, 0)}</td>
                            <td align="right">{public_function.numberFormat(sum_SO3, 0)}</td>
                            <td align="right">{public_function.numberFormat(sum_Qty3, 0)}</td>
                            <td align="right">{public_function.numberFormat(sum_Box3, 0)}</td>
                            <td align="right">{public_function.numberFormat(sum_SO4, 0)}</td>
                            <td align="right">{public_function.numberFormat(sum_Qty4, 0)}</td>
                            <td align="right">{public_function.numberFormat(sum_Box4, 0)}</td>
                        </tr>
                    )
                    this.setState({ dataTable: arrReport, dataTotal: arrTotal }, () => {
                        //localStorage.clear()
                    })
                }else{
                    alert("มีข้อผิดพลาดเกิดขึ้น กรุณาลองใหม่")
                }
            })
    }

    render() {
        return (
            <div>
                <bs4.Container className="bgContainer-White" fluid>
                    <bs4.Table striped bordered hover dark >
                        <thead style={{ textAlign: 'center' }}>
                            <tr>
                                <th >กลุ่มลูกค้า</th>
                                <th colspan="3">#Total order</th>
                                <th colspan="3">#แมสรับงาน</th>
                                <th colspan="3">#ค้างส่ง</th>
                                <th colspan="3">#จัดส่งสำเร็จ</th>
                            </tr>
                            <tr>
                                <td> </td>
                                <td>#SO</td>
                                <td>#ชิ้น</td>
                                <td>#กล่อง</td>
                                <td>#SO</td>
                                <td>#ชิ้น</td>
                                <td>#กล่อง</td>
                                <td>#SO</td>
                                <td>#ชิ้น</td>
                                <td>#กล่อง</td>
                                <td>#SO</td>
                                <td>#ชิ้น</td>
                                <td>#กล่อง</td>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.dataTable}
                            {this.state.dataTotal}
                        </tbody>
                    </bs4.Table>
                </bs4.Container>
            </div>
        );
    }
}

export default MonitorRight;
