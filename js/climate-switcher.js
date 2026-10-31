/**
 * Blue Flame Heating & Cooling - Interactive Climate Switcher
 */

document.addEventListener('DOMContentLoaded', () => {
  const heatingBtn = document.getElementById('btnModeHeating');
  const coolingBtn = document.getElementById('btnModeCooling');
  const heatingPanel = document.getElementById('panelHeating');
  const coolingPanel = document.getElementById('panelCooling');

  if (heatingBtn && coolingBtn && heatingPanel && coolingPanel) {
    heatingBtn.addEventListener('click', () => {
      heatingBtn.classList.add('active');
      coolingBtn.classList.remove('active');
      heatingPanel.classList.add('active');
      coolingPanel.classList.remove('active');
    });

    coolingBtn.addEventListener('click', () => {
      coolingBtn.classList.add('active');
      heatingBtn.classList.remove('active');
      coolingPanel.classList.add('active');
      heatingPanel.classList.remove('active');
    });
  }
});
