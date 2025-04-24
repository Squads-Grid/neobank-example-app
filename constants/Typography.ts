export const Size = {
    // Text sizes
    tiny: 12,       // Icon buttons, descriptions, info text
    small: 13,      // QR address, warning text
    regular: 14,    // Buttons, labels, text above fields, invalid code, transaction type
    medium: 16,     // Section headlines, subheadings, placeholders, retry text
    mediumLarge: 18,      // FaceID, success text, copy text
    large: 20,     // Modal headlines, header titles
    xlarge: 24,    // QR heading
    jumbo: 40,   // Confirm amount
    giant: 56,      // Balance, heading in onboarding
    xgiant: 65,      // Send balance
} as const;

export const Height = {
    // Line heights
    lineHeightTight: 1,
    lineHeightNormal: 1.2,
    lineHeightMedium: 1.3,
} as const;

export const Weight = {
    // Font weights
    regularWeight: '400',
    mediumWeight: '500',
    semiBoldWeight: '600',
    boldWeight: '700',
} as const;
