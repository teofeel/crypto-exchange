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

    var id = parseFloat(req.params.id)
    for(i in orders.buyOrders){
        console.log(orders.buyOrders[i].id)
        if(orders.buyOrders[i].id == id){
            res.status(200).send(orders.buyOrders[i])
            return
        }
    }
    for(i in orders.sellOrders){
        console.log(orders.sellOrders[i].id)
        if(orders.sellOrders[i].id == id){
            res.status(200).send(orders.sellOrders[i])
            return
        }
    }
    res.sendStatus(400)
}