dg._curtains = {};

dg_curtain._curtain = null;

dg_curtain.getCurtain = function() {
  return dg_curtain._curtain;
};

dg_curtain.setCurtain = function(curtain) {
  dg_curtain._curtain = curtain;
};

dg_curtain.clearCurtain = function() {
  dg_curtain._curtain = null;
};

dg_curtain.getButton = function() {
  var curtain = dg_curtain.getCurtain();
  return curtain ? document.getElementById(curtain._open.button._attributes.id) : null;
};

dg_curtain.getContainer = function() {
  var curtain = dg_curtain.getCurtain();
  return curtain ? document.getElementById(curtain._attributes.id) : null;
};

dg_curtain.isOpen = function() {
  var container = dg_curtain.getContainer();
  console.log(container);
  return container && container.style.display != 'none';
};

dg_curtain.close = function() {
  var button = dg_curtain.getButton();
  if (button) {
    //console.log('removing click handler');
    //window.removeEventListener('click', dg_curtain.onclick);
    button.click();
  }
};

/**
 *
 * @param variables
 *  _open {String|Function|Promise}
 * @returns {string}
 */

dg.theme_curtain = function(variables) {

  // @TODO make this splittable in case the button and the container need to be separate

  // @TODO the click handler may not need to be that complex, maybe folks can just
  // place a bucket in the fill (probably need to run a post render).

  // @TODO the global curtain container needs to be purged during page transitions

  // Grab the container id, or generate a random one.
  if (!variables._attributes.id) { variables._attributes.id = dg.salt(); }
  var id = variables._attributes.id;

  variables._attributes.class.push('curtain');

  // Create the open button.
  // @TODO duplicate code.
  var openOptions = variables._open ? variables._open : {};
  var openBtn = openOptions.button ? openOptions.button : {};
  if (!openBtn._attributes) { openBtn._attributes = {}; }
  if (!openBtn._attributes.id) { openBtn._attributes.id = dg.salt(); }
  if (!openBtn._attributes.onclick) { openBtn._attributes.onclick = "dg._curtainClick(this, 'open')"; }
  if (!openBtn._attributes.for) { openBtn._attributes.for = id; }

  // Set the curtain aside.
  dg._curtains[id] = variables;
  var curtain = dg._curtains[id];

  // Replacing?
  // No need for this, just exclude the open and close wrapper and the curtain already does this shit, I think you
  // are thinking of a bucket widget to utilize this replace feature ya dumb dumb.
  //if (variables._replace) {
  //  var format = variables._format ? variables._format : 'div';
  //  var randomId = dg.salt();
  //  var targetId = format + '-' + randomId;
  //  return dg.render({
  //    _markup: '<' + format + ' id="' + targetId + '"></' + format + '>',
  //    _postRender: [function() {
  //      document.getElementById(targetId).outerHTML = dg.render(
  //          dg._curtainButtonRender(openBtn, curtain, 'open'),
  //          true
  //      );
  //    }]
  //  }, true);
  //}

  // Render the button and return it.
  return dg._curtainBtnWrapOpen(curtain) +
      dg._curtainButtonRender(openBtn, curtain, 'open') +
      dg._curtainBtnWrapClose(curtain);

};

dg._curtainBtnWrapOpen = function(curtain) {

  var btnWrapper = curtain._button_wrapper ? curtain._button_wrapper : null;
  if (!btnWrapper) { return ''; }
  dg.elementAttributesInit(btnWrapper);
  if (!btnWrapper._format) { btnWrapper._format = 'div'; }
  btnWrapper._attributes.id = 'curtain-btn-wrapper-' + curtain._attributes.id;
  curtain._button_wrapper = btnWrapper;
  return '<' + btnWrapper._format + ' ' + dg.attributes(btnWrapper._attributes) + '>'
};

dg._curtainBtnWrapClose = function(curtain) {
  return curtain._button_wrapper ? '</' + curtain._button_wrapper._format + '>' : '';
};

dg._curtainButtonRender = function(btn, curtain, direction) {
  var btnType = btn._type ? btn._type : 'link'; // or 'button'
  var btnText = btn._text ? btn._text : direction == 'open' ? '+' : '-';
  return btnType == 'link' ? dg.l(btnText, null, btn) : dg.b(btnText, btn);
};

