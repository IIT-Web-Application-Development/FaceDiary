function uploadPhoto() {
	const user = document.getElementById('user-id').value.toString();
	const account = {
		name: "facediary",
		sas: "?sv=2017-07-29&ss=b&srt=sco&sp=rwdlac&se=2018-05-14T22:09:26Z&st=2018-04-30T14:09:26Z&spr=https,http&sig=2WSbpT9jAJ%2BIXy5P7sq4uC81r6dQC7tfZeqPetfc8pM%3D"
	};
	const blobUri = 'https://' + account.name + '.blob.core.windows.net';
	const blobService = AzureStorage.Blob.createBlobServiceWithSas(blobUri, account.sas);

	document.getElementById('photoContainer').toBlob(blob => {
		var photoFile = new File([blob], "testPhoto.png");
		let timeStamp = new Date();
		let photoName = user + timeStamp.getFullYear().toString()+(timeStamp.getMonth()+1).toString() + timeStamp.getDate().toString() + timeStamp.getHours().toString() + timeStamp.getMinutes().toString();
		blobService.createBlockBlobFromBrowserFile(
			'face-container', 
			photoName, 
			photoFile, 
			(error, result, response) => {
					if(error) {
							alert("There was an error uploading your selfie. Refresh the page and try again.");
					} else if (result) {
							console.log(photoName);
							document.getElementById('camera').hidden = true;
							document.getElementById('comment').hidden = false;
							document.getElementById('finish-entry').hidden = false;
							document.getElementById('emotion').value = document.getElementById('results').innerHTML;
							document.getElementById('date').value = timeStamp.toLocaleString();
							document.getElementById('picture-url').value = blobUri + "/face-container/" + photoName;
					}
		});
	});
}
