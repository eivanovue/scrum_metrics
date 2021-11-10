const router = require('express').Router();

const {
  getCardsForList,
  getCardById,
  getListsForBoard,
  getBatchCardActions,
  getCardActions,
} = require('../services/trello.js');

const {
  calculateSprintDates,
  getBurnedPoints,
  getAddedPoints,
  getCardEstimate,
  getRequiredLists,
  getSprintInfo,
} = require('../util');

router.get('/sprint/metrics', async (req, res) => {
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
      .find((action) => action.data.old.name && action.data.old.name !== action.data.card.name);

    if (sprintStartAction) {
      const { date } = sprintStartAction;
      const {
        sprintStartDate,
        sprintEndDate,
        sprintDuration,
        datesInSprint,
        daysRemaning,
      } = calculateSprintDates(date);

      const { desc } = await getCardById(process.env.TRELLO_SPRINT_CARD_ID);
      const sprintGoals = desc ? desc.split('\n') : undefined;

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

      let remaining = metricsRaw[0].added;

      const metrics = metricsRaw.map((metric) => {
        const { added, completed, day } = metric;

        if (day === 1) {
          remaining -= completed;
        } else {
          remaining = (remaining - completed) + added;
        }

        return {
          day,
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
        sprintGoals,
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

module.exports = router;
