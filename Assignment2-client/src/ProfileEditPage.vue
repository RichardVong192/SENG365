<template>
  <section class="hero is-light is-large is-fullheight">


    <div class="hero-head" v-if="this.userId === this.localStorageUserId">
      <div class="card">
        <div class="card-content">
          <div class="media">
            <div class="media-left">
              <figure class="image is-48x48">
                <img :src="'http://localhost:4941/api/v1/users/' + userId + '/photo'"  @error="onImageLoadFailure($event)"/>
              </figure>
            </div>
            <div class="media-content">
              <p class="title is-4">Name: {{user.name}}</p>
              <p class="subtitle is-6">Email: {{user.email}}<br>
                City: {{user.city}}<br>
                Country: {{user.country}}
              </p>
            </div>

          </div>

        </div>
      </div>

      <div class="container" style="padding-left: 50px; padding-right: 50px">

        <section>
          <b-field label="Name" label-position="is-right">
            <b-input placeholder="Enter name" v-model="name"></b-input>
          </b-field>
          <div>
          </div>

          <b-field label="Email" label-position="is-right">
            <b-input placeholder="Enter Email" v-model="email"></b-input>
          </b-field>

          <b-field label=" New Password" label-position="is-right">
            <b-input placeholder="Enter Password" v-model="newPassword" type="password"></b-input>
          </b-field>

          <b-field label="Current Password" label-position="is-right">
            <b-input :disabled="newPassword === ''" placeholder="Enter Password" v-model="currentPassword" type="password"></b-input>
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
                <span>Click to upload new profile photo</span>
              </a>
            </b-upload>
            <span class="file-name" v-if="file">
                  {{ file.name }}
            </span>
          </b-field>

          <b-button v-on:click="removeProfilePicture"> Click to remove profile picture</b-button>
          <hr>

          <b-button outlined type="is-primary" v-on:click="editUser">
            Submit Changes
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
        token: "",
        userId: "",
        user: "",
        localStorageUserId: localStorage.getItem('userId'),
        name: "",
        email: "",
        newPassword: "",
        currentPassword: "",
        city: "",
        country: "",
        file: "",
        myId: "",

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
        this.userId = url[url.length - 2];

        this.$http.get('http://localhost:4941/api/v1/users/'+ this.userId, {
          headers: {'X-Authorization': localStorage.getItem("authToken")}
        })
          .then((response) => {
            this.user = response.data;
            this.name = response.data.name;
            this.email = response.data.email;
            this.city = response.data.city;
            this.country = response.data.country;
            this.file = response.data.file;
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
      },

      removeProfilePicture() {
        this.file = null;
      },


      editUser: function () {

        let bodyData = {}

        if (this.name) {bodyData.name = this.name}
        if (this.email) {bodyData.email = this.email}
        if (this.newPassword) {
          bodyData.password = this.newPassword;
          bodyData.currentPassword = this.currentPassword}
        if (this.city) {bodyData.city = this.city}
        if (this.country) {bodyData.country = this.country}
        if (this.file) {bodyData.file = this.file}

        let loginData = {
          "email": this.email,
          "password": this.password
        }

        let alist =["image/jpeg", "image/png", "image/gif"];

        if (this.name === "") {
          alert("Please enter a name");
        } else if (this.email === "") {
          alert("Please enter an email");
        } else if (/^[\w|.|-|_|\d]+@[\w|.|-|_|\d]+$/.test(this.email) === false) {
          alert("Email must be syntactically valid");
        } else if ((bodyData.password !== "") && (bodyData.currentPassword === "")) {
          alert("Current password must not be empty when submitting a new password");
        } else if (this.file !== undefined && this.file !== null) {
          if (!(alist.includes(this.file.type))) {
            alert("Invalid image type - please upload a jpeg, png or gif")
          }
        }
        this.$http.patch('http://localhost:4941/api/v1/users/' + this.userId, bodyData, {
          headers: {'X-Authorization': localStorage.getItem("authToken")}
        }).then((response) => {
            if(response.status === 200) {
              alert("Profile changes submitted");
            } else if (response.status === 400) {
              alert("Bad request: Email may be already in use");
            }
          })
          .catch(error => {
            if (error.response.status === 400) {
              alert("Bad request: Email may be already in use");
            }
          })

        console.log("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")
            if (this.file !== undefined && this.file !== null) {
              console.log("XXXXXXXXXXXXXXXXX")
              if (alist.includes(this.file.type)) {
                console.log("WWWWWWWWWWW")
                this.$http.put('http://localhost:4941/api/v1/users/' + this.userId + '/photo', this.file, {
                  headers: {'X-Authorization': localStorage.getItem("authToken"),
                    'Content-Type': this.file.type
                  }}
                )
                  .then((response) => {
                    console.log(response)
                  })
              }
            } else if (this.file === null || this.file === undefined) {
              this.$http.delete('http://localhost:4941/api/v1/users/' + this.userId + '/photo', {
                headers: {'X-Authorization': localStorage.getItem("authToken")
                }}
              )
            }
        window.location = 'http://localhost:8080/profile/' + String(this.userId);


      }


    }


  }




</script>

<style scoped>

</style>
