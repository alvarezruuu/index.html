// Инициализация VK Bridge
const vkBridge = window.vkBridge;

// Состояние игры
const gameState = {
    player: {
        name: 'Игрок',
        avatar: '👷',
        level: 1,
        experience: 0,
        coins: 0,
        gems: 0,
        pickaxeLevel: 1,
        clickPower: 1,
        totalClicks: 0,
        totalOres: 0
    },
    currentOre: {
        type: 'coal',
        name: 'Угольная руда',
        icon: '🪨',
        progress: 0,
        required: 50,
        value: 10,
        expReward: 50
    },
    ores: {
        coal: {
            name: 'Угольная руда',
            icon: '🪨',
            required: 50,
            value: 10,
            expReward: 50,
            unlockLevel: 1
        },
        iron: {
            name: 'Железная руда',
            icon: '⚙️',
            required: 100,
            value: 25,
            expReward: 100,
            unlockLevel: 3
        },
        gold: {
            name: 'Золотая руда',
            icon: '🌟',
            required: 200,
            value: 60,
            expReward: 200,
            unlockLevel: 5
        },
        diamond: {
            name: 'Алмазная руда',
            icon: '💎',
            required: 400,
            value: 150,
            expReward: 400,
            unlockLevel: 8
        },
        emerald: {
            name: 'Изумрудная руда',
            icon: '💚',
            required: 800,
            value: 350,
            expReward: 800,
            unlockLevel: 12
        },
        obsidian: {
            name: 'Обсидиан',
            icon: '🖤',
            required: 1500,
            value: 800,
            expReward: 1500,
            unlockLevel: 16
        },
        mythril: {
            name: 'Мифриловая руда',
            icon: '🔮',
            required: 3000,
            value: 2000,
            expReward: 3000,
            unlockLevel: 20
        }
    },
    inventory: {},
    achievements: {},
    upgrades: {
        pickaxe: {
            name: 'Кирка',
            levels: [
                { level: 1, name: 'Деревянная кирка', power: 1, cost: 0, icon: '🪓' },
                { level: 2, name: 'Каменная кирка', power: 2, cost: 100, icon: '⛏️' },
                { level: 3, name: 'Железная кирка', power: 3, cost: 300, icon: '⚒️' },
                { level: 4, name: 'Золотая кирка', power: 4, cost: 600, icon: '🌟' },
                { level: 5, name: 'Алмазная кирка', power: 5, cost: 1200, icon: '💎' },
                { level: 6, name: 'Мифриловая кирка', power: 7, cost: 2500, icon: '🔮' },
                { level: 7, name: 'Легендарная кирка', power: 10, cost: 5000, icon: '⚡' }
            ]
        }
    },
    shopItems: [
        { id: 'coal', name: 'Уголь', icon: '🪨', price: 15, sellPrice: 10 },
        { id: 'iron', name: 'Железо', icon: '⚙️', price: 35, sellPrice: 25 },
        { id: 'gold', name: 'Золото', icon: '🌟', price: 80, sellPrice: 60 },
        { id: 'diamond', name: 'Алмаз', icon: '💎', price: 200, sellPrice: 150 },
        { id: 'emerald', name: 'Изумруд', icon: '💚', price: 450, sellPrice: 350 },
        { id: 'obsidian', name: 'Обсидиан', icon: '🖤', price: 1000, sellPrice: 800 },
        { id: 'mythril', name: 'Мифрил', icon: '🔮', price: 2500, sellPrice: 2000 }
    ]
};

