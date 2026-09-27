// A porta de entrada da Calculadora: o app como o app-sdk entende um app.
//
// `montar` recebe o elemento, o sistema e se a janela está ativa, cria um app Vue próprio
// dentro do elemento e devolve `{ ativar, desmontar }`. O app é próprio, e não um componente
// dentro do app do RoqueOS, porque é assim que ele roda igual nos três lugares: no RoqueOS,
// sozinho no `yarn dev` do repo e no teste. Nenhuma store, nenhum plugin e nenhum estilo
// global do RoqueOS chega aqui dentro; o que a Calculadora precisa vem pelo `sistema`.

import { createApp, reactive } from 'vue'
import { definirApp } from '@roqueos-apps/app-sdk'
import Calculadora from './Calculadora.vue'
import { carregarTextos } from './textos.js'

export default definirApp({
  id: 'calculator',
  capacidades: [],
  montar(el, sistema, { ativo }) {
    const estado = reactive({ ativo, idioma: sistema.idioma.atual(), textos: null })
    let app = null
    let desmontado = false
    // Duas trocas de idioma seguidas podem voltar fora de ordem; vale a última.
    let pedido = 0

    const trocarIdioma = async (idioma) => {
      const meu = ++pedido
      const textos = await carregarTextos(idioma)
      if (desmontado || meu !== pedido) return
      estado.idioma = idioma
      estado.textos = textos
    }
    const pararIdioma = sistema.idioma.aoMudar((novo) => {
      trocarIdioma(novo).catch((erro) =>
        console.error('[calculadora] textos do idioma', novo, erro),
      )
    })

    // O app só monta com o texto na mão: montar antes mostraria o histórico sem rótulo
    // por um instante.
    trocarIdioma(estado.idioma)
      .catch((erro) => console.error('[calculadora] textos do idioma', estado.idioma, erro))
      .finally(() => {
        if (desmontado) return
        app = createApp(Calculadora, { sistema, estado })
        app.mount(el)
      })

    return {
      ativar(sim) {
        estado.ativo = sim
      },
      desmontar() {
        desmontado = true
        pararIdioma?.()
        app?.unmount()
        app = null
      },
    }
  },
})
