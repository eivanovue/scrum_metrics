const dayjs = require('dayjs');
const { getCardActions } = require('../services/trello');
const getEstimateForCard = require('../util/getEstimateForCard');

const DATE_FORMAT = 'dddd, MMMM D, YYYY';

module.exports = async (nextCard, required, date) => {
  const cardActions = await getCardActions(nextCard.id);

  const commpletedAction = cardActions.find(action => {
    return action.type === 'updateCard' && action.data.listAfter.name === required[required.length - 1]
  })

  const actionDate = dayjs(commpletedAction.date).format(DATE_FORMAT);
  if (actionDate === date) {
    return getEstimateForCard(nextCard);
  }

  return 0;
}