require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const pretty = require('express-prettify');
const https = require('https');
const fs = require('fs');

const {
  getCardsForList,
  getListsForBoard,
  getBatchCardActions,
  getCardActions,
} = require('./services/trello.js');

const {
  calculateSprintDates,
  getBurnedPoints,
  getAddedPoints,
  getCardEstimate,
  getRequiredLists,
  getSprintInfo,
} = require('./util');

const app = express();
app.use((_req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.get('/sprint/metrics', async (req, res) => {
  try {
    const boardLists = await getListsForBoard();

    const {
      sprintName,
      sprintNumber,
    } = getSprintInfo(boardLists);

    const requiredLists = getRequiredLists(sprintNumber, sprintName);
    const filteredLists = boardLists.filter((list) => requiredLists.includes(list.name));
    const cards = (await Promise.all(filteredLists.map((list) => getCardsForList(list.id)))).flat();

    const cardsWithEstimates = cards.filter((card) => getCardEstimate(card) > 0);
    const cardsWithEstimatesIds = cardsWithEstimates.map((card) => card.id);

    const actions = await getBatchCardActions(cardsWithEstimatesIds);

    const cardsAndActionsWithEstimates = cardsWithEstimates.map((card) => {
      const actionsForCard = actions.filter((action) => action.data.card.id === card.id);
      return {
        card,
        actions: actionsForCard,
      };
    });

    const completedCardsAndActionsWithEstimates = cardsAndActionsWithEstimates
      .filter((card) => card.card.idList === filteredLists[filteredLists.length - 1].id);

    const sprintStartAction = (await getCardActions(process.env.TRELLO_SPRINT_CARD))
      .find((action) => action.data.old.name !== action.data.card.name);

    if (sprintStartAction) {
      const { date } = sprintStartAction;
      const {
        sprintStartDate,
        sprintEndDate,
        sprintDuration,
        datesInSprint,
        daysRemaning,
      } = calculateSprintDates(date);

      const completedCardsAndActions = completedCardsAndActionsWithEstimates
        .map((cardAndActions) => {
          const { actions } = cardAndActions;
          const { card } = cardAndActions;

          const completedAction = actions.find((action) => action.data.listAfter
            && action.data.listAfter.name === requiredLists[requiredLists.length - 1]);

          return {
            card,
            action: completedAction,
          };
        });

      const metricsRaw = datesInSprint.map((dateAndDay) => {
        const { date, day } = dateAndDay;

        const pointsBurned = getBurnedPoints(completedCardsAndActions, date);
        const pointsAdded = getAddedPoints(cardsAndActionsWithEstimates, date, requiredLists);

        return {
          day,
          added: pointsAdded,
          completed: pointsBurned,
        };
      });

      const storyPointsInSprint = metricsRaw
        .reduce((accumulator, metric) => accumulator + metric.added, 0);

      let remaining = storyPointsInSprint;

      const metrics = metricsRaw.map((metric) => {
        const { added, completed, day } = metric;

        if (day === 1) {
          remaining -= completed;
        } else {
          remaining = (remaining - completed) + added;
        }

        return {
          added,
          completed,
          remaining,
        };
      });

      const storyPointsAddedDuringSprint = metrics.reduce((accumulator, metric) => {
        if (metric.day === 1) {
          return accumulator;
        }
        return accumulator + metric.added;
      }, 0);

      const storyPointsBurned = metrics
        .reduce((accumulator, nextMetric) => accumulator + nextMetric.completed, 0);

      const storyPointsLeft = storyPointsInSprint - storyPointsBurned;

      res.send({
        sprintName,
        sprintNumber,
        sprintStartDate,
        sprintEndDate,
        sprintDuration,
        daysRemaning,
        totalPointsInSprint: storyPointsInSprint,
        totalCompletedPointsInSprint: storyPointsBurned,
        leftInSprint: storyPointsLeft,
        metrics,
        storyPointsAddedDuringSprint,
      });
    } else {
      console.log('Error encountered finding sprint start action');
      res.status(500);
      res.send('Error encountered with missing data');
    }
  } catch (error) {
    console.log(error);
    res.status(error.status);
    res.send(error.message);
  }
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(pretty());

app.listen(process.env.PORT, () => console.log(`The API is listening on port ${process.env.PORT}`));

https
  .createServer(
    {
      key: fs.readFileSync('/etc/letsencrypt/live/eivanov.dev/privkey.pem'),
      cert: fs.readFileSync('/etc/letsencrypt/live/eivanov.dev/cert.pem'),
      ca: fs.readFileSync('/etc/letsencrypt/live/eivanov.dev/fullchain.pem'),
    },
    app,
  )
  .listen(process.env.SSL_PORT, () => {
    console.log(`HTTPS Server is listening on port ${process.env.SSL_PORT}`);
  });
