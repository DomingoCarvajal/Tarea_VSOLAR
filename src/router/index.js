import { createRouter, createWebHistory } from 'vue-router'

import Cryptos from '../components/Cryptos.vue'

import Crypto from '../components/Crypto.vue'

const routes = [
    {
        path: "/",
        name: "home",
        component: Cryptos,
    },
    {
        path: "/crypto/:id",
        name: "crypto",
        component: Crypto,
    },
]

const router = createRouter({
    history: createWebHistory(),

    routes,
})

export default router
