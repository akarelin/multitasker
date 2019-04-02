import React, {Component} from 'react';
import {Table} from "reactstrap";
import {formatDateTime} from "../Task/AllTasks";

export default class PlannerTasks extends Component {
    constructor(props) {
        super(props);
        this.state = {
            token: '',
            plannerList: [],
            bucketsList: [],
            plannerTasks: this.props.plannerTasks,
            error: null
        };
        this.searchPlannerTasks = this.searchPlannerTasks.bind(this)
    }

    componentDidUpdate(prevProps, prevState) {

        if (this.props.plannerTasks !== prevProps.plannerTasks || this.state.token !== prevState.token) {
            this.setState({
                plannerTasks: this.props.plannerTasks,
                token: this.props.token
            });
            this.getPlannerList(this.state.token);
        }
    }

    getPlannerList(token) {
        if (token !== '') {
            fetch("https://graph.microsoft.com/beta/me/planner", {
                method: "GET",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            })
                .then(res => res.json())
                .then(
                    (result) => {
                        this.setState({plannerList: result.recentPlanReferences}, () => {
                            this.getBucketsList(this.state.token)
                        });
                    },
                    (error) => {
                        this.setState({
                            error
                        });
                    }
                )
        }
    }

    getBucketsList(token) {
        let bucketsList = [];
        let plannerListTitle = [];
        Object.keys(this.state.plannerList).forEach(plan =>
            plannerListTitle.push(plan)
        );
        plannerListTitle.map(bucket => {
            if (token) {
                fetch(`https://graph.microsoft.com/beta/planner/plans/${bucket}/buckets`, {
                    method: "GET",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                })
                    .then(res => res.json())
                    .then(
                        (result) => {
                            if (typeof result !== 'undefined') {
                                bucketsList.push(result.value);
                                this.setState({
                                    bucketsList: bucketsList
                                });
                            }
                        },
                        (error) => {
                            this.setState({
                                error
                            });
                        }
                    )
            }
        });
    }

    searchPlannerTasks(event) {
        const inputValue = event.target.value;
        let sortPlannerTasks = this.props.plannerTasks.filter(task => task.title.toLowerCase().includes(inputValue));
        this.setState({
            plannerTasks: sortPlannerTasks
        });
    };

    renderPlan(plannerList, plan) {
        let planerName = "";
        Object.keys(plannerList).forEach(plans => {
            if (plans === plan) {
                planerName = plannerList[plan].planTitle;
            }
        });
        return planerName;
    }

    renderBucket(bucketsList, bucketId) {
        let allBucketsList = [];
        if (bucketsList.length) {
            bucketsList.map(el =>
                el.forEach(element => {
                    allBucketsList.push(element)
                })
            );
        }
        let resultBucketsName = '';
            allBucketsList.map(item => {
                if (item.id === bucketId) {
                    resultBucketsName = item.name
                }
            });
        return resultBucketsName
    }

    render() {
        return (
            <div>
                <h1>Planner Tasks</h1>
                <input type="text" onChange={this.searchPlannerTasks} placeholder='Search Planner Tasks'/>
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
                    {this.state.plannerTasks.map(task => {
                        return (
                            <tr key={task.id}>
                                <td>{task.title}</td>
                                <td>{this.renderBucket(this.state.bucketsList, task.bucketId)}</td>
                                <td>{this.renderPlan(this.state.plannerList, task.planId)}</td>
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
