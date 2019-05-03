/**
 * classList.js: Cross-browser full element.classList implementation.
 * 1.1.20150312
 *
 * By Eli Grey, http://eligrey.com
 * License: Dedicated to the public domain.
 * See https://github.com/eligrey/classList.js/blob/master/LICENSE.md
 */

// Source http://purl.eligrey.com/github/classList.js/blob/master/classList.js

(function () {
  var testElement = document.createElement("_");
  
  testElement.classList.add("c1", "c2");
  
  // Polyfill for IE 10/11 and Firefox <26, where classList.add and
  // classList.remove exist but support only one argument at a time.
  if (!testElement.classList.contains("c2")) {
    var createMethod = function(method) {
      var original = DOMTokenList.prototype[method];
      
      DOMTokenList.prototype[method] = function(token) {
        var i, len = arguments.length;
        
        for (i = 0; i < len; i++) {
          token = arguments[i];
          original.call(this, token);
        }
      };
    };
    createMethod('add');
    createMethod('remove');
  }
  
  testElement.classList.toggle("c3", false);
  
  // Polyfill for IE 10 and Firefox <24, where classList.toggle does not
  // support the second argument.
  if (testElement.classList.contains("c3")) {
    var _toggle = DOMTokenList.prototype.toggle;
    
    DOMTokenList.prototype.toggle = function(token, force) {
      if (1 in arguments && !this.contains(token) === !force) {
        return force;
      } else {
        return _toggle.call(this, token);
      }
    };
    
  }
  
  // Polyfill for IE11 SVG classList support
  if (!("classList" in document.createElementNS("http://www.w3.org/2000/svg","g"))) {
    var descr = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'classList');
    Object.defineProperty(SVGElement.prototype, 'classList', descr);
  }
  
  testElement = null;
}());
