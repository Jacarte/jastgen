## AST extract

Generate AST json files from applying *babel/parse* to a recursive directory exploration.

### AST json file structure

```js
interface ITree{
    name: string;
    repr: string;
    text: string;

    children: ITree[];
    isTerminal: boolean
}
```

## Script usage

```js
//Typescript

import extract from './extractor'

const path = 'YOUR_REPOSITORIES_PATH'

extract(path)

```