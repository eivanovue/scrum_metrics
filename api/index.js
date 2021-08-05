require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const pretty = require('express-prettify');

const {
  getFilteredBoardCards,
  getCardsForList,
  getListActions,
} = require('./services/trello');


const getEstimateForCard = require('./util/getEstimateForCard');
const calculateSprintDates = require('./util/calculateSprintDates');
const calculateMetrics = require('./util/calculateMetrics');
const app = express();


app.get('/sprint/metrics/:sprintNumber/:sprintName', async (req, res) => {
  const { sprintNumber, sprintName } = req.params;

  const required = [
    `Sprint ${sprintName} - Backlog`,
    'In Progress',
    'Blocked',
    'In Review',
    'PO Approval',
    `Done - Sprint ${sprintNumber} (${sprintName})`
  ];

  try {
    const lists = await getFilteredBoardCards(required);

    const cards = (await Promise.all(lists.map(list => {
      return getCardsForList(list.id);
    }))).flat();

    const totalPointsInSprint = cards
      .reduce((accumulator, nextCard) => accumulator + getEstimateForCard(nextCard), 0);

    const completedCards = await getCardsForList(lists[lists.length - 1].id);
    const totalCompletedPointsInSprint = completedCards
      .reduce((accumulator, nextCard) => accumulator + getEstimateForCard(nextCard), 0);

    const leftInSprint = totalPointsInSprint - totalCompletedPointsInSprint;

    const listActions = (await getListActions(lists[0].id))
      .find(action => action.type === 'updateList' && action.data.old.name !== action.data.list.name);

    if (listActions) {
      const { date } = listActions;
      const {
        sprintStartDate,
        sprintEndDate,
        sprintDuration,
        datesInSprint,
        daysRemaning,
      } = calculateSprintDates(date);

      const metrics = await Promise.all(datesInSprint.map(async dateAndDay => {
        const { day, date } = dateAndDay;

        const points = await completedCards.reduce(async (accumulator, nextCard) => {
          await accumulator;
          return calculateMetrics(nextCard, required, date);
        }, Promise.resolve(0))

        return {
          day,
          date,
          completed: points,
        }
      }));

      res.send({
        sprintName,
        sprintStartDate,
        sprintEndDate,
        sprintDuration,
        daysRemaning,
        totalPointsInSprint,
        totalCompletedPointsInSprint,
        leftInSprint,
        metrics,
      });
    } else {
      res.send({
        sprintName,
        totalPointsInSprint,
        totalCompletedPointsInSprint,
        leftInSprint,
      });
    }
  } catch (err) {
    console.log(err)
  }
});


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use(pretty());

app.listen(3001, () => console.log(`The API is listening on port 3001!`));
