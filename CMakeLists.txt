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
# @source: http://viewerjs.org/
# @source: http://github.com/kogmbh/Viewer.js
# 

project (Viewer.js)
cmake_minimum_required(VERSION 2.8.6)

SET(OVERRULED_VIEWERJS_VERSION "" CACHE STRING "Viewer.JS Version to overrule")
IF (OVERRULED_VIEWERJS_VERSION)
    set (VIEWERJS_VERSION ${OVERRULED_VIEWERJS_VERSION})
ELSE (OVERRULED_VIEWERJS_VERSION)
    # At this point, the version number that is used throughout is defined
    set(VIEWERJS_VERSION 0.2.1)
ENDIF (OVERRULED_VIEWERJS_VERSION)

if (CMAKE_SOURCE_DIR STREQUAL CMAKE_BINARY_DIR)
  message(FATAL_ERROR "Compiling in the source directory is not supported. Use for example 'mkdir build; cd build; cmake ..'.")
endif (CMAKE_SOURCE_DIR STREQUAL CMAKE_BINARY_DIR)

MESSAGE ( STATUS "Building ViewerJS version: ${VIEWERJS_VERSION}" )
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

SET ( VIEWER_BUILD_DIR ${CMAKE_BINARY_DIR}/ViewerJS-${VIEWERJS_VERSION} )
FILE ( MAKE_DIRECTORY ${VIEWER_BUILD_DIR})
SET ( VIEWERZIP ${CMAKE_BINARY_DIR}/ViewerJS-${VIEWERJS_VERSION}.zip)
SET ( WEBODF_SOURCE_DIR ${CMAKE_BINARY_DIR}/WebODF-source )

SET ( WORDPRESS_ZIP_DIR ${CMAKE_CURRENT_BINARY_DIR}/viewerjs-wordpress-${VIEWERJS_VERSION})
SET ( WORDPRESSZIP ${WORDPRESS_ZIP_DIR}.zip)

ExternalProject_Add(
    WebODF
    GIT_REPOSITORY https://github.com/kogmbh/WebODF.git
    GIT_TAG d4f50bd320b8bc8dcb14ab315114fa208b664c67
    SOURCE_DIR ${WEBODF_SOURCE_DIR}
    UPDATE_COMMAND ""
    BUILD_COMMAND make viewerbuilddir-target
    INSTALL_COMMAND ${CMAKE_COMMAND} -E copy_directory <BINARY_DIR>/viewer/ ${CMAKE_BINARY_DIR}/viewer
)

set (PDFJS_VERSION d45d7bc)
ExternalProject_Add(
    PDFjs
    GIT_REPOSITORY https://github.com/mozilla/pdf.js.git
    GIT_TAG ${PDFJS_VERSION}
    UPDATE_COMMAND ""
    CONFIGURE_COMMAND ""
    BUILD_COMMAND node <SOURCE_DIR>/make.js generic
    INSTALL_COMMAND ${CMAKE_COMMAND} -E copy <SOURCE_DIR>/build/generic/build/pdf.js ${CMAKE_BINARY_DIR}/viewer/pdf.js
    COMMAND ${CMAKE_COMMAND} -E copy <SOURCE_DIR>/build/generic/build/pdf.worker.js ${CMAKE_BINARY_DIR}/viewer/pdf.worker.js
    COMMAND ${CMAKE_COMMAND} -E copy <SOURCE_DIR>/build/generic/web/compatibility.js ${CMAKE_BINARY_DIR}/viewer/compatibility.js
    COMMAND ${CMAKE_COMMAND} -E copy <SOURCE_DIR>/web/pdf_find_bar.js ${CMAKE_BINARY_DIR}/viewer/pdf_find_bar.js
    COMMAND ${CMAKE_COMMAND} -E copy <SOURCE_DIR>/web/pdf_find_controller.js ${CMAKE_BINARY_DIR}/viewer/pdf_find_controller.js
    COMMAND ${CMAKE_COMMAND} -E copy <SOURCE_DIR>/web/ui_utils.js ${CMAKE_BINARY_DIR}/viewer/ui_utils.js
    COMMAND ${CMAKE_COMMAND} -E copy <SOURCE_DIR>/web/text_layer_builder.js ${CMAKE_BINARY_DIR}/viewer/text_layer_builder.js
)

add_custom_command(
    OUTPUT ${VIEWERZIP}
    COMMAND ${CMAKE_COMMAND} -E rename ${CMAKE_BINARY_DIR}/viewer ${VIEWER_BUILD_DIR}
    COMMAND ${CMAKE_COMMAND} -E copy_if_different ${CMAKE_CURRENT_SOURCE_DIR}/PluginLoader.js ${VIEWER_BUILD_DIR}/PluginLoader.js
    COMMAND ${CMAKE_COMMAND} -E copy_if_different ${CMAKE_CURRENT_SOURCE_DIR}/PDFViewerPlugin.js ${VIEWER_BUILD_DIR}/PDFViewerPlugin.js
    COMMAND ${CMAKE_COMMAND} -E copy_if_different ${CMAKE_CURRENT_SOURCE_DIR}/PDFViewerPlugin.css ${VIEWER_BUILD_DIR}/PDFViewerPlugin.css
    COMMAND ${CMAKE_COMMAND} -E copy_if_different ${CMAKE_CURRENT_SOURCE_DIR}/AGPL-3.0.txt ${VIEWER_BUILD_DIR}/AGPL-3.0.txt
    COMMAND node ARGS ${WEBODF_SOURCE_DIR}/webodf/lib/runtime.js ${WEBODF_SOURCE_DIR}/webodf/tools/zipdir.js
    ${VIEWER_BUILD_DIR}
    ${VIEWERZIP}
)


add_custom_target(Viewer ALL
    DEPENDS
    ${VIEWERZIP}
    WebODF
    PDFjs
)
configure_file(pdfjsversion.js.in ${CMAKE_BINARY_DIR}/viewer/pdfjsversion.js)
configure_file(viewerjs-plugin.php.in ${CMAKE_CURRENT_BINARY_DIR}/viewerjs-plugin.php)

add_custom_command(
    OUTPUT ${WORDPRESSZIP}
    COMMAND ${CMAKE_COMMAND} -E remove_directory ${WORDPRESS_ZIP_DIR}
    COMMAND ${CMAKE_COMMAND} -E copy_directory ${VIEWER_BUILD_DIR} ${WORDPRESS_ZIP_DIR}
    COMMAND ${CMAKE_COMMAND} -E copy ${CMAKE_CURRENT_SOURCE_DIR}/viewerjs-plugin-README.txt ${WORDPRESS_ZIP_DIR}
    COMMAND ${CMAKE_COMMAND} -E copy ${CMAKE_CURRENT_BINARY_DIR}/viewerjs-plugin.php ${WORDPRESS_ZIP_DIR}
    COMMAND node ARGS ${WEBODF_SOURCE_DIR}/webodf/lib/runtime.js ${WEBODF_SOURCE_DIR}/webodf/tools/zipdir.js
    ${WORDPRESS_ZIP_DIR}
    ${WORDPRESSZIP}
)

add_custom_target(wordpress-plugin ALL
    DEPENDS
    ${WORDPRESSZIP}
    Viewer
)

