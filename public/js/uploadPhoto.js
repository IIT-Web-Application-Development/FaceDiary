function uploadPhoto() {
	const user = document.getElementById('user-id').value.toString();
	const account = {
		name: "facediary",
		sas: "?sv=2017-07-29&ss=b&srt=sco&sp=rwdlac&se=2018-05-14T22:09:26Z&st=2018-04-30T14:09:26Z&spr=https,http&sig=2WSbpT9jAJ%2BIXy5P7sq4uC81r6dQC7tfZeqPetfc8pM%3D"
	};
	const blobUri = 'https://' + account.name + '.blob.core.windows.net';
	const blobService = AzureStorage.Blob.createBlobServiceWithSas(blobUri, account.sas);

	document.getElementById('photoContainer').toBlob(blob => {
		// Converted blob to a browser file because I kept getting an "image too small" error when uploading the photo as a blob.
		var photoFile = new File([blob], "testPhoto.png");
		// Convoluted photoName because the JS Azure blob file upload function doesn't return the blob URI in its response. 
		// Blob URI is saved in the database as part of the entry.
		// If I were to use a simple userID+date, then the URI would be really complicated due the slashes and colons in a date string.
		// So, I picked to have my poison here.
		let timeStamp = new Date();
		let photoName = user + timeStamp.getFullYear().toString()+(timeStamp.getMonth()+1).toString() + timeStamp.getDate().toString() + timeStamp.getHours().toString() + timeStamp.getMinutes().toString();

		blobService.createBlockBlobFromBrowserFile(
			'face-container', 
			photoName, 
			photoFile, 
			(error, result) => {
					if(error) {
							alert("There was an error uploading your selfie. Refresh the page and try again.");
					} else if (result) {
							document.getElementById('picture-url').value = blobUri + "/face-container/" + photoName;
							// UI changes upon successful photo upload
							document.getElementById('camera').hidden = true;
							document.getElementById('comment').hidden = false;
							document.getElementById('finish-entry').hidden = false;
							document.getElementById('emotion').value = document.getElementById('results').innerHTML;
							document.getElementById('date').value = timeStamp.toLocaleString();
					}
		});
	});
}
