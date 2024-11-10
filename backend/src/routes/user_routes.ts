import { updateDisplayName, updateProfilePicture } from "../controllers/usersController";

const multer = require('multer');
const express = require('express');


const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/updatedisplayname/:userId', updateDisplayName);


router.post('/updateprofilepicture/:userId', upload.single('profileImage'), updateProfilePicture);

export default router;