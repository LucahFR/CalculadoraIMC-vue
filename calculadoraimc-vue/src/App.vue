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

    <historicoImc :lista="historico" @limpar="limparHistorico" />
  </div>
</template>

<script>
import historicoImc from './components/historicoImc.vue'

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
      timerMensagem: null,
      historico: []
    }
  },

  mounted() {
    // pega o historico salvo
    var salvo = localStorage.getItem('historicoImc')
    if (salvo) {
      this.historico = JSON.parse(salvo)
    }
  },

  computed: {
    imc() {
      var p = this.paraNumero(this.peso)
      var a = this.paraNumero(this.altura)
      if (isNaN(p) || p <= 0) return null
      if (isNaN(a) || a <= 0) return null
      if (a > 2.72) return null
      if (p > 635) return null
      return p / (a * a)
    },
    resultado() {
      if (this.imc == null) {
        return 'N/A'
      }
      return this.imc.toFixed(2)
    },
    classificacao() {
      if (this.imc == null) {
        return ''
      }
      if (this.imc < 18.5) return 'Abaixo do peso'
      if (this.imc < 25) return 'Peso normal'
      if (this.imc < 30) return 'Sobrepeso'
      if (this.imc < 35) return 'Obesidade grau I'
      if (this.imc < 40) return 'Obesidade grau II'
      return 'Obesidade grau III'
    },
    erroLimite() {
      var p = this.paraNumero(this.peso)
      var a = this.paraNumero(this.altura)
      if (!isNaN(a) && a > 2.72) {
        return 'Altura máxima permitida: 2.72 m.'
      }
      if (!isNaN(p) && p > 635) {
        return 'Peso máximo permitido: 635 kg.'
      }
      return ''
    }
  },

  methods: {
    filtrarNome() {
      // tira numeros e simbolos do nome
      this.nome = this.nome.replace(/[^A-Za-zÀ-ÖØ-öø-ÿ\s]/g, '')
    },
    paraNumero(valor) {
      return parseFloat(String(valor).replace(',', '.'))
    },
    salvar() {
      if (this.imc == null) {
        return
      }

      var pesoNum = this.paraNumero(this.peso)
      var alturaNum = this.paraNumero(this.altura)

      // ve se ja tem
      for (var i = 0; i < this.historico.length; i++) {
        if (this.historico[i].peso == pesoNum && this.historico[i].altura == alturaNum) {
          this.mostrarMensagem('Esse peso ou altura já está no histórico.', 'erro')
          return
        }
      }

      var registro = {
        nome: this.nome || 'Visitante',
        peso: pesoNum,
        altura: alturaNum,
        imc: this.resultado,
        classificacao: this.classificacao,
        data: new Date().toLocaleString('pt-BR')
      }

      this.historico.push(registro)
      localStorage.setItem('historicoImc', JSON.stringify(this.historico))

      console.log('salvou:', registro)

      this.mostrarMensagem('Salvo no histórico!', 'ok')
    },
    limparHistorico() {
      this.historico = []
      localStorage.removeItem('historicoImc')
      this.mostrarMensagem('Histórico limpo!', 'ok')
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