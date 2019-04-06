## AST extract

Generate AST json files from applying *babel/parse* to a recursive directory exploration.

### Requirements
- @babel/parse
- ts-node

- *npm i* ?


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



- local.ts file
  
  ```js
    //Typescript

    import extract from './extractor'

    const path = 'YOUR_REPOSITORIES_PATH'

    extract(process.argv[2])
    ```
- Run the script
  ```sh
  npm run parse <JS_FILE_PATH>
  ```