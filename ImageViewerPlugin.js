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

  this.initialize = function (viewerElement, documentUrl) {
    var img = new Image();
    img.onload = function () {
      self.setImage(img, viewerElement);
    };
    // @todo Handle the error when unable to load the image.
    img.src = documentUrl;
  };

  function loadScript(path, callback) {
    var script = document.createElement('script');
    script.async = false;
    script.src = path;
    script.type = 'text/javascript';
    script.onload = callback || script.onload;
    document.getElementsByTagName('head')[0].appendChild(script);
  }

  function scrollIntoView(elem) {}

  function isScrolledIntoView(elem) {}

  function getDomPage(page) {}

  function getPageText(page) {}

  this.setImage = function (image, container) {
    var domPage, image_container;
    domPage = document.createElement('div');
    domPage.id = 'pageContainer1';
    domPage.className = 'page';
    image_container = document.createElement('img');
    image_container.src = image.src;
    container.appendChild(domPage);
    image_container.width = domPage.clientWidth;
    self.image_container = image_container;
    self.original_width = image.width;
    self.original_height = domPage.clientHeight;
    domPage.appendChild(image_container);
    self.domPage = domPage;
    self.setZoomLevel(image_container.width / image.width);
    self.onLoad(image_container.width / image.width);
  };


  this.isSlideshow = function () {
    return false;
  };

  this.onLoad = function (zoomlevel) {};

  this.getWidth = function () {
    return self.image_container.width;
  };

  this.getHeight = function () {
    return self.image_container.height;
  };

  this.fitToWidth = function (width) {};

  this.fitToHeight = function (height) {};

  this.fitToPage = function (width, height) {};

  this.fitSmart = function (width) {};

  this.getZoomLevel = function () {
    return self.zoom;
  };

  this.setZoomLevel = function (value) {
    self.zoom = value;
    self.image_container.width = self.original_width * value;
    if (self.image_container.width > self.domPage.clientWidth) {
      self.triggerScrollBars(true);
    } else {
      self.triggerScrollBars(false);
    }
  };

  // Sometimes happen the scrollbars get under the toolbars, we must
  // find a way to prevent it, but playing with css in this way is not
  // the best solution.
  this.triggerScrollBars = function (enable) {
    /*
    if (true === enable) {
      document.getElementById('toolbarContainer').style.marginBottom = '10px';
      document.getElementById('toolbarContainer').style.width = (self.domPage.clientWidth - 20) + 'px';
    } else {
      document.getElementById('toolbarContainer').style.marginBottom = '0';
      document.getElementById('toolbarContainer').style.width = (self.domPage.clientWidth) + 'px';
    }
    */
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
    return "https://github.com/kogmbh/ViewerJS/pull/28";
  };
}
