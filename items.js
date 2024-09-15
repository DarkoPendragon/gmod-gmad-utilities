const fs = require('fs')
const config = require('./config.json')

var price = config.items.price;
var folder = config.items.addons_folder;
var output = `${__dirname}/output`;

(async () => {
	var folders = fs.readdirSync(folder)
	var baseFile = fs.readFileSync(__dirname + "/base.txt", 'utf8')

	var reg = new RegExp(/(?<=player_manager\.AddValidModel\()(.*)(?=\))/g)

	var total = 0;

	folders.forEach(async x => { // this could probably be done a lot better, but it works so uh im not changing it
		if (fs.existsSync(`${folder}/${x}/lua/autorun`)) {
			var files = fs.readdirSync(`${folder}/${x}/lua/autorun`)
			files.filter(f => f.endsWith('.lua')).forEach(async file => {
				var content = fs.readFileSync(`${folder}/${x}/lua/autorun/${file}`, 'utf8')
				if (content.includes("player_manager.AddValidModel(")) {
					var models = content.match(reg).filter(x => x != null && x.includes(".mdl"))
					models.forEach(async (m, i) => {
						var playerModel = m.slice(m.toLowerCase().indexOf(`"models`), m.length).replaceAll(/("|")/g, "").trim()
						var name = m.slice(0, m.toLowerCase().indexOf(`"models`)).replaceAll(/("|"|\,)/g, "").replaceAll("_", " ").trim()
						fs.writeFileSync(`${output}/${total}_${file}`, baseFile.replaceAll("{{NAME}}", name).replaceAll("{{MODEL}}", playerModel).replaceAll("{{PRICE}}", price))
						total++;
					})
				}
			})
		}
	})

	console.log(`Wrote ${total} model files in ./output folder`)
})()