import { BaseNode, Node as ASTNode, Identifier, BigIntLiteral, BooleanLiteral, StringLiteral, RegExpLiteral, NullLiteral, identifier, RegexLiteral, validate } from '@babel/types'

import {render} from 'prettyjson'

interface ITree {
    name: ASTNode["type"];
    children: ITree[];
    parent?: ITree | null,
    isTerminal: boolean,
    text: string | null,
    repr?: string
}

class Translator{

    private isNode(tbd: any): tbd is BaseNode{
        return tbd.type != null
    }

    private processTerminal(ast:BaseNode, node: ITree): void{
        
        let value = null;
        
        switch(ast.type as ASTNode['type']){
            case 'Identifier':
                value = (ast as Identifier).name;
                break;
            case 'StringLiteral':
                value = `"${(ast as StringLiteral).value}"`;
                break;
            case 'ArrayExpression':
                value = `[]`;
                break;
            case 'ObjectExpression':
                value = `{}`
                break;
            default:
                value = (ast as any).value;
                break;
                
        }
        
        node.text = value;
    }

    public validateTree(tree: ITree, print: boolean = false, raiseOnFault: boolean = false): boolean{

        if(print)
            console.log(tree.name);

        if(tree.isTerminal){

            if(raiseOnFault && tree.text === null){
                console.error(render(tree))
                throw new Error("Invalid terminal value")
            }


            return tree.text !== null;
        }

        return tree.children.map(c => this.validateTree(c, print, raiseOnFault)).reduce((t, c) => t && c)
    }

    public createTree(ast: BaseNode, parent: ITree | null, getChunk?: (start, end) => string): ITree {

        const result: ITree = {
            name: ast.type,
            children: [],
            isTerminal: false,
            text: '',
            repr: ''
        }

        for(var k in ast){

            
            let value = ast[k];
    


            if (!(value instanceof Array)) {
                value = [value]
            }
    
            for(var simple of value){
                if(!!simple && this.isNode(simple)){
                    if((simple.type as any) !== 'CommentLine'){
                        var child =  this.createTree(simple, result, getChunk)
                        result.children.push(child)
                    }
                }
            }
        }

        result.isTerminal = result.children.length == 0

        if(result.isTerminal){
            this.processTerminal(ast, result);

            result.repr = !!getChunk? getChunk(ast.start, ast.end): ''
        }


        return result
    }

}

export default Translator;