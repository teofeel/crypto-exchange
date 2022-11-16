var methode = require('./functions')
var express = require('express')
const bodyParser = require('body-parser')
var fs = require('fs')
const { isDeepStrictEqual } = require('util')
const { newOrder } = require('./controls')

var orderbookFile = fs.readFileSync('./db/orderbook.json', 'utf-8')
var orderBook = JSON.parse(orderbookFile)

var tradeFile = fs.readFileSync('./db/trades.json', 'utf-8')
var trades = JSON.parse(tradeFile)

exports.addToorderBook = (price,quantity, type)=>{
    if(type=='BUY'){
        let ob = {"price":price, "quantity": quantity}
        for(i in orderBook.buyOrders){
            if(price == orderBook.buyOrders[i].price){
                orderBook.buyOrders[i].quantity+=quantity
            }
            else
                orderBook.buyOrders.push(ob)
        }
    }
    else{
        let ob = {"price":price, "quantity": quantity}
        for(i in orderBook.sellOrders){
            if(price == orderBook.sellOrders[i].price){
                orderBook.sellOrders[i].quantity+=quantity
            }
            else
                orderBook.sellOrders.push(ob)
        }
    }

    let update = JSON.stringify(orderBook)
    fs.writeFileSync('./db/orderbook.json', update)
}

updateOrderBook = (orders)=>{
    //radi

    var newBuys = new Array()
    for(i in orders.buyOrders){
        if(newBuys.find(nb=>nb.price==orders.buyOrders[i].price)==null){
            newBuys.push({"price":orders.buyOrders[i].price,"quantity":orders.buyOrders[i].quantity})
        }
        else{
            let buy = newBuys.findIndex(nb => nb.price == orders.buyOrders[i].price)
            newBuys[buy].quantity+=orders.buyOrders[i].quantity
        }
        
    }

    var newSells = new Array()
    for(i in orders.sellOrders){
        if(newSells.find(nb=>nb.price==orders.sellOrders[i].price)==null){
            newSells.push({"price":orders.sellOrders[i].price,"quantity":orders.sellOrders[i].quantity})
        }
        else{
            let buy = newSells.findIndex(nb => nb.price == orders.sellOrders[i].price)
            newSells[buy].quantity+=orders.sellOrders[i].quantity
        }
    }

    for(i in newSells){
        if(newBuys.find(nb=>nb.price==newSells[i].price)==null){
            break
        }
        else{
            if(newBuys.find(nb => nb.price == newSells[i].price && nb.quantity > newSells[i].quantity)){
                var m = newBuys.findIndex(nb => nb.price == newSells[i].price)
                newBuys[m].quantity-=newSells[i].quantity
                delete newSells[i]
                break
            }
            else if(newBuys.find(nb => nb.price == newSells[i].price && nb.quantity < newSells[i].quantity)){
                var m = newBuys.findIndex(nb => nb.price == newSells[i].price)
                newSells[i].quantity-=newBuys[m].quantity
                delete newBuys[m]
                break
            }
            else{
                var m = newBuys.findIndex(nb => nb.price == newSells[i].price)
                delete newBuys[m]
                delete newSells[i]
                break
            }
        }
        
    }

    const sells = newSells.filter(element => { return element !== null;});
    const buys = newBuys.filter(element => { return element !== null;});


    var newOrderBook = {"buyOrders":buys, "sellOrders":sells}


    var update = JSON.stringify(newOrderBook)
    fs.writeFileSync('./db/orderbook.json', update)

    return

}

sortOrders = (orders)=>{
    buyOrders = orders.buyOrders
    sellOrders = orders.sellOrders

    buyOrders.sort((a,b)=>{
        return parseFloat(b.price)-parseFloat(a.price)
    })

    buyOrders.sort((a,b)=>{
        return b.date-a.date
    })

    sellOrders.sort((a,b)=>{
        return parseFloat(a.price)-parseFloat(b.price)
    })

    sellOrders.sort((a,b)=>{
        return b.date-a.date
    })
    
    orders.buyOrders = buyOrders
    orders.sellOrders = sellOrders

    return orders
}

updateTrades = (trade)=>{
    trades.push(trade)

    var update = JSON.stringify(trades)
    fs.writeFileSync('./db/trades.json', update)
}

