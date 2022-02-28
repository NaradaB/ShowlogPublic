var axios = require("axios").default;
const { Shows } = require("../models");
const { confirmToken } = require("../middleware/AuthMiddleware");

const express = require("express");
const router = express.Router();
const api_key = process.env.API_KEY;

router.get("/show/:name", confirmToken, (req, res) => {
  const name = req.params.name;
  axios
    .get(
      "https://api.themoviedb.org/3/search/tv?language=en-US&page=1&include_adult=false&api_key=" +
      api_key +
      "&query=" +
      name
    )
    .then((response) => {
      response.data.results.forEach(function (item, index) {
        if (!item.poster_path) {
          item.poster_path =
            "https://showlogbucket.s3.eu-west-2.amazonaws.com/not_found.png";
        } else {
          item.poster_path =
            "https://image.tmdb.org/t/p/w500" + item.poster_path;
        }

        let length = item.overview.length;
        if (!item.overview) {
          item.overview = "No description provided.";
        }
        if (length > 200) {
          item.overview = item.overview.substring(0, 201) + "...";
        }
      });

      res.json(response.data.results);
    });
});

router.post("/addShow/", confirmToken, async (req, res) => {
  const data = {
    owner: req.token.username,
    showid: req.body.showid,
    date_added: req.body.date_added,
    finished: req.body.finished,
    review_comment: req.body.comment,
    review_score: req.body.review_score,
  };
  Shows.create(data);
  res.json("Show added");
});

router.post("/deleteShow/:id", confirmToken, async (req, res) => {
  const id = req.params.id;
  Shows.destroy({
    where: { owner: req.token.username, showid: id },
  });
  res.json("Show Deleted");
});

router.put("/finishShow/:id", confirmToken, async (req, res) => {
  const id = req.params.id;
  const rating = req.body.rating;
  const review = req.body.review;
  let username = req.token.username;

  await Shows.update(
    { finished: 1, review_comment: review, review_score: rating },
    {
      where: {
        owner: username,
        showid: id,
      },
    }
  );
  res.json("Show Finished");
});

router.put("/unfinish/:id", confirmToken, async (req, res) => {
  const id = req.params.id;
  let username = req.token.username;

  await Shows.update(
    { finished: 0 },
    {
      where: {
        owner: username,
        showid: id,
      },
    }
  );
  res.json("Show Unfinished");
});

router.get("/getShow/:id", async (req, res) => {
  if (!req.params.id) {
    res.json("Not found");
  }
  const id = req.params.id;
  axios
    .get(
      "https://api.themoviedb.org/3/tv/" +
      id +
      "?api_key=" +
      api_key +
      "&language=en-US"
    )
    .then((response) => {
      if (!response.data.poster_path) {
        response.data.poster_path =
          "https://showlogbucket.s3.eu-west-2.amazonaws.com/not_found.png";
      } else {
        response.data.poster_path =
          "https://image.tmdb.org/t/p/w500" + response.data.poster_path;
      }
      res.json(response.data);
    });
});

router.get("/getShows", confirmToken, async (req, res) => {
  let username = req.token.username;

  const shows = await Shows.findAll({
    where: { owner: username },
  });
  res.json(shows);
});

router.get("/getWatching", confirmToken, async (req, res) => {
  let username = req.token.username;
  const shows = await Shows.findAll({
    where: { owner: username, finished: 0 },
  });
  res.json(shows);
});

router.get("/getFinished", confirmToken, async (req, res) => {
  let username = req.token.username;

  const shows = await Shows.findAll({
    where: { owner: username, finished: 1 },
  });
  res.json(shows);
});

router.get("/getReviews/:username", confirmToken, async (req, res) => {
  let username = req.params.username;
  const shows = await Shows.findAll({
    where: { owner: username, finished: 1 },
  });
  res.json(shows);
});

module.exports = router;
