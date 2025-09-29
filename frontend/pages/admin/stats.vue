<template>
  <div>
    <h2>Статистика</h2>
    <p>Здесь будет статистика системы</p>
    
    <div style="margin: 2rem 0;">
      <h3>Общая статистика</h3>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
        <div style="background: #e3f2fd; padding: 1rem; border-radius: 8px; text-align: center;">
          <h4>Игры за неделю</h4>
          <div style="font-size: 2rem; font-weight: bold; color: #1976D2;">245</div>
        </div>
        <div style="background: #e8f5e8; padding: 1rem; border-radius: 8px; text-align: center;">
          <h4>Призы выдано</h4>
          <div style="font-size: 2rem; font-weight: bold; color: #4CAF50;">89</div>
        </div>
        <div style="background: #fff3e0; padding: 1rem; border-radius: 8px; text-align: center;">
          <h4>Новые пользователи</h4>
          <div style="font-size: 2rem; font-weight: bold; color: #FF9800;">23</div>
        </div>
        <div style="background: #fce4ec; padding: 1rem; border-radius: 8px; text-align: center;">
          <h4>Конверсия</h4>
          <div style="font-size: 2rem; font-weight: bold; color: #E91E63;">36.3%</div>
        </div>
      </div>
    </div>
    
    <div style="margin: 2rem 0;">
      <h3>Детальная статистика</h3>
      <div style="border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
        <div style="background: #f5f5f5; padding: 1rem; font-weight: bold; border-bottom: 1px solid #ddd;">
          <div style="display: grid; grid-template-columns: 1fr 1fr 1fr 1fr 1fr; gap: 1rem;">
            <div>Дата</div>
            <div>Игры</div>
            <div>Призы</div>
            <div>Пользователи</div>
            <div>Конверсия</div>
          </div>
        </div>
        <div style="padding: 1rem; border-bottom: 1px solid #ddd;">
          <div style="display: grid; grid-template-columns: 1fr 1fr 1fr 1fr 1fr; gap: 1rem;">
            <div>2024-01-15</div>
            <div>45</div>
            <div>12</div>
            <div>8</div>
            <div>26.7%</div>
          </div>
        </div>
        <div style="padding: 1rem; border-bottom: 1px solid #ddd;">
          <div style="display: grid; grid-template-columns: 1fr 1fr 1fr 1fr 1fr; gap: 1rem;">
            <div>2024-01-14</div>
            <div>38</div>
            <div>9</div>
            <div>5</div>
            <div>23.7%</div>
          </div>
        </div>
        <div style="padding: 1rem;">
          <div style="display: grid; grid-template-columns: 1fr 1fr 1fr 1fr 1fr; gap: 1rem;">
            <div>2024-01-13</div>
            <div>52</div>
            <div>15</div>
            <div>12</div>
            <div>28.8%</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Статистика
</script>
