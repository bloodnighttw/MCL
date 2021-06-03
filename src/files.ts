import { existsSync, mkdirSync, readFileSync} from 'fs';
import { getLaunchMetaList} from './launchmeta';

const Download = require('nodejs-file-downloader')

interface IArtifact {
    path:string,
    sha1:string,
    size:number,
    url:string
}

interface IDownload{
    artifact?:IArtifact,
    classifiers?:{
        "natives-linux"?:IArtifact,
        "natives-windows?":IArtifact,
        "natives-osx"?:IArtifact
        "source"?:IArtifact,
        "javadoc"?:IArtifact
    }
};

interface ID{
    client:{
        sha1:string,
        size:number,
        url:string,
    },
    server:{
        sha1:string,
        size:number,
        url:string,
    }
}

interface IRule{
    action:string,
    os?:{
        name:string
    }
}

interface IassetIndex{
    id:string,
    sha1:string,
    size:number,
    totalSize:number,
    url:string
}

interface Ilogging{
    cilent:{
        argument:string,
        file:{
            id:string,
            sha1:string,
            size:string,
            url:string
        }
        type:string
    }
}

interface IVersionInfo{
    
    assetIndex:IassetIndex,
    assets:string,
    downloads:ID,
    id:string,
    libraries:Array<ILibary>,
    logging:Ilogging,
    mainClass:string,
    minecraftArguments:string,
    minimumLauncherVersion:number,
    releaseTime:string,
    time:string,
    type:string

}

interface ILibary{
    downloads:IDownload,
    extract?:{
        exclude:Array<string>
    },
    name:string,
    natives:{
        linux:string,
        osx:string,
        windows:string
    },
    rules:IRule

}

async function getversionInfo(id:string,type:string) {
    if(!existsSync('meta/'))
        mkdirSync('meta/');

    let meta = await getLaunchMetaList()

    if(!existsSync('meta/1.12.2.json')){
        let contentUrl = meta.versions.filter(it=>it.id=='1.12.2')[0].url as string
        console.log(contentUrl)

        let download = new Download(
            {
                url:contentUrl,
                directory:'./meta'
            }
        )

        await download.download()

    }

        let content = readFileSync('meta/1.12.2.json')

        return JSON.parse(content.toString()) as IVersionInfo;

}

async function getAssetInfo(version:IVersionInfo) {

    if(!existsSync('assets/indexes/'+version.assetIndex.id+'.json')){
        let download = new Download(
            {
                url:version.assetIndex.url,
                directory:'./assets/indexes/'
            }
        )

        await download.download()
    }

    return JSON.parse(readFileSync('assets/indexes/'+version.assetIndex.id+'.json').toString())
    
}

async function downloadAsset(l:IVersionInfo) {

    let list = await getAssetInfo(l) as any;

    console.log(list['objects'])
    let gotError = false
    let arrays = Object.values(list['objects'])
    console.log(arrays)
    let counter = 0;
    let f = async ()=>{
        
        while(arrays.length!=0){             
            let info:any = arrays.pop();
            let path = info.hash[0]+info.hash[1]+'/'
            let fileName = info.hash

            console.log('check file in assets/objects/'+path+fileName)

            if(!existsSync('assets/objects/'+path+fileName)){

                try{

                    let download = new Download({
                        url:'https://resources.download.minecraft.net/'+path+fileName,
                        directory:'./assets/objects/'+path,
                        "fileName":fileName
                    })
                    
                    console.log('Download file #'+counter+' from https://resources.download.minecraft.net/'+path+fileName)
                    counter++;
                    await download.download()


                }catch(err){
                    console.log(err)
                    gotError = true
                }
                            
            }
        }
    }
    let threadAmount = 10;

    for(let i = 0 ; i < threadAmount ; i++ )
        f().catch(errer=>{gotError = true})

    if(gotError)
        console.log('got some error,now trying redownload.')

    if(gotError)
        f().catch(err => {
            console.log(err)
            console.log("stop download due to error.")
        })

    while(arrays.length!=0){
        await new Promise(res=>{setTimeout(res,5000)})
    }

    console.log("Assets File Download Done!")
}


async function downloadLib(versions:Array<ILibary>) {
    console.log(versions)
}

export {
    IArtifact,
    ID,
    IDownload,
    ILibary,
    IRule,
    IVersionInfo,
    Ilogging,
    downloadLib,
    downloadAsset,
    getversionInfo,
    getAssetInfo
}