<template>

  <section class="hero is-light is-large is-fullheight">
    <div class="hero-head">
      <br>

        <div v-for="petition in paginatedItems">

          <div class="card">
            <router-link :to="{name: 'petition', params: {petitionId: petition.petitionId}}">
              <header class="card-header">
                <p class="card-header-title">
                  Title: {{petition.title}}
                </p>

                <p class="card-header-title level-right">Petition Id: {{petition.petitionId}}</p>
              </header>
            </router-link>
            <br>

            <figure class="image container is-128x128">
              <img :src="'http://localhost:4941/api/v1/petitions/' + petition.petitionId + '/photo'" />
            </figure>

            <div class="content">
              <p>
                Category: {{petition.category}}
              <p>
                Author's name: {{petition.authorName}}
              </p>
              <p> Signatures: {{petition.signatureCount}}</p>
            </div>
            <br>
          </div>

          <br>
        </div>

        <b-pagination
          :total="total"
          :current.sync="current"
          :per-page="perPage"
        >
        </b-pagination>

      </div>

    <br>

  </section>
</template>

<script>
  export default {
    data() {
      return {
        error: "",
        errorFlag: false,
        petitions: [],
        current: 1,
        perPage: 10,
        queryParams: "",
      }
    },
    mounted: function () {
      this.getPetitions();
      this.getPetitionCategories();
    },

    methods: {
      /**
       * Gets the petitions data
       */
      getPetitions: function () {
        this.$http.get('http://localhost:4941/api/v1/petitions?' + 'authorId=' + localStorage.getItem('userId'))
          .then((response) => {
            this.petitions = response.data;
          })
          .catch((error) => {
            this.error = error;
            this.errorFlag = true;
          });
      },

      /**
       * Gets the petitions category data
       */
      getPetitionCategories: function () {
        this.$http.get('http://localhost:4941/api/v1/petitions/categories')
          .then((response) => {
            this.categories = response.data;
          })
          .catch((error) => {
            this.error = error;
            this.errorFlag = true;
          });
      },

    },

    computed: {
      /**
       * Filter the petitions by category and title dynamically
       */
      filteredPetitions: function () {
        return this.petitions.filter((petitions) => {
          return (petitions.title.toLowerCase().match(this.search.toLocaleLowerCase()) &&
            petitions.category.toLowerCase().match(this.categoryMultiselectValue.toLowerCase())
          );
        });
      },

      /**
       * The total length of items
       */
      total() {
        return this.petitions.length
      },

      /**
       Filtered items that are shown on the page
       */
      paginatedItems() {
        let page_number = this.current-1
        return this.petitions.slice(page_number * this.perPage, (page_number + 1) * this.perPage);
      }


    }
  }
</script>


<style scoped>

</style>
