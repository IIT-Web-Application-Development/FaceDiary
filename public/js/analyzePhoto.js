function analyzePhoto () {
	document.getElementById("camera").hidden = true;
	let photoUrl = document.getElementById("photoContainer").toDataURL("image/jpeg");

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
					let emotionAttr = data[0].faceAttributes.emotion;
					let arr = Object.values(emotionAttr);
					let max = Math.max(...arr);
					let predominantFeeling = Object.keys(emotionAttr).find(key => emotionAttr[key] === max);
					document.getElementById("results").innerHTML = predominantFeeling;
					document.getElementById("results-container").hidden = false;
			});
	});
}
