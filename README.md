# verdaccio-pack
A commandline tool for compress verdaccio local storage to zip file

## Usage
install via npm
```bash
npm install -g verdaccio-pack
```
you should clean verdaccio storage use the below command before install dependencies
```bash
verdaccio-pack clear
```
you should also clean pnpm cache if you use pnpm to install dependencies
```bash
verdaccio-pack clear --pnpm-store
```
next, make verdaccio as the registry of npm, yarn or pnpm
```bash
# npm or pnpm
npm config set registry http://localhost:4873/
# yarn
yarn config set registry http://localhost:4873/
```
installing...

finally, pack verdaccio storage to a zip file by the below command
```bash
verdaccio-pack pack
```