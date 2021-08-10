const axios = require('axios');

const GET_LISTS_URL = `https://api.trello.com/1/boards/${process.env.AZZURRI_TRELLO_BOARD}/lists?key=${process.env.TRELLO_API_KEY}&token=${process.env.TRELLO_TOKEN}`;
const GET_CARDS_URL = `https://api.trello.com/1/lists/{listId}/cards?key=${process.env.TRELLO_API_KEY}&token=${process.env.TRELLO_TOKEN}&pluginData=true`;
const GET_CARDS_ACTION_URL = `https://api.trello.com/1/cards/{cardId}/actions?key=${process.env.TRELLO_API_KEY}&token=${process.env.TRELLO_TOKEN}&filter=updateCard`;
const GET_LIST_ACTION_URL = `https://api.trello.com/1/lists/{listId}/actions?key=${process.env.TRELLO_API_KEY}&token=${process.env.TRELLO_TOKEN}`;

const getFilteredBoardCards = async (filter) => {
  try {
    const lists = (await axios.get(GET_LISTS_URL)).data;
    return lists.filter(list => filter.includes(list.name));
  } catch (err) {
    console.log(err);
  }
}

const getCardsForList = async listId => {
  try {
    const cards = (await axios.get(GET_CARDS_URL.replace('{listId}', listId))).data;
    return cards;
  } catch (err) {
    console.log(err);
  }
}

const getCardActions = async cardId => {
  try {
    const actions = (await axios.get(GET_CARDS_ACTION_URL.replace('{cardId}', cardId))).data;
    return actions;
  } catch (err) {
    console.log(err);
  }
}

const getListActions = async listId => {
  try {
    const actions = (await axios.get(GET_LIST_ACTION_URL.replace('{listId}', listId))).data;
    return actions;
  } catch (err) {
    console.log(err);
  }
}

module.exports = {
  getFilteredBoardCards,
  getCardsForList,
  getCardActions,
  getListActions,
}