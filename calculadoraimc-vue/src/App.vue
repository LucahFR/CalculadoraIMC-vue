<template>
  <div class="container">
    <div class="caixaDiv">
      <h2>Calculadora IMC</h2>

      <div class="divDados">
        Nome
        <input
          v-model="nome"
          type="text"
          placeholder="Ex: Paulo"
          @input="filtrarNome"
        >
      </div>

      <div class="divDados">
        Peso (kg)
        <input v-model="peso" type="text" inputmode="decimal" placeholder="Ex: 63">
      </div>

      <div class="divDados">
        Altura (m)
        <input v-model="altura" type="text" inputmode="decimal" placeholder="Ex: 1.74">
      </div>

      <div class="resultado">
        <p>
          <strong>{{ nome || 'Visitante' }}</strong>,
          seu IMC é <strong>{{ resultado }}</strong>
        </p>
        <p v-if="classificacao">{{ classificacao }}</p>
        <p v-if="erroLimite" class="erro-limite">{{ erroLimite }}</p>
      </div>

      <button
        class="caixaButton"
        :disabled="imc === null"
        @click="salvar"
      >
        Salvar no histórico
      </button>

      <p v-if="mensagem" :class="['mensagem', mensagemTipo]">
        {{ mensagem }}
      </p>
    </div>

    <historicoImc @limpar="onLimparHistorico" />
  </div>
</template>

<script>
import historicoImc from './components/historicoImc.vue'
import { useImcStore } from './stores/imc'

const ALTURA_MAX = 2.72
const PESO_MAX   = 635

export default {
  name: 'App',
  components: { historicoImc },

  data() {
    return {
      nome: '',
      peso: '',
      altura: '',
      mensagem: '',
      mensagemTipo: '',
      timerMensagem: null
    }
  },

  mounted() {
    const formSalvo = sessionStorage.getItem('formTemp')
    if (formSalvo) {
      try {
        const { nome, peso, altura } = JSON.parse(formSalvo)
        this.nome   = nome   || ''
        this.peso   = peso   || ''
        this.altura = altura || ''
      } catch (e) { /* ignora */ }
      sessionStorage.removeItem('formTemp')
    }

    const msgSalva = sessionStorage.getItem('msgTemp')
    if (msgSalva) {
      try {
        const { texto, tipo } = JSON.parse(msgSalva)
        this.mostrarMensagem(texto, tipo)
      } catch (e) { /* ignora */ }
      sessionStorage.removeItem('msgTemp')
    }
  },

  computed: {
    imc() {
      const p = this.paraNumero(this.peso)
      const a = this.paraNumero(this.altura)
      if (isNaN(p) || p <= 0) return null
      if (isNaN(a) || a <= 0) return null
      if (a > ALTURA_MAX) return null
      if (p > PESO_MAX)   return null
      return p / (a * a)
    },
    resultado() {
      return this.imc === null ? 'N/A' : this.imc.toFixed(2)
    },
    classificacao() {
      return this.imc === null ? '' : this.classificar(this.imc)
    },
    erroLimite() {
      const p = this.paraNumero(this.peso)
      const a = this.paraNumero(this.altura)
      if (!isNaN(a) && a > ALTURA_MAX) return `Altura máxima permitida: ${ALTURA_MAX} m.`
      if (!isNaN(p) && p > PESO_MAX)   return `Peso máximo permitido: ${PESO_MAX} kg.`
      return ''
    }
  },

  methods: {
    limparNome(valor) {
      return String(valor)
        .replace(/[^A-Za-zÀ-ÖØ-öø-ÿ\s]/g, '')
        .toLowerCase()
        .replace(/(^|\s)\S/g, l => l.toUpperCase())
        .trim()
        .replace(/\s+/g, ' ')
    },
    filtrarNome() {
      this.nome = this.limparNome(this.nome)
    },
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

    salvar() {
      if (this.imc === null) return

      const salvou = useImcStore().adicionar({
        nome: this.limparNome(this.nome) || 'Visitante',
        peso: this.paraNumero(this.peso),
        altura: this.paraNumero(this.altura),
        imc: this.resultado,
        classificacao: this.classificacao,
        data: new Date().toLocaleString('pt-BR')
      })

      if (salvou) {
        this.recarregarPagina('Salvo no histórico!', 'sucesso')
      } else {
        this.mostrarMensagem('Esse peso ou altura já está no histórico.', 'erro')
      }
    },

    onLimparHistorico() {
      this.recarregarPagina('Histórico limpo!', 'sucesso')
    },

    recarregarPagina(texto, tipo) {
      sessionStorage.setItem('formTemp', JSON.stringify({
        nome:   this.nome,
        peso:   this.peso,
        altura: this.altura
      }))
      sessionStorage.setItem('msgTemp', JSON.stringify({ texto, tipo }))
      location.reload()
    },

    mostrarMensagem(texto, tipo) {
      clearTimeout(this.timerMensagem)
      this.mensagem = texto
      this.mensagemTipo = tipo
      this.timerMensagem = setTimeout(() => {
        this.mensagem = ''
      }, 2500)
    }
  }
}
</script>

<style>
h2 { margin-bottom: 30px; }

body{
  background-color:antiquewhite ;
}

.container {
  text-align: center;
  padding: 8.5% 25% 0 25%;
  
}

.caixaButton {
  color: rgba(255, 255, 255, 0.801);
  background-color: rgb(0, 0, 0);
  padding: 3% 10%;
  margin-top: 20px;
  margin-bottom: 5px;
  cursor: pointer;
}
.caixaButton:disabled { opacity: 0.4; cursor: not-allowed; }

.caixaDiv { background-color: #c0c0c0; padding: 2%; margin-left: 13vw ; margin-right: 10dvw; width: 400px;}
.divDados { text-align: left; margin-left: 30px; margin-bottom: 20px; }
.resultado { margin-top: 15px; }

.mensagem {
  margin-top: 10px;
  font-weight: bold;
}
.mensagem.ok    { color: #0a6b2a; }
.mensagem.erro { color: #b40000; }
</style>