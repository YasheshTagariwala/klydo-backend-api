let Post = require('../Models/Posts');
let catchError = require('../../Config/ErrorHandling');

let getAllUserPost = async function (req, res) {	
	let [singlePost,err] = await catchError(Post.with('userProfile').where('profile_id',req.body.user_id).get());
	res.json(singlePost);	
};

module.exports = {
	'getAllUserPost': getAllUserPost,	
}