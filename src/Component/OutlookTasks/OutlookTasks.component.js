import React, {Component} from 'react';
import {Table} from "reactstrap";
import {Link} from "react-router-dom";
import {formatDateTime} from "../Task/AllTasks";
import Select from 'react-select';

class OutlookTasks extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sortElem: [],
            inputValue: '',
            statusValue: ''
        };
        this.searchTasks = this.searchTasks.bind(this);
        this.filterStatusTask = this.filterStatusTask.bind(this);
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.outlookTasks !== prevProps.outlookTasks || this.state.inputValue !== prevState.inputValue || this.state.statusValue !== prevState.statusValue) {
            let filterTasks = this.props.outlookTasks;

            if (this.state.inputValue) {
                filterTasks = filterTasks.filter(task => task.subject.toLowerCase().includes(this.state.inputValue))
            }

            if (this.state.statusValue) {
                if (this.state.statusValue !== 'all status') {
                    filterTasks = filterTasks.filter(task => this.state.statusValue === task.status);
                }
            }
            this.setState({sortElem: filterTasks})
        }
    }

    searchTasks(event) {
        const inputValue = event.target.value.toLowerCase();
        this.setState({inputValue: inputValue});
    };

    filterStatusTask(selectStatusOutlookTasks) {
        const statusValue = selectStatusOutlookTasks.value;
        this.setState({statusValue: statusValue});
    };

    render() {
        const {selectStatusOutlookTasks} = this.state;
        const status = [
            {value: 'all status', label: 'all status'},
            {value: 'waitingOnOthers', label: 'waitingOnOthers'},
            {value: 'deferred', label: 'deferred'},
            {value: 'inProgress', label: 'inProgress'},
            {value: 'notStarted', label: 'notStarted'},
            {value: 'completed', label: 'completed'}
        ];

        return (
            <div>
                <h1>Outlook Tasks</h1>
                <input type="text" onChange={this.searchTasks} placeholder='Search Outlook Tasks'/>
                <Table>
                    <thead>
                    <tr>
                        <th scope="col">subject</th>
                        <th scope="col">
                            <Select
                                value={selectStatusOutlookTasks}
                                onChange={this.filterStatusTask}
                                options={status}
                                placeholder='Select status'
                            />
                            status
                        </th>
                        <th scope="col">created</th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.state.sortElem.map(
                        function (task, index) {
                            return (
                                <tr key={index}>
                                    <td>
                                        <Link to={`/tasks/${task.id}`}>
                                            {task.subject}
                                        </Link>
                                    </td>
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

export default OutlookTasks
