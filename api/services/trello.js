const axios = require('axios');

const GET_CARD_URL = `https://api.trello.com/1/cards/{cardId}?key=${process.env.TRELLO_API_KEY}&token=${process.env.TRELLO_TOKEN}`;
const GET_LISTS_URL = `https://api.trello.com/1/boards/${process.env.AZZURRI_TRELLO_BOARD}/lists?key=${process.env.TRELLO_API_KEY}&token=${process.env.TRELLO_TOKEN}`;
const GET_CARDS_URL = `https://api.trello.com/1/lists/{listId}/cards?key=${process.env.TRELLO_API_KEY}&token=${process.env.TRELLO_TOKEN}&pluginData=true`;
const GET_CARDS_ACTION_URL = `https://api.trello.com/1/cards/{cardId}/actions?key=${process.env.TRELLO_API_KEY}&token=${process.env.TRELLO_TOKEN}&filter=updateCard`;
const GET_LIST_ACTION_URL = `https://api.trello.com/1/lists/{listId}/actions?key=${process.env.TRELLO_API_KEY}&token=${process.env.TRELLO_TOKEN}`;
const GET_BATCH_URL = `https://api.trello.com/1/batch?key=${process.env.TRELLO_API_KEY}&token=${process.env.TRELLO_TOKEN}&urls={urls}`;
const CreateError = require('http-errors');
const chunk = require('../util/split-array-into-chunks');

const getBatchCardActions = async (cardIds) => {
  const urls = cardIds.map((cardId) => `/cards/${cardId}/actions`);
  const batchUrls = chunk(urls, 10);
  const actions = (await Promise.all(batchUrls.map(async (urls) => {
    const actions = await axios.get(GET_BATCH_URL.replace('{urls}', urls));
    return actions.data;
  }))).flat().map((action) => action['200']).flat();

  return actions;
};

const getCardById = async (cardId) => {
  try {
    const card = (await axios.get(GET_CARD_URL.replace('{cardId}', cardId))).data;
    return card;
  } catch (error) {
    if (error.response) {
      throw new CreateError(error.response.status, error.response.data.message);
    }
  }
};

const getListsForBoard = async () => {
  try {
    const lists = (await axios.get(GET_LISTS_URL)).data;
    return lists;
  } catch (error) {
    if (error.response) {
      throw new CreateError(error.response.status, error.response.data.message);
    }
  }
};

const getCardsForList = async (listId) => {
  try {
    const cards = (await axios.get(GET_CARDS_URL.replace('{listId}', listId))).data;
    return cards;
  } catch (error) {
    if (error.response) {
      throw new CreateError(error.response.status, error.response.data.message);
    }
  }
};

const getCardActions = async (cardId) => {
  try {
    const actions = (await axios.get(GET_CARDS_ACTION_URL.replace('{cardId}', cardId))).data;
    return actions;
  } catch (error) {
    if (error.response) {
      throw new CreateError(error.response.status, error.response.data.message);
    }
  }
};

const getListActions = async (listId) => {
  try {
    const actions = (await axios.get(GET_LIST_ACTION_URL.replace('{listId}', listId))).data;
    return actions;
  } catch (error) {
    if (error.response) {
      throw new CreateError(error.response.status, error.response.data.message);
    }
  }
};

module.exports = {
  getCardsForList,
  getCardById,
  getCardActions,
  getListActions,
  getListsForBoard,
  getBatchCardActions,
};
