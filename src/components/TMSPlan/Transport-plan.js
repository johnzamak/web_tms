import React, { Component } from 'react';
import * as bs4 from "reactstrap"
import * as MdIcon from 'react-icons/lib/md'
import DatePicker from "react-datepicker"
import { connect } from 'react-redux'
import Workbook from 'react-excel-workbook'//excel
import ReactToPrint from 'react-to-print';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { browserHistory } from 'react-router';
import { is_loader } from '../../actions'
import Select from 'react-select';

var arrStatusSOEN = { '0': 'Open', '1': 'Stock', '2': 'Credit', '3': 'Release' }
var options = []
const { proxy } = require('../../service')
const { public_function } = require('../../service')
pdfMake.vfs = pdfFonts.pdfMake.vfs;

pdfMake.fonts = {
    THSarabunNew: {
        normal: 'THSarabunNew.ttf',
        bold: 'THSarabunNew-Bold.ttf',
        italics: 'THSarabunNew-Italic.ttf',
        bolditalics: 'THSarabunNew-BoldItalic.ttf'
    },
    Roboto: {
        normal: 'Roboto-Regular.ttf',
        bold: 'Roboto-Medium.ttf',
        italics: 'Roboto-Italic.ttf',
        bolditalics: 'Roboto-MediumItalic.ttf'
    }
}

function buildTableBody(data, columns) {
    var body = [];

    body.push(columns);

    data.forEach(function (row) {
        var dataRow = [];

        columns.forEach(function (column) {
            dataRow.push(row[column].toString());
        })

        body.push(dataRow);
    });

    return body;
}

function table(data, columns) {
    return {
        table: {
            headerRows: 1,
            body: buildTableBody(data, columns),
        },
        layout: {
            hLineWidth: function (i, node) {
                return 1;
            },
        },
        //margin: [0, 15, 0, 0],
        widths: ['7.6%', '7.6%', '7.6%', '7.6%', '7.6%', '7.6%', '7.6%', '7.6%', '7.6%', '7.6%', '7.6%', '7.6%', '7.6%'],
    };
}

