<template>
  <div v-if="store.historico.length" class="historico">
    <h3>Histórico</h3>
    <ul>
      <li v-for="(item, i) in store.historico" :key="i">
        <strong>{{ item.nome }}</strong> - {{ item.peso }} kg | {{ item.altura }} m
        → IMC <strong>{{ item.imc }}</strong> <br> ({{ item.classificacao }})
        <small> <br> {{ item.data }}</small>
      </li>
    </ul>
    <button class="caixaButton" @click="store.limpar()">Limpar histórico</button>
  </div>
</template>

<script>
import { useImcStore } from '../stores/imc'

export default {
  name: 'historicoImc',
  computed: {
    store() { return useImcStore() }
  }
}
</script>

<style scoped>
.historico {
  margin-top: 30px;
  background: #eee;
  padding: 20px;
  text-align: center;
}

.historico ul { list-style: none; padding: 0; }
.historico li { padding: 8px 0; border-bottom: 1px solid #ccc; }
</style>