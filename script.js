document.addEventListener('DOMContentLoaded', function() {
    // サイトの初期化
    initializeTravelSite();
});

function initializeTravelSite() {
    // 各種機能の初期化
    initNavigation();
    initMobileMenu();
    initCopyButtons();
    initSmoothScrolling();
    initCountdown();
    initTableInteractions();
    initExternalLinks();
    initProgressIndicator();
    initTooltips();
    initMobileOptimizations();
}

// ナビゲーション機能
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.day-section, .info-section');

    // ナビゲーションクリックイベント
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // アクティブ状態の更新
            navLinks.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
            
            // スムーズスクロール
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // スクロール時のナビゲーション更新
    let ticking = false;
    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(updateActiveNavigation);
            ticking = true;
        }
    });

    function updateActiveNavigation() {
        let currentSection = '';
        const scrollPosition = window.scrollY + 200;

        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            const elementTop = rect.top + window.scrollY;
            
            if (scrollPosition >= elementTop) {
                currentSection = section.id;
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + currentSection) {
                link.classList.add('active');
            }
        });

        ticking = false;
    }
}

// モバイルメニュー機能
function initMobileMenu() {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const sidebar = document.getElementById('sidebar-nav');
    const mainContent = document.querySelector('.main-content');

    if (!menuBtn || !sidebar) return;

    const toggleMenu = (forceClose = false) => {
        const isOpen = sidebar.classList.contains('mobile-open');
        if (forceClose || isOpen) {
            sidebar.classList.remove('mobile-open');
            menuBtn.classList.remove('active');
            menuBtn.setAttribute('aria-expanded', 'false');
            mainContent.classList.remove('menu-open');
        } else {
            sidebar.classList.add('mobile-open');
            menuBtn.classList.add('active');
            menuBtn.setAttribute('aria-expanded', 'true');
            mainContent.classList.add('menu-open');
        }
    };

    menuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMenu();
    });

    // サイドバー外クリックで閉じる
    document.addEventListener('click', (e) => {
        if (sidebar.classList.contains('mobile-open') && !sidebar.contains(e.target)) {
            toggleMenu(true);
        }
    });

    // リンククリック時にメニューを閉じる
    sidebar.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            toggleMenu(true);
        });
    });
    
    // Escapeキーで閉じる
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && sidebar.classList.contains('mobile-open')) {
            toggleMenu(true);
        }
    });

    // 画面リサイズ時の処理
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if (window.innerWidth > 768) {
                toggleMenu(true);
            }
        }, 250);
    });
    
    // 初期状態でaria-expandedを設定
    menuBtn.setAttribute('aria-expanded', 'false');
}

// コピーボタン機能
function initCopyButtons() {
    const copyButtons = document.querySelectorAll('.copy-btn');
    
    copyButtons.forEach(button => {
        button.addEventListener('click', async function() {
            const textToCopy = this.getAttribute('data-copy');
            
            try {
                await navigator.clipboard.writeText(textToCopy);
                
                // 成功フィードバック
                const originalHTML = this.innerHTML;
                this.innerHTML = '<i class="fas fa-check"></i>';
                this.classList.add('copied');
                
                setTimeout(() => {
                    this.innerHTML = originalHTML;
                    this.classList.remove('copied');
                }, 2000);
                
                // 成功通知
                showNotification('住所をコピーしました！', 'success');
                
            } catch (err) {
                console.error('コピーに失敗しました:', err);
                showNotification('コピーに失敗しました', 'error');
            }
        });
    });
}

