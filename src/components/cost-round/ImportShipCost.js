import React, { Component } from 'react';
import * as bs4 from "reactstrap"
import * as MdIcon from 'react-icons/lib/md'
import { connect } from 'react-redux'
import { is_loader } from '../../actions'
import { public_function } from "../../service"
import * as XLSX from 'xlsx';
var rABS = true;
const { proxy } = require("../../service")

class ImportShipCost extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showTblBefore: "",
            showTblAfter:"",
            dataSend: []
        }
    }
    _handleChangeImport = (e) => {
        const file = e.target.files[0]
        var reader = new FileReader();
        this._setDataFileImport(this, file, reader)
    }
    async _setDataFileImport(self, file, reader) {
        let setDataFile = await get_data_from_excel(file, reader, XLSX, rABS)

        self.setState({
            dataSend: setDataFile
        }, () => {
            console.log("res", self.state.dataSend);
            self._setDataTable(self,"before",self.state.dataSend)
        })
    }
    _setDataTable(self,checkTbl,result) {
        var getData=result
        var getKeys, tHead = [], tBody = [], getTD = [], tbl = []

        getData.forEach((val, index) => {
            if (index == 0) {
                getKeys = Object.keys(val)
                console.log(val)
                for (var i = getKeys.length; i > 0; i--) {
                    tHead.push(<th>{getKeys[i - 1]}</th>)
                }
            }
            getTD = []
            for (var i = getKeys.length; i > 0; i--) {
                getTD.push(<td> {val[getKeys[i - 1]]} </td>)
            }
            tBody.push(
                <tr>
                    {getTD}
                </tr>
            )
        });
        tbl.push(
            <bs4.Table>
                <thead>
                    {tHead}
                </thead>
                <tbody>
                    {tBody}
                </tbody>
            </bs4.Table>
        )
        switch(checkTbl){
            case "before": self.setState({ showTblBefore: tbl });break;
            case "after": self.setState({ showTblAfter: tbl });break;
        }
        
    }
    _callAPI=()=> {
        this.props.dispatch(is_loader(true))
        var url = proxy.main + "import/excel-round-mess/"
        fetch(url, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json;charset=utf-8"
            },
            body: JSON.stringify(this.state.dataSend)
        })
        .then(response => response.json())
        .then((responseJson) => {
            this.props.dispatch(is_loader(false))
            console.log("responseJson", responseJson)
            if(responseJson.status===200){
                alert("บันทึกข้อมูลเรียบร้อยแล้ว")
                this._setDataTable(this,"after",responseJson.result)
            }else{
                alert("ไม่สามารถบันทึกข้อมูลได้ กรุณาลองใหม่")
            }
        })
        .catch((error) => {
            this.props.dispatch(is_loader(false))
            console.log("err",error)
        })
    }
    render() {
        return (
            <div>
                <div className="bgBackGround" style={{ padding: "10px 10px 10px 10px" }}>
                    <bs4.Container className="bgContainer-White" fluid>
                        <h4>Import Data</h4>
                        <bs4.Row>
                            <bs4.Col xs="4" >
                                <bs4.FormGroup row>
                                    <div style={{ marginTop: "10px", marginLeft: "20px" }} >
                                        <bs4.CustomInput type="file" name="file" id="exampleFile" label="กรุณาเลือกไฟล์" onChange={this._handleChangeImport} />
                                    </div>
                                </bs4.FormGroup>
                            </bs4.Col>
                            <bs4.Col xs="2" >
                                <bs4.Button style={{ marginTop: "8px" }} id="btnSearch" color="info" onClick={this._callAPI} > <MdIcon.MdImportExport className="iconlg" /> Import</bs4.Button>
                            </bs4.Col>
                        </bs4.Row>

                        <bs4.Row>
                            <bs4.Col xs="6">
                                {this.state.showTblBefore}
                            </bs4.Col>
                            <bs4.Col xs="6">
                                {this.state.showTblAfter}
                            </bs4.Col>
                        </bs4.Row>
                    </bs4.Container>
                </div>
            </div>
        );
    }
}

function get_data_from_excel(files, reader) {
    return new Promise((resolve, reject) => {
        reader.onload = function (e) {
            var data = e.target.result;
            if (!rABS) data = new Uint8Array(data);
            var workbook = XLSX.read(data, { type: rABS ? 'binary' : 'array' });
            const ref = workbook.Sheets.Sheet1["!ref"].split(":")
            const firstCol = public_function.split_number_from_string(ref[0])[0]
            const firstRow = parseInt(public_function.split_number_from_string(ref[0])[1])
            const lastCol = public_function.split_number_from_string(ref[1])[0]
            const lastRow = parseInt(public_function.split_number_from_string(ref[1])[1])
            const SheetNames = workbook.SheetNames[0]
            let arrData = []
            var getHead = ""

            for (var headCol = firstCol.charCodeAt(0); headCol <= lastCol.charCodeAt(0); headCol++) {
                for (var dataRow = firstRow; dataRow <= lastRow; dataRow++) {
                    if (dataRow === 1) {
                        getHead = workbook.Sheets[SheetNames][String.fromCharCode(headCol) + dataRow].v
                        // console.log("getHead",getHead)
                    } else {
                        var getData = (typeof workbook.Sheets[SheetNames][String.fromCharCode(headCol) + dataRow] != "undefined") ? workbook.Sheets[SheetNames][String.fromCharCode(headCol) + dataRow].v : 0
                        var newObj = Object.assign({ [getHead]: getData }, arrData[dataRow - 2])
                        arrData.splice(dataRow - 2, 1, newObj)
                        // console.log("object",workbook.Sheets[SheetNames][String.fromCharCode(headCol) + dataRow]);
                        // console.log("object",dataRow,getData,newObj,arrData[dataRow])
                    }
                }
            }
            // console.log("workbook", arrData)
            resolve(arrData)
            // console.log("check",firstLine)
            // const dataSheet = Object.values(workbook.Sheets.Sheet1)
            // console.log("dataSheet",dataSheet);
            // public_function.split_number_from_string(workbook.Sheets.Sheet1)
        }
        if (rABS) reader.readAsBinaryString(files); else reader.readAsArrayBuffer(files);
    })
}
function mapStateToProps(state) {
    return state
}
export default connect(mapStateToProps)(ImportShipCost)