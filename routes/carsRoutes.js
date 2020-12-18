let express = require('express');
let Car = require('../models/carModel');

let routes = function() {
    //maak router aan
    let carsRouter = express.Router();

        // carsRouter.use('/', function (req, res, next){
        //     console.log("middleware voor de collectie")
        //     let acceptType = req.get("Accept")
        //     console.log("Accept:"+acceptType)

        //     if (acceptType == "application/json"){
        //         next() 
        //     } else {
        //         res.status(404).send();
        //     }                
            
        // });

    carsRouter.route('/cars')

        .post(function (req, res){
            //maak nieuwe car aan 
            let car = new Car (req.body);

            car.save(function (err){
                res.status(201).send(car);
            })
        })
        .get(function(req, res){ //haal de hele collectie op
            console.log("get op collectie")

            res.header("Acces-Control_Allow-Origin", "*");
            res.header("Acces-Control_Allow-Origin", "Origin, X-Requested-With, Content-Type, Accept");

            //find all the cars
            Car.find({}, function (err, cars){
                if (err){
                    res.status(500).send(err);
                }  else if (!req.header('Accept').includes("application/json") && !req.header('Accept').includes("text/html")) {
                    res.status(422).send("422 - Unprocessable Entity");
                }else{
                    carsCollection ={
                        "items":[],
                        "_links":{
                            "self" : {"href":"http://" +req.headers.host + "/api/cars"},
                            "collection": {"href":"http://" +req.headers.host + "/api/cars"}
                        },
                        "pagination":{"message": "dit moet nog gedaan worden!" }
                    }
                    for(let car of cars){
                        console.log(car)
                        let carItem = car.toJSON()

                        carItem._links={
                            "self" : {"href":"http://" +req.headers.host + "/api/cars" + carItem._id},
                            "collection": {"href":"http://" +req.headers.host + "/api/cars"}
                        }

                        carsCollection.items.push(carItem)
                    }
                    res.json(carsCollection);
                }
            })
        })
        .options(function(req, res){
            res.header("Allow", "GET,POST,OPTIONS").send();
        });

    carsRouter.route('/cars/:carId', async(req, res)=>{
        try{
            const note = await Car.findById(req.params.carId);
            res.json(car);
        } catch (err){
            res.status(404).send(err);
        }
    })
        
        .get(function(req, res){
            Car.find({_id : req.params.carId},function(err, car){
                if (err){
                    res.status(500).send(err);
                }else{
                    res.json(car);
                }
            })
        })

        .options(function(req, res){
            res.header("Allow", "GET, POST, OPTIONS").send();
        });

    return carsRouter;   
}

module.exports = routes;