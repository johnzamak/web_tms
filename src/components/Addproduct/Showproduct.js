import React, { Component } from 'react';
import * as bs4 from "reactstrap"
import * as MdIcon from 'react-icons/lib/md'

class Showproduct extends Component {
    render() {
        // console.log("Showproduct", this.props);
        const { data } = this.props
        return (
            <div>{data &&
                <bs4.Table>
                    <tr>
                        <th>Code: </th>
                        <th> {data.code} </th>
                    </tr>
                    <tr>
                        <th>ชื่อสินค้า: </th>
                        <th> {data.product_name} </th>
                    </tr>
                    <tr>
                        <th>ราคาต่อหน่วย: </th>
                        <th> {numberFormat(data.product_price, 0)} </th>
                    </tr>
                    <tr>
                        <th>หน่วย: </th>
                        <th> {numberFormat(data.product_unit, 0)} </th>
                    </tr>
                    <tr>
                        <th>จำนวนสต๊อก: </th>
                        <th> {numberFormat(data.stock_available, 0)} </th>
                    </tr>
                </bs4.Table>
            }
            </div>
        );
    }
}
function numberFormat(val, fixed) {
    if (val <= 0 || typeof val === "undefined") {
        return 0
    }
    if (fixed <= 0 || typeof fixed === "undefined") {
        return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    } else {
        return val.toFixed(fixed).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')
    }
}
export default Showproduct;