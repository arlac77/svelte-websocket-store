<script>
  import { sortable, sorter, filter, keyPrefixStore } from "svelte-common";
  import { ObjectLink } from "../../../src/index.svelte";

  export let router;

  const sortBy = keyPrefixStore(router.searchParamStore, "sort.");
  const filterBy = keyPrefixStore(router.searchParamStore, "filter.");
</script>

<div class="canvas">
  <h2 class="routetitle">Categories</h2>

  <table class="bordered">
    <thead>
      <tr>
        <th id="name" use:sortable={sortBy}
          >Name<input
            id="filter_name"
            placeholder="Filter name"
            bind:value={$filterBy.name}
          /></th
        >
      </tr>
    </thead>
    <tbody class="stiped hoverable">
      {#each router.value
        .filter(filter($filterBy))
        .sort(sorter($sortBy)) as category (category.name)}
        <tr>
          <td>
            <ObjectLink object={category} />
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>
