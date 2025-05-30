# KYC Verification

The KYC verification process is implemented in [`app/(modals)/kyc.tsx`](app/(modals)/kyc.tsx) - KYC verification and status monitoring

### Step 1: KYC Initiation

When the user starts the KYC process, the app:

1. Initiates Kyc verification using the `/v0/grid/smart-accounts/<SMART_ACCOUNT_ADDRESS>/kyc`. This will return two links one for accepting bridge's terms and conditions and one for doing the KYC. The app renders both in a [`WebView`](../components/ui/organisms/InAppBrowser.tsx)
2. The Kyc status is checked using the `/v0/grid/smart-accounts/<SMART_ACCOUNT_ADDRESS>/kyc/<KYC_ID>` endpoint. For this you might want to save the kyc id. 
3. To be able to create a virtual account and do fiat transfers the user has to do both, accept bridges terms of services and do the kyc.

