import {setCookie, getCookie, removeCookie} from "../util/cookie"
export const LoginAPI = async (LoginForm) => {
  const axios = require('axios');
  const host = 'http://grk-backend.medical-lab.co.kr/'
  try {
    const response = await axios.post(host+'/api/v1/token/', LoginForm, {
      withCredentials: true,
    });
    const jwtToken = response.data;
    setCookie('accessJwtToken', jwtToken); // 쿠키에 토큰 저장
    const decodedUserInfo = jwt_decode(jwtToken); // 토큰 decode
    localStorage.setItem('userInfo', JSON.stringify(decodedUserInfo)); //토큰에 저장되어있는 userInfo 저장
    return response;
  } catch {
    alert('로그인이 실패했습니다. 정보가 올바른지 다시 확인해주세요');
  }
};
