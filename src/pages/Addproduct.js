import React, { Component } from 'react';
import { connect } from 'react-redux'
import * as bs4 from "reactstrap"
import * as MdIcon from 'react-icons/lib/md'
import { search_product, is_loader, add_product } from '../actions'
import Showproduct from "../components/Addproduct/Showproduct"

var $ = require('jquery')
var data_send = []

class Addproduct extends Component {
    constructor(props) {
        super(props)
        this.state = {
            is_add_stock: true,
            code: "",
            product_name: "",
            product_price: 0,
            product_unit: "",
            product_stock: 0
        }
    }
    componentDidMount() {
        $("input[name='product_stock']").hide()
    }
    componentWillReceiveProps(nextProps) {
        console.log("nextProps", nextProps);
        this.set_data(this, nextProps)
    }
    set_data(self, props) {
        const { isRejected, isLoading, step, data } = props
        if (isRejected === false && isLoading === true) {
            switch (step) {
                case "ADD_PRODUCT_FULFILLED":
                    (data.status) ? this.props.dispatch(search_product(data_send)) : "";
                    break;
                case "LOAD_PRODUCT_BY_ID_FULFILLED":
                    self.props.dispatch(is_loader(false))
                    data.map(val => {
                        self.setState({
                            product_name: val.product_name,
                            product_price: val.product_price,
                            product_unit: val.product_unit,
                            show_product: data[0]
                        })
                    });
                    break;
            }
        } else if (isRejected === true && isLoading === true) {
            self.props.dispatch(is_loader(false))
            self.setState({
                product_name: "",
                product_price: "",
                product_unit: "",
                show_product: "",
            })
        } else {
            self.setState({
                product_name: "",
                product_price: "",
                product_unit: "",
                show_product: "",
            })
        }
    }
    onChange_form = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }
    toggle_add_stock = () => {
        this.setState({
            is_add_stock: !this.state.is_add_stock
        }, () => {
            (this.state.is_add_stock) ? $("input[name='product_stock']").hide() : $("input[name='product_stock']").show()
        })
    }
    onKeyPress_search = (e) => {
        data_send = []
        if (e.key === "Enter") {
            data_send.push(this.state)
            this.props.dispatch(is_loader(true))
            this.props.dispatch(search_product(data_send))
        }
    }
    onClick_save = () => {
        data_send = []
        if (window.confirm("กรุณายืนยันการทำรายการ")) {
            data_send.push(this.state)
            this.props.dispatch(is_loader(true))
            this.props.dispatch(add_product(data_send))
        } else {
            return false
        }
    }
    render() {
        return (
            <div className="bgBackGround">
                <bs4.Container fluid>
                    <bs4.Row>
                        <bs4.Col sm="6">
                            <bs4.Row className="boxContent">
                                <div style={{ width: "100%" }} >
                                    <bs4.Breadcrumb>
                                        <bs4.BreadcrumbItem style={{ width: "95%" }} >
                                            เพิ่มสินค้า
                                </bs4.BreadcrumbItem>
                                    </bs4.Breadcrumb>
                                </div>
                                <div className="boxInContent">
                                    <bs4.FormGroup row>
                                        <bs4.Col sm="12" >
                                            <bs4.InputGroup>
                                                <bs4.Input autoFocus type="text" name="code" onChange={this.onChange_form} placeholder="สแกนบาร์โค้ด" onKeyPress={this.onKeyPress_search} />
                                                <bs4.InputGroupAddon >
                                                    <bs4.Button color="info" ><MdIcon.MdSearch className="iconlg" /></bs4.Button>
                                                </bs4.InputGroupAddon>
                                            </bs4.InputGroup>
                                        </bs4.Col>
                                    </bs4.FormGroup>
                                    <bs4.FormGroup row>
                                        <bs4.Label sm="4">ชื่อสินค้า : </bs4.Label>
                                        <bs4.Col sm="8" >
                                            <bs4.Input type="text" name="product_name" onChange={this.onChange_form} value={this.state.product_name} />
                                        </bs4.Col>
                                    </bs4.FormGroup>
                                    <bs4.FormGroup row>
                                        <bs4.Label sm="4">ราคาต่อหน่วย : </bs4.Label>
                                        <bs4.Col sm="8" >
                                            <bs4.Input type="text" name="product_price" onChange={this.onChange_form} value={this.state.product_price} />
                                        </bs4.Col>
                                    </bs4.FormGroup>
                                    <bs4.FormGroup row>
                                        <bs4.Label sm="4">หน่วย : </bs4.Label>
                                        <bs4.Col sm="8" >
                                            <bs4.Input type="text" name="product_unit" onChange={this.onChange_form} value={this.state.product_unit} />
                                        </bs4.Col>
                                    </bs4.FormGroup>
                                    <bs4.FormGroup row>
                                        <bs4.Label sm="4">เพิ่มจำนวนสต๊อก : <MdIcon.MdImportExport className="iconlg" onClick={this.toggle_add_stock} /></bs4.Label>
                                        <bs4.Col sm="8" >
                                            <bs4.Input type="text" name="product_stock" onChange={this.onChange_form} value={this.state.product_stock} />
                                        </bs4.Col>
                                    </bs4.FormGroup>
                                    <bs4.FormGroup row>
                                        <bs4.Col sm="12" >
                                            <bs4.Button color="success" onClick={this.onClick_save} className="btnLong" ><MdIcon.MdSave className="iconlg" />บันทึก</bs4.Button>
                                        </bs4.Col>
                                    </bs4.FormGroup>
                                </div>
                            </bs4.Row>
                        </bs4.Col>
                        <bs4.Col sm="6">
                            <bs4.Row className="boxContent">
                                <div style={{ width: "100%" }} >
                                    <bs4.Breadcrumb>
                                        <bs4.BreadcrumbItem style={{ width: "95%" }} >
                                            แสดงสินค้า
                                </bs4.BreadcrumbItem>
                                    </bs4.Breadcrumb>
                                </div>
                                <div className="boxInContent">
                                    <Showproduct data={this.state.show_product} />
                                </div>
                            </bs4.Row>
                        </bs4.Col>
                    </bs4.Row>
                </bs4.Container>
            </div>
        );
    }
}
function mapStateToProps(state) {
    return state.product
}

export default connect(mapStateToProps)(Addproduct)