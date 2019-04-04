import React, { Component } from 'react';
import ImportShipCost from "../components/RoundCost/ImportShipCost"

class RoundCost extends Component {
    render() {
        const { checkRoundCost } = this.props.params
        return (
            <div>
                {(checkRoundCost == "import-ship-cost") ? <ImportShipCost /> : ""}
            </div>
        );
    }
}

export default RoundCost;