<template>
  <section class="hero is-light is-large is-fullheight">
    <div class="hero-head">
      <nav class="navbar">
        <div class="container">
          <div class="navbar-brand">
            <a class="navbar-item">
              <h1 class="title">
                Website Title Goes Here
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
              <a class="navbar-item" href="http://localhost:8080">
                Home
              </a>
              <a class="navbar-item" href="http://localhost:8080/petitions">
                Petitions
              </a>
              <a class="navbar-item">
                Place Holder
              </a>
              <a class="navbar-item">
                Place Holder
              </a>
            </div>
          </div>
        </div>
      </nav>
    </div>


    <div class="hero-head">

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
          alert("Password must not be empty");
        } else {
          this.$http.post('http://localhost:4941/api/v1/users/register', bodyData)  //Register account
            .then((response) => {
              if(response.status === 201) {
                alert("Registration success");
                this.myId = response.data.userId;
                return response.data.userId;
              }
            }).then(userId => { // login into that account
            if (userId) {
              this.$http.post('http://localhost:4941/api/v1/users/login', loginData)
                .then(response => {
                  if (response.status === 200) {
                    localStorage.setItem("authToken", response.data.token)
                    if (this.file) {
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
        }

      }
    },


  }




</script>

<style scoped>

</style>
