import axios from 'axios';
import { createWriteStream, existsSync, mkdir, writeFile, writeFileSync } from 'fs';
import path from 'fs';
import {IVersions} from './launchmeta'


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


async function download(versions:IVersions) {

    const Downloader = require('nodejs-file-downloader');

    let versionInfo = (await axios.get<IVersionInfo>(versions.url)).data
    let filePath = versionInfo.libraries[0].downloads.artifact?.path as string
    let fileURL = versionInfo.libraries[0].downloads.artifact?.url as string
    (async () => {//Wrapping the code with an async function, just for the sake of example.

        const downloader = new Downloader({
          url:  fileURL,   
          directory: "./wb/"+filePath,//This folder will be created, if it doesn't exist.               
        })
        try {
          await downloader.download();//Downloader.download() returns a promise.

          console.log('All done');
        } catch (error) {//IMPORTANT: Handle a possible error. An error is thrown in case of network errors, or status codes of 400 and above.
          //Note that if the maxAttempts is set to higher than 1, the error is thrown only if all attempts fail.
          console.log('Download failed',error)
    }


    })();

}





export {
    IArtifact,
    ID,
    IDownload,
    ILibary,
    IRule,
    IVersionInfo,
    IassetIndex,
    Ilogging,
    download
};