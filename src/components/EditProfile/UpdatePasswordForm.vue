<script>
import ActionMessage from '../Forms/ActionMessage.vue';
import Button from '../Button.vue';
import FormSection from '../Forms/FormSection.vue';
import Input from '../Forms/Input.vue';
import InputError from '../Forms/InputError.vue';
import Label from '../Forms/Label.vue';
import { useAuthStore } from '../../stores/modules/auth';

const authStore = useAuthStore();
export default {
    name: 'UpdatePasswordForm',
    components: {
        ActionMessage,
        Button,
        FormSection,
        Input,
        InputError,
        Label
    },
    data() {
        const self = this;
        return {
            curr_password: null,
            password: null,
            password_confirmation: null,
            passwordInput: null,
            currentPasswordInput: null,
            passwordErrorMessage: '',
            currentPasswordErrorMessage: '',
            successMessage: '',
            loading: false
        };
    },
    mounted() {
        this.passwordInput = this.$refs.passwordInput;
        this.currentPasswordInput = this.$refs.currentPasswordInput;
    },
    methods: {
        updatePassword() {
            this.passwordErrorMessage = '';
            this.currentPasswordErrorMessage = '';
            this.successMessage = '';
            this.loading = true;
            authStore.resetPassword(
                {
                    current_password: this.curr_password,
                    password: this.password,
                    password_confirmation: this.password_confirmation
                },
                () => {
                    console.log('callback');
                    this.successMessage = 'Password Changed Successfully.';
                    this.password = null;
                    this.password_confirmation = null;
                    this.current_password = null;
                    this.loading = false;
                },
                (e) => {
                    if (e.response.data.response.password) {
                        this.password = null;
                        this.password_confirmation = null;
                        this.passwordInput.focus();
                        this.passwordErrorMessage = e.response.data.response.password.join(' ');
                    }
                    if (e.response.data.response.current_password) {
                        this.current_password = null;
                        this.currentPasswordInput.focus();
                        this.currentPasswordErrorMessage = e.response.data.response.current_password.join(' ');
                    }
                    this.loading = false;
                }
            );
        }
    }
}
</script>
<template>
    <FormSection @submitted="updatePassword">
        <template #title>
            Update Password
        </template>

        <template #description>
            Ensure your account is using a long, random password to stay secure.
        </template>

        <template #form>
            <div class="col-span-6 sm:col-span-4">
                <Label for="current_password" value="Current Password" />
                <Input
                    id="current_password"
                    ref="currentPasswordInput"
                    v-model="curr_password"
                    type="password"
                    class="mt-1 block w-full"
                    autocomplete="current-password"
                />
                <InputError :message="currentPasswordErrorMessage" class="mt-2" />
            </div>
            <div class="col-span-6 sm:col-span-4">
                <Label for="password" value="New Password" />
                <Input
                    id="password"
                    ref="passwordInput"
                    v-model="password"
                    type="password"
                    class="mt-1 block w-full"
                    autocomplete="new-password"
                />
                <InputError :message="passwordErrorMessage" class="mt-2" />
            </div>

            <div class="col-span-6 sm:col-span-4">
                <Label for="password_confirmation" value="Confirm Password" />
                <Input
                    id="password_confirmation"
                    v-model="password_confirmation"
                    type="password"
                    class="mt-1 block w-full"
                    autocomplete="new-password"
                />
                <InputError message="" class="mt-2" />
            </div>
        </template>

        <template #actions>
            <ActionMessage :on="successMessage.length > 0" class="mr-3">
                {{ successMessage }}
            </ActionMessage>

            <Button :class="{ 'opacity-25': loading }" :disabled="loading">
                Save
            </Button>
        </template>
    </FormSection>
</template>