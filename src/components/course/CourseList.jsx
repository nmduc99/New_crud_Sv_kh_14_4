import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Card, CardBody } from 'reactstrap';
import { Table } from 'reactstrap';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { message, Spin } from 'antd';
import '../course/CourseCss.css';


function CourseList() {

    const [state, setState] = useState({ loading: true, data: [] });
    const { loading, data } = state || {};
    const [course, setCourse] = useState({
        id: '',
        code: '',
        name: '',
        descrition: ''
    })

    const [modal, setModal] = useState(false);

    const key = 'test';
    const mesdel = () => {
        message.loading({ content: 'Loading...', key });
        setTimeout(() => {
            message.success({ content: 'Successfully!', key, duration: 2 });
        }, 200);
    };
    const info = () => {
        message.error('Do not leave the code and name blank');
    };

    const deleteCourse = async (id) => {
        try {
            await axios.delete(`http://localhost:8080/courses/${id}`);
            await getAll();
            mesdel();
        } catch (error) {
            console.log(error);
        }
    }

    async function getAll() {
        setState({ loading: true, data: [] });
        const response = await axios.get(`http://localhost:8080/courses`);
        setState({ loading: false, data: response.data || [] });
    }

    useEffect(() => {
        setState({ loading: true, data: [] });
        getAll();
    }, [])

    async function handleOnSubmit(e) {
        e.preventDefault();
        const data = {
            code: course.code,
            name: course.name,
            descrition: course.descrition
        }


        if (course.code === "") {
            info();
        } else if (course.name === "") {
            info();
        } else if (course.id) {
            const { id } = course;
            data.id = id
            await axios.put(`http://localhost:8080/courses/${id}`, data);

        } else {
            await axios.post('http://localhost:8080/courses', data);

        }
        setModal(false);
        getAll();

        setCourse({
            id: '',
            code: '',
            name: '',
            descrition: '',
        })
    }
    function handleOnAdd() {
        setModal(true);
    }

    function handleCancel() {
        setCourse({
            id: '',
            code: '',
            name: '',
            descrition: '',
        })
        setModal(false);
    }

    function editCourse(id) {
        axios.get(`http://localhost:8080/courses/${id}`)
            .then(response => response.data)
            .then(data => setCourse({
                id: data.id,
                code: data.code,
                name: data.name,
                descrition: data.descrition
            }))
        setModal(true)
    }

    return (
        <div>
            <div className="d-flex flex-column pl-3">
                <div className=" d-flex align-items-end pb-3">
                    <h2>Course list</h2>
                </div>
                <div className=" d-flex align-items-end">
                    <Button color="primary" onClick={handleOnAdd}>
                        <PlusOutlined /> Add Course</Button>
                </div>
            </div>

            {loading && <Spin className="d-flex justify-content-center" />}
            {!loading && (
                <Card>
                    <CardBody>
                        <Table bordered>
                            <thead>
                                <tr>
                                    <td><b>Id</b></td>
                                    <td><b>Code</b></td>
                                    <td><b>Name</b></td>
                                    <td><b>Descrition</b></td>
                                    <td></td>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    data && data.map((item, courseIndex) => (
                                        <tr key={courseIndex}>
                                            <td>{item.id}</td>
                                            <td>{item.code}</td>
                                            <td>{item.name}</td>
                                            <td>{item.descrition}</td>
                                            <td><Button color="info" onClick={() => editCourse(item.id)}
                                            > <EditOutlined /></Button>{' '}
                                                <Button onClick={() => {
                                                    deleteCourse(item.id);
                                                }}
                                                    color="danger"> <DeleteOutlined /></Button>
                                            </td>

                                        </tr>
                                    ))
                                }
                            </tbody>

                        </Table>
                    </CardBody>

                </Card>
            )}

            <div>

                <Modal isOpen={modal} fade={true}   >
                    <ModalHeader >Course</ModalHeader>
                    <ModalBody>
                        <div>
                            <form id="formSubmit" onSubmit={handleOnSubmit} >
                                <div>
                                    <label for="code">Code:</label><br />
                                    <input type="text" id="code" name="code"
                                        value={course.code} onChange={e => setCourse({ ...course, code: e.target.value })} /> <br />
                                </div>
                                <div>
                                    <label for="name">Name:</label> <br />
                                    <input type="text" id="name" name="name"
                                        value={course.name} onChange={e => setCourse({ ...course, name: e.target.value })} /> <br />
                                </div>

                                <div>
                                    <label for="descrition">Descrition:</label> <br />
                                    <input type="text" id="descrition" name="descrition"
                                        value={course.descrition} onChange={e => setCourse({ ...course, descrition: e.target.value })} /> <br />
                                </div>

                            </form>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" type="submit" form="formSubmit" >Save</Button>{' '}
                        <Button color="secondary" onClick={handleCancel}>Cancel</Button>
                    </ModalFooter>
                </Modal>

            </div>
        </div>


    )
}

export default CourseList;