const moment = require("moment")
const format = 'HH:mm';
var arr = []
var arrExcel_
class Transport_plan extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dateStart: moment(),
            dateEnd: moment(),
            group: 'ALL',
            showTable: '',
            arrDataExcel: '',
            dataTable: '',
            result: '',
            status: true,
            filename: '',
            express: false

        }
    }

    printPDF = () => {
        var pdfData = this.state.arrDataExcel
        console.log('pdfData', pdfData)

        if (pdfData === '') {
            alert('ไม่มีข้อมูล')
        } else {
            var name = this.state.filename.split('_')

            var docDefinition = {
                pageSize: 'A4',
                pageOrientation: 'landscape',
                pageMargins: [10, 20, 40, 0],
                content: [
                    { text: 'รายงานแผนการจัดส่ง วันที่ ' + name[1] + ' ถึง ' + name[2], style: 'header', fontSize: 16, marginLeft: 40 },
                    table(pdfData, ['StatusSO', 'SaleOrder', 'CustomerName', 'เลขที่INV', 'จำนวนกล่อง', 'น้ำหนักกล่อง', 'ขนาดกล่อง', 'ที่อยู่', 'อำเภอ', 'จังหวัด', 'เบอร์โทร', 'Remarks', 'DeliveryBy'])
                ],
                defaultStyle: {
                    font: 'THSarabunNew',
                    fontSize: 12,
                }
            }
            //pdfMake.createPdf(docDefinition).open()
            pdfMake.createPdf(docDefinition).download(this.state.filename + '.pdf')
        }
    }

    componentDidMount() {
        this.getData()
    }

    onChangeForm = (id, value) => {
        this.setState({ [id]: value }, () => {
            console.log("checkData", this.state)
        })
    }

    onChangeExpress = () => {
        this.setState({ express: !this.state.express }, () => {
            console.log("checkData", this.state)
        })
    }

    setData_Excel = () => {
        var arr = []
        var result = this.state.result
        var name = this.state.filename.split('_')

        result.forEach(function (val, i) {
            arrExcel_ = {
                StatusSO: arrStatusSOEN[val.DPL_SO_STATUS],
                SaleOrder: val.so,
                CustomerName: val.customer_name,
                เลขที่INV: val.invoice,
                จำนวนกล่อง: val.box === 'null' || val.box === null ? '' : val.box + '/' + val.box_qty,
                น้ำหนักกล่อง: val.box_weight === 'null' || val.box_weight === null ? '' : val.box_weight,
                ขนาดกล่อง: val.box_type === 'null' || val.box_type === null ? '' : val.box_type,
                ที่อยู่: val.STREET === 'null' || val.STREET === null ? '' : val.STREET,
                อำเภอ: val.CITY === 'null' || val.CITY === null ? '' : val.CITY,
                จังหวัด: val.STATE_Name === 'null' || val.STATE_Name === null ? '' : val.STATE_Name,
                เบอร์โทร: val.contact_phone,
                Remarks: val.remark === 'null' || val.remark === null ? '' : val.remark,
                DeliveryBy: val.dlv_term === 'null' || val.dlv_term === null ? '' : val.dlv_term,
            }
            arr.push(arrExcel_)
        });

        var table = <div style={{ padding: "20px", pageBreakAfter: "always" }} ref={el => (this.componentRef = el)}>
            <br />
            <div style={{ textAlign: "center", fontSize: "18px", fontWeight: "600" }} >รายงานแผนการส่ง วันที่ {name[1]} ถึง {name[2]}</div>
            <br />
            <bs4.Table bordered style={{ fontSize: "14px" }}>
                <thead>
                    <th style={{ textAlign: "center" }}>Status SO</th>
                    <th style={{ textAlign: "center" }}>Sale order</th>
                    <th style={{ textAlign: "center" }} >CustomerName</th>
                    <th style={{ textAlign: "center" }} >เลขที่ INV</th>
                    <th style={{ textAlign: "center" }} >จำนวนกล่อง</th>
                    <th style={{ textAlign: "center" }} >น้ำหนักกล่อง</th>
                    <th style={{ textAlign: "center" }} >ขนาดกล่อง</th>
                    <th width="5%" style={{ textAlign: "center" }} >ที่อยู่</th>
                    <th style={{ textAlign: "center" }} >อำเภอ</th>
                    <th style={{ textAlign: "center" }} >จังหวัด</th>
                    <th style={{ textAlign: "center" }} >เบอร์โทร</th>
                    <th width="5%" style={{ textAlign: "center" }} >Remarks</th>
                    <th style={{ textAlign: "center" }} >Delivery By</th>
                </thead>
                <tbody >
                    {this.state.dataTable}
                </tbody>
            </bs4.Table>
        </div>

        this.setState({ showTable: table, arrDataExcel: arr })
    }

    getData = () => {
        var props = this.props
        props.dispatch(is_loader(true))

        var start = moment(this.state.dateStart).format('YYYY-MM-DD')
        var end = moment(this.state.dateEnd).format('YYYY-MM-DD')
        var group = this.state.group
        var express = this.state.express
        var _express

        var filename = 'TMSPlan_' + start + '_' + end
        var arrReport = []

        if (express === false) {
            _express = 0
        } else {
            _express = 1
        }

        var url = proxy.develop + 'TMSPlan/get_tms_plan/' + start + '&' + end + '&' + _express
        console.log('----', url)

        fetch(url)
            .then(response => response.json())
            .then((responseJson) => {
                console.log("responseJsonLeft", responseJson.result)
                if (responseJson.status === 200) {
                    responseJson.result.forEach(function (val, i) {
                        if (group === 'ALL') {
                            arrReport.push(
                                <tr>
                                    <td style={{ textAlign: "center" }}>{arrStatusSOEN[val.DPL_SO_STATUS]}</td>
                                    <td style={{ textAlign: "center" }}>{val.so}</td>
                                    <td style={{ textAlign: "center" }} >{val.customer_name}</td>
                                    <td style={{ textAlign: "center" }} >{val.invoice}</td>
                                    <td style={{ textAlign: "right" }} >{val.box}/{val.box_qty}</td>
                                    <td style={{ textAlign: "right" }} >{val.box_weight}</td>
                                    <td style={{ textAlign: "right" }} >{val.box_type}</td>
                                    <td style={{ textAlign: "center" }} >{val.STREET}</td>
                                    <td style={{ textAlign: "center" }} >{val.CITY}</td>
                                    <td style={{ textAlign: "center" }} >{val.STATE_Name}</td>
                                    <td style={{ textAlign: "center" }} >{val.contact_phone}</td>
                                    <td style={{ textAlign: "center" }} >{val.remark}</td>
                                    <td style={{ textAlign: "center" }} >{val.dlv_term}</td>
                                </tr>
                            )
                        } else {
                            if (group === val.sales_group) {
                                arrReport.push(
                                    <tr>
                                        <td style={{ textAlign: "center" }}>{arrStatusSOEN[val.DPL_SO_STATUS]}</td>
                                        <td style={{ textAlign: "center" }}>{val.so}</td>
                                        <td style={{ textAlign: "center" }} >{val.customer_name}</td>
                                        <td style={{ textAlign: "center" }} >{val.invoice}</td>
                                        <td style={{ textAlign: "right" }} >{val.box}/{val.box_qty}</td>
                                        <td style={{ textAlign: "right" }} >{val.box_weight}</td>
                                        <td style={{ textAlign: "right" }} >{val.box_type}</td>
                                        <td style={{ textAlign: "center" }} >{val.STREET}</td>
                                        <td style={{ textAlign: "center" }} >{val.CITY}</td>
                                        <td style={{ textAlign: "center" }} >{val.STATE_Name}</td>
                                        <td style={{ textAlign: "center" }} >{val.contact_phone}</td>
                                        <td style={{ textAlign: "center" }} >{val.remark}</td>
                                        <td style={{ textAlign: "center" }} >{val.dlv_term}</td>
                                    </tr>
                                )
                            }
                        }

                    }, this)
                    this.setState({ dataTable: arrReport, filename: filename, result: responseJson.result }, () => {
                        props.dispatch(is_loader(false))
                        this.setData_Excel()
                    })
                } else {
                    alert("มีข้อผิดพลาดเกิดขึ้น กรุณาลองใหม่")
                }
            })
    }

    compareBy(key) {
        if (this.state.status !== true) {
            return function (a, b) {
                if (a[key] < b[key]) return -1;
                if (a[key] > b[key]) return 1;
                return 0;
            };
        } else {
            return function (a, b) {
                if (a[key] > b[key]) return -1;
                if (a[key] < b[key]) return 1;
                return 0;
            };
        }
    }

    sortBy(key) {
        let arrayCopy = [...this.state.result]
        var arrShowData = []
        arrayCopy.sort(this.compareBy(key)).forEach(function (val, i) { //sort data and push arrShowData new
            arrShowData.push(
                <tr>
                    <td style={{ textAlign: "center" }}>{arrStatusSOEN[val.DPL_SO_STATUS]}</td>
                    <td style={{ textAlign: "center" }}>{val.so}</td>
                    <td style={{ textAlign: "center" }} >{val.customer_name}</td>
                    <td style={{ textAlign: "center" }} >{val.invoice}</td>
                    <td style={{ textAlign: "right" }} >{val.box}/{val.box_qty}</td>
                    <td style={{ textAlign: "right" }} >{val.box_weight}</td>
                    <td style={{ textAlign: "right" }} >{val.box_type}</td>
                    <td style={{ textAlign: "center" }} >{val.STREET}</td>
                    <td style={{ textAlign: "center" }} >{val.CITY}</td>
                    <td style={{ textAlign: "center" }} >{val.STATE_Name}</td>
                    <td style={{ textAlign: "center" }} >{val.contact_phone}</td>
                    <td style={{ textAlign: "center" }} >{val.remark}</td>
                    <td style={{ textAlign: "center" }} >{val.dlv_term}</td>
                </tr>
            )
        }, this)
        this.setState({
            dataTable: arrShowData,
            status: !this.state.status
        }, () => { this.setData_Excel() });
    }

    render() {
        return (
            <div>
                <bs4.Container className="bgContainer-White" fluid>
                    <bs4.Form>
                        <div style={{ textAlign: "left", fontSize: "25px", fontWeight: "1000" }} >รายงานแผนการจัดส่ง</div>
                    </bs4.Form>
                    <bs4.Row>
                        <bs4.Label style={{ fontWeight: "600", fontSize: "16px", margin: "10px 20px 0px 20px" }} >Delivery date:</bs4.Label>
                        <div style={{ marginTop: "10px", }} >
                            <DatePicker
                                dateFormat="YYYY-MM-DD"
                                selected={this.state.dateStart}
                                onChange={(date) => this.onChangeForm("dateStart", date)}
                            />
                        </div>
                        <bs4.Label style={{ fontWeight: "600", fontSize: "16px", margin: "10px 0px 0px 20px" }} >To:</bs4.Label>
                        <div style={{ margin: "10px 0px 0px 20px" }} >
                            <DatePicker
                                dateFormat="YYYY-MM-DD"
                                selected={this.state.dateEnd}
                                onChange={(date) => this.onChangeForm("dateEnd", date)}
                            />
                        </div>
                        <bs4.Label style={{ fontWeight: "500", fontSize: "16px", margin: "10px 0px 0px 50px" }}>
                            <bs4.Input type="checkbox" name="express" onChange={() => this.onChangeExpress()} />{' '}
                            Express
                        </bs4.Label>

                        <bs4.Label style={{ fontWeight: "500", fontSize: "16px", margin: "10px 10px 0px 20px" }} >SaleGroup:</bs4.Label>
                        <bs4.Col sm='3'>
                            <bs4.Input type="select" name="group" id="exampleSelect" onChange={(e) => this.onChangeForm(e.target.name, e.target.value)}>
                                <option value='ALL'>ALL</option>
                                <option value='Dealer - กรุงเทพฯ'>Dealer - กรุงเทพฯ</option>
                                <option value='Dealer - ต่างจังหวัด'>Dealer - ต่างจังหวัด</option>
                                <option value='Cashvan - กรุงเทพฯ'>Cashvan - กรุงเทพฯ</option>
                                <option value='Cashvan - ต่างจังหวัด'>Cashvan - ต่างจังหวัด</option>
                                <option value='Consing - ขายขาด'>Consing - ขายขาด</option>
                                <option value='Consing - ฝากขาย'>Consing - ฝากขาย</option>
                                {/* <option value='Claim'>Claim</option> */}
                            </bs4.Input>
                        </bs4.Col>
                        <bs4.Col xs="2" >
                            <bs4.Button color="info" onClick={() => { this.getData() }} > <MdIcon.MdSearch className="iconlg" /> SEARCH</bs4.Button>
                        </bs4.Col>
                    </bs4.Row>
                    <br />
                    <bs4.Row>
                        <bs4.Col>
                            <Workbook filename={this.state.filename + '.xlsx'} element={<bs4.Button color='success' outline style={{ fontSize: "15px", fontWeight: "600" }}>EXCEL</bs4.Button>} >
                                <Workbook.Sheet data={this.state.arrDataExcel} name="projectReport" >
                                    <Workbook.Column label="Status SO" value="StatusSO" />
                                    <Workbook.Column label="Sale order" value="SaleOrder" />
                                    <Workbook.Column label="CustomerName" value="CustomerName" />
                                    <Workbook.Column label="เลขที่ INV" value="เลขที่INV" />
                                    <Workbook.Column label="จำนวนกล่อง" value="จำนวนกล่อง" />
                                    <Workbook.Column label="น้ำหนักกล่อง" value="น้ำหนักกล่อง" />
                                    <Workbook.Column label="ขนาดกล่อง" value="ขนาดกล่อง" />
                                    <Workbook.Column label="ที่อยู่" value="ที่อยู่" />
                                    <Workbook.Column label="อำเภอ" value="อำเภอ" />
                                    <Workbook.Column label="จังหวัด" value="จังหวัด" />
                                    <Workbook.Column label="เบอร์โทร" value="เบอร์โทร" />
                                    <Workbook.Column label="Remarks" value="Remarks" />
                                    <Workbook.Column label="Delivery By" value="DeliveryBy" />
                                </Workbook.Sheet>
                            </Workbook>&nbsp;
                                <bs4.Button color='danger' outline style={{ fontSize: "15px", fontWeight: "600" }} onClick={this.printPDF}>PDF</bs4.Button>&nbsp;
                                {/* <Button outline onClick={this.ReactToPrint}>PRINT</Button>&nbsp; */}
                            <ReactToPrint
                                trigger={() => <bs4.Button color='primary' outline style={{ fontSize: "15px", fontWeight: "600" }} href='#'>PRINT</bs4.Button>}
                                content={() => this.componentRef}
                            />
                            <div hidden>{this.state.showTable}</div>&nbsp;

                        </bs4.Col>
                        <bs4.Col sm='4'>
                            <Select className="SelectAuto"
                                value={this.selectedOption}
                                onChange={this.handleChange}
                                options={options}
                                placeholder={'ค้นหา'}
                            />
                        </bs4.Col>
                    </bs4.Row>
                    <bs4.Row >
                        <bs4.Table striped hover bordered style={{ margin: "10px 10px 10px 10px", fontSize: "15px", fontWeight: "600" }}  >
                            <thead style={{ backgroundColor: "#1E90FF", whiteSpace: "nowrap", color: 'white' }} >
                                <th style={{ textAlign: "center" }}>Status SO<MdIcon.MdUnfoldMore className="iconlg" onClick={() => this.sortBy('DPL_SO_STATUS')} /></th>
                                <th style={{ textAlign: "center" }}>Sale order<MdIcon.MdUnfoldMore className="iconlg" onClick={() => this.sortBy('so')} /></th>
                                <th style={{ textAlign: "center" }} >Customer Name<MdIcon.MdUnfoldMore className="iconlg" onClick={() => this.sortBy('customer_name')} /></th>
                                <th style={{ textAlign: "center" }} >เลขที่ INV<MdIcon.MdUnfoldMore className="iconlg" onClick={() => this.sortBy('invoice')} /></th>
                                <th style={{ textAlign: "center" }} >จำนวนกล่อง<MdIcon.MdUnfoldMore className="iconlg" onClick={() => this.sortBy('box_qty')} /></th>
                                <th style={{ textAlign: "center" }} >น้ำหนักกล่อง<MdIcon.MdUnfoldMore className="iconlg" onClick={() => this.sortBy('box_weight')} /></th>
                                <th style={{ textAlign: "center" }} >ขนาดกล่อง<MdIcon.MdUnfoldMore className="iconlg" onClick={() => this.sortBy('')} /></th>
                                <th style={{ textAlign: "center" }} >ที่อยู่<MdIcon.MdUnfoldMore className="iconlg" onClick={() => this.sortBy('STREET')} /></th>
                                <th style={{ textAlign: "center" }} >อำเภอ<MdIcon.MdUnfoldMore className="iconlg" onClick={() => this.sortBy('CITY')} /></th>
                                <th style={{ textAlign: "center" }} >จังหวัด<MdIcon.MdUnfoldMore className="iconlg" onClick={() => this.sortBy('STATE_Name')} /></th>
                                <th style={{ textAlign: "center" }} >เบอร์โทร<MdIcon.MdUnfoldMore className="iconlg" onClick={() => this.sortBy('contact_phone')} /></th>
                                <th style={{ textAlign: "center" }} >Remarks<MdIcon.MdUnfoldMore className="iconlg" onClick={() => this.sortBy('remark')} /></th>
                                <th style={{ textAlign: "center" }} >Delivery By<MdIcon.MdUnfoldMore className="iconlg" onClick={() => this.sortBy('dlv_term')} /></th>
                            </thead>
                            <tbody >
                                {this.state.dataTable}
                            </tbody>
                        </bs4.Table>
                    </bs4.Row>
                </bs4.Container>
            </div >
        );
    }
}

function mapStateToProps(state) {
    console.log(state)
    return state
}
export default connect(mapStateToProps)(Transport_plan);