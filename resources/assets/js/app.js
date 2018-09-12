
/**
 * First we will load all of this project's JavaScript dependencies which
 * include Vue and Vue Resource. This gives a great starting point for
 * building robust, powerful web applications using Vue and Laravel.
 */

require('./bootstrap');

window.Vue = require('vue');
import Vue from 'vue'
//for auto scroll
import VueChatScroll from 'vue-chat-scroll'
import Toaster from 'v-toaster'
// import 'v-toaster/dist/v-toaster.css'

Vue.use(VueChatScroll);
Vue.use(Toaster, {timeout: 5000});

/**
 * Next, we will create a fresh Vue application instance and attach it to
 * the body of the page. From here, you may begin adding components to
 * the application, or feel free to tweak this setup for your needs.
 */

Vue.component('message', require('./components/message.vue'));

const app = new Vue({
    el: '#app',
    data:{
        message:'',
        chat:{
            message: [],
            user: [],
            color: [],
            time: []
        },
        typing: '',
        numberOfUsers: 0
    },
    watch:{
      message(){
          Echo.private('chat')
              .whisper('typing', {
                  name: this.message
              });
      }
    },
    methods:{
        send(){
            if($.trim(this.message).length != 0){
                this.chat.message.push(this.message);
                this.chat.user.push('you');
                this.chat.color.push('success');
                this.chat.time.push(this.getTime());

                axios.post('/send',{
                    message: this.message,
                    chat: this.chat
                })
                .then(response => {
                    console.log(response);
                    this.message = '';
                })
                .catch(error => {
                    //console.log(error);
                })
            }
        },
        getTime(){
            let time = new Date();
            return time.getHours()+':'+time.getMinutes();
        },
        getOldMessages(){
            axios.post('getOldMessage')
                .then(response => {
                    console.log(response);
                    if(response.data != ''){
                        this.chat = response.data;
                    }
                })
                .catch(error => {
                    console.log(error);
                })
        },
        saveToSession(){
            axios.post('/saveToSession' ,{
                chat: this.chat
            })
                .then(response => {
                    console.log(response);
                    if(response.data != ''){
                        this.chat = response.data;
                    }
                })
                .catch(error => {
                    console.log(error);
                })
        },
        deleteSession(){
            axios.post('/deleteSession')
                .then(response => {
                    this.$toaster.success('Chat history is deleted');
                })
                .catch(error => {
                    console.log(error);
                })
        }
    },
    mounted(){
        this.getOldMessages();
        Echo.private('chat')
            .listen('ChatEvent', (e) => {
                this.chat.message.push(e.message);
                this.chat.user.push(e.user);
                this.chat.color.push('warning');
                this.chat.time.push(this.getTime());
                // console.log(e);
                this.saveToSession();
            })
            .listenForWhisper('typing', (e) => {
                if(e.name != ''){
                    this.typing = 'typing...';
                } else {
                    this.typing = '';
                }
            });

        Echo.join('chat')
            .here((users) => {
                this.numberOfUsers = users.length;
            })
            .joining((user) => {
                this.numberOfUsers += 1;
                this.$toaster.success(user.name + ' is join the chat room')
                // console.log(user.name);
                console.log('join');
            })
            .leaving((user) => {
                this.numberOfUsers -= 1;
               // console.log(user.name);
                this.$toaster.success(user.name + ' is leaved the chat room')
                console.log('leaved');
            });
    }
});
