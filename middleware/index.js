var middlewareObj = {},
    Campground    = require("../models/campground"),
    Comment       = require("../models/comment");

middlewareObj.checkCampgroundOwnership = function (req,res,next) {
  //if user isLoggedIn
  if (req.isAuthenticated()) {
    Campground.findById(req.params.id,function (err,foundCampground) {
      if (err) {
        req.flash("error","Unable to proceed your request, Campground not found");
        res.redirect("/back");
      }else {
        //does the user own it
        if (foundCampground.author.id.equals(req.user._id)) {
          next();
        }else {
          req.flash("error","Unauthorized Access!! Permission Denied!");
          res.redirect("back");
        }
      }
    });
  }else {
    req.flash("error","Unauthorized Access!! Permission Denied!");
    res.redirect("back");
  }
};
 //checking comments ownership

middlewareObj.checkCommentOwnership = function (req,res,next) {
  //if user isLoggedIn
  if (req.isAuthenticated()) {
    Comment.findById(req.params.comment_id,function (err,foundComment) {
      if (err) {
        req.flash("error","Unable to proceed your request, Comment not found");
        res.redirect("/back");
      }else {
        //does the user own it
        if (foundComment.author.id.equals(req.user._id)) {
          next();
        }else {
          req.flash("error","Unauthorized Access!! Permission Denied!");
          res.redirect("back");
        }
      }
    });
  }else {
    req.flash("error","Unauthorized Access!! Permission Denied!");
    res.redirect("back");
  }
};


middlewareObj.isLoggedIn = function (req,res,next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.req.flash("error","Please Login to continue");
  res.redirect("/login");
};


module.exports = middlewareObj;
