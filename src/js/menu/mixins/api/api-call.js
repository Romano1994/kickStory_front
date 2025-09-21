import axios from "axios";
import auth from "../../../auth";
// import { commSwitch } from "@/js/comm-switch";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = process.env.VUE_APP_API_BASE_URL;
axios.defaults.paramsSerializer = function(paramObj) {
  if (!paramObj || typeof paramObj !== 'object') {
    return '';
  }
  
  const params = new URLSearchParams();
  
  for (const key in paramObj) {
    if (Object.prototype.hasOwnProperty.call(paramObj, key)) {
      const value = paramObj[key];
      
      // null, undefined 값은 제외
      if (value === null || value === undefined) {
        continue;
      }
      
      // 키 이름 검증 (알파벳, 숫자, 언더스코어, 하이픈만 허용)
      if (!/^[a-zA-Z0-9_-]+$/.test(key)) {
        console.warn('Invalid parameter key filtered out:', key);
        continue;
      }
      
      // 배열인 경우 각 요소를 개별적으로 추가
      if (Array.isArray(value)) {
        value.forEach(item => {
          if (item !== null && item !== undefined) {
            params.append(key, String(item));
          }
        });
      } else {
        // 문자열로 변환하여 추가 (URLSearchParams가 자동으로 인코딩)
        params.append(key, String(value));
      }
    }
  }
  
  return params.toString();
}

// 인증 토큰을 안전하게 가져오는 함수
function getAuthToken() {
  try {
    const access = sessionStorage.getItem(auth.accessName);
    
    // 토큰 유효성 검증
    if (!access || typeof access !== 'string') {
      return null;
    }
    
    // 토큰 길이 검증 (JWT는 보통 100자 이상)
    if (access.length < 10) {
      console.warn('Invalid token length');
      return null;
    }
    
    // 위험한 문자 패턴 검증
    const dangerousPatterns = [
      /<script/i,
      /javascript:/i,
      /onload/i,
      /onerror/i,
      /eval/i,
      /function/i
    ];
    
    for (const pattern of dangerousPatterns) {
      if (pattern.test(access)) {
        console.warn('Dangerous token pattern detected');
        return null;
      }
    }
    
    return access;
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
}

// 토큰을 동적으로 설정하는 함수
function setAuthHeader() {
  const token = getAuthToken();
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
}

// 초기 토큰 설정
setAuthHeader();

// Global loading state management
let loadingCount = 0;
let globalLoadingComponent = null;

function setGlobalLoadingComponent(component) {
  globalLoadingComponent = component;
}

function showLoading() {
  loadingCount++;
  if (globalLoadingComponent) {
    globalLoadingComponent.show();
  }
}

function hideLoading() {
  loadingCount--;
  if (loadingCount <= 0) {
    loadingCount = 0;
    if (globalLoadingComponent) {
      globalLoadingComponent.hide();
    }
  }
}

function response(data,sucFunc){
  hideLoading();
  sucFunc(data);

  // const page_location = window.location.origin + url;
  // window.gtag('event', 'api_call', {
  //   url: url,
  //   page_location: page_location,
  // });
}

function onFail(error,failFunc){
  hideLoading();
  // const page_location = window.location.origin + url;
  // window.gtag('event', 'api_call', {
  //   url: url,
  //   page_location: page_location,
  // });

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
    showLoading();
    setAuthHeader(); // 매 요청마다 토큰 재검증
    let param=null;
    if(params!=null)param={params};
    // commSwitch.on('LoadingBar'); 
    axios.get(url,param)
    .then((data)=>response(data,success,url))
    .catch((error)=>onFail(error,fail,url));
  },
  post:async function postApi(url,param,success,fail){
    showLoading();
    setAuthHeader(); // 매 요청마다 토큰 재검증
    // commSwitch.on('LoadingBar');

    axios.post(url,param)
      .then((data)=>response(data,success,url))
      .catch((error)=>onFail(error,fail,url));

  },
  put:async function putApi(url,param,success,fail){
    showLoading();
    setAuthHeader(); // 매 요청마다 토큰 재검증
    // commSwitch.on('LoadingBar');

    axios.put(url,param)
      .then((data)=>response(data,success,url))
      .catch((error)=>onFail(error,fail,url));

  },
  patch:async function patchApi(url,param,success,fail){
    showLoading();
    setAuthHeader(); // 매 요청마다 토큰 재검증
    // commSwitch.on('LoadingBar');

    axios.patch(url,param)
      .then((data)=>response(data,success,url))
      .catch((error)=>onFail(error,fail,url));

  },
  delete:async function deleteApi(url,params,success,fail){
    showLoading();
    setAuthHeader(); // 매 요청마다 토큰 재검증
    let param={params}; 

    // commSwitch.on('LoadingBar');
    axios.delete(url,param)
      .then((data)=>response(data,success,url))
      .catch((error)=>onFail(error,fail,url));

  },
  setGlobalLoadingComponent
}

