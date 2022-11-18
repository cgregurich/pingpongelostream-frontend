<script setup>
import { ref } from 'vue';
import router from '@/router/index';
import ActionSection from '../util/ActionSection.vue';
import DialogModal from '../util/DialogModal.vue';
import DangerButton from '../Forms/DangerButton.vue';
import Input from '../Forms/Input.vue';
import InputError from '../Forms/InputError.vue';
import SecondaryButton from '../Forms/SecondaryButton.vue';
import { useAuthStore } from '../../stores/modules/auth.js';

const authStore = useAuthStore();
const confirmingUserDeletion = ref(false);
const passwordInput = ref(null);
const password = ref('');
let loading = false;
const confirmUserDeletion = () => {
    confirmingUserDeletion.value = true;
    setTimeout(() => passwordInput.value.focus(), 250);
};
const deleteUser = () => {
    loading = true;
    const afterResult = () => { password.value = ''; this.loading = false; };
    authStore.deleteUser(
        { password: password.value },
        () => { closeModal(); afterResult(); router.go({ name: 'Home' }) },
        () => { passwordInput.value.focus(); afterResult(); },
    );
};
const closeModal = () => {
    confirmingUserDeletion.value = false;
    password.value = '';
};
</script>

<template>
    <ActionSection>
        <template #title>
            Delete Account
        </template>

        <template #description>
            Permanently delete your account.
        </template>

        <template #content>
            <div class="max-w-xl text-sm text-gray-600">
                Once your account is deleted, all of its resources and data will be permanently deleted. Before deleting your account, please download any data or information that you wish to retain.
            </div>

            <div class="mt-5">
                <DangerButton @click="confirmUserDeletion">
                    Delete Account
                </DangerButton>
            </div>

            <!-- Delete Account Confirmation Modal -->
            <DialogModal :show="confirmingUserDeletion" @close="closeModal">
                <template #title>
                    Delete Account
                </template>

                <template #content>
                    Are you sure you want to delete your account? Once your account is deleted, all of its resources and data will be permanently deleted. Please enter your password to confirm you would like to permanently delete your account.

                    <div class="mt-4">
                        <Input
                            ref="passwordInput"
                            v-model="password"
                            type="password"
                            class="mt-1 block w-3/4"
                            placeholder="Password"
                            @keyup.enter="deleteUser"
                        />

                        <InputError message="" class="mt-2" />
                    </div>
                </template>

                <template #footer>
                    <SecondaryButton @click="closeModal">
                        Cancel
                    </SecondaryButton>

                    <DangerButton
                        class="ml-3"
                        :class="{ 'opacity-25': loading }"
                        :disabled="loading"
                        @click="deleteUser"
                    >
                        Delete Account
                    </DangerButton>
                </template>
            </DialogModal>
        </template>
    </ActionSection>
</template>