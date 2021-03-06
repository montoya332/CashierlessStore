// baseUrl = '/api/rekognition'
import { Router } from 'express';
import multer from 'multer';
import mongoClient from '../util/mongoClient';
const fs = require('fs-extra');
const AWS = require('aws-sdk');
export const EMAILCOOKIE = 'userEmail';
let config = {
    accessKeyId: '',
    secretAccessKey: '',
    region: 'us-west-2',
    collectionName: 'collectionname',
    bucketName: 'sjsucmpe280',
};
try {
    config = require('../../../config.json');
} catch {
    console.log('missing config file');
}
AWS.config.update(config);
const rekognition = new AWS.Rekognition();
const s3 = new AWS.S3();
const router = Router();
const storage = multer.diskStorage({
    destination: './uploads',
    filename(req, file, cb) {
        cb(null, `${new Date()}-${file.originalname}`);
    },
});
const upload = multer({ storage });
router.get('/signout', (req, res) => {
    res.cookie(EMAILCOOKIE, '', { maxAge: 900000 }).send({ userId: '' });
});
router.get('/refresh', (req, res) => {
    const deleteCollection = req.query ? req.query.deleteCollection : '';
    const params = {
        CollectionId: config.collectionName,
    };
    if (deleteCollection) {
        rekognition.deleteCollection(params, () => {
            rekognition.createCollection(params);
            res.cookie(EMAILCOOKIE, '', { maxAge: 900000 }).send({ userId: '' });
        });
    } else {
        rekognition.createCollection(params, () => {
            rekognition.createCollection(params);
            res.cookie(EMAILCOOKIE, '', { maxAge: 900000 }).send({ userId: '' });
        });
    }
});
router.post('/searchFacesByImage', upload.single('file'), (req, res) => {
    const callback = (err, data) => {
        if (err) {
            res.cookie(EMAILCOOKIE, '', { maxAge: 900000 }).send(err);
        } else {
            if (data.FaceMatches && data.FaceMatches.length > 0 && data.FaceMatches[0].Face) {
                const face = data.FaceMatches[0].Face;

                mongoClient.getDB((err, client, db) => {
                    const query = { userId: face.ExternalImageId };
                    db.collection('users').findOne(query, (err, result) => {
                        if (err || !result) return res.send({ error: err });
                        res.cookie(EMAILCOOKIE, result.email, { maxAge: 900000 }).send({
                            ...face,
                            img: getImageUrl(face.ExternalImageId),
                            userId: face.ExternalImageId,
                            ...result,
                        });
                    });

                    client.close();
                });
            } else {
                res.cookie(EMAILCOOKIE, '', { maxAge: 900000 }).send({ error: 'Not recognized' });
            }
        }
    };
    const file = req.file;
    let bitmap;
    if (file) {
        bitmap = fs.readFileSync(file.path);
        searchFacesByImage(bitmap, callback);
    } else {
        let base64Data = req.body.file.replace(/^data:image\/png;base64,/, '');
        base64Data = base64Data.replace(/^data:image\/jpeg;base64,/, '');
        const filePath = './uploads/searchFacesByImage-' + new Date().getTime() + '.png';
        fs.writeFile(filePath, base64Data, 'base64', (err) => {
            if (err) return res.send({ error: err });
            bitmap = fs.readFileSync(filePath);
            searchFacesByImage(bitmap, callback);
        });
    }
});
router.post('/signup', upload.single('file'), (req, res) => {
    const { email, file } = req.body;
    const user = false; //TODO: DB user exist
    if (!email || !file) {
        res.status(200).json({ msg: 'Missing User Data' });
    } else if (user) {
        res.status(200).json({ msg: 'Looks like you have an account already' });
    } else {
        const fileName = 'users-' + email + '-' + new Date().getTime() + '.png';
        saveImage(fileName, file, ({ err, bitmap }) => {
            if (err) return res.status(200).json({ err });
            const userId = email.replace(/[^a-zA-Z0-9 ]/g, '');
            indexFace({ bitmap, email, userId }, (err) => {
                err && res.status(200).json({ err: 'Looks like you have an account already' });
                mongoClient.getDB((err, client, db) => {
                    db.collection('users').findOne({ userId }, (err, result) => {
                        if (err || !result) {
                            db.collection('users').insertOne(
                                { email, userId, faceId: userId },
                                (err) => {
                                    client.close();
                                    if (err) {
                                        res.send({ err: err });
                                    }
                                    res.cookie(EMAILCOOKIE, email, { maxAge: 900000 })
                                        .status(201)
                                        .json({ email, userId, faceId: userId });
                                }
                            );
                        } else {
                            client.close();
                            res.cookie(EMAILCOOKIE, result.email, { maxAge: 900000 })
                                .status(201)
                                .json(result);
                        }
                    });
                });
            });
        });
    }
});

