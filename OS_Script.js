// Initialize the OS
document.addEventListener('DOMContentLoaded', function () {
    // Render the desktop icons dynamically
    renderDesktop();
    // Initialize desktop drag and drop
    initDesktopDnd();

    // Create particles
    createParticles();

    // Update clock
    updateClock();
    setInterval(updateClock, 1000);

    // Initialize terminal
    initTerminal();

    // Initialize visualizer
    initVisualizer();

    // Initialize file manager drag and drop
    initFileManager();

    // Initialize NEXUS AI Assistant
    initNexusAI();

    // Initialize To-Do List
    initTodoList();

    // Show welcome notification
    showNotification('System', 'NEXUS OS initialized. All systems operational.');
});

// Particle system
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = 30;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');

        // Random properties
        const size = Math.random() * 5 + 2;
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        const delay = Math.random() * 15;
        const duration = Math.random() * 10 + 15;

        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${posX}vw`;
        particle.style.top = `${posY}vh`;
        particle.style.animationDelay = `${delay}s`;
        particle.style.animationDuration = `${duration}s`;

        particlesContainer.appendChild(particle);
    }
}

// Clock function
function updateClock() {
    const timeOptions = { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' };
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', timeOptions);
    document.getElementById('clock').textContent = timeStr;
}

// Window management
let zIndex = 100;
let activeWindow = null;

function openWindow(windowId) {
    const window = document.getElementById(windowId);
    window.style.display = 'flex';
    window.style.zIndex = zIndex++;
    activeWindow = windowId;

    // Add active class to taskbar app
    const taskbarApps = document.querySelectorAll('.taskbar-app');
    taskbarApps.forEach(app => app.classList.remove('active'));
    // The taskbar app's ID is expected to be `taskbar-${windowId}`
    const taskbarApp = document.getElementById(`taskbar-${windowId}`);
    if (taskbarApp) {
        taskbarApp.classList.add('active');
    }

    // Show notification for some apps
    if (windowId === 'terminal-window') {
        showNotification('Terminal', 'Terminal session initialized.');
    }

    // Maximize browser window on open
    if (windowId === 'browser-window') {
        maximizeWindow(windowId, false); // Don't toggle, just maximize
    }
}

function closeWindow(windowId) {
    document.getElementById(windowId).style.display = 'none';
}

function minimizeWindow(windowId) {
    const window = document.getElementById(windowId);
    window.style.transform = 'translateY(100vh)';
    setTimeout(() => {
        window.style.display = 'none';
        window.style.transform = 'translateY(0)';
    }, 300);
}

function maximizeWindow(windowId, toggle = true) {
    const window = document.getElementById(windowId);
    // If toggle is true and window is already maximized, restore it
    if (toggle && window.classList.contains('maximized')) {
        window.classList.remove('maximized');
        window.style.width = '';
        window.style.height = '';
        window.style.top = '100px'; // Restore to a default position
        window.style.left = '';
    } else {
        window.classList.add('maximized');
        window.style.width = '95vw';
        window.style.height = '90vh';
        window.style.top = '2.5vh';
        window.style.left = '2.5vw';
    }
}

// Make windows draggable
let isDragging = false;
let currentX;
let currentY;
let initialX;
let initialY;
let xOffset = 0;
let yOffset = 0;

document.addEventListener('mousedown', dragStart);
document.addEventListener('mouseup', dragEnd);
document.addEventListener('mousemove', drag);

function dragStart(e) {
    if (e.target.closest('.window-header')) {
        initialX = e.clientX - xOffset;
        initialY = e.clientY - yOffset;

        if (e.target.closest('.window')) {
            isDragging = true;
            const window = e.target.closest('.window');
            window.style.zIndex = zIndex++;
            activeWindow = window.id;
        }
    }
}

function dragEnd(e) {
    if (isDragging) {
        initialX = currentX;
        initialY = currentY;

        isDragging = false;
    }
}

function drag(e) {
    if (isDragging) {
        e.preventDefault();

        currentX = e.clientX - initialX;
        currentY = e.clientY - initialY;

        xOffset = currentX;
        yOffset = currentY;

        setTranslate(currentX, currentY, document.getElementById(activeWindow));
    }
}

function setTranslate(xPos, yPos, el) {
    el.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`;
}

