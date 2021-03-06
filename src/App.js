import React, { useState, useEffect } from "react";
import { Typography } from "@material-ui/core";
import wordsToNumbers from "words-to-numbers";
import alanBtn from "@alan-ai/alan-sdk-web";

import { NewsCards } from "./components";
import useStyles from "./style";

const App = () => {
  const [activeArticle, setActiveArticle] = useState(0);
  const [newsArticles, setNewsArticles] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const classes = useStyles();

  useEffect(() => {
    alanBtn({
      key:
        "56a7df4a97c62680c6267c06bfdeb48e2e956eca572e1d8b807a3e2338fdd0dc/stage",
      onCommand: ({ command, articles, number }) => {
        if (command === "newHeadlines") {
          setNewsArticles(articles);
          setActiveArticle(-1);
        } else if (command === "instructions") {
          setIsOpen(true);
        } else if (command === "highlight") {
          setActiveArticle((prevActiveArticle) => prevActiveArticle + 1);
        } else if (command === "open") {
          const parsedNumber =
            number.length > 2
              ? wordsToNumbers(number, { fuzzy: true })
              : number;
          const article = articles[parsedNumber - 1];

          if (parsedNumber > 20) {
            alanBtn().playText("Please try that again...");
          } else if (article) {
            window.open(article.url, "_blank");
            alanBtn().playText("Opening...");
          } else {
            alanBtn().playText("Please try that again...");
          }
        } else if (command === "developer") {
          window.open("https://www.dhruvilgajjar.engineer/", "_blank");
          // window.location.href = "https://www.dhruvilgajjar.engineer/";
          alanBtn().playText("Opening developer portfolio.");
        }
      },
    });
  }, []);

  return (
    <div>
      <div className={classes.logoContainer}>
        {newsArticles.length ? (
          <div className={classes.infoContainer}>
            <div className={classes.card}>
              <Typography variant='h5' component='h2'>
                Try saying: <br />
                <br />
                Open article number [4]
              </Typography>
            </div>
            <div className={classes.card}>
              <Typography variant='h5' component='h2'>
                Try saying: <br />
                <br />
                Go back
              </Typography>
            </div>
          </div>
        ) : null}
        <img
          src='https://alan.app/voice/images/previews/preview.jpg'
          className={classes.alanLogo}
          alt='logo'
        />
      </div>
      <NewsCards articles={newsArticles} activeArticle={activeArticle} />
      <Typography variant='h6' style={{ textAlign: "center" }}>
        Know about developer saying: who develop this site
      </Typography>
      <Typography variant='h6' style={{ textAlign: "center" }}>
        also you can small talk: who are you?
      </Typography>
    </div>
  );
};

export default App;
