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

const { proxy } = require ('../../service')
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

class Report_Timeable extends Component {
    constructor(props) {
        super(props)
        this.state = {
            arrDataExcel: [],
            showTable: '',
            dataTable: '',
            dateStart: moment(),
            dateEnd: moment(),
            file_name: ''
        }
    }

    printPDF = () => {
        var pdfData = this.state.arrDataExcel
        //console.log('pdfData',pdfData)

        var name = this.state.file_name.split('_')

        var docDefinition = {
            pageOrientation: 'landscape',
            content: [
                { text: 'รายงานแสดงข้อมูลรอบรถ วันที่ ' + name[1] + ' ถึง ' + name[2], style: 'header', fontSize: 16, margin: [215, 2, 5, 5] },

                table(pdfData, ['ลำดับ', 'วันที่', 'สถานที่รับสินค้า', 'สถานที่ส่งสินค้า', 'จำนวนสินค้า', 'เวลาเข้ารับสินค้า', 'เวลาออก', 'เวลาถึง', 'เวลาเดินทาง', 'ทะเบียนรถ', 'ประเภทรถ', 'ชื่อผู้ขับ', 'สาเหตุของปัญหา', 'หมายเหตุ'])
            ],
            defaultStyle: {
                font: 'THSarabunNew',
                fontSize: 12
            }
        }
        //pdfMake.createPdf(docDefinition).open()
        pdfMake.createPdf(docDefinition).download(this.state.file_name + '.pdf')
    }

    onChangeDateTime = (id, value) => {
        this.setState({ [id]: value }, () => {
            console.log("checkData", this.state)
        })
    }

    getReport = (start, end) => {
        if (start === '' && end === '') {
            start = (moment(this.state.dateStart).format('YYYY-MM-DD'))
            end = (moment(this.state.dateEnd).format('YYYY-MM-DD'))
            localStorage.setItem('start', start)
            localStorage.setItem('end', end)
        }

        var filename = 'reportTimeable_' + start + '_' + end

        var arrReport = []
        var url = proxy.main + 'calendar/get-report-calendar/' + start + '&' + end
        //var url = proxy.test + 'calendar/get-report-calendar/' + start + '&' + end
        console.log('----', url)
        fetch(url)
            .then(response => response.json())
            .then((responseJson) => {
                if (responseJson.result.length === 0) {
                    alert('ไม่พบข้อมูล')
                } else {
                    console.log("responseJson", responseJson.result)
                    responseJson.result.forEach(function (val, i) {
                        var date = (moment(val.start_date).format('DD-MM-YYYY'))

                        var arr_rec_time = val.rec_time === null ? '' : val.rec_time.split('T')
                        var rec_time = (moment(moment(arr_rec_time[1], 'HH:mm')).format('HH:mm'))

                        var arr_exit_time = val.exit_time === null ? '' : val.exit_time.split('T')
                        var exit_time = (moment(moment(arr_exit_time[1], 'HH:mm')).format('HH:mm'))

                        var arr_finish_time = val.finish_time === null ? '' : val.finish_time.split('T')
                        var finish_time = (moment(moment(arr_finish_time[1], 'HH:mm')).format('HH:mm'))

                        var result = public_function.getDiff_Date(exit_time,finish_time)

                        arrReport.push(
                            <tr>
                                <td style={{ textAlign: "center" }} >{i + 1}</td>
                                <td style={{ textAlign: "center" }} >{date}</td>
                                <td style={{ textAlign: "center" }} >{val.start_point}</td>
                                <td style={{ textAlign: "center" }} >{val.end_point}</td>
                                <td style={{ textAlign: "center" }} >{val.qty_product === 'null' ? '' : val.qty_product}</td>
                                <td style={{ textAlign: "center" }} >{rec_time === 'Invalid date' ? '' : rec_time}</td>
                                <td style={{ textAlign: "center" }} >{exit_time === 'Invalid date' ? '' : exit_time}</td>
                                <td style={{ textAlign: "center" }} >{finish_time === 'Invalid date' ? '' : finish_time}</td>
                                <td style={{ textAlign: "center" }} >{result === 'NaN ชั่วโมง NaN นาที' ? '' : result}</td>
                                <td style={{ textAlign: "center" }} >{val.car_license}</td>
                                <td style={{ textAlign: "center" }} >{val.car_type}</td>
                                <td style={{ textAlign: "center" }} >{val.mess_code}</td>
                                <td style={{ textAlign: "center" }} >{val.cause_name === null ? '' : val.cause_name}</td>
                                <td style={{ textAlign: "center" }} >{val.remark}</td>
                            </tr>
                        )
                    });

                    this.setState({ dataTable: arrReport, result: responseJson.result, file_name: filename }, () => {
                        this.showData(responseJson.result)
                    })
                }
            })
    }

