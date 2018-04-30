function makeEntry() {
	const user = document.getElementById('user-id').innerHTML.toString();
	const account = {
		name: "facediary",
		sas: "?sv=2017-07-29&ss=b&srt=sco&sp=rwdlac&se=2018-05-14T22:09:26Z&st=2018-04-30T14:09:26Z&spr=https,http&sig=2WSbpT9jAJ%2BIXy5P7sq4uC81r6dQC7tfZeqPetfc8pM%3D"
	};
	const blobUri = 'https://' + account.name + '.blob.core.windows.net';
	const blobService = AzureStorage.Blob.createBlobServiceWithSas(blobUri, account.sas);

	document.getElementById('photoContainer').toBlob(blob => {
		var photoFile = new File([blob], "testPhoto.png");
		let photoName = user + "-" + Date().split('GMT')[0];
		blobService.createBlockBlobFromBrowserFile(
			'face-container', 
			photoName, 
			photoFile, 
			(error, result) => {
					if(error) {
							console.log(error);
							// TODO - Add empty div that gets filled upon error.
							console.log("You done messed up.")
					} else if (result) {
							document.getElementById("camera").hidden = true;
							document.getElementById('emotion').value = document.getElementById('results').innerHTML;
							document.getElementById('date').value = photoName;
					}
		});
	});
}
