<script>
	import Router from 'svelte-spa-router';

	import Home from './Home.svelte';

	import cbp from './cbpAPI/App.svelte';

	import Editcbp from './cbpAPI/EditCbp.svelte';

	import NotFound from './NotFound.svelte';

	import CBPChart from './cbpAPI/CBPChart.svelte';
	//import CBPPieChart from './cbpAPI/CBPPieChart.svelte';
	
	const routes = {
		"/": Home,
		"/CBPChart":CBPChart,
		//"/CBPPieChart":CBPPieChart,
		"/cbp/:country/:year":Editcbp,
		"/cbpAPI":cbp, 
		"*": NotFound
	};
</script>

<main>
	<Router {routes} />
</main>