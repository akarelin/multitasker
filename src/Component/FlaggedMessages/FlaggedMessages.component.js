import React, { Component } from 'react';
import {Table} from "reactstrap";
import { formatDateTime } from '../Task/AllTasks';

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
export default FlaggedMessages
