<script>
    import Button from "sveltestrap/src/Button.svelte";
    import { pop } from "svelte-spa-router";


    async function loadGraph() {


        const BASE_API_URL = "/api/v1/cbp";

        const resData = await fetch(BASE_API_URL);
        let MyData = await resData.json();
        let countries = Array.from(MyData.map((d) => { return d.country; }));
        console.log(countries);
        //Integracion con el grupo Sep-rln
        const URL_BASE_grupo_RLN = "/api/v3/global-marriages";
        const resData_2 = await fetch(URL_BASE_grupo_RLN);
        let MyData_2 = await resData_2.json();
        let countriesGroup = Array.from(MyData_2.map((d) => { return d.country; }));
        console.log(countriesGroup);
        //Paises
        let countries2Group = Array.from(MyData.map((d) => { if (countriesGroup.includes(d.country)) { return d.country; } }));
        var filteredcountry = countries2Group.filter(function (el) {
            return el != null;
        });
        console.log(filteredcountry);
        //Paises Group
        let countries2 = Array.from(MyData_2.map((d) => { if (countries.includes(d.country)) { return d.country; } }));
        var filteredcountryGroup = countries2.filter(function (el) {
            return el != null;
        });
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

        let avg_wm = Array.from(MyData_2.map((d) => { if (filteredcountry.includes(d.country)) return [d.country, parseFloat(d.avg_wm)]; }))
        var filteredavg_wm = avg_wm.filter(function (el) {
            return el != null;
        });

        function reordena(a1, a2) {
            let res = [];
            for (let e = 0; e < a1.length; e++) {
                for (let i = 0; i < a2.length; i++) {
                    if (a2[i].includes(a1[e])) {
                        res.push(a2[i][1])
                    }
                }
            }
            return res;
        }
        console.log(reordena(filteredcountry, filteredavg_wm));

        Highcharts.chart('container', {
            chart: {
                type: 'bar'
            },
            title: {
                text: 'Stacked bar chart'
            },
            xAxis: {
                categories: filteredcountry
            },
            yAxis: {
                min: 0,
                title: {
                    text: ''
                }
            },
            legend: {
                reversed: true
            },
            plotOptions: {
                series: {
                    stacking: 'normal'
                }
            },
            series: [{
                name: 'Porcentaje del total mundial(%)',
                data: filteredpwp
            }, {
                name: 'Cambio medio anual de la población(%)',
                data: filteredaapc
            }, {
                name: 'Media de edad en hombres al casarse',
                data: reordena(filteredcountry, filteredavg_wm)
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
        text-align: center;
    }

    .highcharts-figure,
    .highcharts-data-table table {
        min-width: 310px;
        max-width: 800px;
        margin: 1em auto;
    }

    #container {
        height: 400px;
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