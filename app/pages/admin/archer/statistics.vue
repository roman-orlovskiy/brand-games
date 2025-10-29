<template>
  <div class="stats">
    <UCard>
      <template #header>
        <div class="stats__header">
          <h1 class="stats__title">Статистика игры «Лучник»</h1>
          <div class="stats__summary">
            <div class="stats__metric">
              <span class="stats__metric-label">Всего игр</span>
              <span class="stats__metric-value">{{ totalCount }}</span>
            </div>
            <div v-if="dateRange" class="stats__metric">
              <span class="stats__metric-label">Диапазон дат</span>
              <span class="stats__metric-value">{{ dateRange }}</span>
            </div>
          </div>
        </div>
      </template>

      <UTable :data="tableRows" :columns="columns" :loading="false" />
    </UCard>
  </div>

</template>

<script setup lang="ts">
import rawData from '~/data/archer-statistics.json';
import { formatDateTimeRu, formatDateRangeInclusiveRu } from '~/utils/date';

definePageMeta({
  layout: 'admin',
  middleware: 'admin-auth'
})

type GameMode = 'sum' | 'max';

interface ArcherStatRow {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  mode: GameMode;
  promoCode: string | null;
  playedAt: string; // ISO
}

const data = rawData as ArcherStatRow[];

const columns = [
  { id: 'firstName', accessorKey: 'firstName', header: 'Имя' },
  { id: 'lastName', accessorKey: 'lastName', header: 'Фамилия' },
  { id: 'phone', accessorKey: 'phone', header: 'Телефон' },
  { id: 'email', accessorKey: 'email', header: 'Email' },
  { id: 'modeLabel', accessorKey: 'modeLabel', header: 'Режим игры' },
  { id: 'promoCode', accessorKey: 'promoCode', header: 'Промокод' },
  { id: 'playedAtFormatted', accessorKey: 'playedAtFormatted', header: 'Дата и время' }
];

const tableRows = computed(() =>
  data.map((r) => ({
    ...r,
    modeLabel: r.mode === 'sum' ? 'Суммарная скидка' : 'Максимальная скидка',
    promoCode: r.mode === 'max' ? r.promoCode : '',
    playedAtFormatted: formatDateTimeRu(r.playedAt)
  }))
);

const totalCount = computed(() => data.length);

const dateRange = computed(() => {
  if (!data.length) return '';
  const sorted = [...data].sort(
    (a, b) => new Date(a.playedAt).getTime() - new Date(b.playedAt).getTime()
  );
  const first = sorted[0];
  const last = sorted[sorted.length - 1];
  if (!first || !last) return '';
  return formatDateRangeInclusiveRu(first.playedAt, last.playedAt);
});

</script>

<style lang="scss" scoped>
.stats {
  &__header {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  &__title {
    font-size: 18px;
    font-weight: 600;
  }

  &__summary {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
  }

  &__metric {
    display: flex;
    align-items: baseline;
    gap: 6px;
  }

  &__metric-label {
    color: var(--ui-text-muted);
  }

  &__metric-value {
    font-weight: 600;
  }
}
</style>