// DOM элементы
const elements = {
    loadingScreen: document.getElementById('loading-screen'),
    gameScreen: document.getElementById('game-screen'),
    playerName: document.getElementById('player-name'),
    playerLevel: document.getElementById('player-level'),
    playerAvatar: document.getElementById('player-avatar'),
    coins: document.getElementById('coins'),
    gems: document.getElementById('gems'),
    currentOre: document.getElementById('current-ore'),
    oreProgressFill: document.getElementById('ore-progress-fill'),
    oreProgressText: document.getElementById('ore-progress-text'),
    oreDisplay: document.getElementById('ore-display'),
    mineButton: document.getElementById('mine-button'),
    clickPower: document.getElementById('click-power'),
    inventoryGrid: document.getElementById('inventory-grid'),
    modalOverlay: document.getElementById('modal-overlay'),
    modal: document.getElementById('modal'),
    modalTitle: document.getElementById('modal-title'),
    modalContent: document.getElementById('modal-content'),
    modalClose: document.getElementById('modal-close'),
    notifications: document.getElementById('notifications'),
    particles: document.getElementById('particles')
};

// Инициализация приложения
async function initApp() {
    try {
        // Инициализация VK Bridge
        if (vkBridge) {
            await vkBridge.send('VKWebAppInit');
            
            // Получение данных пользователя
            const userInfo = await vkBridge.send('VKWebAppGetUserInfo');
            if (userInfo) {
                gameState.player.name = userInfo.first_name || 'Игрок';
                gameState.player.avatar = userInfo.photo_100 || '👷';
                elements.playerName.textContent = gameState.player.name;
                if (userInfo.photo_100) {
                    elements.playerAvatar.innerHTML = `<img src="${userInfo.photo_100}" style="width: 100%; height: 100%; border-radius: 50%;">`;
                }
            }
        }
        
        // Загрузка сохраненной игры
        loadGame();
        
        // Показ игрового экрана
        setTimeout(() => {
            elements.loadingScreen.classList.remove('active');
            elements.gameScreen.classList.add('active');
            updateUI();
        }, 2000);
        
    } catch (error) {
        console.error('Ошибка инициализации:', error);
        elements.loadingScreen.classList.remove('active');
        elements.gameScreen.classList.add('active');
        updateUI();
    }
}

// Сохранение игры
function saveGame() {
    localStorage.setItem('kopatel_game', JSON.stringify(gameState));
}

// Загрузка игры
function loadGame() {
    const saved = localStorage.getItem('kopatel_game');
    if (saved) {
        const parsed = JSON.parse(saved);
        Object.assign(gameState, parsed);
    }
}

// Обновление интерфейса
function updateUI() {
    elements.coins.textContent = gameState.player.coins;
    elements.gems.textContent = gameState.player.gems;
    elements.playerLevel.textContent = gameState.player.level;
    elements.clickPower.textContent = gameState.player.clickPower;
    
    // Обновление текущей руды
    const ore = gameState.currentOre;
    elements.currentOre.textContent = ore.name;
    
    // Обновление прогресс-бара
    const progress = (ore.progress / ore.required) * 100;
    elements.oreProgressFill.style.width = `${Math.min(progress, 100)}%`;
    elements.oreProgressText.textContent = `${ore.progress} / ${ore.required}`;
    
    // Обновление отображения руды
    const oreDisplay = elements.oreDisplay.querySelector('.ore-icon');
    const oreName = elements.oreDisplay.querySelector('.ore-name');
    oreDisplay.textContent = ore.icon;
    oreName.textContent = ore.name;
    
    // Обновление инвентаря
    updateInventory();
    
    // Сохранение игры
    saveGame();
}

// Обновление инвентаря
function updateInventory() {
    elements.inventoryGrid.innerHTML = '';
    
    const inventoryItems = Object.entries(gameState.inventory);
    
    if (inventoryItems.length === 0) {
        elements.inventoryGrid.innerHTML = '<div style="color: rgba(255,255,255,0.5); font-size: 12px;">Инвентарь пуст</div>';
        return;
    }
    
    inventoryItems.forEach(([oreType, count]) => {
        const ore = gameState.ores[oreType];
        if (ore) {
            const item = document.createElement('div');
            item.className = 'inventory-item';
            item.innerHTML = `
                <span class="inventory-item-icon">${ore.icon}</span>
                <span class="inventory-item-name">${ore.name}</span>
                <span class="inventory-item-count">${count}</span>
            `;
            item.onclick = () => showOreInfo(oreType);
            elements.inventoryGrid.appendChild(item);
        }
    });
}

