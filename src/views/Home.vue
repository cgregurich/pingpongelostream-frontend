<script setup>
import router from '@/router/index';
import FormInput from '@/components/FormInput.vue';
import PrimaryButton from '@/components/PrimaryButton.vue';
import { ref, computed } from 'vue';
import { useAuthStore } from '../stores/modules/auth';

const name = ref('');
const email = ref('');
const password = ref('');
const passwordConfirm = ref('');
const errorMessage = ref('');

function submitClicked() {
  errorMessage.value = '';
  if (password.value !== passwordConfirm.value) {
    errorMessage.value = 'Passwords must match';
  }
}

const submit = () => {
	if (canSubmit.value) {
		store.register(
            name.value,
            email.value,
            password.value,
            passwordConfirm.value
        ).then(
            () => router.push({ name: 'Dashboard' })
        ).catch((e) => console.error(e));
	}
};
const reset = () => {
	email.value = '';
	password.value = '';
    passwordConfirm = '';
};

const store = useAuthStore();

const canSubmit = computed(() => {
  return email.value.trim().length !== 0 
    && password.value.trim().length !== 0
    && passwordConfirm.value.trim().length !== 0;
});


</script>


<template>
    <!-- Background image -->
    <!--
        h-[calc(100vh-calc(4rem+1px))] 
        nav bar is 4rem (h-16), border is 1px. 100vh is whole screen.
        whole screen - nav bar size + border between nav bar and content
    -->
    <div
        class="text-center relative overflow-hidden bg-no-repeat bg-cover h-[calc(100vh-calc(4rem+1px))] bg-fuchsia-900"
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
                <div class="body flex justify-center w-full">
                    <div class="register-container flex flex-col items-center sm:w-[30rem] w-full  bg-gray-100 rounded-3xl m-4 pb-5 border border-gray-300 shadow-lg">
                        <p class="header text-4xl font-semibold m-4">Register</p>
                        <form
                            class="w-96 flex flex-col items-center"
                            @submit.prevent="submit" 
                            @reset.prevent="reset"
                        >
                            <FormInput labelText="Name" v-model:enteredText="name" icon="fa-user"/>
                            <FormInput labelText="Email" v-model:enteredText="email" icon="fa-user"/>
                            <FormInput labelText="Password" v-model:enteredText="password" icon="fa-lock" :isPassword="true"/>
                            <FormInput labelText="Confirm Password" v-model:enteredText="passwordConfirm" icon="fa-lock" :isPassword="true"/>
                            <PrimaryButton text="Register" :disabled="!canSubmit"/>
                        </form>
                        <div class="errors">
                            <div class="text-red-700 text-xl">
                            {{ errorMessage }}
                            </div>
                        </div>
                        <div class="line w-4/5 lg:mt-40 mt-1 bg-opacity-10 bg-black h-[1px] mb-4"></div>
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