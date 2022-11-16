<!-- https://dev.to/mmmrks/building-a-vuejs-dropdown-menu-component-ho3 -->


<template>

    <!-- Wraps our reusable drop down menu -->
    <section class="flex relative w-1/4 h-10 rounded bg-yellow-100 border b-shadow-10px">

        <!-- Open/Close menu button -->
        <button class="flex rounded-md absolute items-center pr-2 pl-2 w-full h-full cursor-pointer z-2" ref="menu" @click="openClose">
            {{menuTitle}}
        </button>

        <!-- css icon that indicates open or closed menu -->
        <div class="w-25 h-25 absolute pt-2 pr-2 translate-y-1/2 z-1"> 
        <div class="w-full max-w-xs h-4 bg-blue absolute pt-2 pl-2 border -translate-x-1/2 -translate-y-1/2 ease-out" :class="{ '-translate-x-1/2 -translate-y-1/2 bg-red mt-0 rotate-45' : isOpen}"/>
        <div class="w-full max-w-xs h-4 bg-blue absolute pt-2 pl-2 border -translate-x-1/2 -translate-y-1/2 ease-out opacity-1" :class="{ 'opacity-0' : isOpen}"/>
        <div class="w-full max-w-xs h-4 bg-blue absolute pt-2 pl-2 border -translate-x-1/2 -translate-y-1/2 ease-out" :class="{ '-translate-x-1/2 -translate-y-1/2 bg-red mt-2 rotate-45' : isOpen}"/>
        </div>

        <!-- element that will wrap the actual menu content -->
        <section class="absolute w-full border border-2 border-gray-600 bg-pink px-1 py-1 ease-in" v-if="isOpen">
            <!-- for pointing to menu arrow -->
            <div class="w-2 h-2 absolute bl-1 bt-1 border-gray-600 bg-white rotate-45 rounded-md" />
            <!-- content from the parent will be printed here -->
            <slot/>
        </section>

    </section>
</template>

<script>
    export default {
        props: [ "menuTitle" ],
        data() {
            return { isOpen: false }
        },
        methods: {
            openClose() { var _this = this
                const closeListener = (e) => {
                    if ( _this.catchOutsideClick(e, _this.$refs.menu ) )
                        window.removeEventListener('click', closeListener) , _this.isOpen = false
                }

                window.addEventListener('click', closeListener)

                this.isOpen = !this.isOpen
                },
            catchOutsideClick(event, dropdown)  {
                // When user clicks menu — do nothing
                if( dropdown == event.target )
                    return false
                // When user clicks outside of the menu — close the menu
                if( this.isOpen && dropdown != event.target )
                    return true
            }
        }
    }
</script>
