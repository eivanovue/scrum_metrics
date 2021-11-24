const axios = require('axios');
const CreateError = require('http-errors');

const { JIRA_DOMAIN } = process.env;

const authorize = () => ({
  Authorization: `Basic ${Buffer.from(
    `emil.ivanov@and.digital:${process.env.JIRA_TOKEN}`,
  ).toString('base64')}`,
});

const getFieldTypes = async () => {
  const URL = `https://${JIRA_DOMAIN}.atlassian.net/rest/api/3/field`;
  const fieldTypes = await axios.get(URL, {
    headers: {
      Accept: 'application/json',
      ...authorize(),
    },
  });
  return fieldTypes.data;
};

const getCurrentSprint = async (boardId) => {
  try {
    const URL = `https://${JIRA_DOMAIN}.atlassian.net/rest/agile/1.0/board/${boardId}/sprint`;
    const currentSprint = await axios.get(URL, {
      headers: {
        Accept: 'application/json',
        ...authorize(),
      },
    });
    return currentSprint.data.values.find(({ originBoardId, state }) => originBoardId === Number(boardId) && state === 'active');
  } catch (error) {
    if (error.response) {
      throw new CreateError(error.response.status, error.response.data.message);
    }
  }
};

const getIssuesForSprint = async (sprintId) => {
  try {
    const URL = `https://${JIRA_DOMAIN}.atlassian.net/rest/agile/1.0/sprint/${sprintId}/issue?expand=changelog`;
    const issuesForSprint = await axios.get(URL, {
      headers: {
        Accept: 'application/json',
        ...authorize(),
      },
    });
    return issuesForSprint.data.issues;
  } catch (error) {
    if (error.response) {
      throw new CreateError(error.response.status, error.response.data.message);
    }
  }
};

module.exports = {
  getFieldTypes,
  getCurrentSprint,
  getIssuesForSprint,
};
