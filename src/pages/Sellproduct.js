import React, { Component } from 'react'
import Orderlist from '../components/Sellproduct/Orderlist'
import { connect } from 'react-redux'
import { load_product_by_sell, is_loader,search_product } from '../actions'
import Productlist from '../components/Sellproduct/Productlist'
import * as bs4 from 'reactstrap'
import * as MdIcon from 'react-icons/lib/md'

var data_send=[]
class Sellproduct extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data_state: [],
            order_list: []
        }
    }
    componentDidMount() {
        this.props.dispatch(is_loader(true))
        this.props.dispatch(load_product_by_sell())
    }
    componentWillReceiveProps(nextProps) {
        // console.log("Sellproduct",nextProps)
        if (typeof nextProps.order!="undefined") {
            this.set_data_orderlist(this, nextProps.order.order_list);
        }else if(nextProps.product.step=="LOAD_PRODUCT_BY_ID_FULFILLED"){
            let modal_data={
                code:nextProps.product.data[0].code,
                product_name:nextProps.product.data[0].product_name,
                product_qty:1,
                product_price:nextProps.product.data[0].product_price,
            }
            this.props.dispatch({ type: "ORDER_PRODUCT", data: modal_data })
        }else if(nextProps.product.step=="LOAD_PRODUCT_BY_SELL_FULFILLED"){
            this.set_data(this, nextProps.product)
        }
    }
    set_data(self, props) {
        const { isRejected, isLoading, step, data } = props
        if (isRejected === false && isLoading === true) {
            switch (step) {
                case "ADD_PRODUCT_FULFILLED":
                    // (data.status) ? this.props.dispatch(search_product(data_send)) : "";
                    break;
                case "LOAD_PRODUCT_BY_SELL_FULFILLED":
                    self.props.dispatch(is_loader(false))
                    data.map(val => {
                        self.setState({
                            data_state: data,
                        })
                    });
                    break;
            }
        } else if (isRejected === true && isLoading === true) {
            self.props.dispatch(is_loader(false))
            self.setState({
                data_state: [],
            })
        } else {
            self.setState({
                data_state: [],
            })
        }
    }
    set_data_orderlist(self, props) {
        self.setState({order_list:[]},()=>{
            self.setState({order_list:props})
        })
    }
    scan_barcode=(e)=>{
        if (e.key === "Enter") {
            // console.log(e.target.value);
            data_send.push({code:4})
            // this.props.dispatch(is_loader(true))
            this.props.dispatch(search_product(data_send))
            // this.props.dispatch({ type: "ORDER_PRODUCT", data: modal_data })
        }
    }
    render() {
        return (
            <div>
                <bs4.Container fluid >
                    <bs4.Row>
                        <bs4.Col sm="12">
                            <div style={{ width: "100%", margin: "10px 10px 10px 10px" }} >
                                <bs4.Breadcrumb>
                                    <bs4.BreadcrumbItem>
                                        <bs4.InputGroup>
                                            <bs4.Input autoFocus style={{ width: "500px" }} onKeyPress={this.scan_barcode} type="search" placeholder="โปรดสแกน barcode สินค้า" />
                                            <bs4.InputGroupAddon >
                                                <bs4.Button color="info" ><MdIcon.MdSearch className="iconlg" /></bs4.Button>
                                            </bs4.InputGroupAddon>
                                        </bs4.InputGroup>
                                    </bs4.BreadcrumbItem>
                                </bs4.Breadcrumb>
                            </div>
                        </bs4.Col>
                    </bs4.Row>
                    <bs4.Row>
                        <bs4.Col sm="6">
                            <Productlist data={this.state.data_state} />
                        </bs4.Col>
                        <bs4.Col sm="6">
                            <Orderlist data={this.state.order_list} />
                        </bs4.Col>
                    </bs4.Row>
                </bs4.Container>
            </div>
        )
    }
}

function mapStateToProps(state) {
    console.log(state)
    if(state.order_product.order_list.length>0){
        return {order: state.order_product}
    }else{
        return { product: state.product }
    }
}


export default connect(mapStateToProps)(Sellproduct)