# dg_curtain

The Curtain widget for DrupalGap 8. A must have widget for slide menus, context menus and revealing content.

With a `curtain` widget, you can easily place button that toggles the visibility of some content, reveals a context
menu or reveals a slide menu.

```
var html = dg.theme('curtain', {

  // Handle opening the curtain.
  _open: {
  
    // The button to open the curtain.
    button: {
      _text: '<i class="fa fa-plus"></i>',
      _type: 'link',
      _attributes: {
        title: dg.t('Add content')
      }
    },
    
    // Optional: Do something before opening the curtain.
    before: function() { /** do stuff **/ },
    
    // Optional: Do something after opening the curtain.
    after: function() { /** do stuff **/ }
  },
  
  // Optional: Used to open the curtain in a context menu.
  //_context: {
  //  side: 'right' // 'left' or 'right'
  //},

  // Optional: Used to open the curtain in a sidebar panel.
  _panel: {
    side: 'right' // 'left' or 'right', defaults to 'left'
  },
  
  // The content to fill into the curtain when it is opened.
  _fill: function() {
    var element = {};
    element.foo = {
      _theme: 'item_list',
      _items: [123, 456]
    };
    return element;
  },
  
  // Handle closing the curtain.
  _close: {
  
    // The button to close the curtain.
    button: {
      _text: '<i class="fa fa-chevron-down"></i>',
      _type: 'link',
      _attributes: {
        title: dg.t('Minimize')
      }
    },
    
    // Optional: Do something before closing the curtain.
    before: function() { /** do stuff **/ },
    
    // Optional: Do something after closing the curtain.
    after: function() { /** do stuff **/ }
  },
  
  // Optional: A wrapper around the button.
  _button_wrapper: {
    _format: 'div',
    _attributes: {
      class: ['foo', 'bar']
    }
  }
  
});
return html;
```

Like all widgets, a `curtain` can easily be ran through the DrupalGap render element system as well:

```
var element = {};
element.foo = {
  _theme: 'curtain',
  _open: { /* ... */ },
  _panel: { /* ... */ },
  _fill: { /* ... */ },
  _close: { /* ... */ },
  _button_wrapper: { /* ... */ }
};
return element;
```
