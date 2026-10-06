<template>
  <div class="historico">
    <h3>Histórico</h3>

    <p v-if="imcStore.historico.length === 0">Nenhum registro ainda.</p>

    <ul v-else>
      <li v-for="(item, i) in imcStore.historico" :key="i">
        <strong>{{ item.nome }}</strong> — {{ item.peso }} kg / {{ item.altura }} m
        → IMC <strong>{{ item.imc }}</strong> ({{ item.classificacao }})
        <small> — {{ item.data }}</small>
      </li>
    </ul>

    <button
      class="caixaButton"
      :disabled="imcStore.historico.length === 0"
      @click="limpar"
    >
      Limpar histórico
    </button>
  </div>
</template>

<script>
import { mapStores } from 'pinia'
import { useImcStore } from '../stores/imc'

export default {
  name: 'historicoImc',
  emits: ['limpar'],
  computed: {
    ...mapStores(useImcStore)
  },
  methods: {
    limpar() {
      this.imcStore.limpar()
      this.$emit('limpar')   
    }
  }
}
</script>

<style scoped>
.historico {
  margin-top: 30px;
  background: #c0c0c0;
  padding: 10px;
  text-align: center;
  margin-left: 250px;
  margin-right: 265px;
}

.historico ul { list-style: none; padding: 0; }
.historico li { padding: 8px 0; border-bottom: 1px solid #ccc; }
</style>