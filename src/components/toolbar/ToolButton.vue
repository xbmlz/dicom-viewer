<script setup lang='ts'>
import type { MenuItem } from 'primevue/menuitem'
import TieredMenu from 'primevue/tieredmenu'

export interface SubMenuItem {
  id: string
  icon?: string
  label: string
  shortcut?: string
  checked?: boolean
  disabled?: boolean
  separator?: boolean
  items?: SubMenuItem[]
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

interface ToolMenuItem extends MenuItem {
  id: string
  shortcut?: string
  checked?: boolean
}

defineOptions({
  name: 'ToolButton',
})

const props = defineProps<ToolButtonProps>()
const emit = defineEmits<{
  click: []
}>()

const menuRef = ref<InstanceType<typeof TieredMenu> | null>(null)
const radioSelected = ref('')
const checkboxState = ref<Record<string, boolean>>({})

function buildCheckboxState(items: SubMenuItem[]): Record<string, boolean> {
  return items.reduce<Record<string, boolean>>((state, item) => {
    state[item.id] = item.checked ?? false
    if (item.items)
      Object.assign(state, buildCheckboxState(item.items))
    return state
  }, {})
}

function findFirstCheckedRadio(items: SubMenuItem[]): string {
  for (const item of items) {
    if (item.checked)
      return item.id
    if (item.items) {
      const nestedCheckedId = findFirstCheckedRadio(item.items)
      if (nestedCheckedId)
        return nestedCheckedId
    }
  }
  return ''
}

function findFirstItemId(items: SubMenuItem[]): string {
  for (const item of items) {
    if (item.separator)
      continue
    if (item.id)
      return item.id
    if (item.items) {
      const nestedId = findFirstItemId(item.items)
      if (nestedId)
        return nestedId
    }
  }
  return ''
}

function findItemById(items: SubMenuItem[], id: string): SubMenuItem | undefined {
  for (const item of items) {
    if (item.id === id)
      return item
    if (item.items) {
      const nestedItem = findItemById(item.items, id)
      if (nestedItem)
        return nestedItem
    }
  }
  return undefined
}

function syncMenuState(submenu?: SubMenu) {
  if (submenu?.type === 'radio') {
    radioSelected.value = findFirstCheckedRadio(submenu.items) || findFirstItemId(submenu.items)
  }
  else {
    radioSelected.value = ''
  }

  checkboxState.value = submenu?.type === 'checkbox'
    ? buildCheckboxState(submenu.items)
    : {}
}

watch(() => props.submenu, submenu => syncMenuState(submenu), { immediate: true, deep: true })

const currentIcon = computed(() => {
  if (props.submenu?.type === 'radio' && radioSelected.value) {
    const found = findItemById(props.submenu.items, radioSelected.value)
    return found?.icon ?? props.icon
  }
  return props.icon
})

function handleMainClick() {
  emit('click')

  if (props.submenu?.type === 'radio') {
    const item = findItemById(props.submenu.items, radioSelected.value)
    item?.onClick?.()
  }
}

function getSelectedCheckboxIds() {
  return Object.entries(checkboxState.value)
    .filter(([, checked]) => checked)
    .map(([id]) => id)
}

function handleMenuItemClick(item: SubMenuItem) {
  if (props.submenu?.type === 'radio') {
    radioSelected.value = item.id
    props.submenu.onChange?.([item.id])
  }
  else if (props.submenu?.type === 'checkbox') {
    checkboxState.value = {
      ...checkboxState.value,
      [item.id]: !checkboxState.value[item.id],
    }
    props.submenu.onChange?.(getSelectedCheckboxIds())
  }

  item.onClick?.()
}

function mapItems(items: SubMenuItem[]): ToolMenuItem[] {
  return items.map((item) => {
    if (item.separator) {
      return {
        id: item.id,
        separator: true,
      }
    }

    return {
      id: item.id,
      label: item.label,
      icon: item.icon,
      shortcut: item.shortcut,
      disabled: item.disabled,
      checked: props.submenu?.type === 'radio'
        ? radioSelected.value === item.id
        : props.submenu?.type === 'checkbox'
          ? !!checkboxState.value[item.id]
          : false,
      items: item.items ? mapItems(item.items) : undefined,
      command: () => handleMenuItemClick(item),
    }
  })
}

const menuItems = computed(() => props.submenu ? mapItems(props.submenu.items) : [])

function toggleDropdown(event: MouseEvent) {
  menuRef.value?.toggle(event)
}
</script>

<template>
  <div class="relative inline-flex">
    <div class="inline-flex items-stretch rd-md">
      <button
        class="fcc h-10 cursor-pointer transition-colors"
        :class="[
          submenu ? 'w-10 rd-l-md' : 'w-10 rd-md',
          active
            ? 'bg-[var(--p-primary-color)] text-[var(--p-primary-contrast-color)]'
            : 'text-[var(--p-text-color)] hover:bg-[var(--p-content-border-color)]',
        ]"
        :title="label"
        type="button"
        @click="handleMainClick"
      >
        <div :class="currentIcon" />
      </button>

      <button
        v-if="submenu"
        class="fcc h-10 w-4 rd-r-md cursor-pointer transition-colors"
        :class="active
          ? 'bg-[var(--p-primary-color)] text-[var(--p-primary-contrast-color)]'
          : 'text-[var(--p-text-color)] hover:bg-[var(--p-content-border-color)]'"
        :title="`${label} 选项`"
        type="button"
        @click="toggleDropdown"
      >
        <div class="i-lucide-chevron-down h-3 w-3 opacity-60" />
      </button>
    </div>

    <TieredMenu
      v-if="submenu"
      ref="menuRef"
      :model="menuItems"
      popup
      :pt="{
        root: { class: 'min-w-52 overflow-hidden rd-lg border border-[var(--p-content-border-color)] bg-[var(--p-content-background)] shadow-xl' },
        rootList: { class: 'py-1' },
      }"
    >
      <template #item="{ item, props: menuItemProps, hasSubmenu }">
        <a
          class="flex items-center gap-2.5 px-3 py-2 text-sm select-none"
          v-bind="menuItemProps.action"
        >
          <div class="flex h-3.5 w-3.5 shrink-0 items-center justify-center">
            <div
              v-if="item.checked"
              class="i-lucide-check h-3.5 w-3.5 text-[var(--p-primary-color)]"
            />
          </div>
          <div v-if="item.icon" :class="item.icon" class="shrink-0 text-sm" />
          <span class="flex-1 whitespace-nowrap text-[var(--p-text-color)]">{{ item.label }}</span>
          <span
            v-if="item.shortcut"
            class="rounded border border-[var(--p-content-border-color)] bg-[var(--p-content-border-color)] px-1.5 py-0.5 text-xs text-[var(--p-text-muted-color)]"
          >
            {{ item.shortcut }}
          </span>
          <i v-if="hasSubmenu" class="pi pi-angle-right ml-1 text-xs opacity-70" />
        </a>
      </template>
    </TieredMenu>
  </div>
</template>
