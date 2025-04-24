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

export const LineHeight = {
    // Line heights
    lineHeightTight: 1.15,    // For headlines and large text
    lineHeightNormal: 1.4,    // For regular text
    lineHeightRelaxed: 1.6,   // For descriptions
} as const;

export const FontWeight = {
    // Font weights
    regularWeight: '400',
    mediumWeight: '500',
    semiBoldWeight: '600',
    boldWeight: '700',
} as const;
