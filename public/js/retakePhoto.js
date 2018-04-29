function retakePhoto () {
	document.getElementById("camera").hidden = false;
	let photoContainer = document.getElementById("photoContainer");
	let context = photoContainer.getContext('2d');
	// clears the canvas
	context.clearRect(0, 0, photoContainer.width, photoContainer.height)
	document.getElementById("results").innerHTML = "";
}