const router = require("express").Router();
const { v4: uuidv4 } = require("uuid");
const User = require("../userModels/user.modal");
const userValidationSchema = require("../userValidation/userValidation");
const userMiddleware = require("../middleware/userMiddleware");
const bcrypt = require("bcrypt");

router
  .route("/")
  .post(userMiddleware(userValidationSchema.userInfo), (req, res) => {
    const saltRounds = 10;
    const userPassword = req.body.password;
    bcrypt.genSalt(saltRounds, function (err, salt) {
      bcrypt.hash(userPassword, salt, function (err, hash) {
        const newUserData = {
          email: req.body.email,
          password: hash,
        };

        const newUser = new User(newUserData);
        newUser
          .save()
          .then(() =>
            res.send({
              status: true,
              message: "user added",
            }),
          )
          .catch((err) => res.status(400).json("Error: " + err));
      });
    });

    console.log("saved");
  });
// router.route("/login").post((req, res) => {
//   const validate = userMiddleware(userValidationSchema.userInfo);
//   console.log(req.body);
//   const newUserData = {
//     email: req.body.email,
//     password: uuidv4(),
//   };
//   const newUser = new User(newUserData);

//   newUser
//     .save()
//     .then(() =>
//       res.send({
//         status: true,
//         message: "user added",
//       })
//     )
//     .catch((err) => res.status(400).json("Error: " + err));

//   console.log("saved");
// });

module.exports = router;