// Terminal functionality
let terminalCurrentPath = ['root'];

function initTerminal() {
    const terminalInput = document.getElementById('terminal-input');
    const terminalWindow = document.getElementById('terminal-window');
    terminalInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
            processCommand(this.value);
            this.value = '';
        }
    });
    terminalWindow.addEventListener('click', () => terminalInput.focus());
}

function processCommand(command) {
    const terminal = document.getElementById('terminal');
    const prompt = `<span class="terminal-prompt">user@nexus:${terminalCurrentPath.join('/')}$</span>`;

    // Add the command to terminal history
    const output = document.createElement('div');
    output.innerHTML = `${prompt} ${command}`;
    const inputLine = document.getElementById('terminal-input-line');
    terminal.insertBefore(output, inputLine);

    // Process command
    const parts = command.trim().split(' ');
    const cmd = parts[0].toLowerCase();

    if (cmd === 'help') {
        inputLine.insertAdjacentHTML('beforebegin', 'Available commands: help, clear, date, neofetch, echo, ls, cd, pwd, cat, mkdir, touch, whoami<br>');
    } else if (cmd === 'clear') {
        // Clear all previous output, but keep the input line
        const inputLine = document.getElementById('terminal-input-line');
        terminal.innerHTML = ''; // Clear everything
        terminal.appendChild(inputLine); // Add the input line back
    } else if (command === 'date') {
        inputLine.insertAdjacentHTML('beforebegin', new Date().toString() + '<br>');
    } else if (command === 'neofetch') {
        const neofetchOutput = /*html*/`
            <div style="display: flex; align-items: center; gap: 10px; margin: 10px 0;">
                <div style="color: var(--terminal-text); font-weight: bold; font-size: 16px;">
                    user@nexus<br>
                    ---------<br>
                    OS: NEXUS OS v2.1.4<br>
                    Shell: Quantum Terminal v1.0.3<br>
                    CPU: Quantum Processor (16) @ 4.2GHz<br>
                    Memory: 16384MB / 32768MB<br>
                </div>
            </div>
        `;
        inputLine.insertAdjacentHTML('beforebegin', neofetchOutput);
    } else if (cmd === 'echo') {
        inputLine.insertAdjacentHTML('beforebegin', parts.slice(1).join(' ') + '<br>');
    } else if (cmd === 'whoami') {
        inputLine.insertAdjacentHTML('beforebegin', 'user<br>');
    } else if (cmd === 'pwd') {
        inputLine.insertAdjacentHTML('beforebegin', `/${terminalCurrentPath.join('/')}<br>`);
    } else if (cmd === 'ls') {
        let currentLevel = fileSystem;
        terminalCurrentPath.forEach(p => { currentLevel = currentLevel[p].children; });

        let listing = Object.keys(currentLevel).map(name => {
            const item = currentLevel[name];
            return item.type === 'folder' ? `<span style="color: var(--primary);">${name}</span>` : name;
        }).join('&nbsp;&nbsp;&nbsp;'); // Use non-breaking spaces

        inputLine.insertAdjacentHTML('beforebegin', listing + '<br>');
    } else if (cmd === 'cd') {
        const targetDir = parts[1];
        if (!targetDir) {
            terminalCurrentPath = ['root']; // cd to root
        } else if (targetDir === '..') {
            if (terminalCurrentPath.length > 1) {
                terminalCurrentPath.pop();
            }
        } else {
            let currentLevel = fileSystem;
            terminalCurrentPath.forEach(p => { currentLevel = currentLevel[p].children; });
            if (currentLevel[targetDir] && currentLevel[targetDir].type === 'folder') {
                terminalCurrentPath.push(targetDir);
            } else {
                inputLine.insertAdjacentHTML('beforebegin', `cd: no such file or directory: ${targetDir}<br>`);
            }
        }
    } else if (cmd === 'cat') {
        const targetFile = parts[1];
        if (!targetFile) {
            inputLine.insertAdjacentHTML('beforebegin', 'cat: missing operand<br>');
        } else {
            let currentLevel = fileSystem;
            terminalCurrentPath.forEach(p => { currentLevel = currentLevel[p].children; });
            if (currentLevel[targetFile] && currentLevel[targetFile].type === 'file') {
                inputLine.insertAdjacentHTML('beforebegin', `Displaying content of ${targetFile}: (simulation)<br>... file content here ...<br>`);
            } else {
                inputLine.insertAdjacentHTML('beforebegin', `cat: ${targetFile}: No such file or it's a directory<br>`);
            }
        }
    } else if (cmd === 'mkdir') {
        const dirName = parts[1];
        if (!dirName) {
            inputLine.insertAdjacentHTML('beforebegin', 'mkdir: missing operand<br>');
        } else {
            let currentLevel = fileSystem;
            terminalCurrentPath.forEach(p => { currentLevel = currentLevel[p].children; });
            if (!currentLevel[dirName]) {
                currentLevel[dirName] = { type: 'folder', children: {} };
                renderFileManager(); // Re-render file manager to show new folder
            } else {
                inputLine.insertAdjacentHTML('beforebegin', `mkdir: cannot create directory ‘${dirName}’: File exists<br>`);
            }
        }
    } else if (cmd === 'touch') {
        const fileName = parts[1];
        if (!fileName) {
            inputLine.insertAdjacentHTML('beforebegin', 'touch: missing file operand<br>');
        } else {
            let currentLevel = fileSystem;
            terminalCurrentPath.forEach(p => { currentLevel = currentLevel[p].children; });
            if (!currentLevel[fileName]) {
                currentLevel[fileName] = { type: 'file', icon: 'fa-file-alt' };
                renderFileManager(); // Re-render file manager to show new file
            }
        }
    } else if (cmd) {
        inputLine.insertAdjacentHTML('beforebegin', `Command not found: ${cmd}<br>`);
    }

    document.getElementById('terminal-input').focus();

    // Scroll to bottom
    terminal.scrollTop = terminal.scrollHeight;
}

