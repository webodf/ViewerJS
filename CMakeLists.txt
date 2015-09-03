# 
# Copyright (C) 2013-2015 KO GmbH <copyright@kogmbh.com>
#
# @licstart
# This file is part of ViewerJS.
#
# ViewerJS is free software: you can redistribute it and/or modify it
# under the terms of the GNU Affero General Public License (GNU AGPL)
# as published by the Free Software Foundation, either version 3 of
# the License, or (at your option) any later version.
#
# ViewerJS is distributed in the hope that it will be useful, but
# WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU Affero General Public License for more details.
#
# You should have received a copy of the GNU Affero General Public License
# along with ViewerJS.  If not, see <http://www.gnu.org/licenses/>.
# @licend
#
# @source: http://viewerjs.org/
# @source: http://github.com/kogmbh/ViewerJS
# 

project(ViewerJS)
cmake_minimum_required(VERSION 2.8.6)

if(CMAKE_SOURCE_DIR STREQUAL CMAKE_BINARY_DIR)
  message(FATAL_ERROR "Compiling in the source directory is not supported. Use for example 'mkdir build; cd build; cmake ..'.")
endif(CMAKE_SOURCE_DIR STREQUAL CMAKE_BINARY_DIR)


#########################################################
## Find installed dependencies
#########################################################

# Tools must be obtained to work with:
include(ExternalProject)

# java runtime is needed for Closure Compiler
find_package(Java COMPONENTS Runtime REQUIRED)


#########################################################
## Download stuff that is not commonly installed/packaged
#########################################################

# allow specification of a directory with pre-downloaded
# requirements by evaluating environment variable
# $VIEWERJS_DOWNLOAD_DIR
# defaults to ./downloads in the build directory.
if( IS_DIRECTORY $ENV{VIEWERJS_DOWNLOAD_DIR} )
    set( EXTERNALS_DOWNLOAD_DIR $ENV{VIEWERJS_DOWNLOAD_DIR} )
else()
    set( EXTERNALS_DOWNLOAD_DIR ${CMAKE_BINARY_DIR}/downloads )
endif()
message( STATUS "external downloads will be stored/expected in: ${EXTERNALS_DOWNLOAD_DIR}" )

# Closure Compiler
ExternalProject_Add(
    ClosureCompiler
    DOWNLOAD_DIR ${EXTERNALS_DOWNLOAD_DIR}
    URL "http://dl.google.com/closure-compiler/compiler-20130823.tar.gz"
    URL_MD5 105db24c4676e23f2495adfdea3159bc
    CONFIGURE_COMMAND ""
    BUILD_COMMAND ""
    INSTALL_COMMAND ""
)
set(CLOSURE_JAR ${CMAKE_BINARY_DIR}/ClosureCompiler-prefix/src/ClosureCompiler/compiler.jar)


#########################################################
## Configure any variables
#########################################################

set(OVERRULED_VIEWERJS_VERSION "" CACHE STRING "ViewerJS Version to overrule")
if(OVERRULED_VIEWERJS_VERSION)
    set (VIEWERJS_VERSION ${OVERRULED_VIEWERJS_VERSION})
else()
    # At this point, the version number that is used throughout is defined
    set(VIEWERJS_VERSION 0.5.9)
endif()
message(STATUS "Building ViewerJS version: ${VIEWERJS_VERSION}" )

set( VIEWER_BUILD_DIR ${CMAKE_BINARY_DIR}/viewerjs-${VIEWERJS_VERSION} )
set( VIEWERZIPNAME viewerjs-${VIEWERJS_VERSION}.zip)
set( VIEWERZIP ${CMAKE_BINARY_DIR}/${VIEWERZIPNAME})

set( PDFJS_SOURCE_DIR ${CMAKE_BINARY_DIR}/PDFJS-source )

set( WEBODF_SOURCE_DIR ${CMAKE_BINARY_DIR}/WebODF-source )
set( WEBODF_BUILD_DIR ${CMAKE_BINARY_DIR}/WebODF-build )
set( TOOLS_DIR ${WEBODF_SOURCE_DIR}/webodf/tools )
set( RUNTIMEJS ${WEBODF_SOURCE_DIR}/webodf/lib/runtime.js )

