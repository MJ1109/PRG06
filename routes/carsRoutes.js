let express = require('express');
let Car = require('../models/carModel');

let routes = function() {
    //maak router aan
    let carsRouter = express.Router();

    carsRouter.route('/cars')

        .post(function (req, res){
            res.header("Acces-Control_Allow-Origin", "*");
            res.header("Acces-Control_Allow-Origin", "Origin, X-Requested-With, Content-Type, Accept");

            //give accept header to response
            res.header("Accept", "application/json, application/x-www-form-urlencoded")

            //check if the request is json
            if (!req.is('application/json', 'application/x-www-form-urlencoded')) {
                res.status(406).send("406 - Not Acceptable");
            } else{
                //check if the requested body = empty
                if (Object.keys(req.body).length === 0){
                    res.status(422).send("422 - Unprocessable Entity")
                } else{
                    let car = new Car (req.body);
                    car.save(function (err){
                        res.status(201).send(car);
                    })
                }
            } 
            
        })

        .get(function(req, res){ //haal de hele collectie op
            console.log("get op collectie")
            res.header("Acces-Control_Allow-Origin", "*");
            res.header("Acces-Control_Allow-Origin", "Origin, X-Requested-With, Content-Type, Accept");
            res.header("Accept", "application/json, application/x-www-form-urlencoded");

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
            res.header("Accept", "application/json", "application/x-www-form-urlencoded");
            res.header("Acces-Control_Allow-Origin", "*");
            res.header("Acces-Control_Allow-Origin", "Origin, X-Requested-With, Content-Type, Accept");
            res.header("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
            res.header("Allow", "GET,POST,OPTIONS").send();
        });

        //detail weergave
    carsRouter.route('/cars/:carId')
        .get(function(req, res){

            console.log("De get op de details start hier");

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
                    console.log(carDetails);

                    res.json(carDetails);
                }
            }).orFail()
        })

        .put (function(req, res){
            console.log("De put start hier");

            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            res.header("Accept", "application/json, application/x-www-form-urlencoded");

            if (req.body.title =="" || req.body.class =="" || req.body.year =="" || req.body.fuel =="" || req.body.power==""){
                console.log("A field is empty!");
                res.status(422).end();          
            } 
            else 
            {
                Car.findByIdAndUpdate(req.params.carId, req.body , function(err, car){
                    if (err) {
                        res.status(400).send(err);
                    } 
                    else
                    {
                        car.save(function(err){
                            if (err) { 
                                res.status(400).send(err) 
                            }
                            else 
                            { 
                                res.status(200).json(req.body)
                            }
                        });
                    }
                }).orFail();
            }
        })

        .delete (function(req, res){

            console.log("Nu bezig met delete");

           //show what it needs to delete
            console.log(`DELETE on api/cars/${req.params.carId}`);

            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            res.header("Accept", "application/json, application/x-www-form-urlencoded");

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

            console.log("Options tes op detailresource");

            res.header("Accept", "application/json", "application/x-www-form-urlencoded");
            res.header("Acces-Control_Allow-Origin", "*");
            res.header("Acces-Control_Allow-Origin", "Origin, X-Requested-With, Content-Type, Accept");
            res.header("Allow", "GET,OPTIONS,PUT,DELETE");
            res.header("Access-Control-Allow-Methods", "GET,PUT,DELETE,OPTIONS").send();
        });

    return carsRouter;   
}

module.exports = routes;