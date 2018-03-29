module.exports = function (promise) {
	return promise.then(data => [ data ]).catch(error => [ null, error ]);
}