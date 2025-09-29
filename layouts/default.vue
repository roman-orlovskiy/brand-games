<template>
  <div>
    <header>
      <nav>
        <NuxtLink to="/">Главная</NuxtLink>
      </nav>
    </header>
    
    <main>
      <NuxtPage />
    </main>
    
    <footer>
      <p>&copy; 2024 Brand Games</p>
    </footer>
  </div>
</template>

<script setup>
// Базовый layout для всех страниц
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  line-height: 1.6;
  color: #333;
}

header {
  background-color: #f8f9fa;
  padding: 1rem 0;
  border-bottom: 1px solid #e9ecef;
}

nav {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

nav a {
  color: #007bff;
  text-decoration: none;
  font-weight: 500;
}

nav a:hover {
  text-decoration: underline;
}

main {
  min-height: calc(100vh - 120px);
  padding: 2rem 1rem;
}

footer {
  background-color: #f8f9fa;
  text-align: center;
  padding: 1rem 0;
  border-top: 1px solid #e9ecef;
  color: #6c757d;
}
</style>
