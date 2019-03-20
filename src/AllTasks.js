import React, { Component } from 'react';
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
        catch (err) {
            this.props.showError('ERROR', JSON.stringify(err));
        }
    }

    render() {
        return (
            <div>
                <OutlookTasks outlookTasks={this.state.outlookTasks}/>
                <FlaggedMessages flaggedMessages={this.state.flaggedMessages}/>
                <PlannerTasks plannerTasks={this.state.plannerTasks}/>
            </div>
        );
    }
}

class OutlookTasks extends Component {
    constructor(props) {
        super(props);
        console.log(props);
        this.state = {
            sortElem: []
        };
        this.searchHandler = this.searchHandler.bind(this);
    }

    componentDidUpdate(prevProps) {
        if (this.props.outlookTasks !== prevProps.outlookTasks) {
            this.setState({sortElem: this.props.outlookTasks});
        }
    }

    searchHandler(event) {
        let inputValue = event.target.value.toLowerCase();
        let arr = [];
        this.props.outlookTasks.map(task => {
            if (task.subject.toLowerCase().includes(inputValue) || !task) {
                arr.push(task);
            }
        });
        this.setState({
            sortElem: arr
        })
    }

    render() {
        return (
            <div>
                <h1>Outlook Tasks</h1>
                <input type="text" onChange={this.searchHandler} placeholder='Search Outlook Tasks'/>
                <Table>
                    <thead>
                    <tr>
                        <th scope="col">subject</th>
                        <th scope="col">status</th>
                        <th scope="col">created</th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.state.sortElem.map(
                        function (task, index) {
                            return (
                                <tr key={index}>
                                    <td>{task.subject}</td>
                                    <td>{task.status}</td>
                                    <td>{formatDateTime(task.createdDateTime)}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </Table>
            </div>
        )
    }
}

class FlaggedMessages extends Component {
    render() {
        return (
            <div>
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
                    {this.props.flaggedMessages.map(
                        function (msg, index) {
                            return (
                                <tr key={index}>
                                    <td>{msg.title}</td>
                                    <td>{msg.subject}</td>
                                    <td>{msg.flag.flagStatus}</td>
                                    <td>{formatDateTime(msg.receivedDateTime)}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </Table>
            </div>
        )
    }
}

class PlannerTasks extends Component {
    render() {
        return (
            <div>
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
                    {this.props.plannerTasks.map(
                        function (task, index) {
                            return (
                                <tr key={index}>
                                    <td>{task.title}</td>
                                    <td>{formatDateTime(task.createdDateTime)}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </Table>
            </div>
        )
    }
}
