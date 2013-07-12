# 
# Copyright (C) 2013 KO GmbH <copyright@kogmbh.com>
#
# @licstart
# This program is free software: you can redistribute it
# and/or modify it under the terms of the GNU Affero General Public License
# (GNU AGPL) as published by the Free Software Foundation, either version 3 of
# the License, or (at your option) any later version.  The code is distributed
# WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
# FITNESS FOR A PARTICULAR PURPOSE.  See the GNU AGPL for more details.
# 
# As additional permission under GNU AGPL version 3 section 7, you
# may distribute non-source (e.g., minimized or compacted) forms of
# that code without the copy of the GNU GPL normally required by
# section 4, provided you include this license notice and a URL
# through which recipients can access the Corresponding Source.
# 
# As a special exception to the AGPL, any HTML file which merely makes function
# calls to this code, and for that purpose includes it by reference shall be
# deemed a separate work for copyright law purposes. In addition, the copyright
# holders of this code give you permission to combine this code with free
# software libraries that are released under the GNU LGPL. You may copy and
# distribute such a system following the terms of the GNU AGPL for this code
# and the LGPL for the libraries. If you modify this code, you may extend this
# exception to your version of the code, but you are not obligated to do so.
# If you do not wish to do so, delete this exception statement from your
# version.
# 
# This license applies to this entire compilation.
# @licend
# @source: http://thz.github.com/Viewer.js/
# 

project (Viewer.js)
# version 2.8.2 is needed to have support for zip files in external projects
# issues with version 2.8.4 on Windows makes us test for a higher version
cmake_minimum_required(VERSION 2.8.6)

# At this point, the version number that is used throughout is defined
set(VIEWERJS_VERSION 0.1.0)

if (CMAKE_SOURCE_DIR STREQUAL CMAKE_BINARY_DIR)
  message(FATAL_ERROR "Compiling in the source directory is not supported. Use for example 'mkdir build; cd build; cmake ..'.")
endif (CMAKE_SOURCE_DIR STREQUAL CMAKE_BINARY_DIR)

# Tools must be obtained to work with:
include (ExternalProject)

# allow specification of a directory with pre-downloaded
# requirements by evaluating environment variable
# $VIEWERJS_DOWNLOAD_DIR
# defaults to ./downloads in the build directory.
if ( IS_DIRECTORY $ENV{VIEWERJS_DOWNLOAD_DIR} )
    SET ( EXTERNALS_DOWNLOAD_DIR $ENV{VIEWERJS_DOWNLOAD_DIR} )
else ( IS_DIRECTORY $ENV{VIEWERJS_DOWNLOAD_DIR} )
    SET ( EXTERNALS_DOWNLOAD_DIR ${CMAKE_BINARY_DIR}/downloads )
endif ( IS_DIRECTORY $ENV{VIEWERJS_DOWNLOAD_DIR} )
MESSAGE ( STATUS "external downloads will be stored/expected in: ${EXTERNALS_DOWNLOAD_DIR}" )

SET ( VIEWER_BUILD_DIR ${CMAKE_BINARY_DIR}/viewer )
FILE ( MAKE_DIRECTORY ${VIEWER_BUILD_DIR})

ExternalProject_Add(
    WebODF
    GIT_REPOSITORY git@gitorious.org:webodf/webodf.git
    UPDATE_COMMAND git pull origin master
    BUILD_COMMAND make viewerbuilddir-target
    INSTALL_COMMAND ${CMAKE_COMMAND} -E copy_directory ${CMAKE_BINARY_DIR}/WebODF-Prefix/src/WebODF-build/viewer/ ${VIEWER_BUILD_DIR}
)

ExternalProject_Add(
    PDFjs
    GIT_REPOSITORY git@github.com:mozilla/pdf.js.git
    UPDATE_COMMAND git pull
    CONFIGURE_COMMAND ""
    BUILD_COMMAND node ${CMAKE_BINARY_DIR}/PDFjs-Prefix/src/PDFjs/make.js generic
    INSTALL_COMMAND ${CMAKE_COMMAND} -E copy ${CMAKE_BINARY_DIR}/PDFjs-Prefix/src/PDFjs/build/generic/build/pdf.js ${VIEWER_BUILD_DIR}/pdf.js
)

add_custom_command(
    OUTPUT ${VIEWER_BUILD_DIR}/PDFViewerPlugin.js
    COMMAND ${CMAKE_COMMAND} -E copy_if_different ${CMAKE_CURRENT_SOURCE_DIR}/PluginLoader.js ${VIEWER_BUILD_DIR}/PluginLoader.js
    COMMAND ${CMAKE_COMMAND} -E copy_if_different ${CMAKE_CURRENT_SOURCE_DIR}/PDFViewerPlugin.js ${VIEWER_BUILD_DIR}/PDFViewerPlugin.js
    COMMAND ${CMAKE_COMMAND} -E copy_if_different ${CMAKE_CURRENT_SOURCE_DIR}/TextLayerBuilder.js ${VIEWER_BUILD_DIR}/TextLayerBuilder.js
    COMMAND ${CMAKE_COMMAND} -E copy_if_different ${CMAKE_CURRENT_SOURCE_DIR}/PDFViewerPlugin.css ${VIEWER_BUILD_DIR}/PDFViewerPlugin.css
    COMMAND ${CMAKE_COMMAND} -E echo ${VIEWER_BUILD_DIR}
)


add_custom_target(Viewer ALL
    DEPENDS
    ${VIEWER_BUILD_DIR}/PDFViewerPlugin.js
    WebODF
    PDFjs
)
