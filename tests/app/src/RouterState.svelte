<script>
  import { getContext } from "svelte";
  import { ROUTER } from "../../../src/util.mjs";

  let router = getContext(ROUTER);
</script>

<div class="background">
  <table>
    <thead>
      <tr>
        <th>Transition</th>
        <th>Nested</th>
      </tr>
    </thead>
    <tbody>
      {#if $router.nested !== undefined}
        <tr>
          <td id="route.path">{$router.nested.path}</td>
          <td id="route.nested"
            >{$router.nested.nested ? $router.route.path : ""}</td
          >
        </tr>
      {/if}
    </tbody>
  </table>

  <table>
    <thead>
      <tr>
        <th>Routes</th>
        <th>Guards</th>
        <th>Keys</th>
        <th>Component</th>
        <th>Subscriptions</th>
      </tr>
    </thead>
    <tbody>
      {#each router.routes as r, i (i)}
        <tr class={r === $router.route ? "current" : ""}>
          <td id="route.path">{r.path}</td>
          <td id="route.guard">{r.guard}</td>
          <td id="route.keys">{r.keys.join(" ")}</td>
          <td id="route.component">{r.component.name}</td>
          <td id="route.subscriptions">{r.subscriptions.size}</td>
        </tr>
      {/each}
    </tbody>
  </table>

  <table>
    <thead>
      <tr>
        <th colspan="2">Properties</th>
      </tr>
    </thead>
    <tbody>
      {#each Object.entries($router.params) as e (e[0])}
        <tr>
          <td>{e[0]}</td>
          <td>{e[1]}</td>
        </tr>
      {/each}
    </tbody>
  </table>

  <table>
    <thead>
      <tr>
        <th>Key</th>
        <th>Value</th>
        <th>Subscriptions</th>
      </tr>
    </thead>
    <tbody>
      {#each Object.values($router.keys) as key}
        <tr>
          <td id="state.key.{key.name}">{key.name}</td>
          <td id="state.key.{key.name}.value">
            {key.value !== undefined ? key.value : ""}
          </td>
          <td id="state.key.{key.name}.subscriptions">
            {key.subscriptions.size}
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>
