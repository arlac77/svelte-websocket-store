<script>
  import { ObjectLink } from "../../../src/index.svelte";

  export let router;
  const route = $router.route;

  let article, next, previous;

  $: {
    article = $route.value;
    next = $route.next();
    previous = $route.previous();
    // console.log("REACTIVE", next, previous);
  }
</script>

{#if article}
  <div class="card">
    <h2 class="card-title routetitle">Article {article.name} ({article.id})</h2>

    <img src="images/article/{article.id}.webp" alt={article.name} />

    <div class="card-content">
      <div class="card-title">Price</div>
      <div id="price" class="price">{article.price} $</div>
    </div>

    <div class="card-content">
      <div class="card-title">Category</div>
      <ObjectLink object={article.category} />
    </div>

    <div class="card-content">
      <div class="card-title">ingredients</div>
      <ul>
        {#each article.ingredients as ingredient}
          <li>{ingredient}</li>
        {/each}
      </ul>
    </div>

    <div class="card-action">
      <ObjectLink object={previous}>Previous</ObjectLink>
      <ObjectLink object={next}>Next</ObjectLink>
    </div>
  </div>
{:else}
  <h2 class="routetitle">No such article</h2>
{/if}

<style>
  .price {
    font-weight: bold;
  }
</style>
