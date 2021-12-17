let express = require('express');
let Car = require('../models/carModel');

let routes = function() {
    //maak router aan
    let carsRouter = express.Router();

    carsRouter.use((req, res, next) => {
        if (req.headers.accept == "application/json"){
            next()
        } else {
            res.status(400).send()
        }
    })

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

        // .put (function(req, res){
        //     console.log("De put start hier");

        //     res.header("Access-Control-Allow-Origin", "*");
        //     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        //     res.header("Accept", "application/json, application/x-www-form-urlencoded");

        //     if (req.body.title =="" || req.body.class =="" || req.body.year =="" || req.body.fuel =="" || req.body.power==""){
        //         console.log("A field is empty!");
        //         res.status(422).end();          
        //     } 
        //     else 
        //     {
        //         Car.findByIdAndUpdate(req.params.carId, req.body , function(err, car){

        //             if (err) {
        //                 res.status(400).send(err);
        //             } 
        //             else
        //             {
        //                 car.save(function(err){
        //                     if (err) { 
        //                         res.status(400).send(err) 
        //                     }
        //                     else 
        //                     { 
        //                         res.status(200).json(req.body)
        //                         console.log(car);
        //                     }
        //                 });
        //             }
        //         }).orFail();
        //     }
        // })
        //  .put (async function(req, res){
        //     console.log("De put start hier");

        //     currentCar = await Car.findById(req.params.carId)
        //     res.header("Access-Control-Allow-Origin", "*");
        //     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        //     res.header("Accept", "application/json, application/x-www-form-urlencoded");

        //     if (currentCar == null){
        //         console.log('car is null')
        //         res.status(404).json({message: "car not found"})
        //     }
        //     console.log(currentCar)

        //     if (req.body.title != null){
        //         console.log(req.body.title);
        //         currentCar.title = req.body.title
        //     }
        //     if (req.body.class != null){
        //         currentCar.class = req.body.class
        //     }
        //     if (req.body.year != null){
        //         currentCar.year = req.body.year
        //     }
        //     if (req.body.fuel != null){
        //         currentCar.fuel = req.body.fuel
        //     }
        //     if (req.body.power != null){
        //         currentCar.power = req.body.power
        //     }

        //     try {
        //         const updatedCar = await currentCar.save()
        //         console.log(updatedCar);
        //         res.status(200).json(req.body.toJSON)
        //     } catch (err) {
        //         res.status(400).json({ message: err.message })
        //     }
        // })

    //    ' // .delete (function(req, res){

        //     console.log("Nu bezig met delete");

        //    //show what it needs to delete
        //     console.log(`DELETE on api/cars/${req.params.carId}`);

        //     res.header("Access-Control-Allow-Origin", "*");
        //     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        //     res.header("Accept", "application/json, application/x-www-form-urlencoded");

        //     Car.findOneAndDelete({_id : req.params.carId}, function (err, car) {
        //         if (err) {
        //             res.status(400).send(err);
        //         }
        //         else
        //         {
        //             res.status(204).json(car);
        //         }
        //     }).orFail()
        // })
                // DELETE request
                // .delete(function(req, res) {
                //     console.log(`DELETE on api/cars/${req.params.carId}`);
                //     console.log( req.params.carId);
        
                //     res.header("Access-Control-Allow-Origin", "*");
                //     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        
                //     Car.findByIdAndDelete(req.params.carId, function (err, car) {
                //         if (err) {
                //             res.status(404).send(err);
                //         }
                //         else
                //         {
                //             res.status(204).json(car);
                //         }
                //     }).orFail()
                // })

                .put(getCar, async function(req, res){


                    if (req.body.title != null){
                         res.car.title = req.body.title
                    }
                    if (req.body.class != null){
                        res.car.class = req.body.class
                    }
                    if (req.body.year != null){
                        res.car.year = req.body.year
                    }
                    if (req.body.fuel != null){
                        res.car.fuel = req.body.fuel
                    }
                    if (req.body.power != null){
                        res.car.power = req.body.power
                    }
        
                    try {
                        const updatedCar = await currentCar.save()
                        res.status(200).json(updatedCar)
                    } catch (err) {
                        res.status(400).json({ message: err.message })
                    }
                })

                .delete(getCar, async function(req, res){
                    try {
                        await res.car.remove()
                        res.status(204).json({ message: 'car successfully deleted' })
                    } catch (err) {
                        res.send(500).json({ message: err.message})
                    }
                }) 
                
                .options(function(req, res){

                    console.log("Options tes op detailresource");
        
                    res.header("Accept", "application/json", "application/x-www-form-urlencoded");
                    res.header("Acces-Control_Allow-Origin", "*");
                    res.header("Acces-Control_Allow-Origin", "Origin, X-Requested-With, Content-Type, Accept");
                    res.header("Allow", "GET,OPTIONS,PUT,DELETE");
                    res.header("Access-Control-Allow-Methods", "GET,PUT,DELETE,OPTIONS").send();
                });
                
                async function getCar (req, res, next){
                    let car
                    try {
                            car = await Car.findById(req.params.id)
                            if(car == null){
                                return res.status(404).json({
                                    message: "Car not found"
                                })
                            }        
                    } catch (err) {
                        return res.status(500).json({ message: err.message})
                    }
                    res.car = car
                    next()
                }

    return carsRouter;   
}

module.exports = routes;