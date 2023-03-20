(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["jsontemplate"] = factory();
	else
		root["jsontemplate"] = factory();
})(self, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
/*!*********************!*\
  !*** ./template.js ***!
  \*********************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ jsontemplate)
/* harmony export */ });
function jsontemplate(document, template, data) {
  const resultFragment = document.createDocumentFragment();

  processOneOrMoreRules(resultFragment, template, data);

  return resultFragment;
};

function processOneOrMoreRules(parentNode, ruleOrRules, data) {
  if (Array.isArray(ruleOrRules)) {
    ruleOrRules.map(function (rule) { processRule(parentNode, rule, data); });
  } else {
    processRule(ruleOrRules);
  }
}

function processRule(parentNode, rule, data) {
  const contents = data[rule.key];

  applyRule(parentNode, rule, contents);
}

function applyRule(parentNode, rule, contents) {
  if (Array.isArray(contents)) {
    contents.map(function (item) { applyRule(parentNode, rule, item); });
  } else {
    let node = undefined;
    if (rule.text === true) {
      node = parentNode.ownerDocument.createTextNode(contents);
    } else { // This should be an element rule, but we should specify and test
             // this....
      node = parentNode.ownerDocument.createElement(rule.element);
      if (rule.attributes !== undefined) {
        if (typeof rule.attributes === 'string') {
          node.setAttribute(rule.attributes, contents[rule.attributes]);
        } else { // rule.attributes should be a "simple" object
          Object.keys(rule.attributes).map(function (name) {
            node.setAttribute(rule.attributes[name], contents[name]);
          });
        }
      }

      if (rule.children !== undefined) {
        processOneOrMoreRules(node, rule.children, contents);
      }
    }
    
    parentNode.appendChild(node);
  }
}

