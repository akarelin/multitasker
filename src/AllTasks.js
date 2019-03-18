import React from 'react';
import { Table } from 'reactstrap';
import moment from 'moment';
import config from './Config';
import { getPlannerTasks, getFlaggedMessages, getOutlookTasks } from './GraphService';

// Helper function to format Graph date/time
function formatDateTime(dateTime) {
  return moment.utc(dateTime).local().format('M/D/YY H:MM');
}

export default class Tasks extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      outlookTasks: [],
      flaggedMessages: [],
      plannerTasks: []
    };
  }

  async componentDidMount() {
    try {
      var accessToken = await window.msal.acquireTokenSilent(config.scopes);
      var outlookTasks = await getOutlookTasks(accessToken);
      var flaggedMessages = await getFlaggedMessages(accessToken);
      var plannerTasks = await getPlannerTasks(accessToken);
      // Update the array of events in state
      this.setState({
              outlookTasks: outlookTasks.value,
              flaggedMessages: flaggedMessages.value,
              plannerTasks: plannerTasks.value
          });
    }
    catch(err) {
      this.props.showError('ERROR', JSON.stringify(err));
    }
  }

  render() { return (
      <div>
          <h1>Outlook Tasks</h1>
          <Table>
              <thead>
                  <tr>
                      <th scope="col">subject</th>
                      <th scope="col">status</th>
                      <th scope="col">created</th>
                  </tr>
              </thead>
              <tbody>
                  {this.state.outlookTasks.map(
                      function (task, index) {
                          return (
                              <tr>
                                  <td>{task.subject}</td>
                                  <td>{task.status}</td>
                                  <td>{formatDateTime(task.createdDateTime)}</td>
                              </tr>
                          );
                      })}
              </tbody>
          </Table>
          <h1>Flagged Messages</h1>
          <Table>
              <thead>
                  <tr>
                      <th scope="col">from</th>
                      <th scope="col">subject</th>
                      <th scope="col">flag</th>
                      <th scope="col">received</th>
                  </tr>
              </thead>
              <tbody>
                  {this.state.flaggedMessages.map(
                      function (msg, index) {
                          return (
                              <tr>
                                  <td>{msg.title}</td>
                                  <td>{msg.subject}</td>
                                  <td>{msg.flag.flagStatus}</td>
                                  <td>{formatDateTime(msg.receivedDateTime)}</td>
                              </tr>
                          );
                      })}
              </tbody>
          </Table>
          <h1>Planner Tasks</h1>
          <Table>
              <thead>
                  <tr>
                      <th scope="col">title</th>
                      <th scope="col">bucketId</th>
                      <th scope="col">planId</th>
                      <th scope="col">created</th>
                  </tr>
              </thead>
              <tbody>
                  {this.state.plannerTasks.map(
                      function (task, index) {
                          return (
                                  <tr>
                                      <td>{task.title}</td>
                                      <td>{formatDateTime(task.createdDateTime)}</td>
                                  </tr>
                          );
                      })}
              </tbody>
          </Table>
      </div>
    );
  }
}
