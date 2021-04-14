import '../student/StudentList.css';
import React, { useEffect, useState } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Table, Card, CardBody } from 'reactstrap';
import axios from "axios";
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { message, Spin } from 'antd';
function StudentList() {

    const [state, setState] = useState({ loading: true, data: [] });

    const { loading, data } = state || {};

    const [student, setStudent] = useState({
        id: '',
        name: '',
        code: '',
        address: '',
        email: '',
    });

    const [modal, setModal] = useState(false);
    const key = 'test';
    const mesdel = () => {
        message.loading({ content: 'loading....', key });
        setTimeout(() => {
            message.success({ content: 'Successfully!', key, duration: 2 });
        }, 200);
    };

    const info = () => {
        message.error('Do not leave your name, student code, or address blank');
    };

    
    // deleteStudent
    const deleteStudent = async (id) => {
        try {
            await axios.delete(`http://localhost:8080/students/${id}`);
            getAll();
            mesdel();
        } catch (error) {
            console.log(error);
        }
    }

    async function getAll() {
        setState({ loading: true, data: [] });
        const response = await axios.get(`http://localhost:8080/students`);
        setState({ loading: false, data: response.data || [] });
    }

    useEffect(() => {
        setState({ loading: true, data: [] });
        getAll();
    }, [])

    async function handleOnSubmit(e) {
        e.preventDefault();
        const data = {
            name: student.name,
            codeStudent: student.code,
            address: student.address,
            email: student.email
        }

        if (student.name === "") {
            info();
        } else if (student.code === "") {
            info();
        } else if (student.address === "") {
            info();
        } else

            if (student.id) {
                const { id } = student;
                data.id = id
                //console.log(data)
                await axios.put(`http://localhost:8080/students/${id}`, data);
            } else {
                await axios.post('http://localhost:8080/students', data);
            }
        setModal(false);

        getAll();

        setStudent({
            id: '',
            name: '',
            code: '',
            address: '',
            email: '',
        })

    }

    function handleOnAdd() {
        setModal(true);
    }

    function handleCancel() {
        setStudent({
            id: '',
            name: '',
            code: '',
            address: '',
            email: '',

        })
        setModal(false);
    }

    function editStudent(id) {
        axios.get(`http://localhost:8080/students/${id}`)
            .then(response => response.data)
            .then(data => setStudent({
                id: data.id,
                name: data.name,
                code: data.codeStudent,
                address: data.address,
                email: data.email
            }))
        setModal(true)
    }


    return (
        <div>
            <div className="d-flex flex-column pl-3">
                <div className=" d-flex align-items-end pb-3">
                    <h2>Student list</h2>
                </div>
                <div className=" d-flex align-items-end">
                    <Button color="primary" onClick={handleOnAdd}>
                        <PlusOutlined /> Add Student</Button>
                </div>
            </div>

            {loading && <Spin className="d-flex justify-content-center" />}
            {!loading && (
                <Card>
                    <CardBody>
                        <Table bordered table-responsive>
                            <thead>
                                <tr>
                                    <td><b>Id</b></td>
                                    <td><b>Name</b></td>
                                    <td><b>CodeStudent</b></td>
                                    <td><b>Address</b></td>
                                    <td><b>Email</b></td>
                                    <td></td>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    data && data.map((item, courseIndex) => (
                                        <tr key={courseIndex}>
                                            <td>{item.id}</td>
                                            <td>{item.name}</td>
                                            <td>{item.codeStudent}</td>
                                            <td>{item.address}</td>
                                            <td>{item.email}</td>
                                            <td>
                                                <Button color="info"
                                                    onClick={() => editStudent(item.id)}
                                                > <EditOutlined /> </Button>{' '}
                                                <Button onClick={() => {
                                                    deleteStudent(item.id)
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
                <Modal isOpen={modal} fade={true} >
                    <ModalHeader >Student</ModalHeader>
                    <ModalBody>
                        <div>
                            <form id="formSubmit" onSubmit={handleOnSubmit} >
                                <div>
                                    <label for="name">Name:</label> <br />
                                    <input type="text" id="name" name="name"
                                        value={student.name} onChange={e => setStudent({ ...student, name: e.target.value })} /> <br />
                                </div>
                                <div>
                                    <label for="code">CodeStudent:</label><br />
                                    <input type="text" id="code" name="code"
                                        value={student.code} onChange={e => setStudent({ ...student, code: e.target.value })} /> <br />
                                </div>
                                <div>
                                    <label for="address">Address:</label> <br />
                                    <input type="text" id="address" name="address"
                                        value={student.address} onChange={e => setStudent({ ...student, address: e.target.value })} /> <br />
                                </div>
                                <div>
                                    <label for="email">Email:</label> <br />
                                    <input type="text" id="email" name="email"
                                        value={student.email} onChange={e => setStudent({ ...student, email: e.target.value })} /> <br />
                                </div>

                            </form>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" type="submit" form="formSubmit">Save</Button>{' '}
                        <Button color="secondary" onClick={handleCancel}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            </div>

        </div>

    )

}

export default StudentList;