// スムーズスクロール
function initSmoothScrolling() {
    const scrollLinks = document.querySelectorAll('a[href^="#"]');
    
    scrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.main-header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// カウントダウン機能
function initCountdown() {
    const tripDate = new Date('2025-08-29T06:00:00');
    const headerElement = document.querySelector('.trip-dates');
    
    function updateCountdown() {
        const now = new Date();
        const timeDiff = tripDate - now;
        
        if (timeDiff > 0) {
            const days = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            
            if (!headerElement.textContent.includes('あと')) {
                if (days === 0) {
                    headerElement.textContent += ` - 今日出発！`;
                } else if (days === 1) {
                    headerElement.textContent += ` - 明日出発！`;
                } else {
                    headerElement.textContent += ` - あと${days}日`;
                }
            }
        } else if (timeDiff > -86400000) { // 24時間以内
            if (!headerElement.textContent.includes('旅行中')) {
                headerElement.textContent = headerElement.textContent.replace(/- あと\d+日.*/, '- 旅行中！');
            }
        }
    }
    
    updateCountdown();
    setInterval(updateCountdown, 60000); // 1分ごとに更新
}

// テーブルインタラクション（新幹線カード対応）
function initTableInteractions() {
    // 従来のテーブル
    const tables = document.querySelectorAll('table');
    
    tables.forEach(table => {
        const rows = table.querySelectorAll('tbody tr');
        
        rows.forEach((row, index) => {
            row.addEventListener('click', function() {
                // 選択状態のトグル
                this.classList.toggle('selected');
                
                // 電車時刻表の場合、選択された時刻をハイライト
                if (table.classList.contains('train-schedule')) {
                    rows.forEach(r => r.classList.remove('highlighted'));
                    if (this.classList.contains('selected')) {
                        this.classList.add('highlighted');
                        
                        const timeCell = this.querySelector('.time');
                        if (timeCell) {
                            showNotification(`${timeCell.textContent}発の電車を選択しました`, 'info');
                        }
                    }
                }
            });
            
            // ホバー効果の強化
            row.addEventListener('mouseenter', function() {
                this.style.transform = 'scale(1.01)';
                this.style.transition = 'transform 0.2s ease';
            });
            
            row.addEventListener('mouseleave', function() {
                this.style.transform = 'scale(1)';
            });
        });
    });
    
    // 新しい新幹線カード（参考表示のみ）
    const trainCards = document.querySelectorAll('.train-card');
    
    trainCards.forEach((card, index) => {
        // 最初のカード（6:24発）をデフォルトで選択状態に
        if (index === 0) {
            card.classList.add('selected');
        }
        
        card.addEventListener('click', function() {
            // 他のカードの選択を解除
            trainCards.forEach(c => c.classList.remove('selected'));
            
            // このカードを選択
            this.classList.add('selected');
        });
    });
    
    // テーブル用のCSS追加
    addTableStyles();
}

// 外部リンクの処理
function initExternalLinks() {
    const externalLinks = document.querySelectorAll('a[href^="http"]');
    
    externalLinks.forEach(link => {
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
        
        // クリック時の確認（Discord以外）
        if (!link.href.includes('discord')) {
            link.addEventListener('click', function(e) {
                const confirmed = confirm('外部サイトを開きますか？');
                if (!confirmed) {
                    e.preventDefault();
                }
            });
        }
    });
}

// プログレス インジケーター
function initProgressIndicator() {
    const progressBar = document.createElement('div');
    progressBar.className = 'progress-indicator';
    progressBar.innerHTML = '<div class="progress-bar"></div>';
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', updateProgressBar);
    
    function updateProgressBar() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        
        const progressBarElement = document.querySelector('.progress-bar');
        if (progressBarElement) {
            progressBarElement.style.width = scrollPercent + '%';
        }
    }
    
    // プログレスバーのスタイル
    addProgressBarStyles();
}

// ツールチップ機能
function initTooltips() {
    const elementsWithTooltips = [
        { selector: '.status-badge.confirmed', text: '詳細が確定しています' },
        { selector: '.status-badge.pending', text: '詳細は未定です' },
        { selector: '.important-notice', text: '重要な注意事項です' },
        { selector: '.warning-notice', text: '注意が必要な項目です' }
    ];
    
    elementsWithTooltips.forEach(item => {
        const elements = document.querySelectorAll(item.selector);
        elements.forEach(element => {
            element.setAttribute('title', item.text);
            element.setAttribute('data-tooltip', item.text);
        });
    });
    
    // カスタムツールチップ
    document.addEventListener('mouseover', showTooltip);
    document.addEventListener('mouseout', hideTooltip);
}

// モバイル最適化
function initMobileOptimizations() {
    // タッチデバイスの検出
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    if (isTouchDevice) {
        document.body.classList.add('touch-device');
        
        // タッチ用のインタラクション改善
        const cards = document.querySelectorAll('.info-card, .hotel-card, .luggage-option');
        cards.forEach(card => {
            card.addEventListener('touchstart', function() {
                this.classList.add('touch-active');
            });
            
            card.addEventListener('touchend', function() {
                setTimeout(() => {
                    this.classList.remove('touch-active');
                }, 150);
            });
        });
    }
    
    // レスポンシブ テーブル
    const tables = document.querySelectorAll('table');
    tables.forEach(table => {
        if (window.innerWidth <= 768) {
            makeTableResponsive(table);
        }
    });
    
    window.addEventListener('resize', () => {
        tables.forEach(table => {
            if (window.innerWidth <= 768) {
                makeTableResponsive(table);
            }
        });
    });
}

// 通知システム
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // アニメーション
    setTimeout(() => notification.classList.add('show'), 100);
    
    // 自動削除
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => document.body.removeChild(notification), 300);
    }, 3000);
}

