import React, { Component } from 'react';
import * as bs4 from "reactstrap"
import * as MdIcon from 'react-icons/lib/md'
import { connect } from 'react-redux'
import { is_loader } from '../../actions'
import * as XLSX from 'xlsx';
import {public_function} from "../../service"
var rABS = true;

class ImportShipCost extends Component {
    _handleChangeImport = (e) => {
        const file = e.target.files[0]
        var reader = new FileReader();
        this._setDataFileImport(file, reader)
    }
    _setDataFileImport(files, reader) {
        reader.onload = function (e) {
            var data = e.target.result;
            if (!rABS) data = new Uint8Array(data);
            var workbook = XLSX.read(data, { type: rABS ? 'binary' : 'array' });
            const ref=workbook.Sheets.Sheet1["!ref"].split(":")
            const firstCol=public_function.split_number_from_string(ref[0])[0]
            const firstRow=parseInt(public_function.split_number_from_string(ref[0])[1])
            const lastCol=public_function.split_number_from_string(ref[1])[0]
            const lastRow=parseInt(public_function.split_number_from_string(ref[1])[1])
            const sheetNames=workbook.SheetNames[0]
            var arrData=[]
            for(var indexCol=firstCol.charCodeAt(0);indexCol<=lastCol.charCodeAt(0);indexCol++){
                console.log("object",String.fromCharCode(indexCol));
                arrData.push(String.fromCharCode(indexCol))
                for(var indexRow=(firstRow+1);indexRow<=lastRow;indexRow++){
                    console.log("arrData",arrData)
                    arrData[String.fromCharCode(indexCol)].push(workbook.Sheets[sheetNames][String.fromCharCode(indexCol)+indexRow].v)
                }
            }
            console.log("indexRow",arrData);
            console.log("workbook",workbook)
            // console.log("check",firstLine)
            const dataSheet = Object.values(workbook.Sheets[sheetNames])
            console.log("dataSheet",dataSheet);
            // public_function.split_number_from_string(workbook.Sheets.Sheet1)
        }
        if (rABS) reader.readAsBinaryString(files); else reader.readAsArrayBuffer(files);
    }
    render() {
        return (
            <div>
                <div className="bgBackGround" style={{ padding: "10px 10px 10px 10px" }}>
                    <bs4.Container className="bgContainer-White" fluid>
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

export default ImportShipCost;