// Показ информации о руде
function showOreInfo(oreType) {
    const ore = gameState.ores[oreType];
    const count = gameState.inventory[oreType] || 0;
    const shopItem = gameState.shopItems.find(item => item.id === oreType);
    
    showModal(ore.name, `
        <div style="text-align: center;">
            <div style="font-size: 60px; margin: 20px 0;">${ore.icon}</div>
            <p style="margin-bottom: 10px;">В наличии: ${count} шт.</p>
            <p style="margin-bottom: 10px;">Цена продажи: ${shopItem.sellPrice} монет</p>
            <button class="btn-sell" onclick="sellOre('${oreType}', 1)" style="margin: 5px;">Продать 1</button>
            <button class="btn-sell" onclick="sellOre('${oreType}', 'all')" style="margin: 5px;">Продать все</button>
        </div>
    `);
}

// Продажа руды
function sellOre(oreType, amount) {
    const count = gameState.inventory[oreType] || 0;
    const shopItem = gameState.shopItems.find(item => item.id === oreType);
    
    if (!count || !shopItem) {
        showNotification('Нечего продавать!', 'error');
        return;
    }
    
    const sellAmount = amount === 'all' ? count : Math.min(amount, count);
    const totalPrice = sellAmount * shopItem.sellPrice;
    
    gameState.inventory[oreType] -= sellAmount;
    gameState.player.coins += totalPrice;
    
    if (gameState.inventory[oreType] <= 0) {
        delete gameState.inventory[oreType];
    }
    
    showNotification(`Продано ${sellAmount} шт. за ${totalPrice} монет!`);
    closeModal();
    updateUI();
}

// Добыча руды
function mineOre() {
    const clickPower = gameState.player.clickPower;
    gameState.currentOre.progress += clickPower;
    gameState.player.totalClicks++;
    
    // Анимация частиц
    createParticles();
    
    // Анимация нажатия
    elements.mineButton.style.transform = 'scale(0.9)';
    setTimeout(() => {
        elements.mineButton.style.transform = '';
    }, 100);
    
    // Проверка на завершение добычи
    if (gameState.currentOre.progress >= gameState.currentOre.required) {
        completeOre();
    }
    
    updateUI();
}

// Завершение добычи руды
function completeOre() {
    const oreType = gameState.currentOre.type;
    const ore = gameState.ores[oreType];
    
    // Добавление руды в инвентарь
    if (!gameState.inventory[oreType]) {
        gameState.inventory[oreType] = 0;
    }
    gameState.inventory[oreType]++;
    gameState.player.totalOres++;
    
    // Начисление опыта
    gameState.player.experience += ore.expReward;
    
    // Проверка повышения уровня
    checkLevelUp();
    
    // Сброс прогресса
    gameState.currentOre.progress = 0;
    
    // Выбор следующей руды
    selectNextOre();
    
    showNotification(`Добыта ${ore.name}! +${ore.expReward} опыта`);
}

// Выбор следующей руды
function selectNextOre() {
    const availableOres = Object.entries(gameState.ores)
        .filter(([type, ore]) => ore.unlockLevel <= gameState.player.level)
        .map(([type, ore]) => ({ type, ...ore }));
    
    if (availableOres.length === 0) {
        return;
    }
    
    // Случайный выбор руды с учетом уровня
    const randomOre = availableOres[Math.floor(Math.random() * availableOres.length)];
    
    gameState.currentOre = {
        type: randomOre.type,
        name: randomOre.name,
        icon: randomOre.icon,
        progress: 0,
        required: randomOre.required,
        value: randomOre.value,
        expReward: randomOre.expReward
    };
}

