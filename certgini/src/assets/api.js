import axios from 'axios'

const url = 'http://localhost:8181'
export async function makeExportRequest(formData , id){
 let res = await axios.post(`${url}/export/${id}` , formData , {responseType:'blob'});
  return res;
}

export async function getTemplate(id){
   return await axios.get(`${url}/template/${id}`);
}

export async function updateTemplate(data ,id){
   return await axios.post(`${url}/template/${id}/save`, data);
}



