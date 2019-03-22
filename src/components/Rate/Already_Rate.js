import React, { Component } from 'react';
import * as bs4 from "reactstrap"
import * as MdIcon from 'react-icons/lib/md'

class Already_Rate extends Component {
    constructor(props) {
        super(props)
        this.state = {
            show_text: "คุณได้ทำการประเมินเรียบร้อยแล้ว \n ขอบคุณที่ใช้บริการค่ะ"
        }
    }
    render() {
        return (
            <div>
                <bs4.Container>
                    <bs4.Row>
                        <bs4.Col>
                            <h1>{this.state.show_text}</h1>
                        </bs4.Col>
                    </bs4.Row>
                </bs4.Container>
            </div>
        );
    }
}

export default Already_Rate;