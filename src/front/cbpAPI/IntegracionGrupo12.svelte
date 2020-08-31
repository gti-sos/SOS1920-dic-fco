<script>
    import Button from "sveltestrap/src/Button.svelte";
    import { pop } from "svelte-spa-router";


    async function loadGraph() {


        const BASE_API_URL = "/api/v1/cbp";
        const resData = await fetch(BASE_API_URL);
        let MyData = await resData.json();
        let countries = Array.from(MyData.map((d) => { return d.country; }));
        //Integracion con el grupo Sep-rln
        const URL_BASE_grupo_RLN = "/api/v2/school-dropouts";
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
        //Yfed
        let yfed = Array.from(MyData.map((d) => { if (filteredcountry.includes(d.country)) { return parseFloat(d.yfed); } }));
        var filteredyfed = yfed.filter(function (el) {
            return el != null;
        });
        console.log(filteredyfed);
        //Revenues

        let sd_all = Array.from(MyData_2.map((d) => { if (filteredcountry.includes(d.country)) return [d.country, parseFloat(d.sd_all)]; }))
        var filteredsd_all = sd_all.filter(function (el) {
            return el != null;
        });
        console.log(filteredsd_all);

        function reordena(a1, a2) {
            let res = [];
            let aux = [];
            for (let e = 0; e < a1.length; e++) {
                for (let i = 0; i < a2.length; i++) {
                    if (a2[i].includes(a1[e])) {
                        if (!aux.includes(a2[i][0])) {
                            aux.push(a2[i][0])
                            res.push(a2[i][1])
                        }
                    }
                }
            }
            return res;
        }
        console.log(reordena(filteredcountry, filteredsd_all));

        Highcharts.chart('container', {
            chart: {
                type: 'area'
            },
            title: {
                text: 'Gráfico de area con valores negativos '
            },
            xAxis: {
                categories: filteredcountry
            },
            credits: {
                enabled: false
            },
            series: [{
                name: 'Años para duplicar población',
                data: filteredyfed
            }, {
                name: 'Abandonos escolares',
                data: reordena(filteredcountry, filteredsd_all)
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
        <p class="highcharts-description" style="text-align: center; color:001C3C; font-size: 25px;">
            Este gráfico muestra los años para duplicar la población de cada país junto a los abandonos escolares que se producen al año.
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