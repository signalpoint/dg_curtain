dg_curtain.get = function(id) {
  return !!dg._curtains[id] ? dg._curtains[id] : null;
};

dg_curtain.load = function(id) {
  return new DgCurtain(id, dg_curtain.get(id));
};
