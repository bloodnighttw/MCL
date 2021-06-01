import axios from 'axios'

interface IVersions {
	id:string,
	"type":string,
	url:string,
	time:string,
	releaseTime:string,
	sha1:string,
	complianceLevel:number
}

interface ILaunchMeta{
	latest:{
		release:string
		snapshot:string
	},
	versions:Array<IVersions>
}

const metaUrl = "https://launchermeta.mojang.com/mc/game/version_manifest_v2.json"


async function getLaunchMetaList(){
	let metaL = await axios.get<ILaunchMeta>(metaUrl)
	return metaL.data;	
}

export {getLaunchMetaList,ILaunchMeta,IVersions}
