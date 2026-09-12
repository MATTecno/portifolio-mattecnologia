import Vue from 'vue'
import Vuetify from 'vuetify'
import SignaturePlugin from '@marcelodl49/zd-signature-input'
import 'vuetify/dist/vuetify.min.css'
import '@mdi/font/css/materialdesignicons.css'
import '@marcelodl49/zd-signature-input-vue/dist/signature-input-vue.css'
import './signature.css'

Vue.config.productionTip = false
Vue.use(Vuetify)
Vue.use(SignaturePlugin)

type SignaturePayload = string | { value?: string; component?: { value?: string } }
type SignatureComponent = Vue & { instance: { penColor: string } }

// This isolated entry intentionally does not initialize analytics or Session Replay.
new Vue({
  vuetify: new Vuetify({ icons: { iconfont: 'mdi' } }),
  data: () => ({
    signature: '',
    message: '',
    error: false,
    penColor: '#111827',
    embedded: new URLSearchParams(window.location.search).get('embedded') === '1',
  }),
  mounted() {
    // The published version uses tooltips without accessible button names.
    for (const [icon, label] of [['mdi-upload', 'Enviar imagem'], ['mdi-delete', 'Limpar desenho']]) {
      const button = this.$el.querySelector(`.${icon}`)?.closest('button')
      button?.setAttribute('aria-label', label)
    }
  },
  methods: {
    onPenColorChange(event: Event) {
      this.penColor = (event.target as HTMLSelectElement).value
      // Version 1.0.4 watches the Zeedhi model, not changes to the Vue penColor prop.
      // Update that public model in place so existing strokes remain on the canvas.
      const component = this.$refs.signatureInput as SignatureComponent | undefined
      if (component) component.instance.penColor = this.penColor
    },
    onInput(payload: SignaturePayload) {
      this.signature = typeof payload === 'string' ? payload : payload.value || payload.component?.value || ''
      this.message = ''
      this.error = false
    },
    onClear() {
      this.signature = ''
      this.error = false
      this.message = 'Desenho limpo. Você pode começar novamente.'
    },
    onError() {
      this.error = true
      this.message = 'Não foi possível carregar a imagem. Use um arquivo PNG ou JPEG válido de até 2 MB.'
    },
    async copyOutput() {
      if (!this.signature) return
      try {
        await navigator.clipboard.writeText(this.signature)
        this.error = false
        this.message = 'Resultado PNG copiado.'
      } catch {
        this.error = true
        this.message = 'Seu navegador não permitiu copiar. Use a prévia para conferir o resultado.'
      }
    },
  },
  render(h) {
    return h('v-app', [
      h('main', { class: 'signature-demo' }, [
        !this.embedded && h('nav', { attrs: { 'aria-label': 'Navegação da demonstração' } }, [
          h('a', { attrs: { href: '/recrutadores/#demonstracao' } }, 'Perfil profissional'),
          h('a', { attrs: { href: '/projetos/zd-signature-input/' } }, 'Estudo de caso'),
        ]),
        h('header', [
          h('p', { class: 'eyebrow' }, 'Componente publicado · Vue / Zeedhi'),
          h('h1', 'Desenhe, envie e confira'),
          h('p', 'Teste com um rabisco. A imagem é processada apenas no navegador, sem envio ou armazenamento.'),
        ]),
        h('div', { class: 'workspace' }, [
          h('section', { class: 'panel', attrs: { 'aria-label': 'Experimentar assinatura' } }, [
            h('h2', '1. Crie um exemplo'),
            h('p', { class: 'hint' }, 'Desenhe no quadro ou use o botão de envio para escolher uma imagem PNG ou JPEG de até 2 MB.'),
            h('label', { class: 'color-control' }, [
              'Cor do traço',
              h('select', {
                domProps: { value: this.penColor },
                on: { change: this.onPenColorChange },
              }, [h('option', { attrs: { value: '#111827' } }, 'Preto'), h('option', { attrs: { value: '#1d4ed8' } }, 'Azul')]),
            ]),
            h('p', { class: 'hint' }, 'A cor escolhida vale para os próximos traços.'),
            h('ZdSignatureInput', {
              ref: 'signatureInput',
              props: {
                name: 'assinatura-demo', label: 'Área de desenho', height: 210,
                showUpload: true, accept: 'image/png,image/jpeg', maxFileSize: 2097152,
                penColor: this.penColor, backgroundColor: '#ffffff',
              },
              on: { input: this.onInput, clear: this.onClear, error: this.onError },
            }),
          ]),
          h('section', { class: 'panel output', attrs: { 'aria-label': 'Resultado da assinatura' } }, [
            h('h2', '2. Veja o resultado'),
            h('div', { class: 'preview' }, [this.signature
              ? h('img', { attrs: { src: this.signature, alt: 'Prévia do desenho de exemplo' } })
              : h('p', 'Seu exemplo aparecerá aqui.')]),
            h('details', [
              h('summary', 'Ver saída para integração'),
              h('p', { class: 'hint' }, 'O componente entrega uma imagem PNG em Data URL, pronta para uso pela aplicação.'),
              h('code', this.signature ? `${this.signature.slice(0, 100)}…` : 'Nenhuma imagem gerada.'),
              h('button', { attrs: { type: 'button', disabled: !this.signature }, on: { click: this.copyOutput } }, 'Copiar PNG em Data URL'),
            ]),
          ]),
        ]),
        h('p', { class: this.error ? 'feedback error' : 'feedback', attrs: { role: 'status', 'aria-live': 'polite' } }, this.message),
      ]),
    ])
  },
}).$mount('#app')