// Проверка повышения уровня
function checkLevelUp() {
    const expNeeded = gameState.player.level * 100;
    
    while (gameState.player.experience >= expNeeded) {
        gameState.player.experience -= expNeeded;
        gameState.player.level++;
        gameState.player.gems += 5;
        showNotification(`Уровень повышен! Теперь вы ${gameState.player.level} уровня!`);
    }
}

// Создание частиц
function createParticles() {
    const particlesContainer = elements.particles;
    const buttonRect = elements.mineButton.getBoundingClientRect();
    const centerX = buttonRect.left + buttonRect.width / 2;
    const centerY = buttonRect.top + buttonRect.height / 2;
    
    for (let i = 0; i < 10; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        const angle = Math.random() * Math.PI * 2;
        const distance = 50 + Math.random() * 100;
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;
        
        particle.style.left = `${centerX}px`;
        particle.style.top = `${centerY}px`;
        particle.style.setProperty('--x', `${x}px`);
        particle.style.setProperty('--y', `${y}px`);
        
        const colors = ['#f39c12', '#e74c3c', '#f1c40f', '#e67e22', '#d35400'];
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];
        
        particlesContainer.appendChild(particle);
        
        setTimeout(() => {
            particle.remove();
        }, 1000);
    }
}

// Показ модального окна
function showModal(title, content) {
    elements.modalTitle.textContent = title;
    elements.modalContent.innerHTML = content;
    elements.modalOverlay.classList.add('active');
}

// Закрытие модального окна
function closeModal() {
    elements.modalOverlay.classList.remove('active');
}

// Показ уведомления
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    if (type === 'error') {
        notification.style.background = '#e74c3c';
    }
    
    elements.notifications.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Показ магазина
function showShop() {
    const shopContent = gameState.shopItems.map(item => {
        const count = gameState.inventory[item.id] || 0;
        return `
            <div class="shop-item" style="display: flex; align-items: center; justify-content: space-between; padding: 10px; margin: 5px 0; background: rgba(255,255,255,0.1); border-radius: 10px;">
                <div style="display: flex; align-items: center; gap: 10px;">
                    <span style="font-size: 30px;">${item.icon}</span>
                    <div>
                        <div style="font-weight: bold;">${item.name}</div>
                        <div style="font-size: 12px; color: rgba(255,255,255,0.7);">В наличии: ${count}</div>
                    </div>
                </div>
                <div style="text-align: right;">
                    <div style="font-size: 12px; color: rgba(255,255,255,0.7);">Продажа: ${item.sellPrice} монет</div>
                    <button onclick="sellOre('${item.id}', 'all')" style="margin-top: 5px; padding: 5px 10px; background: #27ae60; border: none; border-radius: 5px; color: white; cursor: pointer;">
                        Продать
                    </button>
                </div>
            </div>
        `;
    }).join('');
    
    showModal('Магазин', shopContent);
}

// Показ улучшений
function showUpgrades() {
    const currentPickaxe = gameState.upgrades.pickaxe.levels[gameState.player.pickaxeLevel - 1];
    const nextPickaxe = gameState.upgrades.pickaxe.levels[gameState.player.pickaxeLevel];
    
    const upgradesContent = `
        <div style="text-align: center;">
            <div style="font-size: 60px; margin: 20px 0;">${currentPickaxe.icon}</div>
            <h3>${currentPickaxe.name}</h3>
            <p style="margin: 10px 0;">Сила: ${currentPickaxe.power}</p>
            
            ${nextPickaxe ? `
                <div style="margin: 20px 0; padding: 15px; background: rgba(255,255,255,0.1); border-radius: 10px;">
                    <h4>Следующее улучшение:</h4>
                    <p>${nextPickaxe.name}</p>
                    <p>Сила: ${nextPickaxe.power}</p>
                    <p>Стоимость: ${nextPickaxe.cost} монет</p>
                    <button onclick="upgradePickaxe()" style="margin-top: 10px; padding: 10px 20px; background: #f39c12; border: none; border-radius: 5px; color: white; cursor: pointer; font-weight: bold;">
                        Улучшить за ${nextPickaxe.cost} монет
                    </button>
                </div>
            ` : '<p style="margin: 20px 0; color: #f39c12;">Максимальный уровень!</p>'}
            
            <div style="margin-top: 20px;">
                <h4>Статистика:</h4>
                <p>Всего кликов: ${gameState.player.totalClicks}</p>
                <p>Всего добыто руды: ${gameState.player.totalOres}</p>
                <p>Уровень: ${gameState.player.level}</p>
            </div>
        </div>
    `;
    
    showModal('Улучшения', upgradesContent);
}

