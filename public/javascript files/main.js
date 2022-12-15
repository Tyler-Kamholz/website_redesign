

//this is for the slides

var counter = 1;
setInterval(function() {
    document.getElementById('image' + counter).checked = true;
    counter++;
    
    if(counter > 4) {
        counter = 1;
    }
}, 5000);



	window.onload = function() {


		//this stuff is for the weather in the race location using fetch
		var city = document.getElementById('city');
		var temp = document.getElementById('temp');
		var weather = document.getElementById('weather');

		const options = {
			method: 'GET',
			headers: {
				'X-RapidAPI-Key': '7b502ead2cmsh1b6e27a4c62134bp1cbf35jsnc14753928636',
				'X-RapidAPI-Host': 'open-weather13.p.rapidapi.com'
			}
		};
		
		fetch('https://open-weather13.p.rapidapi.com/city/monaco', options)
			.then(response => response.json())
			.then(response => {

				city.innerText = `Weather In ${response.name}`;

				temp.innerText = `${Math.trunc(response.main.temp)}`;
				weather.innerText = `${response.weather.main}`

			})
			.catch(err => console.error(err));


	}
