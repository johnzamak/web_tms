import React, { Component } from 'react'
import Orderlist from '../components/Order/Orderlist'
import { connect } from 'react-redux'
import { load_product_by_sell } from '../actions'
import Productlist from '../components/Product/Productlist'
import * as bs4 from 'reactstrap'
import * as MdIcon from 'react-icons/lib/md'

class POSMain extends Component {
    componentDidMount() {
        this.props.dispatch(load_product_by_sell())
    }
    componentWillReceiveProps(nextProps){
        console.log("POSMain",nextProps)
    }

    render() {
        return (
            <div>
                <bs4.Container fluid >
                    <bs4.Row>
                        <bs4.Col sm="8">
                            <div style={{ width: "100%", margin: "10px 10px 10px 10px" }} >
                                <bs4.Breadcrumb>
                                    <bs4.BreadcrumbItem>
                                        <bs4.InputGroup>
                                            <bs4.Input style={{ width: "500px" }} type="search" placeholder="ค้นหาสินค้า เช่น iph6, tguc" />
                                            <bs4.InputGroupAddon >
                                                <bs4.Button color="info" ><MdIcon.MdSearch className="iconlg" /></bs4.Button>
                                            </bs4.InputGroupAddon>
                                        </bs4.InputGroup>
                                    </bs4.BreadcrumbItem>
                                </bs4.Breadcrumb>
                            </div>
                            {/* <Productlist data={users.data} /> */}
                        </bs4.Col>
                        <bs4.Col sm="4">
                            {/* <Orderlist /> */}
                        </bs4.Col>
                    </bs4.Row>
                </bs4.Container>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return state.product
}


export default connect(mapStateToProps)(POSMain)