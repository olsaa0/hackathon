
document.querySelectorAll('.more-info-btn').forEach(button => {
  button.addEventListener('click', () => {
    const info = button.nextElementSibling;
    info.style.display = (info.style.display === 'block') ? 'none' : 'block';
    button.textContent = (info.style.display === 'block') ? 'Less Info' : 'More Info';
  });
});

