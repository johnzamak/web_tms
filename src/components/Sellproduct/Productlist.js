import React, { Component } from 'react';
import * as bs4 from 'reactstrap'
import * as MdIcon from 'react-icons/lib/md'
import { connect } from 'react-redux'

var custom_data=0
class Productlist extends Component {
    constructor(props) {
        super(props)
        this.state = {
            max_cols: 4,
            product_lists: [],
            product_data: [],
            add_modal: false,
            product_qty:1,
            qty_product:1
        }
    }
    componentWillReceiveProps(nextProps) {
        this.set_data(this, nextProps)
    }
    select_product = (index) => {
        let modal_data={
            code:this.state.product_data[index].code,
            product_name:this.state.product_data[index].product_name,
            product_qty:this.state.qty_product,
            product_price:this.state.product_data[index].product_price,
        }
        this.props.dispatch({ type: "ORDER_PRODUCT", data: modal_data })
    }
    select_product_custom=()=>{
        custom_data++
        let modal_data={
            code:"CT"+custom_data,
            product_name:this.state.product_name,
            product_qty:this.state.product_qty,
            product_price:this.state.product_price,
        }
        this.props.dispatch({ type: "ORDER_PRODUCT", data: modal_data })
        this.setState({
            add_modal: !this.state.add_modal
        });
    }
    set_data(self, props) {
        var td_data = "", arr_data = []
        const { data } = props
        data.forEach((element, index) => {
            td_data = <td onClick={(e) => this.select_product(index)} className="product-btn">
            <p >{element.product_name}</p>
            </td>
            arr_data.push(td_data)
        });
        self.setState({
             product_lists: arr_data, 
             product_data: data ,
             qty_product:1,
             product_name:"",
             product_price:"",
             product_qty:1
            })
    }
    toggle_modal = () => {
        this.setState({
            add_modal: !this.state.add_modal
        });
    }
    onChange_form=(e)=>{
        this.setState({
            [e.target.name]:e.target.value
        })
    }
    render() {
        return (
            <div className="boxContent">
                <bs4.Breadcrumb>
                    <bs4.Col sm="11" >
                    <bs4.BreadcrumbItem><MdIcon.MdReorder className="iconlg" />
                        รายการสินค้า
                    <bs4.Button color="info" onClick={this.toggle_modal} style={{ marginLeft: "15px" }} > เพิ่มเอง </bs4.Button>
                    </bs4.BreadcrumbItem>
                    </bs4.Col>
                    <bs4.Col sm="1" >
                    <input type="text" name="qty_product" className="input-product-qty" onChange={this.onChange_form} value={this.state.qty_product} />
                    </bs4.Col>
                </bs4.Breadcrumb>
                <div className="boxInContent" >
                    <table >
                        <tbody>
                        <tr>
                            {this.state.product_lists}
                        </tr>
                        </tbody>
                    </table>
                </div>
                <bs4.Modal size={"lg"} isOpen={this.state.add_modal} toggle={this.toggle_modal} backdrop={"static"} >
                    <bs4.ModalHeader toggle={this.toggle_modal}>เพิ่มรายการสั่งซื้อ</bs4.ModalHeader>
                    <bs4.ModalBody>
                        <bs4.FormGroup row>
                            <bs4.Label sm="2">ชื่อสินค้า : </bs4.Label>
                            <bs4.Col sm="10" >
                                <bs4.Input type="text" name="product_name" onChange={this.onChange_form} value={this.state.product_name} />
                            </bs4.Col>
                        </bs4.FormGroup>
                        <bs4.FormGroup row>
                            <bs4.Label sm="2">จำนวน : </bs4.Label>
                            <bs4.Col sm="4" >
                                <bs4.Input type="text" name="product_qty" onChange={this.onChange_form} value={this.state.product_qty} />
                            </bs4.Col>
                            <bs4.Label sm="2">ราคา : </bs4.Label>
                            <bs4.Col sm="4" >
                                <bs4.Input type="text" name="product_price" onChange={this.onChange_form} value={this.state.product_price} />
                            </bs4.Col>
                        </bs4.FormGroup>
                    </bs4.ModalBody>
                    <bs4.ModalFooter>
                        <bs4.Button color="primary" onClick={this.select_product_custom}>เพิ่ม</bs4.Button>{' '}
                        <bs4.Button color="secondary" onClick={this.toggle_modal}>ยกเลิก</bs4.Button>
                    </bs4.ModalFooter>
                </bs4.Modal>
            </div>
        )
    }
}
function mapStateToProps(state) {
    return state.order_product
}
export default connect(mapStateToProps)(Productlist);