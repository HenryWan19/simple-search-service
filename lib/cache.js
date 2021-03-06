var request = require('request');

module.exports = function(opts) {

	if (opts === null || typeof opts === "undefined") {
		return null;
	}

	if (opts.enabled === false) {
		return null;
	}

	if (!opts.host) {
		return null;
	}

	if (opts.enabled && opts.host) {

		const makeRequest = function(method, url, key, value, callback) {

			var params = {
				method: method,
				url: `${opts.host}/key/${key}`
			};

			if (method.toLowerCase() === "post" && value) {
				params.form = { value : JSON.stringify(value) };
			}
			
			if (opts.username && opts.password) {
				var auth = "Basic " + new Buffer(opts.username + ":" + opts.password).toString("base64");
				params.headers = {
					"Authorization" : auth
				};
			}

			request(params, function(e, r, b) {

				if (e) {
					return callback(e);
				}

				var body = null;

				try {
					body = JSON.parse(b);
				} catch (e) {
					body = b;
				}

				if (body.success === false || !body.data) {
					return callback(true);
				}

				return callback(null, body.data);

			});

		};

		return {

			put: function(key, value, callback) {

				makeRequest("post", opts.host, key, value, callback);

			},

			get: function(key, callback) {

				makeRequest("get", opts.host, key, null, callback);

			},

			clearAll: function() {

				request({ url: `${opts.host}/clearall`, method: "POST"});

			},

			enabled: opts.enabled,

			host: opts.host

		};

	}

};