const express = require('express'),
        app = express(),
        pdf = require('express-pdf'),
        axios = require('axios'),
        dotenv = require('dotenv');

dotenv.config();

const port = process.env.PORT || 3000;
const tmdbApiKey = process.env.TMDB_API_KEY;
        
app.use(pdf);


app.get('/movies', function(req, res){
    let data = [];
    let markup = 
        `<html>
            <body>
                <style>
                *{
                    font-family: sans-serif;
                }
                table {
                    margin:0 auto;
                    width:100%;
                }

                table th, table td {
                    padding: 5px;
                    text-align: left;
            }
                
                table td {
                    background-color: #eee;
                }
                table th {
                    background-color: #009;
                    color: #fff;
                }
                table {
                    border-collapse: separate;
                    border-spacing: 5px 10px;
                }                

                </style>
                <table><thead><th>Title</th><th>Release Date</th><th>Vote Average</th></thead>`;
    axios({
        method: 'GET',
        url: `https://api.themoviedb.org/3/movie/popular?api_key=${tmdbApiKey}`,
        headers:{
            accept:'application/json'
        }
        })
        .then(function (response) {
            data = response.data.results;
            data.map(item =>  {
                markup +=`
                    <tr>
                        <td><a href='/movies/${item.id}'>${item.title}</a></td>
                        <td>${item.release_date}</td>
                        <td>${item.vote_average}</td>
                    <tr>`
                
            });
            markup +=`</table></body></html>`
            res.pdfFromHTML({
                filename: 'generated.pdf',
                htmlContent: markup,
            });
    });
});

app.get('/movies/:id', function(req, res){
    let data = [], id = req.params.id;
    let markup = `
        <html>
            <body>
                <style>
                @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
                *{
                    font-family:Poppins;
                    font-style:normal;
                    text-align:center;
                }
                body{
                    margin:20px 0;
                }

                </style>`
    
    ;
    axios({
        method: 'GET',
        url: `https://api.themoviedb.org/3/movie/${id}?api_key=${tmdbApiKey}`,
        headers:{
            accept:'application/json'
        }
        })
        .then(function (response) {
            data = response.data;
            markup += 
            `<h1>${data.title}</h1>
                        <h2>Release Date : ${data.release_date}</h2>
                        <h2>Average vote : ${data.vote_average}</h2>
                        <img src=${"https://image.tmdb.org/t/p/w500" + data.poster_path}}/>`;
                
            markup += '</body></html>'
            res.pdfFromHTML({
                filename: 'generated.pdf',
                htmlContent: markup,
            });
    });
});

app.listen(port)