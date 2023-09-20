import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './userform.css'

const AddForm = () => {

	const [authState, changeAuthState] = useState(false);

	const [errorMessage, setErrorMessage] = useState('');

	const [usernameError, setUsernameError] = useState('');
	const [nameError, setNameError] = useState('');
	const [emailError, setEmailError] = useState('');
	const [phoneError, setPhoneError] = useState('');
	const [addressError, setAddressError] = useState('');

	const [username, setUsername] = useState('');
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [phone, setPhone] = useState('');
	const [address, setAddress] = useState('');

	const history = useNavigate();

	useEffect ( () => {
		fetch('/auth').then(
			(response) => {
				return response.json();
			}
		).then(
			(data) => {
				setTimeout( () => {
					if(data.status) {
                        changeAuthState(true);
                    }
					else {
						history('/login');
					}
				}, 500);
			}
		)
	})

	const onSubmit = (e) => {
		e.preventDefault();
		axios.post('/add', {
			username, name, email, phone, address
		}).then((res) => {
			if(res.data.status) {
				history('/admin');
			}
			else {
				if(res.data.error) {
					
					setErrorMessage('error occurred  ..!');
					setUsernameError('');
					setNameError('');
					setEmailError('');
					setPhoneError('');
					setAddressError('');
					setTimeout(()=>setErrorMessage(''),3000);
				}
				else { ;
					if(!res.data.u)
						setUsernameError('* required');
					else
						setUsernameError('');

					if(!res.data.n)
						setNameError('* required');
					else
						setNameError('');

					if(!res.data.e)
						setEmailError('* required');
					else if(res.data.e == 'invalid')
						setEmailError('! invalid email');
					else
						setEmailError('');

					if(!res.data.p)
						setPhoneError('* required');
					else
						setPhoneError('');

					if(!res.data.a)
						setAddressError('* required');
					else
						setAddressError('');
				}
			}
		})
		.catch((error) => {
			setErrorMessage('something went wrong');
			setTimeout(()=>setErrorMessage(''),3000);
			console.error(error);
		});
	};

	return (
		<div className='main'>
			{
				authState ? (
					<form method="post" className='user-form'>
						<h2 style={{textAlign: 'center'}}>Add User</h2>

						<div className="required-div">
							<label className='label'>Username</label>
							<span className='required'> { usernameError } </span>
						</div>
						<input type="text" placeholder='username' className='input' onChange={(e)=>setUsername(e.target.value)}/>

						<div className="required-div">
							<label className='label'>Name</label>
							<span className='required'> { nameError } </span>
						</div>
						<input type="text" placeholder='name' className='input' onChange={(e)=>setName(e.target.value)}/>

						<div className="required-div">
							<label className='label'>Email</label>
							<span className='required'> { emailError } </span>
						</div>
						<input type="text" placeholder='email' className='input' onChange={(e)=>setEmail(e.target.value)}/>

						<div className="required-div">
							<label className='label'>Phone</label>
							<span className='required'> { phoneError } </span>
						</div>
						<input type="text" placeholder='phone' className='input' onChange={(e)=>setPhone(e.target.value)}/>

						<div className="required-div">
							<label className='label'>Address</label>
							<span className='required'> { addressError } </span>
						</div>
						<textarea rows="5" className='textarea' placeholder='address'  onChange={(e)=>setAddress(e.target.value)}></textarea>

						<div className='error-messages'> { errorMessage } </div>

						<button type="submit" onClick={onSubmit} style={{marginTop: '20px'}}>Submit</button>
					</form>
				) : (
					<div className="loader-div">
                        <div className="spinner"></div>
                    </div>
				)
			}
		</div>
	)
}

export default AddForm;