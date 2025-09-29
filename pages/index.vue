<template>
  <v-app>
    <v-main>
      <v-container fluid>
        <v-row align="center" justify="center" class="fill-height">
          <v-col cols="12" md="8" lg="6">
            <v-card class="elevation-12 pa-8">
              <v-card-title class="text-center text-h3 mb-6">
                Добро пожаловать в Brand Games!
              </v-card-title>
              
              <v-card-text class="text-center">
                <p class="text-h6 mb-6 text-medium-emphasis">
                  Интерактивная игра с луком и призами для ваших клиентов
                </p>
                
                <v-row class="mb-6">
                  <v-col cols="12" md="4">
                    <v-card variant="outlined" class="pa-4 text-center">
                      <v-icon size="48" color="primary" class="mb-2">mdi-target</v-icon>
                      <h3 class="text-h6">Точность</h3>
                      <p class="text-caption">Попадите в цель и выиграйте призы</p>
                    </v-card>
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-card variant="outlined" class="pa-4 text-center">
                      <v-icon size="48" color="success" class="mb-2">mdi-gift</v-icon>
                      <h3 class="text-h6">Призы</h3>
                      <p class="text-caption">Скидки и подарки за каждое попадание</p>
                    </v-card>
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-card variant="outlined" class="pa-4 text-center">
                      <v-icon size="48" color="warning" class="mb-2">mdi-palette</v-icon>
                      <h3 class="text-h6">Брендинг</h3>
                      <p class="text-caption">Настройте игру под ваш бренд</p>
                    </v-card>
                  </v-col>
                </v-row>
                
                <v-divider class="mb-6"></v-divider>
                
                <div class="d-flex flex-column flex-sm-row gap-4 justify-center">
                  <v-btn
                    color="primary"
                    size="large"
                    to="/admin"
                    class="mb-2 mb-sm-0"
                  >
                    <v-icon left>mdi-cog</v-icon>
                    Админ панель
                  </v-btn>
                  
                  <v-btn
                    color="secondary"
                    size="large"
                    variant="outlined"
                    @click="showDemo = true"
                  >
                    <v-icon left>mdi-play</v-icon>
                    Демо игры
                  </v-btn>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>

    <!-- Демо игры -->
    <v-dialog v-model="showDemo" max-width="800px">
      <v-card>
        <v-card-title class="d-flex justify-space-between align-center">
          <span>Демо игры</span>
          <v-btn icon @click="showDemo = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <div class="demo-game">
            <div class="game-area">
              <div class="target" :class="{ 'hit': isHit }">
                <div class="target-center"></div>
                <div class="target-rings">
                  <div class="ring ring-1"></div>
                  <div class="ring ring-2"></div>
                  <div class="ring ring-3"></div>
                </div>
              </div>
              <div class="prizes">
                <div class="prize" v-for="prize in demoPrizes" :key="prize.id" :style="prize.style">
                  {{ prize.name }}
                </div>
              </div>
            </div>
            <div class="controls">
              <v-btn color="primary" @click="shoot" :disabled="isShooting">
                <v-icon left>mdi-bow-arrow</v-icon>
                Стрелять
              </v-btn>
              <v-btn color="secondary" @click="resetDemo" class="ml-2">
                <v-icon left>mdi-refresh</v-icon>
                Сброс
              </v-btn>
            </div>
            <div class="score" v-if="score > 0">
              <h3>Счет: {{ score }}</h3>
              <p>Попаданий: {{ hits }}</p>
            </div>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script setup>
const showDemo = ref(false)
const isShooting = ref(false)
const isHit = ref(false)
const score = ref(0)
const hits = ref(0)

const demoPrizes = ref([
  { id: 1, name: 'Скидка 10%', style: { top: '20%', left: '30%' } },
  { id: 2, name: 'Скидка 25%', style: { top: '40%', left: '60%' } },
  { id: 3, name: 'Подарок', style: { top: '60%', left: '20%' } },
  { id: 4, name: 'Скидка 50%', style: { top: '80%', left: '70%' } }
])

const shoot = () => {
  if (isShooting.value) return
  
  isShooting.value = true
  isHit.value = false
  
  // Симуляция выстрела
  setTimeout(() => {
    const hit = Math.random() > 0.3 // 70% шанс попадания
    isHit.value = hit
    
    if (hit) {
      score.value += Math.floor(Math.random() * 50) + 10
      hits.value++
    }
    
    isShooting.value = false
  }, 1000)
}

const resetDemo = () => {
  score.value = 0
  hits.value = 0
  isHit.value = false
  isShooting.value = false
}
</script>

<style scoped>
.demo-game {
  text-align: center;
  padding: 20px;
}

.game-area {
  position: relative;
  height: 400px;
  background: linear-gradient(45deg, #f0f0f0 25%, transparent 25%), 
              linear-gradient(-45deg, #f0f0f0 25%, transparent 25%), 
              linear-gradient(45deg, transparent 75%, #f0f0f0 75%), 
              linear-gradient(-45deg, transparent 75%, #f0f0f0 75%);
  background-size: 20px 20px;
  background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
  border: 2px dashed #ccc;
  border-radius: 8px;
  margin-bottom: 20px;
}

.target {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 120px;
  height: 120px;
  border: 4px solid #1976D2;
  border-radius: 50%;
  background-color: rgba(25, 118, 210, 0.1);
  transition: all 0.3s ease;
}

.target.hit {
  background-color: rgba(76, 175, 80, 0.3);
  border-color: #4CAF50;
  transform: translate(-50%, -50%) scale(1.1);
}

.target-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 20px;
  height: 20px;
  background-color: #000;
  border-radius: 50%;
  z-index: 3;
}

.ring {
  position: absolute;
  border: 2px solid;
  border-radius: 50%;
  z-index: 2;
}

.ring-1 {
  width: 60px;
  height: 60px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-color: #FF0000;
}

.ring-2 {
  width: 80px;
  height: 80px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-color: #FFA500;
}

.ring-3 {
  width: 100px;
  height: 100px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-color: #00FF00;
}

.prizes {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.prize {
  position: absolute;
  background-color: #FF9800;
  color: white;
  padding: 8px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: bold;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

.controls {
  margin-bottom: 20px;
}

.score {
  background-color: #f5f5f5;
  padding: 15px;
  border-radius: 8px;
  margin-top: 20px;
}

.score h3 {
  margin: 0 0 10px 0;
  color: #1976D2;
}

.score p {
  margin: 0;
  color: #666;
}
</style>
