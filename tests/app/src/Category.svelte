<script>
  import { ObjectLink } from "../../../src/index.svelte";

  export let router;

  const category = router.value;
</script>

{#if category}
  <div class="card">
    <h2 class="card-title routetitle">Category {category.name}</h2>

    <div class="card-content">
      {#each category.articles as article}
        <li>
          <ObjectLink object={article} />
        </li>
      {/each}
    </div>
  </div>
{:else}
  <h2 class="routetitle">No such category</h2>
{/if}
