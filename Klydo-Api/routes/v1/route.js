module.exports = (app,express) => {

	let router = express.Router();

	// =========================================================================================================================
	// all activity controlller routes
	// 
	// bubble related
	router.get('/activity/getBubbleActivity/:user_id/:friend_id', loadV1Controller('ActivityController').getBubbleActivity);
	router.get('/activity/addToBubble/:user_id/:friend_id', loadV1Controller('ActivityController').addToBubble);
	router.get('/activity/removeFromBubble/:user_id/:friend_id', loadV1Controller('ActivityController').removeFromBubble);
	// 
	// =========================================================================================================================
	// all post controlller routes
	// 
	// post editing 
	router.get('/post/fetchEditablePost/:post_id', loadV1Controller('PostController').fetchEditablePost);
	router.get('/post/updatePostEdit/:post_id', loadV1Controller('PostController').updatePostEdit);
	// 
	// =========================================================================================================================
	// all klyspace controlller routes
	// 
	// klyspace
	router.get('/klyspace/voteOnKly/:user_id/:vote_list', loadV1Controller('KlyspaceController').voteOnKly);
	router.get('/klyspace/rateOnKly/:user_id/:rate_list', loadV1Controller('KlyspaceController').rateOnKly);
	router.get('/klyspace/fetchKly/:user_id', loadV1Controller('KlyspaceController').fetchKly);
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
