<script>
    import Button from "sveltestrap/src/Button.svelte";
    import { pop } from "svelte-spa-router";


    async function loadGraph() {


        const BASE_API_URL = "/api/v1/cbp";

        const resData = await fetch(BASE_API_URL);
        let MyData = await resData.json();
        let countries = Array.from(MyData.map((d) => { return d.country; }));

        //Integracion con el grupo Sep-rln
        const URL_BASE_grupo_01 = "/api/v1/mercados";
        const resData_4 = await fetch(URL_BASE_grupo_01);
        let MyData_4 = await resData_4.json();

        //Paises
        let countries2 = Array.from(MyData_4.map((d) => { if (countries.includes(d.Country)) { return d.Country; } }));
        var filteredcountry = countries2.filter(function (el) {
            return el != null;
        });
        console.log(filteredcountry);
        //PWP
        let pwp = Array.from(MyData.map((d) => { if (filteredcountry.includes(d.country)) { return parseFloat(d.pwp); } }));
        var filteredpwp = pwp.filter(function (el) {
            return el != null;
        });
        console.log(filteredpwp);
        //AAPC
        let aapc = Array.from(MyData.map((d) => { if (filteredcountry.includes(d.country)) { return parseFloat(d.aapc); } }));
        var filteredaapc = aapc.filter(function (el) {
            return el != null;
        });
        console.log(filteredaapc);
        //Revenues
        let revenues = Array.from(new Set(MyData_4.map((d) => { if (filteredcountry.includes(d.Country)) return parseFloat(d.Revenues); })));
        var filteredreven = revenues.filter(function (el) {
            return el != null;
        });
        console.log(filteredreven);

        Highcharts.chart('container', {
            chart: {
                type: 'column'
            },
            title: {
                text: 'Gráfico de columnas con valores negativos. Fuente: <a href="https://es.wikipedia.org/wiki/Anexo:Pa%C3%ADses_y_territorios_dependientes_por_poblaci%C3%B3n">Wikipedia.org</a>'
            },
            xAxis: {
                categories: filteredcountry
            },
            credits: {
                enabled: false
            },
            series: [{
                name: 'Porcentaje del total mundial(%)',
                data: filteredpwp
            }, {
                name: 'Cambio medio anual de la población(%)',
                data: filteredaapc
            }, {
                name: 'Ingreso medio anual',
                data: filteredreven
            }]
        });
    }

</script>

<svelte:head>
    <script src="https://code.highcharts.com/highcharts.js"></script>
    <script src="https://code.highcharts.com/modules/series-label.js"></script>
    <script src="https://code.highcharts.com/modules/exporting.js"></script>
    <script src="https://code.highcharts.com/modules/export-data.js"></script>
    <script src="https://code.highcharts.com/modules/accessibility.js" on:load="{loadGraph}" defer></script>
</svelte:head>

<main>
    <h2>Gráfico highchart</h2>
    <Button color="info" on:click="{pop}">Atrás</Button>
    <figure class="highcharts-figure">
        <div id="container"></div>
        <p class="highcharts-description">
            Este gráfico muestra 2 datos porcentuales sobre la poblacion de cada pais.
        </p>
    </figure>
</main>

<style>
    h2 {
        margin-bottom: 10px;
        background-color: #DA7E3F;
        border-radius: 6px;
        height: 45px;
    }

    #container {
        height: 400px;
    }

    .highcharts-figure,
    .highcharts-data-table table {
        min-width: 310px;
        max-width: 800px;
        margin: 1em auto;
    }

    .highcharts-data-table table {
        font-family: Verdana, sans-serif;
        border-collapse: collapse;
        border: 1px solid #EBEBEB;
        margin: 10px auto;
        text-align: center;
        width: 100%;
        max-width: 500px;
    }

    .highcharts-data-table caption {
        padding: 1em 0;
        font-size: 1.2em;
        color: #555;
    }

    .highcharts-data-table th {
        font-weight: 600;
        padding: 0.5em;
    }

    .highcharts-data-table td,
    .highcharts-data-table th,
    .highcharts-data-table caption {
        padding: 0.5em;
    }

    .highcharts-data-table thead tr,
    .highcharts-data-table tr:nth-child(even) {
        background: #f8f8f8;
    }

    .highcharts-data-table tr:hover {
        background: #f1f7ff;
    }
</style>