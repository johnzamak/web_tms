import React, { Component } from 'react';
import Add_Rate from "../components/Rate/Add_Rate"

class Rating extends Component {
    render() {
        const { checkRate,cusCode } = this.props.params
        return (
            <div  >
                {(checkRate == "addRate") ? <Add_Rate customer={cusCode} /> : ""}
            </div>
        );
    }
}

export default Rating;