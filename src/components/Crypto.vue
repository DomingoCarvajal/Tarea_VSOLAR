<template>

<br>
<br>
<br>

<div class= "mt-20 mx-10">
    <div class= "grid gap-4 grid-cols-2">
        <div class="flex flex-row inline-block">
            <h1 class="text-5xl font-bold">{{currentCoin.name}} <small class="text-2xl gray_box">{{currentCoin.symbol}}</small></h1>
        </div>
        <div class= "flex flex-row-reverse inline-block">
            <div :class="{green_box: currentCoin.changePercent24Hr>0, red_box: currentCoin.changePercent24Hr<=0}"> 
                    <a v-if="currentCoin.changePercent24Hr>0">+</a>  
                    <a >{{Math.round(currentCoin.changePercent24Hr * 100) / 100}}% </a>
            </div>
            <div>
                <h1 class="text-4xl font-bold pt-2">${{Math.round(currentCoin.priceUsd * 100) / 100}}</h1>
            </div>
        </div>
    </div>

    <br>
    <br>

    <div class= "grid gap-4 grid-cols-3">

        <div >
            <p class="text-gray-500 text-2xl">Cap. de mercado</p>
            <h3 class="text-1xl font-bold">${{Math.round(currentCoin.marketCapUsd)}} </h3>
        </div>

         <div >
            <p class="text-gray-500 text-2xl">Oferta de mercado</p>
            <h3 class="text-1xl font-bold">${{Math.round(currentCoin.supply)}} </h3>
        </div>

         <div >
            <p class="text-gray-500 text-2xl">Volumen <small class="text-1xl gray_box ">24 Hrs</small></p>
            <h3 class="text-1xl font-bold">${{Math.round(currentCoin.volumeUsd24Hr)}} </h3>
        </div>



    </div>

    <br><br>

    <div class="mt-4 mb-4 flex grid gap-4 grid-cols-2">
        <p class="text-black-500 text-2xl pt-5">Precio de {{currentCoin.name}} por hora</p>

        <div class="mb-4 flex-row-reverse mx-30 grid gap-4 grid-cols-2">
            
            <div>
                <p>Desde</p>
                <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="number" placeholder="Buscar" v-model = "inicio_semanas">
                <p>días atrás</p>
            </div>
            <div>
                <p>Hasta</p>
                <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="number" placeholder="Buscar" v-model = "fin_semanas">
                <p>días atrás</p>
            </div>   
        </div>
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
                                Fecha
                            </th>

                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Precio (USD)
                            </th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        <tr v-for="(entry, i) in sorted_list()" :key="i">
                        <th scope="row">
                            <div class="flex items-center">
                            {{ ++i }}
                            </div>
                        </th>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <div class="flex items-center">
                            {{ unix_to_date(entry.time) }}
                            </div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <div class="flex items-center">
                            ${{ Math.round(entry.priceUsd * 100) / 100}}
                            </div>
                        </td>
                        </tr>
                    </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>

    <VueTailwindPagination
     :current="currentPage"
     :per-page="perPage"
     :total="total"
     @page-changed="pageChanged($event)"
     />


    


</div>


</template>

<script>

import { ref, onMounted, watch} from 'vue';

import { useRoute } from 'vue-router';

import {defineComponent} from 'vue';


import VueTailwindPagination from '@ocrv/vue-tailwind-pagination';



export default{
    components:{
        VueTailwindPagination,
    },
    setup () {

        const currentPage = ref(1);
        const perPage = 10;
        const total = ref(0);

        const inicio_semanas = ref(0);
        const fin_semanas = ref(21);


        var start_range = 0;
        var end_range = 0;




        const route = useRoute();
        const currentCoin = ref({});
        const API_URL = ref('https://api.coincap.io/v2/assets');
        const API_Coins = ref([]);
        const API_Coin = ref([])


        function unix_to_date(unix_timestamp){
            // Create a new JavaScript Date object based on the timestamp
            // multiplied by 1000 so that the argument is in milliseconds, not seconds.
            const a = new Date(unix_timestamp * 1000);
            const s = new Date(unix_timestamp).toLocaleDateString("en-US");
            const t = new Date(unix_timestamp).toLocaleTimeString("en-US");
            
            return s + ' ' + t;
        }

        function sorted_list(){
            const full_list = API_Coin.value.slice().sort(function(a, b) {
                return b.time - a.time;
            });

            start_range =  24 *(inicio_semanas.value);
            if (start_range < 0){
                start_range = 0;
            }

            // end_range = 24 * 7 * fin_semanas.value;

            end_range = 24 * fin_semanas.value;

            if (end_range >= API_Coin.value.length){
                end_range = API_Coin.value.length;
            }

            console.log("END RANGE");
            console.log(end_range);

            console.log("TOTAL_DATA_LENGTH");
            console.log( API_Coin.value.length);



            const ranged_list = full_list.slice(start_range, end_range);

            total.value = ranged_list.length;

            const start = (currentPage.value - 1) * perPage;

            const end = (currentPage.value) * perPage;
            

            return ranged_list.slice(start, end);
            
        }

        function pageChanged(pageChange){
            currentPage.value = pageChange;
        }



        onMounted( async () => {
            const response = await fetch(API_URL.value);
            const temp = await response.json();
            const id = route.params.id;
            API_Coins.value = temp.data;
            currentCoin.value = API_Coins.value[id - 1];
            const current_coin_id = currentCoin.value.id;
            const str_url ='https://api.coincap.io/v2/assets/' + currentCoin.value.id + '/history?interval=h1';
            const response_2 = await fetch(str_url);
            const temp_2 = await response_2.json();
            API_Coin.value = temp_2.data;
            console.log(API_Coin.value.length);

        })

        

        return {
            route,
            API_Coins,
            API_URL,
            currentCoin,
            API_Coin,
            unix_to_date,
            sorted_list,
            currentPage,
            perPage,
            total,
            pageChanged,
            fin_semanas,
            inicio_semanas,
        }
    } 
}

</script>