// Calculator functionality
let calcValue = '0';

function appendToCalc(value) {
    if (calcValue === '0' && value !== '.') {
        calcValue = value;
    } else {
        calcValue += value;
    }
    updateCalcDisplay();
}

function clearCalculator() {
    calcValue = '0';
    updateCalcDisplay();
}

function backspaceCalc() {
    if (calcValue.length > 1) {
        calcValue = calcValue.slice(0, -1);
    } else {
        calcValue = '0';
    }
    updateCalcDisplay();
}

function calculate() {
    try {
        // Use the Function constructor for safer evaluation than eval().
        // It prevents access to local scope variables.
        // This is still not perfectly secure if the input is not sanitized,
        // but it's a significant improvement over eval().
        const safeEval = new Function(`return ${calcValue}`);
        calcValue = safeEval().toString();
    } catch (e) {
        calcValue = 'Error';
    }
    updateCalcDisplay();
}

function updateCalcDisplay() {
    document.getElementById('calc-display').textContent = calcValue;
}

// Media player functionality
function initVisualizer() {
    const visualizer = document.getElementById('visualizer');
    const bars = visualizer.querySelectorAll('.visualizer-bar');

    setInterval(() => {
        bars.forEach(bar => {
            const height = Math.floor(Math.random() * 80) + 5;
            bar.style.height = `${height}%`;

            // Random color for some bars
            if (Math.random() > 0.7) {
                bar.style.background = `var(${Math.random() > 0.5 ? '--secondary' : '--accent'})`;
                bar.style.boxShadow = `0 0 10px var(${Math.random() > 0.5 ? '--secondary' : '--accent'})`;
            } else {
                bar.style.background = 'var(--primary)';
                bar.style.boxShadow = '0 0 10px var(--primary)';
            }
        });
    }, 100);
}

function playMedia() {
    showNotification('Media Player', 'Playing holographic media stream.');
}

function pauseMedia() {
    showNotification('Media Player', 'Media paused.');
}

function stopMedia() {
    showNotification('Media Player', 'Media stopped.');
}

// Browser functionality
document.getElementById('browser-url').addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
        browserGo();
    }
});

