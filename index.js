import express from 'express';
import dotenv from 'dotenv';
import axios from "axios";

import { GoogleGenerativeAI } from '@google/generative-ai';
dotenv.config();
const app = express();

const ApiKey = process.env.ApiKey;
const lat = 0.31001313630812266;
const lon = 32.578614707176335

const genAI = new GoogleGenerativeAI(process.env.Google_API_KEY);

var options = {
  method: 'GET',
  url: `https://api.openweathermap.org/data/2.5/forecast?q=London&appid=${ApiKey}`,
};
let weatherData = '';
axios.request(options).then(function (response) {
  weatherData = response.data;
}).catch(function (error) {
  console.error(error);
});


const  run = async ()=>
{
    const model = genAI.getGenerativeModel({model: "gemini-pro"});

    const prompt = `Act as a weather data analyst and resource allocation strategist, based on the json ${weatherData} generate the best advice to a local farmer, advice on the crops to plant and the likely expected yield.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();


    console.log(text);
}

run();

