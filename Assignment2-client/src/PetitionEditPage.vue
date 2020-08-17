<template>

  <div class="hero-head" v-if="this.authorId == this.localStorageUserId">

    <br>
    <h1 class="title">
      Edit Petition
    </h1>

    <div class="container" style="padding-left: 300px; padding-right: 300px">

      <section>
        <b-field label="Petition title" label-position="is-right">
          <b-input placeholder="Enter title" v-model="title"></b-input>
        </b-field>

        <b-field label="Petition Description">
          <b-input placeholder="Enter Description" maxlength="1000" type="textarea" v-model="description"></b-input>
        </b-field>

        <div class="buttons" style="margin:5px" > Petition Category (current: {{petitionInfo.category}})
          <b-select v-model="categoryMultiselectValue">
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
              <span>Click to upload new petition photo</span>
            </a>
          </b-upload>
          <span class="file-name" v-if="file">
                  {{ file.name }}
          </span>
        </b-field>

        <br>

        <b-field label="Select a closing date">
          <b-datepicker
            placeholder="Click to select..."
            :min-date="minDate"
            :max-date="maxDate"
            :v-model="closingDate">
          </b-datepicker>
        </b-field>

        <br>
        <br>

        <b-button outlined type="is-primary" v-on:click="editPetition">
          Submit petition changes
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
        petitionInfo: "",
        title: "",
        description: "",
        categoryName: 0,
        closingDate: "",
        file: "",
        categories: [],
        petitionId: "",
        authorId: "",
        closingDate: "",
        localStorageUserId: localStorage.getItem("userId"),
        categoryMultiselectValue: "0",

        date: new Date(),
        minDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1),
        maxDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 365),
      }

    },

    mounted: function () {
      this.getPetitionCategories();
      this.getPetitionInfo();
    },

    methods: {

      getPetitionInfo: function() {
        let url = (window.location.href.split("/"));
        this.petitionId = url[url.length - 2];

        this.$http.get('http://localhost:4941/api/v1/petitions/'+ this.petitionId)
          .then((response) => {
            this.petitionInfo = response.data;
            this.authorId = response.data.authorId
            this.title = response.data.title;
            this.description = response.data.description;
            this.categoryName = response.data.category;
            this.file = response.data.file;
            this.closingDate = response.data.closingDate;
          })
          .catch((error) => {
            this.error = error;
            this.errorFlag = true;
          });
      },


      editPetition: function () {

        let bodyData = {
          "title": this.title,
          "description": this.description,
          "categoryId": this.categoryMultiselectValue,
        }

        if (this.closingDate) {

          var unformattedDate = new Date(this.closingDate);

          let formattedDate = "";


          let day =  unformattedDate.getDate();
          let month = unformattedDate.getMonth() + 1;
          let year = unformattedDate.getFullYear();

          let hour = unformattedDate.getHours()
          console.log(hour)
          let min = unformattedDate.getMinutes()
          let sec = unformattedDate.getSeconds()
          let milisec = unformattedDate.getMilliseconds()

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
          console.log(bodyData.closingDate)
        }
        if (this.file) {
          bodyData.file = this.file
        }

        let alist =["image/jpeg", "image/png", "image/gif"];

        if (this.title === ""){
          alert("Please enter a title")
        } else if (this.description === "") {
          alert("Please enter a description")
        } else if (this.categoryMultiselectValue === "0") {
          alert("Please select a category Id")
        }

        else {
          this.$http.patch('http://localhost:4941/api/v1/petitions/' + this.petitionId, bodyData, {
            headers: {'X-Authorization': localStorage.getItem("authToken")}
          }).then((response) => {
            if(response.status === 201) {
              alert("Petition Created");
              this.petitionId = response.data.petitionId
            } else if (response.status === 400) {
              alert("Bad request");
            }

            if (this.file !== undefined) {
              if (!(alist.includes(this.file.type))) {
                  alert("Invalid image type - please upload a jpeg, png or gif")
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
            }


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
