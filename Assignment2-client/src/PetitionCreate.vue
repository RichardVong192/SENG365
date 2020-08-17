<template>

  <div class="hero-head">

    <br>
    <h1 class="title">
      Create a new petition
    </h1>

    <div class="container" style="padding-left: 300px; padding-right: 300px">

      <section>
        <b-field label="Petition title" label-position="is-right">
          <b-input placeholder="Enter title" v-model="title"></b-input>
        </b-field>

        <b-field label="Petition Description">
          <b-input placeholder="Enter Description" maxlength="1000" type="textarea" v-model="description"></b-input>
        </b-field>

        <div class="buttons" > Sort by Category:
          <b-select v-model="categoryId">
            <option value="0">None</option>
            <option v-for ="category in categories" v-bind:value="category.categoryId"> {{category.name}} </option>
          </b-select>
          <span>
        </span>
        </div>

        <b-field label="Petition Image">
          <b-upload v-model="file">
            <a class="button is-primary">
              <b-icon icon="upload"></b-icon>
              <span>Click to upload petition photo</span>
            </a>
          </b-upload>
          <span class="file-name" v-if="file">
                  {{ file.name }}
          </span>
        </b-field>

        <br>

        <b-field label="Select a closing date (optional)">
          <b-datepicker
            placeholder="Click to select..."
            :min-date="minDate"
            :max-date="maxDate"
            v-model="closingDate">
          </b-datepicker>
        </b-field>
        <br>

        <br>
        <br>

        <b-button outlined type="is-primary" v-on:click="createPetition">
          Create Petition
        </b-button>

      </section>
      <hr>


    </div>

  </div>
</template>

<script>
  export default {
    data() {

      const today = new Date();

      return {
        title: "",
        description: "",
        categoryId: "0",
        closingDate: "",
        file: "",
        categories: [],
        petitionId: "",
        date: new Date(),
        minDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1),
        maxDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 365),

      }
    },

    mounted: function () {
      this.getPetitionCategories();
    },

    methods: {
      createPetition: function () {

        let bodyData = {
          "title": this.title,
          "description": this.description,
          "categoryId": this.categoryId,
        }

        if (this.closingDate) {

          let formattedDate = "";
          let day =  this.closingDate.getDate();
          let month = this.closingDate.getMonth() + 1;
          let year = this.closingDate.getFullYear();

          let hour = this.closingDate.getHours()
          let min = this.closingDate.getMinutes()
          let sec = this.closingDate.getSeconds()
          let milisec = this.closingDate.getMilliseconds()

          if(day < 10) {
            day = '0' + day
          }
          if(month < 10) {
            month = '0' + month
          }
          if(hour < 10) {
            hour = '0' + hour
          }
          if(min < 10) {
            min = '0' + sec
          }
          if(sec < 10) {
            sec = '0' + sec
          }
          if (milisec < 10) {
            milisec = '0' + milisec
          }
          if (milisec < 100) {
            milisec = '0' + milisec
          }

          formattedDate += year + '-' + month + '-' + day + ' ' + hour + ':' + min + ':' + sec + '.' + milisec

          bodyData.closingDate = formattedDate
        }
        if (this.file) {
          bodyData.file = this.file
        }

        let alist =["image/jpeg", "image/png", "image/gif"];

        if (this.title === ""){
          alert("Please enter a title")
        } else if (this.description === "") {
          alert("Please enter a description")
        } else if (this.categoryId === "0") {
          alert("Please select a category Id")
        } else if (this.file === "") {
          alert("Please upload a petition image")
        } else if (!(alist.includes(this.file.type))) {
          alert("Invalid image type - please upload a jpeg, png or gif")
        } else {
          this.$http.post('http://localhost:4941/api/v1/petitions/', bodyData, {
            headers: {'X-Authorization': localStorage.getItem("authToken")}
          }).then((response) => {
            if(response.status === 201) {
              alert("Petition Created");
              this.petitionId = response.data.petitionId
            } else if (response.status === 400) {
              alert("Bad request");
            }
            if (alist.includes(this.file.type)) {
              this.$http.put('http://localhost:4941/api/v1/petitions/' + this.petitionId + '/photo', this.file, {
                headers: {'X-Authorization': localStorage.getItem("authToken"),
                  'Content-Type': this.file.type
                }}
              )
                .then((response) => {
                  console.log(response)
                })
            }
            this.$http.post('http://localhost:4941/api/v1/petitions/' + this.petitionId + '/signatures', {}, {
              headers: {'X-Authorization': localStorage.getItem("authToken")}
            });

            window.location = 'http://localhost:8080/petitions/' + this.petitionId
          })
        }

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

    }

  }

</script>

<style scoped>

</style>
