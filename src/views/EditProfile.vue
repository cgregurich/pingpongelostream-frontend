<script setup>
import UpdateProfileInformationForm from '@/components/EditProfile/UpdateProfileInformationForm.vue';
import UpdatePasswordForm from '@/components/EditProfile/UpdatePasswordForm.vue';
import ActiveSessionsForm from '@/components/EditProfile/ActiveSessionsForm.vue';
import DeleteUserForm from '@/components/EditProfile/DeleteUserForm.vue';
</script>
<template>
    <div>
        <div class="max-w-7xl mx-auto py-10 sm:px-6 lg:px-8">
            <UpdateProfileInformationForm />
            <UpdatePasswordForm class="mt-10 sm:mt-0" />
            <ActiveSessionsForm :sessions="{}" class="mt-10 sm:mt-0" />
            <DeleteUserForm class="mt-10 sm:mt-0" />
        </div>
    </div>
</template>