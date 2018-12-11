# Ice Trae Bot

## What is this?

This is a sports focused bot that can relay stat information regarding a player in real time via a POST call, and is meant to be run as a cron job anywhere that can run a serverless node function.

## How does this works

1. On a schedule (defaulting to once per minute) the service will run `runPoller()` inside `index.js`.
2. This will trigger a service request to the database (more on that below) to get the information needed regarding the player and the stat currently being tracked.
3. Another request will be made, and this time to the ESPN API to get the schedule and check if a game is in progress. (This step could be made more efficient by polling the schedule once a day and saving that data. Feel free to raise a PR 😊).
4. Once it is determined that a game is currently taking place the service will make a request to get the real time stats for that game.
5. If there is a change from the last poll then it will POST the result to the url specified

Scenarios in which the service will POST to the corresponding url:
    * Game Start
    * Player "fail" (Misses a shot, incompletion, missed field goal, etc.)
    * Player "success" (Makes a shot, Rebound, Turnover, Makes field goal, completes pass, etc.)

## How to use this

1. `git clone git@github.com:kanestapler/ice-trae-bot-poller.git`
2. Open `createDatabaseUtil.js` and change the AWS region and Table name to whatever you choose
3. Uncomment `createTable()` and run `node createDatabaseUtil.js`. Verify database was created
4. Fill in the player object with the data needed
5. Uncomment `createPlayer()` and run `node createDatabaseUtil.js`. Verify player was added to database
6. Run `serverless deploy` to deploy this service to AWS. Make sure you have your local AWS set up properly
7. On the AWS console find the Lamda that was just deployed
8. Scroll down to find the Environment Variables and add the key-value pairs below, but changed to match your environment
    * API_TOKEN=super-secret-api-token
    * BROADCAST_URL=http://localhost:3002
    * PLAYER_ID=4277905
9. Wait for a game to start for your player and hope it worked 😊
