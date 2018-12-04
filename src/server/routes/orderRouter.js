import express from 'express';
import { MongoClient } from 'mongodb';
const router = express.Router();
const assert = require('assert');

const url = 'mongodb://admin:admin12345@ds145981.mlab.com:45981/shopez';
const products = {
    Banana: 1.1,
    Apple: 1.25,
    Orange: 1.05,
    Human: 150,
    Plant: 20,
};

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
                    const items = result[0].items.map((item) => {
                        return { ...item, price: products[item.Name] };
                    });

                    const fItems = items.filter((item) => item.price);
                    res.status(201).json({
                        items: fItems,
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

router.post('/updateActive', (req, res) => {
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
            const newvalues = { $set: { active: 'no' } };
            db.collection('orders').updateOne(query, newvalues, (err, result) => {
                if (err) throw err;
                console.log('1 document updated', result);
                res.status(201).json({
                    status: 'true',
                    result,
                });
                client.close();
            });
        }
    );
});

router.post('/getUserCard', (req, res) => {
    MongoClient.connect(
        url,
        (err, client) => {
            assert.equal(null, err);
            console.log('Connected successfully to server');

            const db = client.db('shopez');
            const query = {
                email: req.body.email,
            };

            db.collection('users')
                .find(query)
                .toArray((err, result) => {
                    console.log(result[0].card_details);
                    if (err) throw err;
                    if (result[0].card_details === undefined) {
                        res.status(201).json({
                            status: false,
                        });
                    } else {
                        res.status(201).json({
                            status: true,
                        });
                    }
                });

            client.close();
        }
    );
});

router.post('/confirmClick', (req, res) => {
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

            const db = client.db('shopez');

            //Again and again
            db.collection('orders').findOne(query, (err, user) => {
                console.log('USER');
                console.log(user);
                console.log(err);

                if (!user) {
                    res.status(201).json({
                        status: false,
                    });
                    client.close();
                } else {
                    res.status(201).json({
                        status: true,
                    });
                    client.close();
                }
            });
        }
    );
});

router.post('/getOrderHistory', (req, res) => {
    MongoClient.connect(
        url,
        (err, client) => {
            assert.equal(null, err);
            console.log('Connected successfully to server');

            const db = client.db('shopez');
            const query = {
                email: req.body.email,
            };

            db.collection('orders')
                .find(query)
                .toArray((err, result) => {
                    if (err) throw err;
                    const items = result[0].items.map((item) => {
                        return { ...item, price: products[item.Name] };
                    });

                    const fItems = items.filter((item) => item.price);
                    res.status(201).json({
                        items: fItems,
                    });
                });

            client.close();
        }
    );
});

export default router;
