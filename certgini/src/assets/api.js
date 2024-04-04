import axios from 'axios'

axios.defaults.withCredentials =true;
const url = "https://certgini-api.vercel.app/";
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

export async function uploadFile(file){
   const formdata = new FormData
   formdata.append('file' , file);
   const res = await  axios.post(`${url}/upload` , formdata);
   return res;
}



