import {IVersion} from './launchmeta'
import axios from 'axios'

interface IArtifact {
    path:string,
    sha1:string,
    size:number,
    url:string
}

interface IDownload{
    artifact:IArtifact,
    classifiers?:{
        "natives-linux":IArtifact,
        "natives-windows":IArtifact,
        "natives-osx":IArtifact
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


async function download(versions:IVersion) {
    let b = await (await axios.get<IVersionInfo>(versions.url)).data;
    // do sth here

}


export {
    IArtifact,
    ID,
    IDownload,
    ILibary,
    IRule,
    IVersion,
    IVersionInfo,
    IassetIndex,
    Ilogging,
    download
};