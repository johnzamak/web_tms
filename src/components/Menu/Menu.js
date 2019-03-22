import React, { Component } from 'react';
import * as bs4 from "reactstrap"
import * as MdIcon from 'react-icons/lib/md'

class Menu extends Component {
    render() {
        return (
            <div>
                <bs4.Navbar color="light" light expand="md">
                    <bs4.NavbarToggler />
                    <bs4.Nav className="ml-auto" navbar>
                        <bs4.UncontrolledDropdown nav inNavbar>
                            <bs4.DropdownToggle style={{ fontWeight: "800" }} nav caret>
                            รอบรถบริษัท
                            </bs4.DropdownToggle>
                            <bs4.DropdownMenu right>
                                <bs4.DropdownItem href="/timeable/calendar" >
                                    ปฎิทินรอบรถบริษัท
                                </bs4.DropdownItem>
                                <bs4.DropdownItem href="/timeable/addTimeable" >
                                    กรอกข้อมูลรอบรถบริษัท
                                </bs4.DropdownItem>
                            </bs4.DropdownMenu>
                        </bs4.UncontrolledDropdown>
                    
                        <bs4.NavItem>
                            <bs4.NavLink href="/speceialtask" style={{ fontWeight: "800" }} >สร้างงานพิเศษ</bs4.NavLink>
                        </bs4.NavItem>
 
                        <bs4.UncontrolledDropdown nav inNavbar>
                            <bs4.DropdownToggle style={{ fontWeight: "800" }} nav caret>
                            เคลียร์บิล
                            </bs4.DropdownToggle>
                            <bs4.DropdownMenu right>
                                <bs4.DropdownItem href="/clearbill/order" >
                                    งานปกติ
                                </bs4.DropdownItem>
                                <bs4.DropdownItem href="/clearbill/claim" >
                                    งานเคลม
                                </bs4.DropdownItem>
                                <bs4.DropdownItem href="/clearbill/kerry_dhl" >
                                    งาน Kerry DHL
                                </bs4.DropdownItem>
                            </bs4.DropdownMenu>
                        </bs4.UncontrolledDropdown>

                        <bs4.UncontrolledDropdown nav inNavbar>
                            <bs4.DropdownToggle style={{ fontWeight: "800" }} nav caret>
                            รายงานทั้งหมด
                            </bs4.DropdownToggle>
                            <bs4.DropdownMenu right>
                                <bs4.DropdownItem href="/report/tracking-status" >
                                    รายงานติดตามสถานะ-งานปกติ
                                </bs4.DropdownItem>
                                <bs4.DropdownItem href="/report/tracking-status-claim" >
                                    รายงานติดตามสถานะ-งานเคลม
                                </bs4.DropdownItem>
                                <bs4.DropdownItem href="/report/clearcashbycleardate" >
                                    รายงานโอนเงินตามวันที่เคลียร์
                                </bs4.DropdownItem>
                                <bs4.DropdownItem href="/report/formaccounting" >
                                    รายงานส่งบัญชี
                                </bs4.DropdownItem>
                                <bs4.DropdownItem href="/report/report_Timeable" >
                                    รายงานแสดงข้อมูลรอบรถ
                                </bs4.DropdownItem>
                            </bs4.DropdownMenu>
                        </bs4.UncontrolledDropdown>

                        <bs4.UncontrolledDropdown nav inNavbar>
                            <bs4.DropdownToggle style={{ fontWeight: "800" }} nav caret>
                            แก้ไขงาน
                            </bs4.DropdownToggle>
                            <bs4.DropdownMenu right>
                                <bs4.DropdownItem href="/edit/change-messenger" >
                                    เปลี่ยนพนักงานจัดส่ง
                                </bs4.DropdownItem>
                                <bs4.DropdownItem href="/edit/work-loop" >
                                    งานวน ส่งใหม่
                                </bs4.DropdownItem>
                            </bs4.DropdownMenu>
                        </bs4.UncontrolledDropdown>

                        <bs4.UncontrolledDropdown nav inNavbar>
                            <bs4.DropdownToggle style={{ fontWeight: "800" }} nav caret>
                            HUB สุราษฎร์
                            </bs4.DropdownToggle>
                            <bs4.DropdownMenu right>
                                <bs4.DropdownItem href="/report/tracking-surach" >
                                    รายงานติดตามสถานะ
                                </bs4.DropdownItem>
                                <bs4.DropdownItem href="/clearbill/surach" >
                                    เคลียร์บิล
                                </bs4.DropdownItem>
                                <bs4.DropdownItem href="/report/accounting-surach" >
                                    รายงานส่งบัญชี
                                </bs4.DropdownItem>
                            </bs4.DropdownMenu>
                        </bs4.UncontrolledDropdown>

                    </bs4.Nav>
                </bs4.Navbar>
            </div>
        );
    }
}

export default Menu;