<script setup lang='ts'>
export interface SubMenuItem {
  id: string
  icon?: string
  label: string
  checked?: boolean
  onClick?: () => void
}

export interface SubMenu {
  type: 'radio' | 'checkbox' | 'normal'
  items: SubMenuItem[]
  onChange?: (selectedIds: string[]) => void
}

export interface ToolButtonProps {
  icon: string
  label: string
  active?: boolean
  onClick?: () => void
  submenu?: SubMenu
}

defineOptions({
  name: 'ToolButton',
})

const props = defineProps<ToolButtonProps>()

const isOpen = ref(false)
const buttonRef = ref<HTMLElement | null>(null)

// Radio: single selected item id
const radioSelected = ref<string>(
  props.submenu?.type === 'radio'
    ? (props.submenu.items.find(i => i.checked)?.id ?? props.submenu.items[0]?.id ?? '')
    : '',
)

// Checkbox: per-item checked state
const checkboxState = ref<Record<string, boolean>>(
  props.submenu?.type === 'checkbox'
    ? Object.fromEntries(props.submenu.items.map(i => [i.id, i.checked ?? false]))
    : {},
)

// Radio mode: swap main icon to match current selection
const currentIcon = computed(() => {
  if (props.submenu?.type === 'radio' && radioSelected.value) {
    const found = props.submenu.items.find(i => i.id === radioSelected.value)
    return found?.icon ?? props.icon
  }
  return props.icon
})

function handleMainClick() {
  if (props.submenu?.type === 'radio') {
    const item = props.submenu.items.find(i => i.id === radioSelected.value)
    item?.onClick?.()
  }
  else {
    props.onClick?.()
  }
}

function toggleDropdown(e: MouseEvent) {
  e.stopPropagation()
  isOpen.value = !isOpen.value
}

function selectRadio(item: SubMenuItem) {
  radioSelected.value = item.id
  props.submenu?.onChange?.([item.id])
  item.onClick?.()
  isOpen.value = false
}

function toggleCheckbox(item: SubMenuItem) {
  checkboxState.value[item.id] = !checkboxState.value[item.id]
  const selected = Object.entries(checkboxState.value)
    .filter(([, v]) => v)
    .map(([k]) => k)
  props.submenu?.onChange?.(selected)
}

function clickNormal(item: SubMenuItem) {
  item.onClick?.()
  isOpen.value = false
}

function onOutsideClick(e: MouseEvent) {
  if (buttonRef.value && !buttonRef.value.contains(e.target as Node)) {
    isOpen.value = false
  }
}

onMounted(() => document.addEventListener('click', onOutsideClick))
onUnmounted(() => document.removeEventListener('click', onOutsideClick))
</script>

<template>
  <div ref="buttonRef" class="relative inline-block">
    <!-- Main button -->
    <button
      class="fcc flex-col w-10 h-10 rd-md cursor-pointer transition-colors relative"
      :class="active
        ? 'bg-[var(--accent)] text-[var(--accent-foreground)]'
        : 'hover:bg-[var(--accent)]'"
      :title="label"
      @click="handleMainClick"
    >
      <div :class="currentIcon" />
      <!-- Bottom-right triangle: signals a submenu is available -->
      <span v-if="submenu" class="caret" />
    </button>

    <!-- Invisible hotspot covering the caret area to open the dropdown -->
    <div
      v-if="submenu"
      class="absolute bottom-0 right-0 w-5 h-5 cursor-pointer z-10"
      :title="`${label} 选项`"
      @click="toggleDropdown"
    />

    <!-- Dropdown panel -->
    <Transition name="menu-fade">
      <div
        v-if="isOpen && submenu"
        class="absolute top-full left-0 mt-1 min-w-44 bg-[var(--popover)] border border-[var(--border)] rd-lg shadow-xl z-50 py-1 overflow-hidden"
      >
        <!-- ── Radio ── -->
        <template v-if="submenu.type === 'radio'">
          <div
            v-for="item in submenu.items"
            :key="item.id"
            class="flex items-center gap-2.5 px-3 py-2 cursor-pointer hover:bg-[var(--accent)] select-none"
            @click="selectRadio(item)"
          >
            <!-- Radio dot -->
            <div
              class="w-3.5 h-3.5 rd-full border-2 flex items-center justify-center shrink-0 transition-colors"
              :class="radioSelected === item.id
                ? 'border-[var(--primary)] bg-[var(--primary)]'
                : 'border-[var(--muted-foreground)]'"
            >
              <div
                v-if="radioSelected === item.id"
                class="w-1.5 h-1.5 rd-full bg-[var(--primary-foreground)]"
              />
            </div>
            <div v-if="item.icon" :class="item.icon" class="shrink-0 text-sm" />
            <span class="text-sm text-[var(--foreground)] whitespace-nowrap">{{ item.label }}</span>
          </div>
        </template>

        <!-- ── Checkbox ── -->
        <template v-else-if="submenu.type === 'checkbox'">
          <div
            v-for="item in submenu.items"
            :key="item.id"
            class="flex items-center gap-2.5 px-3 py-2 cursor-pointer hover:bg-[var(--accent)] select-none"
            @click="toggleCheckbox(item)"
          >
            <!-- Checkbox square -->
            <div
              class="w-3.5 h-3.5 rd border-2 flex items-center justify-center shrink-0 transition-colors"
              :class="checkboxState[item.id]
                ? 'border-[var(--primary)] bg-[var(--primary)]'
                : 'border-[var(--muted-foreground)]'"
            >
              <div
                v-if="checkboxState[item.id]"
                class="i-lucide-check w-2.5 h-2.5 text-[var(--primary-foreground)]"
              />
            </div>
            <div v-if="item.icon" :class="item.icon" class="shrink-0 text-sm" />
            <span class="text-sm text-[var(--foreground)] whitespace-nowrap">{{ item.label }}</span>
          </div>
        </template>

        <!-- ── Normal ── -->
        <template v-else>
          <div
            v-for="item in submenu.items"
            :key="item.id"
            class="flex items-center gap-2.5 px-3 py-2 cursor-pointer hover:bg-[var(--accent)] select-none"
            @click="clickNormal(item)"
          >
            <div v-if="item.icon" :class="item.icon" class="shrink-0 text-sm" />
            <span class="text-sm text-[var(--foreground)] whitespace-nowrap">{{ item.label }}</span>
          </div>
        </template>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
/* Bottom-right triangle indicator */
.caret {
  position: absolute;
  bottom: 3px;
  right: 3px;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 0 0 5px 5px;
  border-color: transparent transparent currentColor transparent;
  opacity: 0.55;
  pointer-events: none;
}

/* Dropdown appear / disappear */
.menu-fade-enter-active,
.menu-fade-leave-active {
  transition:
    opacity 0.15s ease,
    transform 0.15s ease;
}

.menu-fade-enter-from,
.menu-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
