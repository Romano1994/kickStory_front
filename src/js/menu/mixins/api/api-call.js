import axios from "axios";
import auth from "../../../auth";
// import { commSwitch } from "@/js/comm-switch";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = process.env.VUE_APP_API_BASE_URL;
axios.defaults.paramsSerializer = function(paramObj) {
  const params = new URLSearchParams()
  for (const key in paramObj) {
    params.append(key, paramObj[key])
  }
  
  return params.toString()
}

const access = sessionStorage.getItem(auth.accessName);
    
if(access) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${access}`;
}

function response(data,sucFunc){
  sucFunc(data);
  // commSwitch.off('LoadingBar');
}

function onFail(error,failFunc){
  let message = error.response.data;
  if(message !== undefined) {
    failFunc(message);
  } else {
    failFunc(error);
  }
  // commSwitch.off('LoadingBar');
}

export default{
  get:async function getApi(url,params,success,fail){
    
    let param=null;
    if(params!=null)param={params};
    
    // commSwitch.on('LoadingBar'); 
    axios.get(url,param)
    .then((data)=>response(data,success))
    .catch((error)=>onFail(error,fail));
  },
  post:async function postApi(url,param,success,fail){
    // commSwitch.on('LoadingBar');

    axios.post(url,param)
      .then((data)=>response(data,success))
      .catch((error)=>onFail(error,fail));

  },
  put:async function putApi(url,param,success,fail){
    // commSwitch.on('LoadingBar');

    axios.put(url,param)
      .then((data)=>response(data,success))
      .catch((error)=>onFail(error,fail));

  },
  patch:async function patchApi(url,param,success,fail){
    // commSwitch.on('LoadingBar');

    axios.patch(url,param)
      .then((data)=>response(data,success))
      .catch((error)=>onFail(error,fail));

  },
  delete:async function deleteApi(url,params,success,fail){
    let param={params}; 

    // commSwitch.on('LoadingBar');
    axios.delete(url,param)
      .then((data)=>response(data,success))
      .catch((error)=>onFail(error,fail));

  },
 

}

