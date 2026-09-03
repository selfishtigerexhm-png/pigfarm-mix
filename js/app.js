let pigData = [];

document.addEventListener('DOMContentLoaded', () => {
    // 載入 CSV 檔案
    Papa.parse('data/pigfarmmix.CSV.csv', {
        download: true,
        header: true,
        skipEmptyLines: true,
        complete: function(results) {
            pigData = results.data.map(row => ({
                id: row['ng-binding'] || '',
                name: row['ng-binding 2'] || '',
                img: row['ng-binding src'] || '',
                color: row['ng-binding 7'] || '',
                picky: row['ng-scope'] || '什麼都吃',
                feedCount: row['ng-binding 3'] || '',
                grazing: row['ng-binding 4'] || '',
                feedInterval: row['ng-binding 5'] || '',
                growthTime: row['ng-binding 6'] || '',
                price: row['ng-binding 10'] || ''
            }));

            renderGrid(pigData);
        }
    });

    // 綁定事件
    document.getElementById('searchBtn').addEventListener('click', filterPigs);
    document.getElementById('resetBtn').addEventListener('click', () => {
        document.getElementById('filterForm').reset();
        renderGrid(pigData);
    });
});

function filterPigs() {
    const keyword = document.getElementById('filterKeyword').value.trim().toLowerCase();
    const selectedGrades = Array.from(document.querySelectorAll('input[name="grade"]:checked')).map(e => e.value);
    const hunt = document.getElementById('filterHunt').value.trim().toLowerCase();
    const stars = document.getElementById('filterStars').value;
    const grazing = document.querySelector('input[name="grazing"]:checked').value;
    const picky = document.querySelector('input[name="picky"]:checked').value;
    const feedHint = document.querySelector('input[name="feedHint"]:checked').value;

    const filtered = pigData.filter(pig => {
        // 1. 關鍵字 (編號或名稱)
        if (keyword && !pig.name.toLowerCase().includes(keyword) && !pig.id.includes(keyword)) {
            return false;
        }

        // 2. 放牧條件 (✔ / ✖)
        if (grazing === 'yes' && !pig.grazing.includes('要')) return false;
        if (grazing === 'no' && pig.grazing.includes('要')) return false;

        // 3. 挑食條件
        if (picky !== 'all' && pig.picky !== picky) return false;

        return true;
    });

    renderGrid(filtered);
}

function renderGrid(data) {
    const grid = document.getElementById('pigGrid');
    const status = document.getElementById('status');
    grid.innerHTML = '';
    
    status.textContent = `符合條件的豬隻共 ${data.length} 隻`;

    data.forEach(pig => {
        const card = document.createElement('div');
        card.className = 'pig-card';
        card.innerHTML = `
            <img src="${pig.img}" alt="${pig.name}" onerror="this.src='https://via.placeholder.com/100?text=無圖片'">
            <div class="pig-title">No.${pig.id} ${pig.name}</div>
            <div class="pig-details">
                <p><b>顏色/系統:</b> ${pig.color}</p>
                <p><b>挑食程度:</b> ${pig.picky}</p>
                <p><b>餵食次數:</b> ${pig.feedCount}</p>
                <p><b>放牧需求:</b> ${pig.grazing}</p>
                <p><b>售價:</b> ${pig.price}</p>
            </div>
        `;
        grid.appendChild(card);
    });
}
