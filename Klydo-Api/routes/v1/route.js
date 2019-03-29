module.exports = (app, express) => {

    let router = express.Router();

    // =========================================================================================================================
    router.post('/user/change-profile-image',loadV1Controller('UserController').updateProfileImage);
    router.post('/user/change-status',loadV1Controller('UserController').changeStatus);
    // all activity controlller routes
    //
    // activity controller routes
    router.get('/activity/getBubbleActivity/:user_id/:friend_id', loadV1Controller('ActivityController').getBubbleActivity);
    router.get('/activity/around/:id',loadV1Controller('ActivityController').getAroundYouActivity);
    router.get('/activity/all/:id',loadV1Controller('ActivityController').getUserActivity);

    //friend controller routes
    router.get('/friend/following/:id/:friend_id?/',loadV1Controller('FriendsController').getFollowings);
    router.get('/friend/getBubbleFriends/:user_id', loadV1Controller('FriendsController').getBubbleFriends);
    router.get('/friend/addToBubble/:user_id/:friend_id', loadV1Controller('FriendsController').addToBubble);
    router.get('/friend/removeFromBubble/:user_id/:friend_id', loadV1Controller('FriendsController').removeFromBubble);
    //
    // =========================================================================================================================
    // all post controlller routes
    //
    // post editing
    router.post('/post/update', loadV1Controller('PostController').updatePost);
    //
    // =========================================================================================================================
    // all klyspace controlller routes
    //
    // klyspace
    router.get('/klyspace-data/fetch/:user_id', loadV1Controller('KlyspaceController').getKlyspaceData);
    router.post('/klyspace-data/add', loadV1Controller('KlyspaceController').addKlyspaceData);
    //
    // =========================================================================================================================
    //all graph controller routes
    // router.get('/graph/updateKly/:query', loadV1Controller('GraphController').getSimilarBeliefs);
    router.post('/graph/similar/', loadV1Controller('GraphController').getSimilarBeliefs);

    //
    // =========================================================================================================================
    //all token routes
    router.post('/update-token', loadV1Controller('TokenController').updateUserToken);

    //profile controller
    router.get('/user/:id/:friend_id?', loadV1Controller('UserController').getUserDetail);

    //
    // =========================================================================================================================
    // Define the home page route
    router.get('/', (req, res) => {
        res.send('Write the whole URL you lazy ass.');
    });

    app.use('/app/v1', router);

};
