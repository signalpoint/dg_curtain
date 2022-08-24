DgCurtain = function(id, vars) {
  this._id = id;
  this._vars = vars;
};

DgCurtain.prototype.getContainer = function() {
  return dg.qs(this._vars._target ? this._vars._target : '#' + this._vars._attributes.id);
};
DgCurtain.prototype.getOpenButtonId = function() { return this._vars._open.button._attributes.id; };
DgCurtain.prototype.getOpenButton = function() { return dg.qs('#' + this.getOpenButtonId()); };
DgCurtain.prototype.getCloseButtonId = function() { return this._vars._close.button._attributes.id; };
DgCurtain.prototype.getCloseButton = function() { return dg.qs('#' + this.getCloseButtonId()); };
DgCurtain.prototype.isOpen = function() {
  var container = this.getContainer();
  return container ? dg.isVisible(container) : false;
};
DgCurtain.prototype.open = function() {
  var btn = this.getOpenButton();
  if (btn) { btn.click(); }
};
DgCurtain.prototype.close = function() {
  var btn = this.getCloseButton();
  if (btn) { btn.click(); }
};