/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianNvbnRlbXBsYXRlLmJ1bmRsZS5qcyIsIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0QsTzs7VUNWQTtVQUNBOzs7OztXQ0RBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7Ozs7Ozs7Ozs7QUNOZTtBQUNmOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHNDQUFzQyxzQ0FBc0M7QUFDNUUsSUFBSTtBQUNKO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLG1DQUFtQyxvQ0FBb0M7QUFDdkUsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBLE1BQU0sT0FBTztBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVLE9BQU87QUFDakI7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9Ac29jaW9jcmFjeWZvcmFsbC9zb2ZhdGltZS5qcy93ZWJwYWNrL3VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24iLCJ3ZWJwYWNrOi8vQHNvY2lvY3JhY3lmb3JhbGwvc29mYXRpbWUuanMvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vQHNvY2lvY3JhY3lmb3JhbGwvc29mYXRpbWUuanMvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL0Bzb2Npb2NyYWN5Zm9yYWxsL3NvZmF0aW1lLmpzL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vQHNvY2lvY3JhY3lmb3JhbGwvc29mYXRpbWUuanMvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9Ac29jaW9jcmFjeWZvcmFsbC9zb2ZhdGltZS5qcy8uL3RlbXBsYXRlLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiB3ZWJwYWNrVW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbihyb290LCBmYWN0b3J5KSB7XG5cdGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0Jylcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcblx0ZWxzZSBpZih0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpXG5cdFx0ZGVmaW5lKFtdLCBmYWN0b3J5KTtcblx0ZWxzZSBpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpXG5cdFx0ZXhwb3J0c1tcImpzb250ZW1wbGF0ZVwiXSA9IGZhY3RvcnkoKTtcblx0ZWxzZVxuXHRcdHJvb3RbXCJqc29udGVtcGxhdGVcIl0gPSBmYWN0b3J5KCk7XG59KShzZWxmLCAoKSA9PiB7XG5yZXR1cm4gIiwiLy8gVGhlIHJlcXVpcmUgc2NvcGVcbnZhciBfX3dlYnBhY2tfcmVxdWlyZV9fID0ge307XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBqc29udGVtcGxhdGUoZG9jdW1lbnQsIHRlbXBsYXRlLCBkYXRhKSB7XG4gIGNvbnN0IHJlc3VsdEZyYWdtZW50ID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1xuXG4gIHByb2Nlc3NPbmVPck1vcmVSdWxlcyhyZXN1bHRGcmFnbWVudCwgdGVtcGxhdGUsIGRhdGEpO1xuXG4gIHJldHVybiByZXN1bHRGcmFnbWVudDtcbn07XG5cbmZ1bmN0aW9uIHByb2Nlc3NPbmVPck1vcmVSdWxlcyhwYXJlbnROb2RlLCBydWxlT3JSdWxlcywgZGF0YSkge1xuICBpZiAoQXJyYXkuaXNBcnJheShydWxlT3JSdWxlcykpIHtcbiAgICBydWxlT3JSdWxlcy5tYXAoZnVuY3Rpb24gKHJ1bGUpIHsgcHJvY2Vzc1J1bGUocGFyZW50Tm9kZSwgcnVsZSwgZGF0YSk7IH0pO1xuICB9IGVsc2Uge1xuICAgIHByb2Nlc3NSdWxlKHJ1bGVPclJ1bGVzKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBwcm9jZXNzUnVsZShwYXJlbnROb2RlLCBydWxlLCBkYXRhKSB7XG4gIGNvbnN0IGNvbnRlbnRzID0gZGF0YVtydWxlLmtleV07XG5cbiAgYXBwbHlSdWxlKHBhcmVudE5vZGUsIHJ1bGUsIGNvbnRlbnRzKTtcbn1cblxuZnVuY3Rpb24gYXBwbHlSdWxlKHBhcmVudE5vZGUsIHJ1bGUsIGNvbnRlbnRzKSB7XG4gIGlmIChBcnJheS5pc0FycmF5KGNvbnRlbnRzKSkge1xuICAgIGNvbnRlbnRzLm1hcChmdW5jdGlvbiAoaXRlbSkgeyBhcHBseVJ1bGUocGFyZW50Tm9kZSwgcnVsZSwgaXRlbSk7IH0pO1xuICB9IGVsc2Uge1xuICAgIGxldCBub2RlID0gdW5kZWZpbmVkO1xuICAgIGlmIChydWxlLnRleHQgPT09IHRydWUpIHtcbiAgICAgIG5vZGUgPSBwYXJlbnROb2RlLm93bmVyRG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoY29udGVudHMpO1xuICAgIH0gZWxzZSB7IC8vIFRoaXMgc2hvdWxkIGJlIGFuIGVsZW1lbnQgcnVsZSwgYnV0IHdlIHNob3VsZCBzcGVjaWZ5IGFuZCB0ZXN0XG4gICAgICAgICAgICAgLy8gdGhpcy4uLi5cbiAgICAgIG5vZGUgPSBwYXJlbnROb2RlLm93bmVyRG9jdW1lbnQuY3JlYXRlRWxlbWVudChydWxlLmVsZW1lbnQpO1xuICAgICAgaWYgKHJ1bGUuYXR0cmlidXRlcyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGlmICh0eXBlb2YgcnVsZS5hdHRyaWJ1dGVzID09PSAnc3RyaW5nJykge1xuICAgICAgICAgIG5vZGUuc2V0QXR0cmlidXRlKHJ1bGUuYXR0cmlidXRlcywgY29udGVudHNbcnVsZS5hdHRyaWJ1dGVzXSk7XG4gICAgICAgIH0gZWxzZSB7IC8vIHJ1bGUuYXR0cmlidXRlcyBzaG91bGQgYmUgYSBcInNpbXBsZVwiIG9iamVjdFxuICAgICAgICAgIE9iamVjdC5rZXlzKHJ1bGUuYXR0cmlidXRlcykubWFwKGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgICAgICAgICBub2RlLnNldEF0dHJpYnV0ZShydWxlLmF0dHJpYnV0ZXNbbmFtZV0sIGNvbnRlbnRzW25hbWVdKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAocnVsZS5jaGlsZHJlbiAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHByb2Nlc3NPbmVPck1vcmVSdWxlcyhub2RlLCBydWxlLmNoaWxkcmVuLCBjb250ZW50cyk7XG4gICAgICB9XG4gICAgfVxuICAgIFxuICAgIHBhcmVudE5vZGUuYXBwZW5kQ2hpbGQobm9kZSk7XG4gIH1cbn1cbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==