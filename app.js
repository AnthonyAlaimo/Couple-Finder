/*jshint esversion: 6*/

const express = require("express");
const app = express();
const path = require("path");
const datastore = require("nedb");
const multer = require("multer");
const upload = multer({ dest: path.join(__dirname, "uploads") });
const http = require("http");
const fs = require("fs");
const crypto = require("crypto");

const session = require("express-session");
app.use(
  session({
    secret: crypto.randomBytes(16).toString("base64"),
    resave: false,
    saveUninitalized: true,
  })
);

const cookie = require("cookie");

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const PORT = process.env.PORT || 3000;

app.use(express.static("static"));

http.createServer(app).listen(PORT, function (err) {
  if (err) console.log(err);
  else console.log("HTTP server on http://localhost:%s", PORT);
});

var images = new datastore({
  filename: "db/images.db",
  autoload: true,
  timestampData: true,
});
// var comments = new datastore({filename: 'db/comments.db', autoload: true, timestampData: true});
var users = new datastore({ filename: "db/users.db", autoload: true });

/* Object Constructors */
function Image(author, imageData) {
  this.author = author;
  this.image = imageData;
}

// function Comment(author, content, imageId) {
//   this.author = author;
//   this.content = content;
//   this.imageId = imageId;
// }

function User(username, password, salt) {
  this._id = username;
  this.password = password;
  this.salt = salt;
}

/* Initial handler, obtains username from session if one exists */
app.use(function (req, res, next) {
  req.username = req.session.username ? req.session.username : null;
  next();
});

/* Create */

/**
 * Sign up new user
 */
app.post("/signup/", function (req, res, next) {
  var username = req.body.username;
  var password = req.body.password;
  // Determine if user already exists
  users.findOne({ _id: username }, function (err, user) {
    if (err) {
      return res.status(500).end(err);
    } else if (user) {
      return res.status(409).end("username: " + username + " already exists");
    } else {
      // Salt and hash password
      let salt = crypto.randomBytes(16).toString("base64");
      let hash = crypto.createHmac("sha512", salt);
      hash.update(password);
      users.update(
        { _id: username },
        new User(username, hash.digest("base64"), salt),
        { upsert: true },
        function (err) {
          if (err) {
            return res.status(500).end(err);
          } else {
            // Update session and cookies
            req.session.username = username;
            res.setHeader(
              "Set-Cookie",
              cookie.serialize("username", username, {
                path: "/",
                maxAge: 60 * 60 * 24 * 7,
              })
            );
            return res.json("User: " + username + " signed up");
          }
        }
      );
    }
  });
});

/**
 * Sign in existing user
 */
app.post("/signin/", function (req, res, next) {
  var username = req.body.username;
  var password = req.body.password;
  // Find and match user in database
  users.findOne({ _id: username }, function (err, user) {
    if (err) {
      return res.status(500).end(err);
    } else if (!user) {
      return res.status(401).end("Incorrect login credentials");
    } else {
      // Compare salted hash to authenticate user
      let salt = user.salt;
      let hash = crypto.createHmac("sha512", salt);
      hash.update(password);
      if (user.password !== hash.digest("base64")) {
        return res.status(401).end("Incorrect login credentials");
      } else {
        // Setup session and cookies
        req.session.username = username;
        res.setHeader(
          "Set-Cookie",
          cookie.serialize("username", username, {
            path: "/",
            maxAge: 60 * 60 * 24 * 7,
          })
        );
        return res.json("User: " + username + " signed in");
      }
    }
  });
});

/**
 * Upload a new image to user's gallery
 */
app.post(
  "/api/images/",
  isAuthenticated,
  upload.single("picture"),
  function (req, res, next) {
    // Check for missing fields
    if (!req.file) {
      return res
        .status(400)
        .end("A required field is missing, please fix request and try again.");
    }
    images.insert(new Image(req.username, req.file), function (err, item) {
      if (err) {
        return res.status(500).end(err);
      } else {
        return res.json(item);
      }
    });
  }
);

/**
 * Add a new comment to an image
 */
