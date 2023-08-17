console.log( Array.from(document.querySelectorAll(`[data-category^="buildingLifeform"] .technologyRow .technologyInfo .technologyName`)).map(e => e.textContent.trim()).join('\n'));

console.log( Array.from(document.querySelectorAll(`[data-category^="researchLifeform"] .technologyRow .technologyInfo .technologyName`)).map(e => e.textContent.trim()).join('\n'));