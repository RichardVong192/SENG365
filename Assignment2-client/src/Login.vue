<template>
  <div class="hero-head">
    <div class="container has-text-left ">

    </div>
    <br>

    <div class="container" style="padding-right: 300px;padding-left: 300px">
      <p class="subtitle">
        Login
      </p>

      <section>

        <b-field label="Email" label-position="is-right">
          <b-input placeholder="Enter Email" v-model="email"></b-input>
        </b-field>

        <b-field label="Password" label-position="is-right">
          <b-input placeholder="Enter Password" v-model="password" type="password"></b-input>
        </b-field>

        <hr>

        <b-button outlined type="is-primary" v-on:click="login">
          Login
        </b-button>

      </section>
      <hr>
    </div>
  </div>

</template>

<script>
  export default {
    data() {
      return {
        email: "",
        password: "",

      }
    },

    mounted: function () {
      //TODO functions to call when page loads
    },

    methods: {
      login: function () {

        let loginData = {
          "email": this.email,
          "password": this.password
        }

        this.$http.post('http://localhost:4941/api/v1/users/login', loginData)
          .then(response => {
            console.log("WWWWWWWWWWWW")
            console.log(response.status)
            if (response.status === 200) {
              console.log(response)
              localStorage.setItem("authToken", response.data.token);
              localStorage.setItem("userId", response.data.userId);

              window.location = 'http://localhost:8080/profile/' + localStorage.getItem("userId");
            } else {
              alert("Invalid password or email")
            }
          }).catch((error) => {
          this.error = error;
          alert("Invalid password or email")
          this.errorFlag = true;
        });


      }
    }



  }
</script>

<style scoped>

</style>
