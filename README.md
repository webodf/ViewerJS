# ViewerJS

ViewerJS combines a number of excellent open source tools that are built on HTML and javascript. ViewerJS was funded by [NLnet foundation](https://nlnet.nl) and developed by KO GmbH.

The heavy lifting in ViewerJS is done by these awesome projects:

### WebODF

WebODF is a JavaScript library created by KO GmbH. It was started by Jos van den Oever at KO and is now developed by a growing team including external collaborators. It makes it easy to add Open Document Format (ODF) support to your website and to your mobile or desktop applications. It uses HTML and CSS to display ODF documents.

### PDF.js

PDF.js is a library created by Andreas Gal and others at Mozilla Labs. It is an HTML5 technology experiment that explores building a faithful and efficient Portable Document Format (PDF) renderer without native code assistance.

### Examples and more

You can find additional information, some usage guides, and live examples at [the project homepage](http://viewerjs.org).

### Building

ViewerJS uses [`cmake`](http://cmake.org/). Just follow these steps:

```bash
git clone http://github.com/kogmbh/ViewerJS.git
mkdir build
cd build
cmake ../ViewerJS
make
```

You will find the following two products in the build directory if everything goes well:
- `viewerjs-{x.y.z}.zip`
- `viewerjs-wordpress-{x.y.z}.zip`

... where `{x.y.z}` denotes the version.

### License

ViewerJS is a Free Software project. All code is available under the AGPL.

If you are interested in using ViewerJS in your commercial product
(and do not want to disclose your sources / obey AGPL),
contact [license@viewerjs.org](mailto:license@viewerjs.org) for a commercial license.
