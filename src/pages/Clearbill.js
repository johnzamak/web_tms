import React, { Component } from 'react';
import Clearbills from "../components/Clearbill/Clearbill"
import Clearbill_Claim from "../components/Clearbill/Clearbill_Claim"
import Clearbill_Kerry_DHL from "../components/Clearbill/Clearbill_Kerry_DHL"
import Clearbill_Surach_Kerry_DHL from '../components/Clearbill/Clearbill_Surach_Kerry_DHL';

class Clearbill extends Component {
    render() {
        const { checkClearBill }=this.props.params
        return (
            <div className="bgBackGround" style={{ padding: "10px 10px 10px 10px" }} >
                { (checkClearBill==="order")?<Clearbills />:"" }
                { (checkClearBill==="claim")?<Clearbill_Claim />:"" }
                { (checkClearBill==="kerry_dhl")?<Clearbill_Kerry_DHL />:"" }
                { (checkClearBill==="surach")?<Clearbill_Surach_Kerry_DHL />:"" }
            </div>
        );
    }
}

export default Clearbill;