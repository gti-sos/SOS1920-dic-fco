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
	import Label from "sveltestrap/src/Label.svelte";
	import FormGroup from "sveltestrap/src/FormGroup.svelte";

	import { Pagination, PaginationItem, PaginationLink } from 'sveltestrap';

	let cbp = [];
	let newCBP = {
		country: "",
		year: ("") ,
		yfed: "",
		pwp:"",
		aapc:""
	};

	let countries = [];
	let years = [];
	let currentCountry = "-";
	let currentYear = "-";

	let numberElementsPages = 2;
	let offset = 0;
	let currentPage = 1; 
	let moreData = true; 

	onMount(getCBP);
	onMount(getCountryYears);



	async function ReloadTable() {
		const res = await fetch("/api/v1/cbp/loadInitialData")
		responseAlert("Se ha reiniciado la tabla correctamente con los valores iniciales")
		location.reload();
	}


	async function getCountryYears() {
		const res = await fetch("/api/v1/cbp"); 

		if (res.ok) {
			const json = await res.json();

			countries = json.map((d) => {
					return d.country;            
			});
			countries = Array.from(new Set(countries));   
			
			
			years = json.map((d) => {   
					return d.year;    
			});
			years = Array.from(new Set(years));      

			console.log("Contados " + countries.length + "paises y " + years.length + "años distintos.");

		} else {
			errorResponse(res)
		}
	}

	

	async function getCBP(){

		console.log("Fetching cbp...");
		const res = await fetch("/api/v1/cbp?offset=" + numberElementsPages * offset + "&limit=" + numberElementsPages); 

		if (res.ok) {
			console.log("Ok:");
			const json = await res.json();
			cbp = json;
			console.log("Received " + cbp.length + " cbp.");

			if (cbp.length!=numberElementsPages){
				moreData=false
			} else{

						const next = await fetch("/api/v1/cbp?offset=" + numberElementsPages * (offset+1) + "&limit=" + numberElementsPages); 
						console.log("La variable NEXT tiene el estado: " + next.status)
						const jsonNext = await next.json();
						
						
						
						if (jsonNext.length == 0 || next.status==404) {  
							moreData = false;
						} 
						else {
							moreData = true; 
						}
					}
		} 
		else {
			errorResponse(res)
		}
	}

	async function insertCbp() {

		console.log("Inserting cbp..." + JSON.stringify(newCBP));

		if (newCBP.country == ""
			|| newCBP.country == null
			|| newCBP.year == "" 
			|| newCBP.year == null) {
			
			alert("Se debe incluir el nombre del país y el año obligatoriamente");

			} else {
				const res = await fetch("/api/v1/cbp", {
					method: "POST",
					body: JSON.stringify(newCBP),
					headers: {
						"Content-Type": "application/json"
					}
				}).then(function (res) {
					if (res.ok){
						getCBP();
						responseAlert("Datos de " +newCBP.country + " añadidos correctamente")
						location.reload();
					} else{
						errorResponse(res)
					}
					
				});
			}
	}


	async function deleteCBP(country,year) {
		console.log("Deleting cbp..." + JSON.stringify(country)+ + JSON.stringify(year) );

		const res = await fetch("/api/v1/cbp/" + country+"/"+year, {
			method: "DELETE"
		}).then(function (res) {
			if (res.ok){
				getCBP();
				getCountryYears();
				responseAlert("El dato se ha borrado correctamente")
			} 
			else {
				errorResponse(res);
			}
		});
	}

	async function deleteCBPcountries() {
		console.log("Deleting all cbp data...");
		const res = await fetch("/api/v1/cbp/", {
			method: "DELETE"
		}).then(function (res) {
			if (res.ok){
			const json =  res.json();
			cbp = json;
			responseAlert("Todos los datos se han borrado correctamente")
		} else{
			errorResponse(res);
		}
		});
	}


	async function search(country, year) {
		console.log("Searching data: " + country + " and " + year);
		var url = "/api/v1/cbp";

		if (country != "-" && year != "-") {
			url = url + "?country=" + country + "&year=" + year; 
		} else if (country != "-" && year == "-") {
			url = url + "?country=" + country;
		} else if (country == "-" && year != "-") {
			url = url + "?year=" + year;
		}

		const res = await fetch(url);

		if (res.ok) {
			console.log("Ok:");
			const json = await res.json();
			cbp = json;			
			console.log("Found " + cbp.length + " cbp stats.");
		
			if (country != "-" && year != "-") {
				responseAlert("Busqueda de "+ country+ " en el año " + year +" realizada correctamente")  
		} else if (country != "-" && year == "-") {
				responseAlert("Busqueda de "+ country  +" realizada correctamente" )  
		} else if (country == "-" && year != "-") {
				responseAlert("Busqueda en el año "+ year+ " realizada correctamente")  
		}
		} else {
			errorResponse(res)
			console.log("ERROR!");
		}
		
	}

	function addOffset (increment) {
		offset += increment;
		currentPage += increment;
		getCBP();
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
			alert("Codigo de error: " + status + '\n'+ "Los datos introduccidos no son validos");
			break;
		case 401:
			alert("Codigo de error: " + status + '\n'+ "No tiene permisos para realizar esta accion");
			break;
		case 404:
			alert("Codigo de error: " + status + '\n'+ "Página no encontrada");
			break;
		case 405:
			alert("Codigo de error: " + status + '\n'+ "Metodo no permitido");
			break;
		case 409:
			alert("Codigo de error: " + status + '\n'+ "Conclifto con la operacion");
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
	{#await cbp}
		Loading cbp...
	{:then cbp}
	
	<Button outline  color="primary" on:click="{ReloadTable}"> <i class="fas fa-search"></i> Recargar datos originales </Button>
		<FormGroup> 
			<Label for="selectCountry"> Búsqueda por país </Label>
			<Input type="select" name="selectCountry" id="selectCountry" bind:value="{currentCountry}">
				{#each countries as country}
				<option>{country}</option>
				{/each}
				<option>-</option>
			</Input>
		</FormGroup>
				
		<FormGroup>
			<Label for="selectYear"> Año </Label>
			<Input type="select"  name="selectYear" id="selectYear" bind:value="{currentYear}">
				{#each years as year}
				<option>{year}</option>
				{/each}
				<option>-</option>
			</Input>
		</FormGroup>

		<Button outline color="secondary" on:click="{search(currentCountry, currentYear)}" class="button-search" > <i class="fas fa-search"></i> Buscar </Button>
		

		<Table bordered>
			<thead>
				<tr>
					<th>Pais</th>
					<th>Año</th>
					<th>Media Países por producción</th>
					<th>Media per Capita</th>
					<th>Media de produccion de coches</th>
					<th>Acciones</th>

				</tr>
			</thead>
			<tbody>
				<tr>
					<td><input  placeholder="Ej. Spain" bind:value="{newCBP.country}"></td>
					<td><input type="number" placeholder="Ej. 2000" bind:value="{newCBP.year}" ></td>
					<td><input type="number" placeholder="Ej. 111111" bind:value="{newCBP.yfed}"></td>
					<td><input type="number" placeholder="Ej. 11,11" bind:value="{newCBP.pwp}"></td>
					<td><input type="number" placeholder="Ej. 111111" bind:value="{newCBP.aapc}"></td>
					<td> <Button outline  color="primary" on:click={insertCbp} > Insertar</Button> </td>
				</tr>
				{#each cbp as cbp}
					<tr>
						<td>
							<a href="#/cbp/{cbp.country}/{cbp.year}">{cbp.country}</a>
						</td>
						<td>{cbp.year}</td>
						<td>{cbp.yfed}</td>
						<td>{cbp.pwp}</td>
						<td>{cbp.aapc}</td>
						<td><Button outline color="danger" on:click="{deleteCBP(cbp.country,cbp.year)}">  <i class="fa fa-trash" aria-hidden="true"></i> Borrar</Button></td>
					</tr>
				{/each}
			</tbody>
		</Table>
	{/await}
 
	<Pagination style="float:right;" ariaLabel="Cambiar de página">


		<PaginationItem class="{currentPage === 1 ? 'disabled' : ''}">
		  <PaginationLink previous href="#/cbpAPI" on:click="{() => addOffset(-1)}" />
		</PaginationItem>
		
		{#if currentPage != 1}
		<PaginationItem>
			<PaginationLink href="#/cbpAPI" on:click="{() => addOffset(-1)}" >{currentPage - 1}</PaginationLink>
		</PaginationItem>
		{/if}
		<PaginationItem active>
			<PaginationLink href="#/cbpAPI" >{currentPage}</PaginationLink>
		</PaginationItem>

		{#if moreData}
		<PaginationItem >
			<PaginationLink href="#/cbpAPI" on:click="{() => addOffset(1)}">{currentPage + 1}</PaginationLink>
		</PaginationItem>
		{/if}

		<PaginationItem class="{moreData ? '' : 'disabled'}">
		  <PaginationLink next href="#/cbpAPI" on:click="{() => addOffset(1)}"/>
		</PaginationItem>

	</Pagination>

	<Button outline  color="secondary" on:click="{pop}"> <i class="fas fa-arrow-circle-left"></i> Atrás </Button>
	<Button outline  on:click={deleteCBPcountries}   color="danger"> <i class="fa fa-trash" aria-hidden="true"></i> Borrar todo </Button>
	


</main>