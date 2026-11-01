import express from "express";
import {
    createGroup,
    getMyGroups,
    getGroupDetails,
    addMember,
    removeMember,
    sendGroupMessage,
    getGroupMessages
} from "../controllers/groupController.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.use(isAuthenticated);

router.route("/create").post(createGroup);
router.route("/").get(getMyGroups);
router.route("/:groupId").get(getGroupDetails);
router.route("/:groupId/add-member").put(addMember);
router.route("/:groupId/remove-member").put(removeMember);
router.route("/:groupId/message").post(sendGroupMessage);
router.route("/:groupId/messages").get(getGroupMessages);

export default router;

