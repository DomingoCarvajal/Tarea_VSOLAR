<!-- ./components/VacationCard.vue -->
<template>
  <div>
    <img class="rounded" :src="img" :alt="imgAlt" >
    <div class="mt-2">
      <div>
        <div class="text-xs text-gray-600 uppercase font-bold">{{ eyebrow }}</div>
        <div class="font-bold text-gray-700 leading-snug">
          <a :href="url" class="hover:underline">{{ title }}</a>
        </div>
        <div class="mt-2 text-sm text-gray-600">{{ pricing }}</div>
      </div>
    </div>
  </div>

  <button class="btn-indigo">
    Click me
  </button>

  <form>
    <div class="form-group">
      <label for="name">Name</label>
      <input
        type="text"
        placeholder="Search your coin!"
        v-model="name"
        class="form-control"
      />
    </div>
    <div class="form-group">
      <label for="score">Score</label>
      <input
        type="number"
        placeholder="Ex: 53453"
        v-model="score"
        class="form-control"
      />
    </div>
    <button type="button" @click="onSubmit" class="btn-indigo">
      Submit
    </button>
  </form>

  <table class='min-w-max divide-y divide-gray-100 shadow-sm border-gray-200 border'>
    <thead>
      <tr>
        <th scope="col">#</th>
        <th scope="col">CrtyptoCurrency</th>
        <th scope="col">Price</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(entry, i) in sortedList" :key="i">
        <th scope="row">{{ ++i }}</th>
        <td>{{ entry.name }}</td>
        <td>{{ entry.score }}</td>
      </tr>
    </tbody>
  </table>
</template>


<script>
export default {
  props: ['img', 'imgAlt', 'eyebrow', 'title', 'pricing', 'url'],
  name: "Leaderboard",
  data: () => ({ name: "", score: "", allScores: [] }),
  computed: {
    sortedList: function() {
      return this.allScores.slice().sort(function(a, b) {
        return b.score - a.score;
      });
    },
  },
  methods: {
    onSubmit() {
      this.allScores.push({ name: this.name, score: this.score });
      this.clearForm();
    },
    clearForm() {
      this.name = "";
      this.score = "";
    },
  },
};
</script>