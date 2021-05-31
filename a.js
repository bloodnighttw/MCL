import axios from 'axios'


async function main(){
	
	let a = await test()
	console.log(a);
}

async function test(){

	let a = await axios.get("https://api.mojang.com")
	//console.log(a.data);
	return a.data;

}


main()


