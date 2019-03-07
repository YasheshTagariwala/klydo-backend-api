module.exports = (app,express) => {

	let router = express.Router();

	//all activity controlller routes
	router.get('/activity/bubble/:user_id/:friend_id',loadV1Controller('ActivityController').getBubbleActivity);

	//all graph controller routes

	// Define the home page route
	router.get('/', (req, res) => {
		res.send('Write the whole URL you lazy ass.');
	});

	app.use('/app/v1', router);
	
};