exports.realizeBuyOrder = (order,orders)=>{
    orders = sortOrders(orders)
    
    for(i in orders.sellOrders){
        if(orders.sellOrders[i].orderStatus=='OPEN' && orders.sellOrders[i].price<=order.price){
            if((order.quantity-order.filledQuantity) < (orders.sellOrders[i].quantity - orders.sellOrders[i].filledQuantity)){
                //ova radi
                
                orders.sellOrders[i].filledQuantity += order.quantity-order.filledQuantity 


                let buyTrade = {"id": Math.random(300),"buyOrderId": order.id,"sellOrderId": orders.sellOrders[i].id,"timestamp": Date.now(),"price": orders.sellOrders[i].price,"quantity": order.quantity-order.filledQuantity}

                order.filledQuantity=order.quantity
                order.orderStatus='CLOSED'
                
                order.trades.push(buyTrade)
                updateTrades(buyTrade)
                //orders.sellOrders[i].trades.push(sellTrade)

                
                break
            }
            
            else if((order.quantity-order.filledQuantity) == (orders.sellOrders[i].quantity - orders.sellOrders[i].filledQuantity)){
               //ova radi
               console.log(3)
                order.filledQuantity=order.quantity
                order.orderStatus='CLOSED'
                
                orders.sellOrders[i].filledQuantity = orders.sellOrders[i].quantity
                orders.sellOrders[i].orderStatus = 'CLOSED'
                
                let buyTrade = {"id": Math.random(300),"buyOrderId": order.id,"sellOrderId": orders.sellOrders[i].id,"timestamp": Date.now(),"price": orders.sellOrders[i].price,"quantity": order.quantity-order.filledQuantity}
                

                order.trades.push(buyTrade)
                updateTrades(buyTrade)
                //orders.sellOrders[i].trades.push(sellTrade)

                
                break
            }
            else if((order.quantity-order.filledQuantity)>(orders.sellOrders[i].quantity - orders.sellOrders[i].filledQuantity)){
                //ova radii
                
                order.filledQuantity += orders.sellOrders[i].quantity - orders.sellOrders[i].filledQuantity

                orders.sellOrders[i].filledQuantity = orders.sellOrders[i].quantity
                orders.sellOrders[i].orderStatus = 'CLOSED'

                let buyTrade = {"id": Math.random(300),"buyOrderID": order.id,"sellOrderID": orders.sellOrders[i].id,"timestamp": Date.now(), "price": orders.sellOrders[i].price,"quantity": orders.sellOrders[i].quantity-orders.sellOrders[i].filledQuantity}
                
            

                order.trades.push(buyTrade)
                updateTrades(buyTrade)
                //orders.sellOrders[i].trades.push(sellTrade)
                

                continue
            }
        }
    }
    updateOrderBook(orders)
    return orders
}

exports.realizeSellOrder = (order,orders)=>{
    orders = sortOrders(orders)
    for(i in orders.buyOrders){
        if(orders.buyOrders[i].orderStatus=='OPEN' && orders.buyOrders[i].price>=order.price){

            if((order.quantity-order.filledQuantity) < (orders.buyOrders[i].quantity - orders.buyOrders[i].filledQuantity)){
                //ova radi

                orders.buyOrders[i].filledQuantity += order.quantity-order.filledQuantity 

                
                let sellTrade = {"id": Math.random(300),"buyOrderID": orders.buyOrders[i].id,"sellOrderID": order.id,"timestamp": Date.now(), "price": orders.buyOrders[i].price,"quantity": order.quantity-order.filledQuantity}
                
                order.filledQuantity=order.quantity
                order.orderStatus='CLOSED'

                
            

                order.trades.push(sellTrade)
                updateTrades(sellTrade)
                //orders.sellOrders[i].trades.push(buyTrade)

                
                break
            }
            
            else if((order.quantity-order.filledQuantity) == (orders.buyOrders[i].quantity - orders.buyOrders[i].filledQuantity)){
                //ova radi

                order.filledQuantity=order.quantity
                order.orderStatus='CLOSED'
                
                orders.buyOrders[i].filledQuantity = orders.buyOrders[i].quantity
                orders.buyOrders[i].orderStatus = 'CLOSED'
                
                
                let sellTrade = {"id": Math.random(300),"buyOrderID": orders.buyOrders[i].id,"sellOrderID": order.id,"timestamp": Date.now(), "price": orders.buyOrders[i].price,"quantity": order.quantity}
                
                order.trades.push(sellTrade)
                updateTrades(sellTrade)
                //orders.buyOrders[i].trades.push(buyTrade)
                
                
                break
            }
            else if((order.quantity-order.filledQuantity)>(orders.buyOrders[i].quantity - orders.buyOrders[i].filledQuantity)){
                //ova radi

                order.filledQuantity += orders.buyOrders[i].quantity - orders.buyOrders[i].filledQuantity

                
                let sellTrade = {"id": Math.random(300),"buyOrderID": orders.buyOrders[i].id,"sellOrderID": order.id,"timestamp": Date.now(), "price": orders.buyOrders[i].price,"quantity": orders.buyOrders[i].quantity - orders.buyOrders[i].filledQuantity}

                orders.buyOrders[i].filledQuantity = orders.buyOrders[i].quantity
                orders.buyOrders[i].orderStatus = 'CLOSED'
      
                order.trades.push(sellTrade)
                updateTrades(sellTrade)
                //orders.buyOrders[i].trades.push(buyTrade)
                

                continue
            }
        }
    }

    updateOrderBook(orders)
    return orders

    
}




