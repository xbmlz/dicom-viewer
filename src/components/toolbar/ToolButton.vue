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
  submenu?: SubMenu
}

defineOptions({
  name: 'ToolButton',
})

const props = defineProps<ToolButtonProps>()
const emit = defineEmits<{
  click: []
}>()

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
  emit('click')

  if (props.submenu?.type === 'radio') {
    const item = props.submenu.items.find(i => i.id === radioSelected.value)
    item?.onClick?.()
  }
}

function toggleDropdown() {
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

onClickOutside(buttonRef, () => isOpen.value = false)
onKeyStroke('Escape', () => isOpen.value = false)
</script>

<template>
  <div ref="buttonRef" class="relative inline-flex">
    <!-- Button group -->
    <div class="inline-flex items-stretch rd-md">
      <!-- Main action -->
      <button
        class="fcc w-10 h-10 rd-md cursor-pointer transition-colors"
        :class="active
          ? 'bg-[var(--accent)] text-[var(--accent-foreground)]'
          : 'hover:bg-[var(--accent)]'"
        :title="label"
        @click="handleMainClick"
      >
        <div :class="currentIcon" />
      </button>

      <!-- Dropdown trigger -->
      <button
        v-if="submenu"
        class="fcc w-4 h-10 rd-r-md cursor-pointer transition-colors"
        :class="active
          ? 'bg-[var(--accent)] text-[var(--accent-foreground)]'
          : 'hover:bg-[var(--accent)]'"
        :title="`${label} 选项`"
        @click="toggleDropdown"
      >
        <div class="i-lucide-chevron-down w-3 h-3 opacity-60" />
      </button>
    </div>

    <!-- Dropdown panel -->
    <Transition name="menu-fade">
      <div
        v-if="isOpen && submenu"
        class="absolute top-full left-0 mt-1 min-w-44 bg-[var(--popover)] border border-[var(--border)] rd-lg shadow-xl z-50 py-1 overflow-hidden"
      >
        <div
          v-for="item in submenu.items"
          :key="item.id"
          class="flex items-center gap-2.5 px-3 py-2 cursor-pointer hover:bg-[var(--accent)] select-none"
          @click="submenu.type === 'radio' ? selectRadio(item) : submenu.type === 'checkbox' ? toggleCheckbox(item) : clickNormal(item)"
        >
          <template v-if="submenu.type !== 'normal'">
            <div
              v-if="submenu.type === 'radio' ? radioSelected === item.id : checkboxState[item.id]"
              class="i-lucide-check w-3.5 h-3.5 shrink-0 text-[var(--primary)]"
            />
            <div v-else class="w-3.5 h-3.5 shrink-0" />
          </template>
          <div v-if="item.icon" :class="item.icon" class="shrink-0 text-sm" />
          <span class="text-sm text-[var(--foreground)] whitespace-nowrap">{{ item.label }}</span>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
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
