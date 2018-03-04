window.indexedDB = window.indexedDB || window.webkitIndexedDB || window.msIndexedDB || window.mozIndexedDB;

if(window.indexedDB) {
	console.log("Tu navegador soporta base de datos indexedDB");
	var db = window.indexedDB.open("CustomerDataBase", 2);

	// Success
	db.onsuccess = function(event) {
		console.log("Success: Opened Database...");
	}

	// Error
	db.onerror = function(event) {
		console.log("Error: Could not Open Database");
	}

	request.onupgradeneeded = function(event) {
		var db = event.target.result;

		if (db.objectStoreNames.contains("clientes")) {
			db.deleteObjectStore("clientes");
		} else {
			var query = db.createObjectStore("clientes", {keyPath:"id", autoIncrement:true});

			query.onsuccess = function(event) {
				console.log("Success: The table has been created")
			}

			query.onerror = function(event) {
				console.log("Error: The table has not been created")
			}
		}
	}
} else {
	console.log("Error: Tu navegador no soporta base de datos indexedDB");
}
