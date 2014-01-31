/**
 *      Created in 31/01/2014 10:52:32
 *      @author Daniele P. <daniele.pignedoli@gmail.com>
 *
 *      @license <a href="http://www.gnu.org/licenses/gpl.html" target="_new">
 *      http://www.gnu.org/licenses/gpl.html</a><br /><br />
 *      This program is free software; you can redistribute it and/or modify<br />
 *      it under the terms of the GNU General Public License as published by<br />
 *      the Free Software Foundation; either version 2 of the License, or<br />
 *      (at your option) any later version<br />
 *      <br />
 *      This program is distributed in the hope that it will be useful,<br />
 *      but WITHOUT ANY WARRANTY; without even the implied warranty of<br />
 *      MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the<br />
 *      GNU General Public License for more details:<br />
 *      <b>http://www.gnu.org/licenses/gpl.html</b><br />
 *      <br />
 *      You should have received a copy of the GNU General Public License<br />
 *      along with this program; if not, write to the Free Software<br />
 *      Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston,<br />
 *      MA 02110-1301, USA<br />
 * */

function ImageViewerPlugin() {
  "use strict";

  var self = this;

  this.initialize = function (viewerElement, documentUrl) {
    var img = new Image();
    img.onload = function () {
      self.setImage(img, viewerElement);
    };
    img.src = documentUrl;
  };

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
    self.onLoad();
  }


  this.isSlideshow = function () {
    return false;
  };

  this.onLoad = function (zoomlevel) {
  };

  this.getWidth = function () {
    return self.image_container.width;
  };

  this.getHeight = function () {
    return self.image_container.height;
  };

  this.fitToWidth = function (width) {};

  this.fitToHeight = function (height) {};


  this.fitSmart = function (width) {};

  this.getZoomLevel = function () {
    return self.zoom;
  };

  this.setZoomLevel = function (value) {
    self.zoom = value;
    var width = self.original_width * value;
    self.image_container.width = width;
    if (width > self.domPage.clientWidth) {
      self.triggerScrollBars(true);
    } else {
      self.triggerScrollBars(false);
    }
  };

  this.triggerScrollBars = function (enable) {
    if (true === enable) {
      //document.getElementById('toolbarContainer').style.marginBottom = '10px';
      //document.getElementById('toolbarContainer').style.width = (self.domPage.clientWidth - 20) + 'px';
    } else {
      //document.getElementById('toolbarContainer').style.marginBottom = '0';
      //document.getElementById('toolbarContainer').style.width = (self.domPage.clientWidth) + 'px';
    }
  };


  this.getPages = function () {
    return [];
  };

  this.showPage = function (n) {
  };
}