set( WORDPRESS_ZIP_DIR ${CMAKE_CURRENT_BINARY_DIR}/viewerjs-wordpress-${VIEWERJS_VERSION})
set( WORDPRESSZIPNAME viewerjs-wordpress-${VIEWERJS_VERSION}.zip)
set( WORDPRESSZIP ${CMAKE_BINARY_DIR}/${WORDPRESSZIPNAME})

# HTMLHEADERCOMPILED_FILE defines the file to use as header for the compiled ViewerJS HTML files.
# Per default that is HeaderCompiled.html
# For release builds it can be overwritten by passing -DHTMLHEADERCOMPILED_FILE=/path/to/file
# to cmake.
if(NOT HTMLHEADERCOMPILED_FILE)
  set(HTMLHEADERCOMPILED_FILE "${CMAKE_SOURCE_DIR}/HeaderCompiled.html")
elseif(NOT IS_ABSOLUTE ${HTMLHEADERCOMPILED_FILE})
  set(HTMLHEADERCOMPILED_FILE ${CMAKE_BINARY_DIR}/${HTMLHEADERCOMPILED_FILE})
endif()


#########################################################
## Build external projects
#########################################################

set(WEBODF_VERSION v0.5.9)
ExternalProject_Add(
    WebODF
    GIT_REPOSITORY https://github.com/kogmbh/WebODF.git
    GIT_TAG ${WEBODF_VERSION}
    SOURCE_DIR ${WEBODF_SOURCE_DIR}
    BINARY_DIR ${WEBODF_BUILD_DIR}
    UPDATE_COMMAND ""
    BUILD_COMMAND make webodf.js-target
    INSTALL_COMMAND ""
)

set(PDFJS_VERSION v1.1.114)
ExternalProject_Add(
    PDFjs
    GIT_REPOSITORY https://github.com/mozilla/pdf.js.git
    GIT_TAG ${PDFJS_VERSION}
    SOURCE_DIR ${PDFJS_SOURCE_DIR}
    UPDATE_COMMAND ""
    CONFIGURE_COMMAND ""
    BUILD_IN_SOURCE "1"
    BUILD_COMMAND npm install && node make generic
    INSTALL_COMMAND ""
)

# files for the viewer
set(VIEWER_IMAGES
    images/texture.png
    images/toolbarButton-download.png
    images/toolbarButton-fullscreen.png
    images/toolbarButton-menuArrows.png
    images/toolbarButton-pageDown.png
    images/toolbarButton-pageUp.png
    images/toolbarButton-zoomIn.png
    images/toolbarButton-zoomOut.png
    images/nlnet.png
    images/kogmbh.png
)

configure_file(viewerjsversion.js.in ${CMAKE_CURRENT_BINARY_DIR}/viewerjsversion.js)

configure_file(pdfjsversion.js.in ${CMAKE_BINARY_DIR}/pdfjsversion.js)
configure_file(viewerjs-plugin.php.in ${CMAKE_CURRENT_BINARY_DIR}/viewerjs-plugin.php)

add_custom_command(
    OUTPUT viewer.css.js
    COMMAND node ${RUNTIMEJS} ${TOOLS_DIR}/css2js.js
        viewer.css ${CMAKE_CURRENT_BINARY_DIR}/viewer.css.js
    WORKING_DIRECTORY ${CMAKE_CURRENT_SOURCE_DIR}
    DEPENDS
        WebODF
        ${TOOLS_DIR}/css2js.js
        viewer.css
)
add_custom_target(viewer.css.js-target DEPENDS viewer.css.js)

add_custom_command(
    OUTPUT viewerTouch.css.js
    COMMAND node ${RUNTIMEJS} ${TOOLS_DIR}/css2js.js
        viewerTouch.css ${CMAKE_CURRENT_BINARY_DIR}/viewerTouch.css.js
    WORKING_DIRECTORY ${CMAKE_CURRENT_SOURCE_DIR}
    DEPENDS
        WebODF
        ${TOOLS_DIR}/css2js.js
        viewer.css
)
add_custom_target(viewerTouch.css.js-target DEPENDS viewerTouch.css.js)

