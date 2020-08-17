<template>
  <section class="hero is-light is-large is-fullheight">

    <div class="hero-head">
      <br>
      <div class="container" style="padding-right: 300px;padding-left: 300px">
        <p class="subtitle">
          Register
        </p>

        <section>
          <b-field label="Name" label-position="is-right">
            <b-input placeholder="Enter Name" v-model="name"></b-input>
          </b-field>

          <b-field label="Email" label-position="is-right">
            <b-input placeholder="Enter Email" v-model="email"></b-input>
          </b-field>

          <b-field label="Password" label-position="is-right">
            <b-input placeholder="Enter Password" v-model="password" type="password"></b-input>
          </b-field>

          <b-field label="City (optional)" label-position="is-right">
            <b-input placeholder="Enter City" v-model="city"></b-input>
          </b-field>

          <b-field label="Country (optional)" label-position="is-right">
            <b-input placeholder="Enter Country" v-model="country"></b-input>
          </b-field>


              <b-field label="Profile Picture (optional)">
                <b-upload v-model="file">
                  <a class="button is-primary">
                    <b-icon icon="upload"></b-icon>
                    <span>Click to upload</span>
                  </a>
                </b-upload>
                <span class="file-name" v-if="file">
                  {{ file.name }}
                </span>
              </b-field>

          <hr>

          <b-button outlined type="is-primary" v-on:click="registerUser">
            Register new user
          </b-button>

        </section>
        <hr>
      </div>
    </div>


  </section>
</template>


<script>
  export default {
    data() {
      return {
        name: "",
        email: "",
        password: "",
        city: null,
        country: null,
        file: null,
        myId: "",

      }
    },

    mounted: function () {
      //TODO functions to call when page loads
    },

    methods: {

      registerUser: function () {

        let bodyData = {
          "name": this.name,
          "email": this.email,
          "password": this.password,
        }

        let loginData = {
          "email": this.email,
          "password": this.password
        }

        let alist =["image/jpeg", "image/png", "image/gif"];


        if (this.city) {bodyData.city = this.city}
        if (this.country) {bodyData.country = this.country}
        if (this.file) {bodyData.file = this.file}

        if (this.name === "") {
          alert("Please enter a name");
        } else if (this.email === "") {
          alert("Please enter an email");
        } else if (/^[\w|.|-|_|\d]+@[\w|.|-|_|\d]+$/.test(this.email) === false) {
          alert("Email must be syntactically valid");
        } else if (this.password === "") {
          alert("Password must not be empty")
        } else if (this.file !== undefined && this.file !== null) {
          if (!(alist.includes(this.file.type))) {
            alert("Invalid image type - please upload a jpeg, png or gif")
          }
        }
          this.$http.post('http://localhost:4941/api/v1/users/register', bodyData)  //Register account
          .then((response) => {
            if(response.status === 201) {
              alert("Registration success");
              this.myId = response.data.userId;
              return response.data.userId;
            } else if (response.status === 400) {
              alert("Bad request: Email may be already in use");
            }
          }).then(userId => { // login into that account
            if (userId) {
              this.$http.post('http://localhost:4941/api/v1/users/login', loginData)
                .then(response => {
                  if (response.status === 200) {
                    localStorage.setItem("authToken", response.data.token);
                    localStorage.setItem("userId", response.data.userId);
                    if (this.file !== null || this.file != undefined) {
                      if (alist.includes(this.file.type)) {
                        this.$http.put('http://localhost:4941/api/v1/users/' + this.myId + '/photo', this.file, {
                          headers: {'X-Authorization': localStorage.getItem("authToken"),
                            'Content-Type': this.file.type
                          }}
                        )
                          .then((response) => {
                            console.log(response)
                          })
                      }
                    }
                    window.location = 'http://localhost:8080/profile/' + String(this.myId);
                  }

                })
              }
        })
        .catch(error => {
          if (error.response.status === 400) {
            alert("Bad request: Email may be already in use");
          }
        })
      }

      }


  }




</script>

<style scoped>

</style>
