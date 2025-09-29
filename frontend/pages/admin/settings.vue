<template>
  <div>
    <h2>Настройки системы</h2>
    <p>Здесь будут настройки системы</p>
    
    <div style="margin: 2rem 0;">
      <h3>Общие настройки</h3>
      <div style="background: #f9f9f9; padding: 1.5rem; border-radius: 8px; border: 1px solid #ddd;">
        <div style="margin-bottom: 1rem;">
          <label style="display: block; margin-bottom: 0.5rem; font-weight: bold;">Название сайта</label>
          <input type="text" value="Brand Games" style="width: 100%; padding: 0.5rem; border: 1px solid #ddd; border-radius: 4px;">
        </div>
        
        <div style="margin-bottom: 1rem;">
          <label style="display: block; margin-bottom: 0.5rem; font-weight: bold;">Описание сайта</label>
          <textarea style="width: 100%; padding: 0.5rem; border: 1px solid #ddd; border-radius: 4px; height: 80px;">Интерактивные игры с призами и брендингом</textarea>
        </div>
        
        <div style="margin-bottom: 1rem;">
          <label style="display: block; margin-bottom: 0.5rem; font-weight: bold;">Контактный email</label>
          <input type="email" value="admin@brandgames.ru" style="width: 100%; padding: 0.5rem; border: 1px solid #ddd; border-radius: 4px;">
        </div>
        
        <div style="margin-bottom: 1rem;">
          <label style="display: block; margin-bottom: 0.5rem; font-weight: bold;">Контактный телефон</label>
          <input type="tel" value="+7 (999) 123-45-67" style="width: 100%; padding: 0.5rem; border: 1px solid #ddd; border-radius: 4px;">
        </div>
        
        <div style="margin-bottom: 1rem;">
          <label style="display: flex; align-items: center; gap: 0.5rem;">
            <input type="checkbox" style="transform: scale(1.2);">
            <span>Режим обслуживания</span>
          </label>
        </div>
        
        <button style="background: #1976D2; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 4px; font-size: 1rem;">
          💾 Сохранить настройки
        </button>
      </div>
    </div>
    
    <div style="margin: 2rem 0;">
      <h3>Настройки игр</h3>
      <div style="background: #f9f9f9; padding: 1.5rem; border-radius: 8px; border: 1px solid #ddd;">
        <div style="margin-bottom: 1rem;">
          <label style="display: block; margin-bottom: 0.5rem; font-weight: bold;">Максимум игр на пользователя</label>
          <input type="number" value="5" style="width: 100px; padding: 0.5rem; border: 1px solid #ddd; border-radius: 4px;">
        </div>
        
        <div style="margin-bottom: 1rem;">
          <label style="display: block; margin-bottom: 0.5rem; font-weight: bold;">Таймаут игры (секунды)</label>
          <input type="number" value="60" style="width: 100px; padding: 0.5rem; border: 1px solid #ddd; border-radius: 4px;">
        </div>
        
        <div style="margin-bottom: 1rem;">
          <label style="display: flex; align-items: center; gap: 0.5rem;">
            <input type="checkbox" checked style="transform: scale(1.2);">
            <span>Разрешить несколько игр одновременно</span>
          </label>
        </div>
        
        <div style="margin-bottom: 1rem;">
          <label style="display: flex; align-items: center; gap: 0.5rem;">
            <input type="checkbox" checked style="transform: scale(1.2);">
            <span>Требовать регистрацию для игры</span>
          </label>
        </div>
        
        <button style="background: #1976D2; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 4px; font-size: 1rem;">
          💾 Сохранить настройки игр
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
// Настройки системы
</script>
