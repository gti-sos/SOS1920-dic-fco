<script>

	import Button from "sveltestrap/src/Button.svelte";
	import { pop } from "svelte-spa-router";

</script>


<main>
	<h2>Integraciones del grupo sos1920-dic-fco</h2>
	<h4>Integraciones de Paises por población</h4>
</main>
<body>
	<div class="div-home">
		<button type="button" class="btn" onclick="window.location.href='#/IntegracionRLN'">Int. RLN</button>
		<button type="button" class="btn" onclick="window.location.href='#/IntegracionGrupo10'">Int. Grupo
			10</button>
		<button type="button" class="btn" onclick="window.location.href='#/IntegracionGrupo12'">Int. Grupo
			12</button>
		<button type="button" class="btn" onclick="window.location.href='#/IntegracionGrupo29'">Int. Grupo
			29</button>
		<button type="button" class="btn" onclick="window.location.href='#/IntegracionExterna'">Int. Externa
			1</button>
		<button type="button" class="btn" onclick="window.location.href='#/IntegracionExterna2'">Int. Externa
			2</button>
	</div>
</body>
<footer>
	<Button color="info" on:click="{pop}">Atrás</Button>
</footer>

<style>
	.btn {
		margin-top: 15px;
		margin-left: auto;
		margin-right: auto;
		color: #001C3C;
		border-color: #001C3C;
		background-color: #DA7E3F;
		border-width: 5px;
		padding: 6px;
		font-weight: 600;
		font-size: 30px;
		margin-bottom: 5px;
	}
	main h2,h4{
		text-align: center;
		color: #001C3C;
	}
	.btn:hover {

		color: #001C3C;
		border-color: #DA7E3F;
		background-color: #E8E8E8;
	}

	main {
		background-color: #DA7E3F;
		height:80px;
		border-radius: 10px;
	}

	footer {
		margin-top: 190px;
	}
</style>