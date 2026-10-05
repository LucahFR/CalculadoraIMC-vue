import { defineStore } from 'pinia'

export const useImcStore = defineStore('imc', {
  state: () => ({
    historico: JSON.parse(localStorage.getItem('historicoImc') || '[]')
  }),

  actions: {
    adicionar(registro) {
      const jaExiste = this.historico.some(
        item => item.peso === registro.peso && item.altura === registro.altura
      )

      if (jaExiste) return false

      this.historico.push(registro)
      localStorage.setItem('historicoImc', JSON.stringify(this.historico))
      return true
    },

    limpar() {
      this.historico = []
      localStorage.removeItem('historicoImc')
    }
  }
})