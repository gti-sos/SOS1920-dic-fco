<script>
	import Router from 'svelte-spa-router';

	import Home from './Home.svelte';

	import cbp from './cbpAPI/App.svelte';

	import Editcbp from './cbpAPI/EditCbp.svelte';

	import NotFound from './NotFound.svelte';

	import CBPChart from './cbpAPI/CBPChart.svelte';
	import CBPPieChart from './cbpAPI/CBPPieChart.svelte';

	//Integraciones
	import IntegracionRLN from './cbpAPI/IntegracionRLN.svelte';
	import IntegracionGrupo10 from './cbpAPI/IntegracionGrupo10.svelte';
	import IntegracionGrupo12 from './cbpAPI/IntegracionGrupo12.svelte';
	import IntegracionGrupo29 from './cbpAPI/IntegracionGrupo29.svelte';
	import IntegracionExterna from './cbpAPI/IntegracionExterna.svelte';
	import IntegracionExterna2 from './cbpAPI/IntegracionExterna2.svelte';
	
	const routes = {
		"/": Home,
		"/CBPChart":CBPChart,
		"/CBPPieChart":CBPPieChart,
		"/cbp/:country/:year":Editcbp,
		"/cbpAPI":cbp, 
		"/IntegracionRLN":IntegracionRLN,
		"/IntegracionGrupo10":IntegracionGrupo10,
		"/IntegracionGrupo12":IntegracionGrupo12,
		"/IntegracionGrupo29":IntegracionGrupo29,
		"/IntegracionExterna":IntegracionExterna,
		"/IntegracionExterna2":IntegracionExterna2,
		"*": NotFound
	};
</script>

<main>
	<Router {routes} />
</main>