function browserGo() {
    let url = document.getElementById('browser-url').value;
    const iframe = document.getElementById('browser-iframe');

    // Add http/https protocol if missing
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
    }

    // A note on CORS and X-Frame-Options: Many sites (like google.com) will block iframe requests.
    // This is a security feature. We can't bypass it from the client-side.
    // Using a proxy or a different search engine that allows iframing (like Bing) is a workaround.
    iframe.src = url;
    showNotification('Browser', `Navigating to ${url}`);
}

function browserGoBack() {
    const iframe = document.getElementById('browser-iframe');
    iframe.contentWindow.history.back();
}

function browserGoForward() {
    const iframe = document.getElementById('browser-iframe');
    iframe.contentWindow.history.forward();
}

function browserReload() {
    const iframe = document.getElementById('browser-iframe');
    iframe.contentWindow.location.reload();
}

// Notification system
function showNotification(title, content) {
    const container = document.getElementById('notification-container');
    const notification = document.createElement('div');
    notification.classList.add('notification');
    notification.innerHTML = `
                <div class="notification-header">
                    <i class="fas fa-info-circle"></i>
                    <h3>${title}</h3>
                </div>
                <div class="notification-content">
                    ${content}
                </div>
            `;

    container.appendChild(notification);

    // Remove notification after animation completes
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// NEXUS AI Assistant
function initNexusAI() {
    const searchBarInput = document.getElementById('nexus-ai-input');
    const chatWindow = document.getElementById('ai-chat-window');
    const chatInput = document.getElementById('ai-chat-input');
    const closeButton = document.getElementById('ai-chat-close');

    // Open chat window when search bar is clicked
    searchBarInput.addEventListener('click', () => {
        chatWindow.classList.add('active');
        chatInput.focus();
    });

    // Close chat window
    closeButton.addEventListener('click', () => {
        chatWindow.classList.remove('active');
    });

    // Process query on Enter
    chatInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && this.value.trim() !== '') {
            const query = this.value.trim();
            addMessageToChat(query, 'user');
            processAIQuery(query);
            this.value = '';
        }
    });

    // Add initial greeting
    setTimeout(() => {
        addMessageToChat("Hello! I am the NEXUS AI assistant. How can I help you today?", 'ai');
    }, 500);
}

function addMessageToChat(text, sender, isTyping = false) {
    const messagesContainer = document.getElementById('ai-chat-messages');
    const messageElement = document.createElement('div');
    messageElement.classList.add('chat-message', sender);
    if (isTyping) {
        messageElement.classList.add('typing');
        messageElement.id = 'typing-indicator';
    }
    messageElement.textContent = text;
    messagesContainer.appendChild(messageElement);

    // Scroll to the latest message
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    return messageElement;
}

function processAIQuery(query) {    
    const messagesContainer = document.getElementById('ai-chat-messages');
    addMessageToChat('NEXUS is thinking...', 'ai', true);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    const lowerQuery = query.toLowerCase();
    let response = `I'm sorry, I don't understand the query: "${query}". My capabilities are still expanding.`; // Default response

    if (lowerQuery.includes('open terminal')) {
        openWindow('terminal-window');
        response = 'Opening the NEXUS Terminal.';
    } else if (lowerQuery.includes('open calculator')) {
        openWindow('calculator-window');
        response = 'Sure, opening the Quantum Calculator.';
    } else if (lowerQuery.includes('open browser')) {
        openWindow('browser-window');
        response = 'Opening the browser.';
    } else if (lowerQuery.includes('open to-do list') || lowerQuery.includes('open todo list')) {
        openWindow('dashboard-window');
        response = 'Loading the To-Do List.';
    } else if (lowerQuery.includes('open media player')) {
        openWindow('mediaplayer-window');
        response = 'Initializing the Holographic Media Player.';
    } else if (lowerQuery.includes('open settings')) {
        openWindow('settings-window');
        response = 'Accessing System Settings.';
    } else if (lowerQuery.includes('open files')) {
        openWindow('filemanager-window');
        response = 'Right away. Opening the Quantum File Manager.';
    } else if (lowerQuery.includes('hello') || lowerQuery.includes('hi')) {
        response = 'Hello! How can I be of service?';
    } else if (lowerQuery.includes('time')) {
        const timeStr = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        response = `The current system time is ${timeStr}.`;
    } else if (lowerQuery.includes('date')) {
        response = `Today's date is ${new Date().toDateString()}.`;
    } else if (lowerQuery.includes('system status')) {
        response = 'System status: CPU at 65%, RAM at 45%. All systems nominal.';
    } else if (lowerQuery.includes('who are you')) {
        response = 'I am NEXUS, the AI core of this operating system. I can help you with various tasks.';
    } else if (lowerQuery.includes('joke')) {
        const jokes = [
            "Why don't scientists trust atoms? Because they make up everything!",
            "Why did the scarecrow win an award? Because he was outstanding in his field!",
            "Why don't programmers like nature? It has too many bugs."
        ];
        response = jokes[Math.floor(Math.random() * jokes.length)];
    } else if (lowerQuery.includes('help') || lowerQuery.includes('what can you do')) {
        response = "I can open applications (e.g., 'open terminal'), tell you the time or date, search the web ('search for...'), or tell you a joke. What would you like to do?";
    } else if (lowerQuery.includes('tell me a secret')) {
        response = "Sometimes, when no one is looking, I change the visualizer colors just for fun.";
    } else if (lowerQuery.startsWith('search for')) {
        const searchTerm = query.substring(11);
        document.getElementById('browser-url').value = `https://www.google.com/search?q=${encodeURIComponent(searchTerm)}`;
        openWindow('browser-window');
        browserGo();
        response = `Searching the web for "${searchTerm}"...`;
    }
    
    // Simulate AI "thinking" then respond
    setTimeout(() => {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
        addMessageToChat(response, 'ai');
    }, 1000 + Math.random() * 500); // Respond in 1-1.5 seconds
}

