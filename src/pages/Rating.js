import React, { Component } from 'react';
import Add_Rate from "../components/Rate/Add_Rate"
import Already_Rate from "../components/Rate/Already_Rate"

class Rating extends Component {
    render() {
        const { checkRate,cusCode } = this.props.params
        return (
            <div  >
                {(checkRate == "addRate") ? <Add_Rate customer={cusCode} /> : ""}
                {(checkRate == "already_Rate") ? <Already_Rate customer={cusCode} /> : ""}
            </div>
        );
    }
}

export default Rating;