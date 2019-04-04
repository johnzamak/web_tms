import React, { Component } from 'react';
import Monitor1 from '../components/monitor1/monitor1'
import Monitor2 from '../components/monitor2/monitor2';
import Monitor3 from '../components/monitor3/monitor3';

class Monitor extends Component {
    render() {
        const { checkMonitor }=this.props.params
        console.log('checkMonitor',checkMonitor)
        return (
            <div className="bgBackGround" style={{ padding: "10px 10px 10px 10px" }} >
                { (checkMonitor==="monitor1")?<Monitor1 />:"" }
                { (checkMonitor==="monitor2")?<Monitor2 />:"" }
                { (checkMonitor==="monitor3")?<Monitor3 />:"" }
            </div>
        );
    }
}

export default Monitor;