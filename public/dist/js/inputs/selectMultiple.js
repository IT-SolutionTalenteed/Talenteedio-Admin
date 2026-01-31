// Initialize TomSelect for multi-select inputs
window.initializeTomSelect = function(selector) {
  const elements = selector ? document.querySelectorAll(selector) : document.querySelectorAll('.select-multiples');
  
  if (!window.TomSelect) {
    console.error('TomSelect is not loaded');
    return;
  }
  
  elements.forEach(el => {
    // Skip if already initialized
    if (el.tomselect) {
      return;
    }
    
    const isMultiple = el.hasAttribute('multiple');
    
    // Collect logo data from options before TomSelect initialization
    const logoMap = {};
    el.querySelectorAll('option').forEach(option => {
      const logo = option.getAttribute('data-logo');
      if (logo && logo !== 'null' && logo !== 'undefined') {
        logoMap[option.value] = logo;
      }
    });
    
    console.log('Initializing TomSelect with logoMap:', logoMap);
    
    const instance = new TomSelect(el, {
      copyClassesToDropdown: false,
      dropdownParent: 'body',
      controlInput: '<input>',
      plugins: isMultiple ? {
        remove_button: {
          title: 'Remove this item',
        }
      } : {},
      maxItems: isMultiple ? null : 1,
      closeAfterSelect: !isMultiple,
      hidePlaceholder: true,
      render: {
        item: function (data, escape) {
          const logo = logoMap[data.value];
          
          if (logo) {
            return `
              <div class="d-flex align-items-center gap-2 py-1">
                <img 
                  src="${escape(logo)}" 
                  alt="${escape(data.text)}"
                  class="rounded"
                  style="width: 24px; height: 24px; object-fit: cover; flex-shrink: 0;"
                  onerror="this.style.display='none'"
                />
                <span class="flex-grow-1">${escape(data.text)}</span>
              </div>
            `;
          }
          
          if (data.customProperties) {
            return `
              <div class="d-flex align-items-center gap-2 py-1">
                <span class="dropdown-item-indicator">${data.customProperties}</span>
                <span class="flex-grow-1">${escape(data.text)}</span>
              </div>
            `;
          }
          
          return `<div class="py-1">${escape(data.text)}</div>`;
        },
        option: function (data, escape) {
          const logo = logoMap[data.value];
          
          if (logo) {
            return `
              <div class="d-flex align-items-center gap-2 py-2 px-2" style="cursor: pointer;">
                <img 
                  src="${escape(logo)}" 
                  alt="${escape(data.text)}"
                  class="rounded"
                  style="width: 32px; height: 32px; object-fit: cover; flex-shrink: 0; border: 1px solid #e9ecef;"
                  onerror="this.style.display='none'"
                />
                <span class="flex-grow-1" style="font-weight: 500;">${escape(data.text)}</span>
              </div>
            `;
          }
          
          if (data.customProperties) {
            return `
              <div class="d-flex align-items-center gap-2 py-2 px-2" style="cursor: pointer;">
                <span class="dropdown-item-indicator">${data.customProperties}</span>
                <span class="flex-grow-1">${escape(data.text)}</span>
              </div>
            `;
          }
          
          return `<div class="py-2 px-2" style="cursor: pointer;">${escape(data.text)}</div>`;
        }
      }
    });
    
    // Store instance reference
    el.tomselect = instance;
  });
};

// Auto-initialize on load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function() {
    window.initializeTomSelect();
  });
} else {
  window.initializeTomSelect();
}


