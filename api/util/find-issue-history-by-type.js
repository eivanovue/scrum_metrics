const ISSUE_HISTORY_TYPES = require('../enums/issue-history-types');

const findIssueHistoryByType = (type, { changelog: { histories } }, sprintId) => {
  if (type === ISSUE_HISTORY_TYPES.ADDED) {
    return histories
      .find(({ items }) => items[0].from === '' && Number(items[0].to) === sprintId);
  }

  if (type === ISSUE_HISTORY_TYPES.BURNED) {
    return histories
      .find(({ items }) => items[0].fromString === 'PO Approval' && items[0].toString === 'Done');
  }

  return null;
};

module.exports = findIssueHistoryByType;
