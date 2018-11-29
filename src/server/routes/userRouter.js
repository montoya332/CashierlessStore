import express from 'express';
import mongoClient from '../util/mongoClient';

const router = express.Router();

router.get('/', (req, res) => {
    const email = req.query ? req.query.email : '';
    if (!email) {
        return res.send({ error: 'missing email' });
    }
    mongoClient.getDB((err, client, db) => {
        const query = { email };
        db.collection('users').findOne(query, (err, result) => {
            if (err) return res.send({ error: err });
            res.status(201).json(result);
        });

        client.close();
    });
});
router.post('/', (req, res) => {
    const query = req.body || {};
    if (query.email) {
        mongoClient.getDB((err, client, db) => {
            db.collection('users').insertOne(query, (err, result) => {
                if (err) return res.send({ error: err });
                res.status(201).json(result);
            });

            client.close();
        });
    }
    res.status(201).json({
        data: null,
    });
});
router.put('/', (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.send({ error: 'missing email' });
    }
    mongoClient.getDB((err, client, db) => {
        const query = { email };
        db.collection('users').findOneAndUpdate(query, { $set: req.body }, (err) => {
            if (err) return res.send({ error: err });
            res.status(201).json(req.body);
        });

        client.close();
    });
});

export default router;
