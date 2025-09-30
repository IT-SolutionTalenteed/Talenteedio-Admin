var el;
if (window.TomSelect) {
  for (const el of document.querySelectorAll('.select-multiples')) {
    new TomSelect(el, {
      copyClassesToDropdown: false,
      dropdownParent: 'body',
      controlInput: '<input>',
      render: {
        item: function (data, escape) {
          if (data.customProperties) {
            return (
              '<div><span class="dropdown-item-indicator">' +
              data.customProperties +
              '</span>' +
              escape(data.text) +
              '</div>'
            );
          }
          return '<div>' + escape(data.text) + '</div>';
        },
        option: function (data, escape) {
          if (data.customProperties) {
            return (
              '<div><span class="dropdown-item-indicator">' +
              data.customProperties +
              '</span>' +
              escape(data.text) +
              '</div>'
            );
          }
          return '<div>' + escape(data.text) + '</div>';
        }
      }
    });
  }
}
