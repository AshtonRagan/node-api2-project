const express = require("express");
const postData = require("../data/db.js");
const router = express.Router();

router.use(express.json());
//GETS--------------------------------------------
router.get("/", (req, res) => {
  postData
    .find()
    .then(post => {
      res.status(200).json(post);
    })
    .catch(err => {
      res.status(404).json({ Error: "Nothing was found" });
    });
});

router.get("/:id/comments", (req, res) => {
  postData
    .findPostComments(req.params.id)
    .then(comments => {
      res.status(200).json(comments);
    })
    .catch(err => {
      console.log(err);

      res.status(404).json({ Error: "The post with that ID does not exist" });
    });
});

router.get("/:id", (req, res) => {
  postData
    .findById(req.params.id)
    .then(post => {
      if (post.length > 0) {
        res.status(201).json(post);
      } else {
        res.status(404).json({ Error: "No id found" });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ Error: "No post found" });
    });
});

//POST-----------------------------------------------------
router.post("/", (req, res) => {
  const body = req.body;
  if (body.title && body.contents) {
    postData
      .insert(req.body)
      .then(post => {
        res.status(201).json(body);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: "There was an error while saving the post to the database"
        });
      });
  } else {
    res.status(400).json({ Error: "need title and contents please." });
  }
});

router.post("/:id/comments", (req, res) => {
  const body = { ...req.body, post_id: req.params.id };

  if (body.text) {
    postData
      .insertComment(body)
      .then(comments => {
        if (comments) {
          res.status(201).json(comments);
        } else {
          res.status(404).json({ Error: "No id found" });
        }
      })
      .catch(err => {
        console.log(err);
        res.status(404).json({ Error: "Invaild comment id" });
      });
  } else {
    res.status(400).json({ Error: "Please provide Text" });
  }
});
//Deletes--------------------------------------------------------
router.delete("/:id", (req, res) => {
  postData
    .remove(req.params.id)
    .then(post => {
      if (post) {
        res.status(201).json({ Message: "Post was removed :)" });
      } else {
        res.status(500).json({ Error: "Post could not be removed" });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(404).json({ Error: "no post found" });
    });
});
//POST-----------------------------------------------------------------
router.put("/:id", (req, res) => {
  const body = req.body;

  if (body.title && body.contents) {
    postData
      .update(req.params.id, body)
      .then(post => {
        if (post) {
          res.status(200).json(body);
        } else {
          res
            .status(500)
            .json({ Error: "The posts data could not be updated" });
        }
      })
      .catch(err => {
        console.log(err);
        res.status(404).json({ Error: "No id found" });
      });
  } else {
    res.status(400).json({ Error: "Needs Title and Contents" });
  }
});

module.exports = router;
