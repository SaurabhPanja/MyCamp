/*******************************/
//Comments routes
/******************************/

var express    = require("express"),
    router     = express.Router({mergeParams:true}),
    Campground = require("../models/campground"),
    Comment    = require("../models/comment"),
    middleware = require("../middleware");
//coments new
router.get("/comments/new",middleware.isLoggedIn,function (req,res) {
  Campground.findById(req.params.id,function (err,campground) {
    if (err) {
      req.flash("error","Can't find Comment");
      res.redirect("back");
    }else {
      res.render("./comments/new",{campground:campground});
    }
  });
});
//comments new
router.post("/",middleware.isLoggedIn,function (req,res) {
  Campground.findById(req.params.id,function (err,campground) {
    if (err) {
      req.flash("error","Something went wrong!");
      res.redirect("back");
    }else {
      Comment.create(req.body.comment,function (err,comment) {
        if (err) {
          req.flash("error","Something went wrong! Comments could not be created");
          res.redirect("back");
        }else {
          //get author name from log in user
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          comment.save();
          campground.comments.push(comment);
          campground.save();
          req.flash("success","New comment Added!");
          res.redirect("/campgrounds/show/"+req.params.id);
        }
      });

    }
  });
});

//edit Comments

router.get("/comments/:comment_id/edit",middleware.checkCommentOwnership,function (req,res) {
  Comment.findById(req.params.comment_id,function (err,foundComment) {
    if (err) {
      req.flash("error","Something went wrong!");
      res.redirect("back");
    }else {
      res.render("./comments/edit",{campground_id:req.params.id,comment:foundComment});
    }
  });
});

//update Comments

router.put("/comments/:comment_id",middleware.checkCommentOwnership,function (req,res) {
  Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,
  function (err,updatedComment) {
    if (err) {
      req.flash("error","Something went wrong!");
      res.redirect("back");
    }else {
      req.flash("success","Your comment has been updated");
      res.redirect("/campgrounds/show/" + req.params.id);
    }
  });
});

//destroy commentSchema

router.delete("/comments/:comment_id",middleware.checkCommentOwnership,function (req,res) {
  Comment.findByIdAndRemove(req.params.comment_id,function (err) {
    if (err) {
      req.flash("error","Something went wrong!");
      res.redirect("back");
    }else {
      req.flash("success","Your Campground has been removed successfully!");
      res.redirect("/campgrounds/show/" + req.params.id);
    }
  });
});

module.exports = router;
