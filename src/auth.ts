import axios from 'axios'

const authUrl = "https://authserver.mojang.com/authenticate"
const refreshUrl = "https://authserver.mojang.com/refresh"
 
interface IAuth{
	agent:{
		name:string
		version:number
	},
	username:string,
	password:string,
	clientToken?:string
	requestUser?:boolean
}

interface IData{
	user?:{
		username:string,
		properties:Array<{name:string,value:string}>,
		id:string
	}
	clientToken:string,
	accessToken:string,
	selectedProfile:{
		name:string,
		id:string
	},
	availableProfiles:Array<{name:string,id:string}>
}

interface IRefresh{
	accessToken:string,
	clientToken:string,
		selectedProfile?:{
			id:string,
			name:string
		}
	requestUser?:boolean
}

async function auth(username:string,password:string){
	return await authWithIAuth({
		agent:{
			name:"Minecraft",
			version:1
		},
		username:username,
		password:password,
		requestUser:true
	})
}

async function authWithIAuth(x:IAuth){
	return (await axios.post<IData>(authUrl,x)).data
}

async function refreshWithIRefresh(x:IRefresh){
	return (await axios.post<IData>(refreshUrl,x)).data
}

async function refresh(accessToken:string,clientToken:string){
	return await refreshWithIRefresh({
		"accessToken":accessToken,
		"clientToken":clientToken,
		requestUser:true

	})
} 


export {auth,authWithIAuth,IAuth,IData,refresh,refreshWithIRefresh,IRefresh}

