`use strict`;
const express = require("express");
const app = express();
const data = require("./Movie-Data/data.json");
const axios = require("axios");
const dotenv = require('dotenv');
dotenv.config();
const APIKEY = process.env.APIKEY;
const PORT = process.env.PORT;
const pg = require("pg");
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json()
const DATABASE_URL = process.env.DATABASE_URL;  
const client = new pg.Client(DATABASE_URL);

//app.use(errorHandler);
app.get('/HomePage', movieHandler);
app.get('/FavoritePage', favHandler);
app.get('/trending', trendHandler);
app.get('/search', searchHandler);
app.get('/TV', tvHandler);
app.get('/reviews', reviewsHandler);
app.post("/addmovieslibrary",jsonParser ,addmovieslibraryHandler);
app.get("/getAllMovies", getAllMoviesHan);

app.put("/updatemovie/:id", updatemovieHandler);
app.delete("/deletemovie/:id", deletemovieHandler);
app.get("/getmovie/:id", getmovieHandler);
app.use(express.json());
function Movie(id, title, release_date, poster_path, overview){
    this.id = id;
    this.title = title;
    this.release_date = release_date;
    this.overview = overview;
    this.poster_path = poster_path;
}

function movieHandler(req, res){
        let oneMovie = new Movie(data.title, data.poster_path, data.overview);
    return res.status(200).json(oneMovie);
}

function favHandler(req, res){
    res.status(200).send("welcome to favorite page");
}

//'https://api.themoviedb.org/3/trending/all/day?api_key=d7b6c540a0400c8b5b5512f2bdb50328'
function trendHandler(req, res){
    let moviesT = [];
           
    axios.get('https://api.themoviedb.org/3/trending/all/day?api_key=37ddc7081e348bf246a42f3be2b3dfd0&language=en-US').then(value =>{
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

function addmovieslibraryHandler(req,res){
    let movie = req.body
    const sql = `INSERT INTO movieslibraryTable(title, release_date, overview, poster_path) VALUES ($1, $2, $3, $4) RETURNING * ;`
    let values = [movie.title, movie.release_date, movie.overview, movie.poster_path]
client.query(sql, values).then(() =>{
    return res.status(200).send("Successful");
})
}

function getAllMoviesHan(req, res){
    const sql = `SELECT * FROM movieslibraryTable`;
    client.query(sql).then(data => {
        return res.status(200).json([data]);
    })
}

function updatemovieHandler(req, res){
const id  = req.params.id;
const movie = req.body;
const sql = `UPDATE movieslibraryTable SET title=$1, release_date=$2, poster_path=$3 WHER id=${id} RETURNING *;`
const values = [movie.title, movie.release_date, movie.poster_path];
client.query(sql,values).then(data =>{
   return res.status(200).json(data.rows);

}).catch(error =>{
    errorHandler(error, req, res);
})
};

function deletemovieHandler(req, res){
 const id =req.params.id;
 const sql = `DELETE FROM movieslibraryTable WHERE id=${id};`
 client.query(sql).then(() =>{
     return res.status(204).json([]);
 }).catch(error => {
     errorHandler(error, req, res);
 })
};

function getmovieHandler(req, res){
const id = req.params.id;
const sql = `SELECT * FROM movieslibraryTable WHERE id=${id};`
client.query(sql).then((data) =>{
   return res.status(200).json(data.rows);
}).catch((error) => {
    errorHandler(error, req, res);
})
};

client.connect().then(() =>

app.listen(3000, () => {
    console.log('I am using port 3000');
})
);







