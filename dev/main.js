// A Calculadora rodando sozinha, numa janela falsa do RoqueOS com o sistema de
// desenvolvimento do SDK: o tamanho vem do app.json, o seletor troca entre os dez idiomas
// (o árabe vira da direita para a esquerda), `?idioma=ja-JP` abre direto em outro idioma e
// `?leve=1` mostra o app como o aparelho fraco vê. É o mesmo `mount` que o RoqueOS chama.
import { montarNaJanelaFalsa } from '@roqueos-apps/app-sdk/sistema-de-desenvolvimento'
import manifesto from '../app.json'
import app from '../src/index.js'

montarNaJanelaFalsa(app, { manifesto })
