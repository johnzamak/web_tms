import React, { Component } from 'react';
import Product from './Product'
import { Row, Col,CardGroup } from 'reactstrap'

class Productlist extends Component {
    constructor(props) {
        super(props)
        this.state = {
            max_cols: 4,
            product_lists: []
        }
    }
    componentWillReceiveProps(nextProps) {
        console.log("nextProps", nextProps)
        this.setProductList(nextProps.data)
    }
    setProductList(data_set) {
        var state = this.state
        var check_rows = data_set.length / state.max_cols
        var count_rows = 0, count_cols = 0
        var data_rows = [], data_cols = []
        data_set.forEach((element, index) => {
            if (count_rows < check_rows) {
                if (count_cols < state.max_cols) {
                    data_cols.push(
                        <Col sm="3" >
                            <Product product_data={element} />
                        </Col>
                    )
                    count_cols++
                    if (count_cols >= state.max_cols) {
                        data_rows.push(
                            <Row>{data_cols}</Row>
                        )
                        data_cols=[]
                        count_cols = 0
                        count_rows++
                    }
                }
            }
        });
        if(data_cols.length>0){
            data_rows.push(
                <Row >{data_cols}</Row>
            )
        }
        this.setState({
            product_lists:data_rows
        })
    }
    render() {
        console.log(this.state.product_lists)
        return (
            <div>
                {this.state.product_lists}
            </div>
        )
    }
}

export default Productlist;