import express from 'express';
import mongoClient from '../util/mongoClient';

const router = express.Router();
const client = mongoClient.get();

router.get('/', (req, res) => {
    const db = client.getDB();
    const query = {};
    const user = db
        .collection('users')
        .findOne(query)
        .toArray();

    res.status(201).json({
        data: user ? user[0] : null,
    });
});

router.post('/', (req, res) => {
    const db = client.getDB();
    const query = {};
    db.collection('users').findOneAndUpdate(
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
});

export default router;
