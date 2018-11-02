import { Router } from 'express';
const config = require('../../config.json');
const AWS = require('aws-sdk');
AWS.config.update(config);
const rekognition = new AWS.Rekognition();
// const s3 = new AWS.S3();
const bucketName = 'sjsucmpe280';
const router = Router();
const fs = require('fs-extra');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

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

router.post('/recognize', upload.single('image'), (req, res) => {
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
