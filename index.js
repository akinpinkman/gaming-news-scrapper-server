const PORT = 8000;
const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const cors = require("cors");

const app = express();
app.use(cors());

const gameSpot = "https://www.gamespot.com/news";
const gameSpotBaseURL = "https://www.gamespot.com";
const gameInformer = "https://www.gameinformer.com/news";
const gameInformerBaseURL = "https://www.gameinformer.com";

app.get("/", function (req, res) {
  res.send("Game News Scrapper");

});

// GameSpot News
app.get("/gamespotnews", (req, res) => {
  axios
    .get(gameSpot)
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);
      const gameSpotArticles = [];

      $(".card-item", html)
        .each(function () {
          const title = $(this).find(".card-item__title").text();
          const url = gameSpotBaseURL + $(this).find("a").attr("href");
          const img = $(this).find(".card-item__img img").attr("src");
          gameSpotArticles.push({
            title,
            url,
            img,
          });
        });
      res.json(gameSpotArticles);
    })
    .catch((err) => console.log(err));
});

// Game Informer News
app.get("/gameinformernews", (req, res) => {
  axios
    .get(gameInformer)
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);
      const gameInformerArticles = [];

      $(".views-row", html)
        .each(function () {
          const title = $(this).find(".page-title").find("span").text();
          const url = gameInformerBaseURL + $(this).find("a").attr("href");
          const img = gameInformerBaseURL + $(this)
            .find(".promo-img-thumb img")
            .attr("src");
          gameInformerArticles.push({
            title,
            url,
            img,
          });
        });
      res.json(gameInformerArticles);
    })
    .catch((err) => console.log(err));
});

app.listen(PORT, () => console.log(`Server active on PORT ${PORT}`));
