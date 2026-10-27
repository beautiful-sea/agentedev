const toggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
toggle.addEventListener('click', () => {
  const open = toggle.getAttribute('aria-expanded') !== 'true';
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  navigation.classList.toggle('open', open);
});
navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-label', 'Abrir menu');
  navigation.classList.remove('open');
}));
const dialog = document.querySelector('#proof-dialog');
let proofTrigger;
document.querySelectorAll('[data-proof]').forEach(button => button.addEventListener('click', () => {
  proofTrigger = button;
  document.querySelector('#proof-image').src = button.dataset.proof;
  dialog.showModal();
}));
document.querySelector('#close-proof').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if (event.target === dialog) {
  const box = dialog.getBoundingClientRect();
  if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
} });
dialog.addEventListener('close', () => proofTrigger?.focus());
document.querySelector('#year').textContent = new Date().getFullYear();
const config = window.AGENTEDEV_CONFIG || {};
const contact = document.querySelector('#contact-link');
const contactEmail = document.querySelector('#contact-email');
const message = 'Olá, Lindomar! Quero conversar sobre consultoria de IA ou desenvolvimento para meu negócio.';
if (config.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(config.email)) {
  contactEmail.href = `mailto:${config.email}`;
  contactEmail.textContent = config.email;
  contactEmail.hidden = false;
}
if (config.whatsapp && /^\d{10,15}$/.test(config.whatsapp)) {
  contact.href = `https://wa.me/${config.whatsapp}?text=${encodeURIComponent(message)}`;
  contact.target = '_blank'; contact.rel = 'noopener noreferrer';
  contact.hidden = false; document.querySelector('#contact-pending').hidden = true;
  document.querySelectorAll('[data-contact="consultoria"]').forEach(link => {
    link.href = `https://wa.me/${config.whatsapp}?text=${encodeURIComponent('Olá, Lindomar! Quero conversar sobre consultoria de IA para meu negócio.')}`;
  });
} else if (config.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(config.email)) {
  contact.href = `mailto:${config.email}?subject=${encodeURIComponent('Projeto com a AgenteDev.ia')}&body=${encodeURIComponent(message)}`;
  contact.hidden = false; document.querySelector('#contact-pending').hidden = true;
}
