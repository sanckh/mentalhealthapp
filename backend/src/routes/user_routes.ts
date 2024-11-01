import { updateDisplayName, updateProfilePicture } from "../controllers/usersController";

const express = require('express');


const router = express.Router();

router.post('/updatedisplayname/:userId', updateDisplayName);


router.post('/updateprofilepicture/:userId', updateProfilePicture);

export default router;