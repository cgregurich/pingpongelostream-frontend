<script setup>
import RegisterForm from '@/components/RegisterForm.vue';
</script>
<template>
    <!-- Background image -->
    <!--
        h-[calc(100vh-calc(4rem+1px))] 
        nav bar is 4rem (h-16), border is 1px. 100vh is whole screen.
        whole screen - nav bar size + border between nav bar and content
    -->
    <div
        class="text-center relative overflow-hidden bg-no-repeat bg-cover h-[calc(100vh-calc(4rem+1px))] bg-site-color-two"
    >
        <div
        class="absolute top-0 right-0 bottom-0 left-0 w-full h-full overflow-hidden bg-fixed"
        >
            <div
                class="flex lg:flex-row flex-col lg:justify-end mt-5 items-center h-full"
            >
                <div class="body flex justify-center items-start w-full lg:h-[39rem]">
                    <div class="text-white text-center px-3 grid grid-cols-1 gap-4">
                        <p class="header text-4xl w-full">
                            Welcome<span class="sm:inline hidden"> to the
                                <br class="xl:hidden"/>Attic Ping Pong
                            Website</span>!
                        </p>
                        <p class="px-3 w-full hidden lg:block">
                            Lorem ipsum dolor sit amet, consectetur
                            adipiscing elit, sed do eiusmod tempor
                            incididunt ut labore et dolore magna aliqua.
                            Ut enim ad minim veniam, quis nostrud
                            exercitation ullamco laboris nisi ut aliquip
                            ex ea commodo consequat. Duis aute irure
                            dolor in reprehenderit in voluptate velit
                            esse cillum dolore eu fugiat nulla pariatur.
                            Excepteur sint occaecat cupidatat non
                            proident, sunt in culpa qui officia
                            deserunt mollit anim id est laborum.
                        </p>
                    </div>
                </div>

                <!-- Register -->
                <RegisterForm />
            </div>
        </div>
    </div>
    <!-- Background image -->
	
</template>