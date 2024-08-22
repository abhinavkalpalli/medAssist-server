import multer, { StorageEngine } from 'multer';
import path from 'path';


const storage: StorageEngine = multer.diskStorage({
    destination: function (req, file, cb) {
        let uploadPath: string;
        if (file.fieldname === 'voiceMessage') {
            uploadPath = path.join(__dirname, '../public/voicemessages');
        } else if (file.fieldname === 'image') {
            uploadPath = path.join(__dirname, '../public/images');
        } else {
            throw new Error('Unsupported field name'); 
        }
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const uniqueName=Date.now()+'-'+file.originalname
        cb(null,uniqueName)
    },
});

export default storage;
