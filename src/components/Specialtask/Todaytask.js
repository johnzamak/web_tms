import React, { Component } from 'react';
import * as bs4 from "reactstrap"
import * as MdIcon from 'react-icons/lib/md'
var QRCode = require('qrcode.react');
const { proxy } = require("../../service")
var $ = require("jquery")
const moment = require("moment")

class Todaytask extends Component {
    constructor(props){
        super(props)
        this.state={
            date_start:"2018-12-12",
            date_end:"2018-12-12"
        }
    }
    showQR=(qrID,zoomID)=>{
        if(this.state[qrID]){
            this.setState({
                [qrID]:false,
                [zoomID]:true
            },()=>{
                $('#'+qrID).hide()
                $('#'+zoomID).show()
            })
        }else{
            this.setState({
                [qrID]:true,
                [zoomID]:false
            },()=>{
                $('#'+qrID).show()
                $('#'+zoomID).hide()
            })
        }
    }
    componentDidMount() {
        this.get_tsc_today(this)
    }
    get_tsc_today(self) {
        let date_start=self.state.date_start
        let date_end=self.state.date_end
        let url = proxy.main + "special-circles/get-today-task/" + date_start + "&" + date_end
        fetch(url)
            .then(response => response.json())
            .then((responseJson) => {
                console.log("responseJson",responseJson)
                let arr_data=[],mdStatus="",qrcode_value="",trColor=""
                if(responseJson.status===200){
                    responseJson.result.forEach((val,i) => {
                        qrcode_value="::"+val.tsc_document
                        switch(val.status){
                            case 0:mdStatus=<MdIcon.MdUpdate className="iconlg"  />;trColor="";break;
                            case 3:mdStatus=<MdIcon.MdMoveToInbox className="iconlg" />;trColor="";break;
                            case 4:mdStatus=<MdIcon.MdLocalShipping className="iconlg"  />;trColor="#FED669";break;
                            case 10:mdStatus=<MdIcon.MdCheckCircle className="iconlg" />;trColor="#B2FF5A";break;
                        }
                        arr_data.push(
                            <tr style={{backgroundColor:{trColor}}} >
                                <th style={{textAlign:"center",whiteSpace:"nowrap"}} >
                                <MdIcon.MdZoomIn id={"zoom"+i} className="iconlg" onClick={()=>{self.showQR("qrcode"+i,"zoom"+i)}} />
                                <QRCode onClick={()=>{self.showQR("qrcode"+i,"zoom"+i)}} style={{ display: 'none',cursor:"pointer"}} id={"qrcode"+i} level="M" size="100" value={qrcode_value} /></th>
                                <th style={{textAlign:"center",whiteSpace:"nowrap"}}>{val.receive_from}</th>
                                <th style={{textAlign:"center",whiteSpace:"nowrap"}}>{val.receive_date}</th>
                                <th style={{textAlign:"center",whiteSpace:"nowrap"}}>{val.receive_time_first}</th>
                                <th style={{textAlign:"center",whiteSpace:"nowrap"}}>{val.user_request_tel}</th>
                                <th style={{textAlign:"center",whiteSpace:"nowrap"}}>{val.send_to}</th>
                                <th style={{textAlign:"center",whiteSpace:"nowrap"}}>{val.send_date}</th>
                                <th style={{textAlign:"center",whiteSpace:"nowrap"}}>{val.send_time_first}</th>
                                <th style={{textAlign:"center",whiteSpace:"nowrap"}}>{val.send_tel}</th>
                                <th style={{textAlign:"center",whiteSpace:"nowrap"}}>{val.work_type}</th>
                                <th style={{textAlign:"center",whiteSpace:"nowrap"}}>{val.comment}</th>
                                <th style={{textAlign:"center",whiteSpace:"nowrap"}}>{mdStatus}</th>
                                <th style={{textAlign:"center",whiteSpace:"nowrap"}}>{val.messenger_name}</th>
                                <th style={{textAlign:"center",whiteSpace:"nowrap"}}>{""}</th>
                                <th style={{textAlign:"center",whiteSpace:"nowrap"}}><MdIcon.MdDelete style={{ color: "red" }} className="iconlg" /></th>
                            </tr>
                        )
                    });
                    self.setState({ showTbl:arr_data })
                }
            })
    }
    qrcode_toggle=()=>{
        
    }
    render() {
        return (
            <div>
                <bs4.Container fluid>
                    <bs4.Row>
                        <bs4.Table>
                            <tr style={{backgroundColor:"#D5D8DC"}} >
                                <th>QRCode</th>
                                <th>รับของจาก</th>
                                <th>วันที่</th>
                                <th>เวลา</th>
                                <th>เบอร์โทร.</th>
                                <th>ไปส่งของที่</th>
                                <th>วันที่</th>
                                <th>เวลา</th>
                                <th>เบอร์โทร.</th>
                                <th>ประเภท</th>
                                <th>หมายเหตุ</th>
                                <th>สถานะ</th>
                                <th>ผู้ส่ง</th>
                                <th>ผู้รับ</th>
                                <th>ยกเลิกงาน</th>
                            </tr>
                            {this.state.showTbl}
                        </bs4.Table>
                    </bs4.Row>
                </bs4.Container>
            </div>
        );
    }
}

export default Todaytask;