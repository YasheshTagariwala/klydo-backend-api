let Post = loadModal('Posts');
let Comment = loadModal('PostComment');
let Activity = loadController('ActivityController');
let ActivityModel = loadModal('Activity');
let bookshelf = loadConfig('Bookshelf.js');
let Reaction = loadModal('PostReaction');
let _ = require('underscore');
let Validation = loadUtility('Validations');
let Graph = loadController('GraphController');

let fetchEditablePost = async (req, res) => {
};

let updatePostEdit = async (req, res) => {
};


module.exports = {
    'fetchEditablePost': fetchEditablePost,
    'updatePostEdit': updatePostEdit
};
