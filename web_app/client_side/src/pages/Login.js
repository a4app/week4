import React, {useState} from 'react'
import './login.css'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';

const Login = () => {

	const history = useNavigate();

	const [usernameError, setUsernameError] = useState('');
	const [passwordError, setPasswordError] = useState('');
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [buttonState, changeButton] = useState(1)

	const submit = (e) => {
		e.preventDefault();

		changeButton(2);

		axios.post('/login', {username, password}).then((res) => {
			changeButton(1);
			const out = res.data;
			
			if(out.status) {
				setUsernameError('');
				setPasswordError('');
				history('/admin');
			}
			else {
				if(out.incorrect) {
					setUsernameError('');
					setPasswordError('');
					changeButton(3);
				}
				else {
					if(!out.usernameStatus) {
						setUsernameError('* required');
					}
					else {
						setUsernameError('');
					}
					if(!out.passwordStatus) {
						setPasswordError('* required');
					}
					else {
						setPasswordError('');
					}
				}
			}
		})
		.catch((error) => {
			console.error(error);
		});
	};

	return (
		<div className='main'>
			<div className="background">
				<div className="shape"></div>
				<div className="shape"></div>
			</div>
			<form method='post' className='form'>
				<h3>Login Here</h3>

				<div className='required-div'>
					<label>Username</label>
					<span className='required'>{usernameError}</span>
				</div>
				<input type="text" placeholder="Username" id="username" onChange={(e)=>{setUsername(e.target.value);changeButton(1)}} />

				<div className='required-div'>
					<label>Password</label>
					<span className='required'>{passwordError}</span>
				</div>
				<input type="password" placeholder="Password" id="password" onChange={(e)=>{setPassword(e.target.value);changeButton(1)}} />

				{ buttonState == 1 ? ( 
					<button type='submit' onClick={submit}>Log In</button> ) :
					buttonState == 2 ? ( <div className='loading'>. . .</div>) :
					buttonState == 3 ? ( <div className='error'>incorrect username or password</div> ) :
					(<></>)
				}

			</form>
		</div>
	)
};

export default Login;
