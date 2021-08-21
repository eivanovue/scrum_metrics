const dayjs = require('dayjs');
const getCardEstimate = require('./get-card-estimate');

const getAddedPoints = (cards, date, requiredLists) => cards.reduce((accumulator, nextCard) => {
  const { actions } = nextCard;
  const { card } = nextCard;

  const movedIntoSprintAction = actions.find(action => {
    if (action.data.listAfter) {
      if ((action.data.listAfter.name === requiredLists[0] && action.data.listBefore.name === 'Dev Ready (Refined and estimated)') ||
        (action.data.listAfter.name === requiredLists[1] && action.data.listBefore.name === 'Dev Ready (Refined and estimated)')) {
        return true;
      }
    }
    return false;
  });

  if (movedIntoSprintAction) {
    const actionDate = dayjs(movedIntoSprintAction.date).format(process.env.DATE_FORMAT);
    if (actionDate === date) {
      return accumulator + getCardEstimate(card);
    }
    return accumulator;
  }
  return accumulator;
}, 0);

module.exports = getAddedPoints;