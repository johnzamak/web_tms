import React, { Component } from 'react';
import '../../style/Header.css'
import { Container, Row, Col, NavbarToggler, NavbarBrand, Collapse, Navbar, Nav, NavItem, NavLink, DropdownToggle, UncontrolledDropdown, DropdownMenu, DropdownItem } from 'reactstrap'
import { ScaleLoader } from 'react-spinners'
import { loadState } from '../../localStorage';
import { connect } from 'react-redux'
import Loader from "../Loader/Loader"
var $ = require('jquery')

class Header extends Component {
    constructor(props) {
        super(props)
        this.state = {
            boxMenu: "boxMenu",
            listMenu: "listMenu",
            isToggle: false,
            reportMenu: "reportMenu",
            reportToggle: false,
            isOpen: false,
            isLoading: false
        }
    }
    toggle = () => {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }
    onClickReport = () => {
        this.setState(prevState => ({
            reportToggle: !prevState.reportToggle
        }), () => {
            if (this.state.reportToggle) {
                $(".reportMenu").fadeIn("fast");
                $("#rp_arrow_right").hide();
                $("#rp_arrow_down").show();
            } else {
                $(".reportMenu").fadeOut("fast");
                $("#rp_arrow_right").show();
                $("#rp_arrow_down").hide();
            }
        })
    }
    componentWillReceiveProps(nextProps) {
        this.setState({ isLoading: nextProps.isLoader },()=>{
            if(this.state.isLoading){
                $("#loader").fadeIn()
            }else{
                $("#loader").fadeOut()
            }
        })
    }
    componentWillMount() {
        var check_login = loadState("data_user")
        if (typeof check_login == "undefined") {
            alert("กรุณา Login เข้าสู่ระบบก่อน")
            window.location.href = "/"
        } else {
            this.setState({
                // admin_name: loadState("admindata")[0].admin_name
            })
        }
    }
    render() {
        return (
            <div className="boxHeader">
                <Navbar className="bgHeader" light expand="md">
                    <NavbarBrand href="/" className="logo_header"></NavbarBrand>
                    <div style={{width:"65%"}}>
                        <h5 style={{ color: "#ffffff",float:"left" }} >Track Management System</h5>
                        <span id="loader" style={{ float: "right",marginTop:"-20px",display:"none" }} >
                        <Loader isLoading={this.state.isLoading} />
                        </span>
                    </div>



                    {/* <NavbarToggler onClick={this.toggle} /> */}
                    {/* <Collapse isOpen={this.state.isOpen} navbar>
                        <Nav className="ml-auto" navbar>
                            <NavItem>
                                <NavLink href="/add_product">เพิ่มสินค้า</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink href="/sell_product">ขายสินค้า</NavLink>
                            </NavItem>
                            <UncontrolledDropdown nav inNavbar>
                                <DropdownToggle nav caret>Page Selected</DropdownToggle>
                                <DropdownMenu right>
                                    <DropdownItem>Page 1</DropdownItem>
                                    <DropdownItem>Page 2</DropdownItem>
                                    <DropdownItem divider />
                                    <DropdownItem>Reset</DropdownItem>
                                </DropdownMenu>
                            </UncontrolledDropdown>
                        </Nav>
                    </Collapse> */}

                </Navbar>
            </div >
        );
    }
}
function mapStateToProps(state) {
    return state.loader
}
export default connect(mapStateToProps)(Header);