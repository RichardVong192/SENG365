<template>
  <section class="hero is-light is-large is-fullheight">
    <div class="hero-head">


      <div v-if="errorFlag" style="color: red;">
        {{ error }}
      </div>

      <div class="card">
        <br>
        <div class="card-image">
            <img :src="'http://localhost:4941/api/v1/petitions/' + petition.petitionId + '/photo'" alt="HERO IMAGE"/>
          <div class="card-content">
            <div class="media">
              <div class="media-content">
                <p class="title is-4">{{petition.title}}</p>
                <p class="subtitle is-6">Category: {{petition.category}} <br>
                  Signature count: {{petition.signatureCount}} <br>
                  Created date: {{convertDate(petition.createdDate)}} <br>
                  Closing date: {{convertDate(petition.closingDate)}}<br>


                  <b-button type="is-light">
                  <a v-bind:href="'https://www.facebook.com/sharer/sharer.php?u=https://canterbury.ac.nz/petitions/' + petition.petitionId" target="_blank"> Share on Facebook</a>
                  </b-button>
                  <b-button type="is-light">
                    <a v-bind:href="'https://twitter.com/home?status=https://canterbury.ac.nz/petitions/' + petition.petitionId " target="_blank"> Share on Twitter</a>
                  </b-button>
                  <b-button type="is-light">
                    <a v-bind:href="'https://pinterest.com/pin/create/button/?url=https://canterbury.ac.nz/petitions/'+ petition.petitionId + '&media=&description='" target="_blank">Share on Pinterest</a>
                  </b-button>



                </p>
              </div>
            </div>

            <div class="content">
                <img class="center" style="width:96px;height:96px;" :src="'http://localhost:4941/api/v1/users/' + petition.authorId + '/photo'"  @error="onImageLoadFailure($event)" />
              <h4>
                {{petition.authorName}}
              </h4>
              <h5>
                {{petition.authorCity}} <br>
                {{petition.authorCountry}}
              </h5>
              Description:
              <br>
              {{petition.description}}
              <br>
              <br>
              <br>


              <footer class="card-footer">
                <a v-if="token !== null && !hasBeenSigned && petitionHasClosed === false" class="card-footer-item" @click="signPetition">Sign Petition</a>
                <a v-if="token !== null && hasBeenSigned && petitionHasClosed === false" class="card-footer-item" @click="unsignPetition">Unsign Petition</a>
                <a v-if="petition.authorName === user.name && petitionHasClosed === false" v-bind:href="'http://localhost:8080/petitions/' + petition.petitionId + '/edit'" class="card-footer-item">Edit Petition</a>
                <a v-if="petition.authorName === user.name && petitionHasClosed === false" class="card-footer-item" @click="confirmPetitionDelete">Delete Petition </a>
              </footer>
              <hr>
              <h5>
                Signatures
              </h5>


              <b-table :data="signatories">
                <template slot-scope="props">
                  <b-table-column label="Profile Picture" >
                    <template slot="header" slot-scope="{ column }">
                        {{ column.label }}
                    </template>
                    <img class="center" style="width:64px;height:64px; " :src="'http://localhost:4941/api/v1/users/' + props.row.signatoryId + '/photo'" @error="onImageLoadFailure($event)" alt="Default Image" />
                  </b-table-column>

                  <b-table-column label="Name">
                    <template slot="header" slot-scope="{ column }">
                        {{ column.label }}
                    </template>
                    {{ props.row.name }}
                  </b-table-column>

                  <b-table-column label="City">
                    <template slot="header" slot-scope="{ column }">
                        {{ column.label }}
                    </template>
                    {{ props.row.city }}
                  </b-table-column>

                  <b-table-column label="Country">
                    <template slot="header" slot-scope="{ column }">
                        {{ column.label }}
                    </template>
                    {{ props.row.country }}
                  </b-table-column>


                </template>
              </b-table>

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
        name: "Petition.vue",
        petition: [],
        errorFlag: false,
        signatories: [],
        createdDate: "",
        closingDate: "",
        user: "",
        userId: localStorage.getItem("userId"),
        token: localStorage.getItem("authToken"),
        today: new Date(),
        thing: "",
        hasBeenSigned: false,
        petitionHasClosed: true
      }
    },
    mounted: function () {
      this.getPetition();
      this.getSignatories();
      this.getUserIdInfo();
    },

    methods: {
      /**
       * Gets the petition data
       */
      getPetition: function () {
        this.$http.get('http://localhost:4941/api/v1/petitions/' + this.$route.params.petitionId)
          .then((response) => {
            this.petition = response.data;
            this.closingDate = response.data.closingDate
            console.log("XXXXXXXXXXXXXXXXXXXXXXXXX")

            if ((response.data.closingDate === null)) {
               return this.petitionHasClosed = false;
            }

          })
          .catch((error) => {
            this.error = error;
            this.errorFlag = true;
          });


      },

      confirmPetitionDelete() {
        this.$buefy.dialog.confirm({
          message: 'Are you sure you want to delete this petition?',
          onConfirm: () => this.petitionDelete()
        })
      },

      petitionDelete: function() {
        this.$http.delete('http://localhost:4941/api/v1/petitions/'+ this.$route.params.petitionId, {
          headers: {'X-Authorization': localStorage.getItem("authToken")}
        })
        window.location = 'http://localhost:8080/petitions'
      },

      signPetition: function() {
        this.$http.post('http://localhost:4941/api/v1/petitions/' + this.$route.params.petitionId + '/signatures', {}, {
          headers: {'X-Authorization': localStorage.getItem("authToken")}
        });
        window.location = 'http://localhost:8080/petitions/' + this.$route.params.petitionId
      },

      unsignPetition: function () {
        this.$http.delete('http://localhost:4941/api/v1/petitions/' + this.$route.params.petitionId + '/signatures', {
          headers: {'X-Authorization': localStorage.getItem("authToken")}
        })
        window.location = 'http://localhost:8080/petitions/' + this.$route.params.petitionId
      },

      getSignatories: function() {
        this.$http.get('http://localhost:4941/api/v1/petitions/'+ this.$route.params.petitionId + '/signatures')
          .then((response) => {
            for (let i = 0; i < response.data.length; i++) {
              if (response.data[i].signatoryId == this.userId) {
                this.hasBeenSigned = true;
              }
            }
            this.signatories = response.data;
          })
          .catch((error) => {
            this.error = error;
            this.errorFlag = true;
          });
      },

      convertDate(rawDate) {

        if (rawDate === null){
          return "No closing date available"
        }

        let formattedDate = "";
        let date = new Date(rawDate);
        let day =  date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();

        if(day < 10) {
          day = '0' + day
        }
        if(month < 10) {
          month = '0' + month
        }
        formattedDate += day + '-' + month + '-' + year
        return formattedDate;
      },

      onImageLoadFailure (event) {
        event.target.src = "https://i.stack.imgur.com/l60Hf.png"
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



    },




  }

</script>

<style scoped>
  .has-image-centered {
    margin-left: auto;
    margin-right: auto;
  }

</style>
