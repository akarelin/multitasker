import React, { Component } from 'react';
import {Table} from "reactstrap";
import {Link} from "react-router-dom";
import {formatDateTime} from "../Task/AllTasks";

class OutlookTasks extends Component {
    constructor(props) {
        super(props);
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
        const inputValue = event.target.value.toLowerCase();
        const arr = [];
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
