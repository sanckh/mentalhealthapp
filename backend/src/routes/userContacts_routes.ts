import { getUserContacts } from "../controllers/userContactsController";
import router from "./auth_routes";

router.get('/usercontacts/:userId', getUserContacts);

export default router;