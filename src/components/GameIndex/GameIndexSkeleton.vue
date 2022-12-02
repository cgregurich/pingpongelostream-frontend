<template>
        <div class="flex flex-row">
            <div class="flex-1 flex-col self-center px-4 py-2">
              <div class="flex-row self-end ml-20 text-lg rounded-md w-[200px] h-[30px] bg-skeleton-color animate-pulse" v-for="index in 2" :key="index"></div>
            </div>
            <div class="flex-2 flex-col self-center text-center">vs</div>
            <div class="flex-1 flex-col self-center px-4 py-2">
                <div class="flex-row text-lg ml-2 rounded-md w-[200px] h-[30px] bg-skeleton-color animate-pulse" v-for="index in 2" :key="index"></div>
            </div>
        </div>
        <div class="flex pb-2 justify-center text-3xl">
            <div class="px-3 font-semibold w-[40px] bg-skeleton-color animate-pulse"></div>
            <div class=""> - </div>
            <div class="px-3 w-[40px] bg-skeleton-color animate-pulse"></div>
        </div>
</template>