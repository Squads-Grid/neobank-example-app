import { z } from 'zod/v4';

export const PersonalInformation = z.object({
    first_name: z.string().min(2, "First name is required"),
    last_name: z.string().min(2, "Last name is required"),
});

export const Address = z.object({
    street_number: z.string()
        .min(1, "Street number is required")
        .transform((val) => Number(val))
        .refine((val) => !isNaN(val) && val > 0, "Invalid street number"),
    street_name: z.string().min(1, "Street name is required"),
    street_line_2: z.string().optional(),
    city: z.string().min(1, "City is required"),
    state: z.string().min(2, "State is required").max(2, "State must be 2 characters"),
    postal_code: z.string().regex(/^\d{5}(-\d{4})?$/, "Invalid postal code format").optional(),
    country: z.string().min(2, "Country is required").max(3, "Country must be 3 characters")
});

export const AccountLabel = z.object({
    label: z.string().min(1, "Label is required").max(20, "Label must be less than 15 characters"),
});

export const ACHBankAccount = z.object({
    account_number: z.string()
        .min(4, "Account number must be at least 4 digits")
        .max(17, "Account number must be at most 17 digits")
        .regex(/^\d+$/, "Account number must contain only digits"),
    routing_number: z.string()
        .length(9, "Routing number must be exactly 9 digits")
        .regex(/^\d+$/, "Routing number must contain only digits"),
    bank_name: z.string().min(1, "Bank name is required"),
});

export type AddressInput = z.input<typeof Address>;
export type ACHBankAccountInput = z.input<typeof ACHBankAccount>;
export type PersonalInformationInput = z.input<typeof PersonalInformation>;

// export type ExternalAccountInput = {
//     personal_information: PersonalInformation;
//     address: AddressInput;
//     bank_account: ACHBankAccountInput;
// }