    showData = (result) => {
        arr = []

        result.forEach(function (val, i) {
            var date = (moment(val.start_date).format('DD-MM-YYYY'))
            var rec_time = (moment(val.rec_time).format('HH:mm'))
            var exit_time = (moment(val.exit_time).format('HH:mm'))
            var finish_time = (moment(val.finish_time).format('HH:mm'))

            var result = public_function.getDiff_Date(exit_time,finish_time)

            arrExcel_ = {
                ลำดับ: i + 1,
                วันที่: date,
                สถานที่รับสินค้า: val.start_point,
                สถานที่ส่งสินค้า: val.end_point,
                จำนวนสินค้า: val.qty_product === 'null' || val.qty_product === null ? '' : val.qty_product,
                เวลาเข้ารับสินค้า: rec_time === 'Invalid date' || rec_time === null ? '' : rec_time,
                เวลาออก: exit_time === 'Invalid date' || exit_time === null ? '' : exit_time,
                เวลาถึง: finish_time === 'Invalid date' || finish_time === null ? '' : finish_time,
                เวลาเดินทาง: result === 'NaN ชั่วโมง NaN นาที' ? '' : result,
                ทะเบียนรถ: val.car_license,
                ประเภทรถ: val.car_type,
                ชื่อผู้ขับ: val.mess_code,
                สาเหตุของปัญหา: val.cause_name === null ? '' : val.cause_name,
                หมายเหตุ: val.remark,
            }
            arr.push(arrExcel_)
        });

        var table = <table class="table table-bordered" ref={el => (this.componentRef = el)} >
            <thead style={{ whiteSpace: "nowrap" }} >
                <td style={{ whiteSpace: "nowrap", textAlign: "center" }}>ลำดับ</td>
                <td width="7%" style={{ whiteSpace: "nowrap", textAlign: "center" }} dataField='date' dataSort={true}>วันที่</td>
                <td style={{ whiteSpace: "nowrap", textAlign: "center" }} >สถานที่รับสินค้า(ต้นทาง)</td>
                <td style={{ whiteSpace: "nowrap", textAlign: "center" }} >สถานที่ส่งสินค้า(ปลายทาง)</td>
                <td style={{ textAlign: "center" }} >จำนวนสินค้า(พาเลท)</td>
                <td style={{ whiteSpace: "nowrap", textAlign: "center" }} >เวลาเข้ารับสินค้า่</td>
                <td style={{ whiteSpace: "nowrap", textAlign: "center" }} >เวลาออก</td>
                <td style={{ whiteSpace: "nowrap", textAlign: "center" }} >เวลาถึง</td>
                <td style={{ whiteSpace: "nowrap", textAlign: "center" }} >เวลาเดินทาง(ชั่วโมง-นาที)</td>
                <td style={{ whiteSpace: "nowrap", textAlign: "center" }} >ทะเบียนรถ</td>
                <td style={{ whiteSpace: "nowrap", textAlign: "center" }} >ประเภทรถ</td>
                <td style={{ whiteSpace: "nowrap", textAlign: "center" }} >ชื่อผู้ขับ</td>
                <td width="10%" style={{ whiteSpace: "nowrap", textAlign: "center" }} >สาเหตุของปัญหา</td>
                <td width="15%" style={{ whiteSpace: "nowrap", textAlign: "center" }} >หมายเหตุ</td>
            </thead>
            <tbody >
                {this.state.dataTable}
            </tbody>
        </table>

        this.setState({ showTable: table, arrDataExcel: arr })
    }

    componentWillMount = () => {
        var status = localStorage.getItem('reportStatus')
        console.log('=========', status)
        if (status === 'success') {
            localStorage.setItem('reportStatus', 'not')
            var start = localStorage.getItem('start')
            var end = localStorage.getItem('end')

            this.getReport(start, end)
        }
    }

    editReport = () => {
        console.log('report', this.state.result)
        localStorage.setItem('report', JSON.stringify(this.state.result))
        browserHistory.push('/report/Editreport_Timeable')
    }

