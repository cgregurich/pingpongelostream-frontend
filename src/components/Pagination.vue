<!-- https://www.digitalocean.com/community/tutorials/vuejs-vue-pagination-component -->

<template>
    <ul class="">
      <li class="border rounded mx-1 mb-3 px-1 bg-gray-50 inline-block shadow-sm hover:shadow-gray-400">
        <button
          type="button"
          @click="onClickFirstPage"
          :disabled="isInFirstPage"
          aria-label="Go to first page"
        >
          First
        </button>
      </li>
  
      <li class="border rounded mx-1 mb-3 px-1 bg-gray-50 inline-block shadow-sm hover:shadow-gray-400">
        <button
          type="button"
          @click="onClickPreviousPage"
          :disabled="isInFirstPage"
          aria-label="Go to previous page"
        >
          Previous
        </button>
      </li>
  
      <!-- Visible Buttons Start -->
  
      <li 
      class="border rounded mx-1 mb-3 px-1 bg-gray-50 inline-block shadow-sm hover:shadow-gray-400"
      v-for="page in pages"
      :key="page.name"
    >
      <button
        type="button"
        :disabled="page.isDisabled"
        @click="onClickPage(page.name)"
        :class="{ 'text-purple-600 font-bold': isPageActive(page.name)}"
        :aria-label="`Go to page number ${page.name}`"
      >
        {{ page.name }}
      </button>
    </li>
  
      <!-- Visible Buttons End -->
  
      <li class="border rounded mx-1 mb-3 px-1 bg-gray-50 inline-block shadow-sm hover:shadow-gray-400">
        <button
          type="button"
          @click="onClickNextPage"
          :disabled="isInLastPage"
          aria-label="Go to next page"
        >
          Next
        </button>
      </li>
  
      <li class="border rounded mx-1 mb-3 px-1 bg-gray-50 inline-block shadow-sm hover:shadow-gray-400">
        <button
          type="button"
          @click="onClickLastPage"
          :disabled="isInLastPage"
          aria-label="Go to last page"
        >
          Last
        </button>
      </li>
    </ul>
  </template>
  
<script>
  export default {
    name: 'Pagination',
    data() {
      return { pages: [] }
    },
    props: {
      maxVisibleButtons: {
        type: Number,
        required: false,
        default: 3
      },    
      totalPages: {
        type: Number,
        required: true
      },
      totalItems: {
        type: Number,
        required: true
      },
      perPage: {
        type: Number,
        required: true
      },
      currentPage: {
        type: Number,
        required: true
      }
    },
    mounted() {
      this.updatePages();
    },
    computed: {
      startPage() {
        // When on the first page
        if (this.currentPage === 1) {
          return 1;
        }

        // When on the last page
        if (this.currentPage === this.totalPages) {
          return this.totalPages - (this.maxVisibleButtons - 1); //TODO subtract 1 from here???????
        }

        // When inbetween
        return this.currentPage - 1;
        
      },
      endPage() {
        return Math.min(this.startPage + this.maxVisibleButtons - 1, this.totalPages);
      },
      isInFirstPage() {
        return this.currentPage === 1;
      },
      isInLastPage() {
        return this.currentPage === this.totalPages;
      },
    },
    methods: {
      onClickFirstPage() {
        this.$emit('pagechanged', 1);
        this.updatePages();
      },
      onClickPreviousPage() {
        this.$emit('pagechanged', this.currentPage - 1);
        this.updatePages();
      },
      onClickPage(page) {
        this.$emit('pagechanged', page);
        this.updatePages();
      },
      onClickNextPage() {
        this.$emit('pagechanged', this.currentPage + 1);
        this.updatePages();
      },
      onClickLastPage() {
        this.$emit('pagechanged', this.totalPages);
        this.updatePages();
      },
      isPageActive(page) {
        return this.currentPage === page;
      },
      currentPages() {
        const range = [];

        for (
          let i = this.startPage;
          i <= this.endPage;
          i++
        ) {
          range.push({
            name: i,
            isDisabled: i === this.currentPage
          });
        }
        return range;
      },
      updatePages() {
        this.pages = this.currentPages();
      }
    }
  }
  </script>