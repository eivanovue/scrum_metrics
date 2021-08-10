require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const pretty = require('express-prettify');
const dayjs = require('dayjs');

const {
  getFilteredBoardCards,
  getCardsForList,
  getListActions,
  getCardActions,
} = require('./services/trello');

const DATE_FORMAT = process.env.DATE_FORMAT;

const getEstimateForCard = require('./util/getEstimateForCard');
const calculateSprintDates = require('./util/calculateSprintDates');

const app = express();
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});


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

      const completedCardsAndActions = await Promise.all(completedCards.map(async card => {
        const actions = await getCardActions(card.id);
        const completedAction = actions.find(action =>
          action.data.listAfter &&
          action.data.listAfter.name === required[required.length - 1]
        );

        return {
          card,
          action: completedAction
        };
      }));

      let remaining = totalPointsInSprint;

      const metrics = datesInSprint.map(dateAndDay => {
        const { day, date } = dateAndDay;
        const points = completedCardsAndActions.reduce((accumulator, nextCardAndAction) => {
          const actionDate = dayjs(nextCardAndAction.action.date).format(DATE_FORMAT);

          if (actionDate === date) {
            return accumulator + getEstimateForCard(nextCardAndAction.card);
          }

          return accumulator
        }, 0)

        remaining = remaining - points;

        return {
          day,
          date,
          completed: points,
          remaining,
        }
      });

      res.send({
        sprintName,
        sprintNumber,
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

app.use(pretty());

app.listen(3001, () => console.log(`The API is listening on port 3001!`));
