/* Asset lookup.
   In the folder version images load from assets/.
   build.py fills window.ASSET_DATA with inlined copies for dist/. */
window.ASSET_DATA = window.ASSET_DATA || {};
function A(name) {
  return window.ASSET_DATA[name] || ("assets/" + name + ".svg");
}
