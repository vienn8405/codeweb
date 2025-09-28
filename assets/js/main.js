document.addEventListener('DOMContentLoaded', () => {
  const list = document.querySelector('#post-list');
  const dataEl = document.querySelector('#post-data');
  if (list && dataEl) {
    try {
      const posts = JSON.parse(dataEl.textContent);
      list.innerHTML = posts.map(p => `
        <li class="card shadow-soft">
          <a href="${p.url}" aria-label="${p.title}">
            <img src="${p.image}" alt="${p.title}" width="1200" height="675" loading="lazy" class="w-full aspect-video object-cover">
          </a>
          <div class="p-4">
            <a href="${p.url}" class="title text-xl font-semibold hover:underline">${p.title}</a>
            <p class="text-sm text-gray-600 mt-1">${p.date} • ${p.tags.join(', ')}</p>
            <p class="mt-2">${p.desc}</p>
            <div class="mt-3">${p.tags.map(t => `<span class="badge">${t}</span>`).join('')}</div>
          </div>
        </li>
      `).join('');
    } catch(e) { /* no-op */ }
  }

  // Dark mode toggle
  const toggle = document.querySelector('#theme-toggle');
  const root = document.documentElement;
  const pref = localStorage.getItem('theme') || '';
  if (pref === 'dark') root.classList.add('dark');
  toggle?.addEventListener('click', () => {
    root.classList.toggle('dark');
    localStorage.setItem('theme', root.classList.contains('dark') ? 'dark' : 'light');
  });
});
