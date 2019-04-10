import React, { Component } from 'react';
import Calendar from "../components/Timeable/Calendar"
import AddTimeable from "../components/Timeable/AddTimeable"
import EditTimeable from '../components/Timeable/EditTimeable'

class Timeable extends Component {
    render() {
        const { checkTimeable }=this.props.params
        return (
            <div className="bgBackGround" style={{ padding: "10px 10px 10px 10px" }} >
                { (checkTimeable==="calendar")?<Calendar />:"" }
                { (checkTimeable==="addTimeable")?<AddTimeable />:"" }
                { (checkTimeable==="editTimeable")?<EditTimeable />:"" }
            </div>
        );
    }
}

export default Timeable;