function getCamera () {
	const camera = document.getElementById('camera');
		const photoContainer = document.getElementById('photoContainer');
		const context = photoContainer.getContext('2d');
		const captureButton = document.getElementById('capture');
		const useButton = document.getElementById("use");
		const constraints = {
			video: true,
		};

		// Attach the video stream to the video element and autoplay.
		navigator.mediaDevices.getUserMedia(constraints)
			.then((stream) => {
				camera.srcObject = stream;
			});

		captureButton.addEventListener('click', (e) => {
			// Draw the video frame to the canvas.
			context.drawImage(camera, 0, 0, photoContainer.width, photoContainer.height);
		});	
}