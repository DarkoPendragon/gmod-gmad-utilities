const fetch = require('node-fetch')
const fs = require('fs')
const exec = require('child_process').exec;
const path = require('path')
const config = require('./config.json')

const steamapi_key = config.gmad.steam_api_key; // https://api.steampowered.com/IPublishedFileService/GetDetails/v1/
const workshop_folder = config.gmad.workshop_folder;
const zip_location = config.gmad.zip_location
const output_folder = path.join(__dirname, "/output_gmad");

async function toGma(path, file) {
	console.log(`	Converting ${file} to .gma...`)
	return new Promise(async (res, rej) => { // this.. was not fun to learn
		console.log(`		Attempting extraction of ${file}`)
		exec(`7z.exe e ${path.replaceAll("/", "\\")}\\${file} -o${path.replaceAll("/", "\\")}`, { cwd: zip_location }, async (err, data) => {
	        // if (err) return rej(`7z ERROR: ${err.stack ?? err}`) - better error handling needed
	        console.log(`			Extracted file (7z.exe), renaming to gma`)
	        fs.rename(`${path}/${file.split(".")[0]}`, `${path}/${file.split(".")[0]}.gma`, (e) => {
	        	fs.unlinkSync(`${path}/${file}`)
	        	if (e) return rej(`fs ERROR: ${e.stack ?? e}`)
	    		res(`${file.split(".")[0]}.gma`)
	        })
	    })
	})
};

(async () => {
	var folders = fs.readdirSync(workshop_folder)
	var total = 0;

	console.log(`Starting gmad extraction with ${folders.length} total addons`)

	async function doNext() {
		var x = folders.shift()
		if (!x) return console.log(`=== ${total} Addons Processed ===`)
		var files = fs.readdirSync(`${workshop_folder}/${x}`)
		var file = files.filter(f => f.endsWith('.gma') || f.endsWith('.bin'))[0]; 
		if (!file) return doNext()

		if (file.endsWith('.bin')) {
			console.log(`	Bin file found: ${file}`)
			const gma = await toGma(`${workshop_folder}/${x}`, file).catch(console.log)
			file = gma;
		}

		const shopInfo = await fetch(`https://api.steampowered.com/IPublishedFileService/GetDetails/v1/?key=${steamapi_key}&includevotes=true&publishedfileids[0]=${x}`).then(async r => {
			const data = await r.json()
			return data.response.publishedfiledetails[0];	
		})

		// gmad.exe extract -file "C:\steam\etc\garrysmod\addons\my_addon_12345.gma" -out "C:\this\folder"
		console.log(`	Extracting: ${shopInfo.title}`)
		exec(`gmad.exe extract -file "${workshop_folder.replaceAll("/", "\\")}\\${x}\\${file}" -out "${output_folder.replaceAll("/", "\\")}\\${shopInfo.title.replaceAll(/(\?|!| |/)/g, "_")}"`, (err, data) => {
	        if (err) console.log(`\n${file}: ERROR: ${err.stack ?? err}\n`)
	        else console.log(`${file}: DONE (${total + 1})\n`);
	    	total++;
	    	doNext()
	    });	
	}
	doNext()
})()