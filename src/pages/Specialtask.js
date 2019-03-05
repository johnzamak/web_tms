import React, { Component } from 'react';
import * as bs4 from "reactstrap"
import * as MdIcon from 'react-icons/lib/md'
import classnames from 'classnames';
import Addtask from "../components/Specialtask/Addtask"
import Todaytask from "../components/Specialtask/Todaytask"
import Overtask from "../components/Specialtask/Overtask"

class Specialtask extends Component {
    constructor(props) {
        super(props)
        this.state = {
            tabActive: "1",
        }
    }
    toggle = (tab) => {
        if (this.state.tabActive !== tab) {
            this.setState({
                tabActive: tab
            })
        }
    }
    render() {
        return (
            <div className="bgBackGround">
            <br/>
                <bs4.Container fluid  >
                    <bs4.Row className="boxContent">
                        <div style={{ width: "100%" }} >
                            <bs4.Breadcrumb>
                                <bs4.BreadcrumbItem>
                                    รอบงานพิเศษ
                                </bs4.BreadcrumbItem>
                            </bs4.Breadcrumb>
                        </div>
                        <div className="boxInContent">
                            <bs4.Nav tabs>
                                <bs4.NavItem>
                                    <bs4.NavLink
                                        className={classnames({ active: this.state.tabActive === '1' })}
                                        onClick={() => { this.toggle('1'); }}>
                                        ขอรอบพิเศษ
                                    </bs4.NavLink>
                                </bs4.NavItem>
                                <bs4.NavItem>
                                    <bs4.NavLink
                                        className={classnames({ active: this.state.tabActive === '2' })}
                                        onClick={() => { this.toggle('2'); }}>
                                        รอบพิเศษวันนี้
                                    </bs4.NavLink>
                                </bs4.NavItem>
                                <bs4.NavItem>
                                    <bs4.NavLink
                                        className={classnames({ active: this.state.tabActive === '3' })}
                                        onClick={() => { this.toggle('3'); }}>
                                        รอบพิเศษเกินกำหนด
                                    </bs4.NavLink>
                                </bs4.NavItem>
                            </bs4.Nav>
                            <bs4.TabContent style={{ width: "100%" }} activeTab={this.state.tabActive}>
                                <bs4.TabPane tabId="1">
                                    <bs4.Row>
                                        <bs4.Col xs="12">
                                            <Addtask />
                                        </bs4.Col>
                                    </bs4.Row>
                                </bs4.TabPane>
                                <bs4.TabPane tabId="2">
                                    <bs4.Row>
                                        <bs4.Col xs="12">
                                            <Todaytask />
                                        </bs4.Col>
                                    </bs4.Row>
                                </bs4.TabPane>
                                <bs4.TabPane tabId="3">
                                    <bs4.Row>
                                        <bs4.Col xs="12">
                                            <Overtask />
                                        </bs4.Col>
                                    </bs4.Row>
                                </bs4.TabPane>
                            </bs4.TabContent>
                        </div>
                    </bs4.Row>
                </bs4.Container>
            </div>
        );
    }
}

export default Specialtask;