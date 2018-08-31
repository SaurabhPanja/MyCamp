//Auth routes

var express  = require("express"),
    router   = express.Router(),
    passport = require("passport"),
    User     = require("../models/user");

router.get("/register",function (req,res) {
  res.render("register");
});

//register logic

router.post("/register",function (req,res) {
   User.register(new User({username : req.body.username}),req.body.password,
  function (err,user) {
      if (err) {
        req.flash("error",err.message);
        return res.redirect("/register");
      }
        passport.authenticate("local")(req,res,function () {
          req.flash("success","Welcome to MyCamp " + req.user.username);
          res.redirect("/campgrounds");
        });
  });
});


//show login fom
router.get("/login",function (req,res) {
  res.render("login");
});
//login logic
router.post("/login",passport.authenticate("local",{
  failureFlash    : {type:"error",message  :"Incorrect Credentials "},
  failureRedirect : "/login"
}),function (req,res) {
  req.flash("success","Hi! Welcome back "+req.user.username);
  res.redirect("/campgrounds");
});

router.get("/logout",function (req,res) {
  req.logout();
  req.flash("success","Logged You Out!");
  res.redirect("/campgrounds");
});
//middleware
function isLoggedIn(req,res,next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

module.exports = router;
