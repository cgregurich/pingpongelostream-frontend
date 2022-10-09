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
			<div class="line w-4/5 mt-40 bg-opacity-10 bg-black h-[1px] mb-4"></div>
			<div class="footer">Already have an account?
				<router-link :to="{ name: 'Login' }" class="font-bold hover:underline">Log in.</router-link>
			</div>
		</div>
	</div>
</template>