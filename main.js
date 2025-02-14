import fs from 'fs';
import path from 'path';
import { fetch } from 'undici';
import {inspect} from 'util';
import FormData from 'form-data';
import axios from 'axios';

const filePath = path.join(path.resolve(),  'cv.pdf');
const data = fs.readFileSync(filePath);

const formData = new FormData();
formData.append('file', data, 'cv.pdf');



//  await fetch('http://localhost:8000/uploadfile', {
//   body: formData,
//   method: 'POST',
//   headers: {
//     // ...formData.getHeaders(),
//     // 'Accept-Encoding': 'gzip, deflate, br, zstd',
//     // 'Content-Type': undefined,
//     accept: 'application/json',
//   }
// }).then(res => res.json()).then(x => console.log(inspect(x, {depth: null})))

axios.post('http://localhost:8000/uploadfile', formData, {
  headers: {
    Accept: 'application/json',
  }
}).then(x => console.log(inspect(x.data, {depth: null}))).catch(e => console.log(e))

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
await wait(4000)
console.log('done')
