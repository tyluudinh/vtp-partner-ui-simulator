/* eslint-disable import/no-anonymous-default-export */
import axios from "axios";
;
const CLIENT_ID = "timo";
const CLIENT_SECRET = "2yz7zaeM43OcOockV2mYTpR5YS12KMer";
const VIETCAP_API_URL = "http://localhost:8000/timo/v1";


const generateToken = async (
  clientId = CLIENT_ID,
  clientSecret = CLIENT_SECRET,
  vietcapApiUrl = VIETCAP_API_URL
) => {
  const body = JSON.stringify({
    clientId,
    clientSecret,
  });

  const genPartnerTokenUrl = `${vietcapApiUrl}/p/oauth2/token`;
  
  const response = await axios.post(`${genPartnerTokenUrl}`, body, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response.data.accessToken;
};

// Hàm gửi yêu cầu đăng nhập
const authorize = async (
  clientId,
  redirectUri,
  partnerUserId,
  partnerToken,
  vietcapApiUrl = VIETCAP_API_URL
) => {

  const linkAccountUrl = `${vietcapApiUrl}/p/link-account`;

  const response = await axios.get(`${linkAccountUrl}`, {
    headers: {
      Authorization: `Bearer ${partnerToken}`,
    },
    params: {
      partner_user_id: partnerUserId,
      client_id: clientId,
      partner_redirect_uri: redirectUri,
      state: "",
    },
  });
  // console.log(response);
  if (response.status === 200 && response.request.responseURL) {
    window.location.href = response.request.responseURL;
  }
  return response; // Trả về dữ liệu từ API
};

const generateState = () => {
  const validChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let array = new Uint8Array(40);
  window.crypto.getRandomValues(array);
  array = array.map((x) => validChars.codePointAt(x % validChars.length));
  const randomState = String.fromCharCode.apply(null, array);
  return randomState;
};

const generateTokenWithCode = (code,vietcapApiUrl = VIETCAP_API_URL) => {
  const body = JSON.stringify({
    code: code,
  });

  const genCodeUrl = `${vietcapApiUrl}/u/oauth2/token`;

  const response = axios.post(`${genCodeUrl}`, body, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response;
};

export default {
  generateToken,
  authorize,
  generateState,
  generateTokenWithCode,
};
