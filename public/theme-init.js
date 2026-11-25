// applies the saved dark theme before the first paint (external file so the security policy needs no inline script)
try {
  if (localStorage.getItem('rev24-theme') === 'dark') document.documentElement.classList.add('dark');
} catch (e) {
  /* private mode */
}
