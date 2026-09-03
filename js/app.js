let allPigs = [];

// 初始化：載入並解析 CSV 檔案
document.addEventListener('DOMContentLoaded', () => {
    Papa.parse('data/pigfarmmix.CSV.csv', {
        download: true,
        header: true,
        complete: function(results) {
            // 解析並對應 CSV 中的欄位
            allPigs = results.data
                .filter(row => row['ng-binding'] && row['ng-binding 2']) // 過濾空行
                .map(row => ({
                    id: parseInt(row['ng-binding']),
                    name: row['ng-binding 2'],
                    link: row['ng-binding href'],
                    img: row['ng-binding src'],
                    food: row['ng-scope'] || '特別指定/挑食',
                    feedCount: row['ng-binding 3'],
                    grazing: row['ng-binding 4'],
                    feedInterval: row['ng-binding 5'],
                    growthTime: row['ng-binding 6'],
                    color: row['ng-binding 7'],
                    smallBadge: row['ng-binding 8'],
                    largeBadge: row['ng-binding 9'],
                    price: row['ng-binding 10'],
                    priceNum: parseInt((row['ng-binding 10'] || '0').replace(/[^0-9]/g, '')) || 0,
                    chance: row['ng-binding 11'] || '無/特殊'
                }));

            renderPigs(allPigs);
            setupEventListeners();
        }
    });
});

// 繪製豬隻卡片
function renderPigs(pigs) {
    const grid = document.getElementById('pigGrid');
    const status = document.getElementById('status');
    
    grid.innerHTML = '';
    status.textContent = `共找到 ${pigs.length} 隻豬隻資料`;

    pigs.forEach(pig => {
        const card = document.createElement('div');
        card.className = 'pig-card';
        card.innerHTML = `
            <img class="pig-img" src="${pig.img}" alt="${pig.name}" onerror="this.src='https://via.placeholder.com/120?text=No+Image'">
            <div class="pig-title">No.${pig.id} ${pig.name}</div>
            <div class="pig-info">
                <div><span>顏色/圖鑑:</span> <b>${pig.color}</b></div>
                <div><span>食物類型:</span> <span class="badge">${pig.food}</span></div>
                <div><span>最少餵食:</span> <b>${pig.feedCount} 次</b></div>
                <div><span>餵食間隔:</span> <b>${pig.feedInterval}</b></div>
                <div><span>成長時間:</span> <b>${pig.growthTime}</b></div>
                <div><span>放牧需求:</span> <b>${pig.grazing}</b></div>
                <div><span>小豬章:</span> <b>${pig.smallBadge}</b></div>
                <div><span>大豬章:</span> <b>${pig.largeBadge}</b></div>
                <div><span>出售價格:</span> <b style="color: #2e7d32">${pig.price}</b></div>
                <div><span>出現機率:</span> <b>${pig.chance}</b></div>
            </div>
        `;
        grid.appendChild(card);
    });
}

// 事件監聽（搜尋與排序）
function setupEventListeners() {
    const searchInput = document.getElementById('searchInput');
    const foodFilter = document.getElementById('foodFilter');
    const sortSelect = document.getElementById('sortSelect');

    function filterData() {
        let filtered = allPigs.filter(pig => {
            const matchesSearch = pig.name.includes(searchInput.value) || 
                                  pig.color.includes(searchInput.value) ||
                                  pig.id.toString() === searchInput.value;
            
            let matchesFood = true;
            if (foodFilter.value === '不挑食') {
                matchesFood = pig.food === '不挑食';
            } else if (foodFilter.value === '挑食') {
                matchesFood = pig.food !== '不挑食';
            }

            return matchesSearch && matchesFood;
        });

        // 排序
        if (sortSelect.value === 'id-asc') {
            filtered.sort((a, b) => a.id - b.id);
        } else if (sortSelect.value === 'id-desc') {
            filtered.sort((a, b) => b.id - a.id);
        } else if (sortSelect.value === 'price-desc') {
            filtered.sort((a, b) => b.priceNum - a.priceNum);
        }

        renderPigs(filtered);
    }

    searchInput.addEventListener('input', filterData);
    foodFilter.addEventListener('change', filterData);
    sortSelect.addEventListener('change', filterData);
}
