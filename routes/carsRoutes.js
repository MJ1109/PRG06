let express = require('express');
let Car = require('../models/carModel');

let routes = function() {
    //maak router aan
    let carsRouter = express.Router();

    carsRouter.route('/cars')

        .post(function (req, res){
            res.header("Acces-Control_Allow-Origin", "*");
            res.header("Acces-Control_Allow-Origin", "Origin, X-Requested-With, Content-Type, Accept");

            //gice accept header to response
            res.header("Accept", "application/json, application/x-www-form-urlencoded")

            //check if the request is json
            if (!req.is('application/json', 'application/x-www-form-urlencoded')) {
                res.status(406).send("406 - Not Acceptable");
            }else{
                //check if the requested body = empty
                if (Object.keys(req.body).length === 0){
                    res.status(422).send("422 - Unprocessable Entity")
                } else{
                    let car = new Car (req.body);
                }

            car.save(function (err){
                res.status(201).send(car);
            })
                
            } 
            
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
                            "self" : {"href":"http://" +req.headers.host + "/api/cars/"},
                            "collection": {"href":"http://" +req.headers.host + "/api/cars"}
                        },
                        "pagination":{"message": "dit moet nog gedaan worden!" }
                    }
                    for(let car of cars){
                        console.log(car)
                        let carItem = car.toJSON()

                        carItem._links={
                            "self" : {"href":"http://" +req.headers.host + "/api/cars/" + carItem._id},
                            "collection": {"href":"http://" +req.headers.host + "/api/cars/"}
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

        //detail weergave
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
                    let carDetails = {
                        "item" : car[0],
                        "_links" : {
                            "self" : { "href" : `http://${req.headers.host}/api/cars/${req.params.carId}` },
                            "collection" : { "href" : `http://${req.headers.host}/api/cars` }
                        }
                    };

                    res.json(carDetails);
                }
            }).orFail()
        })

        .delete (function(req, res){
           //show what it needs to delete
            console.log(`DELETE on api/cars/${req.params.carId}`);

            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

            Car.findOneAndDelete({_id : req.params.carId}, function (err, car) {
                if (err) {
                    res.status(400).send(err);
                }
                else
                {
                    res.status(204).json(car);
                }
            }).orFail()
        })

        .options(function(req, res){
            res.header("Accept", "application/json", "application/x-www-form-urlencoded");
            res.header("Acces-Control_Allow-Origin", "*");
            res.header("Acces-Control_Allow-Origin", "Origin, X-Requested-With, Content-Type, Accept");
            res.header("Allow", "GET, POST, OPTIONS, PUT, DELETE").send();
        });

    return carsRouter;   
}

module.exports = routes;