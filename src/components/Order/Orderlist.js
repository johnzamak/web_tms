import React, { Component } from 'react';
import { connect } from 'react-redux'
import * as bs4 from 'reactstrap'
import * as MdIcon from 'react-icons/lib/md'

var tbl_data = [], data_set = []
class Orderlist extends Component {
    constructor(props) {
        super(props)
        this.state = {
            list_view: []
        }
    }
    componentWillReceiveProps(nextProps) {
        const { select_product } = nextProps
        console.log(nextProps);
        tbl_data=[]
        select_product.data.forEach((element, index) => {
            tbl_data.push(
                <tr>
                    <th><span style={{ float: "left" }}>{element.item_name} x {element.item_qty}  </span>   <span style={{ float: "right" }} >{element.total_price}</span> <span style={{ clear: "both", float: "left" }}>{element.item_price}</span> <span style={{ float: "right" }}>
                    <MdIcon.MdIndeterminateCheckBox className="iconlg" color="red" onClick={(e)=>{ this.selectProduct(element.item_name)}} /> </span> </th>
                </tr>
            )
        });

        this.setState({
            list_view: tbl_data
        })
    }
    selectProduct=(product_data)=>{
        // console.log("onClick selectProduct",product_data)
        this.props.dispatch({type:"remove_product",product_data:product_data})
    }
    render() {
        return (
            <div className="boxContent">
                <bs4.Breadcrumb>
                    <bs4.BreadcrumbItem><MdIcon.MdReorder className="iconlg" /> <bs4.Button color="danger" >-100</bs4.Button> </bs4.BreadcrumbItem>
                </bs4.Breadcrumb>
                <div className="boxInContent" >
                    <bs4.Table>
                        {this.state.list_view}
                        <tfoot>
                            <bs4.Button color="success" className="btnLong" > <MdIcon.MdSave className="iconlg" /> บันทึก</bs4.Button>
                        </tfoot>
                    </bs4.Table>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        select_product: state.select_product
    }
}
export default connect(mapStateToProps)(Orderlist);