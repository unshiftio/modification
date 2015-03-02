'use strict';

/**
 * Return a function which will process changes on the instance based on the
 * object that is provided and emit a dedicated "change" event.
 *
 * @param {String} suffix The suffix for the event we emit.
 * @returns {Function}
 * @api public
 */
module.exports = function modification(suffix) {
  suffix = arguments.length ? suffix : '';

  /**
   * Changes processor.
   *
   * @param {Object} changed Properties that have to be changed.
   * @returns {That} What ever the value of `this` is.
   * @api public
   */
  return function change(changed) {
    var currently, previously
      , that = this
      , key;

    if (!changed) return that;

    for (key in changed) {
      if (key in that && that[key] !== changed[key]) {
        currently = changed[key];
        previously = that[key];

        that[key] = currently;
        that.emit(key + suffix, currently, previously);
      }
    }

    return that;
  };
};
