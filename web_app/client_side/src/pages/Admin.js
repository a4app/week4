import React, { useEffect, useState } from 'react'
import './admin.css'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Admin = () => {

    const history = useNavigate();

    const [authState, changeAuthState] = useState(false);
    const [tableStatus, setTableStatus] = useState(false);
    const [tableData, setTableData] = useState([{}]);
    const [message, setMessage] = useState({color: '#00000', msg: '.'});

    useEffect( () => {
		fetch('/auth').then(
			(response) => {
				return response.json();
			}
		).then(
			(data) => {
				setTimeout( () => {
					if(!data.status) {
                        changeAuthState(false);
                        history('/login');
                    }
                    else {
                        changeAuthState(true);
                        axios.get('/users').then((response) => {
                            
                            if(response.data.status /* && response.data.data.length != 0*/) {
                                setTableData(response.data.data);
                                setTableStatus(true);
                            }
                            else {
                                setTableData([{}]);
                                setTableStatus(false);
                            }
                        })
                        .catch((error) => {
                            console.error(error);
                        });
                    }
				}, 1000);
			}
		)
	}, []);

    const logOut = () => {
        setMessage({color: '#00FF00', msg: 'Logging out . . .'})
        axios.get('/logout').then((response) => {
			if(response.data == 'success') {
                setMessage({color: '#000000', msg: ''})
				history('/login');
			}
		})
		.catch((error) => {
			console.error(error);
		});
    }

    const deleteUser = async (id) => {
        axios.delete(`/delete/${id}`).then((response) => {
			if(response.data.status) {
                axios.get('/users').then((response) => {
                            
                    if(response.data.status) {
                        setTableData(response.data.data);
                        setTableStatus(true);
                    }
                    else {
                        setTableData([{}]);
                        setTableStatus(false);
                    }
                })
                .catch((error) => {
                    console.error(error);
                });
                setMessage({color: '#00FF00', msg: 'User deleted'})
			}
            else {
                setMessage({color: '#FF0000', msg: 'Action failed ! try again'})
            }
		})
		.catch((error) => {
			console.error(error);
            setMessage({color: '#FF0000', msg: 'something went wrong'})
		});
        setTimeout(() => {
            setMessage({color: '#000000', msg: ''})
        }, 4000)
    };

    if(authState) {
        return (
            <div className='main'>

                <button className='logout' onClick={logOut}>Logout</button>
                <div className="msg-div" style={{color: message.color }}> { message.msg } </div>
                <section>
                    <h1>Users</h1>
                    <div className="tbl-header">
                        <table cellPadding="0" cellSpacing="0" border="0">
                            <thead>
                                <tr>
                                    <th>Username</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Address</th>
                                    <th style={{width: '90px'}}></th>
                                </tr>
                            </thead>
                        </table>
                    </div>
                    <div className="tbl-content">

                        { tableStatus ? (
                            <table cellPadding="0" cellSpacing="0" border="0">
                                <tbody>
                                
                                    {
                                        tableData.map( (v, index) => {
                                            return <tr key={index}>
                                                <td> { v.username } </td>
                                                <td> { v.name } </td>
                                                <td> { v.email } </td>
                                                <td> { v.phone } </td>
                                                <td> { v.address } </td>
                                                <td className='button-td'>
                                                    <div className="icon-div">
                                                        <img src="edit.png" alt="edit" className='edit-icon' onClick={ ()=> {
                                                            history(`/edit/${v._id}/${v.username}/${v.name}/${v.email}/${v.phone}/${v.address}`)
                                                        } } />
                                                        <img src="delete.png" alt="delete" className='delete-icon' onClick={() => deleteUser(v._id)} />
                                                    </div>
                                                </td>
                                            </tr>
                                        })
                                    }
                                
                                    <tr>
                                        <td colSpan={6} style={{textAlign: 'center'}} className='add-button-td'>
                                            <button className='td-add-button' onClick={()=> history('/add')}>Add</button>
                                        </td>
                                    </tr>
                                

                                </tbody>
                            </table> ) :  (
                                <div className="loader-div">
                                    <div className="spinner"></div>
                                </div>
                            )
                        }

                    </div>
                </section>

            </div>
        )
    }
    else {
        return (
            <div className="mainn">
                <div className="spinner"></div>
            </div>
        )
    }
}

export default Admin;