const getSprintInfo = (sprintNumber, sprintName) => (
  [
    `Sprint ${sprintName} - Backlog`,
    'In Progress',
    'Blocked',
    'In Review',
    'PO Approval',
    `Done - Sprint ${sprintNumber} (${sprintName})`,
  ]
);

module.exports = getSprintInfo;
