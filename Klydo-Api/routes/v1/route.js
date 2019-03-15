module.exports = (app,express) => {

	let router = express.Router();

	// =========================================================================================================================
	// all activity controlller routes
	// 
	// bubble related
	router.get('/activity/getBubbleActivity/:user_id/:friend_id', loadV1Controller('ActivityController').getBubbleActivity);
	router.get('/friend/getBubbleFriends/:user_id', loadV1Controller('FriendsController').getBubbleFriends);
	router.get('/friend/addToBubble/:user_id/:friend_id', loadV1Controller('FriendsController').addToBubble);
	router.get('/friend/removeFromBubble/:user_id/:friend_id', loadV1Controller('FriendsController').removeFromBubble);
	// 
	// =========================================================================================================================
	// all post controlller routes
	// 
	// post editing 
	router.get('/post/fetchEditablePost/:post_id', loadV1Controller('PostController').fetchEditablePost);
	router.get('/post/update/:post_id', loadV1Controller('PostController').updatePost);
	// 
	// =========================================================================================================================
	// all klyspace controlller routes
	// 
	// klyspace
	router.get('/klyspace/voteOnKly/:user_id/:vote_list', loadV1Controller('KlyspaceController').voteOnKly);
	router.get('/klyspace/rateOnKly/:user_id/:rate_list', loadV1Controller('KlyspaceController').rateOnKly);
	router.get('/klyspace/fetchKly/:user_id', loadV1Controller('KlyspaceController').fetchKly);
	router.post('/klyspace-data/add',loadV1Controller('KlyspaceController').addKlyspaceData);
	// 
	// =========================================================================================================================
	//all graph controller routes
	router.get('/graph/updateKly/:query', loadController('GraphController').getSimilarBeliefs);
	router.get('/graph/similar/:query', loadController('GraphController').getSimilarBeliefs);

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
