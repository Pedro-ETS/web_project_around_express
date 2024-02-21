const router = require("express").Router();

const path = require("path");

const {
  getCurrentUser,
  getUsers,
  getUser,
  updateAvatar,
  updateProfile,
} = require("../controllers/users");

router.get("/", getUsers);
router.get("/:userId", getUser);
router.patch("/avatar", updateAvatar);
router.patch("/me", updateProfile);
router.get("/me", getCurrentUser);

module.exports = router;
