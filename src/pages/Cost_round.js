import React, { Component } from 'react';
import Cashvan from '../components/cost-round/Cashvan'
import Dealer from '../components/cost-round/Dealer';
import Yearly from '../components/cost-round/Yearly';

class Cost_round extends Component {
    render() {
        const { checkCost }=this.props.params
        return (
            <div className="bgBackGround" style={{ padding: "10px 10px 10px 10px" }} >
                { (checkCost==="cashvan")?<Cashvan />:"" }
                { (checkCost==="dealer")?<Dealer />:"" }
                { (checkCost==="yearly")?<Yearly />:"" }
            </div>
        );
    }
}

export default Cost_round;