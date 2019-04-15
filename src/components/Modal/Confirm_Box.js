import React, { Component } from 'react';
import * as bs4 from "reactstrap"

class Confirm_Box extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            inProps: {
                modalHeader: "TMS System message.",
                modalBody: "กรุณายืนยันการทำรายการ",
            },
        };
        this.toggle = this.toggle.bind(this);
    }

    toggle() {
        this.setState({
            modal: !this.state.modal
        });
    }
    onClick_ok=()=>{
        this.props.checkStat(true)
        this.setState({
            modal: !this.state.modal
        });
    }
    componentWillReceiveProps(nextProps) {
        console.log("nextProps", nextProps)
        this.setState({ modal: nextProps.confirmOpen })
    }
    render() {
        return (
            <div>
                <bs4.Modal backdrop="static" isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                    <bs4.ModalHeader toggle={this.toggle}>{this.state.inProps.modalHeader}</bs4.ModalHeader>
                    <bs4.ModalBody>
                        {this.state.inProps.modalBody}
                    </bs4.ModalBody>
                    <bs4.ModalFooter>
                        <bs4.Button style={{width:"100px"}} color="success" onClick={this.onClick_ok}>OK</bs4.Button>
                        <bs4.Button style={{width:"100px"}} color="danger" onClick={this.toggle}>Cancel</bs4.Button>
                    </bs4.ModalFooter>
                </bs4.Modal>
            </div>
        );
    }
}

export default Confirm_Box;