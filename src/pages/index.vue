<script setup lang="ts">
import type { SubMenu } from '@/components/toolbar/ToolButton.vue'
import { useStudies } from '@/components/thumbnail/useStudies'

const activeTool = ref<string | null>(null)

function selectTool(id: string) {
  activeTool.value = activeTool.value === id ? null : id
}

// ── Radio：测量工具（同一时间只能选一种）
const measureSubmenu: SubMenu = {
  type: 'radio',
  items: [
    { id: 'line', icon: 'i-lucide-minus', label: '直线测量', checked: true, onClick: () => selectTool('measure') },
    { id: 'angle', icon: 'i-lucide-triangle', label: '角度测量', onClick: () => selectTool('measure') },
    { id: 'area', icon: 'i-lucide-pentagon', label: '面积测量', onClick: () => selectTool('measure') },
    { id: 'ellipse', icon: 'i-lucide-circle-dashed', label: '椭圆测量', onClick: () => selectTool('measure') },
  ],
  onChange: ([id]) => console.warn('[measure] 切换为:', id),
}

// ── Checkbox：叠加层显示（可同时开启多项）
const overlaySubmenu: SubMenu = {
  type: 'checkbox',
  items: [
    { id: 'labels', icon: 'i-lucide-tag', label: '显示标签', checked: true },
    { id: 'lengths', icon: 'i-lucide-ruler', label: '显示长度', checked: true },
    { id: 'angles', icon: 'i-lucide-triangle', label: '显示角度', checked: false },
    { id: 'coords', icon: 'i-lucide-crosshair', label: '显示坐标', checked: false },
  ],
  onChange: ids => console.warn('[overlay] 当前开启:', ids),
}

// ── Normal：窗宽窗位预设（点击即执行）
const windowSubmenu: SubMenu = {
  type: 'normal',
  items: [
    { id: 'lung', icon: 'i-lucide-wind', label: '肺窗', onClick: () => applyPreset('lung') },
    { id: 'bone', icon: 'i-lucide-bone', label: '骨窗', onClick: () => applyPreset('bone') },
    { id: 'brain', icon: 'i-lucide-brain', label: '脑窗', onClick: () => applyPreset('brain') },
    { id: 'abdomen', icon: 'i-lucide-circle-dot', label: '腹窗', onClick: () => applyPreset('abdomen') },
    { id: 'mediastinum', icon: 'i-lucide-heart-pulse', label: '纵隔窗', onClick: () => applyPreset('mediastinum') },
  ],
}

function applyPreset(name: string) {
  selectTool('window')
  console.warn('[window] 应用预设:', name)
}

// ── 工具组
const viewTools = [
  { id: 'zoom', icon: 'i-lucide-zoom-in', label: '缩放' },
  { id: 'pan', icon: 'i-lucide-move', label: '平移' },
]

const imageTools = [
  { id: 'window', icon: 'i-lucide-contrast', label: '窗宽窗位', submenu: windowSubmenu },
]

const measureTools = [
  { id: 'measure', icon: 'i-lucide-ruler', label: '测量', submenu: measureSubmenu },
  { id: 'overlay', icon: 'i-lucide-layers', label: '叠加层', submenu: overlaySubmenu },
]

const { studies, activeSeriesId } = useStudies()
</script>

<template>
  <div class="size-full flex flex-col bg-[var(--background)] overflow-hidden">
    <!-- ══ Toolbar ══ -->
    <header class="shrink-0 flex items-center gap-1 px-2 h-11 bg-[var(--card)] border-b border-[var(--border)]">
      <!-- 视图工具 -->
      <div class="flex items-center gap-0.5">
        <ToolButton
          v-for="t in viewTools"
          :key="t.id"
          :icon="t.icon"
          :label="t.label"
          :active="activeTool === t.id"
          @click="() => selectTool(t.id)"
        />
      </div>

      <!-- 影像工具 -->
      <div class="flex items-center gap-0.5">
        <ToolButton
          v-for="t in imageTools"
          :key="t.id"
          :icon="t.icon"
          :label="t.label"
          :active="activeTool === t.id"
          :submenu="t.submenu"
          @click="() => selectTool(t.id)"
        />
      </div>

      <!-- 测量工具 -->
      <div class="flex items-center gap-0.5">
        <ToolButton
          v-for="t in measureTools"
          :key="t.id"
          :icon="t.icon"
          :label="t.label"
          :active="activeTool === t.id"
          :submenu="t.submenu"
          @click="() => selectTool(t.id)"
        />
      </div>

      <!-- 弹性空白 -->
      <div class="flex-1" />

      <!-- 右侧：重置 + 主题切换 -->
      <div class="flex items-center gap-0.5">
        <ToolButton
          icon="i-lucide-rotate-ccw"
          label="重置视图"
          @click="() => selectTool('reset')"
        />
        <a
          @click="toggleDark()"
        >
          <div :class="isDark ? 'i-lucide-moon' : 'i-lucide-sun'" />
        </a>
      </div>
    </header>

    <!-- ══ Main ══ -->
    <div class="flex-1 flex flex-col landscape:flex-row overflow-hidden">
      <!-- ── Viewport ── -->
      <main class="flex-1 relative overflow-hidden bg-black flex items-center justify-center">
        <div class="flex flex-col items-center gap-3 select-none pointer-events-none opacity-25">
          <div class="i-lucide-scan-line w-14 h-14 text-white" />
          <p class="text-sm text-white">
            暂无影像，请加载 DICOM 文件
          </p>
        </div>
      </main>

      <!-- ── 序列面板 ── -->
      <ThumbnailList v-model:active-series-id="activeSeriesId" :studies="studies" class="landscape:order-first" />
    </div>
  </div>
</template>
