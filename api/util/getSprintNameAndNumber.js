module.exports = (lists) => {
  const SPRINT_BACKLOG_REGEX = RegExp('Sprint+\\s\\w+ -\\sBacklog');
  const { name: sprintBacklogListName } = lists.find(list => SPRINT_BACKLOG_REGEX.test(list.name));
  const sprintName = sprintBacklogListName.split(' ')[1];

  const SPRINT_DONE_REGEX = RegExp(`Done - Sprint \\d+ \\(${sprintName}\\)`)
  const { name: sprintCompletedListName } = lists.find(list => SPRINT_DONE_REGEX.test(list.name));
  const sprintNumber = sprintCompletedListName.split(' ')[3];

  return { sprintName, sprintNumber };
}