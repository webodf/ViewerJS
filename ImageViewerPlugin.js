function ImageViewerPlugin() {
	"use strict";

	var imgElement = undefined,
		self = this,
		rotation = 0,
		currentPage = 1;

	function initCSS() {
		var pluginCSS;

		pluginCSS = /**@type{!HTMLStyleElement}*/(document.createElementNS(document.head.namespaceURI, 'style'));
		pluginCSS.setAttribute('media', 'screen, print, handheld, projection');
		pluginCSS.setAttribute('type', 'text/css');
		pluginCSS.appendChild(document.createTextNode(ImageViewerPlugin_css));
		document.head.appendChild(pluginCSS);
	}
	
	function initButtons() {
		var leftToolbar = document.getElementById('toolbarLeft');
		// hide unused elements
		document.getElementById("navButtons").style.display = 'none';
		document.getElementById("pageNumberLabel").style.display = 'none';
		document.getElementById("pageNumber").style.display = 'none';
		document.getElementById("numPages").style.display = 'none';
		leftToolbar.style.visibility = "visible";

		var buttonSeperator = document.createElement("div");
		buttonSeperator.setAttribute('class', 'splitToolbarButtonSeparator');

		var rotateLeft = document.createElement("button");
		rotateLeft.setAttribute('class', 'toolbarButton pageDown flipHorizontal');
		rotateLeft.setAttribute('title', 'Rotate left');

		var rotateRight = document.createElement("button");
		rotateRight.setAttribute('class', 'toolbarButton pageDown');
		rotateRight.setAttribute('title', 'Rotate right');

		leftToolbar.appendChild(rotateLeft);
		leftToolbar.appendChild(buttonSeperator);
		leftToolbar.appendChild(rotateRight);

		// Attach events to the above buttons
		rotateLeft.addEventListener('click', function () {
				imageRotateLeft();
		});
		rotateRight.addEventListener('click', function () {
				imageRotateRight();
		});
	}
	
	function imageRotateLeft() {
		if(rotation <= 0) {
			rotation = 360;
		}
		rotation -= 90;
		
		document.getElementById("image").className  = 'rotate' + rotation;
	}
	
	function imageRotateRight() {
		if(rotation >= 360) {
			rotation = 0;
		}
		rotation += 90;
		
		document.getElementById("image").className  = 'rotate' + rotation;
	}

	this.initialize = function (viewerElement, documentUrl) {
		// If the URL has a fragment (#...), try to load the file it represents
		imgElement=document.createElement("img");
		imgElement.setAttribute('src', documentUrl);
		imgElement.setAttribute('alt', 'na');
		imgElement.setAttribute('id', 'image');
		
		viewerElement.appendChild(imgElement);
		viewerElement.style.overflow = "auto";
		
		self.onLoad();
		
		initCSS();
		initButtons();
	};

	this.isSlideshow = function () {
		return false;
	};

	this.onLoad = function () {};

	this.fitToWidth = function (width) {
		imgElement.width = width;
	};

	this.fitToHeight = function (height) {
		imgElement.height = height;
	};

	this.fitToPage = function (width, height) {
		imgElement.width = width;
	};

	this.fitSmart = function (width) {
		imgElement.width = width;
	};

	this.getZoomLevel = function () {
		return  imgElement.width / imgElement.naturalWidth;
	};

	this.setZoomLevel = function (value) {
		imgElement.width = value * imgElement.naturalWidth;
	};

	// return a list of tuples (pagename, pagenode)
	this.getPages = function () {
		return [1, 2];
	};

	this.showPage = function (n) {
		if(n === currentPage) {
			imgElement.parentNode.scrollTop -= 100;
		} else {
			imgElement.parentNode.scrollTop += 100;
		}
	};

	this.getPluginName = function () {
		return "ImageViewerPlugin";
	};

	this.getPluginVersion = function () {
		return "From Source";
	};

	this.getPluginURL = function () {
		return "https://github.com/in4mates/ViewerJS";
	};
}
