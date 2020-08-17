//Vue.http.options.emulateJSON = true;
new Vue({
    el: '#app',

    data: {
        users: [],
        username: "",
    },

    mounted: function() {
        this.getUsers();
    },

    methods: {

        addUser: function() {
            if (this.username === "") {
                alert("Please enter an username !");
            } else {
                this.$http.post('http://localhost:8080/api/users', {
                    "username": this.username
                });
            }
        },

        getUsers: function() {
            this.$http.get('http://localhost:8080/api/users')
                .then(function(response){
                    this.users = response.data;
                }, function(error){
                    console.log(error);
                });
        },

        deleteUser: function(user) {
            this.$http.delete('http://localhost:8080/api/users/' + user.user_id)
                .then(function(response){
                    var tempid = user.user_id;

                    for(var i = 0; i < this.users.length; i++){
                        if(tempid == this.users[i].user_id){
                            this.users.splice(i, 1);
                        }
                    }

                }, function(error){
                    console.log(error);
                });
        },


    }
});