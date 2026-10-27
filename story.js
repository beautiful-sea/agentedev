(() => {
  'use strict';
  const story = document.querySelector('.scroll-story');
  const pin = document.querySelector('.story-pin');
  if (!story || !pin) return;
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let motionOptIn = false;
  const reduced = () => motion.matches && !motionOptIn;
  const motionButton = document.createElement('button');
  motionButton.type = 'button';
  motionButton.className = 'motion-choice';
  motionButton.textContent = 'Ativar apresentação animada';
  motionButton.hidden = !motion.matches;
  pin.append(motionButton);
  motionButton.addEventListener('click', () => {
    motionOptIn = true;
    document.documentElement.classList.add('motion-opt-in');
    motionButton.hidden = true;
    measure();
  });
  const scenes = [...document.querySelectorAll('[data-story-scene]')];
  const steps = [...document.querySelectorAll('[data-story-step]')];
  const label = document.querySelector('#scroll-label');
  const header = document.querySelector('.header');
  let top = 0, distance = 1, frame = 0, active = -1;
  const clamp = v => Math.min(1, Math.max(0, v));
  const range = (p, a, b) => clamp((p - a) / (b - a));
  const smooth = v => v * v * (3 - 2 * v);
  const reveal = (p, a, b, c, d) => smooth(range(p, a, b)) * (1 - smooth(range(p, c, d)));

  function render() {
    frame = 0;
    const p = reduced() ? 0 : clamp((window.scrollY - top) / distance);
    const p1 = smooth(range(p, .12, .32));
    const p2 = smooth(range(p, .39, .56));
    pin.style.setProperty('--progress', p.toFixed(4));
    pin.style.setProperty('--p1', p1.toFixed(4));
    pin.style.setProperty('--p2', p2.toFixed(4));
    pin.style.setProperty('--p3', smooth(range(p, .68, .88)).toFixed(4));
    pin.style.setProperty('--path-progress', smooth(range(p, .27, .47)).toFixed(4));
    const visibility = [1 - smooth(range(p, .12, .24)), reveal(p, .20, .31, .43, .54), reveal(p, .48, .59, .71, .81), smooth(range(p, .76, .88))];
    scenes.forEach((scene, i) => {
      scene.style.setProperty('--visibility', visibility[i].toFixed(4));
      const enter = i === 0 ? 0 : 1 - smooth(range(p, [.0,.20,.48,.76][i], [.0,.31,.59,.88][i]));
      const exit = i === 3 ? 0 : smooth(range(p, [.12,.43,.71][i], [.24,.54,.81][i]));
      scene.style.setProperty('--scene-y', `${(enter * 55 - exit * 55).toFixed(2)}px`);
    });
    const next = reduced() ? 0 : p < .23 ? 0 : p < .51 ? 1 : p < .79 ? 2 : 3;
    if (next !== active) {
      active = next;
      story.dataset.scene = String(next);
      scenes.forEach((scene, i) => {
        scene.inert = i !== next;
        scene.setAttribute('aria-hidden', String(i !== next));
      });
      steps.forEach((step, i) => {
        if (i === next) step.setAttribute('aria-current', 'step');
        else step.removeAttribute('aria-current');
      });
      label.textContent = next === 3 ? 'CONTINUE PARA EXPLORAR' : 'ROLE PARA DESCOBRIR';
    }
    header.classList.toggle('has-scrolled', window.scrollY > 35);
  }

  function requestRender() { if (!frame) frame = requestAnimationFrame(render); }
  function measure() {
    top = story.getBoundingClientRect().top + window.scrollY;
    distance = Math.max(1, story.offsetHeight - pin.offsetHeight);
    requestRender();
  }
  document.documentElement.classList.add('story-ready');
  steps.forEach((step, i) => step.addEventListener('click', () => {
    const positions = [0, .35, .64, .94];
    window.scrollTo({top: top + positions[i] * distance, behavior: reduced() ? 'instant' : 'smooth'});
  }));
  window.addEventListener('scroll', requestRender, {passive:true});
  window.addEventListener('resize', measure, {passive:true});
  window.addEventListener('pageshow', measure);
  motion.addEventListener('change', () => {motionButton.hidden = !motion.matches || motionOptIn;measure();});
  new ResizeObserver(measure).observe(story);
  document.fonts.ready.then(measure);
  const portrait = document.querySelector('#personal-portrait');
  portrait?.addEventListener('load', measure, {once:true});

  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  }, {threshold:.08, rootMargin:'0px 0px -25px 0px'});
  document.querySelectorAll('[data-reveal]').forEach(section => observer.observe(section));
  measure();
})();
