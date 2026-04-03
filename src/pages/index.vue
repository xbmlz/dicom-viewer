<script setup lang="ts">
import type { SubMenu } from '@/components/ToolButton.vue'
import ToolButton from '@/components/ToolButton.vue'

const { toggleDark, isDark } = useDark()

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

// 占位序列数据
const seriesList = [
  { id: '1', modality: 'CT', desc: '胸部平扫', count: 320, thumb: null },
  { id: '2', modality: 'CT', desc: '腹部增强', count: 256, thumb: null },
  { id: '3', modality: 'MR', desc: 'T1 轴位', count: 30, thumb: null },
  { id: '4', modality: 'MR', desc: 'T2 冠状位', count: 24, thumb: null },
]
const activeSeriesId = ref<string>('1')
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
          :on-click="() => selectTool(t.id)"
        />
      </div>

      <div class="w-px h-5 bg-[var(--border)] mx-0.5" />

      <!-- 影像工具 -->
      <div class="flex items-center gap-0.5">
        <ToolButton
          v-for="t in imageTools"
          :key="t.id"
          :icon="t.icon"
          :label="t.label"
          :active="activeTool === t.id"
          :submenu="t.submenu"
          :on-click="() => selectTool(t.id)"
        />
      </div>

      <div class="w-px h-5 bg-[var(--border)] mx-0.5" />

      <!-- 测量工具 -->
      <div class="flex items-center gap-0.5">
        <ToolButton
          v-for="t in measureTools"
          :key="t.id"
          :icon="t.icon"
          :label="t.label"
          :active="activeTool === t.id"
          :submenu="t.submenu"
          :on-click="() => selectTool(t.id)"
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
        <ToolButton
          :icon="isDark ? 'i-lucide-moon' : 'i-lucide-sun'"
          label="切换主题"
          @click="toggleDark"
        />
      </div>
    </header>

    <!-- ══ Main ══ -->
    <div class="flex-1 flex overflow-hidden">
      <!-- ── 左侧：序列面板 ── -->
      <aside class="w-52 shrink-0 flex flex-col bg-[var(--card)] border-r border-[var(--border)] overflow-hidden">
        <!-- 患者信息头 -->
        <div class="px-3 py-2.5 border-b border-[var(--border)]">
          <p class="text-xs font-semibold text-[var(--foreground)] truncate">
            张三 · 男 · 45岁
          </p>
          <p class="text-xs text-[var(--muted-foreground)] mt-0.5 truncate">
            2024-01-15 · CT 胸部
          </p>
        </div>

        <!-- 序列列表 -->
        <div class="flex-1 overflow-y-auto py-1.5 flex flex-col gap-1 px-1.5">
          <div
            v-for="s in seriesList"
            :key="s.id"
            class="flex items-center gap-2.5 px-2 py-2 rd-md cursor-pointer transition-colors select-none"
            :class="activeSeriesId === s.id
              ? 'bg-[var(--accent)] text-[var(--accent-foreground)]'
              : 'hover:bg-[var(--accent)]'"
            @click="activeSeriesId = s.id"
          >
            <!-- 缩略图占位 -->
            <div class="w-10 h-10 shrink-0 rd bg-[var(--muted)] flex items-center justify-center">
              <div class="i-lucide-image w-4 h-4 text-[var(--muted-foreground)]" />
            </div>
            <!-- 序列信息 -->
            <div class="flex-1 min-w-0">
              <p class="text-xs font-medium text-[var(--foreground)] truncate">
                {{ s.desc }}
              </p>
              <p class="text-xs text-[var(--muted-foreground)] mt-0.5">
                <span class="font-mono">{{ s.modality }}</span>
                &nbsp;·&nbsp;{{ s.count }} 帧
              </p>
            </div>
          </div>
        </div>
      </aside>

      <!-- ── 右侧：Viewport ── -->
      <main class="flex-1 relative overflow-hidden bg-black flex items-center justify-center">
        <div class="flex flex-col items-center gap-3 select-none pointer-events-none opacity-25">
          <div class="i-lucide-scan-line w-14 h-14 text-white" />
          <p class="text-sm text-white">
            暂无影像，请加载 DICOM 文件
          </p>
        </div>
      </main>
    </div>
  </div>
</template>
