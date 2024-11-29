import axios from "axios";
// import { commSwitch } from "@/js/comm-switch";

axios.defaults.baseURL = process.env.VUE_APP_API_BASE_URL;
axios.defaults.paramsSerializer = function(paramObj) {
  const params = new URLSearchParams()
  for (const key in paramObj) {
      params.append(key, paramObj[key])
  }

  return params.toString()
}


function response(data,sucFunc){
  sucFunc(data);
  // commSwitch.off('LoadingBar');
}

function onFail(error,failFunc){
  failFunc(error);
  // commSwitch.off('LoadingBar');
}


export default{
  get:function getApi(url,params,success,fail){
    
    let param=null;
    if(params!=null)param={params};
        
    // commSwitch.on('LoadingBar'); 
    axios.get(url,param)
    .then((data)=>response(data,success))
    .catch((error)=>onFail(error,fail));
  },
  post:function postApi(url,param,success,fail){
    // commSwitch.on('LoadingBar');
    axios.post(url,param)
      .then((data)=>response(data,success))
      .catch((error)=>onFail(error,fail));

  },
  put:function putApi(url,param,success,fail){
    // commSwitch.on('LoadingBar');
    axios.put(url,param)
      .then((data)=>response(data,success))
      .catch((error)=>onFail(error,fail));

  },
  delete:function deleteApi(url,params,success,fail){
    let param={params}; 

    // commSwitch.on('LoadingBar');
    axios.delete(url,param)
      .then((data)=>response(data,success))
      .catch((error)=>onFail(error,fail));

  },
 

}

