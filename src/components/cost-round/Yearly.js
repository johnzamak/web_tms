import React, { Component } from 'react';
import * as bs4 from "reactstrap"
import DatePicker from 'react-datepicker';
const { proxy } = require("../../service")
const moment = require("moment")

class Yearly extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataTable: '',
            dataTotal: ''
        }
    }

    refreshComponent = () => {
        //this.setState({time: this.state.time+1})
    }

    componentDidMount = () => {
        this.getData()
    }

    getData = () => {
        
    }

    render() {
        return (
            <div>
                <bs4.Container className="bgContainer-White" fluid>
                <bs4.Row inline style={{ padding: '20px' }} >
                        <div style={{ fontSize: "22px", fontWeight: "800", marginRight: "70px"}} >หน้าสรุปค่ารอบรายปี Dealer Messengers</div>
                        <DatePicker 
                            selected={moment()}
                            onChange={this.handleChange}
                            dateFormat="YYYY"
                        />
                        <bs4.Col xs="2" >
                            <bs4.Button color="info" style={{ marginLeft : "20px"}} onClick={() => { this.getReport('', '') }} >SEARCH</bs4.Button>
                        </bs4.Col>
                    </bs4.Row>

                    <bs4.Table striped bordered hover >
                        <thead style={{ textAlign: 'center', color: 'white', backgroundColor: '#000033' }}>
                            <tr>
                                <th style={{backgroundColor: '#FFFFFF'}}> </th>
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
                                <td style={{backgroundColor: '#00FFFF'}}>จำนวนร้าน</td>
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
                                <td style={{backgroundColor: '#00FFFF'}}>จำนวนบิล</td>
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
                                <td style={{backgroundColor: '#FFFF33'}}>ต้นทุนค่าส่งต่อร้าน</td>
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
                                <td  style={{backgroundColor: '#FFFF33'}}>ต้นทุนค่าส่งต่อบิล</td>
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
                                <td  style={{backgroundColor: '#33FF33'}}>ค่าขนส่ง CV (ยอดรวม Net จ่าย)</td>
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
                        <div style={{ fontSize: "22px", fontWeight: "800", marginRight: "70px"}} >หน้าสรุปค่ารอบรายปี Dealer Messengers</div>
                        <DatePicker 
                            selected={moment()}
                            onChange={this.handleChange}
                            dateFormat="YYYY"
                        />
                        <bs4.Col xs="2" >
                            <bs4.Button color="info" style={{ marginLeft : "20px"}} onClick={() => { this.getReport('', '') }} >SEARCH</bs4.Button>
                        </bs4.Col>
                    </bs4.Row>

                    <bs4.Table striped bordered hover >
                    <thead style={{ textAlign: 'center', color: 'white', backgroundColor: '#000033' }}>
                            <tr>
                                <th style={{backgroundColor: '#FFFFFF'}}> </th>
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
                                <td style={{backgroundColor: '#00FFFF'}}>จำนวนร้าน</td>
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
                                <td style={{backgroundColor: '#00FFFF'}}>จำนวนบิล</td>
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
                                <td style={{backgroundColor: '#FFFF33'}}>ต้นทุนค่าส่งต่อร้าน</td>
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
                                <td  style={{backgroundColor: '#FFFF33'}}>ต้นทุนค่าส่งต่อบิล</td>
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
                                <td  style={{backgroundColor: '#33FF33'}}>ค่าขนส่ง DL (ยอดรวม Net จ่าย)</td>
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