dg._curtainClick = function(button, direction) {
  //console.log(direction, button);

  // Grab the curtain id and load the curtain.
  var id = button.getAttribute('for');
  var curtain = dg._curtains[id];
  var isContext = !!curtain._context;
  var isPanel = !isContext && curtain._panel; // Context config overrides panel config, developer can't have both.

  var op = direction == 'open' ? 'close' : 'open';
  var opKey = '_' + direction;
  var btnKey = '_' + op;
  var btnId = button.getAttribute('id');

  // Run before handler, if any.
  if (curtain[opKey].before) { curtain[opKey].before(button, curtain); }

  var newButton = null;
  if (!isPanel) {

    // Create the opposite button.
    // @TODO duplicate code.
    var btnOptions = curtain[btnKey] ? curtain[btnKey] : {};
    var btn = btnOptions.button ? btnOptions.button : {};
    if (!btn._attributes) { btn._attributes = {}; }
    btn._attributes.id = btnId;
    if (!btn._attributes.onclick) { btn._attributes.onclick = "dg._curtainClick(this, '" + op + "')"; }
    if (!btn._attributes.for) { btn._attributes.for = id; }

    // Swap the buttons.
    var div = document.createElement('div');
    div.innerHTML = dg._curtainButtonRender(btn, curtain, op);
    newButton = div.firstChild;
    button.parentNode.replaceChild(newButton, button);

  }

  // Place the container in the DOM the first time the curtain is opened, subsequent times, just toggle its visibility.
  if (direction == 'open') {
    var container = document.getElementById(id);
    if (!container) {
      //console.log(curtain);

      // Add class names for contexts or for panels.
      var classNames = curtain._attributes.class;
      if (isContext) {
        classNames.push('context-menu');
        if (curtain._context.side) { classNames.push('context-menu-' + curtain._context.side); }
      }
      else if (isPanel) {
        classNames.push(
            'side-panel',
            curtain._panel.side ? 'side-panel-' + curtain._panel.side : 'side-panel-left'
        );
      }

      // Create a dummy div wrapper, and then render the empty curtain container inside of it.
      var format = curtain._format ? variables._format : 'div';
      div = document.createElement('div');
      div.innerHTML = '<' + format + ' ' + dg.attributes(curtain._attributes) + '></' + format + '>';

      // Pull out the newly created element for the empty container, and place it after the button.
      if (newButton) {
        newButton.parentNode.insertBefore(div.firstChild, newButton.nextSibling);
      }
      else {
        button.parentNode.insertBefore(div.firstChild, button.nextSibling);
      }


      // Render the content to be filled in the container.
      var fill = dg.render(curtain._fill());

      if (isPanel) {

        // Create the close button.
        // @TODO duplicate code.
        var closeOptions = curtain._close ? curtain._close : {};
        var closeBtn = closeOptions.button ? closeOptions.button : {};
        if (!closeBtn._attributes) { closeBtn._attributes = {}; }
        closeBtn._attributes.id = btnId;
        if (!closeBtn._attributes.onclick) { closeBtn._attributes.onclick = "dg._curtainClick(this, 'close')"; }
        if (!closeBtn._attributes.for) { closeBtn._attributes.for = id; }

        // Put the close button at the top of the panel.
        fill = dg._curtainButtonRender(closeBtn, curtain, 'close') + fill;

      }

      // Now that the container exists in the DOM, grab it and fill the content.
      container = document.getElementById(id);
      container.innerHTML = direction == 'open' ? fill : '';

      // Set up a post render with timeout...
      dg._postRender.push(function() {
        setTimeout(function() {

          // Listen for clicks outside modal to close it.
          if (isContext) {
            //console.log('add event listener');
            //window.addEventListener('click', dg_curtain.onclick, false);
          }
          // To slide open the panel.
          else if (isPanel) {
            document.getElementById(id).style.width = "250px";
          }

        }, 50);
      });

      // If it's a context menu, offset its left/right position in a negative direction using the width of the content
      // in the menu, thus bringing it back into view.
      //if (isContext) {
      //  console.log(container.offsetWidth);
      //  container.style.left = '-' + container.offsetWidth + 'px';
      //}

      // Run any post renders.
      dg.runPostRenders();

    }
    else {

      // Make the container visible again.
      var curtainElement = document.getElementById(id);
      if (isPanel) {
        curtainElement.style.width = "250px";
      }
      else {
        curtainElement.style.display = 'block';
        //if (isContext) {
        //  setTimeout(function() {
        //    console.log('add event listener');
        //    window.addEventListener('click', dg_curtain.onclick, false);
        //  }, 1);
        //}
      }

    }

    dg_curtain.setCurtain(curtain);

  }
  else { // Closing...

    // Hide the container.
    var curtainElement = document.getElementById(id);
    if (isPanel) { curtainElement.style.width = '0'; }
    else { curtainElement.style.display = 'none'; }

    dg_curtain.clearCurtain();

  }

  // Run after handler, if any.
  if (curtain[opKey].after) {
    setTimeout(function() {
      curtain[opKey].after(isPanel ? button : newButton, curtain);
    }, 1);
  }

};

//dg_curtain.onclick = function(event) {
//  var curtain = dg_curtain.getCurtain();
//  console.log('click!');
//  console.log('target', event.target);
//  console.log('curtain', curtain);
//  console.log('button', dg_curtain.getButton());
//  var container = dg_curtain.getContainer();
//  var containerId = container.getAttribute('id');
//  var button = dg_curtain.getButton();
//  var buttonId = container.getAttribute('id');
//  // && event.target != dg_curtain.getButton()
//  if (event.target.getAttribute('id') == container && dg_curtain.isOpen()) {
//    dg_curtain.close();
//  }
//};
