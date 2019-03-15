module.exports = (app,express) => {

	let router = express.Router();

	// =========================================================================================================================
	// all activity controlller routes
	// 
	// bubble related
	router.get('/activity/getBubbleActivity/:user_id/:friend_id', loadV1Controller('ActivityController').getBubbleActivity);

	//friend controller routes
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
	router.post('/klyspace-data/add',loadV1Controller('KlyspaceController').addKlyspaceData);
	// 
	// =========================================================================================================================
	//all graph controller routes
	// router.get('/graph/updateKly/:query', loadV1Controller('GraphController').getSimilarBeliefs);
	// router.get('/graph/similar/:query', loadV1Controller('GraphController').getSimilarBeliefs);

    //
    // =========================================================================================================================
    //all token routes
    router.post('/update-token', loadV1Controller('TokenController').updateUserToken);

	// 
	// =========================================================================================================================
	// Define the home page route
	router.get('/', (req, res) => {
		res.send('Write the whole URL you lazy ass.');
	});

	app.use('/app/v1', router);
	
};
