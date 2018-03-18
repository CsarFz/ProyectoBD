$(document).ready(function(){
	//Open Database
	var request = indexedDB.open("employeemanager", 1);

	request.onupgradeneeded = function(e) {
		var db = e.target.result;

		if(!db.objectStoreNames.contains("employees")){
			var os = db.createObjectStore("employees",{keyPath: "id", autoIncrement:true});
			
			//Create Index for Name
			os.createIndex("name","name",{unique:false});
		}
	}

	//Success
	request.onsuccess = function(e){
		console.log("Success: Opened Database...");
		db = e.target.result;
		//Show employees
		showEmployees();
	}

	//Error
	request.onerror = function(e){
		console.log("Error: Could Not Open Database...");
	}
});

//Add Employee
function addEmployee(){
	var name = $("#name").val();
	var tel = $("#tel").val();
	var email = $("#email").val();
	var address = $("#address").val();
	var position = $("#position").val();
	var admission = $("#admission").val();

	var transaction = db.transaction(["employees"],"readwrite");

	//Ask for ObjectStore
	var store = transaction.objectStore("employees");

	//Define Employee
	var employee = {
		name: name,
		tel: tel,
		email: email,
		position: position,
		admission: admission,
		address: address
	}

	//Perform the Add
	var request = store.add(employee);

	//Success
	request.onsuccess = function(e){
		window.location.href="index.html";
	}

	//Error
	request.onerror = function(e){
		alert("Sorry, the employee was not added");
		console.log("Error: ", e.target.error.name);
	}
}

//Display employees
function showEmployees(e){
	var transaction = db.transaction(["employees"],"readonly");

	//Ask for ObjectStore
	var store = transaction.objectStore("employees");
	var index = store.index("name");

	var output = "";
	index.openCursor().onsuccess = function(e){
		var cursor = e.target.result;
		if(cursor){
			output += "<tr id='employee_" + cursor.value.id + "'>";
			output += "<td>" + cursor.value.id + "</td>";
			output += "<td><span class='cursor employee' contenteditable='true' data-field='name' data-id='" + cursor.value.id + "'>" + cursor.value.name + "</span></td>";
			output += "<td><span class='cursor employee' contenteditable='true' data-field='tel' data-id='" + cursor.value.id + "'>" + cursor.value.tel + "</span></td>";
			output += "<td><span class='cursor employee' contenteditable='true' data-field='email' data-id='" + cursor.value.id + "'>" + cursor.value.email + "</span></td>";
			output += "<td><span class='cursor employee' contenteditable='true' data-field='address' data-id='" + cursor.value.id + "'>" + cursor.value.address + "</span></td>";
			output += "<td><span class='cursor employee' contenteditable='true' data-field='position' data-id='" + cursor.value.id + "'>" + cursor.value.position + "</span></td>";
			output += "<td><span class='cursor employee' contenteditable='true' data-field='admission' data-id='" + cursor.value.id + "'>" + cursor.value.admission + "</span></td>";
			output += "<td><a class='danger' onclick= removeEmployee(" + cursor.value.id + ") href= >ELIMINAR</a></td>";
			output += "</tr>";
			cursor.continue();
		}
		$("#employees").html(output);
	}
}

//Delete A employee
function removeEmployee(id){
	var transaction = db.transaction(["employees"],"readwrite");

	//Ask for ObjectStore
	var store = transaction.objectStore("employees");

	var request = store.delete(id);

	//Success
	request.onsuccess = function(){
		console.log("Employee" + id + "deleted.");
		$(".employee_" + id).remove();
	}

	//Error
	request.onerror = function(e){
		alert("Sorry, the employee was not removed");
		console.log("Error: ", e.target.error.name);
	}
}

//Clear ALL employees
function clearEmployees(){
	indexedDB.deleteDatabase("employeemanager");
	window.location.href="index.html";
}

//Update employees
$("#employees").on("blur", ".employee",function(){
	// Newly entered text
	var newText = $(this).html();
	// Field
	var field = $(this).data("field");
	// Employee ID
	var id = $(this).data("id");

	//Get Transaction
	var transaction = db.transaction(["employees"],"readwrite");
	//Ask for ObjectStore
	var store = transaction.objectStore("employees");

	var request = store.get(id);

	request.onsuccess = function(){
		var data = request.result;
		if(field == "name" ){
			data.name = newText;
		} else if(field == "email" ){
			data.email = newText;
		} else if(field == "tel"){
			data.tel = newText;
		} else if(field == "address") {
			data.address = newText;
		} else if(field == "position") {
			data.position = newText;
		} else if(field == "admission") {
			data.admission = newText;
		}

		//Store Updated Text
		var requestUpdate = store.put(data);

		requestUpdate.onsuccess = function(){
			console.log("Employee field updated...");
		}

		requestUpdate.onerror = function(){
			console.log("Error: Employee field NOT updated...");
		}
	}
});
