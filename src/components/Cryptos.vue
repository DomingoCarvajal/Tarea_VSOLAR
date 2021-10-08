<template>
    <div class="w-full max-w-xs">
    <form class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="username">
            Filtro de criptomonedas
        </label>
        <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" type="text" placeholder="Buscar" v-model = "searchedCoin">
        </div>
    </form>
    </div>

    <div class="flex flex-col">
        <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                <div class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">



                    <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                #
                            </th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Symbol
                            </th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Nombre
                            </th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Precio (USD)
                            </th>
                            <th scope="col" class="relative px-6 py-3">
                                <span class="sr-only">Ver</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        <tr v-for="(entry, i) in filteredList()" :key="i">
                        <th scope="row">
                            <div class="flex items-center">
                            {{ ++i }}
                            </div>
                        </th>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <div class="flex items-center">
                            {{ entry.symbol }}
                            </div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <div class="flex items-center">
                            {{ entry.name }}
                            </div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <div class="flex items-center">
                            ${{ Math.round(entry.priceUsd * 100) / 100}}
                            </div>
                        </td>
                        <td class="px-6 py-4 text-blue-500 whitespace-nowrap text-right text-sm font-medium">
                            <router-link :to="{name: 'crypto', params: {id: i} }">Ver</router-link>
                        </td>
                        </tr>
                    </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>


</template>

<script>

import { ref, onMounted } from 'vue';

export default {

    setup() {

        const searchedCoin = ref('');
        const allCoins = ref([]);
        const API_URL = ref('https://api.coincap.io/v2/assets');
        const API_Coins = ref([]);
        const users = ref(null);
        function onSubmit() {
            allCoins.value.push({
                name: searchedCoin.value,
                score: Math.round(Math.random()*100)/100,
            })
        }

        function filteredList(){
            return API_Coins.value.filter(function(obj){
                if ((obj.name.toLowerCase().includes(searchedCoin.value.toLowerCase()))){
                    return true
                }
                return false;
            });

        }

        onMounted( async () => {
            const response = await fetch(API_URL.value);
            const temp = await response.json();
            API_Coins.value = temp.data;
        })


        return {
            allCoins,
            searchedCoin,
            API_Coins,
            API_URL,
            users,
            onSubmit,
            filteredList,
        }
    }

}

</script>