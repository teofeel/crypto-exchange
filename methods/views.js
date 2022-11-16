var methode = require('./functions')
var express = require('express')
var fs = require('fs')



exports.orderbook = (req,res) => {
    var orderbookFile = fs.readFileSync('./db/orderbook.json', 'utf-8')
    var orderBook = JSON.parse(orderbookFile)
    
    var ordersFile = fs.readFileSync('./db/orders.json', 'utf-8')
    var orders = JSON.parse(ordersFile)

    res.send(orderBook)
    res.status(200)
}

exports.orderByID = (req,res) => {
    var orderbookFile = fs.readFileSync('./db/orderbook.json', 'utf-8')
    var orderBook = JSON.parse(orderbookFile)
    
    var ordersFile = fs.readFileSync('./db/orders.json', 'utf-8')
    var orders = JSON.parse(ordersFile)

    var id = req.params.id
    for(i in orders){
        console.log(orders[i].id)
        if(orders[i].id == id){
            res.status(200)
            res.send(orders[i])
        }
    }
    res.send(400)
}