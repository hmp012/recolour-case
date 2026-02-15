import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { ChakraProvider } from '@chakra-ui/vue-next'
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(ChakraProvider)

app.mount('#app')
