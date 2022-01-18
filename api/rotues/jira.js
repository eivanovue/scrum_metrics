const router = require('express').Router();
const CreateError = require('http-errors');

const dayjs = require('dayjs');
const {
  calculateSprintDates,
  findIssueHistoryByType,
} = require('../util');

const {
  getCurrentSprint,
  getIssuesForSprint,
} = require('../services/jira');

const ISSUE_HISTORY_TYPES = require('../enums/issue-history-types');

const calculateTotalStoryPoints = (issues) => issues
  .reduce((
    accumulator,
    nextIssue,
  ) => accumulator + (nextIssue.fields[process.env.JIRA_ESTIMATE_FIELD]) || accumulator, 0);

const getStoryPointsForDate = (
  type,
  issues,
  date,
  sprintId,
) => issues.reduce((accumulator, nextIssue) => {
  const history = findIssueHistoryByType(type, nextIssue, sprintId);
  if (history) {
    const { created: historyDate } = history;
    const historyDateFormatted = dayjs(historyDate).format(process.env.DATE_FORMAT);

    if (historyDateFormatted === date) {
      return accumulator + calculateTotalStoryPoints([nextIssue]);
    }

    return accumulator;
  }
  return accumulator;
}, 0);

router.get('/board/:boardId/sprint', async (req, res) => {
  const { boardId } = req.params;

  try {
    const currentSprint = await getCurrentSprint(boardId);

    if (!currentSprint) {
      console.log('Error encountered finding sprint start action');
      res.status(500);
      res.send('Error encountered with missing data');
    }

    const {
      id: sprintId, name: sprintInfo, startDate, goal,
    } = currentSprint;
    const issuesForSprint = await getIssuesForSprint(sprintId);

    if (!issuesForSprint) {
      throw new CreateError(404, 'Could not get issues for sprint');
    }

    const completedIssues = issuesForSprint
      .filter(({ fields }) => fields.status.name === 'Done');

    const storyPointsInSprint = calculateTotalStoryPoints(issuesForSprint);
    const storyPointsBurned = calculateTotalStoryPoints(completedIssues);
    const storyPointsRemaining = storyPointsInSprint - storyPointsBurned;
    const sprintGoalsRaw = goal ? goal.split('\n') : undefined;

    const sprintGoals = sprintGoalsRaw.map((goal) => {
      if (goal.includes('[done]')) {
        return {
          goal: goal.replace('[done]', ''),
          completed: true,
        };
      }
      return {
        goal,
        completed: false,
      };
    });

    const sprintName = sprintInfo.split(' - ')[1];
    const sprintNumber = sprintInfo.split(' - ')[0];

    const {
      sprintStartDate,
      sprintEndDate,
      sprintDuration,
      datesInSprint,
      daysRemaning,
    } = calculateSprintDates(currentSprint.startDate);

    const rawMetrics = datesInSprint.map(({ date, day }) => {
      const burned = getStoryPointsForDate(
        ISSUE_HISTORY_TYPES.BURNED,
        completedIssues,
        date,
      );

      const added = getStoryPointsForDate(
        ISSUE_HISTORY_TYPES.ADDED,
        issuesForSprint,
        date,
        sprintId,
      );

      return {
        day,
        added,
        burned,
      };
    });

    let remaining = storyPointsInSprint;

    const metrics = rawMetrics.map((metric) => {
      const { added, burned: completed, day } = metric;
      let initial = null;
      if (day === 1) {
        remaining -= completed;
        initial = storyPointsInSprint;
      } else {
        remaining = (remaining - completed) + added;
        initial = added;
      }

      return {
        day,
        added: initial,
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

    res.send({
      sprint: {
        sprintId,
        startDate,
      },
      sprintGoals,
      sprintName,
      sprintNumber,
      totalPointsInSprint: storyPointsInSprint,
      storyPointsAddedDuringSprint,
      totalCompletedPointsInSprint: storyPointsBurned,
      leftInSprint: storyPointsRemaining,
      sprintStartDate,
      sprintEndDate,
      sprintDuration,
      daysRemaning,
      metrics,
    });
  } catch (error) {
    console.log(error);
    res.status(error.status);
    res.send(error.message);
  }
});

module.exports = router;
