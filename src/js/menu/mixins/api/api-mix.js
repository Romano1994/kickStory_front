/**
 * API 호출을 위한 Vue Mixin
 * 
 * apicall을 굳이 만든 이유:
 * 여기서 함수,변수를 여러가지 만들어서 커스터마이징해도 되지만
 * mixins특성상 vue파일에 import되었을 때 충돌이 나서 제대로 작동하지 않을 수 있다.
 * 
 * @author KickStory Team
 * @version 1.1.0
 */

/**
 * URL이 유효한지 검증하는 함수
 * @param {string} url - 검증할 URL
 * @returns {boolean} 유효한 URL인지 여부
 */
function isValidUrl(url) {
  if (!url || typeof url !== 'string') {
    return false;
  }
  
  // URL 길이 제한 (보안상 이유)
  if (url.length > 2048) {
    console.warn('URL too long:', url.length);
    return false;
  }
  
  // 위험한 패턴 차단
  const dangerousPatterns = [
    /\.\./,           // 경로 조작 공격 (../)
    /\/\.\./,         // 경로 조작 공격 (/../)
    /%2e%2e/i,        // URL 인코딩된 경로 조작
    /%2f/i,           // URL 인코딩된 슬래시
    /<script/i,       // XSS 시도
    /javascript:/i,   // JavaScript 프로토콜
    /data:/i,         // Data 프로토콜
    /vbscript:/i,     // VBScript 프로토콜
    /onload/i,        // 이벤트 핸들러
    /onerror/i,       // 이벤트 핸들러
  ];
  
  for (const pattern of dangerousPatterns) {
    if (pattern.test(url)) {
      console.warn('Dangerous URL pattern detected:', url);
      return false;
    }
  }
  
  // 상대 경로는 허용, 절대 경로는 현재 도메인만 허용
  if (url.startsWith('http://') || url.startsWith('https://')) {
    try {
      const urlObj = new URL(url);
      const currentDomain = window.location.hostname;
      
      // 포트 번호 검증 (일반적인 포트만 허용)
      const allowedPorts = ['80', '443', '3000', '8080', '8000'];
      const port = urlObj.port || (urlObj.protocol === 'https:' ? '443' : '80');
      
      return urlObj.hostname === currentDomain && 
             (allowedPorts.includes(port) || !urlObj.port);
    } catch (e) {
      return false;
    }
  }
  
  // 상대 경로는 허용 (/, /api/ 등으로 시작)
  return url.startsWith('/') && !url.includes('..');
}

/**
 * 콜백 함수가 유효한지 검증하는 함수
 * @param {function} callback - 검증할 콜백 함수
 * @returns {boolean} 유효한 함수인지 여부
 */
function isValidCallback(callback) {
  return typeof callback === 'function';
}

/**
 * 파라미터 객체를 안전하게 검증하는 함수
 * @param {Object} params - 검증할 파라미터 객체
 * @returns {boolean} 유효한 파라미터인지 여부
 */
function isValidParams(params) {
  if (params === null || params === undefined) {
    return true; // null/undefined는 허용
  }
  
  if (typeof params !== 'object') {
    return false;
  }
  
  // 객체 깊이 제한 (중첩된 객체 공격 방지)
  const depth = getObjectDepth(params);
  if (depth > 5) {
    console.warn('Object too deeply nested:', depth);
    return false;
  }
  
  // 객체 크기 제한 (메모리 공격 방지)
  const size = JSON.stringify(params).length;
  if (size > 10000) { // 10KB 제한
    console.warn('Object too large:', size);
    return false;
  }
  
  return true;
}

/**
 * 객체의 깊이를 계산하는 함수
 * @param {Object} obj - 깊이를 계산할 객체
 * @returns {number} 객체의 깊이
 */
function getObjectDepth(obj) {
  if (typeof obj !== 'object' || obj === null) {
    return 0;
  }
  
  let depth = 0;
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const currentDepth = getObjectDepth(obj[key]) + 1;
      depth = Math.max(depth, currentDepth);
    }
  }
  
  return depth;
}

