import React, { Component } from 'react';
import sanitizeHtml from "sanitize-html-react";
import { getOutlookTasks } from "../../GraphService";
import config from "../../Config";

class ContentOutlookTasks extends Component{

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
         return(
            <div>
                {this.state.outlookTasks.map(tasks => {
                    return(
                        <div key={tasks.id}>
                            {(this.props.match.params.id === tasks.id) && this.clear(tasks.body['content'])}
                        </div>
                    )
                })}
            </div>
        )
    }
}

export default ContentOutlookTasks
