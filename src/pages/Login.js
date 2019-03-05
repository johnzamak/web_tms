import React, { Component } from 'react';
import * as bs4 from "reactstrap"
import * as MdIcon from 'react-icons/lib/md'
import { browserHistory } from 'react-router';
import { saveToLocalStorage } from '../localStorage';


const { proxy } = require("../service")
const md5 = require('md5');

class Login extends Component {
    constructor(props) {
        super(props)
        this.state = {
            inUserName: "",
            inPassword: "",
            alertVisible: false,
            alertMsg: 'test',
        }
    }
    handleInputChange = (e) => {
        const target = e.target
        const val = target.value
        const name = target.name
        this.setState({
            [name]: val
        })
    }
    handleKeyPress=(e)=>{
        if (e.key === "Enter") {
            this.handleOnClick()
        }
    }
    handleOnClick = (e) => {
        let self = this
        let id = this.state.inUserName, pass = md5(this.state.inPassword)

        if (id != "" && pass != "") {
            let url = proxy.main + "web-api/login/" + id + "&" + pass
            fetch(url)
                .then(response => response.json())
                .then((responseJson) => {
                    console.log("responseJson", responseJson)
                    if (responseJson.status == 200) {
                        self.setState({
                            alertVisible: true,
                            alertMsg: "Login success! Please wait....."
                        }, () => {
                            saveToLocalStorage("data_user", responseJson.result)
                            setTimeout(() => {
                                browserHistory.push('/speceialtask')
                            }, 2000);
                        })
                    } else {
                        self.setState({
                            alertVisible: true,
                            alertMsg: "Login fails! Please check data again"
                        })
                    }
                }).catch((error) => {
                    self.setState({
                        alertVisible: true,
                        alertMsg: "Login fails! Please check data again"
                    })
                })
        } else {
            alert("กรุณากรอกข้อมูลให้ครบ")
        }

    }
    render() {
        return (
            <div><br/><br/><br/><br/>
                <bs4.Container>
                    <bs4.Row>
                        <bs4.Col>
                            <bs4.Card>
                                <bs4.CardHeader>
                                    <MdIcon.MdAccountCircle style={{ fontSize: '36px', color: '#0783C1' }} />
                                    User Login
                    </bs4.CardHeader>
                                <bs4.CardBody>
                                    <bs4.Form>
                                        <bs4.FormGroup>
                                            <bs4.Label for="exampleEmail">User Name</bs4.Label>
                                            <bs4.Input type="text" id="inUserName" name="inUserName" onKeyPress={this.handleKeyPress} autoFocus placeholder="User Name" onChange={this.handleInputChange} value={this.state.inUserName} />
                                        </bs4.FormGroup>
                                        <bs4.FormGroup>
                                            <bs4.Label for="exampleEmail">Password</bs4.Label>
                                            <bs4.Input type="password" onKeyPress={this.handleKeyPress} id="inPassword" name="inPassword" placeholder="Password" onChange={this.handleInputChange} value={this.state.inPassword} />
                                        </bs4.FormGroup>
                                    </bs4.Form>
                                    <bs4.Button color="success" className="btnLong" onClick={this.handleOnClick} >LOGIN</bs4.Button>
                                </bs4.CardBody>
                                <bs4.CardFooter>
                                    <bs4.Alert color="info" isOpen={this.state.alertVisible}>{this.state.alertMsg}</bs4.Alert>
                                </bs4.CardFooter>
                            </bs4.Card>
                        </bs4.Col>
                    </bs4.Row>
                </bs4.Container>
            </div >
        );
    }
}

export default Login;