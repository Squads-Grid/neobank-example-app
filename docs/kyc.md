# KYC Verification

The KYC verification process is implemented in [`app/(modals)/kyc.tsx`](app/(modals)/kyc.tsx) using the [@sqds/grid SDK](https://www.npmjs.com/package/@sqds/grid).

### Step 1: KYC Initiation

When the user starts the KYC process, the app:

1. Initiates KYC verification using the Grid SDK's `requestKycLink()` method via [`app/api/kyc+api.ts`](../app/api/kyc+api.ts). This returns two links: one for accepting Bridge's terms and conditions and one for doing the KYC. The app renders both in a [`WebView`](../components/ui/organisms/InAppBrowser.tsx)
2. The KYC status is checked using the SDK's KYC status method via [`app/api/kyc-status+api.ts`](../app/api/kyc-status+api.ts). The KYC ID should be saved for status checking.
3. To be able to create a virtual account and do fiat transfers, the user must complete both: accept Bridge's terms of service and complete the KYC process.

### SDK Implementation

The backend API routes use the Grid SDK:

```typescript
import { SDKGridClient } from '../../grid/sdkClient';

const gridClient = SDKGridClient.getInstance();
const response = await gridClient.requestKycLink(smartAccountAddress, kycRequest);
```

