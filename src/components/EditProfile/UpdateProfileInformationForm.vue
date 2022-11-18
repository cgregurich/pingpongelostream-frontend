<script setup>
import { ref } from 'vue';
import ActionMessage from '../Forms/ActionMessage.vue';
import FormSection from '../Forms/FormSection.vue';
import Label from '../Forms/Label.vue';
import Input from '../Forms/Input.vue';
import InputError from '../Forms/InputError.vue';
import Button from '../Button.vue';
import SecondaryButton from '../Forms/SecondaryButton.vue';
import { useAuthStore } from '../../stores/modules/auth.js';

const authStore = useAuthStore();
const user = authStore.user;
const name = ref(user.name);
const email = ref(user.email);
const photoPreview = ref(null);
const photoInput = ref(null);
let loading = false;
const updateProfileInformation = () => {
    let form = {
        user: null, email: null, photo: null
    };
    form.name = name.value;
    form.email = email.value;
    if (photoInput.value) {
        form.photo = photoInput.value.files[0];
    }
    loading = true;
    authStore.updateProfile(
        form,
        () => {
            clearPhotoFileInput();
            loading = false;
        }
    );
};
const selectNewPhoto = () => {
    photoInput.value.click();
};
const updatePhotoPreview = () => {
    const photo = photoInput.value.files[0];
    if (! photo) return;
    const reader = new FileReader();
    reader.onload = (e) => {
        photoPreview.value = e.target.result;
    };
    reader.readAsDataURL(photo);
};
const clearPhotoFileInput = () => {
    if (photoInput.value?.value) {
        photoInput.value.value = null;
    }
};
</script>
<template>
    <div>
        <FormSection @submitted="updateProfileInformation">
            <template #title>
                Profile Information
            </template>
            <template #description>
                Update your account's profile information and email address.
            </template>
            <template #form>
                <!-- Profile Photo -->
                <div class="col-span-6 sm:col-span-4">
                    <!-- Profile Photo File Input -->
                    <input
                        ref="photoInput"
                        type="file"
                        class="hidden"
                        @change="updatePhotoPreview"
                    >
                    <Label for="photo" value="Photo" />
                    <!-- Current Profile Photo -->
                    <div v-show="! photoPreview" class="mt-2">
                        <img :src="user.profile_photo_url" :alt="user.name" class="rounded-full h-20 w-20 object-cover">
                    </div>
                    <!-- New Profile Photo Preview -->
                    <div v-show="photoPreview" class="mt-2">
                        <span
                            class="block rounded-full w-20 h-20 bg-cover bg-no-repeat bg-center"
                            :style="'background-image: url(\'' + photoPreview + '\');'"
                        />
                    </div>
                    <SecondaryButton class="mt-2 mr-2" type="button" @click.prevent="selectNewPhoto">
                        Select A New Photo
                    </SecondaryButton>
                    <InputError message="" class="mt-2" />
                </div>
                <!-- Name -->
                <div class="col-span-6 sm:col-span-4">
                    <Label for="name" value="Name" />
                    <Input
                        id="name"
                        v-model="name"
                        type="text"
                        class="mt-1 block w-full"
                        autocomplete="name"
                    />
                    <InputError message="" class="mt-2" />
                </div>
                <!-- Email -->
                <div class="col-span-6 sm:col-span-4">
                    <Label for="email" value="Email" />
                    <Input
                        id="email"
                        v-model="email"
                        type="email"
                        class="mt-1 block w-full"
                    />
                    <InputError message="" class="mt-2" />
                </div>
            </template>
            <template #actions>
                <!--<ActionMessage :on="form.recentlySuccessful" class="mr-3">
                    Saved.
                </ActionMessage>-->
                <Button :class="{ 'opacity-25': loading }" :disabled="loading">
                    Save
                </Button>
            </template>
        </FormSection>
    </div>
</template>