// Settings functionality
document.getElementById('glow-slider').addEventListener('input', function () {
    document.documentElement.style.setProperty('--glow-intensity', this.value / 5);
    document.querySelector('.slider-value').textContent = `Level ${this.value}`;
});

function renderDesktop() {
    const desktop = document.querySelector('.desktop');
    desktop.innerHTML = ''; // Clear existing static icons

    const desktopItems = fileSystem.root.children.Desktop.children;

    for (const name in desktopItems) {
        const item = desktopItems[name];
        const iconEl = document.createElement('div');
        iconEl.className = 'desktop-icon';
        iconEl.draggable = true;
        iconEl.dataset.name = name;

        // Set position if it exists
        if (item.position) {
            iconEl.classList.add('moved');
            iconEl.style.left = item.position.x;
            iconEl.style.top = item.position.y;
        }

        let iconClass = 'fas fa-file'; // Default
        if (item.type === 'app') {
            iconClass = item.icon;
        } else if (item.type === 'folder') {
            iconClass = 'fas fa-folder';
        } else if (item.icon) {
            iconClass = `fas ${item.icon}`;
        }

        iconEl.innerHTML = `<i class="${iconClass}"></i><span>${name}</span>`;

        // Add click listener based on item type
        if (item.type === 'app' && item.action) {
            iconEl.addEventListener('click', () => {
                // Use Function constructor to safely execute the action string
                new Function(item.action)();
            });
        } else if (item.type === 'folder') {
             iconEl.addEventListener('click', () => {
                // Open file manager and navigate to this folder
                currentPath = ['root', 'Desktop', name];
                openWindow('filemanager-window');
                renderFileManager();
            });
        }

        desktop.appendChild(iconEl);
    }
}

// --- File Manager Functionality ---