router.post('/detectLabels', upload.single('file'), (req, res) => {
    const file = req.file;
    const meta = req.body;
    console.log(meta);
    let bitmap;
    if (file) {
        bitmap = fs.readFileSync(file.path);
        detectLabels(bitmap, (err, data) => {
            if (err) {
                res.status(500).json(err);
            }
            res.status(200).json(data);
        });
    } else {
        let base64Data = req.body.file.replace(/^data:image\/png;base64,/, '');
        base64Data = base64Data.replace(/^data:image\/jpeg;base64,/, '');
        const filePath = './uploads/detectLabels-' + new Date().getTime() + '.png';
        fs.writeFile(filePath, base64Data, 'base64', (err) => {
            if (err) return res.send({ error: err });
            bitmap = fs.readFileSync(filePath);
            detectLabels(bitmap, (err, data) => {
                if (err) {
                    res.status(500).json(err);
                }
                res.status(200).json(data);
            });
        });
    }
});
router.get('/getObject', (req, res) => {
    const file = 'arturo_montoya.jpg'; //TODO: req.file
    s3.getObject({ Bucket: config.bucketName, Key: file }, (error, data) => {
        if (error !== null) {
            res.status(500).json({ error: 'Failed to retrieve an object: ' + error });
        }
        res.send(data);
    });
});
function detectLabels(bitmap, callback = () => {}) {
    rekognition.detectLabels(
        {
            Image: {
                Bytes: bitmap,
            },
            MaxLabels: 123,
            MinConfidence: 70,
        },
        callback
    );
}
function searchFacesByImage(bitmap, callback = () => {}) {
    rekognition.searchFacesByImage(
        {
            CollectionId: config.collectionName,
            FaceMatchThreshold: 70,
            Image: {
                Bytes: bitmap,
            },
            MaxFaces: 1,
        },
        callback
    );
}
function saveImage(fileName, file, callback = () => {}) {
    const filePath = './uploads/' + fileName;
    let base64Data = file.replace(/^data:image\/png;base64,/, '');
    base64Data = base64Data.replace(/^data:image\/jpeg;base64,/, '');
    fs.writeFile(filePath, base64Data, 'base64', (err) => {
        if (err) return callback({ err });
        const bitmap = fs.readFileSync(filePath);
        callback({ bitmap });
    });
}
function indexFace(data = {}, callback = () => {}) {
    if (data.userId && data.bitmap) {
        rekognition.indexFaces(
            {
                CollectionId: config.collectionName,
                Image: {
                    Bytes: data.bitmap,
                },
                ExternalImageId: data.userId,
                DetectionAttributes: ['DEFAULT'],
                MaxFaces: 1,
                QualityFilter: 'AUTO',
            },
            callback
        );
    } else {
        callback({ err: 'Missing Data' });
    }
}
function getImageUrl(file = '') {
    if (file) {
        return 'https://s3-' + config.region + '.amazonaws.com/' + config.bucketName + '/' + file;
    }
}

export default router;
