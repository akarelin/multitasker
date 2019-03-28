import React, { Component } from 'react';
import {Table} from "reactstrap";
import {formatDateTime} from "../Task/AllTasks";

export default class PlannerTasks extends Component {
    constructor(props) {
        super(props);
        this.state = {
            plannerTasks: this.props.plannerTasks
        };
        this.searchPlannerTasks = this.searchPlannerTasks.bind(this)
    }

    async componentDidUpdate(prevProps) {
        if (this.props.plannerTasks !== prevProps.plannerTasks) {
            this.setState({
                plannerTasks: this.props.plannerTasks
            });
        }
    };

    searchPlannerTasks(event) {
        const inputValue = event.target.value;
        let sortPlannerTasks = this.props.plannerTasks.filter(task => task.title.toLowerCase().includes(inputValue));;
        this.setState({
            plannerTasks: sortPlannerTasks
        });
    };
    render() {
        return (
            <div>
                <h1>Planner Tasks</h1>
                <input type="text" onChange={this.searchPlannerTasks} placeholder='Search Planner Tasks'/>
                <Table>
                    <thead>
                    <tr>
                        <th scope="col">title</th>
                        <th scope="col">created</th>
                        <th scope="col">bucketId</th>
                        <th scope="col">planId</th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.state.plannerTasks.map(task => {
                            return (
                                <tr key={task.id}>
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
