// This is the code that runs on the Azure Function
var fetch = require('node-fetch');

module.exports = function (context, req) {
	let urlBase = "https://eastus2.api.cognitive.microsoft.com/face/v1.0/detect";

	fetch(urlBase+"?returnFaceAttributes=emotion", {
					method: 'POST',
					headers: {
									'Ocp-Apim-Subscription-Key': 'INSERT KEY',
									'Content-Type': 'application/octet-stream'
					},
					body: req.body
	})
	.then(response => response.json())
	.then(data => {
					context.res = {
									body: data
					};
					context.log(data)
					context.done();
	})  
}