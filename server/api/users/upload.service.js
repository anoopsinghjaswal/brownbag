/* jshint esversion: 6 */
import l from '../../common/logger';
import s3 from '../../common/s3bucket';


class FileUploadService {
    upload(uid, files) {
        const uploadedFiles = [];
        l.info(`${this.constructor.name}.upload()`);
        const allFiles = [];
        files.forEach((file, index) => {
            file.name = `${uid}-${Date.now()}-${index}.${file.name.split('.').pop()}`; // eslint-disable-line no-param-reassign
            allFiles.push(`${file.name}`);
            uploadedFiles.push(s3.uploadToS3(file));
        });
        return Promise.all(uploadedFiles)
            .then(data => Promise.resolve({ s3: data, allFiles }))
            .catch(err => Promise.reject(err));
    }
}

export default new FileUploadService();
