<script setup>
	import { ref, computed, watch } from 'vue';
	import { useRoute } from 'vue-router'
	import Dropdown from '@/components/Dropdown.vue';
	import DropdownLink from '@/components/DropdownLink.vue';
	import NavLink from '@/components/NavLink.vue';
	import ResponsiveNavLink from '@/components/ResponsiveNavLink.vue';
	const route = useRoute();
	const props = defineProps({
		user: Object
	});
	const showingNavigationDropdown = ref(false);
	const logout = () => {
		// call sign out route.
		console.error('not yet implemented. Log out.');
	};
	const isLoggedIn = computed(
		() => props.user
	);
	const isPriviledged = computed(
		() => props.user && props.user.admin >= 1
	);
	const isAdmin = computed(
		() => props.user && props.user.admin >= 2
	);
	watch(
		() => route.fullPath,
		async hash => {
			showingNavigationDropdown.value = false;
		}
	);
</script>


<template>
	<div>
		<div class="min-h-screen bg-gray-100">
			<nav class="bg-white border-b border-gray-100">
				<!-- Primary Navigation Menu -->
				<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div class="flex justify-between h-16">
						<div class="flex">
							<!-- Logo -->
							<div class="logo flex items-center text-2xl font-bold h2">
								<router-link
									:to="isLoggedIn
										? { name: 'Dashboard' }
										: { name: 'Home' }"
								>
									<font-awesome-icon icon="fa-table-tennis-paddle-ball" class="pl-4 pr-1" />
									<span
										class="hidden lg:inline"
									>Attic Ping Pong</span>
								</router-link>
							</div>
							<!-- Navigation Links -->
							<div class="hidden space-x-8 sm:-my-px sm:ml-10 md:flex">
								<NavLink :to="{ name: 'Leaderboard' }">
									Leaderboards
								</NavLink>
								<NavLink :to="{ name: 'Games' }">
									Games
								</NavLink>
								<NavLink :to="{ name: 'Players' }">
									Players
								</NavLink>
								<NavLink :to="{ name: 'Livestream' }">
									Livestream
								</NavLink>
								<NavLink :to="{ name: 'CreateGame' }">
									Create a Game
								</NavLink>
							</div>
						</div>
										
						<div class="hidden sm:flex sm:items-center sm:ml-6">
							<!-- Settings Dropdown -->
							<div class="ml-3 relative">
								<Dropdown
									v-if="isLoggedIn"
									align="right"
									width="48"
								>
									<template #trigger>
										<button class="flex text-sm border-2 border-transparent rounded-full focus:outline-none focus:border-gray-300 transition">
											<img
												class="h-8 w-8 rounded-full object-cover"
												:src="user.profile_photo_url"
												:alt="user.name"
											>
										</button>
									</template>
									<template #content>
										<!-- Account Management -->
										<div class="block px-4 py-2 text-xs text-gray-400">
											Manage Account
										</div>
										<DropdownLink :to="{ name: 'Profile' }">
											Profile
										</DropdownLink>
										<div class="border-t border-gray-100" />
										<!-- Authentication -->
										<form @submit.prevent="logout">
											<DropdownLink as="button">
												Log Out
											</DropdownLink>
										</form>
									</template>
								</Dropdown>
								<div
									v-else
								>
									<NavLink :to="{ name: 'Login' }">
										Login
									</NavLink>
									<NavLink class="ml-2" :to="{ name: 'Home' }">
										Register
									</NavLink>
								</div>
							</div>
						</div>
						<!-- Hamburger -->
						<div class="-mr-2 flex items-center sm:hidden">
							<button
								class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500 transition"
								@click="showingNavigationDropdown = !showingNavigationDropdown"
							>
								<svg
									class="h-6 w-6"
									stroke="currentColor"
									fill="none"
									viewBox="0 0 24 24"
								>
									<path
										:class="{'hidden': showingNavigationDropdown, 'inline-flex': ! showingNavigationDropdown }"
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M4 6h16M4 12h16M4 18h16"
									/>
									<path
										:class="{'hidden': ! showingNavigationDropdown, 'inline-flex': showingNavigationDropdown }"
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M6 18L18 6M6 6l12 12"
									/>
								</svg>
							</button>
						</div>
					</div>
				</div>

				<!-- Responsive Navigation Menu -->
				<div :class="{'block': showingNavigationDropdown, 'hidden': ! showingNavigationDropdown}" class="sm:hidden">
					<div class="pt-2 pb-3 space-y-1">
						<ResponsiveNavLink :to="{ name: 'Dashboard' }">
							Dashboard
						</ResponsiveNavLink>
						<ResponsiveNavLink :to="{ name: 'Leaderboard' }">
							Leaderboards
						</ResponsiveNavLink>
						<ResponsiveNavLink :to="{ name: 'Games' }">
							Games
						</ResponsiveNavLink>
						<ResponsiveNavLink :to="{ name: 'Players' }">
							Players
						</ResponsiveNavLink>
						<ResponsiveNavLink :to="{ name: 'Livestream' }">
							Livestream
						</ResponsiveNavLink>
						<ResponsiveNavLink :to="{ name: 'CreateGame' }">
							Create a Game
						</ResponsiveNavLink>
					</div>

					<!-- Responsive Settings Options -->
					<div class="py-4 border-t border-gray-200">
						<div
							v-if="isLoggedIn"
						>
							<div
								class="flex items-center px-4"
							>
								<div class="shrink-0 mr-3">
									<img
										class="h-10 w-10 rounded-full object-cover"
										:src="user.profile_photo_url"
										:alt="user.name"
									>
								</div>

								<div>
									<div class="font-medium text-base text-gray-800">
										{{ user.name }}
									</div>
									<div class="font-medium text-sm text-gray-500">
										{{ user.email }}
									</div>
								</div>	
							</div>
							<div
								class="mt-3 space-y-1"
							>
								<ResponsiveNavLink :to="{ name: 'Profile' }">
									Profile
								</ResponsiveNavLink>

								<!-- Authentication -->
								<form method="POST" @submit.prevent="logout">
									<ResponsiveNavLink as="button">
										Log Out
									</ResponsiveNavLink>
								</form>
							</div>
						</div>
						<div
							v-else
							class="flex justify-end px-4"
						>
							<router-link
								class="w-full text-center"
								:to="{ name: 'Login' }"
							>
								<button
									class="px-4 py-2 bg-white border border-gray-300 rounded-md font-semibold text-xs text-gray-700 uppercase tracking-widest shadow-sm hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:ring focus:ring-blue-200 active:text-gray-800 active:bg-gray-50 disabled:opacity-25 transition"
								>
									Login
								</button>
							</router-link>
							<router-link
								class="w-full text-center"
								:to="{ name: 'Home' }"
							>
								<button
									class="px-4 py-2 bg-white border border-gray-300 rounded-md font-semibold text-xs text-gray-700 uppercase tracking-widest shadow-sm hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:ring focus:ring-blue-200 active:text-gray-800 active:bg-gray-50 disabled:opacity-25 transition"
								>
									Register
								</button>
							</router-link>
						</div>
					</div>
				</div>
			</nav>

			<!-- Page Heading -->
			<header v-if="$slots.header" class="bg-white shadow">
				<div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
					<slot name="header" />
				</div>
			</header>

			<!-- Page Content -->
			<main>
				<slot />
			</main>
		</div>
	</div>
</template>