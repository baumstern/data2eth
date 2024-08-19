# data2eth

`data2Eth`  receives JSON data through an HTTP API, constructs an Ethereum transaction from the input, and submits it to the RPC provider

OpenAPI spec: https://baumstern.github.io/data2eth/

## Module design

### listener

functionality: expose HTTP API to receive incoming JSON data

### txmaker

functionality: build received request into tx

### caster

functionality: send transaction to designated chain

https://github.com/jsynowiec/node-typescript-boilerplate is used as a base template 