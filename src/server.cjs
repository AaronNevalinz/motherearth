const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const dotenv = require('dotenv');
dotenv.config();

const ApiKey = process.env.ApiKey;

const app = express();

app.use(express.urlencoded({extended: true}));
app.use(express.static('.'));
app.set('view engine', 'ejs');
app.set('views', './src/views');
// parse application/json
app.use(bodyParser.json());

const {GoogleGenerativeAI} = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.Google_API_KEY);

const  farmer = async (weatherData, crops)=>{
    const model = genAI.getGenerativeModel({model: "gemini-pro"});

    const prompt = `Act as a weather data analyst and resource allocation strategist, based on the json ${JSON.stringify(weatherData)} generate the best advice to a local farmer, advice on the crops most especially ${crops} and suggest with they are a good fit based on the weather data and the likely expected yield. Suggest any other crops are that suitable for this weather. Please format the response in HTML div component, including headings for each section and bullet points for key processes`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return text;
}

const  city_authority = async (weatherData, activities)=>{
    const model = genAI.getGenerativeModel({model: "gemini-pro"});

    const prompt = `Using the following 30-day weather forecast JSON object ${JSON.stringify(weatherData)}, generate a detailed comprehensive report aimed at city authorities. The report should include specific recommendations on resource allocation, activity planning, disaster preparedness, traffic and fleet management, infrastructure maintenance, urban agriculture, green spaces, and energy management. Here are a list of activities planned by the city authority in the next days - ${activities}. Please format the response as html div component, including headings for each section and bullet points for key processes`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return text;
}

const  disaster = async (weatherData)=>{
    const model = genAI.getGenerativeModel({model: "gemini-pro"});

    const prompt = `Using the following 30-day weather forecast JSON object ${JSON.stringify(weatherData)}, generate a comprehensive report tailored for disaster preparedness authorities. The report should include detailed recommendations on risk assessment, coordination, public awareness, early warning systems, resource management, and recovery efforts and any other suggestions. Please format the response as html div component, including headings for each section and bullet points for key processes.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return text;
}

app.get('/', (req, res)=>{
    res.sendFile(__dirname + '/index.html');
});

app.get('/farmer', (req, res)=>{
    res.sendFile(__dirname + '/farmer.html');
});
app.post('/farmer', async (req, res)=>{
    const {location, crops} = req.body;
    var options = {
        method: 'GET',
        url: `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${ApiKey}`,
    };
    if(!location){
        return res.status(400).send('All fields are required.')
    }
    try{
        const response = await axios.request(options);
        const weatherData = response.data;
        const geminiResponse = await farmer(weatherData, crops);
        console.log(geminiResponse); 
        res.render('results', { geminiResponse });
    }catch(error){
        console.log(error);
    }
});

// handle city authority
app.get('/city_authority', (req, res)=>{
    res.sendFile(__dirname + '/city_authority.html');
});

app.post('/city_authority', async(req, res)=>{
    const {location, activities} = req.body;
    var options = {
        method: 'GET',
        url: `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${ApiKey}`,
    };
    if(!location || !activities){
        return res.status(400).send('All fields are required.')
    }
    try{
        const response = await axios.request(options);
        const weatherData = response.data;
        const geminiResponse = await city_authority(weatherData, activities);
        console.log(geminiResponse); 
        res.render('results', { geminiResponse });
    }catch(error){
        console.log(error);
    }
});

// handle disaster preparedness agents
app.get('/disaster', (req, res)=>{
    res.sendFile(__dirname + '/disaster.html')
});
app.post('/disaster', async(req, res)=>{
    const {location} = req.body;
    var options = {
        method: 'GET',
        url: `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${ApiKey}`,
    };
    if(!location){
        return res.status(400).send('All fields are required.')
    }
    try{
        const response = await axios.request(options);
        const weatherData = response.data;
        const geminiResponse = await disaster(weatherData);
        console.log(geminiResponse); 
        res.render('results', { geminiResponse });
    }catch(error){
        console.log(error);
    }
});

app.listen(3000, ()=>{
    console.log('Listening on port 3000');
});