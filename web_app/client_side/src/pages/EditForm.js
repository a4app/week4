import React, {useEffect, useState} from 'react'
import axios from 'axios';
import { /*useLocation,*/ useNavigate, useParams } from 'react-router-dom';
import './userform.css'

const EditForm = () => {

	const history = useNavigate();

	const { id, u, n, e, p, a } = useParams();

	const [authState, changeAuthState] = useState(false);

	const [errorMessage, setErrorMessage] = useState('');

	const [usernameError, setUsernameError] = useState('');
	const [nameError, setNameError] = useState('');
	const [emailError, setEmailError] = useState('');
	const [phoneError, setPhoneError] = useState('');
	const [addressError, setAddressError] = useState('');

	const [username, setUsername] = useState(u);
	const [name, setName] = useState(n);
	const [email, setEmail] = useState(e);
	const [phone, setPhone] = useState(p);
	const [address, setAddress] = useState(a);

	useEffect( () => {
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

	const onUpdate = (e) => {
		e.preventDefault();
		axios.post('/update', {
			id, username, name, email, phone, address
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
						<h2 style={{textAlign: 'center'}}>Edit User Data</h2>

						<div className="required-div">
							<label className='label'>Username</label>
							<span className='required'> { usernameError } </span>
						</div>
						<input type="text" placeholder='username' value={username} className='input' onChange={(e)=>setUsername(e.target.value)}/>

						<div className="required-div">
							<label className='label'>Name</label>
							<span className='required'> { nameError } </span>
						</div>
						<input type="text" placeholder='name' value={name} className='input' onChange={(e)=>setName(e.target.value)}/>

						<div className="required-div">
							<label className='label'>Email</label>
							<span className='required'> { emailError } </span>
						</div>
						<input type="text" placeholder='email' value={email} className='input' onChange={(e)=>setEmail(e.target.value)}/>

						<div className="required-div">
							<label className='label'>Phone</label>
							<span className='required'> { phoneError } </span>
						</div>
						<input type="text" placeholder='phone' value={phone} className='input' onChange={(e)=>setPhone(e.target.value)}/>

						<div className="required-div">
							<label className='label'>Address</label>
							<span className='required'> { addressError } </span>
						</div>
						<textarea rows="5" className='textarea' value={address} placeholder='address' onChange={(e)=>setAddress(e.target.value)}></textarea>

						<div className='error-messages'> { errorMessage } </div>

						<button type="submit" onClick={onUpdate} style={{marginTop: '20px'}}>Update</button>
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

export default EditForm;