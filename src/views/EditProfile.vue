<script setup>
import UpdateProfileInformationForm from '@/components/UpdateProfileInformationForm.vue';
import UpdatePasswordForm from '@/components/UpdatePasswordForm.vue';
import ActiveSessionsForm from '@/components/ActiveSessionsForm.vue';
import DeleteUserForm from '@/components/DeleteUserForm.vue';
</script>
<template>
    <div>
        <div class="max-w-7xl mx-auto py-10 sm:px-6 lg:px-8">
            <UpdateProfileInformationForm :user="$page.props.user" />
            <UpdatePasswordForm class="mt-10 sm:mt-0" />
            <ActiveSessionsForm :sessions="sessions" class="mt-10 sm:mt-0" />
            <DeleteUserForm class="mt-10 sm:mt-0" />
        </div>
    </div>
</template>