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

            }
        },
        margin: [32, 15, 0, 0]
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
            showTable: '',
            arrDataExcel: '',

        }
    }

    printPDF = () => {
        var pdfData = this.state.arrDataExcel
        //console.log('pdfData',pdfData)

        //var name = this.state.file_name.split('_')

        var docDefinition = {
            pageOrientation: 'landscape',
            content: [
                { text: 'รายงานแผนการจัดส่ง', style: 'header', fontSize: 16 },

                table(pdfData, ['StatusSO', 'SaleOrder', 'CustomerName', 'เลขที่INV', 'จำนวนกล่อง', 'น้ำหนักกล่อง', 'ขนาดกล่อง',
                    'ตำบล', 'อำเภอ', 'จังหวัด', 'เบอร์โทร', 'Remarks', 'สาเหตุของปัญหา', 'DeliveryBy'])
            ],
            defaultStyle: {
                font: 'THSarabunNew',
                fontSize: 12,
            }
        }
        //pdfMake.createPdf(docDefinition).open()
        pdfMake.createPdf(docDefinition).download('testPDF' + '.pdf')
    }

    componentDidMount() {
        this.setData_Excel()
    }

    setData_Excel = () => {
        var arr = []

        arrExcel_ = {
            StatusSO: 'test',
            SaleOrder: 'test',
            CustomerName: 'test',
            เลขที่INV: 'test',
            จำนวนกล่อง: 'test',
            น้ำหนักกล่อง: 'test',
            ขนาดกล่อง: 'test',
            ตำบล: 'test',
            อำเภอ: 'test',
            จังหวัด: 'test',
            เบอร์โทร: 'test',
            Remarks: 'test',
            สาเหตุของปัญหา: 'test',
            DeliveryBy: 'test',
        }
        arr.push(arrExcel_)

        var table = <div ref={el => (this.componentRef = el)}>
            <br />
            <div style={{ textAlign: "center", fontSize: "25px", fontWeight: "800" }} >รายงานแผนการส่ง</div>
            <br />
            <table class="table table-bordered" >
                <thead>
                    <th style={{ textAlign: "center" }}>Status SO</th>
                    <th style={{ textAlign: "center" }}>Sale order</th>
                    <th style={{ textAlign: "center" }} >CustomerName</th>
                    <th style={{ textAlign: "center" }} >เลขที่ INV</th>
                    <th style={{ textAlign: "center" }} >จำนวนกล่อง</th>
                    <th style={{ textAlign: "center" }} >น้ำหนักกล่อง</th>
                    <th style={{ textAlign: "center" }} >ขนาดกล่อง</th>
                    <th style={{ textAlign: "center" }} >ตำบล</th>
                    <th style={{ textAlign: "center" }} >อำเภอ</th>
                    <th style={{ textAlign: "center" }} >จังหวัด</th>
                    <th style={{ textAlign: "center" }} >เบอร์โทร</th>
                    <th style={{ textAlign: "center" }} >Remarks</th>
                    <th style={{ textAlign: "center" }} >Delivery By</th>
                </thead>
                <tbody >
                    {/* {this.state.dataTable} */}
                </tbody>
            </table>
        </div>

        this.setState({ showTable: table, arrDataExcel: arr })
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
                                onChange={(date) => this.onChangeDateTime("dateStart", date)}
                            />
                        </div>
                        <bs4.Label style={{ fontWeight: "600", fontSize: "16px", margin: "10px 0px 0px 20px" }} >To:</bs4.Label>
                        <div style={{ margin: "10px 0px 0px 20px" }} >
                            <DatePicker
                                dateFormat="YYYY-MM-DD"
                                selected={this.state.dateEnd}
                                onChange={(date) => this.onChangeDateTime("dateEnd", date)}
                            />
                        </div>
                        <bs4.Label style={{ fontWeight: "500", fontSize: "16px", margin: "10px 0px 0px 50px" }}>
                            <bs4.Input type="checkbox" />{' '}
                            Express
                        </bs4.Label>

                        <bs4.Label style={{ fontWeight: "500", fontSize: "16px", margin: "10px 10px 0px 20px" }} >SaleGroup</bs4.Label>
                        <bs4.Col sm='3'>
                            <bs4.Input type="select" name="group" id="exampleSelect" onChange={(e) => this.onChangeForm(e.target.name, e.target.value)}>
                                <option value='ALL'>ALL</option>
                                <option value='Order DL กทม.'>Dealer-กรุงเทพฯ</option>
                                <option value='Order DL ตจว.'>Dealer-ต่างจังหวัด</option>
                                <option value='Order CV กทม.'>Cashvan-กรุงเทพฯ</option>
                                <option value='Order CV ตจว.'>Cashvan-ต่างจังหวัด</option>
                                <option value='Order Express'>Express</option>
                                <option value='Order Trade1'>Trade1</option>
                                <option value='Order Trade2'>Trade2</option>
                                <option value='Online'>Online</option>
                                <option value='Claim'>Claim</option>
                                <option value='Other'>Other</option>
                                {/* <option value='Claim'>Claim</option> */}
                            </bs4.Input>
                        </bs4.Col>
                        <bs4.Col xs="2" >
                            <bs4.Button color="info" onClick={() => { this.getReport('', '', '') }} > <MdIcon.MdSearch className="iconlg" /> SEARCH</bs4.Button>
                        </bs4.Col>
                    </bs4.Row>
                    <br />
                    <bs4.Row>
                        <bs4.Col>
                            <Workbook filename={'testExcel' + '.xlsx'} element={<bs4.Button color='success' outline style={{ fontSize: "15px", fontWeight: "600" }}>EXCEL</bs4.Button>} >
                                <Workbook.Sheet data={this.state.arrDataExcel} name="projectReport" >
                                    <Workbook.Column label="Status SO" value="StatusSO" />
                                    <Workbook.Column label="Sale order" value="SaleOrder" />
                                    <Workbook.Column label="CustomerName" value="CustomerName" />
                                    <Workbook.Column label="เลขที่ INV" value="เลขที่INV" />
                                    <Workbook.Column label="จำนวนกล่อง" value="จำนวนกล่อง" />
                                    <Workbook.Column label="น้ำหนักกล่อง" value="น้ำหนักกล่อง" />
                                    <Workbook.Column label="ขนาดกล่อง" value="ขนาดกล่อง" />
                                    <Workbook.Column label="ตำบล" value="ตำบล" />
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
                                <th style={{ textAlign: "center" }}>Status SO</th>
                                <th style={{ textAlign: "center" }}>Sale order<MdIcon.MdUnfoldMore className="iconlg" onClick={() => this.sortBy('start_date')} /></th>
                                <th style={{ textAlign: "center" }} >Customer Name<MdIcon.MdUnfoldMore className="iconlg" onClick={() => this.sortBy('start_point')} /></th>
                                <th style={{ textAlign: "center" }} >เลขที่ INV<MdIcon.MdUnfoldMore className="iconlg" onClick={() => this.sortBy('end_point')} /></th>
                                <th style={{ textAlign: "center" }} >จำนวนกล่อง<MdIcon.MdUnfoldMore className="iconlg" onClick={() => this.sortBy('qty_product')} /></th>
                                <th style={{ textAlign: "center" }} >น้ำหนักกล่อง<MdIcon.MdUnfoldMore className="iconlg" onClick={() => this.sortBy('rec_time')} /></th>
                                <th style={{ textAlign: "center" }} >ขนาดกล่อง<MdIcon.MdUnfoldMore className="iconlg" onClick={() => this.sortBy('exit_time')} /></th>
                                <th style={{ textAlign: "center" }} >ตำบล<MdIcon.MdUnfoldMore className="iconlg" onClick={() => this.sortBy('finish_time')} /></th>
                                <th style={{ textAlign: "center" }} >อำเภอ<MdIcon.MdUnfoldMore className="iconlg" onClick={() => this.sortBy('car_license')} /></th>
                                <th style={{ textAlign: "center" }} >จังหวัด<MdIcon.MdUnfoldMore className="iconlg" onClick={() => this.sortBy('car_license')} /></th>
                                <th style={{ textAlign: "center" }} >เบอร์โทร<MdIcon.MdUnfoldMore className="iconlg" onClick={() => this.sortBy('car_type')} /></th>
                                <th style={{ textAlign: "center" }} >Remarks<MdIcon.MdUnfoldMore className="iconlg" onClick={() => this.sortBy('mess_code')} /></th>
                                <th style={{ textAlign: "center" }} >Delivery By<MdIcon.MdUnfoldMore className="iconlg" onClick={() => this.sortBy('remark')} /></th>
                            </thead>
                            <tbody >
                                {/* {this.state.dataTable} */}
                                <tr>
                                    <td style={{ textAlign: "center" }}>Status SO</td>
                                    <td style={{ textAlign: "center" }}>Sale order</td>
                                    <td style={{ textAlign: "center" }} >CustomerName</td>
                                    <td style={{ textAlign: "center" }} >เลขที่ INV</td>
                                    <td style={{ textAlign: "center" }} >จำนวนกล่อง</td>
                                    <td style={{ textAlign: "center" }} >น้ำหนักกล่อง</td>
                                    <td style={{ textAlign: "center" }} >ขนาดกล่อง</td>
                                    <td style={{ textAlign: "center" }} >ตำบล</td>
                                    <td style={{ textAlign: "center" }} >อำเภอ</td>
                                    <td style={{ textAlign: "center" }} >จังหวัด</td>
                                    <td style={{ textAlign: "center" }} >เบอร์โทร</td>
                                    <td style={{ textAlign: "center" }} >Remarks</td>
                                    <td style={{ textAlign: "center" }} >Delivery By</td>
                                </tr>
                                <tr>
                                    <td style={{ textAlign: "center" }}>Status SO</td>
                                    <td style={{ textAlign: "center" }}>Sale order</td>
                                    <td style={{ textAlign: "center" }} >CustomerName</td>
                                    <td style={{ textAlign: "center" }} >เลขที่ INV</td>
                                    <td style={{ textAlign: "center" }} >จำนวนกล่อง</td>
                                    <td style={{ textAlign: "center" }} >น้ำหนักกล่อง</td>
                                    <td style={{ textAlign: "center" }} >ขนาดกล่อง</td>
                                    <td style={{ textAlign: "center" }} >ตำบล</td>
                                    <td style={{ textAlign: "center" }} >อำเภอ</td>
                                    <td style={{ textAlign: "center" }} >จังหวัด</td>
                                    <td style={{ textAlign: "center" }} >เบอร์โทร</td>
                                    <td style={{ textAlign: "center" }} >Remarks</td>
                                    <td style={{ textAlign: "center" }} >Delivery By</td>
                                </tr>
                                <tr>
                                    <td style={{ textAlign: "center" }}>Status SO</td>
                                    <td style={{ textAlign: "center" }}>Sale order</td>
                                    <td style={{ textAlign: "center" }} >CustomerName</td>
                                    <td style={{ textAlign: "center" }} >เลขที่ INV</td>
                                    <td style={{ textAlign: "center" }} >จำนวนกล่อง</td>
                                    <td style={{ textAlign: "center" }} >น้ำหนักกล่อง</td>
                                    <td style={{ textAlign: "center" }} >ขนาดกล่อง</td>
                                    <td style={{ textAlign: "center" }} >ตำบล</td>
                                    <td style={{ textAlign: "center" }} >อำเภอ</td>
                                    <td style={{ textAlign: "center" }} >จังหวัด</td>
                                    <td style={{ textAlign: "center" }} >เบอร์โทร</td>
                                    <td style={{ textAlign: "center" }} >Remarks</td>
                                    <td style={{ textAlign: "center" }} >Delivery By</td>
                                </tr>
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