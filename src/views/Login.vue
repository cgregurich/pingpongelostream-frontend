<script setup>
import { ref, computed } from 'vue';
import FormInput from '@/components/FormInput.vue';
import FormButton from '@/components/FormButton.vue';

const username = ref('');
const password = ref('');

const canSubmit = computed(() => {
  return username.value.trim().length !== 0 && password.value.trim().length !== 0;
});

</script>

<template>
	<div class="body flex justify-center">
		<div class="login-container flex flex-col items-center w-[500px] bg-gray-100 rounded-3xl m-12 pb-5 border border-gray-300 shadow-lg">

			<p class="header text-4xl font-semibold m-8">Login</p>

      <FormInput labelText="Username" v-model:enteredText="username" icon="fa-user"/>
      <FormInput labelText="Password" v-model:enteredText="password" icon="fa-lock" :isPassword="true"/>

      <FormButton text="Log In" :disabled="!canSubmit"/>

			<div class="line w-4/5 mt-40 bg-opacity-10 bg-black h-[1px] mb-4"></div>

			<div class="footer">Don't have an account yet?
				<router-link :to="{ name: 'Register' }" class="font-bold hover:underline">Create one.</router-link>
			</div>
		</div>
	</div>
</template>