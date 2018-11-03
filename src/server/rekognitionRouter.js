import { Router } from 'express';
import multer from 'multer';
const config = require('../../config.json');
const AWS = require('aws-sdk');
AWS.config.update(config);
const rekognition = new AWS.Rekognition();
// const s3 = new AWS.S3();
const bucketName = 'sjsucmpe280';
const router = Router();
const fs = require('fs-extra');
const storage = multer.diskStorage({
    destination: './uploads',
    filename(req, file, cb) {
        cb(null, `${new Date()}-${file.originalname}`);
    },
});

const upload = multer({ storage });

//app.use('/api/rekognition', rekognitionRouter);
router.get('/test_compareFaces', (req, res) => {
    compareFaces(bucketName, 'arturo_montoya2.jpg', 'arturo_montoya3.jpg', (err, data) => {
        if (err) {
            console.log(err, err.stack);
            res.send({ error: 'err' });
        } else {
            res.send(data);
        }
    });
});

router.post('/searchFacesByImage', upload.single('image'), (req, res) => {
    const bitmap = fs.readFileSync(req.file.path);
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
                    res.send(data.FaceMatches[0].Face);
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

router.get('/searchFacesByImageTest', (req, res) => {
    const name = 'Grocery-items.jpg' || 'arturo_montoya3.jpg';

    rekognition.searchFacesByImage(
        {
            CollectionId: 'collectionname',
            FaceMatchThreshold: 70,
            Image: {
                S3Object: {
                    Bucket: bucketName,
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
router.get('/test_indexFaces', (req, res) => {
    const name = 'arturo_montoya.jpg';
    rekognition.indexFaces(
        {
            CollectionId: 'collectionname',
            Image: {
                S3Object: {
                    Bucket: bucketName,
                    Name: name,
                },
            },
            ExternalImageId: name,
            DetectionAttributes: ['DEFAULT'],
            MaxFaces: 1,
            QualityFilter: 'AUTO',
        },
        (err, data) => {
            if (err) {
                res.send(err);
            } else {
                res.send(data);
            }
        }
    );
});

export default router;

/*  ====================== TODO ====================== */

function compareFaces(bucketName, name, withName, callback) {
    const params = {
        SimilarityThreshold: 90,
        SourceImage: {
            S3Object: {
                Bucket: bucketName,
                Name: name,
            },
        },
        TargetImage: {
            S3Object: {
                Bucket: bucketName,
                Name: withName,
            },
        },
    };
    rekognition.compareFaces(params, callback);
}

// function getObject(bucketName, key = 'arturo_montoya3.jpg') {
//     s3.getObject({ Bucket: bucketName, Key: key }, (error, data) => {
//         if (error != null) {
//             console.log('Failed to retrieve an object: ' + error);
//         } else {
//             console.log('Loaded ' + data.ContentLength + ' bytes');
//             console.log(data.Body);
//         }
//     });
// }

// function createBucket(bucketName) {
//     s3.createBucket({ Bucket: bucketName }, () => {
//         const params = { Bucket: bucketName, Key: keyName, Body: 'Hello World!' };
//         s3.putObject(params, (err, data) => {
//             if (err) console.log(err);
//             else console.log('Successfully uploaded data to ' + bucketName + '/' + keyName);
//         });
//     });
// }