function getNotificationIcon(type) {
    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        info: 'info-circle',
        warning: 'exclamation-triangle'
    };
    return icons[type] || 'info-circle';
}

// ツールチップ表示/非表示
function showTooltip(e) {
    const element = e.target.closest('[data-tooltip]');
    if (!element) return;
    
    const tooltip = document.createElement('div');
    tooltip.className = 'custom-tooltip';
    tooltip.textContent = element.getAttribute('data-tooltip');
    document.body.appendChild(tooltip);
    
    const rect = element.getBoundingClientRect();
    tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
    tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
    
    setTimeout(() => tooltip.classList.add('show'), 100);
}

function hideTooltip() {
    const tooltip = document.querySelector('.custom-tooltip');
    if (tooltip) {
        tooltip.classList.remove('show');
        setTimeout(() => document.body.removeChild(tooltip), 200);
    }
}

// レスポンシブテーブル化
function makeTableResponsive(table) {
    const headers = Array.from(table.querySelectorAll('th')).map(th => th.textContent);
    const rows = table.querySelectorAll('tbody tr');
    
    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        cells.forEach((cell, index) => {
            cell.setAttribute('data-label', headers[index]);
        });
    });
}

// スタイル追加関数
function addTableStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .train-schedule tbody tr.selected {
            background: rgba(102, 126, 234, 0.1);
            border-left: 4px solid #667eea;
        }
        
        .train-schedule tbody tr.highlighted {
            background: rgba(102, 126, 234, 0.2);
            box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
        }
        
        .touch-device .info-card.touch-active,
        .touch-device .hotel-card.touch-active,
        .touch-device .luggage-option.touch-active {
            transform: scale(0.98);
            transition: transform 0.1s ease;
        }
    `;
    document.head.appendChild(style);
}

function addProgressBarStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .progress-indicator {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 3px;
            background: rgba(255, 255, 255, 0.3);
            z-index: 1000;
        }
        
        .progress-bar {
            height: 100%;
            background: linear-gradient(90deg, #667eea, #764ba2);
            width: 0%;
            transition: width 0.3s ease;
        }
        
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            border-radius: 8px;
            padding: 1rem;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 1001;
            transform: translateX(400px);
            transition: transform 0.3s ease;
            max-width: 300px;
        }
        
        .notification.show {
            transform: translateX(0);
        }
        
        .notification.success {
            border-left: 4px solid #28a745;
        }
        
        .notification.error {
            border-left: 4px solid #dc3545;
        }
        
        .notification.info {
            border-left: 4px solid #007bff;
        }
        
        .notification.warning {
            border-left: 4px solid #ffc107;
        }
        
        .notification-content {
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .custom-tooltip {
            position: absolute;
            background: #333;
            color: white;
            padding: 0.5rem;
            border-radius: 4px;
            font-size: 0.8rem;
            z-index: 1002;
            opacity: 0;
            transition: opacity 0.2s ease;
            pointer-events: none;
        }
        
        .custom-tooltip.show {
            opacity: 1;
        }
        
        .custom-tooltip::after {
            content: '';
            position: absolute;
            top: 100%;
            left: 50%;
            transform: translateX(-50%);
            border: 5px solid transparent;
            border-top-color: #333;
        }
        
        @media (max-width: 768px) {
            .pricing-table th,
            .train-schedule th {
                display: none;
            }
            
            .pricing-table td,
            .train-schedule td {
                display: block;
                text-align: right;
                border: none;
                padding: 0.5rem;
                position: relative;
            }
            
            .pricing-table td::before,
            .train-schedule td::before {
                content: attr(data-label) ': ';
                font-weight: bold;
                float: left;
                color: #667eea;
            }
            
            .notification {
                right: 10px;
                left: 10px;
                max-width: none;
                transform: translateY(-100px);
            }
            
            .notification.show {
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(style);
}

// 印刷時の最適化
window.addEventListener('beforeprint', function() {
    // 印刷時にサイドバーを非表示
    document.querySelector('.sidebar-nav').style.display = 'none';
    document.querySelector('.main-content').style.gridTemplateColumns = '1fr';
});

window.addEventListener('afterprint', function() {
    // 印刷後に表示を戻す
    document.querySelector('.sidebar-nav').style.display = 'block';
    document.querySelector('.main-content').style.gridTemplateColumns = '280px 1fr';
});

// パフォーマンス最適化
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // サービスワーカーは実装しないが、将来的な拡張のための準備
        console.log('旅行計画サイトが読み込まれました');
    });
}