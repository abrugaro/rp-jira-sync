import {main} from "./core";

const express = require('express')
const app = express()
const port = 3000

app.get('/:id', async (req: any, res: any) => {
    const { id } = req.params;
    if (isNaN(+id) || +id <= 0){
        return
    }
    const result = await main(+id);
    res.send(result);
})

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
});