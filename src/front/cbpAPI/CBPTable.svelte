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
	let limitcbp=[];
	let newCBP = {
		country: "",
		year: (""),
		yfed: "",
		pwp: "",
		aapc: ""
	};

	let countries = [];
	let years = [];
	let currentCountry = "-";
	let currentYear = "-";

	let numberElementsPages = 0;
	let offset = 0;
	let offset2=0;
	let currentPage = 1;
	let currentPage2 = 1;
	let moreData = true;
	let moreData2 = true;

	let pageButton = true;
	let pageButton2 = false;
	

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



	async function getCBP() {

		console.log("Fetching cbp...");
		const res = await fetch("/api/v1/cbp?offset=" + numberElementsPages * offset + "&limit=" + numberElementsPages);
		if (res.ok) {
			console.log("Ok:");
			const json = await res.json();
			cbp = json;
			limitcbp=json;
			console.log("Received " + cbp.length + " cbp.");

			if (cbp.length != numberElementsPages) {
				moreData = false;
				numberElementsPages=limitcbp.length;
			} else {

				const next = await fetch("/api/v1/cbp?offset=" + numberElementsPages * (offset + 1) + "&limit=" + numberElementsPages);
				console.log("La variable NEXT tiene el estado: " + next.status)
				const jsonNext = await next.json();



				if (jsonNext.length == 0 || next.status == 404) {
					moreData = false;
				}
				else {
					moreData = true;
				}
			}
		}
		else {
			if (res.status==404) {
				alert("No hay datos guardados")
			} else{
				errorResponse(res)
			}
		}
	}

	async function insertCbp() {

		console.log("Inserting cbp..." + JSON.stringify(newCBP));


		const res = await fetch("/api/v1/cbp", {
			method: "POST",
			body: JSON.stringify(newCBP),
			headers: {
				"Content-Type": "application/json"
			}
		}).then(function (res) {
			if (res.ok) {
				getCBP();
				responseAlert("Datos de " + newCBP.country + " añadidos correctamente")
				location.reload();
			} else {
				errorResponse(res)
			}

		});
	}


	async function deleteCBP(country, year) {
		console.log("Deleting cbp..." + JSON.stringify(country) + + JSON.stringify(year));

		const res = await fetch("/api/v1/cbp/" + country + "/" + year, {
			method: "DELETE"
		}).then(function (res) {
			if (res.ok) {
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
			if (res.ok) {
				const json = res.json();
				cbp = json;
				responseAlert("Todos los datos se han borrado correctamente")
			} else {
				errorResponse(res);
			}
		});
		location.reload()
	}


	async function search(country, year,currentP,off) {
		currentPage2=currentP;
		offset2=off;
		console.log("Searching data: " + country + " and " + year);
		var url = "/api/v1/cbp";
		if (country != "-" && year != "-") {
			url = url + "?country=" + country + "&year=" + year;
		} else if (country != "-" && year == "-") {
			url = url + "?country=" + country;
		} else if (country == "-" && year != "-") {
			url = url + "?year=" + year;
		} else if (country == "-" && year == "-") {
			url = url+"?";
		}
		const res = await fetch(url+"&offset=" + numberElementsPages * offset2 + "&limit=" + numberElementsPages);

		if (res.ok) {
			console.log("Ok:");
			const json = await res.json();
			cbp = json;
			pageButton=false;
			pageButton2=true;
			moreData2 = true;
			console.log("Received " + cbp.length + " cbp.");
			if (cbp.length != numberElementsPages) {
				moreData2 = false;
			}if (country != "-" && year != "-" && cbp.length > 0) {
				responseAlert("Busqueda de " + country + " en el año " + year + " realizada correctamente")
			} else if (country != "-" && year == "-") {
				responseAlert("Busqueda de " + country + " realizada correctamente")
			} else if (country == "-" && year == "-") {
				responseAlert("Busqueda de todos los paises realizada correctamente")
			} else if (country == "-" && year != "-") {
				responseAlert("Busqueda en el año " + year + " realizada correctamente")
			} else {

				const next = await fetch(url+"&offset=" + numberElementsPages * (offset2 + 1) + "&limit=" + numberElementsPages);
				console.log("La variable NEXT tiene el estado: " + next.status)
				const jsonNext = await next.json();

				if (jsonNext.length == 0 || next.status == 404) {
					moreData2 = false;
				}
				else {
					moreData2 = true;
				}
			}
		}else {
				errorResponse(res)
			}
		}
	


		function addOffset(increment) {
			offset += increment;
			currentPage += increment;
			getCBP();
		}

		function addOffset2(increment,currentC,CurrentD) {
			offset2 += increment;
			currentPage2 += increment;
			search(currentC,CurrentD,currentPage2,offset2);
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

		function clearAlert() {
			var alert_element = document.getElementById("div_alert");
			alert_element.style = "display: none; ";
			alert_element.className = "alert alert-dismissible in";
			alert_element.innerHTML = "";
		}

		function errorResponse(res) {
			var status = res.status
			switch (status) {
				case 400:
					responseError("Codigo de error: " + status + '\n' + "Los datos introducidos no son validos");
					break;
				case 404:
					responseError("Codigo de error: " + status + '\n' + "Ese dato no existe en nuestra base de datos");
					break;
				case 405:
					responseError("Codigo de error: " + status + '\n' + "Metodo no permitido");
					break;
				case 420:
					responseError("Codigo de error: " + status + '\n' + "Los datos de ese pais en ese año ya están registrados");
					break;

				default:
					if (status != 400 && status != 410 && status != 404 && status != 405  ) {
						alert("Codigo de error: " + status + '\n' + "Error de desconocido por el sistema")
						break;

					} else {
						break;
					}

			}
		}


</script>

<main style="background-color: #001C3C;">
	<div role="alert" id="div_alert" style="display: none;">
	</div>
	{#await cbp}
		Loading cbp...
	{:then cbp}
	
	<Button outline  color="primary" on:click="{ReloadTable}"> <i class="fas fa-search"></i> Recargar datos originales </Button>
		<FormGroup > 
			<Label for="selectCountry" style="color:#E8E8E8"> Búsqueda por país </Label>
			<Input type="select" name="selectCountry" id="selectCountry" bind:value="{currentCountry}">
				{#each countries as country}
				<option>{country}</option>
				{/each}
				<option>-</option>
			</Input>
		</FormGroup>
				
		<FormGroup>
			<Label for="selectYear"style="color:#E8E8E8"> Año </Label>
			<Input type="select"  name="selectYear" id="selectYear" bind:value="{currentYear}">
				{#each years as year}
				<option>{year}</option>
				{/each}
				<option>-</option>
			</Input>
		</FormGroup>

		<Button style="margin-left:5px;"outline color="secondary" on:click="{search(currentCountry, currentYear,1,0)}" class="button-search" ><i class="fas fa-search"></i> Buscar </Button>
		<h6 style=" color:white; margin-right:20 px;">N.º elementos por página: <input style=" width: 70px; margin-right:10 px;" type="number" min="1"	max="{limitcbp.length}" placeholder="n.º elementos por página" bind:value="{numberElementsPages}" ></h6>
		
		

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
	{#if pageButton == true}
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
	{/if}

	{#if pageButton2 == true}
	<Pagination style="float:right;" ariaLabel="Cambiar de página">


		<PaginationItem class="{currentPage2 === 1 ? 'disabled' : ''}">
		  <PaginationLink previous href="#/cbpAPI" on:click="{() => addOffset2(-1,currentCountry, currentYear)}" />
		</PaginationItem>
		
		{#if currentPage2 != 1}
		<PaginationItem>
			<PaginationLink href="#/cbpAPI" on:click="{() => addOffset2(-1,currentCountry, currentYear)}" >{currentPage2 - 1}</PaginationLink>
		</PaginationItem>
		{/if}
		<PaginationItem active>
			<PaginationLink href="#/cbpAPI" >{currentPage2}</PaginationLink>
		</PaginationItem>

		{#if moreData2}
		<PaginationItem >
			<PaginationLink href="#/cbpAPI" on:click="{() => addOffset2(1,currentCountry, currentYear)}">{currentPage2 + 1}</PaginationLink>
		</PaginationItem>
		{/if}

		<PaginationItem class="{moreData2 ? '' : 'disabled'}">
		  <PaginationLink next href="#/cbpAPI" on:click="{() => addOffset2(1,currentCountry, currentYear)}"/>
		</PaginationItem>

	</Pagination>
	{/if}

	<Button outline  color="secondary" on:click="{pop}"> <i class="fas fa-arrow-circle-left"></i> Atrás </Button>
	<Button outline  on:click={deleteCBPcountries}   color="danger"> <i class="fa fa-trash" aria-hidden="true"></i> Borrar todo </Button>
	

</main>
<style>

th{
	color:#E8E8E8
}
td {
	color:#E8E8E8
}
</style>