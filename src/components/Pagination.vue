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
        :class="{ 'bg-purple-700, text-green-700': isPageActive(page.name)}"
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
  computed: {
    startPage() {
      // When on the first page
      if (this.currentPage === 1) {
        return 1;
      }

      // When on the last page
      if (this.currentPage === this.totalPages) {
        return this.totalPages - this.maxVisibleButtons; //TODO subtract 1 from here???????
      }

      // When inbetween
      return this.currentPage - 1;
      
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
    },
    onClickPreviousPage() {
      this.$emit('pagechanged', this.currentPage - 1);
    },
    onClickPage(page) {
      this.$emit('pagechanged', page);
    },
    onClickNextPage() {
      this.$emit('pagechanged', this.currentPage + 1);
    },
    onClickLastPage() {
      this.$emit('pagechanged', this.totalPages);
    },
    isPageActive(page) {
      return this.currentPage === page;
    } 
  },
    pages() {
      const range = [];

      for (
        let i = this.startPage;
        i <= Math.min(this.startPage + this.maxVisibleButtons - 1, this.totalPages);
        i++
      ) {
        range.push({
          name: i,
          isDisabled: i === this.currentPage
        });
      }
      return range;
    }
  }
  </script>