function makeEntry() {
	const account = {
		name: "facediary",
		sas: "?sv=2017-07-29&ss=b&srt=sco&sp=rwdlac&se=2018-04-28T22:52:39Z&st=2018-04-27T14:52:39Z&spr=https,http&sig=0oQKktf0eKrbrfm3gmXt4HxLgIiQJsV99nVsoxfEXqk%3D"
	};
	const blobUri = 'https://' + account.name + '.blob.core.windows.net';
	const blobService = AzureStorage.Blob.createBlobServiceWithSas(blobUri, account.sas);

	document.getElementById('photoContainer').toBlob(blob => {
		var photoFile = new File([blob], "testPhoto.png");
		blobService.createBlockBlobFromBrowserFile('face-container', 
																							photoFile.name, 
																							photoFile, 
																							(error, result) => {
																									if(error) {
																											console.log(error);
																											console.log("You done messed up.")
																									} else {
																											console.log('Upload is successful');
																									}
																							});
	});
}