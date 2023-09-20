import React, {useEffect} from 'react'
import { useNavigate } from 'react-router-dom';
import './home.css'

const Home = () => {

    const history = useNavigate();

    useEffect( () => {
		fetch('/auth').then(
			(response) => {
				return response.json();
			}
		).then(
			(data) => {
				setTimeout( () => {
					if(data.status)
                        history('admin');
                    else
                        history('login');
				}, 1000);
			}
		)
	}, []);

    return (
        <div className='main'>
            <div className="spinner"></div>
        </div>
    )
}

export default Home;