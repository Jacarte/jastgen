

import * as walker from 'walker';
import Translator from './parser';
import * as parser from "@babel/parser"
import * as fs from 'fs';
import {render} from 'prettyjson'
import { BaseNode, File} from '@babel/types'
import { connect } from 'tls';
import { isParseTreeNode } from 'typescript';

function extract(path){

    walker(path)
    .on('file', function(file: string, stat: fs.Stats){
        try{
            if(/\.js$/.test(file)){
    
                if(!/\.min\.js$/.test(file) /*avoid minified js files*/){
    
                    console.log(`Parsing ${file}`)
    
                    const content = fs.readFileSync(file).toString();
    
                    let ast: File = undefined;
    
                    try{
                        ast = parser.parse(content, {
                            sourceType: 'unambiguous',
                            allowAwaitOutsideFunction: true,
                            allowReturnOutsideFunction: true,
                            allowSuperOutsideMethod: true
                        });
    
                        console.log("Gotcha ... ast");
                    }
                    catch(e){
                        const synt = e as SyntaxError;
    
                        console.error(synt.message)
    
                        return;
                    }
    
                    const tr = new Translator();
    
                    const tree = tr.createTree(ast.program, null, (start, end) => content.substr(start, end - start))
    
                    console.log("Gotcha...tree")
    
                    if(!tr.validateTree(tree, false, true)){
                        //console.log(render(tree))
                        throw new Error("Not valid ast")
                    }
    
                    console.log("Gotcha...validated")
    
                    const stringi = JSON.stringify(tree)
    
    
    
                    // Big jsons !!!
                    const out = fs.openSync(`${file}.tree`, 'w')
    
                    var read = 0;
                    const size = 1 << 20;
    
                    while(read <= stringi.length){
            
                        process.stdout.write(`${read} ${stringi.length} ${read/stringi.length*100}% ${file}\r`)
                        const piece = stringi.substr(read, read + size)
    
                        fs.writeSync(out, piece);
    
                        read += size;
                    }
    
                    process.stdout.write(`\n`)
                    fs.closeSync(out);
    
                }
                else{
                    console.log(`Too large file ${file}`)
                }
            }
        }
        catch(e){
            console.log(e)
        }
    })
    
}

export default extract