add_custom_command(
    OUTPUT ODFViewerPlugin.css.js
    COMMAND node ${RUNTIMEJS} ${TOOLS_DIR}/css2js.js
        ODFViewerPlugin.css ${CMAKE_CURRENT_BINARY_DIR}/ODFViewerPlugin.css.js
    WORKING_DIRECTORY ${CMAKE_CURRENT_SOURCE_DIR}
    DEPENDS
        WebODF
        ${TOOLS_DIR}/css2js.js
        ODFViewerPlugin.css
)
add_custom_target(ODFViewerPlugin.css.js-target DEPENDS ODFViewerPlugin.css.js)

add_custom_command(
    OUTPUT PDFViewerPlugin.css.js
    COMMAND node ${RUNTIMEJS} ${TOOLS_DIR}/css2js.js
        PDFViewerPlugin.css ${CMAKE_CURRENT_BINARY_DIR}/PDFViewerPlugin.css.js
    WORKING_DIRECTORY ${CMAKE_CURRENT_SOURCE_DIR}
    DEPENDS
        WebODF
        ${TOOLS_DIR}/css2js.js
        PDFViewerPlugin.css
)
add_custom_target(PDFViewerPlugin.css.js-target DEPENDS PDFViewerPlugin.css.js)

add_custom_command(
    OUTPUT viewer.min.js
    COMMENT "Creating viewer.min.js"
    COMMAND ${Java_JAVA_EXECUTABLE}
        -jar ${CLOSURE_JAR}
        --js ${CMAKE_CURRENT_BINARY_DIR}/ODFViewerPlugin.css.js
        --js ${CMAKE_CURRENT_SOURCE_DIR}/ODFViewerPlugin.js
        --js ${CMAKE_CURRENT_BINARY_DIR}/PDFViewerPlugin.css.js
        --js ${CMAKE_CURRENT_SOURCE_DIR}/PDFViewerPlugin.js
        --js ${CMAKE_CURRENT_BINARY_DIR}/viewerjsversion.js
        --js ${CMAKE_CURRENT_BINARY_DIR}/viewer.css.js
        --js ${CMAKE_CURRENT_BINARY_DIR}/viewerTouch.css.js
        --js ${CMAKE_CURRENT_SOURCE_DIR}/viewer.js
        --js ${CMAKE_CURRENT_SOURCE_DIR}/PluginLoader.js
        --compilation_level SIMPLE_OPTIMIZATIONS
        --js_output_file ${CMAKE_CURRENT_BINARY_DIR}/viewer.min.js
    DEPENDS
        ClosureCompiler
        ODFViewerPlugin.css.js-target
        ODFViewerPlugin.js
        PDFViewerPlugin.css.js-target
        PDFViewerPlugin.js
        ${CMAKE_CURRENT_BINARY_DIR}/viewerjsversion.js
        viewer.css.js-target
        viewerTouch.css.js-target
        viewer.js
        PluginLoader.js
    )
add_custom_target(viewer.min.js-target DEPENDS viewer.min.js)

add_custom_command(
    OUTPUT index.html
    COMMAND node ${RUNTIMEJS} ${CMAKE_SOURCE_DIR}/tools/replaceByFileContents.js
        ${CMAKE_CURRENT_SOURCE_DIR}/index-template.html
        ${CMAKE_CURRENT_BINARY_DIR}/index.html
        @VIEWERJSLICENSE_START@ @VIEWERJSLICENSE_END@ ${HTMLHEADERCOMPILED_FILE}
        @VIEWERJS_START@ @VIEWERJS_END@ ${CMAKE_CURRENT_BINARY_DIR}/viewer.min.js
    DEPENDS
        WebODF
        ${CMAKE_SOURCE_DIR}/tools/replaceByFileContents.js
        ${HTMLHEADERCOMPILED_FILE}
        viewer.min.js-target
        index-template.html
)
add_custom_target(index.html-target DEPENDS index.html)

