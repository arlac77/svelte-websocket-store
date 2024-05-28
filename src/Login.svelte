<script>
  import { login } from "./login.mjs";

  export let endpoint;
  export let session;
  export let result;

  let username = "";
  let password = "";

  let active = false;
  let message;

  async function submit() {
    if (active) {
      return;
    }
    try {
      active = true;
      message = await login(session, endpoint, username, password);
      if (!message && result !== undefined) {
        await result();
      }
    } catch (e) {
      message = e;
    } finally {
      active = false;
      password = "";
    }
  }
</script>

<form on:submit|preventDefault={submit}>
  {#if message}
    <slot name="message">
      <div class="error" id="message">{message}</div>
    </slot>
  {/if}

  <slot name="inputs">
    <fieldset>
      <label>
        Username
        <input
          aria-label="username"
          aria-required="true"
          minlength="1"
          maxlength="75"
          size="32"
          autocorrect="off"
          autocapitalize="off"
          autocomplete="username"
          id="username"
          type="text"
          placeholder="Username"
          required
          disabled={active}
          bind:value={username}
        />
      </label>
      <label>
        Password
        <input
          aria-label="password"
          aria-required="true"
          minlength="4"
          maxlength="50"
          size="32"
          autocorrect="off"
          autocapitalize="off"
          autocomplete="current-password"
          id="password"
          type="password"
          placeholder="Password"
          required
          disabled={active}
          bind:value={password}
        />
      </label>
    </fieldset>
  </slot>

  <slot name="submit">
    <button
      aria-keyshortcuts="Enter"
      type="submit"
      disabled={!username || !password}
    >
      Login
      {#if active}
        <div class="spinner"></div>
      {/if}
    </button>
  </slot>

  <slot name="footer" />
</form>
