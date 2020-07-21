<template>
  <div id="app">
    <img alt="Vue logo" class="logo" src="./assets/logo.png" />
    <Calculator />
  </div>
</template>

<script>
import Calculator from "./components/Calculator.vue";

export default {
  name: "app",
  components: {
    Calculator
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

@media (max-width: 767.98px) {
  .logo {
    display: none;
  }

  .el-message-box {
    max-width: 100%;
  }
}
</style>
