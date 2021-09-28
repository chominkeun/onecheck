<template>
  <tr>
    <th>{{ title }}</th>
    <td>
      <slot />
    </td>
  </tr>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    }
  }
}
</script>

<style></style>
