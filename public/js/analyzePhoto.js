function analyzePhoto () {
	document.getElementById("camera").hidden = true;
	let photoUrl = document.getElementById("photoContainer").toDataURL("image/jpeg");
	// Azure Function call.
	fetch(photoUrl)
	.then(response => response.blob())
	.then(blob => {
			fetch("https://facediary-func.azurewebsites.net/api/FaceAnalyzer?code=7paM0ff5OALQkLUStj2OZuFxfeND//UKYpCaPqjZ9mon7jVBG6hGJA==", {
					method: 'POST',
					headers: {
							'Content-Type': 'application/octet-stream'
					},
					body: blob
			})
			.then(response => response.json())
			.then(data => {
					// If no data from the API, that means a picture of something besides a face was submitted.
					if(data.length === 0){
						alert("Hmmm, are you sure you're taking a selfie and not a picture of your goldfish? Try again.");
					} else {
						// Get strongest emotion from API result.
						let emotionAttr = data[0].faceAttributes.emotion;
						let arr = Object.values(emotionAttr);
						let max = Math.max(...arr);
						let predominantFeeling = Object.keys(emotionAttr).find(key => emotionAttr[key] === max);
						// UI changes upon photo analysis.
						document.getElementById('results').innerHTML = predominantFeeling;
						document.getElementById('uploadPhoto').hidden = false;
						document.getElementById('results-container').hidden = false;
					}
			});
	});
}
