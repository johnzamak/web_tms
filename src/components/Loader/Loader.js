import React, { Component } from 'react';
import { BarLoader } from 'react-spinners';
import "./Loader.css"

class Loader extends Component {
    render() {
        console.log(this.props.isLoading)
        return (
            <div className="view-loader" >
                <div className="text-loader" >Loading....</div>
                <div className={"loader-bar"}>
                    <BarLoader
                        width={175}
                        color={'#007bff'}
                        loading={this.props.isLoading}
                    />
                </div>
            </div>
        );
    }
}

export default Loader;