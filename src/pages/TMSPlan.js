import React, { Component } from 'react';
import Transport_plan from "../components/TMSPlan/Transport-plan"


class TMSPlan extends Component {
    render() {
        const { checkTmsplan }=this.props.params
        return (
            <div className="bgBackGround" style={{ padding: "10px 10px 10px 10px" }} >
                { (checkTmsplan==="transport-plan")?<Transport_plan />:"" }
            </div>
        );
    }
}

export default TMSPlan;