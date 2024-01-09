const router = require("express").Router();

const path = require("path");

const {
  getUsers,
  getUser,
  createUser,
  updateAvatar,
  updateProfile,
} = require("../controllers/users");

router.get("/", getUsers);
router.get("/:userId", getUser);
router.post("/", createUser);
router.patch("/avatar", updateAvatar);
router.patch("/me", updateProfile);

module.exports = router;
