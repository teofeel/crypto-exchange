const express = require('express');
const bodyParser = require('body-parser')
var views = require('./methods/views')
var controls = require('./methods/controls')

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.get('/orderbook', views.orderbook)
app.get('/order/:id', views.orderByID)

app.post('/order', controls.newOrder)

app.delete('/order/all', controls.delete)

app.listen(8080,()=>{
    console.log('Server is listening on port 8080')
})