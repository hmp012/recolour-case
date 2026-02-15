import { createApp } from 'vue'
import ChakraVueNext from '@chakra-ui/vue-next'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'

const app = createApp(App)

app.use(ChakraVueNext)
app.use(router)
app.use(createPinia())

app.mount('#app')
