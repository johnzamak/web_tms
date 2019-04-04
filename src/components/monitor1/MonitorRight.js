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
        this.getData('','','')
    }

    componentWillReceiveProps(nextProps) {
        var result = localStorage.getItem('statusR')
        console.log("result", result)

        if (result === 'true') {
            localStorage.setItem('statusR','false')
            console.log('nextProps',nextProps)

            var start = nextProps.data.start
            var end = nextProps.data.end
            var group = nextProps.data.group

            this.getData(start,end,group)
        }
    }

    getData = (start,end,group) => {

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

        var url = proxy.main + 'monitor/get_data_monitorTR_1/' + start + '&' + end
        console.log('----Right', url)

        fetch(url)
            .then(response => response.json())
            .then((responseJson) => {
                console.log("responseJsonRight----", responseJson.result)
                responseJson.result.forEach(function (val, i) {
                    sum_SO1 += val.total_order_qty
                    sum_Qty1 += val.total_order_amt
                    sum_SO2 += val.finish_pick_order_qty
                    sum_Qty2 += val.finish_pick_order_amt
                    sum_SO3 += val.remain_order_qty
                    sum_Qty3 += val.remain_order_amt

                    if(group === 'ALL'){
                        arrReport.push(
                            <tr>
                                <td>{val.group_customer}</td>
                                <td align="right">{public_function.numberFormat(val.total_order_qty,0)}</td>
                                <td align="right">{public_function.numberFormat(val.total_order_amt,0)}</td>
                                <td align="right">{public_function.numberFormat(val.finish_pick_order_qty,0)}</td>
                                <td align="right">{public_function.numberFormat(val.finish_pick_order_amt,0)}</td>
                                <td align="right">{public_function.numberFormat(val.remain_order_qty,0)}</td>
                                <td align="right">{public_function.numberFormat(val.remain_order_amt,0)}</td>
                            </tr>
                        )
                    }else{
                        if(group === val.group_customer){
                            arrReport.push(
                                <tr>
                                    <td>{val.group_customer}</td>
                                    <td align="right">{public_function.numberFormat(val.total_order_qty,0)}</td>
                                    <td align="right">{public_function.numberFormat(val.total_order_amt,0)}</td>
                                    <td align="right">{public_function.numberFormat(val.finish_pick_order_qty,0)}</td>
                                    <td align="right">{public_function.numberFormat(val.finish_pick_order_amt,0)}</td>
                                    <td align="right">{public_function.numberFormat(val.remain_order_qty,0)}</td>
                                    <td align="right">{public_function.numberFormat(val.remain_order_amt,0)}</td>
                                </tr>
                            )
                        }
                    }
                }, this)
                arrTotal.push(
                    <tr style={{ backgroundColor: "#330099" }}>
                        <th>Total</th>
                        <td align="right">{public_function.numberFormat(sum_SO1,0)}</td>
                        <td align="right">{public_function.numberFormat(sum_Qty1,0)}</td>
                        <td align="right">{public_function.numberFormat(sum_SO2,0)}</td>
                        <td align="right">{public_function.numberFormat(sum_Qty2,0)}</td>
                        <td align="right">{public_function.numberFormat(sum_SO3,0)}</td>
                        <td align="right">{public_function.numberFormat(sum_Qty3,0)}</td>
                    </tr>
                )
                this.setState({ dataTable: arrReport, dataTotal: arrTotal}, () => {
                    //localStorage.clear()
                })
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
                                <th colspan="2">#Total order</th>
                                <th colspan="2">#order จัดเสร็จ</th>
                                <th colspan="2">#back ค้างจัด</th>
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

export default MonitorRight;
