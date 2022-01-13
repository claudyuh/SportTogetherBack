const dotenv = require('dotenv');
dotenv.config();
const axios = require('axios');

// 
// https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}
// example
// https://api.openweathermap.org/data/2.5/onecall?lat=33.44&lon=-94.04&exclude=minutely,alerts,daily&units=metric&appid={API key}


exports.weatherData = async(req, res, next) => {
    // OneCall Api for all 42 Counties every 4h
    // https://api.openweathermap.org/data/2.5/onecall?lat=33.44&lon=-94.04&exclude=hourly,daily&appid={API key}
    console.log('hit')
    // iasi > lat: 47.158 ; long = 27.6014
    const longitude = 27.6014, latitude = 47.158;
    
    axios(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&units=metric&exclude=hourly,minutely,alerts&appid=${process.env.WEATHER_API_KEY}`)
        .then(response => {
            console.log(response)
            return res.status(200).json(response)
        })
        .catch(err => {
            console.log(err)
            return res.status(401).json(err)
        })
};