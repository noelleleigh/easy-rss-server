/**
 * Apply HTML escaping.
 * Source: https://stackoverflow.com/a/30970751/9165387
 * @param {String} s Input string to be escaped.
 */
const escape = (s) => {
  let lookup = {
    "&": "&amp;",
    '"': "&quot;",
    "<": "&lt;",
    ">": "&gt;",
  };
  return s.replace(/[&"<>]/g, (c) => lookup[c]);
};

module.exports = escape;
