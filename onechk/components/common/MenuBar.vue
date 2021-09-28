<template>
  <div class="menubar">
    <VBtn
      v-for="(item, index) in menuBarItems"
      :key="index"
      :class="
        selectedMenu === item.id
          ? 'menubar-selected-button'
          : 'menubar-default-button'
      "
      @click="updateSelectedMenu(item.id)"
      >{{ item.title }}</VBtn
    >
  </div>
</template>

<script>
export default {
  created() {
    this.selectedMenu = this.menuBarItems[0].id
  },
  props: {
    menuBarItems: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      selectedMenu: ''
    }
  },
  methods: {
    updateSelectedMenu(newId) {
      this.selectedMenu = newId
      this.$emit('update', newId)
    }
  }
}
</script>
