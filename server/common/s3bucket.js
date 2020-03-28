/* jshint esversion: 6 */
import * as AWS from 'aws-sdk';
import l from './logger';

const s3bucket = new AWS.S3({
    accessKeyId: process.env.AWS_S3_IAM_USER_KEY,
    secretAccessKey: process.env.AWS_S3_IAM_USER_SECRET,
    Bucket: process.env.AWS_S3_FILES_BUCKET_NAME,
});

class AmazonS3Service {
    uploadToS3(file) {
        l.info('Uploading the file to S3 Bucket');
        const putObjectPromise = s3bucket.putObject({
            Bucket: process.env.AWS_S3_FILES_BUCKET_NAME,
            Key: file.name,
            Body: file.data,
        }).promise();
        return putObjectPromise;
    }
    preSignedGetobject(file) {
        const params = { Bucket: process.env.AWS_S3_FILES_BUCKET_NAME, Key: file };
        return s3bucket.getSignedUrl('getObject', params);
    }
}


export default new AmazonS3Service();
