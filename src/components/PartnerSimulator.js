import React, { useEffect, useState } from "react";
import authService from "../services/authService";
import FormInput from "./FormInput";
import StoreService from "../services/storeService";

const defaultConfigs = {
    clientId: "timo",
    clientSecret: "timo-secret",
    partnerUserId: "timo-user-01",
    redirectUri: "http://localhost:3000/callback",

    vietcapApiUrl: "http://localhost:8000/timo/v1",
};

const PartnerSimulator = () => {
    const [configs, setConfigs] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);

        const storeConfig = StoreService.getStore();

        const clientId =
            searchParams.get("client_id") ||
            storeConfig.clientId || defaultConfigs.clientId;
            
        const clientSecret =
            searchParams.get("client_secret") ||
            storeConfig.clientSecret ||
            defaultConfigs.clientSecret;
            
        const partnerUserId =
            searchParams.get("partner_user_id") ||
            storeConfig.partnerUserId ||
            defaultConfigs.partnerUserId;

        const redirectUri =
            searchParams.get("redirect_uri") ||
            storeConfig.redirectUri ||
            defaultConfigs.redirectUri;

        const vietcapApiUrl =
            searchParams.get("vietcap_api_url") ||
            storeConfig.vietcapApiUrl ||
            defaultConfigs.vietcapApiUrl;

        setConfigs({
            clientId,
            clientSecret,
            partnerUserId,
            redirectUri,
            vietcapApiUrl
        });
    }, []);

    const onChangeInput = (change) => {
        const afterChange = {
            ...configs,
            ...change,
        };
        setConfigs(afterChange);

        StoreService.setStore(afterChange);
    };

    const showLoginPage = async (e) => {
        e.preventDefault();
        if (loading) return;
        setLoading(true);
        try {
            StoreService.setStore(configs);
            const tokenVal = await authService.generateToken(
                configs.clientId,
                configs.clientSecret,
                configs.vietcapApiUrl
            );

            await authService.authorize(
                configs.clientId,
                configs.redirectUri,
                configs.partnerUserId,
                tokenVal,
                configs.vietcapApiUrl
            );

            // navigate('/oauth/callback', {replace: true});
        } catch (error) {
            console.error("Error: " + error);
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            style={{
                maxWidth: "414px",
                margin: "20px auto",
                padding: "20px",
                border: "1px solid #ccc",
                borderRadius: "10px",
            }}
        >
            <h2>VTP Integration</h2>
            <pre>
                If you get CORS issue, let follow the link:{" "}
                <a
                    href="https://stackoverflow.com/questions/3102819/disable-same-origin-policy-in-chrome"
                    target="_blank"
                    rel="noreferrer"
                >
                    🌐
                </a>
            </pre>
            <form onSubmit={showLoginPage}>
                <FormInput
                    label="Client ID"
                    value={configs.clientId}
                    name="clientId"
                    onChange={onChangeInput}
                />
                <FormInput
                    label="Client Secret"
                    value={configs.clientSecret}
                    name="clientSecret"
                    onChange={onChangeInput}
                />
                <FormInput
                    label="Partner User ID"
                    value={configs.partnerUserId}
                    name="partnerUserId"
                    onChange={onChangeInput}
                />
                <FormInput
                    label="Redirect URL"
                    value={configs.redirectUri}
                    name="redirectUri"
                    onChange={onChangeInput}
                />
                <FormInput
                    label="Vietcap Api URL"
                    value={configs.vietcapApiUrl}
                    name="vietcapApiUrl"
                    onChange={onChangeInput}
                />

                <button type="submit">
                    {loading && <span className="loader"></span>} Show Vietcap Login Page
                </button>
            </form>
        </div>
    );
};

export default PartnerSimulator;
