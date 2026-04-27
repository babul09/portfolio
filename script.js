const projects = [
  {
    id: 'fincash',
    num: '01',
    title: 'Fincash',
    text: 'A sleek dashboard for tracking your finances.',
    categories: ['web-design', 'web-development', 'ui-ux'],
    role: 'UI/UX Design, Web Development',
    tools: 'Figma, React, Tailwind CSS',
    year: '2024',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'taskflow',
    num: '02',
    title: 'Taskflow',
    text: 'Productivity tool that helps you get more done.',
    categories: ['web-development', 'branding'],
    role: 'Product Design, Frontend Development',
    tools: 'Figma, JavaScript, Firebase',
    year: '2025',
    image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'wanderlust',
    num: '03',
    title: 'Wanderlust',
    text: 'Travel website inspiring users to explore new places.',
    categories: ['web-design', 'branding', 'ui-ux'],
    role: 'Art Direction, UI Design',
    tools: 'Figma, Photoshop, Webflow',
    year: '2024',
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80'
  }
];

document.addEventListener('DOMContentLoaded', () => {
  const projectList = document.querySelector('#projectList');
  const emptyState = document.querySelector('#emptyState');
  const filters = document.querySelectorAll('.filter');
  const navLinks = document.querySelectorAll('.site-nav a');
  const sections = document.querySelectorAll('[data-section]');
  const menuButton = document.querySelector('.nav-toggle');
  const tools = document.querySelectorAll('.tools');
  const cursorRip = document.querySelector('#cursorRip');
  const motionAllowed = window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let activeProjectId = projects[0].id;

  function projectCard(project, index) {
    const tilt = index % 2 === 0 ? '-1deg' : '1deg';
    return `
      <button class="project-card" type="button" data-project="${project.id}" data-categories="${project.categories.join(' ')}" style="--tilt:${tilt}">
        <span class="card-media"><img src="${project.image}" alt="${project.title} preview"></span>
        <span class="card-copy">
          <small>${project.num}</small>
          <strong>${project.title}</strong>
          <span>${project.text}</span>
          <em>View project <b aria-hidden="true">→</b></em>
        </span>
      </button>
    `;
  }

  function renderProjects() {
    projectList.innerHTML = projects.map(projectCard).join('');
  }

  function updateProjectDetail(project, shouldScroll = false) {
    activeProjectId = project.id;
    const detail = document.querySelector('#project');
    detail.classList.remove('is-swapping');
    void detail.offsetWidth;
    detail.classList.add('is-swapping');

    document.querySelector('#detailNum').textContent = project.num;
    document.querySelector('#detailTitle').textContent = project.title;
    document.querySelector('#detailText').textContent = project.text;
    document.querySelector('#detailRole').textContent = project.role;
    document.querySelector('#detailTools').textContent = project.tools;
    document.querySelector('#detailYear').textContent = project.year;
    document.querySelector('#detailImage').src = project.image;
    document.querySelector('#detailImage').alt = `${project.title} project preview`;
    document.querySelector('#detailSticker').textContent = `${project.title} cut`;

    const thumbs = projects
      .map(item => `
        <button class="thumb ${item.id === activeProjectId ? 'active' : ''}" type="button" data-project="${item.id}" aria-label="Show ${item.title}">
          <img src="${item.image}" alt="${item.title} thumbnail">
        </button>
      `)
      .join('');
    document.querySelector('#thumbRow').innerHTML = thumbs;

    document.querySelectorAll('.project-card').forEach(card => {
      card.classList.toggle('active', card.dataset.project === activeProjectId);
    });

    if (shouldScroll) {
      document.querySelector('#project').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  function filterProjects(category) {
    let visibleCount = 0;
    document.querySelectorAll('.project-card').forEach((card, index) => {
      const visible = category === 'all' || card.dataset.categories.split(' ').includes(category);
      card.classList.toggle('is-hidden', !visible);
      card.style.setProperty('--stagger', `${index * 70}ms`);
      if (visible) visibleCount += 1;
    });
    emptyState.hidden = visibleCount > 0;
  }

  function activateNav() {
    let current = 'home';
    sections.forEach(section => {
      const top = section.getBoundingClientRect().top;
      if (top < window.innerHeight * 0.42) current = section.dataset.section;
    });

    navLinks.forEach(link => {
      const target = link.getAttribute('href').replace('#', '');
      link.classList.toggle('active', target === current);
    });
  }

  function renderTools() {
    tools.forEach(group => {
      const names = group.dataset.tools.split(',');
      group.innerHTML = names
        .map(name => {
          const icon = name === 'JavaScript' ? 'Js' : name.split(' ').map(word => word[0]).join('').slice(0, 2);
          return `<div class="tool" data-float><span class="tool-icon">${icon}</span><span>${name}</span></div>`;
        })
        .join('');
    });
  }

  function setupReveals() {
    const revealItems = document.querySelectorAll('.paper, .photo, .project-card, .tool, .section-title, .contact-info');
    revealItems.forEach(item => item.classList.add('reveal'));

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('in-view');
      });
    }, { threshold: 0.18 });

    revealItems.forEach(item => observer.observe(item));
  }

  function setupPointerMotion() {
    if (!motionAllowed) return;

    document.addEventListener('pointermove', event => {
      cursorRip.style.transform = `translate(${event.clientX}px, ${event.clientY}px)`;
    }, { passive: true });

    document.querySelectorAll('[data-float], .photo, .project-card, .filter, .btn').forEach(item => {
      item.addEventListener('pointermove', event => {
        const box = item.getBoundingClientRect();
        const x = ((event.clientX - box.left) / box.width - 0.5) * 14;
        const y = ((event.clientY - box.top) / box.height - 0.5) * 14;
        item.style.setProperty('--mx', `${x}px`);
        item.style.setProperty('--my', `${y}px`);
      });

      item.addEventListener('pointerleave', () => {
        item.style.removeProperty('--mx');
        item.style.removeProperty('--my');
      });
    });
  }

  renderProjects();
  renderTools();
  updateProjectDetail(projects[0]);
  filterProjects('all');
  setupReveals();
  setupPointerMotion();
  activateNav();

  if (window.location.hash) {
    requestAnimationFrame(() => {
      document.querySelector(window.location.hash)?.scrollIntoView({ block: 'start' });
    });
  }

  filters.forEach(button => {
    button.addEventListener('click', () => {
      filters.forEach(item => item.classList.remove('active'));
      button.classList.add('active');
      filterProjects(button.dataset.filter);
    });
  });

  document.addEventListener('click', event => {
    const trigger = event.target.closest('[data-project]');
    if (!trigger) return;
    const project = projects.find(item => item.id === trigger.dataset.project);
    if (project) updateProjectDetail(project, trigger.classList.contains('project-card'));
  });

  menuButton.addEventListener('click', () => {
    const isOpen = document.body.classList.toggle('menu-open');
    menuButton.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      document.body.classList.remove('menu-open');
      menuButton.setAttribute('aria-expanded', 'false');
    });
  });

  window.addEventListener('scroll', activateNav, { passive: true });

  document.querySelector('#contactForm').addEventListener('submit', event => {
    event.preventDefault();
    event.currentTarget.reset();
    document.querySelector('#formStatus').textContent = 'Message staged. Wire this form to your email service when ready.';
  });
});
