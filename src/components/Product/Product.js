import React, { Component } from 'react';
import { Card, CardBody, CardText, CardImg } from 'reactstrap'
import { connect } from 'react-redux'

class Product extends Component {
    componentDidMount() {
        // console.log("Product nextProps", this.props);
    }
    componentWillReceiveProps(nextProps){
        // console.log("nextPropsselect_product",nextProps)
    }
    selectProduct=(product_data)=>{
        // console.log("onClick selectProduct",product_data)
        this.props.dispatch({type:"select_product",product_data:product_data})
    }
    
    render() {
        const { product_data } = this.props
        return (
            <div>
                <Card className="boxProduct cursor-pointer" onClick={(e)=>{ this.selectProduct(product_data)}} >
                    <CardImg top width="100%" src="https://placeholdit.imgix.net/~text?txtsize=33&txt=180%C3%97256&w=180&h=256" alt="Card image cap" />
                    <CardBody>
                        <CardText> {product_data.name} </CardText>
                    </CardBody>
                </Card>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        select_product: state.select_product
    }
}

export default connect(mapStateToProps)(Product);