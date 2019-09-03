import React, { Component } from 'react';
import * as bs4 from "reactstrap"
import { is_loader } from '../../actions'

const { proxy } = require("../../service")

var d = new Date()
var n = d.getFullYear()

class Yearly extends Component {
    constructor(props) {
        super(props);
        this.state = {
            yearCV: n,
            yearDL: n,
            billTable: '',
            shopTable: '',
            billTableDL: '',
            shopTableDL: '',
        }
    }

    refreshComponent = () => {
        //this.setState({time: this.state.time+1})
    }

    componentDidMount = () => {
        this.getDataCV('true')
    }

    getDataCV = (status) => {
        var year = this.state.yearCV

        var arrBill = [<td></td>,<td></td>,<td></td>,<td></td>,<td></td>,<td></td>,<td></td>,<td></td>,<td></td>,<td></td>,<td></td>,<td></td>]
        var arrShop = [<td></td>,<td></td>,<td></td>,<td></td>,<td></td>,<td></td>,<td></td>,<td></td>,<td></td>,<td></td>,<td></td>,<td></td>]
        var url = proxy.main + 'get-yearly-costmess-MCV/' + year
        console.log('----', url)
        fetch(url)
            .then(response => response.json())
            .then((responseJson) => {
                console.log("responseJson", responseJson.result)
                if (!responseJson.result) {
                    alert('ไม่พบข้อมูล')
                } else {
                    responseJson.result.map(function (val, i) {
                        var _index = parseInt(val.month,10) - 1
                        console.log('_index',_index)
                                arrBill[_index] = <td>{val.bill}</td>
                                arrShop[_index] = <td>{val.shop}</td>
                    })

                    this.setState({ billTable: arrBill, shopTable: arrShop }, () => {
                        if (status === 'true') {
                            this.getDataDL()
                        }
                    })
                }
            })
    }

    getDataDL = () => {
        var year = this.state.yearDL

        var arrBill = [<td></td>,<td></td>,<td></td>,<td></td>,<td></td>,<td></td>,<td></td>,<td></td>,<td></td>,<td></td>,<td></td>,<td></td>]
        var arrShop = [<td></td>,<td></td>,<td></td>,<td></td>,<td></td>,<td></td>,<td></td>,<td></td>,<td></td>,<td></td>,<td></td>,<td></td>]
        var url = proxy.main + 'get-yearly-costmess-MDL/' + year
        console.log('----', url)
        fetch(url)
            .then(response => response.json())
            .then((responseJson) => {
                console.log("responseJson", responseJson.result)
                if (!responseJson.result) {
                    alert('ไม่พบข้อมูล')
                } else {
                    responseJson.result.map(function (val, i) {
                        var _index = parseInt(val.month,10) - 1
                        console.log('_index',_index)
                                arrBill[_index] = <td>{val.bill}</td>
                                arrShop[_index] = <td>{val.shop}</td>
                    })

                    this.setState({ billTableDL: arrBill, shopTableDL: arrShop })
                }
            })
    }

    onChangeForm = (id, value) => {
        this.setState({ [id]: value }, () => {
            console.log('year', this.state)
        })

    }

