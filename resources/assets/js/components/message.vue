<template>
    <div>
        <li :class="className"><slot></slot>
            <span id="time">{{ time }}</span>
        </li>
        <small class="badge float-right":class='badgeClass'>{{ user }}</small>
    </div>
</template>
<script>
    export default {
        props:[
          'color',
          'user',
            'time'
        ],
        computed:{
            className(){
                return 'list-group-item-' + this.color;
            },

            badgeClass(){
                return 'badge-'+this.color
            }
        },

        mounted() {
            console.log('Component ready.')
        }
    }
</script>

