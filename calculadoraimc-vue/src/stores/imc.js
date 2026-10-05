import { defineStore } from 'pinia'

export const useImcStore = defineStore('imc', {
  state: () => ({
    historico: JSON.parse(localStorage.getItem('historicoImc') || '[]')
  }),
  actions: {
    adicionar(registro) {
      this.historico.push(registro)
      localStorage.setItem('historicoImc', JSON.stringify(this.historico))
    },
    limpar() {
      this.historico = []
      localStorage.removeItem('historicoImc')
    }
  }
})