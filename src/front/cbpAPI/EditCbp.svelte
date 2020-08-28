<script>
    import {
        onMount
    } from "svelte";

    import {
        pop
    } from "svelte-spa-router";


    import Table from "sveltestrap/src/Table.svelte";
    import Button from "sveltestrap/src/Button.svelte";
    import Input from "sveltestrap/src/Input.svelte";
    

    export let params = {};
    let cbp = {};
    let updatedCountry = "XXXX";
    let updatedYear = 11111;
    let updatedyfed =11111;
    let updatedpwp =11111;
    let updatedaapc =11111;
    let errorMsg = "";

    onMount(getCBP);

    async function getCBP() {

        console.log("Fetching cbp...");
        const res = await fetch("/api/v1/cbp/" + params.country +"/"+params.year);
        
        if (res.ok) {
            console.log("Ok:");
            const json = await res.json();
            cbp = json;
            updatedCountry = cbp.country;
            updatedYear = cbp.year;
            updatedyfed = cbp.yfed;
            updatedpwp=cbp.pwp;
            updatedaapc=cbp.aapc;
            console.log("Received cbp.");
        } else {
            errorMsg = res.status + ": " + res.statusText;
            console.log("ERROR!" + errorMsg);
        }
    }


    async function updateCBP() {

        console.log("Updating cbp..." + JSON.stringify(params.country));

        const res = await fetch("/api/v1/cbp/" + params.country +"/"+params.year, {
            method: "PUT",
            body: JSON.stringify({
                country: params.country,
                year: Number(params.year),
                yfed: updatedyfed,
                pwp: updatedpwp,
                aapc: updatedaapc
            }),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function (res) {
            getCBP();
            if (res.ok) {
                 responseAlert("Los datos de " +params.country+ " en el año " +params.year+ " han sido actualizados correctamente")
            } else {
                errorResponse(res);
            }
                
        });
    }



    function responseAlert(msg) {
		clearAlert();
		var alert_element = document.getElementById("div_alert");
		alert_element.style = "position: fixed; top: 0px; top: 1%; width: 90%;";
		alert_element.className = "alert alert-dismissible in alert-success";
		alert_element.innerHTML = "<strong>¡Exito!</strong> " + msg;
		
		setTimeout(() => {
			clearAlert();
		}, 3000);
	}
    function responseError(msg) {
		clearAlert();
		var alert_element = document.getElementById("div_alert");
		alert_element.style = "position: fixed;color:black; background-color:#F08080;border-color:red; top: 0px; top: 1%; width: 90%;";
		alert_element.className = "alert alert-dismissible in alert-success";
		alert_element.innerHTML = "<strong>¡Error!</strong> " + msg;
		
		setTimeout(() => {
			clearAlert();
		}, 3000);
	}
    
    function clearAlert () {
		var alert_element = document.getElementById("div_alert");
		alert_element.style = "display: none; ";
		alert_element.className = "alert alert-dismissible in";
		alert_element.innerHTML = "";
	}

    
    function errorResponse(res, msg) {
	var status = res.status
	switch (status) {
		case 400:
			responseError("Codigo de error: " + status + '\n'+ "Los datos introduccidos no son validos");
			break;
		case 401:
			responseError("Codigo de error: " + status + '\n'+ "No tiene permisos para realizar esta accion");
			break;
		case 404:
			responseError("Codigo de error: " + status + '\n'+ "Página no encontrada");
			break;
		case 405:
			responseError("Codigo de error: " + status + '\n'+ "Metodo no permitido");
			break;
		case 409:
			responseError("Codigo de error: " + status + '\n'+ "Conclifto con la operacion");
			break;
		case 410:
			responseError("Codigo de error: " + status + '\n'+ "Los datos de ese pais en ese año ya están registrados");
			break;

		default:
			if (status!=400 && status!=401 && status!=404 && status!=405  && status!=409  && status!=200  && status!=2001) {
				alert("Codigo de error: "+ status +'\n'+ "Error de desconocido por el sistema")
				break;

			}else{
				break;
			}
			
	}
}
</script>
<main>

    <div role="alert" id="div_alert" style="display: none;">
	</div>
    <h3>Editar CBP <strong>{cbp.country} {cbp.year}</strong></h3>
    {#await cbp}
        Loading cbp...
    {:then cbp}
        <Table bordered>
            <thead>
                <tr>
                    <th>Pais</th>
					<th>Año</th>
					<th>Años para duplicar población</th>
					<th>Porcentaje del total mundial(%)</th>
					<th>Cambio medio anual de la población(%)</th>
					<th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>{updatedCountry}</td>
                    <td>{updatedYear}</td>
                    <td><input type="number" bind:value="{updatedyfed}"></td>
                    <td><input type="number" bind:value="{updatedpwp}"></td>
                    <td><input type="number" bind:value="{updatedaapc}"></td>
                    <td> <Button outline  color="primary" on:click={updateCBP}> <i class="fas fa-pencil-alt"> <i class="fas fa-pencil-alt"> </i> Actualizar</Button> </td>
                </tr>
        </tbody>
        </Table>
    {/await}
    {#if errorMsg}
        <p style="color: red">ERROR: {errorMsg}</p>
    {/if}
    <Button outline color="secondary" on:click="{pop}">Atras</Button>
</main>