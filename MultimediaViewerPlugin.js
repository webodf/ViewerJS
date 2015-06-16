/**
 * Multimedia Viewer Plugin using Video.js
 * 
 * @author Christoph Haas <christoph.h@sprinternet.at>
 */
function MultimediaViewerPlugin() {
	"use strict";

	var videoElement = undefined,
		videoSource = undefined,
		self = this;

	this.initialize = function (viewerElement, documentUrl) {
		// If the URL has a fragment (#...), try to load the file it represents
		videoElement=document.createElement("video");
		videoElement.setAttribute('preload', 'auto');
		videoElement.setAttribute('id', 'multimedia_viewer');
		videoElement.setAttribute('controls', 'controls');
		videoElement.setAttribute('class', 'video-js vjs-default-skin');
		
		videoSource=document.createElement("source");
		videoSource.setAttribute('src', documentUrl);
		videoSource.setAttribute('type', 'video/mp4');
		videoElement.appendChild(videoSource);

		videoElement.style.width = "100%";
		videoElement.style.height = "100%";
		viewerElement.appendChild(videoElement);
		viewerElement.style.overflow = "auto";
		
		// init viewerjs
		videojs(document.getElementById('multimedia_viewer'), {controls:'enabled'}, function() {
		  // This is functionally the same as the previous example.
		});

		self.onLoad();
	};

	this.isSlideshow = function () {
		return false;
	};

	this.onLoad = function () {
	};

	this.fitToWidth = function (width) {
	};

	this.fitToHeight = function (height) {
	};

	this.fitToPage = function (width, height) {
	};

	this.fitSmart = function (width) {
	};

	this.getZoomLevel = function () {
	};

	this.setZoomLevel = function (value) {
	};

	// return a list of tuples (pagename, pagenode)
	this.getPages = function () {
		return [videoElement];
	};

	this.showPage = function (n) {
		// do nothing - the image only has one page  
	};

	this.getPluginName = function () {
		return "MultimediaViewerPlugin";
	};

	this.getPluginVersion = function () {
		return "From Source";
	};

	this.getPluginURL = function () {
		return "https://sprinternet.at";
	};
}