// Улучшение кирки
function upgradePickaxe() {
    const currentPickaxe = gameState.upgrades.pickaxe.levels[gameState.player.pickaxeLevel - 1];
    const nextPickaxe = gameState.upgrades.pickaxe.levels[gameState.player.pickaxeLevel];
    
    if (!nextPickaxe) {
        showNotification('Максимальный уровень кирки!', 'error');
        return;
    }
    
    if (gameState.player.coins < nextPickaxe.cost) {
        showNotification('Недостаточно монет!', 'error');
        return;
    }
    
    gameState.player.coins -= nextPickaxe.cost;
    gameState.player.pickaxeLevel++;
    gameState.player.clickPower = nextPickaxe.power;
    
    showNotification(`Кирка улучшена до: ${nextPickaxe.name}!`);
    closeModal();
    updateUI();
}

// Показ достижений
function showAchievements() {
    const achievementsContent = `
        <div style="text-align: center;">
            <h3>Достижения</h3>
            <div style="margin: 20px 0;">
                <div style="padding: 10px; margin: 5px 0; background: ${gameState.player.totalClicks >= 100 ? 'rgba(39,174,96,0.3)' : 'rgba(255,255,255,0.1)'}; border-radius: 10px;">
                    <span style="font-size: 30px;">🔨</span>
                    <p>Первые 100 кликов</p>
                    <p style="font-size: 12px;">${gameState.player.totalClicks >= 100 ? 'Выполнено!' : 'Не выполнено'}</p>
                </div>
                <div style="padding: 10px; margin: 5px 0; background: ${gameState.player.totalOres >= 10 ? 'rgba(39,174,96,0.3)' : 'rgba(255,255,255,0.1)'}; border-radius: 10px;">
                    <span style="font-size: 30px;">💎</span>
                    <p>Добыть 10 руды</p>
                    <p style="font-size: 12px;">${gameState.player.totalOres >= 10 ? 'Выполнено!' : 'Не выполнено'}</p>
                </div>
                <div style="padding: 10px; margin: 5px 0; background: ${gameState.player.level >= 5 ? 'rgba(39,174,96,0.3)' : 'rgba(255,255,255,0.1)'}; border-radius: 10px;">
                    <span style="font-size: 30px;">⭐</span>
                    <p>Достичь 5 уровня</p>
                    <p style="font-size: 12px;">${gameState.player.level >= 5 ? 'Выполнено!' : 'Не выполнено'}</p>
                </div>
            </div>
        </div>
    `;
    
    showModal('Достижения', achievementsContent);
}

// Обработчики событий
elements.mineButton.addEventListener('click', mineOre);
elements.modalClose.addEventListener('click', closeModal);
elements.modalOverlay.addEventListener('click', (e) => {
    if (e.target === elements.modalOverlay) {
        closeModal();
    }
});

// Обработчики навигации
document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const tab = btn.dataset.tab;
        switch(tab) {
            case 'mine':
                closeModal();
                break;
            case 'shop':
                showShop();
                break;
            case 'upgrades':
                showUpgrades(
