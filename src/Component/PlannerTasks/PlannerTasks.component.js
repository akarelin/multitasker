import React, { Component } from 'react';
import {Table} from "reactstrap";
import {formatDateTime} from "../Task/AllTasks";

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
export default PlannerTasks
