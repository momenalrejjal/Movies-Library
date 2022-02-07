`use strict`;
const express = require("express");
const app = express();
const data = require("./data.json");
const axios = require("axios");
const dotenv = require('dotenv');
dotenv.config();
const APIKEY = process.env.APIKEY;

const pg = require("pg");

//app.use(errorHandler);
app.get('/HomePage', movieHandler);

app.get('/FavoritePage', favHandler);

app.get('/trending', trendHandler);

app.get('/search', searchHandler);

app.get('/TV', tvHandler);

app.get('/reviews', reviewsHandler);

function Movie(id, title, release_date, poster_path, overview){
    this.id = id;
    this.title = title;
    this.release_date = release_date;
    this.overview = overview;
    this.poster_path = poster_path;
}

function movieHandler(req, res){
    let movies = [];
    data.data.map(value=>{
        let oneMovie = new Movie(value.title, value.poster_path, value.overview,);
        movies.push(oneMovie);
        
    });
    return res.status(200).json(movies);
}
function favHandler(req, res){
    res.status(200).send("welcome to favorite page");
}

function trendHandler(req, res){
    let moviesT = [];
    axios.get('https://api.themoviedb.org/3/trending/all/day?api_key=d7b6c540a0400c8b5b5512f2bdb50328').then(value =>{
    value.data.moviesT.forEach(movie => {
        let oneMovie = new Movie(movie.id, movie.title, movie.release_date,movie.poster_path ,movie.overview)
        moviesT.push(oneMovie);
    })
    return res.status(200).json(moviesT)
})
}

function searchHandler(req, res){
    let moviesS = [];
    axios.get('https://api.themoviedb.org/3/search/movie?api_key=d7b6c540a0400c8b5b5512f2bdb50328').then(value =>{
        value.data.moviesS.forEach(movie =>{
            let oneMovie = new Movie(movie.id, movie.title, movie.release_date,movie.poster_path ,movie.overview)
            moviesS.push(oneMovie);
        })
        return res.status(200).json(moviesS);
    })

}

function tvHandler(req, res){
    let moviesTV = [];
    axios.get('https://api.themoviedb.org/3/tv/634649?api_key=d7b6c540a0400c8b5b5512f2bdb50328').then(value =>{
        value.data.moviesTV.forEach(movie =>{
            let oneMovie = new Movie(movie.id, movie.title, movie.release_date,movie.poster_path ,movie.overview)
            moviesTV.push(oneMovie);
        })
        return res.status(200).json();
    })
    
}

function reviewsHandler(req, res){
    let movieR = [];
    axios.get('https://api.themoviedb.org/3/review/634649?api_key=d7b6c540a0400c8b5b5512f2bdb50328').then(value =>{
        value.data.movieR.forEach(movie => {
            let oneMovie = new Movie(movie.id, movie.title, movie.release_date,movie.poster_path ,movie.overview)
            movieR.push(oneMovie);
        })
        return res.status(200).json();
    })
}

app.listen(3000, () => {
    console.log('I am using port 3000');
})










//const jsonData = require("./data.json");

/*app.get('/', helloWorldHandler);

app.get("/recipes", recipesHandler);

function Recipe(title, readyInMinutes, summary, vegetarian, instructions, sourceUrl, image, id){
    this.title = title;
    this.readyInMinutes = readyInMinutes;
    this.summary = summary;
    this.vegetarian = vegetarian;
    this.instructions = instructions;
    this.sourceUrl = sourceUrl;
    this.image = image;
    this.id = id;
}
function helloWorldHandler(req, res){
    return res.status(200).send("Hello World");
};

function recipesHandler(req, res){
    let recipes = [];
    
    jsonData.data.map(value => {
        let oneRecipe = new Recipe(value.title, value.readyInMinutes, value.summary, value.vegetarian, value.instructions, value.sourceUrl, value.image, value.id);
        recipes.push(oneRecipe);
    });

    return res.status(200).json(recipes);
};

app.listen(3000, () => {
    console.log('Listen to port 3000');
})*/