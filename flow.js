(() => {
  const $ = s => document.querySelector(s);
  let signedIn = false;
  const allPanels = ['explore','browse-view','sell','detail-view','account','signup','login'];
  const show = target => {
    allPanels.forEach(id => { const el = $('#'+id); if (el) el.classList.add('hidden'); });
    if (target === 'welcome') { $('#explore').classList.remove('hidden'); document.body.classList.remove('member'); }
    else {
      const id = target === 'browse' ? 'browse-view' : target;
      $('#'+id).classList.remove('hidden');
      $('#explore').classList.add('hidden');
      if (signedIn) document.body.classList.add('member');
    }
    window.scrollTo({top:0, behavior:'smooth'});
  };
  const gate = action => {
    const gate = document.createElement('div');
    gate.className = 'contact-gate';
    gate.innerHTML = `<div class="contact-gate__card" role="dialog" aria-modal="true" aria-labelledby="gate-title"><p class="eyebrow">One quick step</p><h2 id="gate-title">Create an account first</h2><p>Accounts keep seller messages and listings connected to the right student.</p><div class="contact-gate__actions"><button class="secondary-button" data-close-gate>Not now</button><button class="primary-button" data-gate-route="signup">Create account</button></div></div>`;
    document.body.append(gate);
    gate.querySelector('[data-close-gate]').focus();
  };
  document.addEventListener('click', event => {
    const close = event.target.closest('[data-close-gate]');
    if (close) { close.closest('.contact-gate').remove(); return; }
    const gateRoute = event.target.closest('[data-gate-route]');
    if (gateRoute) { gateRoute.closest('.contact-gate').remove(); show(gateRoute.dataset.gateRoute); return; }
    const trigger = event.target.closest('[data-flow]');
    if (!trigger) return;
    event.preventDefault(); event.stopImmediatePropagation();
    const target = trigger.dataset.flow;
    if (['sell','account'].includes(target) && !signedIn) { gate(target); return; }
    show(target);
  }, true);
  document.addEventListener('click', event => {
    const contact = event.target.closest('#contact');
    if (!contact) return;
    event.preventDefault(); event.stopImmediatePropagation();
    if (!signedIn) gate('contact');
  }, true);
  const becomeMember = form => {
    form.addEventListener('submit', event => { event.preventDefault(); signedIn = true; document.body.classList.add('member'); show('browse'); const t=$('#toast'); t.textContent='You’re in. You can now contact sellers and list books.'; t.classList.add('show'); setTimeout(()=>t.classList.remove('show'),3000); });
  };
  becomeMember($('#signup-form')); becomeMember($('#login-form'));
  window.addEventListener('DOMContentLoaded', () => show('welcome'));
  show('welcome');
})();
