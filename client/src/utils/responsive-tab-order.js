/* SOURCE: https://github.com/redbubble/responsive-tab-order/blob/master/responsive-tab-order.js */

var ResponsiveTabOrder = (function (module) {

  var documentTabOrder = 'document';
  var visualTabOrder = 'visual';


  var startAutoUpdate = function (sameRowTolerance) {
    var resizeTimer;

    updateTabOrder(sameRowTolerance);

    window.addEventListener('resize', function() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () { updateTabOrder(sameRowTolerance); }, 250);
    });
  };

  var updateTabOrder = function (sameRowTolerance) {
    var tabbables = findTabbables();
    var i;

    if (typeof(sameRowTolerance) !== 'number') {
      sameRowTolerance = 0;
    }

    tabbables.sort(tabOrderComparator(sameRowTolerance));

    for (i = 0; i < tabbables.length; ++i) {
      tabbables[i].element.tabIndex = i + 1;
    }
    // console.log(tabbables);
  };


  var findTabbables = function () {
    var tabbableElements = document.querySelectorAll('[data-taborder]');
    var tabbables = [];
    var i;

    for (i = 0; i < tabbableElements.length; ++i) {
      tabbables.push({ element: tabbableElements[i], index: i });
    }

    return tabbables;
  };

  var tabOrderComparator = function (sameRowTolerance) {
    return function (a, b) {
      if (isDocumentTabOrder(a.element) && isDocumentTabOrder(b.element)) {
        return a.index - b.index;
      }

      return compareByVisualPosition(a, b, sameRowTolerance);
    };
  };

  var isDocumentTabOrder = function (element) {
    var tabOrder = element.attributes['data-taborder'].value;
    return tabOrder === '' || tabOrder === documentTabOrder;
  };

  var compareByVisualPosition = function (a, b, sameRowTolerance) {
    var boundA = a.element.getBoundingClientRect();
    var boundB = b.element.getBoundingClientRect();

    if (areVerticallyOverlapping(boundA, boundB, sameRowTolerance)) {
      return boundA.left - boundB.left;
    }

    return boundA.top - boundB.top;
  };

  var areVerticallyOverlapping = function (boundA, boundB, sameRowTolerance) {
    return verticallyContains(boundA.top, boundB, sameRowTolerance) ||
      verticallyContains(boundA.bottom, boundB, sameRowTolerance) ||
      verticallyContains(boundB.top, boundA, sameRowTolerance) ||
      verticallyContains(boundB.bottom, boundA, sameRowTolerance);
  };

  var verticallyContains = function (pos, bound, sameRowTolerance) {
    return pos >= bound.top - sameRowTolerance && pos <= bound.bottom + sameRowTolerance;
  };


  if (!module) {
    module = {
      startAutoUpdate: startAutoUpdate,
      updateTabOrder: updateTabOrder
    };

    if (typeof define === 'function' && define.amd) {
      define('responsive-tab-order', [], function () {
        return module;
      });
    }
  }

  return module;

})(ResponsiveTabOrder);

export default ResponsiveTabOrder;