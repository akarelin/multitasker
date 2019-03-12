var graph = require('@microsoft/microsoft-graph-client');

function getAuthenticatedClient(accessToken) {
  // Initialize Graph client
  const client = graph.Client.init({
    // Use the provided access token to authenticate
    // requests
    authProvider: (done) => {
      done(null, accessToken);
    }
  });

  return client;
}

export async function getUserDetails(accessToken) {
  const client = getAuthenticatedClient(accessToken);

  const user = await client.api('/me').version('beta').get();
  return user;
}

export async function getOutlookTasks(accessToken) {
    const client = getAuthenticatedClient(accessToken);
  
    const outlookTasks = await client
      .api('/me/outlook/tasks')
      .version('beta')
      .select("subject,status,importance")
      .filter("status ne 'Completed'")
      .get();
  
    return outlookTasks;
  }

export async function getPlannerTasks(accessToken) {
    const client = getAuthenticatedClient(accessToken);
  
    const plannerTasks = await client
      .api('/me/planner/tasks')
      .version('beta')
      .select('title,planId,bucketId')
      .get();
  
    return plannerTasks;
  }

  export async function getFlaggedMessages(accessToken) {
    const client = getAuthenticatedClient(accessToken);
  
    const flaggedMessages = await client
      .api('/me/messages')
      .version('beta')
      .select('from,subject,flag,receivedDateTime')
      .get();
  
    return flaggedMessages;
  }
