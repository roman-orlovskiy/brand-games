<template>
  <div>
    <h2>Управление призами</h2>
    <p>Здесь будет список призов</p>
    
    <div style="margin: 2rem 0;">
      <h3>Список призов</h3>
      <div style="border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
        <div style="background: #f5f5f5; padding: 1rem; font-weight: bold; border-bottom: 1px solid #ddd;">
          <div style="display: grid; grid-template-columns: 1fr 2fr 1fr 1fr 1fr; gap: 1rem;">
            <div>ID</div>
            <div>Название</div>
            <div>Стоимость</div>
            <div>Количество</div>
            <div>Действия</div>
          </div>
        </div>
        <div style="padding: 1rem; border-bottom: 1px solid #ddd;">
          <div style="display: grid; grid-template-columns: 1fr 2fr 1fr 1fr 1fr; gap: 1rem; align-items: center;">
            <div>1</div>
            <div>Скидка 10%</div>
            <div>500₽</div>
            <div>50</div>
            <div>
              <button style="background: #2196F3; color: white; border: none; padding: 0.25rem 0.5rem; border-radius: 4px; margin-right: 0.5rem;">✏️</button>
              <button style="background: #f44336; color: white; border: none; padding: 0.25rem 0.5rem; border-radius: 4px;">🗑️</button>
            </div>
          </div>
        </div>
        <div style="padding: 1rem;">
          <div style="display: grid; grid-template-columns: 1fr 2fr 1fr 1fr 1fr; gap: 1rem; align-items: center;">
            <div>2</div>
            <div>Бесплатная доставка</div>
            <div>300₽</div>
            <div>100</div>
            <div>
              <button style="background: #2196F3; color: white; border: none; padding: 0.25rem 0.5rem; border-radius: 4px; margin-right: 0.5rem;">✏️</button>
              <button style="background: #f44336; color: white; border: none; padding: 0.25rem 0.5rem; border-radius: 4px;">🗑️</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div style="margin: 2rem 0;">
      <button style="background: #1976D2; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 4px; font-size: 1rem;">
        ➕ Добавить приз
      </button>
    </div>
  </div>
</template>

<script setup>
// Управление призами
</script>
