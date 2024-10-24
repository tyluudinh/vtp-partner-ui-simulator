import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import authService from '../services/authService';
import StoreService from '../services/storeService';

const CallbackPage = () => {
  const [searchParams] = useSearchParams();
  const [authorizationCode, setAuthorizationCode] = useState('');
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [configs, setConfigs] = useState({});


  useEffect(() => {
    // Lấy mã authorization code từ URL
    const code = searchParams.get('code');

    if (code) {
      // Cập nhật authorization code để hiển thị ra giao diện
      setAuthorizationCode(code);
    }
  }, [searchParams]);

  useEffect(() => {
    const storeConfig = StoreService.getStore();

    if (storeConfig) {
      setConfigs(storeConfig);
    }

  }, [])

  useEffect(() => {
    if (authorizationCode && configs.vietcapApiUrl) {
      const token = async () => {
        try {
          const tokenResponse = await authService.generateTokenWithCode(authorizationCode, configs.vietcapApiUrl);
          setToken(tokenResponse);
          console.log('Token:', JSON.stringify(tokenResponse));
        } catch (err) {
          console.error('Error generating token:', err);
          setError(err.response.data.message);
        } finally {
          setLoading(false);
        }
      }
      token();
    }
  }, [authorizationCode, configs.vietcapApiUrl]);

  return (
    <div>
      <h1>OAuth Callback</h1>
      {authorizationCode ? (
        <p>Authorization Code: <strong>{authorizationCode}</strong></p>
      ) : (
        <p>No authorization code found.</p>
      )}
      {loading && <p>Loading...</p>}

      {token && (
        <div>
          <p>Token: <strong>{token.data.accessToken}</strong></p>
          <p>RefreshToken: <strong>{token.data.refreshToken}</strong></p>
          <p>ExpiresIn: <strong>{token.data.expiresIn}</strong></p>
          <p>efreshExpiresIn: <strong>{token.data.refreshExpiresIn}</strong></p>

        </div>
      )}

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>

  );
};

export default CallbackPage;