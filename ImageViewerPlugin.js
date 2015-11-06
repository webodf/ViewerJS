/**
 *      Created in 31/01/2014 21:22:32
 *      @author Daniele P. <daniele.pignedoli@gmail.com>
 *
 *      @license http://www.gnu.org/licenses/gpl.html
 *      This program is free software; you can redistribute it and/or modify
 *      it under the terms of the GNU General Public License as published by
 *      the Free Software Foundation; either version 2 of the License, or
 *      (at your option) any later version
 *      
 *      This program is distributed in the hope that it will be useful,
 *      but WITHOUT ANY WARRANTY; without even the implied warranty of
 *      MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *      GNU General Public License for more details:
 *      http://www.gnu.org/licenses/gpl.html
 *      
 *      You should have received a copy of the GNU General Public License
 *      along with this program; if not, write to the Free Software
 *      Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston,
 *      MA 02110-1301, USA
 * */

function ImageViewerPlugin() {
  "use strict";

  var self = this;

  this.initialize = function(viewerElement, documentUrl) {
    self.imgElement = document.createElement("img");
    self.imgElement.setAttribute('src', documentUrl);

    viewerElement.appendChild(self.imgElement);
    viewerElement.style.overflow = "auto";

    self.onLoad();
  }

  function scrollIntoView(elem) {}

  function isScrolledIntoView(elem) {}

  function getDomPage(page) {}

  function getPageText(page) {}

  this.isSlideshow = function () {
    return false;
  };

  this.onLoad = function (zoomlevel) {};

  this.getWidth = function () {
    return self.imgElement.width;
  };

  this.getHeight = function () {
    return self.imgElement.height;
  };

  this.fitToWidth = function (width) {
	  self.imgElement.width = width;
  };

  this.fitToHeight = function (height) {
	  self.imgElement.height = height;
  };

  this.fitToPage = function (width, height) {
	  self.imgElement.width = width;
  };

  this.fitSmart = function (width) {
	  self.imgElement.width = width;
  };

  this.getZoomLevel = function () {
	  return self.imgElement.width / self.imgElement.naturalWidth;
  };

  this.setZoomLevel = function (value) {
    self.imgElement.width = value * self.imgElement.naturalWidth;
  };

  this.getPages = function () {
	  return [self.imgElement];
  }

  this.triggerScrollBars = function (enable) {
  };

  this.onScroll = function () {
    // @todo Some kind of magnify tool would be great.
    return true;
  };

  this.getPluginName = function () {
    return "ImageViewerPlugin.js"
  };

  this.getPluginVersion = function () {
    return "From Source";
  };

  this.getPageInView = function () {
    return 1;
  };

  this.getPages = function () {
    return [];
  };

  this.showPage = function (n) {};

  this.getPluginURL = function () {
    return "http://viewerjs.org/";
  };
}
