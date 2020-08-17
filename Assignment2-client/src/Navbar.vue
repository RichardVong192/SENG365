<template>
  <nav class="navbar is-info">
    <div class="container">
      <div class="navbar-brand">
        <a style="margin: 5px">
          <h1 class="title" style="color: whitesmoke">
            PetitionDotCom
          </h1>
        </a>
        <span class="navbar-burger burger" data-target="navbarMenuHeroB">
            <span></span>
            <span></span>
            <span></span>
          </span>
      </div>
      <div id="navbarMenuHeroB" class="navbar-menu">
        <div class="navbar-end">
          <a class="navbar-item" href="http://localhost:8080" v-if="token === null">
            Register
          </a>
          <a class="navbar-item" href="http://localhost:8080/login" v-if="token === null">
            Login
          </a>
          <a class="navbar-item" href="http://localhost:8080/petitions">
            All Petitions
          </a>
          <a class="navbar-item" v-if="token !== null" href="http://localhost:8080/myPetitions">
            My petitions
          </a>
          <a v-if="token !== null" class="navbar-item" href="http://localhost:8080/petitionCreate">
            Create Petition
          </a>
          <a v-if="token !== null" class="navbar-item" v-bind:href="'http://localhost:8080/profile/' + userId">
            My Profile
          </a>
          <a v-if="token !== null" class="navbar-item" href="http://localhost:8080" v-on:click="logout">
            Logout
          </a>

        </div>
      </div>
    </div>
  </nav>
</template>

<script>
  export default {
    data() {
      return {
        token: "",
        userId: localStorage.getItem("userId"),
      }
    },


    mounted: function () {
      this.getAuthToken()
    },

    methods: {
      getAuthToken: function() {
        this.token = localStorage.getItem("authToken")
        console.log(this.token);
      },

      logout: function() {

        this.$http.post('http://localhost:4941/api/v1/users/logout', {},{
          headers: {'X-Authorization': localStorage.getItem("authToken")}
        }).then((response) => {
          if(response.status === 200) {
            alert("User Logged out!");
          }
        });

        localStorage.removeItem("authToken");
        localStorage.removeItem("userId");
        this.token = '';
        this.userid = '';

      }

    }


    }
</script>

<style scoped>

</style>
