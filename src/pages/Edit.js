import React, { Component } from 'react';
import Change_Mess from "../components/Edit/Change_Mess"
import Work_loop from "../components/Edit/Work_loop"

class Edit extends Component {
    render() {
        const { checkEdit }=this.props.params
        return (
            <div className="bgBackGround" style={{ padding: "10px 10px 10px 10px" }} >
                { (checkEdit==="change-messenger")?<Change_Mess />:"" }
                { (checkEdit==="work-loop")?<Work_loop />:"" }
            </div>
        );
    }
}

export default Edit;