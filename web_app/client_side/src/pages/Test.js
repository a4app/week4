import React from 'react'
import axios from 'axios';
import './test.css'

export default function Test() {

	const clicked = () => {
		axios.get('/test').then((res) => {
			console.log(res)
		})
	};

	return (
		<div className='main'>
			<div className="test-button" onClick={clicked}>
				Test
			</div>
		</div>
	)
}
