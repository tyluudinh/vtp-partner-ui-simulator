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
            storeConfig.clientId || searchParams.get("client_id") || defaultConfigs.clientId;
        const clientSecret =
            storeConfig.clientSecret ||
            searchParams.get("client_secret") ||
            defaultConfigs.clientSecret;
        const partnerUserId =
            storeConfig.partnerUserId ||
            searchParams.get("partner_user_id") ||
            defaultConfigs.partnerUserId;
        const redirectUri =
            storeConfig.redirectUri ||
            searchParams.get("redirect_uri") ||
            defaultConfigs.redirectUri;
        const vietcapApiUrl =
            storeConfig.vietcapApiUrl ||
            searchParams.get("vietcap_api_url") ||
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
            const tokenVal = await authService.generateToken(
                configs.clientId,
                configs.clientSecret,
                configs.genPartnerTokenUrl
            );

            await authService.authorize(
                configs.clientId,
                configs.redirectUri,
                configs.partnerUserId,
                tokenVal,
                configs.linkAccountUrl
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
                    {loading && <span class="loader"></span>} Show Vietcap Login Page
                </button>
            </form>
        </div>
    );
};

export default PartnerSimulator;
