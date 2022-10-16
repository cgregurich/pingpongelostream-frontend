<script setup>
import FormInput from '@/components/FormInput.vue';
import FormButton from '@/components/FormButton.vue';
import { ref, computed } from 'vue';
const username = ref('');
const password = ref('');
const passwordConfirm = ref('');
const errorMessage = ref('');

function submitClicked() {
  errorMessage.value = '';
  if (password.value !== passwordConfirm.value) {
    errorMessage.value = 'Passwords must match';
  }
}

const canSubmit = computed(() => {
  return username.value.trim().length !== 0 
    && password.value.trim().length !== 0
    && passwordConfirm.value.trim().length !== 0;
});


</script>


<template>
    <!-- Background image -->
    <div
        class="text-center relative overflow-hidden bg-no-repeat bg-cover h-screen"
        style="
            background-color: rgba(255, 0, 255, 0.6);
        "
    >
        <div
        class="absolute top-0 right-0 bottom-0 left-0 w-full h-full overflow-hidden bg-fixed"
        style="background-color: rgba(0, 0, 0, 0.6)"
        >
            <div
                class="flex lg:flex-row flex-col lg:justify-end mt-10 lg:mt-0 items-center h-full"
            >
                <div class="body flex justify-center items-start w-full lg:h-[39rem]">
                    <div class="text-white text-center px-3 grid grid-cols-1 gap-4">
                        <p class="header text-4xl w-full">
                            Welcome to the <br class="xl:hidden"/>Attic Ping Pong Website!
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
                <div class="body flex justify-center">
                    <div class="register-container flex flex-col items-center w-[500px] bg-gray-100 rounded-3xl m-4 pb-5 border border-gray-300 shadow-lg">
                        <p class="header text-4xl font-semibold m-8">Register</p>
                        <FormInput labelText="Username" v-model:enteredText="username" icon="fa-user"/>
                        <FormInput labelText="Password" v-model:enteredText="password" icon="fa-lock" :isPassword="true"/>
                        <FormInput labelText="Confirm Password" v-model:enteredText="passwordConfirm" icon="fa-lock" :isPassword="true"/>
                        <FormButton text="Register" :disabled="!canSubmit"/>
                        <div class="errors">
                            <div class="text-red-700 text-xl">
                            {{ errorMessage }}
                            </div>
                        </div>
                        <div class="line w-4/5 lg:mt-40 mt-10 bg-opacity-10 bg-black h-[1px] mb-4"></div>
                        <div class="footer">Already have an account?
                            <router-link :to="{ name: 'Login' }" class="font-bold hover:underline">Log in.</router-link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- Background image -->
	
</template>