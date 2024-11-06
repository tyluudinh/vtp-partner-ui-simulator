/* eslint-disable import/no-anonymous-default-export */
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

  const headers = new Headers();

  headers.append('Accept', 'application/json'); // This one is enough for GET requests
  headers.append('Content-Type', 'application/json'); // This one sends body

  const genPartnerTokenUrl = `${vietcapApiUrl}/p/oauth2/token`;

  const response = await fetch(genPartnerTokenUrl, {
    method: "POST",
    headers: headers,
    body,
  });

  const data = await response.json();
  return data.accessToken;
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

  const response = await fetch(linkAccountUrl, {
    method: "GET",
    mode: "no-cors",
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

  if (response.status === 200) {
    const responseUrl = response.url;
    if (responseUrl) {
      window.location.href = responseUrl;
    }
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

const generateTokenWithCode = async (code, vietcapApiUrl = VIETCAP_API_URL) => {
  const body = JSON.stringify({
    code: code,
  });

  const genCodeUrl = `${vietcapApiUrl}/u/oauth2/token`;

  const response = await fetch(genCodeUrl, {
    method: "POST",
    mode: "no-cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: body,
  });

  return response.json();
};

export default {
  generateToken,
  authorize,
  generateState,
  generateTokenWithCode,
};
