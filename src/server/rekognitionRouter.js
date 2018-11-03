// baseUrl = '/api/rekognition'
import { Router } from 'express';
import multer from 'multer';
const fs = require('fs-extra');
const config = require('../../config.json');
const AWS = require('aws-sdk');

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
router.post('/searchFacesByImage', upload.single('file'), (req, res) => {
    const file = req.file;
    const bitmap = fs.readFileSync(file.path);
    rekognition.searchFacesByImage(
        {
            CollectionId: config.collectionName,
            FaceMatchThreshold: 70,
            Image: {
                Bytes: bitmap,
            },
            MaxFaces: 1,
        },
        (err, data) => {
            if (err) {
                res.send(err);
            } else {
                if (data.FaceMatches && data.FaceMatches.length > 0 && data.FaceMatches[0].Face) {
                    const face = data.FaceMatches[0].Face;
                    res.send({ ...face, img: getImageUrl(face.ExternalImageId) });
                } else {
                    res.send({ error: 'Not recognized' });
                }
            }
        }
    );
});
router.post('/detectLabels', upload.single('file'), (req, res) => {
    const file = req.file;
    const meta = req.body;
    console.log(meta);
    const bitmap = fs.readFileSync(file.path);
    const params = {
        Image: {
            Bytes: bitmap,
        },
        MaxLabels: 123,
        MinConfidence: 70,
    };
    rekognition.detectLabels(params, (err, data) => {
        if (err) {
            res.status(500).json(err);
        }
        res.status(200).json(data);
    });
});
function getImageUrl(file = '') {
    if (file) {
        return 'https://s3-' + config.region + '.amazonaws.com/' + config.bucketName + '/' + file;
    }
}
router.get('/getObject', (req, res) => {
    const file = 'arturo_montoya.jpg'; //TODO: req.file
    s3.getObject({ Bucket: config.bucketName, Key: file }, (error, data) => {
        if (error !== null) {
            res.status(500).json({ error: 'Failed to retrieve an object: ' + error });
        }
        res.send(data);
    });
});
router.get('/indexFace', (req, res) => {
    const file = 'arturo_montoya.jpg'; //TODO: req.file
    indexFace(file, (err, data) => {
        if (err) {
            res.status(500).json(err);
        }
        res.send(data);
    });
});
function indexFace(name, done = () => {}) {
    rekognition.indexFaces(
        {
            CollectionId: config.collectionName,
            Image: {
                S3Object: {
                    Bucket: config.bucketName,
                    Name: name,
                },
            },
            ExternalImageId: name,
            DetectionAttributes: ['DEFAULT'],
            MaxFaces: 1,
            QualityFilter: 'AUTO',
        },
        done
    );
}
//=============================================================
router.get('/searchFacesByImageTest', (req, res) => {
    const name = 'Grocery-items.jpg' || 'arturo_montoya3.jpg';

    rekognition.searchFacesByImage(
        {
            CollectionId: config.collectionName,
            FaceMatchThreshold: 70,
            Image: {
                S3Object: {
                    Bucket: config.bucketName,
                    Name: name,
                },
            },
            MaxFaces: 1,
        },
        (err, data) => {
            if (err) {
                res.send(err);
            } else {
                if (data.FaceMatches && data.FaceMatches.length > 0 && data.FaceMatches[0].Face) {
                    res.send(data.FaceMatches[0].Face);
                } else {
                    res.send({ error: 'Not recognized' });
                }
            }
        }
    );
});
export default router;

/*  ====================== TODO ====================== */

// function compareFaces(bucketName = config.bucketName, name, withName, callback) {
//     const params = {
//         SimilarityThreshold: 90,
//         SourceImage: {
//             S3Object: {
//                 Bucket: bucketName,
//                 Name: name,
//             },
//         },
//         TargetImage: {
//             S3Object: {
//                 Bucket: bucketName,
//                 Name: withName,
//             },
//         },
//     };
//     rekognition.compareFaces(params, callback);
// }

// function getObject(bucketName = config.bucketName, key = 'arturo_montoya3.jpg') {
//     s3.getObject({ Bucket: bucketName, Key: key }, (error, data) => {
//         if (error != null) {
//             console.log('Failed to retrieve an object: ' + error);
//         } else {
//             console.log('Loaded ' + data.ContentLength + ' bytes');
//             console.log(data.Body);
//         }
//     });
// }

// function createBucket(bucketName = config.bucketName) {
//     s3.createBucket({ Bucket: bucketName }, () => {
//         const params = { Bucket: bucketName, Key: keyName, Body: 'Hello World!' };
//         s3.putObject(params, (err, data) => {
//             if (err) console.log(err);
//             else console.log('Successfully uploaded data to ' + config.bucketName + '/' + keyName);
//         });
//     });
// }