    render() {
        return (
            <div>
                <bs4.Container className="bgContainer-White" fluid>
                    <bs4.Row inline style={{ padding: '20px' }} >
                        <div style={{ fontSize: "22px", fontWeight: "800", marginRight: "70px" }} >หน้าสรุปค่ารอบรายปี Cashvan Messengers</div>
                        <bs4.Col xs="2" >
                            <bs4.Input type="select" name="yearCV" id="exampleSelect" onChange={(e) => this.onChangeForm(e.target.name, e.target.value)}>
                                <option value=''>กรุณาเลือกเดือน</option>
                                <option value={n - 5}>{n - 5}</option>
                                <option value={n - 4}>{n - 4}</option>
                                <option value={n - 3}>{n - 3}</option>
                                <option value={n - 2}>{n - 2}</option>
                                <option value={n - 1}>{n - 1}</option>
                                <option value={n}>{n}</option>
                                <option value={n + 1}>{n + 1}</option>
                                <option value={n + 2}>{n + 2}</option>
                                <option value={n + 3}>{n + 3}</option>
                                <option value={n + 4}>{n + 4}</option>
                                <option value={n + 5}>{n + 5}</option>
                            </bs4.Input>
                        </bs4.Col>
                        <bs4.Col xs="2" >
                            <bs4.Button color="info" style={{ marginLeft: "20px" }} onClick={() => this.getDataCV('false')} >SEARCH</bs4.Button>
                        </bs4.Col>
                    </bs4.Row>

                    <bs4.Table striped bordered hover >
                        <thead style={{ textAlign: 'center', color: 'white', backgroundColor: '#000033' }}>
                            <tr>
                                <th style={{ backgroundColor: '#FFFFFF' }}> </th>
                                <th>Jan</th>
                                <th>Feb</th>
                                <th>Mar</th>
                                <th>Apr</th>
                                <th>May</th>
                                <th>Jun</th>
                                <th>Jul</th>
                                <th>Aug</th>
                                <th>Sep</th>
                                <th>Oct</th>
                                <th>Nov</th>
                                <th>Dec</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style={{ backgroundColor: '#00FFFF' }}>จำนวนร้าน</td>
                                {this.state.shopTable}
                            </tr>
                            <tr>
                                <td style={{ backgroundColor: '#00FFFF' }}>จำนวนบิล</td>
                                {this.state.billTable}
                            </tr>
                            <tr>
                                <td style={{ backgroundColor: '#FFFF33' }}>ต้นทุนค่าส่งต่อร้าน</td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                            <tr>
                                <td style={{ backgroundColor: '#FFFF33' }}>ต้นทุนค่าส่งต่อบิล</td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                            <tr>
                                <td style={{ backgroundColor: '#33FF33' }}>ค่าขนส่ง CV (ยอดรวม Net จ่าย)</td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                        </tbody>
                    </bs4.Table>

                    <bs4.Row inline style={{ padding: '20px' }} >
                        <div style={{ fontSize: "22px", fontWeight: "800", marginRight: "70px" }} >หน้าสรุปค่ารอบรายปี Dealer Messengers</div>
                        <bs4.Col xs="2" >
                            <bs4.Input type="select" name="yearDL" id="exampleSelect" onChange={(e) => this.onChangeForm(e.target.name, e.target.value)}>
                                <option value=''>กรุณาเลือกเดือน</option>
                                <option value={n - 5}>{n - 5}</option>
                                <option value={n - 4}>{n - 4}</option>
                                <option value={n - 3}>{n - 3}</option>
                                <option value={n - 2}>{n - 2}</option>
                                <option value={n - 1}>{n - 1}</option>
                                <option value={n}>{n}</option>
                                <option value={n + 1}>{n + 1}</option>
                                <option value={n + 2}>{n + 2}</option>
                                <option value={n + 3}>{n + 3}</option>
                                <option value={n + 4}>{n + 4}</option>
                                <option value={n + 5}>{n + 5}</option>
                            </bs4.Input>
                        </bs4.Col>
                        <bs4.Col xs="2" >
                            <bs4.Button color="info" style={{ marginLeft: "20px" }} onClick={this.getDataDL} >SEARCH</bs4.Button>
                        </bs4.Col>
                    </bs4.Row>

                    <bs4.Table striped bordered hover >
                        <thead style={{ textAlign: 'center', color: 'white', backgroundColor: '#000033' }}>
                            <tr>
                                <th style={{ backgroundColor: '#FFFFFF' }}> </th>
                                <th>Jan</th>
                                <th>Feb</th>
                                <th>Mar</th>
                                <th>Apr</th>
                                <th>May</th>
                                <th>Jun</th>
                                <th>Jul</th>
                                <th>Aug</th>
                                <th>Sep</th>
                                <th>Oct</th>
                                <th>Nov</th>
                                <th>Dec</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style={{ backgroundColor: '#00FFFF' }}>จำนวนร้าน</td>
                                {this.state.shopTableDL}
                            </tr>
                            <tr>
                                <td style={{ backgroundColor: '#00FFFF' }}>จำนวนบิล</td>
                                {this.state.billTableDL}
                            </tr>
                            <tr>
                                <td style={{ backgroundColor: '#FFFF33' }}>ต้นทุนค่าส่งต่อร้าน</td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                            <tr>
                                <td style={{ backgroundColor: '#FFFF33' }}>ต้นทุนค่าส่งต่อบิล</td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                            <tr>
                                <td style={{ backgroundColor: '#33FF33' }}>ค่าขนส่ง DL (ยอดรวม Net จ่าย)</td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                        </tbody>
                    </bs4.Table>
                </bs4.Container>
            </div>
        );
    }
}

export default Yearly;
