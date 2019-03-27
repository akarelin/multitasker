import React, {Component} from 'react';
import sanitizeHtml from "sanitize-html-react";
import {getOutlookTasks} from "../../GraphService";
import {Table} from "reactstrap";
import config from "../../Config";

class ContentOutlookTasks extends Component {

    constructor(props) {
        super(props);
        this.state = {
            outlookTasks: []
        };
    }

    async componentDidMount() {
        let accessToken = await window.msal.acquireTokenSilent(config.scopes);
        let outlookTasks = await getOutlookTasks(accessToken);
        this.setState({
            outlookTasks: outlookTasks.value
        });
    }

    clear(content) {
        let clean = sanitizeHtml(content, {
            allowedTags: [],
            parser: {lowerCaseTags: true}
        });
        return clean.replace(/\s{2,}/g, '');
    }

    render() {
        return (
            <div>
                <Table>
                    <thead>
                    <tr>
                        <th scope="col">subject</th>
                        <th scope="col">content</th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.state.outlookTasks.map(tasks => {
                        return (
                            this.props.match.params.id === tasks.id &&
                            <tr key={tasks.id}>
                                <td>{tasks.subject}</td>
                                <td>{this.clear(tasks.body['content'])}</td>
                            </tr>
                        )
                    })}
                    </tbody>
                </Table>
            </div>
        )
    }
}

export default ContentOutlookTasks
