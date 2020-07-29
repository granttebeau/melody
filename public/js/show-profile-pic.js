
var loadFile = function(event) {
	var image = document.getElementById('profile-pic-display');
	image.src = URL.createObjectURL(event.target.files[0]);
};