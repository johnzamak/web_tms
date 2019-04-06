import React, { Component } from 'react';
import * as bs4 from "reactstrap"
import * as MdIcon from 'react-icons/lib/md'
import { connect } from 'react-redux'
import { is_loader } from '../../actions'
import { public_function } from "../../service"
import * as XLSX from 'xlsx';
var rABS = true;

class ImportShipCost extends Component {
    _handleChangeImport = (e) => {
        const file = e.target.files[0]
        var reader = new FileReader();
        this._setDataFileImport(this,file, reader)
    }
    async _setDataFileImport(self,file, reader){
        let setDataFile=await get_data_from_excel(file, reader,XLSX,rABS)
        self.setState({
            dataSend:setDataFile
        },()=>{
            console.log("res",self.state.dataSend);
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
                                <bs4.Button style={{ marginTop: "8px" }} id="btnSearch" color="info" onClick={this.onClick_search} > <MdIcon.MdSearch className="iconlg" /> SEARCH</bs4.Button>
                            </bs4.Col>
                        </bs4.Row>
                    </bs4.Container>
                </div>
            </div>
        );
    }
}

function get_data_from_excel(files, reader) {
    return new Promise((resolve,reject)=>{
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
            var getHead=""

            for (var headCol = firstCol.charCodeAt(0); headCol <= lastCol.charCodeAt(0); headCol++) {
                for (var dataRow = firstRow; dataRow <= lastRow; dataRow++) {
                    if (dataRow === 1) {
                        getHead = workbook.Sheets[SheetNames][String.fromCharCode(headCol) + dataRow].v
                        // console.log("getHead",getHead)
                    } else {
                        var getData = workbook.Sheets[SheetNames][String.fromCharCode(headCol) + dataRow].v
                        var newObj = Object.assign({ [getHead]: getData },arrData[dataRow-2])
                        arrData.splice(dataRow-2,1,newObj)
                        // console.log("object",dataRow,getData,newObj,arrData[dataRow])
                    }
                }
            }
            console.log("workbook", arrData)
            resolve(arrData)
            // console.log("check",firstLine)
            // const dataSheet = Object.values(workbook.Sheets.Sheet1)
            // console.log("dataSheet",dataSheet);
            // public_function.split_number_from_string(workbook.Sheets.Sheet1)
        }
        if (rABS) reader.readAsBinaryString(files); else reader.readAsArrayBuffer(files);
    })
}
export default ImportShipCost;