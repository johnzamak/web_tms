import React, { Component } from 'react';
import Tracking_status from "../components/Report/Tracking_status"
import Tracking_status_Claim from "../components/Report/Tracking_status_Claim"
import Clearcashbycleardate from "../components/Report/Clearcashbycleardate"
import Form_accounting from "../components/Report/Form_accounting"
import { connect } from 'react-redux'
import Tracking_status_surach from '../components/Report/Tracking_status_surach';
import Report_Timeable from '../components/Report/report_Timable';
import Editreport_Timeable from '../components/Report/Editreport_Timable';


const moment = require("moment")

class Report extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data_send: [],
            date_start: moment().format("YYYY-MM-DD"),
            date_end: moment().format("YYYY-MM-DD"),
            first_data: true,
        }
    }

    render() {
        const { checkReport } = this.props.params
        return (
            <div  >
                {(checkReport == "tracking-status") ? <Tracking_status first_data={this.state.first_data} /> : ""}
                {(checkReport == "tracking-status-claim") ? <Tracking_status_Claim first_data={this.state.first_data} /> : ""}
                {(checkReport == "tracking-surach") ? <Tracking_status_surach first_data={this.state.first_data} /> : ""}
                {(checkReport == "clearcashbycleardate") ? <Clearcashbycleardate /> : ""}
                {(checkReport == "formaccounting") ? <Form_accounting /> : ""}
                {(checkReport == "accounting-surach") ? <Form_accounting data_hub={{location:"surach"}} /> : ""}
                {(checkReport == "report_Timeable") ? <Report_Timeable /> : ""}
                {(checkReport == "Editreport_Timeable") ? <Editreport_Timeable /> : ""}
            </div>
        );
    }
}
function mapStateToProps(state) {
    console.log(state)
    return state
}


export default connect(mapStateToProps)(Report)