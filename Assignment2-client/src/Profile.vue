<template>
  <section class="hero is-light is-large is-fullheight">


<!--    <div class="hero-head" v-if="this.userId === this.localStorageUserId">-->
<!--      <div class="card">-->
<!--        <div class="card-content">-->
<!--          <div class="media">-->
<!--            <div class="media-left">-->
<!--              <figure class="image is-48x48">-->
<!--                <img :src="'http://localhost:4941/api/v1/users/' + userId + '/photo'"  @error="onImageLoadFailure($event)"/>-->
<!--              </figure>-->
<!--            </div>-->
<!--            <div class="media-content">-->
<!--              <p class="title is-4">Name: {{user.name}}</p>-->
<!--              <p class="subtitle is-6">Email: {{user.email}}<br>-->
<!--                City: {{user.city}}<br>-->
<!--                Country: {{user.country}}-->
<!--              </p>-->
<!--            </div>-->

<!--            <b-button outlined v-on:click="routeToEditProfilePage"> Edit Profile </b-button>-->
<!--          </div>-->

<!--        </div>-->
<!--      </div>-->
<!--    </div>-->

    <div class="hero-head" v-if="this.userId === this.localStorageUserId">

      <div class="card">
        <div class="card-image">
          <br>
          <div class="content">
<!--            <figure class="image is-1by1">-->
              <img class="is-rounded" style="width: 200px; height: 200px" :src="'http://localhost:4941/api/v1/users/' + userId + '/photo'"  @error="onImageLoadFailure($event)">
<!--            </figure>-->
          </div>

        </div>
        <div class="card-content">
          <div class="media">
            <div class="media-content">
              <p class="title is-4">{{user.name}}    <b-button class="button is-link is-light" style="float:right" v-on:click="routeToEditProfilePage"> Edit Profile </b-button> </p>
              <p class="subtitle is-6">Email: {{user.email}} <br>
                City: {{user.city}}<br>
                Country: {{user.country}}</p>
            </div>
          </div>

        </div>
      </div>


    </div>



  </section>
</template>

<script>
  export default {
    data() {
      return {
        token: "",
        userId: "",
        user: "",
        localStorageUserId: localStorage.getItem('userId'),

      }
    },

    mounted: function () {
      this.getAuthToken()
      this.getUserIdInfo()
    },

    methods: {
      getAuthToken: function() {
        this.token = localStorage.getItem("authToken")
        console.log(this.token);
        },

      getUserIdInfo: function() {
        let url = (window.location.href.split("/"));
        this.userId = url[url.length - 1];

        this.$http.get('http://localhost:4941/api/v1/users/'+ this.userId, {
          headers: {'X-Authorization': localStorage.getItem("authToken")}
        })
          .then((response) => {
            this.user = response.data;
          })
          .catch((error) => {
            this.error = error;
            this.errorFlag = true;
          });
      },

      onImageLoadFailure (event) {
        event.target.src = "https://i.stack.imgur.com/l60Hf.png"
      },

      routeToEditProfilePage () {
        window.location = 'http://localhost:8080/profile/' + String(this.userId) + '/edit';
      }

    }


    }




</script>

<style scoped>

</style>
