import React, { Component } from 'react';
import * as bs4 from "reactstrap"
import * as MdIcon from 'react-icons/lib/md'

class Alert_Box extends Component {
    constructor(props) {
        super(props);
        this.state = {
          modal: false
        };
        this.toggle = this.toggle.bind(this);
      }
    
      toggle() {
        this.setState({
          modal: !this.state.modal
        });
      }
      componentWillReceiveProps(nextProps){
          console.log("nextProps",nextProps)
          this.setState({modal:nextProps.alertOpen})
      }
    render() {
        return (
            <div>
                <bs4.Button color="danger" onClick={this.toggle}>{this.props.buttonLabel}</bs4.Button>
                <bs4.Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                    <bs4.ModalHeader toggle={this.toggle}>Modal title</bs4.ModalHeader>
                    <bs4.ModalBody>
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          </bs4.ModalBody>
                    <bs4.ModalFooter>
                        <bs4.Button color="secondary" onClick={this.toggle}>Cancel</bs4.Button>
                    </bs4.ModalFooter>
                </bs4.Modal>
            </div>
        );
    }
}

export default Alert_Box;