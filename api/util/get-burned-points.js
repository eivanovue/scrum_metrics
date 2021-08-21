const dayjs = require('dayjs');
const getCardEstimate = require('./get-card-estimate');

const getBurnedPoints = (completedCards, date) => completedCards.reduce((accumulator, nextCard) => {
  const { action: { date: actionDate } } = nextCard;
  const { card } = nextCard;
  const actionDateFormatted = dayjs(actionDate).format(process.env.DATE_FORMAT);
  if (actionDateFormatted === date) {
    return accumulator + getCardEstimate(card);
  }
  return accumulator;
}, 0);

module.exports = getBurnedPoints;