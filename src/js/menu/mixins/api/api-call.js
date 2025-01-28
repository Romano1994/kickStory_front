import axios from "axios";
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

function checkExp() {
  const cookies = document.cookie.split("; ");
  let expTime = "";

  for (const cookie of cookies) {
      const [key, value] = cookie.split("=");
      if (key == "kick_exp") {
        expTime = value;
      }
  }
  
  let isExpired = false;
  if(expTime) {
    isExpired = Date.now() >= expTime;
  } else {
    isExpired = false;
  }

  if(isExpired) {
    axios.post("/auth/reissue", {})
    .then(() => {
    });
  }
}


export default{
  get:function getApi(url,params,success,fail){
    
    let param=null;
    if(params!=null)param={params};
    
    checkExp();

    // commSwitch.on('LoadingBar'); 
    axios.get(url,param)
    .then((data)=>response(data,success))
    .catch((error)=>onFail(error,fail));
  },
  post:function postApi(url,param,success,fail){
    // commSwitch.on('LoadingBar');

    checkExp();

    axios.post(url,param)
      .then((data)=>response(data,success))
      .catch((error)=>onFail(error,fail));

  },
  put:function putApi(url,param,success,fail){
    // commSwitch.on('LoadingBar');

    checkExp();

    axios.put(url,param)
      .then((data)=>response(data,success))
      .catch((error)=>onFail(error,fail));

  },
  delete:function deleteApi(url,params,success,fail){
    let param={params}; 

    checkExp();

    // commSwitch.on('LoadingBar');
    axios.delete(url,param)
      .then((data)=>response(data,success))
      .catch((error)=>onFail(error,fail));

  },
 

}

