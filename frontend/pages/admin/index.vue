<template>
  <div>
    <h2>Админ панель</h2>
    <p>Добро пожаловать в админ панель Brand Games</p>
    
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin: 2rem 0;">
      <div style="background: #1976D2; color: white; padding: 1rem; border-radius: 8px; text-align: center;">
        <h3>🎮</h3>
        <div style="font-size: 2rem; font-weight: bold;">12</div>
        <div>Активных игр</div>
      </div>
      
      <div style="background: #4CAF50; color: white; padding: 1rem; border-radius: 8px; text-align: center;">
        <h3>🎁</h3>
        <div style="font-size: 2rem; font-weight: bold;">156</div>
        <div>Призов выдано</div>
      </div>
      
      <div style="background: #2196F3; color: white; padding: 1rem; border-radius: 8px; text-align: center;">
        <h3>👥</h3>
        <div style="font-size: 2rem; font-weight: bold;">2,847</div>
        <div>Пользователей</div>
      </div>
      
      <div style="background: #FF9800; color: white; padding: 1rem; border-radius: 8px; text-align: center;">
        <h3>📊</h3>
        <div style="font-size: 2rem; font-weight: bold;">98.5%</div>
        <div>Успешность</div>
      </div>
    </div>
    
    <div style="margin: 2rem 0;">
      <h3>Быстрые действия</h3>
      <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
        <a href="/admin/games" style="background: #1976D2; color: white; padding: 0.5rem 1rem; text-decoration: none; border-radius: 4px;">🎮 Игры</a>
        <a href="/admin/prizes" style="background: #4CAF50; color: white; padding: 0.5rem 1rem; text-decoration: none; border-radius: 4px;">🎁 Призы</a>
        <a href="/admin/users" style="background: #2196F3; color: white; padding: 0.5rem 1rem; text-decoration: none; border-radius: 4px;">👥 Пользователи</a>
        <a href="/admin/stats" style="background: #FF9800; color: white; padding: 0.5rem 1rem; text-decoration: none; border-radius: 4px;">📊 Статистика</a>
      </div>
    </div>
  </div>
</template>

<script setup>
// Админ панель
</script>
