import type { Field } from "payload";

import { linkGroup } from "@/fields/linkGroup";

/**
 * Shared field core for the Pricing component family.
 *
 * Pricing variants should stay focused on presentation content. Billing,
 * checkout, entitlement, and customer-portal behavior belongs in the project
 * that installs the block, not in this marketing section.
 */
export const pricingFields: Field[] = [
  {
    name: "eyebrow",
    type: "text",
  },
  {
    name: "title",
    type: "text",
    required: true,
  },
  {
    name: "description",
    type: "textarea",
  },
  {
    name: "plans",
    type: "array",
    required: true,
    minRows: 2,
    maxRows: 4,
    admin: {
      initCollapsed: true,
    },
    fields: [
      {
        name: "name",
        type: "text",
        required: true,
      },
      {
        name: "description",
        type: "textarea",
      },
      {
        name: "price",
        type: "text",
        required: true,
      },
      {
        name: "billingNote",
        type: "text",
      },
      {
        name: "highlighted",
        type: "checkbox",
        defaultValue: false,
        admin: {
          description: "Visually emphasize this plan as the recommended tier.",
        },
      },
      {
        name: "features",
        type: "array",
        required: true,
        minRows: 2,
        maxRows: 8,
        admin: {
          initCollapsed: true,
        },
        fields: [
          {
            name: "text",
            type: "text",
            required: true,
          },
        ],
      },
      linkGroup({
        overrides: {
          admin: {
            initCollapsed: true,
          },
          maxRows: 1,
        },
      }),
    ],
  },
];
