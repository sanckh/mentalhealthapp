import { getUserContacts, saveUserContact } from "../controllers/userContactsController";
import router from "./auth_routes";

router.get('/getusercontacts/:userId', getUserContacts);
router.post('/saveusercontact/:userId', saveUserContact);

export default router;