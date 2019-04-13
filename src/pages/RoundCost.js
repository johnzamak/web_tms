import React, { Component } from 'react';
import ImportShipCost from "../components/RoundCost/ImportShipCost"
import ClearRoundCost from "../components/RoundCost/ClearRoundCost"

class RoundCost extends Component {
    render() {
        const { checkRoundCost } = this.props.params
        return (
            <div>
                {(checkRoundCost == "import-ship-cost") ? <ImportShipCost /> : ""}
                {(checkRoundCost == "clear-cost") ? <ClearRoundCost /> : ""}
            </div>
        );
    }
}

export default RoundCost;