<template>
  <div class="historico">
    <h3>Histórico</h3>

    <p v-if="lista.length == 0">Nenhum registro ainda.</p>

    <ul v-else>
      <li v-for="(item, i) in lista" :key="i">
        <strong>{{ item.nome }}</strong> — {{ item.peso }} kg / {{ item.altura }} m
        → IMC <strong>{{ item.imc }}</strong> ({{ item.classificacao }})
        <small> — {{ item.data }}</small>
      </li>
    </ul>

    <button
      class="caixaButton"
      :disabled="lista.length == 0"
      @click="$emit('limpar')"
    >
      Limpar histórico
    </button>
  </div>
</template>

<script>
export default {
  name: 'historicoImc',
  props: {
    lista: {
      type: Array,
      required: true
    }
  },
  emits: ['limpar']
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