import './App.css';
import StudentList from './components/student/StudentList';
import CourseList from './components/course/CourseList';
import React, { useState } from "react";
import {
    //BrowserRouter as Router,
    Switch,
    Route,
    // Link,
    useHistory,
    Redirect
} from "react-router-dom";

import NormalLoginForm from './components/authentication/NormalLoginForm'
import { Menu } from 'antd';
import { Col, Row } from 'reactstrap';

import { message} from 'antd';

function App() {

    const [authen, setAuthen] = useState(sessionStorage.getItem("authen") === "true");
    const history = useHistory();
    const logInMes = () => {
        message.success('Login successfully ');
    };

    const logOutMes = () => {
        message.success('Logout successfully ');
    };

    const logInErro = () => {
        message.error(' Username or password is incorrect ');
    };
    function Login(username, password) {
        //console.log(username)
        if (username === 'admin' && password ==='123456') {
            setAuthen(true)
            sessionStorage.setItem("authen", true)
            logInMes();
        } else
        {
            logInErro();
        }

    }
    function Logout() {
        sessionStorage.removeItem('authen')
        setAuthen(false)
        logOutMes()
    }

    const renderComponent = (authen) => {
        if (authen) {
            return (
                <React.Fragment>
                    <Row>
                        <Col sm={2}>
                            <Menu
                                mode="inline"
                                onClick={handleClick}
                            >
                                <Menu.Item key="/students">Student List</Menu.Item>
                                <Menu.Item key="/courses">Course List</Menu.Item>
                                <Menu.Item key="/logout" onClick={Logout}>Logout</Menu.Item>
                            </Menu>
                        </Col>

                        <Col sm={10}>
                            <Row>
                                <Col>
                                    <Switch>
                                        <Route path="/students/" exact component={StudentList} />
                                        <Route path="/courses/" exact component={CourseList} />
                                    </Switch>
                                </Col>
                            </Row>
                        
                        </Col>

                    </Row>
                </React.Fragment>
            )
        } else {
            return (
                <Switch>
                    <Route path="/login" exact render={() => {
                        return !authen && <NormalLoginForm login={Login} />
                    }}
                    />
                    <Redirect to="/login" exact />
                </Switch>

            );
        }
    }

    function handleClick(e) {
        //console.log('click ', e.key);
        history.push(e.key);
    }

    return (
        <> <div>
            {renderComponent(authen)}
        </div>
        </>

    )

}
export default App;