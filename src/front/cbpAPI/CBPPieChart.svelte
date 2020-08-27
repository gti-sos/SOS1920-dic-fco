<script>
    import Button from "sveltestrap/src/Button.svelte";
    import { pop } from "svelte-spa-router";
    import bb from "billboard.js/dist/billboard.pkgd";
    const URL_BASE = "api/v1/cbp";

    async function loadGraph() {

        const resData = await fetch(URL_BASE);
        let MyData = await resData.json();

        let countries = Array.from(MyData.map((d) => { return d.country + " " + d.year; }));
        let yfed = Array.from(MyData.map((d) => { return parseInt(d.yfed); }));
        let array = Array.from(MyData.map((d) => { return [d.country + " " + d.year,parseInt(d.yfed)];}));
        console.log(array);
        

        var chart = bb.generate({
            data: {
                columns: array,
                type: "donut"
            },
            donut: {
                label: {
                    format: function (value, ratio, id) { return value + "\nAños"; }
                }
            },
            bindto: "#multilineLabel"
        });
    }
    loadGraph();
</script>

<head>

    <script src="https://d3js.org/d3.v5.min.js"></script>
    <script src="libraries/billboard.js"></script>
    <link rel="stylesheet" href="css/billboard.css">

</head>

<main>
    <div class="texto">
    <h2>Gráfica 2 Billboard</h2>

    <p>
        El gráfico mutiline label muestra los años que tardaría en duplicarse la población de cada pais.
    </p>
    </div>
    <Button color="info" on:click="{pop}">Atrás</Button>
    <div id="multilineLabel"></div>
</main>

<style>
    	.texto{
        background-color: #DA7E3F;
        height:75px;
        margin-bottom: 10px;
        border-radius: 6px;
    }
    h2, p{
        margin-left:10px;
    }
    
   
</style>