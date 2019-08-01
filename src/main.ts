import dotenv from "dotenv";
dotenv.config();
import axios from "axios";
import qs from "querystring";
import IVaultSecret from "./interfaces/IVaultSecret";

const loginAPI = "https://login.microsoftonline.com/194ecc53-6dbc-40fd-b886-b21ea1fa30f0/oauth2/v2.0/token";
const vaultAPI = "https://ltr-prod-keyvault.vault.azure.net/secrets";
const scope = "https://vault.azure.net/.default";
const grantType = "client_credentials";
const apiVersion = "2016-10-01";

class Vault {
  private clientID: string;
  private clientSecret: string;
  private accessToken: string;

  constructor(_clientID: string, _clientSecret: string) {
    this.clientID = _clientID;
    this.clientSecret = _clientSecret;
  }

  public getAccessToken(): Promise<void> {
    const requestBody = {
      grant_type: grantType,
      client_id: this.clientID,
      client_secret: this.clientSecret,
      scope
    };
    return axios
      .post(loginAPI, qs.stringify(requestBody))
      .then(response => {
        this.accessToken = response.data.access_token;
        return;
      })
      .catch(err => {
        return Promise.reject(err);
      });
  }

  public getSecretFromVault(secret: string): Promise<string> {
    return axios
      .get(`${vaultAPI}/${secret}`, {
        headers: { Authorization: `Bearer ${this.accessToken}` },
        params: { "api-version": apiVersion }
      })
      .then(response => {
        return response.data.value;
      })
      .catch(err => {
        return Promise.reject(err);
      });
  }

  public setSecretInVault(secretObj: IVaultSecret): Promise<void> {
    return axios
      .put(
        `${vaultAPI}/${secretObj.name}`,
        { contentType: "string", value: secretObj.value },
        {
          headers: { Authorization: `Bearer ${this.accessToken}`, "Content-Type": "application/json" },
          params: { "api-version": apiVersion }
        }
      )
      .then(() => {
        return;
      })
      .catch(err => {
        return Promise.reject(err);
      });
  }
}

const myClientID = process.env.CLIENT_ID;
const myClientSecret = process.env.CLIENT_SECRET;
const exampleSecret = "myTestKey";

const myVault = new Vault(myClientID, myClientSecret);

myVault
  .getAccessToken()
  .then(() => {
    return myVault.getSecretFromVault(exampleSecret);
  })
  .then(res => {
    console.log(res);
    return myVault.setSecretInVault({ name: exampleSecret, value: `${res} ${res}` });
  })
  .then(() => {
    return myVault.getSecretFromVault(exampleSecret);
  })
  .then(res => {
    console.log(res);
  })
  .catch(err => {
    console.log(err);
  });
