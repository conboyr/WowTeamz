const Authorize = require('../app/Middleware/Authorize.js');
const VerifyJWT = require('../app/Middleware/VerifyJWT.js');


/*
|--------------------------------------------------------------------------
| Default router
|--------------------------------------------------------------------------
|
| Default router is used to define any routes that don't belong to a
| controller. Also used as a parent container for the other routers.
|
*/
const router = require('koa-router')({
    prefix: '/api/v1'
});

router.get('/', function (ctx) {
    console.log('router.get(/)');
    return ctx.body = 'What is up?';
});

/*
|--------------------------------------------------------------------------
| login router
|--------------------------------------------------------------------------
|
| Description
|
*/

// Login router configuration.

const LoginController = require('../app/Controllers/LoginController.js');
const loginRouter = require('koa-router')({
    prefix: '/login'
});
loginRouter.get('/:email', LoginController.authorizeUser, (err) => console.log("wowteamz_routes.js: login-route error:", err));

// Accounts router configuration.

const AccountsController = require('../app/Controllers/AccountsController.js');
const accountsRouter = require('koa-router')({
    prefix: '/accounts'
});

accountsRouter.use(VerifyJWT);
accountsRouter.get('/all-accounts', Authorize('admin'), AccountsController.allAccounts, err => console.log(`allAccounts ran into an error: ${err}`));
accountsRouter.get('/:email/', Authorize('admin'), AccountsController.accountWithEmail);


// RaidTeams router configuration.

const RaidTeamsController = require('../app/Controllers/RaidTeamsController.js');
const raidteamsRouter = require('koa-router')({
    prefix: '/raidteams'
});

raidteamsRouter.use(VerifyJWT);
raidteamsRouter.get('/all-raidteams', Authorize('admin'), RaidTeamsController.allRaidTeams, err => console.log(`allRaidTeams ran into an error: ${err}`));
raidteamsRouter.get('/:raidteam_id/:character_id', Authorize('admin'), RaidTeamsController.addPlayerToRaid);



/**
 * Register all of the controllers into the default controller.
 */
router.use(
    '',
    loginRouter.routes(),
    accountsRouter.routes(),
    raidteamsRouter.routes()
);

module.exports = function (app) {
    app.use(router.routes());
    app.use(router.allowedMethods());
};
