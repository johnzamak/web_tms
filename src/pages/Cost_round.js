import React, { Component } from 'react';
import Cashvan from '../components/cost-round/Cashvan'
import Dealer from '../components/cost-round/Dealer';
import Yearly from '../components/cost-round/Yearly';
import ImportShipCost from '../components/cost-round/ImportShipCost';

class Cost_round extends Component {
    render() {
        const { checkCost }=this.props.params
        return (
            <div className="bgBackGround" style={{ padding: "10px 10px 10px 10px" }} >
                { (checkCost==="cashvan")?<Cashvan />:"" }
                { (checkCost==="dealer")?<Dealer />:"" }
                { (checkCost==="yearly")?<Yearly />:"" }
                {(checkCost == "import-ship-cost") ? <ImportShipCost /> : ""}
            </div>
        );
    }
}

export default Cost_round;