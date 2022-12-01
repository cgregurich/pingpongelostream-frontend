<script setup>
import FormInput from '@/components/FormInput.vue';
import PrimaryButton from '@/components/PrimaryButton.vue';
import { ref, computed } from 'vue';
import { useAuthStore } from'@/stores/modules/auth';
import router from '@/router/index';
import * as toasts from '@/utils/toasts.js';

const store = useAuthStore();

const name = ref('');
const email = ref('');
const password = ref('');
const passwordConfirm = ref('');

const disableInput = ref(false);


function submit() {
    disableInput.value = true;
    if (canSubmit.value) {
        store.register(
            name.value,
            email.value,
            password.value,
            passwordConfirm.value
        ).then(
            () => {
              toasts.registrationSuccessful();
              router.push({ name: 'Dashboard' });
            }
        ).catch(e => {
          disableInput.value = false;
          toasts.registrationFailed();
          console.error(e);
        });
    }
}

const reset = () => {
    name.value = '';
    email.value = '';
    password.value = '';
    passwordConfirm.value = '';
}

const canSubmit = computed(() => {
    return name.value.trim().length !== 0 
        && password.value.trim().length !== 0
        && passwordConfirm.value.trim().length !== 0;
});
</script>
<template>
	<div class="body flex justify-center">
		<div class="register-container flex flex-col items-center w-[500px] bg-gray-100 rounded-3xl m-4 pb-5 border border-gray-300 shadow-lg">
			<p class="header text-4xl font-semibold m-8">Register</p>
            <form
                class="w-96 flex flex-col items-center"
                @submit.prevent="submit"
                @reset.prevent="reset"
            >
                <FormInput labelText="Name" v-model:enteredText="name" icon="fa-user"/>
                <FormInput labelText="Email" v-model:enteredText="email" icon="fa-envelope"/>
                <FormInput labelText="Password" v-model:enteredText="password" icon="fa-lock" :isPassword="true"/>
                <FormInput labelText="Confirm Password" v-model:enteredText="passwordConfirm" icon="fa-lock" :isPassword="true"/>
                <PrimaryButton text="Register" :disabled="!canSubmit"/>
            </form>
			<div class="line w-4/5 mt-4 bg-opacity-10 bg-black h-[1px] mb-4"></div>
			<div class="footer">Already have an account?
				<router-link :to="{ name: 'Login' }" class="font-bold hover:underline">Log in.</router-link>
			</div>
		</div>
	</div>
</template>