// app.post("/api/comments/:id/", isAuthenticated, function (req, res, next) {
//   // Check for missing fields
//   if (!req.body.content) {
//     return res
//       .status(400)
//       .end("A required field is missing, please fix request and try again.");
//   }
//   images.findOne({ _id: req.params.id }, function (err, item) {
//     if (err) {
//       return res.status(500).end(err);
//     } else if (!item) {
//       return res
//         .status(404)
//         .end("No image with id " + req.params.id + " could be found");
//     } else {
//       comments.insert(
//         new Comment(req.username, req.body.content, req.params.id),
//         function (err, item) {
//           if (err) {
//             return res.status(500).end(err);
//           } else {
//             return res.json(item);
//           }
//         }
//       );
//     }
//   });
// });

/* Read */

/**
 * Sign out currently authenticated user
 */
app.get("/signout/", function (req, res, next) {
  req.session.destroy();
  res.setHeader(
    "Set-Cookie",
    cookie.serialize("username", "", {
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 1 week in number of seconds
    })
  );
  return res.json("User has signed out");
});

/**
 * Gets list of all users
 */
app.get("/api/users/", isAuthenticated, function (req, res, next) {
  users
    .find({}, { password: 0, salt: 0 })
    .sort({ _id: req.username })
    .exec(function (err, items) {
      if (err) {
        return res.status(500).end(err);
      } else {
        return res.json(items);
      }
    });
});

// Gets most recent image of specified user
app.get("/api/images/:author", isAuthenticated, function (req, res, next) {
  images
    .find({ author: req.params.author })
    .sort({ createdAt: -1 })
    .exec(function (err, items) {
      if (err) {
        return res.status(500).end(err);
      } else if (items.length > 0) {
        let image = items[0];
        // image.hasPrev = false;
        // image.hasNext = items.length > 1;
        return res.json(image);
      } else {
        return res.json(null);
      }
    });
});

// Gets image file for specified image
app.get("/api/images/:id/image/", isAuthenticated, function (req, res, next) {
  images.findOne({ _id: req.params.id }, function (err, item) {
    if (err) {
      return res.status(500).end(err);
    } else if (!item) {
      return res
        .status(404)
        .end("No image with id " + req.params.id + " could be found.");
    } else {
      res.setHeader("Content-Type", item.image.mimetype);
      res.sendFile(item.image.path);
    }
  });
});

// Gets either next or prev image of specified one
// app.get("/api/images/:id/:action/", isAuthenticated, function (req, res, next) {
//   images.findOne({ _id: req.params.id }, function (err, item) {
//     if (err) {
//       return res.status(500).end(err);
//     } else if (!item) {
//       return res
//         .status(404)
//         .end("No image with id " + req.params.id + " could be found");
//     } else {
//       images
//         .find({ author: item.author })
//         .sort({ createdAt: -1 })
//         .exec(function (err, items) {
//           if (err) {
//             return res.status(500).end(err);
//           } else {
//             // Find index of current image being displayed, and return next or prev image depending on
//             // request action
//             let index = items.findIndex((x) => x._id === req.params.id);
//             let imageIndex;
//             if (req.params.action === "next") {
//               imageIndex = items[index + 1] ? index + 1 : index;
//             } else if (req.params.action === "prev") {
//               imageIndex = items[index - 1] ? index - 1 : index;
//             } else {
//               return res
//                 .status(400)
//                 .end("Incorrect action, please fix request and try again");
//             }
//             // Setup hasPrev and hasNext flags
//             let returnedImage = items[imageIndex];
//             if (imageIndex != 0) {
//               returnedImage.hasPrev = true;
//             }
//             if (imageIndex < items.length - 1) {
//               returnedImage.hasNext = true;
//             }
//             return res.json(returnedImage);
//           }
//         });
//     }
//   });
// });

// Gets requested comment page for image
// app.get("/api/comments/:id/", isAuthenticated, function (req, res, next) {
//   comments
//     .find({ imageId: req.params.id })
//     .sort({ createdAt: -1 })
//     .exec(function (err, items) {
//       if (err) {
//         return res.status(500).end(err);
//       } else {
//         let index = req.query.page ? req.query.page : 0;
//         return res.json(getCommentsForPage(parseInt(index), items));
//       }
//     });
// });

