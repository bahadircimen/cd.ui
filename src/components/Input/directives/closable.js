let handleOutsideMousedown;

const Closable = {
    bind(el, binding, vnode) {
        handleOutsideMousedown = (e) => {
            e.stopPropagation()
            function hasSomeParentTheClass(element, classname) {
                if ((element.getAttribute("class") || "").split(' ').some(function (c) { return c.includes(classname) })) return true;
                return element.tagName == "HTML" ? false : element.parentNode && hasSomeParentTheClass(element.parentNode, classname);
            }
            function matchesSelector(element, selector) {
                var all = document.querySelectorAll(selector);
                for (var i = 0; i < all.length; i++) {
                  if (all[i] === element) {
                    return true;
                  }
                }
                return false;
              }
            const { handler, exclude, functionParam, excludeSelector } = binding.value
            let clickedOnExcludedEl = hasSomeParentTheClass(e.target, "introjs");
            if (excludeSelector && !clickedOnExcludedEl)
                excludeSelector.forEach(selector => {
                    if (!clickedOnExcludedEl) {
                        clickedOnExcludedEl = e.target.querySelectorAll(selector).length > 0;
                    }
                    if (!clickedOnExcludedEl) {
                        clickedOnExcludedEl = matchesSelector(e.target, selector);
                    }
                    if (!clickedOnExcludedEl) {
                        clickedOnExcludedEl = e.target.closest(selector)!=null;
                    }
                })
            if (!clickedOnExcludedEl) {
                exclude.forEach(refName => {
                    if (!clickedOnExcludedEl) {
                        const excludedEl = vnode.context.$refs[refName];
                        if (excludedEl)
                            clickedOnExcludedEl = (excludedEl).contains(e.target);
                    }
                });
            }
            if (!el.contains(e.target) && !clickedOnExcludedEl) {
                vnode.context[handler](functionParam)
            }
        }
        document.addEventListener('mousedown', handleOutsideMousedown)
        document.addEventListener('touchstart', handleOutsideMousedown)
    },
    unbind() {
        document.removeEventListener('mousedown', handleOutsideMousedown)
        document.removeEventListener('touchstart', handleOutsideMousedown)
    }
}
export default Closable;