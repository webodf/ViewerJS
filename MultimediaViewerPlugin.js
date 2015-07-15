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
		if(window.mimetype.indexOf("audio/") === 0) {	
			videoElement=document.createElement("audio");
			videoElement.setAttribute('poster', 'images/musicbg.png');
		} else {
			videoElement=document.createElement("video");
		}
		videoElement.setAttribute('preload', 'auto');
		videoElement.setAttribute('id', 'multimedia_viewer');
		videoElement.setAttribute('controls', 'controls');
		videoElement.setAttribute('class', 'video-js vjs-default-skin');
		
		videoSource=document.createElement("source");
		videoSource.setAttribute('src', documentUrl);
		videoSource.setAttribute('type', window.mimetype);
		videoElement.appendChild(videoSource);

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
		// hide middle toolbar
		document.getElementById('toolbarMiddleContainer').style.visibility = "hidden";
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