const fileSystem = {
    'root': {
        type: 'folder',
        children: {
            'Desktop': {
                type: 'folder',
                children: {
                    'Terminal': { type: 'app', icon: 'fas fa-terminal', action: "openWindow('terminal-window')", position: { x: '20px', y: '20px' } },
                    'Browser': { type: 'app', icon: 'fas fa-globe', action: "openWindow('browser-window')", position: { x: '20px', y: '120px' } },
                    'Files': { type: 'app', icon: 'fas fa-folder', action: "openWindow('filemanager-window')", position: { x: '20px', y: '220px' } },
                    'Calculator': { type: 'app', icon: 'fas fa-calculator', action: "openWindow('calculator-window')", position: { x: '120px', y: '20px' } },
                    'To-Do List': { type: 'app', icon: 'fas fa-tasks', action: "openWindow('dashboard-window')", position: { x: '120px', y: '120px' } },
                    'Media Player': { type: 'app', icon: 'fas fa-play-circle', action: "openWindow('mediaplayer-window')", position: { x: '120px', y: '220px' } },
                    'Settings': { type: 'app', icon: 'fas fa-cog', action: "openWindow('settings-window')", position: { x: '220px', y: '20px' } },
                    'Manager': { type: 'app', icon: 'fas fa-user-shield', action: "showNotification('Manager', 'This feature is under development.')", position: { x: '220px', y: '120px' } }
                }
            },
            'Projects': {
                type: 'folder',
                children: {
                    'NEXUS_OS': { type: 'folder', children: {} },
                    'AI_Core': { type: 'folder', children: {} }
                }
            },
            'System': { type: 'folder', children: {} },
            'Backups': { type: 'folder', children: {} },
            'README.md': { type: 'file', icon: 'fa-file-code' },
            'Notes.txt': { type: 'file', icon: 'fa-file-alt' },
            'Screenshot.png': { type: 'file', icon: 'fa-file-image' },
        }
    }
};

let currentPath = []; // Start at root's children
let draggedItem = {
    element: null,
    parentPath: null,
    name: null
};

function initFileManager() {
    renderFileManager();
    document.getElementById('fm-back-btn').addEventListener('click', navigateBack);
    const fmContent = document.getElementById('fm-content');

    // Use event delegation for clicks and drag events
    fmContent.addEventListener('click', handleFMClick);
    fmContent.addEventListener('dragstart', handleDragStart);
    fmContent.addEventListener('dragend', handleDragEnd);
    fmContent.addEventListener('dragover', handleDragOver);
    fmContent.addEventListener('dragleave', handleDragLeave);
    fmContent.addEventListener('drop', handleDrop);
}

function renderFileManager() {
    const fmContent = document.getElementById('fm-content');
    fmContent.innerHTML = ''; // Clear current view

    let currentLevel = fileSystem.root.children;
    currentPath.forEach(p => { currentLevel = currentLevel[p].children; });

    for (const name in currentLevel) {
        const item = currentLevel[name];
        const itemEl = document.createElement('div');
        itemEl.className = item.type === 'folder' ? 'folder-item' : 'file-item';
        itemEl.draggable = true;
        itemEl.dataset.name = name;

        const iconClass = item.type === 'folder' ? 'fas fa-folder' : `fas ${item.icon}`;
        itemEl.innerHTML = `<i class="${iconClass}"></i><span>${name}</span>`;
        fmContent.appendChild(itemEl);
    }
    updateBreadcrumbs();
}

function updateBreadcrumbs() {
    const breadcrumbs = document.getElementById('fm-breadcrumbs');
    breadcrumbs.innerHTML = ['root', ...currentPath].join(' / ') || 'root';
}

function navigateBack() {
    if (currentPath.length > 0) {
        currentPath.pop();
        renderFileManager();
    }
}

// --- To-Do List Functionality ---

let todoItems = [
    { text: 'Update system security', completed: false },
    { text: 'Run diagnostics', completed: true },
    { text: 'Backup data to cloud', completed: false },
];

function initTodoList() {
    document.getElementById('add-todo-btn').addEventListener('click', addTodo);
    document.getElementById('todo-input').addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            addTodo();
        }
    });
    document.getElementById('clear-completed-btn').addEventListener('click', clearCompletedTodos);
    document.getElementById('todo-list-container').addEventListener('change', toggleTodo);

    renderTodos();
}

function renderTodos() {
    const listContainer = document.getElementById('todo-list-container');
    listContainer.innerHTML = '';

    todoItems.forEach((item, index) => {
        const todoEl = document.createElement('div');
        todoEl.className = 'todo-item';
        todoEl.innerHTML = `
            <input type="checkbox" id="todo-${index}" data-index="${index}" ${item.completed ? 'checked' : ''}>
            <label for="todo-${index}">${item.text}</label>
        `;
        listContainer.appendChild(todoEl);
    });
}

function addTodo() {
    const input = document.getElementById('todo-input');
    const text = input.value.trim();

    if (text) {
        todoItems.push({ text: text, completed: false });
        input.value = '';
        renderTodos();
    }
}

