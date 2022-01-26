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
  getSprintReport,
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
      id: sprintId,
      name: sprintInfo,
      startDate,
      goal,
    } = currentSprint;

    const {
      contents: {
        completedIssuesEstimateSum: { value: storyPointsBurned },
        issuesNotCompletedEstimateSum: { value: storyPointsRemaining },
        issueKeysAddedDuringSprint,
      },
    } = await getSprintReport(sprintId);

    const storyPointsInSprint = () => {
      let result = 0;

      if (storyPointsBurned) {
        result += storyPointsBurned;
      }

      if (storyPointsRemaining) {
        result += storyPointsRemaining;
      }

      return result;
    };

    const issuesForSprint = await getIssuesForSprint(sprintId);

    if (!issuesForSprint) {
      throw new CreateError(404, 'Could not get issues for sprint');
    }

    const completedIssues = issuesForSprint
      .filter(({ fields }) => fields.status.name === 'Done');

    const issuesAddedDuringSprint = Object.keys(issueKeysAddedDuringSprint);
    const issuesAddedDuringSprintNotCompleted = [];
    const storyPointsAddedDuringSprint = issuesAddedDuringSprint.reduce((
      accumulator,
      issue,
    ) => {
      const issueAddedDuringSprint = issuesForSprint
        .find((issueForSprint) => issueForSprint.key === issue);
      if (issueAddedDuringSprint) {
        const { fields } = issueAddedDuringSprint;
        if (fields.status.name !== 'Done') {
          issuesAddedDuringSprintNotCompleted.push(issueAddedDuringSprint);
        }
        return accumulator + (issueAddedDuringSprint
          .fields[process.env.JIRA_ESTIMATE_FIELD]) || accumulator;
      }
      return accumulator;
    }, 0);

    const leftInSprint = storyPointsRemaining;
    // + calculateTotalStoryPoints(issuesAddedDuringSprintNotCompleted);

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
        added: day === 1 ? (storyPointsInSprint() - storyPointsAddedDuringSprint) : added,
        burned,
      };
    });

    let remaining = rawMetrics[0].added;

    const metrics = rawMetrics.map((metric) => {
      const { added, burned: completed, day } = metric;

      if (day === 1) {
        remaining -= completed;
      } else {
        remaining = (remaining - completed) + added;
      }

      return {
        day,
        added,
        completed,
        remaining,
      };
    });

    res.send({
      sprint: {
        sprintId,
        startDate,
      },
      sprintGoals,
      sprintName,
      sprintNumber,
      totalPointsInSprint: storyPointsInSprint(),
      storyPointsAddedDuringSprint,
      totalCompletedPointsInSprint: storyPointsBurned || 0,
      leftInSprint,
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