export default {
  methods: {
    /**
     * GET API 호출
     * @param {string} url - API 엔드포인트 URL
     * @param {Object} param - 쿼리 파라미터
     * @param {Function} success - 성공 콜백 함수
     * @param {Function} fail - 실패 콜백 함수
     */
    getApi(url, param, success, fail) {
      if (!isValidUrl(url)) {
        console.error('Invalid URL provided to getApi:', url);
        if (isValidCallback(fail)) {
          fail({ message: 'Invalid URL provided' });
        }
        return;
      }
      
      if (!isValidCallback(success) || !isValidCallback(fail)) {
        console.error('Invalid callback functions provided to getApi');
        return;
      }
      
      if (!isValidParams(param)) {
        console.error('Invalid parameters provided to getApi');
        if (isValidCallback(fail)) {
          fail({ message: 'Invalid parameters provided' });
        }
        return;
      }
      
      this.$apiCall.get(url, param, success, fail);
    },

    /**
     * POST API 호출
     * @param {string} url - API 엔드포인트 URL
     * @param {Object} param - 요청 본문 데이터
     * @param {Function} success - 성공 콜백 함수
     * @param {Function} fail - 실패 콜백 함수
     */
    postApi(url, param, success, fail) {
      if (!isValidUrl(url)) {
        console.error('Invalid URL provided to postApi:', url);
        if (isValidCallback(fail)) {
          fail({ message: 'Invalid URL provided' });
        }
        return;
      }
      
      if (!isValidCallback(success) || !isValidCallback(fail)) {
        console.error('Invalid callback functions provided to postApi');
        return;
      }
      
      if (!isValidParams(param)) {
        console.error('Invalid parameters provided to postApi');
        if (isValidCallback(fail)) {
          fail({ message: 'Invalid parameters provided' });
        }
        return;
      }
      
      this.$apiCall.post(url, param, success, fail);
    },

    /**
     * PUT API 호출
     * @param {string} url - API 엔드포인트 URL
     * @param {Object} param - 요청 본문 데이터
     * @param {Function} success - 성공 콜백 함수
     * @param {Function} fail - 실패 콜백 함수
     */
    putApi(url, param, success, fail) {
      if (!isValidUrl(url)) {
        console.error('Invalid URL provided to putApi:', url);
        if (isValidCallback(fail)) {
          fail({ message: 'Invalid URL provided' });
        }
        return;
      }
      
      if (!isValidCallback(success) || !isValidCallback(fail)) {
        console.error('Invalid callback functions provided to putApi');
        return;
      }
      
      if (!isValidParams(param)) {
        console.error('Invalid parameters provided to putApi');
        if (isValidCallback(fail)) {
          fail({ message: 'Invalid parameters provided' });
        }
        return;
      }
      
      this.$apiCall.put(url, param, success, fail);
    },

    /**
     * PATCH API 호출
     * @param {string} url - API 엔드포인트 URL
     * @param {Object} param - 요청 본문 데이터
     * @param {Function} success - 성공 콜백 함수
     * @param {Function} fail - 실패 콜백 함수
     */
    patchApi(url, param, success, fail) {
      if (!isValidUrl(url)) {
        console.error('Invalid URL provided to patchApi:', url);
        if (isValidCallback(fail)) {
          fail({ message: 'Invalid URL provided' });
        }
        return;
      }
      
      if (!isValidCallback(success) || !isValidCallback(fail)) {
        console.error('Invalid callback functions provided to patchApi');
        return;
      }
      
      if (!isValidParams(param)) {
        console.error('Invalid parameters provided to patchApi');
        if (isValidCallback(fail)) {
          fail({ message: 'Invalid parameters provided' });
        }
        return;
      }
      
      this.$apiCall.patch(url, param, success, fail);
    },

    /**
     * DELETE API 호출
     * @param {string} url - API 엔드포인트 URL
     * @param {Object} param - 쿼리 파라미터
     * @param {Function} success - 성공 콜백 함수
     * @param {Function} fail - 실패 콜백 함수
     */
    deleteApi(url, param, success, fail) {
      if (!isValidUrl(url)) {
        console.error('Invalid URL provided to deleteApi:', url);
        if (isValidCallback(fail)) {
          fail({ message: 'Invalid URL provided' });
        }
        return;
      }
      
      if (!isValidCallback(success) || !isValidCallback(fail)) {
        console.error('Invalid callback functions provided to deleteApi');
        return;
      }
      
      if (!isValidParams(param)) {
        console.error('Invalid parameters provided to deleteApi');
        if (isValidCallback(fail)) {
          fail({ message: 'Invalid parameters provided' });
        }
        return;
      }
      
      this.$apiCall.delete(url, param, success, fail);
    },

    /**
     * POST API 호출 (FormData 전송용)
     * @param {string} url - API 엔드포인트 URL
     * @param {FormData} param - FormData 객체
     * @param {Function} success - 성공 콜백 함수
     * @param {Function} fail - 실패 콜백 함수
     */
    postFApi(url, param, success, fail) {
      if (!isValidUrl(url)) {
        console.error('Invalid URL provided to postFApi:', url);
        if (isValidCallback(fail)) {
          fail({ message: 'Invalid URL provided' });
        }
        return;
      }
      
      if (!isValidCallback(success) || !isValidCallback(fail)) {
        console.error('Invalid callback functions provided to postFApi');
        return;
      }
      
      // FormData는 별도 검증 (isValidParams 적용하지 않음)
      if (!(param instanceof FormData) && !isValidParams(param)) {
        console.error('Invalid parameters provided to postFApi');
        if (isValidCallback(fail)) {
          fail({ message: 'Invalid parameters provided' });
        }
        return;
      }
      
      // FormData는 일반 POST로 전송
      this.$apiCall.post(url, param, success, fail);
    }
  }
}
