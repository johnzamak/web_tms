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
            body: buildTableBody(data, columns),
            widths: ['3%', '7%', '8%', '8%', '6.5%', '8%', '6%', '6%', '9%', '6%', '6%', '9%', '8.5%', '14%'],
        },
        layout: {
            hLineWidth: function (i, node) {
                return 1;
            }
        },
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
            file_name: '',
            selectedOption: null,
            value: '',
            resultJson: [],
            status: true
        }
    }

    printPDF = () => {
        var pdfData = this.state.arrDataExcel
        //console.log('pdfData',pdfData)

        var name = this.state.file_name.split('_')

        var docDefinition = {
            pageSize: 'A4',
            pageOrientation: 'landscape',
            pageMargins: [ 12, 20, 40, 0 ],
            content: [
                { text: 'รายงานแสดงข้อมูลรอบรถ วันที่ ' + name[1] + ' ถึง ' + name[2], style: 'header', fontSize: 16, marginLeft: 280 },
                { text: ' ', style: 'header', fontSize: 10 },
                table(pdfData, ['ลำดับ', 'วันที่', 'สถานที่รับสินค้า', 'สถานที่ส่งสินค้า', 'จำนวนสินค้า', 'เวลาเข้ารับสินค้า', 'เวลาออก', 'เวลาถึง', 'เวลาเดินทาง', 'ทะเบียนรถ', 'ประเภทรถ', 'ชื่อผู้ขับ', 'สาเหตุของปัญหา', 'หมายเหตุ'])
            ],
            defaultStyle: {
                font: 'THSarabunNew',
                fontSize: 12,
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

    getReport = (value, start, end) => {
        var props = this.props
        props.dispatch(is_loader(true))
        if (start === '' && end === '') {
            start = (moment(this.state.dateStart).format('YYYY-MM-DD'))
            end = (moment(this.state.dateEnd).format('YYYY-MM-DD'))
            localStorage.setItem('start', start)
            localStorage.setItem('end', end)
        }

        var filename = 'reportTimeable_' + start + '_' + end

        var arrReport = []
        var arrResult = []

        var url = proxy.main + 'calendar/get-report-calendar/' + start + '&' + end
        //var url = proxy.main + 'calendar/get-report-calendar/' + start + '&' + end
        console.log('----', url)
        fetch(url)
            .then(response => response.json())
            .then((responseJson) => {
                if (responseJson.result.length === 0) {
                    alert('ไม่พบข้อมูล')
                } else {
                    console.log("responseJson", responseJson.result)
                    responseJson.result.forEach(function (val, i) {
                        var data
                        if (value.type === 'start_point') {
                            data = val.start_point
                        } else if (value.type === 'end_point') {
                            data = val.end_point
                        } else if (value.type === 'car_license') {
                            data = val.car_license
                        } else if (value.type === 'car_type') {
                            data = val.car_type
                        } else if (value.type === 'mess_code') {
                            data = val.mess_code
                        } else if (value.type === 'cause_name') {
                            data = val.cause_name
                        } else if (value.type === 'remark') {
                            data = val.remark
                        }

                        if (value === '') {
                            var date = (moment(val.start_date).format('DD-MM-YYYY'))

                            var arr_rec_time = val.rec_time === null ? '' : val.rec_time.split('T')
                            var rec_time = (moment(moment(arr_rec_time[1], 'HH:mm')).format('HH:mm'))

                            var arr_exit_time = val.exit_time === null ? '' : val.exit_time.split('T')
                            var exit_time = (moment(moment(arr_exit_time[1], 'HH:mm')).format('HH:mm'))

                            var arr_finish_time = val.finish_time === null ? '' : val.finish_time.split('T')
                            var finish_time = (moment(moment(arr_finish_time[1], 'HH:mm')).format('HH:mm'))

                            var result = public_function.getDiff_Date(exit_time, finish_time)

                            arrReport.push(
                                <tr>
                                    <td style={{ textAlign: "center" }} >{i + 1}</td>
                                    <td style={{ textAlign: "center" }} >{date}</td>
                                    <td style={{ textAlign: "center" }} >{val.start_point}</td>
                                    <td style={{ textAlign: "center" }} >{val.end_point}</td>
                                    <td style={{ textAlign: "right", backgroundColor: "#FFA500" }} >{val.qty_product === 'null' ? '' : val.qty_product}</td>
                                    <td style={{ textAlign: "center", backgroundColor: "#33CCFF" }} >{rec_time === 'Invalid date' ? '' : rec_time}</td>
                                    <td style={{ textAlign: "center", backgroundColor: "#33CCFF" }} >{exit_time === 'Invalid date' ? '' : exit_time}</td>
                                    <td style={{ textAlign: "center", backgroundColor: "#32CD32" }} >{finish_time === 'Invalid date' ? '' : finish_time}</td>
                                    <td style={{ textAlign: "center", backgroundColor: "#FFFF00" }} >{result === 'NaN ชั่วโมง NaN นาที' ? '' : result}</td>
                                    <td style={{ textAlign: "center" }} >{val.car_license}</td>
                                    <td style={{ textAlign: "center" }} >{val.car_type}</td>
                                    <td style={{ textAlign: "center" }} >{val.mess_code}</td>
                                    <td style={{ textAlign: "center" }} >{val.cause_name === null ? '' : val.cause_name}</td>
                                    <td style={{ textAlign: "center" }} >{val.remark}</td>
                                </tr>
                            )

                            var temp2 = {}
                            temp2["value"] = val.start_point
                            temp2['label'] = val.start_point
                            temp2['type'] = 'start_point'
                            var temp3 = {}
                            temp3["value"] = val.end_point
                            temp3['label'] = val.end_point
                            temp3['type'] = 'end_point'
                            var temp4 = {}
                            temp4["value"] = val.car_license
                            temp4['label'] = val.car_license
                            temp4['type'] = 'car_license'
                            var temp5 = {}
                            temp5["value"] = val.car_type
                            temp5['label'] = val.car_type
                            temp5['type'] = 'car_type'
                            var temp6 = {}
                            temp6["value"] = val.mess_code
                            temp6['label'] = val.mess_code
                            temp6['type'] = 'mess_code'
                            var temp7 = {}
                            temp7["value"] = val.cause_name === null ? '' : val.cause_name
                            temp7['label'] = val.cause_name === null ? '' : val.cause_name
                            temp7['type'] = 'cause_name'
                            var temp8 = {}
                            temp8["value"] = val.remark
                            temp8['label'] = val.remark
                            temp8['type'] = 'remark'

                            options.push(temp2, temp3, temp4, temp5, temp6, temp7, temp8)

                            arrResult.push(val)

                        } else {
                            if (value.value === data) {
                                var date = (moment(val.start_date).format('DD-MM-YYYY'))

                                var arr_rec_time = val.rec_time === null ? '' : val.rec_time.split('T')
                                var rec_time = (moment(moment(arr_rec_time[1], 'HH:mm')).format('HH:mm'))

                                var arr_exit_time = val.exit_time === null ? '' : val.exit_time.split('T')
                                var exit_time = (moment(moment(arr_exit_time[1], 'HH:mm')).format('HH:mm'))

                                var arr_finish_time = val.finish_time === null ? '' : val.finish_time.split('T')
                                var finish_time = (moment(moment(arr_finish_time[1], 'HH:mm')).format('HH:mm'))

                                var result = public_function.getDiff_Date(exit_time, finish_time)

                                arrReport.push(
                                    <tr>
                                        <td style={{ textAlign: "center" }} >{i + 1}</td>
                                        <td style={{ textAlign: "center" }} >{date}</td>
                                        <td style={{ textAlign: "center" }} >{val.start_point}</td>
                                        <td style={{ textAlign: "center" }} >{val.end_point}</td>
                                        <td style={{ textAlign: "right", backgroundColor: "#FFA500" }} >{val.qty_product === 'null' ? '' : val.qty_product}</td>
                                        <td style={{ textAlign: "center", backgroundColor: "#33CCFF" }} >{rec_time === 'Invalid date' ? '' : rec_time}</td>
                                        <td style={{ textAlign: "center", backgroundColor: "#33CCFF" }} >{exit_time === 'Invalid date' ? '' : exit_time}</td>
                                        <td style={{ textAlign: "center", backgroundColor: "#32CD32" }} >{finish_time === 'Invalid date' ? '' : finish_time}</td>
                                        <td style={{ textAlign: "center", backgroundColor: "#FFFF00" }} >{result === 'NaN ชั่วโมง NaN นาที' ? '' : result}</td>
                                        <td style={{ textAlign: "center" }} >{val.car_license}</td>
                                        <td style={{ textAlign: "center" }} >{val.car_type}</td>
                                        <td style={{ textAlign: "center" }} >{val.mess_code}</td>
                                        <td style={{ textAlign: "center" }} >{val.cause_name === null ? '' : val.cause_name}</td>
                                        <td style={{ textAlign: "center" }} >{val.remark}</td>
                                    </tr>
                                )
                                var temp2 = {}
                                temp2["value"] = val.start_point
                                temp2['label'] = val.start_point
                                temp2['type'] = 'start_point'
                                var temp3 = {}
                                temp3["value"] = val.end_point
                                temp3['label'] = val.end_point
                                temp3['type'] = 'end_point'
                                var temp4 = {}
                                temp4["value"] = val.car_license
                                temp4['label'] = val.car_license
                                temp4['type'] = 'car_license'
                                var temp5 = {}
                                temp5["value"] = val.car_type
                                temp5['label'] = val.car_type
                                temp5['type'] = 'car_type'
                                var temp6 = {}
                                temp6["value"] = val.mess_code
                                temp6['label'] = val.mess_code
                                temp6['type'] = 'mess_code'
                                var temp7 = {}
                                temp7["value"] = val.cause_name === null ? '' : val.cause_name
                                temp7['label'] = val.cause_name === null ? '' : val.cause_name
                                temp7['type'] = 'cause_name'
                                var temp8 = {}
                                temp8["value"] = val.remark
                                temp8['label'] = val.remark
                                temp8['type'] = 'remark'

                                options.push(temp2, temp3, temp4, temp5, temp6, temp7, temp8)


                                arrResult.push(val)
                            }
                        }

                    });

                    this.setState({ dataTable: arrReport, result: arrResult, file_name: filename, value: value }, () => {
                        console.log('options', options)
                        props.dispatch(is_loader(false))
                        this.showData()
                    })
                }
            })
    }

    showData = () => {
        var name = this.state.file_name.split('_')
        var result = this.state.result
        arr = []

        result.forEach(function (val, i) {
            var date = (moment(val.start_date).format('DD-MM-YYYY'))
            var rec_time = (moment(val.rec_time).format('HH:mm'))
            var exit_time = (moment(val.exit_time).format('HH:mm'))
            var finish_time = (moment(val.finish_time).format('HH:mm'))

            var result = public_function.getDiff_Date(exit_time, finish_time)

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

        var table =  <div style={{ padding:"20px",pageBreakAfter: "always" }} ref={el => (this.componentRef = el)}>
        <br />
        <div style={{ textAlign: "center", fontSize: "18px", fontWeight: "600" }} >รายงานแสดงข้อมูลรอบรถ วันที่  {name[1]} ถึง {name[2]}</div>
        <br />
        <bs4.Table bordered style={{ fontSize: "14px" }}>
            <thead>
                <td width="5%" style={{ textAlign: "center" }}>ลำดับ</td>
                <td width="7%" style={{ textAlign: "center" }}>วันที่</td>
                <td style={{ textAlign: "center" }} >สถานที่รับสินค้า<br />(ต้นทาง)</td>
                <td style={{ textAlign: "center" }} >สถานที่ส่งสินค้า<br />(ปลายทาง)</td>
                <td style={{ textAlign: "center"}} >จำนวนสินค้า<br />(พาเลท)</td>
                <td style={{ textAlign: "center"}} >เวลาเข้ารับสินค้า</td>
                <td style={{ textAlign: "center"}} >เวลาออก</td>
                <td style={{ textAlign: "center"}} >เวลาถึง</td>
                <td style={{ textAlign: "center"}} >เวลาเดินทาง</td>
                <td style={{ textAlign: "center" }} >ทะเบียนรถ</td>
                <td style={{ textAlign: "center" }} >ประเภทรถ</td>
                <td width="10%" style={{ textAlign: "center" }} >ชื่อผู้ขับ</td>
                <td style={{ textAlign: "center" }} >สาเหตุของปัญหา</td>
                <td width="10%" style={{ textAlign: "center" }} >หมายเหตุ</td>
            </thead>
            <tbody >
                {this.state.dataTable}
            </tbody>
        </bs4.Table>
        </div>

        this.setState({ showTable: table, arrDataExcel: arr })
    }

    componentWillMount = () => {
        var status = localStorage.getItem('reportStatus')
        console.log('=========', status)
        if (status === 'success') {
            localStorage.setItem('reportStatus', 'not')
            var start = localStorage.getItem('start')
            var end = localStorage.getItem('end')
            var value = localStorage.getItem('value')
            this.getReport(JSON.parse(value), start, end)
        } else {
            this.getReport('', '', '')
        }
    }

    editReport = () => {
        console.log('value', this.state.value)
        localStorage.setItem('report', JSON.stringify(this.state.result))
        localStorage.setItem('value', JSON.stringify(this.state.value))
        browserHistory.push('/report/Editreport_Timeable')
    }

    handleChange = (selectedOption) => {
        // this.setState({ 
        //     selectedOption,
        //     PJID:selectedOption.value,
        // });
        console.log('selectedOption.value', selectedOption.value)
        this.getReport(selectedOption, '', '')
    }

    handleSearch = () => {
        console.log('handleSearch')
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
            var date = (moment(val.start_date).format('DD-MM-YYYY'))

            var arr_rec_time = val.rec_time === null ? '' : val.rec_time.split('T')
            var rec_time = (moment(moment(arr_rec_time[1], 'HH:mm')).format('HH:mm'))

            var arr_exit_time = val.exit_time === null ? '' : val.exit_time.split('T')
            var exit_time = (moment(moment(arr_exit_time[1], 'HH:mm')).format('HH:mm'))

            var arr_finish_time = val.finish_time === null ? '' : val.finish_time.split('T')
            var finish_time = (moment(moment(arr_finish_time[1], 'HH:mm')).format('HH:mm'))

            var result = public_function.getDiff_Date(exit_time, finish_time)

            arrShowData.push(
                <tr>
                    <td style={{ textAlign: "center" }} >{i + 1}</td>
                    <td style={{ textAlign: "center" }} >{date}</td>
                    <td style={{ textAlign: "center" }} >{val.start_point}</td>
                    <td style={{ textAlign: "center" }} >{val.end_point}</td>
                    <td style={{ textAlign: "right", backgroundColor: "#FFA500" }} >{val.qty_product === 'null' ? '' : val.qty_product}</td>
                    <td style={{ textAlign: "center", backgroundColor: "#33CCFF" }} >{rec_time === 'Invalid date' ? '' : rec_time}</td>
                    <td style={{ textAlign: "center", backgroundColor: "#33CCFF" }} >{exit_time === 'Invalid date' ? '' : exit_time}</td>
                    <td style={{ textAlign: "center", backgroundColor: "#32CD32" }} >{finish_time === 'Invalid date' ? '' : finish_time}</td>
                    <td style={{ textAlign: "center", backgroundColor: "#FFFF00" }} >{result === 'NaN ชั่วโมง NaN นาที' ? '' : result}</td>
                    <td style={{ textAlign: "center" }} >{val.car_license}</td>
                    <td style={{ textAlign: "center" }} >{val.car_type}</td>
                    <td style={{ textAlign: "center" }} >{val.mess_code}</td>
                    <td style={{ textAlign: "center" }} >{val.cause_name === null ? '' : val.cause_name}</td>
                    <td style={{ textAlign: "center" }} >{val.remark}</td>
                </tr>
            )
        }, this)
        this.setState({
            dataTable: arrShowData,
            status: !this.state.status
        }, () => { this.showData() });
    }

    render() {
        return (
            <div>
                <bs4.Container className="bgContainer-White" fluid>
                    <div style={{ textAlign: "left", fontSize: "22px", fontWeight: "800" }} >รายงานแสดงข้อมูลรอบรถ</div>
                    <bs4.Row>
                        <bs4.Col xs="3" >
                            <bs4.FormGroup row>
                                <bs4.Label style={{ fontWeight: "600", fontSize: "16px", margin: "10px 20px 0px 20px" }} >วันที่เริ่มต้น</bs4.Label>
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
                                <bs4.Label style={{ fontWeight: "600", fontSize: "16px", margin: "10px 20px 0px 20px" }} >วันที่สิ้นสุด</bs4.Label>
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
                            <bs4.Button color="info" onClick={() => { this.getReport('', '', '') }} > <MdIcon.MdSearch className="iconlg" /> SEARCH</bs4.Button>
                        </bs4.Col>
                    </bs4.Row>
                    <bs4.Row>
                        <bs4.Col>
                            <Workbook filename={this.state.file_name + '.xlsx'} element={<bs4.Button color='success' outline style={{ fontSize: "15px", fontWeight: "600" }}>EXCEL</bs4.Button>} >
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
                                <bs4.Button color='danger' outline style={{ fontSize: "15px", fontWeight: "600" }} onClick={this.printPDF}>PDF</bs4.Button>&nbsp;
                                {/* <Button outline onClick={this.ReactToPrint}>PRINT</Button>&nbsp; */}
                            <ReactToPrint
                                trigger={() => <bs4.Button color='primary' outline style={{ fontSize: "15px", fontWeight: "600" }} href='#'>PRINT</bs4.Button>}
                                content={() => this.componentRef}
                            />
                            <div hidden>{this.state.showTable}</div>&nbsp;
                                <bs4.Button color='warning' style={{ fontSize: "15px", fontWeight: "600" }} onClick={this.editReport} >EDIT</bs4.Button>

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
                            <thead style={{ backgroundColor: "#17a2b8", whiteSpace: "nowrap" }} >
                                <td style={{ textAlign: "center" }}>ลำดับ</td>
                                <td style={{ width: '15%', textAlign: "center" }}>วันที่<MdIcon.MdUnfoldMore className="iconlg" onClick={() => this.sortBy('start_date')} /></td>
                                <td style={{ width: '15%', textAlign: "center" }} >สถานที่รับสินค้า<MdIcon.MdUnfoldMore className="iconlg" onClick={() => this.sortBy('start_point')} /><br />(ต้นทาง)</td>
                                <td style={{ width: '15%', textAlign: "center" }} >สถานที่ส่งสินค้า<MdIcon.MdUnfoldMore className="iconlg" onClick={() => this.sortBy('end_point')} /><br />(ปลายทาง)</td>
                                <td style={{ textAlign: "center", backgroundColor: "#FFA500" }} >จำนวนสินค้า<MdIcon.MdUnfoldMore className="iconlg" onClick={() => this.sortBy('qty_product')} /><br />(พาเลท)</td>
                                <td style={{ textAlign: "center", backgroundColor: "#33CCFF" }} >เวลาเข้ารับสินค้า<MdIcon.MdUnfoldMore className="iconlg" onClick={() => this.sortBy('rec_time')} /></td>
                                <td style={{ textAlign: "center", backgroundColor: "#33CCFF" }} >เวลาออก<MdIcon.MdUnfoldMore className="iconlg" onClick={() => this.sortBy('exit_time')} /></td>
                                <td style={{ textAlign: "center", backgroundColor: "#32CD32" }} >เวลาถึง<MdIcon.MdUnfoldMore className="iconlg" onClick={() => this.sortBy('finish_time')} /></td>
                                <td style={{ textAlign: "center", backgroundColor: "#FFFF00" }} >เวลาเดินทาง</td>
                                <td style={{ textAlign: "center" }} >ทะเบียนรถ<MdIcon.MdUnfoldMore className="iconlg" onClick={() => this.sortBy('car_license')} /></td>
                                <td style={{ textAlign: "center" }} >ประเภทรถ<MdIcon.MdUnfoldMore className="iconlg" onClick={() => this.sortBy('car_type')} /></td>
                                <td style={{ width: '15%' ,textAlign: "center" }} >ชื่อผู้ขับ<MdIcon.MdUnfoldMore className="iconlg" onClick={() => this.sortBy('mess_code')} /></td>
                                <td style={{ textAlign: "center" }} >สาเหตุของปัญหา<MdIcon.MdUnfoldMore className="iconlg" onClick={() => this.sortBy('cause_id')} /></td>
                                <td style={{ width: '20%', textAlign: "center" }} >หมายเหตุ<MdIcon.MdUnfoldMore className="iconlg" onClick={() => this.sortBy('remark')} /></td>
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