import React, { useEffect, useState } from 'react';
import "./GeoLocation.css"
import LoginModal from '../LoginModal/LoginModal';
import RegisterModal from '../RegisterModal/RegisterModal';

const GeoLocationComponent = () => {
  const [location, setLocation] = useState(null);
  const [geoData, setgeoData] = useState({
	nombreCiudad:"",
	pais:"",
	region:"",
	temperatura:"",
	sensTerm:"",
	texto:"",
	icono:""
  })
  const [loginModal, setLoginModal] = useState(false)
  const [registerModal, setRegisterModal] = useState(false)
  const handleLoginModal = () => {
	(loginModal === false) ? setLoginModal(true) : setLoginModal(false)
  }
  const handleRegisterModal = () => {
	(registerModal === false) ? setRegisterModal(true) : setRegisterModal(false)
  }
  
  useEffect(() => {
      if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });
        },
        (error) => {
            console.error('Error getting geolocation:', error.message);
        }
        );
    } else {
        console.error('Geolocation is not supported by this browser.');
    }
	}, []);

	useEffect(() => {
		if (location) {
		const geolocation = `${location.latitude},${location.longitude}`;
		console.log(geolocation);
		fetch(`https://api.weatherapi.com/v1/current.json?key=5e92979a14bf4ee9a40181648231910&q=${geolocation}#`)
		.then(response => {return response.json()})
		  .then(data => {
			console.log(data)
			setgeoData({
				nombreCiudad:data.location.name,
				pais:data.location.country,
				region:data.location.region,
				temperatura:data.current.temp_c,
				sensTerm:data.current.feelslike_c,
				texto:data.current.condition.text,
				icono:data.current.condition.icon
			})
		})
		  .catch(error => {
			console.error('Error:', error);
		  });
		}
	}, [location]);

	console.log(location);
	console.log(geoData);

  return (
    <header className='d-flex justify-content-between'>
		<div className='text-start'>
			{location && (
				<p><img src={geoData.icono} alt="icono"/>{geoData.temperatura}°C, {geoData.region}, {geoData.pais}</p>
			)}
		</div>
		<div className='me-3'>
        	<button className='loginButton mt-2 me-2' onClick={handleLoginModal}> Login </button>
        	<button className='registerButton' onClick={handleRegisterModal}> Register </button>
			{loginModal && <LoginModal closeModal = {setLoginModal} />}
			{registerModal && <RegisterModal closeModal = {setRegisterModal} />}		
    	</div>		
    </header>
  );
};

export default GeoLocationComponent;
