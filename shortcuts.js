const defaultShortcuts = [
    { name: 'YouTube', url: 'https://youtube.com' },
    { name: 'EBA', url: 'https://eba.gov.tr' },
    { name: 'MEB', url: 'https://meb.gov.tr' }
];

let shortcuts = JSON.parse(localStorage.getItem('quickShortcuts')) || defaultShortcuts;

function initShortcuts() {
    console.log('Shortcuts System: Initializing...');
    const trigger = document.getElementById('shortcutsTrigger');
    const modal = document.getElementById('shortcutsModal');
    const grid = document.getElementById('shortcutsGrid');
    const addBtn = document.getElementById('addShortcutBtn');
    const formModal = document.getElementById('addShortcutFormModal');
    const saveBtn = document.getElementById('saveShortcutBtn');
    const cancelBtn = document.getElementById('cancelShortcutBtn');

    if (!trigger || !modal || !grid) {
        console.error('Shortcuts System: Missing elements!', { trigger, modal, grid });
        return;
    }

    // Toggle Modal
    trigger.onclick = (e) => {
        console.log('Shortcuts Trigger Clicked');
        e.stopPropagation();
        const isHidden = getComputedStyle(modal).display === 'none';
        modal.style.display = isHidden ? 'flex' : 'none';
        if (isHidden) renderShortcuts();
    };

    // Close on click outside - Use EventListener to avoid overwriting
    window.addEventListener('click', (e) => {
        if (e.target === modal) modal.style.display = 'none';
        if (e.target === formModal) formModal.style.display = 'none';
    });

    // Form logic
    if (addBtn) addBtn.onclick = () => formModal.style.display = 'flex';
    if (cancelBtn) cancelBtn.onclick = () => formModal.style.display = 'none';

    if (saveBtn) {
        saveBtn.onclick = () => {
            const name = document.getElementById('shortcutName').value;
            const url = document.getElementById('shortcutUrl').value;
            if (name && url) {
                shortcuts.push({ name, url: url.startsWith('http') ? url : `https://${url}` });
                localStorage.setItem('quickShortcuts', JSON.stringify(shortcuts));
                renderShortcuts();
                formModal.style.display = 'none';
                document.getElementById('shortcutName').value = '';
                document.getElementById('shortcutUrl').value = '';
            }
        };
    }

    renderShortcuts();
    console.log('Shortcuts System: Ready');
}

function renderShortcuts() {
    const grid = document.getElementById('shortcutsGrid');
    if (!grid) return;

    grid.innerHTML = shortcuts.map((s, index) => `
        <a href="${s.url}" target="_blank" class="shortcut-item">
            <button class="delete-shortcut" onclick="event.preventDefault(); deleteShortcut(${index})">✕</button>
            <div class="shortcut-icon-circle">${s.name.charAt(0).toUpperCase()}</div>
            <span class="shortcut-name">${s.name}</span>
        </a>
    `).join('');
}

window.deleteShortcut = (index) => {
    shortcuts.splice(index, 1);
    localStorage.setItem('quickShortcuts', JSON.stringify(shortcuts));
    renderShortcuts();
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initShortcuts);
} else {
    initShortcuts(); // Run immediately if already loaded
}
