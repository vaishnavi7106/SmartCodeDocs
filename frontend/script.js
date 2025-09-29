document.addEventListener('DOMContentLoaded', () => {
    // --- 1. GATHER ALL THE HTML ELEMENTS ---
    const pages = {
        generator: document.getElementById('page-generator'),
        viewer: document.getElementById('page-viewer'),
        history: document.getElementById('page-history')
    };
    const navLinks = {
        generator: document.getElementById('nav-generator'),
        history: document.getElementById('nav-history')
    };
    // Generator Page
    const codeInput = document.getElementById('codeInput');
    const languageSelect = document.getElementById('languageSelect');
    const docStyleSelect = document.getElementById('docStyle');
    const generateBtn = document.getElementById('generateBtn');
    const generatorLoading = document.getElementById('generator-loading');
    
    // Viewer Page
    const outputCode = document.getElementById('outputCode');
    const copyBtn = document.getElementById('copyBtn');
    const saveBtn = document.getElementById('saveBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const backBtnViewer = document.getElementById('backBtn-viewer');

    // History Page
    const historyList = document.getElementById('history-list');
    const clearHistoryBtn = document.getElementById('clearHistoryBtn');
    const backBtnHistory = document.getElementById('backBtn-history');

    // Global
    const alertContainer = document.getElementById('alert-container');
    let currentDocumentation = null;

    // --- 2. CORE FUNCTIONS (NAVIGATION & ALERTS) ---
    function showAlert(message, type = 'info') {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert ${type}`;
        alertDiv.textContent = message;
        alertContainer.appendChild(alertDiv);
        setTimeout(() => alertDiv.remove(), 3000); // Alert disappears after 3 seconds
    }
    
    function showPage(pageName) {
        Object.values(pages).forEach(page => page.classList.remove('active'));
        pages[pageName].classList.add('active');
        Object.keys(navLinks).forEach(key => navLinks[key].classList.toggle('active', key === pageName));
        if (pageName === 'history') {
            renderHistory();
        }
    }

    // --- 3. EVENT LISTENERS ---
    
    // Navigation
    Object.keys(navLinks).forEach(key => navLinks[key].addEventListener('click', (e) => {
        e.preventDefault();
        showPage(key);
    }));

    // Back Buttons
    backBtnViewer.addEventListener('click', () => showPage('generator'));
    backBtnHistory.addEventListener('click', () => showPage('generator'));
    
    // Generate Button
    generateBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (codeInput.value.trim() === '') {
            return showAlert('Please paste some code.', 'error');
        }

        generatorLoading.classList.remove('hidden');
        generateBtn.disabled = true;

        const payload = {
            code: codeInput.value,
            language: languageSelect.value,
            style: docStyleSelect.value
        };

        fetch('http://127.0.0.1:5000/generate-docs-from-text', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => { throw new Error(err.error || 'Server responded with an error') });
            }
            return response.json();
        })
        .then(result => {
            if (result.documentation) {
                currentDocumentation = result.documentation;
                outputCode.textContent = currentDocumentation;
                showPage('viewer');
            } else {
                throw new Error('Invalid response from server.');
            }
        })
        .catch(error => {
            console.error('Fetch Error:', error);
            showAlert(error.message, 'error');
        })
        .finally(() => {
            generatorLoading.classList.add('hidden');
            generateBtn.disabled = false;
        });
    });
    
    // --- 4. VIEWER & HISTORY ACTIONS ---
    const getHistory = () => JSON.parse(localStorage.getItem('docuGenHistory')) || [];
    const saveHistory = (history) => localStorage.setItem('docuGenHistory', JSON.stringify(history));

    function renderHistory() {
        const history = getHistory().sort((a, b) => new Date(b.date) - new Date(a.date));
        historyList.innerHTML = history.length === 0 ? '<p>You have no saved documents.</p>' :
            history.map(item => `
                <div class="history-item">
                    <div class="history-item-info">
                        <span class="title">${item.title}</span>
                        <span class="date">${new Date(item.date).toLocaleString()}</span>
                    </div>
                    <div class="history-item-actions">
                        <button type="button" class="view-btn" data-id="${item.id}">View</button>
                        <button type="button" class="delete-btn" data-id="${item.id}">Delete</button>
                    </div>
                </div>`).join('');
    }

    copyBtn.addEventListener('click', () => {
        if (!currentDocumentation) return;
        navigator.clipboard.writeText(currentDocumentation)
            .then(() => showAlert('Copied to clipboard!'))
            .catch(() => showAlert('Failed to copy.', 'error'));
    });

    saveBtn.addEventListener('click', () => {
        if (!currentDocumentation) return;
        const history = getHistory();
        const title = currentDocumentation.split('\n')[0].replace(/[^a-zA-Z0-9 ]/g, "").substring(0, 50) || "Untitled";
        history.push({ id: Date.now(), title, date: new Date().toISOString(), content: currentDocumentation });
        saveHistory(history);
        showAlert('Saved to history!');
        showPage('history');
    });

    downloadBtn.addEventListener('click', () => {
        if (!currentDocumentation) return;
        const blob = new Blob([currentDocumentation], { type: 'text/markdown;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'documentation.md';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });

    historyList.addEventListener('click', (e) => {
        if (e.target.tagName !== 'BUTTON') return;
        
        const id = parseInt(e.target.dataset.id, 10);
        const history = getHistory();

        if (e.target.classList.contains('view-btn')) {
            const item = history.find(i => i.id === id);
            if (item) {
                currentDocumentation = item.content;
                outputCode.textContent = currentDocumentation;
                showPage('viewer');
            }
        } else if (e.target.classList.contains('delete-btn')) {
            const updatedHistory = history.filter(i => i.id !== id);
            saveHistory(updatedHistory);
            renderHistory();
            showAlert('Item deleted.');
        }
    });

    clearHistoryBtn.addEventListener('click', () => {
        if (getHistory().length === 0) {
            return showAlert('History is already empty.', 'error');
        }
        if (confirm('Are you sure you want to delete all saved history?')) {
            localStorage.removeItem('docuGenHistory');
            renderHistory();
            showAlert('History cleared!');
        }
    });

    // --- 5. INITIALIZE THE APP ---
    showPage('generator');
});