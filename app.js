var express       = require('express'),
    app           = express(),
    bodyParser    = require("body-parser"),
    mongoose      = require("mongoose"),
    flash         = require("connect-flash"),
    localStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    passport      = require("passport"),
    Campground    = require("./models/campground"),
    Comment       = require("./models/comment"),
    User          = require("./models/user"),
    // seedDB        = require("./seed"),
    expresSession = require("express-session");
//routes
var campgroundRoutes = require("./routes/campgrounds"),
    commentRoutes    = require("./routes/comments"),
    indexRoutes       = require("./routes/index");

mongoose.connect("mongodb://localhost/newYelp",{ useNewUrlParser: true });

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));
app.use(methodOverride("_method"));
app.use(flash());
app.set("view engine","ejs");

// seedDB();
//passport configuration
app.use(expresSession({
  secret : "This is very secret",
  resave : false,
  saveUninitialized : false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//current user middleware

app.use(function (req,res,next) {
  res.locals.currentUser = req.user;
  res.locals.error     = req.flash("error");
  res.locals.success   = req.flash("success");
  next();
});
//landing page
app.get("/",function (req,res) {
  res.render("index");
});

app.use(indexRoutes);
app.use("/campgrounds/show/:id/",commentRoutes);
app.use("/campgrounds",campgroundRoutes);

app.get("*",function (req,res) {
  res.send("Error 404");
});

app.listen(8080,function () {
  console.log("Server running on port 8080");
});