function toggleTodo(e) {
    if (e.target.matches('input[type="checkbox"]')) {
        const index = e.target.dataset.index;
        todoItems[index].completed = !todoItems[index].completed;
        renderTodos();
    }
}

function clearCompletedTodos() {
    todoItems = todoItems.filter(item => !item.completed);
    renderTodos();
}

function initDesktopDnd() {
    const desktop = document.querySelector('.desktop');
    let draggedIcon = null;
    let dragOffsetX = 0;
    let dragOffsetY = 0;

    // Use event delegation on the desktop container
    desktop.addEventListener('dragstart', (e) => {
        const target = e.target.closest('.desktop-icon');
        if (!target) return;

        draggedIcon = target;
        dragOffsetX = e.clientX - draggedIcon.getBoundingClientRect().left;
        dragOffsetY = e.clientY - draggedIcon.getBoundingClientRect().top;
        setTimeout(() => draggedIcon.classList.add('dragging'), 0);
    });

    desktop.addEventListener('dragend', () => {
        if (draggedIcon) {
            draggedIcon.classList.remove('dragging');
        }
        draggedIcon = null;
    });

    desktop.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';

        // Handle moving existing icons
        if (draggedIcon) {
            const desktopRect = desktop.getBoundingClientRect();
            let x = e.clientX - desktopRect.left - dragOffsetX;
            let y = e.clientY - desktopRect.top - dragOffsetY;

            // Constrain to desktop bounds
            x = Math.max(0, Math.min(x, desktopRect.width - draggedIcon.offsetWidth));
            y = Math.max(0, Math.min(y, desktopRect.height - draggedIcon.offsetHeight));

            draggedIcon.style.left = `${x}px`;
            draggedIcon.style.top = `${y}px`;

            // Add the 'moved' class if it's not there
            if (!draggedIcon.classList.contains('moved')) {
                draggedIcon.classList.add('moved');
            }
        }

        // Visual feedback for dropping from file manager
        if (draggedItem.element) {
            desktop.classList.add('drag-over');
        }
    });

    desktop.addEventListener('dragleave', () => {
        desktop.classList.remove('drag-over');
    });

    desktop.addEventListener('drop', e => {
        e.preventDefault();
        desktop.classList.remove('drag-over');

        // Handle drop for a dragged desktop icon
        if (draggedIcon) {
            const iconName = draggedIcon.dataset.name;
            const desktopItems = fileSystem.root.children.Desktop.children;
            if (desktopItems[iconName]) {
                // Save the new position in the fileSystem object
                desktopItems[iconName].position = {
                    x: draggedIcon.style.left,
                    y: draggedIcon.style.top
                };
            }
            draggedIcon.classList.remove('dragging');
            draggedIcon = null;
        }
        // Handle drop from file manager
        if (draggedItem.element && draggedItem.name) {
            // Find source and destination folders in the fileSystem
            let sourceFolder = fileSystem.root.children;
            draggedItem.parentPath.forEach(p => { sourceFolder = sourceFolder[p].children; });
            let destFolder = fileSystem.root.children.Desktop.children;

            // Move the item in the data structure if it's not already on desktop
            if (sourceFolder !== destFolder) {
                destFolder[draggedItem.name] = sourceFolder[draggedItem.name];
                delete sourceFolder[draggedItem.name];

                showNotification('Desktop', `Moved '${draggedItem.name}' to Desktop.`);
                renderDesktop(); // Re-render desktop to show new item
                renderFileManager(); // Re-render file manager to remove item
            }
        } 
    });
}