add_custom_command(
    OUTPUT ${VIEWER_BUILD_DIR}/ViewerJS
    COMMENT "Creating ViewerJS directory"
    COMMAND ${CMAKE_COMMAND} -E remove_directory ${VIEWER_BUILD_DIR}
    COMMAND ${CMAKE_COMMAND} -E make_directory ${VIEWER_BUILD_DIR}
    COMMAND ${CMAKE_COMMAND} -E copy_if_different ${CMAKE_CURRENT_SOURCE_DIR}/AGPL-3.0.txt ${VIEWER_BUILD_DIR}/AGPL-3.0.txt
    COMMAND ${CMAKE_COMMAND} -E copy_directory ${CMAKE_CURRENT_SOURCE_DIR}/images ${VIEWER_BUILD_DIR}/ViewerJS/images
    COMMAND ${CMAKE_COMMAND} -E copy_if_different ${CMAKE_CURRENT_BINARY_DIR}/index.html ${VIEWER_BUILD_DIR}/ViewerJS/index.html
    COMMAND ${CMAKE_COMMAND} -E copy_if_different ${CMAKE_CURRENT_SOURCE_DIR}/example.local.css ${VIEWER_BUILD_DIR}/ViewerJS/example.local.css
    COMMAND ${CMAKE_COMMAND} -E copy_if_different ${WEBODF_BUILD_DIR}/webodf/webodf.js ${VIEWER_BUILD_DIR}/ViewerJS
    COMMAND ${CMAKE_COMMAND} -E copy_if_different ${CMAKE_BINARY_DIR}/pdfjsversion.js ${VIEWER_BUILD_DIR}/ViewerJS/pdfjsversion.js
    COMMAND ${CMAKE_COMMAND} -E copy_if_different ${PDFJS_SOURCE_DIR}/build/pdf.js ${VIEWER_BUILD_DIR}/ViewerJS/pdf.js
    COMMAND ${CMAKE_COMMAND} -E copy_if_different ${PDFJS_SOURCE_DIR}/build/pdf.worker.js ${VIEWER_BUILD_DIR}/ViewerJS/pdf.worker.js
    COMMAND ${CMAKE_COMMAND} -E copy_if_different ${PDFJS_SOURCE_DIR}/web/compatibility.js ${VIEWER_BUILD_DIR}/ViewerJS/compatibility.js
    COMMAND ${CMAKE_COMMAND} -E copy_if_different ${PDFJS_SOURCE_DIR}/web/ui_utils.js ${VIEWER_BUILD_DIR}/ViewerJS/ui_utils.js
    COMMAND ${CMAKE_COMMAND} -E copy_if_different ${PDFJS_SOURCE_DIR}/web/text_layer_builder.js ${VIEWER_BUILD_DIR}/ViewerJS/text_layer_builder.js
    DEPENDS
        WebODF
        PDFjs
        index.html-target
        ${VIEWER_IMAGES}
        index.html
        example.local.css
)

add_custom_command(
    OUTPUT ${VIEWERZIP}
    COMMENT "Creating ${VIEWERZIPNAME}"
    COMMAND node ${RUNTIMEJS} ${TOOLS_DIR}/zipdir.js
        ${VIEWER_BUILD_DIR}
        ${VIEWERZIP}
    DEPENDS
        ${VIEWER_BUILD_DIR}/ViewerJS
)

add_custom_target(Viewer ALL
    DEPENDS
        ${VIEWERZIP}
)

add_custom_command(
    OUTPUT ${WORDPRESSZIP}
    COMMENT "Creating ${WORDPRESSZIPNAME}"
    COMMAND ${CMAKE_COMMAND} -E remove_directory ${WORDPRESS_ZIP_DIR}
    COMMAND ${CMAKE_COMMAND} -E copy_directory ${VIEWER_BUILD_DIR}/ViewerJS ${WORDPRESS_ZIP_DIR}
    COMMAND ${CMAKE_COMMAND} -E copy ${CMAKE_CURRENT_SOURCE_DIR}/viewerjs-plugin-README.txt ${WORDPRESS_ZIP_DIR}
    COMMAND ${CMAKE_COMMAND} -E copy ${CMAKE_CURRENT_BINARY_DIR}/viewerjs-plugin.php ${WORDPRESS_ZIP_DIR}
    COMMAND node ${RUNTIMEJS} ${TOOLS_DIR}/zipdir.js
        ${WORDPRESS_ZIP_DIR}
        ${WORDPRESSZIP}
    DEPENDS
        ${VIEWER_BUILD_DIR}/ViewerJS
)

add_custom_target(wordpress-plugin ALL
    DEPENDS
        ${WORDPRESSZIP}
)

