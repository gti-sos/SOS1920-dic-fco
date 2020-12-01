<script>
    import Button from "sveltestrap/src/Button.svelte";
    import { pop } from "svelte-spa-router";
</script>

<main>

    <h2>Trabajo de diciembre</h2>
    <p></p>
    <h3>Información extra que te interesará saber sobre mi Api.
    </h3>
    <p></p>
    <h4>Video de la APi</h4>
    <li><a href="https://www.youtube.com/watch?v=fcOI58KBLK4" rel="nofollow">Video de presentacion de la API</a></li>
    <p></p>
    <h5><a href="https://github.com/Fercamoli">Repositorio de github</a></h5>
    <p></p>
    <Button color="info" on:click="{pop}">Atrás</Button>
</main>

<style>
    main {
        font-weight: bold;
        text-align: center;
    }
</style>