    render() {
        return (
            <div>
                <bs4.Container className="bgContainer-White" fluid>
                    <div style={{ textAlign: "left", fontSize: "22px", fontWeight: "800" }} >รายงานแสดงข้อมูลรอบรถ</div>
                    <bs4.Row>
                        <bs4.Col xs="3" >
                            <bs4.FormGroup row>
                                <bs4.Label style={{ fontWeight: "500", fontSize: "16px", margin: "10px 20px 0px 20px" }} >วันที่เริ่มต้น</bs4.Label>
                                <div style={{ marginTop: "10px", }} >
                                    <DatePicker
                                        dateFormat="YYYY-MM-DD"
                                        selected={this.state.dateStart}
                                        onChange={(date) => this.onChangeDateTime("dateStart", date)}
                                    />
                                </div>
                            </bs4.FormGroup>
                        </bs4.Col>
                        <bs4.Col xs="3" >
                            <bs4.FormGroup row>
                                <bs4.Label style={{ fontWeight: "500", fontSize: "16px", margin: "10px 20px 0px 20px" }} >วันที่สิ้นสุด</bs4.Label>
                                <div style={{ marginTop: "10px", }} >
                                    <DatePicker
                                        dateFormat="YYYY-MM-DD"
                                        selected={this.state.dateEnd}
                                        onChange={(date) => this.onChangeDateTime("dateEnd", date)}
                                    />
                                </div>
                            </bs4.FormGroup>
                        </bs4.Col>
                        <bs4.Col xs="2" >
                            <bs4.Button color="info" onClick={() => { this.getReport('', '') }} > <MdIcon.MdSearch className="iconlg" /> SEARCH</bs4.Button>
                        </bs4.Col>
                    </bs4.Row>
                    <bs4.Row>
                        <bs4.Col>
                            <Workbook filename={this.state.file_name + '.xlsx'} element={<bs4.Button outline>EXCEL</bs4.Button>} >
                                <Workbook.Sheet data={this.state.arrDataExcel} name="projectReport" >
                                    <Workbook.Column label="ลำดับ" value="ลำดับ" />
                                    <Workbook.Column label="วันที่" value="วันที่" />
                                    <Workbook.Column label="สถานที่รับสินค้า(ต้นทาง)" value="สถานที่รับสินค้า" />
                                    <Workbook.Column label="สถานที่ส่งสินค้า(ปลายทาง)" value="สถานที่ส่งสินค้า" />
                                    <Workbook.Column label="จำนวนสินค้า(พาเลท)" value="จำนวนสินค้า" />
                                    <Workbook.Column label="เวลาเข้ารับสินค้า" value="เวลาเข้ารับสินค้า" />
                                    <Workbook.Column label="เวลาออก" value="เวลาออก" />
                                    <Workbook.Column label="เวลาถึง" value="เวลาถึง" />
                                    <Workbook.Column label="เวลาเดินทาง(ชั่วโมง-นาที)" value="เวลาเดินทาง" />
                                    <Workbook.Column label="ทะเบียนรถ" value="ทะเบียนรถ" />
                                    <Workbook.Column label="ประเภทรถ" value="ประเภทรถ" />
                                    <Workbook.Column label="ชื่อผู้ขับ" value="ชื่อผู้ขับ" />
                                    <Workbook.Column label="สาเหตุของปัญหา" value="สาเหตุของปัญหา" />
                                    <Workbook.Column label="หมายเหตุ" value="หมายเหตุ" />
                                </Workbook.Sheet>
                            </Workbook>&nbsp;
                                <bs4.Button outline onClick={this.printPDF}>PDF</bs4.Button>&nbsp;
                                {/* <Button outline onClick={this.ReactToPrint}>PRINT</Button>&nbsp; */}
                            <ReactToPrint
                                trigger={() => <bs4.Button outline href='#'>PRINT</bs4.Button>}
                                content={() => this.componentRef}
                            />
                            <div hidden>{this.state.showTable}</div>&nbsp;
                                <bs4.Button color='warning' onClick={this.editReport} >EDIT</bs4.Button>
                        </bs4.Col>
                    </bs4.Row>
                    <bs4.Row >
                        <bs4.Table striped hover bordered style={{ margin: "10px 10px 10px 10px" }}  >
                            <thead style={{ backgroundColor: "#17a2b8", whiteSpace: "nowrap" }} >
                                <td style={{ whiteSpace: "nowrap", textAlign: "center" }}>ลำดับ</td>
                                <td width="7%" style={{ whiteSpace: "nowrap", textAlign: "center" }} dataField='date' dataSort={true}>วันที่</td>
                                <td style={{ whiteSpace: "nowrap", textAlign: "center" }} >สถานที่รับสินค้า(ต้นทาง)</td>
                                <td style={{ whiteSpace: "nowrap", textAlign: "center" }} >สถานที่ส่งสินค้า(ปลายทาง)</td>
                                <td style={{ textAlign: "center" }} >จำนวนสินค้า(พาเลท)</td>
                                <td style={{ whiteSpace: "nowrap", textAlign: "center" }} >เวลาเข้ารับสินค้า่</td>
                                <td style={{ whiteSpace: "nowrap", textAlign: "center" }} >เวลาออก</td>
                                <td style={{ whiteSpace: "nowrap", textAlign: "center" }} >เวลาถึง</td>
                                <td style={{ whiteSpace: "nowrap", textAlign: "center" }} >เวลาเดินทาง(ชั่วโมง-นาที)</td>
                                <td style={{ whiteSpace: "nowrap", textAlign: "center" }} >ทะเบียนรถ</td>
                                <td style={{ whiteSpace: "nowrap", textAlign: "center" }} >ประเภทรถ</td>
                                <td style={{ whiteSpace: "nowrap", textAlign: "center" }} >ชื่อผู้ขับ</td>
                                <td width="10%" style={{ whiteSpace: "nowrap", textAlign: "center" }} >สาเหตุของปัญหา</td>
                                <td width="15%" style={{ whiteSpace: "nowrap", textAlign: "center" }} >หมายเหตุ</td>
                            </thead>
                            <tbody >
                                {this.state.dataTable}
                            </tbody>
                        </bs4.Table>
                    </bs4.Row>
                </bs4.Container>
            </div>
        );
    }
}
function mapStateToProps(state) {
    console.log(state)
    return state
}
export default connect(mapStateToProps)(Report_Timeable);