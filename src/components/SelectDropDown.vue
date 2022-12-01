<!-- https://dev.to/mmmrks/building-a-vuejs-dropdown-menu-component-ho3 -->


<template>

    <!-- Wraps our reusable drop down menu -->
    <section class="relative w-1/3 h-10 rounded bg-site-color-one border border-site-color-two b-shadow-10px text-base">

        <!-- Open/Close menu button -->
        <button class="flex rounded-md absolute top-0 left-0 items-center pr-2 pl-2 w-full h-full cursor-pointer z-2" ref="menu" @click="openClose">
            {{menuTitle}}
        </button>

        <!-- css icon that indicates open or closed menu ( Hamburger Icon type thing OR X to close icon )-->
        <div class="w-6 h-6 absolute top-1/2 right-2 -translate-y-1/2 z-1"> 
        <!-- <div class="w-full max-w-xs h-0.5 bg-stone-800 absolute top-1/2 left-1/2 rounded-3xl -translate-x-1/2 -translate-y-[calc(-50%_-_5px)] ease-in-out duration-300" :class="{ 'bg-site-color-two -translate-x-1/2 translate-y-1/3 rotate-45' : isOpen}"/> -->
        <div class="w-full max-w-xs h-0.5 bg-stone-600 absolute top-1/2 left-1/2 rounded-3xl -translate-x-1/2 -translate-y-[calc(-50%_-_5px)] ease-in-out duration-300" :class="{ 'opacity-0' : isOpen}"/>
        <div class="w-full max-w-xs h-0.5 bg-stone-600 absolute top-1/2 left-1/2 rounded-3xl -translate-x-1/2 -translate-y-1/2 ease-in-out duration-300 opacity-1" :class="{ 'opacity-0' : isOpen}"/>
        <!-- <div class="w-full max-w-xs h-0.5 bg-stone-800 absolute top-1/2 left-1/2 rounded-3xl -translate-x-1/2 -translate-y-[calc(-50%_+_8px)] ease-in-out duration-300" :class="{ 'bg-site-color-two absolute top-1/2 -translate-x-1/2 translate-y-1/3 -rotate-45' : isOpen}"/> -->
        <div class="w-full max-w-xs h-0.5 bg-stone-600 absolute top-1/2 left-1/2 rounded-3xl -translate-x-1/2 -translate-y-[calc(-50%_+_8px)] ease-in-out duration-300" :class="{ 'opacity-0' : isOpen}"/>
        <font-awesome-icon v-if="isOpen" icon="fa-xmark" class="pl-2" />
        </div>

        <!-- element that will wrap the actual menu content -->
        <section class="absolute top-full w-full min-w-300 min-h-10 border rounded border-site-color-two shadow-md bg-site-color-one my-3.5 px-2 py-2.5 ease-in-out duration-300" v-if="isOpen">
            <!-- for pointing to menu arrow -->
            <div class="w-5 h-5 absolute -top-2.5 left-2 border-l border-t border-site-color-two bg-site-color-one rotate-45 rounded-md" />
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