/* Update */

/* Delete */

// Deletes requested image and all associated comments
// app.delete("/api/images/:id/", isAuthenticated, function (req, res, next) {
//   images.findOne({ _id: req.params.id }, function (err, image) {
//     if (err) {
//       return res.status(500).end(err);
//     } else if (!image) {
//       return res
//         .status(404)
//         .end("No image with id " + req.params.id + " could be found");
//     } else {
//       images
//         .find({ author: image.author })
//         .sort({ createdAt: -1 })
//         .exec(function (err, items) {
//           if (err) {
//             return res.status(500).end(err);
//           } else {
//             // Delete requested image, and return the prev or next image
//             let index = items.findIndex((x) => x._id === req.params.id);

//             // Check if user is the owner of the image
//             if (req.username === items[index].author) {
//               images.remove({ _id: req.params.id }, function (err, num) {
//                 // Delete associated image file
//                 fs.unlinkSync(items[index].image.path);
//                 // Delete all associated comments
//                 comments.remove(
//                   { imageId: req.params.id },
//                   function (err, num) {
//                     let imageIndex;
//                     items.splice(index, 1);
//                     if (index === 0) {
//                       imageIndex = items[0] ? 0 : null;
//                     } else {
//                       imageIndex = items[index - 1] ? index - 1 : null;
//                     }
//                     let returnedImage = null;
//                     if (imageIndex != null) {
//                       returnedImage = items[imageIndex];
//                       if (imageIndex != 0) {
//                         returnedImage.hasPrev = true;
//                       }
//                       if (imageIndex < items.length - 1) {
//                         returnedImage.hasNext = true;
//                       }
//                     }
//                     return res.json(returnedImage);
//                   }
//                 );
//               });
//             } else {
//               return res.status(401).end("Access Denied");
//             }
//           }
//         });
//     }
//   });
// });

// Delete requested comment
// app.delete("/api/comments/:id/", isAuthenticated, function (req, res, next) {
//   comments.findOne({ _id: req.params.id }, function (err, item) {
//     if (err) {
//       return res.status(500).end(err);
//     } else if (!item) {
//       return res
//         .status(404)
//         .end("No comment with id " + req.params.id + " could be found");
//     } else {
//       images.findOne({ _id: item.imageId }, function (err, image) {
//         if (err) {
//           return res.status(500).end(err);
//         } else {
//           comments
//             .find({ imageId: item.imageId })
//             .sort({ createdAt: -1 })
//             .exec(function (err, items) {
//               if (err) {
//                 return res.status(500).end(err);
//               } else {
//                 // Determine if authenticated action
//                 if (
//                   item.author === req.username ||
//                   image.author === req.username
//                 ) {
//                   // Need to determine the page number of the comment page to display once the comment
//                   // has been deleted
//                   let commentIndex = items.findIndex(
//                     (x) => x._id === req.params.id
//                   );
//                   let nextPage = Math.floor(commentIndex / 10);
//                   items.splice(commentIndex, 1);
//                   comments.remove({ _id: req.params.id }, function (err, num) {
//                     return res.json(getCommentsForPage(nextPage, items));
//                   });
//                 } else {
//                   return res.status(401).end("Access Denied");
//                 }
//               }
//             });
//         }
//       });
//     }
//   });
// });

// Helper function that obtains comment page given page number and comments collection
// function getCommentsForPage(page, items) {
//   let startIndex = page * 10;
//   let comments = {};
//   // Case when not enough comments to fill full page, in which case return all
//   if (items.length <= 10) {
//     comments.page = 0;
//     comments.items = items;
//   }
//   // Case where last page is requested but last page is not full
//   else if (startIndex < items.length && startIndex + 10 >= items.length) {
//     comments.items = items.slice(startIndex, items.length);
//     comments.page = page;
//   }
//   // Otherwise return requested page
//   else {
//     comments.items = items.slice(startIndex, startIndex + 10);
//     comments.hasNext = true;
//     comments.page = page;
//   }
//   return comments;
// }

// Determines if user is authenticated
function isAuthenticated(req, res, next) {
  if (!req.username) {
    return res.status(401).end("Access Denied");
  }
  next();
}