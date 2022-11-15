var methode = require('./functions')
var express = require('express')
const bodyParser = require('body-parser')
var fs = require('fs')

var functions = require('./functions')

var orderbookFile = fs.readFileSync('./db/orderbook.json', 'utf-8')
var orderBook = JSON.parse(orderbookFile)

var ordersFile = fs.readFileSync('./db/orders.json', 'utf-8')
var orders = JSON.parse(ordersFile)


exports.newOrder = (req,res)=>{
    try{
        const id = req.body.id;
        const currencyPair = req.body.currencyPair
        const type = req.body.type
        const price = parseFloat(req.body.price)
        const quantity = parseFloat(req.body.quantity)
        
        if(id==undefined || currencyPair == undefined || type == undefined || price == undefined || quantity == undefined)
            throw 'Neuspesna validacija'
            
        let newOrder = {"id": id, "createdDateTime": new Date(), "currencyPair": currencyPair, "type": type, "price": price, "quantity": quantity, "filledQuantity": 0, "orderStatus": "OPEN", "trades": []}

        if(type=='BUY'){
                orders.buyOrders.push(newOrder)
                orders = functions.realizeBuyOrder(newOrder,orders)
        }
        else{
                orders.sellOrders.push(newOrder)
                console.log(1)
                orders = functions.realizeSellOrder(newOrder,orders)
        }
        console.log(1)
    
    
        console.log(orders)
    
        var update = JSON.stringify(orders)
        fs.writeFileSync('./db/orders.json', update)
        res.send(newOrder)
        res.status(201)
    }
    catch(err){
        res.status(400)
    }
   

}

exports.delete = (req,res)=>{
    var newOrdersFile = fs.writeFileSync('./db/orders.json', "[]")
    res.send(200)
    res.status(200)
} 