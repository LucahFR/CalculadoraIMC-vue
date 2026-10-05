<template>
  <div class="container">
    <div class="caixaDiv">
      <h2>Calculadora IMC</h2>

      <div class="divDados">
        Nome <input v-model="nome" type="text" placeholder="Ex: Paulo">
      </div>

      <div class="divDados">
        Peso (kg) <input v-model="peso" type="text" inputmode="decimal" placeholder="Ex: 63">
      </div>

      <div class="divDados">
        Altura (m) <input v-model="altura" type="text" inputmode="decimal" placeholder="Ex: 1.74">
      </div>

      <button class="caixaButton" @click="calcular">Calcular</button>

      <p v-if="erro" class="erro">{{ erro }}</p>

      <div v-if="resultado !== null" class="resultado">
        <p><strong>{{ nome }}</strong>, seu IMC é <strong>{{ resultado }}</strong></p>
        <p>{{ classificacao }}</p>
      </div>
    </div>

    <imc />
  </div>
</template>

<script>
import imc from './components/historicoImc.vue'
import { useImcStore } from './stores/imc'

export default {
  name: 'App',
  components: { imc },
  data() {
    return {
      nome: '',
      peso: '',
      altura: '',
      resultado: null,
      classificacao: '',
      erro: ''
    }
  },
  methods: {
    paraNumero(valor) {
      return parseFloat(String(valor).replace(',', '.'))
    },

    classificar(imc) {
      if (imc < 18.5) return 'Abaixo do peso'
      if (imc < 25)   return 'Peso normal'
      if (imc < 30)   return 'Sobrepeso'
      if (imc < 35)   return 'Obesidade grau I'
      if (imc < 40)   return 'Obesidade grau II'
      return 'Obesidade grau III'
    },

    calcular() {
      this.erro = ''

      const peso   = this.paraNumero(this.peso)
      const altura = this.paraNumero(this.altura)

      if (!this.nome.trim())               return (this.erro = 'Informe o nome.')
      if (isNaN(peso)   || peso   <= 0)    return (this.erro = 'Peso inválido.')
      if (isNaN(altura) || altura <= 0)    return (this.erro = 'Altura inválida.')

      const imc = peso / (altura * altura)
      this.resultado   = imc.toFixed(2)
      this.classificacao = this.classificar(imc)

      useImcStore().adicionar({
        nome: this.nome,
        peso,
        altura,
        imc: this.resultado,
        classificacao: this.classificacao,
        data: new Date().toLocaleString('pt-BR')
      })
    }
  }
}
</script>

<style>
h2 { margin-bottom: 30px; }

.container {
  text-align: center;
  padding: 8.5% 25% 0 25%;
}

.caixaButton {
  border: 4px solid gray;
  color: rgba(255, 255, 255, 0.801);
  background-color: rgb(0, 0, 0);
  padding: 3% 10%;
  margin-top: 20px;
  margin-bottom: 5px;
  cursor: pointer;
}

.caixaDiv {
  background-color: gray;
  padding: 3%;
}

.divDados {
  text-align: left;
  margin-left: 30px;
  margin-bottom: 20px;
}

.erro { color: darkred; font-weight: bold; }
.resultado { margin-top: 15px; }
</style>