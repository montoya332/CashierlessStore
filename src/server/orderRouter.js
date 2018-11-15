import express from 'express';
import { MongoClient } from 'mongodb';
var router = express.Router();
//const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const url = 'mongodb://admin:admin12345@ds145981.mlab.com:45981/shopez';

router.post('/postOrder', function(req, res, next) {
    console.log(req);

    MongoClient.connect(
        url,
        function(err, client) {
            assert.equal(null, err);
            console.log(err);
            console.log('Connected successfully to server');

            var query = {
                email: req.body.email,
                active: 'yes',
            };

            var query1 = {
                email: req.body.email,
                active: 'yes',
                items: [],
            };
            const db = client.db('shopez');
            //One time
            // db.collection("orders").insertOne({
            //     email: req.body.email,
            //     active: 'yes',
            //     items: req.body.items
            // }, function(err){
            //
            //     if(err){
            //         res.status(401).json({
            //              status: 'false'
            //         })
            //     }
            //     else{
            //         res.status(201).json({
            //             status: 'true'
            //         })
            //     }
            //  client.close
            // });

            //Again and again
            db.collection('orders').findOne(query, function(err, user) {
                console.log('USER');
                console.log(user);
                console.log(err);

                if (user == null) {
                    console.log('create and update');
                    db.collection('orders').insertOne(query1, function(err, result) {
                        console.log('Created new collection');
                    });

                    db.collection('orders').updateOne(
                        query,
                        { $push: { items: { $each: req.body.items } } },
                        function(err) {
                            console.log('Updating');
                            console.log(req.body.items);
                            if (err) {
                                console.log(err);
                                res.status(401).json({
                                    status: 'false',
                                });
                            } else {
                                console.log('works');
                                res.status(201).json({
                                    status: 'true',
                                });
                                //console.log("1 document updated");
                            }
                        }
                    );
                    client.close();
                } else {
                    console.log('update');
                    db.collection('orders').updateOne(
                        query,
                        { $push: { items: { $each: req.body.items } } },
                        function(err) {
                            console.log(req.body.items);
                            if (err) {
                                console.log(err);
                                res.status(401).json({
                                    status: 'false',
                                });
                            } else {
                                console.log('works');
                                res.status(201).json({
                                    status: 'true',
                                });
                                //console.log("1 document updated");
                            }
                        }
                    );
                    client.close();
                }
            });
        }
    );
});

export default router;
