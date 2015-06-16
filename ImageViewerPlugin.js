function ImageViewerPlugin() {
	"use strict";

	var imgElement = undefined,
		self = this;

	this.initialize = function (viewerElement, documentUrl) {
		// If the URL has a fragment (#...), try to load the file it represents
		imgElement=document.createElement("img");
		imgElement.setAttribute('src', documentUrl);
		imgElement.setAttribute('alt', 'na');
		
		viewerElement.appendChild(imgElement);
		viewerElement.style.overflow = "auto";
		
		self.onLoad();
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
		return [imgElement];
	};

	this.showPage = function (n) {
		// do nothing - the image only has one page  
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
