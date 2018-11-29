import express from 'express';
import { MongoClient } from 'mongodb';
const router = express.Router();
const assert = require('assert');

const url = 'mongodb://admin:admin12345@ds145981.mlab.com:45981/shopez';

router.post('/getOrder', (req, res) => {
    MongoClient.connect(
        url,
        (err, client) => {
            assert.equal(null, err);
            console.log('Connected successfully to server');

            const db = client.db('shopez');
            const query = {
                email: req.body.email,
                active: 'yes',
            };

            db.collection('orders')
                .find(query)
                .toArray((err, result) => {
                    if (err) throw err;
                    res.status(201).json({
                        items: result[0].items,
                    });
                });

            client.close();
        }
    );
});

router.post('/postOrder', (req, res) => {
    console.log(req);

    MongoClient.connect(
        url,
        (err, client) => {
            assert.equal(null, err);
            console.log(err);
            console.log('Connected successfully to server');

            const query = {
                email: req.body.email,
                active: 'yes',
            };

            const query1 = {
                email: req.body.email,
                active: 'yes',
                items: [],
            };
            const db = client.db('shopez');

            //Again and again
            db.collection('orders').findOne(query, (err, user) => {
                console.log('USER');
                console.log(user);
                console.log(err);

                if (!user) {
                    console.log('create and update');
                    db.collection('orders').insertOne(query1, (err, result) => {
                        console.log('Created new collection', result);
                    });

                    db.collection('orders').updateOne(
                        query,
                        { $push: { items: { $each: req.body.items } } },
                        (err) => {
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
                        (err) => {
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

router.get('/getPrice', (req, res) => {
    MongoClient.connect(
        url,
        (err, client) => {
            assert.equal(null, err);
            console.log('Connected successfully to server');

            const db = client.db('shopez');
            const query = {
                pname: req.body.pname,
            };

            db.collection('items')
                .find(query)
                .toArray((err, result) => {
                    if (err) throw err;
                    res.status(201).json({
                        price: result[0].price,
                    });
                });

            client.close();
        }
    );
});

export default router;
