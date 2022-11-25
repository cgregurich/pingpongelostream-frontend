<script setup>
import { ref, reactive } from 'vue';
import ActionSection from '../util/ActionSection.vue';
import Button from '../Button.vue';
import DialogModal from '../util/DialogModal.vue';
import Input from '../Forms/Input.vue';
import InputError from '../Forms/InputError.vue';
import SecondaryButton from '../Forms/SecondaryButton.vue';
import { useAuthStore } from '../../stores/modules/auth.js';
import router from '@/router/index';

const authStore = useAuthStore();
const confirmingLogout = ref(false);
const passwordInput = ref(null);
const passwordErrorMessage = reactive({
    value: ''
});
const password = ref('');
let sessions = reactive({
    tokens: []
});
const loading = ref(true);
const isMobile = (userAgent) => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(userAgent);
};
const browserType = (userAgent) => {
    switch (true) {
        case userAgent.indexOf('edge') > -1: return 'MS Edge';
        case userAgent.indexOf('edg/') > -1: return 'Edge (chromium based)';
        case userAgent.indexOf('opr') > -1 && !!window.opr: return 'Opera';
        case userAgent.indexOf('chrome') > -1 && !!window.chrome: return 'Chrome';
        case userAgent.indexOf('trident') > -1: return 'MS IE';
        case userAgent.indexOf('firefox') > -1: return 'Mozilla Firefox';
        case userAgent.indexOf('safari') > -1: return 'Safari';
        default: return 'Unknown Broswer';
    }
};
const platformType = (userAgent) => {
    switch (true) {
        case userAgent.search('Windows') !== -1: return 'Windows';
        case userAgent.search('Mac') !== -1: return 'MacOS';
        case userAgent.search('X11') !== -1 && !userAgent.search('Linux') !== -1: return 'Unix';
        case !userAgent.search('X11') !== -1 && userAgent.search('Linux') !== -1: return 'Linux';
        default: return 'Unknown Platform';
    }
};
authStore.getAllTokens((data) => {
    sessions.tokens = data.tokens;
    for (let i = 0; i < sessions.tokens.length; i++) {
        sessions.tokens[i].isMobile = isMobile(sessions.tokens[i].device_name);
        sessions.tokens[i].browser = browserType(sessions.tokens[i].device_name);
        sessions.tokens[i].platform = platformType(sessions.tokens[i].device_name);
    }
    loading.value = false;
});

const confirmLogout = () => {
    confirmingLogout.value = true;
    setTimeout(() => passwordInput.value.focus(), 250);
};
const logoutAllBrowserSessions = () => {
    passwordErrorMessage.value = '';
    loading.value = true;
    authStore.deleteAllTokens(
        {
            password: password.value
        },
        () => {
            closeModal();
            password.value = '';
            authStore.logout();
            loading.value = false;
            router.go({ name: 'Home' });
        },
        (e) => {
            passwordErrorMessage.value = e.response.data.response?.password?.join(' ');
            passwordInput.value.focus()
            password.value = '';
        }
    );
};
const closeModal = () => {
    confirmingLogout.value = false;
    password.value = '';
};
</script>
<template>
    <ActionSection>
        <template #title>
            Browser Sessions
        </template>
        <template #description>
            Manage and log out your active sessions on all browsers and devices.
        </template>
        <template #content>
            <div class="max-w-xl text-sm text-gray-600">
                If necessary, you may log out of all of your browser sessions across all of your devices. Some of your recent sessions are listed below; however, this list may not be exhaustive. If you feel your account has been compromised, you should also update your password.
            </div>
            <!-- All Browser Sessions -->
            <div v-if="sessions.tokens.length > 0" class="mt-5 space-y-6">
                <div v-for="(session, i) in sessions.tokens" :key="i" class="flex items-center">
                    <div>
                        <svg
                            v-if="session.isMobile"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            stroke-width="2"
                            stroke="currentColor"
                            fill="none"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            class="w-8 h-8 text-gray-500"
                        >
                            <path d="M0 0h24v24H0z" stroke="none" /><rect
                                x="7"
                                y="4"
                                width="10"
                                height="16"
                                rx="1"
                            /><path d="M11 5h2M12 17v.01" />
                        </svg>
                        <svg
                            v-else
                            fill="none"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            class="w-8 h-8 text-gray-500"
                        >
                            <path d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                    </div>

                    <div class="ml-3">
                        <div class="text-sm text-gray-600">
                            {{ session.platform}} - {{ session.browser }}
                        </div>

                        <div>
                            <div class="text-xs text-gray-500">
                                <!--{{ session.ip_address }}, -->

                                <span v-if="session.is_current_device" class="text-green-500 font-semibold">This device</span>
                                <span v-else>Last active {{ session.last_used_at }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="flex items-center mt-5">
                <Button @click="confirmLogout">
                    Log Out All Browser Sessions
                </Button>
            </div>

            <!-- Log Out All Devices Confirmation Modal -->
            <DialogModal :show="confirmingLogout" @close="closeModal">
                <template #title>
                    Log Out All Browser Sessions
                </template>
                <template #content>
                    Please enter your password to confirm you would like to log out of your other browser sessions across all of your devices.
                    <div class="mt-4">
                        <Input
                            ref="passwordInput"
                            v-model="password"
                            type="password"
                            class="mt-1 block w-3/4"
                            placeholder="Password"
                            @keyup.enter="logoutAllBrowserSessions"
                        />
                        <InputError :message="passwordErrorMessage.value" class="mt-2" />
                    </div>
                </template>
                <template #footer>
                    <SecondaryButton @click="closeModal">
                        Cancel
                    </SecondaryButton>
                    <Button
                        class="ml-3"
                        :class="{ 'opacity-25': loading.value }"
                        :disabled="loading.value"
                        @click="logoutAllBrowserSessions"
                    >
                        Log Out All Browser Sessions
                    </Button>
                </template>
            </DialogModal>
        </template>
    </ActionSection>
</template>