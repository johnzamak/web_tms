import React, { Component } from 'react';
import * as bs4 from "reactstrap"
const { proxy, public_function } = require("../../service")
const moment = require("moment")

class MonitorLeft extends Component {
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
        var result = localStorage.getItem('statusL')
        console.log("result", result)

        if (result === 'true') {
            localStorage.setItem('statusL', 'false')
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
        var sum_SO2 = 0
        var sum_Qty2 = 0
        var sum_SO3 = 0
        var sum_Qty3 = 0

        var url = proxy.main + 'monitor/get_data_monitorTL_1/' + start + '&' + end
        console.log('----', url)

        fetch(url)
            .then(response => response.json())
            .then((responseJson) => {
                console.log("responseJsonLeft", responseJson.result)
                if (responseJson.status === 200) {
                    responseJson.result.forEach(function (val, i) {
                        sum_SO1 += val.wait_pick_order_qty
                        sum_Qty1 += val.wait_pick_order_amt
                        sum_SO2 += val.start_pick_order_qty
                        sum_Qty2 += val.start_pick_order_amt
                        sum_SO3 += val.back_order_qty
                        sum_Qty3 += val.back_order_amt

                        if (group === 'ALL') {
                            arrReport.push(
                                <tr>
                                    <td>{val.group_customer}</td>
                                    <td align="right">{public_function.numberFormat(val.wait_pick_order_qty, 0)}</td>
                                    <td align="right">{public_function.numberFormat(val.wait_pick_order_amt, 0)}</td>
                                    <td align="right">{public_function.numberFormat(val.start_pick_order_qty, 0)}</td>
                                    <td align="right">{public_function.numberFormat(val.start_pick_order_amt, 0)}</td>
                                    <td align="right">{public_function.numberFormat(val.back_order_qty, 0)}</td>
                                    <td align="right">{public_function.numberFormat(val.back_order_amt, 0)}</td>
                                </tr>
                            )
                        } else {
                            if (group === val.group_customer) {
                                arrReport.push(
                                    <tr>
                                        <td>{val.group_customer}</td>
                                        <td align="right">{public_function.numberFormat(val.wait_pick_order_qty, 0)}</td>
                                        <td align="right">{public_function.numberFormat(val.wait_pick_order_amt, 0)}</td>
                                        <td align="right">{public_function.numberFormat(val.start_pick_order_qty, 0)}</td>
                                        <td align="right">{public_function.numberFormat(val.start_pick_order_amt, 0)}</td>
                                        <td align="right">{public_function.numberFormat(val.back_order_qty, 0)}</td>
                                        <td align="right">{public_function.numberFormat(val.back_order_amt, 0)}</td>
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
                            <td align="right">{public_function.numberFormat(sum_SO2, 0)}</td>
                            <td align="right">{public_function.numberFormat(sum_Qty2, 0)}</td>
                            <td align="right">{public_function.numberFormat(sum_SO3, 0)}</td>
                            <td align="right">{public_function.numberFormat(sum_Qty3, 0)}</td>
                        </tr>
                    )
                    this.setState({ dataTable: arrReport, dataTotal: arrTotal }, () => {
                        //localStorage.clear()
                    })
                } else {
                    alert("มีข้อผิดพลาดเกิดขึ้น กรุณาลองใหม่")
                }
            })
    }

    render() {
        return (
            <div>
                {/* <meta http-equiv="refresh" content="5" /> */}
                <bs4.Container className="bgContainer-White" fluid>
                    <bs4.Table striped bordered hover dark >
                        <thead style={{ textAlign: 'center' }}>
                            <tr>
                                <th >กลุ่มลูกค้า</th>
                                <th colspan="2">#order รอกดใบจัด</th>
                                <th colspan="2">#order รอจัด</th>
                                <th colspan="2">#back order</th>
                            </tr>
                            <tr>
                                <td> </td>
                                <td>#SO</td>
                                <td>#ชิ้น</td>
                                <td>#SO</td>
                                <td>#ชิ้น</td>
                                <td>#SO</td>
                                <td>#ชิ้น</td>
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

export default MonitorLeft;
