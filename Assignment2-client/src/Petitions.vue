<template>

  <section class="hero is-light is-large is-fullheight">
    <div class="hero-head">

      <b-field style="margin:5px">
        <b-input type="search" v-model="search" placeholder="Search Titles" @keyup.native.enter="getPetitionFilter"></b-input>
        <div>
          <b-button outlined v-on:click="getPetitionFilter"> Search Titles </b-button>
        </div>
        <div>
          <b-button outlined v-on:click="getPetitions" style="margin-left:5px"> Reset search filter </b-button>
        </div>
      </b-field>


      <div class="buttons" style="margin:5px" > Sort by Category:
        <b-select v-model="categoryMultiselectValue" @input="getPetitionFilter">
          <option value="0">None</option>
          <option v-for ="category in categories" v-bind:value="category.categoryId"> {{category.name}} </option>
        </b-select>
        <span>
        </span>
      </div>


      <div class="buttons" style="margin:5px">Sort By:
        <div>
          <b-button outlined v-on:click="sortByAsc('title')"> Sort by Title A-Z </b-button>
        </div>
        <div>
          <b-button outlined  v-on:click="sortByDesc('title')"> Sort by Title Z-A </b-button>
        </div>
        <div>
          <b-button outlined v-on:click="sortByDesc('signatureCount')"> Sort by Signature Count Desc </b-button>
        </div>
        <div>
          <b-button outlined v-on:click="sortByAsc('signatureCount')"> Sort by Signature Count Asc </b-button>
        </div>
      </div>
      <div>


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

<!--            <footer class="card-footer">-->
<!--              <a v-if="token !== null" class="card-footer-item">Sign</a>-->
<!--              <a v-if="petition.authorName === user.name" v-bind:href="'http://localhost:8080/petitions/' + petition.petitionId + '/edit'" class="card-footer-item">Edit</a>-->
<!--              <a v-if="petition.authorName === user.name" class="card-footer-item">Delete</a>-->
<!--            </footer>-->

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
        search: "",
        categories: [],
        categoryMultiselectValue: "0",
        current: 1,
        perPage: 10,
        queryParams: "",
        token: localStorage.getItem("authToken"),
        userId: localStorage.getItem("userId"),
        user: ""
      }
    },
    mounted: function () {
      this.getPetitions();
      this.getPetitionCategories();
      this.getUserIdInfo();
    },

    methods: {
      /**
       * Gets the petitions data
       */
      getPetitions: function () {
        this.$http.get('http://localhost:4941/api/v1/petitions')
          .then((response) => {
            this.petitions = response.data;
          })
          .catch((error) => {
            this.error = error;
            this.errorFlag = true;
          });
      },

      getUserIdInfo: function() {

        this.$http.get('http://localhost:4941/api/v1/users/'+ this.userId)
          .then((response) => {
            this.user = response.data;
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

      /**
       * Gets the petitions with title filter
       */
      getPetitionFilter: function () {
        this.queryParams = "";
        if (this.search.length !== 0) {
          this.queryParams += "q=" + this.search + '&';
        }
        if (this.categoryMultiselectValue !== "0") {
          this.queryParams += 'categoryId=' + this.categoryMultiselectValue;
        }

        this.$http.get('http://localhost:4941/api/v1/petitions?' + this.queryParams)
          .then((response) => {
            this.petitions = response.data;
          })
          .catch((error) => {
            this.error = error;
            this.errorFlag = true;
          });
      },


      /**
       * Sorts two items a and b and reorders the array alphabetically
       * @param prop Property the user passes in
       */
      sortByAsc(property) {
        this.petitions.sort((a, b) => a[property] < b[property] ? -1 : 1)   //Returns 1 if need to change else -1
      },

      /**
       * Sorts two items a and b and reorders the array in descending order
       * @param prop Property the user passes in
       */
      sortByDesc(property) {
        this.petitions.sort((a, b) => a[property] > b[property] ? -1 : 1)   //Returns 1 if need to change else -1
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
