# Gmod Utilities
These are just a few scripts I've made to make my life easier while creating a Gmod server. What they each do is listed below, but the 2 first scripts will let you extract all your Gmod addons (both .gma and .bin files), and the other will let you create pointshop item files from all playermodels found in an addons folder.

# Requirements
* Copy of Garry's Mod
* [Node.js LTS](https://nodejs.org/en/download/prebuilt-installer) (17 or higher)
* [7-Zip](https://www.7-zip.org/) (if using `gmad.js`)
* A [Steam Api Key](https://steamcommunity.com/dev/apikey) (if using `gmad.js`)

# Config
There's a few config options in `config.json`. **Please note that folder locations need to have / slashes and not \ slashes in them or you will get errors.** If you copy a file path from Windows you will get something like `C:\Program Files (x86)\Steam\steamapps\common\GarrysMod`. You need to change it to `C:/Program Files (x86)/Steam/steamapps/common/GarrysMod`.  
## gmad
Settings used for extracting files from addons.  
**steam_api_key**: Your Steam api key, used to fetch titles for addons  

**zip_location**: Location to your 7-Zip installation, used to extract `.bin` files  

**workshop_folder**: The folder where your Garry's Mod workshop addons are installed (find where your Steam library is, then its under `/steamapps/workshop/content/4000`, by default its `C:/Program Files (x86)/Steam/steamapps/workshop/content/4000`)  

## items
Used to create model lua files for pointshop easily.  
**price**: Default price of player models  
**addons_folder**: The exact same as **workshop_folder** above

# How-To's
Alright, but how do I use them?
## Before we start
Before anything else, if you're looking to use this to extract addons, you need to get your `gmad.exe` file from your own copy of Garry's mod, and place it in the folder (where `gmad.js` is). You can find this in your Garry's Mod install spot, in your bin folder (e.g, `C:/Program Files (x86)/Steam/steamapps/common/GarrysMod/bin`). Do not move the file over, just copy it over.  

Wherever you put the project files, you'll need to run `npm i` in a cmd prompt or PowerShell window. You can easily open one by holding SHIFT and left-clicking inside the folder (NOT on a file), and clicking `Open a PowerShell window here`. Then type in `npm i` and let it install.  

Also, if you have 7-Zip installed on your system drive (C: drive) you might get privilege errors. If you can, it's recommended to install it elsewhere. If you can't do that and the project isn't working, see the bottom of this for info to fix that.  

## Creating Pointshop items
Using `items.js` we can look over a addons folder and (hopefully) grab every playermodel there. Running `node items.js` in a console (with-in where ever you put this project) will look over the provided folder in `config.json`. It will then use its base file to create a basic template for pointshop items. All files go into the `output` folder.  

If you do anything special inside your playermodels lua files, you can edit the `base.txt` file to include whatever lua you need. It only replaces the {{TAGS}} at the top. If you need the model or name you can put {{MODEL}} for its model path and {{NAME}} for the model name, so:
```lua
function ITEM:PlayerSetModel(ply)
	print("setting {{NAME}}: {{MODEL}}")
	ply:SetModel(self.Model)
end
```
Would turn into something like:
```lua
function ITEM:PlayerSetModel(ply)
	print("setting Daedric: models/player/daedric.mdl")
	ply:SetModel(self.Model)
end
```
The script just gets the text from the addons autorun files. The above is pulled from:
```lua
player_manager.AddValidModel( "Daedric", "models/player/daedric.mdl" );
```
## Extracting addon files (gmad)
Using Garry's Mod gmad file (and 7-zip), we can extract all of our addons. Running `node gmad.js` will go over every addon in the folder provided in `config.json`. It will then output text in the console as it goes on. It will also tell you how many folders its found and how many its gone through. While going through addons it will also get `.gma` files from `.bin` files to convert using gmad.  

There's not much to really go over here, just make sure you have your config setup right. If you get errors, please submit an issue. However, there is one error you might get that we can fix right now.  

If 7-Zip is installed on your systems drive (wherever Windows is, the C: drive) 7-Zip might not be able to properly extract bin files. You can either install 7-Zip on another drive (like a USB or HDD/SSD), or the much more complicated way.  

If you can't install it elsewhere, here's some basic steps to give 7-Zip full write access:
1. Locate where you installed 7-Zip (defaults to C:/Program Files/7-Zip)
2. Find the "7z.exe" file (or just "7z" if you don't have file extensions shown)
3. Right click 7z.exe and click `Properties`
4. In `Properties`, go to Security
5. You'll see checkmarks below when you click on user names above, find the one without `Write` checked (should start with "Users" then your computer name)
6. Once you've found it, click `Edit`, a new window will pop-up
7. If its not selected already, click on the user name again
8. Click the checkbox under `Allow` for `Write`, or the one for `Full control`
9. Click `Apply` at the bottom, then `OK`

You can now close these windows. 7-Zip should be able to write files system-wide from cli now, while being on the systems drive. 

# Why?
Well, the pointshop one is pretty easy to explain. I hate making those stupid files for each model or item I want, and this simplifies it a bit. Well, a lot. As for my own gmad thing... Every tool I used would crash when extractig either really new or really old .bin files. Usually because of 7-zip or something being outdated. While my script is VERY basic it does what it needs to do.