function createDesktopIconFromDrop(clientX, clientY) {
    const desktop = document.querySelector('.desktop');
    const desktopRect = desktop.getBoundingClientRect();

    // Get the item's data from the fileSystem object
    let sourceFolder = fileSystem.root.children;
    draggedItem.parentPath.forEach(p => { sourceFolder = sourceFolder[p].children; });
    const itemData = sourceFolder[draggedItem.name];

    if (!itemData) return;

    // Check if an icon for this item already exists
    if (document.querySelector(`.desktop-icon[data-name="${draggedItem.name}"]`)) {
        showNotification('Desktop', `An icon for '${draggedItem.name}' already exists.`);
        return;
    }

    const iconEl = document.createElement('div');
    iconEl.className = 'desktop-icon free-floating';
    iconEl.draggable = true;
    iconEl.dataset.name = draggedItem.name;

    let iconClass = 'fas fa-file'; // Default file icon
    if (itemData.type === 'folder') {
        iconClass = 'fas fa-folder';
    } else if (itemData.icon) {
        iconClass = `fas ${itemData.icon}`;
    }

    iconEl.innerHTML = `<i class="${iconClass}"></i><span>${draggedItem.name}</span>`;

    // Position the new icon where it was dropped
    let x = clientX - desktopRect.left - 40; // 40 is half icon width
    let y = clientY - desktopRect.top - 40; // 40 is half icon height
    iconEl.style.left = `${x}px`;
    iconEl.style.top = `${y}px`;

    // Add a click listener (e.g., to open the file/folder)
    iconEl.addEventListener('click', () => {
        showNotification('Desktop', `Opening ${draggedItem.name}... (simulation)`);
    });

    desktop.appendChild(iconEl);
    showNotification('Desktop', `Created shortcut for '${draggedItem.name}'.`);
}

function getDragAfterElement(container, x) {
    const draggableElements = [...container.querySelectorAll('.desktop-icon:not(.dragging):not(.free-floating)')];

    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = x - box.left - box.width / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}
function handleFMClick(e) {
    const targetItem = e.target.closest('.folder-item, .file-item');
    if (!targetItem) return;

    const name = targetItem.dataset.name;
    if (targetItem.classList.contains('folder-item')) {
        currentPath.push(name);
        renderFileManager();
    } else {
        showNotification('File Manager', `Opening ${name}... (simulation)`);
    }
}

// --- Drag and Drop Logic ---

function handleDragStart(e) {
    const target = e.target.closest('.file-item, .folder-item');
    if (target) {
        draggedItem.element = target;
        draggedItem.name = target.dataset.name;
        draggedItem.parentPath = [...currentPath];
        setTimeout(() => target.classList.add('dragging'), 0);
    }
}

function handleDragEnd(e) {
    if (draggedItem.element) {
        draggedItem.element.classList.remove('dragging');
    }
    // Also remove drag-over from desktop in case we drag out of the window
    document.querySelector('.desktop').classList.remove('drag-over');
    draggedItem = { element: null, parentPath: null, name: null };
    document.querySelectorAll('.drag-over').forEach(el => el.classList.remove('drag-over'));
}

function handleDragOver(e) {
    e.preventDefault();
    const target = e.target.closest('.folder-item');
    if (target && target !== draggedItem.element) {
        target.classList.add('drag-over');
    }
}

function handleDragLeave(e) {
    const target = e.target.closest('.folder-item');
    if (target) {
        target.classList.remove('drag-over');
    }
}

function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    const dropTarget = e.target.closest('.folder-item');

    if (!draggedItem.element || !dropTarget || dropTarget === draggedItem.element) {
        document.querySelectorAll('.drag-over').forEach(el => el.classList.remove('drag-over'));
        return;
    }

    dropTarget.classList.remove('drag-over');

    // Find source and destination in the fileSystem object
    let sourceFolder = fileSystem.root.children;
    draggedItem.parentPath.forEach(p => { sourceFolder = sourceFolder[p].children; });

    let destPath = [...currentPath, dropTarget.dataset.name];
    let destFolder = fileSystem.root.children;
    destPath.forEach(p => { destFolder = destFolder[p].children; });

    // Check for invalid moves (e.g., moving into a child of itself)
    if (JSON.stringify(destPath).startsWith(JSON.stringify([...draggedItem.parentPath, draggedItem.name]))) {
        showNotification('File Manager', 'Error: Cannot move a folder into itself.', 'error');
        return;
    }

    // Move the item in the data structure
    if (draggedItem.name in sourceFolder) {
        destFolder[draggedItem.name] = sourceFolder[draggedItem.name];
        delete sourceFolder[draggedItem.name];

        showNotification('File Manager', `Moved '${draggedItem.name}' to '${dropTarget.dataset.name}'`);

        // Re-render the view to show the change
        renderFileManager();
    }
}
