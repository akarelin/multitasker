import React, { Component } from 'react';
import FlaggedMessages from '../FlaggedMessages/FlaggedMessages.component'
import PlannerTasks from '../PlannerTasks/PlannerTasks.component'
import OutlookTasks from '../OutlookTasks/OutlookTasks.component'
import moment from 'moment';
import config from '../../Config';
import { getPlannerTasks, getFlaggedMessages, getOutlookTasks } from '../../GraphService';

export function formatDateTime(dateTime) {
    return moment.utc(dateTime).local().format('M/D/YY H:MM');
}

class AllTasks extends Component {
    constructor(props) {
        super(props);

        this.state = {
            outlookTasks: [],
            flaggedMessages: [],
            plannerTasks: [],
            token: undefined
        };
    }

    async componentDidMount() {
        try {
            const accessToken = await window.msal.acquireTokenSilent(config.scopes);
            const outlookTasks = await getOutlookTasks(accessToken);
            const flaggedMessages = await getFlaggedMessages(accessToken);
            const plannerTasks = await getPlannerTasks(accessToken);
            // Update the array of events in state
            this.setState({
                outlookTasks: outlookTasks.value,
                flaggedMessages: flaggedMessages.value,
                plannerTasks: plannerTasks.value,
                token: accessToken
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
                <PlannerTasks plannerTasks={this.state.plannerTasks} token={this.state.token}/>
            </div>
        );
    }
}

export default AllTasks
